import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { FloorPlan } from "@/data/floorPlans";
import { BuildingModel } from "@/data/models";
import { ResourceArticle } from "@/data/resources";
import { getPublicGlobalSettings } from "./settings";
import { matchProductCategory } from "@/utils/categoryMatching";

/**
 * Normalizes image URLs ensuring proper protocol and valid fallback
 */
export function normalizeImageUrl(url?: string | null, fallback = "/newmodularlogo.png"): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return fallback;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return trimmed;
}

/**
 * Normalizes Supabase floor plan row to FloorPlan interface
 */
export function formatFloorPlan(p: any): FloorPlan {
  const rawPreview = p.preview_image || p.previewImage || "/newmodularlogo.png";
  const previewImg = normalizeImageUrl(rawPreview, "/newmodularlogo.png");
  const rawGallery = Array.isArray(p.gallery) ? p.gallery : (p.gallery ? [p.gallery] : []);
  const gallery = rawGallery.map((g: any) => normalizeImageUrl(g)).filter(Boolean);

  return {
    id: p.id,
    title: p.title || "Modern Floor Plan",
    slug: p.slug || p.id,
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
    squareFeet: Number(p.square_feet || p.squareFeet) || 800,
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

  const rawPrimary =
    p.primary_image_url ||
    p.hero_image ||
    p.featured_image ||
    p.primary_image ||
    (p.product_media && p.product_media.length > 0
      ? [...p.product_media].sort((a: any, b: any) => (a.position || 0) - (b.position || 0))[0]?.source_url
      : "") ||
    (Array.isArray(p.images) && p.images[0]) ||
    "/newmodularlogo.png";

  const primaryImg = normalizeImageUrl(rawPrimary, "/newmodularlogo.png");

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

  const galleryImgs = rawGallery.map((g: any) => normalizeImageUrl(g)).filter(Boolean);

  // Extract starting price from starting_price column or variants
  let startingPrice = Number(p.starting_price || p.price);
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

  return {
    id: p.id,
    slug: p.handle || p.slug || p.id,
    name: p.title || p.name || "Precision Modular Model",
    series: p.series || p.product_type || "Essential Series",
    category: p.product_type || p.category || "Modular Homes",
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
    if (!isSupabaseConfigured()) {
      return [];
    }

    let query = supabaseAdmin
      .from("floor_plans")
      .select("*")
      .eq("status", "PUBLISHED")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (params?.category && params.category !== "ALL") {
      query = query.eq("category", params.category);
    }

    const { data: dbPlans, error } = await query;
    if (error || !dbPlans || dbPlans.length === 0) {
      return [];
    }

    let formatted = dbPlans.map(formatFloorPlan);

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
    return [];
  }
}

/**
 * Fetches a single published floor plan by slug or ID
 */
export async function getPublicFloorPlanBySlug(slug: string): Promise<FloorPlan | null> {
  try {
    if (isSupabaseConfigured()) {
      const { data: plan, error } = await supabaseAdmin
        .from("floor_plans")
        .select("*")
        .eq("slug", slug)
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

/**
 * Fetches all published home models / products directly from Supabase
 */
export async function getPublicProducts(params?: {
  category?: string;
  search?: string;
  isFeatured?: boolean;
}): Promise<BuildingModel[]> {
  try {
    if (!isSupabaseConfigured()) {
      return [];
    }

    let query = supabaseAdmin
      .from("products")
      .select("*, product_variants(*), product_media(*), product_collections(collection_id, collections(id, handle, title))")
      .or("status.eq.active,status.is.null")
      .neq("product_type", "Furniture & Accessories")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (params?.isFeatured) {
      query = query.eq("is_featured", true);
    }

    const { data: dbProducts, error } = await query;
    if (error || !dbProducts || dbProducts.length === 0) {
      return [];
    }

    let formatted = dbProducts
      .map(formatProduct)
      .filter((m) => m.category !== "Furniture & Accessories" && m.category !== "Furniture & Decor");

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
    return [];
  }
}

/**
 * Fetches a single home model by slug or ID directly from Supabase
 */
export async function getPublicProductBySlug(slug: string): Promise<BuildingModel | null> {
  try {
    if (isSupabaseConfigured()) {
      const clean = decodeURIComponent(slug).toLowerCase().trim();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
      const orFilter = isUuid ? `handle.eq.${clean},id.eq.${clean}` : `handle.eq.${clean}`;

      const { data: product, error } = await supabaseAdmin
        .from("products")
        .select("*, product_variants(*), product_media(*), product_collections(collection_id, collections(id, handle, title))")
        .or(orFilter)
        .maybeSingle();

      if (!error && product) {
        return formatProduct(product);
      }
    }
    return null;
  } catch (error) {
    return null;
  }
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
 * Fetches published articles / blogs directly from Supabase
 */
export async function getPublicBlogs(params?: { category?: string; search?: string }): Promise<ResourceArticle[]> {
  try {
    if (!isSupabaseConfigured()) {
      return [];
    }

    let { data: blogPosts, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error || !blogPosts || blogPosts.length === 0) {
      const { data: legacy } = await supabaseAdmin
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      blogPosts = legacy || [];
    }

    let blogsList: ResourceArticle[] = [];
    if (blogPosts && blogPosts.length > 0) {
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

    let filtered = blogsList;
    if (params?.category && params.category !== "ALL" && params.category !== "All") {
      filtered = filtered.filter(
        (a) => (a.category || "").toLowerCase() === params.category!.toLowerCase()
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
    return [];
  }
}

/**
 * Fetches a single published article / blog by slug or ID directly from Supabase
 */
export async function getPublicBlogBySlug(slugParam: string): Promise<ResourceArticle | null> {
  if (!slugParam) return null;
  const cleanSlug = decodeURIComponent(slugParam).toLowerCase().trim().replace(/^\/+|\/+$/g, "");

  try {
    if (isSupabaseConfigured()) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanSlug);
      const orFilter = isUuid
        ? `handle.eq.${cleanSlug},id.eq.${cleanSlug}`
        : `handle.eq.${cleanSlug}`;

      let { data: blog, error } = await supabaseAdmin
        .from("blog_posts")
        .select("*")
        .or(orFilter)
        .maybeSingle();

      if (error || !blog) {
        const legacyFilter = isUuid ? `slug.eq.${cleanSlug},id.eq.${cleanSlug}` : `slug.eq.${cleanSlug}`;
        const { data: legacy } = await supabaseAdmin
          .from("blogs")
          .select("*")
          .or(legacyFilter)
          .maybeSingle();
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
        return {
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
    return null;
  } catch (e) {
    return null;
  }
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
export async function getPublicPageBySlug(slugParam: string): Promise<CmsPage | null> {
  if (!slugParam) return null;
  const cleanSlug = decodeURIComponent(slugParam).toLowerCase().trim().replace(/^\/+|\/+$/g, "");

  try {
    if (isSupabaseConfigured()) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanSlug);
      const orFilter = isUuid
        ? `handle.eq.${cleanSlug},slug.eq.${cleanSlug},id.eq.${cleanSlug}`
        : `handle.eq.${cleanSlug},slug.eq.${cleanSlug}`;

      const { data: pages, error: pageError } = await supabaseAdmin
        .from("pages")
        .select("*")
        .or(orFilter);

      if (!pageError && pages && pages.length > 0) {
        const page = pages.find((p) => {
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
    console.warn("Supabase fetch page warning:", error);
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
    console.error("Error fetching public pages from Supabase:", error);
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
    if (!isSupabaseConfigured()) {
      return [];
    }

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

    if (error || !dbCollections || dbCollections.length === 0) {
      return [];
    }

    return dbCollections.map((col: any) => {
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
  } catch (error) {
    console.error("Error fetching public collections:", error);
    return [];
  }
}

/**
 * Fetches single collection by slug with mapped products
 */
export async function getPublicCollectionBySlug(slug: string): Promise<PublicCollection | null> {
  const cleanSlug = slug.toLowerCase().trim();
  const allCols = await getPublicCollections();
  const matched = allCols.find((c) => c.slug.toLowerCase() === cleanSlug || c.id === cleanSlug);
  if (!matched) return null;

  // Retrieve products
  const allProducts = await getPublicProducts();
  const mappedProducts = matched.productIds && matched.productIds.length > 0
    ? allProducts.filter((p) => matched.productIds?.includes(p.id))
    : allProducts.filter((p) => matchProductCategory(p, matched.slug) || matchProductCategory(p, matched.name));

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
      const { data, error } = await supabaseAdmin
        .from("reviews")
        .select("*")
        .eq("status", "PUBLISHED")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
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
      }
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
        return data.map((f: any) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          category: f.category || "General",
          pageSlug: f.page_slug || "all",
          status: f.status,
          displayOrder: Number(f.display_order) || 0,
        }));
      }
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
    viewAllHref: "/buildings?category=Modular+Homes",
    tagline: "Precision-engineered steel & factory modular homes",
  },
  {
    label: "Prefab Homes",
    categoryQuery: "Prefab Homes",
    viewAllHref: "/buildings?category=Prefab+Homes",
    tagline: "High-performance turnkey prefabricated residences",
  },
  {
    label: "Barndominiums",
    categoryQuery: "Barndominiums",
    viewAllHref: "/buildings?category=Barndominiums",
    tagline: "Spacious residential steel barndominiums & shop home kits",
  },
  {
    label: "House Kits",
    categoryQuery: "House Kits",
    viewAllHref: "/buildings?category=House+Kits",
    tagline: "Precision-cut SIP & structural steel home assembly packages",
  },
  {
    label: "Tiny Homes",
    categoryQuery: "Tiny Homes",
    viewAllHref: "/buildings?category=Tiny+Homes",
    tagline: "Turnkey compact residences & micro living layouts",
  },
  {
    label: "Park Models",
    categoryQuery: "Park Models",
    viewAllHref: "/buildings?category=Park+Models",
    tagline: "Certified park model cottages & luxury resort cabins",
  },
  {
    label: "Cabins",
    categoryQuery: "Cabins",
    viewAllHref: "/buildings?category=Cabins",
    tagline: "Scandinavian milled log & modern mountain cabin kits",
  },
  {
    label: "ADUs & Granny Pods",
    categoryQuery: "ADUs & Granny Pods",
    viewAllHref: "/buildings?category=ADUs+%26+Granny+Pods",
    tagline: "Permit-ready backyard suites & secondary dwelling units",
  },
  {
    label: "A-Frames",
    categoryQuery: "A-Frame Homes",
    viewAllHref: "/buildings?category=A-Frame+Homes",
    tagline: "Architectural glass-gable A-frame home kits",
  },
  {
    label: "Commercial",
    categoryQuery: "Commercial Buildings",
    viewAllHref: "/buildings?category=Commercial+Buildings",
    tagline: "Steel commercial facilities, offices & multi-unit buildings",
  },
];

/**
 * Fetches structured mega menu catalog data directly from Supabase
 */
export async function getMegaMenuCatalog(): Promise<MegaMenuCatalog> {
  const catalog: MegaMenuCatalog = {};

  try {
    const allProducts = await getPublicProducts();

    for (const conf of MEGA_MENU_CATEGORIES_CONFIG) {
      // Match models for this category
      const matched = (allProducts || []).filter(
        (p) => matchProductCategory(p, conf.categoryQuery) || matchProductCategory(p, conf.label)
      );
      
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
        href: `/buildings/${p.slug}`,
        startingPrice: p.startingPrice,
        sqft: p.sqft,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        image: p.primaryImage || p.image,
        tagline: p.tagline || (p.sqft ? `${p.sqft} SQ FT Modular Home` : ""),
        badge: idx === 0 ? "Featured" : idx === 1 ? "Popular" : undefined,
      }));

      const featuredModel = sorted.find((p) => p.primaryImage && !p.primaryImage.includes("logo")) || sorted[0] || allProducts[0];
      const featured: MegaMenuItem | undefined = featuredModel ? {
        id: featuredModel.id,
        name: featuredModel.name,
        slug: featuredModel.slug,
        href: `/buildings/${featuredModel.slug}`,
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

    return MEGA_MENU_CATEGORIES_CONFIG.map((conf, index) => {
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
        productCount: matched.length > 0 ? matched.length : (conf.label === "Commercial" ? 1 : 0),
        tagline: conf.tagline,
      };
    });
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




