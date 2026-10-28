import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import {
  getBombShelterProducts,
  saveBombShelterProduct,
} from "@/lib/productStore";

const productSchema = z.object({
  id: z.string().min(1, "Identifier/slug is required"),
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Display price is required"),
  rawPrice: z.number().nonnegative(),
  badge: z.object({
    text: z.string(),
    color: z.enum(["green", "gold", "blue", "red", "purple"]),
  }),
  capacity: z.string(),
  specs: z.string(),
  features: z.array(z.string()),
  imageUrl: z.string(),
  category: z.string(),
  description: z.string(),
});

export async function GET(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const products = await getBombShelterProducts(false);
    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to list shelter products." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const validated = productSchema.parse(body);

    const saved = await saveBombShelterProduct(validated);

    return NextResponse.json({
      success: true,
      data: saved,
      message: "Shelter model saved successfully.",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create product." },
      { status: 500 }
    );
  }
}

