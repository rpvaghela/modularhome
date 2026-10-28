import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterReviews, saveBombShelterReview, BombShelterReview } from "@/lib/reviewsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const reviews = await getBombShelterReviews(false);
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const newReview: BombShelterReview = {
      id: body.id || `rev-${Date.now()}`,
      customer_name: body.customerName || body.customer_name || "Anonymous",
      location: body.location || "",
      rating: Number(body.rating) || 5,
      review_text: body.reviewText || body.review_text || "",
      project_title: body.projectTitle || body.project_title || "",
      image_url: body.imageUrl || body.image_url || "/images/hillside-bunker.png",
      status: body.status || "PUBLISHED",
      is_featured: Boolean(body.isFeatured ?? body.is_featured ?? true),
      display_order: Number(body.displayOrder ?? body.display_order ?? 1),
      created_at: new Date().toISOString(),
    };

    const saved = await saveBombShelterReview(newReview);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create review." },
      { status: 500 }
    );
  }
}

