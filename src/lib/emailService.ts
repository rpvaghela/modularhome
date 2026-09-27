import fs from "fs";
import path from "path";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { EmailLog } from "./customerStore";
import { sendResendEmail, isResendConfigured, getDefaultFromEmail } from "./resend";

const EMAILS_FILE = path.join(process.cwd(), "src", "data", "custom_emails.json");

function ensureEmailFile() {
  if (!fs.existsSync(EMAILS_FILE)) {
    const dir = path.dirname(EMAILS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(EMAILS_FILE, "[]", "utf-8");
  }
}

export async function logEmail(log: Omit<EmailLog, "id" | "created_at">): Promise<EmailLog> {
  const newLog: EmailLog = {
    id: `eml-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...log,
    created_at: new Date().toISOString(),
  };

  ensureEmailFile();
  try {
    const raw = fs.readFileSync(EMAILS_FILE, "utf-8");
    const list: EmailLog[] = JSON.parse(raw) || [];
    list.unshift(newLog);
    fs.writeFileSync(EMAILS_FILE, JSON.stringify(list.slice(0, 3000), null, 2), "utf-8");
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("email_logs").insert(newLog);
    } catch (e) {
      console.warn("Supabase logEmail note:", e);
    }
  }

  return newLog;
}

export async function getEmailLogs(params?: { recipient?: string; templateType?: string }): Promise<EmailLog[]> {
  if (isSupabaseConfigured()) {
    try {
      let query = supabaseAdmin.from("email_logs").select("*").order("created_at", { ascending: false });
      if (params?.recipient) query = query.eq("recipient", params.recipient);
      if (params?.templateType) query = query.eq("template_type", params.templateType);
      const { data, error } = await query;
      if (!error && data) return data as EmailLog[];
    } catch {}
  }

  ensureEmailFile();
  try {
    const raw = fs.readFileSync(EMAILS_FILE, "utf-8");
    let list: EmailLog[] = JSON.parse(raw) || [];
    if (params?.recipient) list = list.filter((l) => l.recipient.toLowerCase() === params.recipient!.toLowerCase());
    if (params?.templateType) list = list.filter((l) => l.template_type === params.templateType);
    return list;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Base Template Elements
// ---------------------------------------------------------------------------

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://modularhome.com";
const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "ModularHome.com";
const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+1 (812) 595-4033";
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@modularhome.com";
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "leads@modularhome.com";

function wrapEmailTemplate(title: string, bodyContent: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr>
            <td style="background-color: #101114; padding: 28px 24px; text-align: center; border-bottom: 3px solid #fcb907;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">
                Modular<span style="color: #fcb907;">Home</span>
              </h1>
              <p style="color: #9ca3af; margin: 6px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                Premium Steel Modular Residences
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px;">
              ${bodyContent}

              <!-- Support Footer -->
              <div style="color: #9ca3af; font-size: 12px; margin-top: 36px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                <p style="margin: 0 0 4px 0; color: #6b7280; font-weight: 600;">Need assistance? Our modular housing specialists are here to help:</p>
                <p style="margin: 0; line-height: 1.6;">
                  📞 ${CONTACT_PHONE} &nbsp;|&nbsp; ✉️ <a href="mailto:${CONTACT_EMAIL}" style="color: #d97706; text-decoration: underline;">${CONTACT_EMAIL}</a>
                </p>
                <p style="margin: 12px 0 0 0; font-size: 11px; color: #9ca3af;">
                  © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ---------------------------------------------------------------------------
// Transactional Email Dispatchers
// ---------------------------------------------------------------------------

/**
 * 1. Sends Email Verification Link
 */
export async function sendVerificationEmail(params: {
  email: string;
  name: string;
  token: string;
  customerId?: string;
}): Promise<boolean> {
  const callbackUrl = `${SITE_URL}/auth/callback?token=${params.token}`;
  const directVerifyUrl = `${SITE_URL}/verify-email?token=${params.token}`;
  const subject = "Verify your ModularHome.com customer account";

  const bodyContent = `
    <h2 style="color: #101114; margin-top: 0; font-size: 22px; font-weight: 800;">
      Welcome, ${params.name || "Valued Customer"}!
    </h2>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
      Thank you for creating your customer account with ModularHome.com. Please confirm your email address to activate your customer portal, unlock instant CAD/PDF blueprint downloads, and track your architectural orders.
    </p>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${callbackUrl}" style="background-color: #fcb907; color: #101114; font-size: 15px; font-weight: 800; padding: 16px 36px; text-decoration: none; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(252, 185, 7, 0.35);">
        Verify Email Address →
      </a>
    </div>

    <!-- Expiration Notice -->
    <div style="background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px; padding: 14px 18px; margin: 24px 0;">
      <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.5;">
        ⏰ <strong>Security Notice:</strong> This verification link will expire in <strong>24 hours</strong>. If you did not create this account, no further action is required.
      </p>
    </div>

    <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
      If the button above does not work, copy and paste this link into your browser:<br/>
      <a href="${directVerifyUrl}" style="color: #d97706; word-break: break-all;">${directVerifyUrl}</a>
    </p>
  `;

  const html = wrapEmailTemplate(subject, bodyContent);
  const text = `Welcome ${params.name || "Customer"}!\n\nPlease verify your ModularHome account by visiting:\n${callbackUrl}\n\nThis link expires in 24 hours.`;

  const result = await sendResendEmail({
    to: params.email,
    subject,
    html,
    text,
    tags: [{ name: "category", value: "verification" }],
  });

  await logEmail({
    recipient: params.email,
    template_type: "EMAIL_VERIFICATION",
    subject,
    customer_id: params.customerId,
    status: result.success ? (result.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      resend_id: result.id,
      error: result.error,
      callbackUrl,
      directVerifyUrl,
      name: params.name,
    },
  });

  return result.success;
}

/**
 * 2. Sends Password Reset Email
 */
export async function sendPasswordResetEmail(params: {
  email: string;
  name: string;
  token: string;
  customerId?: string;
}): Promise<boolean> {
  const resetUrl = `${SITE_URL}/account/reset-password?token=${params.token}`;
  const subject = "Reset your ModularHome.com account password";

  const bodyContent = `
    <h2 style="color: #101114; margin-top: 0; font-size: 22px; font-weight: 800;">
      Password Reset Request
    </h2>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
      Hello ${params.name || "Customer"}, we received a request to reset your password for your ModularHome.com account. Click the button below to choose a new secure password.
    </p>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" style="background-color: #fcb907; color: #101114; font-size: 15px; font-weight: 800; padding: 16px 36px; text-decoration: none; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(252, 185, 7, 0.35);">
        Reset My Password →
      </a>
    </div>

    <!-- Expiration Notice -->
    <div style="background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px; padding: 14px 18px; margin: 24px 0;">
      <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.5;">
        ⏰ <strong>Security Notice:</strong> This link is valid for <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>

    <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
      Or visit directly: <a href="${resetUrl}" style="color: #d97706; word-break: break-all;">${resetUrl}</a>
    </p>
  `;

  const html = wrapEmailTemplate(subject, bodyContent);
  const text = `Hello ${params.name || "Customer"},\n\nReset your password at:\n${resetUrl}\n\nThis link is valid for 1 hour.`;

  const result = await sendResendEmail({
    to: params.email,
    subject,
    html,
    text,
    tags: [{ name: "category", value: "password_reset" }],
  });

  await logEmail({
    recipient: params.email,
    template_type: "PASSWORD_RESET",
    subject,
    customer_id: params.customerId,
    status: result.success ? (result.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      resend_id: result.id,
      error: result.error,
      resetUrl,
      name: params.name,
    },
  });

  return result.success;
}

/**
 * 3. Sends Order Confirmation & Blueprint Download Access
 */
export async function sendOrderConfirmationEmail(params: {
  email: string;
  name: string;
  orderNumber: string;
  orderId?: string;
  customerId?: string;
  amount: number;
  items: Array<{ title: string; price: number; quantity: number }>;
  downloadToken?: string;
}): Promise<boolean> {
  const downloadUrl = params.downloadToken ? `${SITE_URL}/api/downloads/${params.downloadToken}` : `${SITE_URL}/account`;
  const invoiceUrl = params.orderId ? `${SITE_URL}/account/invoices/${params.orderId}` : `${SITE_URL}/account`;
  const subject = `Order Confirmed: ${params.orderNumber} - ModularHome Blueprints`;

  const itemsHtml = params.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #101114; font-weight: 600;">${item.title}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: center; color: #6b7280;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 800; color: #101114;">$${item.price.toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  const bodyContent = `
    <div style="display: inline-block; background: #ecfdf5; color: #065f46; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
      Payment Confirmed
    </div>
    <h2 style="color: #101114; margin-top: 0; font-size: 22px; font-weight: 800;">
      Thank You for Your Order, ${params.name || "Valued Customer"}!
    </h2>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
      Your order <strong>${params.orderNumber}</strong> has been processed successfully. Your architectural blueprint package and CAD drawing assets are ready for instant download.
    </p>

    <!-- Download Blueprint CTA -->
    <div style="text-align: center; margin: 28px 0; background: #fefce8; border: 1px solid #fef08a; border-radius: 12px; padding: 24px;">
      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #854d0e;">
        📐 Instant Blueprint Download Access (Active for 7 Days)
      </p>
      <a href="${downloadUrl}" style="background-color: #fcb907; color: #101114; font-size: 15px; font-weight: 800; padding: 15px 32px; text-decoration: none; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(252, 185, 7, 0.3);">
        Download Architectural Files (.ZIP) →
      </a>
    </div>

    <!-- Order Items Summary Table -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0; border-top: 2px solid #101114;">
      <thead>
        <tr style="text-transform: uppercase; font-size: 11px; color: #6b7280; letter-spacing: 1px;">
          <th style="text-align: left; padding: 10px 0;">Item Description</th>
          <th style="text-align: center; padding: 10px 0;">Qty</th>
          <th style="text-align: right; padding: 10px 0;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr>
          <td colspan="2" style="padding: 16px 0; text-align: right; font-weight: 700; color: #101114; font-size: 15px;">Total Paid:</td>
          <td style="padding: 16px 0; text-align: right; font-weight: 900; color: #101114; font-size: 18px;">$${params.amount.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
      You can also access this order, download your VAT/GST receipt, and manage your account at <a href="${invoiceUrl}" style="color: #d97706; text-decoration: underline;">Your Customer Portal</a>.
    </p>
  `;

  const html = wrapEmailTemplate(subject, bodyContent);
  const text = `Thank you for your order ${params.orderNumber}!\n\nTotal Paid: $${params.amount}\nDownload your blueprints here:\n${downloadUrl}`;

  const result = await sendResendEmail({
    to: params.email,
    subject,
    html,
    text,
    tags: [{ name: "category", value: "order_confirmation" }],
  });

  await logEmail({
    recipient: params.email,
    template_type: "ORDER_CONFIRMATION",
    subject,
    customer_id: params.customerId,
    order_id: params.orderId,
    status: result.success ? (result.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      resend_id: result.id,
      error: result.error,
      orderNumber: params.orderNumber,
      amount: params.amount,
      downloadUrl,
      invoiceUrl,
    },
  });

  return result.success;
}

/**
 * 4. Sends Refund Confirmation Email
 */
export async function sendRefundConfirmationEmail(params: {
  email: string;
  name: string;
  orderNumber: string;
  refundAmount: number;
  reason?: string;
  orderId?: string;
  customerId?: string;
}): Promise<boolean> {
  const subject = `Refund Processed: Order ${params.orderNumber}`;

  const bodyContent = `
    <h2 style="color: #101114; margin-top: 0; font-size: 22px; font-weight: 800;">
      Refund Notification
    </h2>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
      Hello ${params.name || "Customer"}, a refund of <strong>$${params.refundAmount.toLocaleString()}</strong> has been processed for order <strong>${params.orderNumber}</strong>.
    </p>

    <div style="background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px; padding: 16px 20px; margin: 20px 0;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280;"><strong>Refund Amount:</strong> $${params.refundAmount.toLocaleString()}</p>
      ${params.reason ? `<p style="margin: 0; font-size: 13px; color: #6b7280;"><strong>Reason:</strong> ${params.reason}</p>` : ""}
    </div>

    <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
      Depending on your bank, funds typically post to your original payment method in 5-10 business days.
    </p>
  `;

  const html = wrapEmailTemplate(subject, bodyContent);
  const text = `Hello ${params.name || "Customer"},\n\nA refund of $${params.refundAmount} has been processed for order ${params.orderNumber}.`;

  const result = await sendResendEmail({
    to: params.email,
    subject,
    html,
    text,
    tags: [{ name: "category", value: "refund" }],
  });

  await logEmail({
    recipient: params.email,
    template_type: "REFUND_CONFIRMATION",
    subject,
    customer_id: params.customerId,
    order_id: params.orderId,
    status: result.success ? (result.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      resend_id: result.id,
      error: result.error,
      orderNumber: params.orderNumber,
      refundAmount: params.refundAmount,
      reason: params.reason,
    },
  });

  return result.success;
}

/**
 * 5. Sends Lead / Contact Inquiry Notifications (Admin alert + Customer receipt)
 */
export async function sendLeadNotificationEmail(params: {
  leadId?: string;
  name: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  zip?: string | null;
  enquiryDetails?: string | null;
  source?: string;
}): Promise<boolean> {
  // A. Admin notification email
  const adminSubject = `🚨 New Inquiry: ${params.name} (${params.source || "Website"})`;
  const adminBody = `
    <h2 style="color: #101114; margin-top: 0; font-size: 20px; font-weight: 800;">
      New Customer Inquiry Received
    </h2>
    <table role="presentation" width="100%" style="margin: 16px 0; font-size: 14px; color: #374151;">
      <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Name:</td><td>${params.name}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${params.email}" style="color: #d97706;">${params.email}</a></td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${params.phone || "Not provided"}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Location / ZIP:</td><td>${params.location || params.zip || "Not provided"}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Source:</td><td>${params.source || "WEBSITE"}</td></tr>
    </table>
    ${
      params.enquiryDetails
        ? `
      <div style="background: #f8fafc; border-left: 4px solid #fcb907; padding: 14px 18px; margin: 16px 0; border-radius: 6px;">
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e293b;">${params.enquiryDetails}</p>
      </div>
    `
        : ""
    }
    <p style="margin-top: 20px;">
      <a href="${SITE_URL}/admin/leads" style="background: #101114; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: bold;">
        View in Admin CRM →
      </a>
    </p>
  `;

  // Dispatch Admin alert
  await sendResendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: adminSubject,
    html: wrapEmailTemplate(adminSubject, adminBody),
    replyTo: params.email,
  });

  // B. Customer confirmation auto-reply
  const custSubject = `We received your inquiry - ModularHome.com`;
  const custBody = `
    <h2 style="color: #101114; margin-top: 0; font-size: 22px; font-weight: 800;">
      Thank You for Contacting ModularHome, ${params.name}!
    </h2>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
      We have received your project inquiry. One of our regional modular housing specialists will review your requirements and follow up within <strong>24 business hours</strong>.
    </p>

    <div style="background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px; padding: 18px 22px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; font-weight: 700; color: #9ca3af; letter-spacing: 1px;">Summary of Your Inquiry</p>
      <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.5;">${params.enquiryDetails || "Modular home consultation request"}</p>
    </div>

    <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
      In the meantime, feel free to explore our full 2026 catalog of engineered steel modular plans and 3D architectural floor plans on our website.
    </p>
  `;

  const custResult = await sendResendEmail({
    to: params.email,
    subject: custSubject,
    html: wrapEmailTemplate(custSubject, custBody),
  });

  await logEmail({
    recipient: params.email,
    template_type: "LEAD_CONFIRMATION",
    subject: custSubject,
    status: custResult.success ? (custResult.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      lead_id: params.leadId,
      admin_notified: ADMIN_NOTIFICATION_EMAIL,
      resend_id: custResult.id,
    },
  });

  return true;
}

/**
 * 6. Sends Quotation Notifications (Admin alert + Customer quotation summary)
 */
export async function sendQuoteNotificationEmail(params: {
  quoteId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerZip?: string | null;
  modelName: string;
  sqft?: number | null;
  estimatedAmount?: number | null;
  timeline?: string | null;
  requirements?: string | null;
}): Promise<boolean> {
  const adminSubject = `📋 New Quote Request: ${params.customerName} - ${params.modelName} ($${params.estimatedAmount?.toLocaleString() || "Custom"})`;

  const adminBody = `
    <h2 style="color: #101114; margin-top: 0; font-size: 20px; font-weight: 800;">
      New Architectural Quote Submission
    </h2>
    <table role="presentation" width="100%" style="margin: 16px 0; font-size: 14px; color: #374151;">
      <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Customer:</td><td>${params.customerName}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td><a href="mailto:${params.customerEmail}" style="color: #d97706;">${params.customerEmail}</a></td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${params.customerPhone || "N/A"}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Delivery ZIP:</td><td>${params.customerZip || "N/A"}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: bold;">Selected Model:</td><td><strong>${params.modelName}</strong></td></tr>
      ${params.sqft ? `<tr><td style="padding: 6px 0; font-weight: bold;">Square Footage:</td><td>${params.sqft} sq ft</td></tr>` : ""}
      ${params.estimatedAmount ? `<tr><td style="padding: 6px 0; font-weight: bold;">Estimated Budget:</td><td><strong style="color: #15803d; font-size: 16px;">$${params.estimatedAmount.toLocaleString()}</strong></td></tr>` : ""}
      ${params.timeline ? `<tr><td style="padding: 6px 0; font-weight: bold;">Desired Timeline:</td><td>${params.timeline}</td></tr>` : ""}
    </table>
    ${
      params.requirements
        ? `
      <div style="background: #f8fafc; border-left: 4px solid #fcb907; padding: 14px 18px; margin: 16px 0; border-radius: 6px;">
        <p style="margin: 0; font-size: 13px; font-weight: bold; color: #64748b; margin-bottom: 4px;">Custom Requirements & Notes:</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e293b;">${params.requirements}</p>
      </div>
    `
        : ""
    }
  `;

  // Dispatch Admin alert
  await sendResendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: adminSubject,
    html: wrapEmailTemplate(adminSubject, adminBody),
    replyTo: params.customerEmail,
  });

  // Customer confirmation copy
  const custSubject = `Your Modular Home Quote Estimate - ${params.modelName}`;
  const custBody = `
    <h2 style="color: #101114; margin-top: 0; font-size: 22px; font-weight: 800;">
      Your Modular Home Estimate is Ready, ${params.customerName}!
    </h2>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
      Thank you for designing your build with the ModularHome.com Quote Wizard. Below is the summary of your estimate for the <strong>${params.modelName}</strong>.
    </p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin: 20px 0;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 12px;">
        <span style="font-size: 14px; font-weight: 700; color: #101114;">${params.modelName}</span>
        ${params.estimatedAmount ? `<span style="font-size: 20px; font-weight: 900; color: #d97706;">$${params.estimatedAmount.toLocaleString()}</span>` : ""}
      </div>
      ${params.sqft ? `<p style="margin: 4px 0; font-size: 13px; color: #64748b;">📐 Sizing: <strong>${params.sqft} sq ft</strong></p>` : ""}
      ${params.customerZip ? `<p style="margin: 4px 0; font-size: 13px; color: #64748b;">📍 Delivery Region: <strong>ZIP ${params.customerZip}</strong></p>` : ""}
      ${params.timeline ? `<p style="margin: 4px 0; font-size: 13px; color: #64748b;">⏱️ Estimated Timeline: <strong>${params.timeline}</strong></p>` : ""}
    </div>

    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      An engineering advisor will review site conditions, state building codes, and foundation options for your jurisdiction to provide a finalized turnkey proposal.
    </p>
  `;

  const custResult = await sendResendEmail({
    to: params.customerEmail,
    subject: custSubject,
    html: wrapEmailTemplate(custSubject, custBody),
  });

  await logEmail({
    recipient: params.customerEmail,
    template_type: "QUOTE_CONFIRMATION",
    subject: custSubject,
    status: custResult.success ? (custResult.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      quote_id: params.quoteId,
      model: params.modelName,
      amount: params.estimatedAmount,
      resend_id: custResult.id,
    },
  });

  return true;
}

/**
 * 7. Dispatches a Diagnostic Test Email to verify Resend API delivery
 */
export async function sendTestEmail(recipientEmail: string): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const subject = `Resend API Integration Test - ${new Date().toLocaleTimeString()}`;
  const bodyContent = `
    <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
      <h2 style="color: #065f46; margin: 0 0 8px 0; font-size: 20px; font-weight: 800;">
        🎉 Resend API is Fully Connected & Active!
      </h2>
      <p style="color: #047857; margin: 0; font-size: 14px;">
        This test email confirms that your Resend API credentials, templates, and DNS dispatch headers are working correctly.
      </p>
    </div>

    <table role="presentation" width="100%" style="font-size: 13px; color: #4b5563; border-collapse: collapse; margin: 16px 0;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e5e7eb; width: 140px;">Sender Address:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${getDefaultFromEmail()}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Recipient:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${recipientEmail}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Timestamp:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${new Date().toISOString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Site Domain:</td>
        <td style="padding: 8px 0;">${SITE_URL}</td>
      </tr>
    </table>
  `;

  const html = wrapEmailTemplate(subject, bodyContent);
  const result = await sendResendEmail({
    to: recipientEmail,
    subject,
    html,
    text: `Resend API Integration Test successfully delivered to ${recipientEmail} at ${new Date().toISOString()}`,
    tags: [{ name: "category", value: "test" }],
  });

  await logEmail({
    recipient: recipientEmail,
    template_type: "TEST_EMAIL",
    subject,
    status: result.success ? (result.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      resend_id: result.id,
      error: result.error,
    },
  });

  return {
    success: result.success,
    messageId: result.id,
    error: result.error,
  };
}
