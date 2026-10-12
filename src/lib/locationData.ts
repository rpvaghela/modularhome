/**
 * Location-Based SEO Data & Helper for State & City Modular Home Landing Pages
 * Provides localized metadata, building compliance details, and coverage info.
 */

export interface LocationInfo {
  state: string;
  stateCode: string;
  slug: string;
  region: string;
  majorCities: string[];
  climateZone: string;
  windRating: string;
  snowLoad: string;
  deliveryTimeWeeks: string;
  permitAssistance: boolean;
  intro: string;
  localAdvantages: string[];
}

export const US_STATES_LOCATIONS: Record<string, LocationInfo> = {
  texas: {
    state: "Texas",
    stateCode: "TX",
    slug: "texas",
    region: "South Central",
    majorCities: ["Austin", "Houston", "Dallas", "Fort Worth", "San Antonio", "Tyler", "Waco"],
    climateZone: "Zone 2 & 3 (Hot & Humid to Arid)",
    windRating: "Up to 150 MPH Coastal & Inland Engineering",
    snowLoad: "20 PSF Standard Ground Snow Load",
    deliveryTimeWeeks: "6–10 Weeks Direct Factory Delivery",
    permitAssistance: true,
    intro: "ModularHome.com delivers factory-precision steel-frame modular homes, barndominiums, and prefab cabins across Texas. Designed for extreme heat resistance and superior structural energy efficiency.",
    localAdvantages: [
      "Engineered for Texas coastal and inland high-wind building codes",
      "Superior thermal insulation for low summer cooling bills",
      "Direct factory crane installation across all Texas counties",
    ],
  },
  florida: {
    state: "Florida",
    stateCode: "FL",
    slug: "florida",
    region: "Southeast",
    majorCities: ["Orlando", "Tampa", "Jacksonville", "Miami", "Ocala", "Pensacola", "Sarasota"],
    climateZone: "Zone 1 & 2 (Humid Subtropical)",
    windRating: "Up to 175 MPH Hurricane-Resistant Steel Engineering",
    snowLoad: "0 PSF (Non-Freezing)",
    deliveryTimeWeeks: "7–11 Weeks Direct Factory Delivery",
    permitAssistance: true,
    intro: "Engineered specifically to meet Florida's stringent High Velocity Hurricane Zone (HVHZ) requirements, our modular homes and prefab residences provide unparalleled storm resilience.",
    localAdvantages: [
      "100% Galvanized Light Gauge Steel Framing immune to termites and humidity rot",
      "Rated up to 175 MPH wind load with stamped architectural blueprints",
      "Rapid turnkey installation for land owners across central and northern Florida",
    ],
  },
  tennessee: {
    state: "Tennessee",
    stateCode: "TN",
    slug: "tennessee",
    region: "Appalachian / Southeast",
    majorCities: ["Nashville", "Knoxville", "Chattanooga", "Gatlinburg", "Pigeon Forge", "Memphis"],
    climateZone: "Zone 4 (Mixed-Humid)",
    windRating: "Up to 120 MPH Rated",
    snowLoad: "30 PSF Mountain Ground Snow Load",
    deliveryTimeWeeks: "6–8 Weeks Direct Factory Delivery",
    permitAssistance: true,
    intro: "From Great Smoky Mountain vacation cabins to modern Nashville modular estates and barndominiums, ModularHome.com builds turnkey homes for Tennessee property owners.",
    localAdvantages: [
      "Handcrafted cabin styling with commercial steel truss longevity",
      "Optimal thermal comfort across cold mountain winters and humid summers",
      "Popular choice for high-return short-term rental developments in Gatlinburg and Pigeon Forge",
    ],
  },
  "north-carolina": {
    state: "North Carolina",
    stateCode: "NC",
    slug: "north-carolina",
    region: "Southeast / Mid-Atlantic",
    majorCities: ["Charlotte", "Raleigh", "Asheville", "Wilmington", "Greensboro", "Boone"],
    climateZone: "Zone 3 & 4 (Coastal to Mountain)",
    windRating: "Up to 140 MPH Coastal Rated",
    snowLoad: "35 PSF Mountain / Piedmont Rated",
    deliveryTimeWeeks: "7–10 Weeks Direct Factory Delivery",
    permitAssistance: true,
    intro: "Whether you need a coastal modular residence in Wilmington or a scenic mountain modern home in Asheville, ModularHome.com supplies precision-built modular homes throughout North Carolina.",
    localAdvantages: [
      "IRC-compliant blueprints ready for local county inspection",
      "Resistant to coastal salt-spray and mountain moisture",
      "Pre-plumbed and pre-wired factory modules minimize site disruption",
    ],
  },
  georgia: {
    state: "Georgia",
    stateCode: "GA",
    slug: "georgia",
    region: "Southeast",
    majorCities: ["Atlanta", "Savannah", "Athens", "Augusta", "Blue Ridge", "Macon"],
    climateZone: "Zone 2 & 3 (Warm & Humid)",
    windRating: "Up to 130 MPH Rated",
    snowLoad: "20 PSF Ground Snow Load",
    deliveryTimeWeeks: "6–9 Weeks Direct Factory Delivery",
    permitAssistance: true,
    intro: "Build your dream home in Georgia faster with factory modular construction. Ideal for rural acreage barndominiums, Blue Ridge cabin retreats, and suburban Atlanta custom residences.",
    localAdvantages: [
      "High-efficiency HVAC preparation for southern humidity",
      "Galvanized steel structural frame with 50-year warranty",
      "Full logistics support and flatbed delivery to your jobsite",
    ],
  },
  indiana: {
    state: "Indiana",
    stateCode: "IN",
    slug: "indiana",
    region: "Midwest",
    majorCities: ["Indianapolis", "Fort Wayne", "Bloomington", "South Bend", "Evansville", "Elkhart"],
    climateZone: "Zone 5 (Cold / Freeze-Thaw)",
    windRating: "Up to 115 MPH Rated",
    snowLoad: "40 PSF Ground Snow Load",
    deliveryTimeWeeks: "4–7 Weeks Direct Factory Delivery",
    permitAssistance: true,
    intro: "Built close to our heartland manufacturing centers, Indiana customers enjoy fast delivery, reduced freight expenses, and authentic Amish-crafted interior options combined with steel frame durability.",
    localAdvantages: [
      "Expedited shipping corridors with lowest regional freight rates",
      "Rigid insulation packages engineered for freezing Midwest winters",
      "Compliant with Indiana State Building Commissioner modular approvals",
    ],
  },
  ohio: {
    state: "Ohio",
    stateCode: "OH",
    slug: "ohio",
    region: "Midwest",
    majorCities: ["Columbus", "Cleveland", "Cincinnati", "Dayton", "Akron", "Canton"],
    climateZone: "Zone 5 (Cold)",
    windRating: "Up to 115 MPH Rated",
    snowLoad: "40 PSF Ground Snow Load",
    deliveryTimeWeeks: "5–8 Weeks Direct Factory Delivery",
    permitAssistance: true,
    intro: "Modular homes, barndominium house kits, and modern prefabs built for Ohio property owners. Built offsite in a climate-controlled environment to avoid weather delays.",
    localAdvantages: [
      "Zero moisture intrusion during factory construction",
      "High R-value wall and roof assemblies for sub-zero energy conservation",
      "Turnkey crane installation available statewide",
    ],
  },
  colorado: {
    state: "Colorado",
    stateCode: "CO",
    slug: "colorado",
    region: "Mountain West",
    majorCities: ["Denver", "Colorado Springs", "Boulder", "Fort Collins", "Breckenridge", "Grand Junction"],
    climateZone: "Zone 5 & 6 (Alpine / Cold)",
    windRating: "Up to 140 MPH Mountain Chinook Winds",
    snowLoad: "60–90 PSF Heavy Alpine Ground Snow Load",
    deliveryTimeWeeks: "8–12 Weeks Direct Factory Delivery",
    permitAssistance: true,
    intro: "High-altitude modular homes and luxury modern mountain cabins engineered for extreme Colorado snow loads, alpine wind gusts, and rigorous wildland-urban interface (WUI) fire resistance.",
    localAdvantages: [
      "Non-combustible steel framing providing superior wildfire safety",
      "Heavy snow load roof trusses rated up to 90 PSF",
      "Triple-pane window options and thermal-break exterior walls",
    ],
  },
};

