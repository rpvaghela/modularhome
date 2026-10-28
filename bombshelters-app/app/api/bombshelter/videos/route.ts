import { NextResponse } from "next/server";
import { getBombShelterVideos } from "@/lib/videosStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = await getBombShelterVideos();
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch videos." },
      { status: 500 }
    );
  }
}

