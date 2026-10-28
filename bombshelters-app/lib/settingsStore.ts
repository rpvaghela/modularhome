import fs from "fs";
import path from "path";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

export const BOMBSHELTER_SETTINGS_ID = "bombshelters";

export interface BombShelterSettings {
  id: string;
  company_name: string;
  companyName?: string;
  phone: string;
  emergency_hotline: string;
  email: string;
  address: string;
  logo_url: string;
  logoUrl?: string;
  banner_message: string;
  announcementText?: string;
  banner_active: boolean;
  announcementEnabled?: boolean;
  banner_link?: string;
  announcementLink?: string;
  social_links: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
  };
  updated_at: string;
}

export const DEFAULT_SETTINGS: BombShelterSettings = {
  id: BOMBSHELTER_SETTINGS_ID,
  company_name: "BombShelters.com",
  companyName: "BombShelters.com",
  phone: "812-595-4033",
  emergency_hotline: "812-595-4033",
  email: "defense@bombshelters.com",
  address: "Underground Defense & Bunkers Division, USA",
  logo_url: "/bomb_logo.png",
  logoUrl: "/bomb_logo.png",
  banner_message: "DEFCON Alert: Nationwide Underground Shelter Engineering & Turnkey Installation Available.",
  announcementText: "DEFCON Alert: Nationwide Underground Shelter Engineering & Turnkey Installation Available.",
  banner_active: true,
  announcementEnabled: true,
  banner_link: "/quote",
  announcementLink: "/quote",
  social_links: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
  },
  updated_at: new Date().toISOString(),
};

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "custom_settings.json");

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}

export function readLocalSettings(): BombShelterSettings {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf-8");
      return DEFAULT_SETTINGS;
    }
    const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    const companyName = parsed.company_name || parsed.companyName || DEFAULT_SETTINGS.company_name;
    const logoUrl = parsed.logo_url || parsed.logoUrl || DEFAULT_SETTINGS.logo_url;
    const bannerMsg = parsed.banner_message || parsed.announcementText || DEFAULT_SETTINGS.banner_message;
    const bannerActive = parsed.banner_active ?? parsed.announcementEnabled ?? DEFAULT_SETTINGS.banner_active;
    const bannerLink = parsed.banner_link || parsed.announcementLink || DEFAULT_SETTINGS.banner_link;

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      id: BOMBSHELTER_SETTINGS_ID,
      company_name: companyName,
      companyName,
      logo_url: logoUrl,
      logoUrl,
      banner_message: bannerMsg,
      announcementText: bannerMsg,
      banner_active: bannerActive,
      announcementEnabled: bannerActive,
      banner_link: bannerLink,
      announcementLink: bannerLink,
    };
  } catch (error) {
    console.error("Error reading custom_settings.json:", error);
    return DEFAULT_SETTINGS;
  }
}

export function writeLocalSettings(settings: BombShelterSettings): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_settings.json:", error);
  }
}

export async function getBombShelterSettings(): Promise<BombShelterSettings> {
  const localSettings = readLocalSettings();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("global_settings")
        .select("*")
        .eq("id", BOMBSHELTER_SETTINGS_ID)
        .maybeSingle();

      if (!error && data) {
        return {
          id: BOMBSHELTER_SETTINGS_ID,
          company_name: data.company_name || localSettings.company_name,
          phone: data.phone || localSettings.phone,
          emergency_hotline: data.emergency_hotline || localSettings.emergency_hotline,
          email: data.email || localSettings.email,
          address: data.address || localSettings.address,
          logo_url: data.logo_url || localSettings.logo_url,
          banner_message: data.banner_message || localSettings.banner_message,
          banner_active: data.banner_active ?? localSettings.banner_active,
          social_links: data.social_links || localSettings.social_links,
          updated_at: data.updated_at || localSettings.updated_at,
        };
      }
    } catch (e) {
      console.warn("Supabase settings fetch error, using local fallback:", e);
    }
  }

  return localSettings;
}

export async function updateBombShelterSettings(
  updates: Partial<BombShelterSettings>
): Promise<BombShelterSettings> {
  const now = new Date().toISOString();
  const current = await getBombShelterSettings();

  const companyName = updates.company_name || updates.companyName || current.company_name;
  const logoUrl = updates.logo_url || updates.logoUrl || current.logo_url;
  const bannerMessage = updates.banner_message || updates.announcementText || current.banner_message;
  const bannerActive = updates.banner_active ?? updates.announcementEnabled ?? current.banner_active;
  const bannerLink = updates.banner_link || updates.announcementLink || current.banner_link;

  const newSettings: BombShelterSettings = {
    ...current,
    ...updates,
    id: BOMBSHELTER_SETTINGS_ID, // strictly enforce ID isolation
    company_name: companyName,
    companyName,
    logo_url: logoUrl,
    logoUrl,
    banner_message: bannerMessage,
    announcementText: bannerMessage,
    banner_active: bannerActive,
    announcementEnabled: bannerActive,
    banner_link: bannerLink,
    announcementLink: bannerLink,
    updated_at: now,
  };

  writeLocalSettings(newSettings);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("global_settings").upsert({
        id: BOMBSHELTER_SETTINGS_ID,
        company_name: newSettings.company_name,
        phone: newSettings.phone,
        email: newSettings.email,
        address: newSettings.address,
        logo_url: newSettings.logo_url,
        emergency_hotline: newSettings.emergency_hotline,
        banner_message: newSettings.banner_message,
        banner_active: newSettings.banner_active,
        social_links: newSettings.social_links,
        updated_at: now,
      });
    } catch (e) {
      console.warn("Supabase settings update error, saved locally:", e);
    }
  }

  return newSettings;
}

