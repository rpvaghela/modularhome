import fs from "fs";
import path from "path";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { FEATURED_MODELS, ProductModel } from "../data/products";

export const BOMBSHELTER_VENDOR = "BombShelters.com";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "custom_products.json");

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating BombShelter data directory:", err);
  }
}

export function readLocalProducts(): ProductModel[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(FEATURED_MODELS, null, 2), "utf-8");
      return FEATURED_MODELS;
    }
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : FEATURED_MODELS;
  } catch (error) {
    console.error("Error reading BombShelter custom_products.json:", error);
    return FEATURED_MODELS;
  }
}

export function writeLocalProducts(products: ProductModel[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to BombShelter custom_products.json:", error);
  }
}

/**
 * Get all active BombShelter products (scoped strictly by vendor = 'BombShelters.com')
 */
export async function getBombShelterProducts(onlyActive = true): Promise<ProductModel[]> {
  const localList = readLocalProducts();

  if (isSupabaseConfigured()) {
    try {
      let query = supabaseAdmin
        .from("products")
        .select(`
          id,
          title,
          handle,
          description_html,
          vendor,
          product_type,
          status,
          product_variants ( price, sku ),
          product_media ( source_url, alt_text, position )
        `)
        .eq("vendor", BOMBSHELTER_VENDOR);

      if (onlyActive) {
        query = query.eq("status", "active");
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data) && data.length > 0) {
        const dbProducts: ProductModel[] = data.map((item: any) => {
          const variants = item.product_variants || [];
          const media = item.product_media || [];
          const lowestPrice = variants[0]?.price || 0;
          const mainImage = media.sort((a: any, b: any) => (a.position || 0) - (b.position || 0))[0]?.source_url || "/images/hillside-bunker.png";

          return {
            id: item.handle || item.id,
            name: item.title,
            price: `$${Number(lowestPrice).toLocaleString()}`,
            rawPrice: Number(lowestPrice),
            badge: {
              text: item.product_type || "SHELTER",
              color: "green",
            },
            capacity: "Turnkey",
            specs: "Hardened Steel",
            features: ["NBC Air Filtration", "Double Blast Door", "Emergency Escape Hatch"],
            imageUrl: mainImage,
            category: item.product_type || "Bomb Shelters",
            description: item.description_html || "",
          };
        });

        // Merge DB products with any local custom products
        const combined = [...dbProducts];
        for (const local of localList) {
          if (!combined.some((p) => p.id === local.id)) {
            combined.push(local);
          }
        }
        return combined;
      }
    } catch (e) {
      console.warn("Supabase products fetch error, returning local store:", e);
    }
  }

  return localList;
}

/**
 * Get a single BombShelter product by ID / slug
 */
export async function getBombShelterProductById(idOrSlug: string): Promise<ProductModel | null> {
  const all = await getBombShelterProducts(false);
  const normalized = idOrSlug.toLowerCase();
  return all.find((p) => p.id.toLowerCase() === normalized || p.id === idOrSlug) || null;
}

/**
 * Save or update a BombShelter product
 */
export async function saveBombShelterProduct(product: ProductModel): Promise<ProductModel> {
  const localList = readLocalProducts();
  const idx = localList.findIndex((p) => p.id === product.id);

  if (idx !== -1) {
    localList[idx] = product;
  } else {
    localList.unshift(product);
  }
  writeLocalProducts(localList);

  if (isSupabaseConfigured()) {
    try {
      // Upsert into Supabase products table with strict vendor scoping
      const { data: existing } = await supabaseAdmin
        .from("products")
        .select("id")
        .eq("handle", product.id)
        .eq("vendor", BOMBSHELTER_VENDOR)
        .maybeSingle();

      const productPayload = {
        title: product.name,
        handle: product.id,
        description_html: product.description,
        vendor: BOMBSHELTER_VENDOR,
        product_type: product.category,
        status: "active",
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        await supabaseAdmin
          .from("products")
          .update(productPayload)
          .eq("id", existing.id)
          .eq("vendor", BOMBSHELTER_VENDOR);
      } else {
        await supabaseAdmin.from("products").insert(productPayload);
      }
    } catch (e) {
      console.warn("Supabase product persist error, saved locally:", e);
    }
  }

  return product;
}

/**
 * Delete a BombShelter product
 */
export async function deleteBombShelterProduct(id: string): Promise<boolean> {
  const localList = readLocalProducts();
  const filtered = localList.filter((p) => p.id !== id);
  writeLocalProducts(filtered);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin
        .from("products")
        .delete()
        .eq("handle", id)
        .eq("vendor", BOMBSHELTER_VENDOR);
    } catch (e) {
      console.warn("Supabase product delete error:", e);
    }
  }

  return true;
}

