import fs from "fs";
import path from "path";
import { FAQS, FaqItem } from "../data/faqs";

export interface BombShelterFaq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  status?: "PUBLISHED" | "DRAFT";
  display_order?: number;
  created_at?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FAQS_FILE = path.join(DATA_DIR, "custom_faqs.json");

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}

function getInitialFaqs(): BombShelterFaq[] {
  return FAQS.map((f, idx) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: "General",
    status: "PUBLISHED",
    display_order: idx + 1,
    created_at: new Date().toISOString(),
  }));
}

export function readLocalFaqs(): BombShelterFaq[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(FAQS_FILE)) {
      const initial = getInitialFaqs();
      fs.writeFileSync(FAQS_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const data = fs.readFileSync(FAQS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getInitialFaqs();
  } catch (error) {
    console.error("Error reading custom_faqs.json:", error);
    return getInitialFaqs();
  }
}

export function writeLocalFaqs(faqs: BombShelterFaq[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(FAQS_FILE, JSON.stringify(faqs, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_faqs.json:", error);
  }
}

export async function getBombShelterFaqs(onlyPublished = false): Promise<BombShelterFaq[]> {
  const faqs = readLocalFaqs();
  if (onlyPublished) {
    return faqs.filter((f) => f.status !== "DRAFT");
  }
  return faqs;
}

export async function saveBombShelterFaq(faq: BombShelterFaq): Promise<BombShelterFaq> {
  const faqs = readLocalFaqs();
  const idx = faqs.findIndex((f) => f.id === faq.id);
  if (idx !== -1) {
    faqs[idx] = faq;
  } else {
    faqs.unshift(faq);
  }
  writeLocalFaqs(faqs);
  return faq;
}

export async function deleteBombShelterFaq(id: string): Promise<boolean> {
  const faqs = readLocalFaqs();
  const filtered = faqs.filter((f) => f.id !== id);
  writeLocalFaqs(filtered);
  return true;
}

