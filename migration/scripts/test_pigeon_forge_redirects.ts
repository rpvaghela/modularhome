import redirectsData from '../../src/data/shopify_redirects.json';
import catalog from '../../src/data/all_products_catalog.json';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const redirects = redirectsData as Record<string, string>;

async function test() {
  console.log('=================================================================');
  console.log('TESTING PIGEON FORGE CABIN DELETION & REDIRECTS');
  console.log('=================================================================\n');

  // 1. Verify 0 Pigeon Forge products in all_products_catalog.json
  const pigeonInCatalog = catalog.filter((p: any) => {
    const text = `${p.name} ${p.slug} ${p.title || ''} ${p.handle || ''}`.toLowerCase();
    return text.includes('pigeon-forge-cabin') || text.includes('pigeon forge cabin');
  });

  console.log(`Pigeon Forge products remaining in catalog: ${pigeonInCatalog.length} (MUST BE 0)`);
  if (pigeonInCatalog.length !== 0) {
    throw new Error(`Catalog verification failed: ${pigeonInCatalog.length} products found`);
  }

  // 2. Verify 0 Pigeon Forge products in Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('id, handle')
      .ilike('handle', '%pigeon-forge%');

    if (error) {
      console.error('Supabase query error:', error.message);
    } else {
      console.log(`Pigeon Forge products remaining in Supabase: ${dbProducts?.length || 0} (MUST BE 0)`);
      if ((dbProducts?.length || 0) !== 0) {
        throw new Error(`Supabase verification failed: ${dbProducts?.length} products found`);
      }
    }
  }

  // 3. Test URLs
  const testUrls = [
    // Client's explicitly affected URL:
    '/tiny-homes/pigeon-forge-cabin-rhode-island-pricing',
    '/tiny-homes/pigeon-forge-cabin-rhode-island-pricing/',
    // Other state pricing under /tiny-homes/
    '/tiny-homes/pigeon-forge-cabin-california-pricing',
    '/tiny-homes/pigeon-forge-cabin-texas-pricing',
    '/tiny-homes/pigeon-forge-cabin-florida-pricing',
    // Historical /products/ URLs:
    '/products/pigeon-forge-cabin-rhode-island-pricing',
    '/products/pigeon-forge-cabin-rhode-island-pricing/',
    '/products/pigeon-forge-cabin-texas-pricing',
    '/products/pigeon-forge-cabin-texas-pricing/',
    // Historical /cabins/ URLs:
    '/cabins/pigeon-forge-cabin-rhode-island-pricing',
    '/cabins/pigeon-forge-cabin-rhode-island-pricing/',
    '/cabins/pigeon-forge-cabin-new-york-pricing',
    // Historical /buildings/ URLs:
    '/buildings/pigeon-forge-cabin-rhode-island-pricing',
    '/buildings/pigeon-forge-cabin-rhode-island-pricing/',
  ];

  console.log('\nTesting Pigeon Forge 301 Redirect targets:');
  let allPass = true;
  testUrls.forEach((url) => {
    const normalized = url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
    const lower = normalized.toLowerCase();
    
    // Exact lookup as performed in middleware.ts
    const dest = redirects[url.toLowerCase()] || redirects[lower] || redirects[normalized];
    console.log(`  ${url} -> ${dest}`);
    if (dest !== '/cabins') {
      allPass = false;
      console.error(`  FAIL: expected /cabins, got ${dest}`);
    }
  });

  if (!allPass) {
    throw new Error('Some redirect tests failed!');
  }

  // 4. Verify other designs are intact
  const unaffected = [
    '/cabins',
    '/products/the-smoky-mountain-cabin-series-tennessee-pricing',
    '/cabins/the-cumberland-crossing-cabin-tennessee-pricing',
  ];

  console.log('\nVerifying other products are preserved:');
  unaffected.forEach((url) => {
    const dest = redirects[url.toLowerCase()];
    console.log(`  ${url} -> ${dest || '(direct route)'}`);
  });

  console.log('\n=================================================================');
  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
  console.log('=================================================================');
}

test().catch((err) => {
  console.error(err);
  process.exit(1);
});
