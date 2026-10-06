import * as fs from 'fs';
import * as path from 'path';
import { matchProductCategory } from '../../src/utils/categoryMatching';

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const modularMatched = catalog.filter((p: any) => matchProductCategory(p, 'Modular Homes'));

console.log('Total matched as Modular Homes:', modularMatched.length);
modularMatched.forEach((p: any) => {
  console.log(` - [${p.category}] ${p.name}`);
});
