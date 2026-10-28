import { NextResponse } from "next/server";
import { getBombShelterFloorPlans } from "@/lib/floorPlansStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const plans = await getBombShelterFloorPlans(true);
    return NextResponse.json({ success: true, data: plans });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch floor plans." },
      { status: 500 }
    );
  }
}

