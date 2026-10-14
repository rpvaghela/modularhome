export interface BuildingModelVariant {
  id: string;
  title: string;
  price: number;
  sku?: string;
  available?: boolean;
  option1?: string;
  option2?: string;
  compareAtPrice?: number;
}

export interface BuildingModel {
  id: string;
  slug: string;
  name: string;
  series: string;
  category: string;
  architecturalStyle?: string;
  tagline: string;
  description: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  stories: number;
  startingPrice: number;
  dimensions: string;
  frameType: string;
  roofPitch: string;
  windRating: string;
  snowLoad: string;
  warranty: string;
  primaryImage: string;
  image?: string;
  gallery: string[];
  floorPlanImage: string;
  floorPlan?: string;
  videoDuration?: string;
  videoTitle?: string;
  video?: string;
  videoUrl?: string;
  features: string[];
  specs: {
    label: string;
    value: string;
  }[];
  customizableOptions: {
    id: string;
    name: string;
    price: number;
    description: string;
  }[];
  variants?: BuildingModelVariant[];
  tags?: string[];
  collections?: string[];
  status?: string;
}

export const CATEGORIES = [
  {
    id: "Modular Homes",
    title: "Modular Homes",
    tagline: "Factory-built homes designed for permanent installation.",
    description: "Modern construction, customizable layouts, and efficient building processes.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    count: 0,
    href: "/modular-homes",
    cta: "View Modular Homes",
  },
  {
    id: "Prefab Homes",
    title: "Prefab Homes",
    tagline: "Professionally manufactured modern homes.",
    description: "Engineered in climate-controlled facilities for precision quality and rapid site assembly.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098",
    count: 0,
    href: "/prefab-homes",
    cta: "View Prefab Homes",
  },
  {
    id: "Barndominiums",
    title: "Barndominiums",
    tagline: "Modern barn-style living with open spaces.",
    description: "Combining residential comfort with massive open floor plans and rigid steel structure options.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/BM3945-front_1.png?v=1750743065",
    count: 0,
    href: "/barndominiums",
    cta: "View Barndominiums",
  },
  {
    id: "House Kits",
    title: "House Kits",
    tagline: "Ready-to-build housing packages.",
    description: "Pre-engineered structural components and detailed blueprints for efficient home building.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/m1_ce95e0cb-7b02-4d09-b913-1fc48d1b48f1.jpg?v=1774680383",
    count: 0,
    href: "/house-kits",
    cta: "View House Kits",
  },
  {
    id: "Tiny Homes",
    title: "Tiny Homes",
    tagline: "Compact, efficient homes for flexible living.",
    description: "Smart floor plans maximizing space, energy efficiency, and modern comfort.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418",
    count: 0,
    href: "/tiny-homes",
    cta: "View Tiny Homes",
  },
  {
    id: "Park Models",
    title: "Park Models",
    tagline: "Resort-grade RV & park model modular homes.",
    description: "Architectural park model homes designed for seasonal, recreational, or resort living communities.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/aspen2.avif?v=1783816889",
    count: 0,
    href: "/park-models",
    cta: "View Park Models",
  },
  {
    id: "Cabins",
    title: "Cabins",
    tagline: "Rustic, modern, and mountain-style log cabins.",
    description: "Handcrafted timber and cabin structures suitable for residential, vacation, or retreat use.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    count: 0,
    href: "/cabins",
    cta: "View Cabins",
  },
  {
    id: "Modular Cabins",
    title: "Modular Cabins",
    tagline: "Factory-built precision prefab & modular log cabins.",
    description: "High-performance modular cabins and turnkey prefab log retreats engineered for mountain, lake, or rural living.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    count: 0,
    href: "/modular-cabins",
    cta: "View Modular Cabins",
  },
  {
    id: "ADUs & Granny Pods",
    title: "ADUs & Granny Pods",
    tagline: "Additional dwelling units for family or income.",
    description: "Independent living units perfect for guest suites, rental income, offices, or private living.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308",
    count: 0,
    href: "/adus",
    cta: "View ADUs",
  },
  {
    id: "A-Frame Homes",
    title: "A-Frame Homes",
    tagline: "Iconic steep-pitch architectural homes with panoramic glass.",
    description: "High-performance A-frame structural packages engineered for heavy snow loads and mountain views.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284",
    count: 0,
    href: "/a-frame-homes",
    cta: "View A-Frames",
  },
  {
    id: "Commercial Modular Buildings",
    title: "Commercial Modular Buildings",
    tagline: "Modular solutions for commercial applications.",
    description: "Durable modular structures for offices, retail, hospitality, community spaces, and business use.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/442435176_1117036319546606_7478160302982824370_n_2a3e20a5-fc3f-46af-9aa2-8da3022fbe87.jpg?v=1736129729",
    count: 0,
    href: "/commercial-modular-buildings",
    cta: "View Commercial",
  },
  {
    id: "Custom Homes",
    title: "Custom Homes",
    tagline: "Bespoke modular homes tailored to your vision.",
    description: "Custom-designed modular solutions engineered based on customer requirements, land, and budget.",
    image: "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cross.jpg?v=1735268780",
    count: 0,
    href: "/custom-homes",
    cta: "Explore Custom Homes",
  },
];

