export interface ProductModel {
  id: string;
  name: string;
  price: string;
  rawPrice: number;
  badge: {
    text: string;
    color: "green" | "gold" | "blue" | "red" | "purple";
  };
  capacity: string;
  specs: string;
  features: string[];
  imageUrl: string;
  category: string;
  description: string;
}

export const FEATURED_MODELS: ProductModel[] = [
  {
    id: "standard-bomb-shelter",
    name: "Standard Underground Bomb Shelter",
    price: "$49,900",
    rawPrice: 49900,
    badge: {
      text: "BEST SELLER",
      color: "green",
    },
    capacity: "4-8 People",
    specs: "Turnkey Options | NBC Filter",
    features: ["Swiss NBC Air Filtration", "Double Blast Door", "Underground Emergency Escape Hatch", "Solar Battery Backup"],
    imageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80",
    category: "Bomb Shelters",
    description: "Battle-tested structural steel corrugated shelter built for residential backyard installation with turnkey amenities.",
  },
  {
    id: "luxury-underground-bunker",
    name: "Luxury Underground Bunker",
    price: "$199,900",
    rawPrice: 199900,
    badge: {
      text: "LUXURY",
      color: "gold",
    },
    capacity: "4-12 People",
    specs: "Fully Customizable | Multi-Room",
    features: ["Master Bedroom Suite", "Full Kitchen & Bath", "Geothermal HVAC", "Water Filtration & Storage"],
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    category: "Luxury Bunkers",
    description: "The gold standard in subterranean residential living. Uncompromising luxury, security, and independent survival systems.",
  },
  {
    id: "residential-storm-shelter",
    name: "Residential Storm Shelter",
    price: "$12,900",
    rawPrice: 12900,
    badge: {
      text: "POPULAR",
      color: "blue",
    },
    capacity: "2-6 People",
    specs: "Quick Installation | FEMA EF-5",
    features: ["Impact-Tested Steel Core", "Flush Garage Floor Mount", "Dual Hydraulic Assist Latch", "Ventilation Ports"],
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    category: "Storm Shelters",
    description: "Compact in-garage or patio below-ground shelter tested to withstand 250+ mph winds and heavy airborne projectile debris.",
  },
  {
    id: "the-appalachian",
    name: "The Appalachian Steel Framed Home",
    price: "$125,000",
    rawPrice: 125000,
    badge: {
      text: "NEW",
      color: "red",
    },
    capacity: "1,200 Sq. Ft.",
    specs: "2 Bed | 2 Bath (Installed)",
    features: ["Heavy Commercial Grade Steel", "Fire & Termite Immune", "High R-Value Insulation", "Rapid 4-Week Assembly"],
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    category: "Steel Framed Homes",
    description: "Modern, extremely durable cold-formed steel architectural home that will never rot, warp, buckle, or combust.",
  },
  {
    id: "the-gatlinburg-jr",
    name: "The Gatlinburg Jr. Cabin",
    price: "$284,900",
    rawPrice: 284900,
    badge: {
      text: "INVESTOR FAVORITE",
      color: "purple",
    },
    capacity: "1,715 Sq. Ft.",
    specs: "2 Bed 2 Bath + Loft (Turnkey)",
    features: ["Vaulted Steel Ceiling Trusses", "Expansive Covered Porch", "High-Efficiency Thermal Envelope", "Off-Grid Compatibility"],
    imageUrl: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=80",
    category: "Cabins",
    description: "Rugged exterior with warm, high-end interior finishes. Popular as both a private fortified homestead and luxury rental asset.",
  },
  {
    id: "the-sentinel-vault",
    name: "The Sentinel Hardened Safe Room",
    price: "$34,500",
    rawPrice: 34500,
    badge: {
      text: "BEST SELLER",
      color: "green",
    },
    capacity: "2-4 People",
    specs: "Ballistic Level 4 | In-Home",
    features: ["UL 752 Ballistic Armor Plate", "Biometric Vault Lock", "Emergency Oxygen Generator", "Redundant Comms Channel"],
    imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
    category: "Safe Rooms",
    description: "Interior safe sanctuary installed in existing closet or master suite to protect against home invasions and civil disturbances.",
  },
];
