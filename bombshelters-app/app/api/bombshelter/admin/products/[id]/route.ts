import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import {
  getBombShelterProductById,
  saveBombShelterProduct,
  deleteBombShelterProduct,
} from "@/lib/productStore";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const id = params.id;
    const product = await getBombShelterProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Shelter model not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch product." },
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
    const id = params.id;
    const body = await request.json();

    const existing = await getBombShelterProductById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Shelter model not found." },
        { status: 404 }
      );
    }

    const updated = await saveBombShelterProduct({
      ...existing,
      ...body,
      id, // keep slug consistent
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Shelter model updated.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update product." },
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
    const id = params.id;
    const existing = await getBombShelterProductById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Shelter model not found." },
        { status: 404 }
      );
    }

    await deleteBombShelterProduct(id);

    return NextResponse.json({
      success: true,
      message: "Shelter model removed from catalog.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}

