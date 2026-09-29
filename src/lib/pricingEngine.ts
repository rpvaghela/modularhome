import { query } from "@/lib/db";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export interface PricingRule {
  id: string;
  code: string;
  category: string; // 'BASE_MODEL', 'SQFT_RATE', 'UPGRADE', 'FEE', 'DISCOUNT'
  label: string;
  base_rate: number;
  multiplier: number;
  min_sqft?: number;
  max_sqft?: number;
  description?: string;
  is_active: boolean;
  metadata?: any;
}

export interface PricingEngineInput {
  modelType?: string;
  modelSlug?: string;
  modelName?: string;
  sqft: number;
  selectedUpgrades?: string[];
  finishLevel?: "KIT_SHELL" | "STANDARD" | "PREMIUM_TURNKEY" | string;
  deliveryRegion?: string;
  zip?: string;
  customRequirements?: string;
}

export interface QuoteLineItem {
  id: string;
  label: string;
  category: "BASE_MODEL" | "SQFT_RATE" | "FINISH_LEVEL" | "UPGRADE" | "FEE" | "DISCOUNT";
  amount: number;
  description?: string;
}

export interface DeterministicQuotationResult {
  pricingRuleVersion: string;
  modelType: string;
  modelName: string;
  sqft: number;
  basePrice: number;
  sqftRateAmount: number;
  upgradesTotal: number;
  feesTotal: number;
  discountsTotal: number;
  estimatedTotal: number;
  lineItems: QuoteLineItem[];
  inclusions: string[];
  exclusions: string[];
  disclaimer: string;
}

// Built-in default rules fallback
const DEFAULT_RULES: PricingRule[] = [
  { id: "def-1", code: "MODULAR_BASE", category: "BASE_MODEL", label: "Precision Steel Modular Base Shell", base_rate: 35000, multiplier: 0, is_active: true },
  { id: "def-2", code: "BARNDO_BASE", category: "BASE_MODEL", label: "Structural Barndominium Steel Truss Base", base_rate: 42000, multiplier: 0, is_active: true },
  { id: "def-3", code: "CABIN_BASE", category: "BASE_MODEL", label: "Engineered Cabin Kit Base Framing", base_rate: 28000, multiplier: 0, is_active: true },
  { id: "def-4", code: "ADU_BASE", category: "BASE_MODEL", label: "ADU / Compact Modular Suite Base", base_rate: 32000, multiplier: 0, is_active: true },
  { id: "def-5", code: "SQFT_STANDARD", category: "SQFT_RATE", label: "Floor Area Rate (Per SqFt)", base_rate: 0, multiplier: 85, is_active: true },
  { id: "def-6", code: "SOLAR_PREP", category: "UPGRADE", label: "Solar Energy Ready Electrical & Roof Conduit", base_rate: 3500, multiplier: 0, is_active: true },
  { id: "def-7", code: "TRIPLE_PANE", category: "UPGRADE", label: "High-Efficiency Triple-Pane Low-E Windows", base_rate: 5200, multiplier: 0, is_active: true },
  { id: "def-8", code: "PREMIUM_INSULATION", category: "UPGRADE", label: "Closed-Cell Spray Foam Thermal Package (R-38)", base_rate: 4800, multiplier: 0, is_active: true },
  { id: "def-9", code: "SMART_HOME", category: "UPGRADE", label: "Smart Home Energy & HVAC Automation Hub", base_rate: 2200, multiplier: 0, is_active: true },
  { id: "def-10", code: "HEAVY_SNOW_WIND", category: "UPGRADE", label: "Extreme Zone Wind & Snow Load Engineering", base_rate: 3900, multiplier: 0, is_active: true },
  { id: "def-11", code: "ENG_SEALED_PLANS", category: "FEE", label: "State-Specific Architectural Engineer Stamped Plans", base_rate: 1850, multiplier: 0, is_active: true },
  { id: "def-12", code: "FREIGHT_LOGISTICS", category: "FEE", label: "Flatbed Nationwide Factory Transportation Logistics", base_rate: 2500, multiplier: 0, is_active: true },
];

export const STANDARD_DISCLAIMER =
  "Preliminary deterministic estimate generated in accordance with ModularHome.com factory rates (Rule Version v2026.1). Pricing excludes site-specific foundation excavation, local utility hookups, crane offloading, and municipal permit taxes.";

export const STANDARD_INCLUSIONS = [
  "Engineered structural light-gauge steel framing panels",
  "Factory-assembled exterior wall & roof truss assemblies",
  "Comprehensive architectural CAD & assembly blueprints",
  "Manufacturer structural warranty (50-Year Steel Warranty)",
  "Factory crating and moisture-barrier protective wrapping",
];

export const STANDARD_EXCLUSIONS = [
  "Concrete slab or pier foundation construction",
  "On-site septic, sewer, water, and electrical grid tie-in",
  "Local site grading, tree removal, and driveway paving",
  "Municipal building permit fees and local impact taxes",
  "Mobile crane rental for module setting (unless contracted)",
];

/**
 * Fetch all active pricing rules from Postgres or Supabase
 */
