import { NextResponse } from "next/server";
import { getBombShelterReviews } from "@/lib/reviewsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reviews = await getBombShelterReviews(true);
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

