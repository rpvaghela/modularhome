import "dotenv/config";
import { Client } from "pg";

async function runMigration() {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL or SUPABASE_DB_URL is required");
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to PostgreSQL for Acceptance Schema Upgrade...");

  const queries = [
    // 1. Page Sections Table
    `
    CREATE TABLE IF NOT EXISTS page_sections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT,
      subtitle TEXT,
      content TEXT,
      structured_content JSONB DEFAULT '{}'::jsonb,
      display_order INTEGER DEFAULT 0,
      is_visible BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_page_sections_page ON page_sections(page_id);
    CREATE INDEX IF NOT EXISTS idx_page_sections_order ON page_sections(display_order);
    `,

    // 2. Add missing columns to pages table
    `
    ALTER TABLE pages ADD COLUMN IF NOT EXISTS slug TEXT;
    ALTER TABLE pages ADD COLUMN IF NOT EXISTS subtitle TEXT;
    ALTER TABLE pages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PUBLISHED';
    ALTER TABLE pages ADD COLUMN IF NOT EXISTS featured_image TEXT;
    ALTER TABLE pages ADD COLUMN IF NOT EXISTS canonical_url TEXT;
    UPDATE pages SET slug = handle WHERE slug IS NULL;
    UPDATE pages SET status = CASE WHEN published = false THEN 'DRAFT' ELSE 'PUBLISHED' END WHERE status IS NULL;
    CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
    CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
    `,

    // 3. Pricing Rules Table
    `
    CREATE TABLE IF NOT EXISTS pricing_rules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      category TEXT NOT NULL, -- 'MODEL_RATE', 'SQFT_BRACKET', 'UPGRADE', 'FEE', 'EXCLUSION'
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      pricing_type TEXT NOT NULL DEFAULT 'FLAT', -- 'FLAT', 'PER_SQFT', 'PERCENTAGE'
      base_price NUMERIC NOT NULL DEFAULT 0,
      rate_per_sqft NUMERIC DEFAULT 0,
      min_sqft NUMERIC DEFAULT 0,
      max_sqft NUMERIC DEFAULT 10000,
      is_active BOOLEAN DEFAULT true,
      display_order INTEGER DEFAULT 0,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_pricing_rules_cat ON pricing_rules(category);
    CREATE INDEX IF NOT EXISTS idx_pricing_rules_active ON pricing_rules(is_active);
    `,

    // 4. Quotations Table additions
    `
    CREATE TABLE IF NOT EXISTS quotations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      customer_zip TEXT,
      model_slug TEXT,
      model_name TEXT,
      sqft NUMERIC,
      dimensions TEXT,
      options JSONB DEFAULT '[]'::jsonb,
      pricing_inputs JSONB DEFAULT '{}'::jsonb,
      line_items JSONB DEFAULT '[]'::jsonb,
      fees JSONB DEFAULT '[]'::jsonb,
      exclusions JSONB DEFAULT '[]'::jsonb,
      ai_interpretation JSONB DEFAULT '{}'::jsonb,
      pricing_rule_version TEXT DEFAULT 'v1.0',
      estimated_amount NUMERIC,
      timeline TEXT,
      requirements TEXT,
      source TEXT DEFAULT 'QUOTE_WIZARD',
      status TEXT DEFAULT 'PENDING',
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    ALTER TABLE quotations ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE quotations ADD COLUMN IF NOT EXISTS fees JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE quotations ADD COLUMN IF NOT EXISTS exclusions JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE quotations ADD COLUMN IF NOT EXISTS ai_interpretation JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE quotations ADD COLUMN IF NOT EXISTS pricing_rule_version TEXT DEFAULT 'v1.0';
    CREATE INDEX IF NOT EXISTS idx_quotations_email ON quotations(customer_email);
    CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
    CREATE INDEX IF NOT EXISTS idx_quotations_created ON quotations(created_at DESC);
    `,

    // 5. Leads Table additions
    `
    CREATE TABLE IF NOT EXISTS leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      zip TEXT,
      location TEXT,
      project_type TEXT,
      preferred_model TEXT,
      approximate_size NUMERIC,
      budget TEXT,
      timeline TEXT,
      requirements TEXT,
      enquiry_details TEXT,
      source TEXT DEFAULT 'WEBSITE_CHAT',
      conversation_summary TEXT,
      conversation_context JSONB DEFAULT '[]'::jsonb,
      status TEXT DEFAULT 'NEW',
      assigned_to TEXT,
      internal_notes TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_type TEXT;
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_model TEXT;
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS approximate_size NUMERIC;
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget TEXT;
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS timeline TEXT;
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS requirements TEXT;
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS conversation_summary TEXT;
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS conversation_context JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS internal_notes TEXT;
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
    `,

    // 6. Blog Posts Table additions for YouTube -> AI Blog workflow
    `
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS youtube_video_id TEXT;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS video_embed_url TEXT;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'DRAFT';
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS generation_status TEXT DEFAULT 'GENERATED';
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS error_message TEXT;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
    CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_youtube_id ON blog_posts(youtube_video_id) WHERE youtube_video_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
    `,

    // 7. Global Settings Table additions
    `
    ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '/newmodularlogo.png';
    ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT '/favicon.ico';
    ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Factory Headquarters, IN & Nationwide Delivery';
    ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS cta_label TEXT DEFAULT 'Get Your Free Quote';
    ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS cta_link TEXT DEFAULT '/quote';
    ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS announcement_link TEXT DEFAULT '/buildings';
    ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS header_visibility JSONB DEFAULT '{"showAnnouncement": true, "showCta": true, "showPhone": true, "showSearch": true}'::jsonb;
    ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS footer_columns JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS copyright_text TEXT DEFAULT '© 2026 ModularHome.com. All rights reserved. Precision Commercial Steel Prefabricated Living.';
    `
  ];

  for (const q of queries) {
    try {
      await client.query(q);
    } catch (err: any) {
      console.warn("Schema query notice:", err.message);
    }
  }

  // Seed default pricing rules if empty
  const { rows: ruleRows } = await client.query("SELECT count(*) FROM pricing_rules;");
  if (parseInt(ruleRows[0].count) === 0) {
    console.log("Seeding initial deterministic pricing rules...");
    await client.query(`
      INSERT INTO pricing_rules (category, code, name, description, pricing_type, base_price, rate_per_sqft, is_active, display_order)
      VALUES
      ('MODEL_RATE', 'RATE_CABIN_BASE', 'Cabin Precision Base Rate', 'Standard factory cabin modular shell rate per sq ft', 'PER_SQFT', 0, 115, true, 1),
      ('MODEL_RATE', 'RATE_BARNDO_BASE', 'Barndominium Clearspan Rate', 'Heavy-duty steel clearspan barndominium shell rate per sq ft', 'PER_SQFT', 0, 135, true, 2),
      ('MODEL_RATE', 'RATE_MODULAR_BASE', 'Luxury Modular Residence Rate', 'Turnkey multi-module residential precision steel rate per sq ft', 'PER_SQFT', 0, 160, true, 3),
      ('MODEL_RATE', 'RATE_ADU_BASE', 'Compact ADU & Studio Base Rate', 'Compact secondary dwelling unit rate per sq ft', 'PER_SQFT', 0, 145, true, 4),
      ('UPGRADE', 'UPG_PORCH', 'Wraparound Covered Timber Porch', 'Solid 8x8 posts with black structural brackets and composite decking', 'FLAT', 14500, 0, true, 1),
      ('UPGRADE', 'UPG_INSUL', 'Extreme Climate R-38 Spray Foam Envelope', 'Superior closed-cell thermal break insulation envelope', 'FLAT', 9200, 0, true, 2),
      ('UPGRADE', 'UPG_GARAGE', 'Attached 2-Car Insulated Garage Bay', 'Includes high-lift 10ft insulated steel doors and concrete threshold layout', 'FLAT', 21000, 0, true, 3),
      ('UPGRADE', 'UPG_GLASS', '16ft Panoramic Multi-Slide Glass Wall', 'Black aluminum double-pane argon low-E architectural glass slider', 'FLAT', 12800, 0, true, 4),
      ('UPGRADE', 'UPG_LOFT', 'Second-Story Structural Loft / Mezzanine', 'Adds 500+ sq ft floor joists, heavy subflooring, and iron railing', 'FLAT', 16400, 0, true, 5),
      ('UPGRADE', 'UPG_STANDING_SEAM', 'Concealed Fastener Standing Seam Roof', '26-gauge ultra-durability concealed roof fastener package', 'FLAT', 7800, 0, true, 6),
      ('UPGRADE', 'UPG_KITCHEN_LUX', 'Gourmet Chef Kitchen Cabinetry & Island', 'Soft-close quartz countertops, custom island, and commercial fixtures', 'FLAT', 18500, 0, true, 7),
      ('UPGRADE', 'UPG_BATH_SPA', 'Primary Spa Bathroom & Walk-in Shower', 'Frameless glass enclosure, double floating vanity, and floor-to-ceiling tile', 'FLAT', 11200, 0, true, 8),
      ('FEE', 'FEE_ENGINEERING', 'State Stamped Engineering Package', 'Wet-stamped architectural, structural, electrical and plumbing plans for local permits', 'FLAT', 3500, 0, true, 1),
      ('FEE', 'FEE_DELIVERY_BASE', 'Regional Freight & Logistics', 'Standard flatbed delivery and crane rigging coordinator within 500 miles', 'FLAT', 4800, 0, true, 2),
      ('FEE', 'FEE_PERMIT_EXPEDITE', 'Municipal Permitting Assistance', 'Dedicated project manager permit submittal facilitation', 'FLAT', 1500, 0, true, 3),
      ('EXCLUSION', 'EXC_FOUNDATION', 'On-Site Foundation & Concrete Slab', 'Slab or crawlspace poured by local contractor per stamped plans', 'FLAT', 0, 0, true, 1),
      ('EXCLUSION', 'EXC_UTILITY_HOOKUP', 'Municipal Utility Tap & Trenching', 'Local septic, sewer, water, and power connection by licensed trade contractors', 'FLAT', 0, 0, true, 2)
      ON CONFLICT (code) DO NOTHING;
    `);
    console.log("✓ Initial pricing rules seeded.");
  }

  // Seed sample blogs in blog_posts if empty
  const { rows: blogRows } = await client.query("SELECT count(*) FROM blog_posts;");
  if (parseInt(blogRows[0].count) === 0) {
    console.log("Seeding sample educational blogs into blog_posts...");
    await client.query(`
      INSERT INTO blog_posts (
        blog_handle, handle, title, body_html, excerpt, author, tags,
        seo_title, seo_description, status, thumbnail_url, video_embed_url, youtube_video_id, published_at
      ) VALUES
      (
        'news', 'the-nordic-cabin-factory-tour',
        'Inside The Nordic Cabin: Precision Steel Framing & Scandinavian Luxury Walkthrough',
        '<h2>The Nordic Cabin: Architectural Engineering Overview</h2><p>Step inside our precision manufacturing facility as we tour the all-new Nordic Cabin. Built with commercial-grade cold-formed steel and wrapped in high-R value closed cell insulation, this cabin is designed for extreme mountain environments.</p><h3>Key Features</h3><ul><li>Zero-warping galvanized steel frame</li><li>16ft multi-slide panoramic glass wall</li><li>Turnkey rapid delivery in 6-8 weeks</li></ul>',
        'Take a video tour of the Nordic Cabin modular design featuring Scandinavian aesthetics and high-performance steel framing.',
        'ModularHome Engineering Team',
        'Cabins, Tour, Steel Framing',
        'The Nordic Cabin Video Tour & Architectural Guide | ModularHome.com',
        'Tour the Scandinavian-inspired Nordic Cabin with cold-formed steel framing and panoramic views.',
        'PUBLISHED',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        'TOUR_NORDIC_01',
        NOW()
      ),
      (
        'news', 'modern-barndominium-steel-clearspan',
        'Modern Barndominium Construction: Clearspan Trusses & Dual-Story Living Spaces',
        '<h2>Why Clearspan Steel Barndominiums Are Dominating Modern Rural Living</h2><p>Barndominiums combine the vast, open-span volumetric advantages of industrial steel framing with luxurious residential comfort. In this technical deep dive, we explore foundation loads, truss engineering, and high-efficiency HVAC layouts.</p>',
        'Discover how clearspan steel trusses create expansive open-concept great rooms in modern residential barndominiums.',
        'Architectural Insights',
        'Barndominiums, Construction, Framing',
        'Modern Barndominium Construction Guide | ModularHome.com',
        'Explore clearspan barndominium engineering, great room layouts, and turnkey modular construction.',
        'PUBLISHED',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        'TOUR_BARNDO_02',
        NOW()
      ),
      (
        'news', 'backyard-adu-permitting-cost-guide',
        'The Complete 2026 ADU & Granny Pod Permitting, Cost & Build Guide',
        '<h2>Accessory Dwelling Units (ADUs): Fast Permitting & Passive Rental Income</h2><p>Adding an ADU to your residential lot has never been easier. Learn how factory-built modular ADUs bypass months of on-site noise and contractor delays while maximizing your property value.</p>',
        'A comprehensive guide to state ADU laws, permitting timelines, modular manufacturing, and rental ROI.',
        'Housing Regulatory Policy Group',
        'ADU, Financing, Permitting',
        '2026 ADU & Granny Pod Permitting and Cost Guide | ModularHome.com',
        'Understand ADU zoning, factory costs, foundation requirements, and rental return on investment.',
        'PUBLISHED',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
        'TOUR_ADU_03',
        NOW()
      )
      ON CONFLICT (blog_handle, handle) DO NOTHING;
    `);
    console.log("✓ Sample educational blogs seeded.");
  }

  // Seed sample leads if empty
  const { rows: leadRows } = await client.query("SELECT count(*) FROM leads;");
  if (parseInt(leadRows[0].count) === 0) {
    console.log("Seeding sample qualified leads...");
    await client.query(`
      INSERT INTO leads (
        name, email, phone, location, project_type, preferred_model, approximate_size, budget, timeline, requirements, source, status, conversation_summary
      ) VALUES
      (
        'Michael Henderson', 'm.henderson@example.com', '+1 (303) 555-0192', 'Boulder, CO',
        'Mountain Cabin', 'The Nordic Cabin', 1200, '$150k - $200k', '3-6 months',
        'Looking to build a 2-bed modern steel cabin on a sloped 2-acre lot. Requires high snow load rating (60 PSF).',
        'WEBSITE_CHAT', 'NEW',
        'Customer inquired about high-altitude cold climate insulation and delivery timeline to Colorado.'
      ),
      (
        'Elena Rostova', 'elena.r@example.com', '+1 (512) 555-7834', 'Austin, TX',
        'Barndominium', 'The Modern Barndominium', 2400, '$200k - $300k', 'Immediate',
        'Wants a 4-bedroom barndominium with a 2-car garage workshop bay and wraparound porch.',
        'QUOTE_WIZARD', 'QUALIFIED',
        'Completed interactive quote wizard for 2400 sq ft barndominium with custom loft upgrade.'
      )
      ON CONFLICT DO NOTHING;
    `);
    console.log("✓ Initial qualified leads seeded.");
  }

  // Ensure primary global_settings row is fully seeded
  await client.query(`
    INSERT INTO global_settings (
      id, company_name, phone, email, announcement_text, announcement_enabled,
      default_seo_title, default_seo_desc, logo_url, favicon_url, address, cta_label, cta_link,
      header_navigation, footer_navigation, footer_columns, social_links
    )
    VALUES (
      'primary',
      'ModularHome.com',
      '+1 (812) 595-4033',
      'support@modularhome.com',
      'Direct Factory Modular & Prefab Home Builder • 2026 Models Released',
      true,
      'Modular Homes For A Better Tomorrow | ModularHome.com',
      'Leading precision steel modular homes, luxury barndominiums, cabins, and downloadable architectural plans.',
      '/newmodularlogo.png',
      '/favicon.ico',
      'Factory Headquarters, IN & Nationwide Delivery',
      'Get Your Free Quote',
      '/quote',
      '[
        {"label": "Modular Homes", "href": "/buildings?category=Modular+Homes", "isExternal": false, "isVisible": true, "order": 1},
        {"label": "Floor Plans", "href": "/floor-plans", "isExternal": false, "isVisible": true, "order": 2, "badge": "NEW"},
        {"label": "Barndominiums", "href": "/buildings?category=Barndominiums", "isExternal": false, "isVisible": true, "order": 3},
        {"label": "Cabins", "href": "/buildings?category=Cabins", "isExternal": false, "isVisible": true, "order": 4},
        {"label": "Videos", "href": "/videos", "isExternal": false, "isVisible": true, "order": 5},
        {"label": "About", "href": "/about", "isExternal": false, "isVisible": true, "order": 6},
        {"label": "Contact", "href": "/contact", "isExternal": false, "isVisible": true, "order": 7}
      ]'::jsonb,
      '[
        {"label": "Modular Homes", "href": "/buildings?category=Modular+Homes"},
        {"label": "Barndominiums", "href": "/buildings?category=Barndominiums"},
        {"label": "Floor Plan Kits", "href": "/floor-plans"},
        {"label": "Factory Videos", "href": "/videos"},
        {"label": "Knowledge Center", "href": "/resources"},
        {"label": "Interactive Quote", "href": "/quote"},
        {"label": "Warranty & IBC Standards", "href": "/about"}
      ]'::jsonb,
      '[
        {
          "title": "Architectural Series",
          "links": [
            {"label": "Modular Homes", "href": "/buildings?category=Modular+Homes"},
            {"label": "Modern Barndominiums", "href": "/buildings?category=Barndominiums"},
            {"label": "Alpine & Modern Cabins", "href": "/buildings?category=Cabins"},
            {"label": "ADUs & Studio Suites", "href": "/buildings?category=ADUs+%26+Granny+Pods"}
          ]
        },
        {
          "title": "Resources & Engineering",
          "links": [
            {"label": "Downloadable Floor Plans", "href": "/floor-plans"},
            {"label": "Factory Video Walkthroughs", "href": "/videos"},
            {"label": "Construction Articles", "href": "/resources"},
            {"label": "Upload Custom CAD Plans", "href": "/upload-floor-plan"}
          ]
        },
        {
          "title": "Company & Support",
          "links": [
            {"label": "About ModularHome", "href": "/about"},
            {"label": "Contact An Advisor", "href": "/contact"},
            {"label": "Instant Cost Estimator", "href": "/quote"},
            {"label": "Privacy Policy", "href": "/privacy-policy"}
          ]
        }
      ]'::jsonb,
      '{"facebook": "https://facebook.com", "instagram": "https://instagram.com", "youtube": "https://youtube.com", "tiktok": "https://tiktok.com"}'::jsonb
    )
    ON CONFLICT (id) DO UPDATE SET
      header_navigation = EXCLUDED.header_navigation,
      footer_navigation = EXCLUDED.footer_navigation,
      footer_columns = EXCLUDED.footer_columns,
      logo_url = EXCLUDED.logo_url,
      company_name = EXCLUDED.company_name,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email;
  `);
  console.log("✓ Global settings verified and updated.");

  await client.end();
  console.log("=== ACCEPTANCE SCHEMA UPGRADE COMPLETE ===");
}

runMigration().catch(console.error);
