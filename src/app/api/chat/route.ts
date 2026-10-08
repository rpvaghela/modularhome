import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getCustomerSession } from "@/lib/customerAuth";
import { getCustomerByEmail } from "@/lib/customerStore";
import { saveLead } from "@/lib/leadsStore";
import { sendAIChatLeadNotification, UserAccountContext } from "@/lib/email";
import { getPublicProducts, getPublicFloorPlans } from "@/lib/publicData";
import { calculateQuotation } from "@/lib/pricingEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, userContext: clientUserContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: "Messages array is required." } },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const conversationHistory = messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

    // Extract potential contact info from user messages
    const emailMatch = conversationHistory.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = conversationHistory.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const budgetMatch = conversationHistory.match(/\$?\s*(\d{2,3}(?:,\d{3})+|\d{2,6})\s*(?:k|thousand|budget|dollars)?/i);

    let extractedEmail = emailMatch ? emailMatch[1].toLowerCase().trim() : null;
    let extractedPhone = phoneMatch ? phoneMatch[0].trim() : null;

    // Check customer session context
    let userContext: UserAccountContext = {
      userId: null,
      accountEmail: null,
      accountName: null,
      isAuthenticated: false,
    };

    try {
      const session = await getCustomerSession();
      if (session) {
        userContext = {
          userId: session.id,
          accountEmail: session.email,
          accountName: session.name,
          isAuthenticated: true,
        };
        if (!extractedEmail) extractedEmail = session.email;
      } else if (extractedEmail) {
        const existing = await getCustomerByEmail(extractedEmail);
        if (existing) {
          userContext = {
            userId: existing.id,
            accountEmail: existing.email,
            accountName: existing.name,
            isAuthenticated: false,
          };
        }
      }
    } catch {}

    // Determine project category
    const projectType = lastUserMessage.toLowerCase().includes("barndo")
      ? "Barndominiums"
      : lastUserMessage.toLowerCase().includes("cabin")
      ? "Cabins & A-Frames"
      : lastUserMessage.toLowerCase().includes("adu") || lastUserMessage.toLowerCase().includes("tiny")
      ? "ADUs & Tiny Homes"
      : lastUserMessage.toLowerCase().includes("commercial")
      ? "Commercial Buildings"
      : "Modular & Prefab Homes";

    // 1. Fetch live catalog products and floor plans for verified grounding
    const [allProducts, allFloorPlans] = await Promise.all([
      getPublicProducts(),
      getPublicFloorPlans(),
    ]);

    // 2. Extract structured customer requirements
    const lowerHistory = conversationHistory.toLowerCase();
    const sqftMatch = lastUserMessage.match(/(\d{3,4})\s*(?:sqft|sq\s*ft|square\s*feet)?/i) || conversationHistory.match(/(\d{3,4})\s*(?:sqft|sq\s*ft|square\s*feet)?/i);
    const bedMatch = lastUserMessage.match(/(\d)\s*(?:bed|bedroom|br)/i) || conversationHistory.match(/(\d)\s*(?:bed|bedroom|br)/i);
    const bathMatch = lastUserMessage.match(/(\d(?:\.5)?)\s*(?:bath|bathroom|ba)/i) || conversationHistory.match(/(\d(?:\.5)?)\s*(?:bath|bathroom|ba)/i);

    const targetSqft = sqftMatch ? Math.min(8000, Math.max(300, parseInt(sqftMatch[1], 10))) : null;
    const targetBedrooms = bedMatch ? parseInt(bedMatch[1], 10) : null;
    const targetBathrooms = bathMatch ? parseFloat(bathMatch[1]) : null;

    // Detect target category
    const targetCategory = lowerHistory.includes("barndo") || lowerHistory.includes("barndominium")
      ? "Barndominiums"
      : lowerHistory.includes("cabin") || lowerHistory.includes("a-frame")
      ? "Cabins"
      : lowerHistory.includes("adu") || lowerHistory.includes("tiny") || lowerHistory.includes("pod")
      ? "ADUs & Tiny Homes"
      : lowerHistory.includes("commercial") || lowerHistory.includes("shop") || lowerHistory.includes("warehouse")
      ? "Commercial"
      : "Modular Homes";

    // Detect selected upgrades
    const detectedUpgrades: string[] = [];
    if (lowerHistory.includes("deck") || lowerHistory.includes("porch")) detectedUpgrades.push("timber deck");
    if (lowerHistory.includes("insulation") || lowerHistory.includes("thermal") || lowerHistory.includes("r-38")) detectedUpgrades.push("closed-cell insulation");
    if (lowerHistory.includes("glass") || lowerHistory.includes("panoramic") || lowerHistory.includes("sliding")) detectedUpgrades.push("panoramic glass wall");
    if (lowerHistory.includes("solar")) detectedUpgrades.push("solar ready");
    if (lowerHistory.includes("window") || lowerHistory.includes("triple pane")) detectedUpgrades.push("triple-pane windows");

    // 3. Product Matching Algorithm (Grounding in verified catalog only)
    const scoredProducts = allProducts.map((p) => {
      let score = 0;
      const pNameLower = p.name.toLowerCase();
      const pCatLower = (p.category || "").toLowerCase();

      // Direct name match
      if (lowerHistory.includes(pNameLower) || (p.slug && lowerHistory.includes(p.slug.toLowerCase()))) {
        score += 100;
      }

      // Category match
      if (pCatLower.includes(targetCategory.toLowerCase()) || targetCategory.toLowerCase().includes(pCatLower)) {
        score += 25;
      }

      // Sqft proximity
      if (targetSqft && p.sqft) {
        const diff = Math.abs(p.sqft - targetSqft);
        if (diff <= 150) score += 30;
        else if (diff <= 400) score += 20;
        else if (diff <= 800) score += 10;
      }

      // Bedrooms match
      if (targetBedrooms && p.bedrooms) {
        if (p.bedrooms === targetBedrooms) score += 20;
        else if (Math.abs(p.bedrooms - targetBedrooms) === 1) score += 5;
      }

      // Bathrooms match
      if (targetBathrooms && p.bathrooms) {
        if (p.bathrooms === targetBathrooms) score += 10;
      }

      return { product: p, score };
    });

    scoredProducts.sort((a, b) => b.score - a.score);
    const matchedProducts = scoredProducts.slice(0, 4).map((sp) => sp.product);

    // Matching Floor Plans
    const matchedFloorPlans = allFloorPlans
      .filter((fp) => {
        if (targetSqft && fp.squareFeet) {
          return Math.abs(fp.squareFeet - targetSqft) < 600;
        }
        return true;
      })
      .slice(0, 3);

    // 4. Server-Side Pricing Engine Execution
    const calculationSqft = targetSqft || (matchedProducts[0]?.sqft ? Number(matchedProducts[0].sqft) : 1400);
    const quoteCalculation = await calculateQuotation({
      sqft: calculationSqft,
      modelType: targetCategory,
      modelName: matchedProducts[0]?.name || "Modular Home Package",
      selectedUpgrades: detectedUpgrades,
      finishLevel: lowerHistory.includes("turnkey") || lowerHistory.includes("finished") ? "PREMIUM_TURNKEY" : "STANDARD",
    });

    // Check if this message provides lead qualification info
    let leadCreated = false;
    let createdLeadId: string | null = null;

    if (extractedEmail) {
      try {
        const leadId = `lead_chat_${Date.now()}`;
        const leadName = clientUserContext?.name || userContext.accountName || "AI Chat Prospect";

        // Save to local custom leads store
        try {
          saveLead({
            id: leadId,
            name: leadName,
            email: extractedEmail,
            phone: extractedPhone || undefined,
            project_type: targetCategory,
            budget: budgetMatch ? budgetMatch[0] : undefined,
            requirements: lastUserMessage,
            enquiry_details: `Qualified via AI Housing Advisor: ${lastUserMessage}`,
            source: "AI_BUILD_ASSISTANT",
            status: "QUALIFIED",
            notes: `Conversation Transcript Summary:\n${conversationHistory.slice(-500)}`,
          });
          leadCreated = true;
          createdLeadId = leadId;
        } catch {}

        if (isSupabaseConfigured()) {
          try {
            const { data } = await supabaseAdmin.from("leads").insert({
              id: leadId,
              name: leadName,
              email: extractedEmail,
              phone: extractedPhone,
              project_type: targetCategory,
              enquiry_details: `Qualified via AI Housing Advisor: ${lastUserMessage}`,
              source: "AI_BUILD_ASSISTANT",
              status: "QUALIFIED",
              notes: `Conversation Transcript Summary:\n${conversationHistory.slice(-500)}`,
            }).select("id").single();

            if (data) {
              leadCreated = true;
              createdLeadId = data.id;
            }
          } catch {}
        }

        // Dispatch admin email notification for qualified chat lead
        if (leadCreated) {
          try {
            await sendAIChatLeadNotification({
              leadId: createdLeadId || leadId,
              name: leadName,
              email: extractedEmail,
              phone: extractedPhone,
              projectPreferences: targetCategory,
              budget: budgetMatch ? budgetMatch[0] : null,
              dimensions: `${calculationSqft} sq ft`,
              aiRecommendations: `Suggested: ${matchedProducts.map(p => p.name).join(", ")} | Estimated Total: $${quoteCalculation.estimatedTotal.toLocaleString()}`,
              conversationTranscript: conversationHistory.slice(-800),
              submissionDate: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
              userContext,
            });
          } catch (emailErr: any) {
            console.warn("[Admin Notification]: FAILED for AI chat leadId=", createdLeadId);
          }
        }
      } catch (leadSaveErr) {
        console.warn("AI Chat lead capture note:", leadSaveErr);
      }
    }

    // 5. OpenAI API Call with Strict Catalog & Pricing Engine Grounding
    if (process.env.OPENAI_API_KEY) {
      try {
        const verifiedCatalogContext = matchedProducts.map((p) => {
          const price = p.startingPrice ? `$${p.startingPrice.toLocaleString()}` : "Custom Quote";
          return `- **${p.name}** (${p.category}): ${p.sqft} sqft, ${p.bedrooms || 0} Bed / ${p.bathrooms || 0} Bath. Starting Price: ${price}. Link: [/buildings/${p.slug}](/buildings/${p.slug})`;
        }).join("\n");

        const verifiedFloorPlansContext = matchedFloorPlans.map((fp) => {
          const pStr = fp.salePrice ? `$${fp.salePrice}` : `$${fp.price}`;
          return `- **${fp.title}** (${fp.category}): ${fp.squareFeet} sqft. Architectural CAD+PDF Kit: ${pStr}. Link: [/floor-plans/${fp.slug}](/floor-plans/${fp.slug})`;
        }).join("\n");

        const pricingEngineSummary = `
- Calculation Area: ${quoteCalculation.sqft} sq ft (${quoteCalculation.modelType})
- Base Framing / Component Package: $${quoteCalculation.basePrice.toLocaleString()}
- SqFt Construction Rate: $${quoteCalculation.sqftRateAmount.toLocaleString()}
- Selected Upgrades Total: $${quoteCalculation.upgradesTotal.toLocaleString()}
- Engineering & Logistics Allocation: $${quoteCalculation.feesTotal.toLocaleString()}
- **Authoritative Estimated Total**: $${quoteCalculation.estimatedTotal.toLocaleString()}
- Disclaimer: ${quoteCalculation.disclaimer}`;

        const systemPrompt = `You are the expert Architectural Housing Advisor & Quotation Consultant for ModularHome.com.
You assist homebuyers and developers by answering questions, recommending real models from our catalog, and presenting accurate project quotations.

### MANDATORY DATA GROUNDING RULES:
1. **AUTHORITATIVE SOURCE OF TRUTH**: The Verified Products and Pricing Engine results below are authoritative. NEVER invent product names, prices, square footages, warranties, or options.
2. **VERIFIED PRODUCTS IN CATALOG**:
${verifiedCatalogContext || "- Please explore our full catalog at /buildings."}

3. **VERIFIED ARCHITECTURAL BLUEPRINTS**:
${verifiedFloorPlansContext || "- Complete CAD and PDF drawing sets available at /floor-plans."}

4. **CALCULATED SERVER-SIDE QUOTATION**:
${pricingEngineSummary}

5. **PRICING DISCLOSURE & GUIDELINES**:
- If the customer asks for a quote, cost estimate, or budget recommendation, ALWAYS present the exact numbers from the Server-Side Pricing Engine above.
- Clearly label quotations as "Estimated Quote" with the note: "${quoteCalculation.disclaimer}".
- If a customer asks for an unknown model or unsupported feature with no verified price, say: "I don't have verified pricing for that option yet, but our architectural engineering team can provide a custom quote."
- Suggest next steps such as launching the interactive Quote Wizard at [/quote](/quote) or uploading plans at [/upload-floor-plan](/upload-floor-plan).
- Use clean, professional markdown formatting with bullet points and bold headers.`;

        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              ...messages.map((m: any) => ({ role: m.role, content: m.content })),
            ],
            temperature: 0.6,
            max_tokens: 650,
          }),
        });

        if (openAiRes.ok) {
          const aiJson = await openAiRes.json();
          const replyText = aiJson.choices[0]?.message?.content || "";

          const actionButtons = [
            { label: "Launch Instant Quote Wizard →", href: `/quote?sqft=${calculationSqft}` },
            { label: "Explore Floor Plans", href: "/floor-plans" },
            { label: "Upload Custom Floor Plan", href: "/upload-floor-plan" },
          ];

          return NextResponse.json({
            success: true,
            reply: replyText,
            leadCaptured: leadCreated,
            leadId: createdLeadId,
            actionButtons,
          });
        }
      } catch (aiErr) {
        console.warn("OpenAI API call note, falling back to deterministic engine:", aiErr);
      }
    }

    // 6. Deterministic Fallback Engine (Runs when OpenAI is not configured or fails)
    const q = lastUserMessage.toLowerCase();
    let reply = "";
    let actionButtons: any[] = [];

    const isQuoteQuery = q.includes("cost") || q.includes("price") || q.includes("quote") || q.includes("estimate") || q.includes("rate") || q.includes("sqft") || q.includes("sq ft") || q.includes("how much");

    if (isQuoteQuery) {
      const topProd = matchedProducts[0];
      const modelHeading = topProd ? `### Estimated Quotation: ${topProd.name} (${calculationSqft.toLocaleString()} Sq Ft)` : `### Estimated Project Quotation (${calculationSqft.toLocaleString()} Sq Ft)`;

      reply = `${modelHeading}\n\n` +
        `Here is an estimated price breakdown generated by our server-side pricing engine for **${quoteCalculation.modelType}**:\n\n` +
        `* **Base Precision Steel Component Package**: $${quoteCalculation.basePrice.toLocaleString()} USD\n` +
        `* **Living Area Construction & Framing**: $${quoteCalculation.sqftRateAmount.toLocaleString()} USD\n` +
        (quoteCalculation.upgradesTotal > 0 ? `* **Selected Upgrades / Thermal Enhancements**: $${quoteCalculation.upgradesTotal.toLocaleString()} USD\n` : "") +
        `* **Engineering & Logistical Allocation**: $${quoteCalculation.feesTotal.toLocaleString()} USD\n` +
        `* **Estimated Total**: **$${quoteCalculation.estimatedTotal.toLocaleString()} USD**\n\n` +
        `> **Engineering Standards:** 50-year structural warranty, up to 150 MPH wind rating, 50 PSF snow load, commercial-grade galvanized steel framing.\n\n` +
        `*Note: ${quoteCalculation.disclaimer}*`;

      actionButtons = [
        { label: `Customize Exact ${calculationSqft} Sq Ft Quote →`, href: `/quote?sqft=${calculationSqft}` },
        { label: "Explore Floor Plans & Blueprints", href: "/floor-plans" },
        { label: "Upload Custom Floor Plan", href: "/upload-floor-plan" },
      ];
    } else if (matchedProducts.length > 0) {
      const productLines = matchedProducts.map((p) => {
        const priceStr = p.startingPrice ? `Starting at $${p.startingPrice.toLocaleString()}` : "Custom Quote";
        return `* **[${p.name}](/buildings/${p.slug})** (${p.category}) — ${p.sqft} sq ft • ${p.bedrooms || 0} Bed / ${p.bathrooms || 0} Bath • ${priceStr}`;
      }).join("\n");

      reply = `### Matching Models in the ModularHome Catalog\n\n` +
        `Based on your project requirements, here are our recommended factory-built steel models:\n\n` +
        `${productLines}\n\n` +
        `Would you like me to prepare an estimated quotation or help you explore blueprints for one of these?`;

      actionButtons = [
        { label: "Launch Instant Quote Wizard", href: "/quote" },
        { label: "Browse All Models", href: "/buildings" },
        { label: "Explore Floor Plans", href: "/floor-plans" },
      ];
    } else if (leadCreated) {
      reply = `Thank you! I have registered your project requirements with our architectural engineering team. A dedicated housing specialist will reach out to **${extractedEmail}** with custom blueprints and pricing.`;
      actionButtons = [
        { label: "Calculate Instant Quote", href: "/quote" },
        { label: "Browse 3D Catalog", href: "/buildings" },
        { label: "Contact Us", href: "/contact" },
      ];
    } else {
      reply =
        "Welcome to **ModularHome.com**! We engineer and deliver factory-built precision steel modular homes, luxury barndominiums, and cabin kits nationwide.\n\n" +
        "I can help you with:\n" +
        "1. **Calculating instant project quotations & build cost estimates**\n" +
        "2. **Finding the right floor plan blueprints (CAD + PDF)**\n" +
        "3. **Answering engineering, permit, wind rating, and foundation questions**\n\n" +
        "What type of home or square footage are you envisioning?";

      actionButtons = [
        { label: "Estimate Build Cost →", href: "/quote" },
        { label: "Browse Floor Plans", href: "/floor-plans" },
        { label: "Explore Catalog Models", href: "/buildings" },
      ];
    }

    return NextResponse.json({
      success: true,
      reply,
      leadCaptured: leadCreated,
      leadId: createdLeadId,
      actionButtons,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to process chat." } },
      { status: 500 }
    );
  }
}
