import fs from "fs";
import path from "path";
import { FLOOR_PLANS, FloorPlanItem } from "../data/floorPlans";

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
  const plans = readLocalFloorPlans();
  if (onlyPublished) {
    return plans.filter((p) => p.status !== "DRAFT" && p.status !== "ARCHIVED");
  }
  return plans;
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
