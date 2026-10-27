export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  badge?: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: "bomb-shelters",
    title: "Bomb Shelters",
    description: "Sub-surface hardened blast and fallout shelters engineered to withstand extreme radiological and military-grade threats.",
    imageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80",
    link: "#featured-models",
    badge: "NBC Rated",
  },
  {
    id: "storm-shelters",
    title: "Storm Shelters",
    description: "FEMA-compliant above and below ground tornado & EF5 severe storm shelters designed for rapid household deployment.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    link: "#featured-models",
    badge: "FEMA P-320",
  },
  {
    id: "safe-rooms",
    title: "Safe Rooms",
    description: "Reinforced residential interior ballistic panic rooms with reinforced steel doors and biometric access control.",
    imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
    link: "#featured-models",
    badge: "Ballistic Level 4",
  },
  {
    id: "luxury-bunkers",
    title: "Luxury Bunkers",
    description: "Multi-level subterranean estates with continuous hydroponic systems, autonomous micro-grids, and climate control.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    link: "#featured-models",
    badge: "Turnkey Luxury",
  },
  {
    id: "steel-framed-homes",
    title: "Steel Framed Homes",
    description: "Indestructible cold-formed steel architectural homes engineered against wind, seismic loads, fire, and pests.",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    link: "#featured-models",
    badge: "Class-A Fire",
  },
  {
    id: "cabins",
    title: "Cabins & Retreats",
    description: "Self-sufficient off-grid modular cabins with heavy-gauge steel framing and panoramic reinforced glazing.",
    imageUrl: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=80",
    link: "#featured-models",
    badge: "Off-Grid Ready",
  },
];
