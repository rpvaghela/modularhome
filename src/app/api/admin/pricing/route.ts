import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { query } from "@/lib/db";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { logActivity } from "@/lib/activityLogger";
import { calculateQuotation, getActivePricingRules } from "@/lib/pricingEngine";

export async function GET() {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const rules = await getActivePricingRules();
    return NextResponse.json({ success: true, data: rules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();

    // Check if this is a quote calculation simulation request
    if (body.action === "CALCULATE_PREVIEW") {
      const result = await calculateQuotation(body.input);
      return NextResponse.json({ success: true, data: result });
    }

    const { code, category, label, base_rate, multiplier, min_sqft, max_sqft, description, is_active } = body;

    if (!code || !label || !category) {
      return NextResponse.json(
        { success: false, error: { message: "Rule code, label, and category are required." } },
        { status: 400 }
      );
    }

    const cleanCode = code.toUpperCase().trim().replace(/[^A-Z0-9_]/g, "_");
    const ruleId = `rule_${Date.now()}`;

    try {
      const insertSql = `
        INSERT INTO pricing_rules (id, code, category, label, base_rate, multiplier, min_sqft, max_sqft, description, is_active, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        RETURNING *
      `;
      const res = await query(insertSql, [
        ruleId,
        cleanCode,
        category,
        label,
        Number(base_rate) || 0,
        Number(multiplier) || 0,
        min_sqft ? Number(min_sqft) : null,
        max_sqft ? Number(max_sqft) : null,
        description || null,
        is_active !== false,
      ]);

      if (res && res.rows[0]) {
        await logActivity({
          action: "CREATE",
          entityType: "PRICING_RULE",
          entityId: ruleId,
          details: { code: cleanCode, label, category },
        });
        return NextResponse.json({ success: true, data: res.rows[0] });
      }
    } catch (pgErr) {
      console.warn("Postgres insert error for pricing rule:", pgErr);
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from("pricing_rules")
        .insert({
          id: ruleId,
          code: cleanCode,
          category,
          label,
          base_rate: Number(base_rate) || 0,
          multiplier: Number(multiplier) || 0,
          min_sqft: min_sqft ? Number(min_sqft) : null,
          max_sqft: max_sqft ? Number(max_sqft) : null,
          description: description || null,
          is_active: is_active !== false,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({
      success: true,
      data: { id: ruleId, code: cleanCode, category, label, base_rate, multiplier, is_active: true },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
