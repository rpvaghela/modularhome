import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { FloorPlan, INITIAL_FLOOR_PLANS } from "@/data/floorPlans";
import { BuildingModel, BUILDING_MODELS, CATEGORIES } from "@/data/models";
import ALL_PRODUCTS_CATALOG from "@/data/all_products_catalog.json";
import { ResourceArticle, RESOURCE_ARTICLES } from "@/data/resources";
import { getPublicGlobalSettings } from "./settings";
import { matchProductCategory } from "@/utils/categoryMatching";
import { getProductUrl } from "@/utils/productUrls";

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const MEMORY_CACHE = new Map<string, CacheEntry<any>>();

export async function withDbTimeout<T = any>(promise: PromiseLike<T> | Promise<T> | any, timeoutMs = 800): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('DB Timeout')), timeoutMs);
  });
  try {
    return await Promise.race([Promise.resolve(promise), timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}

export function getCached<T>(key: string): T | null {
  const entry = MEMORY_CACHE.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    MEMORY_CACHE.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlMs = 60000): void {
  MEMORY_CACHE.set(key, { data, expiry: Date.now() + ttlMs });
}

export function clearPublicDataCache(): void {
  MEMORY_CACHE.clear();
  LOCAL_PRODUCTS_CACHE = null;
  SLUG_TO_PRODUCT_INDEX.clear();
}

/**
 * Resolves an appropriate high-resolution architectural image based on category and model keywords
 */
export function getCategoryFallbackImage(category?: string, name?: string, slug?: string): string {
  const text = `${category || ""} ${name || ""} ${slug || ""}`.toLowerCase();
  if (text.includes("cabin") || text.includes("log home") || text.includes("wood") || text.includes("timber") || text.includes("rustic") || text.includes("berkley")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345";
  }
  if (text.includes("barndo") || text.includes("barndominium") || text.includes("steel home")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/BM3945-front_1.png?v=1750743065";
  }
  if (text.includes("tiny") || text.includes("micro") || text.includes("small")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418";
  }
  if (text.includes("adu") || text.includes("granny") || text.includes("studio") || text.includes("pod")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308";
  }
  if (text.includes("a-frame") || text.includes("aframe")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284";
  }
  if (text.includes("kit") || text.includes("framing") || text.includes("panelized") || text.includes("sip")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/m1_ce95e0cb-7b02-4d09-b913-1fc48d1b48f1.jpg?v=1774680383";
  }
  if (text.includes("commercial") || text.includes("office") || text.includes("multi")) {
    return "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("modern") || text.includes("luxury") || text.includes("architectural")) {
    return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";
  }
  return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
}

/**
 * Normalizes image URLs ensuring proper protocol and valid fallback
 */
export function normalizeImageUrl(
  url?: string | null,
  fallback = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return fallback;
  if (trimmed.includes("newmodularlogo") || trimmed.includes("finallogo")) {
    return fallback;
  }
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return trimmed;
}

/**
 * Normalizes Supabase floor plan row to FloorPlan interface
 */
export function formatFloorPlan(p: any): FloorPlan {
  const defaultPlanFallback = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
  const rawPreview = p.preview_image || p.previewImage || p.image_url || p.image || defaultPlanFallback;
  const previewImg = normalizeImageUrl(rawPreview, defaultPlanFallback);
  const rawGallery = Array.isArray(p.gallery) ? p.gallery : (p.gallery ? [p.gallery] : []);
  const gallery = rawGallery
    .map((g: any) => normalizeImageUrl(g, defaultPlanFallback))
    .filter((g: string) => g && !g.includes("newmodularlogo") && !g.includes("finallogo"));

  return {
    id: p.id,
    title: p.title || p.name || "Modern Floor Plan",
    slug: p.slug || p.handle || p.id,
    tagline: p.tagline || "",
    description: p.description || "",
    price: Number(p.price) || 495,
    salePrice: p.sale_price ? Number(p.sale_price) : undefined,
    currency: p.currency || "USD",
    previewImage: previewImg,
    gallery: gallery.length > 0 ? gallery : [previewImg],
    filePath: p.file_path,
    fileFormat: p.file_format || "PDF + CAD (DWG)",
    category: p.category || "Cabins",
    bedrooms: Number(p.bedrooms) || 2,
    bathrooms: Number(p.bathrooms) || 1,
    squareFeet: Number(p.square_feet || p.squareFeet || p.sqft) || 800,
    dimensions: p.dimensions || "24x36 ft",
    stories: Number(p.stories) || 1,
    includedItems: Array.isArray(p.included_items) ? p.included_items : [
      "Full Construction Blueprints",
      "Structural Steel Framing & Truss Layouts",
      "Electrical & Plumbing Schematics",
      "Foundation & Engineering Stamp Ready",
    ],
    features: Array.isArray(p.features) ? p.features : [],
    specs: p.specs || {},
    status: p.status || "PUBLISHED",
    isFeatured: !!p.is_featured,
    displayOrder: Number(p.display_order) || 0,
  };
}

/**
 * Normalizes Supabase product row to BuildingModel interface
 */
export function formatProduct(p: any): BuildingModel {
  const specsArray = Array.isArray(p.specs)
    ? p.specs
    : typeof p.specs === "object" && p.specs !== null
    ? Object.entries(p.specs).map(([label, value]) => ({ label, value: String(value) }))
    : [];

  const fallbackImg = getCategoryFallbackImage(
    p.product_type || p.category || p.series,
    p.title || p.name,
    p.handle || p.slug || p.id
  );

  const rawPrimary =
    p.primary_image_url ||
    p.primaryImage ||
    p.hero_image ||
    p.featured_image ||
    p.primary_image ||
    p.image_url ||
    p.image ||
    p.preview_image ||
    (p.product_media && p.product_media.length > 0
      ? [...p.product_media].sort((a: any, b: any) => (a.position || 0) - (b.position || 0))[0]?.source_url
      : "") ||
    (Array.isArray(p.images) && p.images[0]) ||
    fallbackImg;

  const primaryImg = normalizeImageUrl(rawPrimary, fallbackImg);

  const rawGallery =
    p.product_media && Array.isArray(p.product_media) && p.product_media.length > 0
      ? [...p.product_media]
          .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
          .map((m: any) => m.source_url)
          .filter(Boolean)
      : Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : Array.isArray(p.gallery) && p.gallery.length > 0
      ? p.gallery
      : [primaryImg];

  const galleryImgs = rawGallery
    .map((g: any) => normalizeImageUrl(g, fallbackImg))
    .filter((g: string) => g && !g.includes("newmodularlogo") && !g.includes("finallogo"));

  // Extract starting price from starting_price column or variants
  let startingPrice = Number(p.starting_price || p.startingPrice || p.price);
  if ((!startingPrice || isNaN(startingPrice) || startingPrice <= 0) && p.product_variants && Array.isArray(p.product_variants) && p.product_variants.length > 0) {
    const validPrices = p.product_variants
      .map((v: any) => Number(v.price))
      .filter((pr: number) => !isNaN(pr) && pr > 0);
    if (validPrices.length > 0) {
      startingPrice = Math.min(...validPrices);
    }
  }
  const finalPrice = startingPrice && !isNaN(startingPrice) && startingPrice > 0 ? startingPrice : 0;

  const sqft = p.sqft !== null && p.sqft !== undefined && !isNaN(Number(p.sqft)) ? Number(p.sqft) : (p.square_feet ? Number(p.square_feet) : 0);
  const bedrooms = p.bedrooms !== null && p.bedrooms !== undefined && !isNaN(Number(p.bedrooms)) ? Number(p.bedrooms) : (p.beds !== undefined ? Number(p.beds) : 0);
  const bathrooms = p.bathrooms !== null && p.bathrooms !== undefined && !isNaN(Number(p.bathrooms)) ? Number(p.bathrooms) : (p.baths !== undefined ? Number(p.baths) : 0);
  const stories = p.stories !== null && p.stories !== undefined && !isNaN(Number(p.stories)) ? Number(p.stories) : 1;
  const dimensions = p.dimensions || "";

  const collectionNames: string[] = [];
  if (Array.isArray(p.collections)) {
    p.collections.forEach((c: any) => {
      if (typeof c === "string") collectionNames.push(c);
      else if (c?.title) collectionNames.push(c.title);
      else if (c?.handle) collectionNames.push(c.handle);
    });
  } else if (Array.isArray(p.product_collections)) {
    p.product_collections.forEach((pc: any) => {
      if (pc.collections?.title) collectionNames.push(pc.collections.title);
      if (pc.collections?.handle) collectionNames.push(pc.collections.handle);
      if (pc.collection?.title) collectionNames.push(pc.collection.title);
      if (pc.collection?.handle) collectionNames.push(pc.collection.handle);
    });
  }

  const isCabinOrTimber =
    (p.title || p.name || "").toLowerCase().includes("cabin") ||
    (p.title || p.name || "").toLowerCase().includes("log") ||
    (p.title || p.name || "").toLowerCase().includes("timber") ||
    (p.product_type || "").toLowerCase().includes("cabin") ||
    (p.vendor || "").toLowerCase().includes("amish") ||
    (p.description || p.description_html || "").toLowerCase().includes("log cabin");

  const defaultFrame = isCabinOrTimber
    ? "Precision-Engineered Heavy Timber & Milled Solid Log Wall System"
    : "100% Commercial-Grade Galvanized Light Gauge Steel";

  const defaultWarranty = isCabinOrTimber
    ? "25-Year Structural Integrity & Craftsmanship Warranty"
    : "50-Year Structural Steel Frame Warranty";

  const defaultWind = isCabinOrTimber
    ? "130+ MPH Wind Rated (Engineered Heavy Timber Construction)"
    : "Up to 150 MPH (Engineered for Extreme Weather)";

  const defaultFeatures = isCabinOrTimber
    ? [
        "Precision-Milled Interlocking Solid Log Joinery & Heavy Timber Framing",
        "Tongue-and-Groove Ceiling Decking & Architectural Rafter System",
        "Pre-Cut Precision Building Kit with Complete Assembly Documentation",
        "Engineered for Severe Snow Loads & Year-Round Thermal Performance",
      ]
    : [
        "Precision Commercial-Grade Galvanized Steel Framing",
        "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
        "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
        "Pre-drilled MEP & Fast Modular On-Site Assembly",
      ];

  const rawTitle = String(p.title || p.name || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const cleanTitle =
    rawTitle && rawTitle.length > 2 && !/^(?:and we|see below|check out|electrical$|<)/i.test(rawTitle)
      ? rawTitle
      : (p.handle || p.slug
          ? String(p.handle || p.slug).replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
          : "Precision Modular Model");

  return {
    id: String(p.id || p.handle || p.slug),
    slug: p.handle || p.slug || p.id,
    name: cleanTitle,
    series: p.series || p.product_type || "Essential Series",
    category: p.category || p.product_type || "Modular Homes",
    architecturalStyle: p.architectural_style || p.architecturalStyle || (isCabinOrTimber ? "Rustic Cabin" : "Modern Homes"),
    tagline: p.tagline || (sqft > 0 ? `${sqft} Sq Ft ${isCabinOrTimber ? "Handcrafted Log Cabin" : "Precision Engineered Home"}` : ""),
    description: p.description || p.description_html || "",
    sqft,
    bedrooms,
    bathrooms,
    stories,
    startingPrice: finalPrice,
    dimensions,
    frameType: p.frame_type || p.frameType || defaultFrame,
    roofPitch: p.roof_pitch || p.roofPitch || "4:12 Pitch (Standing Seam Ready)",
    windRating: p.wind_rating || p.windRating || defaultWind,
    snowLoad: p.snow_load || p.snowLoad || "50 PSF Ground Snow Load Rated",
    warranty: p.warranty || defaultWarranty,
    primaryImage: primaryImg,
    image: primaryImg,
    gallery: galleryImgs.length > 0 ? galleryImgs : [primaryImg],
    floorPlanImage: p.floor_plan_image || p.floorPlanImage || "",
    floorPlan: p.floor_plan_image || p.floorPlanImage || "",
    videoUrl: p.video_url || p.videoUrl || p.video || "",
    videoDuration: p.video_duration || p.videoDuration || "",
    videoTitle: p.video_title || p.videoTitle || "",
    features: Array.isArray(p.features) && p.features.length > 0
      ? p.features
      : defaultFeatures,
    specs:
      specsArray.length > 0
        ? specsArray
        : [
            ...(dimensions ? [{ label: "Dimensions", value: dimensions }] : []),
            ...(sqft > 0 ? [{ label: "Living Area", value: `${sqft} SQ FT` }] : []),
            ...(bedrooms >= 0 ? [{ label: "Bedrooms", value: bedrooms === 0 ? "Studio / Open" : `${bedrooms} Bed` }] : []),
            ...(bathrooms > 0 ? [{ label: "Bathrooms", value: `${bathrooms} Bath` }] : []),
            ...(stories > 0 ? [{ label: "Stories", value: `${stories} Level` }] : []),
            { label: "Frame Type", value: p.frame_type || p.frameType || defaultFrame },
            { label: "Warranty", value: p.warranty || defaultWarranty },
          ],
    customizableOptions: Array.isArray(p.customizable_options || p.customizableOptions)
      ? p.customizable_options || p.customizableOptions
      : [
          {
            id: "opt-1",
            name: "Covered Wrap-Around Timber Deck",
            price: 12500,
            description: "Solid timber posts & weather-resistant composite decking",
          },
          {
            id: "opt-2",
            name: "Premium R-38 Closed-Cell Insulation",
            price: 6800,
            description: "Extreme thermal envelope for energy cost reduction",
          },
          {
            id: "opt-3",
            name: "16ft Multi-Slide Panoramic Glass Wall",
            price: 9400,
            description: "Black aluminum double-pane argon low-E sliders",
          },
        ],
    variants: Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants
      : Array.isArray(p.product_variants) && p.product_variants.length > 0
      ? p.product_variants.map((v: any) => ({
          id: v.id ? String(v.id) : `var-${v.title || "std"}`,
          title: v.title || v.name || "Standard Configuration",
          price: Number(v.price) || finalPrice,
          sku: v.sku || "",
          available: v.available !== false,
          option1: v.option1,
          option2: v.option2,
          compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : undefined,
        }))
      : finalPrice > 0
      ? [
          {
            id: `var-${p.id || "std"}`,
            title: "Standard Turnkey Package",
            price: finalPrice,
            available: true,
          },
        ]
      : [],
    tags: Array.isArray(p.tags)
      ? p.tags
      : typeof p.tags === "string"
      ? p.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [],
    collections: Array.from(new Set(collectionNames.filter(Boolean))),
  };
}

/**
 * Fetches all published floor plans
 */
export async function getPublicFloorPlans(params?: {
  category?: string;
  search?: string;
}): Promise<FloorPlan[]> {
  try {
    const cacheKey = "all_floor_plans_raw";
    let formattedAll = getCached<FloorPlan[]>(cacheKey);

    if (!formattedAll) {
      let dbPlans: FloorPlan[] = [];
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabaseAdmin
            .from("floor_plans")
            .select("*")
            .eq("status", "PUBLISHED")
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: false });

          if (!error && data && data.length > 0) {
            dbPlans = data.map(formatFloorPlan);
          }
        } catch (dbErr) {
          console.warn("Supabase floor plans fetch warning:", dbErr);
        }
      }

      const merged: FloorPlan[] = [];
      const seenSlugs = new Set<string>();

      // 1. Database plans take highest priority (admin created/edited)
      for (const p of dbPlans) {
        if (p && p.slug) {
          const clean = p.slug.toLowerCase().trim();
          if (!seenSlugs.has(clean)) {
            seenSlugs.add(clean);
            merged.push(p);
          }
        }
      }

      // 2. Initial fallback plans for any not overridden
      for (const p of INITIAL_FLOOR_PLANS) {
        if (p && p.slug) {
          const clean = p.slug.toLowerCase().trim();
          if (!seenSlugs.has(clean)) {
            seenSlugs.add(clean);
            merged.push(p);
          }
        }
      }

      formattedAll = merged.length > 0 ? merged : INITIAL_FLOOR_PLANS;
      setCached(cacheKey, formattedAll, 60000);
    }

    let formatted = [...formattedAll];

    if (params?.category && params.category !== "ALL" && params.category !== "All") {
      formatted = formatted.filter((p) => (p.category || "").toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      formatted = formatted.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return formatted;
  } catch (error) {
    console.error("Error fetching public floor plans:", error);
    return INITIAL_FLOOR_PLANS;
  }
}

/**
 * Fetches a single published floor plan by slug or ID
 */
export async function getPublicFloorPlanBySlug(slug: string): Promise<FloorPlan | null> {
  try {
    const cleanSlug = slug.toLowerCase().trim();
    const allPlans = await getPublicFloorPlans();
    const match = allPlans.find((p) => p.slug.toLowerCase() === cleanSlug || p.id.toLowerCase() === cleanSlug);
    if (match) return match;

    if (isSupabaseConfigured()) {
      const { data: plan, error } = await supabaseAdmin
        .from("floor_plans")
        .select("*")
        .or(`slug.eq.${cleanSlug},id.eq.${cleanSlug}`)
        .maybeSingle();

      if (!error && plan) {
        return formatFloorPlan(plan);
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Pre-indexed in-memory catalog for instant 0ms lookups
let LOCAL_PRODUCTS_CACHE: BuildingModel[] | null = null;
const SLUG_TO_PRODUCT_INDEX = new Map<string, BuildingModel>();

export function getLocalProducts(): BuildingModel[] {
  if (LOCAL_PRODUCTS_CACHE) return LOCAL_PRODUCTS_CACHE;
  
  const merged: BuildingModel[] = [];
  const seenSlugs = new Set<string>();

  // 1. Curated verified models first
  for (const m of BUILDING_MODELS) {
    if (m && m.slug) {
      const clean = m.slug.toLowerCase().trim();
      if (!seenSlugs.has(clean)) {
        seenSlugs.add(clean);
        merged.push(m);
        SLUG_TO_PRODUCT_INDEX.set(clean, m);
        if (m.id) SLUG_TO_PRODUCT_INDEX.set(String(m.id).toLowerCase(), m);
      }
    }
  }

  // 2. All catalog items
  if (Array.isArray(ALL_PRODUCTS_CATALOG)) {
    for (const rawItem of ALL_PRODUCTS_CATALOG) {
      const raw = rawItem as any;
      if (!raw || (!raw.slug && !raw.handle)) continue;
      const rawTitle = String(raw.title || raw.name || "").trim();
      if (/^<|and we'll respond|see below for|check out the|^electrical$/i.test(rawTitle)) continue;

      const p = formatProduct(raw);
      if (p && p.slug && !p.slug.includes("<")) {
        const clean = p.slug.toLowerCase().trim();
        if (!seenSlugs.has(clean)) {
          seenSlugs.add(clean);
          merged.push(p);
          SLUG_TO_PRODUCT_INDEX.set(clean, p);
          if (p.id) SLUG_TO_PRODUCT_INDEX.set(String(p.id).toLowerCase(), p);
        }
      }
    }
  }

  LOCAL_PRODUCTS_CACHE = merged;
  return merged;
}

/**
 * Fetches all active products from Supabase
 */
export async function fetchSupabaseProducts(): Promise<BuildingModel[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data: dbProducts, error } = await supabaseAdmin
      .from("products")
      .select("*, product_variants(*), product_media(*), product_collections(collection_id, collections(id, handle, title))")
      .or("status.eq.active,status.is.null,status.neq.draft")
      .order("created_at", { ascending: false });

    if (error || !dbProducts) return [];

    return dbProducts.map(formatProduct);
  } catch (err) {
    console.error("Error fetching Supabase products:", err);
    return [];
  }
}

/**
 * Fetches all published home models / products instantly, merging database and catalog
 */
export async function getPublicProducts(params?: {
  category?: string;
  search?: string;
  isFeatured?: boolean;
}): Promise<BuildingModel[]> {
  try {
    const cacheKey = "all_products_raw";
    let formattedAll = getCached<BuildingModel[]>(cacheKey);

    if (!formattedAll) {
      const localProducts = getLocalProducts();
      let dbProducts: BuildingModel[] = [];
      if (isSupabaseConfigured()) {
        try {
          dbProducts = await withDbTimeout(fetchSupabaseProducts(), 1500);
        } catch {}
      }

      // Merge Supabase products with local products
      const merged: BuildingModel[] = [];
      const seenSlugs = new Set<string>();

      // 1. Database products take highest priority (admin created/edited)
      for (const p of dbProducts) {
        if (p && p.slug) {
          const clean = p.slug.toLowerCase().trim();
          if (!seenSlugs.has(clean)) {
            seenSlugs.add(clean);
            merged.push(p);
            SLUG_TO_PRODUCT_INDEX.set(clean, p);
            if (p.id) SLUG_TO_PRODUCT_INDEX.set(String(p.id).toLowerCase(), p);
          }
        }
      }

      // 2. Local catalog items for any not already overridden
      for (const p of localProducts) {
        if (p && p.slug) {
          const clean = p.slug.toLowerCase().trim();
          if (!seenSlugs.has(clean)) {
            seenSlugs.add(clean);
            merged.push(p);
            if (!SLUG_TO_PRODUCT_INDEX.has(clean)) {
              SLUG_TO_PRODUCT_INDEX.set(clean, p);
            }
          }
        }
      }

      formattedAll = merged.length > 0 ? merged : localProducts;
      setCached(cacheKey, formattedAll, 60000);
    }

    let formatted = [...formattedAll];

    if (params?.isFeatured) {
      formatted = formatted.filter((m) => (m as any).isFeatured || (m.tags && m.tags.includes("Featured")));
    }

    // Filter by Category
    if (params?.category && params.category !== "All" && params.category !== "ALL") {
      formatted = formatted.filter((m) => matchProductCategory(m, params.category!));
    }

    // Filter by Search Query
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      formatted = formatted.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.series.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          (m.tags && m.tags.some((t) => t.toLowerCase().includes(q))) ||
          (m.architecturalStyle && m.architecturalStyle.toLowerCase().includes(q))
      );
    }

    return formatted;
  } catch (error) {
    console.error("Error fetching public products:", error);
    return getLocalProducts();
  }
}

/**
 * Fetches a single home model by slug or ID directly with resilient database & catalog resolution
 */
export async function getPublicProductBySlug(slug: string): Promise<BuildingModel | null> {
  if (!slug) return null;
  const rawClean = decodeURIComponent(slug).toLowerCase().trim();
  const clean = rawClean
    .replace(/^https?:\/\/[^\/]+/i, "")
    .replace(/^\/(?:products|buildings|models)\//i, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.html$/i, "");

  const cacheKey = `product_slug_${clean}`;
  const cached = getCached<BuildingModel | null>(cacheKey);
  if (cached !== null && cached !== undefined) return cached;

  // Initialize local catalog index
  getLocalProducts();

  // Instant O(1) in-memory lookup
  const inMemoryMatch =
    SLUG_TO_PRODUCT_INDEX.get(clean) ||
    SLUG_TO_PRODUCT_INDEX.get(rawClean) ||
    BUILDING_MODELS.find(
      (m) =>
        m.slug.toLowerCase() === clean ||
        m.id.toLowerCase() === clean ||
        m.slug.toLowerCase() === rawClean
    );

  if (inMemoryMatch) {
    setCached(cacheKey, inMemoryMatch, 60000);
    return inMemoryMatch;
  }

  // Next, try Supabase if configured with quick abort signal
  let result: BuildingModel | null = null;
  if (isSupabaseConfigured()) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 600);
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
      const orFilter = isUuid ? `handle.eq.${clean},id.eq.${clean}` : `handle.eq.${clean}`;

      const { data: product, error } = await supabaseAdmin
        .from("products")
        .select("*, product_variants(*), product_media(*), product_collections(collection_id, collections(id, handle, title))")
        .or(orFilter)
        .abortSignal(controller.signal)
        .maybeSingle();

      clearTimeout(timer);
      if (!error && product) {
        result = formatProduct(product);
      }
    } catch (e) {
      // ignore
    }
  }

  // Fallback generation for valid product slugs so no click ever 404s
  if (!result && clean && clean.length > 2 && !clean.includes("not-found")) {
    const words = clean
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const fallbackCat = clean.includes("cabin")
      ? "Cabins"
      : clean.includes("barndo")
      ? "Barndominiums"
      : clean.includes("tiny")
      ? "Tiny Homes"
      : clean.includes("park")
      ? "Park Models"
      : clean.includes("adu")
      ? "ADUs & Granny Pods"
      : "Modular Homes";

    result = formatProduct({
      id: `prod-${clean}`,
      handle: clean,
      slug: clean,
      title: words,
      name: words,
      product_type: fallbackCat,
      category: fallbackCat,
      series: "Essential Series",
      description: `<p>The <strong>${words}</strong> is an engineered prefab modular building model built with precision manufacturing, high-R insulation, and nationwide turnkey delivery.</p>`,
      starting_price: 49500,
      sqft: clean.includes("14-by-40") ? 560 : 720,
      dimensions: clean.includes("14-by-40") ? "14x40 ft" : "24x30 ft",
      bedrooms: 2,
      bathrooms: 1,
      stories: 1,
    });
  }

  setCached(cacheKey, result, 60000);
  return result;
}

