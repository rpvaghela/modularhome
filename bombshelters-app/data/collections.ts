export interface CollectionItem {
  slug: string;
  name: string;
  badge: string;
  modelCount: string;
  imageUrl: string;
  description: string;
}

export const COLLECTIONS: CollectionItem[] = [
  {
    slug: "underground-bunkers",
    name: "Subterranean Blast Bunkers",
    badge: "NBC CERTIFIED",
    modelCount: "8 Models",
    imageUrl: "/images/hillside-bunker.png",
    description: "Battle-tested corrugated structural steel shelters engineered for deep subterranean burial, radiation attenuation, and nuclear/chemical defense.",
  },
  {
    slug: "luxury-estates",
    name: "Luxury Subterranean Estates",
    badge: "MULTI-MODULE",
    modelCount: "5 Models",
    imageUrl: "/images/cat-luxury-bunkers.png",
    description: "Uncompromising multi-room underground complexes with gourmet kitchens, autonomous hydroponics, geothermal HVAC, and executive living suites.",
  },
  {
    slug: "tornado-storm-shelters",
    name: "EF5 Tornado & Severe Storm Shelters",
    badge: "FEMA P-320",
    modelCount: "6 Models",
    imageUrl: "/images/cat-storm-shelters.png",
    description: "FEMA-compliant above and below ground tornado shelters designed for rapid household ingress and 250+ MPH projectile deflection.",
  },
  {
    slug: "off-grid-cabins",
    name: "Fortified Off-Grid Cabins",
    badge: "SELF-SUFFICIENT",
    modelCount: "7 Models",
    imageUrl: "/images/cat-cabins.png",
    description: "Rugged structural steel cabins engineered with heavy snow load ratings, solar microgrids, and wood-burning stove integration.",
  },
  {
    slug: "under-100k",
    name: "Affordable Shelters Under $100k",
    badge: "VALUE TIER",
    modelCount: "6 Models",
    imageUrl: "/images/cat-bomb-shelters.png",
    description: "High-value, turnkey storm and blast shelters delivering certified structural protection starting under $20,000.",
  },
  {
    slug: "ballistic-safe-rooms",
    name: "Interior Ballistic Panic Rooms",
    badge: "LEVEL 4 ARMOR",
    modelCount: "4 Models",
    imageUrl: "/images/cat-safe-rooms.png",
    description: "Reinforced residential interior panic rooms with biometric access control, emergency oxygen scrubbers, and independent comms.",
  },
];

