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
  "modular-cabins": "modular-cabins",
  "modular-cabin": "modular-cabins",
  "prefab-cabins": "modular-cabins",
  "prefab-cabin": "modular-cabins",
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

  "commercial-modular-buildings": "commercial-modular-buildings",
  "commercial-buildings": "commercial-modular-buildings",
  "commercial": "commercial-modular-buildings",
  "commercial-steel-buildings": "commercial-modular-buildings",
  "commercial-modular": "commercial-modular-buildings",

  "custom-homes": "custom-homes",
  "custom-home": "custom-homes",
  "custom": "custom-homes",
};

export const VALID_PRODUCT_CATEGORIES = [
  "cabins",
  "modular-cabins",
  "modular-homes",
  "barndominiums",
  "house-kits",
  "tiny-homes",
  "park-models",
  "adus",
  "a-frame-homes",
  "prefab-homes",
  "commercial-modular-buildings",
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

  // 1. Barndominiums & Steel Home Kits (e.g. Grandview, Summit Steel Home Kit)
  if (
    combined.includes("barndo") ||
    combined.includes("barndominium") ||
    slug.includes("grandview") ||
    title.includes("grandview") ||
    slug.includes("the-summit-steel-home-kit") ||
    title.includes("summit steel")
  ) {
    return "barndominiums";
  }

  // 2. House Kits & SIP Panel Home Kits (always canonical /house-kits/, even if tagged Cabins in raw source)
  if (
    slug.includes("house-kit") ||
    slug.includes("home-kit") ||
    slug.includes("housekit") ||
    slug.includes("homekit") ||
    slug.includes("sip-panel") ||
    title.includes("house kit") ||
    title.includes("home kit") ||
    title.includes("sip panel") ||
    rawCat === "house kits" ||
    rawCat === "house-kits" ||
    rawCat === "sip panel homes"
  ) {
    return "house-kits";
  }

  // 3. Modular Cabins & Prefab Cabins
  if (
    (combined.includes("modular cabin") ||
      combined.includes("modular-cabin") ||
      combined.includes("prefab cabin") ||
      combined.includes("prefab-cabin")) &&
    !combined.includes("park model") &&
    rawCat !== "park models" &&
    rawCat !== "park-models"
  ) {
    return "modular-cabins";
  }

  // 4. Direct category match
  const catKey = rawCat.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (CATEGORY_SLUG_MAP[catKey]) {
    return CATEGORY_SLUG_MAP[catKey] as ValidProductCategory;
  }

  // 5. Keyword heuristic matching (ordered by specificity)
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

  if (combined.includes("commercial") || combined.includes("warehouse") || combined.includes("office building") || combined.includes("duplex")) {
    return "commercial-modular-buildings";
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
    .replace(/^\/(?:products|buildings|models|cabins|modular-cabins|modular-homes|barndominiums|house-kits|tiny-homes|park-models|adus|a-frame-homes|prefab-homes|commercial-modular-buildings|commercial-buildings|custom-homes)\//i, "")
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
    case "modular-cabins": return "Modular Cabins";
    case "modular-homes": return "Modular Homes";
    case "barndominiums": return "Barndominiums";
    case "house-kits": return "House Kits";
    case "tiny-homes": return "Tiny Homes";
    case "park-models": return "Park Models";
    case "adus": return "ADUs & Granny Pods";
    case "a-frame-homes": return "A-Frame Homes";
    case "prefab-homes": return "Prefab Homes";
    case "commercial-modular-buildings": return "Commercial Modular Buildings";
    case "commercial-buildings": return "Commercial Modular Buildings";
    case "custom-homes": return "Custom Homes";
    default:
      return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

/**
 * Classifies an unknown URL, slug, page title, or search term to its most relevant
 * category of models or floor plans.
 * Guaranteed to return one of:
 * - "/cabins"
 * - "/barndominiums"
 * - "/tiny-homes"
 * - "/park-models"
 * - "/adus"
 * - "/a-frame-homes"
 * - "/house-kits"
 * - "/commercial-modular-buildings"
 * - "/custom-homes"
 * - "/prefab-homes"
 * - "/floor-plans"
 * - "/modular-homes"
 */
export function resolveSimilarCategoryPath(
  input?: string | { slug?: string; title?: string; text?: string; category?: string } | null
): string {
  if (!input) return "/modular-homes";

  const raw = typeof input === "string"
    ? input
    : `${input.category || ""} ${input.slug || ""} ${input.title || ""} ${input.text || ""}`;

  const stripped = raw
    .replace(/[–-]\s*modular homes.*$/i, "")
    .replace(/\|\s*modularhome\.com.*$/i, "")
    .replace(/[–-]\s*modularhome\.com.*$/i, "")
    .trim();

  const clean = stripped
    .toLowerCase()
    .replace(/^https?:\/\/[^\/]+/i, "")
    .replace(/^\/(?:collections|pages|products|buildings|models|blogs)\//i, "")
    .replace(/[-_&+/|]/g, " ")
    .trim();

  const slugClean = clean.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  // 1. Exact or direct recognized category check
  if (CATEGORY_SLUG_MAP[slugClean]) {
    const mapped = CATEGORY_SLUG_MAP[slugClean];
    return mapped === "commercial-buildings" ? "/commercial-modular-buildings" : `/${mapped}`;
  }

  // 2. Floor plans / bedroom / bathroom counts / dimensions
  if (
    /(\d+[\s_-]?(bed|bath|br|ba))|(floor-?plans?)|(blueprints?)|(house-?plans?)|(\d+\s*x\s*\d+)|(sqft)|(sq-?ft)|(square-?feet)/i.test(clean) &&
    !clean.includes("cabin") &&
    !clean.includes("barndo") &&
    !clean.includes("tiny") &&
    !clean.includes("adu") &&
    !clean.includes("a frame") &&
    !clean.includes("aframe") &&
    !clean.includes("park")
  ) {
    return "/floor-plans";
  }

  // 3. A-Frame Homes
  if (clean.includes("a frame") || clean.includes("aframe") || clean.includes("triangular")) {
    return "/a-frame-homes";
  }

  // 4. Barndominiums & Steel buildings
  if (
    clean.includes("barndo") ||
    clean.includes("barndominium") ||
    clean.includes("clear span") ||
    clean.includes("shop home") ||
    clean.includes("metal home") ||
    clean.includes("metal house") ||
    clean.includes("steel home") ||
    clean.includes("steel house") ||
    clean.includes("steel building") ||
    clean.includes("barn")
  ) {
    return "/barndominiums";
  }

  // 5. Cabins & Log Homes
  if (
    clean.includes("cabin") ||
    clean.includes("log") ||
    clean.includes("timber") ||
    clean.includes("rustic") ||
    clean.includes("bertha") ||
    clean.includes("appalachian") ||
    clean.includes("gatlinburg") ||
    clean.includes("ponderosa") ||
    clean.includes("muchacho") ||
    clean.includes("sparrow") ||
    clean.includes("grizzly") ||
    clean.includes("retreat") ||
    clean.includes("driftwood") ||
    clean.includes("sunnyside") ||
    clean.includes("azteca") ||
    clean.includes("amish") ||
    clean.includes("woodland") ||
    clean.includes("smoky") ||
    clean.includes("blue ridge")
  ) {
    return "/cabins";
  }

  // 6. Tiny Homes & Micro living
  if (
    clean.includes("tiny") ||
    clean.includes("micro") ||
    clean.includes("small space") ||
    clean.includes("firefly") ||
    clean.includes("maddy")
  ) {
    return "/tiny-homes";
  }

  // 7. Park Models & RVs
  if (
    clean.includes("park model") ||
    clean.includes("parkmodel") ||
    clean.includes("rv") ||
    clean.includes("resort") ||
    clean.includes("aspen") ||
    clean.includes("recreational")
  ) {
    return "/park-models";
  }

  // 8. ADUs & Granny Pods
  if (
    clean.includes("adu") ||
    clean.includes("granny") ||
    clean.includes("in law") ||
    clean.includes("backyard") ||
    clean.includes("pod") ||
    clean.includes("guest house")
  ) {
    return "/adus";
  }

  // 9. House Kits & SIP Panels
  if (
    clean.includes("kit") ||
    clean.includes("sip") ||
    clean.includes("panelized") ||
    clean.includes("shell") ||
    clean.includes("diy") ||
    clean.includes("flat pack") ||
    clean.includes("precut")
  ) {
    return "/house-kits";
  }

  // 10. Commercial Modular Buildings
  if (
    clean.includes("commercial") ||
    clean.includes("government") ||
    clean.includes("retail") ||
    clean.includes("office") ||
    clean.includes("warehouse") ||
    clean.includes("duplex") ||
    clean.includes("triplex") ||
    clean.includes("multi family") ||
    clean.includes("multifamily") ||
    clean.includes("apartment") ||
    clean.includes("clinic") ||
    clean.includes("school") ||
    clean.includes("hospital")
  ) {
    return "/commercial-modular-buildings";
  }

  // 11. Custom Homes
  if (
    clean.includes("custom") ||
    clean.includes("bespoke") ||
    clean.includes("design your dream") ||
    clean.includes("dream home")
  ) {
    return "/custom-homes";
  }

  // 12. Prefab Homes
  if (
    clean.includes("prefab") ||
    clean.includes("pre fab") ||
    clean.includes("manufactured") ||
    clean.includes("factory built")
  ) {
    return "/prefab-homes";
  }

  // 13. Default to Modular Homes
  return "/modular-homes";
}