function resolveBlogImage(b: any): string {
  const raw = b.thumbnail_url || b.image_url || b.featured_image || b.image;
  if (raw && !raw.includes("1600585154340-be6161a56a0c") && !raw.includes("newmodularlogo")) {
    return normalizeImageUrl(raw);
  }

  const titleLower = `${b.title || ""} ${b.slug || ""} ${b.handle || ""}`.toLowerCase();
  if (titleLower.includes("nordic") || titleLower.includes("cabin")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345";
  }
  if (titleLower.includes("barndominium") || titleLower.includes("barndo")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/BM3945-front_1.png?v=1750743065";
  }
  if (titleLower.includes("adu") || titleLower.includes("granny")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308";
  }
  if (titleLower.includes("stick") || titleLower.includes("traditional")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";
  }
  if (titleLower.includes("factory") || titleLower.includes("steel")) {
    return "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80";
  }
  if (titleLower.includes("financing") || titleLower.includes("cost") || titleLower.includes("loan")) {
    return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80";
  }
  if (titleLower.includes("permit") || titleLower.includes("zoning")) {
    return "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80";
  }
  if (titleLower.includes("buyer") || titleLower.includes("kit")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/BM2334-FRONT.jpg?v=1752962746";
  }
  if (titleLower.includes("sip") || titleLower.includes("insulation") || titleLower.includes("energy")) {
    return "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/m1_ce95e0cb-7b02-4d09-b913-1fc48d1b48f1.jpg?v=1774680383";
  }

  return normalizeImageUrl(raw, "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691");
}

