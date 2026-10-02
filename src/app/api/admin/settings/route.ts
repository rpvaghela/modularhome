import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { query } from "@/lib/db";
import { logActivity } from "@/lib/activityLog";
import { getPublicGlobalSettings, writeSettingsToStore } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    let dbSettings: any = null;

    // 1. Direct PostgreSQL query
    try {
      const pgRes = await query(`SELECT * FROM global_settings WHERE id = 'primary' LIMIT 1;`);
      if (pgRes && pgRes.rows && pgRes.rows.length > 0) {
        dbSettings = pgRes.rows[0];
      }
    } catch (pgErr) {
      console.warn("Postgres fetch global_settings warning:", pgErr);
    }

    // 2. Fallback to Supabase
    if (!dbSettings && isSupabaseConfigured()) {
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
      logoAlt: dbSettings?.logo_alt || "ModularHome.com Logo",
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
    if (body.logoAlt !== undefined || body.logo_alt !== undefined) {
      updatePayload.logo_alt = body.logoAlt || body.logo_alt;
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

    // 1. Save in PostgreSQL
    try {
      const upsertSql = `
        INSERT INTO global_settings (
          id, company_name, logo_url, logo_alt, favicon_url, phone, email, address,
          social_links, announcement_enabled, announcement_text, announcement_link,
          header_navigation, footer_navigation, footer_columns, header_visibility,
          copyright_text, default_seo_title, default_seo_desc, cta_label, cta_link, updated_at
        ) VALUES (
          'primary', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, now()
        )
        ON CONFLICT (id) DO UPDATE SET
          company_name = COALESCE(EXCLUDED.company_name, global_settings.company_name),
          logo_url = COALESCE(EXCLUDED.logo_url, global_settings.logo_url),
          logo_alt = COALESCE(EXCLUDED.logo_alt, global_settings.logo_alt),
          favicon_url = COALESCE(EXCLUDED.favicon_url, global_settings.favicon_url),
          phone = COALESCE(EXCLUDED.phone, global_settings.phone),
          email = COALESCE(EXCLUDED.email, global_settings.email),
          address = COALESCE(EXCLUDED.address, global_settings.address),
          social_links = COALESCE(EXCLUDED.social_links, global_settings.social_links),
          announcement_enabled = COALESCE(EXCLUDED.announcement_enabled, global_settings.announcement_enabled),
          announcement_text = COALESCE(EXCLUDED.announcement_text, global_settings.announcement_text),
          announcement_link = COALESCE(EXCLUDED.announcement_link, global_settings.announcement_link),
          header_navigation = COALESCE(EXCLUDED.header_navigation, global_settings.header_navigation),
          footer_navigation = COALESCE(EXCLUDED.footer_navigation, global_settings.footer_navigation),
          footer_columns = COALESCE(EXCLUDED.footer_columns, global_settings.footer_columns),
          header_visibility = COALESCE(EXCLUDED.header_visibility, global_settings.header_visibility),
          copyright_text = COALESCE(EXCLUDED.copyright_text, global_settings.copyright_text),
          default_seo_title = COALESCE(EXCLUDED.default_seo_title, global_settings.default_seo_title),
          default_seo_desc = COALESCE(EXCLUDED.default_seo_desc, global_settings.default_seo_desc),
          cta_label = COALESCE(EXCLUDED.cta_label, global_settings.cta_label),
          cta_link = COALESCE(EXCLUDED.cta_link, global_settings.cta_link),
          updated_at = now();
      `;

      await query(upsertSql, [
        updatePayload.company_name || "ModularHome.com",
        updatePayload.logo_url || "/newmodularlogo.png",
        updatePayload.logo_alt || "ModularHome.com Logo",
        updatePayload.favicon_url || "/favicon.ico",
        updatePayload.phone || "+1 (812) 595-4033",
        updatePayload.email || "support@modularhome.com",
        updatePayload.address || "Factory Headquarters, IN & Nationwide Delivery",
        JSON.stringify(updatePayload.social_links || {}),
        updatePayload.announcement_enabled !== false,
        updatePayload.announcement_text || "",
        updatePayload.announcement_link || "/buildings",
        JSON.stringify(updatePayload.header_navigation || []),
        JSON.stringify(updatePayload.footer_navigation || []),
        JSON.stringify(updatePayload.footer_columns || []),
        JSON.stringify(updatePayload.header_visibility || {}),
        updatePayload.copyright_text || "© 2026 ModularHome.com. All rights reserved.",
        updatePayload.default_seo_title || "Modular Homes For A Better Tomorrow | ModularHome.com",
        updatePayload.default_seo_desc || "Leading precision steel modular homes, luxury barndominiums, cabins, and downloadable architectural plans.",
        updatePayload.cta_label || "Get Your Free Quote",
        updatePayload.cta_link || "/quote",
      ]);
    } catch (pgErr) {
      console.warn("Postgres settings upsert error:", pgErr);
    }

    // 2. Save into Supabase table global_settings
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin
          .from("global_settings")
          .upsert(updatePayload, { onConflict: "id" });
      } catch (sbErr) {
        console.warn("Supabase settings upsert warning:", sbErr);
      }
    }

    // 3. Save locally in fallback store
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

    // 4. Revalidate all public pages and admin layout
    try {
      revalidatePath("/");
      revalidatePath("/admin/settings");
      revalidatePath("/admin/settings/header");
      revalidatePath("/admin/settings/navigation");
      revalidatePath("/admin/settings/footer");
    } catch {}

    const actionName = body.headerNavigation ? "NAVIGATION_UPDATE" : (body.footerColumns || body.footerNavigation ? "FOOTER_UPDATE" : (body.logoUrl || body.phone ? "HEADER_UPDATE" : "SETTINGS_UPDATE"));

    await logActivity(
      authResult,
      actionName,
      "SETTINGS",
      "primary",
      "Updated global website branding, navigation, header, or footer configuration in database",
      { fields: Object.keys(updatePayload) }
    );

    return NextResponse.json({
      success: true,
      data: {
        ...savedLocal,
        ...updatePayload,
      },
      message: "Global settings saved successfully to database.",
    });
  } catch (error: any) {
    console.error("Error updating global settings:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to update global settings.", code: "UPDATE_ERROR" } },
      { status: 500 }
    );
  }
}
