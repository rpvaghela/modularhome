const fs = require('fs');

const collections = JSON.parse(fs.readFileSync('src/data/all_collections.json', 'utf8'));

const prefabCol = collections.find(c => c.handle === 'prefab-homes');
const modularCol = collections.find(c => c.handle === 'modular-homes' || c.handle === 'modular-homes-1');

console.log('--- Prefab Homes in all_collections.json ---');
if (prefabCol) {
  console.log('Title:', prefabCol.title);
  console.log('Product Count:', prefabCol.productCount);
  console.log('productHandles count:', prefabCol.productHandles ? prefabCol.productHandles.length : 0);
  console.log('productIds count:', prefabCol.productIds ? prefabCol.productIds.length : 0);
  console.log('Handles:', prefabCol.productHandles ? prefabCol.productHandles.slice(0, 20) : []);
}

console.log('\n--- Modular Homes in all_collections.json ---');
if (modularCol) {
  console.log('Title:', modularCol.title);
  console.log('Product Count:', modularCol.productCount);
  console.log('productHandles count:', modularCol.productHandles ? modularCol.productHandles.length : 0);
  console.log('productIds count:', modularCol.productIds ? modularCol.productIds.length : 0);
  console.log('Handles:', modularCol.productHandles ? modularCol.productHandles.slice(0, 20) : []);
}
