const { Client } = require('pg');

const poolerUrl = 'postgresql://postgres.sxrteizeakvrrkmllwgo:tjgUGYSLrs9Zxuv6@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify';

const shelterProducts = [
  {
    handle: 'standard-underground-bomb-shelter',
    title: 'Standard Underground Bomb Shelter',
    product_type: 'Bomb Shelters',
    vendor: 'BombShelters.com',
    status: 'active',
    starting_price: 49900,
    sqft: 320,
    bedrooms: 1,
    bathrooms: 1,
    stories: 1,
    dimensions: "10' x 32' Sub-Surface Cylinder",
    primary_image_url: '/images/hillside-bunker.png',
    description_html: '<p><strong>The Standard Underground Bomb Shelter</strong> is America\'s premier residential blast shelter. Fabricated from corrugated structural carbon steel with welded airlocks, this hardened bunker is engineered for backyard sub-surface burial. Features Swiss Lunor NBC air filtration, airtight blast doors, emergency subterranean escape hatch, and turnkey electrical integration.</p>',
    features: JSON.stringify(['Swiss Lunor NBC Air Filtration', '10-PSI Dual Blast Hatch Door', 'Subterranean Emergency Escape Tunnel', 'Off-Grid Solar & Battery Integration', 'Monolithic Concrete Anchoring Collar', 'FEMA P-361 Certified Shell']),
    specs: JSON.stringify({ 'Capacity': '4-8 Persons', 'Blast Rating': '10-25 PSI', 'Burial Depth': 'Up to 10 Feet', 'Frame': 'A36 Corrugated Structural Steel', 'Warranty': '50-Year Structural Guarantee' }),
    seo_title: 'Standard Underground Bomb Shelter | BombShelters.com',
    seo_description: 'Military-grade underground bomb shelter built for residential backyards. 10-25 PSI blast rated with Swiss NBC air filtration.'
  },
  {
    handle: 'luxury-underground-bunker',
    title: 'Luxury Underground Bunker',
    product_type: 'Bomb Shelters',
    vendor: 'BombShelters.com',
    status: 'active',
    starting_price: 199900,
    sqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    stories: 1,
    dimensions: "20' x 60' Hardened Complex",
    primary_image_url: '/images/cat-luxury-bunkers.png',
    description_html: '<p><strong>The Luxury Underground Bunker</strong> represents the gold standard in subterranean survival architecture. Designed for extended off-grid living, this fortified complex features a master suite, guest quarters, full chef\'s kitchen, decontamination airlock, geothermal HVAC, and military-grade EMP shielding.</p>',
    features: JSON.stringify(['Master Bedroom & Guest Suites', 'Dual NBC Positive Pressure Filtration', 'Airlock Decontamination Mist Station', 'EMP-Shielded Faraday Control Room', '1000-Gal Subterranean Potable Water Tank', 'Sub-surface Hydroponic Food Chamber']),
    specs: JSON.stringify({ 'Capacity': '6-12 Persons', 'Blast Rating': '25 PSI Overpressure', 'Burial Depth': 'Up to 15 Feet', 'Frame': '3/8-Inch Solid Carbon Steel Plate', 'Warranty': '50-Year Structural Guarantee' }),
    seo_title: 'Luxury Underground Bunker & Executive Survival Suite | BombShelters.com',
    seo_description: 'High-end subterranean bunker with multi-bedroom suites, decontamination airlock, and complete off-grid life support.'
  },
  {
    handle: 'residential-in-ground-storm-shelter',
    title: 'Residential In-Ground Storm Shelter',
    product_type: 'Bomb Shelters',
    vendor: 'BombShelters.com',
    status: 'active',
    starting_price: 12900,
    sqft: 96,
    bedrooms: 0,
    bathrooms: 0,
    stories: 1,
    dimensions: "6' x 8' Flush Sub-Floor Vault",
    primary_image_url: '/images/cat-storm-shelters.png',
    description_html: '<p><strong>The Residential In-Ground Storm Shelter</strong> provides rapid, zero-step life-saving protection against EF-5 tornadoes and extreme weather. Precision engineered to install flush into garage slabs or covered patios, featuring hydraulic-assist sliding lids, interior multi-point deadbolts, and impact-tested debris deflectors.</p>',
    features: JSON.stringify(['Flush Garage Floor Slab Mount', 'Hydraulic Dual Assist Sliding Lid', 'Tested to 250+ MPH EF5 Tornadoes', 'Passive High-Volume Air Exchange', 'Emergency Inside Winch Jack Mechanism', 'Powder-Coated Anti-Corrosion Finish']),
    specs: JSON.stringify({ 'Capacity': '4-6 Persons', 'Wind Rating': '250+ MPH (EF-5 Rated)', 'Standards': 'FEMA 320 & ICC 500 Certified', 'Frame': '1/4-inch Solid Steel Plate', 'Warranty': 'Lifetime Structural Warranty' }),
    seo_title: 'Residential In-Ground Storm Shelter | Garage Floor Tornado Vault',
    seo_description: 'EF5-rated in-garage storm shelter installing flush with your slab. Quick hydraulic sliding door and FEMA 320 compliant.'
  },
  {
    handle: 'the-defender-10x20-blast-bunker',
    title: 'The Defender 10x20 Blast Bunker',
    product_type: 'Bomb Shelters',
    vendor: 'BombShelters.com',
    status: 'active',
    starting_price: 58500,
    sqft: 200,
    bedrooms: 1,
    bathrooms: 1,
    stories: 1,
    dimensions: "10' x 20' Heavy Corrugated Cylinder",
    primary_image_url: '/images/cat-bomb-shelters.png',
    description_html: '<p><strong>The Defender 10x20 Blast Bunker</strong> is built for rapid turnkey deployment. Featuring an integrated living compartment, folding bunks, NBC filtration with manual hand-crank failover, airtight bulkhead doors, and hidden secondary egress crawlway.</p>',
    features: JSON.stringify(['A36 Cold-Rolled Structural Steel Shell', 'NBC Filter with Manual Hand Crank', 'Double-Gasket Cam-Lock Blast Door', 'Underground Waste Management Sump', 'Pre-Wired 12V DC & 120V AC Panels', 'Emergency Secondary Egress Crawlway']),
    specs: JSON.stringify({ 'Capacity': '4-6 Persons', 'Blast Rating': '15 PSI Overpressure', 'Burial Depth': '8-12 Feet', 'Frame': 'Corrugated Steel Hull', 'Warranty': '50-Year Structural Guarantee' }),
    seo_title: 'The Defender 10x20 Blast Bunker | Turnkey Survival Shelter',
    seo_description: 'Turnkey 10x20 underground blast shelter with Swiss NBC filtration, bunk quarters, and emergency escape crawlway.'
  },
  {
    handle: 'the-sentinel-armored-safe-room-vault',
    title: 'The Sentinel Armored Safe Room Vault',
    product_type: 'Bomb Shelters',
    vendor: 'BombShelters.com',
    status: 'active',
    starting_price: 34500,
    sqft: 120,
    bedrooms: 0,
    bathrooms: 0,
    stories: 1,
    dimensions: "10' x 12' Modular Ballistic Vault",
    primary_image_url: '/images/cat-safe-rooms.png',
    description_html: '<p><strong>The Sentinel Armored Safe Room Vault</strong> is a modular above-ground sanctuary designed to retrofit inside master suites, closets, or basements. Tested to UL 752 Level 4 ballistic resistance, featuring biometric multi-bolt locking, standalone ventilation, and reinforced concrete slab tie-downs.</p>',
    features: JSON.stringify(['UL 752 Level 4 Ballistic Armor Plates', 'Biometric Multi-Bolt High Security Lock', 'Internal HVAC Scrubbing & Ventilation', 'Cellular & Satellite Emergency Transmitter', 'Modular Bolt-Together Interior Retrofit', 'FEMA 361 Missile Impact Tested']),
    specs: JSON.stringify({ 'Capacity': '3-6 Persons', 'Ballistic Rating': 'UL 752 Level 4 (.30-06 AP)', 'Weight': '4,200 Lbs', 'Frame': 'High-Hardness Armor Steel', 'Warranty': '30-Year Structural Guarantee' }),
    seo_title: 'The Sentinel Armored Safe Room Vault | Ballistic In-Home Sanctuary',
    seo_description: 'Modular ballistic safe room retrofitting into existing homes. UL 752 Level 4 bullet resistant with biometric entry.'
  },
  {
    handle: 'guardian-below-ground-survival-capsule',
    title: 'Guardian Below-Ground Survival Capsule',
    product_type: 'Bomb Shelters',
    vendor: 'BombShelters.com',
    status: 'active',
    starting_price: 19500,
    sqft: 120,
    bedrooms: 0,
    bathrooms: 0,
    stories: 1,
    dimensions: "8' x 15' Subsurface Cylinder",
    primary_image_url: '/images/hillside-bunker.png',
    description_html: '<p><strong>The Guardian Below-Ground Survival Capsule</strong> is an economical, high-strength subterranean survival pod engineered for residential backyards and rural properties. Provides immediate shelter against nuclear fallout, extreme storm events, and civil unrest at an accessible entry price.</p>',
    features: JSON.stringify(['Corrugated Heavy-Gauge Steel Hull', 'Air Intake Blower with Hepa Filtration', '4-Tier Fold-Down Bunk System', 'Counter-Balanced Entrance Hatch', 'Underfloor Bulk Provisions Storage', 'Chemical Commode Compartment']),
    specs: JSON.stringify({ 'Capacity': '4-6 Occupants', 'Blast Rating': '8-10 PSI', 'Burial Depth': '6-10 Feet', 'Frame': 'A36 Cold-Formed Steel', 'Warranty': '30-Year Structural Guarantee' }),
    seo_title: 'Guardian Below-Ground Survival Capsule | Affordable Fallout Bunker',
    seo_description: 'Affordable below-ground survival pod under $20,000. Battle-tested corrugated steel cylinder with fold-down bunks.'
  },
  {
    handle: 'titan-commercial-and-municipal-civil-bunker',
    title: 'Titan Commercial & Municipal Civil Bunker',
    product_type: 'Bomb Shelters',
    vendor: 'BombShelters.com',
    status: 'active',
    starting_price: 450000,
    sqft: 3500,
    bedrooms: 4,
    bathrooms: 4,
    stories: 1,
    dimensions: "50' x 70' Multi-Chamber Complex",
    primary_image_url: '/images/cat-luxury-bunkers.png',
    description_html: '<p><strong>The Titan Commercial & Municipal Civil Bunker</strong> is an engineered multi-chamber subsurface complex designed for corporations, municipal operations, first responders, and large private estates. Certified to FEMA P-361 community shelter criteria with dual industrial NBC air handling systems, industrial diesel generators, and tactical comms command center.</p>',
    features: JSON.stringify(['Dual Industrial Swiss NBC Air Handling', 'Redundant Commercial Diesel Generation', 'Tactical Operations & Comms Command Center', 'ADA Compliant Heavy Blast Airlocks', 'Commercial Kitchen & Medical Triage Bay', 'Dual Independent Egress Escape Tunnels']),
    specs: JSON.stringify({ 'Capacity': '50-100 Occupants', 'Blast Rating': '30 PSI Blast Certified', 'Burial Depth': '15-20 Feet', 'Frame': 'Heavy Structural Steel Plate & Concrete', 'Warranty': '50-Year Structural Guarantee' }),
    seo_title: 'Titan Commercial & Municipal Civil Bunker | 50-100 Person Facility',
    seo_description: 'Industrial-scale civil defense bunker for corporate continuity, municipalities, and high-capacity community sheltering.'
  },
  {
    handle: 'the-fortress-executive-survival-vault',
    title: 'The Fortress Executive Survival Vault',
    product_type: 'Bomb Shelters',
    vendor: 'BombShelters.com',
    status: 'active',
    starting_price: 135000,
    sqft: 850,
    bedrooms: 2,
    bathrooms: 1,
    stories: 1,
    dimensions: "16' x 54' Fortified Complex",
    primary_image_url: '/images/cat-bomb-shelters.png',
    description_html: '<p><strong>The Fortress Executive Survival Vault</strong> provides uncompromising protection and long-term livability for family retreats. Features two private bedroom cabins, central living area, stainless steel galley kitchen, full bathroom with blackwater containment, and MIL-STD EMP protection.</p>',
    features: JSON.stringify(['Two Private Staterooms + Living Lounge', 'Full Kitchenette & Private Bathroom', 'Positive Pressure NBC Life Support Matrix', 'Military EMP Hardened Electrical System', 'Heavy Hydraulic Blast Cam-Lock Doors', 'Concealed 40-Foot Subterranean Escape Hatch']),
    specs: JSON.stringify({ 'Capacity': '6-10 Occupants', 'Blast Rating': '20 PSI Overpressure', 'Burial Depth': '10-14 Feet', 'Frame': 'Commercial Structural Steel Core', 'Warranty': '50-Year Structural Guarantee' }),
    seo_title: 'The Fortress Executive Survival Vault | Mid-Size Subterranean Retreat',
    seo_description: 'Hardened two-bedroom underground retreat with complete living quarters, NBC filtration, and EMP defense systems.'
  }
];

