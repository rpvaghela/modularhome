import "dotenv/config";
import { Client } from "pg";

async function upgradeSchema() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not found");
    return;
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log("Connected to PostgreSQL for schema enhancements.");

  const queries = [
    // 1. Add spec columns to products table
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS sqft INTEGER;`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS bedrooms NUMERIC(4,1);`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS bathrooms NUMERIC(4,1);`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS stories NUMERIC(4,1);`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions TEXT;`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS starting_price NUMERIC(12,2);`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '[]'::jsonb;`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS architectural_style TEXT;`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS series TEXT;`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS tagline TEXT;`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS primary_image_url TEXT;`,
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;`,

    // 2. Add helper columns to collections table
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS image TEXT;`,
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS banner_image TEXT;`,
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS tagline TEXT;`,
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;`,
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;`,

    // 3. Create indexes for performance
    `CREATE INDEX IF NOT EXISTS idx_products_handle ON products(handle);`,
    `CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);`,
    `CREATE INDEX IF NOT EXISTS idx_products_sqft ON products(sqft);`,
    `CREATE INDEX IF NOT EXISTS idx_products_price ON products(starting_price);`,
    `CREATE INDEX IF NOT EXISTS idx_collections_handle ON collections(handle);`,
    `CREATE INDEX IF NOT EXISTS idx_pages_handle ON pages(handle);`,
    `CREATE INDEX IF NOT EXISTS idx_prod_col_prod ON product_collections(product_id);`,
    `CREATE INDEX IF NOT EXISTS idx_prod_col_col ON product_collections(collection_id);`,
    `CREATE INDEX IF NOT EXISTS idx_media_prod ON product_media(product_id);`,
    `CREATE INDEX IF NOT EXISTS idx_media_pos ON product_media(position);`,
  ];

  for (const q of queries) {
    try {
      await client.query(q);
      console.log(`✓ Executed: ${q.trim().split('\n')[0]}`);
    } catch (e: any) {
      console.warn(`Query notice: ${e.message}`);
    }
  }

  console.log("Schema enhancements completed successfully.");
  await client.end();
}

upgradeSchema().catch(console.error);
