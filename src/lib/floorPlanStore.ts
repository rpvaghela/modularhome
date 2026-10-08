import type { FloorPlan } from "@/data/floorPlans";

let fs: any = null;
let path: any = null;

if (typeof window === "undefined") {
  try {
    fs = require("fs");
    path = require("path");
  } catch {}
}

const DATA_DIR = path ? path.join(process.cwd(), "src", "data") : "";
const FLOOR_PLANS_FILE = path ? path.join(DATA_DIR, "custom_floor_plans.json") : "";

export interface StoredFloorPlan {
  id: string;
  slug: string;
  title: string;
  name?: string;
  tagline?: string;
  description?: string;
  price: number;
  salePrice?: number;
  sale_price?: number;
  currency?: string;
  previewImage?: string;
  preview_image?: string;
  gallery?: string[];
  filePath?: string;
  file_path?: string;
  fileFormat?: string;
  file_format?: string;
  category: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  square_feet?: number;
  dimensions?: string;
  stories: number;
  includedItems?: string[];
  included_items?: string[];
  features?: string[];
  specs?: any;
  status: string;
  isFeatured?: boolean;
  is_featured?: boolean;
  displayOrder?: number;
  display_order?: number;
  seoTitle?: string;
  seo_title?: string;
  metaDescription?: string;
  meta_description?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

function ensureDataDirectory() {
  if (!fs || !path) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory for floor plans:", err);
  }
}

