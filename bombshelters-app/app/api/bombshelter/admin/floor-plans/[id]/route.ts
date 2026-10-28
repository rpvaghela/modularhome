import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterFloorPlans, saveBombShelterFloorPlan, deleteBombShelterFloorPlan, FloorPlanItem } from "@/lib/floorPlansStore";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const plans = await getBombShelterFloorPlans(false);
    const plan = plans.find((p) => p.id === params.id);
    if (!plan) {
      return NextResponse.json({ success: false, message: "Floor plan not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: plan });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch floor plan." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const plans = await getBombShelterFloorPlans(false);
    const existing = plans.find((p) => p.id === params.id);

    const updated: FloorPlanItem = {
      id: params.id,
      name: body.name ?? existing?.name ?? "Floor Plan",
      category: body.category ?? existing?.category ?? "Bomb Shelters",
      sqft: Number(body.sqft) || existing?.sqft || 400,
      dimensions: body.dimensions ?? existing?.dimensions ?? "10' W x 40' L",
      occupancy: body.occupancy ?? existing?.occupancy ?? "4-8 People",
      rooms: body.rooms ?? existing?.rooms ?? "",
      imageUrl: body.imageUrl ?? existing?.imageUrl ?? "/images/hillside-bunker.png",
      desc: body.desc ?? existing?.desc ?? "",
      price: Number(body.price) || existing?.price || 495,
      salePrice: body.salePrice ? Number(body.salePrice) : existing?.salePrice,
      blastRating: body.blastRating ?? existing?.blastRating ?? "50 PSI",
      fileFormat: body.fileFormat ?? existing?.fileFormat ?? "PDF + CAD",
      status: body.status ?? existing?.status ?? "PUBLISHED",
    };

    const saved = await saveBombShelterFloorPlan(updated);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update floor plan." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    await deleteBombShelterFloorPlan(params.id);
    return NextResponse.json({ success: true, message: "Floor plan deleted." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete floor plan." },
      { status: 500 }
    );
  }
}

