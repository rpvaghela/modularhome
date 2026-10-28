import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail, saveCustomer, Customer } from "@/lib/customerStore";
import { hashCustomerPassword, createCustomerSession } from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const existing = await getCustomerByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const password_hash = await hashCustomerPassword(password);
    const newCustomer: Customer = {
      id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      phone: phone?.trim() || null,
      password_hash,
      email_verified: true,
      status: "active",
      saved_plans: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await saveCustomer(newCustomer);

    // Create session & set HttpOnly cookie
    await createCustomerSession(newCustomer);

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: newCustomer.id,
        email: newCustomer.email,
        name: newCustomer.name,
        phone: newCustomer.phone,
        status: newCustomer.status,
      },
    });
  } catch (err: any) {
    console.error("Customer signup error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