/**
 * Checks if a given slug represents a location-based SEO landing page.
 * Matches formats:
 * - modular-homes-in-[state]
 * - prefab-homes-in-[state]
 * - barndominiums-in-[state]
 * - cabins-in-[state]
 * - modular-homes-[state]
 */
export function parseLocationSlug(slug: string): {
  isLocation: boolean;
  stateKey?: string;
  categorySlug?: string;
  location?: LocationInfo;
} {
  const clean = slug.toLowerCase().trim();

  // Pattern 1: [category]-in-[state]
  const inMatch = clean.match(/^(modular-homes|prefab-homes|barndominiums|cabins|tiny-homes)-in-([a-z-]+)$/);
  if (inMatch) {
    const categorySlug = inMatch[1];
    const stateKey = inMatch[2];
    if (US_STATES_LOCATIONS[stateKey]) {
      return {
        isLocation: true,
        categorySlug,
        stateKey,
        location: US_STATES_LOCATIONS[stateKey],
      };
    }
  }

  // Pattern 2: modular-homes-[state]
  const directMatch = clean.match(/^modular-homes-([a-z-]+)$/);
  if (directMatch) {
    const stateKey = directMatch[1];
    if (US_STATES_LOCATIONS[stateKey]) {
      return {
        isLocation: true,
        categorySlug: "modular-homes",
        stateKey,
        location: US_STATES_LOCATIONS[stateKey],
      };
    }
  }

  return { isLocation: false };
}
