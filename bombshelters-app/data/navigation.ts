export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface MoreMenuOption {
  label: string;
  href: string;
  desc: string;
  iconName: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Modular Homes", href: "/modular-homes" },
  { label: "Prefab Homes", href: "/prefab-homes" },
  { label: "Barndominiums", href: "/barndominiums" },
  { label: "House Kits", href: "/house-kits" },
  { label: "Tiny Homes", href: "/tiny-homes" },
  { label: "Park Models", href: "/park-models" },
  { label: "Cabins", href: "/cabins" },
  { label: "ADUs & Granny Pods", href: "/adus" },
  { label: "A-Frames", href: "/a-frame-homes" },
  { label: "Commercial", href: "/commercial-modular-buildings" },
  { label: "More", href: "#", hasDropdown: true },
];

export const MORE_BUYER_GUIDES: MoreMenuOption[] = [
  {
    label: "Delivery & Crane Setting",
    href: "/delivery",
    desc: "Nationwide freight, cranes & site prep",
    iconName: "Truck",
  },
  {
    label: "Frequently Asked Questions",
    href: "/faqs",
    desc: "Clear answers to top buyer questions",
    iconName: "HelpCircle",
  },
  {
    label: "Pricing & Packages",
    href: "/pricing",
    desc: "Turnkey cost tiers & square foot rates",
    iconName: "DollarSign",
  },
  {
    label: "Financing & Mortgages",
    href: "/financing",
    desc: "Fixed-rate loans & construction lines",
    iconName: "CreditCard",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    desc: "5-step factory build to subterranean set",
    iconName: "Compass",
  },
  {
    label: "Technical Blogs",
    href: "/blogs",
    desc: "Educational guides & blast engineering",
    iconName: "BookOpen",
  },
  {
    label: "Curated Collections",
    href: "/collections",
    desc: "Browse curated bunkers, cabins & safe suites",
    iconName: "FolderOpen",
  },
];

export const MORE_SERVICES_RESOURCES: MoreMenuOption[] = [
  {
    label: "Floor Plan Store",
    href: "/floor-plans",
    desc: "Browse & download construction blueprints",
    iconName: "Layers",
  },
  {
    label: "Upload Floor Plan",
    href: "/upload-floor-plan",
    desc: "Submit sketch or CAD for structural review",
    iconName: "FileText",
  },
  {
    label: "Factory Video Tours",
    href: "/videos",
    desc: "Watch indoor precision build walk-throughs",
    iconName: "Play",
  },
  {
    label: "About BombShelters",
    href: "/about",
    desc: "Our history, blast standards & warranty",
    iconName: "Info",
  },
  {
    label: "Modular Cabins",
    href: "/modular-cabins",
    desc: "Factory-built precision steel & timber cabins",
    iconName: "Home",
  },
  {
    label: "Hardened Storage & Armories",
    href: "/modular-storage",
    desc: "Class-3 fireproof & ballistic secure storage",
    iconName: "Shield",
  },
  {
    label: "Shelters Under $100k",
    href: "/modular-homes-under-100k",
    desc: "Budget-friendly storm & blast safe rooms",
    iconName: "DollarSign",
  },
  {
    label: "Contact & Consultations",
    href: "/contact",
    desc: "Speak with a certified structural advisor",
    iconName: "PhoneCall",
  },
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
