import "dotenv/config";
import { Client } from "pg";

async function patchAcceptanceDetails() {
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
  console.log("Connected to PostgreSQL for polishing schema...");

  // 1. Add label, base_rate, multiplier columns to pricing_rules if missing & sync
  await client.query(`
    ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS label TEXT;
    ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS base_rate NUMERIC DEFAULT 0;
    ALTER TABLE pricing_rules ADD COLUMN IF NOT EXISTS multiplier NUMERIC DEFAULT 0;
    UPDATE pricing_rules SET label = COALESCE(label, name, code);
    UPDATE pricing_rules SET base_rate = COALESCE(base_rate, base_price, 0) WHERE base_rate = 0;
    UPDATE pricing_rules SET multiplier = COALESCE(multiplier, rate_per_sqft, 0) WHERE multiplier = 0;
  `);

  // 2. Ensure homepage sections exist in page_sections
  const { rows: pageRows } = await client.query("SELECT id FROM pages WHERE slug = 'about' OR handle = 'about' LIMIT 1");
  const pageId = pageRows[0]?.id || null;

  const { rows: secRows } = await client.query("SELECT count(*) FROM page_sections");
  if (parseInt(secRows[0].count) === 0) {
    console.log("Seeding homepage section blocks into page_sections...");
    await client.query(`
      INSERT INTO page_sections (page_id, type, title, subtitle, content, display_order, is_visible)
      VALUES
      ($1, 'HERO', 'Precision Engineered Modular Residences', 'Built with commercial grade galvanized steel framing', 'Explore the next generation of American housing.', 1, true),
      ($1, 'TRUST', 'Engineered To Outperform Standard Construction', 'Factory built with millimeter accuracy', '50-Year Structural Steel Frame Warranty and 150+ MPH wind rating.', 2, true),
      ($1, 'HOW_IT_WORKS', 'From Digital Blueprint to Move-In Day', 'Precision Off-Site Manufacturing Process', 'Step 1: Select or Upload CAD. Step 2: Factory Fabrication. Step 3: Rapid Site Delivery.', 3, true),
      ($1, 'FAQ', 'Frequently Asked Questions', 'Clear answers on permits, delivery and costs', 'Financing available with standard mortgages.', 4, true),
      ($1, 'CTA', 'Ready to Build Your Modular Home?', 'Speak with our architectural engineering advisors', 'Get an itemized instant quote in minutes.', 5, true)
    `, [pageId]);
    console.log("✓ Sample page sections seeded.");
  }

  await client.end();
  console.log("Polishing complete.");
}

patchAcceptanceDetails().catch(console.error);
