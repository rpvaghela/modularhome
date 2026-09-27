import { Resend } from "resend";

// Resend Singleton Client
let resendInstance: Resend | null = null;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export function isResendConfigured(): boolean {
  const key = process.env.RESEND_API_KEY?.trim();
  return Boolean(key && key.startsWith("re_") && key.length > 10);
}

export function isResendSandbox(): boolean {
  const from = getDefaultFromEmail();
  return from.includes("onboarding@resend.dev");
}

export function getDefaultFromEmail(): string {
  if (process.env.RESEND_FROM_EMAIL?.trim()) {
    return process.env.RESEND_FROM_EMAIL.trim();
  }
  if (process.env.EMAIL_FROM?.trim()) {
    return process.env.EMAIL_FROM.trim();
  }
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "ModularHome";
  // Resend default sandbox sender for unverified domains
  return `${companyName} <onboarding@resend.dev>`;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  tags?: Array<{ name: string; value: string }>;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Dispatches an email via Resend API with automatic fallbacks, sandbox warnings, and structured error reporting
 */
export async function sendResendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const resend = getResendClient();

  if (!resend) {
    console.warn("⚠️ [Resend] RESEND_API_KEY is not configured. Email logged in simulated mode:", {
      to: options.to,
      subject: options.subject,
    });
    return {
      success: true,
      simulated: true,
      id: `sim_${Date.now()}`,
    };
  }

  const fromAddress = options.from || getDefaultFromEmail();
  const replyToAddress =
    options.replyTo ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    "support@modularhome.com";

  if (fromAddress.includes("onboarding@resend.dev") && process.env.NODE_ENV !== "production") {
    console.info(
      "ℹ️ [Resend Sandbox Mode] Outgoing email sender is set to onboarding@resend.dev. Note that in sandbox mode, Resend only delivers to the primary email registered to the Resend account."
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: replyToAddress,
      cc: options.cc,
      bcc: options.bcc,
      tags: options.tags,
    });

    if (error) {
      console.error("❌ [Resend API Error]:", error.message || error);
      return {
        success: false,
        error: error.message || "Failed to send email via Resend.",
      };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (err: any) {
    console.error("❌ [Resend Exception]:", err?.message || "Unexpected exception during Resend API call.");
    return {
      success: false,
      error: err?.message || "Unexpected exception during Resend API call.",
    };
  }
}

/**
 * Diagnostic test utility to check Resend API key status
 */
export async function verifyResendConnection(): Promise<{
  configured: boolean;
  fromEmail: string;
  isSandbox: boolean;
  apiKeyMasked: string;
  error?: string;
}> {
  const configured = isResendConfigured();
  const key = process.env.RESEND_API_KEY?.trim() || "";
  const apiKeyMasked = key
    ? `${key.substring(0, 7)}...${key.substring(key.length - 4)}`
    : "Not Set";
  const fromEmail = getDefaultFromEmail();
  const isSandbox = fromEmail.includes("onboarding@resend.dev");

  return {
    configured,
    fromEmail,
    isSandbox,
    apiKeyMasked,
  };
}
