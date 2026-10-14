const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const collectionsPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_collections.json');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf8'));

const rawLive = fs.readFileSync('C:\\Users\\cheta\\.gemini\\antigravity-ide\\brain\\2e2038b1-6944-41a3-9787-b01da6fc14e7\\.system_generated\\steps\\710\\content.md', 'utf8');
const jsonStart = rawLive.indexOf('{');
const liveProducts = JSON.parse(rawLive.slice(jsonStart)).products;

console.log('--- Step 1: Normalize Existing Catalog Items with Undefined Slugs ---');
let fixedSlugsCount = 0;
catalog.forEach(p => {
  if (!p.slug || p.slug === 'undefined') {
    const realSlug = p.handle || p.id.replace('page_model_', '');
    p.slug = realSlug;
    p.handle = realSlug;
    p.startingPrice = p.startingPrice || p.starting_price || p.price || 0;
    p.starting_price = p.startingPrice;
    p.price = p.startingPrice;
    p.primaryImage = p.primaryImage || p.primary_image_url || p.image || (p.images && p.images[0]) || '';
    p.primary_image_url = p.primaryImage;
    p.image = p.primaryImage;
    p.gallery = p.gallery && p.gallery.length ? p.gallery : (p.images || (p.primaryImage ? [p.primaryImage] : []));
    p.images = p.gallery;
    fixedSlugsCount++;
  }
});
console.log(`Normalized ${fixedSlugsCount} existing catalog items.`);

console.log('\n--- Step 2: Build Full Products for 14 Missing Move-In-Ready Models ---');
const catalogSlugs = new Set(catalog.map(p => p.slug));

