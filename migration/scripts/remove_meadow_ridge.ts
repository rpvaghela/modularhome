import * as fs from 'fs';
import * as path from 'path';

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const collectionsPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_collections.json');
const redirectsPath = path.join(__dirname, '..', '..', 'src', 'data', 'shopify_redirects.json');

console.log('--- Step 1: Processing all_products_catalog.json ---');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const initialCatalogCount = catalog.length;

const isMeadowRidge = (p: any) => {
  const slug = (p.slug || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  const title = (p.title || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();

  const isMeadowAndRidge = (name.includes('meadow') && name.includes('ridge')) ||
                           (slug.includes('meadow') && slug.includes('ridge')) ||
                           (title.includes('meadow') && title.includes('ridge'));
  const isMeadowBrookAdu = slug.startsWith('the-meadow-brook-adu') || name.includes('meadow ridge adu');

  return isMeadowAndRidge || isMeadowBrookAdu;
};

const meadowRidgeProducts = catalog.filter(isMeadowRidge);
console.log(`Identified ${meadowRidgeProducts.length} Meadow Ridge products to remove.`);

const meadowRidgeSlugs = new Set(meadowRidgeProducts.map((p: any) => (p.slug || '').toLowerCase()));
const meadowRidgeIds = new Set(meadowRidgeProducts.map((p: any) => String(p.id)));

const filteredCatalog = catalog.filter((p: any) => !isMeadowRidge(p));
console.log(`Catalog count: ${initialCatalogCount} -> ${filteredCatalog.length} (Removed: ${initialCatalogCount - filteredCatalog.length})`);

fs.writeFileSync(catalogPath, JSON.stringify(filteredCatalog, null, 2), 'utf8');
console.log('Saved updated all_products_catalog.json');

console.log('\n--- Step 2: Processing all_collections.json ---');
const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf8'));
let totalHandlesRemoved = 0;
let collectionsModified = 0;

const updatedCollections = collections.map((col: any) => {
  let handles = col.productHandles || [];
  let ids = col.productIds || [];

  const initialHandleCount = handles.length;
  handles = handles.filter((h: string) => {
    const isMr = meadowRidgeSlugs.has(h.toLowerCase()) ||
                 h.toLowerCase().includes('meadow-ridge') ||
                 h.toLowerCase().includes('meadow-brook-adu');
    return !isMr;
  });

  ids = ids.filter((id: any) => !meadowRidgeIds.has(String(id)));

  if (handles.length !== initialHandleCount) {
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

console.log(`Updated collections: ${collectionsModified} collections modified, ${totalHandlesRemoved} Meadow Ridge references removed.`);
fs.writeFileSync(collectionsPath, JSON.stringify(updatedCollections, null, 2), 'utf8');
console.log('Saved updated all_collections.json');

console.log('\n--- Step 3: Updating shopify_redirects.json ---');
const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

// 1. Update any existing redirects pointing to or from meadow-ridge or meadow-brook-adu to point directly to /adus
let updatedExisting = 0;
for (const [key, val] of Object.entries(redirects)) {
  const k = key.toLowerCase();
  const v = typeof val === 'string' ? val.toLowerCase() : '';
  if (k.includes('meadow-ridge') || k.includes('meadow-brook-adu') || v.includes('meadow-ridge') || v.includes('meadow-brook-adu')) {
    redirects[key] = '/adus';
    updatedExisting++;
  }
}
console.log(`Updated ${updatedExisting} existing redirect entries to point directly to /adus.`);

// 2. Add explicit 301 redirects for /adus/, /cabins/, and /products/ variants for all 51 Meadow Ridge slugs
let addedRedirects = 0;
meadowRidgeSlugs.forEach((slug) => {
  const paths = [
    `/adus/${slug}`,
    `/adus/${slug}/`,
    `/cabins/${slug}`,
    `/cabins/${slug}/`,
    `/products/${slug}`,
    `/products/${slug}/`,
  ];

  paths.forEach((p) => {
    if (redirects[p] !== '/adus') {
      redirects[p] = '/adus';
      addedRedirects++;
    }
  });
});
console.log(`Added/ensured explicit redirects for all paths (${addedRedirects} entries updated/added).`);

fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2), 'utf8');
console.log('Saved updated shopify_redirects.json');

console.log('\n--- Finished Successfully ---');
