const { Client } = require('pg');
const poolerUrl = 'postgresql://postgres.sxrteizeakvrrkmllwgo:tjgUGYSLrs9Zxuv6@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=no-verify';

async function updatePrefab() {
  const client = new Client({ connectionString: poolerUrl });
  await client.connect();

  const cRes = await client.query("SELECT id FROM collections WHERE handle = 'prefab-homes'");
  if (!cRes.rows[0]) {
    console.error('prefab-homes collection not found');
    await client.end();
    return;
  }
  const collectionId = cRes.rows[0].id;

  // Update product_type to 'Prefab Homes' for all products in this collection
  const updateRes = await client.query(
    `UPDATE products 
     SET product_type = 'Prefab Homes', updated_at = NOW() 
     WHERE id IN (SELECT product_id FROM product_collections WHERE collection_id = $1)
     AND status = 'active'`,
    [collectionId]
  );
  console.log(`Updated ${updateRes.rowCount} products to product_type = 'Prefab Homes'!`);

  // Also ensure 'nova' has product_type = 'Prefab Homes'
  await client.query("UPDATE products SET product_type = 'Prefab Homes' WHERE handle = 'nova'");

  // Count total Prefab Homes
  const countRes = await client.query("SELECT count(*) FROM products WHERE product_type = 'Prefab Homes' AND status = 'active'");
  console.log(`Total active 'Prefab Homes' products now in database: ${countRes.rows[0].count}`);

  await client.end();
}

updatePrefab().catch(console.error);

