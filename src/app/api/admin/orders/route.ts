import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { readOrdersFromStore } from "@/lib/orderStore";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let customOrders: any[] = [];
    try {
      customOrders = readOrdersFromStore();
    } catch {}

    let dbOrders: any[] = [];
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin
          .from("orders")
          .select("*, order_items(*), download_access(download_count, max_downloads, expires_at)")
          .order("created_at", { ascending: false });

        if (status && status !== "ALL") {
          query = query.eq("payment_status", status);
        }

        const { data, error } = await query;
        if (!error && data) {
          dbOrders = data;
        }
      } catch (e) {
        console.warn("Supabase query error on orders:", e);
      }
    }

    const merged: any[] = [];
    const seenOrderKeys = new Set<string>();

    for (const ord of customOrders) {
      const key = (ord.order_number || ord.id || "").toLowerCase().trim();
      if (!seenOrderKeys.has(key)) {
        seenOrderKeys.add(key);
        merged.push(ord);
      }
    }

    for (const ord of dbOrders) {
      const key = (ord.order_number || ord.id || "").toLowerCase().trim();
      if (!seenOrderKeys.has(key)) {
        seenOrderKeys.add(key);
        merged.push(ord);
      }
    }

    let filtered = [...merged];
    if (status && status !== "ALL") {
      filtered = filtered.filter((o) => o.payment_status === status);
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error: any) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}
