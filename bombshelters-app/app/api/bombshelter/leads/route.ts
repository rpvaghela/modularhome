import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createBombShelterLead } from "@/lib/leadsStore";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  location: z.string().optional(),
  zip: z.string().optional(),
  project_type: z.string().optional(),
  budget: z.string().optional(),
  enquiry_details: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validated = leadSchema.parse(rawBody);

    const lead = await createBombShelterLead(validated);

    return NextResponse.json({
      success: true,
      data: lead,
      message: "Lead successfully captured.",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to submit lead." },
      { status: 500 }
    );
  }
}

