import { NextRequest, NextResponse } from "next/server";
import { syncYouTubeChannel } from "@/lib/youtubeService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    let pageToken: string | undefined;
    let maxPages: number | undefined;

    // Check search params
    if (request.nextUrl?.searchParams) {
      pageToken = request.nextUrl.searchParams.get("pageToken") || undefined;
      const mp = request.nextUrl.searchParams.get("maxPages");
      if (mp) maxPages = parseInt(mp, 10);
    }

    // Check body if JSON
    try {
      const body = await request.json();
      if (body) {
        if (body.pageToken) pageToken = body.pageToken;
        if (body.maxPages) maxPages = parseInt(body.maxPages, 10);
      }
    } catch (e) {
      // Body might be empty, ignore
    }

    const result = await syncYouTubeChannel({ pageToken, maxPages });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          stats: result.stats,
          errors: result.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        checkedCount: result.checkedCount,
        newVideosCount: result.newVideosCount,
        updatedVideosCount: result.updatedVideosCount,
        stats: result.stats,
        nextPageToken: result.nextPageToken,
        hasMore: result.hasMore,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to execute YouTube sync.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST({} as NextRequest);
}
