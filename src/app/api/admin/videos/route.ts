import { NextRequest, NextResponse } from "next/server";
import { 
  getAdminPaginatedVideos, 
  updateVideoCategory, 
  toggleVideoPublish, 
  deleteLocalVideo, 
  upsertVideo, 
  updateVideoSlug,
  readSyncStats,
  readAutoSyncConfig,
  saveAutoSyncConfig
} from "@/lib/videoStore";
import { syncYouTubeChannel } from "@/lib/youtubeService";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10) || 1;
    const limit = parseInt(searchParams.get("limit") || "25", 10) || 25;
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const status = (searchParams.get("status") as any) || "all";

    const paginated = await getAdminPaginatedVideos({ page, limit, category, search, status });
    let stats = readSyncStats();
    let autoSync = readAutoSyncConfig();

    if (isSupabaseConfigured()) {
      try {
        const { data: gs } = await supabaseAdmin
          .from("global_settings")
          .select("custom_scripts")
          .eq("id", "primary")
          .maybeSingle();

        if (gs?.custom_scripts?.video_sync_stats) {
          stats = gs.custom_scripts.video_sync_stats;
        }
        if (gs?.custom_scripts?.youtube_auto_sync_config) {
          autoSync = { ...autoSync, ...gs.custom_scripts.youtube_auto_sync_config };
        }
      } catch (e) {}
    }

    return NextResponse.json(
      {
        success: true,
        stats,
        autoSync,
        count: paginated.totalCount,
        totalCount: paginated.totalCount,
        page: paginated.page,
        limit: paginated.limit,
        totalPages: paginated.totalPages,
        videos: paginated.videos,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch admin videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { action, id, category, isPublished, videoData, slug } = body;

    if (action === "updateSlug") {
      if (!id || !slug) {
        return NextResponse.json({ success: false, message: "ID and Slug are required" }, { status: 400 });
      }
      const res = await updateVideoSlug(id, slug);
      if (!res.success) {
        return NextResponse.json({ success: false, message: res.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: res.message, video: res.video });
    }

    if (action === "updateCategory") {
      if (!id || !category) {
        return NextResponse.json({ success: false, message: "ID and Category are required" }, { status: 400 });
      }
      const updated = updateVideoCategory(id, category);
      return NextResponse.json({ success: updated, message: updated ? "Category updated" : "Video not found" });
    }

    if (action === "togglePublish") {
      if (!id) {
        return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
      }
      const updated = toggleVideoPublish(id, isPublished);
      return NextResponse.json({ success: updated, message: updated ? "Publish status updated" : "Video not found" });
    }

    if (action === "deleteLocal") {
      if (!id) {
        return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
      }
      const deleted = deleteLocalVideo(id);
      return NextResponse.json({ success: deleted, message: deleted ? "Local record removed" : "Video not found" });
    }

    if (action === "updateAutoSync") {
      const current = readAutoSyncConfig();
      const updatedConfig = {
        ...current,
        enabled: body.enabled !== undefined ? Boolean(body.enabled) : current.enabled,
        intervalMinutes: body.intervalMinutes ? Number(body.intervalMinutes) : current.intervalMinutes,
        syncShorts: body.syncShorts !== undefined ? Boolean(body.syncShorts) : current.syncShorts,
        syncScope: body.syncScope || current.syncScope,
      };

      const now = new Date();
      updatedConfig.nextRunAt = new Date(
        now.getTime() + (updatedConfig.intervalMinutes || 60) * 60 * 1000
      ).toISOString();

      saveAutoSyncConfig(updatedConfig);
      return NextResponse.json({
        success: true,
        message: `Auto-sync configuration saved (${updatedConfig.enabled ? "Active" : "Paused"}).`,
        autoSync: updatedConfig,
      });
    }

    if (action === "triggerAutoSync") {
      const current = readAutoSyncConfig();
      const result = await syncYouTubeChannel({
        maxPages: current.syncScope === "full" ? 5 : 2,
        includeAllHistorical: true,
      });

      const now = new Date();
      const nextRun = new Date(
        now.getTime() + (current.intervalMinutes || 60) * 60 * 1000
      ).toISOString();

      const updatedConfig = {
        ...current,
        lastRunAt: now.toISOString(),
        nextRunAt: nextRun,
        lastRunStatus: (result.success ? "success" : "error") as "success" | "error",
        lastRunMessage: result.message,
        history: [
          {
            executedAt: now.toISOString(),
            newVideos: result.newVideosCount || 0,
            updatedVideos: result.updatedVideosCount || 0,
            status: (result.success ? "success" : "error") as "success" | "error",
          },
          ...(current.history || []).slice(0, 9),
        ],
      };
      saveAutoSyncConfig(updatedConfig);

      return NextResponse.json({
        success: result.success,
        message: result.message,
        autoSync: updatedConfig,
        syncResult: result,
      });
    }

    if (action === "upsertManual") {
      if (!videoData || !videoData.youtubeVideoId) {
        return NextResponse.json({ success: false, message: "YouTube Video ID is required" }, { status: 400 });
      }
      const res = upsertVideo(videoData);
      return NextResponse.json({ success: true, isNew: res.isNew, video: res.video });
    }

    return NextResponse.json({ success: false, message: "Invalid action type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Admin video operation failed" },
      { status: 500 }
    );
  }
}
