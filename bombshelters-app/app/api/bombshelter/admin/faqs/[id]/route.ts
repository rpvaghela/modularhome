import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterFaqs, saveBombShelterFaq, deleteBombShelterFaq, BombShelterFaq } from "@/lib/faqsStore";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const faqs = await getBombShelterFaqs(false);
    const existing = faqs.find((f) => f.id === params.id);

    const updated: BombShelterFaq = {
      id: params.id,
      question: body.question ?? existing?.question ?? "",
      answer: body.answer ?? existing?.answer ?? "",
      category: body.category ?? existing?.category ?? "General",
      status: body.status ?? existing?.status ?? "PUBLISHED",
      display_order: Number(body.displayOrder ?? body.display_order ?? existing?.display_order ?? 1),
      created_at: existing?.created_at || new Date().toISOString(),
    };

    const saved = await saveBombShelterFaq(updated);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update FAQ." },
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
    await deleteBombShelterFaq(params.id);
    return NextResponse.json({ success: true, message: "FAQ deleted." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete FAQ." },
      { status: 500 }
    );
  }
}

