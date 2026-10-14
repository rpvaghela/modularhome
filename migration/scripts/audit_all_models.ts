import { getPublicProducts } from '../../src/lib/publicData';
import { matchProductCategory, isKitOrShell } from '../../src/utils/categoryMatching';

async function audit() {
  console.log('=== STARTING COMPREHENSIVE MODELS & CATEGORIES AUDIT ===\n');
  const products = await getPublicProducts();
  console.log(`Total Public Models: ${products.length}\n`);

  // 1. Check for duplicates
  const slugCounts = new Map<string, number>();
  const titleCounts = new Map<string, string[]>();

  products.forEach(p => {
    const s = (p.slug || '').toLowerCase().trim();
    slugCounts.set(s, (slugCounts.get(s) || 0) + 1);

    const t = (p.name || p.title || '').toLowerCase().trim();
    if (!titleCounts.has(t)) titleCounts.set(t, []);
    titleCounts.get(t)!.push(p.slug);
  });

  const duplicateSlugs = Array.from(slugCounts.entries()).filter(([_, c]) => c > 1);
  const duplicateTitles = Array.from(titleCounts.entries()).filter(([_, slugs]) => slugs.length > 1);

  console.log(`Duplicate Slugs Count: ${duplicateSlugs.length}`);
  if (duplicateSlugs.length > 0) {
    duplicateSlugs.forEach(([s, c]) => console.log(`  - ${s} (${c} occurrences)`));
  }

  console.log(`Duplicate Titles Count: ${duplicateTitles.length}`);
  if (duplicateTitles.length > 0) {
    duplicateTitles.forEach(([t, slugs]) => console.log(`  - "${t}" -> Slugs: ${slugs.join(', ')}`));
  }

  // 2. Data Integrity: Missing price, image, title, slug
  const missingPrice = products.filter(p => !p.startingPrice || p.startingPrice <= 0 || isNaN(p.startingPrice));
  const missingImage = products.filter(p => !p.primaryImage || p.primaryImage.trim() === '');
  const missingSlug = products.filter(p => !p.slug || p.slug.trim() === '');
  const missingTitle = products.filter(p => !p.name || p.name.trim() === '');

  console.log(`\nData Integrity:`);
  console.log(`  - Missing / Zero Price: ${missingPrice.length}`);
  console.log(`  - Missing Primary Image: ${missingImage.length}`);
  console.log(`  - Missing Slug: ${missingSlug.length}`);
  console.log(`  - Missing Title: ${missingTitle.length}`);

  // 3. Category Breakdown (Raw Category on Model)
  const rawCategoryCounts: Record<string, number> = {};
  products.forEach(p => {
    const cat = p.category || 'NO_CATEGORY';
    rawCategoryCounts[cat] = (rawCategoryCounts[cat] || 0) + 1;
  });

  console.log('\n--- Raw Category Field Distribution ---');
  Object.entries(rawCategoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat.padEnd(35)}: ${count}`);
    });

  // 4. Dynamic Category Matching (as served on website collection pages)
  const testCategories = [
    'modular-homes',
    'prefab-homes',
    'barndominiums',
    'cabins',
    'house-kits',
    'tiny-homes',
    'park-models',
    'adus-granny-pods',
    'a-frames',
    'commercial-modular-buildings',
    'residential',
    'furniture-accessories'
  ];

  console.log('\n--- Dynamic Website Category Matching Counts ---');
  testCategories.forEach(catSlug => {
    const matched = products.filter(p => matchProductCategory(p, catSlug));
    console.log(`  ${catSlug.padEnd(30)}: ${matched.length} models`);
  });

  // 5. Strict Verification: Check if any Kit or Shell is matched to modular-homes or prefab-homes
  const kitsInModular = products.filter(p => {
    const isKit = isKitOrShell(p);
    const matched = matchProductCategory(p, 'modular-homes');
    return isKit && matched;
  });

  const kitsInPrefab = products.filter(p => {
    const isKit = isKitOrShell(p);
    const matched = matchProductCategory(p, 'prefab-homes');
    return isKit && matched;
  });

  console.log(`\nStrict Quality Checks:`);
  console.log(`  - Kits/Shells bleeding into Modular Homes: ${kitsInModular.length}`);
  console.log(`  - Kits/Shells bleeding into Prefab Homes: ${kitsInPrefab.length}`);

  // 6. Check for suffix "(Copy)" in titles
  const copyTitles = products.filter(p => /\(copy\)/i.test(p.name || p.title || ''));
  console.log(`  - Models with '(Copy)' in Title: ${copyTitles.length}`);
  copyTitles.forEach(p => console.log(`    * ${p.slug}: ${p.name}`));

  console.log('\n=== AUDIT COMPLETE ===');
}

audit().catch(console.error);
