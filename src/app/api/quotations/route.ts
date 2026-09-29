import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getCustomerSession } from "@/lib/customerAuth";
import { getCustomerByEmail } from "@/lib/customerStore";
import { sendQuoteNotificationEmail } from "@/lib/emailService";
import { calculateQuotation } from "@/lib/pricingEngine";

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

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: { message: "Name and email are required to request a quote.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    // Determine customer ID from active session or email lookup
    let customerId: string | null = null;
    try {
      const session = await getCustomerSession();
      if (session && session.email.toLowerCase() === email) {
        customerId = session.id;
      } else {
        const existingCust = await getCustomerByEmail(email);
        if (existingCust) customerId = existingCust.id;
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

    const quoteId = `quote_${Date.now()}`;
    const quoteData = {
      id: quoteId,
      customer_id: customerId,
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
      source: source || body.source || "QUOTE_WIZARD",
      status: "PENDING",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Direct Postgres insertion
    let persisted = false;
    try {
      const insertSql = `
        INSERT INTO quotations (
          id, customer_id, customer_name, customer_email, customer_phone, customer_zip,
          model_slug, model_name, sqft, dimensions, options, pricing_inputs,
          estimated_amount, line_items, inclusions, exclusions, disclaimer, pricing_rule_version,
          timeline, requirements, source, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18,
          $19, $20, $21, $22, NOW(), NOW()
        )
        RETURNING *
      `;

      const pgRes = await query(insertSql, [
        quoteId,
        quoteData.customer_id,
        quoteData.customer_name,
        quoteData.customer_email,
        quoteData.customer_phone,
        quoteData.customer_zip,
        quoteData.model_slug,
        quoteData.model_name,
        quoteData.sqft,
        quoteData.dimensions,
        JSON.stringify(quoteData.options),
        JSON.stringify(quoteData.pricing_inputs),
        quoteData.estimated_amount,
        JSON.stringify(quoteData.line_items),
        JSON.stringify(quoteData.inclusions),
        JSON.stringify(quoteData.exclusions),
        quoteData.disclaimer,
        quoteData.pricing_rule_version,
        quoteData.timeline,
        quoteData.requirements,
        quoteData.source,
        quoteData.status,
      ]);

      if (pgRes && pgRes.rows[0]) {
        persisted = true;
      }
    } catch (pgErr) {
      console.warn("Direct Postgres quote insert fallback:", pgErr);
    }

    if (!persisted && isSupabaseConfigured()) {
      const { error: spError } = await supabaseAdmin.from("quotations").insert({
        id: quoteId,
        customer_id: quoteData.customer_id,
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
        timeline: quoteData.timeline,
        requirements: quoteData.requirements,
        source: quoteData.source,
        status: "PENDING",
      });
      if (spError) {
        console.error("Supabase quotations insert error:", spError);
      } else {
        persisted = true;
      }
    }

    // 2. Also register / mirror as a qualified CRM lead
    try {
      const leadId = `lead_${Date.now()}`;
      const leadInsertSql = `
        INSERT INTO leads (
          id, name, email, phone, zip, location, project_type, approximate_size, budget, timeline,
          requirements, enquiry_details, source, status, notes, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, NOW(), NOW()
        )
      `;
      await query(leadInsertSql, [
        leadId,
        name,
        email,
        phone,
        zip,
        zip ? `ZIP: ${zip}` : null,
        quoteData.model_name,
        quoteData.sqft ? `${quoteData.sqft} sq ft` : null,
        `$${quoteData.estimated_amount?.toLocaleString()}`,
        quoteData.timeline,
        quoteData.requirements,
        `Quote Request: ${quoteData.model_name} (${quoteData.sqft ? `${quoteData.sqft} sq ft` : "Standard Sizing"}) - Est: $${quoteData.estimated_amount?.toLocaleString()}`,
        quoteData.source,
        "NEW",
        `Generated from Quote Wizard (Quote ID: ${quoteId}) with ${quoteData.line_items.length} itemized lines.`,
      ]);
    } catch (leadErr) {
      console.warn("Mirror quotation into leads table notice:", leadErr);
    }

    // 3. Dispatch transactional email alert to admin and quote summary to customer
    try {
      await sendQuoteNotificationEmail({
        quoteId,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerZip: zip,
        modelName: quoteData.model_name,
        sqft: quoteData.sqft,
        estimatedAmount: quoteData.estimated_amount,
        timeline: quoteData.timeline,
        requirements: quoteData.requirements,
      });
    } catch (quoteEmailErr) {
      console.warn("Quote notification email dispatch note:", quoteEmailErr);
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