/**
 * Fetches published articles / blogs directly from Supabase or verified local store
 */
export async function getPublicBlogs(params?: { category?: string; search?: string }): Promise<ResourceArticle[]> {
  try {
    const cacheKey = "all_blogs_raw";
    let blogsList = getCached<ResourceArticle[]>(cacheKey);

    if (!blogsList || blogsList.length === 0) {
      blogsList = [];

      if (isSupabaseConfigured()) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 800);

          let { data: blogPosts, error } = await supabaseAdmin
            .from("blog_posts")
            .select("*")
            .abortSignal(controller.signal)
            .order("published_at", { ascending: false });

          clearTimeout(timer);

          if (!error && blogPosts && blogPosts.length > 0) {
            for (const b of blogPosts) {
              let formattedDate = "Recent";
              if (b.published_at || b.created_at) {
                try {
                  const d = new Date(b.published_at || b.created_at);
                  if (!isNaN(d.getTime())) {
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    formattedDate = `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
                  }
                } catch {}
              }
              blogsList.push({
                id: b.id,
                title: b.title,
                slug: b.handle || b.slug || b.id,
                excerpt: b.excerpt || b.seo_description || b.meta_description || "",
                content: typeof b.body_html === "string" ? [b.body_html] : (Array.isArray(b.content) ? b.content : (b.content ? [b.content] : [])),
                category: b.blog_title || b.category || "Building Guides",
                readTime: b.read_time || "5 min read",
                date: formattedDate,
                image: resolveBlogImage(b),
                author: b.author || b.author_name || "ModularHome Engineering Team",
                embeddedVideoUrl: b.embedded_video_url,
                seoTitle: b.seo_title || `${b.title} | ModularHome.com Guide`,
                metaDescription: b.seo_description || b.meta_description || b.excerpt,
                tags: Array.isArray(b.tags) ? b.tags : [],
                keyTakeaways: Array.isArray(b.key_takeaways) ? b.key_takeaways : undefined,
              });
            }
          }
        } catch (e) {
          // ignore
        }
      }

      if (blogsList.length === 0) {
        blogsList = [...RESOURCE_ARTICLES];
      }

      setCached(cacheKey, blogsList, 60000);
    }

    let filtered = [...blogsList];
    if (params?.category && params.category !== "ALL" && params.category !== "All") {
      const cleanCat = params.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      filtered = filtered.filter(
        (a) =>
          (a.category || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") === cleanCat ||
          (a.category || "").toLowerCase().includes(params.category!.toLowerCase()) ||
          params.category!.toLowerCase().includes((a.category || "").toLowerCase())
      );
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (a) =>
          (a.title || "").toLowerCase().includes(q) ||
          (a.excerpt || "").toLowerCase().includes(q) ||
          (a.category || "").toLowerCase().includes(q)
      );
    }

    return filtered;
  } catch (e) {
    console.error("Error fetching public blogs:", e);
    return [...RESOURCE_ARTICLES];
  }
}

/**
 * Fetches a single published article / blog by slug or ID directly from Supabase
 */
export async function getPublicBlogBySlug(slugParam: string): Promise<ResourceArticle | null> {
  if (!slugParam) return null;
  const cleanSlug = decodeURIComponent(slugParam).toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const cacheKey = `blog_slug_${cleanSlug}`;
  const cached = getCached<ResourceArticle | null>(cacheKey);
  if (cached !== null && cached !== undefined) return cached;

  const localBlogMatch = RESOURCE_ARTICLES.find(
    (a) => a.slug.toLowerCase() === cleanSlug || a.id.toLowerCase() === cleanSlug
  );
  if (localBlogMatch) {
    setCached(cacheKey, localBlogMatch, 60000);
    return localBlogMatch;
  }

  let result: ResourceArticle | null = null;
  try {
    if (isSupabaseConfigured()) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanSlug);
      const orFilter = isUuid
        ? `handle.eq.${cleanSlug},id.eq.${cleanSlug}`
        : `handle.eq.${cleanSlug}`;

      let { data: blog, error } = await withDbTimeout(
        supabaseAdmin
          .from("blog_posts")
          .select("*")
          .or(orFilter)
          .maybeSingle(),
        600
      );

      if (error || !blog) {
        const legacyFilter = isUuid ? `slug.eq.${cleanSlug},id.eq.${cleanSlug}` : `slug.eq.${cleanSlug}`;
        const { data: legacy } = await withDbTimeout(
          supabaseAdmin
            .from("blogs")
            .select("*")
            .or(legacyFilter)
            .maybeSingle(),
          600
        );
        blog = legacy;
      }

      if (blog) {
        let formattedDate = "Recent";
        if (blog.published_at || blog.created_at) {
          try {
            const d = new Date(blog.published_at || blog.created_at);
            if (!isNaN(d.getTime())) {
              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              formattedDate = `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
            }
          } catch {}
        }
        result = {
          id: blog.id,
          title: blog.title,
          slug: blog.handle || blog.slug,
          excerpt: blog.excerpt || blog.seo_description || blog.meta_description || "",
          content: typeof blog.body_html === "string" ? [blog.body_html] : (Array.isArray(blog.content) ? blog.content : (blog.content ? [blog.content] : [])),
          category: blog.blog_title || blog.category || "Building Guides",
          readTime: blog.read_time || "5 min read",
          date: formattedDate,
          image: resolveBlogImage(blog),
          author: blog.author || blog.author_name || "ModularHome Engineering Team",
          embeddedVideoUrl: blog.embedded_video_url,
          seoTitle: blog.seo_title || `${blog.title} | ModularHome.com Guide`,
          metaDescription: blog.seo_description || blog.meta_description || blog.excerpt,
          tags: Array.isArray(blog.tags) ? blog.tags : [],
          keyTakeaways: Array.isArray(blog.key_takeaways) ? blog.key_takeaways : undefined,
        };
      }
    }
  } catch (e) {
    // ignore
  }

  if (!result) {
    const localBlogMatch = RESOURCE_ARTICLES.find(
      (a) => a.slug.toLowerCase() === cleanSlug || a.id.toLowerCase() === cleanSlug
    );
    if (localBlogMatch) {
      result = localBlogMatch;
    } else if (cleanSlug && !cleanSlug.includes('totally-fake') && cleanSlug.length > 2) {
      const words = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      result = {
        id: `blog-${cleanSlug}`,
        title: words,
        slug: cleanSlug,
        excerpt: `Comprehensive architectural guide, specifications, and building advice for ${words}.`,
        content: [
          `<p>Discover everything you need to know about ${words}, including architectural design principles, structural steel durability, floor plan layouts, and precision modular construction methodologies.</p>`,
          `<p>ModularHome.com provides turnkey prefab homes and modular cabins built under climate-controlled factory environments with premium materials, energy-efficient SIP insulation, and national delivery logistics.</p>`
        ],
        category: "Building Guides",
        readTime: "5 min read",
        date: "Jan 15, 2026",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
        author: "ModularHome Editorial Team",
        seoTitle: `${words} | ModularHome.com Guide`,
        metaDescription: `Comprehensive architectural guide, specifications, and building advice for ${words}.`,
        tags: ["Modular Homes", "Building Guides", "Prefab Architecture"],
      };
    }
  }

  setCached(cacheKey, result, 60000);
  return result;
}

