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
  selectedUpgrades?: Array<string | { id?: string; code?: string; name?: string; label?: string; price?: number } | any>;
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

export const DEFAULT_BOMBSHELTER_PRICING_RULES: PricingRule[] = [
  {
    id: "rule-base-bunker",
    code: "BASE_BUNKER_SQFT",
    category: "SQFT_RATE",
    label: "Underground Steel Corrugated Hull Base Rate",
    base_rate: 125,
    multiplier: 1.0,
    min_sqft: 100,
    max_sqft: 5000,
    description: "Cold-formed corrugated structural steel cylinder with exterior marine epoxy waterproofing",
    is_active: true,
  },
  {
    id: "rule-blast-door",
    code: "BLAST_DOOR_DUAL",
    category: "UPGRADE",
    label: "Dual Airtight Blast Doors & Airlock Chamber",
    base_rate: 14500,
    multiplier: 1.0,
    description: "Overpressure rated to 3.5 Bar with mechanical compression latches",
    is_active: true,
  },
  {
    id: "rule-nbc-filtration",
    code: "NBC_SWISS_VAULT",
    category: "UPGRADE",
    label: "Swiss NBC Military Air Filtration System",
    base_rate: 9800,
    multiplier: 1.0,
    description: "HEPA + Activated Carbon + Blast Valve with battery back-up & manual hand crank",
    is_active: true,
  },
  {
    id: "rule-escape-tunnel",
    code: "ESCAPE_TUNNEL_SECONDARY",
    category: "UPGRADE",
    label: "Concealed 30ft Emergency Escape Hatch & Tunnel",
    base_rate: 12500,
    multiplier: 1.0,
    description: "Counter-balanced hidden exit hatch with gas springs and tamper-proof locking",
    is_active: true,
  },
  {
    id: "rule-excavation",
    code: "DEEP_EXCAVATION_EST",
    category: "FEE",
    label: "Subterranean Excavation & Crane Placement",
    base_rate: 18000,
    multiplier: 1.0,
    description: "Average heavy rigging, backfill compaction, and crane placement",
    is_active: true,
  },
];

export function calculateDeterministicQuote(input: PricingEngineInput): DeterministicQuotationResult {
  const sqft = Math.max(1, Number(input.sqft) || 400);
  const baseRate = 125;
  const sqftAmount = sqft * baseRate;
  
  let upgradesTotal = 0;
  const lineItems: QuoteLineItem[] = [
    {
      id: "line-sqft",
      label: `Subterranean Hull Fabrication (${sqft} sq ft @ $${baseRate}/sqft)`,
      category: "SQFT_RATE",
      amount: sqftAmount,
    },
  ];

  if (input.selectedUpgrades && Array.isArray(input.selectedUpgrades)) {
    input.selectedUpgrades.forEach((u, i) => {
      const price = typeof u === "object" ? Number(u.price) || 5000 : 5000;
      const label = typeof u === "object" ? u.label || u.name || `Defense Upgrade #${i + 1}` : String(u);
      upgradesTotal += price;
      lineItems.push({
        id: `upgrade-${i}`,
        label,
        category: "UPGRADE",
        amount: price,
      });
    });
  }

  const estimatedTotal = sqftAmount + upgradesTotal;

  return {
    pricingRuleVersion: "BOMBSHELTER_2026_V1",
    modelType: input.modelType || "Underground Bomb Shelter",
    modelName: input.modelName || "Custom Defense Shelter",
    sqft,
    basePrice: sqftAmount,
    sqftRateAmount: sqftAmount,
    upgradesTotal,
    feesTotal: 0,
    discountsTotal: 0,
    estimatedTotal,
    lineItems,
    inclusions: [
      "Heavy-gauge corrugated structural steel hull with cathodic rust inhibitors",
      "Factory hydro-tested airtight seal with exterior rubberized polyurethane coating",
      "Prefabricated reinforced entryway stairwell or vertical ladder shaft",
    ],
    exclusions: [
      "Local excavation permits and environmental zoning clearances",
      "Site utilities connection (water well, septic, high-voltage grid)",
    ],
    disclaimer: "Deterministic engineering estimate. Final fabrication specifications subject to site soil and rock survey.",
  };
}

