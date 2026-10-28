import { NextResponse } from "next/server";
import { getBombShelterCollections } from "@/lib/collectionsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = await getBombShelterCollections();
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch collections." },
      { status: 500 }
    );
  }
}

