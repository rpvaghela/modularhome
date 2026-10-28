import { NextRequest, NextResponse } from "next/server";
import { getBombShelterProductById } from "@/lib/productStore";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const product = await getBombShelterProductById(slug);

    if (!product) {
      return NextResponse.json(
        { success: false, message: `Bunker model '${slug}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch shelter product." },
      { status: 500 }
    );
  }
}

