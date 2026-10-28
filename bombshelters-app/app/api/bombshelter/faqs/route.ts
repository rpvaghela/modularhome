import { NextResponse } from "next/server";
import { getBombShelterFaqs } from "@/lib/faqsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const faqs = await getBombShelterFaqs(true);
    return NextResponse.json({ success: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch FAQs." },
      { status: 500 }
    );
  }
}
