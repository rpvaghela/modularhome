import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterFaqs, saveBombShelterFaq, BombShelterFaq } from "@/lib/faqsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const faqs = await getBombShelterFaqs(false);
    return NextResponse.json({ success: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch FAQs." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const newFaq: BombShelterFaq = {
      id: body.id || `faq-${Date.now()}`,
      question: body.question || "",
      answer: body.answer || "",
      category: body.category || "General",
      status: body.status || "PUBLISHED",
      display_order: Number(body.displayOrder ?? body.display_order ?? 1),
      created_at: new Date().toISOString(),
    };

    const saved = await saveBombShelterFaq(newFaq);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create FAQ." },
      { status: 500 }
    );
  }
}

