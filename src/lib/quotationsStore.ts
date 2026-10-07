import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const QUOTATIONS_FILE = path.join(DATA_DIR, "custom_quotations.json");

export interface QuotationItem {
  id: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  customer_zip?: string | null;
  model_slug?: string | null;
  model_name?: string | null;
  sqft?: number | null;
  dimensions?: string | null;
  options?: any[];
  pricing_inputs?: Record<string, any>;
  estimated_amount?: number | null;
  line_items?: any[];
  inclusions?: string[];
  exclusions?: string[];
  disclaimer?: string | null;
  pricing_rule_version?: string | null;
  timeline?: string | null;
  requirements?: string | null;
  notes?: string | null;
  internal_notes?: string | null;
  assigned_to?: string | null;
  follow_up_date?: string | null;
  source: string;
  status: "PENDING" | "REVIEWED" | "ESTIMATE_SENT" | "ACCEPTED" | "DECLINED";
  created_at: string;
  updated_at: string;
}

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory for quotations:", err);
  }
}

export function readQuotationsFromStore(): QuotationItem[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(QUOTATIONS_FILE)) {
      fs.writeFileSync(QUOTATIONS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(QUOTATIONS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      fs.writeFileSync(QUOTATIONS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    return parsed;
  } catch (error) {
    console.error("Error reading custom_quotations.json:", error);
    return [];
  }
}

export function writeQuotationsToStore(quotes: QuotationItem[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(QUOTATIONS_FILE, JSON.stringify(quotes, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_quotations.json:", error);
  }
}

export function saveQuotationToStore(quote: Partial<QuotationItem> & { id: string; customer_name: string; customer_email: string }): QuotationItem {
  const list = readQuotationsFromStore();
  const now = new Date().toISOString();

  const newQuote: QuotationItem = {
    id: quote.id,
    customer_id: quote.customer_id || null,
    customer_name: quote.customer_name,
    customer_email: quote.customer_email.toLowerCase().trim(),
    customer_phone: quote.customer_phone || null,
    customer_zip: quote.customer_zip || null,
    model_slug: quote.model_slug || null,
    model_name: quote.model_name || "Custom Model",
    sqft: quote.sqft !== undefined ? Number(quote.sqft) : null,
    dimensions: quote.dimensions || null,
    options: quote.options || [],
    pricing_inputs: quote.pricing_inputs || {},
    estimated_amount: quote.estimated_amount !== undefined ? Number(quote.estimated_amount) : null,
    line_items: quote.line_items || [],
    inclusions: quote.inclusions || [],
    exclusions: quote.exclusions || [],
    disclaimer: quote.disclaimer || null,
    pricing_rule_version: quote.pricing_rule_version || "v2026.1",
    timeline: quote.timeline || null,
    requirements: quote.requirements || null,
    notes: quote.notes || null,
    internal_notes: quote.internal_notes || null,
    assigned_to: quote.assigned_to || null,
    follow_up_date: quote.follow_up_date || null,
    source: quote.source || "QUOTE_WIZARD",
    status: (quote.status as any) || "PENDING",
    created_at: quote.created_at || now,
    updated_at: now,
  };

  const existingIdx = list.findIndex((q) => q.id === newQuote.id);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...newQuote };
  } else {
    list.unshift(newQuote);
  }

  writeQuotationsToStore(list);
  return newQuote;
}

export function updateQuotationInStore(id: string, updates: Partial<QuotationItem>): QuotationItem | null {
  const list = readQuotationsFromStore();
  const idx = list.findIndex((q) => q.id === id);
  if (idx < 0) return null;

  const updated: QuotationItem = {
    ...list[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  list[idx] = updated;
  writeQuotationsToStore(list);
  return updated;
}

export function deleteQuotationFromStore(id: string): boolean {
  const list = readQuotationsFromStore();
  const filtered = list.filter((q) => q.id !== id);
  if (filtered.length !== list.length) {
    writeQuotationsToStore(filtered);
    return true;
  }
  return false;
}
