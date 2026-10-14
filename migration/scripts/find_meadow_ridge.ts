import * as fs from 'fs';
import * as path from 'path';

// 1. Check all_products_catalog.json
const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const meadowRidgeCatalog = catalog.filter((p: any) => {
  const text = `${p.name} ${p.slug} ${p.title || ''} ${p.handle || ''}`.toLowerCase();
  return (text.includes('meadow') && text.includes('ridge')) || text.includes('meadow-brook-adu');
});

console.log(`Found ${meadowRidgeCatalog.length} Meadow Ridge products in all_products_catalog.json:`);
meadowRidgeCatalog.forEach((p: any, idx: number) => {
  console.log(`${idx + 1}. [${p.category}] "${p.name}" (slug: ${p.slug}) (id: ${p.id})`);
});

// Check if any other products have "meadow"
const allMeadow = catalog.filter((p: any) => {
  const text = `${p.name} ${p.slug} ${p.title || ''} ${p.handle || ''}`.toLowerCase();
  return text.includes('meadow');
});
console.log(`\nTotal products containing 'meadow': ${allMeadow.length}`);
const otherMeadow = allMeadow.filter((p: any) => !meadowRidgeCatalog.includes(p));
console.log(`Other 'meadow' products not in Meadow Ridge: ${otherMeadow.length}`);
otherMeadow.forEach((p: any) => {
  console.log(`  - slug: ${p.slug} | name: ${p.name}`);
});

// 2. Check models.ts
const modelsPath = path.join(__dirname, '..', '..', 'src', 'data', 'models.ts');
const modelsContent = fs.readFileSync(modelsPath, 'utf8');
const hasInModels = modelsContent.toLowerCase().includes('meadow') && modelsContent.toLowerCase().includes('ridge');
console.log(`\nPresent in src/data/models.ts: ${hasInModels}`);

// 3. Check shopify_redirects.json
const redirectsPath = path.join(__dirname, '..', '..', 'src', 'data', 'shopify_redirects.json');
const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

const meadowRedirects = Object.entries(redirects).filter(([src, dest]) => {
  return src.toLowerCase().includes('meadow') || (typeof dest === 'string' && dest.toLowerCase().includes('meadow'));
});
console.log(`\nFound ${meadowRedirects.length} entries in shopify_redirects.json referencing 'meadow':`);
meadowRedirects.slice(0, 15).forEach(([src, dest]) => console.log(`  ${src} -> ${dest}`));
if (meadowRedirects.length > 15) console.log(`  ... and ${meadowRedirects.length - 15} more`);

// 4. Check all_collections.json
const collectionsPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_collections.json');
const collections = JSON.parse(fs.readFileSync(collectionsPath, 'utf8'));
const mrSlugs = new Set(meadowRidgeCatalog.map((p: any) => p.slug.toLowerCase()));
const mrIds = new Set(meadowRidgeCatalog.map((p: any) => String(p.id)));

let collectionsWithMr = 0;
let totalHandlesFound = 0;
collections.forEach((c: any) => {
  const handles = (c.productHandles || []).filter((h: string) => mrSlugs.has(h.toLowerCase()) || h.toLowerCase().includes('meadow-ridge') || h.toLowerCase().includes('meadow-brook-adu'));
  if (handles.length > 0) {
    collectionsWithMr++;
    totalHandlesFound += handles.length;
  }
});
console.log(`\nFound ${totalHandlesFound} Meadow Ridge handle references across ${collectionsWithMr} collections in all_collections.json.`);