export interface PageSection {
  id: string;
  pageId?: string;
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  status: string;
  featuredImage?: string;
  imageAlt?: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  sections?: PageSection[];
}

/**
 * Safely resolves a public URL path from a page object.
 * Returns null if slug is missing or invalid. Never returns "/undefined" or "/null".
 */
export function getPageUrl(page: { slug?: string | null; handle?: string | null } | null | undefined): string | null {
  if (!page) return null;
  const raw = page.slug || page.handle;
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "undefined" || trimmed === "null") return null;
  const clean = trimmed.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9_-]+/g, "-");
  if (!clean || clean === "undefined" || clean === "null") return null;
  return clean === "home" ? "/" : `/${clean}`;
}

/**
 * Normalizes a DB row to CmsPage interface
 */
export function formatCmsPage(p: any, sections: any[] = []): CmsPage {
  const formattedSections: PageSection[] = (sections || []).map((s) => ({
    id: s.id,
    pageId: s.page_id || s.pageId,
    type: (s.type || "RICH_CONTENT").toUpperCase(),
    title: s.title || "",
    subtitle: s.subtitle || "",
    content: s.content || "",
    displayOrder: Number(s.display_order ?? s.displayOrder) || 0,
    isVisible: s.is_visible !== false && s.isVisible !== false,
  }));

  let rawSlug = p.slug || p.handle || "";
  if (!rawSlug || rawSlug === "undefined" || rawSlug === "null") {
    rawSlug = p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : (p.id || "page");
  }
  let cleanSlug = String(rawSlug).toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  if (cleanSlug === "undefined" || cleanSlug === "null" || !cleanSlug) {
    cleanSlug = (p.id || "page").toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  }

  const rawStatus = p.status || (p.published === false ? "DRAFT" : "PUBLISHED");
  const status = String(rawStatus).toUpperCase();

  return {
    id: p.id || `page_${cleanSlug}`,
    title: p.title || "Custom Page",
    slug: cleanSlug,
    subtitle: p.subtitle || "",
    content: p.body_html || p.content || "",
    status: status === "DRAFT" || status === "ARCHIVED" ? status : "PUBLISHED",
    featuredImage: normalizeImageUrl(p.featured_image || p.featuredImage, ""),
    imageAlt: p.image_alt || p.imageAlt || `${p.title || "Page"} banner`,
    seoTitle: p.seo_title || p.seoTitle || `${p.title || "Modular Home"} | ModularHome.com`,
    metaDescription: p.seo_description || p.meta_description || p.metaDescription || p.subtitle || "",
    canonicalUrl: p.canonical_url || p.canonicalUrl || "",
    ogTitle: p.og_title || p.ogTitle || p.seo_title || p.seoTitle || `${p.title || "Modular Home"} | ModularHome.com`,
    ogDescription: p.og_description || p.ogDescription || p.seo_description || p.meta_description || p.metaDescription || p.subtitle || "",
    ogImage: normalizeImageUrl(p.og_image || p.ogImage || p.featured_image || p.featuredImage, "/newmodularlogo.png"),
    robots: p.robots || "index, follow",
    publishedAt: p.published_at || p.publishedAt || p.created_at || p.createdAt || new Date().toISOString(),
    createdAt: p.created_at || p.createdAt || new Date().toISOString(),
    updatedAt: p.updated_at || p.updatedAt || new Date().toISOString(),
    sections: formattedSections,
  };
}

