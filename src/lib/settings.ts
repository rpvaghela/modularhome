import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

export interface PublicGlobalSettings {
  companyName: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  email: string;
  address: string;
  businessHours?: string;
  socialLinks: Record<string, string>;
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink: string;
  navLinks: Array<{ label: string; href: string }>;
  footerText: string;
  footerLinks: Array<{ label: string; href: string }>;
  defaultSeoTitle: string;
  defaultMetaDescription: string;
  ctaLabel: string;
  ctaLink: string;
}

export const DEFAULT_SETTINGS: PublicGlobalSettings = {
  companyName: "ModularHome.com",
  logoUrl: "/newmodularlogo.png",
  faviconUrl: "/favicon.ico",
  phone: "+1 (812) 595-4033",
  email: "modularhome.admin@gmail.com",
  address: "Factory Headquarters, IN & Nationwide Delivery",
  businessHours: "Mon – Fri: 8:00 AM – 6:00 PM EST",
  socialLinks: {
    facebook: "https://facebook.com/modularhome",
    instagram: "https://instagram.com/modularhome",
    youtube: "https://youtube.com/@modularhome",
    tiktok: "https://tiktok.com/@modularhome",
    twitter: "",
    linkedin: "",
  },
  announcementEnabled: true,
  announcementText: "Direct Factory Modular & Prefab Home Builder • 2026 Models Released",
  announcementLink: "/buildings",
  navLinks: [
    { label: "Modular Homes", href: "/modular-homes" },
    { label: "Prefab Homes", href: "/prefab-homes" },
    { label: "Barndominiums", href: "/barndominiums" },
    { label: "House Kits", href: "/house-kits" },
    { label: "Tiny Homes", href: "/tiny-homes" },
    { label: "Park Models", href: "/park-models" },
    { label: "Cabins", href: "/cabins" },
    { label: "ADUs & Granny Pods", href: "/adus" },
    { label: "A-Frames", href: "/a-frame-homes" },
    { label: "Commercial", href: "/commercial-modular-buildings" },
  ],
  footerText: "ModularHome.com leads the American prefabricated housing movement with precision-engineered modular residences, luxury barndominiums, and rapid-deployment cabin kits.",
  footerLinks: [
    { label: "Modular Homes", href: "/modular-homes" },
    { label: "Cabins", href: "/cabins" },
    { label: "Barndominiums", href: "/barndominiums" },
    { label: "ADUs", href: "/adus" },
    { label: "Floor Plans", href: "/floor-plans" },
    { label: "Video Gallery", href: "/videos" },
    { label: "Quote Wizard", href: "/quote" },
  ],
  defaultSeoTitle: "ModularHome.com | Modern Homes. A Smarter Way to Build.",
  defaultMetaDescription: "Explore modular homes, prefab homes, cabins, ADUs, barndominiums, floor plans and custom home options.",
  ctaLabel: "Get Your Free Quote",
  ctaLink: "/quote",
};

let inMemorySettings: PublicGlobalSettings = { ...DEFAULT_SETTINGS };

export function readSettingsFromStore(): PublicGlobalSettings {
  try {
    if (typeof window === "undefined") {
      const fs = require("fs");
      const path = require("path");
      const dataDir = path.join(process.cwd(), "src", "data");
      const settingsFile = path.join(dataDir, "custom_settings.json");
      if (fs.existsSync(settingsFile)) {
        const data = fs.readFileSync(settingsFile, "utf-8");
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          socialLinks: { ...DEFAULT_SETTINGS.socialLinks, ...(parsed?.socialLinks || {}) },
        };
      }
    }
  } catch {}
  return inMemorySettings;
}

export function writeSettingsToStore(settings: Partial<PublicGlobalSettings>): PublicGlobalSettings {
  try {
    const current = readSettingsFromStore();
    const updated: PublicGlobalSettings = {
      ...current,
      ...settings,
      socialLinks: {
        ...current.socialLinks,
        ...(settings.socialLinks || {}),
      },
    };
    inMemorySettings = updated;
    if (typeof window === "undefined") {
      const fs = require("fs");
      const path = require("path");
      const dataDir = path.join(process.cwd(), "src", "data");
      const settingsFile = path.join(dataDir, "custom_settings.json");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(settingsFile, JSON.stringify(updated, null, 2), "utf-8");
    }
    return updated;
  } catch (error) {
    console.error("Error writing settings:", error);
    return inMemorySettings;
  }
}

export async function getPublicGlobalSettings(): Promise<PublicGlobalSettings> {
  const localSettings = readSettingsFromStore();

  try {
    if (!isSupabaseConfigured()) {
      return localSettings;
    }

    const { data: raw, error } = await supabaseAdmin
      .from("global_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !raw) return localSettings;

    let socialLinks = localSettings.socialLinks;
    try {
      const rawSocial = raw.social_links || raw.socialLinks;
      if (rawSocial) {
        const parsed = typeof rawSocial === "string" ? JSON.parse(rawSocial) : rawSocial;
        socialLinks = { ...localSettings.socialLinks, ...parsed };
      }
    } catch {}

    let navLinks = localSettings.navLinks;
    try {
      const rawNav = raw.header_navigation || raw.nav_links || raw.navLinks;
      if (rawNav) {
        navLinks = typeof rawNav === "string" ? JSON.parse(rawNav) : rawNav;
      }
    } catch {}

    let footerLinks = localSettings.footerLinks;
    try {
      const rawFoot = raw.footer_navigation || raw.footer_links || raw.footerLinks;
      if (rawFoot) {
        footerLinks = typeof rawFoot === "string" ? JSON.parse(rawFoot) : rawFoot;
      }
    } catch {}

    const merged: PublicGlobalSettings = {
      companyName: raw.company_name || raw.companyName || localSettings.companyName,
      logoUrl: raw.logo_url || raw.logoUrl || localSettings.logoUrl,
      faviconUrl: raw.favicon_url || raw.faviconUrl || localSettings.faviconUrl,
      phone: raw.phone || localSettings.phone,
      email: raw.email || localSettings.email,
      address: raw.address || localSettings.address,
      businessHours: raw.business_hours || raw.businessHours || localSettings.businessHours,
      socialLinks: socialLinks || localSettings.socialLinks,
      announcementEnabled: raw.announcement_enabled ?? raw.announcementEnabled ?? localSettings.announcementEnabled,
      announcementText: raw.announcement_text || raw.announcementText || localSettings.announcementText,
      announcementLink: raw.announcement_link || raw.announcementLink || localSettings.announcementLink,
      navLinks: navLinks || localSettings.navLinks,
      footerText: raw.footer_text || raw.footerText || localSettings.footerText,
      footerLinks: footerLinks || localSettings.footerLinks,
      defaultSeoTitle: raw.default_seo_title || raw.defaultSeoTitle || localSettings.defaultSeoTitle,
      defaultMetaDescription: raw.default_meta_description || raw.default_seo_desc || raw.defaultMetaDescription || localSettings.defaultMetaDescription,
      ctaLabel: raw.cta_label || raw.ctaLabel || localSettings.ctaLabel,
      ctaLink: raw.cta_link || raw.ctaLink || localSettings.ctaLink,
    };

    return merged;
  } catch (error) {
    console.warn("Could not fetch global settings from Supabase, using local settings:", error);
    return localSettings;
  }
}
