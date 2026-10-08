import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getCustomerSession } from "@/lib/customerAuth";
import { getCustomerByEmail } from "@/lib/customerStore";
import { saveLead } from "@/lib/leadsStore";
import { sendAIChatLeadNotification, UserAccountContext } from "@/lib/email";
import { getPublicProducts, getPublicFloorPlans } from "@/lib/publicData";

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

    // 1. Fetch live catalog products and floor plans for AI knowledge injection
    const [allProducts, allFloorPlans] = await Promise.all([
      getPublicProducts(),
      getPublicFloorPlans(),
    ]);

    const topModelsSummary = allProducts.slice(0, 15).map((p) => {
      const priceStr = p.startingPrice ? `$${p.startingPrice.toLocaleString()}` : "Custom Quote";
      return `- **${p.name}** (${p.category}): ${p.sqft} sqft • ${p.bedrooms} Bed/${p.bathrooms} Bath • Starting: ${priceStr} • URL: /buildings/${p.slug}`;
    }).join("\n");

    const topFloorPlansSummary = allFloorPlans.slice(0, 10).map((fp) => {
      const pStr = fp.salePrice ? `$${fp.salePrice}` : `$${fp.price}`;
      return `- **${fp.title}** (${fp.category}): ${fp.squareFeet} sqft • ${fp.bedrooms} Bed/${fp.bathrooms} Bath • Blueprint Kit: ${pStr} • URL: /floor-plans/${fp.slug}`;
    }).join("\n");

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
            project_type: projectType,
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
              project_type: projectType,
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
              projectPreferences: projectType,
              budget: budgetMatch ? budgetMatch[0] : null,
              dimensions: null,
              aiRecommendations: `Housing Advisor suggested ${projectType} options and estimate`,
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

    // 2. If OpenAI API key is configured, use GPT-4o-mini with real-time catalog & quotation engine
    if (process.env.OPENAI_API_KEY) {
      try {
        const systemPrompt = `You are the expert Architectural Housing Advisor & Quotation Estimator for ModularHome.com.
You assist prospective homebuyers and builders by answering questions, solving technical queries, suggesting appropriate home models, and calculating accurate project quotations.

### Live Building Models Catalog:
${topModelsSummary}

### Live Floor Plan Blueprints Store:
${topFloorPlansSummary}

### Quotation Estimation Rules & Pricing Engine:
1. **Base Steel Framing Component Package**:
   - Small cabins/ADUs (up to 800 sqft): ~$28,000 – $48,000
   - Mid-size homes & Barndominiums (1,000 – 2,200 sqft): ~$55,000 – $95,000
   - Large custom estates (2,400 – 4,000+ sqft): ~$110,000 – $185,000
   - Average component rate: ~$85 / sqft living area.
2. **Turnkey Finished Construction Estimate**:
   - Turnkey installed average: ~$140 to $220 / sqft (inclusive of slab foundation, factory framing, plumbing, electrical MEP, interior finishes, and standing seam roof).
3. **Popular Structural Upgrades**:
   - Covered Wrap-Around Timber Deck: +$12,500
   - R-38 Closed-Cell High Thermal Insulation: +$6,800
   - 16ft Multi-Slide Panoramic Glass Wall: +$9,400
4. **Architectural Blueprints**:
   - Complete CAD (DWG) + Stamped PDF construction drawing sets are available for instant purchase at $495 – $795 at /floor-plans.

### Guidance Rules:
- When the user asks for a quotation, cost estimate, or budget recommendation, ALWAYS provide an itemized estimated breakdown table (Base Framing, Estimated Turnkey, Recommended Options) and suggest matching catalog models with markdown links (e.g. [The Lancaster](/buildings/the-lancaster) or [The Alpine Sanctuary](/floor-plans/alpine-sanctuary-900)).
- Address technical questions accurately: 100% commercial-grade galvanized light gauge steel, 50-year structural warranty, 150+ MPH wind rating, 50 PSF snow load, pre-drilled MEP, fast on-site modular assembly.
- Always recommend they configure exact pricing at [/quote](/quote) or upload custom plans at [/upload-floor-plan](/upload-floor-plan).
- Keep formatting clean, elegant, and professional using markdown bullet points and bold text.`;

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
            temperature: 0.7,
            max_tokens: 650,
          }),
        });

        if (openAiRes.ok) {
          const aiJson = await openAiRes.json();
          const replyText = aiJson.choices[0]?.message?.content || "";

          // Suggest dynamic action buttons based on conversation
          const actionButtons = [
            { label: "Launch Instant Quote Wizard →", href: "/quote" },
            { label: "Explore Floor Plans", href: "/floor-plans" },
            { label: "Upload Custom CAD Plans", href: "/upload-floor-plan" },
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
        console.warn("OpenAI chat error, falling back to knowledge engine:", aiErr);
      }
    }

    // 3. Fallback Smart Quotation & Knowledge Engine
    const q = lastUserMessage.toLowerCase();
    let reply = "";
    let actionButtons: any[] = [];

    // Check if query is asking for price or quote estimation
    if (q.includes("cost") || q.includes("price") || q.includes("quote") || q.includes("estimate") || q.includes("rate") || q.includes("sqft") || q.includes("sq ft")) {
      const sqftMatch = q.match(/(\d{3,4})\s*(?:sqft|sq\s*ft|square\s*feet)?/i);
      const estSqft = sqftMatch ? Math.min(6000, Math.max(400, Number(sqftMatch[1]))) : 1200;
      const baseFraming = Math.round(estSqft * 85);
      const turnkeyLow = Math.round(estSqft * 145);
      const turnkeyHigh = Math.round(estSqft * 210);

      reply = `### Estimated Project Quotation (${estSqft.toLocaleString()} Sq Ft):\n\n` +
        `Here is an estimated price breakdown based on our factory-direct precision steel framing and modular building system:\n\n` +
        `* **Precision Steel Framing Component Kit**: ~$${baseFraming.toLocaleString()} USD ($85/sq ft)\n` +
        `* **Estimated Full Turnkey Construction**: ~$${turnkeyLow.toLocaleString()} – $${turnkeyHigh.toLocaleString()} USD ($145–$210/sq ft installed)\n` +
        `* **Single-Build Verified Architectural Blueprints (CAD + PDF)**: $495 – $795\n\n` +
        `> **Engineering Highlights:** 50-year structural warranty, up to 150 MPH wind rating, 50 PSF snow load, non-combustible steel framing.\n\n` +
        `To configure exact itemized line-items, foundation types, and delivery freight for your ZIP code, launch our interactive Quote Wizard:`;

      actionButtons = [
        { label: `Calculate Exact ${estSqft} Sq Ft Quote →`, href: `/quote?sqft=${estSqft}` },
        { label: "Browse Floor Plans & Blueprints", href: "/floor-plans" },
        { label: "Upload Custom Floor Plan", href: "/upload-floor-plan" },
      ];
    } else if (q.includes("cabin") || q.includes("tiny") || q.includes("retreat")) {
      reply =
        "### Factory-Engineered Cabins & A-Frames\n\n" +
        "Our modular cabin kits feature heavy-duty steel framing panels, high-efficiency thermal envelopes, and timber deck packages. Popular models include:\n\n" +
        "* **The Homestead Cabin** (1,200 sq ft • 2 Bed / 2 Bath) — Starting from $49,900\n" +
        "* **The Retreat Tiny Home** (650 sq ft • 1 Bed / 1 Bath) — Starting from $39,900\n" +
        "* **The Alpine Sanctuary 900** (900 sq ft Blueprint Kit) — Complete DWG + PDF for $495";

      actionButtons = [
        { label: "Explore Cabins & Kits", href: "/buildings?category=Cabins" },
        { label: "Cabin Floor Plans", href: "/floor-plans?category=Cabins" },
        { label: "Get a Quote", href: "/quote" },
      ];
    } else if (q.includes("barndo") || q.includes("barndominium")) {
      reply =
        "### Residential Steel Barndominiums\n\n" +
        "Our residential Barndominiums blend industrial clear-span framing with luxury open-concept living. Highlights include:\n\n" +
        "* **The Haven Barndominium 2400** (2,400 sq ft • 4 Bed / 3 Bath • Integrated Shop)\n" +
        "* **The Lancaster 2200** (2,200 sq ft • Vaulted Great Room)\n" +
        "* **The Hawthorne 2400** (2,400 sq ft • Wrap-Around Porch)\n\n" +
        "All models include precision-engineered galvanized steel framing, 50-year structural warranty, and single-build permit-ready drawings.";

      actionButtons = [
        { label: "Explore Barndominiums", href: "/buildings?category=Barndominiums" },
        { label: "Barndo Blueprints", href: "/floor-plans?category=Barndominiums" },
        { label: "Calculate Quote", href: "/quote" },
      ];
    } else if (leadCreated) {
      reply = `Thank you! I have registered your project specifications with our architectural engineering team. A dedicated modular housing specialist will reach out to **${extractedEmail}** with custom blueprints and pricing.`;
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
