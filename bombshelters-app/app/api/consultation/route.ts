import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createBombShelterLead } from "@/lib/leadsStore";

export const dynamic = "force-dynamic";

const consultationSchema = z.object({
  fullName: z.string().min(2, "Full name is required (at least 2 characters)"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(10, "Valid 10-digit phone number is required"),
  interest: z.string().min(1, "Please select an interest category"),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validated = consultationSchema.parse(rawBody);

    // Persist strictly to BombShelter's isolated leads storage (Supabase + local)
    // No forwarding to ModularHome backend - prevents duplicate lead ingestion
    const lead = await createBombShelterLead({
      name: validated.fullName,
      email: validated.email,
      phone: validated.phone,
      project_type: validated.interest,
      enquiry_details: `[BombShelters.com Consultation] Selected Interest: ${validated.interest}. Customer Phone: ${validated.phone}`,
      notes: validated.notes || "Inquiry received via BombShelters.com consultation form.",
      status: "NEW",
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: "Your consultation request has been securely recorded. Our defense specialists will contact you shortly.",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to process consultation." },
      { status: 500 }
    );
  }
}
