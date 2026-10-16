import { NextRequest, NextResponse } from "next/server";
import { syncYouTubeChannel } from "@/lib/youtubeService";
import { readAutoSyncConfig, saveAutoSyncConfig } from "@/lib/videoStore";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    // If CRON_SECRET is not configured in the environment, allow execution (e.g. local dev)
    return true;
  }

  const authHeader = request.headers.get("authorization") || "";
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get("secret") === cronSecret || searchParams.get("key") === cronSecret) {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing CRON_SECRET" },
      { status: 401 }
    );
  }

  try {
    const config = readAutoSyncConfig();
    if (!config.enabled) {
      return NextResponse.json({
        message: "Auto-sync is disabled in admin settings.",
        config,
      });
    }

    const result = await syncYouTubeChannel({
      maxPages: config.syncScope === "full" ? 5 : 2,
      includeAllHistorical: true,
    });

    const now = new Date();
    const interval = config.intervalMinutes || 60;
    const nextRun = new Date(now.getTime() + interval * 60 * 1000).toISOString();

    const updatedConfig = {
      ...config,
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
        ...(config.history || []).slice(0, 9),
      ],
    };
    saveAutoSyncConfig(updatedConfig);

    return NextResponse.json({
      cronExecutedAt: now.toISOString(),
      result,
      autoSync: updatedConfig,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Cron execution failed";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
