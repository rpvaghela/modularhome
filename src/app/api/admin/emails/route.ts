import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth";
import { getEmailLogs } from "@/lib/emailService";
import { verifyResendConnection } from "@/lib/resend";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminRole(["SUPER_ADMIN", "ADMIN", "SALES"]);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const recipient = searchParams.get("recipient") || undefined;
    const templateType = searchParams.get("templateType") || undefined;

    const logs = await getEmailLogs({ recipient, templateType });
    const connection = await verifyResendConnection();

    return NextResponse.json({
      success: true,
      data: {
        connection,
        logs: logs.slice(0, 100),
        stats: {
          total: logs.length,
          sent: logs.filter((l) => l.status === "SENT").length,
          failed: logs.filter((l) => l.status === "FAILED").length,
          simulated: logs.filter((l) => l.status === "SIMULATED").length,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to fetch email logs." } },
      { status: 500 }
    );
  }
}
