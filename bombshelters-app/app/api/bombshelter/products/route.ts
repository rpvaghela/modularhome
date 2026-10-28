import { NextRequest, NextResponse } from "next/server";
import { getBombShelterProducts } from "@/lib/productStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase();

    let products = await getBombShelterProducts(true);

    if (category) {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.features.some((f) => f.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch shelter products." },
      { status: 500 }
    );
  }
}

