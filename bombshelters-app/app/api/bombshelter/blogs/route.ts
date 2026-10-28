import { NextRequest, NextResponse } from "next/server";
import { getBombShelterBlogs } from "@/lib/blogStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    let blogs = await getBombShelterBlogs(true);

    if (tag) {
      blogs = blogs.filter((b) =>
        b.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch survival articles." },
      { status: 500 }
    );
  }
}

