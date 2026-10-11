import { NextRequest, NextResponse } from "next/server";
import { getVideoByIdOrSlug, getPublishedVideos } from "@/lib/videoStore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const video = await getVideoByIdOrSlug(id);

    if (!video) {
      return NextResponse.json(
        { success: false, message: `Video not found with identifier '${id}'` },
        { status: 404 }
      );
    }

    // Related videos (exclude current video)
    const allPublished = getPublishedVideos();
    const related = allPublished
      .filter((v) => v.id !== video.id && v.youtubeVideoId !== video.youtubeVideoId)
      .slice(0, 3);

    return NextResponse.json({
      success: true,
      video,
      related,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch video" },
      { status: 500 }
    );
  }
}
