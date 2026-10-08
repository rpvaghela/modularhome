import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getCustomerSession } from "@/lib/customerAuth";
import { getCustomerByEmail } from "@/lib/customerStore";
import { sendCheckoutNotification, UserAccountContext } from "@/lib/email";
import { getPublicFloorPlanBySlug, formatFloorPlan } from "@/lib/publicData";
import { saveCustomOrder } from "@/lib/orderStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      floorPlanId,
      items: rawItems,
      customerName,
      customerEmail,
      customerPhone,
      customerZip,
      attribution,
      inquiryNote,
    } = body;

    const email = (customerEmail || "").toLowerCase().trim();
    const name = (customerName || "").trim();

    if (!email || !name) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Customer name and valid email are required.",
            code: "VALIDATION_ERROR",
          },
        },
        { status: 400 }
      );
    }

    // Determine normalized item list
    let requestedItems: Array<{ floorPlanId: string; quantity: number }> = [];
    if (Array.isArray(rawItems) && rawItems.length > 0) {
      requestedItems = rawItems.map((i: any) => ({
        floorPlanId: String(i.floorPlanId || i.id),
        quantity: Math.max(1, Number(i.quantity) || 1),
      }));
    } else if (floorPlanId) {
      requestedItems = [{ floorPlanId: String(floorPlanId), quantity: 1 }];
    } else {
      return NextResponse.json(
        {
          success: false,
          error: { message: "No items specified for checkout.", code: "EMPTY_CART" },
        },
        { status: 400 }
      );
    }

    // 1. Authoritative Server-Side Price Validation
    const validatedLineItems: Array<{
      floorPlan: any;
      unitPrice: number;
      quantity: number;
      amountInCents: number;
    }> = [];

    let totalOrderAmount = 0;

    for (const item of requestedItems) {
      let plan: any = await getPublicFloorPlanBySlug(item.floorPlanId);

      if (!plan && isSupabaseConfigured()) {
        try {
          const { data } = await supabaseAdmin
            .from("floor_plans")
            .select("*")
            .or(`id.eq.${item.floorPlanId},slug.eq.${item.floorPlanId}`)
            .maybeSingle();
          if (data) plan = formatFloorPlan(data);
        } catch {}
      }

      if (!plan) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: `Floor plan blueprint (${item.floorPlanId}) was not found in catalog.`,
              code: "ITEM_NOT_FOUND",
            },
          },
          { status: 404 }
        );
      }

      // Authoritative unit price from database/catalog, never trusted from client
      const unitPrice = Number(plan.salePrice || plan.sale_price || plan.price || 495);
      const amountInCents = Math.round(unitPrice * 100);

      totalOrderAmount += unitPrice * item.quantity;

      validatedLineItems.push({
        floorPlan: plan,
        unitPrice,
        quantity: item.quantity,
        amountInCents,
      });
    }

    const orderNumber = `MH-ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    // 2. Resolve authenticated customer session context
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

    let stripeSessionId = `cs_test_mock_${Date.now()}`;
    let checkoutUrl: string | null = null;

    // 3. Create Live Stripe Checkout Session
    if (isStripeConfigured()) {
      try {
        const stripeLineItems = validatedLineItems.map((v) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: `Architectural Blueprint Package: ${v.floorPlan.title}`,
              description: `Single-build license • ${v.floorPlan.squareFeet || v.floorPlan.square_feet || 800} sqft • ${v.floorPlan.dimensions || "CAD DWG + PDF"}`,
              images: v.floorPlan.previewImage || v.floorPlan.preview_image ? [v.floorPlan.previewImage || v.floorPlan.preview_image] : [],
            },
            unit_amount: v.amountInCents,
          },
          quantity: v.quantity,
        }));

        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: email,
          client_reference_id: orderNumber,
          line_items: stripeLineItems,
          metadata: {
            orderNumber,
            customerId: customerId || "",
            customerName: name,
            customerZip: customerZip || "",
            itemCount: String(validatedLineItems.length),
            primaryPlanSlug: validatedLineItems[0].floorPlan.slug,
          },
          success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${orderNumber}&title=${encodeURIComponent(
            validatedLineItems[0].floorPlan.title
          )}`,
          cancel_url: `${origin}/floor-plans`,
        });

        stripeSessionId = stripeSession.id;
        checkoutUrl = stripeSession.url;
      } catch (stripeErr: any) {
        console.error("Stripe session creation error:", stripeErr);
        stripeSessionId = `cs_test_sim_${Date.now()}`;
      }
    }

    // 4. PRIMARY OPERATION: Persist Order in Local Store and Database
    let createdOrderId = `ord_${Date.now()}`;

    // Save to local custom order store first for guaranteed offline/dev persistence
    try {
      saveCustomOrder({
        id: createdOrderId,
        order_number: orderNumber,
        customer_id: customerId || undefined,
        customer_name: name,
        customer_email: email,
        customer_phone: customerPhone || undefined,
        total_amount: totalOrderAmount,
        currency: "USD",
        payment_status: "PENDING",
        order_status: "PROCESSING",
        order_items: validatedLineItems.map((v) => ({
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          title: v.floorPlan.title,
          price: v.unitPrice,
          quantity: v.quantity,
          floor_plan_id: v.floorPlan.id,
          preview_image: v.floorPlan.previewImage || v.floorPlan.preview_image,
        })),
        download_access: [],
      });
      console.log(`[OrderStore Save]: SUCCESS orderId=${createdOrderId}, orderNumber=${orderNumber}`);
    } catch (storeErr: any) {
      console.warn("OrderStore save note:", storeErr?.message || storeErr);
    }

    if (isSupabaseConfigured()) {
      try {
        const { data: dbOrder, error: orderErr } = await supabaseAdmin
          .from("orders")
          .insert({
            order_number: orderNumber,
            customer_id: customerId,
            customer_name: name,
            customer_email: email,
            customer_phone: customerPhone || null,
            customer_zip: customerZip || null,
            total_amount: totalOrderAmount,
            tax_amount: 0,
            discount_amount: 0,
            currency: "USD",
            payment_status: "PENDING",
            order_status: "PENDING",
            payment_id: stripeSessionId,
            attribution: attribution || {},
          })
          .select()
          .single();

        if (!orderErr && dbOrder) {
          createdOrderId = dbOrder.id;
          console.log(`[Database Save]: SUCCESS orderId=${createdOrderId}, orderNumber=${orderNumber}`);

          // Insert order items
          const itemsToInsert = validatedLineItems.map((v) => ({
            order_id: dbOrder.id,
            floor_plan_id: v.floorPlan.id && !v.floorPlan.id.startsWith("fp-") ? v.floorPlan.id : null,
            title: v.floorPlan.title,
            price: v.unitPrice,
            quantity: v.quantity,
          }));

          await supabaseAdmin.from("order_items").insert(itemsToInsert);
        }
      } catch (dbErr: any) {
        console.warn("Supabase order creation note:", dbErr.message);
      }
    }

    // 5. SECONDARY OPERATION: Dispatch Admin Notification for new order checkout
    try {
      await sendCheckoutNotification({
        orderId: createdOrderId,
        orderNumber,
        customerName: name,
        customerEmail: email,
        customerPhone: customerPhone || null,
        customerZip: customerZip || null,
        items: validatedLineItems.map((v) => ({
          title: v.floorPlan.title,
          id: v.floorPlan.id,
          quantity: v.quantity,
          price: v.unitPrice,
        })),
        totalAmount: totalOrderAmount,
        paymentOption: checkoutUrl ? "Stripe Hosted Checkout" : "Card Payment (Direct)",
        paymentStatus: "PENDING / INITIATED",
        inquiryNote: inquiryNote || null,
        submissionDate: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
        userContext,
      });
    } catch (emailErr: any) {
      console.warn("[Admin Notification]: FAILED for orderNumber=", orderNumber, emailErr?.message || emailErr);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: createdOrderId,
        orderNumber,
        amount: totalOrderAmount,
        currency: "USD",
        sessionId: stripeSessionId,
        checkoutUrl,
        isStripeLive: Boolean(checkoutUrl),
        items: validatedLineItems.map((v) => ({
          title: v.floorPlan.title,
          price: v.unitPrice,
          quantity: v.quantity,
        })),
      },
    });
  } catch (error: any) {
    console.error("Create checkout session error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: error?.message || "Failed to create checkout session.", code: "SESSION_ERROR" },
      },
      { status: 500 }
    );
  }
}