export const BUILDING_MODELS: BuildingModel[] = [
  {
    "id": "mod-craftsman-residence",
    "slug": "the-modern-craftsman-modular-residence",
    "name": "The Modern Craftsman Modular Residence",
    "series": "Residential Series",
    "category": "Modular Homes",
    "architecturalStyle": "Modern Craftsman",
    "tagline": "2,150 SQ FT • 3 Bed 2.5 Bath Precision Factory Modular Home",
    "description": "<p><strong>The Modern Craftsman Modular Residence</strong> combines timeless architectural proportion with modern precision factory engineering. Featuring 2,150 sq ft of open-concept living, a chef's kitchen with quartz surfaces, high vaulted ceilings, and a private master retreat with walk-in dressing suite.</p>",
    "sqft": 2150,
    "bedrooms": 3,
    "bathrooms": 2.5,
    "stories": 1,
    "startingPrice": 249900,
    "dimensions": "32x68 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "6:12 Pitch Architectural Standing Seam",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545"
    ],
    "floorPlanImage": "",
    "features": [
      "Precision Commercial-Grade Galvanized Steel Framing",
      "High-R Structural Insulated Panels (SIPs) for Low Utility Costs",
      "Expansive Great Room with 10ft Vaulted Ceilings",
      "Turnkey Factory-Built Modules Delivered Nationwide"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "2,150 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "3 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2.5 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Galvanized Precision Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Wrap-Around Porch",
        "price": 14500,
        "description": "Composite decking & architectural posts"
      },
      {
        "id": "opt-2",
        "name": "Solar Ready Energy Package",
        "price": 8500,
        "description": "Pre-wired for roof solar & battery backup"
      }
    ],
    "tags": [
      "Featured",
      "Modular",
      "Turnkey"
    ],
    "collections": [
      "Modular Homes",
      "modular-homes"
    ]
  },
  {
    "id": "mod-farmhouse-charm",
    "slug": "the-farmhouse-charm-modular-home",
    "name": "The Farmhouse Charm Modular Home",
    "series": "Residential Series",
    "category": "Modular Homes",
    "architecturalStyle": "Modern Farmhouse",
    "tagline": "1,160 SQ FT • 2 Bed 2 Bath Turnkey Modular Home",
    "description": "<p><strong>The Farmhouse Charm Modular Home</strong> offers elegant single-story living with classic board-and-batten siding, large black-frame windows, and open kitchen and living spaces.</p>",
    "sqft": 1160,
    "bedrooms": 2,
    "bathrooms": 2,
    "stories": 1,
    "startingPrice": 219900,
    "dimensions": "28x42 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "5:12 Pitch Standing Seam",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098"
    ],
    "floorPlanImage": "",
    "features": [
      "Board and Batten Architectural Facade",
      "Energy-Efficient High-R Thermal Envelope",
      "Split Bedroom Layout with Private Master En-Suite",
      "Factory-Built Turnkey Precision Construction"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1,160 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Front Veranda",
        "price": 9500,
        "description": "Covered entryway porch"
      }
    ],
    "tags": [
      "Featured",
      "Modular",
      "Turnkey"
    ],
    "collections": [
      "Modular Homes",
      "modular-homes"
    ]
  },
  {
    "id": "mod-aspen-ridge",
    "slug": "the-aspen-ridge-luxury-modular-home",
    "name": "The Aspen Ridge Luxury Modular Home",
    "series": "Luxury Series",
    "category": "Modular Homes",
    "architecturalStyle": "Contemporary Luxury",
    "tagline": "2,850 SQ FT • 4 Bed 3.5 Bath Contemporary Modular Home",
    "description": "<p><strong>The Aspen Ridge Luxury Modular Home</strong> represents the pinnacle of modern prefabricated architecture. Massive multi-slide glass walls, dual primary suites, and dedicated office and entertainment rooms.</p>",
    "sqft": 2850,
    "bedrooms": 4,
    "bathrooms": 3.5,
    "stories": 2,
    "startingPrice": 319900,
    "dimensions": "36x70 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "Architectural Multi-Pitch",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "60 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cross.jpg?v=1735268780",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cross.jpg?v=1735268780",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cross.jpg?v=1735268780"
    ],
    "floorPlanImage": "",
    "features": [
      "Floor-to-Ceiling Argon Low-E Architectural Glass",
      "Two-Story Double-Volume Great Room",
      "Dual Master Suites on Main and Upper Levels",
      "Commercial-Grade Steel Modular Core"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "2,850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "4 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "3.5 Bath"
      },
      {
        "label": "Stories",
        "value": "2 Level"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Balcony Glass Railing Package",
        "price": 11500,
        "description": "Tempered glass balcony railings"
      }
    ],
    "tags": [
      "Featured",
      "Modular",
      "Turnkey"
    ],
    "collections": [
      "Modular Homes",
      "modular-homes"
    ]
  },
  {
    "id": "mod-prairie-modern",
    "slug": "the-prairie-modern-modular-residence",
    "name": "The Prairie Modern Modular Residence",
    "series": "Residential Series",
    "category": "Modular Homes",
    "architecturalStyle": "Modern Prairie",
    "tagline": "2,200 SQ FT • 3 Bed 2.5 Bath Single-Level Modular Home",
    "description": "<p><strong>The Prairie Modern Modular Residence</strong> features clean horizontal sightlines, deep roof overhangs, and expansive split-bedroom living engineered for year-round thermal comfort.</p>",
    "sqft": 2200,
    "bedrooms": 3,
    "bathrooms": 2.5,
    "stories": 1,
    "startingPrice": 289900,
    "dimensions": "34x66 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "3:12 Low-Pitch Modern",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545"
    ],
    "floorPlanImage": "",
    "features": [
      "Single-Level Accessible Universal Design",
      "Continuous High-R Thermal Break Envelope",
      "Large Kitchen Island & Walk-In Pantry",
      "Engineered Structural Steel Frame"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "2,200 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "3 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2.5 Bath"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular",
      "Turnkey"
    ],
    "collections": [
      "Modular Homes",
      "modular-homes"
    ]
  },
  {
    "id": "mod-grandview-estate",
    "slug": "the-grandview-two-story-modular-estate",
    "name": "The Grandview Two-Story Barndominium Kit",
    "series": "Barndominium Series",
    "category": "Barndominiums",
    "architecturalStyle": "Two-Story Barndominium Kit",
    "tagline": "3,200 SQ FT • 5 Bed 4 Bath Two-Story Barndominium Kit",
    "description": "<p><strong>The Grandview Two-Story Barndominium Kit</strong> provides abundant space with rugged steel post-frame durability for growing families, offering 5 bedrooms, 4 bathrooms, dedicated bonus room, and formal dining.</p>",
    "sqft": 3200,
    "bedrooms": 5,
    "bathrooms": 4,
    "stories": 2,
    "startingPrice": 349900,
    "dimensions": "40x48 ft Two-Story",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "7:12 Architectural Pitch",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/BM2334-FRONT.jpg?v=1752962746",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/BM2334-FRONT.jpg?v=1752962746",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/BM2334-FRONT.jpg?v=1752962746"
    ],
    "floorPlanImage": "",
    "features": [
      "Two-Story Precision Barndominium Kit Engineering",
      "5 Generous Bedrooms with Dedicated Upper Media Suite",
      "Heavy-Gauge Galvanized Steel Floor & Roof Trusses",
      "Turnkey Factory-Built Crane Set Installation"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "3,200 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "5 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "4 Bath"
      },
      {
        "label": "Stories",
        "value": "2 Level"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Barndominium",
      "Barndominium Kit",
      "House Kits",
      "Turnkey"
    ],
    "collections": [
      "Barndominiums",
      "barndominiums",
      "house-kits"
    ]
  },
  {
    "id": "mod-cascade-valley",
    "slug": "the-cascade-valley-modular-home",
    "name": "The Cascade Valley Modular Home",
    "series": "Residential Series",
    "category": "Modular Homes",
    "architecturalStyle": "Modern Homes",
    "tagline": "2,400 SQ FT • 4 Bed 3 Bath Modular Home",
    "description": "<p><strong>The Cascade Valley Modular Home</strong> is a spacious 4-bedroom residence designed with large gathering spaces, high energy efficiency, and low-maintenance exterior finishes.</p>",
    "sqft": 2400,
    "bedrooms": 4,
    "bathrooms": 3,
    "stories": 1,
    "startingPrice": 269900,
    "dimensions": "34x72 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "5:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691"
    ],
    "floorPlanImage": "",
    "features": [
      "4 Bedroom Split Floor Plan with Private Master Wing",
      "Airtight High-R SIP Panel & Steel Construction",
      "Large Covered Back Patio Access",
      "Turnkey Factory Built Delivery"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "2,400 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "4 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "3 Bath"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular",
      "Turnkey"
    ],
    "collections": [
      "Modular Homes",
      "modular-homes"
    ]
  },
  {
    "id": "9786090357052",
    "slug": "hummingbird-hollow-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Hummingbird Hollow – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "680 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Hummingbird Hollow House Kit – Affordable 680 Sq Ft Bungalow Home Plan</strong></h3>\n<p>The <strong>Hummingbird Hollow House Kit</strong> is a cozy 1-story bungalow offering <strong>680 sq ft of well-designed living space</strong>. With 1 bedroom and 1 bathroom, it features a <strong>clean and functional floor plan</strong>, perfect as a starter home, vacation retreat, or second dwelling. Its panelized construction allows for efficient, cost-effective assembly, reducing build time by up to 60% compared to traditional methods.</p>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>\n<strong>What’s Included</strong>: Pre-cut floor trusses, panelized walls, roof trusses, windows, exterior finishes, shingles, insulation, drywall, and delivery.</li>\n<li>\n<strong>Customizable Floor Plans</strong>: Modify the layout to suit your personal needs and preferences.</li>\n<li>\n<strong>Built to Last</strong>: Engineered to meet local codes for wind, snow, and hurricane resistance.</li>\n</ul>\n<h4><strong>Affordable and Flexible Options</strong></h4>\n<p>The Hummingbird Hollow kit is perfect for DIY builders or contractors. Need assistance? We can connect you with a local builder once you become our customer. Additionally, <strong>turnkey build services</strong> are available in select states—reach out for details!</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Due to high demand, the current turnaround time is <strong>14 to 16 weeks</strong> from order to delivery. For questions, call us at <strong>502-298-8946</strong> or fill out our contact form, and we’ll respond within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Expansive Selection of Home Plans</strong></h4>\n<p>Discover our wide array of <strong>home plans</strong>, ranging from cozy cabins and tiny homes to larger layouts up to <strong>4,750 sq ft</strong>. Find the ideal house plan to bring your dream home to life today!</p>\n<h3><strong><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/_ZXPTIJDEP0?si=QrO1_KUbNBQR5_Dq\" title=\"YouTube video player\"></iframe></strong></h3>",
    "sqft": 680,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 74800,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/yellowstone_1.jpg?v=1732331743",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/yellowstone_1.jpg?v=1732331743",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/yellowstone_1.jpg?v=1732331743"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/yellowstone_1.jpg?v=1732331743",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "680 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9786184499516",
    "slug": "14-by-36-driftwood-modern-cabin-house-shell",
    "name": "Driftwood Modern Cabin (14 by 36)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>14x36 Driftwood Modern Cabin - Priced below for DIY shell price and fully turnkey price!</strong></p>\n<p>If you're a DIY enthusiast ready to customize your own dream home, or if you'd prefer to leave the finishing touches to us, our Amish-built house shells are the perfect foundation for your project. The Driftwood Modern Cabin is a 14x36 shell that comes fully completed on the outside with all doors and double-pane windows already installed and is dried-in for security and weatherproofing.</p>\n<p>The exterior is built to last with a durable 26-gauge metal roof, and you can choose from a variety of beautiful finishes, including cedar log siding, board and batten, or hardy board. This solid, Amish-built shell serves as the perfect base for a cabin that you can either finish yourself or allow us to handle all the details.</p>\n<p>We offer a full range of finishing options, including spray foam insulation, electrical, plumbing, HVAC, luxury vinyl plank flooring, shiplap walls and ceilings, all bathroom fixtures, kitchen cabinets, and everything needed for a complete, turn-key home.</p>\n<p>Contact us for pricing and more details on how we can help turn this house shell into your perfect home. Call us today at 502-298-8946 to discuss your options—our current turnaround time is approximately 14–16 weeks due to high demand. Let’s bring your vision to life!</p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 24900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow5.jpg?v=1732340600",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow5.jpg?v=1732340600",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow5.jpg?v=1732340600"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow5.jpg?v=1732340600",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "cabins",
      "modular-cabins",
      "turnkey-cabins"
    ]
  },
  {
    "id": "9786185056572",
    "slug": "14-by-52-sunnyside-modern-cabin-house-shell",
    "name": "Sunnyside Modern Cabin",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>14x52 Sunnyside Modern Cabin</strong></p>\n<p>The 14x52 Sunnyside Modern Cabin House Shell is the perfect base for your dream home or getaway. This Amish-built shell comes fully constructed on the exterior, with all doors and double-pane windows already installed and dried-in for weatherproofing and security. The exterior features a durable 26-gauge metal roof, and you can choose from a variety of attractive finishes, such as cedar log siding, board and batten, or hardy board, to suit your style.</p>\n<p>Inside, the shell is ready for you to customize with your personal touch, or we can complete the project for you with our finishing services. Choose from a range of options including spray foam insulation, electrical, plumbing, HVAC, luxury vinyl plank flooring, shiplap walls and ceilings, kitchen cabinets, bathroom fixtures, and more—all the essentials for a turn-key home.</p>\n<p><em><strong>ALSO OFFERED FULLY TURNKEY AS A 2 BED 1 BATH AND 2 BED 2 BATH, SEE BELOW FOR TURNKEY PRICING!</strong></em></p>\n<p>Contact us today for pricing and to discuss how we can bring your vision to life. Call us at 502-298-8946. With a current turnaround time of approximately 14–16 weeks due to high demand, we are ready to help you turn this house shell into your perfect modern cabin.</p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 36900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow8.jpg?v=1732341147",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow8.jpg?v=1732341147",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow8.jpg?v=1732341147"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow8.jpg?v=1732341147",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "cabins",
      "modular-cabins",
      "turnkey-cabins"
    ]
  },
  {
    "id": "9786187088188",
    "slug": "14-by-40-azteca-modern-cabin",
    "name": "Azteca Modern Cabin (14 by 40)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "560 Sq Ft Amish-Built Cabin • Shell & Turnkey Options",
    "description": "<p><strong>14x40 Azteca Modern Cabin</strong></p>\n<p>Introducing the 14x40 Azteca Modern Cabin House Shell—an elegant and versatile home shell designed to combine style and functionality. This Amish-built cabin shell features a sturdy, weather-resistant 26-gauge metal roof and is completed on the outside, with all doors and double-pane windows already installed, ensuring your home is secure and ready for the next steps.</p>\n<p>Choose from multiple exterior finish options, including cedar log siding, board and batten, or hardy board, each offering its own unique charm and durability. The Azteca Modern Cabin shell offers a blank canvas inside, giving you the flexibility to design the interior to your liking. Alternatively, we can take care of the finishing touches for you, including spray foam insulation, electrical, plumbing, HVAC, luxury vinyl plank flooring, shiplap walls and ceilings, kitchen cabinets, and bathroom fixtures, transforming your cabin into a beautiful, move-in ready home.</p>\n<p><em><strong>ALSO OFFERED FULLY TURNKEY MOVE IN READY AS A 2 BED 1 BATH AND 2 BED 2 BATH, SEE PRICING OPTIONS BELOW FOR ALL 3 OPTIONS!</strong></em></p>\n<p>Contact us today for pricing and to discuss how we can help bring your dream cabin to life. With a turnaround time of 14–16 weeks, our team is eager to help you create the perfect home from the Azteca Modern Cabin House Shell.</p>",
    "sqft": 560,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 33900,
    "dimensions": "14x40 ft",
    "frameType": "Amish-Crafted Heavy Timber & Solid Wood System",
    "roofPitch": "4:12 Pitch 26-Gauge Metal Roofing",
    "windRating": "130+ MPH (Engineered Timber Construction)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "25-Year Amish Craftsmanship Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345"
    ],
    "floorPlanImage": "",
    "features": [
      "Amish-Built Solid Timber & Weather-Resistant 26-Gauge Metal Roof",
      "Exterior Fully Finished with Installed Double-Pane Windows & Doors",
      "Available as Pre-Built Shell or Full Turnkey Move-In Ready",
      "Choice of Cedar Log Siding, Board & Batten, or Hardy Board Exterior"
    ],
    "specs": [
      {
        "label": "Dimensions",
        "value": "14×40 ft"
      },
      {
        "label": "Living Area",
        "value": "560 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1-2 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Heavy Timber & Solid Wood Joinery"
      },
      {
        "label": "Roofing",
        "value": "26-Gauge Heavy Duty Metal Roof"
      },
      {
        "label": "Warranty",
        "value": "25-Year Amish Craftsmanship Warranty"
      }
    ],
    "variants": [
      {
        "id": "azteca-shell",
        "title": "14x40 Cabin Shell (Exterior Finished, Windows & Doors)",
        "price": 33900,
        "available": true
      },
      {
        "id": "azteca-2b1b-turnkey",
        "title": "2 Bed 1 Bath Move-In Ready Turnkey",
        "price": 120000,
        "available": true
      },
      {
        "id": "azteca-2b2b-turnkey",
        "title": "2 Bed 2 Bath Move-In Ready Turnkey",
        "price": 135000,
        "available": true
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Porch Addition",
        "price": 12500,
        "description": "Solid timber posts & decking"
      },
      {
        "id": "opt-2",
        "name": "Extreme Climate Closed-Cell Spray Foam",
        "price": 4800,
        "description": "R-21+ continuous thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Cabin",
      "Turnkey",
      "Shell Available"
    ],
    "collections": [
      "Cabins",
      "cabins-for-sale",
      "modular-homes"
    ]
  },
  {
    "id": "country-rancher-cabin",
    "slug": "the-country-rancher-amish-built-modular-cabin",
    "name": "The Country Rancher Amish Built Modular Cabin",
    "series": "Ranch Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "1,144 Sq Ft Living Space • 360 Sq Ft Porch (1,504 Sq Ft Total)",
    "description": "<p><strong>The Country Rancher Amish Built Modular Cabin</strong></p>\n<p>The Country Rancher offers 1,144 sq ft of interior living space plus an expansive 360 sq ft covered porch for a total footprint of 1,504 sq ft. Built with Amish timber craftsmanship, this home features 3 bedrooms, 2 full bathrooms, high vaulted ceilings, and options for both pre-built shell and complete turnkey delivery.</p>",
    "sqft": 1144,
    "bedrooms": 3,
    "bathrooms": 2,
    "stories": 1,
    "startingPrice": 79000,
    "dimensions": "28x48 ft + 8x45 ft Porch",
    "frameType": "Amish Handcrafted Timber & Solid Log System",
    "roofPitch": "5:12 Pitch Architectural Metal Roof",
    "windRating": "130+ MPH Wind Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "25-Year Structural Integrity Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345"
    ],
    "floorPlanImage": "",
    "features": [
      "1,144 SQ FT Heated Living Space + 360 SQ FT Covered Porch",
      "Master Suite with En-Suite Bath and Walk-In Closet",
      "Open Concept Great Room with Vaulted Tongue-and-Groove Ceilings",
      "Amish-Built Solid Wood Construction & Energy-Efficient Envelope"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1,144 SQ FT"
      },
      {
        "label": "Covered Porch",
        "value": "360 SQ FT"
      },
      {
        "label": "Total Footprint",
        "value": "1,504 SQ FT"
      },
      {
        "label": "Dimensions",
        "value": "28×48 ft (+ 8×45 ft Porch)"
      },
      {
        "label": "Bedrooms",
        "value": "3 Bed (1, 2 & 3 Bed Options)"
      },
      {
        "label": "Bathrooms",
        "value": "2 Bath"
      },
      {
        "label": "Stories",
        "value": "1 Level Ranch"
      },
      {
        "label": "Warranty",
        "value": "25-Year Structural Integrity Warranty"
      }
    ],
    "variants": [
      {
        "id": "rancher-1bed",
        "title": "1 Bed 1 Bath Configuration",
        "price": 79000,
        "available": true
      },
      {
        "id": "rancher-2bed",
        "title": "2 Bed 1 Bath Configuration",
        "price": 89000,
        "available": true
      },
      {
        "id": "rancher-3bed2bath-shell",
        "title": "3 Bed 2 Bath Pre-Built Shell",
        "price": 98000,
        "available": true
      },
      {
        "id": "rancher-3bed2bath-turnkey",
        "title": "3 Bed 2 Bath Turnkey Move-In Ready",
        "price": 165000,
        "available": true
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-ranch-kitchen",
        "name": "Amish Custom Hickory Kitchen Cabinets",
        "price": 14500,
        "description": "Solid hickory soft-close cabinetry with quartz countertops"
      },
      {
        "id": "opt-ranch-fireplace",
        "name": "Stone Hearth Fireplace with Timber Mantel",
        "price": 8900,
        "description": "Propane or wood-burning stone fireplace installation"
      }
    ],
    "tags": [
      "Featured",
      "Cabin",
      "Ranch",
      "Turnkey"
    ],
    "collections": [
"Cabins",
      "cabins-for-sale",
      "modular-homes",
      "amish-built-modular-cabins",
      "prefab-homes"
    ]
  },
  {
    "id": "9786190528828",
    "slug": "14-by-52-sunnyside-modern-cabin-house-shell-copy",
    "name": "Rustic Maven Cabin",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>14x52 Rustic Mancave Cabin House Shell</strong></p>\n<p>Introducing the 14x52 Rustic Mancave Cabin House Shell—a spacious and rugged design that’s perfect for creating your ultimate retreat. This cabin features beautiful cedar log siding that offers both charm and durability, giving it a timeless, rustic appeal. The cabin shell comes fully completed on the outside, with all doors and double-pane windows installed, providing security and weatherproofing.</p>\n<p>The inside is a blank canvas, ready for you to customize or let us handle the finishing touches. We offer a variety of premium finishing options, including spray foam insulation, electrical, plumbing, HVAC, luxury vinyl plank flooring, shiplap walls and ceilings, kitchen cabinets, and bathroom fixtures. Whether you’re looking to craft your dream mancave, a cozy getaway, or a full-time residence, the Rustic Mancave Cabin shell offers the foundation to make it happen.</p>\n<p>With a durable 26-gauge metal roof and multiple exterior finish options to choose from, this cabin is built to withstand the elements and provide long-lasting comfort.</p>\n<p><em><strong>ALSO OFFERED FULLY TURNKEY AS A 2 BED 1 BATH AND 2 BED 2 BATH, CHECK BELOW FOR PRICING FOR BOTH OPTIONS!</strong></em></p>\n<p>Contact us today at 502-298-8946 to discuss pricing and how we can help turn this rustic shell into your perfect cabin retreat. With a current turnaround time of 14–16 weeks, your Mancave Cabin could be ready sooner than you think!</p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 39900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "cabins",
      "modular-cabins",
      "turnkey-cabins"
    ]
  },
  {
    "id": "9786873708860",
    "slug": "big-bertha-rustic-cabin-kentucky-pricing",
    "name": "Big Bertha Rustic Cabin - Kentucky Pricing (Shipping & Set up fees included in our pricing)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>Introducing the Big Bertha Cabin: A Perfect Blend of Rustic Beauty and Function</strong></p>\n<p>We’re excited to present the Big Bertha Cabin, one of our most versatile and customizable floor plans. This stunning cabin offers two distinct layouts to suit your needs.</p>\n<ol>\n<li>\n<p><strong>14 ft by 42 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 945 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 42 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> One on the main floor, two lofted upstairs</li>\n</ul>\n</li>\n<li>\n<p><strong>14 ft by 32 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 796 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 32 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> Two lofted upstairs, no bedrooms downstairs in the most popular design</li>\n<li>\n<strong>Customizations:</strong> Layouts can always be modified to meet your preferences</li>\n</ul>\n</li>\n</ol>\n<p><strong>Upgrade Options:</strong><br>For added flexibility, you can upgrade the Big Bertha Cabin to include 1.5 or 2 bathrooms for an additional fee.</p>\n<p><strong>Construction &amp; Insulation:</strong></p>\n<ul>\n<li>\n<strong>Walls:</strong> Constructed from treated Southern Yellow Pine, 4 in x 6 in solid timber, providing robust durability.</li>\n<li>\n<strong>Insulation:</strong> Standard R19 insulation in the ceiling, with optional upgrades to R30 for colder climates like Colorado (additional fee applies).</li>\n<li>\n<strong>Chinking:</strong> We use Log Jam (Perma-Chink) to seal the timber, accommodating wood expansion and contraction through the seasons for optimal efficiency.</li>\n</ul>\n<p><strong>Material Upgrades:</strong></p>\n<ul>\n<li>\n<strong>Cedar:</strong> Upgrade to a fully cedar cabin for a 25% upcharge.</li>\n<li>\n<strong>Eastern White Pine:</strong> Upgrade to Eastern White Pine for a 20% upcharge.</li>\n</ul>\n<p><strong>Transport &amp; Setup:</strong></p>\n<ul>\n<li>\n<strong>Hinge System:</strong> The cabin’s <strong>porch</strong> and <strong>roof</strong> feature a hinge system for easy transportation. Upon delivery, both the porch and roof will need to be reassembled on-site, a process that typically takes <strong>1 to 2 full days</strong>.</li>\n<li>\n<strong>Shipping &amp; Setup Fees:</strong> The base model pricing includes shipping and setup. Please note that prices for appliances, heating, cooling, and electric packages are separate.</li>\n</ul>\n<p><strong>Foundations:</strong><br>If you would like your cabin installed on a block crawlspace or basement foundation, you will need to pay for and arrange a crane to hoist the cabin onto the foundation. Additionally, there will be extra setup fees for our team to remain on-site during this assembly process.</p>\n<p><strong>Additional Features:</strong></p>\n<ul>\n<li>\n<strong>Electrical Package:</strong> 200 amp or 100 amp options available for $10,000.</li>\n<li>\n<strong>Plumbing Package:</strong> Includes installation of tubs, toilets, sinks, and rough plumbing for $10,000.</li>\n<li>\n<strong>Heating &amp; Cooling:</strong> Mini-split systems available upon request for an additional fee.</li>\n<li>\n<strong>Foundation:</strong> Requires a 6-inch slab with rebar; slab length and width dimensions will be determined for you based on what size cabin you purchase from us. Alternatively, save on costs with 2-foot runners placed 10 feet off-center to match the cabin’s wooden runners.</li>\n</ul>\n<p><strong>Roof &amp; Windows:</strong></p>\n<ul>\n<li>\n<strong>Roof:</strong> Made from 26-gauge metal with a choice of 12 colors; matching shutters are available. You can pick any color roof you want.</li>\n<li>\n<strong>Windows:</strong> Double-pane with Argon gas, designed for easy cleaning and all-season durability.</li>\n</ul>\n<p><strong>Interior Features:</strong></p>\n<ul>\n<li>\n<strong>Kitchen Cabinets:</strong> Handcrafted Amish-built cabinets included.</li>\n<li>\n<strong>Porch Swing:</strong> One swing included; additional swings available for $375 each.</li>\n</ul>\n<p><strong>Customizations:</strong></p>\n<ul>\n<li>\n<strong>Floor Plans:</strong> Modifications can be made at no additional cost within reason.</li>\n<li>\n<strong>Back Porch Add-On:</strong> Full back porch for $10,000 or half back porch for $7,500.</li>\n</ul>\n<p><strong>Ordering &amp; Financing:</strong></p>\n<ul>\n<li>\n<strong>Lead Time:</strong> Current lead time is approximately 4.5 to 5 months due to high demand.</li>\n<li>\n<strong>Land Prep:</strong> Requires a 6-inch slab with rebar; options available for cost-saving solutions.</li>\n<li>\n<strong>Layaway-to-Own:</strong> Lock in your cabin price with just 10% down. Check out our \"<a rel=\"noopener\" title=\"layaway to own\" href=\"https://amishbuiltcabins.com/pages/layaway-to-own-program\" target=\"_blank\">Layaway-To-Own</a>\" section on the website for details.</li>\n</ul>\n<p>For any questions or to place your order, call us at 502-298-8946 or use the \"Contact Us\" form on our website. We’re here to help you every step of the way!</p>\n<p><strong>Note:</strong> Our cabins are modular pre-built structures, not kits. However, if you prefer a DIY approach, we offer a kit version of this model. Pricing for the kit includes shipping but does not cover setup. For more details, please see the pricing information below.</p>\n<p>Thank you for considering Amish Built Cabins. We look forward to helping you create your perfect retreat!</p>\n<p><br></p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 79900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "2-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9786209698108",
    "slug": "el-chapo-muchacho",
    "name": "El Chapo Muchacho 1.0 Amish Built Modular Cabin",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>The El Chapo Muchacho Rustic Amish-Built Cabin</strong></p>\n<p>The <strong>El Chapo Muchacho</strong> is one of our best-selling ranch-style, one-story cabins, offering versatile layouts and rustic charm. Whether you're looking for a cozy <strong>1-bedroom, 1-bathroom model</strong> or a spacious <strong>3-bedroom, 2-bathroom home</strong>, this cabin has options to suit your needs. </p>\n<h3>Cabin Customization Options:</h3>\n<ul>\n<li>\n<strong>Purchase as a Shell</strong>: Perfect for DIY enthusiasts who want to finish the interior themselves.</li>\n<li>\n<strong>Turnkey Upgrades</strong>: Let us handle the finishing touches, including:\n<ul>\n<li>\n<strong>Electric</strong>: $10,000</li>\n<li>\n<strong>Plumbing</strong>: $10,000</li>\n<li>\n<strong>Heating and Cooling</strong>: $8,000 to $12,000 (cost varies by cabin size)</li>\n</ul>\n</li>\n</ul>\n<h3>Build Timeline:</h3>\n<p>Due to high demand, current turnaround times for builds are <strong>5 to 6 months</strong>.</p>\n<h3>Shipping and Setup:</h3>\n<ul>\n<li>\n<strong>Shipping Cost</strong>: Approx. $10,000 to most parts of the United States (note: not all areas are serviceable).</li>\n<li>Includes shipping, permits, and reassembly of the porch system, which must be folded for transport.</li>\n<li>Setup on-site includes placing the cabin on a foundation or blocks.</li>\n</ul>\n<h3>Foundation Options:</h3>\n<ul>\n<li>\n<strong>Concrete Slab</strong>: Most customers opt for a 6-inch concrete slab with rebar. Cabins are set 3 feet off the slab on blocks for easy crawlspace access.</li>\n<li>\n<strong>Basement</strong>: Requires an on-site crane at the customer’s expense.</li>\n</ul>\n<h3>Materials and Upgrades:</h3>\n<ul>\n<li>\n<strong>Walls</strong>: 4x6 solid <strong>Southern Yellow Pine</strong>, with an option to upgrade to <strong>Redwood Cedar</strong> for 25% more.</li>\n<li>\n<strong>Roof</strong>: Durable 26-gauge metal.</li>\n<li>\n<strong>Insulation</strong>: Closed-cell spray foam is recommended for the subfloor after plumbing is connected.</li>\n</ul>\n<p>The <strong>El Chapo Muchacho Cabin</strong> is built for durability, beauty, and functionality, making it an ideal choice for families, weekend retreats, or rental properties.</p>\n<h3>Ready to Order?</h3>\n<p>Call us today at <strong>502-298-8946</strong> for pricing, questions, or to place your order. Let us help you create your perfect cabin!</p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 69900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/2e53b3e19aee30e29f66f688190d2da6_0_d4c3cd0e-f427-435d-a982-dbc0c18bdc74.jpg?v=1732343423",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/2e53b3e19aee30e29f66f688190d2da6_0_d4c3cd0e-f427-435d-a982-dbc0c18bdc74.jpg?v=1732343423",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/2e53b3e19aee30e29f66f688190d2da6_0_d4c3cd0e-f427-435d-a982-dbc0c18bdc74.jpg?v=1732343423"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/2e53b3e19aee30e29f66f688190d2da6_0_d4c3cd0e-f427-435d-a982-dbc0c18bdc74.jpg?v=1732343423",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "1-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9786200719676",
    "slug": "cape-cod-cottage-amish-built-modular-cabin",
    "name": "Cape Cod Cottage Amish Built Modular Cabin",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>Cape Cod Cottage - 14x36 Model (On Sale Now for $79,900)</strong></p>\n<p>The <strong>Cape Cod Cottage</strong> is a beautifully designed 14x36 model that's the perfect blend of comfort and functionality. Originally priced at $85,000, a limited-time offer you don't want to miss! Please scroll below to see all the other many different sizes we offer in the Cape Cod Cottage, there is many sizes and price points to choose from!</p>\n<p>This turnkey cottage comes fully loaded with everything you need to move in and start enjoying your new space right away. Inside, it includes <strong>electricity</strong>, <strong>plumbing</strong>, <strong>heating</strong>, <strong>cooling</strong>, and essential appliances such as a <strong>stove</strong>, <strong>refrigerator</strong>, <strong>microwave</strong>, <strong>washer and dryer hookups</strong>, and a <strong>tankless water heater</strong>. You’ll also have your choice of <strong>pine pretty walls</strong> or <strong>nickel gap</strong> for a charming interior finish.</p>\n<p>On the outside, the cottage comes with durable <strong>vinyl siding</strong>, with the option to upgrade to <strong>board and batten</strong>, <strong>hardy board</strong>, or <strong>cedar log siding</strong> for a more customized aesthetic.</p>\n<p>Perfect for a <strong>starter home</strong>, <strong>mother-in-law suite</strong>, or a <strong>cabin rental getaway</strong> to monetize your land, this cabin offers endless possibilities. And don't forget, it’s <strong>Amish built</strong>, and can be constructed to code to meet the necessary <strong>wind ratings</strong>, <strong>snow ratings</strong>, and <strong>insulation requirements</strong> for all 50 states.</p>\n<p>With a <strong>26-gauge metal roof</strong> and customizable options to suit your style, the Cape Cod Cottage is built to last and provide long-term comfort. Interested? Give us a call at <strong>502-298-8946</strong> and mention that the <strong>Amish-built</strong> Cape Cod Cottage is designed to meet the highest standards for your area.</p>\n<p>We’re happy to discuss how we can personalize this home to fit your needs!</p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 85900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wowws.png?v=1746241988",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wowws.png?v=1746241988",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wowws.png?v=1746241988"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wowws.png?v=1746241988",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "1-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9786928628028",
    "slug": "big-bertha-rustic-cabin-indiana-pricing-shipping-set-up-fees-included-in-our-pricing",
    "name": "Big Bertha Rustic Cabin - Indiana Pricing (Shipping & Set up fees included in our pricing)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>Introducing the Big Bertha Cabin: A Perfect Blend of Rustic Beauty and Function</strong></p>\n<p>We’re excited to present the Big Bertha Cabin, one of our most versatile and customizable floor plans. This stunning cabin offers two distinct layouts to suit your needs.</p>\n<ol>\n<li>\n<p><strong>14 ft by 42 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 945 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 42 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> One on the main floor, two lofted upstairs</li>\n</ul>\n</li>\n<li>\n<p><strong>14 ft by 32 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 796 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 32 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> Two lofted upstairs, no bedrooms downstairs in the most popular design</li>\n<li>\n<strong>Customizations:</strong> Layouts can always be modified to meet your preferences</li>\n</ul>\n</li>\n</ol>\n<p><strong>Upgrade Options:</strong><br>For added flexibility, you can upgrade the Big Bertha Cabin to include 1.5 or 2 bathrooms for an additional fee.</p>\n<p><strong>Construction &amp; Insulation:</strong></p>\n<ul>\n<li>\n<strong>Walls:</strong> Constructed from treated Southern Yellow Pine, 4 in x 6 in solid timber, providing robust durability.</li>\n<li>\n<strong>Insulation:</strong> Standard R19 insulation in the ceiling, with optional upgrades to R30 for colder climates like Colorado (additional fee applies).</li>\n<li>\n<strong>Chinking:</strong> We use Log Jam (Perma-Chink) to seal the timber, accommodating wood expansion and contraction through the seasons for optimal efficiency.</li>\n</ul>\n<p><strong>Material Upgrades:</strong></p>\n<ul>\n<li>\n<strong>Cedar:</strong> Upgrade to a fully cedar cabin for a 25% upcharge.</li>\n<li>\n<strong>Eastern White Pine:</strong> Upgrade to Eastern White Pine for a 20% upcharge.</li>\n</ul>\n<p><strong>Transport &amp; Setup:</strong></p>\n<ul>\n<li>\n<strong>Hinge System:</strong> The cabin’s <strong>porch</strong> and <strong>roof</strong> feature a hinge system for easy transportation. Upon delivery, both the porch and roof will need to be reassembled on-site, a process that typically takes <strong>1 to 2 full days</strong>.</li>\n<li>\n<strong>Shipping &amp; Setup Fees:</strong> The base model pricing includes shipping and setup. Please note that prices for appliances, heating, cooling, and electric packages are separate.</li>\n</ul>\n<p><strong>Foundations:</strong><br>If you would like your cabin installed on a block crawlspace or basement foundation, you will need to pay for and arrange a crane to hoist the cabin onto the foundation. Additionally, there will be extra setup fees for our team to remain on-site during this assembly process.</p>\n<p><strong>Additional Features:</strong></p>\n<ul>\n<li>\n<strong>Electrical Package:</strong> 200 amp or 100 amp options available for $10,000.</li>\n<li>\n<strong>Plumbing Package:</strong> Includes installation of tubs, toilets, sinks, and rough plumbing for $10,000.</li>\n<li>\n<strong>Heating &amp; Cooling:</strong> Mini-split systems available upon request for an additional fee.</li>\n<li>\n<strong>Foundation:</strong> Requires a 6-inch slab with rebar; slab length and width dimensions will be determined for you based on what size cabin you purchase from us. Alternatively, save on costs with 2-foot runners placed 10 feet off-center to match the cabin’s wooden runners.</li>\n</ul>\n<p><strong>Roof &amp; Windows:</strong></p>\n<ul>\n<li>\n<strong>Roof:</strong> Made from 26-gauge metal with a choice of 12 colors; matching shutters are available. You can pick any color roof you want.</li>\n<li>\n<strong>Windows:</strong> Double-pane with Argon gas, designed for easy cleaning and all-season durability.</li>\n</ul>\n<p><strong>Interior Features:</strong></p>\n<ul>\n<li>\n<strong>Kitchen Cabinets:</strong> Handcrafted Amish-built cabinets included.</li>\n<li>\n<strong>Porch Swing:</strong> One swing included; additional swings available for $375 each.</li>\n</ul>\n<p><strong>Customizations:</strong></p>\n<ul>\n<li>\n<strong>Floor Plans:</strong> Modifications can be made at no additional cost within reason.</li>\n<li>\n<strong>Back Porch Add-On:</strong> Full back porch for $10,000 or half back porch for $7,500.</li>\n</ul>\n<p><strong>Ordering &amp; Financing:</strong></p>\n<ul>\n<li>\n<strong>Lead Time:</strong> Current lead time is approximately 4.5 to 5 months due to high demand.</li>\n<li>\n<strong>Land Prep:</strong> Requires a 6-inch slab with rebar; options available for cost-saving solutions.</li>\n<li>\n<strong>Layaway-to-Own:</strong> Lock in your cabin price with just 10% down. Check out our \"<a rel=\"noopener\" title=\"layaway to own\" href=\"https://amishbuiltcabins.com/pages/layaway-to-own-program\" target=\"_blank\">Layaway-To-Own</a>\" section on the website for details.</li>\n</ul>\n<p>For any questions or to place your order, call us at 502-298-8946 or use the \"Contact Us\" form on our website. We’re here to help you every step of the way!</p>\n<p><strong>Note:</strong> Our cabins are modular pre-built structures, not kits. However, if you prefer a DIY approach, we offer a kit version of this model. Pricing for the kit includes shipping but does not cover setup. For more details, please see the pricing information below.</p>\n<p>Thank you for considering Amish Built Cabins. We look forward to helping you create your perfect retreat!</p>\n<p><br></p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 79900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "2-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9786930233660",
    "slug": "big-bertha-rustic-cabin-ohio-pricing-shipping-set-up-fees-included-in-our-pricing",
    "name": "Big Bertha Rustic Cabin - Ohio Pricing (Shipping & Set up fees included in our pricing)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>Introducing the Big Bertha Cabin: A Perfect Blend of Rustic Beauty and Function</strong></p>\n<p>We’re excited to present the Big Bertha Cabin, one of our most versatile and customizable floor plans. This stunning cabin offers two distinct layouts to suit your needs.</p>\n<ol>\n<li>\n<p><strong>14 ft by 42 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 945 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 42 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> One on the main floor, two lofted upstairs</li>\n</ul>\n</li>\n<li>\n<p><strong>14 ft by 32 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 796 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 32 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> Two lofted upstairs, no bedrooms downstairs in the most popular design</li>\n<li>\n<strong>Customizations:</strong> Layouts can always be modified to meet your preferences</li>\n</ul>\n</li>\n</ol>\n<p><strong>Upgrade Options:</strong><br>For added flexibility, you can upgrade the Big Bertha Cabin to include 1.5 or 2 bathrooms for an additional fee.</p>\n<p><strong>Construction &amp; Insulation:</strong></p>\n<ul>\n<li>\n<strong>Walls:</strong> Constructed from treated Southern Yellow Pine, 4 in x 6 in solid timber, providing robust durability.</li>\n<li>\n<strong>Insulation:</strong> Standard R19 insulation in the ceiling, with optional upgrades to R30 for colder climates like Colorado (additional fee applies).</li>\n<li>\n<strong>Chinking:</strong> We use Log Jam (Perma-Chink) to seal the timber, accommodating wood expansion and contraction through the seasons for optimal efficiency.</li>\n</ul>\n<p><strong>Material Upgrades:</strong></p>\n<ul>\n<li>\n<strong>Cedar:</strong> Upgrade to a fully cedar cabin for a 25% upcharge.</li>\n<li>\n<strong>Eastern White Pine:</strong> Upgrade to Eastern White Pine for a 20% upcharge.</li>\n</ul>\n<p><strong>Transport &amp; Setup:</strong></p>\n<ul>\n<li>\n<strong>Hinge System:</strong> The cabin’s <strong>porch</strong> and <strong>roof</strong> feature a hinge system for easy transportation. Upon delivery, both the porch and roof will need to be reassembled on-site, a process that typically takes <strong>1 to 2 full days</strong>.</li>\n<li>\n<strong>Shipping &amp; Setup Fees:</strong> The base model pricing includes shipping and setup. Please note that prices for appliances, heating, cooling, and electric packages are separate.</li>\n</ul>\n<p><strong>Foundations:</strong><br>If you would like your cabin installed on a block crawlspace or basement foundation, you will need to pay for and arrange a crane to hoist the cabin onto the foundation. Additionally, there will be extra setup fees for our team to remain on-site during this assembly process.</p>\n<p><strong>Additional Features:</strong></p>\n<ul>\n<li>\n<strong>Electrical Package:</strong> 200 amp or 100 amp options available for $10,000.</li>\n<li>\n<strong>Plumbing Package:</strong> Includes installation of tubs, toilets, sinks, and rough plumbing for $10,000.</li>\n<li>\n<strong>Heating &amp; Cooling:</strong> Mini-split systems available upon request for an additional fee.</li>\n<li>\n<strong>Foundation:</strong> Requires a 6-inch slab with rebar; slab length and width dimensions will be determined for you based on what size cabin you purchase from us. Alternatively, save on costs with 2-foot runners placed 10 feet off-center to match the cabin’s wooden runners.</li>\n</ul>\n<p><strong>Roof &amp; Windows:</strong></p>\n<ul>\n<li>\n<strong>Roof:</strong> Made from 26-gauge metal with a choice of 12 colors; matching shutters are available. You can pick any color roof you want.</li>\n<li>\n<strong>Windows:</strong> Double-pane with Argon gas, designed for easy cleaning and all-season durability.</li>\n</ul>\n<p><strong>Interior Features:</strong></p>\n<ul>\n<li>\n<strong>Kitchen Cabinets:</strong> Handcrafted Amish-built cabinets included.</li>\n<li>\n<strong>Porch Swing:</strong> One swing included; additional swings available for $375 each.</li>\n</ul>\n<p><strong>Customizations:</strong></p>\n<ul>\n<li>\n<strong>Floor Plans:</strong> Modifications can be made at no additional cost within reason.</li>\n<li>\n<strong>Back Porch Add-On:</strong> Full back porch for $10,000 or half back porch for $7,500.</li>\n</ul>\n<p><strong>Ordering &amp; Financing:</strong></p>\n<ul>\n<li>\n<strong>Lead Time:</strong> Current lead time is approximately 4.5 to 5 months due to high demand.</li>\n<li>\n<strong>Land Prep:</strong> Requires a 6-inch slab with rebar; options available for cost-saving solutions.</li>\n<li>\n<strong>Layaway-to-Own:</strong> Lock in your cabin price with just 10% down. Check out our \"<a rel=\"noopener\" title=\"layaway to own\" href=\"https://amishbuiltcabins.com/pages/layaway-to-own-program\" target=\"_blank\">Layaway-To-Own</a>\" section on the website for details.</li>\n</ul>\n<p>For any questions or to place your order, call us at 502-298-8946 or use the \"Contact Us\" form on our website. We’re here to help you every step of the way!</p>\n<p><strong>Note:</strong> Our cabins are modular pre-built structures, not kits. However, if you prefer a DIY approach, we offer a kit version of this model. Pricing for the kit includes shipping but does not cover setup. For more details, please see the pricing information below.</p>\n<p>Thank you for considering Amish Built Cabins. We look forward to helping you create your perfect retreat!</p>\n<p><br></p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 79900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "2-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9786938196284",
    "slug": "big-bertha-rustic-cabin-tennessee-pricing-shipping-set-up-fees-included-in-our-pricing",
    "name": "Big Bertha Rustic Cabin - Tennessee Pricing (Shipping & Set up fees included in our pricing)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>Introducing the Big Bertha Cabin: A Perfect Blend of Rustic Beauty and Function</strong></p>\n<p>We’re excited to present the Big Bertha Cabin, one of our most versatile and customizable floor plans. This stunning cabin offers two distinct layouts to suit your needs.</p>\n<ol>\n<li>\n<p><strong>14 ft by 42 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 945 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 42 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> One on the main floor, two lofted upstairs</li>\n</ul>\n</li>\n<li>\n<p><strong>14 ft by 32 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 796 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 32 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> Two lofted upstairs, no bedrooms downstairs in the most popular design</li>\n<li>\n<strong>Customizations:</strong> Layouts can always be modified to meet your preferences</li>\n</ul>\n</li>\n</ol>\n<p><strong>Upgrade Options:</strong><br>For added flexibility, you can upgrade the Big Bertha Cabin to include 1.5 or 2 bathrooms for an additional fee.</p>\n<p><strong>Construction &amp; Insulation:</strong></p>\n<ul>\n<li>\n<strong>Walls:</strong> Constructed from treated Southern Yellow Pine, 4 in x 6 in solid timber, providing robust durability.</li>\n<li>\n<strong>Insulation:</strong> Standard R19 insulation in the ceiling, with optional upgrades to R30 for colder climates like Colorado (additional fee applies).</li>\n<li>\n<strong>Chinking:</strong> We use Log Jam (Perma-Chink) to seal the timber, accommodating wood expansion and contraction through the seasons for optimal efficiency.</li>\n</ul>\n<p><strong>Material Upgrades:</strong></p>\n<ul>\n<li>\n<strong>Cedar:</strong> Upgrade to a fully cedar cabin for a 25% upcharge.</li>\n<li>\n<strong>Eastern White Pine:</strong> Upgrade to Eastern White Pine for a 20% upcharge.</li>\n</ul>\n<p><strong>Transport &amp; Setup:</strong></p>\n<ul>\n<li>\n<strong>Hinge System:</strong> The cabin’s <strong>porch</strong> and <strong>roof</strong> feature a hinge system for easy transportation. Upon delivery, both the porch and roof will need to be reassembled on-site, a process that typically takes <strong>1 to 2 full days</strong>.</li>\n<li>\n<strong>Shipping &amp; Setup Fees:</strong> The base model pricing includes shipping and setup. Please note that prices for appliances, heating, cooling, and electric packages are separate.</li>\n</ul>\n<p><strong>Foundations:</strong><br>If you would like your cabin installed on a block crawlspace or basement foundation, you will need to pay for and arrange a crane to hoist the cabin onto the foundation. Additionally, there will be extra setup fees for our team to remain on-site during this assembly process.</p>\n<p><strong>Additional Features:</strong></p>\n<ul>\n<li>\n<strong>Electrical Package:</strong> 200 amp or 100 amp options available for $10,000.</li>\n<li>\n<strong>Plumbing Package:</strong> Includes installation of tubs, toilets, sinks, and rough plumbing for $10,000.</li>\n<li>\n<strong>Heating &amp; Cooling:</strong> Mini-split systems available upon request for an additional fee.</li>\n<li>\n<strong>Foundation:</strong> Requires a 6-inch slab with rebar; slab length and width dimensions will be determined for you based on what size cabin you purchase from us. Alternatively, save on costs with 2-foot runners placed 10 feet off-center to match the cabin’s wooden runners.</li>\n</ul>\n<p><strong>Roof &amp; Windows:</strong></p>\n<ul>\n<li>\n<strong>Roof:</strong> Made from 26-gauge metal with a choice of 12 colors; matching shutters are available. You can pick any color roof you want.</li>\n<li>\n<strong>Windows:</strong> Double-pane with Argon gas, designed for easy cleaning and all-season durability.</li>\n</ul>\n<p><strong>Interior Features:</strong></p>\n<ul>\n<li>\n<strong>Kitchen Cabinets:</strong> Handcrafted Amish-built cabinets included.</li>\n<li>\n<strong>Porch Swing:</strong> One swing included; additional swings available for $375 each.</li>\n</ul>\n<p><strong>Customizations:</strong></p>\n<ul>\n<li>\n<strong>Floor Plans:</strong> Modifications can be made at no additional cost within reason.</li>\n<li>\n<strong>Back Porch Add-On:</strong> Full back porch for $10,000 or half back porch for $7,500.</li>\n</ul>\n<p><strong>Ordering &amp; Financing:</strong></p>\n<ul>\n<li>\n<strong>Lead Time:</strong> Current lead time is approximately 4.5 to 5 months due to high demand.</li>\n<li>\n<strong>Land Prep:</strong> Requires a 6-inch slab with rebar; options available for cost-saving solutions.</li>\n<li>\n<strong>Layaway-to-Own:</strong> Lock in your cabin price with just 10% down. Check out our \"<a rel=\"noopener\" title=\"layaway to own\" href=\"https://amishbuiltcabins.com/pages/layaway-to-own-program\" target=\"_blank\">Layaway-To-Own</a>\" section on the website for details.</li>\n</ul>\n<p>For any questions or to place your order, call us at 502-298-8946 or use the \"Contact Us\" form on our website. We’re here to help you every step of the way!</p>\n<p><strong>Note:</strong> Our cabins are modular pre-built structures, not kits. However, if you prefer a DIY approach, we offer a kit version of this model. Pricing for the kit includes shipping but does not cover setup. For more details, please see the pricing information below.</p>\n<p>Thank you for considering Amish Built Cabins. We look forward to helping you create your perfect retreat!</p>\n<p><br></p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 79900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "2-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9786943963452",
    "slug": "big-bertha-rustic-cabin-virginia-pricing",
    "name": "Big Bertha Rustic Cabin - Virginia Pricing (Shipping & Set up fees included in our pricing)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>Introducing the Big Bertha Cabin: A Perfect Blend of Rustic Beauty and Function</strong></p>\n<p>We’re excited to present the Big Bertha Cabin, one of our most versatile and customizable floor plans. This stunning cabin offers two distinct layouts to suit your needs.</p>\n<ol>\n<li>\n<p><strong>14 ft by 42 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 945 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 42 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> One on the main floor, two lofted upstairs</li>\n</ul>\n</li>\n<li>\n<p><strong>14 ft by 32 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 796 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 32 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> Two lofted upstairs, no bedrooms downstairs in the most popular design</li>\n<li>\n<strong>Customizations:</strong> Layouts can always be modified to meet your preferences</li>\n</ul>\n</li>\n</ol>\n<p><strong>Upgrade Options:</strong><br>For added flexibility, you can upgrade the Big Bertha Cabin to include 1.5 or 2 bathrooms for an additional fee.</p>\n<p><strong>Construction &amp; Insulation:</strong></p>\n<ul>\n<li>\n<strong>Walls:</strong> Constructed from treated Southern Yellow Pine, 4 in x 6 in solid timber, providing robust durability.</li>\n<li>\n<strong>Insulation:</strong> Standard R19 insulation in the ceiling, with optional upgrades to R30 for colder climates like Colorado (additional fee applies).</li>\n<li>\n<strong>Chinking:</strong> We use Log Jam (Perma-Chink) to seal the timber, accommodating wood expansion and contraction through the seasons for optimal efficiency.</li>\n</ul>\n<p><strong>Material Upgrades:</strong></p>\n<ul>\n<li>\n<strong>Cedar:</strong> Upgrade to a fully cedar cabin for a 25% upcharge.</li>\n<li>\n<strong>Eastern White Pine:</strong> Upgrade to Eastern White Pine for a 20% upcharge.</li>\n</ul>\n<p><strong>Transport &amp; Setup:</strong></p>\n<ul>\n<li>\n<strong>Hinge System:</strong> The cabin’s <strong>porch</strong> and <strong>roof</strong> feature a hinge system for easy transportation. Upon delivery, both the porch and roof will need to be reassembled on-site, a process that typically takes <strong>1 to 2 full days</strong>.</li>\n<li>\n<strong>Shipping &amp; Setup Fees:</strong> The base model pricing includes shipping and setup. Please note that prices for appliances, heating, cooling, and electric packages are separate.</li>\n</ul>\n<p><strong>Foundations:</strong><br>If you would like your cabin installed on a block crawlspace or basement foundation, you will need to pay for and arrange a crane to hoist the cabin onto the foundation. Additionally, there will be extra setup fees for our team to remain on-site during this assembly process.</p>\n<p><strong>Additional Features:</strong></p>\n<ul>\n<li>\n<strong>Electrical Package:</strong> 200 amp or 100 amp options available for $10,000.</li>\n<li>\n<strong>Plumbing Package:</strong> Includes installation of tubs, toilets, sinks, and rough plumbing for $10,000.</li>\n<li>\n<strong>Heating &amp; Cooling:</strong> Mini-split systems available upon request for an additional fee.</li>\n<li>\n<strong>Foundation:</strong> Requires a 6-inch slab with rebar; slab length and width dimensions will be determined for you based on what size cabin you purchase from us. Alternatively, save on costs with 2-foot runners placed 10 feet off-center to match the cabin’s wooden runners.</li>\n</ul>\n<p><strong>Roof &amp; Windows:</strong></p>\n<ul>\n<li>\n<strong>Roof:</strong> Made from 26-gauge metal with a choice of 12 colors; matching shutters are available. You can pick any color roof you want.</li>\n<li>\n<strong>Windows:</strong> Double-pane with Argon gas, designed for easy cleaning and all-season durability.</li>\n</ul>\n<p><strong>Interior Features:</strong></p>\n<ul>\n<li>\n<strong>Kitchen Cabinets:</strong> Handcrafted Amish-built cabinets included.</li>\n<li>\n<strong>Porch Swing:</strong> One swing included; additional swings available for $375 each.</li>\n</ul>\n<p><strong>Customizations:</strong></p>\n<ul>\n<li>\n<strong>Floor Plans:</strong> Modifications can be made at no additional cost within reason.</li>\n<li>\n<strong>Back Porch Add-On:</strong> Full back porch for $10,000 or half back porch for $7,500.</li>\n</ul>\n<p><strong>Ordering &amp; Financing:</strong></p>\n<ul>\n<li>\n<strong>Lead Time:</strong> Current lead time is approximately 4.5 to 5 months due to high demand.</li>\n<li>\n<strong>Land Prep:</strong> Requires a 6-inch slab with rebar; options available for cost-saving solutions.</li>\n<li>\n<strong>Layaway-to-Own:</strong> Lock in your cabin price with just 10% down. Check out our \"<a rel=\"noopener\" title=\"layaway to own\" href=\"https://amishbuiltcabins.com/pages/layaway-to-own-program\" target=\"_blank\">Layaway-To-Own</a>\" section on the website for details.</li>\n</ul>\n<p>For any questions or to place your order, call us at 502-298-8946 or use the \"Contact Us\" form on our website. We’re here to help you every step of the way!</p>\n<p><strong>Note:</strong> Our cabins are modular pre-built structures, not kits. However, if you prefer a DIY approach, we offer a kit version of this model. Pricing for the kit includes shipping but does not cover setup. For more details, please see the pricing information below.</p>\n<p>Thank you for considering Amish Built Cabins. We look forward to helping you create your perfect retreat!</p>\n<p><br></p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 79900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "2-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9786946093372",
    "slug": "big-bertha-rustic-cabin-michigan-pricing",
    "name": "Big Bertha Rustic Cabin - Michigan Pricing (Shipping & Set up fees included in our pricing)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>Introducing the Big Bertha Cabin: A Perfect Blend of Rustic Beauty and Function</strong></p>\n<p>We’re excited to present the Big Bertha Cabin, one of our most versatile and customizable floor plans. This stunning cabin offers two distinct layouts to suit your needs.</p>\n<ol>\n<li>\n<p><strong>14 ft by 42 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 945 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 42 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> One on the main floor, two lofted upstairs</li>\n</ul>\n</li>\n<li>\n<p><strong>14 ft by 32 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 796 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 32 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> Two lofted upstairs, no bedrooms downstairs in the most popular design</li>\n<li>\n<strong>Customizations:</strong> Layouts can always be modified to meet your preferences</li>\n</ul>\n</li>\n</ol>\n<p><strong>Upgrade Options:</strong><br>For added flexibility, you can upgrade the Big Bertha Cabin to include 1.5 or 2 bathrooms for an additional fee.</p>\n<p><strong>Construction &amp; Insulation:</strong></p>\n<ul>\n<li>\n<strong>Walls:</strong> Constructed from treated Southern Yellow Pine, 4 in x 6 in solid timber, providing robust durability.</li>\n<li>\n<strong>Insulation:</strong> Standard R19 insulation in the ceiling, with optional upgrades to R30 for colder climates like Colorado (additional fee applies).</li>\n<li>\n<strong>Chinking:</strong> We use Log Jam (Perma-Chink) to seal the timber, accommodating wood expansion and contraction through the seasons for optimal efficiency.</li>\n</ul>\n<p><strong>Material Upgrades:</strong></p>\n<ul>\n<li>\n<strong>Cedar:</strong> Upgrade to a fully cedar cabin for a 25% upcharge.</li>\n<li>\n<strong>Eastern White Pine:</strong> Upgrade to Eastern White Pine for a 20% upcharge.</li>\n</ul>\n<p><strong>Transport &amp; Setup:</strong></p>\n<ul>\n<li>\n<strong>Hinge System:</strong> The cabin’s <strong>porch</strong> and <strong>roof</strong> feature a hinge system for easy transportation. Upon delivery, both the porch and roof will need to be reassembled on-site, a process that typically takes <strong>1 to 2 full days</strong>.</li>\n<li>\n<strong>Shipping &amp; Setup Fees:</strong> The base model pricing includes shipping and setup. Please note that prices for appliances, heating, cooling, and electric packages are separate.</li>\n</ul>\n<p><strong>Foundations:</strong><br>If you would like your cabin installed on a block crawlspace or basement foundation, you will need to pay for and arrange a crane to hoist the cabin onto the foundation. Additionally, there will be extra setup fees for our team to remain on-site during this assembly process.</p>\n<p><strong>Additional Features:</strong></p>\n<ul>\n<li>\n<strong>Electrical Package:</strong> 200 amp or 100 amp options available for $10,000.</li>\n<li>\n<strong>Plumbing Package:</strong> Includes installation of tubs, toilets, sinks, and rough plumbing for $10,000.</li>\n<li>\n<strong>Heating &amp; Cooling:</strong> Mini-split systems available upon request for an additional fee.</li>\n<li>\n<strong>Foundation:</strong> Requires a 6-inch slab with rebar; slab length and width dimensions will be determined for you based on what size cabin you purchase from us. Alternatively, save on costs with 2-foot runners placed 10 feet off-center to match the cabin’s wooden runners.</li>\n</ul>\n<p><strong>Roof &amp; Windows:</strong></p>\n<ul>\n<li>\n<strong>Roof:</strong> Made from 26-gauge metal with a choice of 12 colors; matching shutters are available. You can pick any color roof you want.</li>\n<li>\n<strong>Windows:</strong> Double-pane with Argon gas, designed for easy cleaning and all-season durability.</li>\n</ul>\n<p><strong>Interior Features:</strong></p>\n<ul>\n<li>\n<strong>Kitchen Cabinets:</strong> Handcrafted Amish-built cabinets included.</li>\n<li>\n<strong>Porch Swing:</strong> One swing included; additional swings available for $375 each.</li>\n</ul>\n<p><strong>Customizations:</strong></p>\n<ul>\n<li>\n<strong>Floor Plans:</strong> Modifications can be made at no additional cost within reason.</li>\n<li>\n<strong>Back Porch Add-On:</strong> Full back porch for $10,000 or half back porch for $7,500.</li>\n</ul>\n<p><strong>Ordering &amp; Financing:</strong></p>\n<ul>\n<li>\n<strong>Lead Time:</strong> Current lead time is approximately 4.5 to 5 months due to high demand.</li>\n<li>\n<strong>Land Prep:</strong> Requires a 6-inch slab with rebar; options available for cost-saving solutions.</li>\n<li>\n<strong>Layaway-to-Own:</strong> Lock in your cabin price with just 10% down. Check out our \"<a rel=\"noopener\" title=\"layaway to own\" href=\"https://amishbuiltcabins.com/pages/layaway-to-own-program\" target=\"_blank\">Layaway-To-Own</a>\" section on the website for details.</li>\n</ul>\n<p>For any questions or to place your order, call us at 502-298-8946 or use the \"Contact Us\" form on our website. We’re here to help you every step of the way!</p>\n<p><strong>Note:</strong> Our cabins are modular pre-built structures, not kits. However, if you prefer a DIY approach, we offer a kit version of this model. Pricing for the kit includes shipping but does not cover setup. For more details, please see the pricing information below.</p>\n<p>Thank you for considering Amish Built Cabins. We look forward to helping you create your perfect retreat!</p>\n<p><br></p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 79900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "2-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9787026047292",
    "slug": "big-bertha-rustic-cabin-illinois-pricing",
    "name": "Big Bertha Rustic Cabin -Illinois Pricing (Shipping & Set up fees included in our pricing)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>Introducing the Big Bertha Cabin: A Perfect Blend of Rustic Beauty and Function</strong></p>\n<p>We’re excited to present the Big Bertha Cabin, one of our most versatile and customizable floor plans. This stunning cabin offers two distinct layouts to suit your needs.</p>\n<ol>\n<li>\n<p><strong>14 ft by 42 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 945 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 42 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> One on the main floor, two lofted upstairs</li>\n</ul>\n</li>\n<li>\n<p><strong>14 ft by 32 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 796 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 32 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> Two lofted upstairs, no bedrooms downstairs in the most popular design</li>\n<li>\n<strong>Customizations:</strong> Layouts can always be modified to meet your preferences</li>\n</ul>\n</li>\n</ol>\n<p><strong>Upgrade Options:</strong><br>For added flexibility, you can upgrade the Big Bertha Cabin to include 1.5 or 2 bathrooms for an additional fee.</p>\n<p><strong>Construction &amp; Insulation:</strong></p>\n<ul>\n<li>\n<strong>Walls:</strong> Constructed from treated Southern Yellow Pine, 4 in x 6 in solid timber, providing robust durability.</li>\n<li>\n<strong>Insulation:</strong> Standard R19 insulation in the ceiling, with optional upgrades to R30 for colder climates like Colorado (additional fee applies).</li>\n<li>\n<strong>Chinking:</strong> We use Log Jam (Perma-Chink) to seal the timber, accommodating wood expansion and contraction through the seasons for optimal efficiency.</li>\n</ul>\n<p><strong>Material Upgrades:</strong></p>\n<ul>\n<li>\n<strong>Cedar:</strong> Upgrade to a fully cedar cabin for a 25% upcharge.</li>\n<li>\n<strong>Eastern White Pine:</strong> Upgrade to Eastern White Pine for a 20% upcharge.</li>\n</ul>\n<p><strong>Transport &amp; Setup:</strong></p>\n<ul>\n<li>\n<strong>Hinge System:</strong> The cabin’s <strong>porch</strong> and <strong>roof</strong> feature a hinge system for easy transportation. Upon delivery, both the porch and roof will need to be reassembled on-site, a process that typically takes <strong>1 to 2 full days</strong>.</li>\n<li>\n<strong>Shipping &amp; Setup Fees:</strong> The base model pricing includes shipping and setup. Please note that prices for appliances, heating, cooling, and electric packages are separate.</li>\n</ul>\n<p><strong>Foundations:</strong><br>If you would like your cabin installed on a block crawlspace or basement foundation, you will need to pay for and arrange a crane to hoist the cabin onto the foundation. Additionally, there will be extra setup fees for our team to remain on-site during this assembly process.</p>\n<p><strong>Additional Features:</strong></p>\n<ul>\n<li>\n<strong>Electrical Package:</strong> 200 amp or 100 amp options available for $10,000.</li>\n<li>\n<strong>Plumbing Package:</strong> Includes installation of tubs, toilets, sinks, and rough plumbing for $10,000.</li>\n<li>\n<strong>Heating &amp; Cooling:</strong> Mini-split systems available upon request for an additional fee.</li>\n<li>\n<strong>Foundation:</strong> Requires a 6-inch slab with rebar; slab length and width dimensions will be determined for you based on what size cabin you purchase from us. Alternatively, save on costs with 2-foot runners placed 10 feet off-center to match the cabin’s wooden runners.</li>\n</ul>\n<p><strong>Roof &amp; Windows:</strong></p>\n<ul>\n<li>\n<strong>Roof:</strong> Made from 26-gauge metal with a choice of 12 colors; matching shutters are available. You can pick any color roof you want.</li>\n<li>\n<strong>Windows:</strong> Double-pane with Argon gas, designed for easy cleaning and all-season durability.</li>\n</ul>\n<p><strong>Interior Features:</strong></p>\n<ul>\n<li>\n<strong>Kitchen Cabinets:</strong> Handcrafted Amish-built cabinets included.</li>\n<li>\n<strong>Porch Swing:</strong> One swing included; additional swings available for $375 each.</li>\n</ul>\n<p><strong>Customizations:</strong></p>\n<ul>\n<li>\n<strong>Floor Plans:</strong> Modifications can be made at no additional cost within reason.</li>\n<li>\n<strong>Back Porch Add-On:</strong> Full back porch for $10,000 or half back porch for $7,500.</li>\n</ul>\n<p><strong>Ordering &amp; Financing:</strong></p>\n<ul>\n<li>\n<strong>Lead Time:</strong> Current lead time is approximately 4.5 to 5 months due to high demand.</li>\n<li>\n<strong>Land Prep:</strong> Requires a 6-inch slab with rebar; options available for cost-saving solutions.</li>\n<li>\n<strong>Layaway-to-Own:</strong> Lock in your cabin price with just 10% down. Check out our \"<a rel=\"noopener\" title=\"layaway to own\" href=\"https://amishbuiltcabins.com/pages/layaway-to-own-program\" target=\"_blank\">Layaway-To-Own</a>\" section on the website for details.</li>\n</ul>\n<p>For any questions or to place your order, call us at 502-298-8946 or use the \"Contact Us\" form on our website. We’re here to help you every step of the way!</p>\n<p><strong>Note:</strong> Our cabins are modular pre-built structures, not kits. However, if you prefer a DIY approach, we offer a kit version of this model. Pricing for the kit includes shipping but does not cover setup. For more details, please see the pricing information below.</p>\n<p>Thank you for considering Amish Built Cabins. We look forward to helping you create your perfect retreat!</p>\n<p><br></p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 79900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "2-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9787022410044",
    "slug": "big-bertha-rustic-cabin-georgia-pricing",
    "name": "Big Bertha Rustic Cabin - Georgia Pricing (Shipping & Set up fees included in our pricing)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>Introducing the Big Bertha Cabin: A Perfect Blend of Rustic Beauty and Function</strong></p>\n<p>We’re excited to present the Big Bertha Cabin, one of our most versatile and customizable floor plans. This stunning cabin offers two distinct layouts to suit your needs.</p>\n<ol>\n<li>\n<p><strong>14 ft by 42 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 945 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 42 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> One on the main floor, two lofted upstairs</li>\n</ul>\n</li>\n<li>\n<p><strong>14 ft by 32 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 796 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 32 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> Two lofted upstairs, no bedrooms downstairs in the most popular design</li>\n<li>\n<strong>Customizations:</strong> Layouts can always be modified to meet your preferences</li>\n</ul>\n</li>\n</ol>\n<p><strong>Upgrade Options:</strong><br>For added flexibility, you can upgrade the Big Bertha Cabin to include 1.5 or 2 bathrooms for an additional fee.</p>\n<p><strong>Construction &amp; Insulation:</strong></p>\n<ul>\n<li>\n<strong>Walls:</strong> Constructed from treated Southern Yellow Pine, 4 in x 6 in solid timber, providing robust durability.</li>\n<li>\n<strong>Insulation:</strong> Standard R19 insulation in the ceiling, with optional upgrades to R30 for colder climates like Colorado (additional fee applies).</li>\n<li>\n<strong>Chinking:</strong> We use Log Jam (Perma-Chink) to seal the timber, accommodating wood expansion and contraction through the seasons for optimal efficiency.</li>\n</ul>\n<p><strong>Material Upgrades:</strong></p>\n<ul>\n<li>\n<strong>Cedar:</strong> Upgrade to a fully cedar cabin for a 25% upcharge.</li>\n<li>\n<strong>Eastern White Pine:</strong> Upgrade to Eastern White Pine for a 20% upcharge.</li>\n</ul>\n<p><strong>Transport &amp; Setup:</strong></p>\n<ul>\n<li>\n<strong>Hinge System:</strong> The cabin’s <strong>porch</strong> and <strong>roof</strong> feature a hinge system for easy transportation. Upon delivery, both the porch and roof will need to be reassembled on-site, a process that typically takes <strong>1 to 2 full days</strong>.</li>\n<li>\n<strong>Shipping &amp; Setup Fees:</strong> The base model pricing includes shipping and setup. Please note that prices for appliances, heating, cooling, and electric packages are separate.</li>\n</ul>\n<p><strong>Foundations:</strong><br>If you would like your cabin installed on a block crawlspace or basement foundation, you will need to pay for and arrange a crane to hoist the cabin onto the foundation. Additionally, there will be extra setup fees for our team to remain on-site during this assembly process.</p>\n<p><strong>Additional Features:</strong></p>\n<ul>\n<li>\n<strong>Electrical Package:</strong> 200 amp or 100 amp options available for $10,000.</li>\n<li>\n<strong>Plumbing Package:</strong> Includes installation of tubs, toilets, sinks, and rough plumbing for $10,000.</li>\n<li>\n<strong>Heating &amp; Cooling:</strong> Mini-split systems available upon request for an additional fee.</li>\n<li>\n<strong>Foundation:</strong> Requires a 6-inch slab with rebar; slab length and width dimensions will be determined for you based on what size cabin you purchase from us. Alternatively, save on costs with 2-foot runners placed 10 feet off-center to match the cabin’s wooden runners.</li>\n</ul>\n<p><strong>Roof &amp; Windows:</strong></p>\n<ul>\n<li>\n<strong>Roof:</strong> Made from 26-gauge metal with a choice of 12 colors; matching shutters are available. You can pick any color roof you want.</li>\n<li>\n<strong>Windows:</strong> Double-pane with Argon gas, designed for easy cleaning and all-season durability.</li>\n</ul>\n<p><strong>Interior Features:</strong></p>\n<ul>\n<li>\n<strong>Kitchen Cabinets:</strong> Handcrafted Amish-built cabinets included.</li>\n<li>\n<strong>Porch Swing:</strong> One swing included; additional swings available for $375 each.</li>\n</ul>\n<p><strong>Customizations:</strong></p>\n<ul>\n<li>\n<strong>Floor Plans:</strong> Modifications can be made at no additional cost within reason.</li>\n<li>\n<strong>Back Porch Add-On:</strong> Full back porch for $10,000 or half back porch for $7,500.</li>\n</ul>\n<p><strong>Ordering &amp; Financing:</strong></p>\n<ul>\n<li>\n<strong>Lead Time:</strong> Current lead time is approximately 4.5 to 5 months due to high demand.</li>\n<li>\n<strong>Land Prep:</strong> Requires a 6-inch slab with rebar; options available for cost-saving solutions.</li>\n<li>\n<strong>Layaway-to-Own:</strong> Lock in your cabin price with just 10% down. Check out our \"<a rel=\"noopener\" title=\"layaway to own\" href=\"https://amishbuiltcabins.com/pages/layaway-to-own-program\" target=\"_blank\">Layaway-To-Own</a>\" section on the website for details.</li>\n</ul>\n<p>For any questions or to place your order, call us at 502-298-8946 or use the \"Contact Us\" form on our website. We’re here to help you every step of the way!</p>\n<p><strong>Note:</strong> Our cabins are modular pre-built structures, not kits. However, if you prefer a DIY approach, we offer a kit version of this model. Pricing for the kit includes shipping but does not cover setup. For more details, please see the pricing information below.</p>\n<p>Thank you for considering Amish Built Cabins. We look forward to helping you create your perfect retreat!</p>\n<p><br></p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 79900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "2-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9787027751228",
    "slug": "big-bertha-rustic-cabin-west-virginia-pricing",
    "name": "Big Bertha Rustic Cabin -West Virginia Pricing (Shipping & Set up fees included in our pricing)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>Introducing the Big Bertha Cabin: A Perfect Blend of Rustic Beauty and Function</strong></p>\n<p>We’re excited to present the Big Bertha Cabin, one of our most versatile and customizable floor plans. This stunning cabin offers two distinct layouts to suit your needs.</p>\n<ol>\n<li>\n<p><strong>14 ft by 42 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 945 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 42 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> One on the main floor, two lofted upstairs</li>\n</ul>\n</li>\n<li>\n<p><strong>14 ft by 32 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 796 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 32 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> Two lofted upstairs, no bedrooms downstairs in the most popular design</li>\n<li>\n<strong>Customizations:</strong> Layouts can always be modified to meet your preferences</li>\n</ul>\n</li>\n</ol>\n<p><strong>Upgrade Options:</strong><br>For added flexibility, you can upgrade the Big Bertha Cabin to include 1.5 or 2 bathrooms for an additional fee.</p>\n<p><strong>Construction &amp; Insulation:</strong></p>\n<ul>\n<li>\n<strong>Walls:</strong> Constructed from treated Southern Yellow Pine, 4 in x 6 in solid timber, providing robust durability.</li>\n<li>\n<strong>Insulation:</strong> Standard R19 insulation in the ceiling, with optional upgrades to R30 for colder climates like Colorado (additional fee applies).</li>\n<li>\n<strong>Chinking:</strong> We use Log Jam (Perma-Chink) to seal the timber, accommodating wood expansion and contraction through the seasons for optimal efficiency.</li>\n</ul>\n<p><strong>Material Upgrades:</strong></p>\n<ul>\n<li>\n<strong>Cedar:</strong> Upgrade to a fully cedar cabin for a 25% upcharge.</li>\n<li>\n<strong>Eastern White Pine:</strong> Upgrade to Eastern White Pine for a 20% upcharge.</li>\n</ul>\n<p><strong>Transport &amp; Setup:</strong></p>\n<ul>\n<li>\n<strong>Hinge System:</strong> The cabin’s <strong>porch</strong> and <strong>roof</strong> feature a hinge system for easy transportation. Upon delivery, both the porch and roof will need to be reassembled on-site, a process that typically takes <strong>1 to 2 full days</strong>.</li>\n<li>\n<strong>Shipping &amp; Setup Fees:</strong> The base model pricing includes shipping and setup. Please note that prices for appliances, heating, cooling, and electric packages are separate.</li>\n</ul>\n<p><strong>Foundations:</strong><br>If you would like your cabin installed on a block crawlspace or basement foundation, you will need to pay for and arrange a crane to hoist the cabin onto the foundation. Additionally, there will be extra setup fees for our team to remain on-site during this assembly process.</p>\n<p><strong>Additional Features:</strong></p>\n<ul>\n<li>\n<strong>Electrical Package:</strong> 200 amp or 100 amp options available for $10,000.</li>\n<li>\n<strong>Plumbing Package:</strong> Includes installation of tubs, toilets, sinks, and rough plumbing for $10,000.</li>\n<li>\n<strong>Heating &amp; Cooling:</strong> Mini-split systems available upon request for an additional fee.</li>\n<li>\n<strong>Foundation:</strong> Requires a 6-inch slab with rebar; slab length and width dimensions will be determined for you based on what size cabin you purchase from us. Alternatively, save on costs with 2-foot runners placed 10 feet off-center to match the cabin’s wooden runners.</li>\n</ul>\n<p><strong>Roof &amp; Windows:</strong></p>\n<ul>\n<li>\n<strong>Roof:</strong> Made from 26-gauge metal with a choice of 12 colors; matching shutters are available. You can pick any color roof you want.</li>\n<li>\n<strong>Windows:</strong> Double-pane with Argon gas, designed for easy cleaning and all-season durability.</li>\n</ul>\n<p><strong>Interior Features:</strong></p>\n<ul>\n<li>\n<strong>Kitchen Cabinets:</strong> Handcrafted Amish-built cabinets included.</li>\n<li>\n<strong>Porch Swing:</strong> One swing included; additional swings available for $375 each.</li>\n</ul>\n<p><strong>Customizations:</strong></p>\n<ul>\n<li>\n<strong>Floor Plans:</strong> Modifications can be made at no additional cost within reason.</li>\n<li>\n<strong>Back Porch Add-On:</strong> Full back porch for $10,000 or half back porch for $7,500.</li>\n</ul>\n<p><strong>Ordering &amp; Financing:</strong></p>\n<ul>\n<li>\n<strong>Lead Time:</strong> Current lead time is approximately 4.5 to 5 months due to high demand.</li>\n<li>\n<strong>Land Prep:</strong> Requires a 6-inch slab with rebar; options available for cost-saving solutions.</li>\n<li>\n<strong>Layaway-to-Own:</strong> Lock in your cabin price with just 10% down. Check out our \"<a rel=\"noopener\" title=\"layaway to own\" href=\"https://amishbuiltcabins.com/pages/layaway-to-own-program\" target=\"_blank\">Layaway-To-Own</a>\" section on the website for details.</li>\n</ul>\n<p>For any questions or to place your order, call us at 502-298-8946 or use the \"Contact Us\" form on our website. We’re here to help you every step of the way!</p>\n<p><strong>Note:</strong> Our cabins are modular pre-built structures, not kits. However, if you prefer a DIY approach, we offer a kit version of this model. Pricing for the kit includes shipping but does not cover setup. For more details, please see the pricing information below.</p>\n<p>Thank you for considering Amish Built Cabins. We look forward to helping you create your perfect retreat!</p>\n<p><br></p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 79900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "2-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9787029356860",
    "slug": "big-bertha-rustic-cabin-missouri-pricing",
    "name": "Big Bertha Rustic Cabin -Missouri Pricing (Shipping & Set up fees included in our pricing)",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "Precision Engineered Home Kit",
    "description": "<p><strong>Introducing the Big Bertha Cabin: A Perfect Blend of Rustic Beauty and Function</strong></p>\n<p>We’re excited to present the Big Bertha Cabin, one of our most versatile and customizable floor plans. This stunning cabin offers two distinct layouts to suit your needs.</p>\n<ol>\n<li>\n<p><strong>14 ft by 42 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 945 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 42 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> One on the main floor, two lofted upstairs</li>\n</ul>\n</li>\n<li>\n<p><strong>14 ft by 32 ft Design:</strong></p>\n<ul>\n<li>\n<strong>Total Living Space:</strong> 796 sq. ft</li>\n<li>\n<strong>Porch:</strong> 6 ft by 32 ft covered area</li>\n<li>\n<strong>Bedrooms:</strong> Two lofted upstairs, no bedrooms downstairs in the most popular design</li>\n<li>\n<strong>Customizations:</strong> Layouts can always be modified to meet your preferences</li>\n</ul>\n</li>\n</ol>\n<p><strong>Upgrade Options:</strong><br>For added flexibility, you can upgrade the Big Bertha Cabin to include 1.5 or 2 bathrooms for an additional fee.</p>\n<p><strong>Construction &amp; Insulation:</strong></p>\n<ul>\n<li>\n<strong>Walls:</strong> Constructed from treated Southern Yellow Pine, 4 in x 6 in solid timber, providing robust durability.</li>\n<li>\n<strong>Insulation:</strong> Standard R19 insulation in the ceiling, with optional upgrades to R30 for colder climates like Colorado (additional fee applies).</li>\n<li>\n<strong>Chinking:</strong> We use Log Jam (Perma-Chink) to seal the timber, accommodating wood expansion and contraction through the seasons for optimal efficiency.</li>\n</ul>\n<p><strong>Material Upgrades:</strong></p>\n<ul>\n<li>\n<strong>Cedar:</strong> Upgrade to a fully cedar cabin for a 25% upcharge.</li>\n<li>\n<strong>Eastern White Pine:</strong> Upgrade to Eastern White Pine for a 20% upcharge.</li>\n</ul>\n<p><strong>Transport &amp; Setup:</strong></p>\n<ul>\n<li>\n<strong>Hinge System:</strong> The cabin’s <strong>porch</strong> and <strong>roof</strong> feature a hinge system for easy transportation. Upon delivery, both the porch and roof will need to be reassembled on-site, a process that typically takes <strong>1 to 2 full days</strong>.</li>\n<li>\n<strong>Shipping &amp; Setup Fees:</strong> The base model pricing includes shipping and setup. Please note that prices for appliances, heating, cooling, and electric packages are separate.</li>\n</ul>\n<p><strong>Foundations:</strong><br>If you would like your cabin installed on a block crawlspace or basement foundation, you will need to pay for and arrange a crane to hoist the cabin onto the foundation. Additionally, there will be extra setup fees for our team to remain on-site during this assembly process.</p>\n<p><strong>Additional Features:</strong></p>\n<ul>\n<li>\n<strong>Electrical Package:</strong> 200 amp or 100 amp options available for $10,000.</li>\n<li>\n<strong>Plumbing Package:</strong> Includes installation of tubs, toilets, sinks, and rough plumbing for $10,000.</li>\n<li>\n<strong>Heating &amp; Cooling:</strong> Mini-split systems available upon request for an additional fee.</li>\n<li>\n<strong>Foundation:</strong> Requires a 6-inch slab with rebar; slab length and width dimensions will be determined for you based on what size cabin you purchase from us. Alternatively, save on costs with 2-foot runners placed 10 feet off-center to match the cabin’s wooden runners.</li>\n</ul>\n<p><strong>Roof &amp; Windows:</strong></p>\n<ul>\n<li>\n<strong>Roof:</strong> Made from 26-gauge metal with a choice of 12 colors; matching shutters are available. You can pick any color roof you want.</li>\n<li>\n<strong>Windows:</strong> Double-pane with Argon gas, designed for easy cleaning and all-season durability.</li>\n</ul>\n<p><strong>Interior Features:</strong></p>\n<ul>\n<li>\n<strong>Kitchen Cabinets:</strong> Handcrafted Amish-built cabinets included.</li>\n<li>\n<strong>Porch Swing:</strong> One swing included; additional swings available for $375 each.</li>\n</ul>\n<p><strong>Customizations:</strong></p>\n<ul>\n<li>\n<strong>Floor Plans:</strong> Modifications can be made at no additional cost within reason.</li>\n<li>\n<strong>Back Porch Add-On:</strong> Full back porch for $10,000 or half back porch for $7,500.</li>\n</ul>\n<p><strong>Ordering &amp; Financing:</strong></p>\n<ul>\n<li>\n<strong>Lead Time:</strong> Current lead time is approximately 4.5 to 5 months due to high demand.</li>\n<li>\n<strong>Land Prep:</strong> Requires a 6-inch slab with rebar; options available for cost-saving solutions.</li>\n<li>\n<strong>Layaway-to-Own:</strong> Lock in your cabin price with just 10% down. Check out our \"<a rel=\"noopener\" title=\"layaway to own\" href=\"https://amishbuiltcabins.com/pages/layaway-to-own-program\" target=\"_blank\">Layaway-To-Own</a>\" section on the website for details.</li>\n</ul>\n<p>For any questions or to place your order, call us at 502-298-8946 or use the \"Contact Us\" form on our website. We’re here to help you every step of the way!</p>\n<p><strong>Note:</strong> Our cabins are modular pre-built structures, not kits. However, if you prefer a DIY approach, we offer a kit version of this model. Pricing for the kit includes shipping but does not cover setup. For more details, please see the pricing information below.</p>\n<p>Thank you for considering Amish Built Cabins. We look forward to helping you create your perfect retreat!</p>\n<p><br></p>",
    "sqft": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 79900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/20240606_175901.jpg?v=1732393146",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "turnkey-cabins",
      "2-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "9788220997948",
    "slug": "wildwood-retreat-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Wildwood Retreat – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "620 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Wildwood Retreat House Kit – Affordable 1-Story Bungalow Home Plan</strong></h3>\n<p>The <strong>Wildwood Retreat House Kit</strong> is a charming 1-story bungalow with a <strong>clean, simple floor plan</strong> designed for efficiency and comfort. At <strong>620 sq ft, this 1-bedroom, 1-bathroom</strong> home is perfect for starter homes, second dwellings, or mother-in-law suites. Its panelized construction ensures cost-effective and time-saving assembly, cutting build time by up to 60% compared to traditional methods.</p>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>\n<strong>What’s Included</strong>: Pre-cut floor trusses, panelized walls, roof trusses, windows, exterior finishes, shingles, insulation, drywall, and delivery.</li>\n<li>\n<strong>Customizable Floor Plans</strong>: Adjust the layout to suit your needs, making your home truly yours.</li>\n<li>\n<strong>Durability</strong>: Designed to meet local wind, snow, and hurricane codes for long-lasting quality.</li>\n</ul>\n<h4><strong>Affordable and Convenient Options</strong></h4>\n<p>Whether you're a DIY enthusiast or working with a contractor, this kit is designed for simplicity and ease of use. Need help? We can connect you with a local builder once you become our customer. For added convenience, <strong>full turnkey build services</strong> are available in select states—contact us to learn more!</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Due to high demand, turnaround times are currently <strong>14 to 16 weeks</strong> from order to delivery. If you have any questions, call us at <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Massive Selection of Home Plans</strong></h4>\n<p>We offer a wide range of <strong>home plans</strong>, including cozy cabins, tiny homes, and larger designs up to <strong>4,750 sq ft</strong>. Browse our collection to find the perfect house plan to suit your vision and lifestyle!</p>\n<p><meta charset=\"utf-8\"><strong>Below is the floor plan and a series of interior renderings for the Wildwood Retreat house plan. The renderings help bring the floor plan to life and show examples of what the home interior could look like. We can customize all house plans (interior &amp; exterior) to match your specific requirements.</strong></p>\n<h3><strong><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/_ZXPTIJDEP0?si=QrO1_KUbNBQR5_Dq\" title=\"YouTube video player\"></iframe></strong></h3>",
    "sqft": 620,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 68200,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wildwood.jpg?v=1732466814",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wildwood.jpg?v=1732466814",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wildwood.jpg?v=1732466814"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wildwood.jpg?v=1732466814",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "620 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9788285419836",
    "slug": "summit-haven-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Summit Haven – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "704 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Summit Haven House Kit – Affordable 704 Sq Ft Home Plan</strong></h3>\n<p>The <strong>Summit Haven House Kit</strong> offers <strong>704 sq ft of well-designed space</strong> with 2 bedrooms and 1 bathroom. This <strong>1-story bungalow</strong> features a practical, simple floor plan, making it ideal for small families, vacation homes, or as a guest dwelling. Its panelized construction reduces build time by up to 60%, making it a cost-effective option for those looking to build efficiently and affordably.</p>\n<p><strong>704 SQ. FT. Modular Home Dimensions</strong><br><strong>Overall Dimensions:</strong> 28'-0\"W x 28'-0\"D</p>\n<p><strong>Room Sizes:</strong></p>\n<ul>\n<li>\n<strong>Living Room:</strong> 12'-0\" x 11'-4\"</li>\n<li>\n<strong>Kitchen:</strong> 8'-0\" x 7'-5\"</li>\n<li>\n<strong>Dining Room:</strong> 6'-11\" x 7'-5\"</li>\n<li>\n<strong>Master Bedroom:</strong> 10'-1\" x 14'-8\"</li>\n<li>\n<strong>Bedroom #2:</strong> 8'-11\" x 9'-6\"</li>\n</ul>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>\n<strong>What’s Included</strong>: Pre-cut floor trusses, panelized walls, roof trusses, windows, exterior finishes, shingles, insulation, drywall, and delivery.</li>\n<li>\n<strong>Customizable Floor Plans</strong>: Personalize your layout to make it uniquely yours.</li>\n<li>\n<strong>Durability</strong>: Built to meet local wind, snow, and hurricane codes for lasting protection.</li>\n</ul>\n<h4><strong>Affordable &amp; Flexible Build Options</strong></h4>\n<p>Ideal for contractors and DIYers, the Summit Haven kit is easy to assemble. Need help finding a local contractor? We can assist once you become our customer. For added convenience, <strong>turnkey build services</strong> are available in select states.</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Due to high demand, turnaround times are currently <strong>14 to 16 weeks</strong> from order to delivery. For inquiries, call us at <strong>502-298-8946</strong> or fill out our contact form, and we’ll get back to you within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Browse our wide selection of <strong>home plans</strong>, ranging from cozy cabins to larger designs up to <strong>4,750 sq ft</strong>. Whatever your needs, we have the perfect plan for your dream home!</p>\n<h3><strong><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/_ZXPTIJDEP0?si=QrO1_KUbNBQR5_Dq\" title=\"YouTube video player\"></iframe></strong></h3>",
    "sqft": 704,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 77900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/summithaven.jpg?v=1773108748",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/summithaven.jpg?v=1773108748",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/summithaven.jpg?v=1773108748"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/summithaven.jpg?v=1773108748",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "704 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9788292038972",
    "slug": "cascade-view-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Cascade View – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "720 SQ FT Engineered Home Plan",
    "description": "<p>The <strong>Cascade View House Kit</strong> offers <strong>720 sq ft</strong> of efficient and cozy living space, featuring <strong>1 bedroom and 1 bathroom</strong>. This 1-story home provides a simple and functional floor plan, ideal for small families, vacation homes, or guest dwellings. With panelized construction, it reduces build time by up to 60%, offering an affordable and quick solution to home building.<meta charset=\"utf-8\"></p>\n<p><strong>720 SQ. FT. Modular Home Dimensions</strong><br><strong>Overall Dimensions:</strong> 26'-0\"W x 30'-0\"D</p>\n<p><strong>Room Sizes:</strong></p>\n<ul>\n<li>\n<strong>Living Room:</strong> 15'-0\" x 14'-10\"</li>\n<li>\n<strong>Kitchen/Dining:</strong> 10'-0\" x 12'-2\"</li>\n<li>\n<strong>Bedroom:</strong> 11'-6\" x 11'-6\"</li>\n</ul>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>Pre-cut floor trusses, panelized walls, roof trusses, windows, insulation, drywall, shingles, and delivery.</li>\n<li>Customizable layouts to meet your unique needs.</li>\n<li>Built to meet local codes for wind, snow, and hurricane resistance.</li>\n</ul>\n<p>Ideal for DIY builders or contractors, and we can connect you with a local contractor once you become our customer. Full turnkey services are available in select states.</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Turnaround time is currently <strong>14 to 16 weeks</strong> due to high demand. For more details, call <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Explore our wide selection of <strong>home plans</strong>, including designs up to <strong>4,750 sq ft</strong>, perfect for your next build!</p>\n<h3><strong><iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/_ZXPTIJDEP0?si=QrO1_KUbNBQR5_Dq\" title=\"YouTube video player\"></iframe></strong></h3>",
    "sqft": 720,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 64800,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cascadeview.jpg?v=1732467954",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cascadeview.jpg?v=1732467954",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cascadeview.jpg?v=1732467954"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cascadeview.jpg?v=1732467954",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "720 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9788304425276",
    "slug": "rocky-crest-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Rocky Crest – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "863 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Rocky Crest House Kit – 863 Sq Ft 2-Story Bungalow Home Plan</strong></h3>\n<p>The <strong>Rocky Crest House Kit</strong> offers <strong>863 sq ft</strong> of living space, featuring a <strong>1-bedroom, 1-bathroom</strong> layout in a charming 2-story bungalow design. Perfect for those seeking a compact yet functional home, this kit includes everything needed for an easy build with panelized construction to reduce assembly time by up to 60%. Customize the layout to fit your needs and enjoy durability built to meet local codes.</p>\n<p><strong>Floor Plan</strong><br><strong>863 SQ. FT.</strong><br><strong>22'-0\"W x 26'-0\"D</strong></p>\n<ul>\n<li>\n<strong>Living Room</strong>: 13'-0\" x 11'-6\"</li>\n<li>\n<strong>Kitchen</strong>: 8'-6\" x 13'-6\"</li>\n<li>\n<strong>Dining</strong>: 8'-0\" x 9'-6\"</li>\n<li>\n<strong>Bedroom</strong>: 10'-8\" x 13'-0\"</li>\n</ul>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>Pre-cut floor trusses, panelized walls, roof trusses, windows, shingles, insulation, and drywall.</li>\n<li>\n<strong>Customizable floor plans</strong> tailored to your preferences.</li>\n<li>Meets <strong>local building codes</strong> for wind, snow, and hurricane resistance.</li>\n</ul>\n<p>For assistance with a local contractor or <strong>turnkey services</strong>, contact us today!</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Current turnaround time is <strong>14 to 16 weeks</strong>. For inquiries, call <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Browse a wide selection of <strong>home plans</strong>, including designs up to <strong>4,750 sq ft</strong>, to find the perfect fit for your project.</p>",
    "sqft": 863,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 94900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/pr_14_2025_10_49_52_PM.png?v=1744687697",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/pr_14_2025_10_49_52_PM.png?v=1744687697",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/pr_14_2025_10_49_52_PM.png?v=1744687697"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/pr_14_2025_10_49_52_PM.png?v=1744687697",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "863 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9788313141564",
    "slug": "timberline-retreat-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Timberline Retreat – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "875 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Timberline House Kit – 875 Sq Ft 2-Bedroom, 1-Bathroom Home Plan</strong></h3>\n<p>The <strong>Timberline House Kit</strong> offers <strong>875 sq ft</strong> of living space, with a <strong>2-bedroom, 1-bathroom</strong> layout. This cozy and functional design is perfect for small families or as a weekend getaway. With its panelized construction, the Timberline kit reduces assembly time by up to 60%, making it an affordable and efficient home building solution.<meta charset=\"utf-8\"></p>\n<p><strong>Floor Plan</strong><br><strong>875 SQ. FT.</strong><br><strong>30'-0\"W x 30'-6\"D</strong></p>\n<ul>\n<li>\n<strong>Living Room</strong>: 16'-0\" x 12'-2\"</li>\n<li>\n<strong>Kitchen/Dining</strong>: 13'-0\" x 14'-8\"</li>\n<li>\n<strong>Bedroom #1</strong>: 10'-0\" x 12'-2\"</li>\n<li>\n<strong>Bedroom #2</strong>: 10'-0\" x 12'-2\"</li>\n</ul>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>Pre-cut floor trusses, panelized walls, roof trusses, windows, insulation, drywall, shingles, and delivery.</li>\n<li>Customizable floor plans to suit your needs.</li>\n<li>Built to meet local building codes for wind, snow, and hurricane resistance.</li>\n</ul>\n<p>Perfect for DIY builders and contractors, and we can help you connect with a local contractor or offer <strong>turnkey services</strong> in select states.</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Current turnaround time is <strong>14 to 16 weeks</strong> from order to delivery. For more information, call <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Explore our extensive selection of <strong>home plans</strong>, with designs ranging from cozy cabins to expansive homes up to <strong>4,750 sq ft</strong>!</p>",
    "sqft": 875,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 96900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/timberline.jpg?v=1732468519",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/timberline.jpg?v=1732468519",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/timberline.jpg?v=1732468519"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/timberline.jpg?v=1732468519",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "875 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9788318056764",
    "slug": "misty-peak-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Misty Peak – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "880 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Misty Peak House Kit – 880 Sq Ft 2-Bedroom, 2-Bathroom 2-Story Bungalow</strong></h3>\n<p>The <strong>Misty Peak House Kit</strong> is one of our <strong>most popular sellers</strong>! Offering <strong>880 sq ft</strong> of living space, this 2-bedroom, 2-bathroom, 2-story bungalow is perfect for those looking for efficient yet spacious living. The panelized construction reduces build time by up to 60%, making it an affordable and quick option for DIY builders and contractors.<meta charset=\"utf-8\"></p>\n<p><strong>Floor Plan</strong><br><strong>880 SQ. FT.</strong><br><strong>20'-0\"W x 32'-0\"D</strong></p>\n<ul>\n<li>\n<strong>Great Room</strong>: 15'-3\" x 11'-1\"</li>\n<li>\n<strong>Kitchen</strong>: 9'-4\" x 8'-1\"</li>\n<li>\n<strong>Master Bedroom</strong>: 12'-0\" x 11'-6\"</li>\n<li>\n<strong>Bedroom #2</strong>: 9'-0\" x 9'-0\"</li>\n</ul>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>Pre-cut trusses, panelized walls, roof trusses, windows, shingles, insulation, drywall, and delivery.</li>\n<li>Customizable layout to meet your unique needs.</li>\n<li>Built to meet local codes for wind, snow, and hurricane resistance.</li>\n</ul>\n<p>For help finding a local contractor or <strong>turnkey services</strong>, contact us today.</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Turnaround time is <strong>14 to 16 weeks</strong>. For questions, call <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Browse our <strong>extensive selection of home plans</strong>, ranging from cozy cabins to expansive homes up to <strong>4,750 sq ft</strong>!</p>\n<p><em><strong>SEE FLOOR PLANS AND RENDERINGS BELOW OF A RECENT CUSTOMERS BUILD TO SEE WHAT THE POTENTIAL OF THIS BEAUTIFUL HOUSE KIT LOOKS LIKE WHEN ITS FULLY BUILT!</strong></em></p>",
    "sqft": 880,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 96900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/m2.jpg?v=1744687295",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/m2.jpg?v=1744687295",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/m2.jpg?v=1744687295"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/m2.jpg?v=1744687295",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "880 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9788336505148",
    "slug": "snowcap-refuge-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Snowcap Refuge – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "920 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Snowcap Refuge House Kit – 920 Sq Ft 2-Bedroom, 1-Bathroom with Garage and Living Quarters</strong></h3>\n<p>The <strong>Snowcap Refuge House Kit</strong> offers <strong>920 sq ft</strong> of space, with <strong>2 bedrooms</strong> and <strong>1 bathroom</strong> situated above a <strong>garage</strong>. This innovative design is perfect as a <strong>second dwelling</strong>, a <strong>workshop cottage</strong>, or a functional <strong>multi-use property</strong>. With <strong>panelized construction</strong>, it’s designed for easy assembly and cost-efficiency, reducing build time by up to 60%.<meta charset=\"utf-8\"></p>\n<p><strong>Floor Plan</strong><br><strong>920 SQ. FT.</strong><br><strong>36'-0\"W x 28'-0\"D</strong></p>\n<ul>\n<li>\n<strong>Living Room</strong>: 13'-6\" / 9'-6\" x 15'-8\" / 10'-8\"</li>\n<li>\n<strong>Kitchen</strong>: 9'-6\" x 12'-2\"</li>\n<li>\n<strong>Dining</strong>: 8'-0\" x 13'-2\"</li>\n<li>\n<strong>Bedroom #1</strong>: 9'-2\" x 10'-0\"</li>\n<li>\n<strong>Bedroom #2</strong>: 9'-2\" x 10'-0\"</li>\n<li>\n<strong>Garage</strong>: 32'-0\" x 28'-0\"</li>\n</ul>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>Includes pre-cut trusses, panelized walls, roof trusses, windows, insulation, shingles, drywall, and delivery.</li>\n<li>Customizable floor plans to create your perfect space.</li>\n<li>Built to meet local codes for wind, snow, and hurricane resistance.</li>\n</ul>\n<p>For help finding a local contractor or exploring <strong>turnkey services</strong>, contact us today.</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Turnaround time is <strong>14 to 16 weeks</strong>. For questions, call <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Discover our wide selection of <strong>home plans</strong>, from compact dwellings to expansive homes up to <strong>4,750 sq ft</strong>!</p>\n<p><em><strong>SEE FLOOR PLANS AND RENDERINGS BELOW OF A RECENT CUSTOMERS BUILD TO SEE WHAT THE POTENTIAL OF THIS BEAUTIFUL HOUSE KIT LOOKS LIKE WHEN ITS FULLY BUILT!</strong></em></p>\n<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/_ZXPTIJDEP0?si=QrO1_KUbNBQR5_Dq\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
    "sqft": 920,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 101900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/snowcap.jpg?v=1732469520",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/snowcap.jpg?v=1732469520",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/snowcap.jpg?v=1732469520"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/snowcap.jpg?v=1732469520",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "920 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9788347941180",
    "slug": "mountain-brooke-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Mountain Brooke – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "936 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Mountain Brook House Kit – 936 Sq Ft 2-Bedroom, 1-Bathroom 1-Story Home</strong></h3>\n<p>The <strong>Mountain Brook House Kit</strong> features <strong>936 sq ft</strong> of living space with a <strong>2-bedroom, 1-bathroom</strong> layout. Its single-story design is ideal for families or individuals seeking an efficient, cozy home. Built with <strong>panelized construction</strong>, the Mountain Brook kit streamlines the building process, cutting construction time by up to 60% while remaining affordable.<meta charset=\"utf-8\"></p>\n<p><strong>Floor Plan</strong><br><strong>936 SQ. FT.</strong><br><strong>26'-0\"W x 36'-0\"D</strong></p>\n<ul>\n<li>\n<strong>Living Room</strong>: 12'-6\" x 15'-2\"</li>\n<li>\n<strong>Kitchen</strong>: 12'-6\" x 9'-6\"</li>\n<li>\n<strong>Dining</strong>: 12'-6\" x 8'-0\"</li>\n<li>\n<strong>Master Bedroom</strong>: 9'-8\" x 11'-4\"</li>\n<li>\n<strong>Bedroom #2</strong>: 9'-6\" x 10'-0\"</li>\n</ul>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>Pre-cut floor trusses, panelized walls, roof trusses, windows, insulation, shingles, drywall, and delivery included.</li>\n<li>Customizable floor plans to make the home truly your own.</li>\n<li>Built to meet local building codes for wind, snow, and hurricane resistance.</li>\n</ul>\n<p>For help finding a local contractor or exploring <strong>turnkey services</strong>, contact us today.</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Turnaround time is <strong>14 to 16 weeks</strong>. For inquiries, call <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Browse our wide range of <strong>home plans</strong>, from cozy cabins to large family homes up to <strong>4,750 sq ft</strong>!</p>\n<p><em><strong>SEE FLOOR PLANS AND RENDERINGS BELOW OF A RECENT CUSTOMERS BUILD TO SEE WHAT THE POTENTIAL OF THIS BEAUTIFUL HOUSE KIT LOOKS LIKE WHEN ITS FULLY BUILT!</strong></em></p>\n<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/_ZXPTIJDEP0?si=QrO1_KUbNBQR5_Dq\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>",
    "sqft": 936,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 102900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/mountain1.jpg?v=1773079162",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/mountain1.jpg?v=1773079162",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/mountain1.jpg?v=1773079162"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/mountain1.jpg?v=1773079162",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "936 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9788366913852",
    "slug": "alpine-glen-duplex-house-kit-home-kit",
    "name": "Alpine Glen Duplex House Kit - Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "750 SQ FT Engineered Home Plan",
    "description": "<ul>\n<li>\n<strong>Alpine Glen Duplex House Kit.</strong>\n<h3><strong>Floor Plan </strong></h3>\n<p><strong>Total Area:</strong> 971 SQ. FT.<br><strong>Dimensions:</strong> 28'-0\" W x 56'-0\" D</p>\n<h4><strong>Room Dimensions:</strong></h4>\n<ul>\n<li>\n<strong>Living Room:</strong> 15'-1\" x 12'-0\" / 13'-8\"</li>\n<li>\n<strong>Kitchen:</strong> 10'-4\" x 9'-0\"</li>\n<li>\n<strong>Dining Area:</strong> 15'-1\" x 8'-0\"</li>\n<li>\n<strong>Master Bedroom:</strong> 12'-0\" x 12'-6\"</li>\n<li>\n<strong>Bedroom #2:</strong> 12'-4\" x 9'-0\"</li>\n<li>\n<strong>Garage:</strong> 12'-0\" x 22'-0\"</li>\n</ul>\n</li>\n<li>\n</li>\n<li>\n<meta charset=\"utf-8\">\n<div class=\"lf-image-title\"><strong>Main Floor</strong></div>\n<div class=\"lf-image-label uk-text-muted uk-text-uppercase uk-text-small\">\n<p><strong>Unit A 971 SQ. FT. / Unit B 1059 SQ. FT.</strong></p>\n</div>\n<ul>\n<li>\n</li>\n</ul>\n<p>This thoughtfully designed layout offers a <strong>spacious living area, an efficient kitchen and dining space, and comfortable bedrooms</strong>, all within a compact yet functional footprint.</p>\n</li>\n</ul>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>Pre-cut floor trusses, panelized walls, roof trusses, windows, insulation, shingles, drywall, and delivery included.</li>\n<li>Customizable floor plans to make the home truly your own.</li>\n<li>Built to meet local building codes for wind, snow, and hurricane resistance.</li>\n</ul>\n<p>For help finding a local contractor or exploring <strong>turnkey services</strong>, contact us today.</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Turnaround time is <strong>14 to 16 weeks</strong>. For inquiries, call <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Browse our wide range of <strong>home plans</strong>, from cozy cabins to large family homes up to <strong>4,750 sq ft</strong>!</p>\n<p><em><strong>SEE FLOOR PLANS AND RENDERINGS BELOW OF A RECENT CUSTOMERS BUILD TO SEE WHAT THE POTENTIAL OF THIS BEAUTIFUL HOUSE KIT LOOKS LIKE WHEN ITS FULLY BUILT!</strong></em></p>",
    "sqft": 750,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 145000,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/alpine1.jpg?v=1732470264",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/alpine1.jpg?v=1732470264",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/alpine1.jpg?v=1732470264"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/alpine1.jpg?v=1732470264",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "750 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes",
      "commercial-modular-buildings"
    ]
  },
  {
    "id": "9788376777020",
    "slug": "tuscany-hillside-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Tuscany Hillside – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "1004 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Tuscany Hillside House Kit – 1004 Sq Ft 2-Bedroom, 1.5-Bathroom 1-Story Home</strong></h3>\n<p>The <strong>Tuscany Hillside House Kit</strong> offers <strong>1,004 sq ft</strong> of elegant, single-story living space. With <strong>2 bedrooms</strong> and <strong>1.5 bathrooms</strong>, this home combines functionality and style, making it perfect for small families, couples, or those seeking a serene retreat. The <strong>panelized construction</strong> reduces build time by up to 60%, making it an affordable and efficient solution for DIY builders or contractors.<meta charset=\"utf-8\"></p>\n<p><strong>Floor Plan</strong><br><strong>1004 SQ. FT.</strong><br><strong>26'-0\"W x 44'-0\"D</strong></p>\n<ul>\n<li style=\"list-style-type: none;\">\n<ul>\n<li>\n<strong>Living Room</strong>: 15'-0\" x 13'-4\"</li>\n<li>\n<strong>Kitchen</strong>: 10'-10\" x 12'-0\"</li>\n<li>\n<strong>Dining</strong>: 10'-10\" x 8'-0\"</li>\n<li>\n<strong>Master Bedroom</strong>: 11'-6\" x 11'-6\"</li>\n<li>\n<strong>Bedroom #2</strong>: 11'-6\" x 9'-0\"\n<p> </p>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>Pre-cut trusses, panelized walls, roof trusses, windows, insulation, shingles, drywall, and delivery included.</li>\n<li>Customizable floor plans to ensure the home reflects your personal style and needs.</li>\n<li>Built to meet local codes for wind, snow, and hurricane resistance.</li>\n</ul>\n<p>For help finding a local contractor or exploring <strong>turnkey services</strong>, contact us today.</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Turnaround time is <strong>14 to 16 weeks</strong>. For inquiries, call <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Browse our extensive collection of <strong>home plans</strong>, ranging from compact designs to expansive layouts up to <strong>4,750 sq ft</strong>!</p>\n</li>\n</ul>\n</li>\n</ul>\n<p><em><strong>SEE FLOOR PLANS AND RENDERINGS BELOW OF A RECENT CUSTOMERS BUILD TO SEE WHAT THE POTENTIAL OF THIS BEAUTIFUL HOUSE KIT LOOKS LIKE WHEN ITS FULLY BUILT!</strong></em></p>",
    "sqft": 1004,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 110900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/tuscany.jpg?v=1732470463",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/tuscany.jpg?v=1732470463",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/tuscany.jpg?v=1732470463"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/tuscany.jpg?v=1732470463",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1004 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9788390801724",
    "slug": "alpine-chalet-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Alpine Chalet – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "1016 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Alpine Chalet House Kit – 1016 Sq Ft 2-Bedroom, 2-Bathroom Chalet</strong></h3>\n<p>The <strong>Alpine Chalet House Kit</strong> is a stunning <strong>1,016 sq ft</strong> design featuring <strong>2 bedrooms</strong> and <strong>2 bathrooms</strong>. Perfect for mountain retreats or everyday living, this chalet-style home combines elegance and comfort. With its <strong>panelized construction</strong>, building is efficient, reducing time and labor by up to 60%. The design reflects the charm of alpine living with modern practicality.</p>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>Includes pre-cut trusses, panelized walls, roof trusses, windows, shingles, insulation, drywall, and delivery.</li>\n<li>Floor plan customization is welcomed to ensure it suits your needs.</li>\n<li>Built to meet local codes for wind, snow, and hurricane resistance.</li>\n</ul>\n<p>For turnkey build services or help finding a contractor, contact us today.</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Turnaround time is <strong>14 to 16 weeks</strong>. For inquiries, call <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Check out our wide variety of <strong>home plans</strong>, from compact homes to spacious designs up to <strong>4,750 sq ft</strong>!</p>\n<p><em><strong>SEE FLOOR PLANS AND RENDERINGS BELOW OF A RECENT CUSTOMERS BUILD TO SEE WHAT THE POTENTIAL OF THIS BEAUTIFUL HOUSE KIT LOOKS LIKE WHEN ITS FULLY BUILT!</strong></em></p>",
    "sqft": 1016,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 111900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/e_Apr_14_2025_10_31_30_PM.png?v=1744687746",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/e_Apr_14_2025_10_31_30_PM.png?v=1744687746",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/e_Apr_14_2025_10_31_30_PM.png?v=1744687746"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/e_Apr_14_2025_10_31_30_PM.png?v=1744687746",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1016 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9788394209596",
    "slug": "harbor-light-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Harbor Light – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "1054 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Harbor Light House Kit – 1054 Sq Ft 3-Bedroom, 1-Bathroom Home</strong></h3>\n<p>The <strong>Harbor Light House Kit</strong> offers <strong>1,054 sq ft</strong> of thoughtfully designed space, featuring <strong>3 bedrooms</strong> and <strong>1 bathroom</strong>. The spacious, <strong>bright living room with bay windows</strong> creates an inviting ambiance, while the <strong>convenient rear entry</strong> provides direct access to the kitchen or basement. This versatile layout is perfect for families or those seeking functional elegance.<meta charset=\"utf-8\"></p>\n<p><strong>Floor Plan</strong><br><strong>1054 SQ. FT.</strong><br><strong>40'-0\"W x 26'-0\"D</strong></p>\n<ul>\n<li>\n<strong>Living Room</strong>: 17'-0\" x 11'-10\"</li>\n<li>\n<strong>Kitchen/Dining</strong>: 16'-2\" x 12'-8\"</li>\n<li>\n<strong>Master Bedroom</strong>: 12'-9\" x 9'-0\"</li>\n<li>\n<strong>Bedroom #2</strong>: 8'-6\" x 10'-10\"</li>\n<li>\n<strong>Bedroom #3</strong>: 9'-0\" x 11'-10\"</li>\n</ul>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>Pre-cut trusses, panelized walls, roof trusses, windows, shingles, insulation, drywall, and delivery included.</li>\n<li>Floor plan customization to make the home uniquely yours.</li>\n<li>Built to meet local codes for wind, snow, and hurricane resistance.</li>\n</ul>\n<p>For <strong>turnkey services</strong> or help finding a contractor, contact us today.</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Turnaround time is <strong>14 to 16 weeks</strong>. For inquiries, call <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Discover our wide array of <strong>home plans</strong>, from cozy dwellings to expansive layouts up to <strong>4,750 sq ft</strong>!</p>\n<p><em><strong>SEE FLOOR PLANS AND RENDERINGS BELOW OF A RECENT CUSTOMERS BUILD TO SEE WHAT THE POTENTIAL OF THIS BEAUTIFUL HOUSE KIT LOOKS LIKE WHEN ITS FULLY BUILT!</strong></em></p>",
    "sqft": 1054,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 115900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/harbors.png?v=1746503736",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/harbors.png?v=1746503736",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/harbors.png?v=1746503736"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/harbors.png?v=1746503736",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1054 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "9788403089724",
    "slug": "golden-shore-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit",
    "name": "Golden Shore – Panelized SIP Panel House Kit | Energy-Efficient SIP Home Kit",
    "series": "Architectural Series",
    "category": "House Kits",
    "architecturalStyle": "Modern Homes",
    "tagline": "1060 SQ FT Engineered Home Plan",
    "description": "<h3><strong>Golden Shore House Kit – 1060 Sq Ft 2-Bedroom, 1-Bathroom Home</strong></h3>\n<p>The <strong>Golden Shore House Kit</strong> offers <strong>1,060 sq ft</strong> of modern and cozy living space. This <strong>2-bedroom, 1-bathroom</strong> home features <strong>large windows</strong> that flood the interior with natural light, creating an open and airy atmosphere. Its practical and elegant design makes it ideal for small families or those seeking a bright and welcoming retreat.<meta charset=\"utf-8\"></p>\n<p><strong>Floor Plan</strong><br><strong>1060 SQ. FT.</strong><br><strong>36'-0\"W x 32'-0\"D</strong></p>\n<ul>\n<li>\n<strong>Living Room</strong>: 18'-0\" x 15'-0\"</li>\n<li>\n<strong>Kitchen</strong>: 10'-4\" x 12'-0\"</li>\n<li>\n<strong>Dining</strong>: 10'-0\" x 8'-6\"</li>\n<li>\n<strong>Bedroom #1</strong>: 12'-0\" x 10'-0\"</li>\n<li>\n<strong>Bedroom #2</strong>: 12'-0\" x 12'-0\"</li>\n</ul>\n<h4><strong>Key Features</strong></h4>\n<ul>\n<li>Includes pre-cut trusses, panelized walls, roof trusses, windows, shingles, insulation, drywall, and delivery.</li>\n<li>Customizable floor plans to make it uniquely yours.</li>\n<li>Built to meet local codes for wind, snow, and hurricane resistance.</li>\n</ul>\n<p>For turnkey services or contractor recommendations, contact us today.</p>\n<h4><strong>Turnaround Times and Support</strong></h4>\n<p>Turnaround time is <strong>14 to 16 weeks</strong>. For inquiries, call <strong>502-298-8946</strong> or fill out our contact form for a response within <strong>24 to 48 hours</strong>.</p>\n<h4><strong>Explore Our Home Plans</strong></h4>\n<p>Browse our vast selection of <strong>home plans</strong>, ranging from compact cottages to expansive homes up to <strong>4,750 sq ft</strong>!</p>\n<p><em><strong>SEE FLOOR PLANS AND RENDERINGS BELOW OF A RECENT CUSTOMERS BUILD TO SEE WHAT THE POTENTIAL OF THIS BEAUTIFUL HOUSE KIT LOOKS LIKE WHEN ITS FULLY BUILT!</strong></em></p>",
    "sqft": 1060,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 116900,
    "dimensions": "24x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/8573835e-2c8b-45fb-b78f-f29b4a1f10d2.png?v=1744687809",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/8573835e-2c8b-45fb-b78f-f29b4a1f10d2.png?v=1744687809",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/8573835e-2c8b-45fb-b78f-f29b4a1f10d2.png?v=1744687809"
    ],
    "floorPlanImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/8573835e-2c8b-45fb-b78f-f29b4a1f10d2.png?v=1744687809",
    "features": [
      "Precision Light-Gauge Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Severe Snow & Wind Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1060 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Frame Type",
        "value": "Light Gauge Galvanized Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Timber Deck",
        "price": 12500,
        "description": "Composite decking & timber posts"
      },
      {
        "id": "opt-2",
        "name": "R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "High-efficiency thermal barrier"
      }
    ],
    "tags": [
      "Featured",
      "Turnkey",
      "Modular"
    ],
    "collections": [
      "house-kits",
      "sip-panel-homes",
      "turnkey-homes"
    ]
  },
  {
    "id": "10286602715452",
    "slug": "a-frame-metal-house-kit",
    "name": "A-Frame Panelized Metal House Kit",
    "series": "Essential Series",
    "category": "A-Frames",
    "architecturalStyle": "Modern Homes",
    "tagline": "901 Sq Ft • 2 Bed • 1 Bath A-Frame Homes",
    "description": "<p><strong>901 Sq Ft Panelized Black A-Frame House Kit — Now On Sale</strong></p>\n<p>If you’ve been searching for the perfect panelized A-frame house kit, your search ends here. Our striking Black A-Frame delivers modern design, efficient living space, and a streamlined installation process — making it an ideal choice for a primary residence, vacation retreat, or high-demand rental property.</p>\n<p>With <strong>901 square feet of livable space</strong>, this thoughtfully designed home combines architectural appeal with practical functionality. The panelized construction system allows for a faster, more efficient build compared to traditional methods, helping you move from delivery to completion with confidence.</p>\n<h3>Limited-Time Sale Pricing</h3>\n<ul>\n<li>\n<p><strong>Sale Price:</strong> $74,900 with <strong>FREE shipping</strong></p>\n</li>\n<li>\n<p><strong>Regular Price:</strong> $84,900</p>\n</li>\n</ul>\n<p>Due to exceptionally high demand, current production time is approximately <strong>18 weeks from the date of order</strong>.</p>\n<h3>Built for Flexibility</h3>\n<p>This A-frame house kit can be <strong>modified to help meet local building codes</strong> when required, giving you added peace of mind as you plan your project.</p>\n<p>Call <strong>812-595-4033</strong> today to place your order or speak with a cabin specialist about customization options.</p>\n<p>Secure yours now and bring your A-frame vision to life with a home designed for durability, style, and lasting value.</p>",
    "sqft": 901,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 74900,
    "dimensions": "Custom Dimensions",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Steel Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/afrzm.png?v=1770169284",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/afrz.png?v=1770169129",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/afrzz.png?v=1770169105"
    ],
    "floorPlanImage": "",
    "floorPlan": "",
    "videoUrl": "",
    "videoDuration": "",
    "videoTitle": "",
    "features": [
      "Precision Commercial-Grade Galvanized Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Dimensions",
        "value": "Custom Dimensions"
      },
      {
        "label": "Living Area",
        "value": "901 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Stories",
        "value": "1 Level"
      },
      {
        "label": "Frame Type",
        "value": "100% Commercial-Grade Galvanized Light Gauge Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Steel Frame Warranty"
      },
      {
        "label": "Wind Rating",
        "value": "Up to 150 MPH"
      },
      {
        "label": "Snow Load",
        "value": "50 PSF Ground Snow Load Rated"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Wrap-Around Timber Deck",
        "price": 12500,
        "description": "Solid timber posts & weather-resistant composite decking"
      },
      {
        "id": "opt-2",
        "name": "Premium R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "Extreme thermal envelope for energy cost reduction"
      },
      {
        "id": "opt-3",
        "name": "16ft Multi-Slide Panoramic Glass Wall",
        "price": 9400,
        "description": "Black aluminum double-pane argon low-E sliders"
      }
    ],
    "variants": [
      {
        "id": "52707658367292",
        "title": "Standard Build Package",
        "price": 74900,
        "sku": "",
        "available": true,
        "option1": "Default Title"
      }
    ],
    "tags": [],
    "collections": [
      "house-plans",
      "home-plans",
      "modular-homes",
      "house-kit",
      "metal-house-kits-1",
      "cabin-builders-near-me",
      "home-builders-near-me",
      "affordable-housing",
      "kit-homes",
      "a-frame-cabins-aframe-cabins",
      "tiny-house-builder",
      "tiny-homes",
      "made-in-usa",
      "made-in-america",
      "sips-panel-homes",
      "cabin-kits-in-alabama",
      "cabin-kits-in-alaska",
      "cabin-kits-in-arizona",
      "cabin-kits-in-arkansas",
      "cabin-kits-in-california",
      "cabin-kits-in-colorado",
      "cabin-kits-in-connecticut",
      "cabin-kits-in-delaware",
      "cabin-kits-in-florida",
      "cabin-kits-in-georgia",
      "cabin-kits-in-hawaii",
      "cabin-kits-in-idaho",
      "cabin-kits-in-illinois",
      "cabin-kits-in-indiana",
      "cabin-kits-in-iowa",
      "cabin-kits-in-kansas",
      "cabin-kits-in-kentucky",
      "cabin-kits-in-louisiana",
      "cabin-kits-in-maine",
      "cabin-kits-in-maryland",
      "cabin-kits-in-massachusetts",
      "cabin-kits-in-michigan",
      "cabin-kits-in-minnesota",
      "cabin-kits-in-mississippi",
      "cabin-kits-in-missouri",
      "cabin-kits-in-montana",
      "cabin-kits-in-nebraska",
      "cabin-kits-in-nevada",
      "cabin-kits-in-new-hampshire",
      "cabin-kits-in-new-jersey",
      "cabin-kits-in-new-mexico",
      "cabin-kits-in-new-york",
      "cabin-kits-in-north-carolina",
      "cabin-kits-in-north-dakota",
      "cabin-kits-in-ohio",
      "cabin-kits-in-oklahoma",
      "cabin-kits-in-oregon",
      "cabin-kits-in-pennsylvania",
      "cabin-kits-in-rhode-island",
      "cabin-kits-in-south-carolina",
      "cabin-kits-in-south-dakota",
      "cabin-kits-in-tennessee",
      "cabin-kits-in-texas",
      "cabin-kits-in-utah",
      "cabin-kits-in-vermont",
      "cabin-kits-in-virginia",
      "cabin-kits-in-washington",
      "cabin-kits-in-west-virgina",
      "cabin-kits-in-wisconsin",
      "cabin-kits-in-wyoming",
      "log-cabin-kits-in-alabama",
      "cabins-for-sale",
      "cabins-for-sale-in-alabama",
      "cabins-for-sale-in-alaska",
      "cabins-for-sale-in-arizona",
      "cabins-for-sale-in-arkansas",
      "cabins-for-sale-in-california",
      "cabins-for-sale-in-colorado",
      "cabins-for-sale-in-connecticut",
      "cabins-for-sale-in-delaware",
      "cabins-for-sale-in-florida",
      "cabins-for-sale-in-georgia",
      "cabins-for-sale-in-hawaii",
      "cabins-for-sale-in-idaho",
      "cabins-for-sale-in-illinois",
      "cabins-for-sale-in-indiana",
      "cabins-for-sale-in-iowa",
      "cabins-for-sale-in-kansas",
      "cabins-for-sale-in-kentucky",
      "cabins-for-sale-in-louisiana",
      "cabins-for-sale-in-maine",
      "cabins-for-sale-in-maryland",
      "cabins-for-sale-in-massachusetts",
      "cabins-for-sale-in-michigan",
      "cabins-for-sale-in-minnesota",
      "cabins-for-sale-in-mississippi",
      "cabins-for-sale-in-missouri",
      "cabins-for-sale-in-nebraska",
      "cabins-for-sale-in-nevada",
      "cabins-for-sale-in-new-hampshire",
      "cabins-for-sale-in-new-jersey",
      "cabins-for-sale-in-new-mexico",
      "cabins-for-sale-in-new-york",
      "cabins-for-sale-in-north-carolina",
      "tiny-home-builders-in-alabama",
      "tiny-home-builders-in-alaska",
      "tiny-home-builders-in-arizona",
      "tiny-home-builders-in-arkansas",
      "tiny-home-builders-in-california",
      "tiny-home-builders-in-colorado",
      "tiny-home-builders-in-connecticut",
      "tiny-home-builders-in-delaware",
      "tiny-home-builders-in-florida",
      "tiny-home-builders-in-georgia",
      "tiny-home-builders-in-hawaii",
      "tiny-home-builders-in-idaho",
      "tiny-home-builders-in-illinois",
      "tiny-home-builders-in-indiana",
      "tiny-home-builders-in-iowa",
      "tiny-home-builders-in-kansas",
      "tiny-home-builders-in-kentucky",
      "tiny-home-builders-in-louisiana",
      "tiny-home-builders-in-maine",
      "tiny-home-builders-in-maryland",
      "tiny-home-builders-in-massachusetts",
      "tiny-home-builders-in-michigan",
      "tiny-home-builders-in-minnesota",
      "tiny-home-builders-in-mississippi",
      "tiny-home-builders-in-missouri",
      "tiny-home-builders-in-montana",
      "tiny-home-builders-in-nebraska",
      "tiny-home-builders-in-nevada",
      "tiny-home-builders-in-new-hampshire",
      "tiny-home-builders-in-new-jersey",
      "tiny-home-builders-in-new-mexico",
      "tiny-home-builders-in-new-york",
      "tiny-home-builders-in-north-carolina",
      "tiny-home-builders-in-north-dakota",
      "tiny-home-builders-in-ohio",
      "tiny-home-builders-in-oklahoma",
      "tiny-home-builders-in-oregon",
      "tiny-home-builders-in-pennsylvania",
      "tiny-home-builders-in-rhode-island",
      "tiny-home-builders-in-south-carolina",
      "tiny-home-builders-in-south-dakota",
      "tiny-home-builders-in-tennessee",
      "tiny-home-builders-in-texas",
      "tiny-home-builders-in-utah",
      "tiny-home-builders-in-vermont",
      "tiny-home-builders-in-virginia",
      "tiny-home-builders-in-washington",
      "tiny-home-builders-in-west-virginia",
      "tiny-home-builders-in-wisconsin",
      "tiny-home-builders",
      "timber-frame-homes",
      "timber-frame-builders",
      "timber-frame-home-kits",
      "timber-frame-house-plans",
      "house-plans-home-plans-cabin-plans",
      "modular-cabins-alabama",
      "modular-cabins-alaska",
      "modular-cabins-arizona",
      "modular-cabins-arkansas",
      "modular-cabins-california",
      "modular-cabins-colorado",
      "modular-cabins-connecticut",
      "modular-cabins-delaware",
      "modular-cabins-florida",
      "modular-cabins-georgia",
      "modular-cabins-hawaii",
      "modular-cabins-idaho",
      "modular-cabins-illinois",
      "modular-cabins-indiana",
      "modular-cabins-iowa",
      "modular-cabins-kansas",
      "modular-cabins-kentucky",
      "modular-cabins-louisiana",
      "modular-cabins-maine",
      "modular-cabins-maryland",
      "modular-cabins-massachusetts",
      "modular-cabins-michigan",
      "modular-cabins-minnesota",
      "modular-cabins-mississippi",
      "modular-cabins-missouri",
      "modular-cabins-montana",
      "modular-cabins-nebraska",
      "modular-cabins-nevada",
      "modular-cabins-new-hampshire",
      "modular-cabins-new-jersey",
      "modular-cabins-new-mexico",
      "modular-cabins-new-york",
      "modular-cabins-north-carolina",
      "modular-cabins-north-dakota",
      "modular-cabins-ohio",
      "modular-cabins-oklahoma",
      "modular-cabins-oregon",
      "modular-cabins-pennsylvania",
      "modular-cabins-rhode-island",
      "modular-cabins-south-carolina",
      "modular-cabins-south-dakota",
      "modular-cabins-tennessee",
      "modular-cabins-texas",
      "modular-cabins-utah",
      "modular-cabins-vermont",
      "modular-cabins-virginia",
      "modular-cabins-washington",
      "modular-cabins-west-virginia",
      "modular-cabins-wisconsin",
      "modular-cabins-wyoming",
      "prefab-cabins-alabama",
      "prefab-cabins",
      "prefab-cabins-alaska",
      "prefab-cabins-arizona",
      "commercial-modular-buildings",
      "commercial-modular-builders"
    ]
  },
  {
    "id": "10348351619388",
    "slug": "lakeside-haven-tiny-home-affordable-house-kit-2-bed-1-bath",
    "name": "Lakeside Haven Tiny Home Affordable House Kit (2 bed 1 bath)",
    "series": "Essential Series",
    "category": "Tiny Homes",
    "architecturalStyle": "Modern Homes",
    "tagline": "504 Sq Ft • 2 Bed • 1 Bath Modular Design",
    "description": "<h2><strong>LAKESIDE HAVEN TINY HOME – DIY HOUSE KIT</strong></h2>\n<p><strong>Compact. Affordable. Built to Last.</strong></p>\n<p>The <strong>Lakeside Haven Tiny Home DIY House Kit</strong> is designed for buyers who want a <strong>simple, efficient, and affordable living solution</strong> without sacrificing durability or style.</p>\n<p>With <strong>504 sq ft of living space</strong>, this <strong>2 bedroom / 1 bathroom layout</strong> is perfect for tiny home living, Airbnb rentals, guest houses, or minimalist lifestyles. The narrow footprint makes it <strong>extremely fast to build and highly cost-efficient</strong>.</p>\n<p>Small size. Big opportunity.</p>\n<hr>\n<h3><strong>WHAT’S INCLUDED</strong></h3>\n<p>14x36x8 Basic Shell<br>Porch as shown</p>\n<p>Doors:<br>• (2) 3' House Doors</p>\n<p>Windows (Double Pane Vinyl):<br>• (5) 3x5 Windows<br>• (1) 3x3 Window</p>\n<hr>\n<h3><strong>STRUCTURAL BUILD</strong></h3>\n<p>• Exterior Framing: 2x6 Stud Walls (strong, insulatable, code-ready)<br>• Interior Framing: 2x4 Stud Walls (53 ft included)<br>• Trusses at 2' on center<br>• Studs at 16\" on center<br>• House wrap included</p>\n<hr>\n<h3><strong>ROOF &amp; EXTERIOR</strong></h3>\n<p>• <strong>26 Gauge Metal Roof – 40 Year Warranty</strong><br>• <strong>26 Gauge Metal Siding INCLUDED</strong><br>• Soffit and fascia overhang<br>• 20 color options available</p>\n<p>Upgrades Available:<br>• OSB sheathing (recommended to source locally to save on shipping)<br>• Premium board &amp; batten metal siding</p>\n<hr>\n<h3><strong>KITS DETAILS</strong></h3>\n<p>Price: <strong>$24,900</strong><br>Regular Price: $34,900</p>\n<p>Bedrooms: 2<br>Bathrooms: 1<br>Garage: No</p>\n<p>Total Living Space: 504 sq.ft.<br>Total Under Roof: 720 sq.ft.</p>\n<p>Dimensions: 36 ft (L) x 14 ft (D) x 8 ft (H)<br>Roof Pitch: 4/12</p>\n<hr>\n<h3><strong>IMPORTANT FOUNDATION NOTE</strong></h3>\n<p>This kit <strong>does NOT include a subfloor</strong></p>\n<p>• Most customers install on a <strong>concrete slab</strong><br>• Can also be installed on a <strong>crawlspace, piers, or basement</strong></p>\n<p>If not installing on a slab, <strong>buyer is responsible for building their own subfloor system</strong></p>\n<hr>\n<h3><strong>ENGINEERING &amp; PERMIT NOTE (IMPORTANT)</strong></h3>\n<p>• This kit <strong>does NOT include engineered or stamped drawings</strong><br>• A <strong>generic floor plan is provided FREE</strong><br>• We also offer <strong>basic blueprints for sale</strong></p>\n<p>Buyer is responsible to:<br>✔ Get plans approved for their county<br>✔ Work with a local engineer or architect if required<br>✔ Identify and request any upgrades needed to meet local code before ordering</p>\n<p><strong>All code compliance and engineering requirements are the buyer’s responsibility prior to ordering</strong></p>\n<hr>\n<h3><strong>SHIPPING</strong></h3>\n<p><strong>FREE SHIPPING – LIMITED TIME</strong></p>\n<p>• Applies to the <strong>Lower 48 States ONLY</strong><br>• Alaska and Hawaii excluded<br>• Additional fees may apply depending on location<br>• Pricing and delivery offers are subject to change without notice</p>\n<hr>\n<h3><strong>PRICING</strong></h3>\n<p><strong>NOW ONLY $24,900</strong></p>\n<hr>\n<h3><strong>WHY THIS KIT SELLS FAST</strong></h3>\n<p>✔ 2 bed / 1 bath tiny home layout<br>✔ Strong 2x6 exterior framing (locked standard)<br>✔ Full 26 gauge metal roof and siding included<br>✔ Ultra small footprint = fastest, cheapest builds<br>✔ Perfect for Airbnb, rentals, or backyard homes<br>✔ Built for long-term durability</p>\n<hr>\n<h3><strong>LIMITED TIME OFFER</strong></h3>\n<p>Call <strong>812-595-4033</strong> to order</p>\n<p>If you're looking for a <strong>simple, affordable, and high-demand tiny home kit</strong>, the Lakeside Haven Tiny Home is one of the best values on the market today.</p>",
    "sqft": 504,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 24900,
    "dimensions": "14x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Steel Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/t1_11783bde-f744-4ba0-a3c5-ebf46ee297b7.jpg?v=1774677531",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/t1_11783bde-f744-4ba0-a3c5-ebf46ee297b7.jpg?v=1774677531",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/t1_11783bde-f744-4ba0-a3c5-ebf46ee297b7.jpg?v=1774677531",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/t2_e0a4ef1f-1127-4c96-a00f-dc4ee42fd31a.jpg?v=1774677530",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/choose_colorz_67a685d5-542e-4fae-959f-ad51ab051334.png?v=1775769412"
    ],
    "floorPlanImage": "",
    "floorPlan": "",
    "videoUrl": "",
    "videoDuration": "",
    "videoTitle": "",
    "features": [
      "Precision Commercial-Grade Galvanized Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Dimensions",
        "value": "14x36 ft"
      },
      {
        "label": "Living Area",
        "value": "504 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Stories",
        "value": "1 Level"
      },
      {
        "label": "Frame Type",
        "value": "100% Commercial-Grade Galvanized Light Gauge Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Steel Frame Warranty"
      },
      {
        "label": "Wind Rating",
        "value": "Up to 150 MPH"
      },
      {
        "label": "Snow Load",
        "value": "50 PSF Ground Snow Load Rated"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Wrap-Around Timber Deck",
        "price": 12500,
        "description": "Solid timber posts & weather-resistant composite decking"
      },
      {
        "id": "opt-2",
        "name": "Premium R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "Extreme thermal envelope for energy cost reduction"
      },
      {
        "id": "opt-3",
        "name": "16ft Multi-Slide Panoramic Glass Wall",
        "price": 9400,
        "description": "Black aluminum double-pane argon low-E sliders"
      }
    ],
    "variants": [
      {
        "id": "52928805699900",
        "title": "affordable house kit (Installation NOT included)",
        "price": 24900,
        "sku": "",
        "available": true,
        "option1": "affordable house kit (Installation NOT included)"
      }
    ],
    "tags": [],
    "collections": [
      "house-plans",
      "home-plans",
      "modular-homes",
      "house-kit",
      "cabin-builders-near-me",
      "home-builders-near-me",
      "affordable-housing",
      "kit-homes",
      "tiny-house-builder",
      "tiny-homes",
      "made-in-usa",
      "made-in-america",
      "become-a-cabin-dealer-tiny-home-broker-program",
      "cabin-kits-in-alabama",
      "cabin-kits-in-alaska",
      "cabin-kits-in-arizona",
      "cabin-kits-in-arkansas",
      "cabin-kits-in-california",
      "cabin-kits-in-colorado",
      "cabin-kits-in-connecticut",
      "cabin-kits-in-delaware",
      "cabin-kits-in-florida",
      "cabin-kits-in-georgia",
      "cabin-kits-in-hawaii",
      "cabin-kits-in-idaho",
      "cabin-kits-in-illinois",
      "cabin-kits-in-indiana",
      "cabin-kits-in-iowa",
      "cabin-kits-in-kansas",
      "cabin-kits-in-kentucky",
      "cabin-kits-in-louisiana",
      "cabin-kits-in-maine",
      "cabin-kits-in-maryland",
      "cabin-kits-in-massachusetts",
      "cabin-kits-in-michigan",
      "cabin-kits-in-minnesota",
      "cabin-kits-in-mississippi",
      "cabin-kits-in-missouri",
      "cabin-kits-in-montana",
      "cabin-kits-in-nebraska",
      "cabin-kits-in-nevada",
      "cabin-kits-in-new-hampshire",
      "cabin-kits-in-new-jersey",
      "cabin-kits-in-new-mexico",
      "cabin-kits-in-new-york",
      "cabin-kits-in-north-carolina",
      "cabin-kits-in-north-dakota",
      "cabin-kits-in-ohio",
      "cabin-kits-in-oklahoma",
      "cabin-kits-in-oregon",
      "cabin-kits-in-pennsylvania",
      "cabin-kits-in-rhode-island",
      "cabin-kits-in-south-carolina",
      "cabin-kits-in-south-dakota",
      "cabin-kits-in-tennessee",
      "cabin-kits-in-texas",
      "cabin-kits-in-utah",
      "cabin-kits-in-vermont",
      "cabin-kits-in-virginia",
      "cabin-kits-in-washington",
      "cabin-kits-in-west-virgina",
      "cabin-kits-in-wisconsin",
      "cabin-kits-in-wyoming",
      "log-cabin-kits-in-alabama",
      "cabins-for-sale",
      "cabins-for-sale-in-alabama",
      "cabins-for-sale-in-alaska",
      "cabins-for-sale-in-arizona",
      "cabins-for-sale-in-arkansas",
      "cabins-for-sale-in-california",
      "cabins-for-sale-in-colorado",
      "cabins-for-sale-in-connecticut",
      "cabins-for-sale-in-delaware",
      "cabins-for-sale-in-florida",
      "cabins-for-sale-in-georgia",
      "cabins-for-sale-in-hawaii",
      "cabins-for-sale-in-idaho",
      "cabins-for-sale-in-illinois",
      "cabins-for-sale-in-indiana",
      "cabins-for-sale-in-iowa",
      "cabins-for-sale-in-kansas",
      "cabins-for-sale-in-kentucky",
      "cabins-for-sale-in-louisiana",
      "cabins-for-sale-in-maine",
      "cabins-for-sale-in-maryland",
      "cabins-for-sale-in-massachusetts",
      "cabins-for-sale-in-michigan",
      "cabins-for-sale-in-minnesota",
      "cabins-for-sale-in-mississippi",
      "cabins-for-sale-in-missouri",
      "cabins-for-sale-in-nebraska",
      "cabins-for-sale-in-nevada",
      "cabins-for-sale-in-new-hampshire",
      "cabins-for-sale-in-new-jersey",
      "cabins-for-sale-in-new-mexico",
      "cabins-for-sale-in-new-york",
      "cabins-for-sale-in-north-carolina",
      "tiny-home-builders-in-alabama",
      "tiny-home-builders-in-alaska",
      "tiny-home-builders-in-arizona",
      "tiny-home-builders-in-arkansas",
      "tiny-home-builders-in-california",
      "tiny-home-builders-in-colorado",
      "tiny-home-builders-in-connecticut",
      "tiny-home-builders-in-delaware",
      "tiny-home-builders-in-florida",
      "tiny-home-builders-in-georgia",
      "tiny-home-builders-in-hawaii",
      "tiny-home-builders-in-idaho",
      "tiny-home-builders-in-illinois",
      "tiny-home-builders-in-indiana",
      "tiny-home-builders-in-iowa",
      "tiny-home-builders-in-kansas",
      "tiny-home-builders-in-kentucky",
      "tiny-home-builders-in-louisiana",
      "tiny-home-builders-in-maine",
      "tiny-home-builders-in-maryland",
      "tiny-home-builders-in-massachusetts",
      "tiny-home-builders-in-michigan",
      "tiny-home-builders-in-minnesota",
      "tiny-home-builders-in-mississippi",
      "tiny-home-builders-in-missouri",
      "tiny-home-builders-in-montana",
      "tiny-home-builders-in-nebraska",
      "tiny-home-builders-in-nevada",
      "tiny-home-builders-in-new-hampshire",
      "tiny-home-builders-in-new-jersey",
      "tiny-home-builders-in-new-mexico",
      "tiny-home-builders-in-new-york",
      "tiny-home-builders-in-north-carolina",
      "tiny-home-builders-in-north-dakota",
      "tiny-home-builders-in-ohio",
      "tiny-home-builders-in-oklahoma",
      "tiny-home-builders-in-oregon",
      "tiny-home-builders-in-pennsylvania",
      "tiny-home-builders-in-rhode-island",
      "tiny-home-builders-in-south-carolina",
      "tiny-home-builders-in-south-dakota",
      "tiny-home-builders-in-tennessee",
      "tiny-home-builders-in-texas",
      "tiny-home-builders-in-utah",
      "tiny-home-builders-in-vermont",
      "tiny-home-builders-in-virginia",
      "tiny-home-builders-in-washington",
      "tiny-home-builders-in-west-virginia",
      "tiny-home-builders-in-wisconsin",
      "tiny-home-builders",
      "timber-frame-homes",
      "timber-frame-builders",
      "timber-frame-home-kits",
      "timber-frame-house-plans",
      "house-plans-home-plans-cabin-plans",
      "modular-cabins-alabama",
      "modular-cabins-alaska",
      "modular-cabins-arizona",
      "modular-cabins-arkansas",
      "modular-cabins-california",
      "modular-cabins-colorado",
      "modular-cabins-connecticut",
      "modular-cabins-delaware",
      "modular-cabins-florida",
      "modular-cabins-georgia",
      "modular-cabins-hawaii",
      "modular-cabins-idaho",
      "modular-cabins-illinois",
      "modular-cabins-indiana",
      "modular-cabins-iowa",
      "modular-cabins-kansas",
      "modular-cabins-kentucky",
      "modular-cabins-louisiana",
      "modular-cabins-maine",
      "modular-cabins-maryland",
      "modular-cabins-massachusetts",
      "modular-cabins-michigan",
      "modular-cabins-minnesota",
      "modular-cabins-mississippi",
      "modular-cabins-missouri",
      "modular-cabins-montana",
      "modular-cabins-nebraska",
      "modular-cabins-nevada",
      "modular-cabins-new-hampshire",
      "modular-cabins-new-jersey",
      "modular-cabins-new-mexico",
      "modular-cabins-new-york",
      "modular-cabins-north-carolina",
      "modular-cabins-north-dakota",
      "modular-cabins-ohio",
      "modular-cabins-oklahoma",
      "modular-cabins-oregon",
      "modular-cabins-pennsylvania",
      "modular-cabins-rhode-island",
      "modular-cabins-south-carolina",
      "modular-cabins-south-dakota",
      "modular-cabins-tennessee",
      "modular-cabins-texas",
      "modular-cabins-utah",
      "modular-cabins-vermont",
      "modular-cabins-virginia",
      "modular-cabins-washington",
      "modular-cabins-west-virginia",
      "modular-cabins-wisconsin",
      "modular-cabins-wyoming",
      "prefab-cabins-alabama",
      "prefab-cabins",
      "prefab-cabins-alaska",
      "prefab-cabins-arizona",
      "commercial-modular-buildings",
      "commercial-modular-builders"
    ]
  },
  {
    "id": "10426330251580",
    "slug": "the-travis",
    "name": "The Travis Tiny Home/ Park Model RV",
    "series": "Essential Series",
    "category": "Tiny Homes",
    "architecturalStyle": "Modern Homes",
    "tagline": "179 Sq Ft • 1 Bed • 1 Bath Tiny Homes",
    "description": "<p>Overview</p>\n<p>● 8’5′′ wide x 22’3” long overall dimensions (outside measurements)<br>● 8’2” wide x 22’ long = 179 Sq. Ft.<br>● 1 main floor bedroom plus a small loft for storage<br>● 1 full bathroom<br>● RVIA Seal Built to ANSI A119.5 Standards<br>● 8’ wide x 22’ long tandem axle trailer</p>\n<p>Exterior Designs</p>\n<p>● 28 gauge premier rib, metal siding (color TBD)<br>● 28 gauge, premier rib metal roof (color TBD)<br>● 2”x 6” roof rafters, 24” on-center w/ 1/2” OSB underlayment &amp; ice guard<br>● 2”x 6” floor joists, 16” on-center w/ 3⁄4” OSB subfloor<br>● 2”x 4” studs, 16” on-center<br>● OSB sheathing, house wrap &amp; window tape<br>● Anderson 100 series, double pane single hung windows (Black)<br>● Provia 36” full glass entry door (black)<br>● Matte black door hardware w/ deadbolt</p>\n<p>Insulation</p>\n<p>● R13 closed cell spray foam in the walls<br>● R19 closed cell spray foam in the floor &amp; ceiling</p>\n<p>Interior Designs</p>\n<p>● Luxury vinyl plank floor throughout (color TBD)<br>● Painted birch plywood walls and ceiling (painted white)<br>● Solid birch 2 panel bathroom door (painted white)<br>● Matte black door hardware<br>● Removable later to loft area</p>\n<p>Kitchen Designs</p>\n<p>● Custom base &amp; top cabinets w/ flat panel doors (painted color TBD)<br>● 18” x 22” single bowl, drop-In stainless steel sink<br>● Matte black faucet &amp; cabinet hardware<br>● Laminate countertops (color TBD)<br>● Soft close door hinges &amp; drawer slider<br>● 2 burner counter mounted cooktop<br>● Under the counter mini fridge (black)<br>● Microwave free standing (black)<br>● 4′ built-In eating bar (wood stained)</p>\n<p>Bathroom Designs</p>\n<p>● 3’ x 3’ fiberglass shower one piece unit (white)<br>● Matte black shower head &amp; faucets<br>● 24′′ x 24′′ custom vanity w/ cultured marble top with linen closet<br>● Standard elongated toilet (white)<br>● Exhaust vent fan / light combo<br>● Towel bar, toilet paper holder, shower rod (black)</p>\n<p>Utilities</p>\n<p>● 19 gallon electric water heater<br>● Interior outlets (GFCI) &amp; switches w/ (white covers)<br>● Recessed lights throughout<br>● 1 ceiling fan / light combo (black)<br>● 1 exterior wall light (black)<br>● 1 GFCI exterior outlet w/ cover<br>● Bosch ductless mini split 1 outside and 1 inside unit<br>● Safety features include, fire extinguisher, smoke &amp; fire alarms<br>● 50 AMP breaker box w/ conduit for direct tie-In<br>● Plumbing ready to tie into 3” pipe<br>● Water line ready to connect to water supply<br>● 1 frost resistant exterior faucet</p>\n<p>Add-Ons &amp; Upgrades<br>● Corrugated metal exterior siding 1⁄4” ridges (color TBD) + $1,200.00<br>● Corrugated metal exterior roof 1⁄4” ridges (color TBD) + $800.00<br>● Premier legacy rib textured exterior roof + $500.00<br>● Vinyl board &amp; batten exterior siding 8” wide (color TBD) + $750.00<br>● Log exterior half round siding (stained color TBD) + $5,300.00<br>● Metal skirting material only + $1,300.00<br>● Pine T&amp;G interior walls (clear finish) + $3,900.00<br>● Pine T&amp;G interior ceiling (clear finish) + $1,900.00<br>● Pine T&amp;G interior ceiling (dark stain finish) + $2,200.00<br>● Poplar nickel gap interior walls (painted) + $7,800.00<br>● Quartz countertops + $1,800.00<br>● Pine cabinets (clear finish) - $500.00<br>● Butcher block kitchen countertop stained (color TBD) + $1,400.00<br>● Tile backsplash kitchen (subway tile white) + $2,000.00<br>● Incinerating toilet +$5,000.00<br>● Composting toilet +$4,000.00<br>● Queen sized bed frame w/ storage drawers +$4,375.00<br>● 74′′ tall queen sized headboard w/ storage +$5,295.00<br>● Bump out for wash/dryer includes stacked laundry center unit + $4,800.00</p>",
    "sqft": 179,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 81900,
    "dimensions": "Custom Dimensions",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Steel Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/travis2.png?v=1783802415",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/travis2.png?v=1783802415",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/travis2.png?v=1783802415",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/travis.png?v=1783802845",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/travis1.png?v=1783802415"
    ],
    "floorPlanImage": "",
    "floorPlan": "",
    "videoUrl": "",
    "videoDuration": "",
    "videoTitle": "",
    "features": [
      "Precision Commercial-Grade Galvanized Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Dimensions",
        "value": "Custom Dimensions"
      },
      {
        "label": "Living Area",
        "value": "179 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Stories",
        "value": "1 Level"
      },
      {
        "label": "Frame Type",
        "value": "100% Commercial-Grade Galvanized Light Gauge Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Steel Frame Warranty"
      },
      {
        "label": "Wind Rating",
        "value": "Up to 150 MPH"
      },
      {
        "label": "Snow Load",
        "value": "50 PSF Ground Snow Load Rated"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Wrap-Around Timber Deck",
        "price": 12500,
        "description": "Solid timber posts & weather-resistant composite decking"
      },
      {
        "id": "opt-2",
        "name": "Premium R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "Extreme thermal envelope for energy cost reduction"
      },
      {
        "id": "opt-3",
        "name": "16ft Multi-Slide Panoramic Glass Wall",
        "price": 9400,
        "description": "Black aluminum double-pane argon low-E sliders"
      }
    ],
    "variants": [
      {
        "id": "53204296401212",
        "title": "Standard Build Package",
        "price": 81900,
        "sku": "",
        "available": true,
        "option1": "Default Title"
      }
    ],
    "tags": [],
    "collections": [
      "amish-built-rv-park-models",
      "tiny-house-builder",
      "tiny-homes",
      "become-a-cabin-dealer-tiny-home-broker-program",
      "park-model-rv",
      "park-models-for-sale",
      "amish-built-tiny-homes"
    ]
  },
  {
    "id": "10448855957820",
    "slug": "the-harborview-steel-house-kit",
    "name": "The Harborview Steel House Kit",
    "series": "Essential Series",
    "category": "Park Models",
    "architecturalStyle": "Modern Homes",
    "tagline": "720 Sq Ft • 1 Bed • 1 Bath Park Models",
    "description": "",
    "sqft": 720,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 149900,
    "dimensions": "Custom Dimensions",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Steel Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/Bungalow-01_411463f3-2a21-40c2-8aef-4598136e7624.jpg?v=1786102442",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/Bungalow-01_411463f3-2a21-40c2-8aef-4598136e7624.jpg?v=1786102442",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/Bungalow-01_411463f3-2a21-40c2-8aef-4598136e7624.jpg?v=1786102442",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/Bungalow-02_86140dfd-eb59-4f65-a480-48a986a92413.jpg?v=1786102444",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/Bungalow-03_b78184a9-69b1-44b9-b0de-47bee7335aac.jpg?v=1786102447",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/Bungalow-04_5c88dbe6-6883-4dca-a4d5-289f35c21dde.jpg?v=1786102449",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/Bungalow-05_df727e7c-b54d-4a9c-870b-8d3cd4c21cec.jpg?v=1786102451",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/Bungalow-06_5bf5a3dc-20d3-443d-81f0-e1165c90aa59.jpg?v=1786102454",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/The_Harborview_Steel_House_Kit_1786561111248.jpg?v=1786561113",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/The_Harborview_Steel_House_Kit_1786561116048.jpg?v=1786561117",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/The_Harborview_Steel_House_Kit_1786561121299.jpg?v=1786561123",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/The_Harborview_Steel_House_Kit_1786561457705.jpg?v=1786561459",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/The_Harborview_Steel_House_Kit_1786561576375.jpg?v=1786561578"
    ],
    "floorPlanImage": "",
    "floorPlan": "",
    "videoUrl": "",
    "videoDuration": "",
    "videoTitle": "",
    "features": [
      "Precision Commercial-Grade Galvanized Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Dimensions",
        "value": "Custom Dimensions"
      },
      {
        "label": "Living Area",
        "value": "720 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Stories",
        "value": "1 Level"
      },
      {
        "label": "Frame Type",
        "value": "100% Commercial-Grade Galvanized Light Gauge Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Steel Frame Warranty"
      },
      {
        "label": "Wind Rating",
        "value": "Up to 150 MPH"
      },
      {
        "label": "Snow Load",
        "value": "50 PSF Ground Snow Load Rated"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Wrap-Around Timber Deck",
        "price": 12500,
        "description": "Solid timber posts & weather-resistant composite decking"
      },
      {
        "id": "opt-2",
        "name": "Premium R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "Extreme thermal envelope for energy cost reduction"
      },
      {
        "id": "opt-3",
        "name": "16ft Multi-Slide Panoramic Glass Wall",
        "price": 9400,
        "description": "Black aluminum double-pane argon low-E sliders"
      }
    ],
    "variants": [
      {
        "id": "53970048844092",
        "title": "Standard Build Package",
        "price": 149900,
        "sku": "",
        "available": true,
        "option1": "Default Title"
      }
    ],
    "tags": [
      "Models"
    ],
    "collections": [
      "house-plans",
      "home-plans",
      "modular-homes",
      "cabin-builders-near-me",
      "home-builders-near-me",
      "affordable-housing",
      "kit-homes",
      "tiny-house-builder",
      "tiny-homes",
      "made-in-usa",
      "made-in-america",
      "cabin-kits-in-alabama",
      "cabin-kits-in-alaska",
      "cabin-kits-in-arizona",
      "cabin-kits-in-arkansas",
      "cabin-kits-in-california",
      "cabin-kits-in-colorado",
      "cabin-kits-in-connecticut",
      "cabin-kits-in-delaware",
      "cabin-kits-in-florida",
      "cabin-kits-in-georgia",
      "cabin-kits-in-hawaii",
      "cabin-kits-in-idaho",
      "cabin-kits-in-illinois",
      "cabin-kits-in-indiana",
      "cabin-kits-in-iowa",
      "cabin-kits-in-kansas",
      "cabin-kits-in-kentucky",
      "cabin-kits-in-louisiana",
      "cabin-kits-in-maine",
      "cabin-kits-in-maryland",
      "cabin-kits-in-massachusetts",
      "cabin-kits-in-michigan",
      "cabin-kits-in-minnesota",
      "cabin-kits-in-mississippi",
      "cabin-kits-in-missouri",
      "cabin-kits-in-montana",
      "cabin-kits-in-nebraska",
      "cabin-kits-in-nevada",
      "cabin-kits-in-new-hampshire",
      "cabin-kits-in-new-jersey",
      "cabin-kits-in-new-mexico",
      "cabin-kits-in-new-york",
      "cabin-kits-in-north-carolina",
      "cabin-kits-in-north-dakota",
      "cabin-kits-in-ohio",
      "cabin-kits-in-oklahoma",
      "cabin-kits-in-oregon",
      "cabin-kits-in-pennsylvania",
      "cabin-kits-in-rhode-island",
      "cabin-kits-in-south-carolina",
      "cabin-kits-in-south-dakota",
      "cabin-kits-in-tennessee",
      "cabin-kits-in-texas",
      "cabin-kits-in-utah",
      "cabin-kits-in-vermont",
      "cabin-kits-in-virginia",
      "cabin-kits-in-washington",
      "cabin-kits-in-west-virgina",
      "cabin-kits-in-wisconsin",
      "cabin-kits-in-wyoming",
      "log-cabin-kits-in-alabama",
      "cabins-for-sale",
      "cabins-for-sale-in-alabama",
      "cabins-for-sale-in-alaska",
      "cabins-for-sale-in-arizona",
      "cabins-for-sale-in-arkansas",
      "cabins-for-sale-in-california",
      "cabins-for-sale-in-colorado",
      "cabins-for-sale-in-connecticut",
      "cabins-for-sale-in-delaware",
      "cabins-for-sale-in-florida",
      "cabins-for-sale-in-georgia",
      "cabins-for-sale-in-hawaii",
      "cabins-for-sale-in-idaho",
      "cabins-for-sale-in-illinois",
      "cabins-for-sale-in-indiana",
      "cabins-for-sale-in-iowa",
      "cabins-for-sale-in-kansas",
      "cabins-for-sale-in-kentucky",
      "cabins-for-sale-in-louisiana",
      "cabins-for-sale-in-maine",
      "cabins-for-sale-in-maryland",
      "cabins-for-sale-in-massachusetts",
      "cabins-for-sale-in-michigan",
      "cabins-for-sale-in-minnesota",
      "cabins-for-sale-in-mississippi",
      "cabins-for-sale-in-missouri",
      "cabins-for-sale-in-nebraska",
      "cabins-for-sale-in-nevada",
      "cabins-for-sale-in-new-hampshire",
      "cabins-for-sale-in-new-jersey",
      "cabins-for-sale-in-new-mexico",
      "cabins-for-sale-in-new-york",
      "cabins-for-sale-in-north-carolina",
      "tiny-home-builders-in-alabama",
      "tiny-home-builders-in-alaska",
      "tiny-home-builders-in-arizona",
      "tiny-home-builders-in-arkansas",
      "tiny-home-builders-in-california",
      "tiny-home-builders-in-colorado",
      "tiny-home-builders-in-connecticut",
      "tiny-home-builders-in-delaware",
      "tiny-home-builders-in-florida",
      "tiny-home-builders-in-georgia",
      "tiny-home-builders-in-hawaii",
      "tiny-home-builders-in-idaho",
      "tiny-home-builders-in-illinois",
      "tiny-home-builders-in-indiana",
      "tiny-home-builders-in-iowa",
      "tiny-home-builders-in-kansas",
      "tiny-home-builders-in-kentucky",
      "tiny-home-builders-in-louisiana",
      "tiny-home-builders-in-maine",
      "tiny-home-builders-in-maryland",
      "tiny-home-builders-in-massachusetts",
      "tiny-home-builders-in-michigan",
      "tiny-home-builders-in-minnesota",
      "tiny-home-builders-in-mississippi",
      "tiny-home-builders-in-missouri",
      "tiny-home-builders-in-montana",
      "tiny-home-builders-in-nebraska",
      "tiny-home-builders-in-nevada",
      "tiny-home-builders-in-new-hampshire",
      "tiny-home-builders-in-new-jersey",
      "tiny-home-builders-in-new-mexico",
      "tiny-home-builders-in-new-york",
      "tiny-home-builders-in-north-carolina",
      "tiny-home-builders-in-north-dakota",
      "tiny-home-builders-in-ohio",
      "tiny-home-builders-in-oklahoma",
      "tiny-home-builders-in-oregon",
      "tiny-home-builders-in-pennsylvania",
      "tiny-home-builders-in-rhode-island",
      "tiny-home-builders-in-south-carolina",
      "tiny-home-builders-in-south-dakota",
      "tiny-home-builders-in-tennessee",
      "tiny-home-builders-in-texas",
      "tiny-home-builders-in-utah",
      "tiny-home-builders-in-vermont",
      "tiny-home-builders-in-virginia",
      "tiny-home-builders-in-washington",
      "tiny-home-builders-in-west-virginia",
      "tiny-home-builders-in-wisconsin",
      "tiny-home-builders",
      "timber-frame-homes",
      "timber-frame-builders",
      "timber-frame-home-kits",
      "timber-frame-house-plans",
      "house-plans-home-plans-cabin-plans",
      "modular-cabins-alabama",
      "modular-cabins-alaska",
      "modular-cabins-arizona",
      "modular-cabins-arkansas",
      "modular-cabins-california",
      "modular-cabins-colorado",
      "modular-cabins-connecticut",
      "modular-cabins-delaware",
      "modular-cabins-florida",
      "modular-cabins-georgia",
      "modular-cabins-hawaii",
      "modular-cabins-idaho",
      "modular-cabins-illinois",
      "modular-cabins-indiana",
      "modular-cabins-iowa",
      "modular-cabins-kansas",
      "modular-cabins-kentucky",
      "modular-cabins-louisiana",
      "modular-cabins-maine",
      "modular-cabins-maryland",
      "modular-cabins-massachusetts",
      "modular-cabins-michigan",
      "modular-cabins-minnesota",
      "modular-cabins-mississippi",
      "modular-cabins-missouri",
      "modular-cabins-montana",
      "modular-cabins-nebraska",
      "modular-cabins-nevada",
      "modular-cabins-new-hampshire",
      "modular-cabins-new-jersey",
      "modular-cabins-new-mexico",
      "modular-cabins-new-york",
      "modular-cabins-north-carolina",
      "modular-cabins-north-dakota",
      "modular-cabins-ohio",
      "modular-cabins-oklahoma",
      "modular-cabins-oregon",
      "modular-cabins-pennsylvania",
      "modular-cabins-rhode-island",
      "modular-cabins-south-carolina",
      "modular-cabins-south-dakota",
      "modular-cabins-tennessee",
      "modular-cabins-texas",
      "modular-cabins-utah",
      "modular-cabins-vermont",
      "modular-cabins-virginia",
      "modular-cabins-washington",
      "modular-cabins-west-virginia",
      "modular-cabins-wisconsin",
      "modular-cabins-wyoming",
      "prefab-cabins-alabama",
      "prefab-cabins",
      "prefab-cabins-alaska",
      "prefab-cabins-arizona",
      "commercial-modular-buildings",
      "commercial-modular-builders"
    ]
  },
  {
    "id": "9789294084412",
    "slug": "the-bozeman-barndominium-kit",
    "name": "The Cody Barndominium Kit",
    "series": "Essential Series",
    "category": "Barndominiums",
    "architecturalStyle": "Modern Homes",
    "tagline": "720 Sq Ft • 1 Bed • 1 Bath Barndominiums",
    "description": "<p><strong>### What's Included in a Barndominium House Kit?</strong></p>\n<p>When you purchase a barndominium house kit, you receive:</p>\n<p>- **26-gauge metal exterior shell** (no windows or doors included)<br>- **26-gauge metal roof**<br>- **Engineered blueprints and floor plans** up to code for your state and county, ready for your general contractor<br>- **Installation of the shell** on your foundation</p>\n<p>Please note that **site preparation** such as dirt work, land prep, septic systems, electrical, and plumbing are not included in this package. The price strictly covers the metal shell, blueprints, and installation of the shell.</p>\n<p>We proudly offer this barndo house kit with **shipping and installation across all 50 states**. If you have any questions or are ready to place an order, feel free to contact us at **502-298-8946**. Due to high demand, current turnaround times are approximately **12 to 16 weeks**.</p>\n<p>**Porches are not included** in the base price but are available upon request. If you're interested in adding a porch, simply ask your sales representative for pricing details when you call.</p>",
    "sqft": 720,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 40500,
    "dimensions": "Custom Dimensions",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Steel Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cody.webp?v=1732503412",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cody.webp?v=1732503412",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/cody.webp?v=1732503412",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/1._Boss_Hog_Barndominiums_Design_Catalog_1_-1-127-1-1_38-38-page-001.jpg?v=1732503511"
    ],
    "floorPlanImage": "",
    "floorPlan": "",
    "videoUrl": "",
    "videoDuration": "",
    "videoTitle": "",
    "features": [
      "Precision Commercial-Grade Galvanized Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Dimensions",
        "value": "Custom Dimensions"
      },
      {
        "label": "Living Area",
        "value": "720 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Stories",
        "value": "1 Level"
      },
      {
        "label": "Frame Type",
        "value": "100% Commercial-Grade Galvanized Light Gauge Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Steel Frame Warranty"
      },
      {
        "label": "Wind Rating",
        "value": "Up to 150 MPH"
      },
      {
        "label": "Snow Load",
        "value": "50 PSF Ground Snow Load Rated"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Wrap-Around Timber Deck",
        "price": 12500,
        "description": "Solid timber posts & weather-resistant composite decking"
      },
      {
        "id": "opt-2",
        "name": "Premium R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "Extreme thermal envelope for energy cost reduction"
      },
      {
        "id": "opt-3",
        "name": "16ft Multi-Slide Panoramic Glass Wall",
        "price": 9400,
        "description": "Black aluminum double-pane argon low-E sliders"
      }
    ],
    "variants": [
      {
        "id": "50428727918908",
        "title": "Standard Build Package",
        "price": 40500,
        "sku": "",
        "available": true,
        "option1": "Default Title"
      }
    ],
    "tags": [],
    "collections": [
      "cabin-builders-near-me",
      "home-builders-near-me",
      "affordable-housing",
      "kit-homes",
      "barndominium-kits",
      "barndo-kits",
      "steel-barndominium-kits",
      "made-in-usa",
      "made-in-america",
      "cabin-kits-in-alabama",
      "cabin-kits-in-alaska",
      "cabin-kits-in-arizona",
      "cabin-kits-in-arkansas",
      "cabin-kits-in-california",
      "cabin-kits-in-colorado",
      "cabin-kits-in-connecticut",
      "cabin-kits-in-delaware",
      "cabin-kits-in-florida",
      "cabin-kits-in-georgia",
      "cabin-kits-in-hawaii",
      "cabin-kits-in-idaho",
      "cabin-kits-in-illinois",
      "cabin-kits-in-indiana",
      "cabin-kits-in-iowa",
      "cabin-kits-in-kansas",
      "cabin-kits-in-kentucky",
      "cabin-kits-in-louisiana",
      "cabin-kits-in-maine",
      "cabin-kits-in-maryland",
      "cabin-kits-in-massachusetts",
      "cabin-kits-in-michigan",
      "cabin-kits-in-minnesota",
      "cabin-kits-in-mississippi",
      "cabin-kits-in-missouri",
      "cabin-kits-in-montana",
      "cabin-kits-in-nebraska",
      "cabin-kits-in-nevada",
      "cabin-kits-in-new-hampshire",
      "cabin-kits-in-new-jersey",
      "cabin-kits-in-new-mexico",
      "cabin-kits-in-new-york",
      "cabin-kits-in-north-carolina",
      "cabin-kits-in-north-dakota",
      "cabin-kits-in-ohio",
      "cabin-kits-in-oklahoma",
      "cabin-kits-in-oregon",
      "cabin-kits-in-pennsylvania",
      "cabin-kits-in-rhode-island",
      "cabin-kits-in-south-carolina",
      "cabin-kits-in-south-dakota",
      "cabin-kits-in-tennessee",
      "cabin-kits-in-texas",
      "cabin-kits-in-utah",
      "cabin-kits-in-vermont",
      "cabin-kits-in-virginia",
      "cabin-kits-in-washington",
      "cabin-kits-in-west-virgina",
      "cabin-kits-in-wisconsin",
      "cabin-kits-in-wyoming",
      "log-cabin-kits-in-alabama",
      "cabins-for-sale",
      "cabins-for-sale-in-alabama",
      "cabins-for-sale-in-alaska",
      "cabins-for-sale-in-arizona",
      "cabins-for-sale-in-arkansas",
      "cabins-for-sale-in-california",
      "cabins-for-sale-in-colorado",
      "cabins-for-sale-in-connecticut",
      "cabins-for-sale-in-delaware",
      "cabins-for-sale-in-florida",
      "cabins-for-sale-in-georgia",
      "cabins-for-sale-in-hawaii",
      "cabins-for-sale-in-idaho",
      "cabins-for-sale-in-illinois",
      "cabins-for-sale-in-indiana",
      "cabins-for-sale-in-iowa",
      "cabins-for-sale-in-kansas",
      "cabins-for-sale-in-kentucky",
      "cabins-for-sale-in-louisiana",
      "cabins-for-sale-in-maine",
      "cabins-for-sale-in-maryland",
      "cabins-for-sale-in-massachusetts",
      "cabins-for-sale-in-michigan",
      "cabins-for-sale-in-minnesota",
      "cabins-for-sale-in-mississippi",
      "cabins-for-sale-in-missouri",
      "cabins-for-sale-in-nebraska",
      "cabins-for-sale-in-nevada",
      "cabins-for-sale-in-new-hampshire",
      "cabins-for-sale-in-new-jersey",
      "cabins-for-sale-in-new-mexico",
      "cabins-for-sale-in-new-york",
      "cabins-for-sale-in-north-carolina",
      "tiny-home-builders-in-alabama",
      "tiny-home-builders-in-alaska",
      "tiny-home-builders-in-arizona",
      "tiny-home-builders-in-arkansas",
      "tiny-home-builders-in-california",
      "tiny-home-builders-in-colorado",
      "tiny-home-builders-in-connecticut",
      "tiny-home-builders-in-delaware",
      "tiny-home-builders-in-florida",
      "tiny-home-builders-in-georgia",
      "tiny-home-builders-in-hawaii",
      "tiny-home-builders-in-idaho",
      "tiny-home-builders-in-illinois",
      "tiny-home-builders-in-indiana",
      "tiny-home-builders-in-iowa",
      "tiny-home-builders-in-kansas",
      "tiny-home-builders-in-kentucky",
      "tiny-home-builders-in-louisiana",
      "tiny-home-builders-in-maine",
      "tiny-home-builders-in-maryland",
      "tiny-home-builders-in-massachusetts",
      "tiny-home-builders-in-michigan",
      "tiny-home-builders-in-minnesota",
      "tiny-home-builders-in-mississippi",
      "tiny-home-builders-in-missouri",
      "tiny-home-builders-in-montana",
      "tiny-home-builders-in-nebraska",
      "tiny-home-builders-in-nevada",
      "tiny-home-builders-in-new-hampshire",
      "tiny-home-builders-in-new-jersey",
      "tiny-home-builders-in-new-mexico",
      "tiny-home-builders-in-new-york",
      "tiny-home-builders-in-north-carolina",
      "tiny-home-builders-in-north-dakota",
      "tiny-home-builders-in-ohio",
      "tiny-home-builders-in-oklahoma",
      "tiny-home-builders-in-oregon",
      "tiny-home-builders-in-pennsylvania",
      "tiny-home-builders-in-rhode-island",
      "tiny-home-builders-in-south-carolina",
      "tiny-home-builders-in-south-dakota",
      "tiny-home-builders-in-tennessee",
      "tiny-home-builders-in-texas",
      "tiny-home-builders-in-utah",
      "tiny-home-builders-in-vermont",
      "tiny-home-builders-in-virginia",
      "tiny-home-builders-in-washington",
      "tiny-home-builders-in-west-virginia",
      "tiny-home-builders-in-wisconsin",
      "tiny-home-builders",
      "timber-frame-homes",
      "timber-frame-builders",
      "timber-frame-home-kits",
      "timber-frame-house-plans",
      "house-plans-home-plans-cabin-plans",
      "modular-cabins-alabama",
      "modular-cabins-alaska",
      "modular-cabins-arizona",
      "modular-cabins-arkansas",
      "modular-cabins-california",
      "modular-cabins-colorado",
      "modular-cabins-connecticut",
      "modular-cabins-delaware",
      "modular-cabins-florida",
      "modular-cabins-georgia",
      "modular-cabins-hawaii",
      "modular-cabins-idaho",
      "modular-cabins-illinois",
      "modular-cabins-indiana",
      "modular-cabins-iowa",
      "modular-cabins-kansas",
      "modular-cabins-kentucky",
      "modular-cabins-louisiana",
      "modular-cabins-maine",
      "modular-cabins-maryland",
      "modular-cabins-massachusetts",
      "modular-cabins-michigan",
      "modular-cabins-minnesota",
      "modular-cabins-mississippi",
      "modular-cabins-missouri",
      "modular-cabins-montana",
      "modular-cabins-nebraska",
      "modular-cabins-nevada",
      "modular-cabins-new-hampshire",
      "modular-cabins-new-jersey",
      "modular-cabins-new-mexico",
      "modular-cabins-new-york",
      "modular-cabins-north-carolina",
      "modular-cabins-north-dakota",
      "modular-cabins-ohio",
      "modular-cabins-oklahoma",
      "modular-cabins-oregon",
      "modular-cabins-pennsylvania",
      "modular-cabins-rhode-island",
      "modular-cabins-south-carolina",
      "modular-cabins-south-dakota",
      "modular-cabins-tennessee",
      "modular-cabins-texas",
      "modular-cabins-utah",
      "modular-cabins-vermont",
      "modular-cabins-virginia",
      "modular-cabins-washington",
      "modular-cabins-west-virginia",
      "modular-cabins-wisconsin",
      "modular-cabins-wyoming",
      "prefab-cabins-alabama",
      "prefab-cabins",
      "prefab-cabins-alaska",
      "prefab-cabins-arizona",
      "commercial-modular-buildings",
      "commercial-modular-builders"
    ]
  },
  {
    "id": "9789299687740",
    "slug": "the-cody-barndominium-kit-copy",
    "name": "The Shire Barndominium Kit",
    "series": "Essential Series",
    "category": "Barndominiums",
    "architecturalStyle": "Modern Homes",
    "tagline": "720 Sq Ft • 1 Bed • 1 Bath Barndominiums",
    "description": "<p><strong>### What's Included in a Barndominium House Kit?</strong></p>\n<p>When you purchase a barndominium house kit, you receive:</p>\n<p>- **26-gauge metal exterior shell** (no windows or doors included)<br>- **26-gauge metal roof**<br>- **Engineered blueprints and floor plans** up to code for your state and county, ready for your general contractor<br>- **Installation of the shell** on your foundation</p>\n<p>Please note that **site preparation** such as dirt work, land prep, septic systems, electrical, and plumbing are not included in this package. The price strictly covers the metal shell, blueprints, and installation of the shell.</p>\n<p>We proudly offer this barndo house kit with **shipping and installation across all 50 states**. If you have any questions or are ready to place an order, feel free to contact us at **502-298-8946**. Due to high demand, current turnaround times are approximately **12 to 16 weeks**.</p>\n<p>**Porches are not included** in the base price but are available upon request. If you're interested in adding a porch, simply ask your sales representative for pricing details when you call.</p>",
    "sqft": 720,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 60400,
    "dimensions": "Custom Dimensions",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Steel Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/shire.webp?v=1732503674",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/shire.webp?v=1732503674",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/shire.webp?v=1732503674",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/1._Boss_Hog_Barndominiums_Design_Catalog_1_-1-127-1-1_42-42-page-001.jpg?v=1732503756"
    ],
    "floorPlanImage": "",
    "floorPlan": "",
    "videoUrl": "",
    "videoDuration": "",
    "videoTitle": "",
    "features": [
      "Precision Commercial-Grade Galvanized Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Dimensions",
        "value": "Custom Dimensions"
      },
      {
        "label": "Living Area",
        "value": "720 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Stories",
        "value": "1 Level"
      },
      {
        "label": "Frame Type",
        "value": "100% Commercial-Grade Galvanized Light Gauge Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Steel Frame Warranty"
      },
      {
        "label": "Wind Rating",
        "value": "Up to 150 MPH"
      },
      {
        "label": "Snow Load",
        "value": "50 PSF Ground Snow Load Rated"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Wrap-Around Timber Deck",
        "price": 12500,
        "description": "Solid timber posts & weather-resistant composite decking"
      },
      {
        "id": "opt-2",
        "name": "Premium R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "Extreme thermal envelope for energy cost reduction"
      },
      {
        "id": "opt-3",
        "name": "16ft Multi-Slide Panoramic Glass Wall",
        "price": 9400,
        "description": "Black aluminum double-pane argon low-E sliders"
      }
    ],
    "variants": [
      {
        "id": "50428745974076",
        "title": "Standard Build Package",
        "price": 60400,
        "sku": "",
        "available": true,
        "option1": "Default Title"
      }
    ],
    "tags": [],
    "collections": [
      "cabin-builders-near-me",
      "home-builders-near-me",
      "affordable-housing",
      "kit-homes",
      "barndominium-kits",
      "barndo-kits",
      "steel-barndominium-kits",
      "made-in-usa",
      "made-in-america",
      "cabin-kits-in-alabama",
      "cabin-kits-in-alaska",
      "cabin-kits-in-arizona",
      "cabin-kits-in-arkansas",
      "cabin-kits-in-california",
      "cabin-kits-in-colorado",
      "cabin-kits-in-connecticut",
      "cabin-kits-in-delaware",
      "cabin-kits-in-florida",
      "cabin-kits-in-georgia",
      "cabin-kits-in-hawaii",
      "cabin-kits-in-idaho",
      "cabin-kits-in-illinois",
      "cabin-kits-in-indiana",
      "cabin-kits-in-iowa",
      "cabin-kits-in-kansas",
      "cabin-kits-in-kentucky",
      "cabin-kits-in-louisiana",
      "cabin-kits-in-maine",
      "cabin-kits-in-maryland",
      "cabin-kits-in-massachusetts",
      "cabin-kits-in-michigan",
      "cabin-kits-in-minnesota",
      "cabin-kits-in-mississippi",
      "cabin-kits-in-missouri",
      "cabin-kits-in-montana",
      "cabin-kits-in-nebraska",
      "cabin-kits-in-nevada",
      "cabin-kits-in-new-hampshire",
      "cabin-kits-in-new-jersey",
      "cabin-kits-in-new-mexico",
      "cabin-kits-in-new-york",
      "cabin-kits-in-north-carolina",
      "cabin-kits-in-north-dakota",
      "cabin-kits-in-ohio",
      "cabin-kits-in-oklahoma",
      "cabin-kits-in-oregon",
      "cabin-kits-in-pennsylvania",
      "cabin-kits-in-rhode-island",
      "cabin-kits-in-south-carolina",
      "cabin-kits-in-south-dakota",
      "cabin-kits-in-tennessee",
      "cabin-kits-in-texas",
      "cabin-kits-in-utah",
      "cabin-kits-in-vermont",
      "cabin-kits-in-virginia",
      "cabin-kits-in-washington",
      "cabin-kits-in-west-virgina",
      "cabin-kits-in-wisconsin",
      "cabin-kits-in-wyoming",
      "log-cabin-kits-in-alabama",
      "cabins-for-sale",
      "cabins-for-sale-in-alabama",
      "cabins-for-sale-in-alaska",
      "cabins-for-sale-in-arizona",
      "cabins-for-sale-in-arkansas",
      "cabins-for-sale-in-california",
      "cabins-for-sale-in-colorado",
      "cabins-for-sale-in-connecticut",
      "cabins-for-sale-in-delaware",
      "cabins-for-sale-in-florida",
      "cabins-for-sale-in-georgia",
      "cabins-for-sale-in-hawaii",
      "cabins-for-sale-in-idaho",
      "cabins-for-sale-in-illinois",
      "cabins-for-sale-in-indiana",
      "cabins-for-sale-in-iowa",
      "cabins-for-sale-in-kansas",
      "cabins-for-sale-in-kentucky",
      "cabins-for-sale-in-louisiana",
      "cabins-for-sale-in-maine",
      "cabins-for-sale-in-maryland",
      "cabins-for-sale-in-massachusetts",
      "cabins-for-sale-in-michigan",
      "cabins-for-sale-in-minnesota",
      "cabins-for-sale-in-mississippi",
      "cabins-for-sale-in-missouri",
      "cabins-for-sale-in-nebraska",
      "cabins-for-sale-in-nevada",
      "cabins-for-sale-in-new-hampshire",
      "cabins-for-sale-in-new-jersey",
      "cabins-for-sale-in-new-mexico",
      "cabins-for-sale-in-new-york",
      "cabins-for-sale-in-north-carolina",
      "tiny-home-builders-in-alabama",
      "tiny-home-builders-in-alaska",
      "tiny-home-builders-in-arizona",
      "tiny-home-builders-in-arkansas",
      "tiny-home-builders-in-california",
      "tiny-home-builders-in-colorado",
      "tiny-home-builders-in-connecticut",
      "tiny-home-builders-in-delaware",
      "tiny-home-builders-in-florida",
      "tiny-home-builders-in-georgia",
      "tiny-home-builders-in-hawaii",
      "tiny-home-builders-in-idaho",
      "tiny-home-builders-in-illinois",
      "tiny-home-builders-in-indiana",
      "tiny-home-builders-in-iowa",
      "tiny-home-builders-in-kansas",
      "tiny-home-builders-in-kentucky",
      "tiny-home-builders-in-louisiana",
      "tiny-home-builders-in-maine",
      "tiny-home-builders-in-maryland",
      "tiny-home-builders-in-massachusetts",
      "tiny-home-builders-in-michigan",
      "tiny-home-builders-in-minnesota",
      "tiny-home-builders-in-mississippi",
      "tiny-home-builders-in-missouri",
      "tiny-home-builders-in-montana",
      "tiny-home-builders-in-nebraska",
      "tiny-home-builders-in-nevada",
      "tiny-home-builders-in-new-hampshire",
      "tiny-home-builders-in-new-jersey",
      "tiny-home-builders-in-new-mexico",
      "tiny-home-builders-in-new-york",
      "tiny-home-builders-in-north-carolina",
      "tiny-home-builders-in-north-dakota",
      "tiny-home-builders-in-ohio",
      "tiny-home-builders-in-oklahoma",
      "tiny-home-builders-in-oregon",
      "tiny-home-builders-in-pennsylvania",
      "tiny-home-builders-in-rhode-island",
      "tiny-home-builders-in-south-carolina",
      "tiny-home-builders-in-south-dakota",
      "tiny-home-builders-in-tennessee",
      "tiny-home-builders-in-texas",
      "tiny-home-builders-in-utah",
      "tiny-home-builders-in-vermont",
      "tiny-home-builders-in-virginia",
      "tiny-home-builders-in-washington",
      "tiny-home-builders-in-west-virginia",
      "tiny-home-builders-in-wisconsin",
      "tiny-home-builders",
      "timber-frame-homes",
      "timber-frame-builders",
      "timber-frame-home-kits",
      "timber-frame-house-plans",
      "house-plans-home-plans-cabin-plans",
      "modular-cabins-alabama",
      "modular-cabins-alaska",
      "modular-cabins-arizona",
      "modular-cabins-arkansas",
      "modular-cabins-california",
      "modular-cabins-colorado",
      "modular-cabins-connecticut",
      "modular-cabins-delaware",
      "modular-cabins-florida",
      "modular-cabins-georgia",
      "modular-cabins-hawaii",
      "modular-cabins-idaho",
      "modular-cabins-illinois",
      "modular-cabins-indiana",
      "modular-cabins-iowa",
      "modular-cabins-kansas",
      "modular-cabins-kentucky",
      "modular-cabins-louisiana",
      "modular-cabins-maine",
      "modular-cabins-maryland",
      "modular-cabins-massachusetts",
      "modular-cabins-michigan",
      "modular-cabins-minnesota",
      "modular-cabins-mississippi",
      "modular-cabins-missouri",
      "modular-cabins-montana",
      "modular-cabins-nebraska",
      "modular-cabins-nevada",
      "modular-cabins-new-hampshire",
      "modular-cabins-new-jersey",
      "modular-cabins-new-mexico",
      "modular-cabins-new-york",
      "modular-cabins-north-carolina",
      "modular-cabins-north-dakota",
      "modular-cabins-ohio",
      "modular-cabins-oklahoma",
      "modular-cabins-oregon",
      "modular-cabins-pennsylvania",
      "modular-cabins-rhode-island",
      "modular-cabins-south-carolina",
      "modular-cabins-south-dakota",
      "modular-cabins-tennessee",
      "modular-cabins-texas",
      "modular-cabins-utah",
      "modular-cabins-vermont",
      "modular-cabins-virginia",
      "modular-cabins-washington",
      "modular-cabins-west-virginia",
      "modular-cabins-wisconsin",
      "modular-cabins-wyoming",
      "prefab-cabins-alabama",
      "prefab-cabins",
      "prefab-cabins-alaska",
      "prefab-cabins-arizona",
      "commercial-modular-buildings",
      "commercial-modular-builders"
    ]
  },
  {
    "id": "9890290434364",
    "slug": "prefab-modular-duplex",
    "name": "Prefab Modular Duplex (Great for rentals!)",
    "series": "Essential Series",
    "category": "Commercial Modular Buildings",
    "architecturalStyle": "Modern Homes",
    "tagline": "720 Sq Ft • 1 Bed • 1 Bath Modular Homes",
    "description": "<p><strong>The Modular Duplex Cabin</strong></p>\n<h3>Overview</h3>\n<p>The <strong>Modular Duplex Cabin</strong> is the perfect solution for resorts and short-term rental properties, offering unparalleled flexibility and style. This innovative design combines two units into one, allowing you to rent out one or both units to accommodate individual families or groups.</p>\n<h3>Specifications</h3>\n<ul>\n<li>\n<strong>Square Feet</strong>: 792</li>\n<li>\n<strong>Sleeps</strong>: Up to 6</li>\n<li>\n<strong>Layout</strong>: Duplex</li>\n<li>\n<strong>Sale Price</strong>: $179,900 (Regular Price: $189,900)</li>\n<li>\n<strong>Ships To</strong>: Nationwide</li>\n<li>\n<strong>Category</strong>: Duplex, Small Homes</li>\n<li>\n<strong>Dimensions</strong>: 24'9\" x 42'3\"</li>\n</ul>\n<p>Crafted by the expert artisans of <strong>Amish Built Cabins</strong>, the <strong>Modular Duplex Cabin</strong> is a testament to quality and craftsmanship. Each unit is designed with functionality and aesthetics in mind, making it an ideal investment for both personal and rental use.</p>\n<p>Contact us today to learn more about the <strong>Modular Duplex Cabin</strong> or schedule a visit to see it in person. Experience the beauty and durability of Amish craftsmanship for yourself!</p>",
    "sqft": 720,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 179900,
    "dimensions": "Custom Dimensions",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Steel Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua5.jpg?v=1737511571",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua6.jpg?v=1737511571",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua2.jpg?v=1737511571",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua4.jpg?v=1737511571",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdu9.jpg?v=1737511560",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdu10.jpg?v=1737511571",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua3.jpg?v=1737511571",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabduplex.jpg?v=1737511560",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdu.jpg?v=1737511560",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdu1.jpg?v=1737511560",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdu2.jpg?v=1737511560",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdu3.jpg?v=1737511560",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdu4.jpg?v=1737511560",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdu5.jpg?v=1737511560",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdu6.jpg?v=1737511560",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdu7.jpg?v=1737511560",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdu8.jpg?v=1737511560",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabduaa1.jpg?v=1737511571"
    ],
    "floorPlanImage": "",
    "floorPlan": "",
    "videoUrl": "",
    "videoDuration": "",
    "videoTitle": "",
    "features": [
      "Precision Commercial-Grade Galvanized Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Dimensions",
        "value": "Custom Dimensions"
      },
      {
        "label": "Living Area",
        "value": "720 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Stories",
        "value": "1 Level"
      },
      {
        "label": "Frame Type",
        "value": "100% Commercial-Grade Galvanized Light Gauge Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Steel Frame Warranty"
      },
      {
        "label": "Wind Rating",
        "value": "Up to 150 MPH"
      },
      {
        "label": "Snow Load",
        "value": "50 PSF Ground Snow Load Rated"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Wrap-Around Timber Deck",
        "price": 12500,
        "description": "Solid timber posts & weather-resistant composite decking"
      },
      {
        "id": "opt-2",
        "name": "Premium R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "Extreme thermal envelope for energy cost reduction"
      },
      {
        "id": "opt-3",
        "name": "16ft Multi-Slide Panoramic Glass Wall",
        "price": 9400,
        "description": "Black aluminum double-pane argon low-E sliders"
      }
    ],
    "variants": [
      {
        "id": "50780951085372",
        "title": "Standard Build Package",
        "price": 179900,
        "sku": "",
        "available": true,
        "option1": "Default Title"
      }
    ],
    "tags": [],
    "collections": [
      "commercial-modular-buildings",
      "modular-homes",
      "commercial-modular-builders"
    ]
  },
  {
    "id": "9809975836988",
    "slug": "the-copper-house-24-x-24-x-10",
    "name": "The Copper House - 24 X 24 X 10",
    "series": "Essential Series",
    "category": "Modular Homes",
    "architecturalStyle": "Modern Homes",
    "tagline": "576 Sq Ft • 1 Bed • 1 Bath Modular Homes",
    "description": "<h3><strong>The Copper House</strong></h3>\n<p>The <strong>Copper House</strong> is a beautifully crafted 24' x 24' x 10' structure that combines modern elegance with rustic charm. Whether you're using it as a cozy retreat, workspace, or storage, this versatile post-frame building is designed to meet a variety of needs with durability and style.</p>\n<p>With its distinctive <strong>copper roof</strong>, <strong>clay siding</strong>, and <strong>burnished slate trim</strong>, The Copper House exudes sophistication and timeless appeal. Its clean lines and sturdy construction make it the perfect addition to any property, offering both functionality and visual appeal.</p>\n<h3><strong>Standard Design Features</strong></h3>\n<ul>\n<li>\n<strong>Compact and Versatile Design:</strong> A manageable 24' x 24' footprint with a 10' height provides ample space for your needs while maintaining a sleek profile.</li>\n<li>\n<strong>Premium Copper Roof:</strong> Adds a striking feature and long-lasting durability, making your building a standout.</li>\n<li>\n<strong>Stylish Clay Siding:</strong> Complements the copper roof with earthy, neutral tones that blend beautifully into any setting.</li>\n<li>\n<strong>Burnished Slate Trim:</strong> Enhances the design with a polished finish that adds to its modern aesthetic.</li>\n</ul>\n<h3><strong>Customizable to Fit Your Style</strong></h3>\n<p>The Copper House is designed with flexibility in mind, allowing you to personalize it to match your vision. Whether you need additional features, custom color schemes, or upgraded materials, we can tailor the design to suit your specific needs.</p>\n<h3><strong>Contact Us for a Custom Quote</strong></h3>\n<p>Ready to make <strong>The Copper House</strong> yours? Contact us today to discuss your project and get a personalized quote.</p>\n<p>📞 Call us at <strong>502-298-8946</strong> to start designing your perfect post-frame building with the trusted craftsmanship of <strong>Amish Built Cabins</strong>.</p>\n<h3><strong>Key Features:</strong></h3>\n<ul>\n<li>\n<strong>Durable Construction:</strong> Built to withstand the elements while maintaining its elegance.</li>\n<li>\n<strong>Customizable Options:</strong> Tailor the design, colors, and features to fit your vision.</li>\n<li>\n<strong>Multi-Purpose Use:</strong> Ideal for residential, recreational, or storage needs.</li>\n<li>\n<strong>Timeless Aesthetic:</strong> Combines classic charm with modern finishes for a unique look.</li>\n</ul>\n<p>Bring your dream structure to life with <strong>The Copper House</strong>, where quality, functionality, and style meet. Whether you're looking for a practical solution or a stunning architectural addition, this building delivers it all!</p>",
    "sqft": 576,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 24900,
    "dimensions": "24x24 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch (Standing Seam Ready)",
    "windRating": "Up to 150 MPH (Engineered for Extreme Weather)",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Steel Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/COP3.jpg?v=1733489951",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/COP3.jpg?v=1733489951",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/COP3.jpg?v=1733489951",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/COP1.jpg?v=1733489951",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/COP2.jpg?v=1733489951",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/COP4.jpg?v=1733489951"
    ],
    "floorPlanImage": "",
    "floorPlan": "",
    "videoUrl": "",
    "videoDuration": "",
    "videoTitle": "",
    "features": [
      "Precision Commercial-Grade Galvanized Steel Framing",
      "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
      "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
      "Pre-drilled MEP & Fast Modular On-Site Assembly"
    ],
    "specs": [
      {
        "label": "Dimensions",
        "value": "24x24 ft"
      },
      {
        "label": "Living Area",
        "value": "576 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Stories",
        "value": "1 Level"
      },
      {
        "label": "Frame Type",
        "value": "100% Commercial-Grade Galvanized Light Gauge Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Steel Frame Warranty"
      },
      {
        "label": "Wind Rating",
        "value": "Up to 150 MPH"
      },
      {
        "label": "Snow Load",
        "value": "50 PSF Ground Snow Load Rated"
      }
    ],
    "customizableOptions": [
      {
        "id": "opt-1",
        "name": "Covered Wrap-Around Timber Deck",
        "price": 12500,
        "description": "Solid timber posts & weather-resistant composite decking"
      },
      {
        "id": "opt-2",
        "name": "Premium R-38 Closed-Cell Insulation",
        "price": 6800,
        "description": "Extreme thermal envelope for energy cost reduction"
      },
      {
        "id": "opt-3",
        "name": "16ft Multi-Slide Panoramic Glass Wall",
        "price": 9400,
        "description": "Black aluminum double-pane argon low-E sliders"
      }
    ],
    "variants": [
      {
        "id": "50522224001340",
        "title": "Standard Build Package",
        "price": 24900,
        "sku": "",
        "available": true,
        "option1": "Default Title"
      }
    ],
    "tags": [],
    "collections": [
      "home-plans",
      "tiny-house-builder",
      "tiny-homes"
    ]
  },
  {
    "id": "mod-the-madison",
    "slug": "the-madison",
    "name": "The Madison Modular Home",
    "series": "Architectural Series",
    "category": "Modular Homes",
    "architecturalStyle": "Modern Craftsman",
    "tagline": "1,850 SQ FT • 3 Bed 2 Bath Precision Factory Modular Home",
    "description": "<p><strong>The Madison Modular Home</strong> is a premier 3-bedroom, 2-bathroom factory-built residence combining architectural proportion, high ceilings, an open island kitchen, and commercial-grade light-gauge steel construction for lifetime durability.</p>",
    "sqft": 1850,
    "bedrooms": 3,
    "bathrooms": 2,
    "stories": 1,
    "startingPrice": 219000,
    "dimensions": "28x66 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545"
    ],
    "floorPlanImage": "",
    "features": [
      "Galvanized Commercial-Grade Steel Framing",
      "High-R Structural Insulated Panel Walls (R-30)",
      "Vaulted Great Room with Quartz Island Kitchen",
      "Turnkey Delivery with Stamped Structural Plans"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1,850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "3 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2 Bath"
      },
      {
        "label": "Dimensions",
        "value": "28x66 ft"
      },
      {
        "label": "Frame Type",
        "value": "Galvanized Light Gauge Steel"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular Homes",
      "Turnkey"
    ],
    "collections": [
      "modular-homes",
      "prefab-homes",
      "3-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-the-cub-cabin",
    "slug": "the-cub-cabin",
    "name": "The Cub Cabin",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "480 SQ FT • 1 Bed 1 Bath Handcrafted Amish-Built Cabin",
    "description": "<p><strong>The Cub Cabin</strong> delivers authentic rustic charm in a compact, highly functional footprint. Crafted with solid timber joinery, a covered front porch, vaulted tongue-and-groove ceilings, and full kitchenette and bath amenities.</p>",
    "sqft": 480,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 34900,
    "dimensions": "14x34 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345"
    ],
    "floorPlanImage": "",
    "features": [
      "Solid Milled Timber Interlocking Walls",
      "Covered Full-Depth Front Porch",
      "Pre-Plumbed and Pre-Wired for Rapid Setup",
      "Heavy Snow Load Architectural Metal Roof"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "480 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Dimensions",
        "value": "14x34 ft"
      },
      {
        "label": "Frame Type",
        "value": "Solid Heavy Timber & Log Walls"
      },
      {
        "label": "Warranty",
        "value": "25-Year Craftsmanship Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Cabins",
      "Turnkey"
    ],
    "collections": [
      "cabins",
      "modular-cabins",
      "1-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-the-cleveland",
    "slug": "the-cleveland",
    "name": "The Cleveland Modular Residence",
    "series": "Architectural Series",
    "category": "Modular Homes",
    "architecturalStyle": "Modern Prairie",
    "tagline": "2,250 SQ FT • 4 Bed 2.5 Bath Luxury Modular Home",
    "description": "<p><strong>The Cleveland Modular Residence</strong> is engineered for growing families, offering 4 expansive bedrooms, 2.5 bathrooms, an open concept entertaining great room, and a master suite retreat with double vanities and soaking tub.</p>",
    "sqft": 2250,
    "bedrooms": 4,
    "bathrooms": 2.5,
    "stories": 1,
    "startingPrice": 259000,
    "dimensions": "32x70 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545",
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691"
    ],
    "floorPlanImage": "",
    "features": [
      "Commercial Light-Gauge Steel Chassis & Wall Framing",
      "4 Bed Split Floor Plan for Maximum Privacy",
      "Argon Low-E Energy Efficient Windows",
      "Turnkey Nationwide Crane Delivery & Setup"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "2,250 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "4 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2.5 Bath"
      },
      {
        "label": "Dimensions",
        "value": "32x70 ft"
      },
      {
        "label": "Frame Type",
        "value": "Commercial Steel Modular"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular Homes",
      "Turnkey"
    ],
    "collections": [
      "modular-homes",
      "prefab-homes",
      "4-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-the-cube-link-system",
    "slug": "the-cube-link-system",
    "name": "The Cube Link System Modular Living Unit",
    "series": "Architectural Series",
    "category": "Modular Homes",
    "architecturalStyle": "Contemporary Modular",
    "tagline": "960 SQ FT • 2 Bed 2 Bath Expandable Interlocking Modular System",
    "description": "<p><strong>The Cube Link System</strong> utilizes state-of-the-art modular cube pods that connect seamlessly. Ideal as a modern home, accessory dwelling, or modular compound that can expand over time with additional modules.</p>",
    "sqft": 960,
    "bedrooms": 2,
    "bathrooms": 2,
    "stories": 1,
    "startingPrice": 119000,
    "dimensions": "24x40 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308"
    ],
    "floorPlanImage": "",
    "features": [
      "Modular Interlocking Cube System",
      "Architectural Black Trim & Floor-to-Ceiling Glass",
      "Pre-Wired for Smart Home & Solar Energy",
      "Rapid Assembly in 1-2 Days On-Site"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "960 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2 Bath"
      },
      {
        "label": "Dimensions",
        "value": "24x40 ft"
      },
      {
        "label": "Frame Type",
        "value": "Structural Steel Modular Cube Core"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular Homes",
      "Turnkey"
    ],
    "collections": [
      "modular-homes",
      "tiny-homes",
      "2-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-a-frame-luxe",
    "slug": "a-frame-luxe",
    "name": "A-Frame Luxe Architectural Residence",
    "series": "Architectural Series",
    "category": "A-Frames",
    "architecturalStyle": "Modern A-Frame",
    "tagline": "1,250 SQ FT • 2 Bed 2 Bath Iconic Steep-Pitch Glass Home",
    "description": "<p><strong>A-Frame Luxe</strong> redefines modern mountain and lakeside architecture. Featuring a dramatic 12:12 roofline, a full glass front gable with panoramic views, upper loft bedroom suite, and heavy snow load engineering.</p>",
    "sqft": 1250,
    "bedrooms": 2,
    "bathrooms": 2,
    "stories": 2,
    "startingPrice": 139000,
    "dimensions": "26x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284"
    ],
    "floorPlanImage": "",
    "features": [
      "Floor-to-Ceiling Front Glass Gable Wall",
      "Open Timber Rafter Ceilings with Upper Loft",
      "Engineered for 70+ PSF Severe Snow Loads",
      "Pre-Fabricated Steel Truss System"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1,250 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2 Bath"
      },
      {
        "label": "Dimensions",
        "value": "26x36 ft"
      },
      {
        "label": "Roof Pitch",
        "value": "12:12 Steep Pitch Standing Seam"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "A-Frames",
      "Turnkey"
    ],
    "collections": [
      "a-frame-homes",
      "house-kits",
      "2-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-a-frame-united",
    "slug": "a-frame-united",
    "name": "A-Frame United Metal House Kit",
    "series": "Architectural Series",
    "category": "A-Frames",
    "architecturalStyle": "Modern A-Frame",
    "tagline": "1,650 SQ FT • 3 Bed 2 Bath High-Performance A-Frame Kit",
    "description": "<p><strong>A-Frame United</strong> offers spacious 3-bedroom mountain living with double-height cathedral ceilings, open mezzanine bridge, walk-out balcony, and complete precision-engineered steel structural frame kit.</p>",
    "sqft": 1650,
    "bedrooms": 3,
    "bathrooms": 2,
    "stories": 2,
    "startingPrice": 169000,
    "dimensions": "28x44 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284"
    ],
    "floorPlanImage": "",
    "features": [
      "3-Bedroom A-Frame with Upper Mezzanine",
      "Commercial Pre-Cut Structural Steel Framing Kit",
      "Architectural Matte Black Standing Seam Roofing",
      "Double Pane Low-E High-Altitude Glazing"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1,650 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "3 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2 Bath"
      },
      {
        "label": "Dimensions",
        "value": "28x44 ft"
      },
      {
        "label": "Roof Pitch",
        "value": "12:12 Steep Pitch"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "A-Frames",
      "Turnkey"
    ],
    "collections": [
      "a-frame-homes",
      "house-kits",
      "3-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-aspen",
    "slug": "aspen",
    "name": "The Aspen Park Model Modular Cabin",
    "series": "Architectural Series",
    "category": "Park Models",
    "architecturalStyle": "Park Model RV",
    "tagline": "400 SQ FT • 1 Bed 1 Bath Luxury Park Model Home",
    "description": "<p><strong>The Aspen</strong> is our flagship resort-grade park model modular cabin, featuring 400 sq ft of luxury finishes, a covered porch, clerestory windows, full residential kitchen appliances, and complete RVIA certification.</p>",
    "sqft": 400,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 69900,
    "dimensions": "12x36 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/aspen2.avif?v=1783816889",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/aspen2.avif?v=1783816889",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/aspen2.avif?v=1783816889"
    ],
    "floorPlanImage": "",
    "features": [
      "RVIA Certified Park Model RV / Cabin",
      "Clerestory Dormer Windows for Natural Light",
      "Full Kitchen with Stainless Steel Appliances",
      "Covered Composite Deck & Porch"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "400 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Dimensions",
        "value": "12x36 ft"
      },
      {
        "label": "Warranty",
        "value": "25-Year Craftsmanship Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Park Models",
      "Turnkey"
    ],
    "collections": [
      "park-models",
      "tiny-homes",
      "1-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-backyard-escape",
    "slug": "backyard-escape",
    "name": "Backyard Escape Studio ADU",
    "series": "Architectural Series",
    "category": "ADUs & Granny Pods",
    "architecturalStyle": "Contemporary ADU",
    "tagline": "420 SQ FT • Studio 1 Bath Detached Living Suite",
    "description": "<p><strong>Backyard Escape</strong> is an efficient modern accessory dwelling unit (ADU) engineered for swift crane or roll-off installation in backyard settings. Features full bathroom, efficiency kitchen, and private patio slider.</p>",
    "sqft": 420,
    "bedrooms": 0,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 54900,
    "dimensions": "14x30 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308"
    ],
    "floorPlanImage": "",
    "features": [
      "Turnkey Studio Accessory Dwelling Unit",
      "Modern High-Efficiency Heat Pump Mini-Split",
      "Engineered for Standard Backyard Setbacks",
      "Factory Complete with Plumbing & Fixtures"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "420 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "Studio"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Dimensions",
        "value": "14x30 ft"
      },
      {
        "label": "Warranty",
        "value": "25-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "ADUs & Granny Pods",
      "Turnkey"
    ],
    "collections": [
      "adus",
      "tiny-homes"
    ]
  },
  {
    "id": "mod-deluxe-retreat",
    "slug": "deluxe-retreat",
    "name": "Deluxe Retreat Modular Cabin",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Rustic Cabin",
    "tagline": "780 SQ FT • 2 Bed 1 Bath Handcrafted Timber Retreat",
    "description": "<p><strong>The Deluxe Retreat</strong> provides the warmth of solid Amish-crafted timber with modern 2-bedroom conveniences. High cathedral ceilings, exposed beams, and energy-efficient insulated log walls.</p>",
    "sqft": 780,
    "bedrooms": 2,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 62500,
    "dimensions": "20x39 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345"
    ],
    "floorPlanImage": "",
    "features": [
      "Solid Interlocking Milled Timber Construction",
      "Open Concept Kitchen and Living Area",
      "Covered Full-Length Country Porch",
      "Pre-Finished Solid Wood Ceilings"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "780 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Dimensions",
        "value": "20x39 ft"
      },
      {
        "label": "Warranty",
        "value": "25-Year Timber Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Cabins",
      "Turnkey"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "2-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "mod-firefly",
    "slug": "firefly",
    "name": "Firefly Modern Tiny Home",
    "series": "Architectural Series",
    "category": "Tiny Homes",
    "architecturalStyle": "Modern Tiny Home",
    "tagline": "320 SQ FT • 1 Bed 1 Bath Efficient Prefab Tiny Home",
    "description": "<p><strong>The Firefly Tiny Home</strong> maximizes space through innovative built-in storage, a private main-level sleeping suite, quartz galley kitchenette, and oversized double-hung windows for abundant natural light.</p>",
    "sqft": 320,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 44900,
    "dimensions": "10x32 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418"
    ],
    "floorPlanImage": "",
    "features": [
      "Main-Floor Bedroom Design (No Ladders Needed)",
      "Mini-Split HVAC Climate Control System",
      "Architectural Metal Siding & Cedar Accents",
      "Direct RV / Standard Utility Hookups"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "320 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Dimensions",
        "value": "10x32 ft"
      },
      {
        "label": "Warranty",
        "value": "25-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Tiny Homes",
      "Turnkey"
    ],
    "collections": [
      "tiny-homes",
      "1-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-grizzly",
    "slug": "grizzly",
    "name": "Grizzly Heavy Timber Modular Cabin",
    "series": "Architectural Series",
    "category": "Cabins",
    "architecturalStyle": "Mountain Lodge",
    "tagline": "1,450 SQ FT • 3 Bed 2 Bath Solid Timber Modular Cabin",
    "description": "<p><strong>The Grizzly</strong> is an impressive 3-bedroom, 2-bathroom mountain modular cabin engineered for harsh alpine conditions. Features double-stacked timber walls, stone fireplace chase, and huge covered entertaining deck.</p>",
    "sqft": 1450,
    "bedrooms": 3,
    "bathrooms": 2,
    "stories": 1,
    "startingPrice": 118000,
    "dimensions": "26x56 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345"
    ],
    "floorPlanImage": "",
    "features": [
      "Solid Heavy Timber Milled Log Walls",
      "Vaulted Great Room with Heavy Timber Trusses",
      "Large Covered Front and Rear Porches",
      "Engineered for Severe Snow & Mountain Wind"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1,450 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "3 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2 Bath"
      },
      {
        "label": "Dimensions",
        "value": "26x56 ft"
      },
      {
        "label": "Warranty",
        "value": "30-Year Timber Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Cabins",
      "Turnkey"
    ],
    "collections": [
"cabins",
      "modular-cabins",
      "3-bedroom-turnkey-homes",
      "amish-built-modular-cabins",
      "modular-homes",
      "prefab-homes"
    ]
  },
  {
    "id": "mod-modern-living",
    "slug": "modern-living",
    "name": "Modern Living Architectural Modular Home",
    "series": "Architectural Series",
    "category": "Modular Homes",
    "architecturalStyle": "Contemporary",
    "tagline": "1,920 SQ FT • 3 Bed 2 Bath High-Efficiency Modular Residence",
    "description": "<p><strong>Modern Living</strong> blends Scandinavian minimalist geometry with robust structural steel modular engineering. Features open-plan living, black architectural windows, quartz countertops, and integrated LED accent lighting.</p>",
    "sqft": 1920,
    "bedrooms": 3,
    "bathrooms": 2,
    "stories": 1,
    "startingPrice": 228000,
    "dimensions": "30x64 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691"
    ],
    "floorPlanImage": "",
    "features": [
      "Contemporary Flat-Line & Low-Pitch Modern Architecture",
      "Galvanized Structural Steel Frame",
      "Continuous Exterior Insulation Barrier",
      "Turnkey Delivery with Stamped Foundation Plans"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1,920 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "3 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2 Bath"
      },
      {
        "label": "Dimensions",
        "value": "30x64 ft"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular Homes",
      "Turnkey"
    ],
    "collections": [
      "modular-homes",
      "prefab-homes",
      "3-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-modular-adus",
    "slug": "modular-adus",
    "name": "Modular ADU High-Performance Unit",
    "series": "Architectural Series",
    "category": "ADUs & Granny Pods",
    "architecturalStyle": "Modern ADU",
    "tagline": "520 SQ FT • 1 Bed 1 Bath Turnkey Accessory Dwelling Unit",
    "description": "<p><strong>The Modular ADU</strong> is an engineered 1-bedroom backyard suite designed to generate rental income or provide private independent living for loved ones. Pre-permitted in multiple jurisdictions with rapid setup.</p>",
    "sqft": 520,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 68000,
    "dimensions": "14x38 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308"
    ],
    "floorPlanImage": "",
    "features": [
      "Turnkey Pre-Permitted Accessory Dwelling Unit",
      "Full Kitchenette with Stainless Steel Appliances",
      "Modern High-Efficiency Insulation Package",
      "Standard 200 Amp Service Compatibility"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "520 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Dimensions",
        "value": "14x38 ft"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "ADUs & Granny Pods",
      "Turnkey"
    ],
    "collections": [
      "adus",
      "modular-homes",
      "1-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-multi-family-homes",
    "slug": "multi-family-homes",
    "name": "Multi-Family Modular Duplex Residence",
    "series": "Architectural Series",
    "category": "Commercial Modular Buildings",
    "architecturalStyle": "Multi-Family Duplex",
    "tagline": "2,400 SQ FT • 4 Bed 4 Bath Two-Unit Income Property",
    "description": "<p><strong>Multi-Family Modular Duplex</strong> features two identical, fully independent 2-bedroom, 2-bathroom rental units. Complete soundproofing party-wall assemblies, independent utility subpanels, and fast modular crane-set erection.</p>",
    "sqft": 2400,
    "bedrooms": 4,
    "bathrooms": 4,
    "stories": 2,
    "startingPrice": 289000,
    "dimensions": "32x75 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/442435176_1117036319546606_7478160302982824370_n_2a3e20a5-fc3f-46af-9aa2-8da3022fbe87.jpg?v=1736129729",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/442435176_1117036319546606_7478160302982824370_n_2a3e20a5-fc3f-46af-9aa2-8da3022fbe87.jpg?v=1736129729",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/442435176_1117036319546606_7478160302982824370_n_2a3e20a5-fc3f-46af-9aa2-8da3022fbe87.jpg?v=1736129729"
    ],
    "floorPlanImage": "",
    "features": [
      "Two Independent 2-Bed 2-Bath Income Living Units",
      "STC 58+ Acoustic Sound-Dampening Party Wall",
      "Dual Meters for Electric, Water & HVAC",
      "Commercial Grade Light Gauge Steel Frame"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "2,400 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "4 Bed (2 per unit)"
      },
      {
        "label": "Bathrooms",
        "value": "4 Bath (2 per unit)"
      },
      {
        "label": "Stories",
        "value": "2 Level"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Commercial Modular Buildings",
      "Turnkey"
    ],
    "collections": [
      "commercial-modular-buildings",
      "modular-homes"
    ]
  },
  {
    "id": "mod-nova",
    "slug": "nova",
    "name": "Nova Contemporary Prefab Home",
    "series": "Architectural Series",
    "category": "Prefab Homes",
    "architecturalStyle": "Contemporary",
    "tagline": "1,750 SQ FT • 3 Bed 2 Bath Modern Prefab Design",
    "description": "<p><strong>The Nova Prefab Home</strong> is a modern masterpiece designed for clean, light-filled living. Large sliding patio doors, open kitchen layout, and energy-efficient factory precision modules built for rapid nationwide delivery.</p>",
    "sqft": 1750,
    "bedrooms": 3,
    "bathrooms": 2,
    "stories": 1,
    "startingPrice": 198000,
    "dimensions": "28x62 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098"
    ],
    "floorPlanImage": "",
    "features": [
      "Modern High-Efficiency Thermal Envelope",
      "Large Open Living and Dining Area",
      "Master En-Suite with Walk-in Shower",
      "Factory Complete Turnkey Interior Finishes"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1,750 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "3 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2 Bath"
      },
      {
        "label": "Dimensions",
        "value": "28x62 ft"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Prefab Homes",
      "Turnkey"
    ],
    "collections": [
      "prefab-homes",
      "modular-homes",
      "3-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-pre-fabricated-tiny-homes",
    "slug": "pre-fabricated-tiny-homes",
    "name": "Pre-Fabricated Tiny Home Turnkey Model",
    "series": "Architectural Series",
    "category": "Tiny Homes",
    "architecturalStyle": "Modern Tiny Home",
    "tagline": "390 SQ FT • 1 Bed 1 Bath Turnkey Tiny Home",
    "description": "<p><strong>The Pre-Fabricated Tiny Home</strong> delivers high-end minimalism with zero wasted space. Features a vaulted living space, full shower, washer/dryer hookups, and high-performance exterior cladding.</p>",
    "sqft": 390,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 49500,
    "dimensions": "12x33 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418"
    ],
    "floorPlanImage": "",
    "features": [
      "Turnkey Small Footprint Living",
      "Full Kitchen with Induction Cooktop",
      "Full Size Shower with Glass Enclosure",
      "Rapid Delivery Anywhere in the Continental US"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "390 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Dimensions",
        "value": "12x33 ft"
      },
      {
        "label": "Warranty",
        "value": "25-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Tiny Homes",
      "Turnkey"
    ],
    "collections": [
      "tiny-homes",
      "prefab-homes",
      "1-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-small-spaces",
    "slug": "small-spaces",
    "name": "Small Spaces Micro Modular Living",
    "series": "Architectural Series",
    "category": "Tiny Homes",
    "architecturalStyle": "Minimalist Modular",
    "tagline": "450 SQ FT • 1 Bed 1 Bath Compact Modern Living",
    "description": "<p><strong>Small Spaces Micro Modular</strong> is engineered for homeowners wanting low-maintenance, ultra-efficient modular living without sacrificing luxury or quality materials.</p>",
    "sqft": 450,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 58000,
    "dimensions": "14x32 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418"
    ],
    "floorPlanImage": "",
    "features": [
      "High-R Structural Insulated Panel Walls",
      "Quiet Multi-Zone Mini-Split Climate Control",
      "Built-in Storage Closets & Cabinets",
      "Nationwide Fast Delivery"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "450 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Dimensions",
        "value": "14x32 ft"
      },
      {
        "label": "Warranty",
        "value": "25-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Tiny Homes",
      "Turnkey"
    ],
    "collections": [
      "tiny-homes",
      "modular-homes",
      "1-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-studio-adus",
    "slug": "studio-adus",
    "name": "Studio ADU Backyard Suite",
    "series": "Architectural Series",
    "category": "ADUs & Granny Pods",
    "architecturalStyle": "Modern ADU",
    "tagline": "380 SQ FT • Studio 1 Bath Backyard Guest Suite",
    "description": "<p><strong>The Studio ADU</strong> is a self-contained modern living unit designed specifically for single-family residential backyards. Perfect for elderly relatives, adult children, or high-yield rental income.</p>",
    "sqft": 380,
    "bedrooms": 0,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 48900,
    "dimensions": "12x32 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308"
    ],
    "floorPlanImage": "",
    "features": [
      "Compact Studio Floor Plan with Full Bath",
      "Factory Wired and Plumbed for Quick Connection",
      "Architectural Fiber Cement & Wood Accent Siding",
      "Energy Star Rated Windows and Doors"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "380 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "Studio"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Dimensions",
        "value": "12x32 ft"
      },
      {
        "label": "Warranty",
        "value": "25-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "ADUs & Granny Pods",
      "Turnkey"
    ],
    "collections": [
      "adus",
      "tiny-homes"
    ]
  },
  {
    "id": "mod-twilight",
    "slug": "twilight",
    "name": "Twilight Luxury Modular Villa",
    "series": "Architectural Series",
    "category": "Modular Homes",
    "architecturalStyle": "Luxury Modern",
    "tagline": "2,100 SQ FT • 3 Bed 2.5 Bath Luxury Modular Villa",
    "description": "<p><strong>The Twilight Modular Villa</strong> represents the peak of luxury factory modular building. Featuring 10-foot ceilings, floor-to-ceiling glass patio sliders, a chef’s kitchen with waterfall quartz island, and a spa-inspired master retreat.</p>",
    "sqft": 2100,
    "bedrooms": 3,
    "bathrooms": 2.5,
    "stories": 1,
    "startingPrice": 265000,
    "dimensions": "30x70 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691"
    ],
    "floorPlanImage": "",
    "features": [
      "10-Foot Finished Ceilings Throughout",
      "Commercial-Grade Galvanized Light-Gauge Steel Chassis",
      "Waterfall Quartz Island & Custom Cabinetry",
      "Turnkey Delivery with Stamped Architectural Plans"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "2,100 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "3 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2.5 Bath"
      },
      {
        "label": "Dimensions",
        "value": "30x70 ft"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular Homes",
      "Turnkey"
    ],
    "collections": [
      "modular-homes",
      "prefab-homes",
      "3-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-1-bed-1-bath",
    "slug": "1-bed-1-bath",
    "name": "1 Bed 1 Bath Compact Turnkey Home",
    "series": "Architectural Series",
    "category": "Modular Homes",
    "architecturalStyle": "Modern Compact",
    "tagline": "550 SQ FT • 1 Bed 1 Bath Turnkey Modular Living",
    "description": "<p><strong>The 1 Bed 1 Bath Turnkey Home</strong> is engineered for independent living, down-sizers, or vacation rental properties. Built to IRC residential building codes with full kitchen, bedroom, and bath.</p>",
    "sqft": 550,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 1,
    "startingPrice": 69900,
    "dimensions": "16x34 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691"
    ],
    "floorPlanImage": "",
    "features": [
      "Full IRC Code Residential Compliance",
      "Private Master Bedroom with Built-in Wardrobe",
      "Full Kitchen with Dining Peninsula",
      "Turnkey Delivery Nationwide"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "550 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Dimensions",
        "value": "16x34 ft"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular Homes",
      "Turnkey"
    ],
    "collections": [
      "modular-homes",
      "1-bedroom-turnkey-homes",
      "tiny-homes"
    ]
  },
  {
    "id": "mod-1-bed-1-bath-rooftop-deck",
    "slug": "1-bed-1-bath-rooftop-deck",
    "name": "1 Bed 1 Bath with Rooftop Deck Model",
    "series": "Architectural Series",
    "category": "Modular Homes",
    "architecturalStyle": "Modern Architectural",
    "tagline": "620 SQ FT • 1 Bed 1 Bath with Spiral Rooftop Deck",
    "description": "<p><strong>The 1 Bed 1 Bath with Rooftop Deck</strong> offers panoramic 360-degree views with a full engineered rooftop observation terrace, spiral staircase, modern finishes, and commercial steel frame.</p>",
    "sqft": 620,
    "bedrooms": 1,
    "bathrooms": 1,
    "stories": 2,
    "startingPrice": 82500,
    "dimensions": "16x38 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691"
    ],
    "floorPlanImage": "",
    "features": [
      "Full Reinforced Rooftop Entertaining Deck",
      "Exterior Powder-Coated Spiral Staircase",
      "Galvanized Structural Steel Frame",
      "Turnkey Factory Complete Interior"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "620 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "1 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "1 Bath"
      },
      {
        "label": "Dimensions",
        "value": "16x38 ft"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular Homes",
      "Turnkey"
    ],
    "collections": [
      "modular-homes",
      "1-bedroom-turnkey-homes",
      "adus"
    ]
  },
  {
    "id": "mod-2-bed-2-bath",
    "slug": "2-bed-2-bath",
    "name": "2 Bed 2 Bath Turnkey Modular Home",
    "series": "Architectural Series",
    "category": "Modular Homes",
    "architecturalStyle": "Modern Craftsman",
    "tagline": "980 SQ FT • 2 Bed 2 Bath Efficient Floor Plan",
    "description": "<p><strong>The 2 Bed 2 Bath Turnkey Modular Home</strong> features dual master suites, perfect for roommates, small families, or vacation rentals. Features open-concept living and central kitchen.</p>",
    "sqft": 980,
    "bedrooms": 2,
    "bathrooms": 2,
    "stories": 1,
    "startingPrice": 119000,
    "dimensions": "24x41 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691"
    ],
    "floorPlanImage": "",
    "features": [
      "Dual Master Suites for Maximum Privacy",
      "Open Great Room with Vaulted Ceilings",
      "Commercial Light Gauge Steel Frame",
      "Turnkey Fast Assembly On-Site"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "980 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "2 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "2 Bath"
      },
      {
        "label": "Dimensions",
        "value": "24x41 ft"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular Homes",
      "Turnkey"
    ],
    "collections": [
      "modular-homes",
      "2-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-3-bed-3-bath",
    "slug": "3-bed-3-bath",
    "name": "3 Bed 3 Bath Family Modular Residence",
    "series": "Architectural Series",
    "category": "Modular Homes",
    "architecturalStyle": "Ranch & Farmhouse",
    "tagline": "1,850 SQ FT • 3 Bed 3 Bath Spacious Modular Home",
    "description": "<p><strong>The 3 Bed 3 Bath Family Modular Residence</strong> gives every bedroom its own private or dedicated bath. Features huge walk-in closets, kitchen island, and dedicated mudroom/laundry room.</p>",
    "sqft": 1850,
    "bedrooms": 3,
    "bathrooms": 3,
    "stories": 1,
    "startingPrice": 219000,
    "dimensions": "28x66 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545"
    ],
    "floorPlanImage": "",
    "features": [
      "3 Full Bathrooms for Comfort and Convenience",
      "Split Bedroom Layout with Dedicated Master Wing",
      "Energy-Efficient High-R SIP Panel Exterior",
      "Turnkey Nationwide Crane Delivery"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "1,850 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "3 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "3 Bath"
      },
      {
        "label": "Dimensions",
        "value": "28x66 ft"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular Homes",
      "Turnkey"
    ],
    "collections": [
      "modular-homes",
      "3-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-3-bed-3-bath-with-deck",
    "slug": "3-bed-3-bath-with-deck",
    "name": "3 Bed 3 Bath Modular Home with Wrap-Around Deck",
    "series": "Architectural Series",
    "category": "Modular Homes",
    "architecturalStyle": "Modern Craftsman",
    "tagline": "2,050 SQ FT • 3 Bed 3 Bath with Expansive Wrap-Around Porch",
    "description": "<p><strong>The 3 Bed 3 Bath with Wrap-Around Deck</strong> seamlessly blends indoor and outdoor luxury living with a massive covered porch, outdoor fireplace hookups, and spacious 2,050 sq ft interior.</p>",
    "sqft": 2050,
    "bedrooms": 3,
    "bathrooms": 3,
    "stories": 1,
    "startingPrice": 242000,
    "dimensions": "30x68 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691"
    ],
    "floorPlanImage": "",
    "features": [
      "Covered Wrap-Around Architectural Deck",
      "3 Generous Bedroom Suites with Private Baths",
      "High-Performance Thermal Break Insulation",
      "50-Year Commercial Structural Steel Frame"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "2,050 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "3 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "3 Bath"
      },
      {
        "label": "Dimensions",
        "value": "30x68 ft"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular Homes",
      "Turnkey"
    ],
    "collections": [
      "modular-homes",
      "3-bedroom-turnkey-homes"
    ]
  },
  {
    "id": "mod-4-bed-adus",
    "slug": "4-bed-adus",
    "name": "4+ Bed Multi-Gen Modular ADU",
    "series": "Architectural Series",
    "category": "ADUs & Granny Pods",
    "architecturalStyle": "Multi-Gen Living",
    "tagline": "2,100 SQ FT • 4 Bed 3 Bath Multi-Family Living",
    "description": "<p><strong>The 4+ Bed Multi-Gen Modular ADU</strong> is an expansive two-story modular design engineered for large multi-generational families, accessory property living, or multi-tenant rental income.</p>",
    "sqft": 2100,
    "bedrooms": 4,
    "bathrooms": 3,
    "stories": 2,
    "startingPrice": 249000,
    "dimensions": "32x66 ft",
    "frameType": "100% Commercial-Grade Galvanized Light Gauge Steel",
    "roofPitch": "4:12 Pitch Architectural Metal",
    "windRating": "Up to 150 MPH Rated",
    "snowLoad": "50 PSF Ground Snow Load Rated",
    "warranty": "50-Year Structural Frame Warranty",
    "primaryImage": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "image": "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691",
    "gallery": [
      "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691"
    ],
    "floorPlanImage": "",
    "features": [
      "4 Full Bedrooms with Flexible Dual Living Spaces",
      "Multi-Generational Living Design",
      "Engineered Steel Trusses & Heavy Gauge Wall Posts",
      "Turnkey Assembly with Stamped Engineering Plans"
    ],
    "specs": [
      {
        "label": "Living Area",
        "value": "2,100 SQ FT"
      },
      {
        "label": "Bedrooms",
        "value": "4 Bed"
      },
      {
        "label": "Bathrooms",
        "value": "3 Bath"
      },
      {
        "label": "Dimensions",
        "value": "32x66 ft"
      },
      {
        "label": "Warranty",
        "value": "50-Year Structural Frame Warranty"
      }
    ],
    "customizableOptions": [],
    "tags": [
      "Featured",
      "Modular Homes",
      "Turnkey"
    ],
    "collections": [
      "adus",
      "modular-homes",
      "4-bedroom-turnkey-homes"
    ]
  }
];
