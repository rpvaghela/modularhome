import fs from "fs";
import path from "path";
import { COLLECTIONS, CollectionItem } from "../data/collections";
import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabase";

export type { CollectionItem };

const DATA_DIR = path.join(process.cwd(), "data");
const COLLECTIONS_FILE = path.join(DATA_DIR, "custom_collections.json");

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}

export function readLocalCollections(): CollectionItem[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(COLLECTIONS_FILE)) {
      fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(COLLECTIONS, null, 2), "utf-8");
      return COLLECTIONS;
    }
    const data = fs.readFileSync(COLLECTIONS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : COLLECTIONS;
  } catch (error) {
    console.error("Error reading custom_collections.json:", error);
    return COLLECTIONS;
  }
}

export function writeLocalCollections(collections: CollectionItem[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(collections, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_collections.json:", error);
  }
}

export async function getBombShelterCollections(): Promise<CollectionItem[]> {
  const localList = readLocalCollections();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabaseAdmin || supabase)
        .from("collections")
        .select("id, handle, title, description_html, image, banner_image, tagline, is_featured")
        .order("is_featured", { ascending: false })
        .limit(100);

      if (!error && Array.isArray(data) && data.length > 0) {
        const dbCollections: CollectionItem[] = data.map((item) => {
          // Clean HTML description to plain text snippet
          const cleanDesc = (item.description_html || item.tagline || "")
            .replace(/<[^>]*>?/gm, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 160);

          return {
            slug: item.handle || item.id,
            name: item.title,
            badge: "CURATED SUITE",
            modelCount: "12+ Models",
            imageUrl: item.image || item.banner_image || "/images/cat-luxury-bunkers.png",
            description: cleanDesc || "Engineered structural shelter and building collection.",
          };
        });

        // Ensure primary curated collections stay at top
        const merged = [...localList];
        for (const dbCol of dbCollections) {
          if (!merged.some((c) => c.slug === dbCol.slug)) {
            merged.push(dbCol);
          }
        }
        return merged;
      }
    } catch (e) {
      console.warn("Supabase collections fetch warning:", e);
    }
  }

  return localList;
}

export async function getBombShelterCollectionBySlug(slug: string): Promise<CollectionItem | null> {
  const all = await getBombShelterCollections();
  return all.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function saveBombShelterCollection(item: CollectionItem): Promise<CollectionItem> {
  const list = readLocalCollections();
  const idx = list.findIndex((c) => c.slug === item.slug);
  if (idx !== -1) {
    list[idx] = item;
  } else {
    list.unshift(item);
  }
  writeLocalCollections(list);
  return item;
}

export async function deleteBombShelterCollection(slug: string): Promise<boolean> {
  const list = readLocalCollections();
  const filtered = list.filter((c) => c.slug !== slug);
  writeLocalCollections(filtered);
  return true;
}
