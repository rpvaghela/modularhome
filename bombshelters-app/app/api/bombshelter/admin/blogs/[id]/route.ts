import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import {
  getBombShelterBlogBySlug,
  saveBombShelterBlog,
  deleteBombShelterBlog,
} from "@/lib/blogStore";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const id = params.id;
    const blog = await getBombShelterBlogBySlug(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Article not found." },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const id = params.id;
    const body = await request.json();

    const existing = await getBombShelterBlogBySlug(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Article not found." },
        { status: 404 }
      );
    }

    const updated = await saveBombShelterBlog({
      ...existing,
      ...body,
      handle: existing.handle, // keep handle intact
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Article updated.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update article." },
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
    const id = params.id;
    const existing = await getBombShelterBlogBySlug(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Article not found." },
        { status: 404 }
      );
    }

    await deleteBombShelterBlog(id);

    return NextResponse.json({
      success: true,
      message: "Article removed.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete article." },
      { status: 500 }
    );
  }
}

