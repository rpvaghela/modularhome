import type { ResourceArticle } from "@/data/resources";
import customBlogsData from "@/data/custom_blogs.json";

let fs: any = null;
let path: any = null;

if (typeof window === "undefined") {
  try {
    fs = require("fs");
    path = require("path");
  } catch {}
}

const DATA_DIR = path ? path.join(process.cwd(), "src", "data") : "";
const BLOGS_FILE = path ? path.join(DATA_DIR, "custom_blogs.json") : "";

export interface StoredBlog {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string | string[];
  image: string;
  featured_image?: string;
  featuredImage?: string;
  date: string;
  published_at?: string;
  publishedAt?: string;
  author: string;
  author_name?: string;
  status: "PUBLISHED" | "DRAFT";
  categories?: string[];
  tags?: string[];
  embeddedVideoUrl?: string;
  embedded_video_url?: string;
  seoTitle?: string;
  seo_title?: string;
  metaDescription?: string;
  meta_description?: string;
  imageAltText?: string;
  image_alt_text?: string;
  canonicalUrl?: string;
  canonical_url?: string;
  keyTakeaways?: string[];
  key_takeaways?: string[];
  // Editorial specs & customizations
  introduction?: string;
  sqft?: string;
  bedrooms?: string;
  bathrooms?: string;
  stories?: string;
  hasLoft?: boolean | string;
  buildingStyle?: string;
  buildType?: string;
  price?: string;
  startingPrice?: string;
  qualityBadge?: string;
  pullQuote?: string;
  pullQuoteAuthor?: string;
  customFeatures?: Array<{ title: string; desc: string; icon?: string }>;
  heroBackground?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

function ensureDataDirectory() {
  if (!fs || !DATA_DIR) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory for blogs:", err);
  }
}

export function readBlogsFromStore(): StoredBlog[] {
  if (typeof window !== "undefined" || !fs || !BLOGS_FILE) {
    return (customBlogsData as StoredBlog[]) || [];
  }
  try {
    ensureDataDirectory();
    if (!fs.existsSync(BLOGS_FILE)) {
      return (customBlogsData as StoredBlog[]) || [];
    }
    const data = fs.readFileSync(BLOGS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return (customBlogsData as StoredBlog[]) || [];
    }
    return parsed;
  } catch (error) {
    return (customBlogsData as StoredBlog[]) || [];
  }
}

export function writeBlogsToStore(blogs: StoredBlog[]): void {
  if (!fs || !BLOGS_FILE) return;
  try {
    ensureDataDirectory();
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_blogs.json:", error);
  }
}

