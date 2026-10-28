import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customerAuth";

export async function GET() {
  try {
    const user = await getCustomerSession();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. No active customer session." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err: any) {
    console.error("Customer me error:", err);
    return NextResponse.json(
      { success: false, message: "Error fetching session." },
      { status: 500 }
    );
  }
}

