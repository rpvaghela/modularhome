import { NextResponse } from "next/server";
import { destroyBombShelterSession } from "@/lib/auth";

export async function POST() {
  await destroyBombShelterSession();
  return NextResponse.json({
    success: true,
    message: "BombShelter admin session terminated.",
  });
}

