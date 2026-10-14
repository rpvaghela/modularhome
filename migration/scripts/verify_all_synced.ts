import { getPublicProducts, getPublicCollections } from '../../src/lib/publicData';
import { supabaseAdmin, isSupabaseConfigured } from '../../src/lib/supabase';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function verify() {
  console.log('=== VERIFYING STOREFRONT & DATABASE SYNCHRONIZATION ===\n');

  const publicProds = await getPublicProducts();
  const publicCols = await getPublicCollections();

  console.log(`Public Storefront Models: ${publicProds.length}`);
  console.log(`Public Storefront Collections: ${publicCols.length}`);

  if (!isSupabaseConfigured()) {
    console.log('Supabase is not configured.');
    return;
  }

  const { data: dbProducts } = await supabaseAdmin.from('products').select('id, handle, title, status');
  const { data: dbCollections } = await supabaseAdmin.from('collections').select('id, handle, title');

  console.log(`Supabase Products Total in DB: ${dbProducts?.length}`);
  console.log(`Supabase Collections Total in DB: ${dbCollections?.length}`);

  const dbProductHandles = new Set(dbProducts?.map(p => p.handle?.toLowerCase().trim()));
  const missingProds = publicProds.filter(p => !dbProductHandles.has(p.slug.toLowerCase().trim()));

  console.log(`\nStorefront Models Missing from DB: ${missingProds.length}`);
  if (missingProds.length > 0) {
    missingProds.forEach(p => console.log('  -', p.slug, '->', p.name));
  } else {
    console.log('  ✓ 100% of Storefront Models are present in the Database!');
  }

  const dbColHandles = new Set(dbCollections?.map(c => c.handle?.toLowerCase().trim()));
  const missingCols = publicCols.filter(c => !dbColHandles.has((c.slug || c.handle || '').toLowerCase().trim()));

  console.log(`\nStorefront Collections Missing from DB: ${missingCols.length}`);
  if (missingCols.length > 0) {
    missingCols.forEach(c => console.log('  -', c.slug || c.handle, '->', c.name || c.title));
  } else {
    console.log('  ✓ 100% of Storefront Collections are present in the Database!');
  }

  console.log('\n=== VERIFICATION COMPLETE ===');
}

verify().catch(console.error);
