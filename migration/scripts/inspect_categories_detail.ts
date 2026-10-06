import * as fs from 'fs';
import * as path from 'path';

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const byCat: Record<string, any[]> = {};
catalog.forEach((p: any) => {
  const cat = p.category || 'Uncategorized';
  if (!byCat[cat]) byCat[cat] = [];
  byCat[cat].push(p);
});

Object.keys(byCat).forEach(cat => {
  console.log(`\n=== Category: ${cat} (${byCat[cat].length} items) ===`);
  byCat[cat].slice(0, 10).forEach((p: any) => {
    console.log(`  - ${p.name} ($${p.startingPrice || 0}, ${p.sqft || 0} sqft)`);
  });
});
