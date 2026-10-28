import { NextRequest, NextResponse } from "next/server";
import { getBombShelterBlogBySlug } from "@/lib/blogStore";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const blog = await getBombShelterBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: `Article '${slug}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch article." },
      { status: 500 }
    );
  }
}

