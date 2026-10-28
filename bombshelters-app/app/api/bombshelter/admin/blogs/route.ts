import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import {
  getBombShelterBlogs,
  saveBombShelterBlog,
} from "@/lib/blogStore";

const blogSchema = z.object({
  handle: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  summary: z.string().optional(),
  body_html: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image_url: z.string().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const blogs = await getBombShelterBlogs(false);
    return NextResponse.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch blogs." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const validated = blogSchema.parse(body);

    const saved = await saveBombShelterBlog({
      handle: validated.handle,
      title: validated.title,
      summary: validated.summary || "",
      body_html: validated.body_html || "",
      tags: validated.tags || [],
      image_url: validated.image_url || "/images/hero-bunker.png",
      published: validated.published ?? true,
    });

    return NextResponse.json({
      success: true,
      data: saved,
      message: "Article published.",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create article." },
      { status: 500 }
    );
  }
}

