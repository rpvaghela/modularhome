import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customerAuth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getOrdersByCustomer } from "@/lib/orderStore";

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { message: "Authentication required", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    // 1. Get from local order store
    const localById = getOrdersByCustomer(session.id);
    const localByEmail = getOrdersByCustomer(session.email);
    const localOrders = Array.from(new Set([...localById, ...localByEmail]));

    let dbOrders: any[] = [];
    if (isSupabaseConfigured()) {
      try {
        const { data: orders, error } = await supabaseAdmin
          .from("orders")
          .select(`
            *,
            order_items (
              id,
              title,
              price,
              quantity,
              floor_plan_id
            ),
            download_access (
              id,
              download_token,
              expires_at,
              download_count,
              max_downloads
            )
          `)
          .or(`customer_id.eq.${session.id},customer_email.ilike.${session.email},customer_email.eq.${session.email}`)
          .order("created_at", { ascending: false });

        if (!error && orders) {
          dbOrders = orders;
        }
      } catch (e) {
        console.warn("Supabase customer orders query note:", e);
      }
    }

    // Merge unique orders by ID or order_number
    const merged: any[] = [];
    const seenOrderKeys = new Set<string>();

    for (const ord of localOrders) {
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

    return NextResponse.json({
      success: true,
      orders: merged,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to load customer orders." } },
      { status: 500 }
    );
  }
}
