const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const missingHandles = [
  'the-nordic-rancher-3-bed-2-bath-or-2-bed-2-bath-option',
  'the-nordic-raven-modular-cabin-2-bed-2-bath-or-3-bed-2-bath-options',
  'the-grand-canyon-modular-cabin-4-bed-2-bath-or-2-bed',
  'the-ocean-breeze-modular-cabin-2-bed-2-bath-or-3-bed-2-bath-options',
  'the-coastal-charm-retreat-new-model',
  'the-snow-white-cottage',
  'black-beauty-shipping-container-home',
  'the-backyard-bungalow-studio',
  'the-all-american-5-bedroom-3-bath',
  'double-decker-shipping-container-home-2-bed-1-bath',
  'the-clifford-modular-cabin',
  'the-evergreen-modular-cabin-2-bed-2-bath-or-3-bed-2-bath-options',
  'the-sunshine-modular-cabin',
  'the-bumble-bee-modular-cabin-2-bed-2-bath-or-3-bed-2-bath-options'
];

console.log('===============================================================');
console.log('VALIDATION: 14 MOVE-IN-READY PRODUCTS ADDED TO MODULAR HOMES');
console.log('===============================================================');

let passedAll = true;

missingHandles.forEach((handle, i) => {
  const p = catalog.find(item => item.slug === handle);
  if (!p) {
    console.error(`[FAIL] Product not found in catalog: ${handle}`);
    passedAll = false;
    return;
  }

  const checks = [
    { name: 'Has Name/Title', pass: Boolean(p.name && p.title) },
    { name: 'Has Valid Starting Price (> 0)', pass: Boolean(p.startingPrice && p.startingPrice > 0) },
    { name: 'Has SqFt (> 0)', pass: Boolean(p.sqft && p.sqft > 0) },
    { name: 'Has Bedrooms', pass: p.bedrooms !== undefined && p.bedrooms >= 0 },
    { name: 'Has Bathrooms', pass: p.bathrooms !== undefined && p.bathrooms >= 0 },
    { name: 'Has Dimensions', pass: Boolean(p.dimensions && p.dimensions.length > 0) },
    { name: 'Has Primary Image', pass: Boolean(p.primaryImage && p.primaryImage.startsWith('http')) },
    { name: 'Has Gallery (> 0 images)', pass: Boolean(p.gallery && p.gallery.length > 0) },
    { name: 'Has Description', pass: Boolean(p.description && p.description.length > 50) },
    { name: 'Category is Modular Homes', pass: p.category === 'Modular Homes' },
    { name: 'Collections includes modular-homes', pass: p.collections && p.collections.includes('modular-homes') },
    { name: 'Collections includes prefab-homes', pass: p.collections && p.collections.includes('prefab-homes') }
  ];

  const failed = checks.filter(c => !c.pass);
  if (failed.length > 0) {
    console.error(`[FAIL] ${p.name} failed checks: ${failed.map(f => f.name).join(', ')}`);
    passedAll = false;
  } else {
    console.log(`[PASS] ${i + 1}. ${p.name}`);
    console.log(`       Price: $${p.startingPrice.toLocaleString()} | SqFt: ${p.sqft.toLocaleString()} | Beds: ${p.bedrooms} | Baths: ${p.bathrooms} | Dims: ${p.dimensions}`);
    console.log(`       Primary Image: ${p.primaryImage}`);
    console.log(`       Gallery: ${p.gallery.length} images | Variants: ${p.product_variants.length}`);
  }
});

if (passedAll) {
  console.log('\nSUCCESS: All 14 Move-In-Ready products passed 100% of data verification checks!');
} else {
  console.error('\nFAIL: Some products failed verification.');
  process.exit(1);
}
