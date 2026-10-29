import fs from "fs";
import path from "path";
import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { FEATURED_MODELS, ProductModel } from "../data/products";
import { EXCLUDED_PRODUCT_TYPES, getCategoryByProductType } from "../config/catalog-category-map";

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

export interface ExtendedProductModel extends ProductModel {
  sqft?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  stories?: number | null;
  dimensions?: string | null;
  primaryImageUrl?: string;
  mediaGallery?: { url: string; alt?: string; position?: number }[];
  seoTitle?: string | null;
  seoDescription?: string | null;
}

function mapDatabaseRowToModel(item: any): ExtendedProductModel {
  const variants = item.product_variants || [];
  const media = item.product_media || [];
  const sortedMedia = [...media].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));

  const lowestPrice =
    item.starting_price !== null && item.starting_price !== undefined && Number(item.starting_price) > 0
      ? Number(item.starting_price)
      : variants.length > 0
        ? Math.min(...variants.map((v: any) => Number(v.price || 0)).filter((p: number) => p > 0))
        : 49900;

  const mainImage =
    item.primary_image_url ||
    sortedMedia[0]?.source_url ||
    "/images/hillside-bunker.png";

  const categoryMapping = getCategoryByProductType(item.product_type || "");
  const badgeText = categoryMapping?.badge?.split(" ")[0] || item.product_type?.toUpperCase() || "SHELTER";

  // Determine badge color deterministically
  const badgeColors: ("green" | "gold" | "blue" | "red" | "purple")[] = ["green", "gold", "blue", "red", "purple"];
  const colorIndex = Math.abs((item.title || "").split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % badgeColors.length;
  const badgeColor = badgeColors[colorIndex];

  // Capacity / Specs
  let capacity = "Custom Sizing";
  if (item.sqft) {
    capacity = `${item.sqft} Sq Ft`;
  } else if (item.bedrooms) {
    capacity = `${item.bedrooms} Bed${Number(item.bedrooms) > 1 ? "s" : ""}`;
  }

  let specs = "Turnkey";
  if (item.bedrooms && item.bathrooms) {
    specs = `${item.bedrooms} Bed / ${item.bathrooms} Bath`;
  } else if (item.sqft) {
    specs = `${item.sqft} Sq Ft Living`;
  }

  // Parse features safely
  let features: string[] = ["Structural Steel Frame", "Engineered Certified", "Turnkey Fabrication", "Nationwide Delivery"];
  if (Array.isArray(item.features) && item.features.length > 0) {
    features = item.features.map(String);
  } else if (typeof item.features === "string") {
    try {
      const parsed = JSON.parse(item.features);
      if (Array.isArray(parsed)) features = parsed.map(String);
    } catch {
      // Keep default
    }
  }

  return {
    id: item.handle || item.id,
    name: item.title,
    price: `$${lowestPrice.toLocaleString()}`,
    rawPrice: lowestPrice,
    badge: {
      text: badgeText,
      color: badgeColor,
    },
    capacity,
    specs,
    features,
    imageUrl: mainImage,
    category: item.product_type || "Bomb Shelters",
    description: item.description_html || "",
    sqft: item.sqft,
    bedrooms: item.bedrooms,
    bathrooms: item.bathrooms,
    stories: item.stories,
    dimensions: item.dimensions,
    primaryImageUrl: mainImage,
    mediaGallery: sortedMedia.map((m: any) => ({
      url: m.source_url,
      alt: m.alt_text || item.title,
      position: m.position,
    })),
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
  };
}

/**
 * Get all active BombShelter products from the database
 */
export async function getBombShelterProducts(onlyActive = true): Promise<ExtendedProductModel[]> {
  if (isSupabaseConfigured()) {
    try {
      let query = (supabaseAdmin || supabase)
        .from("products")
        .select(`
          id,
          title,
          handle,
          description_html,
          vendor,
          product_type,
          status,
          starting_price,
          sqft,
          bedrooms,
          bathrooms,
          stories,
          dimensions,
          primary_image_url,
          features,
          specs,
          tags,
          seo_title,
          seo_description,
          product_variants ( id, price, compare_at_price, sku, title ),
          product_media ( source_url, alt_text, position )
        `)
        .order("title", { ascending: true });

      if (onlyActive) {
        query = query.eq("status", "active");
      }

      // Filter out non-building accessory items from the main catalog
      for (const excluded of EXCLUDED_PRODUCT_TYPES) {
        query = query.neq("product_type", excluded);
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(mapDatabaseRowToModel);
      } else if (error) {
        console.warn("Supabase products fetch warning:", error.message);
      }
    } catch (e) {
      console.warn("Supabase products fetch error, returning fallback:", e);
    }
  }

  // Fallback to local
  return readLocalProducts().map((p) => ({
    ...p,
    primaryImageUrl: p.imageUrl,
    mediaGallery: [{ url: p.imageUrl, alt: p.name }],
  }));
}

