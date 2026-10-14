import * as fs from 'fs';
import * as path from 'path';

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const collectionsPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_collections.json');
const redirectsPath = path.join(__dirname, '..', '..', 'src', 'data', 'shopify_redirects.json');

console.log('--- Step 1: Processing all_products_catalog.json ---');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const initialCatalogCount = catalog.length;

const isWillowBrook = (p: any) => {
  const slug = (p.slug || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  return slug.startsWith('the-willow-brook') || name.includes('willow brook');
};

const willowBrookProducts = catalog.filter(isWillowBrook);
console.log(`Identified ${willowBrookProducts.length} Willow Brook products to remove.`);

const willowBrookSlugs = new Set(willowBrookProducts.map((p: any) => (p.slug || '').toLowerCase()));
const willowBrookIds = new Set(willowBrookProducts.map((p: any) => String(p.id)));

const filteredCatalog = catalog.filter((p: any) => !isWillowBrook(p));
console.log(`Catalog count: ${initialCatalogCount} -> ${filteredCatalog.length} (Removed: ${initialCatalogCount - filteredCatalog.length})`);

fs.writeFileSync(catalogPath, JSON.stringify(filteredCatalog, null, 2), 'utf8');
console.log('Saved updated all_products_catalog.json');

console.log('\n--- Step 2: Processing all_collections.json ---');
const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf8'));
let totalHandlesRemoved = 0;
let collectionsModified = 0;

const updatedCollections = collections.map((col: any) => {
  let modified = false;
  let handles = col.productHandles || [];
  let ids = col.productIds || [];

  const initialHandleCount = handles.length;
  handles = handles.filter((h: string) => {
    const isWb = willowBrookSlugs.has(h.toLowerCase()) || h.toLowerCase().startsWith('the-willow-brook');
    return !isWb;
  });

  ids = ids.filter((id: any) => !willowBrookIds.has(String(id)));

  if (handles.length !== initialHandleCount) {
    modified = true;
    totalHandlesRemoved += (initialHandleCount - handles.length);
    collectionsModified++;
  }

  return {
    ...col,
    productHandles: handles,
    productIds: ids,
    productCount: handles.length,
  };
});

console.log(`Updated collections: ${collectionsModified} collections modified, ${totalHandlesRemoved} Willow Brook references removed.`);
fs.writeFileSync(collectionsPath, JSON.stringify(updatedCollections, null, 2), 'utf8');
console.log('Saved updated all_collections.json');

console.log('\n--- Step 3: Updating shopify_redirects.json ---');
const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

// 1. Update any existing redirects pointing to or from willow-brook to point directly to /cabins
let updatedExisting = 0;
for (const [key, val] of Object.entries(redirects)) {
  if (key.toLowerCase().includes('willow-brook')) {
    redirects[key] = '/cabins';
    updatedExisting++;
  } else if (typeof val === 'string' && val.toLowerCase().includes('willow-brook')) {
    redirects[key] = '/cabins';
    updatedExisting++;
  }
}
console.log(`Updated ${updatedExisting} existing redirect entries to point directly to /cabins.`);

// 2. Add explicit 301 redirects for /cabins/the-willow-brook*
let addedCabinRedirects = 0;
willowBrookSlugs.forEach((slug) => {
  const cabinPath = `/cabins/${slug}`;
  const cabinPathSlash = `/cabins/${slug}/`;
  if (!redirects[cabinPath]) {
    redirects[cabinPath] = '/cabins';
    addedCabinRedirects++;
  }
  if (!redirects[cabinPathSlash]) {
    redirects[cabinPathSlash] = '/cabins';
    addedCabinRedirects++;
  }

  const prodPath = `/products/${slug}`;
  const prodPathSlash = `/products/${slug}/`;
  if (redirects[prodPath] !== '/cabins') {
    redirects[prodPath] = '/cabins';
  }
  if (redirects[prodPathSlash] !== '/cabins') {
    redirects[prodPathSlash] = '/cabins';
  }
});
console.log(`Added ${addedCabinRedirects} explicit /cabins/the-willow-brook* redirect entries.`);

fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2), 'utf8');
console.log('Saved updated shopify_redirects.json');

console.log('\n--- Finished Successfully ---');
