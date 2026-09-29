import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { logActivity } from "@/lib/activityLog";
import { getPublicGlobalSettings, writeSettingsToStore } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    let dbSettings: any = null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from("global_settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          dbSettings = data;
        }
      } catch (dbErr) {
        console.warn("Supabase fetch global_settings warning:", dbErr);
      }
    }

    const currentSettings = await getPublicGlobalSettings();

    const fullResponse = {
      ...currentSettings,
      id: dbSettings?.id || "primary",
      headerNavigation: dbSettings?.header_navigation || currentSettings.navLinks,
      footerNavigation: dbSettings?.footer_navigation || currentSettings.footerLinks,
      footerColumns: dbSettings?.footer_columns || [],
      headerVisibility: dbSettings?.header_visibility || {
        showAnnouncement: currentSettings.announcementEnabled,
        showCta: true,
        showPhone: true,
        showSearch: true,
      },
      copyrightText: dbSettings?.copyright_text || "© 2026 ModularHome.com. All rights reserved.",
    };

    return NextResponse.json({
      success: true,
      data: fullResponse,
    });
  } catch (error: any) {
    console.error("Error fetching global settings:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to retrieve settings.", code: "DB_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();

    const parseJson = (val: any) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    };

    const updatePayload: Record<string, any> = {
      id: "primary",
      updated_at: new Date().toISOString(),
    };

    if (body.companyName !== undefined || body.company_name !== undefined) {
      updatePayload.company_name = body.companyName || body.company_name;
    }
    if (body.logoUrl !== undefined || body.logo_url !== undefined) {
      updatePayload.logo_url = body.logoUrl || body.logo_url;
    }
    if (body.faviconUrl !== undefined || body.favicon_url !== undefined) {
      updatePayload.favicon_url = body.faviconUrl || body.favicon_url;
    }
    if (body.phone !== undefined) updatePayload.phone = body.phone;
    if (body.email !== undefined) updatePayload.email = body.email;
    if (body.address !== undefined) updatePayload.address = body.address;
    if (body.socialLinks !== undefined || body.social_links !== undefined) {
      updatePayload.social_links = parseJson(body.socialLinks || body.social_links);
    }
    if (body.announcementEnabled !== undefined || body.announcement_enabled !== undefined) {
      updatePayload.announcement_enabled = (body.announcementEnabled ?? body.announcement_enabled) !== false;
    }
    if (body.announcementText !== undefined || body.announcement_text !== undefined) {
      updatePayload.announcement_text = body.announcementText || body.announcement_text;
    }
    if (body.announcementLink !== undefined || body.announcement_link !== undefined) {
      updatePayload.announcement_link = body.announcementLink || body.announcement_link;
    }
    if (body.headerNavigation !== undefined || body.header_navigation !== undefined || body.navLinks !== undefined || body.nav_links !== undefined) {
      const nav = parseJson(body.headerNavigation || body.header_navigation || body.navLinks || body.nav_links);
      updatePayload.header_navigation = nav;
    }
    if (body.footerNavigation !== undefined || body.footer_navigation !== undefined || body.footerLinks !== undefined || body.footer_links !== undefined) {
      const foot = parseJson(body.footerNavigation || body.footer_navigation || body.footerLinks || body.footer_links);
      updatePayload.footer_navigation = foot;
    }
    if (body.footerColumns !== undefined || body.footer_columns !== undefined) {
      updatePayload.footer_columns = parseJson(body.footerColumns || body.footer_columns);
    }
    if (body.headerVisibility !== undefined || body.header_visibility !== undefined) {
      updatePayload.header_visibility = parseJson(body.headerVisibility || body.header_visibility);
    }
    if (body.copyrightText !== undefined || body.copyright_text !== undefined) {
      updatePayload.copyright_text = body.copyrightText || body.copyright_text;
    }
    if (body.defaultSeoTitle !== undefined || body.default_seo_title !== undefined) {
      updatePayload.default_seo_title = body.defaultSeoTitle || body.default_seo_title;
    }
    if (body.defaultMetaDescription !== undefined || body.default_meta_description !== undefined || body.default_seo_desc !== undefined) {
      updatePayload.default_seo_desc = body.defaultMetaDescription || body.default_meta_description || body.default_seo_desc;
    }
    if (body.ctaLabel !== undefined || body.cta_label !== undefined) {
      updatePayload.cta_label = body.ctaLabel || body.cta_label;
    }
    if (body.ctaLink !== undefined || body.cta_link !== undefined) {
      updatePayload.cta_link = body.ctaLink || body.cta_link;
    }

    // 1. Save locally
    const savedLocal = writeSettingsToStore({
      companyName: updatePayload.company_name,
      logoUrl: updatePayload.logo_url,
      faviconUrl: updatePayload.favicon_url,
      phone: updatePayload.phone,
      email: updatePayload.email,
      address: updatePayload.address,
      socialLinks: updatePayload.social_links,
      announcementEnabled: updatePayload.announcement_enabled,
      announcementText: updatePayload.announcement_text,
      announcementLink: updatePayload.announcement_link,
      navLinks: updatePayload.header_navigation,
      footerText: body.footerText || body.footer_text,
      footerLinks: updatePayload.footer_navigation,
      defaultSeoTitle: updatePayload.default_seo_title,
      defaultMetaDescription: updatePayload.default_seo_desc,
      ctaLabel: updatePayload.cta_label,
      ctaLink: updatePayload.cta_link,
    });

    // 2. Save into PostgreSQL table global_settings
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin
          .from("global_settings")
          .upsert(updatePayload, { onConflict: "id" });
      } catch (sbErr) {
        console.warn("Supabase settings upsert warning:", sbErr);
      }
    }

    await logActivity(
      authResult,
      "SETTINGS_UPDATE",
      "SETTINGS",
      "primary",
      "Updated global website branding, navigation, or SEO configuration",
      { fields: Object.keys(updatePayload) }
    );

    return NextResponse.json({
      success: true,
      data: {
        ...savedLocal,
        ...updatePayload,
      },
      message: "Global settings updated successfully.",
    });
  } catch (error: any) {
    console.error("Error updating global settings:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to update global settings.", code: "UPDATE_ERROR" } },
      { status: 500 }
    );
  }
}
