import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customerAuth";
import { getCustomerById, saveCustomer } from "@/lib/customerStore";

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const customer = await getCustomerById(session.id);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer account not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        email_verified: customer.email_verified,
        status: customer.status,
        billing_address: customer.billing_address || null,
        saved_plans: customer.saved_plans || [],
        created_at: customer.created_at,
      },
    });
  } catch (err: any) {
    console.error("Fetch profile error:", err);
    return NextResponse.json(
      { success: false, message: "Error loading profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const customer = await getCustomerById(session.id);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer account not found." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, phone, billing_address } = body;

    if (name !== undefined) customer.name = name.trim();
    if (phone !== undefined) customer.phone = phone.trim() || null;
    if (billing_address !== undefined) customer.billing_address = billing_address;

    await saveCustomer(customer);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        billing_address: customer.billing_address,
      },
    });
  } catch (err: any) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update profile." },
      { status: 500 }
    );
  }
}

