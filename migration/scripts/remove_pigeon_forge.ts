import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const collectionsPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_collections.json');
const redirectsPath = path.join(__dirname, '..', '..', 'src', 'data', 'shopify_redirects.json');

async function run() {
  console.log('=================================================================');
  console.log('REMOVING PIGEON FORGE CABIN DESIGN ACROSS ALL 50 STATES');
  console.log('=================================================================\n');

  // -------------------------------------------------------------
  // STEP 1: Process all_products_catalog.json
  // -------------------------------------------------------------
  console.log('--- Step 1: Processing all_products_catalog.json ---');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const initialCatalogCount = catalog.length;

  const isPigeonForge = (p: any) => {
    const slug = (p.slug || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const title = (p.title || '').toLowerCase();
    const handle = (p.handle || '').toLowerCase();

    return slug.startsWith('pigeon-forge-cabin') ||
           slug.includes('pigeon-forge-cabin') ||
           handle.startsWith('pigeon-forge-cabin') ||
           name.toLowerCase().includes('pigeon forge cabin') ||
           title.toLowerCase().includes('pigeon forge cabin');
  };

  const pigeonForgeProducts = catalog.filter(isPigeonForge);
  console.log(`Identified ${pigeonForgeProducts.length} Pigeon Forge Cabin products to remove.`);

  const pigeonForgeSlugs = new Set<string>(pigeonForgeProducts.map((p: any) => (p.slug || p.handle || '').toLowerCase()));
  const pigeonForgeIds = new Set<string>(pigeonForgeProducts.map((p: any) => String(p.id)));

  console.log(`Unique slugs to delete (${pigeonForgeSlugs.size}):`, Array.from(pigeonForgeSlugs));

  const filteredCatalog = catalog.filter((p: any) => !isPigeonForge(p));
  console.log(`Catalog count: ${initialCatalogCount} -> ${filteredCatalog.length} (Removed: ${initialCatalogCount - filteredCatalog.length})`);

  fs.writeFileSync(catalogPath, JSON.stringify(filteredCatalog, null, 2), 'utf8');
  console.log('Saved updated all_products_catalog.json\n');

  // -------------------------------------------------------------
  // STEP 2: Process all_collections.json
  // -------------------------------------------------------------
  console.log('--- Step 2: Processing all_collections.json ---');
  const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf8'));
  let totalHandlesRemoved = 0;
  let totalIdsRemoved = 0;
  let collectionsModified = 0;

  const updatedCollections = collections.map((col: any) => {
    let handles = col.productHandles || [];
    let ids = col.productIds || [];

    const initialHandleCount = handles.length;
    const initialIdCount = ids.length;

    handles = handles.filter((h: string) => !pigeonForgeSlugs.has(h.toLowerCase()) && !h.toLowerCase().includes('pigeon-forge-cabin'));
    ids = ids.filter((id: any) => !pigeonForgeIds.has(String(id)));

    if (handles.length !== initialHandleCount || ids.length !== initialIdCount) {
      totalHandlesRemoved += (initialHandleCount - handles.length);
      totalIdsRemoved += (initialIdCount - ids.length);
      collectionsModified++;
    }

    return {
      ...col,
      productHandles: handles,
      productIds: ids,
      productCount: handles.length,
    };
  });

  console.log(`Updated collections: ${collectionsModified} modified, ${totalHandlesRemoved} handles removed, ${totalIdsRemoved} IDs removed.`);
  fs.writeFileSync(collectionsPath, JSON.stringify(updatedCollections, null, 2), 'utf8');
  console.log('Saved updated all_collections.json\n');

  // -------------------------------------------------------------
  // STEP 3: Update shopify_redirects.json
  // -------------------------------------------------------------
  console.log('--- Step 3: Updating shopify_redirects.json ---');
  const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

  // 1. Point any existing pigeon-forge redirects to /cabins
  let updatedExisting = 0;
  for (const [key, val] of Object.entries(redirects)) {
    const k = key.toLowerCase();
    const v = typeof val === 'string' ? val.toLowerCase() : '';
    if (k.includes('pigeon-forge') || v.includes('pigeon-forge')) {
      redirects[key] = '/cabins';
      updatedExisting++;
    }
  }
  console.log(`Updated ${updatedExisting} existing redirect entries containing pigeon-forge to point directly to /cabins.`);

  // 2. Add explicit 301 redirects for /tiny-homes/, /cabins/, /products/, /buildings/, /models/
  let addedRedirects = 0;
  pigeonForgeSlugs.forEach((slug) => {
    const paths = [
      `/tiny-homes/${slug}`,
      `/tiny-homes/${slug}/`,
      `/cabins/${slug}`,
      `/cabins/${slug}/`,
      `/products/${slug}`,
      `/products/${slug}/`,
      `/buildings/${slug}`,
      `/buildings/${slug}/`,
      `/models/${slug}`,
      `/models/${slug}/`,
    ];

    paths.forEach((p) => {
      if (redirects[p] !== '/cabins') {
        redirects[p] = '/cabins';
        addedRedirects++;
      }
    });
  });

  console.log(`Added/ensured explicit redirects for all paths (${addedRedirects} entries updated/added).`);
  fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2), 'utf8');
  console.log('Saved updated shopify_redirects.json\n');

  // -------------------------------------------------------------
  // STEP 4: Delete from Supabase Database
  // -------------------------------------------------------------
  console.log('--- Step 4: Deleting from Supabase Database ---');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: dbProducts, error: fetchErr } = await supabase
      .from('products')
      .select('id, handle, title')
      .ilike('handle', '%pigeon-forge%');

    if (fetchErr) {
      console.error('Error fetching Supabase products:', fetchErr.message);
    } else if (dbProducts && dbProducts.length > 0) {
      console.log(`Found ${dbProducts.length} Pigeon Forge products in Supabase.`);
      const dbIds = dbProducts.map((p) => p.id);

      // Delete from product_collections
      const { error: colErr } = await supabase.from('product_collections').delete().in('product_id', dbIds);
      if (colErr) console.warn('product_collections delete notice:', colErr.message);
      else console.log(`Deleted product_collections references for ${dbIds.length} products.`);

      // Delete from product_variants
      const { error: varErr } = await supabase.from('product_variants').delete().in('product_id', dbIds);
      if (varErr) console.warn('product_variants delete notice:', varErr.message);
      else console.log(`Deleted product_variants references for ${dbIds.length} products.`);

      // Delete from product_media
      const { error: medErr } = await supabase.from('product_media').delete().in('product_id', dbIds);
      if (medErr) console.warn('product_media delete notice:', medErr.message);
      else console.log(`Deleted product_media references for ${dbIds.length} products.`);

      // Delete from products
      const { error: prodErr } = await supabase.from('products').delete().in('id', dbIds);
      if (prodErr) console.error('Error deleting products from Supabase:', prodErr.message);
      else console.log(`Successfully deleted ${dbProducts.length} products from Supabase 'products' table.`);
    } else {
      console.log('No Pigeon Forge products found in Supabase.');
    }
  } else {
    console.log('Supabase credentials not configured in environment; skipped database deletion.');
  }

  console.log('\n=================================================================');
  console.log('COMPLETED PIGEON FORGE CABIN DELETION ACROSS ALL STATES');
  console.log('=================================================================');
}

run().catch((err) => {
  console.error('Fatal error during removal:', err);
  process.exit(1);
});
