import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterReviews, saveBombShelterReview, deleteBombShelterReview, BombShelterReview } from "@/lib/reviewsStore";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const reviews = await getBombShelterReviews(false);
    const existing = reviews.find((r) => r.id === params.id);

    const updated: BombShelterReview = {
      id: params.id,
      customer_name: body.customerName || body.customer_name || existing?.customer_name || "",
      location: body.location ?? existing?.location,
      rating: Number(body.rating) || existing?.rating || 5,
      review_text: body.reviewText || body.review_text || existing?.review_text || "",
      project_title: body.projectTitle || body.project_title || existing?.project_title,
      image_url: body.imageUrl || body.image_url || existing?.image_url,
      status: body.status || existing?.status || "PUBLISHED",
      is_featured: Boolean(body.isFeatured ?? body.is_featured ?? existing?.is_featured ?? true),
      display_order: Number(body.displayOrder ?? body.display_order ?? existing?.display_order ?? 1),
      created_at: existing?.created_at || new Date().toISOString(),
    };

    const saved = await saveBombShelterReview(updated);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update review." },
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
    await deleteBombShelterReview(params.id);
    return NextResponse.json({ success: true, message: "Review deleted." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete review." },
      { status: 500 }
    );
  }
}