/**
 * Get products filtered by product_type matching a navbar category
 */
export async function getProductsByCategory(productType: string, limit = 50): Promise<ExtendedProductModel[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabaseAdmin || supabase)
        .from("products")
        .select(`
          id,
          title,
          handle,
          description_html,
          product_type,
          status,
          starting_price,
          sqft,
          bedrooms,
          bathrooms,
          stories,
          dimensions,
          primary_image_url,
          features,
          specs,
          tags,
          seo_title,
          seo_description,
          product_variants ( id, price, compare_at_price, sku, title ),
          product_media ( source_url, alt_text, position )
        `)
        .eq("status", "active")
        .ilike("product_type", productType)
        .order("starting_price", { ascending: true })
        .limit(limit);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(mapDatabaseRowToModel);
      }
    } catch (e) {
      console.warn("Error fetching products by category:", e);
    }
  }

  // Fallback
  const all = await getBombShelterProducts(true);
  const normalized = productType.toLowerCase();
  return all.filter((p) => p.category.toLowerCase().includes(normalized)).slice(0, limit);
}

/**
 * Get a single BombShelter product by ID or handle
 */
export async function getBombShelterProductById(idOrSlug: string): Promise<ExtendedProductModel | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabaseAdmin || supabase)
        .from("products")
        .select(`
          id,
          title,
          handle,
          description_html,
          product_type,
          status,
          starting_price,
          sqft,
          bedrooms,
          bathrooms,
          stories,
          dimensions,
          primary_image_url,
          features,
          specs,
          tags,
          seo_title,
          seo_description,
          product_variants ( id, price, compare_at_price, sku, title ),
          product_media ( source_url, alt_text, position )
        `)
        .or(`handle.eq.${idOrSlug},id.eq.${idOrSlug}`)
        .maybeSingle();

      if (!error && data) {
        return mapDatabaseRowToModel(data);
      }
    } catch (e) {
      console.warn("Supabase single product fetch error:", e);
    }
  }

  const all = await getBombShelterProducts(false);
  const normalized = idOrSlug.toLowerCase();
  return all.find((p) => p.id.toLowerCase() === normalized || p.id === idOrSlug) || null;
}

/**
 * Count active products grouped by product_type
 */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await (supabaseAdmin || supabase)
        .from("products")
        .select("product_type")
        .eq("status", "active");

      if (!error && Array.isArray(data)) {
        const counts: Record<string, number> = {};
        for (const row of data) {
          const type = row.product_type || "Uncategorized";
          counts[type] = (counts[type] || 0) + 1;
        }
        return counts;
      }
    } catch (e) {
      console.warn("Error getting category counts:", e);
    }
  }

  return {
    "Modular Homes": 35,
    "Barndominiums": 114,
    "House Kits": 269,
    "Cabins": 75,
    "Tiny Homes": 9,
    "A-Frames": 8,
    "ADUs & Granny Pods": 4,
    "Commercial Modular Buildings": 2,
    "Prefab Homes": 1,
    "Park Models": 1,
  };
}

/**
 * Save or update a product (Admin use)
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
      const { data: existing } = await supabaseAdmin
        .from("products")
        .select("id")
        .eq("handle", product.id)
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
        await supabaseAdmin.from("products").update(productPayload).eq("id", existing.id);
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
 * Delete a product (Admin use)
 */
export async function deleteBombShelterProduct(id: string): Promise<boolean> {
  const localList = readLocalProducts();
  const filtered = localList.filter((p) => p.id !== id);
  writeLocalProducts(filtered);

  if (isSupabaseConfigured()) {
    try {
      await supabaseAdmin.from("products").delete().eq("handle", id);
    } catch (e) {
      console.warn("Supabase product delete error:", e);
    }
  }

  return true;
}
