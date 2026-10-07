import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { readQuotationsFromStore, saveQuotationToStore } from "@/lib/quotationsStore";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase().trim();

    let dbQuotes: any[] = [];

    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin
          .from("quotations")
          .select("*")
          .order("created_at", { ascending: false });

        if (status && status !== "ALL") {
          query = query.eq("status", status);
        }

        const { data, error } = await query;
        if (!error && data) {
          dbQuotes = data;
        }
      } catch (dbErr) {
        console.warn("Supabase fetch quotations warning:", dbErr);
      }
    }

    // Merge with local persistent store
    const localQuotes = readQuotationsFromStore();
    const existingIds = new Set(dbQuotes.map((q) => q.id));
    const merged: any[] = [...dbQuotes];

    for (const lq of localQuotes) {
      if (!existingIds.has(lq.id)) {
        if (!status || status === "ALL" || lq.status === status) {
          merged.push(lq);
          existingIds.add(lq.id);
        }
      }
    }

    // Apply search filter if present
    let filtered = merged;
    if (search) {
      filtered = filtered.filter(
        (q) =>
          q.customer_name?.toLowerCase().includes(search) ||
          q.customer_email?.toLowerCase().includes(search) ||
          q.customer_phone?.toLowerCase().includes(search) ||
          q.model_name?.toLowerCase().includes(search) ||
          q.customer_zip?.toLowerCase().includes(search) ||
          q.requirements?.toLowerCase().includes(search)
      );
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error: any) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch quotations.", code: "DB_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

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
      estimatedAmount,
      timeline,
      requirements,
      source,
    } = body;

    const name = customerName || body.name || body.customer_name;
    const email = customerEmail || body.email || body.customer_email;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: { message: "Name and email are required.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const quoteId = crypto.randomUUID();
    const quoteData = {
      id: quoteId,
      customer_name: name,
      customer_email: email.toLowerCase().trim(),
      customer_phone: customerPhone || body.phone || null,
      customer_zip: customerZip || body.zip || null,
      model_slug: modelSlug || body.model_slug || null,
      model_name: modelName || body.model_name || "Custom Configuration",
      sqft: sqft ? Number(sqft) : null,
      dimensions: dimensions || null,
      options: typeof options === "string" ? JSON.parse(options) : options || [],
      pricing_inputs: typeof pricingInputs === "string" ? JSON.parse(pricingInputs) : pricingInputs || {},
      estimated_amount: estimatedAmount ? Number(estimatedAmount) : null,
      timeline: timeline || null,
      requirements: requirements || body.notes || null,
      source: source || "ADMIN_MANUAL",
      status: (body.status as any) || "PENDING",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Save to local store
    const localSaved = saveQuotationToStore(quoteData);

    // 2. Save to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from("quotations")
          .insert(quoteData)
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({
            success: true,
            data,
            message: "Quotation recorded successfully.",
          });
        }
      } catch (sbErr) {
        console.warn("Supabase quotation manual insert note:", sbErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: localSaved,
      message: "Quotation recorded successfully.",
    });
  } catch (error: any) {
    console.error("Error creating quotation:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to record quotation.", code: "CREATE_ERROR" } },
      { status: 500 }
    );
  }
}
