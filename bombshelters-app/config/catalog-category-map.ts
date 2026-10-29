/**
 * BombShelters.com — Central Catalog Category & Navbar Mapping Configuration
 * Single source of truth for taxonomy, routing, product_type matching, and SEO defaults.
 */

export interface KeyPoint {
  title: string;
  desc: string;
}

export interface CategoryConfig {
  id: string;
  label: string;
  href: string;
  productType: string;
  badge: string;
  headingTitle: string;
  headingHighlight: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keyPoints: KeyPoint[];
  displayOrder: number;
  featuredInNav: boolean;
}

export const CATALOG_CATEGORIES: Record<string, CategoryConfig> = {
  "modular-homes": {
    id: "modular-homes",
    label: "Modular Homes",
    href: "/modular-homes",
    productType: "Modular Homes",
    badge: "IRC & ASTM CERTIFIED",
    headingTitle: "MODULAR HOMES & HARDENED",
    headingHighlight: "RESIDENCES",
    description:
      "Modern architectural residences engineered with indestructible commercial structural steel framing. Immune to rot, termites, wildfire, and severe seismic stress.",
    metaTitle: "Modular Homes & Hardened Steel Residences | BombShelters.com",
    metaDescription:
      "Explore precision-engineered modular homes built with certified domestic structural steel. Fire-resistant, blast-resilient, and delivered nationwide.",
    keyPoints: [
      {
        title: "Non-Combustible Steel Shell",
        desc: "Cold-formed commercial steel framing rated Class-A fireproof.",
      },
      {
        title: "Integrated Storm Vaults",
        desc: "Optional subterranean bunker integrated directly into the foundation slab.",
      },
      {
        title: "Precision Factory Tolerance",
        desc: "Built in indoor climate-controlled facilities within 1/16th inch tolerance.",
      },
      {
        title: "Rapid Site Assembly",
        desc: "Delivered in modular sections and locked onto foundation in 3 to 7 days.",
      },
    ],
    displayOrder: 1,
    featuredInNav: true,
  },

  "prefab-homes": {
    id: "prefab-homes",
    label: "Prefab Homes",
    href: "/prefab-homes",
    productType: "Prefab Homes",
    badge: "FACTORY PRECISION",
    headingTitle: "HIGH-EFFICIENCY PREFAB",
    headingHighlight: "HOMES",
    description:
      "Factory prefabricated residential structures designed for energy independence, rapid deployment, and maximum structural integrity.",
    metaTitle: "Prefab Homes & Precision Engineered Living | BombShelters.com",
    metaDescription:
      "Turnkey prefabricated homes engineered for strength, security, and extreme energy efficiency. Built for a safer tomorrow.",
    keyPoints: [
      {
        title: "Thermally Hardened Envelope",
        desc: "High-density thermal barrier preventing heat loss in extreme winter conditions.",
      },
      {
        title: "Heavy-Gauge Steel Chassis",
        desc: "Engineered steel substructure built to withstand Category 5 wind loads.",
      },
      {
        title: "Off-Grid Solar Integration",
        desc: "Pre-wired conduits for solar microgrids, battery banks, and backup generators.",
      },
      {
        title: "Turnkey Delivery",
        desc: "Complete interior finishes, mechanicals, and plumbing ready for hookup.",
      },
    ],
    displayOrder: 2,
    featuredInNav: true,
  },

  "barndominiums": {
    id: "barndominiums",
    label: "Barndominiums",
    href: "/barndominiums",
    productType: "Barndominiums",
    badge: "CLEARSPAN STEEL FRAME",
    headingTitle: "HEAVY-DUTY STEEL",
    headingHighlight: "BARNDOMINIUMS",
    description:
      "Massive open-concept living quarters paired with industrial-grade workshop, hangar, or secure storage spaces. 100% domestic red-iron or galvanized steel.",
    metaTitle: "Steel Barndominiums & Workshop Residences | BombShelters.com",
    metaDescription:
      "Massive clearspan steel barndominiums engineered for maximum survivability, security, and versatile workshop living.",
    keyPoints: [
      {
        title: "Clearspan Living Areas",
        desc: "No load-bearing interior walls allowing infinite custom floor plan configurations.",
      },
      {
        title: "Severe Weather Resistance",
        desc: "Rated for 170+ MPH hurricane winds and heavy commercial snow loads.",
      },
      {
        title: "Integrated Vault Space",
        desc: "Dedicated interior space for reinforced gun vaults, panic rooms, or armories.",
      },
      {
        title: "Zero Rot & Pests",
        desc: "Immune to moisture rot, mold, termites, and wood-boring pests.",
      },
    ],
    displayOrder: 3,
    featuredInNav: true,
  },

  "house-kits": {
    id: "house-kits",
    label: "House Kits",
    href: "/house-kits",
    productType: "House Kits",
    badge: "BOLT-TOGETHER PRE-ENGINEERED",
    headingTitle: "STRUCTURAL STEEL",
    headingHighlight: "HOUSE KITS",
    description:
      "Complete pre-cut, pre-punched steel framing kits and shell packages. Designed for rapid on-site erection by contractors or experienced DIY builders.",
    metaTitle: "Steel House Kits & DIY Shelter Framing | BombShelters.com",
    metaDescription:
      "Pre-engineered steel house kits and structural framing packages. Fast assembly, extreme strength, and nationwide delivery.",
    keyPoints: [
      {
        title: "Pre-Punched & Numbered",
        desc: "Every steel component is laser-cut and clearly labeled for foolproof assembly.",
      },
      {
        title: "Engineered Stamped Plans",
        desc: "Includes state-certified structural engineering calculations for local permitting.",
      },
      {
        title: "Commercial Fasteners",
        desc: "High-tensile Grade 8 structural bolts and self-tapping commercial fasteners included.",
      },
      {
        title: "Cost-Effective Freight",
        desc: "Flat-packed for efficient shipping to remote or restricted access job sites.",
      },
    ],
    displayOrder: 4,
    featuredInNav: true,
  },

  "tiny-homes": {
    id: "tiny-homes",
    label: "Tiny Homes",
    href: "/tiny-homes",
    productType: "Tiny Homes",
    badge: "OFF-GRID SURVIVAL READY",
    headingTitle: "FORTIFIED MICRO-SHELTERS &",
    headingHighlight: "TINY HOMES",
    description:
      "Compact living spaces engineered with defense-grade materials. Ideal for bug-out locations, remote homesteads, and emergency survival retreats.",
    metaTitle: "Fortified Tiny Homes & Micro Shelters | BombShelters.com",
    metaDescription:
      "Rugged steel tiny homes and bug-out micro shelters. Compact, relocatable, and built for complete off-grid independence.",
    keyPoints: [
      {
        title: "Steel Box Chassis",
        desc: "Heavy-gauge tubular steel trailer or skid chassis engineered for rugged terrain.",
      },
      {
        title: "Rapid Relocation",
        desc: "Easily moved via heavy-duty pickup truck or flatbed transport in crisis scenarios.",
      },
      {
        title: "Off-Grid Autonomous",
        desc: "Equipped for rainwater catchment, composting sanitation, and solar battery storage.",
      },
      {
        title: "Concealed Hardening",
        desc: "Reinforced steel entry doors, heavy-duty window shutters, and ballistic door plates.",
      },
    ],
    displayOrder: 5,
    featuredInNav: true,
  },

  "park-models": {
    id: "park-models",
    label: "Park Models",
    href: "/park-models",
    productType: "Park Models",
    badge: "ANSI A119.5 CERTIFIED",
    headingTitle: "RELOCATABLE STEEL",
    headingHighlight: "PARK MODELS",
    description:
      "Turnkey relocatable resort homes and recreational retreat cabins built to strict recreational park trailer standards with upgraded steel reinforcement.",
    metaTitle: "Steel Park Models & Relocatable Cottages | BombShelters.com",
    metaDescription:
      "Turnkey relocatable steel park models built for seasonal comfort, structural durability, and rapid emergency deployment.",
    keyPoints: [
      {
        title: "Sub-400 Sq Ft Footprint",
        desc: "Complies with ANSI A119.5 recreational park trailer regulations nationwide.",
      },
      {
        title: "Luxury Interior Craftsmanship",
        desc: "Full kitchen appliances, solid surface countertops, and full residential bathrooms.",
      },
      {
        title: "Reinforced Underbelly",
        desc: "Insulated and sealed steel barrier preventing rodent infiltration and freezing.",
      },
      {
        title: "Quick-Disconnect Utilities",
        desc: "Simplified utility connections for rapid seasonal or emergency setup.",
      },
    ],
    displayOrder: 6,
    featuredInNav: true,
  },

  "cabins": {
    id: "cabins",
    label: "Cabins",
    href: "/cabins",
    productType: "Cabins",
    badge: "RUGGED MOUNTAIN PROVEN",
    headingTitle: "FORTIFIED OFF-GRID",
    headingHighlight: "CABINS & RETREATS",
    description:
      "Heavy timber and steel hybrid cabins designed to survive deep wilderness conditions, heavy snowpack, wildfire zones, and extreme isolation.",
    metaTitle: "Fortified Cabins & Off-Grid Bug-Out Retreats | BombShelters.com",
    metaDescription:
      "Engineered off-grid cabins and mountain retreats. Steel-reinforced, wildfire-resistant, and built for true self-sufficiency.",
    keyPoints: [
      {
        title: "Heavy Snow Load Design",
        desc: "Engineered roof trusses capable of handling 80+ PSF extreme alpine snow packs.",
      },
      {
        title: "Ember-Resistant Siding",
        desc: "Steel board-and-batten or fiber cement exterior protecting against wildfire embers.",
      },
      {
        title: "Wood Stove Ready",
        desc: "Pre-installed certified chimney thimbles and non-combustible hearth foundations.",
      },
      {
        title: "Hardened Perimeter",
        desc: "Steel security shutters and deadlock entries for extended unoccupied periods.",
      },
    ],
    displayOrder: 7,
    featuredInNav: true,
  },

  "adus": {
    id: "adus",
    label: "ADUs & Granny Pods",
    href: "/adus",
    productType: "ADUs & Granny Pods",
    badge: "BACKYARD SAFE SUITE",
    headingTitle: "ACCESSORY DWELLING UNITS &",
    headingHighlight: "SAFE ROOMS",
    description:
      "Independent backyard secondary residences combining multi-generational living with FEMA-rated storm protection and ballistic safe room technology.",
    metaTitle: "Steel ADUs, Granny Pods & Safe Suites | BombShelters.com",
    metaDescription:
      "Permitted accessory dwelling units engineered with heavy steel framing. Multi-generational backyard suites with built-in safe rooms.",
    keyPoints: [
      {
        title: "Integrated Panic Room",
        desc: "Reinforced central core room serving as a walk-in closet and emergency shelter.",
      },
      {
        title: "Full Independence",
        desc: "Complete separate electrical subpanel, water heater, HVAC, and sewer tie-ins.",
      },
      {
        title: "Rapid Permitting",
        desc: "Engineered to meet standard state ADU mandates for expedited local approvals.",
      },
      {
        title: "Sound & Security Isolation",
        desc: "Acoustically damped and impact-resistant walls for complete privacy and protection.",
      },
    ],
    displayOrder: 8,
    featuredInNav: true,
  },

  "a-frame-homes": {
    id: "a-frame-homes",
    label: "A-Frames",
    href: "/a-frame-homes",
    productType: "A-Frames",
    badge: "ALL-WEATHER GEOMETRY",
    headingTitle: "ARCHITECTURAL STEEL",
    headingHighlight: "A-FRAME HOMES",
    description:
      "Dramatic triangular geometry engineered with structural steel rafters. Extreme natural shedding of snow, debris, and gale-force wind resistance.",
    metaTitle: "Steel A-Frame Homes & Mountain Cabins | BombShelters.com",
    metaDescription:
      "Iconic modern A-frame homes engineered with commercial structural steel. Natural snow shedding, hurricane resistance, and floor-to-ceiling vistas.",
    keyPoints: [
      {
        title: "Self-Shedding Roofline",
        desc: "60-degree roof pitch prevents snow accumulation and structural overloading.",
      },
      {
        title: "Rigid Ridge Connection",
        desc: "Moment-resisting apex steel plates capable of withstanding violent canyon updrafts.",
      },
      {
        title: "Impact Glass Facade",
        desc: "Commercial curtain-wall glazing rated for missile-impact wind resistance.",
      },
      {
        title: "Loft Living Space",
        desc: "High-volume vaulted ceilings with structural steel mezzanine living lofts.",
      },
    ],
    displayOrder: 9,
    featuredInNav: true,
  },

  "commercial-modular-buildings": {
    id: "commercial-modular-buildings",
    label: "Commercial",
    href: "/commercial-modular-buildings",
    productType: "Commercial Modular Buildings",
    badge: "IBC COMMERCIAL COMPLIANT",
    headingTitle: "COMMERCIAL MODULAR",
    headingHighlight: "BUILDINGS",
    description:
      "Multi-story steel modular structures for corporate offices, tactical operations centers, workforce housing camps, and secure medical facilities.",
    metaTitle: "Commercial Modular Steel Buildings & Tactical Centers | BombShelters.com",
    metaDescription:
      "IBC-compliant commercial modular steel structures. Offices, workforce compounds, operations centers, and secure industrial complexes.",
    keyPoints: [
      {
        title: "IBC Code Compliant",
        desc: "Designed and certified to International Building Code commercial standards.",
      },
      {
        title: "Scalable Stackable Modules",
        desc: "Precision steel frames can be stacked up to 3 stories high or linked horizontally.",
      },
      {
        title: "Data & Comms Hardening",
        desc: "Optional RF shielding / Faraday cage mesh integration for sensitive tactical ops.",
      },
      {
        title: "Accelerated Depreciation",
        desc: "Modular commercial structures qualify for advantageous tax depreciation schedules.",
      },
    ],
    displayOrder: 10,
    featuredInNav: true,
  },
};

/**
 * Array of categories in navigation order
 */
export const CATEGORY_LIST = Object.values(CATALOG_CATEGORIES).sort(
  (a, b) => a.displayOrder - b.displayOrder
);

/**
 * Lookup helper: finds category by route slug or productType
 */
export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  const cleanSlug = slug.replace(/^\//, "");
  return CATALOG_CATEGORIES[cleanSlug];
}

export function getCategoryByProductType(productType: string): CategoryConfig | undefined {
  return CATEGORY_LIST.find(
    (c) => c.productType.toLowerCase() === productType.trim().toLowerCase()
  );
}

/**
 * Items that are excluded from public housing categories
 */
export const EXCLUDED_PRODUCT_TYPES = ["Furniture & Accessories"];

