import { NextRequest, NextResponse } from "next/server";
import { requireBombShelterAdminAuth } from "@/lib/auth";
import { getBombShelterVideos, saveBombShelterVideo, deleteBombShelterVideo, VideoItem } from "@/lib/videosStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

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

export async function POST(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const newVideo: VideoItem = {
      slug: body.slug || `video-${Date.now()}`,
      title: body.title || "Untitled Video",
      category: body.category || "Tours",
      duration: body.duration || "5:00",
      imageUrl: body.imageUrl || body.thumbnailUrl || "/images/hillside-bunker.png",
      description: body.description || "",
      youtubeId: body.youtubeId || body.videoId || "dQw4w9WgXcQ",
    };

    const saved = await saveBombShelterVideo(newVideo);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to create video." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireBombShelterAdminAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || searchParams.get("id");
    if (!slug) {
      return NextResponse.json({ success: false, message: "Missing slug" }, { status: 400 });
    }
    await deleteBombShelterVideo(slug);
    return NextResponse.json({ success: true, message: "Video deleted." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete video." },
      { status: 500 }
    );
  }
}