// Metadata mapping for the 14 missing products
const metaConfig = {
  'the-nordic-rancher-3-bed-2-bath-or-2-bed-2-bath-option': {
    name: 'The Nordic Rancher (3 Bed 2 Bath or 2 Bed 2 Bath Option)',
    title: 'The Nordic Rancher (3 Bed 2 Bath or 2 Bed 2 Bath Option)',
    sqft: 1456,
    bedrooms: 3,
    bathrooms: 2,
    dimensions: "28' x 52'",
    price: 184900,
    style: 'Modern Nordic Rancher',
    tagline: '1,456 SQ FT • 3 Bed 2 Bath Amish-Built Turnkey Modular Home',
    features: [
      "Amish-Built Precision Modular Construction",
      "Spacious 3 Bedroom / 2 Bathroom Layout",
      "Full Four-Season Climate Insulation Package",
      "Turnkey Move-In Ready Setup with Installed Kitchen & Baths"
    ]
  },
  'the-nordic-raven-modular-cabin-2-bed-2-bath-or-3-bed-2-bath-options': {
    name: 'The Nordic Raven Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    title: 'The Nordic Raven Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    sqft: 1026,
    bedrooms: 2,
    bathrooms: 2,
    dimensions: "23' x 50'",
    price: 199900,
    style: 'Modern Nordic Mountain Modular',
    tagline: '1,026 SQ FT • 2 Bed 2 Bath (3 Bed Option) Turnkey Modular Cabin',
    features: [
      "Bold Black Board-and-Batten Exterior with Natural Wood Accents",
      "Dramatic Soaring Great Room with Lofted Living Area",
      "400 SQ FT Full-Length Covered Front Porch",
      "Ductless Mini-Split HVAC Climate Control Throughout"
    ]
  },
  'the-grand-canyon-modular-cabin-4-bed-2-bath-or-2-bed': {
    name: 'The Grand Canyon Modular Cabin (4 Bed 2 Bath or 2 Bed)',
    title: 'The Grand Canyon Modular Cabin (4 Bed 2 Bath or 2 Bed)',
    sqft: 1280,
    bedrooms: 4,
    bathrooms: 2,
    dimensions: "32' x 40'",
    price: 249900,
    style: 'Modern Rustic Modular Estate',
    tagline: '1,280 SQ FT • 4 Bed 2 Bath Amish-Built Modular Cabin',
    features: [
      "Heavy-Duty Black Standing Seam Metal Exterior",
      "4 Bedroom Family Floor Plan with 2 Full Bathrooms",
      "Precision Factory-Assembled Modular Quality",
      "Turnkey Plumbing, Electrical & Fixtures Installed"
    ]
  },
  'the-ocean-breeze-modular-cabin-2-bed-2-bath-or-3-bed-2-bath-options': {
    name: 'The Ocean Breeze Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    title: 'The Ocean Breeze Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    sqft: 1026,
    bedrooms: 2,
    bathrooms: 2,
    dimensions: "23' x 50'",
    price: 199900,
    style: 'Coastal Modular Cabin',
    tagline: '1,026 SQ FT • 2 Bed 2 Bath Coastal Amish Modular Home',
    features: [
      "Coastal Styling with Lofted Open-Concept Layout",
      "400 SQ FT Covered Porch for Outdoor Relaxation",
      "Complete Kitchen, Bathrooms, Plumbing & Wiring Installed",
      "Four-Season Rated Envelope for Coastal & Mountain Climates"
    ]
  },
  'the-coastal-charm-retreat-new-model': {
    name: 'The Coastal Charm Retreat (NEW MODEL)',
    title: 'The Coastal Charm Retreat (NEW MODEL)',
    sqft: 1160,
    bedrooms: 2,
    bathrooms: 2,
    dimensions: "27' 8\" x 42'",
    price: 219900,
    style: 'Coastal Modern Modular',
    tagline: '1,160 SQ FT • 2 Bed 2 Bath Coastal Retreat Turnkey Modular Home',
    features: [
      "Dutch Lap Vinyl Siding in Nautica Blue with Board-and-Batten Accents",
      "Engineered Wood Trusses and 2x6 Exterior Wall Construction",
      "Moire Black Shingle Roof & Vinyl Double-Pane Windows",
      "Turnkey Luxury Vinyl Plank Flooring & Painted Birch Interior"
    ]
  },
  'the-snow-white-cottage': {
    name: 'The Snow White Cottage (1 Bed 1 Bath or 2 Bed 1 Bath Option)',
    title: 'The Snow White Cottage (1 Bed 1 Bath or 2 Bed 1 Bath Option)',
    sqft: 448,
    bedrooms: 1,
    bathrooms: 1,
    dimensions: "14' x 32'",
    price: 69900,
    style: 'Amish-Built Modular Cottage',
    tagline: '448 SQ FT • 1 Bed 1 Bath (2 Bed Option) Move-In Ready Cottage',
    features: [
      "Mennonite & Amish Handcrafted Construction",
      "Turnkey Setup: Electric, Plumbing, and Bryant Mini-Split HVAC",
      "Full Appliance Package: Washer, Dryer, Dishwasher Included",
      "Luxury Vinyl Plank Flooring & Tankless Hot Water Heater"
    ]
  },
  'black-beauty-shipping-container-home': {
    name: 'Black Beauty (Shipping Container Home)',
    title: 'Black Beauty (Shipping Container Home)',
    sqft: 320,
    bedrooms: 1,
    bathrooms: 1,
    dimensions: "8' x 40'",
    price: 69900,
    style: 'Modular Shipping Container Home',
    tagline: '320 SQ FT • 1 Bed 1 Bath Modern Container Residence',
    features: [
      "Engineered Steel Container Framing with Modern Finishes",
      "Fully Finished Turnkey Interior with Pine or Shiplap",
      "High-Efficiency Mini-Split Climate Control",
      "Complete Kitchenette and Full Luxury Bathroom"
    ]
  },
  'the-backyard-bungalow-studio': {
    name: 'The Backyard Bungalow Studio',
    title: 'The Backyard Bungalow Studio',
    sqft: 154,
    bedrooms: 1,
    bathrooms: 1,
    dimensions: "11' 10\" x 17' 4\"",
    price: 54000,
    style: 'Modern Studio Modular ADU',
    tagline: '154 SQ FT • Turnkey Studio Backyard Modular Bungalow',
    features: [
      "Compact Architectural Footprint for Backyard ADU or Home Office",
      "Fully Wired with Lighting and Electrical Outlets",
      "Insulated Envelope for Year-Round Comfort",
      "Ships Factory-Finished Nationwide Ready to Place"
    ]
  },
  'the-all-american-5-bedroom-3-bath': {
    name: 'The All American (5 Bedroom 3 Bath Modular Home)',
    title: 'The All American (5 Bedroom 3 Bath Modular Home)',
    sqft: 2200,
    bedrooms: 5,
    bathrooms: 3,
    dimensions: "38' x 50'",
    price: 359900,
    style: 'Two-Story Family Modular Estate',
    tagline: '2,200 SQ FT • 5 Bed 3 Bath Two-Story Flagship Modular Home',
    features: [
      "Flagship 5 Bedroom / 3 Bathroom Two-Story Architecture",
      "Indoor Balcony Overlooking Soaring Great Room",
      "Massive 8' x 48' Covered Front Porch",
      "Three Dormers for Exceptional Natural Light"
    ]
  },
  'double-decker-shipping-container-home-2-bed-1-bath': {
    name: 'Double Decker Shipping Container Home (2 Bed 1 Bath)',
    title: 'Double Decker Shipping Container Home (2 Bed 1 Bath)',
    sqft: 480,
    bedrooms: 2,
    bathrooms: 1,
    dimensions: "8' x 40' + 8' x 20' Deck",
    price: 125000,
    style: 'Two-Story Modular Container Home',
    tagline: '480 SQ FT • 2 Bed 1 Bath Two-Story Container Home with Rooftop Deck',
    features: [
      "Two-Story Stacked Container Architecture (8'x40' lower, 8'x20' upper)",
      "Spacious 8' x 20' Open-Air Rooftop Deck",
      "Turnkey Electric, Plumbing, Mini-Split HVAC & Tankless Water Heater",
      "Fully Insulated for All-Season Living & Airbnb Rental Yield"
    ]
  },
  'the-clifford-modular-cabin': {
    name: 'The Clifford Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    title: 'The Clifford Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    sqft: 1026,
    bedrooms: 2,
    bathrooms: 2,
    dimensions: "23' x 50'",
    price: 199900,
    style: 'American Farmhouse Modular',
    tagline: '1,026 SQ FT • 2 Bed 2 Bath Farmhouse Red Amish Modular Cabin',
    features: [
      "Barn-Red Board-and-Batten Siding with Crisp White Metal Roof",
      "Soaring Great Room with Lofted Second-Floor Suite",
      "400 SQ FT Covered Front Porch with Classic Railings",
      "Fully Turnkey Kitchen, Baths, Mini-Split HVAC & Residential Wiring"
    ]
  },
  'the-evergreen-modular-cabin-2-bed-2-bath-or-3-bed-2-bath-options': {
    name: 'The Evergreen Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    title: 'The Evergreen Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    sqft: 1026,
    bedrooms: 2,
    bathrooms: 2,
    dimensions: "23' x 50'",
    price: 199900,
    style: 'Classic Evergreen Modular Cabin',
    tagline: '1,026 SQ FT • 2 Bed 2 Bath Evergreen Amish Modular Cabin',
    features: [
      "Rich Evergreen-Green Board-and-Batten Siding with White Accents",
      "Lofted Second-Floor Master Area and Open Great Room",
      "400 SQ FT Full-Length Covered Front Porch",
      "Turnkey Amish Woodwork, Cabinets, Plumbing and Electrical"
    ]
  },
  'the-sunshine-modular-cabin': {
    name: 'The Sunshine Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    title: 'The Sunshine Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    sqft: 1026,
    bedrooms: 2,
    bathrooms: 2,
    dimensions: "23' x 50'",
    price: 199900,
    style: 'Sunshine Yellow Modular Cabin',
    tagline: '1,026 SQ FT • 2 Bed 2 Bath Cheerful Amish Modular Cabin',
    features: [
      "Sunshine-Yellow Board-and-Batten Siding with Crisp White Metal Roof",
      "Dramatic High-Ceiling Great Room with Lofted Living Space",
      "400 SQ FT Covered Front Porch Built for Entertaining",
      "Ductless Mini-Split HVAC, Full Bathrooms and Rough-In Utilities"
    ]
  },
  'the-bumble-bee-modular-cabin-2-bed-2-bath-or-3-bed-2-bath-options': {
    name: 'The Bumble Bee Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    title: 'The Bumble Bee Modular Cabin (2 Bed 2 Bath or 3 Bed 2 Bath Option)',
    sqft: 1026,
    bedrooms: 2,
    bathrooms: 2,
    dimensions: "23' x 50'",
    price: 199900,
    style: 'Yellow & Black Contemporary Modular',
    tagline: '1,026 SQ FT • 2 Bed 2 Bath Yellow & Black Amish Modular Cabin',
    features: [
      "Vibrant Yellow Board-and-Batten Siding with Sharp Black Metal Roof",
      "400 SQ FT Full-Length Covered Front Porch",
      "Dramatic Lofted Great Room with Amish Knotty Pine Finishes",
      "Full Four-Season Insulation, HVAC Mini-Split, and Pre-Plumbed Systems"
    ]
  }
};

