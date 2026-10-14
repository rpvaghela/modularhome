import { getPublicProducts, getPublicCollections } from '../../src/lib/publicData';
import { supabaseAdmin, isSupabaseConfigured } from '../../src/lib/supabase';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function verify() {
  console.log('=== VERIFYING ADMIN PANEL & STOREFRONT SYNC ===\n');

  const publicProds = await getPublicProducts();
  const publicCols = await getPublicCollections();

  console.log(`Live Storefront Models: ${publicProds.length}`);
  console.log(`Live Storefront Collections: ${publicCols.length}`);

  if (isSupabaseConfigured()) {
    const { count: dbProdCount, data: dbProducts } = await supabaseAdmin
      .from('products')
      .select('id, handle, title, status', { count: 'exact' });
    const { count: dbColCount, data: dbCollections } = await supabaseAdmin
      .from('collections')
      .select('id, handle, title', { count: 'exact' });

    console.log(`Database Products: ${dbProdCount}`);
    console.log(`Database Collections: ${dbColCount}`);

    // Check every single public product is in DB
    const dbProductHandles = new Set(dbProducts?.map(p => p.handle?.toLowerCase().trim()));
    const missingModels = publicProds.filter(p => !dbProductHandles.has(p.slug.toLowerCase().trim()));
    console.log(`Storefront Models Missing from Admin/DB: ${missingModels.length}`);
    if (missingModels.length > 0) {
      missingModels.forEach(m => console.log('  -', m.slug));
    } else {
      console.log('  ✓ 100% of Storefront Models are present in Admin Panel and DB!');
    }

    // Check every single public collection is in DB
    const dbColHandles = new Set(dbCollections?.map(c => c.handle?.toLowerCase().trim()));
    const missingCollections = publicCols.filter(c => !dbColHandles.has((c.slug || c.handle || '').toLowerCase().trim()));
    console.log(`Storefront Collections Missing from Admin/DB: ${missingCollections.length}`);
    if (missingCollections.length > 0) {
      missingCollections.forEach(c => console.log('  -', c.slug || c.handle));
    } else {
      console.log('  ✓ 100% of Storefront Collections are present in Admin Panel and DB!');
    }
  }

  console.log('\n=== SYNC TEST COMPLETE ===');
}

verify().catch(console.error);
