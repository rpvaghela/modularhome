const fs = require('fs');
const path = require('path');

const catalog = JSON.parse(fs.readFileSync('src/data/all_products_catalog.json', 'utf8'));
const redirects = JSON.parse(fs.readFileSync('src/data/shopify_redirects.json', 'utf8'));

// 1. Generate Old vs New URL Comparison CSV
const csvRows = [
  'Source_Type,Old_Shopify_or_Legacy_URL,Canonical_New_Nextjs_URL,HTTP_Status,Category_Mapped'
];

catalog.forEach(p => {
  const slug = p.slug || p.handle;
  const legacyProduct = `/products/${slug}`;
  const legacyBuilding = `/buildings/${slug}`;
  const canonicalUrl = redirects[legacyProduct.toLowerCase()] || `/${(p.category || 'modular-homes').toLowerCase()}/${slug}`;
  
  csvRows.push(`Product,${legacyProduct},${canonicalUrl},301 Permanent Redirect,${p.category}`);
  csvRows.push(`Building_Alias,${legacyBuilding},${canonicalUrl},301 Permanent Redirect,${p.category}`);
});

fs.writeFileSync('migration/reports/URL_MAPPING_COMPARISON.csv', csvRows.join('\n'), 'utf8');
console.log(`Generated migration/reports/URL_MAPPING_COMPARISON.csv with ${csvRows.length - 1} rows.`);
