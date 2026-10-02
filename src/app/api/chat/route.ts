import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { calculateQuotation } from "@/lib/pricingEngine";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, userContext } = body;

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

    let extractedEmail = emailMatch ? emailMatch[1] : null;
    let extractedPhone = phoneMatch ? phoneMatch[0] : null;

    // Check if this message provides lead qualification info
    let leadCreated = false;
    let createdLeadId: string | null = null;

    if (extractedEmail) {
      try {
        const leadId = `lead_chat_${Date.now()}`;
        const leadName = userContext?.name || "AI Chat Prospect";
        const projectType = lastUserMessage.toLowerCase().includes("barndo")
          ? "Barndominiums"
          : lastUserMessage.toLowerCase().includes("cabin")
          ? "Cabins & A-Frames"
          : lastUserMessage.toLowerCase().includes("adu")
          ? "ADUs & Tiny Suites"
          : "Modular & Prefab Homes";

        const insertSql = `
          INSERT INTO leads (
            id, name, email, phone, location, project_type, budget,
            requirements, enquiry_details, source, status, notes, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
          )
          ON CONFLICT (id) DO NOTHING
          RETURNING id
        `;

        const pgRes = await query(insertSql, [
          leadId,
          leadName,
          extractedEmail,
          extractedPhone,
          userContext?.location || null,
          projectType,
          budgetMatch ? budgetMatch[0] : null,
          lastUserMessage,
          `Qualified via AI Chatbot: ${lastUserMessage}`,
          "WEBSITE_CHAT",
          "QUALIFIED",
          `Conversation Transcript Summary:\n${conversationHistory.slice(-500)}`,
        ]);

        if (pgRes && pgRes.rows.length > 0) {
          leadCreated = true;
          createdLeadId = pgRes.rows[0].id;
        } else if (isSupabaseConfigured()) {
          const { data } = await supabaseAdmin.from("leads").insert({
            id: leadId,
            name: leadName,
            email: extractedEmail,
            phone: extractedPhone,
            project_type: projectType,
            enquiry_details: `Qualified via AI Chatbot: ${lastUserMessage}`,
            source: "WEBSITE_CHAT",
            status: "QUALIFIED",
            notes: `Conversation Transcript Summary:\n${conversationHistory.slice(-500)}`,
          }).select("id").single();

          if (data) {
            leadCreated = true;
            createdLeadId = data.id;
          }
        }
      } catch (leadSaveErr) {
        console.warn("AI Chat lead capture note:", leadSaveErr);
      }
    }

    // 1. If OpenAI API key is configured, use GPT-4o-mini with architectural catalog context
    if (process.env.OPENAI_API_KEY) {
      try {
        const systemPrompt = `You are the expert Architectural Housing Advisor for ModularHome.com.
You help prospective home builders explore precision-engineered steel modular homes, barndominiums, cabins, ADUs, and downloadable floor plan sets.
Key Catalog Highlights:
- Precision steel framing (50-year warranty, 150+ MPH wind resilience, high snow loads)
- Modular Homes: 600 to 4,000+ sq ft ($85/sq ft standard framing rate)
- Barndominiums: 'The Lancaster' (2,200 sq ft), 'The Hawthorne' (2,400 sq ft)
- Cabins & A-Frames: 'The Homestead Cabin' (1,200 sq ft), 'The Retreat' (650 sq ft)
- Instant Quote Estimator available at /quote and Floor Plan uploads at /upload-floor-plan
- If the user provides an email, acknowledge that their project request has been logged directly with an engineering specialist.
Provide concise, elegant, structured responses with markdown formatting.`;

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
            max_tokens: 500,
          }),
        });

        if (openAiRes.ok) {
          const aiJson = await openAiRes.json();
          const replyText = aiJson.choices[0]?.message?.content || "";

          return NextResponse.json({
            success: true,
            reply: replyText,
            leadCaptured: leadCreated,
            leadId: createdLeadId,
            actionButtons: [
              { label: "Calculate Exact Quote", href: "/quote" },
              { label: "Explore Floor Plans", href: "/floor-plans" },
              { label: "Upload Custom CAD", href: "/upload-floor-plan" },
            ],
          });
        }
      } catch (aiErr) {
        console.warn("OpenAI chat error, using deterministic rules fallback:", aiErr);
      }
    }

    // 2. Deterministic Knowledge Engine Fallback
    const q = lastUserMessage.toLowerCase();
    let reply = "";
    let actionButtons: any[] = [];

    if (leadCreated) {
      reply = `Thank you! I have qualified and registered your project specifications with our architectural team. A dedicated modular housing specialist will reach out to **${extractedEmail}** with custom blueprints and pricing.`;
      actionButtons = [
        { label: "Calculate Instant Quote", href: "/quote" },
        { label: "Browse 3D Catalog", href: "/buildings" },
        { label: "Contact Us", href: "/contact" },
      ];
    } else if (q.includes("cabin") || q.includes("tiny") || q.includes("retreat")) {
      reply =
        "Our factory-engineered cabin kits feature heavy-duty steel framing panels and high-efficiency thermal envelopes. Popular models include **The Homestead Cabin** (1,200 sq ft) and **The Retreat** (650 sq ft).";
      actionButtons = [
        { label: "Explore Cabins & Kits", href: "/buildings?category=Cabins" },
        { label: "Cabin Floor Plans", href: "/floor-plans?category=Cabins" },
        { label: "Get a Quote", href: "/quote" },
      ];
    } else if (q.includes("barndo") || q.includes("barndominium")) {
      reply =
        "Our residential Barndominiums feature clear-span open layouts, soaring cathedral ceilings, and 50-year structural steel warranties. Popular models include **The Lancaster** (2,200 sq ft) and **The Hawthorne** (2,400 sq ft).";
      actionButtons = [
        { label: "Explore Barndominiums", href: "/buildings?category=Barndominiums" },
        { label: "Barndo Blueprints", href: "/floor-plans?category=Barndominiums" },
        { label: "Calculate Quote", href: "/quote" },
      ];
    } else if (q.includes("cost") || q.includes("price") || q.includes("quote") || q.includes("rate") || q.includes("sqft")) {
      reply =
        "Modular home structures start with our precision base framing packages from $28,000 to $42,000 plus an average living area rate of $85/sq ft. You can test and configure complete itemized pricing using our interactive tool:";
      actionButtons = [
        { label: "Launch Instant Quote Tool →", href: "/quote" },
        { label: "Upload Custom Plans for Bid", href: "/upload-floor-plan" },
      ];
    } else {
      reply =
        "Welcome to ModularHome.com! We engineer and deliver factory-built precision steel modular homes, luxury barndominiums, and cabin kits nationwide. Would you like to explore our catalog models, calculate preliminary pricing, or upload custom plans?";
      actionButtons = [
        { label: "Explore Home Models", href: "/buildings" },
        { label: "Instant Quote Wizard", href: "/quote" },
        { label: "Custom Floor Plan Upload", href: "/upload-floor-plan" },
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
