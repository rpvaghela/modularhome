import { NextResponse } from "next/server";
import { getBombShelterSession } from "@/lib/auth";

export async function GET() {
  const user = await getBombShelterSession();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { message: "Not authenticated" } },
      { status: 401 }
    );
  }
  return NextResponse.json({
    success: true,
    user,
  });
}