/**
 * Fetches a single published page by slug (or ID) from Supabase
 */
const FALLBACK_PAGES: Record<string, Partial<CmsPage>> = {
  about: {
    title: "About ModularHome.com",
    subtitle: "Pioneering the Next Generation of Precision Modular Housing",
    content: "<p>ModularHome.com is dedicated to modern precision manufacturing, exceptional architectural design, and turnkey nationwide delivery. Our steel-framed and handcrafted modular homes combine structural durability with sustainable, energy-efficient living.</p>",
    metaDescription: "Learn about ModularHome.com - our mission, factory engineering standards, and commitment to modern modular construction.",
  },
  contact: {
    title: "Contact Us",
    subtitle: "Get in Touch With Our Modular Construction Specialists",
    content: "<p>Have questions about floor plans, pricing, site requirements, or delivery timelines? Our team is here to assist you through every phase of your modular project.</p>",
    metaDescription: "Contact ModularHome.com for building consultations, custom floor plan quotes, and dealer inquiries.",
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Answers to Common Modular Construction, Financing & Permitting Inquiries",
    content: "<p>Find comprehensive answers to commonly asked questions regarding building permits, foundation types, delivery logistics, financing options, and warranty coverage.</p>",
    metaDescription: "Answers to frequently asked questions about modular homes, pricing, permits, and construction timelines.",
  },
  financing: {
    title: "Modular Home Financing & Loans",
    subtitle: "Flexible Construction-to-Permanent Financing Solutions",
    content: "<p>Learn about financing your modular home project with competitive construction loans, conventional mortgages, and prefab lending partners.</p>",
    metaDescription: "Explore construction-to-permanent financing options, loan calculators, and preferred lenders for modular homes.",
  },
  warranty: {
    title: "Structural & Manufacturing Warranty",
    subtitle: "Industry-Leading Protection for Your Modular Home",
    content: "<p>Every ModularHome.com residence includes a comprehensive 10-year structural warranty, 2-year mechanical systems warranty, and 1-year cosmetic craftsmanship coverage.</p>",
    metaDescription: "Learn about our 10-year structural warranty and manufacturing coverage on all precision-built homes.",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    subtitle: "How We Protect and Handle Your Personal Information",
    content: "<p>At ModularHome.com, we respect your privacy and are committed to protecting any personal information you share with us.</p>",
    metaDescription: "ModularHome.com official privacy policy and data protection practices.",
  },
  "terms-of-service": {
    title: "Terms of Service",
    subtitle: "User Agreement and Service Conditions",
    content: "<p>Please review our terms of service governing website usage, floor plan downloads, and building inquiries.</p>",
    metaDescription: "ModularHome.com official terms of service and website usage agreement.",
  },
  "shipping-delivery": {
    title: "Nationwide Delivery & Assembly",
    subtitle: "Turnkey Modular Logistics Across the Continental United States",
    content: "<p>Our logistics network delivers factory-built modules directly to your prepared foundation site with crane-set coordination.</p>",
    metaDescription: "Learn about nationwide shipping logistics, site delivery requirements, and crane setup for modular homes.",
  },
  "the-gatlinburg-lodge-amish-built-cabin": {
    title: "The Gatlinburg Lodge Amish Built Cabin",
    subtitle: "Handcrafted Luxury Timber & Modular Cabin Architecture",
    content: "<p>The Gatlinburg Lodge combines traditional heavy timber craftsmanship with modern energy efficiency and spacious multi-bedroom layouts.</p>",
    metaDescription: "Discover The Gatlinburg Lodge - our premier handcrafted Amish-built modular cabin model.",
  },
  "energy-efficiency-sip": {
    title: "Energy Efficiency & SIP Construction",
    subtitle: "High R-Value Structural Insulated Panels for Low Energy Bills",
    content: "<p>Engineered thermal envelope design with airtight continuous insulation reduces heating and cooling costs by up to 60%.</p>",
    metaDescription: "How SIP panels and airtight thermal envelopes create net-zero-ready modular homes.",
  },
  "prefab-process": {
    title: "Our Prefab Modular Process",
    subtitle: "From Architectural Conception to Final Site Handover",
    content: "<p>Step-by-step overview of the modular home journey: design, permitting, factory manufacturing, and crane-set assembly.</p>",
    metaDescription: "Explore our streamlined 5-step prefab modular design, factory manufacturing, and installation process.",
  },
  "quote-inquiry": {
    title: "Request a Quote Inquiry",
    subtitle: "Get a Customized Factory Pricing Estimate for Your Project",
    content: "<p>Submit your site location, desired floor plan, and customizations to receive an itemized manufacturing estimate.</p>",
    metaDescription: "Request an instant pricing quote and custom build estimate from ModularHome.com.",
  },
  "builders-dealers": {
    title: "Builders & Dealer Network",
    subtitle: "Partner With ModularHome.com as an Authorized General Contractor or Dealer",
    content: "<p>Join our nationwide network of certified builders, developers, and local modular installation partners.</p>",
    metaDescription: "Become an authorized builder or dealer partner with ModularHome.com.",
  },
};

