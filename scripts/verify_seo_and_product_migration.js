const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('  MODULARHOME.COM COMPREHENSIVE SEO & DATA AUDIT    ');
console.log('====================================================\n');

// 1. Check Catalog Data
const catalog = JSON.parse(fs.readFileSync('src/data/all_products_catalog.json', 'utf8'));
console.log(`[PASS] Catalog loaded: ${catalog.length} products`);

// 2. Check Specific Key Products
const sparrow = catalog.find(p => (p.slug || p.handle) === 'the-sparrow-cabin-luxury-log-home-kit');
if (!sparrow) throw new Error('Sparrow Cabin missing');
if (sparrow.sqft !== 6240) throw new Error(`Sparrow Cabin sqft expected 6240, got ${sparrow.sqft}`);
if (sparrow.category !== 'Cabins') throw new Error(`Sparrow Cabin category expected Cabins, got ${sparrow.category}`);
if (sparrow.startingPrice !== 455900) throw new Error(`Sparrow Cabin price expected 455900, got ${sparrow.startingPrice}`);
console.log(`[PASS] The Sparrow Cabin: 6,240 SQ FT | Category: ${sparrow.category} | Price: $${sparrow.startingPrice.toLocaleString()} | Variants: ${sparrow.variants.length}`);

const elChapo = catalog.find(p => (p.slug || p.handle) === 'el-chapo-muchacho');
if (!elChapo) throw new Error('El Chapo missing');
if (elChapo.startingPrice !== 69900) throw new Error(`El Chapo price expected 69900, got ${elChapo.startingPrice}`);
if (elChapo.category !== 'Cabins') throw new Error(`El Chapo category expected Cabins, got ${elChapo.category}`);
if (elChapo.variants.length !== 9) throw new Error(`El Chapo variants expected 9, got ${elChapo.variants.length}`);
console.log(`[PASS] El Chapo Muchacho: ${elChapo.sqft} SQ FT (${elChapo.dimensions}) | Category: ${elChapo.category} | Price: $${elChapo.startingPrice.toLocaleString()} | Variants: ${elChapo.variants.length}`);

const farmhouse = catalog.find(p => (p.slug || p.handle) === 'the-farmhouse-charm-new-model');
if (!farmhouse) throw new Error('Farmhouse Charm missing');
if (farmhouse.sqft !== 1160) throw new Error(`Farmhouse Charm sqft expected 1160, got ${farmhouse.sqft}`);
if (farmhouse.category !== 'Modular Homes') throw new Error(`Farmhouse Charm category expected Modular Homes, got ${farmhouse.category}`);
if (farmhouse.startingPrice !== 219900) throw new Error(`Farmhouse Charm price expected 219900, got ${farmhouse.startingPrice}`);
console.log(`[PASS] The Farmhouse Charm: 1,160 SQ FT | Category: ${farmhouse.category} | Price: $${farmhouse.startingPrice.toLocaleString()} | Variants: ${farmhouse.variants.length}`);

const greyHaven = catalog.find(p => (p.slug || p.handle) === 'the-grey-haven-barndo-house-kit');
if (!greyHaven) throw new Error('Grey Haven missing');
if (greyHaven.sqft !== 4751) throw new Error(`Grey Haven sqft expected 4751, got ${greyHaven.sqft}`);
if (greyHaven.category !== 'Barndominiums') throw new Error(`Grey Haven category expected Barndominiums, got ${greyHaven.category}`);
if (greyHaven.startingPrice !== 522900) throw new Error(`Grey Haven price expected 522900, got ${greyHaven.startingPrice}`);
console.log(`[PASS] The Grey Haven: 4,751 SQ FT | Category: ${greyHaven.category} | Price: $${greyHaven.startingPrice.toLocaleString()} | Variants: ${greyHaven.variants.length}`);

// 3. Check 301 Redirect Mapping
const redirects = JSON.parse(fs.readFileSync('src/data/shopify_redirects.json', 'utf8'));
console.log(`\n[PASS] 301 Redirects indexed: ${Object.keys(redirects).length} rules`);

const requiredRedirects = [
  ['/buildings/el-chapo-muchacho', '/cabins/el-chapo-muchacho'],
  ['/buildings/the-farmhouse-charm-new-model', '/modular-homes/the-farmhouse-charm-new-model'],
  ['/buildings/the-grey-haven-barndo-house-kit', '/barndominiums/the-grey-haven-barndo-house-kit'],
  ['/products/el-chapo-muchacho', '/cabins/el-chapo-muchacho'],
  ['/products/the-farmhouse-charm-new-model', '/modular-homes/the-farmhouse-charm-new-model'],
  ['/products/the-grey-haven-barndo-house-kit', '/barndominiums/the-grey-haven-barndo-house-kit'],
  ['/products/the-sparrow-cabin-luxury-log-home-kit', '/cabins/the-sparrow-cabin-luxury-log-home-kit'],
];

requiredRedirects.forEach(([source, expectedTarget]) => {
  const actualTarget = redirects[source.toLowerCase()];
  if (actualTarget !== expectedTarget) {
    throw new Error(`Redirect mismatch: ${source} expected ${expectedTarget}, got ${actualTarget}`);
  }
  console.log(`[PASS] 301 Rule Verified: ${source} -> ${actualTarget}`);
});

// 4. Check Blog Articles and Custom Pages
const articles = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));
console.log(`\n[PASS] Migrated Blog Articles: ${articles.length} posts`);

const pages = JSON.parse(fs.readFileSync('src/data/custom_pages.json', 'utf8'));
console.log(`[PASS] Custom Pages: ${pages.length} pages`);

console.log('\n====================================================');
console.log('  ALL AUDITS & INTEGRITY CHECKS PASSED (100%)       ');
console.log('====================================================');
