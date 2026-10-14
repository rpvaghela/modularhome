import { getPublicCollections, getPublicCollectionBySlug, clearPublicDataCache } from '../src/lib/publicData';

async function main() {
  clearPublicDataCache();
  const cols = await getPublicCollections();
  console.log(`Total public collections fetched: ${cols.length}`);

  const testSlugs = [
    '2-bedroom-turnkey-homes',
    'cabin-builders-in-alabama',
    'barndo-kits-barndo-house-kits',
    '3-bedroom-prefab-homes',
    'modern-prefab-homes',
    'prefab-homes-california',
    'luxury-modular-homes',
    'farmhouse-prefab-homes'
  ];

  for (const slug of testSlugs) {
    const col = await getPublicCollectionBySlug(slug);
    if (!col) {
      console.log(`❌ Slug not found: ${slug}`);
      continue;
    }
    console.log(`✅ [${col.slug}] "${col.name}"`);
    console.log(`   - Reported productCount: ${col.productCount}`);
    console.log(`   - Resolved products array length: ${col.products?.length || 0}`);
    if (col.products && col.products.length > 0) {
      console.log(`   - Sample models: ${col.products.slice(0, 3).map(p => `"${p.name}" ($${Number(p.startingPrice || (p as any).price || 0).toLocaleString()})`).join(', ')}`);
    } else {
      console.log(`   ⚠️ No products resolved!`);
    }
  }

  // Check how many of all 418 collections have > 0 products
  let withProducts = 0;
  for (const col of cols) {
    if ((col.productCount && col.productCount > 0) || (col.products && col.products.length > 0)) {
      withProducts++;
    }
  }
  console.log(`\nOverall: ${withProducts} / ${cols.length} collections have models linked.`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
