export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Bunkers", href: "#featured-models", hasDropdown: true },
  { label: "Storm Shelters", href: "#featured-models", hasDropdown: true },
  { label: "Steel Framed Homes", href: "#featured-models", hasDropdown: true },
  { label: "Cabins", href: "#featured-models", hasDropdown: true },
  { label: "House Kits", href: "#featured-models", hasDropdown: false },
  { label: "Financing", href: "#financing", hasDropdown: false },
  { label: "Custom Solutions", href: "#financing", hasDropdown: true },
  { label: "About", href: "#why-choose", hasDropdown: true },
];

export const TRUST_BADGES_TOP = [
  "Nationwide Delivery",
  "Custom Solutions",
  "Expert Support",
  "Made in USA",
];

export const TRUST_STRIP_ITEMS = [
  {
    icon: "ShieldCheck",
    title: "American-Made Options",
    desc: "Manufactured with certified domestic structural steel",
  },
  {
    icon: "Building2",
    title: "Vetted Manufacturers",
    desc: "Exclusively certified fabricators with proven blast testing",
  },
  {
    icon: "Truck",
    title: "Nationwide Delivery & Installation",
    desc: "Direct-to-site freight and professional excavation networks",
  },
  {
    icon: "Wrench",
    title: "Custom Builds & Designs",
    desc: "Tailored to your specific soil, threat matrix, and family size",
  },
  {
    icon: "BadgeDollarSign",
    title: "Financing Available",
    desc: "Multiple lending partners with low fixed-rate plans",
  },
  {
    icon: "Headset",
    title: "Expert Support & Consultation",
    desc: "Decades of engineering and emergency management experience",
  },
];

export const WHY_CHOOSE_ITEMS = [
  {
    title: "Compare Models",
    desc: "Side-by-side engineering specifications and turnkey price transparency.",
    icon: "Scale",
  },
  {
    title: "Direct Pricing",
    desc: "Transparent manufacturer rates with zero middleman markup.",
    icon: "CircleDollarSign",
  },
  {
    title: "Custom Options",
    desc: "Modular expansion packs, NBC filtration upgrades, and solar arrays.",
    icon: "Sliders",
  },
  {
    title: "Financing Help",
    desc: "Fast pre-approvals and terms structured to match your monthly budget.",
    icon: "CreditCard",
  },
  {
    title: "Expert Guidance",
    desc: "One-on-one consultation with certified structural & defense engineers.",
    icon: "Compass",
  },
  {
    title: "Nationwide Network",
    desc: "Over 200 vetted certified excavation and rigging crews across all 50 states.",
    icon: "MapPin",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Browse Models",
    desc: "Explore blast-rated bomb shelters, safe rooms, and resilient steel cabins built to withstand any emergency.",
  },
  {
    step: 2,
    title: "Customize Your Build",
    desc: "Select dimensions, air filtration, solar microgrid capacity, plumbing, and interior finish packages.",
  },
  {
    step: 3,
    title: "Get a Quote",
    desc: "Receive an itemized, transparent estimate including engineering stamps, freight delivery, and installation.",
  },
  {
    step: 4,
    title: "Delivery & Installation",
    desc: "Our nationwide excavation and crane partners deliver and secure your bunker directly onto your property.",
  },
];

export const TRUSTED_MANUFACTURERS = [
  "Fortress Built",
  "Liberty Shield Systems",
  "Iron Ridge Shelters",
  "Patriot Underground",
  "Steadfast Bunkers",
  "Summit Safe Rooms",
];
