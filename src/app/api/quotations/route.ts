import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getCustomerSession } from "@/lib/customerAuth";
import { getCustomerByEmail } from "@/lib/customerStore";
import { saveQuotationToStore } from "@/lib/quotationsStore";
import { saveLead } from "@/lib/leadsStore";
import { calculateQuotation } from "@/lib/pricingEngine";
import {
  sendQuoteNotification,
  sendEstimateNotification,
  sendFloorPlanNotification,
  UserAccountContext,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerZip,
      modelSlug,
      modelName,
      sqft,
      dimensions,
      options,
      pricingInputs,
      finishLevel,
      timeline,
      requirements,
      source,
    } = body;

    const name = (customerName || body.name || body.customer_name || "").trim();
    const email = (customerEmail || body.email || body.customer_email || "").toLowerCase().trim();
    const phone = customerPhone || body.phone || body.customer_phone || null;
    const zip = customerZip || body.zip || body.customer_zip || null;
    const submissionSource = source || body.source || "QUOTE_WIZARD";

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: { message: "Name and email are required to request a quote.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    // 1. Resolve logged-in customer session context
    let userContext: UserAccountContext = {
      userId: null,
      accountEmail: null,
      accountName: null,
      isAuthenticated: false,
    };
    let customerId: string | null = null;

    try {
      const session = await getCustomerSession();
      if (session) {
        customerId = session.id;
        userContext = {
          userId: session.id,
          accountEmail: session.email,
          accountName: session.name,
          isAuthenticated: true,
        };
      } else {
        const existingCust = await getCustomerByEmail(email);
        if (existingCust) {
          customerId = existingCust.id;
          userContext = {
            userId: existingCust.id,
            accountEmail: existingCust.email,
            accountName: existingCust.name,
            isAuthenticated: false,
          };
        }
      }
    } catch {}

    const parsedOptions = typeof options === "string" ? JSON.parse(options) : options || [];
    const parsedInputs = typeof pricingInputs === "string" ? JSON.parse(pricingInputs) : pricingInputs || {};
    const effectiveSqft = sqft ? Number(sqft) : parsedInputs.sqft ? Number(parsedInputs.sqft) : 1000;

    // Run deterministic calculation engine
    const quoteCalc = await calculateQuotation({
      modelType: body.model_type || body.category || "Modular Homes",
      modelSlug: modelSlug || body.model_slug || undefined,
      modelName: modelName || body.model_name || "Custom Plan / Model",
      sqft: effectiveSqft,
      finishLevel: finishLevel || parsedInputs.finishLevel || "STANDARD",
      selectedUpgrades: Array.isArray(parsedOptions) ? parsedOptions : [],
      zip: zip || undefined,
    });

    const quoteId = crypto.randomUUID();
    const validCustomerId = (customerId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(customerId)) ? customerId : null;

    const quoteData = {
      id: quoteId,
      customer_id: validCustomerId,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      customer_zip: zip,
      model_slug: modelSlug || body.model_slug || null,
      model_name: modelName || body.model_name || "Custom Plan / Model",
      sqft: effectiveSqft,
      dimensions: dimensions || body.dimensions || null,
      options: parsedOptions,
      pricing_inputs: parsedInputs,
      estimated_amount: quoteCalc.estimatedTotal,
      line_items: quoteCalc.lineItems,
      inclusions: quoteCalc.inclusions,
      exclusions: quoteCalc.exclusions,
      disclaimer: quoteCalc.disclaimer,
      pricing_rule_version: quoteCalc.pricingRuleVersion,
      timeline: timeline || body.timeline || null,
      requirements: requirements || body.notes || body.description || body.enquiry_details || null,
      source: submissionSource,
      status: "PENDING" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 2. PRIMARY OPERATION: Save to Database & Local Stores

    // A. Local Quotations Store (Guaranteed persistence)
    try {
      saveQuotationToStore(quoteData);
    } catch (storeErr) {
      console.warn("Quotation local store notice:", storeErr);
    }

    // B. Supabase Quotations Table
    if (isSupabaseConfigured()) {
      try {
        const { error: spError } = await supabaseAdmin.from("quotations").insert({
          id: quoteId,
          customer_id: validCustomerId,
          customer_name: quoteData.customer_name,
          customer_email: quoteData.customer_email,
          customer_phone: quoteData.customer_phone,
          customer_zip: quoteData.customer_zip,
          model_slug: quoteData.model_slug,
          model_name: quoteData.model_name,
          sqft: quoteData.sqft,
          dimensions: quoteData.dimensions,
          options: quoteData.options,
          pricing_inputs: quoteData.pricing_inputs,
          estimated_amount: quoteData.estimated_amount,
          line_items: quoteData.line_items,
          exclusions: quoteData.exclusions,
          pricing_rule_version: quoteData.pricing_rule_version,
          timeline: quoteData.timeline,
          requirements: quoteData.requirements,
          source: quoteData.source,
          status: "PENDING",
        });

        if (spError) {
          console.error("[Database Save]: Supabase quotation insert error:", spError);
          throw new Error(spError.message || "Failed to persist quotation into Supabase.");
        } else {
          console.log(`[Database Save]: SUCCESS Supabase quotation id=${quoteId}`);
        }
      } catch (sbErr: any) {
        console.error("[Database Save]: Supabase quotation insert exception:", sbErr?.message || sbErr);
      }
    }

    // C. Mirror quotation into CRM leads store and Supabase leads table
    try {
      const leadPayload = {
        name,
        email,
        phone,
        location: zip ? `ZIP: ${zip}` : null,
        zip,
        enquiry_details: `Quote Request: ${quoteData.model_name} (${quoteData.sqft ? `${quoteData.sqft} sq ft` : "Standard Sizing"}) - Est: $${quoteData.estimated_amount?.toLocaleString()}`,
        source: quoteData.source,
        status: "NEW" as const,
        notes: `Auto-generated from quotation (${quoteId}). Timeline: ${quoteData.timeline || "Not specified"}. Details: ${quoteData.requirements || "None"}`,
      };

      saveLead(leadPayload);

      if (isSupabaseConfigured()) {
        try {
          await supabaseAdmin.from("leads").insert(leadPayload);
        } catch {}
      }
    } catch (leadErr) {
      console.warn("Mirror quotation into leads store notice:", leadErr);
    }

    // 3. SECONDARY OPERATION: Dispatch Admin Email Notification
    const submissionDate = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

    try {
      if (submissionSource === "FLOOR_PLAN_UPLOAD") {
        // Form 4: Custom Floor Plan Uploader
        const fileMatch = quoteData.requirements?.match(/Blueprint Document:\s*([^|(]+)(?:\s*\(([^)]+)\))?/i);
        const fileName = fileMatch ? fileMatch[1].trim() : body.fileName || null;
        const fileSize = fileMatch && fileMatch[2] ? fileMatch[2].trim() : null;

        await sendFloorPlanNotification({
          quoteId,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          customerZip: zip,
          plotDimensions: quoteData.dimensions,
          approximateSqFt: quoteData.sqft,
          requirements: quoteData.requirements,
          fileName,
          fileSize,
          submissionDate,
          source: "FLOOR_PLAN_UPLOAD",
          userContext,
        });
      } else if (submissionSource === "HOMEPAGE_QUOTE") {
        // Form 3: Quick Estimate (QuoteAndStepsSection)
        const stateMatch = quoteData.requirements?.match(/State:\s*([^|]+)/i);
        const homeTypeMatch = quoteData.requirements?.match(/Home Type:\s*([^|]+)/i);
        const budgetMatch = quoteData.requirements?.match(/Budget:\s*([^|]+)/i);
        const fileMatch = quoteData.requirements?.match(/Attached File:\s*([^|]+)/i);

        await sendEstimateNotification({
          quoteId,
          name,
          email,
          phone,
          state: stateMatch ? stateMatch[1].trim() : body.state || null,
          homeType: homeTypeMatch ? homeTypeMatch[1].trim() : quoteData.model_name,
          budget: budgetMatch ? budgetMatch[1].trim() : body.budget || null,
          details: quoteData.requirements,
          fileName: fileMatch ? fileMatch[1].trim() : body.fileName || null,
          submissionDate,
          source: "HOMEPAGE_QUOTE",
          userContext,
        });
      } else {
        // Form 2: Quote Wizard (Default)
        await sendQuoteNotification({
          quoteId,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          customerZip: zip,
          builtUpArea: quoteData.sqft,
          structureType: "Precision Cold-Formed Steel Structure",
          finishQuality: finishLevel || "Standard Turnkey",
          selectedAddons: parsedOptions,
          estimatedPrice: quoteData.estimated_amount,
          modelName: quoteData.model_name,
          modelSlug: quoteData.model_slug,
          timeline: quoteData.timeline,
          requirements: quoteData.requirements,
          submissionDate,
          source: "QUOTE_WIZARD",
          userContext,
        });
      }
    } catch (emailErr: any) {
      console.warn("[Admin Notification]: FAILED for quoteId=", quoteId, emailErr?.message || emailErr);
    }

    return NextResponse.json({
      success: true,
      data: quoteData,
      calculation: quoteCalc,
      message: "Your quote request has been calculated and submitted successfully! An architectural specialist will follow up.",
    });
  } catch (error: any) {
    console.error("Public quote submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error?.message || "Failed to submit quote request. Please try again or contact us directly.",
          code: "QUOTE_SUBMISSION_ERROR",
        },
      },
      { status: 500 }
    );
  }
}
