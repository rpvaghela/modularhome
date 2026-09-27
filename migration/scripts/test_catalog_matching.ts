import "dotenv/config";
import { Client } from "pg";
import { matchProductCategory } from "../../src/utils/categoryMatching";
import { formatProduct } from "../../src/lib/publicData";

async function testMatching() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const prodsRes = await client.query(`
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          json_build_object(
            'collection_id', pc.collection_id,
            'collections', json_build_object('id', c.id, 'handle', c.handle, 'title', c.title)
          )
        ) FILTER (WHERE pc.collection_id IS NOT NULL),
        '[]'::json
      ) as product_collections
    FROM products p
    LEFT JOIN product_collections pc ON pc.product_id = p.id
    LEFT JOIN collections c ON c.id = pc.collection_id
    WHERE p.status = 'active' OR p.status IS NULL
    GROUP BY p.id
    ORDER BY p.created_at DESC;
  `);

  console.log(`Loaded ${prodsRes.rows.length} products from DB with product_collections.`);

  const formattedModels = prodsRes.rows.map(formatProduct);

  const testCategories = [
    "All",
    "Modular Homes",
    "Prefab Homes",
    "House Kits",
    "Tiny Homes",
    "Cabins For Sale",
    "Barndominium Kits",
    "Steel Barndominium Kits",
    "Commercial Modular Buildings",
    "Granny Pods",
    "A-Frame Cabins",
    "House Plans",
  ];

  console.log("\n=== MODEL COUNTS PER CATEGORY ===");
  const results: any[] = [];
  for (const cat of testCategories) {
    const matched = formattedModels.filter((m) => matchProductCategory(m, cat));
    results.push({
      Category: cat,
      "Matching Products": matched.length,
    });
  }
  console.table(results);

  await client.end();
}

testMatching().catch(console.error);
