import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import {
  updateBombShelterQuotation,
  deleteBombShelterQuotation,
  getBombShelterQuotations,
} from "@/lib/quotationsStore";

export const dynamic = "force-dynamic";

// Strict whitelist update schema — rejects unknown/protected fields (id, source, customer_email, etc.)
const quoteUpdateSchema = z
  .object({
    status: z
      .enum(["DRAFT", "SUBMITTED", "REVIEWED", "APPROVED", "REJECTED"])
      .optional(),
    notes: z.string().max(2000).nullable().optional(),
    estimated_amount: z.number().nonnegative().optional(),
    sq_ft: z.number().positive().nullable().optional(),
    category: z.string().max(100).nullable().optional(),
    specifications: z.record(z.any()).nullable().optional(),
  })
  .strict();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const id = params.id;
    const body = await request.json();

    // Validate with strict whitelist schema to prevent mass assignment
    const validated = quoteUpdateSchema.parse(body);

    const quotes = await getBombShelterQuotations();
    const existing = quotes.find((q) => q.id === id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Quotation not found in BombShelter records." },
        { status: 404 }
      );
    }

    const updated = await updateBombShelterQuotation(id, validated);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Quotation updated.",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Validation error. Mass assignment or unauthorized fields detected.",
            details: error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update quotation." },
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

    const quotes = await getBombShelterQuotations();
    const existing = quotes.find((q) => q.id === id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Quotation not found in BombShelter records." },
        { status: 404 }
      );
    }

    await deleteBombShelterQuotation(id);

    return NextResponse.json({
      success: true,
      message: "Quotation record removed.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete quotation." },
      { status: 500 }
    );
  }
}
