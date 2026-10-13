import { NextRequest, NextResponse } from "next/server";
import { runAutoBlogSync } from "@/lib/autoBlogSync";

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
      {
        success: false,
        error: "Unauthorized: Invalid or missing CRON_SECRET",
      },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    const result = await runAutoBlogSync({ force });

    return NextResponse.json({
      executedAt: new Date().toISOString(),
      ...result,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Auto blog sync endpoint error";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
