import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterLeads } from "@/lib/leadsStore";

export async function GET(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase();

    let leads = await getBombShelterLeads();

    if (status && status !== "ALL") {
      leads = leads.filter((l) => l.status === status);
    }

    if (search) {
      leads = leads.filter(
        (l) =>
          l.name.toLowerCase().includes(search) ||
          l.email.toLowerCase().includes(search) ||
          (l.phone && l.phone.includes(search)) ||
          (l.project_type && l.project_type.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch leads." },
      { status: 500 }
    );
  }
}

