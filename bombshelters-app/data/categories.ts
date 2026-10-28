export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  tagline: string;
  imageUrl: string;
  link: string;
  badge?: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: "bomb-shelters",
    title: "Bomb Shelters",
    tagline: "Maximum protection for your family.",
    description: "Sub-surface hardened blast and fallout shelters engineered to withstand extreme radiological and military-grade threats.",
    imageUrl: "/images/cat-bomb-shelters.png",
    link: "/models",
    badge: "NBC Rated",
  },
  {
    id: "storm-shelters",
    title: "Storm Shelters",
    tagline: "Severe weather protection when it matters most.",
    description: "FEMA-compliant above and below ground tornado & EF5 severe storm shelters designed for rapid household deployment.",
    imageUrl: "/images/cat-storm-shelters.png",
    link: "/collections/tornado-storm-shelters",
    badge: "FEMA P-320",
  },
  {
    id: "safe-rooms",
    title: "Safe Rooms",
    tagline: "Security at home and beyond.",
    description: "Reinforced residential interior ballistic panic rooms with reinforced steel doors and biometric access control.",
    imageUrl: "/images/cat-safe-rooms.png",
    link: "/adus",
    badge: "Ballistic Level 4",
  },
  {
    id: "luxury-bunkers",
    title: "Luxury Bunkers",
    tagline: "Premium comfort underground.",
    description: "Multi-level subterranean estates with continuous hydroponic systems, autonomous micro-grids, and climate control.",
    imageUrl: "/images/cat-luxury-bunkers.png",
    link: "/collections/luxury-estates",
    badge: "Turnkey Luxury",
  },
  {
    id: "steel-framed-homes",
    title: "Steel Framed Homes",
    tagline: "Modern, strong and affordable.",
    description: "Indestructible cold-formed steel architectural homes engineered against wind, seismic loads, fire, and pests.",
    imageUrl: "/images/cat-steel-framed-homes.png",
    link: "/modular-homes",
    badge: "Class-A Fire",
  },
  {
    id: "cabins",
    title: "Cabins & Retreats",
    tagline: "Timeless design. Modern craftsmanship.",
    description: "Self-sufficient off-grid modular cabins with heavy-gauge steel framing and panoramic reinforced glazing.",
    imageUrl: "/images/cat-cabins.png",
    link: "/cabins",
    badge: "Off-Grid Ready",
  },
];