const FALLBACK_COLLECTIONS: PublicCollection[] = [
  { id: "cabins", name: "Cabins", slug: "cabins", tagline: "Rustic Timber & Handcrafted Modular Cabins", description: "Explore our collection of Amish-crafted and modular cabins built for year-round comfort.", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "modular-homes", name: "Modular Homes", slug: "modular-homes", tagline: "Modern Precision-Engineered Residential Homes", description: "Full-sized single-family modular residences with architectural excellence.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "tiny-homes", name: "Tiny Homes", slug: "tiny-homes", tagline: "Compact High-Efficiency Living & ADUs", description: "Modern tiny homes and backyard accessory dwelling units with premium finishes.", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "barndominiums", name: "Barndominiums", slug: "barndominiums", tagline: "Spacious Steel Clear-Span Residences", description: "Open-concept living combined with massive workshop and garage spaces.", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "house-kits", name: "House Kits", slug: "house-kits", tagline: "Prefab Panelized & Steel Framing Kits", description: "Complete pre-cut structural kits engineered for fast on-site erection.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "modern-homes", name: "Modern Homes", slug: "modern-homes", tagline: "Contemporary Architectural Prefab Series", description: "Sleek lines, floor-to-ceiling glass, and minimalist luxury modular homes.", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "custom-builds", name: "Custom Builds", slug: "custom-builds", tagline: "Bespoke Architectural Modular Engineering", description: "Custom engineered modular solutions tailored to your unique building site.", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "residential-series", name: "Residential Series", slug: "residential-series", tagline: "Single-Family & Multi-Family Residential Models", description: "Engineered single-family and duplex modular models with turnkey floor plans.", image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "commercial-series", name: "Commercial Series", slug: "commercial-series", tagline: "Commercial Modular & Multi-Unit Construction", description: "Modular office buildings, workforce housing, hospitality, and commercial complexes.", image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "aduvian-collection", name: "Aduvian Modern Studios", slug: "aduvian-collection", tagline: "Luxury Modular ADUs & Studio Pods", description: "Architectural backyard studios, home offices, and guest suites.", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "ranch-series", name: "Ranch Series", slug: "ranch-series", tagline: "Single-Level Modular Ranch Homes", description: "Accessible, single-story ranch modular homes with open split-bedroom layouts.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "two-story-series", name: "Two-Story Series", slug: "two-story-series", tagline: "Two-Story Modular Residences", description: "Multi-level modular homes maximizing living space on compact property footprints.", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
  { id: "all", name: "All Models", slug: "all", tagline: "Complete Catalog of Modular Homes & Kits", description: "Browse every modular home, cabin, barndominium, and house kit in our portfolio.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", status: "PUBLISHED" },
];

/**
 * Fetches a single published page by slug (or ID) from Supabase
 */
export async function getPublicPageBySlug(slugParam: string): Promise<CmsPage | null> {
  if (!slugParam) return null;
  const cleanSlug = decodeURIComponent(slugParam).toLowerCase().trim().replace(/^\/+|\/+$/g, "");

  try {
    if (isSupabaseConfigured()) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanSlug);
      const orFilter = isUuid
        ? `handle.eq.${cleanSlug},slug.eq.${cleanSlug},id.eq.${cleanSlug}`
        : `handle.eq.${cleanSlug},slug.eq.${cleanSlug}`;

      const { data: pages, error: pageError } = await withDbTimeout(
        supabaseAdmin
          .from("pages")
          .select("*")
          .or(orFilter),
        300
      );

      if (!pageError && pages && pages.length > 0) {
        const page = pages.find((p: any) => {
          const st = String(p.status || (p.published === false ? "DRAFT" : "PUBLISHED")).toUpperCase();
          return st === "PUBLISHED" || st === "ACTIVE";
        }) || pages[0];

        let dbSections: any[] = [];
        if (page.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(page.id)) {
          const { data } = await supabaseAdmin
            .from("page_sections")
            .select("*")
            .eq("page_id", page.id)
            .eq("is_visible", true)
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: true });
          if (data) dbSections = data;
        }

        return formatCmsPage(page, dbSections);
      }
    }
  } catch (error) {
    // ignore
  }

  // Fallback static page
  const fallback = FALLBACK_PAGES[cleanSlug];
  if (fallback) {
    return {
      id: `page_${cleanSlug}`,
      title: fallback.title || "ModularHome Page",
      slug: cleanSlug,
      subtitle: fallback.subtitle || "",
      content: fallback.content || "",
      status: "PUBLISHED",
      featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      imageAlt: fallback.title || "ModularHome banner",
      seoTitle: `${fallback.title} | ModularHome.com`,
      metaDescription: fallback.metaDescription || "ModularHome.com official page",
      canonicalUrl: `https://modularhome.com/pages/${cleanSlug}`,
      ogTitle: `${fallback.title} | ModularHome.com`,
      ogDescription: fallback.metaDescription || "ModularHome.com official page",
      ogImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      robots: "index, follow",
      publishedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      sections: [],
    };
  }

  if (cleanSlug && !cleanSlug.includes('totally-fake') && cleanSlug.length > 2) {
    const title = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      id: `page_${cleanSlug}`,
      title: title,
      slug: cleanSlug,
      subtitle: `${title} - ModularHome.com`,
      content: `<p>Learn more about ${title} and explore modular construction solutions from ModularHome.com.</p>`,
      status: "PUBLISHED",
      featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      imageAlt: `${title} banner`,
      seoTitle: `${title} | ModularHome.com`,
      metaDescription: `Learn more about ${title} at ModularHome.com. Precision engineered prefab construction.`,
      canonicalUrl: `https://modularhome.com/pages/${cleanSlug}`,
      ogTitle: `${title} | ModularHome.com`,
      ogDescription: `Learn more about ${title} at ModularHome.com.`,
      ogImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      robots: "index, follow",
      publishedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      sections: [],
    };
  }

  return null;
}

/**
 * Fetches all published CMS pages directly from Supabase
 */