export function readFloorPlansFromStore(): StoredFloorPlan[] {
  if (!fs || !path || !FLOOR_PLANS_FILE) return [];
  try {
    ensureDataDirectory();
    if (!fs.existsSync(FLOOR_PLANS_FILE)) {
      fs.writeFileSync(FLOOR_PLANS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const data = fs.readFileSync(FLOOR_PLANS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      fs.writeFileSync(FLOOR_PLANS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    return parsed;
  } catch (error) {
    console.error("Error reading custom_floor_plans.json:", error);
    return [];
  }
}

export function writeFloorPlansToStore(plans: StoredFloorPlan[]): void {
  if (!fs || !path || !FLOOR_PLANS_FILE) return;
  try {
    ensureDataDirectory();
    fs.writeFileSync(FLOOR_PLANS_FILE, JSON.stringify(plans, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_floor_plans.json:", error);
  }
}

export function saveCustomFloorPlan(planData: Partial<StoredFloorPlan> & { title?: string; slug?: string }): StoredFloorPlan {
  const plans = readFloorPlansFromStore();
  const rawSlug = planData.slug || planData.id || "new-plan";
  const cleanSlug = rawSlug.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-");
  const title = planData.title || planData.name || "Architectural Floor Plan Blueprint";

  const existingIdx = plans.findIndex(
    (p) => (planData.id && p.id === planData.id) || p.slug.toLowerCase() === cleanSlug
  );

  const now = new Date().toISOString();
  const defaultImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
  const previewImg: string = planData.previewImage || planData.preview_image || (existingIdx >= 0 && plans[existingIdx].previewImage ? plans[existingIdx].previewImage! : defaultImg);

  const parseJson = (val: any, fallback: any) => {
    if (!val) return fallback;
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return fallback;
      }
    }
    return val;
  };

  const fullPlan: StoredFloorPlan = {
    id: planData.id || (existingIdx >= 0 ? plans[existingIdx].id : `fp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`),
    slug: cleanSlug,
    title,
    name: title,
    tagline: planData.tagline || (planData.squareFeet || planData.square_feet ? `${planData.squareFeet || planData.square_feet} SQ FT Blueprint Package` : ""),
    description: planData.description || "",
    price: Number(planData.price || (existingIdx >= 0 ? plans[existingIdx].price : 495)),
    salePrice: planData.salePrice ? Number(planData.salePrice) : planData.sale_price ? Number(planData.sale_price) : undefined,
    sale_price: planData.salePrice ? Number(planData.salePrice) : planData.sale_price ? Number(planData.sale_price) : undefined,
    currency: planData.currency || "USD",
    previewImage: previewImg,
    preview_image: previewImg,
    gallery: Array.isArray(planData.gallery) && planData.gallery.length > 0 ? planData.gallery.filter(Boolean) : [previewImg],
    filePath: planData.filePath || planData.file_path || (existingIdx >= 0 ? plans[existingIdx].filePath : undefined),
    file_path: planData.filePath || planData.file_path || (existingIdx >= 0 ? plans[existingIdx].filePath : undefined),
    fileFormat: planData.fileFormat || planData.file_format || "PDF + CAD (DWG)",
    file_format: planData.fileFormat || planData.file_format || "PDF + CAD (DWG)",
    category: planData.category || "ADUs",
    bedrooms: Number(planData.bedrooms ?? (existingIdx >= 0 ? plans[existingIdx].bedrooms : 2)),
    bathrooms: Number(planData.bathrooms ?? (existingIdx >= 0 ? plans[existingIdx].bathrooms : 1)),
    squareFeet: Number(planData.squareFeet || planData.square_feet || (existingIdx >= 0 ? plans[existingIdx].squareFeet : 800)),
    square_feet: Number(planData.squareFeet || planData.square_feet || (existingIdx >= 0 ? plans[existingIdx].squareFeet : 800)),
    dimensions: planData.dimensions || "24x36 ft",
    stories: Number(planData.stories || (existingIdx >= 0 ? plans[existingIdx].stories : 1)),
    includedItems: parseJson(planData.includedItems || planData.included_items, [
      "Full Construction Blueprints",
      "Structural Steel Framing & Truss Layouts",
      "Electrical & Plumbing Schematics",
      "Foundation & Engineering Stamp Ready",
    ]),
    included_items: parseJson(planData.includedItems || planData.included_items, [
      "Full Construction Blueprints",
      "Structural Steel Framing & Truss Layouts",
      "Electrical & Plumbing Schematics",
      "Foundation & Engineering Stamp Ready",
    ]),
    features: parseJson(planData.features, []),
    specs: parseJson(planData.specs, {}),
    status: planData.status || "PUBLISHED",
    isFeatured: planData.isFeatured !== undefined ? Boolean(planData.isFeatured) : planData.is_featured !== undefined ? Boolean(planData.is_featured) : false,
    is_featured: planData.isFeatured !== undefined ? Boolean(planData.isFeatured) : planData.is_featured !== undefined ? Boolean(planData.is_featured) : false,
    displayOrder: Number(planData.displayOrder || planData.display_order || 0),
    display_order: Number(planData.displayOrder || planData.display_order || 0),
    seoTitle: planData.seoTitle || planData.seo_title || `${title} Blueprint Package | ModularHome`,
    seo_title: planData.seoTitle || planData.seo_title || `${title} Blueprint Package | ModularHome`,
    metaDescription: planData.metaDescription || planData.meta_description || (planData.description ? planData.description.slice(0, 160) : ""),
    meta_description: planData.metaDescription || planData.meta_description || (planData.description ? planData.description.slice(0, 160) : ""),
    createdAt: planData.createdAt || planData.created_at || (existingIdx >= 0 ? plans[existingIdx].createdAt : now),
    created_at: planData.created_at || planData.createdAt || (existingIdx >= 0 ? plans[existingIdx].created_at : now),
    updatedAt: now,
    updated_at: now,
  };

  if (existingIdx >= 0) {
    plans[existingIdx] = { ...plans[existingIdx], ...fullPlan };
  } else {
    plans.unshift(fullPlan);
  }

  writeFloorPlansToStore(plans);
  return fullPlan;
}

export function deleteCustomFloorPlan(idOrSlug: string): boolean {
  if (!idOrSlug) return false;
  const clean = idOrSlug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const plans = readFloorPlansFromStore();

  const filtered = plans.filter((p) => {
    const pId = (p.id || "").toLowerCase().trim();
    const pSlug = (p.slug || "").toLowerCase().trim().replace(/^\/+|\/+$/g, "");
    return pId !== clean && pSlug !== clean && p.id !== idOrSlug && p.slug !== idOrSlug;
  });

  if (filtered.length !== plans.length) {
    writeFloorPlansToStore(filtered);
    return true;
  }
  return false;
}

export function getCustomFloorPlanByIdOrSlug(idOrSlug: string): StoredFloorPlan | null {
  if (!idOrSlug) return null;
  const clean = idOrSlug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  const plans = readFloorPlansFromStore();

  const found = plans.find(
    (p) =>
      p.id.toLowerCase() === clean ||
      p.slug.toLowerCase() === clean ||
      p.slug.replace(/[^a-z0-9]/g, "") === clean.replace(/[^a-z0-9]/g, "")
  );

  return found || null;
}
