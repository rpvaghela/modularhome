import redirectsData from '../../src/data/shopify_redirects.json';
import catalog from '../../src/data/all_products_catalog.json';

const redirects = redirectsData as Record<string, string>;

// 1. Verify 0 Meadow Ridge products in all_products_catalog.json
const mrInCatalog = catalog.filter((p: any) => {
  const text = `${p.name} ${p.slug} ${p.title || ''}`.toLowerCase();
  return (text.includes('meadow') && text.includes('ridge')) || text.includes('meadow-brook-adu');
});

console.log(`Meadow Ridge products remaining in catalog: ${mrInCatalog.length} (MUST BE 0)`);

// 2. Test specific URLs
const testUrls = [
  // Client's explicitly affected URL:
  '/adus/the-meadow-ridge-adu-cabin-series-georgia-pricing',
  '/adus/the-meadow-ridge-adu-cabin-series-georgia-pricing/',
  // Other state pricing under /adus/
  '/adus/the-meadow-ridge-adu-cabin-series-california-pricing',
  '/adus/the-meadow-ridge-adu-cabin-series-texas-pricing',
  '/adus/the-meadow-brook-adu-cabin-series',
  // Historical /products/ URLs:
  '/products/the-meadow-ridge-adu-cabin-series-georgia-pricing',
  '/products/the-meadow-ridge-adu-cabin-series-georgia-pricing/',
  '/products/the-meadow-brook-adu-cabin-series',
  '/products/the-meadow-brook-adu-cabin-series/',
  // Historical /cabins/ URLs:
  '/cabins/the-meadow-ridge-adu-cabin-series-georgia-pricing',
  '/cabins/the-meadow-ridge-adu-cabin-series-georgia-pricing/',
  '/cabins/the-meadow-brook-adu-cabin-series',
];

console.log('\nTesting Meadow Ridge 301 Redirect targets:');
let allPass = true;
testUrls.forEach((url) => {
  const normalized = url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
  const lower = normalized.toLowerCase();
  
  // Exact lookup as performed in middleware.ts
  const dest = redirects[url.toLowerCase()] || redirects[lower] || redirects[normalized];
  console.log(`  ${url} -> ${dest}`);
  if (dest !== '/adus') {
    allPass = false;
    console.error(`  FAIL: expected /adus, got ${dest}`);
  }
});

// 3. Verify unrelated Meadow products are NOT redirected to /adus
const unrelated = [
  '/products/meadow-mist-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit',
  '/products/meadowlark-cottage-house-kit-home-kit',
  '/products/daisy-meadow-cottage-house-kit-home-kit',
  '/products/golden-meadows-house-kit-home-kit',
  '/products/meadow-breeze-house-kit-home-kit',
];

console.log('\nVerifying unrelated Meadow products are preserved:');
unrelated.forEach((url) => {
  const dest = redirects[url.toLowerCase()];
  console.log(`  ${url} -> ${dest}`);
  if (dest === '/adus') {
    console.error(`  ERROR: ${url} was incorrectly redirected to /adus!`);
    allPass = false;
  }
});

if (allPass && mrInCatalog.length === 0) {
  console.log('\nVerification complete: 100% SUCCESS');
} else {
  console.error('\nVerification FAILED');
  process.exit(1);
}
