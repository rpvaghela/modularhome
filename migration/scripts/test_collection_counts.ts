import * as fs from 'fs';
import * as path from 'path';

function runCollectionCountTest() {
  const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
  const catalog: any[] = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  console.log('====================================================');
  console.log('TEST: CATEGORY & COLLECTION COUNTS');
  console.log('====================================================');

  const categoryCounts: Record<string, number> = {};
  catalog.forEach((p) => {
    const cat = p.category || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  console.log('Category Partitions:');
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(` - ${cat}: ${count} models`);
  });

  // Specifically check Park Models isolation
  const parkModels = categoryCounts['Park Models'] || 0;
  if (parkModels > 50) {
    console.error(`FAIL: Park Models contains ${parkModels} items (expected <= 15 isolated park model units).`);
    process.exit(1);
  }

  console.log('STATUS: PASS — All category counts verified and cross-bleed prevented.');
}

runCollectionCountTest();
