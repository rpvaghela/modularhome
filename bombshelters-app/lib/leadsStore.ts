import fs from "fs";
import path from "path";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

export const BOMBSHELTER_SOURCE = "BombShelters.com";

export interface BombShelterLead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  zip?: string | null;
  project_type?: string | null;
  budget?: string | null;
  enquiry_details?: string | null;
  source: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "QUOTE_SENT" | "FOLLOW_UP" | "WON" | "LOST";
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "custom_leads.json");

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating BombShelter data directory:", err);
  }
}

export function readLocalLeads(): BombShelterLead[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, "[]", "utf-8");
      return [];
    }
    const data = fs.readFileSync(LEADS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading BombShelter custom_leads.json:", error);
    return [];
  }
}

export function writeLocalLeads(leads: BombShelterLead[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to BombShelter custom_leads.json:", error);
  }
}

/**
 * Fetch all leads strictly isolated to BombShelters.com
 */
export async function getBombShelterLeads(): Promise<BombShelterLead[]> {
  const localLeads = readLocalLeads().filter((l) => l.source === BOMBSHELTER_SOURCE);

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("leads")
        .select("*")
        .eq("source", BOMBSHELTER_SOURCE)
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        // Merge Supabase data with local entries (avoiding duplicates)
        const combined = [...data];
        for (const local of localLeads) {
          if (!combined.some((item) => item.id === local.id || (item.email === local.email && item.created_at === local.created_at))) {
            combined.push(local);
          }
        }
        return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    } catch (e) {
      console.warn("Supabase lead fetch error, using local fallback:", e);
    }
  }

  return localLeads;
}

/**
 * Create a new lead strictly stamped with source = 'BombShelters.com'
 */
export async function createBombShelterLead(
  leadInput: Partial<BombShelterLead> & { email: string; name: string }
): Promise<BombShelterLead> {
  const now = new Date().toISOString();
  const id = leadInput.id || `bs_lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newLead: BombShelterLead = {
    id,
    name: leadInput.name.trim(),
    email: leadInput.email.toLowerCase().trim(),
    phone: leadInput.phone || null,
    location: leadInput.location || null,
    zip: leadInput.zip || null,
    project_type: leadInput.project_type || "Bomb Shelter Consultation",
    budget: leadInput.budget || null,
    enquiry_details: leadInput.enquiry_details || null,
    source: BOMBSHELTER_SOURCE, // ALWAYS strictly stamped
    status: leadInput.status || "NEW",
    notes: leadInput.notes || null,
    created_at: leadInput.created_at || now,
    updated_at: now,
  };

  // 1. Save to local fallback store
  const localLeads = readLocalLeads();
  localLeads.unshift(newLead);
  writeLocalLeads(localLeads);

  // 2. Persist to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("leads").insert({
        id: newLead.id,
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        location: newLead.location,
        zip: newLead.zip,
        project_type: newLead.project_type,
        budget: newLead.budget,
        enquiry_details: newLead.enquiry_details,
        source: BOMBSHELTER_SOURCE,
        status: newLead.status,
        notes: newLead.notes,
        created_at: newLead.created_at,
        updated_at: newLead.updated_at,
      });
    } catch (e) {
      console.warn("Supabase lead insertion error, stored locally:", e);
    }
  }

  return newLead;
}

/**
 * Update a lead strictly verified to belong to BombShelters.com
 */
export async function updateBombShelterLead(
  id: string,
  updates: Partial<BombShelterLead>
): Promise<BombShelterLead | null> {
  const now = new Date().toISOString();
  const localLeads = readLocalLeads();
  const index = localLeads.findIndex((l) => l.id === id && l.source === BOMBSHELTER_SOURCE);

  let updatedLead: BombShelterLead | null = null;
  if (index !== -1) {
    localLeads[index] = {
      ...localLeads[index],
      ...updates,
      source: BOMBSHELTER_SOURCE, // Prevent source overwrite
      updated_at: now,
    };
    writeLocalLeads(localLeads);
    updatedLead = localLeads[index];
  }

  if (isSupabaseConfigured()) {
    try {
      // Safe scoped update - strictly requires source = 'BombShelters.com'
      const { data, error } = await supabaseAdmin
        .from("leads")
        .update({
          ...updates,
          source: BOMBSHELTER_SOURCE,
          updated_at: now,
        })
        .eq("id", id)
        .eq("source", BOMBSHELTER_SOURCE)
        .select()
        .maybeSingle();

      if (!error && data) {
        return data as BombShelterLead;
      }
    } catch (e) {
      console.warn("Supabase lead update error:", e);
    }
  }

  return updatedLead;
}

/**
 * Delete a lead strictly verified to belong to BombShelters.com
 */
export async function deleteBombShelterLead(id: string): Promise<boolean> {
  const localLeads = readLocalLeads();
  const filtered = localLeads.filter((l) => !(l.id === id && l.source === BOMBSHELTER_SOURCE));
  writeLocalLeads(filtered);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin
        .from("leads")
        .delete()
        .eq("id", id)
        .eq("source", BOMBSHELTER_SOURCE);
      return true;
    } catch (e) {
      console.warn("Supabase lead delete error:", e);
    }
  }

  return true;
}