const newCatalogItems = [];

for (const [slug, conf] of Object.entries(metaConfig)) {
  const live = liveProducts.find(lp => lp.handle === slug);
  if (!live) {
    console.error(`Live product not found for handle: ${slug}`);
    continue;
  }

  const gallery = (live.images && live.images.length > 0)
    ? live.images.map(img => img.src)
    : (slug.includes('double-decker')
      ? ['https://img.youtube.com/vi/OPD4iozwTAk/maxresdefault.jpg']
      : ['https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow7.jpg?v=1732341691']);
  
  const primaryImage = gallery[0];

  const variants = (live.variants && live.variants.length > 0)
    ? live.variants.map((v, idx) => ({
        id: String(v.id || `var_${live.id}_${idx}`),
        title: v.title || 'Standard Turnkey Package',
        price: parseFloat(v.price) || conf.price,
        sku: v.sku || '',
        available: true,
        option1: v.option1 || v.title || 'Standard'
      }))
    : [{
        id: `var_${live.id}_0`,
        title: 'Standard Turnkey Package',
        price: conf.price,
        sku: '',
        available: true,
        option1: 'Default Title'
      }];

  const specs = [
    { label: "Living Area", value: `${conf.sqft.toLocaleString()} SQ FT` },
    { label: "Bedrooms", value: `${conf.bedrooms} Bed` },
    { label: "Bathrooms", value: `${conf.bathrooms} Bath` },
    { label: "Dimensions", value: conf.dimensions },
    { label: "Construction Type", value: "Factory-Built Certified Modular & Amish Turnkey" },
    { label: "Frame Type", value: "Precision-Engineered Heavy Timber & Solid Wood Framing" },
    { label: "Roofing", value: "40-Year Limited Manufacturer Warranty Metal Roofing" },
    { label: "HVAC", value: "High-Efficiency Ductless Mini-Split Climate System" },
    { label: "Delivery", value: "Nationwide Turnkey & Modular Delivery Available" }
  ];

  const itemCollections = [
    "modular-homes",
    "prefab-homes",
    "amish-built-modular-cabins",
    "turnkey-homes"
  ];
  if (conf.bedrooms === 2) itemCollections.push("2-bedroom-turnkey-homes");
  if (conf.bedrooms === 3) itemCollections.push("3-bedroom-turnkey-homes");
  if (conf.bedrooms >= 4) itemCollections.push("3-bedroom-turnkey-homes");

  const catalogItem = {
    id: `gid://shopify/Product/${live.id}`,
    slug: slug,
    handle: slug,
    name: conf.name,
    title: conf.title,
    category: "Modular Homes",
    product_type: "Modular Homes",
    architectural_style: conf.style,
    architecturalStyle: conf.style,
    tagline: conf.tagline,
    description: live.body_html || `<p>${conf.tagline}</p>`,
    description_html: live.body_html || `<p>${conf.tagline}</p>`,
    sqft: conf.sqft,
    bedrooms: conf.bedrooms,
    bathrooms: conf.bathrooms,
    dimensions: conf.dimensions,
    startingPrice: conf.price,
    starting_price: conf.price,
    price: conf.price,
    primaryImage: primaryImage,
    primary_image_url: primaryImage,
    image: primaryImage,
    gallery: gallery,
    images: gallery,
    features: conf.features,
    specs: specs,
    collections: itemCollections,
    tags: [
      "Modular Homes",
      "Move-In-Ready",
      "Turnkey",
      "Amish Built",
      "Certified Modular",
      "Prefab Homes"
    ],
    product_variants: variants
  };

  newCatalogItems.push(catalogItem);
}

console.log(`Prepared ${newCatalogItems.length} new complete products.`);

// 3. Append to catalog
newCatalogItems.forEach(item => {
  catalog.push(item);
});

console.log(`Updated Catalog Count: ${catalog.length}`);
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log('Saved updated catalog to src/data/all_products_catalog.json');

// 4. Update collections handles
let collectionsUpdated = 0;
collections.forEach(col => {
  const h = col.handle;
  if (h === 'modular-homes' || h === 'prefab-homes' || h === 'amish-built-modular-cabins' || h === 'turnkey-homes' || h === '2-bedroom-turnkey-homes' || h === '3-bedroom-turnkey-homes') {
    if (!col.productHandles) col.productHandles = [];
    newCatalogItems.forEach(item => {
      if (item.collections.includes(h) && !col.productHandles.includes(item.slug)) {
        col.productHandles.push(item.slug);
      }
    });
    col.productCount = col.productHandles.length;
    collectionsUpdated++;
  }
});
console.log(`Updated ${collectionsUpdated} collections in all_collections.json`);
fs.writeFileSync(collectionsPath, JSON.stringify(collections, null, 2), 'utf8');

console.log('--- DONE: Missing Move-In-Ready Products successfully imported! ---');
