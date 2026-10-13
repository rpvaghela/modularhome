import { NextRequest, NextResponse } from "next/server";
import { getPublishedVideos, getPaginatedVideos } from "@/lib/videoStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || searchParams.get("q") || undefined;
    const all = searchParams.get("all") === "true";

    if (all) {
      const videos = getPublishedVideos({ category, search });
      return NextResponse.json(
        {
          success: true,
          count: videos.length,
          videos,
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }

    const page = parseInt(searchParams.get("page") || "1", 10) || 1;
    const limit = parseInt(searchParams.get("limit") || "12", 10) || 12;

    const result = await getPaginatedVideos({
      page,
      limit,
      category,
      search,
    });

    return NextResponse.json(
      {
        success: true,
        count: result.totalCount,
        totalCount: result.totalCount,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        categoryCounts: result.categoryCounts,
        videos: result.videos,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
