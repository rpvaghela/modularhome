import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterFloorPlans, saveBombShelterFloorPlan, FloorPlanItem } from "@/lib/floorPlansStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const plans = await getBombShelterFloorPlans(false);
    return NextResponse.json({ success: true, data: plans });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch floor plans." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const newPlan: FloorPlanItem = {
      id: body.id || `fp-${Date.now()}`,
      name: body.name || "Untitled Subterranean Floor Plan",
      category: body.category || "Bomb Shelters",
      sqft: Number(body.sqft) || 400,
      dimensions: body.dimensions || "10' W x 40' L",
      occupancy: body.occupancy || "4-8 People",
      rooms: body.rooms || "Bunkroom, Air filtration bay",
      imageUrl: body.imageUrl || "/images/hillside-bunker.png",
      desc: body.desc || "",
      price: Number(body.price) || 495,
      salePrice: body.salePrice ? Number(body.salePrice) : undefined,
      blastRating: body.blastRating || "Overpressure 3.5 Bar (50 PSI)",
      fileFormat: body.fileFormat || "PDF + CAD",
      status: body.status || "PUBLISHED",
    };

    const saved = await saveBombShelterFloorPlan(newPlan);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create floor plan." },
      { status: 500 }
    );
  }
}

