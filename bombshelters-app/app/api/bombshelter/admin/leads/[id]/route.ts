import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import {
  updateBombShelterLead,
  deleteBombShelterLead,
  getBombShelterLeads,
} from "@/lib/leadsStore";

export const dynamic = "force-dynamic";

// Strict whitelist update schema — rejects unknown/protected fields (id, source, etc.)
const leadUpdateSchema = z
  .object({
    status: z
      .enum(["NEW", "CONTACTED", "QUALIFIED", "QUOTE_SENT", "FOLLOW_UP", "WON", "LOST"])
      .optional(),
    notes: z.string().max(2000).nullable().optional(),
    phone: z.string().max(30).nullable().optional(),
    project_type: z.string().max(100).nullable().optional(),
    budget: z.string().max(50).nullable().optional(),
    enquiry_details: z.string().max(3000).nullable().optional(),
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
    const validated = leadUpdateSchema.parse(body);

    // Verify lead exists and belongs strictly to BombShelters.com before updating
    const allLeads = await getBombShelterLeads();
    const existing = allLeads.find((l) => l.id === id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Lead not found in BombShelter records." },
        { status: 404 }
      );
    }

    const updated = await updateBombShelterLead(id, validated);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Lead status updated.",
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
      { success: false, message: error?.message || "Failed to update lead." },
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

    // Verify lead exists and belongs strictly to BombShelters.com before deleting
    const allLeads = await getBombShelterLeads();
    const existing = allLeads.find((l) => l.id === id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Lead not found in BombShelter records." },
        { status: 404 }
      );
    }

    await deleteBombShelterLead(id);

    return NextResponse.json({
      success: true,
      message: "Lead record removed.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete lead." },
      { status: 500 }
    );
  }
}