export async function getActivePricingRules(): Promise<PricingRule[]> {
  try {
    const res = await query("SELECT * FROM pricing_rules WHERE is_active = true ORDER BY category, label");
    if (res && res.rows.length > 0) {
      return res.rows.map((r: any) => ({
        id: r.id,
        code: r.code,
        category: r.category,
        label: r.label,
        base_rate: Number(r.base_rate) || 0,
        multiplier: Number(r.multiplier) || 0,
        min_sqft: r.min_sqft ? Number(r.min_sqft) : undefined,
        max_sqft: r.max_sqft ? Number(r.max_sqft) : undefined,
        description: r.description,
        is_active: r.is_active,
        metadata: typeof r.metadata === "string" ? JSON.parse(r.metadata) : r.metadata || {},
      }));
    }
  } catch (dbErr) {
    console.warn("Postgres pricing_rules query fallback:", dbErr);
  }

  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabaseAdmin
        .from("pricing_rules")
        .select("*")
        .eq("is_active", true)
        .order("category");

      if (data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          code: r.code,
          category: r.category,
          label: r.label,
          base_rate: Number(r.base_rate) || 0,
          multiplier: Number(r.multiplier) || 0,
          min_sqft: r.min_sqft ? Number(r.min_sqft) : undefined,
          max_sqft: r.max_sqft ? Number(r.max_sqft) : undefined,
          description: r.description,
          is_active: r.is_active,
          metadata: typeof r.metadata === "string" ? JSON.parse(r.metadata) : r.metadata || {},
        }));
      }
    } catch {}
  }

  return DEFAULT_RULES;
}

/**
 * Deterministically compute itemized quotation
 */
export async function calculateQuotation(input: PricingEngineInput): Promise<DeterministicQuotationResult> {
  const rules = await getActivePricingRules();
  const sqft = Math.max(100, Math.min(10000, Math.round(Number(input.sqft) || 1000)));
  const modelType = input.modelType || "Modular Homes";
  const modelName = input.modelName || "Custom Modular Home";
  const selectedUpgrades = input.selectedUpgrades || [];

  const lineItems: QuoteLineItem[] = [];

  // 1. Determine Base Structure Model
  let baseRule = rules.find(
    (r) =>
      r.category === "BASE_MODEL" &&
      (r.code.toLowerCase().includes(modelType.toLowerCase().slice(0, 4)) ||
        modelName.toLowerCase().includes(r.label.toLowerCase().slice(0, 5)))
  );
  if (!baseRule) {
    baseRule = rules.find((r) => r.category === "BASE_MODEL") || DEFAULT_RULES[0];
  }

  const basePrice = baseRule.base_rate;
  lineItems.push({
    id: baseRule.id || "base-model",
    label: `${baseRule.label} (Model: ${modelName})`,
    category: "BASE_MODEL",
    amount: basePrice,
    description: "Core engineered steel structural package and pre-drilled framing components.",
  });

  // 2. Determine SqFt Rate Multiplier
  const sqftRule = rules.find((r) => r.category === "SQFT_RATE") || DEFAULT_RULES[4];
  const sqftRate = sqftRule.multiplier > 0 ? sqftRule.multiplier : 85;
  const sqftRateAmount = Math.round(sqft * sqftRate);

  lineItems.push({
    id: sqftRule.id || "sqft-rate",
    label: `Living Space Area Framing (${sqft.toLocaleString()} sq ft @ $${sqftRate}/sq ft)`,
    category: "SQFT_RATE",
    amount: sqftRateAmount,
    description: `Dimension rate calculation for ${sqft.toLocaleString()} sq ft gross floor area.`,
  });

  // 3. Finish Level Modifier
  let finishMultiplier = 0;
  if (input.finishLevel === "PREMIUM_TURNKEY") {
    finishMultiplier = Math.round(sqft * 45);
    lineItems.push({
      id: "finish-premium",
      label: "Turnkey Luxury Interior & Fixtures Package",
      category: "FINISH_LEVEL",
      amount: finishMultiplier,
      description: "Quartz countertops, luxury vinyl plank flooring, solid core doors, and LED fixtures.",
    });
  } else if (input.finishLevel === "STANDARD") {
    finishMultiplier = Math.round(sqft * 20);
    lineItems.push({
      id: "finish-standard",
      label: "Standard Interior Drywall & Insulation Package",
      category: "FINISH_LEVEL",
      amount: finishMultiplier,
      description: "Standard R-21 wall batts, subfloor underlayment, and pre-hung entry doors.",
    });
  }

  // 4. Calculate Selected Upgrades
  let upgradesTotal = 0;
  const upgradeRules = rules.filter((r) => r.category === "UPGRADE");

  for (const upRule of upgradeRules) {
    const isSelected =
      selectedUpgrades.includes(upRule.code) ||
      selectedUpgrades.includes(upRule.id) ||
      selectedUpgrades.some((u) => u.toLowerCase() === upRule.label.toLowerCase());

    if (isSelected) {
      const upgradePrice = upRule.base_rate + Math.round(sqft * (upRule.multiplier || 0));
      upgradesTotal += upgradePrice;
      lineItems.push({
        id: upRule.id,
        label: upRule.label,
        category: "UPGRADE",
        amount: upgradePrice,
        description: upRule.description || "Factory-installed precision architectural enhancement.",
      });
    }
  }

  // 5. Mandatory Engineering & Logistics Fees
  let feesTotal = 0;
  const feeRules = rules.filter((r) => r.category === "FEE");
  for (const fRule of feeRules) {
    const feeAmt = fRule.base_rate;
    feesTotal += feeAmt;
    lineItems.push({
      id: fRule.id,
      label: fRule.label,
      category: "FEE",
      amount: feeAmt,
      description: fRule.description || "Required administrative or logistical allocation.",
    });
  }

  const discountsTotal = 0;
  const estimatedTotal = basePrice + sqftRateAmount + finishMultiplier + upgradesTotal + feesTotal - discountsTotal;

  return {
    pricingRuleVersion: "v2026.1",
    modelType,
    modelName,
    sqft,
    basePrice,
    sqftRateAmount: sqftRateAmount + finishMultiplier,
    upgradesTotal,
    feesTotal,
    discountsTotal,
    estimatedTotal,
    lineItems,
    inclusions: STANDARD_INCLUSIONS,
    exclusions: STANDARD_EXCLUSIONS,
    disclaimer: STANDARD_DISCLAIMER,
  };
}
