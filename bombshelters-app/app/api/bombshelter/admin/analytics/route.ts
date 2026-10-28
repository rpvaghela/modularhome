import { NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterLeads } from "@/lib/leadsStore";
import { getBombShelterQuotations } from "@/lib/quotationsStore";
import { getBombShelterProducts } from "@/lib/productStore";

export async function GET() {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const leads = await getBombShelterLeads();
    const quotations = await getBombShelterQuotations();
    const products = await getBombShelterProducts(true);

    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newLeadsThisWeek = leads.filter(
      (l) => new Date(l.created_at).getTime() > oneWeekAgo
    ).length;

    const totalEstimatedValue = quotations.reduce(
      (acc, q) => acc + (Number(q.estimated_amount) || 0),
      0
    );

    const statusBreakdown: Record<string, number> = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      QUOTE_SENT: 0,
      WON: 0,
      LOST: 0,
    };

    for (const lead of leads) {
      if (statusBreakdown[lead.status] !== undefined) {
        statusBreakdown[lead.status]++;
      } else {
        statusBreakdown[lead.status] = 1;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalLeads: leads.length,
        newLeadsThisWeek,
        totalQuotations: quotations.length,
        totalEstimatedValue,
        activeProducts: products.length,
        statusBreakdown,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to calculate analytics." },
      { status: 500 }
    );
  }
}

