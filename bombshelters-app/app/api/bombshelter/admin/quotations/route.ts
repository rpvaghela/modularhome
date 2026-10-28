import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterQuotations } from "@/lib/quotationsStore";

export async function GET(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    let quotations = await getBombShelterQuotations();

    if (status && status !== "ALL") {
      quotations = quotations.filter((q) => q.status === status);
    }

    if (search) {
      quotations = quotations.filter(
        (q) =>
          q.customer_name.toLowerCase().includes(search) ||
          q.customer_email.toLowerCase().includes(search) ||
          q.model_name.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      count: quotations.length,
      data: quotations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch quotations." },
      { status: 500 }
    );
  }
}

