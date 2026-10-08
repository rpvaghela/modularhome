const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../src/data/all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

catalog.forEach(p => {
  if (p.slug === 'el-chapo-muchacho') {
    p.sqft = 560;
    p.dimensions = '14x40 to 14x60 ft';
    p.tagline = '560 – 840 Sq Ft • 1-3 Bed • 1-2 Bath Amish Built Cabin';
  }
});

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log('Refined specific models in catalog.');
