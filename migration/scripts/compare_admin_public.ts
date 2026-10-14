import { getPublicProducts, fetchSupabaseProducts } from '../../src/lib/publicData';
import { supabaseAdmin, isSupabaseConfigured } from '../../src/lib/supabase';
import { query } from '../../src/lib/db';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
  const publicProds = await getPublicProducts();
  console.log('Public products count:', publicProds.length);

  const spProds = await fetchSupabaseProducts();
  console.log('fetchSupabaseProducts count:', spProds.length);

  // Try direct Postgres
  try {
    const prodRes = await query("SELECT COUNT(*)::int AS count FROM products");
    console.log('Postgres direct COUNT(*):', prodRes?.rows?.[0]?.count);
    const prodStatus = await query("SELECT status, count(*) FROM products GROUP BY status");
    console.log('Postgres status group:', prodStatus?.rows);
  } catch (err: any) {
    console.log('Postgres query error:', err.message);
  }

  if (isSupabaseConfigured()) {
    const { count: totalDb } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true });
    console.log('Supabase products count:', totalDb);

    const { data: dbProducts } = await supabaseAdmin.from('products').select('id, handle, title, status, product_type');
    console.log('Fetched DB products length:', dbProducts?.length);

    const statusCounts: Record<string, number> = {};
    dbProducts?.forEach((p: any) => {
      statusCounts[p.status || 'null'] = (statusCounts[p.status || 'null'] || 0) + 1;
    });
    console.log('DB Status breakdown:', statusCounts);

    const publicSlugs = new Set(publicProds.map(p => p.slug));
    const inDbNotPublic = dbProducts?.filter((p: any) => !publicSlugs.has(p.handle)) || [];
    console.log('In DB but not in Public Products count:', inDbNotPublic.length);
    console.log('Sample In DB but not public (first 15):', JSON.stringify(inDbNotPublic.slice(0, 15).map((p: any) => ({ handle: p.handle, title: p.title, status: p.status, type: p.product_type })), null, 2));

    const dbHandles = new Set(dbProducts?.map((p: any) => p.handle));
    const inPublicNotDb = publicProds.filter(p => !dbHandles.has(p.slug));
    console.log('In Public but not in DB count:', inPublicNotDb.length);
    console.log('Sample In Public but not in DB (first 10):', inPublicNotDb.slice(0, 10).map(p => ({ slug: p.slug, title: p.title })));
  } else {
    console.log('Supabase is not configured.');
  }
}

main().catch(console.error);
