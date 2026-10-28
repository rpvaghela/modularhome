import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import {
  getBombShelterSettings,
  updateBombShelterSettings,
} from "@/lib/settingsStore";

export async function GET() {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const settings = await getBombShelterSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const updated = await updateBombShelterSettings(body);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "BombShelters settings saved successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update settings." },
      { status: 500 }
    );
  }
}

