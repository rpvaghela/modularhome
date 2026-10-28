import fs from "fs";
import path from "path";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

export const BOMBSHELTER_SOURCE = "BombShelters.com";

export interface BombShelterQuotation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  model_name: string;
  category?: string | null;
  sq_ft?: number | null;
  estimated_amount: number;
  specifications?: Record<string, any> | null;
  source: string;
  status: "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED" | "REJECTED";
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const QUOTES_FILE = path.join(DATA_DIR, "custom_quotations.json");

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating BombShelter data directory:", err);
  }
}

export function readLocalQuotations(): BombShelterQuotation[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(QUOTES_FILE)) {
      fs.writeFileSync(QUOTES_FILE, "[]", "utf-8");
      return [];
    }
    const data = fs.readFileSync(QUOTES_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading BombShelter custom_quotations.json:", error);
    return [];
  }
}

export function writeLocalQuotations(quotes: BombShelterQuotation[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(QUOTES_FILE, JSON.stringify(quotes, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to BombShelter custom_quotations.json:", error);
  }
}

export async function getBombShelterQuotations(): Promise<BombShelterQuotation[]> {
  const localQuotes = readLocalQuotations().filter((q) => q.source === BOMBSHELTER_SOURCE);

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("quotations")
        .select("*")
        .eq("source", BOMBSHELTER_SOURCE)
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        const combined = [...data];
        for (const local of localQuotes) {
          if (!combined.some((item) => item.id === local.id)) {
            combined.push(local);
          }
        }
        return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    } catch (e) {
      console.warn("Supabase quotations fetch error, falling back to local:", e);
    }
  }

  return localQuotes;
}

export async function createBombShelterQuotation(
  quoteInput: Partial<BombShelterQuotation> & {
    customer_name: string;
    customer_email: string;
    model_name: string;
    estimated_amount: number;
  }
): Promise<BombShelterQuotation> {
  const now = new Date().toISOString();
  const id = quoteInput.id || `bs_quote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newQuote: BombShelterQuotation = {
    id,
    customer_name: quoteInput.customer_name.trim(),
    customer_email: quoteInput.customer_email.toLowerCase().trim(),
    customer_phone: quoteInput.customer_phone || null,
    model_name: quoteInput.model_name,
    category: quoteInput.category || "Bomb Shelter",
    sq_ft: quoteInput.sq_ft || null,
    estimated_amount: quoteInput.estimated_amount,
    specifications: quoteInput.specifications || null,
    source: BOMBSHELTER_SOURCE,
    status: quoteInput.status || "SUBMITTED",
    notes: quoteInput.notes || null,
    created_at: quoteInput.created_at || now,
    updated_at: now,
  };

  const localQuotes = readLocalQuotations();
  localQuotes.unshift(newQuote);
  writeLocalQuotations(localQuotes);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("quotations").insert({
        id: newQuote.id,
        customer_name: newQuote.customer_name,
        customer_email: newQuote.customer_email,
        customer_phone: newQuote.customer_phone,
        model_name: newQuote.model_name,
        estimated_amount: newQuote.estimated_amount,
        source: BOMBSHELTER_SOURCE,
        status: newQuote.status,
        notes: newQuote.notes,
        created_at: newQuote.created_at,
        updated_at: newQuote.updated_at,
      });
    } catch (e) {
      console.warn("Supabase quotation insert error, stored locally:", e);
    }
  }

  return newQuote;
}

export async function updateBombShelterQuotation(
  id: string,
  updates: Partial<BombShelterQuotation>
): Promise<BombShelterQuotation | null> {
  const now = new Date().toISOString();
  const localQuotes = readLocalQuotations();
  const idx = localQuotes.findIndex((q) => q.id === id && q.source === BOMBSHELTER_SOURCE);

  let updatedQuote: BombShelterQuotation | null = null;
  if (idx !== -1) {
    localQuotes[idx] = {
      ...localQuotes[idx],
      ...updates,
      source: BOMBSHELTER_SOURCE,
      updated_at: now,
    };
    writeLocalQuotations(localQuotes);
    updatedQuote = localQuotes[idx];
  }

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin
        .from("quotations")
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
        return data as BombShelterQuotation;
      }
    } catch (e) {
      console.warn("Supabase quotation update error:", e);
    }
  }

  return updatedQuote;
}

export async function deleteBombShelterQuotation(id: string): Promise<boolean> {
  const localQuotes = readLocalQuotations();
  const filtered = localQuotes.filter((q) => !(q.id === id && q.source === BOMBSHELTER_SOURCE));
  writeLocalQuotations(filtered);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin
        .from("quotations")
        .delete()
        .eq("id", id)
        .eq("source", BOMBSHELTER_SOURCE);
      return true;
    } catch (e) {
      console.warn("Supabase quotation delete error:", e);
    }
  }

  return true;
}