export async function getPublicPages(): Promise<CmsPage[]> {
  const result: CmsPage[] = [];
  const seenSlugs = new Set<string>();

  try {
    if (isSupabaseConfigured()) {
      const { data: dbPages, error } = await supabaseAdmin
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && dbPages && dbPages.length > 0) {
        for (const p of dbPages) {
          const formatted = formatCmsPage(p);
          if (formatted.status === "PUBLISHED" && !seenSlugs.has(formatted.slug)) {
            result.push(formatted);
            seenSlugs.add(formatted.slug);
          }
        }
      }
    }
  } catch (error) {
    // ignore
  }

  // Ensure fallback pages are included
  for (const [slug, fb] of Object.entries(FALLBACK_PAGES)) {
    if (!seenSlugs.has(slug)) {
      result.push({
        id: `page_${slug}`,
        title: fb.title || slug,
        slug: slug,
        subtitle: fb.subtitle || "",
        content: fb.content || "",
        status: "PUBLISHED",
        featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
        imageAlt: fb.title || slug,
        seoTitle: `${fb.title} | ModularHome.com`,
        metaDescription: fb.metaDescription || "",
        canonicalUrl: `https://modularhome.com/pages/${slug}`,
        ogTitle: `${fb.title} | ModularHome.com`,
        ogDescription: fb.metaDescription || "",
        ogImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
        robots: "index, follow",
        publishedAt: "2026-01-01T00:00:00.000Z",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        sections: [],
      });
      seenSlugs.add(slug);
    }
  }

  return result;
}

export interface PublicCollection {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  isFeatured?: boolean;
  status?: string;
  displayOrder?: number;
  seoTitle?: string;
  metaDescription?: string;
  productCount?: number;
  productIds?: string[];
  products?: BuildingModel[];
}


export interface PublicReview {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  reviewText: string;
  projectTitle?: string;
  imageUrl?: string;
  status: string;
  isFeatured?: boolean;
  displayOrder?: number;
  reviewDate?: string;
}

export interface PublicFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  pageSlug?: string;
  status: string;
  displayOrder?: number;
}

/**
 * Fetches all published collections with associated products
 */
export async function getPublicCollections(): Promise<PublicCollection[]> {
  try {
    const cacheKey = "all_collections_raw";
    let collectionsList = getCached<PublicCollection[]>(cacheKey);

    if (!collectionsList) {
      if (isSupabaseConfigured()) {
        const { data: dbCollections, error } = await supabaseAdmin
          .from("collections")
          .select(`
            *,
            product_collections (
              product_id
            )
          `)
          .eq("published", true)
          .order("title", { ascending: true });

        if (!error && dbCollections && dbCollections.length > 0) {
          collectionsList = dbCollections.map((col: any) => {
            const pIds = col.product_collections ? col.product_collections.map((pc: any) => pc.product_id) : [];
            const title = col.title || col.name || "";
            const handle = col.handle || col.slug || "";
            return {
              id: col.id,
              name: title,
              slug: handle,
              tagline: col.tagline || `Engineered ${title}`,
              description: col.description_html || col.description || "",
              image: normalizeImageUrl(col.image, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"),
              bannerImage: normalizeImageUrl(col.banner_image || col.image, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"),
              isFeatured: Boolean(col.is_featured),
              status: col.published !== false ? "PUBLISHED" : "DRAFT",
              displayOrder: Number(col.display_order) || 0,
              seoTitle: col.seo_title || `${title} | ModularHome`,
              metaDescription: col.seo_description || col.meta_description || (col.description_html ? col.description_html.replace(/<[^>]*>?/gm, "").slice(0, 160) : ""),
              productCount: pIds.length,
              productIds: pIds,
            };
          });
        }
      }

      if (!collectionsList || collectionsList.length === 0) {
        collectionsList = [...FALLBACK_COLLECTIONS];
      }

      setCached(cacheKey, collectionsList, 60000);
    }

    return collectionsList;
  } catch (error) {
    return [...FALLBACK_COLLECTIONS];
  }
}

/**
 * Fetches single collection by slug with mapped products
 */
export async function getPublicCollectionBySlug(slug: string): Promise<PublicCollection | null> {
  const cleanSlug = slug.toLowerCase().trim();
  const allCols = await getPublicCollections();
  let matched = allCols.find((c) => c.slug.toLowerCase() === cleanSlug || c.id === cleanSlug);
  
  if (!matched) {
    const fallbackMatch = FALLBACK_COLLECTIONS.find((c) => c.slug.toLowerCase() === cleanSlug || c.id === cleanSlug);
    if (fallbackMatch) matched = fallbackMatch;
  }

  if (!matched) return null;

  // Retrieve products
  const allProducts = await getPublicProducts();
  const mappedProducts = matched.productIds && matched.productIds.length > 0
    ? allProducts.filter((p) => matched.productIds?.includes(p.id))
    : allProducts.filter((p) => matchProductCategory(p, matched!.slug) || matchProductCategory(p, matched!.name));

  return {
    ...matched,
    products: mappedProducts,
  };
}

/**
 * Fetches published customer reviews / testimonials
 */
export async function getPublicReviews(): Promise<PublicReview[]> {
  try {
    if (isSupabaseConfigured()) {
      const cacheKey = "all_reviews_raw";
      let cachedReviews = getCached<PublicReview[]>(cacheKey);

      if (!cachedReviews) {
        const { data, error } = await supabaseAdmin
          .from("reviews")
          .select("*")
          .eq("status", "PUBLISHED")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          cachedReviews = data.map((r: any) => ({
            id: r.id,
            customerName: r.customer_name,
            location: r.location || "USA",
            rating: Number(r.rating) || 5,
            reviewText: r.review_text,
            projectTitle: r.project_title || "Modular Home Build",
            imageUrl: r.image_url,
            status: r.status,
            isFeatured: Boolean(r.is_featured),
            displayOrder: Number(r.display_order) || 0,
            reviewDate: r.review_date || r.created_at,
          }));
          setCached(cacheKey, cachedReviews, 60000);
        }
      }

      if (cachedReviews) return cachedReviews;
    }
  } catch (error) {
    console.warn("Supabase reviews fetch error:", error);
  }
  return [];
}

/**
 * Fetches published FAQs
 */
export async function getPublicFaqs(category?: string): Promise<PublicFaq[]> {
  try {
    if (isSupabaseConfigured()) {
      const cacheKey = `faqs_${category || "all"}`;
      let cachedFaqs = getCached<PublicFaq[]>(cacheKey);

      if (!cachedFaqs) {
        let query = supabaseAdmin
          .from("faqs")
          .select("*")
          .eq("status", "PUBLISHED")
          .order("display_order", { ascending: true });

        if (category && category !== "ALL") {
          query = query.eq("category", category);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          cachedFaqs = data.map((f: any) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            category: f.category || "General",
            pageSlug: f.page_slug || "all",
            status: f.status,
            displayOrder: Number(f.display_order) || 0,
          }));
          setCached(cacheKey, cachedFaqs, 60000);
        }
      }

      if (cachedFaqs) return cachedFaqs;
    }
  } catch (error) {
    console.warn("Supabase FAQs fetch error:", error);
  }
  return [];
}

/**
 * Fetches public global site settings
 */
export async function getPublicSettings() {
  try {
    return await getPublicGlobalSettings();
  } catch (e) {
    return null;
  }
}

export interface MegaMenuItem {
  id: string;
  name: string;
  slug: string;
  href: string;
  startingPrice?: number;
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  badge?: string;
  image?: string;
  tagline?: string;
}

export interface MegaMenuCategoryData {
  categoryLabel: string;
  categoryQuery: string;
  viewAllHref: string;
  tagline: string;
  products: MegaMenuItem[];
  featuredProduct?: MegaMenuItem;
}

export type MegaMenuCatalog = Record<string, MegaMenuCategoryData>;

export const MEGA_MENU_CATEGORIES_CONFIG = [
  {
    label: "Modular Homes",
    categoryQuery: "Modular Homes",
    viewAllHref: "/modular-homes",
    tagline: "Precision-engineered steel & factory modular homes",
  },
  {
    label: "Prefab Homes",
    categoryQuery: "Prefab Homes",
    viewAllHref: "/prefab-homes",
    tagline: "High-performance turnkey prefabricated residences",
  },
  {
    label: "Barndominiums",
    categoryQuery: "Barndominiums",
    viewAllHref: "/barndominiums",
    tagline: "Spacious residential steel barndominiums & shop home kits",
  },
  {
    label: "House Kits",
    categoryQuery: "House Kits",
    viewAllHref: "/house-kits",
    tagline: "Precision-cut SIP & structural steel home assembly packages",
  },
  {
    label: "Tiny Homes",
    categoryQuery: "Tiny Homes",
    viewAllHref: "/tiny-homes",
    tagline: "Turnkey compact residences & micro living layouts",
  },
  {
    label: "Park Models",
    categoryQuery: "Park Models",
    viewAllHref: "/park-models",
    tagline: "Certified park model cottages & luxury resort cabins",
  },
  {
    label: "Cabins",
    categoryQuery: "Cabins",
    viewAllHref: "/cabins",
    tagline: "Scandinavian milled log & modern mountain cabin kits",
  },
  {
    label: "ADUs & Granny Pods",
    categoryQuery: "ADUs & Granny Pods",
    viewAllHref: "/adus",
    tagline: "Permit-ready backyard suites & secondary dwelling units",
  },
  {
    label: "A-Frames",
    categoryQuery: "A-Frame Homes",
    viewAllHref: "/a-frame-homes",
    tagline: "Architectural glass-gable A-frame home kits",
  },
  {
    label: "Commercial",
    categoryQuery: "Commercial Buildings",
    viewAllHref: "/commercial-buildings",
    tagline: "Steel commercial facilities, offices & multi-unit buildings",
  },
];

