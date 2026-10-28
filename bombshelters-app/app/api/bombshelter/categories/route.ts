import { NextResponse } from "next/server";
import { CATEGORIES } from "@/data/categories";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    count: CATEGORIES.length,
    data: CATEGORIES,
  });
}
