import "dotenv/config";
import { Client } from "pg";

async function checkMedia() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const res = await client.query("SELECT source_url, alt_text, position FROM product_media LIMIT 5;");
  console.log("Sample product_media rows:");
  console.log(res.rows);

  const stats = await client.query(`
    SELECT 
      count(*) as total_media,
      count(DISTINCT product_id) as products_with_media,
      count(CASE WHEN source_url LIKE '%supabase%' THEN 1 END) as supabase_hosted,
      count(CASE WHEN source_url LIKE '%cdn.shopify.com%' THEN 1 END) as shopify_cdn
    FROM product_media;
  `);
  console.log("Media stats:", stats.rows[0]);

  // Check products without media
  const noMedia = await client.query(`
    SELECT p.handle, p.title
    FROM products p
    LEFT JOIN product_media pm ON pm.product_id = p.id
    WHERE pm.id IS NULL;
  `);
  console.log(`Products without media: ${noMedia.rows.length}`);
  if (noMedia.rows.length > 0) {
    console.log("Sample products without media:", noMedia.rows.slice(0, 10));
  }

  await client.end();
}

checkMedia().catch(console.error);
