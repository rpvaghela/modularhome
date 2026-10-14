import redirectsData from '../../src/data/shopify_redirects.json';

const redirects = redirectsData as Record<string, string>;

const testUrls = [
  '/cabins/the-willow-brook-cabin-louisiana-pricing',
  '/cabins/the-willow-brook-cabin-louisiana-pricing/',
  '/products/the-willow-brook-cabin-louisiana-pricing',
  '/products/the-willow-brook-cabin-louisiana-pricing/',
  '/cabins/the-willow-brook',
  '/cabins/the-willow-brook/',
  '/products/the-willow-brook',
  '/products/the-willow-brook/',
  '/cabins/the-willow-brook-cabin-california-pricing',
  '/products/the-willow-brook-cabin-texas-pricing',
];

console.log('Testing Willow Brook 301 Redirect targets:');
let allPass = true;
testUrls.forEach((url) => {
  const normalized = url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
  const lower = normalized.toLowerCase();
  
  // Exact lookup as performed in middleware.ts
  const dest = redirects[url.toLowerCase()] || redirects[lower] || redirects[normalized];
  console.log(`  ${url} -> ${dest}`);
  if (dest !== '/cabins') {
    allPass = false;
  }
});

console.log(`\nRedirect Test Result: ${allPass ? 'ALL PASSED (100% 301 to /cabins)' : 'FAILURES DETECTED'}`);

// Also verify that unrelated willow products are NOT redirected to /cabins
const unrelated = [
  '/products/willow-creek-cottage-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit',
  '/products/willow-wisp-cottage-house-kit-home-kit',
];

console.log('\nVerifying unrelated Willow products are preserved:');
unrelated.forEach((url) => {
  const dest = redirects[url.toLowerCase()];
  console.log(`  ${url} -> ${dest}`);
  if (dest === '/cabins') {
    console.error(`  ERROR: ${url} was incorrectly redirected to /cabins!`);
    allPass = false;
  }
});

if (allPass) {
  console.log('\nVerification complete: 100% SUCCESS');
} else {
  process.exit(1);
}
