import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

    const modularHomeUrl =
      process.env.NEXT_PUBLIC_MODULARHOME_API_URL || "http://localhost:3000";

    const payload = {
      name: validated.fullName,
      email: validated.email,
      phone: validated.phone,
      projectType: validated.interest,
      interest: validated.interest,
      source: "BombShelters.com",
      enquiryDetails: `[BombShelters.com Consultation] Selected Interest: ${validated.interest}. Customer Phone: ${validated.phone}`,
      notes: validated.notes || "Inquiry received via BombShelters.com consultation form.",
    };

    let backendResponse: any = null;
    let forwardSuccess = false;

    try {
      const res = await fetch(`${modularHomeUrl}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        backendResponse = await res.json();
        forwardSuccess = true;
      }
    } catch (fetchErr: any) {
      console.warn(
        `[ModularHome Backend Integration] Unable to reach ${modularHomeUrl}/api/leads (${fetchErr?.message}). Falling back to local confirmation mode.`
      );
    }

    return NextResponse.json({
      success: true,
      forwardedToBackend: forwardSuccess,
      backendData: backendResponse,
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
