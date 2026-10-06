import * as fs from 'fs';
import * as path from 'path';
import { matchProductCategory } from '../../src/utils/categoryMatching';

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const categories = [
  'Modular Homes',
  'Prefab Homes',
  'Barndominiums',
  'House Kits',
  'Tiny Homes',
  'Park Models',
  'Cabins',
  'ADUs & Granny Pods',
  'A-Frames',
  'Commercial Buildings',
  'Commercial'
];

console.log('--- Product Matching Counts per Category ---');
categories.forEach(cat => {
  const count = catalog.filter((p: any) => matchProductCategory(p, cat)).length;
  console.log(`${cat}: ${count} available`);
});
