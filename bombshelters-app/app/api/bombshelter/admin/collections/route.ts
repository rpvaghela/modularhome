import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterCollections, saveBombShelterCollection, CollectionItem } from "@/lib/collectionsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const list = await getBombShelterCollections();
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch collections." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const newCol: CollectionItem = {
      slug: body.slug || body.handle || `col-${Date.now()}`,
      name: body.name || body.title || "Untitled Collection",
      badge: body.badge || "FEATURED",
      modelCount: body.modelCount || "0 Models",
      imageUrl: body.imageUrl || body.image_url || "/images/hillside-bunker.png",
      description: body.description || "",
    };

    const saved = await saveBombShelterCollection(newCol);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create collection." },
      { status: 500 }
    );
  }
}

