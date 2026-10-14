import { BUILDING_MODELS } from '../../src/data/models';
import ALL_CATALOG from '../../src/data/all_products_catalog.json';

const catalogSlugs = new Set<string>();
const catalogDups: any[] = [];
ALL_CATALOG.forEach((p: any, i: number) => {
  const s = p.slug || p.handle;
  if (!s) return;
  if (catalogSlugs.has(s)) {
    catalogDups.push({ i, slug: s, name: p.name });
  } else {
    catalogSlugs.add(s);
  }
});

console.log('Catalog duplicates by slug:', catalogDups.length, catalogDups);

const modelsSlugs = new Set<string>();
const modelsDups: any[] = [];
BUILDING_MODELS.forEach((m: any, i: number) => {
  const s = m.slug;
  if (!s) return;
  if (modelsSlugs.has(s)) {
    modelsDups.push({ i, slug: s, name: m.name });
  } else {
    modelsSlugs.add(s);
  }
});
console.log('BUILDING_MODELS duplicates by slug:', modelsDups.length, modelsDups);

const overlap = BUILDING_MODELS.filter((m: any) => catalogSlugs.has(m.slug));
console.log('Overlap between BUILDING_MODELS and catalog:', overlap.length, overlap.map((x: any) => x.slug));