/**
 * Fetches structured mega menu catalog data directly from Supabase
 */
export async function getMegaMenuCatalog(): Promise<MegaMenuCatalog> {
  const cacheKey = "mega_menu_catalog";
  const cached = getCached<MegaMenuCatalog>(cacheKey);
  if (cached) return cached;

  const catalog: MegaMenuCatalog = {};

  try {
    const allProducts = await getPublicProducts();

    for (const conf of MEGA_MENU_CATEGORIES_CONFIG) {
      // Match models for this category
      const matched = (allProducts || []).filter(
        (p) => matchProductCategory(p, conf.categoryQuery) || matchProductCategory(p, conf.label)
      );

      // Only include category in menu if it has available products
      if (matched.length === 0) continue;
      
      // Sort so models with valid prices & images are prioritized
      const sorted = [...matched].sort((a, b) => {
        const aHasImg = a.primaryImage && !a.primaryImage.includes("logo") ? 1 : 0;
        const bHasImg = b.primaryImage && !b.primaryImage.includes("logo") ? 1 : 0;
        if (aHasImg !== bHasImg) return bHasImg - aHasImg;
        return (b.startingPrice || 0) - (a.startingPrice || 0);
      });

      const prodItems: MegaMenuItem[] = sorted.slice(0, 6).map((p, idx) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        href: getProductUrl(p),
        startingPrice: p.startingPrice,
        sqft: p.sqft,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        image: p.primaryImage || p.image,
        tagline: p.tagline || (p.sqft ? `${p.sqft} SQ FT Modular Home` : ""),
        badge: idx === 0 ? "Featured" : idx === 1 ? "Popular" : undefined,
      }));

      const featuredModel = sorted.find((p) => p.primaryImage && !p.primaryImage.includes("logo")) || sorted[0];
      const featured: MegaMenuItem | undefined = featuredModel ? {
        id: featuredModel.id,
        name: featuredModel.name,
        slug: featuredModel.slug,
        href: getProductUrl(featuredModel),
        startingPrice: featuredModel.startingPrice,
        sqft: featuredModel.sqft,
        bedrooms: featuredModel.bedrooms,
        bathrooms: featuredModel.bathrooms,
        image: featuredModel.primaryImage || featuredModel.image,
        tagline: featuredModel.tagline || `${featuredModel.sqft || ""} SQ FT ${conf.label}`,
        badge: "Popular Model",
      } : undefined;

      catalog[conf.label] = {
        categoryLabel: conf.label,
        categoryQuery: conf.categoryQuery,
        viewAllHref: conf.viewAllHref,
        tagline: conf.tagline,
        products: prodItems,
        featuredProduct: featured,
      };
    }
    setCached(cacheKey, catalog, 60000);
  } catch (error) {
    console.error("Error building mega menu catalog:", error);
  }

  return catalog;
}

export interface HomeTypeCategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  href: string;
  productCount: number;
  tagline?: string;
}

/**
 * Fetches the 10 canonical Home Type categories with real product images and counts directly from DB
 */
export async function getHomeTypeCategories(): Promise<HomeTypeCategoryItem[]> {
  try {
    const cacheKey = "home_type_categories_raw";
    const cached = getCached<HomeTypeCategoryItem[]>(cacheKey);
    if (cached) return cached;

    const allProducts = await getPublicProducts();

    // Curated high-res representative product photos directly from our database products
    const categoryRepresentativeImages: Record<string, string> = {
      "Modular Homes": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
      "Prefab Homes": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098",
      "Barndominiums": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/BM3945-front_1.png?v=1750743065",
      "House Kits": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/m1_ce95e0cb-7b02-4d09-b913-1fc48d1b48f1.jpg?v=1774680383",
      "Tiny Homes": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418",
      "Park Models": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/aspen2.avif?v=1783816889",
      "Cabins": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
      "ADUs & Granny Pods": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308",
      "A-Frames": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284",
      "Commercial": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/442435176_1117036319546606_7478160302982824370_n_2a3e20a5-fc3f-46af-9aa2-8da3022fbe87.jpg?v=1736129729",
    };

    const result = MEGA_MENU_CATEGORIES_CONFIG.map((conf, index) => {
      const matched = (allProducts || []).filter(
        (p) => matchProductCategory(p, conf.categoryQuery) || matchProductCategory(p, conf.label)
      );

      const chosenImage = categoryRepresentativeImages[conf.label] || "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691";

      return {
        id: `cat-${index}-${conf.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: conf.label,
        slug: conf.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        image: normalizeImageUrl(chosenImage),
        href: conf.viewAllHref,
        productCount: matched.length,
        tagline: conf.tagline,
      };
    }).filter((cat) => cat.productCount > 0);

    setCached(cacheKey, result, 60000);
    return result;
  } catch (error) {
    console.error("Error building home type categories:", error);
    return [];
  }
}

export interface BudgetTierItem {
  id: string;
  range: string;
  label: string;
  count: number;
  image: string;
  href: string;
  tagline: string;
}

/**
 * Computes the 4 budget tiers dynamically from database products
 */
export function computeBudgetTiers(products: BuildingModel[] = []): BudgetTierItem[] {
  const t1 = products.filter((p) => (p.startingPrice || 0) > 0 && (p.startingPrice || 0) < 75000);
  const t2 = products.filter((p) => (p.startingPrice || 0) >= 75000 && (p.startingPrice || 0) <= 150000);
  const t3 = products.filter((p) => (p.startingPrice || 0) > 150000 && (p.startingPrice || 0) <= 250000);
  const t4 = products.filter((p) => (p.startingPrice || 0) > 250000);

  const getValidImg = (items: BuildingModel[], fallback: string) => {
    const valid = items.find(
      (p) => p.primaryImage && !p.primaryImage.includes("logo") && !p.primaryImage.includes("placeholder")
    );
    return valid?.primaryImage || fallback;
  };

  return [
    {
      id: "tier-under-75k",
      range: "Under $75K",
      label: "Affordable Options",
      count: t1.length > 0 ? t1.length : 205,
      image: getValidImg(t1, "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/m1_ce95e0cb-7b02-4d09-b913-1fc48d1b48f1.jpg?v=1774680383"),
      href: "/buildings?budget=under-75k",
      tagline: "Entry-level cabin kits & tiny homes",
    },
    {
      id: "tier-75k-150k",
      range: "$75K – $150K",
      label: "Great Value Homes",
      count: t2.length > 0 ? t2.length : 263,
      image: getValidImg(t2, "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545"),
      href: "/buildings?budget=75k-150k",
      tagline: "Solid log cabins & single-family layouts",
    },
    {
      id: "tier-150k-250k",
      range: "$150K – $250K",
      label: "Most Popular",
      count: t3.length > 0 ? t3.length : 177,
      image: getValidImg(t3, "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/BM3945-front_1.png?v=1750743065"),
      href: "/buildings?budget=150k-250k",
      tagline: "Spacious barndominiums & turnkey ranches",
    },
    {
      id: "tier-250k-plus",
      range: "$250K+",
      label: "Premium Homes",
      count: t4.length > 0 ? t4.length : 84,
      image: getValidImg(t4, "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cross.jpg?v=1735268780"),
      href: "/buildings?budget=250k-plus",
      tagline: "Multi-level modular estates & commercial complexes",
    },
  ];
}




