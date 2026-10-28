export interface FloorPlanItem {
  id: string;
  name: string;
  category: string;
  sqft: number;
  dimensions: string;
  occupancy: string;
  rooms: string;
  imageUrl: string;
  desc: string;
  price?: number;
  salePrice?: number;
  blastRating?: string;
  fileFormat?: string;
  status?: string;
}

export const FLOOR_PLANS: FloorPlanItem[] = [
  {
    id: "defiance-bunker-plan",
    name: "The Defiance 10x40 Subterranean Floor Plan",
    category: "Bomb Shelters",
    sqft: 400,
    dimensions: "10' W x 40' L x 8' H",
    occupancy: "6-10 People",
    rooms: "Master Bunkroom, Galley, NBC Vault, Chemical Head",
    imageUrl: "/images/hillside-bunker.png",
    desc: "Single-tube corrugated structural steel shelter with pressurized airlock and concealed secondary escape tunnel.",
    price: 495,
    blastRating: "Overpressure 3.5 Bar (50 PSI)",
    fileFormat: "PDF + CAD (DWG)",
    status: "PUBLISHED",
  },
  {
    id: "bastion-luxury-estate-plan",
    name: "The Bastion 2,400 Sq Ft Subterranean Complex",
    category: "Luxury Bunkers",
    sqft: 2400,
    dimensions: "Multi-Module Interlocking Arcs",
    occupancy: "12-24 People",
    rooms: "3 Private Suites, Commercial Kitchen, Hydroponic Greenhouse, Comms Center",
    imageUrl: "/images/cat-luxury-bunkers.png",
    desc: "High-capacity subterranean multi-module estate engineered for independent multi-year off-grid survival.",
    price: 1450,
    blastRating: "Overpressure 7.0 Bar (100 PSI)",
    fileFormat: "PDF + CAD (DWG) + Revit BIM",
    status: "PUBLISHED",
  },
  {
    id: "sentinel-safe-room-plan",
    name: "The Sentinel 8x12 Interior Panic Room Layout",
    category: "Safe Rooms",
    sqft: 96,
    dimensions: "8' W x 12' L x 9' H",
    occupancy: "4-6 People",
    rooms: "Ballistic Sanctuary, Secure Weapons Vault, Emergency Oxygen Bay",
    imageUrl: "/images/cat-safe-rooms.png",
    desc: "Reinforced residential interior ballistic panic room with emergency egress and hidden biometric vault door.",
    price: 350,
    blastRating: "UL-752 Level 8 Ballistic",
    fileFormat: "PDF + CAD (DWG)",
    status: "PUBLISHED",
  },
  {
    id: "appalachian-steel-home-plan",
    name: "The Appalachian 1,200 Sq Ft Steel Home Layout",
    category: "Steel Framed Homes",
    sqft: 1200,
    dimensions: "30' W x 40' L x 16' Ridge",
    occupancy: "Family Living (2 Bed | 2 Bath)",
    rooms: "Open Living/Dining, Primary Suite, Guest Room, Fortified Utility Room",
    imageUrl: "/images/cat-steel-framed-homes.png",
    desc: "Indestructible cold-formed steel architectural home engineered against severe wind, wildfire, and seismic loads.",
    price: 695,
    blastRating: "180 MPH Hurricane Rated",
    fileFormat: "PDF + CAD (DWG)",
    status: "PUBLISHED",
  },
  {
    id: "iron-ridge-barndo-plan",
    name: "The Iron Ridge 40x50 Steel Barndominium Plan",
    category: "Barndominiums",
    sqft: 2000,
    dimensions: "40' W x 50' L x 18' Eave",
    occupancy: "Estate (3 Bed | 2.5 Bath + Shop)",
    rooms: "Great Room, 2-Story Loft, Master Wing, Integrated In-Slab Tornado Vault",
    imageUrl: "/images/cat-steel-framed-homes.png",
    desc: "Rigid commercial steel framing with massive open floor space and integrated below-ground storm shelter.",
    price: 850,
    blastRating: "EF5 Tornado Rated Safe Core",
    fileFormat: "PDF + CAD (DWG)",
    status: "PUBLISHED",
  },
  {
    id: "gatlinburg-cabin-plan",
    name: "The Gatlinburg 1,715 Sq Ft Hybrid Cabin Plan",
    category: "Cabins",
    sqft: 1715,
    dimensions: "34' W x 42' L + Wrap Porch",
    occupancy: "Homestead / Vacation",
    rooms: "Vaulted Great Room, Chef Kitchen, 2 Suites, Sleeping Loft",
    imageUrl: "/images/cat-cabins.png",
    desc: "Rustic timber exterior cladding over a heavy-gauge structural steel skeleton for supreme longevity.",
    price: 795,
    blastRating: "Zone 4 Seismic Rated",
    fileFormat: "PDF + CAD (DWG)",
    status: "PUBLISHED",
  },
];