export function saveCustomBlog(blogData: Partial<StoredBlog> & { title?: string; slug?: string }): StoredBlog {
  const blogs = readBlogsFromStore();
  const inputSlug = (blogData.slug || "").toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-");
  
  const existingIdx = blogs.findIndex(
    (b) =>
      (blogData.id && (b.id === blogData.id || b.id.toLowerCase() === blogData.id.toLowerCase())) ||
      (inputSlug && b.slug.toLowerCase() === inputSlug)
  );
  const existing = existingIdx >= 0 ? blogs[existingIdx] : null;

  const now = new Date().toISOString();
  
  // Resolve clean slug
  const cleanSlug =
    inputSlug ||
    existing?.slug ||
    (blogData.title ? blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : `article-${Date.now()}`);

  // Resolve publication date
  let rawDate =
    blogData.publishedAt ||
    blogData.published_at ||
    blogData.date ||
    existing?.publishedAt ||
    existing?.published_at ||
    now;

  if (typeof rawDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawDate.trim())) {
    rawDate = new Date(`${rawDate.trim()}T12:00:00.000Z`).toISOString();
  } else {
    try {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        rawDate = d.toISOString();
      }
    } catch {}
  }
  
  let formattedDisplayDate = "Recent";
  try {
    const d = new Date(rawDate || now);
    if (!isNaN(d.getTime())) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      formattedDisplayDate = `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
    }
  } catch {}

  const title = blogData.title !== undefined ? blogData.title : (existing?.title || "Untitled Article");
  const content = blogData.content !== undefined ? blogData.content : (existing?.content || "");
  const image =
    blogData.featuredImage ||
    blogData.featured_image ||
    blogData.image ||
    existing?.featuredImage ||
    existing?.featured_image ||
    existing?.image ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  const fullBlog: StoredBlog = {
    id: blogData.id || existing?.id || `blog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    slug: cleanSlug,
    title,
    category:
      blogData.category ||
      (Array.isArray(blogData.categories) && blogData.categories.length > 0 ? blogData.categories[0] : existing?.category || "Building Guides"),
    readTime: blogData.readTime || existing?.readTime || "5 min read",
    excerpt:
      blogData.excerpt !== undefined
        ? blogData.excerpt
        : (blogData.metaDescription || existing?.excerpt || existing?.metaDescription || ""),
    content,
    image,
    featuredImage: image,
    featured_image: image,
    date: formattedDisplayDate,
    publishedAt: rawDate,
    published_at: rawDate,
    author: blogData.author || blogData.author_name || existing?.author || "ModularHome Engineering Team",
    author_name: blogData.author || blogData.author_name || existing?.author || "ModularHome Engineering Team",
    status: (blogData.status as any) || existing?.status || "PUBLISHED",
    categories: Array.isArray(blogData.categories)
      ? blogData.categories
      : (blogData.category ? [blogData.category] : existing?.categories || ["Building Guides"]),
    tags: Array.isArray(blogData.tags) ? blogData.tags : (existing?.tags || []),
    embeddedVideoUrl: blogData.embeddedVideoUrl || blogData.embedded_video_url || existing?.embeddedVideoUrl,
    embedded_video_url: blogData.embeddedVideoUrl || blogData.embedded_video_url || existing?.embedded_video_url,
    seoTitle: blogData.seoTitle || blogData.seo_title || existing?.seoTitle || `${title} | ModularHome.com Guide`,
    seo_title: blogData.seoTitle || blogData.seo_title || existing?.seo_title || `${title} | ModularHome.com Guide`,
    metaDescription:
      blogData.metaDescription ||
      blogData.meta_description ||
      blogData.excerpt ||
      existing?.metaDescription ||
      existing?.excerpt,
    meta_description:
      blogData.metaDescription ||
      blogData.meta_description ||
      blogData.excerpt ||
      existing?.meta_description ||
      existing?.excerpt,
    imageAltText: blogData.imageAltText || blogData.image_alt_text || existing?.imageAltText || title,
    image_alt_text: blogData.imageAltText || blogData.image_alt_text || existing?.image_alt_text || title,
    canonicalUrl: blogData.canonicalUrl || blogData.canonical_url || existing?.canonicalUrl,
    canonical_url: blogData.canonicalUrl || blogData.canonical_url || existing?.canonical_url,
    keyTakeaways: Array.isArray(blogData.keyTakeaways)
      ? blogData.keyTakeaways
      : (Array.isArray(blogData.key_takeaways) ? blogData.key_takeaways : existing?.keyTakeaways || []),
    key_takeaways: Array.isArray(blogData.keyTakeaways)
      ? blogData.keyTakeaways
      : (Array.isArray(blogData.key_takeaways) ? blogData.key_takeaways : existing?.key_takeaways || []),
    // Extended fields
    introduction:
      blogData.introduction !== undefined
        ? blogData.introduction
        : ((blogData as any).intro || (blogData as any).intro_text || existing?.introduction || ""),
    sqft: blogData.sqft !== undefined ? blogData.sqft : existing?.sqft,
    bedrooms: blogData.bedrooms !== undefined ? blogData.bedrooms : existing?.bedrooms,
    bathrooms: blogData.bathrooms !== undefined ? blogData.bathrooms : existing?.bathrooms,
    stories: blogData.stories !== undefined ? blogData.stories : existing?.stories,
    hasLoft: blogData.hasLoft !== undefined ? blogData.hasLoft : existing?.hasLoft,
    buildingStyle: blogData.buildingStyle !== undefined ? blogData.buildingStyle : existing?.buildingStyle,
    buildType: blogData.buildType !== undefined ? blogData.buildType : existing?.buildType,
    price: blogData.price !== undefined ? blogData.price : (blogData.startingPrice || existing?.price),
    startingPrice: blogData.startingPrice !== undefined ? blogData.startingPrice : (blogData.price || existing?.startingPrice),
    qualityBadge: blogData.qualityBadge !== undefined ? blogData.qualityBadge : existing?.qualityBadge,
    pullQuote: blogData.pullQuote !== undefined ? blogData.pullQuote : existing?.pullQuote,
    pullQuoteAuthor: blogData.pullQuoteAuthor !== undefined ? blogData.pullQuoteAuthor : existing?.pullQuoteAuthor,
    customFeatures:
      blogData.customFeatures !== undefined
        ? blogData.customFeatures
        : existing?.customFeatures,
    heroBackground: blogData.heroBackground !== undefined ? blogData.heroBackground : existing?.heroBackground,
    createdAt: blogData.createdAt || existing?.createdAt || now,
    created_at: blogData.createdAt || existing?.created_at || now,
    updatedAt: now,
    updated_at: now,
  };

  if (existingIdx >= 0) {
    blogs[existingIdx] = { ...blogs[existingIdx], ...fullBlog };
  } else {
    blogs.unshift(fullBlog);
  }

  writeBlogsToStore(blogs);
  return fullBlog;
}

export function deleteCustomBlog(idOrSlug: string): boolean {
  if (!idOrSlug) return false;
  const clean = idOrSlug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const blogs = readBlogsFromStore();
  
  const filtered = blogs.filter((b) => {
    const bId = (b.id || "").toLowerCase().trim();
    const bSlug = (b.slug || "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    return bId !== clean && bSlug !== clean && b.id !== idOrSlug && b.slug !== idOrSlug;
  });

  if (filtered.length !== blogs.length) {
    writeBlogsToStore(filtered);
    return true;
  }
  return false;
}

export function getCustomBlogByIdOrSlug(idOrSlug: string): StoredBlog | null {
  if (!idOrSlug) return null;
  const clean = idOrSlug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const blogs = readBlogsFromStore();

  const found = blogs.find(
    (b) =>
      b.id.toLowerCase() === clean ||
      b.slug.toLowerCase() === clean ||
      b.slug.replace(/[^a-z0-9]/g, "") === clean.replace(/[^a-z0-9]/g, "")
  );

  return found || null;
}
