import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterCollections, saveBombShelterCollection, deleteBombShelterCollection, CollectionItem } from "@/lib/collectionsStore";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const list = await getBombShelterCollections();
    const item = list.find((c) => c.slug === params.id);
    if (!item) {
      return NextResponse.json({ success: false, message: "Collection not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch collection." },
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
    const list = await getBombShelterCollections();
    const existing = list.find((c) => c.slug === params.id);

    const updated: CollectionItem = {
      slug: params.id,
      name: body.name ?? body.title ?? existing?.name ?? "Collection",
      badge: body.badge ?? existing?.badge ?? "FEATURED",
      modelCount: body.modelCount ?? existing?.modelCount ?? "0 Models",
      imageUrl: body.imageUrl ?? body.image_url ?? existing?.imageUrl ?? "/images/hillside-bunker.png",
      description: body.description ?? existing?.description ?? "",
    };

    const saved = await saveBombShelterCollection(updated);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update collection." },
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
    await deleteBombShelterCollection(params.id);
    return NextResponse.json({ success: true, message: "Collection deleted." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete collection." },
      { status: 500 }
    );
  }
}