async function seed() {
  const client = new Client({ connectionString: poolerUrl });
  try {
    await client.connect();
    console.log('Connected to PostgreSQL pooler!');

    for (const prod of shelterProducts) {
      // Check existing by handle
      const existingRes = await client.query('SELECT id FROM products WHERE handle = $1', [prod.handle]);
      let productId = existingRes.rows[0]?.id;

      if (productId) {
        await client.query(
          `UPDATE products SET 
            title = $1, 
            product_type = $2, 
            vendor = $3, 
            status = $4, 
            starting_price = $5, 
            sqft = $6, 
            bedrooms = $7, 
            bathrooms = $8, 
            stories = $9, 
            dimensions = $10, 
            primary_image_url = $11, 
            description_html = $12, 
            features = $13, 
            specs = $14, 
            seo_title = $15, 
            seo_description = $16,
            updated_at = NOW()
          WHERE id = $17`,
          [
            prod.title, prod.product_type, prod.vendor, prod.status, prod.starting_price,
            prod.sqft, prod.bedrooms, prod.bathrooms, prod.stories, prod.dimensions,
            prod.primary_image_url, prod.description_html, prod.features, prod.specs,
            prod.seo_title, prod.seo_description, productId
          ]
        );
        console.log('Updated product:', prod.title);
      } else {
        const insertRes = await client.query(
          `INSERT INTO products (
            handle, title, product_type, vendor, status, starting_price,
            sqft, bedrooms, bathrooms, stories, dimensions,
            primary_image_url, description_html, features, specs,
            seo_title, seo_description, published_at, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11,
            $12, $13, $14, $15,
            $16, $17, NOW(), NOW(), NOW()
          ) RETURNING id`,
          [
            prod.handle, prod.title, prod.product_type, prod.vendor, prod.status, prod.starting_price,
            prod.sqft, prod.bedrooms, prod.bathrooms, prod.stories, prod.dimensions,
            prod.primary_image_url, prod.description_html, prod.features, prod.specs,
            prod.seo_title, prod.seo_description
          ]
        );
        productId = insertRes.rows[0].id;
        console.log('Inserted product:', prod.title, 'with id:', productId);
      }

      // Add default package variants
      await client.query('DELETE FROM product_variants WHERE product_id = $1', [productId]);
      const v1 = [productId, 'Standard Hardened Shell Package', prod.starting_price, prod.handle.substring(0, 8).toUpperCase() + '-STD', 1];
      const v2 = [productId, 'Fortified Package (Electrical & HVAC)', Math.round(prod.starting_price * 1.18), prod.handle.substring(0, 8).toUpperCase() + '-FORT', 2];
      const v3 = [productId, 'Turnkey Luxury Life Support (NBC + Solar)', Math.round(prod.starting_price * 1.35), prod.handle.substring(0, 8).toUpperCase() + '-TURN', 3];

      for (const v of [v1, v2, v3]) {
        await client.query(
          'INSERT INTO product_variants (product_id, title, price, sku, position) VALUES ($1, $2, $3, $4, $5)',
          v
        );
      }

      // Add product media gallery
      await client.query('DELETE FROM product_media WHERE product_id = $1', [productId]);
      const m1 = [productId, prod.primary_image_url, prod.title, 1];
      const m2 = [productId, '/images/hero-bg.png', prod.title + ' Subterranean Cutaway', 2];
      const m3 = [productId, '/images/hillside-bunker.png', prod.title + ' Structural Exterior', 3];

      for (const m of [m1, m2, m3]) {
        await client.query(
          'INSERT INTO product_media (product_id, source_url, alt_text, position) VALUES ($1, $2, $3, $4)',
          m
        );
      }
    }

    const countRes = await client.query("SELECT count(*) FROM products WHERE product_type = 'Bomb Shelters'");
    console.log('Total Bomb Shelters products now in database:', countRes.rows[0].count);

    const totalRes = await client.query('SELECT count(*) FROM products');
    console.log('Total all products in database:', totalRes.rows[0].count);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await client.end();
  }
}

seed();

