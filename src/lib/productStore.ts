import type { BuildingModel } from "@/data/models";

let fs: any = null;
let path: any = null;

if (typeof window === "undefined") {
  try {
    fs = require("fs");
    path = require("path");
  } catch {}
}

const DATA_DIR = path ? path.join(process.cwd(), "src", "data") : "";
const PRODUCTS_FILE = path ? path.join(DATA_DIR, "custom_products.json") : "";

export interface StoredProduct {
  id: string;
  handle: string;
  slug: string;
  name: string;
  title?: string;
  category: string;
  product_type?: string;
  series?: string;
  architecturalStyle?: string;
  tagline?: string;
  description?: string;
  description_html?: string;
  startingPrice: number;
  starting_price?: number;
  price?: number;
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  stories?: number;
  dimensions?: string;
  primaryImage?: string;
  primary_image_url?: string;
  image?: string;
  gallery?: string[];
  features?: string[];
  specs?: Array<{ label: string; value: string }>;
  tags?: string[];
  status?: string;
  isPublished?: boolean;
  published_at?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  collectionIds?: string[];
}

function ensureDataDirectory() {
  if (!fs || !path) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory for products:", err);
  }
}

export function readProductsFromStore(): StoredProduct[] {
  if (!fs || !path || !PRODUCTS_FILE) return [];
  try {
    ensureDataDirectory();
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    return parsed;
  } catch (error) {
    console.error("Error reading custom_products.json:", error);
    return [];
  }
}

export function writeProductsToStore(products: StoredProduct[]): void {
  if (!fs || !path || !PRODUCTS_FILE) return;
  try {
    ensureDataDirectory();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_products.json:", error);
  }
}

export function saveCustomProduct(productData: Partial<StoredProduct> & { name?: string; title?: string; slug?: string; handle?: string }): StoredProduct {
  const products = readProductsFromStore();
  const rawSlug = productData.slug || productData.handle || productData.id || "new-model";
  const cleanSlug = rawSlug.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-");
  const name = productData.name || productData.title || "Custom Precision Model";

  const existingIdx = products.findIndex(
    (p) => (productData.id && p.id === productData.id) || p.slug.toLowerCase() === cleanSlug || p.handle?.toLowerCase() === cleanSlug
  );

  const now = new Date().toISOString();
  const defaultImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
  const primaryImg: string = productData.primaryImage || productData.primary_image_url || productData.image || (existingIdx >= 0 && products[existingIdx].primaryImage ? products[existingIdx].primaryImage : defaultImg);

  const fullProduct: StoredProduct = {
    id: productData.id || (existingIdx >= 0 ? products[existingIdx].id : `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`),
    handle: cleanSlug,
    slug: cleanSlug,
    name,
    title: name,
    category: productData.category || productData.product_type || "Modular Homes",
    product_type: productData.category || productData.product_type || "Modular Homes",
    series: productData.series || "Essential Series",
    architecturalStyle: productData.architecturalStyle || "Modern Homes",
    tagline: productData.tagline || (productData.sqft ? `${productData.sqft} SQ FT Engineered Home` : ""),
    description: productData.description || productData.description_html || "",
    description_html: productData.description_html || productData.description || "",
    startingPrice: Number(productData.startingPrice || productData.starting_price || productData.price || 89000),
    starting_price: Number(productData.startingPrice || productData.starting_price || productData.price || 89000),
    sqft: Number(productData.sqft || 0),
    bedrooms: Number(productData.bedrooms ?? 0),
    bathrooms: Number(productData.bathrooms ?? 0),
    stories: Number(productData.stories || 1),
    dimensions: productData.dimensions || "",
    primaryImage: primaryImg,
    primary_image_url: primaryImg,
    image: primaryImg,
    gallery: Array.isArray(productData.gallery) && productData.gallery.length > 0 ? (productData.gallery.filter(Boolean) as string[]) : [primaryImg],
    features: Array.isArray(productData.features) ? productData.features : [
      "Commercial-Grade Galvanized Steel Framing",
      "High R-Value Structural Insulated Panels (SIPs)",
      "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
      "Pre-drilled MEP for Rapid On-Site Assembly"
    ],
    specs: Array.isArray(productData.specs) ? productData.specs : [],
    tags: Array.isArray(productData.tags) ? productData.tags : ["Featured"],
    status: productData.status || (productData.isPublished === false ? "draft" : "active"),
    isPublished: productData.isPublished !== false && productData.status !== "draft",
    published_at: productData.published_at || (existingIdx >= 0 ? products[existingIdx].published_at : now),
    createdAt: productData.createdAt || productData.created_at || (existingIdx >= 0 ? products[existingIdx].createdAt : now),
    created_at: productData.created_at || productData.createdAt || (existingIdx >= 0 ? products[existingIdx].created_at : now),
    updatedAt: now,
    updated_at: now,
    collectionIds: Array.isArray(productData.collectionIds) ? productData.collectionIds : [],
  };

  if (existingIdx >= 0) {
    products[existingIdx] = { ...products[existingIdx], ...fullProduct };
  } else {
    products.unshift(fullProduct);
  }

  writeProductsToStore(products);
  return fullProduct;
}

export function deleteCustomProduct(idOrSlug: string): boolean {
  if (!idOrSlug) return false;
  const clean = idOrSlug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const products = readProductsFromStore();

  const filtered = products.filter((p) => {
    const pId = (p.id || "").toLowerCase().trim();
    const pSlug = (p.slug || "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    return pId !== clean && pSlug !== clean && p.id !== idOrSlug && p.slug !== idOrSlug;
  });

  if (filtered.length !== products.length) {
    writeProductsToStore(filtered);
    return true;
  }
  return false;
}

export function getCustomProductByIdOrSlug(idOrSlug: string): StoredProduct | null {
  if (!idOrSlug) return null;
  const clean = idOrSlug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const products = readProductsFromStore();

  const found = products.find(
    (p) =>
      p.id.toLowerCase() === clean ||
      p.slug.toLowerCase() === clean ||
      p.handle?.toLowerCase() === clean ||
      p.slug.replace(/[^a-z0-9]/g, "") === clean.replace(/[^a-z0-9]/g, "")
  );

  return found || null;
}
