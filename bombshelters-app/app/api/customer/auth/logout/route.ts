import { NextResponse } from "next/server";
import { clearCustomerSession } from "@/lib/customerAuth";

export async function POST() {
  try {
    await clearCustomerSession();
    return NextResponse.json({
      success: true,
      message: "Successfully logged out.",
    });
  } catch (err: any) {
    console.error("Customer logout error:", err);
    return NextResponse.json(
      { success: false, message: "Error during logout." },
      { status: 500 }
    );
  }
}

