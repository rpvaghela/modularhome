import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth";
import { sendTestEmail } from "@/lib/emailService";
import { isResendConfigured, getDefaultFromEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json().catch(() => ({}));
    const recipientEmail = (body.email || body.recipient || authResult.email || "").trim();

    if (!recipientEmail || !recipientEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: { message: "A valid recipient email is required to send a test email." } },
        { status: 400 }
      );
    }

    if (!isResendConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "RESEND_API_KEY is not configured in your environment variables (.env).",
          },
        },
        { status: 400 }
      );
    }

    const testResult = await sendTestEmail(recipientEmail);

    if (!testResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: testResult.error || "Resend API rejected the email dispatch request.",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email dispatched successfully to ${recipientEmail} from ${getDefaultFromEmail()}.`,
      data: testResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Internal server error sending test email." } },
      { status: 500 }
    );
  }
}
