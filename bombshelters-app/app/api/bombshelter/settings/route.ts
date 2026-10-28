import { NextResponse } from "next/server";
import { getBombShelterSettings } from "@/lib/settingsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getBombShelterSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch brand settings." },
      { status: 500 }
    );
  }
}
