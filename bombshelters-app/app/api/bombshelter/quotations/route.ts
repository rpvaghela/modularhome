import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createBombShelterQuotation } from "@/lib/quotationsStore";
import { createBombShelterLead } from "@/lib/leadsStore";

const quotationSchema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  customer_email: z.string().email("Valid email is required"),
  customer_phone: z.string().optional(),
  model_name: z.string().min(1, "Bunker model name is required"),
  category: z.string().optional(),
  sq_ft: z.number().positive().optional(),
  estimated_amount: z.number().nonnegative("Estimated amount must be non-negative"),
  specifications: z.record(z.any()).optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validated = quotationSchema.parse(rawBody);

    // 1. Create quotation record
    const quotation = await createBombShelterQuotation(validated);

    // 2. Also record lead entry
    await createBombShelterLead({
      name: validated.customer_name,
      email: validated.customer_email,
      phone: validated.customer_phone,
      project_type: `${validated.model_name} Quotation`,
      budget: `$${validated.estimated_amount.toLocaleString()}`,
      enquiry_details: `Quotation request for ${validated.model_name}${validated.sq_ft ? ` (${validated.sq_ft} sq ft)` : ""}. Estimated: $${validated.estimated_amount.toLocaleString()}`,
      notes: validated.notes || "Generated via BombShelters.com quote calculator.",
      status: "NEW",
    });

    return NextResponse.json({
      success: true,
      data: quotation,
      message: "Quotation request successfully submitted. A defense architect will prepare formal blueprints.",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || "Failed to submit quotation." },
      { status: 500 }
    );
  }
}

