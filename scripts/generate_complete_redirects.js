const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/all_products_catalog.json'), 'utf8'));

function getCategorySlug(category, title = '', slug = '') {
  const cat = (category || '').toLowerCase();
  const t = (title || '').toLowerCase();
  const s = (slug || '').toLowerCase();
  const text = `${t} ${s} ${cat}`;

  if (text.includes('barndo') || text.includes('barndominium')) return 'barndominiums';
  if (
    text.includes('cabin') ||
    text.includes('log home') ||
    text.includes('muchacho') ||
    text.includes('sparrow') ||
    text.includes('bertha') ||
    text.includes('amish')
  ) return 'cabins';
  if (text.includes('tiny home') || text.includes('tiny house') || s.includes('tiny')) return 'tiny-homes';
  if (text.includes('park model') || text.includes('rv')) return 'park-models';
  if (text.includes('adu') || text.includes('granny pod') || text.includes('in-law')) return 'adus';
  if (text.includes('a-frame') || text.includes('aframe')) return 'a-frame-homes';
  if (text.includes('house kit') || text.includes('sip panel') || text.includes('home kit')) return 'house-kits';
  if (text.includes('commercial') || text.includes('warehouse')) return 'commercial-buildings';
  if (text.includes('custom home')) return 'custom-homes';
  return 'modular-homes';
}

const redirects = {};

// 1. Existing Shopify Redirects
const existingPath = path.join(__dirname, '../src/data/shopify_redirects.json');
if (fs.existsSync(existingPath)) {
  const existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  Object.assign(redirects, existing);
}

// 2. Handover CSV Redirects
const csvPath = path.join(__dirname, '../ModularHome_SEO_Blog_Developer_Handover/data/existing_redirects.csv');
if (fs.existsSync(csvPath)) {
  const lines = fs.readFileSync(csvPath, 'utf8').split('\n');
  lines.slice(1).forEach(line => {
    const parts = line.split(',');
    if (parts.length >= 3) {
      const p = parts[1].trim();
      const t = parts[2].trim();
      if (p && t) {
        redirects[p.toLowerCase()] = t;
      }
    }
  });
}

// 3. Product Category Redirects for all 756+ models
catalog.forEach(p => {
  const slug = (p.slug || p.handle || '').toLowerCase().trim();
  if (!slug || slug.includes('<')) return;

  const catSlug = getCategorySlug(p.category, p.title || p.name, slug);
  const target = `/${catSlug}/${slug}`;

  // Redirect legacy /products/[slug] -> /[category]/[slug]
  redirects[`/products/${slug}`] = target;

  // Redirect /buildings/[slug] -> /[category]/[slug]
  redirects[`/buildings/${slug}`] = target;

  // Redirect /models/[slug] -> /[category]/[slug]
  redirects[`/models/${slug}`] = target;
});

fs.writeFileSync(existingPath, JSON.stringify(redirects, null, 2), 'utf8');
console.log(`Generated ${Object.keys(redirects).length} comprehensive 301 redirects in ${existingPath}`);

// Test user examples
const sampleTests = [
  '/buildings/el-chapo-muchacho',
  '/buildings/the-farmhouse-charm-new-model',
  '/buildings/the-grey-haven-barndo-house-kit',
  '/products/el-chapo-muchacho',
  '/products/the-sparrow-cabin-luxury-log-home-kit'
];

console.log('\n=== Testing Key Redirect Paths ===');
sampleTests.forEach(testPath => {
  console.log(`${testPath}  -->  ${redirects[testPath.toLowerCase()] || 'NO MATCH'}`);
});
