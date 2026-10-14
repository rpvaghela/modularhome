import fs from 'fs';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from '../src/lib/supabase';
import { BuildingModel } from '../src/data/models';

interface NewModelInput {
  slug: string;
  name: string;
  category: string;
  architecturalStyle: string;
  tagline: string;
  description: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  stories: number;
  startingPrice: number;
  dimensions: string;
  primaryImage: string;
  gallery: string[];
  features: string[];
  specs: { label: string; value: string }[];
  collections: string[];
}

const NEW_MODELS: NewModelInput[] = [
  {
    slug: 'the-madison',
    name: 'The Madison Modular Home',
    category: 'Modular Homes',
    architecturalStyle: 'Modern Craftsman',
    tagline: '1,850 SQ FT • 3 Bed 2 Bath Precision Factory Modular Home',
    description: '<p><strong>The Madison Modular Home</strong> is a premier 3-bedroom, 2-bathroom factory-built residence combining architectural proportion, high ceilings, an open island kitchen, and commercial-grade light-gauge steel construction for lifetime durability.</p>',
    sqft: 1850,
    bedrooms: 3,
    bathrooms: 2,
    stories: 1,
    startingPrice: 219000,
    dimensions: '28x66 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691',
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545'
    ],
    features: [
      'Galvanized Commercial-Grade Steel Framing',
      'High-R Structural Insulated Panel Walls (R-30)',
      'Vaulted Great Room with Quartz Island Kitchen',
      'Turnkey Delivery with Stamped Structural Plans'
    ],
    specs: [
      { label: 'Living Area', value: '1,850 SQ FT' },
      { label: 'Bedrooms', value: '3 Bed' },
      { label: 'Bathrooms', value: '2 Bath' },
      { label: 'Dimensions', value: '28x66 ft' },
      { label: 'Frame Type', value: 'Galvanized Light Gauge Steel' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['modular-homes', 'prefab-homes', '3-bedroom-turnkey-homes']
  },
  {
    slug: 'the-cub-cabin',
    name: 'The Cub Cabin',
    category: 'Cabins',
    architecturalStyle: 'Rustic Cabin',
    tagline: '480 SQ FT • 1 Bed 1 Bath Handcrafted Amish-Built Cabin',
    description: '<p><strong>The Cub Cabin</strong> delivers authentic rustic charm in a compact, highly functional footprint. Crafted with solid timber joinery, a covered front porch, vaulted tongue-and-groove ceilings, and full kitchenette and bath amenities.</p>',
    sqft: 480,
    bedrooms: 1,
    bathrooms: 1,
    stories: 1,
    startingPrice: 34900,
    dimensions: '14x34 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345'
    ],
    features: [
      'Solid Milled Timber Interlocking Walls',
      'Covered Full-Depth Front Porch',
      'Pre-Plumbed and Pre-Wired for Rapid Setup',
      'Heavy Snow Load Architectural Metal Roof'
    ],
    specs: [
      { label: 'Living Area', value: '480 SQ FT' },
      { label: 'Bedrooms', value: '1 Bed' },
      { label: 'Bathrooms', value: '1 Bath' },
      { label: 'Dimensions', value: '14x34 ft' },
      { label: 'Frame Type', value: 'Solid Heavy Timber & Log Walls' },
      { label: 'Warranty', value: '25-Year Craftsmanship Warranty' }
    ],
    collections: ['cabins', 'modular-cabins', '1-bedroom-turnkey-homes']
  },
  {
    slug: 'the-cleveland',
    name: 'The Cleveland Modular Residence',
    category: 'Modular Homes',
    architecturalStyle: 'Modern Prairie',
    tagline: '2,250 SQ FT • 4 Bed 2.5 Bath Luxury Modular Home',
    description: '<p><strong>The Cleveland Modular Residence</strong> is engineered for growing families, offering 4 expansive bedrooms, 2.5 bathrooms, an open concept entertaining great room, and a master suite retreat with double vanities and soaking tub.</p>',
    sqft: 2250,
    bedrooms: 4,
    bathrooms: 2.5,
    stories: 1,
    startingPrice: 259000,
    dimensions: '32x70 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545',
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691'
    ],
    features: [
      'Commercial Light-Gauge Steel Chassis & Wall Framing',
      '4 Bed Split Floor Plan for Maximum Privacy',
      'Argon Low-E Energy Efficient Windows',
      'Turnkey Nationwide Crane Delivery & Setup'
    ],
    specs: [
      { label: 'Living Area', value: '2,250 SQ FT' },
      { label: 'Bedrooms', value: '4 Bed' },
      { label: 'Bathrooms', value: '2.5 Bath' },
      { label: 'Dimensions', value: '32x70 ft' },
      { label: 'Frame Type', value: 'Commercial Steel Modular' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['modular-homes', 'prefab-homes', '4-bedroom-turnkey-homes']
  },
  {
    slug: 'the-cube-link-system',
    name: 'The Cube Link System Modular Living Unit',
    category: 'Modular Homes',
    architecturalStyle: 'Contemporary Modular',
    tagline: '960 SQ FT • 2 Bed 2 Bath Expandable Interlocking Modular System',
    description: '<p><strong>The Cube Link System</strong> utilizes state-of-the-art modular cube pods that connect seamlessly. Ideal as a modern home, accessory dwelling, or modular compound that can expand over time with additional modules.</p>',
    sqft: 960,
    bedrooms: 2,
    bathrooms: 2,
    stories: 1,
    startingPrice: 119000,
    dimensions: '24x40 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308'
    ],
    features: [
      'Modular Interlocking Cube System',
      'Architectural Black Trim & Floor-to-Ceiling Glass',
      'Pre-Wired for Smart Home & Solar Energy',
      'Rapid Assembly in 1-2 Days On-Site'
    ],
    specs: [
      { label: 'Living Area', value: '960 SQ FT' },
      { label: 'Bedrooms', value: '2 Bed' },
      { label: 'Bathrooms', value: '2 Bath' },
      { label: 'Dimensions', value: '24x40 ft' },
      { label: 'Frame Type', value: 'Structural Steel Modular Cube Core' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['modular-homes', 'tiny-homes', '2-bedroom-turnkey-homes']
  },
  {
    slug: 'a-frame-luxe',
    name: 'A-Frame Luxe Architectural Residence',
    category: 'A-Frames',
    architecturalStyle: 'Modern A-Frame',
    tagline: '1,250 SQ FT • 2 Bed 2 Bath Iconic Steep-Pitch Glass Home',
    description: '<p><strong>A-Frame Luxe</strong> redefines modern mountain and lakeside architecture. Featuring a dramatic 12:12 roofline, a full glass front gable with panoramic views, upper loft bedroom suite, and heavy snow load engineering.</p>',
    sqft: 1250,
    bedrooms: 2,
    bathrooms: 2,
    stories: 2,
    startingPrice: 139000,
    dimensions: '26x36 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284'
    ],
    features: [
      'Floor-to-Ceiling Front Glass Gable Wall',
      'Open Timber Rafter Ceilings with Upper Loft',
      'Engineered for 70+ PSF Severe Snow Loads',
      'Pre-Fabricated Steel Truss System'
    ],
    specs: [
      { label: 'Living Area', value: '1,250 SQ FT' },
      { label: 'Bedrooms', value: '2 Bed' },
      { label: 'Bathrooms', value: '2 Bath' },
      { label: 'Dimensions', value: '26x36 ft' },
      { label: 'Roof Pitch', value: '12:12 Steep Pitch Standing Seam' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['a-frame-homes', 'house-kits', '2-bedroom-turnkey-homes']
  },
  {
    slug: 'a-frame-united',
    name: 'A-Frame United Metal House Kit',
    category: 'A-Frames',
    architecturalStyle: 'Modern A-Frame',
    tagline: '1,650 SQ FT • 3 Bed 2 Bath High-Performance A-Frame Kit',
    description: '<p><strong>A-Frame United</strong> offers spacious 3-bedroom mountain living with double-height cathedral ceilings, open mezzanine bridge, walk-out balcony, and complete precision-engineered steel structural frame kit.</p>',
    sqft: 1650,
    bedrooms: 3,
    bathrooms: 2,
    stories: 2,
    startingPrice: 169000,
    dimensions: '28x44 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/blackaframe.png?v=1770169284'
    ],
    features: [
      '3-Bedroom A-Frame with Upper Mezzanine',
      'Commercial Pre-Cut Structural Steel Framing Kit',
      'Architectural Matte Black Standing Seam Roofing',
      'Double Pane Low-E High-Altitude Glazing'
    ],
    specs: [
      { label: 'Living Area', value: '1,650 SQ FT' },
      { label: 'Bedrooms', value: '3 Bed' },
      { label: 'Bathrooms', value: '2 Bath' },
      { label: 'Dimensions', value: '28x44 ft' },
      { label: 'Roof Pitch', value: '12:12 Steep Pitch' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['a-frame-homes', 'house-kits', '3-bedroom-turnkey-homes']
  },
  {
    slug: 'aspen',
    name: 'The Aspen Park Model Modular Cabin',
    category: 'Park Models',
    architecturalStyle: 'Park Model RV',
    tagline: '400 SQ FT • 1 Bed 1 Bath Luxury Park Model Home',
    description: '<p><strong>The Aspen</strong> is our flagship resort-grade park model modular cabin, featuring 400 sq ft of luxury finishes, a covered porch, clerestory windows, full residential kitchen appliances, and complete RVIA certification.</p>',
    sqft: 400,
    bedrooms: 1,
    bathrooms: 1,
    stories: 1,
    startingPrice: 69900,
    dimensions: '12x36 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/aspen2.avif?v=1783816889',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/aspen2.avif?v=1783816889'
    ],
    features: [
      'RVIA Certified Park Model RV / Cabin',
      'Clerestory Dormer Windows for Natural Light',
      'Full Kitchen with Stainless Steel Appliances',
      'Covered Composite Deck & Porch'
    ],
    specs: [
      { label: 'Living Area', value: '400 SQ FT' },
      { label: 'Bedrooms', value: '1 Bed' },
      { label: 'Bathrooms', value: '1 Bath' },
      { label: 'Dimensions', value: '12x36 ft' },
      { label: 'Warranty', value: '25-Year Craftsmanship Warranty' }
    ],
    collections: ['park-models', 'tiny-homes', '1-bedroom-turnkey-homes']
  },
  {
    slug: 'backyard-escape',
    name: 'Backyard Escape Studio ADU',
    category: 'ADUs & Granny Pods',
    architecturalStyle: 'Contemporary ADU',
    tagline: '420 SQ FT • Studio 1 Bath Detached Living Suite',
    description: '<p><strong>Backyard Escape</strong> is an efficient modern accessory dwelling unit (ADU) engineered for swift crane or roll-off installation in backyard settings. Features full bathroom, efficiency kitchen, and private patio slider.</p>',
    sqft: 420,
    bedrooms: 0,
    bathrooms: 1,
    stories: 1,
    startingPrice: 54900,
    dimensions: '14x30 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308'
    ],
    features: [
      'Turnkey Studio Accessory Dwelling Unit',
      'Modern High-Efficiency Heat Pump Mini-Split',
      'Engineered for Standard Backyard Setbacks',
      'Factory Complete with Plumbing & Fixtures'
    ],
    specs: [
      { label: 'Living Area', value: '420 SQ FT' },
      { label: 'Bedrooms', value: 'Studio' },
      { label: 'Bathrooms', value: '1 Bath' },
      { label: 'Dimensions', value: '14x30 ft' },
      { label: 'Warranty', value: '25-Year Structural Frame Warranty' }
    ],
    collections: ['adus', 'tiny-homes']
  },
  {
    slug: 'deluxe-retreat',
    name: 'Deluxe Retreat Modular Cabin',
    category: 'Cabins',
    architecturalStyle: 'Rustic Cabin',
    tagline: '780 SQ FT • 2 Bed 1 Bath Handcrafted Timber Retreat',
    description: '<p><strong>The Deluxe Retreat</strong> provides the warmth of solid Amish-crafted timber with modern 2-bedroom conveniences. High cathedral ceilings, exposed beams, and energy-efficient insulated log walls.</p>',
    sqft: 780,
    bedrooms: 2,
    bathrooms: 1,
    stories: 1,
    startingPrice: 62500,
    dimensions: '20x39 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345'
    ],
    features: [
      'Solid Interlocking Milled Timber Construction',
      'Open Concept Kitchen and Living Area',
      'Covered Full-Length Country Porch',
      'Pre-Finished Solid Wood Ceilings'
    ],
    specs: [
      { label: 'Living Area', value: '780 SQ FT' },
      { label: 'Bedrooms', value: '2 Bed' },
      { label: 'Bathrooms', value: '1 Bath' },
      { label: 'Dimensions', value: '20x39 ft' },
      { label: 'Warranty', value: '25-Year Timber Warranty' }
    ],
    collections: ['cabins', 'modular-cabins', '2-bedroom-turnkey-homes']
  },
  {
    slug: 'firefly',
    name: 'Firefly Modern Tiny Home',
    category: 'Tiny Homes',
    architecturalStyle: 'Modern Tiny Home',
    tagline: '320 SQ FT • 1 Bed 1 Bath Efficient Prefab Tiny Home',
    description: '<p><strong>The Firefly Tiny Home</strong> maximizes space through innovative built-in storage, a private main-level sleeping suite, quartz galley kitchenette, and oversized double-hung windows for abundant natural light.</p>',
    sqft: 320,
    bedrooms: 1,
    bathrooms: 1,
    stories: 1,
    startingPrice: 44900,
    dimensions: '10x32 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418'
    ],
    features: [
      'Main-Floor Bedroom Design (No Ladders Needed)',
      'Mini-Split HVAC Climate Control System',
      'Architectural Metal Siding & Cedar Accents',
      'Direct RV / Standard Utility Hookups'
    ],
    specs: [
      { label: 'Living Area', value: '320 SQ FT' },
      { label: 'Bedrooms', value: '1 Bed' },
      { label: 'Bathrooms', value: '1 Bath' },
      { label: 'Dimensions', value: '10x32 ft' },
      { label: 'Warranty', value: '25-Year Structural Frame Warranty' }
    ],
    collections: ['tiny-homes', '1-bedroom-turnkey-homes']
  },
  {
    slug: 'grizzly',
    name: 'Grizzly Heavy Timber Modular Cabin',
    category: 'Cabins',
    architecturalStyle: 'Mountain Lodge',
    tagline: '1,450 SQ FT • 3 Bed 2 Bath Solid Timber Modular Cabin',
    description: '<p><strong>The Grizzly</strong> is an impressive 3-bedroom, 2-bathroom mountain modular cabin engineered for harsh alpine conditions. Features double-stacked timber walls, stone fireplace chase, and huge covered entertaining deck.</p>',
    sqft: 1450,
    bedrooms: 3,
    bathrooms: 2,
    stories: 1,
    startingPrice: 118000,
    dimensions: '26x56 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345'
    ],
    features: [
      'Solid Heavy Timber Milled Log Walls',
      'Vaulted Great Room with Heavy Timber Trusses',
      'Large Covered Front and Rear Porches',
      'Engineered for Severe Snow & Mountain Wind'
    ],
    specs: [
      { label: 'Living Area', value: '1,450 SQ FT' },
      { label: 'Bedrooms', value: '3 Bed' },
      { label: 'Bathrooms', value: '2 Bath' },
      { label: 'Dimensions', value: '26x56 ft' },
      { label: 'Warranty', value: '30-Year Timber Warranty' }
    ],
    collections: ['cabins', 'modular-cabins', '3-bedroom-turnkey-homes']
  },
  {
    slug: 'modern-living',
    name: 'Modern Living Architectural Modular Home',
    category: 'Modular Homes',
    architecturalStyle: 'Contemporary',
    tagline: '1,920 SQ FT • 3 Bed 2 Bath High-Efficiency Modular Residence',
    description: '<p><strong>Modern Living</strong> blends Scandinavian minimalist geometry with robust structural steel modular engineering. Features open-plan living, black architectural windows, quartz countertops, and integrated LED accent lighting.</p>',
    sqft: 1920,
    bedrooms: 3,
    bathrooms: 2,
    stories: 1,
    startingPrice: 228000,
    dimensions: '30x64 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691'
    ],
    features: [
      'Contemporary Flat-Line & Low-Pitch Modern Architecture',
      'Galvanized Structural Steel Frame',
      'Continuous Exterior Insulation Barrier',
      'Turnkey Delivery with Stamped Foundation Plans'
    ],
    specs: [
      { label: 'Living Area', value: '1,920 SQ FT' },
      { label: 'Bedrooms', value: '3 Bed' },
      { label: 'Bathrooms', value: '2 Bath' },
      { label: 'Dimensions', value: '30x64 ft' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['modular-homes', 'prefab-homes', '3-bedroom-turnkey-homes']
  },
  {
    slug: 'modular-adus',
    name: 'Modular ADU High-Performance Unit',
    category: 'ADUs & Granny Pods',
    architecturalStyle: 'Modern ADU',
    tagline: '520 SQ FT • 1 Bed 1 Bath Turnkey Accessory Dwelling Unit',
    description: '<p><strong>The Modular ADU</strong> is an engineered 1-bedroom backyard suite designed to generate rental income or provide private independent living for loved ones. Pre-permitted in multiple jurisdictions with rapid setup.</p>',
    sqft: 520,
    bedrooms: 1,
    bathrooms: 1,
    stories: 1,
    startingPrice: 68000,
    dimensions: '14x38 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308'
    ],
    features: [
      'Turnkey Pre-Permitted Accessory Dwelling Unit',
      'Full Kitchenette with Stainless Steel Appliances',
      'Modern High-Efficiency Insulation Package',
      'Standard 200 Amp Service Compatibility'
    ],
    specs: [
      { label: 'Living Area', value: '520 SQ FT' },
      { label: 'Bedrooms', value: '1 Bed' },
      { label: 'Bathrooms', value: '1 Bath' },
      { label: 'Dimensions', value: '14x38 ft' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['adus', 'modular-homes', '1-bedroom-turnkey-homes']
  },
  {
    slug: 'multi-family-homes',
    name: 'Multi-Family Modular Duplex Residence',
    category: 'Commercial Modular Buildings',
    architecturalStyle: 'Multi-Family Duplex',
    tagline: '2,400 SQ FT • 4 Bed 4 Bath Two-Unit Income Property',
    description: '<p><strong>Multi-Family Modular Duplex</strong> features two identical, fully independent 2-bedroom, 2-bathroom rental units. Complete soundproofing party-wall assemblies, independent utility subpanels, and fast modular crane-set erection.</p>',
    sqft: 2400,
    bedrooms: 4,
    bathrooms: 4,
    stories: 2,
    startingPrice: 289000,
    dimensions: '32x75 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/442435176_1117036319546606_7478160302982824370_n_2a3e20a5-fc3f-46af-9aa2-8da3022fbe87.jpg?v=1736129729',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/442435176_1117036319546606_7478160302982824370_n_2a3e20a5-fc3f-46af-9aa2-8da3022fbe87.jpg?v=1736129729'
    ],
    features: [
      'Two Independent 2-Bed 2-Bath Income Living Units',
      'STC 58+ Acoustic Sound-Dampening Party Wall',
      'Dual Meters for Electric, Water & HVAC',
      'Commercial Grade Light Gauge Steel Frame'
    ],
    specs: [
      { label: 'Living Area', value: '2,400 SQ FT' },
      { label: 'Bedrooms', value: '4 Bed (2 per unit)' },
      { label: 'Bathrooms', value: '4 Bath (2 per unit)' },
      { label: 'Stories', value: '2 Level' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['commercial-modular-buildings', 'modular-homes']
  },
  {
    slug: 'nova',
    name: 'Nova Contemporary Prefab Home',
    category: 'Prefab Homes',
    architecturalStyle: 'Contemporary',
    tagline: '1,750 SQ FT • 3 Bed 2 Bath Modern Prefab Design',
    description: '<p><strong>The Nova Prefab Home</strong> is a modern masterpiece designed for clean, light-filled living. Large sliding patio doors, open kitchen layout, and energy-efficient factory precision modules built for rapid nationwide delivery.</p>',
    sqft: 1750,
    bedrooms: 3,
    bathrooms: 2,
    stories: 1,
    startingPrice: 198000,
    dimensions: '28x62 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/prefabdua1.jpg?v=1737512098'
    ],
    features: [
      'Modern High-Efficiency Thermal Envelope',
      'Large Open Living and Dining Area',
      'Master En-Suite with Walk-in Shower',
      'Factory Complete Turnkey Interior Finishes'
    ],
    specs: [
      { label: 'Living Area', value: '1,750 SQ FT' },
      { label: 'Bedrooms', value: '3 Bed' },
      { label: 'Bathrooms', value: '2 Bath' },
      { label: 'Dimensions', value: '28x62 ft' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['prefab-homes', 'modular-homes', '3-bedroom-turnkey-homes']
  },
  {
    slug: 'pre-fabricated-tiny-homes',
    name: 'Pre-Fabricated Tiny Home Turnkey Model',
    category: 'Tiny Homes',
    architecturalStyle: 'Modern Tiny Home',
    tagline: '390 SQ FT • 1 Bed 1 Bath Turnkey Tiny Home',
    description: '<p><strong>The Pre-Fabricated Tiny Home</strong> delivers high-end minimalism with zero wasted space. Features a vaulted living space, full shower, washer/dryer hookups, and high-performance exterior cladding.</p>',
    sqft: 390,
    bedrooms: 1,
    bathrooms: 1,
    stories: 1,
    startingPrice: 49500,
    dimensions: '12x33 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418'
    ],
    features: [
      'Turnkey Small Footprint Living',
      'Full Kitchen with Induction Cooktop',
      'Full Size Shower with Glass Enclosure',
      'Rapid Delivery Anywhere in the Continental US'
    ],
    specs: [
      { label: 'Living Area', value: '390 SQ FT' },
      { label: 'Bedrooms', value: '1 Bed' },
      { label: 'Bathrooms', value: '1 Bath' },
      { label: 'Dimensions', value: '12x33 ft' },
      { label: 'Warranty', value: '25-Year Structural Frame Warranty' }
    ],
    collections: ['tiny-homes', 'prefab-homes', '1-bedroom-turnkey-homes']
  },
  {
    slug: 'small-spaces',
    name: 'Small Spaces Micro Modular Living',
    category: 'Tiny Homes',
    architecturalStyle: 'Minimalist Modular',
    tagline: '450 SQ FT • 1 Bed 1 Bath Compact Modern Living',
    description: '<p><strong>Small Spaces Micro Modular</strong> is engineered for homeowners wanting low-maintenance, ultra-efficient modular living without sacrificing luxury or quality materials.</p>',
    sqft: 450,
    bedrooms: 1,
    bathrooms: 1,
    stories: 1,
    startingPrice: 58000,
    dimensions: '14x32 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/maddy.png?v=1783804418'
    ],
    features: [
      'High-R Structural Insulated Panel Walls',
      'Quiet Multi-Zone Mini-Split Climate Control',
      'Built-in Storage Closets & Cabinets',
      'Nationwide Fast Delivery'
    ],
    specs: [
      { label: 'Living Area', value: '450 SQ FT' },
      { label: 'Bedrooms', value: '1 Bed' },
      { label: 'Bathrooms', value: '1 Bath' },
      { label: 'Dimensions', value: '14x32 ft' },
      { label: 'Warranty', value: '25-Year Structural Frame Warranty' }
    ],
    collections: ['tiny-homes', 'modular-homes', '1-bedroom-turnkey-homes']
  },
  {
    slug: 'studio-adus',
    name: 'Studio ADU Backyard Suite',
    category: 'ADUs & Granny Pods',
    architecturalStyle: 'Modern ADU',
    tagline: '380 SQ FT • Studio 1 Bath Backyard Guest Suite',
    description: '<p><strong>The Studio ADU</strong> is a self-contained modern living unit designed specifically for single-family residential backyards. Perfect for elderly relatives, adult children, or high-yield rental income.</p>',
    sqft: 380,
    bedrooms: 0,
    bathrooms: 1,
    stories: 1,
    startingPrice: 48900,
    dimensions: '12x32 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/ad16.jpg?v=1732947308'
    ],
    features: [
      'Compact Studio Floor Plan with Full Bath',
      'Factory Wired and Plumbed for Quick Connection',
      'Architectural Fiber Cement & Wood Accent Siding',
      'Energy Star Rated Windows and Doors'
    ],
    specs: [
      { label: 'Living Area', value: '380 SQ FT' },
      { label: 'Bedrooms', value: 'Studio' },
      { label: 'Bathrooms', value: '1 Bath' },
      { label: 'Dimensions', value: '12x32 ft' },
      { label: 'Warranty', value: '25-Year Structural Frame Warranty' }
    ],
    collections: ['adus', 'tiny-homes']
  },
  {
    slug: 'twilight',
    name: 'Twilight Luxury Modular Villa',
    category: 'Modular Homes',
    architecturalStyle: 'Luxury Modern',
    tagline: '2,100 SQ FT • 3 Bed 2.5 Bath Luxury Modular Villa',
    description: '<p><strong>The Twilight Modular Villa</strong> represents the peak of luxury factory modular building. Featuring 10-foot ceilings, floor-to-ceiling glass patio sliders, a chef’s kitchen with waterfall quartz island, and a spa-inspired master retreat.</p>',
    sqft: 2100,
    bedrooms: 3,
    bathrooms: 2.5,
    stories: 1,
    startingPrice: 265000,
    dimensions: '30x70 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691'
    ],
    features: [
      '10-Foot Finished Ceilings Throughout',
      'Commercial-Grade Galvanized Light-Gauge Steel Chassis',
      'Waterfall Quartz Island & Custom Cabinetry',
      'Turnkey Delivery with Stamped Architectural Plans'
    ],
    specs: [
      { label: 'Living Area', value: '2,100 SQ FT' },
      { label: 'Bedrooms', value: '3 Bed' },
      { label: 'Bathrooms', value: '2.5 Bath' },
      { label: 'Dimensions', value: '30x70 ft' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['modular-homes', 'prefab-homes', '3-bedroom-turnkey-homes']
  },
  {
    slug: '1-bed-1-bath',
    name: '1 Bed 1 Bath Compact Turnkey Home',
    category: 'Modular Homes',
    architecturalStyle: 'Modern Compact',
    tagline: '550 SQ FT • 1 Bed 1 Bath Turnkey Modular Living',
    description: '<p><strong>The 1 Bed 1 Bath Turnkey Home</strong> is engineered for independent living, down-sizers, or vacation rental properties. Built to IRC residential building codes with full kitchen, bedroom, and bath.</p>',
    sqft: 550,
    bedrooms: 1,
    bathrooms: 1,
    stories: 1,
    startingPrice: 69900,
    dimensions: '16x34 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691'
    ],
    features: [
      'Full IRC Code Residential Compliance',
      'Private Master Bedroom with Built-in Wardrobe',
      'Full Kitchen with Dining Peninsula',
      'Turnkey Delivery Nationwide'
    ],
    specs: [
      { label: 'Living Area', value: '550 SQ FT' },
      { label: 'Bedrooms', value: '1 Bed' },
      { label: 'Bathrooms', value: '1 Bath' },
      { label: 'Dimensions', value: '16x34 ft' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['modular-homes', '1-bedroom-turnkey-homes', 'tiny-homes']
  },
  {
    slug: '1-bed-1-bath-rooftop-deck',
    name: '1 Bed 1 Bath with Rooftop Deck Model',
    category: 'Modular Homes',
    architecturalStyle: 'Modern Architectural',
    tagline: '620 SQ FT • 1 Bed 1 Bath with Spiral Rooftop Deck',
    description: '<p><strong>The 1 Bed 1 Bath with Rooftop Deck</strong> offers panoramic 360-degree views with a full engineered rooftop observation terrace, spiral staircase, modern finishes, and commercial steel frame.</p>',
    sqft: 620,
    bedrooms: 1,
    bathrooms: 1,
    stories: 2,
    startingPrice: 82500,
    dimensions: '16x38 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691'
    ],
    features: [
      'Full Reinforced Rooftop Entertaining Deck',
      'Exterior Powder-Coated Spiral Staircase',
      'Galvanized Structural Steel Frame',
      'Turnkey Factory Complete Interior'
    ],
    specs: [
      { label: 'Living Area', value: '620 SQ FT' },
      { label: 'Bedrooms', value: '1 Bed' },
      { label: 'Bathrooms', value: '1 Bath' },
      { label: 'Dimensions', value: '16x38 ft' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['modular-homes', '1-bedroom-turnkey-homes', 'adus']
  },
  {
    slug: '2-bed-2-bath',
    name: '2 Bed 2 Bath Turnkey Modular Home',
    category: 'Modular Homes',
    architecturalStyle: 'Modern Craftsman',
    tagline: '980 SQ FT • 2 Bed 2 Bath Efficient Floor Plan',
    description: '<p><strong>The 2 Bed 2 Bath Turnkey Modular Home</strong> features dual master suites, perfect for roommates, small families, or vacation rentals. Features open-concept living and central kitchen.</p>',
    sqft: 980,
    bedrooms: 2,
    bathrooms: 2,
    stories: 1,
    startingPrice: 119000,
    dimensions: '24x41 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691'
    ],
    features: [
      'Dual Master Suites for Maximum Privacy',
      'Open Great Room with Vaulted Ceilings',
      'Commercial Light Gauge Steel Frame',
      'Turnkey Fast Assembly On-Site'
    ],
    specs: [
      { label: 'Living Area', value: '980 SQ FT' },
      { label: 'Bedrooms', value: '2 Bed' },
      { label: 'Bathrooms', value: '2 Bath' },
      { label: 'Dimensions', value: '24x41 ft' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['modular-homes', '2-bedroom-turnkey-homes']
  },
  {
    slug: '3-bed-3-bath',
    name: '3 Bed 3 Bath Family Modular Residence',
    category: 'Modular Homes',
    architecturalStyle: 'Ranch & Farmhouse',
    tagline: '1,850 SQ FT • 3 Bed 3 Bath Spacious Modular Home',
    description: '<p><strong>The 3 Bed 3 Bath Family Modular Residence</strong> gives every bedroom its own private or dedicated bath. Features huge walk-in closets, kitchen island, and dedicated mudroom/laundry room.</p>',
    sqft: 1850,
    bedrooms: 3,
    bathrooms: 3,
    stories: 1,
    startingPrice: 219000,
    dimensions: '28x66 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/wow5z.jpg?v=1736124545'
    ],
    features: [
      '3 Full Bathrooms for Comfort and Convenience',
      'Split Bedroom Layout with Dedicated Master Wing',
      'Energy-Efficient High-R SIP Panel Exterior',
      'Turnkey Nationwide Crane Delivery'
    ],
    specs: [
      { label: 'Living Area', value: '1,850 SQ FT' },
      { label: 'Bedrooms', value: '3 Bed' },
      { label: 'Bathrooms', value: '3 Bath' },
      { label: 'Dimensions', value: '28x66 ft' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['modular-homes', '3-bedroom-turnkey-homes']
  },
  {
    slug: '3-bed-3-bath-with-deck',
    name: '3 Bed 3 Bath Modular Home with Wrap-Around Deck',
    category: 'Modular Homes',
    architecturalStyle: 'Modern Craftsman',
    tagline: '2,050 SQ FT • 3 Bed 3 Bath with Expansive Wrap-Around Porch',
    description: '<p><strong>The 3 Bed 3 Bath with Wrap-Around Deck</strong> seamlessly blends indoor and outdoor luxury living with a massive covered porch, outdoor fireplace hookups, and spacious 2,050 sq ft interior.</p>',
    sqft: 2050,
    bedrooms: 3,
    bathrooms: 3,
    stories: 1,
    startingPrice: 242000,
    dimensions: '30x68 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691'
    ],
    features: [
      'Covered Wrap-Around Architectural Deck',
      '3 Generous Bedroom Suites with Private Baths',
      'High-Performance Thermal Break Insulation',
      '50-Year Commercial Structural Steel Frame'
    ],
    specs: [
      { label: 'Living Area', value: '2,050 SQ FT' },
      { label: 'Bedrooms', value: '3 Bed' },
      { label: 'Bathrooms', value: '3 Bath' },
      { label: 'Dimensions', value: '30x68 ft' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['modular-homes', '3-bedroom-turnkey-homes']
  },
  {
    slug: '4-bed-adus',
    name: '4+ Bed Multi-Gen Modular ADU',
    category: 'Modular Homes',
    architecturalStyle: 'Multi-Gen Living',
    tagline: '2,100 SQ FT • 4 Bed 3 Bath Multi-Family Living',
    description: '<p><strong>The 4+ Bed Multi-Gen Modular ADU</strong> is an expansive two-story modular design engineered for large multi-generational families, accessory property living, or multi-tenant rental income.</p>',
    sqft: 2100,
    bedrooms: 4,
    bathrooms: 3,
    stories: 2,
    startingPrice: 249000,
    dimensions: '32x66 ft',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691',
    gallery: [
      'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691'
    ],
    features: [
      '4 Full Bedrooms with Flexible Dual Living Spaces',
      'Multi-Generational Living Design',
      'Engineered Steel Trusses & Heavy Gauge Wall Posts',
      'Turnkey Assembly with Stamped Engineering Plans'
    ],
    specs: [
      { label: 'Living Area', value: '2,100 SQ FT' },
      { label: 'Bedrooms', value: '4 Bed' },
      { label: 'Bathrooms', value: '3 Bath' },
      { label: 'Dimensions', value: '32x66 ft' },
      { label: 'Warranty', value: '50-Year Structural Frame Warranty' }
    ],
    collections: ['modular-homes', 'adus', '4-bedroom-turnkey-homes']
  }
];

async function main() {
  console.log(`Starting to add ${NEW_MODELS.length} models from pages.xlsx...`);

  // 1. Update src/data/all_products_catalog.json
  const catalogPath = path.join(process.cwd(), 'src/data/all_products_catalog.json');
  const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const existingHandles = new Set(catalogData.map((c: any) => c.handle?.toLowerCase()));

  let addedToCatalog = 0;
  for (const m of NEW_MODELS) {
    if (!existingHandles.has(m.slug.toLowerCase())) {
      catalogData.push({
        id: `page_model_${m.slug}`,
        handle: m.slug,
        title: m.name,
        name: m.name,
        category: m.category,
        product_type: m.category,
        architectural_style: m.architecturalStyle,
        tagline: m.tagline,
        description: m.description,
        description_html: m.description,
        sqft: m.sqft,
        bedrooms: m.bedrooms,
        bathrooms: m.bathrooms,
        stories: m.stories,
        starting_price: m.startingPrice,
        price: m.startingPrice,
        dimensions: m.dimensions,
        primary_image_url: m.primaryImage,
        image: m.primaryImage,
        images: m.gallery,
        features: m.features,
        specs: m.specs,
        collections: m.collections,
        tags: [m.category, 'Pages Model', 'Turnkey']
      });
      existingHandles.add(m.slug.toLowerCase());
      addedToCatalog++;
    }
  }
  fs.writeFileSync(catalogPath, JSON.stringify(catalogData, null, 2), 'utf8');
  console.log(`Added ${addedToCatalog} models to all_products_catalog.json.`);

  // 2. Update src/data/models.ts
  const modelsTsPath = path.join(process.cwd(), 'src/data/models.ts');
  let modelsTsContent = fs.readFileSync(modelsTsPath, 'utf8');
  const closingIdx = modelsTsContent.lastIndexOf('];');

  if (closingIdx !== -1) {
    const formattedList = NEW_MODELS.map(m => ({
      id: `mod-${m.slug}`,
      slug: m.slug,
      name: m.name,
      series: 'Architectural Series',
      category: m.category,
      architecturalStyle: m.architecturalStyle,
      tagline: m.tagline,
      description: m.description,
      sqft: m.sqft,
      bedrooms: m.bedrooms,
      bathrooms: m.bathrooms,
      stories: m.stories,
      startingPrice: m.startingPrice,
      dimensions: m.dimensions,
      frameType: '100% Commercial-Grade Galvanized Light Gauge Steel',
      roofPitch: '4:12 Pitch Architectural Metal',
      windRating: 'Up to 150 MPH Rated',
      snowLoad: '50 PSF Ground Snow Load Rated',
      warranty: '50-Year Structural Frame Warranty',
      primaryImage: m.primaryImage,
      image: m.primaryImage,
      gallery: m.gallery,
      floorPlanImage: '',
      features: m.features,
      specs: m.specs,
      customizableOptions: [],
      tags: ['Featured', m.category, 'Turnkey'],
      collections: m.collections
    }));

    const insertTs = ',\n' + formattedList.map(m => '  ' + JSON.stringify(m, null, 2).replace(/\n/g, '\n  ')).join(',\n') + '\n';
    modelsTsContent = modelsTsContent.slice(0, closingIdx) + insertTs + modelsTsContent.slice(closingIdx);
    fs.writeFileSync(modelsTsPath, modelsTsContent, 'utf8');
    console.log(`Added ${formattedList.length} models into models.ts.`);
  }

  // 3. Upsert into Supabase products table
  if (isSupabaseConfigured()) {
    console.log('Upserting models into Supabase products table...');
    for (const m of NEW_MODELS) {
      try {
        const { data: prodData, error } = await supabaseAdmin
          .from('products')
          .upsert({
            handle: m.slug,
            title: m.name,
            product_type: m.category,
            vendor: 'ModularHome.com',
            status: 'active',
            seo_title: `${m.name} | ModularHome.com`,
            seo_description: m.tagline,
            description_html: m.description,
            sqft: m.sqft,
            bedrooms: m.bedrooms,
            bathrooms: m.bathrooms,
            stories: m.stories,
            dimensions: m.dimensions,
            starting_price: m.startingPrice,
            primary_image_url: m.primaryImage,
            series: 'Architectural Series',
            architectural_style: m.architecturalStyle,
            tagline: m.tagline,
            features: m.features,
            specs: m.specs,
            tags: [m.category, 'Turnkey', 'Featured'],
            is_featured: true,
            published_at: new Date().toISOString()
          }, { onConflict: 'handle' })
          .select('id')
          .single();

        if (error) {
          console.warn(`Supabase upsert note for ${m.slug}:`, error.message);
        } else if (prodData?.id) {
          try {
            await supabaseAdmin.from('product_variants').upsert({
              product_id: prodData.id,
              title: 'Standard Turnkey Package',
              price: m.startingPrice,
              available: true
            }, { onConflict: 'product_id,title' });
          } catch {}
        }
      } catch (err: any) {
        console.warn(`Error upserting ${m.slug}:`, err.message);
      }
    }
  }

  // 4. Update shopify_redirects.json
  const redirectsPath = path.join(process.cwd(), 'src/data/shopify_redirects.json');
  const redirectsData = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

  for (const m of NEW_MODELS) {
    redirectsData[`/pages/${m.slug}`] = `/models/${m.slug}`;
    redirectsData[`/pages/${m.slug}/`] = `/models/${m.slug}`;
  }
  fs.writeFileSync(redirectsPath, JSON.stringify(redirectsData, null, 2), 'utf8');
  console.log(`Added 301 redirects for all ${NEW_MODELS.length} pages in shopify_redirects.json.`);

  // 5. Update src/data/all_collections.json to link these models
  const collectionsPath = path.join(process.cwd(), 'src/data/all_collections.json');
  const collectionsData = JSON.parse(fs.readFileSync(collectionsPath, 'utf8'));

  for (const col of collectionsData) {
    for (const m of NEW_MODELS) {
      if (m.collections.includes(col.handle) || m.collections.includes(col.slug)) {
        if (!col.productHandles) col.productHandles = [];
        if (!col.productHandles.includes(m.slug)) {
          col.productHandles.push(m.slug);
          col.productCount = (col.productCount || 0) + 1;
        }
      }
    }
  }
  fs.writeFileSync(collectionsPath, JSON.stringify(collectionsData, null, 2), 'utf8');
  console.log(`Updated collection linkages for the new models.`);
}

main().catch(console.error);
