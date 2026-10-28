import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail } from "@/lib/customerStore";
import { verifyCustomerPassword, createCustomerSession } from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const customer = await getCustomerByEmail(email);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (customer.status === "suspended") {
      return NextResponse.json(
        { success: false, message: "Your account is temporarily suspended. Please contact customer support." },
        { status: 403 }
      );
    }

    const validPassword = await verifyCustomerPassword(password, customer.password_hash);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Create session & set HttpOnly cookie
    await createCustomerSession(customer);

    return NextResponse.json({
      success: true,
      message: "Successfully signed in.",
      user: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        status: customer.status,
      },
    });
  } catch (err: any) {
    console.error("Customer login error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

