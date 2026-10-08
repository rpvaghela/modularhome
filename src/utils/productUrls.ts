/**
 * Category & Product SEO URL Resolution Utility
 * Maps products and categories to their canonical SEO paths.
 */

export interface ProductUrlInput {
  id?: string | number;
  slug?: string;
  handle?: string;
  title?: string;
  name?: string;
  category?: string;
  product_type?: string;
  series?: string;
  tags?: string[] | string;
}

export const CATEGORY_SLUG_MAP: Record<string, string> = {
  // Standard categories
  "cabins": "cabins",
  "cabin": "cabins",
  "log-cabins": "cabins",
  "modular-cabins": "cabins",
  "prefab-cabins": "cabins",
  "amish-built-cabins": "cabins",

  "modular-homes": "modular-homes",
  "modular-home": "modular-homes",
  "modular": "modular-homes",

  "barndominiums": "barndominiums",
  "barndominium": "barndominiums",
  "barndo": "barndominiums",

  "house-kits": "house-kits",
  "house-kit": "house-kits",
  "home-kits": "house-kits",
  "sip-panel-homes": "house-kits",
  "sip-panel-house-kits": "house-kits",

  "tiny-homes": "tiny-homes",
  "tiny-home": "tiny-homes",
  "tiny-houses": "tiny-homes",
  "tiny-cabins": "tiny-homes",

  "park-models": "park-models",
  "park-model": "park-models",
  "park-model-rvs": "park-models",
  "park-model-homes": "park-models",

  "adus": "adus",
  "adu": "adus",
  "adus-granny-pods": "adus",
  "adus-and-granny-pods": "adus",
  "granny-pods": "adus",

  "a-frame-homes": "a-frame-homes",
  "a-frames": "a-frame-homes",
  "a-frame": "a-frame-homes",

  "prefab-homes": "prefab-homes",
  "prefab-home": "prefab-homes",
  "prefab": "prefab-homes",

  "commercial-buildings": "commercial-buildings",
  "commercial": "commercial-buildings",
  "commercial-steel-buildings": "commercial-buildings",

  "custom-homes": "custom-homes",
  "custom-home": "custom-homes",
  "custom": "custom-homes",
};

export const VALID_PRODUCT_CATEGORIES = [
  "cabins",
  "modular-homes",
  "barndominiums",
  "house-kits",
  "tiny-homes",
  "park-models",
  "adus",
  "a-frame-homes",
  "prefab-homes",
  "commercial-buildings",
  "custom-homes",
] as const;

export type ValidProductCategory = typeof VALID_PRODUCT_CATEGORIES[number];

/**
 * Resolves the canonical category slug for a product
 */
export function getProductCategorySlug(product?: ProductUrlInput | null): ValidProductCategory {
  if (!product) return "modular-homes";

  const rawCat = (product.category || product.product_type || product.series || "").toLowerCase().trim();
  const title = (product.title || product.name || "").toLowerCase().trim();
  const slug = (product.slug || product.handle || "").toLowerCase().trim();
  const tagsStr = Array.isArray(product.tags) ? product.tags.join(" ").toLowerCase() : (product.tags || "").toLowerCase();
  const combined = `${title} ${slug} ${rawCat} ${tagsStr}`;

  // 1. Direct category match
  const catKey = rawCat.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (CATEGORY_SLUG_MAP[catKey]) {
    return CATEGORY_SLUG_MAP[catKey] as ValidProductCategory;
  }

  // 2. Keyword heuristic matching (ordered by specificity)
  if (combined.includes("barndo") || combined.includes("barndominium")) {
    return "barndominiums";
  }

  if (
    combined.includes("cabin") ||
    combined.includes("log home") ||
    combined.includes("timber frame") ||
    combined.includes("amish built cabin") ||
    combined.includes("amish-built-cabin") ||
    slug.includes("cabin") ||
    slug.includes("muchacho") ||
    slug.includes("bertha") ||
    slug.includes("sparrow") ||
    slug.includes("appalachian") ||
    slug.includes("gatlinburg")
  ) {
    return "cabins";
  }

  if (combined.includes("tiny home") || combined.includes("tiny house") || slug.includes("tiny")) {
    return "tiny-homes";
  }

  if (combined.includes("park model") || combined.includes("park-model") || combined.includes("rv")) {
    return "park-models";
  }

  if (combined.includes("adu") || combined.includes("granny pod") || combined.includes("guest house") || combined.includes("in-law")) {
    return "adus";
  }

  if (combined.includes("a-frame") || combined.includes("aframe")) {
    return "a-frame-homes";
  }

  if (
    combined.includes("house kit") ||
    combined.includes("sip panel") ||
    combined.includes("panelized") ||
    combined.includes("home kit") ||
    slug.includes("house-kit") ||
    slug.includes("sip-panel")
  ) {
    return "house-kits";
  }

  if (combined.includes("commercial") || combined.includes("warehouse") || combined.includes("office building")) {
    return "commercial-buildings";
  }

  if (combined.includes("custom home") || combined.includes("custom-designed")) {
    return "custom-homes";
  }

  if (combined.includes("prefab")) {
    return "prefab-homes";
  }

  return "modular-homes";
}

/**
 * Returns the canonical SEO URL for a product (e.g., "/cabins/el-chapo-muchacho")
 */
export function getProductUrl(product?: ProductUrlInput | null): string {
  if (!product) return "/modular-homes";
  const slug = (product.slug || product.handle || product.id || "").toString().trim().toLowerCase();
  if (!slug) return "/modular-homes";

  // Strip any leading slashes or existing prefixes if accidentally passed
  const cleanSlug = slug
    .replace(/^https?:\/\/[^\/]+/i, "")
    .replace(/^\/(?:products|buildings|models|cabins|modular-homes|barndominiums|house-kits|tiny-homes|park-models|adus|a-frame-homes|prefab-homes|commercial-buildings|custom-homes)\//i, "")
    .replace(/^\/+|\/+$/g, "");

  const categorySlug = getProductCategorySlug(product);
  return `/${categorySlug}/${cleanSlug}`;
}

/**
 * Checks if a given path segment is a recognized product category
 */
export function isCategorySlug(slug: string): boolean {
  if (!slug) return false;
  const clean = slug.toLowerCase().trim();
  return Boolean(CATEGORY_SLUG_MAP[clean] || VALID_PRODUCT_CATEGORIES.includes(clean as any));
}

/**
 * Returns display category name from category slug
 */
export function getCategoryDisplayName(slug: string): string {
  const norm = (CATEGORY_SLUG_MAP[slug.toLowerCase()] || slug).toLowerCase();
  switch (norm) {
    case "cabins": return "Cabins";
    case "modular-homes": return "Modular Homes";
    case "barndominiums": return "Barndominiums";
    case "house-kits": return "House Kits";
    case "tiny-homes": return "Tiny Homes";
    case "park-models": return "Park Models";
    case "adus": return "ADUs & Granny Pods";
    case "a-frame-homes": return "A-Frame Homes";
    case "prefab-homes": return "Prefab Homes";
    case "commercial-buildings": return "Commercial Buildings";
    case "custom-homes": return "Custom Homes";
    default:
      return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
