import "dotenv/config";
import { query } from "../../src/lib/db";

async function checkAndUpgradeSchema() {
  console.log("Checking and adding missing columns to PostgreSQL tables...");

  const pageCols = [
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS slug TEXT;",
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS subtitle TEXT;",
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PUBLISHED';",
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS featured_image TEXT;",
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS image_alt TEXT;",
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS canonical_url TEXT;",
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS og_title TEXT;",
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS og_description TEXT;",
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS og_image TEXT;",
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS robots TEXT DEFAULT 'index, follow';",
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT now();",
    "UPDATE pages SET slug = handle WHERE (slug IS NULL OR slug = '') AND handle IS NOT NULL;",
    "UPDATE pages SET status = 'PUBLISHED' WHERE status IS NULL OR status = '';",
    "UPDATE pages SET published_at = created_at WHERE published_at IS NULL;"
  ];

  for (const q of pageCols) {
    try {
      await query(q);
    } catch (e: any) {
      console.warn("Notice on page col:", e.message);
    }
  }

  const sectionCols = [
    `CREATE TABLE IF NOT EXISTS page_sections (
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
    );`,
    "ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS structured_content JSONB DEFAULT '{}'::jsonb;",
    "ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;",
    "ALTER TABLE page_sections ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;"
  ];

  for (const q of sectionCols) {
    try {
      await query(q);
    } catch (e: any) {
      console.warn("Notice on section col:", e.message);
    }
  }

  const settingsCols = [
    `CREATE TABLE IF NOT EXISTS global_settings (
      id TEXT PRIMARY KEY DEFAULT 'primary',
      company_name TEXT DEFAULT 'ModularHome.com',
      logo_url TEXT DEFAULT '/finallogo.avif',
      logo_alt TEXT DEFAULT 'ModularHome.com Logo',
      favicon_url TEXT DEFAULT '/favicon.ico',
      phone TEXT DEFAULT '+1 (812) 595-4033',
      email TEXT DEFAULT 'support@modularhome.com',
      address TEXT DEFAULT 'Factory Headquarters, IN & Nationwide Delivery',
      social_links JSONB DEFAULT '{"facebook": "https://facebook.com", "instagram": "https://instagram.com", "youtube": "https://youtube.com", "tiktok": "https://tiktok.com"}'::jsonb,
      announcement_enabled BOOLEAN DEFAULT true,
      announcement_text TEXT DEFAULT 'Direct Factory Modular & Prefab Home Builder • 2026 Models Released',
      announcement_link TEXT DEFAULT '/buildings',
      header_navigation JSONB DEFAULT '[]'::jsonb,
      header_visibility JSONB DEFAULT '{"showAnnouncement": true, "showCta": true, "showPhone": true, "showSearch": true}'::jsonb,
      footer_text TEXT,
      footer_navigation JSONB DEFAULT '[]'::jsonb,
      footer_columns JSONB DEFAULT '[]'::jsonb,
      copyright_text TEXT DEFAULT '© 2026 ModularHome.com. All rights reserved.',
      default_seo_title TEXT DEFAULT 'Modular Homes For A Better Tomorrow | ModularHome.com',
      default_seo_desc TEXT DEFAULT 'Leading precision steel modular homes, luxury barndominiums, cabins, and downloadable architectural plans.',
      cta_label TEXT DEFAULT 'Get Your Free Quote',
      cta_link TEXT DEFAULT '/quote',
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );`,
    "ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS logo_alt TEXT DEFAULT 'ModularHome.com Logo';",
    "ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS header_visibility JSONB DEFAULT '{\"showAnnouncement\": true, \"showCta\": true, \"showPhone\": true, \"showSearch\": true}'::jsonb;",
    "ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS footer_columns JSONB DEFAULT '[]'::jsonb;",
    "ALTER TABLE global_settings ADD COLUMN IF NOT EXISTS copyright_text TEXT DEFAULT '© 2026 ModularHome.com. All rights reserved.';"
  ];

  for (const q of settingsCols) {
    try {
      await query(q);
    } catch (e: any) {
      console.warn("Notice on settings col:", e.message);
    }
  }

  // Also seed initial seed pages into PostgreSQL if not present
  const seedPages = [
    {
      handle: "new-home",
      slug: "new-home",
      title: "New Home",
      subtitle: "Discover our newest modular and prefabricated custom homes",
      body_html: "<h2>Welcome to Our New Modular Home Designs</h2><p>Explore cutting-edge floor plans, energy-efficient steel framing, and precision manufacturing engineered for modern living.</p>",
      status: "PUBLISHED",
      seo_title: "New Home | ModularHome.com",
      seo_description: "Explore our newest modular home designs, modern floor plans, and rapid prefab delivery.",
      featured_image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
    },
    {
      handle: "warranty-certifications",
      slug: "warranty-certifications",
      title: "Warranty & Engineering Certifications",
      subtitle: "Comprehensive 50-Year Structural Steel & 10-Year Weatherproofing Guarantee",
      body_html: "<h2>50-Year Structural Warranty</h2><p>Every ModularHome structure is built with precision cold-formed galvanized steel trusses and framing members engineered to withstand hurricane winds and extreme snow loads.</p>",
      status: "PUBLISHED",
      seo_title: "Warranty & Engineering Certifications | ModularHome.com",
      seo_description: "Learn about ModularHome.com's 50-year structural warranty, IBC engineering certifications, and quality standards.",
      featured_image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1600&q=80"
    },
    {
      handle: "privacy-policy",
      slug: "privacy-policy",
      title: "Privacy Policy",
      subtitle: "How ModularHome.com collects, uses, and protects your information",
      body_html: "<h2>Your Privacy Matters</h2><p>At ModularHome.com, we respect your privacy and are committed to protecting your personal data.</p>",
      status: "PUBLISHED",
      seo_title: "Privacy Policy | ModularHome.com",
      seo_description: "Read the ModularHome.com privacy policy to understand how we protect your personal information."
    },
    {
      handle: "terms-of-service",
      slug: "terms-of-service",
      title: "Terms of Service",
      subtitle: "Terms and conditions governing the use of ModularHome.com services",
      body_html: "<h2>Terms of Use</h2><p>By accessing or using ModularHome.com, you agree to comply with and be bound by these terms of service.</p>",
      status: "PUBLISHED",
      seo_title: "Terms of Service | ModularHome.com",
      seo_description: "Terms of service and customer agreements for ModularHome.com."
    }
  ];

  for (const sp of seedPages) {
    try {
      await query(
        `INSERT INTO pages (handle, slug, title, subtitle, body_html, status, seo_title, seo_description, featured_image, published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
         ON CONFLICT (handle) DO UPDATE SET
           slug = EXCLUDED.slug,
           title = EXCLUDED.title,
           subtitle = COALESCE(pages.subtitle, EXCLUDED.subtitle),
           body_html = COALESCE(pages.body_html, EXCLUDED.body_html),
           seo_title = COALESCE(pages.seo_title, EXCLUDED.seo_title),
           seo_description = COALESCE(pages.seo_description, EXCLUDED.seo_description);`,
        [sp.handle, sp.slug, sp.title, sp.subtitle, sp.body_html, sp.status, sp.seo_title, sp.seo_description, sp.featured_image || null]
      );
    } catch (e: any) {
      console.warn("Seed page notice:", e.message);
    }
  }

  console.log("Schema upgrade & seed verification completed successfully!");
  process.exit(0);
}

checkAndUpgradeSchema().catch((err) => {
  console.error("Schema upgrade failed:", err);
  process.exit(1);
});
