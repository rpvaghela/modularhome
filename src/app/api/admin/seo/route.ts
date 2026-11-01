import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth";
import { getSeoAnalyticsData } from "@/lib/seoAnalyticsStore";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminRole(["SUPER_ADMIN", "CONTENT_ADMIN", "SALES"]);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const device = searchParams.get("device") || undefined;
    const country = searchParams.get("country") || undefined;

    const seoData = await getSeoAnalyticsData({ startDate, endDate, device, country });

    return NextResponse.json({
      success: true,
      data: seoData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to load SEO analytics." } },
      { status: 500 }
    );
  }
}

