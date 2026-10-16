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
  console.log('PURGING ALL REMAINING STATE-BY-STATE PRICING DESIGNS ACROSS ALL STATES');
  console.log('(Cumberland Crossing, Smoky Mountain, and Big Bertha Rustic Cabin)');
  console.log('=================================================================\n');

  const isTargetProduct = (p: any) => {
    const slug = (p.slug || p.handle || '').toLowerCase();
    const name = (p.name || p.title || '').toLowerCase();

    // Preserve the standalone single non-state model
    if (slug === 'modern-big-bertha-3-0-amish-built-modular-cabin') {
      return false;
    }

    // Cumberland Crossing state models
    if (slug.includes('cumberland-crossing') || name.includes('cumberland crossing')) {
      return true;
    }

    // Smoky Mountain state models (including modern-cottage-retreat which is Smoky Mountain Indiana)
    if (slug.includes('smoky-mountain') || name.includes('smoky mountain') || slug === 'modern-cottage-retreat') {
      return true;
    }

    // Big Bertha Rustic Cabin state models
    if (slug.includes('big-bertha') || name.includes('big bertha')) {
      return true;
    }

    return false;
  };

  // -------------------------------------------------------------
  // STEP 1: Process all_products_catalog.json
  // -------------------------------------------------------------
  console.log('--- Step 1: Processing all_products_catalog.json ---');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const initialCatalogCount = catalog.length;

  const targetProducts = catalog.filter(isTargetProduct);
  console.log(`Identified ${targetProducts.length} state-pricing products to remove from catalog.`);

  const targetSlugs = new Set<string>();
  const targetIds = new Set<string>();

  targetProducts.forEach((p: any) => {
    if (p.slug) targetSlugs.add(p.slug.toLowerCase());
    if (p.handle) targetSlugs.add(p.handle.toLowerCase());
    if (p.id) targetIds.add(String(p.id));
  });

  const filteredCatalog = catalog.filter((p: any) => !isTargetProduct(p));
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

    handles = handles.filter((h: string) => !targetSlugs.has(h.toLowerCase()));
    ids = ids.filter((id: any) => !targetIds.has(String(id)));

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

  // Point any existing matching redirects to /cabins
  let updatedExisting = 0;
  for (const [key, val] of Object.entries(redirects)) {
    const k = key.toLowerCase();
    const v = typeof val === 'string' ? val.toLowerCase() : '';
    const matchesTarget = (s: string) => {
      if (s.includes('modern-big-bertha-3-0')) return false;
      return s.includes('cumberland-crossing') || s.includes('smoky-mountain') || s.includes('big-bertha') || s.includes('modern-cottage-retreat');
    };

    if (matchesTarget(k) || matchesTarget(v)) {
      redirects[key] = '/cabins';
      updatedExisting++;
    }
  }
  console.log(`Updated ${updatedExisting} existing redirect entries to point directly to /cabins.`);

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
      .select('id, handle, title');

    if (fetchErr) {
      console.error('Error fetching Supabase products:', fetchErr.message);
    } else if (dbProducts && dbProducts.length > 0) {
      const toDelete = dbProducts.filter((p: any) => isTargetProduct(p));
      console.log(`Found ${toDelete.length} state-pricing products in Supabase to delete.`);

      toDelete.forEach((p: any) => {
        if (p.handle) targetSlugs.add(p.handle.toLowerCase());
      });

      if (toDelete.length > 0) {
        const dbIds = toDelete.map((p) => p.id);

        const { error: colErr } = await supabase.from('product_collections').delete().in('product_id', dbIds);
        if (colErr) console.warn('product_collections delete notice:', colErr.message);

        const { error: varErr } = await supabase.from('product_variants').delete().in('product_id', dbIds);
        if (varErr) console.warn('product_variants delete notice:', varErr.message);

        const { error: medErr } = await supabase.from('product_media').delete().in('product_id', dbIds);
        if (medErr) console.warn('product_media delete notice:', medErr.message);

        const { error: prodErr } = await supabase.from('products').delete().in('id', dbIds);
        if (prodErr) console.error('Error deleting products from Supabase:', prodErr.message);
        else console.log(`Successfully deleted ${toDelete.length} products from Supabase 'products' table.`);
      }
    }
  }

  // Add explicit 301 redirects for every slug across all route prefixes
  let addedRedirects = 0;
  targetSlugs.forEach((slug) => {
    const paths = [
      `/cabins/${slug}`,
      `/cabins/${slug}/`,
      `/park-models/${slug}`,
      `/park-models/${slug}/`,
      `/tiny-homes/${slug}`,
      `/tiny-homes/${slug}/`,
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

  console.log('=================================================================');
  console.log('COMPLETED DELETION OF ALL REMAINING STATE-PRICING PRODUCTS');
  console.log('=================================================================');
}

run().catch((err) => {
  console.error('Fatal error during removal:', err);
  process.exit(1);
});
