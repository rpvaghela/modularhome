import * as fs from 'fs';
import * as path from 'path';

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

console.log('=== Total Products:', catalog.length, '===');

// Let's inspect all products whose category is "Modular Homes" or "Prefab Homes"
console.log('\n--- Products with category: "Modular Homes" ---');
catalog.filter((p: any) => p.category === 'Modular Homes').forEach((p: any) => {
  console.log(` - ${p.name} | Cat: ${p.category} | Price: $${p.startingPrice}`);
});

console.log('\n--- Products with category: "Prefab Homes" ---');
catalog.filter((p: any) => p.category === 'Prefab Homes').forEach((p: any) => {
  console.log(` - ${p.name} | Cat: ${p.category} | Price: $${p.startingPrice}`);
});
