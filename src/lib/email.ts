import { sendResendEmail, getDefaultFromEmail, SendEmailResult } from "./resend";
import { logEmail } from "./emailService";

// ---------------------------------------------------------------------------
// Configuration & Environment Helpers
// ---------------------------------------------------------------------------

export function getAdminEmail(): string {
  return (
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
    "modularhome.admin@gmail.com"
  );
}

export function getSenderEmail(): string {
  if (process.env.EMAIL_FROM?.trim()) {
    return process.env.EMAIL_FROM.trim();
  }
  if (process.env.RESEND_FROM_EMAIL?.trim()) {
    return process.env.RESEND_FROM_EMAIL.trim();
  }
  return getDefaultFromEmail();
}

export function getAppBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.NODE_ENV === "production" ? "https://modularhome.com" : "http://localhost:3000");
  return url.replace(/\/$/, "");
}

// ---------------------------------------------------------------------------
// Base Professional HTML Template Wrapper
// ---------------------------------------------------------------------------

export function wrapNotificationHtml(options: {
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  contentHtml: string;
  actionUrl?: string;
  actionText?: string;
}): string {
  const baseUrl = getAppBaseUrl();
  const badgeColor = options.badgeColor || "#fcb907";
  const badgeTextColor = "#101114";
  const actionUrl = options.actionUrl || `${baseUrl}/admin`;
  const actionText = options.actionText || "Open Admin Portal →";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;" cellspacing="0" cellpadding="0">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #101114; padding: 24px 28px; text-align: left; border-bottom: 3px solid #fcb907;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">
                      Modular<span style="color: #fcb907;">Home</span>
                    </h1>
                    <p style="color: #9ca3af; margin: 4px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">
                      Website Lead Notification
                    </p>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: ${badgeColor}; color: ${badgeTextColor}; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${options.badge}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="color: #101114; margin-top: 0; margin-bottom: 6px; font-size: 20px; font-weight: 800; letter-spacing: -0.3px;">
                ${options.title}
              </h2>
              ${
                options.subtitle
                  ? `<p style="color: #6b7280; margin: 0 0 24px 0; font-size: 14px; line-height: 1.5;">${options.subtitle}</p>`
                  : `<div style="height: 16px;"></div>`
              }

              ${options.contentHtml}

              <!-- Action Button -->
              <div style="text-align: center; margin: 32px 0 16px 0;">
                <a href="${actionUrl}" style="background-color: #101114; color: #ffffff; font-size: 13px; font-weight: 800; padding: 14px 28px; text-decoration: none; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(16,17,20,0.15);">
                  ${actionText}
                </a>
              </div>

              <!-- Admin Quick Reply Tip -->
              <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 10px; padding: 12px 16px; margin-top: 24px;">
                <p style="margin: 0; font-size: 12px; color: #854d0e; line-height: 1.5;">
                  💬 <strong>Direct Reply:</strong> Click <em>Reply</em> in your email client to respond directly to the customer.
                </p>
              </div>

              <!-- Footer -->
              <div style="color: #9ca3af; font-size: 11px; margin-top: 28px; border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
                <p style="margin: 0;">
                  ModularHome.com Automated Admin Alert System • Sent at ${new Date().toUTCString()}
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
// Section Card Helper for Structured HTML Tables
// ---------------------------------------------------------------------------

function formatInfoTable(rows: Array<{ label: string; value: string | number | null | undefined; isHighlight?: boolean; isMono?: boolean }>): string {
  const filteredRows = rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== "");
  if (filteredRows.length === 0) return "";

  const rowsHtml = filteredRows
    .map(
      (r) => `
    <tr>
      <td style="padding: 9px 12px; border-bottom: 1px solid #f0f2f5; font-size: 13px; font-weight: 700; color: #4b5563; width: 38%; vertical-align: top;">
        ${r.label}
      </td>
      <td style="padding: 9px 12px; border-bottom: 1px solid #f0f2f5; font-size: 13px; ${
        r.isHighlight
          ? "color: #b45309; font-weight: 800; font-size: 14px;"
          : r.isMono
          ? "font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #111827; font-weight: 600;"
          : "color: #111827;"
      } vertical-align: top;">
        ${r.value}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background: #fafafa; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin: 16px 0;">
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}

function formatTextBox(title: string, text: string | null | undefined, borderColor = "#fcb907"): string {
  if (!text || !text.trim()) return "";
  return `
    <div style="background: #ffffff; border-left: 4px solid ${borderColor}; border-top: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 18px; margin: 16px 0;">
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-bottom: 6px;">
        ${title}
      </div>
      <div style="font-size: 13px; color: #1f2937; line-height: 1.6; white-space: pre-wrap;">${text}</div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Logged-in Customer Resolution Helper
// ---------------------------------------------------------------------------

export interface UserAccountContext {
  userId?: string | null;
  accountEmail?: string | null;
  accountName?: string | null;
  isAuthenticated?: boolean;
}

function buildCustomerContextSection(userContext?: UserAccountContext): string {
  if (!userContext?.userId && !userContext?.accountEmail && !userContext?.isAuthenticated) {
    return `
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 14px; margin: 16px 0; font-size: 12px; color: #6b7280;">
        👤 <strong>Customer Status:</strong> Guest Visitor (Not Signed In)
      </div>
    `;
  }

  return `
    <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px 16px; margin: 16px 0;">
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #065f46; letter-spacing: 1px; margin-bottom: 4px;">
        ✓ Authenticated Customer Account
      </div>
      <div style="font-size: 12px; color: #047857; line-height: 1.5;">
        <strong>Account Name:</strong> ${userContext.accountName || "Registered User"}<br/>
        <strong>Account Email:</strong> ${userContext.accountEmail || "N/A"}<br/>
        <strong>Customer ID:</strong> <span style="font-family: monospace;">${userContext.userId || "N/A"}</span>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 1. CONTACT FORM NOTIFICATION
// ---------------------------------------------------------------------------

export interface ContactLeadNotificationParams {
  leadId?: string;
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  zip?: string | null;
  location?: string | null;
  projectType?: string | null;
  budget?: string | null;
  message?: string | null;
  submissionDate?: string;
  source?: string;
  userContext?: UserAccountContext;
}

export async function sendLeadNotification(params: ContactLeadNotificationParams): Promise<SendEmailResult> {
  const adminEmail = getAdminEmail();
  const replyToEmail = params.userContext?.accountEmail || params.email;
  const submissionDate = params.submissionDate || new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const subject = `New Contact Lead — ${params.name}`;

  const contentHtml = `
    ${buildCustomerContextSection(params.userContext)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Customer Contact Information
    </div>
    ${formatInfoTable([
      { label: "Full Name", value: params.name },
      { label: "Email Address", value: params.email },
      { label: "Phone Number", value: params.phone || "Not Provided" },
      { label: "City / Region", value: params.city || params.location || "Not Provided" },
      { label: "ZIP Code", value: params.zip || "Not Provided" },
      { label: "Building Interest", value: params.projectType || "Modular Homes", isHighlight: true },
      { label: "Estimated Budget", value: params.budget || "Not Specified" },
    ])}

    ${formatTextBox("Customer Message & Requirements", params.message)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Submission Metadata
    </div>
    ${formatInfoTable([
      { label: "Lead Reference ID", value: params.leadId || "N/A", isMono: true },
      { label: "Source Form", value: params.source || "CONTACT_FORM" },
      { label: "Submission Date", value: submissionDate },
    ])}
  `;

  const html = wrapNotificationHtml({
    badge: "Contact Lead",
    badgeColor: "#fcb907",
    title: `New Project Inquiry from ${params.name}`,
    subtitle: `A new customer consultation request has been submitted through the website.`,
    contentHtml,
    actionUrl: `${getAppBaseUrl()}/admin/leads`,
    actionText: "Manage Lead in Admin CRM →",
  });

  const result = await sendResendEmail({
    to: adminEmail,
    subject,
    html,
    replyTo: replyToEmail,
    tags: [
      { name: "type", value: "contact_lead" },
      { name: "source", value: params.source || "contact_form" },
    ],
  });

  if (result.success) {
    console.log(`[Admin Notification]: SUCCESS (type=CONTACT_LEAD, leadId=${params.leadId || "N/A"}, to=${adminEmail}, replyTo=${replyToEmail})`);
  } else {
    console.warn(`[Admin Notification]: FAILED (type=CONTACT_LEAD, leadId=${params.leadId || "N/A"}, error=${result.error})`);
  }

  await logEmail({
    recipient: adminEmail,
    template_type: "ADMIN_CONTACT_LEAD",
    subject,
    status: result.success ? (result.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      lead_id: params.leadId,
      customer_name: params.name,
      customer_email: params.email,
      reply_to: replyToEmail,
      resend_id: result.id,
      error: result.error,
    },
  });

  return result;
}

// ---------------------------------------------------------------------------
// 2. QUOTE WIZARD NOTIFICATION
// ---------------------------------------------------------------------------

export interface QuoteWizardNotificationParams {
  quoteId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerZip?: string | null;
  builtUpArea?: number | string | null;
  floors?: number | string | null;
  structureType?: string | null;
  finishQuality?: string | null;
  selectedAddons?: Array<{ name: string; price?: number }> | string[] | null;
  estimatedPrice?: number | string | null;
  modelName?: string | null;
  modelSlug?: string | null;
  timeline?: string | null;
  requirements?: string | null;
  submissionDate?: string;
  source?: string;
  userContext?: UserAccountContext;
}

export async function sendQuoteNotification(params: QuoteWizardNotificationParams): Promise<SendEmailResult> {
  const adminEmail = getAdminEmail();
  const replyToEmail = params.userContext?.accountEmail || params.customerEmail;
  const submissionDate = params.submissionDate || new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const subject = `New Quote Request — ${params.customerName}`;

  let addonsListText = "None Selected";
  if (Array.isArray(params.selectedAddons) && params.selectedAddons.length > 0) {
    addonsListText = params.selectedAddons
      .map((a) => (typeof a === "string" ? a : `${a.name}${a.price ? ` (+$${a.price.toLocaleString()})` : ""}`))
      .join(", ");
  }

  const formattedPrice =
    typeof params.estimatedPrice === "number"
      ? `$${params.estimatedPrice.toLocaleString()}`
      : params.estimatedPrice || "Custom Quote";

  const contentHtml = `
    ${buildCustomerContextSection(params.userContext)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Customer Contact Details
    </div>
    ${formatInfoTable([
      { label: "Customer Name", value: params.customerName },
      { label: "Email Address", value: params.customerEmail },
      { label: "Phone Number", value: params.customerPhone || "Not Provided" },
      { label: "Delivery ZIP Code", value: params.customerZip || "Not Provided" },
      { label: "Target Timeline", value: params.timeline || "Not Specified" },
    ])}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Architectural & Build Specifications
    </div>
    ${formatInfoTable([
      { label: "Selected Model", value: params.modelName || "Custom Configuration", isHighlight: true },
      { label: "Built-up Area", value: params.builtUpArea ? `${params.builtUpArea} SQ FT` : null },
      { label: "Structure / Framing", value: params.structureType || "Precision Cold-Formed Steel" },
      { label: "Stories / Floors", value: params.floors ? `${params.floors} Story` : null },
      { label: "Finish Quality", value: params.finishQuality || "Standard Turnkey" },
      { label: "Selected Add-ons", value: addonsListText },
      { label: "Calculated Estimate", value: formattedPrice, isHighlight: true },
    ])}

    ${formatTextBox("Special Requests & Site Notes", params.requirements)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Submission Details
    </div>
    ${formatInfoTable([
      { label: "Quote ID", value: params.quoteId || "N/A", isMono: true },
      { label: "Source", value: params.source || "QUOTE_WIZARD" },
      { label: "Date Submitted", value: submissionDate },
    ])}
  `;

  const html = wrapNotificationHtml({
    badge: "Quote Request",
    badgeColor: "#fcb907",
    title: `New Architectural Estimate for ${params.customerName}`,
    subtitle: `A new modular home estimate has been generated via the Interactive Quote Wizard.`,
    contentHtml,
    actionUrl: `${getAppBaseUrl()}/admin/quotations`,
    actionText: "View Quotations in Admin →",
  });

  const result = await sendResendEmail({
    to: adminEmail,
    subject,
    html,
    replyTo: replyToEmail,
    tags: [
      { name: "type", value: "quote_request" },
      { name: "source", value: params.source || "quote_wizard" },
    ],
  });

  if (result.success) {
    console.log(`[Admin Notification]: SUCCESS (type=QUOTE_REQUEST, quoteId=${params.quoteId || "N/A"}, to=${adminEmail}, replyTo=${replyToEmail})`);
  } else {
    console.warn(`[Admin Notification]: FAILED (type=QUOTE_REQUEST, quoteId=${params.quoteId || "N/A"}, error=${result.error})`);
  }

  await logEmail({
    recipient: adminEmail,
    template_type: "ADMIN_QUOTE_REQUEST",
    subject,
    status: result.success ? (result.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      quote_id: params.quoteId,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      reply_to: replyToEmail,
      model: params.modelName,
      amount: params.estimatedPrice,
      resend_id: result.id,
      error: result.error,
    },
  });

  return result;
}

// ---------------------------------------------------------------------------
// 3. QUICK ESTIMATE NOTIFICATION (HOMEPAGE & STEPS FORM)
// ---------------------------------------------------------------------------

export interface QuickEstimateNotificationParams {
  quoteId?: string;
  name: string;
  email: string;
  phone?: string | null;
  state?: string | null;
  homeType?: string | null;
  budget?: string | null;
  details?: string | null;
  fileName?: string | null;
  submissionDate?: string;
  source?: string;
  userContext?: UserAccountContext;
}

export async function sendEstimateNotification(params: QuickEstimateNotificationParams): Promise<SendEmailResult> {
  const adminEmail = getAdminEmail();
  const replyToEmail = params.userContext?.accountEmail || params.email;
  const submissionDate = params.submissionDate || new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const subject = `New Estimate Request — ${params.name}`;

  const contentHtml = `
    ${buildCustomerContextSection(params.userContext)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Customer Contact Details
    </div>
    ${formatInfoTable([
      { label: "Customer Name", value: params.name },
      { label: "Email Address", value: params.email },
      { label: "Phone Number", value: params.phone || "Not Provided" },
      { label: "Target State / Location", value: params.state || "Not Specified" },
    ])}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Project Preferences
    </div>
    ${formatInfoTable([
      { label: "Home / Structure Type", value: params.homeType || "Modular Home", isHighlight: true },
      { label: "Target Budget Range", value: params.budget || "Not Specified", isHighlight: true },
      { label: "Attached Blueprint / Sketch", value: params.fileName ? `📁 ${params.fileName}` : "No file attached" },
    ])}

    ${formatTextBox("Project Details & Requirements", params.details)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Submission Details
    </div>
    ${formatInfoTable([
      { label: "Reference ID", value: params.quoteId || "N/A", isMono: true },
      { label: "Source", value: params.source || "HOMEPAGE_QUOTE" },
      { label: "Date Submitted", value: submissionDate },
    ])}
  `;

  const html = wrapNotificationHtml({
    badge: "Quick Estimate",
    badgeColor: "#fcb907",
    title: `New Quick Estimate Request from ${params.name}`,
    subtitle: `A quick project quote form has been submitted on the homepage.`,
    contentHtml,
    actionUrl: `${getAppBaseUrl()}/admin/quotations`,
    actionText: "Open Quotations Desk →",
  });

  const result = await sendResendEmail({
    to: adminEmail,
    subject,
    html,
    replyTo: replyToEmail,
    tags: [
      { name: "type", value: "quick_estimate" },
      { name: "source", value: params.source || "homepage_quote" },
    ],
  });

  if (result.success) {
    console.log(`[Admin Notification]: SUCCESS (type=QUICK_ESTIMATE, quoteId=${params.quoteId || "N/A"}, to=${adminEmail}, replyTo=${replyToEmail})`);
  } else {
    console.warn(`[Admin Notification]: FAILED (type=QUICK_ESTIMATE, quoteId=${params.quoteId || "N/A"}, error=${result.error})`);
  }

  await logEmail({
    recipient: adminEmail,
    template_type: "ADMIN_QUICK_ESTIMATE",
    subject,
    status: result.success ? (result.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      quote_id: params.quoteId,
      customer_name: params.name,
      customer_email: params.email,
      reply_to: replyToEmail,
      home_type: params.homeType,
      budget: params.budget,
      resend_id: result.id,
      error: result.error,
    },
  });

  return result;
}

// ---------------------------------------------------------------------------
// 4. CUSTOM FLOOR PLAN UPLOAD NOTIFICATION
// ---------------------------------------------------------------------------

export interface FloorPlanUploadNotificationParams {
  quoteId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerZip?: string | null;
  plotDimensions?: string | null;
  approximateSqFt?: number | string | null;
  requirements?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
  fileSize?: string | null;
  submissionDate?: string;
  source?: string;
  userContext?: UserAccountContext;
}

export async function sendFloorPlanNotification(params: FloorPlanUploadNotificationParams): Promise<SendEmailResult> {
  const adminEmail = getAdminEmail();
  const replyToEmail = params.userContext?.accountEmail || params.customerEmail;
  const submissionDate = params.submissionDate || new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const subject = `New Floor Plan Request — ${params.customerName}`;

  const contentHtml = `
    ${buildCustomerContextSection(params.userContext)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Customer Contact Information
    </div>
    ${formatInfoTable([
      { label: "Customer Name", value: params.customerName },
      { label: "Email Address", value: params.customerEmail },
      { label: "Phone Number", value: params.customerPhone || "Not Provided" },
      { label: "Build Site ZIP Code", value: params.customerZip || "Not Provided" },
      { label: "Target Square Footage", value: params.approximateSqFt ? `${params.approximateSqFt} SQ FT` : "Custom" },
      { label: "Plot Dimensions", value: params.plotDimensions || "Not Specified" },
    ])}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Uploaded Blueprint Document
    </div>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin: 16px 0;">
      <div style="font-weight: 800; font-size: 14px; color: #166534; margin-bottom: 4px;">
        📐 Custom Floor Plan Uploaded
      </div>
      <div style="font-size: 12px; color: #15803d; line-height: 1.6;">
        <strong>File Name:</strong> ${params.fileName || "Custom Blueprint Document"}<br/>
        ${params.fileSize ? `<strong>File Size:</strong> ${params.fileSize}<br/>` : ""}
        ${
          params.fileUrl
            ? `<a href="${params.fileUrl}" target="_blank" style="color: #15803d; font-weight: bold; text-decoration: underline;">View Uploaded Blueprint File →</a>`
            : `<em>File reference stored in database record.</em>`
        }
      </div>
    </div>

    ${formatTextBox("Architectural Requirements & Project Notes", params.requirements)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Submission Details
    </div>
    ${formatInfoTable([
      { label: "Reference ID", value: params.quoteId || "N/A", isMono: true },
      { label: "Source", value: params.source || "FLOOR_PLAN_UPLOAD" },
      { label: "Submission Date", value: submissionDate },
    ])}
  `;

  const html = wrapNotificationHtml({
    badge: "Custom Blueprint",
    badgeColor: "#fcb907",
    title: `Custom Floor Plan Blueprint from ${params.customerName}`,
    subtitle: `A customer has uploaded an architectural CAD/PDF plan for factory structural review and cost estimating.`,
    contentHtml,
    actionUrl: `${getAppBaseUrl()}/admin/quotations`,
    actionText: "Review Plan in Admin →",
  });

  const result = await sendResendEmail({
    to: adminEmail,
    subject,
    html,
    replyTo: replyToEmail,
    tags: [
      { name: "type", value: "floor_plan_upload" },
      { name: "source", value: params.source || "floor_plan_upload" },
    ],
  });

  if (result.success) {
    console.log(`[Admin Notification]: SUCCESS (type=FLOOR_PLAN_UPLOAD, quoteId=${params.quoteId || "N/A"}, to=${adminEmail}, replyTo=${replyToEmail})`);
  } else {
    console.warn(`[Admin Notification]: FAILED (type=FLOOR_PLAN_UPLOAD, quoteId=${params.quoteId || "N/A"}, error=${result.error})`);
  }

  await logEmail({
    recipient: adminEmail,
    template_type: "ADMIN_FLOOR_PLAN_UPLOAD",
    subject,
    status: result.success ? (result.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      quote_id: params.quoteId,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      reply_to: replyToEmail,
      file_name: params.fileName,
      resend_id: result.id,
      error: result.error,
    },
  });

  return result;
}

// ---------------------------------------------------------------------------
// 5. FLOOR PLAN CHECKOUT / CART ORDER NOTIFICATION
// ---------------------------------------------------------------------------

export interface CheckoutNotificationParams {
  orderId?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerZip?: string | null;
  deliveryAddress?: string | null;
  items: Array<{
    title: string;
    id?: string;
    quantity: number;
    price: number;
    variant?: string;
  }>;
  totalAmount: number;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  paymentOption?: string;
  paymentStatus?: string;
  inquiryNote?: string | null;
  submissionDate?: string;
  source?: string;
  userContext?: UserAccountContext;
}

export async function sendCheckoutNotification(params: CheckoutNotificationParams): Promise<SendEmailResult> {
  const adminEmail = getAdminEmail();
  const replyToEmail = params.userContext?.accountEmail || params.customerEmail;
  const submissionDate = params.submissionDate || new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const subject = `New Floor Plan Checkout — ${params.customerName}`;

  const itemsRowsHtml = params.items
    .map(
      (i) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-weight: 700; color: #101114;">
        ${i.title}${i.variant ? ` <span style="font-weight: normal; color: #6b7280;">(${i.variant})</span>` : ""}
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #4b5563;">
        ${i.quantity}
      </td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 800; color: #101114;">
        $${(i.price * i.quantity).toLocaleString()}
      </td>
    </tr>
  `
    )
    .join("");

  const contentHtml = `
    ${buildCustomerContextSection(params.userContext)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Purchaser Details
    </div>
    ${formatInfoTable([
      { label: "Customer Name", value: params.customerName },
      { label: "Email Address", value: params.customerEmail },
      { label: "Phone Number", value: params.customerPhone || "Not Provided" },
      { label: "Delivery ZIP Code", value: params.customerZip || "Not Provided" },
      { label: "Delivery Address", value: params.deliveryAddress },
      { label: "Payment Status", value: params.paymentStatus || "PENDING / INITIATED", isHighlight: true },
      { label: "Payment Method", value: params.paymentOption || "Stripe Checkout" },
    ])}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Purchased Blueprint Packages
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin: 12px 0; font-size: 13px;">
      <thead>
        <tr style="background: #f9fafb; border-bottom: 2px solid #101114; font-size: 11px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px;">
          <th style="padding: 8px 12px; text-align: left;">Item</th>
          <th style="padding: 8px 12px; text-align: center;">Qty</th>
          <th style="padding: 8px 12px; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRowsHtml}
        <tr>
          <td colspan="2" style="padding: 12px; text-align: right; font-weight: 800; color: #101114; font-size: 14px;">Total Order Value:</td>
          <td style="padding: 12px; text-align: right; font-weight: 900; color: #d97706; font-size: 16px;">$${params.totalAmount.toLocaleString()} USD</td>
        </tr>
      </tbody>
    </table>

    ${formatTextBox("Inquiry Notes & Special Instructions", params.inquiryNote)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Order Reference Details
    </div>
    ${formatInfoTable([
      { label: "Order Number", value: params.orderNumber, isMono: true },
      { label: "Order Database ID", value: params.orderId || "N/A", isMono: true },
      { label: "Submission Date", value: submissionDate },
    ])}
  `;

  const html = wrapNotificationHtml({
    badge: "Order Checkout",
    badgeColor: "#10b981",
    title: `New Blueprint Checkout: ${params.orderNumber}`,
    subtitle: `${params.customerName} has initiated or completed an architectural blueprint purchase.`,
    contentHtml,
    actionUrl: `${getAppBaseUrl()}/admin/customers`,
    actionText: "View Order in Admin →",
  });

  const result = await sendResendEmail({
    to: adminEmail,
    subject,
    html,
    replyTo: replyToEmail,
    tags: [
      { name: "type", value: "checkout_order" },
      { name: "order_number", value: params.orderNumber },
    ],
  });

  if (result.success) {
    console.log(`[Admin Notification]: SUCCESS (type=CHECKOUT_ORDER, orderNumber=${params.orderNumber}, to=${adminEmail}, replyTo=${replyToEmail})`);
  } else {
    console.warn(`[Admin Notification]: FAILED (type=CHECKOUT_ORDER, orderNumber=${params.orderNumber}, error=${result.error})`);
  }

  await logEmail({
    recipient: adminEmail,
    template_type: "ADMIN_CHECKOUT_NOTIFICATION",
    subject,
    status: result.success ? (result.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      order_number: params.orderNumber,
      order_id: params.orderId,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      reply_to: replyToEmail,
      total_amount: params.totalAmount,
      resend_id: result.id,
      error: result.error,
    },
  });

  return result;
}

// ---------------------------------------------------------------------------
// 6. AI BUILD ASSISTANT NOTIFICATION
// ---------------------------------------------------------------------------

export interface AIAssistantLeadNotificationParams {
  leadId?: string;
  name?: string;
  email: string;
  phone?: string | null;
  projectPreferences?: string | null;
  budget?: string | null;
  dimensions?: string | null;
  aiRecommendations?: string | null;
  estimatedResult?: string | null;
  conversationTranscript?: string | null;
  submissionDate?: string;
  userContext?: UserAccountContext;
}

export async function sendAIChatLeadNotification(params: AIAssistantLeadNotificationParams): Promise<SendEmailResult> {
  const adminEmail = getAdminEmail();
  const customerName = params.name || "AI Chat Prospect";
  const replyToEmail = params.userContext?.accountEmail || params.email;
  const submissionDate = params.submissionDate || new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const subject = `New AI Build Request — ${customerName}`;

  const contentHtml = `
    ${buildCustomerContextSection(params.userContext)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Prospect Contact Details
    </div>
    ${formatInfoTable([
      { label: "Prospect Name", value: customerName },
      { label: "Email Address", value: params.email },
      { label: "Phone Number", value: params.phone || "Not Provided" },
    ])}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      AI Building Consultation Summary
    </div>
    ${formatInfoTable([
      { label: "Project Preferences", value: params.projectPreferences || "Modular / Prefab Residence", isHighlight: true },
      { label: "Estimated Budget", value: params.budget || "Not Specified" },
      { label: "Dimensions / Sizing", value: params.dimensions || "Not Specified" },
      { label: "AI Recommendation", value: params.aiRecommendations || params.estimatedResult || "Standard Modular Recommendation" },
    ])}

    ${formatTextBox("Conversation Transcript Snippet", params.conversationTranscript)}

    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 18px;">
      Submission Details
    </div>
    ${formatInfoTable([
      { label: "Lead ID", value: params.leadId || "N/A", isMono: true },
      { label: "Source", value: "AI_BUILD_ASSISTANT" },
      { label: "Submission Date", value: submissionDate },
    ])}
  `;

  const html = wrapNotificationHtml({
    badge: "AI Chat Lead",
    badgeColor: "#a855f7",
    title: `AI Build Assistant Lead: ${customerName}`,
    subtitle: `A customer engaged with the AI Housing Advisor and provided contact details for architectural follow-up.`,
    contentHtml,
    actionUrl: `${getAppBaseUrl()}/admin/leads`,
    actionText: "View CRM Lead →",
  });

  const result = await sendResendEmail({
    to: adminEmail,
    subject,
    html,
    replyTo: replyToEmail,
    tags: [
      { name: "type", value: "ai_chat_lead" },
      { name: "source", value: "ai_build_assistant" },
    ],
  });

  if (result.success) {
    console.log(`[Admin Notification]: SUCCESS (type=AI_CHAT_LEAD, leadId=${params.leadId || "N/A"}, to=${adminEmail}, replyTo=${replyToEmail})`);
  } else {
    console.warn(`[Admin Notification]: FAILED (type=AI_CHAT_LEAD, leadId=${params.leadId || "N/A"}, error=${result.error})`);
  }

  await logEmail({
    recipient: adminEmail,
    template_type: "ADMIN_AI_CHAT_LEAD",
    subject,
    status: result.success ? (result.simulated ? "SIMULATED" : "SENT") : "FAILED",
    metadata: {
      lead_id: params.leadId,
      customer_name: customerName,
      customer_email: params.email,
      reply_to: replyToEmail,
      resend_id: result.id,
      error: result.error,
    },
  });

  return result;
}
