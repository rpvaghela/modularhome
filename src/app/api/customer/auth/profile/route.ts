import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customerAuth";
import { getCustomerById, saveCustomer, logCustomerEvent } from "@/lib/customerStore";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getOrdersByCustomer } from "@/lib/orderStore";

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
    }

    const customer = await getCustomerById(session.id);
    if (!customer) {
      return NextResponse.json({ success: false, error: { message: "Customer not found" } }, { status: 404 });
    }

    // Fetch stats (orders count, total spend, downloads)
    const localById = getOrdersByCustomer(customer.id);
    const localByEmail = getOrdersByCustomer(customer.email);
    const allLocal = Array.from(new Set([...localById, ...localByEmail]));

    let dbOrders: any[] = [];
    let dbDownloadsCount = 0;

    if (isSupabaseConfigured()) {
      try {
        const { data: orders } = await supabaseAdmin
          .from("orders")
          .select("id, total_amount, payment_status, order_number")
          .or(`customer_id.eq.${customer.id},customer_email.ilike.${customer.email},customer_email.eq.${customer.email}`);
        
        if (orders) {
          dbOrders = orders;
        }

        const { count } = await supabaseAdmin
          .from("download_access")
          .select("*", { count: "exact", head: true })
          .ilike("customer_email", customer.email);
        
        if (typeof count === "number") dbDownloadsCount = count;
      } catch {}
    }

    // Merge unique orders
    const seenOrderKeys = new Set<string>();
    const mergedOrders: any[] = [];

    for (const ord of allLocal) {
      const key = (ord.order_number || ord.id || "").toLowerCase().trim();
      if (!seenOrderKeys.has(key)) {
        seenOrderKeys.add(key);
        mergedOrders.push(ord);
      }
    }

    for (const ord of dbOrders) {
      const key = (ord.order_number || ord.id || "").toLowerCase().trim();
      if (!seenOrderKeys.has(key)) {
        seenOrderKeys.add(key);
        mergedOrders.push(ord);
      }
    }

    const orderCount = mergedOrders.length;
    const totalSpend = mergedOrders
      .filter((o) => o.payment_status === "PAID")
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    let localDownloadsCount = 0;
    allLocal.forEach((o) => {
      if (o.payment_status === "PAID" && Array.isArray(o.download_access)) {
        localDownloadsCount += o.download_access.length;
      }
    });

    const downloadsCount = Math.max(dbDownloadsCount, localDownloadsCount);

    return NextResponse.json({
      success: true,
      profile: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        billing_address: customer.billing_address || {},
        email_verified: customer.email_verified,
        provider: customer.provider || "EMAIL",
        status: customer.status,
        created_at: customer.created_at,
        stats: {
          orderCount,
          totalSpend,
          downloadsCount,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error?.message } }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
    }

    const customer = await getCustomerById(session.id);
    if (!customer) {
      return NextResponse.json({ success: false, error: { message: "Customer not found" } }, { status: 404 });
    }

    const body = await request.json();
    const { name, phone, billing_address } = body;

    const updated = await saveCustomer({
      ...customer,
      name: name && name.trim() ? name.trim() : customer.name,
      phone: phone !== undefined ? (phone ? String(phone).trim() : null) : customer.phone,
      billing_address: billing_address || customer.billing_address || {},
      updated_at: new Date().toISOString(),
    });

    await logCustomerEvent({
      customer_id: customer.id,
      event_type: "PROFILE_UPDATED",
      actor_type: "CUSTOMER",
      actor_name: updated.name,
      details: { name: updated.name, phone: updated.phone },
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        phone: updated.phone,
        billing_address: updated.billing_address,
        email_verified: updated.email_verified,
      },
      message: "Profile updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error?.message } }, { status: 500 });
  }
}
