import fs from "fs";
import path from "path";
import { FLOOR_PLANS, FloorPlanItem } from "../data/floorPlans";
import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabase";

export type { FloorPlanItem };

const DATA_DIR = path.join(process.cwd(), "data");
const PLANS_FILE = path.join(DATA_DIR, "custom_floor_plans.json");

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}

export function readLocalFloorPlans(): FloorPlanItem[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(PLANS_FILE)) {
      fs.writeFileSync(PLANS_FILE, JSON.stringify(FLOOR_PLANS, null, 2), "utf-8");
      return FLOOR_PLANS;
    }
    const data = fs.readFileSync(PLANS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : FLOOR_PLANS;
  } catch (error) {
    console.error("Error reading custom_floor_plans.json:", error);
    return FLOOR_PLANS;
  }
}

export function writeLocalFloorPlans(plans: FloorPlanItem[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(PLANS_FILE, JSON.stringify(plans, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to custom_floor_plans.json:", error);
  }
}

export async function getBombShelterFloorPlans(onlyPublished = false): Promise<FloorPlanItem[]> {
  const localList = readLocalFloorPlans();

  if (isSupabaseConfigured()) {
    try {
      let query = (supabaseAdmin || supabase)
        .from("floor_plans")
        .select("*")
        .order("display_order", { ascending: true });

      if (onlyPublished) {
        query = query.eq("status", "PUBLISHED");
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data) && data.length > 0) {
        const dbPlans: FloorPlanItem[] = data.map((item) => ({
          id: item.slug || item.id,
          name: item.title,
          category: item.category || "Cabins",
          sqft: item.square_feet || 500,
          dimensions: item.dimensions || "20x30 ft",
          occupancy: `${item.bedrooms || 1} Bed / ${item.bathrooms || 1} Bath`,
          rooms: `${item.bedrooms || 1} Bedroom, ${item.bathrooms || 1} Bath, Great Room`,
          imageUrl: item.preview_image || "/images/cat-luxury-bunkers.png",
          desc: item.description || item.tagline || "",
          price: Number(item.price || 495),
          salePrice: item.sale_price ? Number(item.sale_price) : undefined,
          blastRating: "ASTM Tested / Cold-Formed Steel",
          fileFormat: item.file_format || "PDF + CAD (DWG)",
          status: item.status || "PUBLISHED",
        }));

        // Merge keeping local items if not in db
        const merged = [...dbPlans];
        for (const local of localList) {
          if (!merged.some((p) => p.id === local.id)) {
            merged.push(local);
          }
        }
        return merged;
      }
    } catch (e) {
      console.warn("Supabase floor plans fetch warning:", e);
    }
  }

  return onlyPublished
    ? localList.filter((p) => p.status !== "DRAFT" && p.status !== "ARCHIVED")
    : localList;
}

export async function getBombShelterFloorPlanBySlug(slug: string): Promise<FloorPlanItem | null> {
  const all = await getBombShelterFloorPlans();
  return all.find((p) => p.id.toLowerCase() === slug.toLowerCase()) || null;
}

export async function saveBombShelterFloorPlan(plan: FloorPlanItem): Promise<FloorPlanItem> {
  const plans = readLocalFloorPlans();
  const idx = plans.findIndex((p) => p.id === plan.id);
  if (idx !== -1) {
    plans[idx] = plan;
  } else {
    plans.unshift(plan);
  }
  writeLocalFloorPlans(plans);
  return plan;
}

export async function deleteBombShelterFloorPlan(id: string): Promise<boolean> {
  const plans = readLocalFloorPlans();
  const filtered = plans.filter((p) => p.id !== id);
  writeLocalFloorPlans(filtered);
  return true;
}
