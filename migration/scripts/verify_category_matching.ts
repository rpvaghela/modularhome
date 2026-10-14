import * as fs from 'fs';
import * as path from 'path';
import { matchProductCategory, isAmishModularTurnkeyCabin } from '../../src/utils/categoryMatching';

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

console.log('====================================================');
console.log('AUDIT: CATEGORY MATCHING & TURNKEY CABIN ASSIGNMENT');
console.log('====================================================');

const categories = [
  'Modular Homes',
  'Prefab Homes',
  'Barndominiums',
  'House Kits',
  'Tiny Homes',
  'Park Models',
  'Cabins',
  'Modular Cabins',
  'ADUs & Granny Pods',
  'A-Frames',
  'Commercial Modular Buildings'
];

categories.forEach(cat => {
  const matched = catalog.filter((p: any) => matchProductCategory(p, cat));
  console.log(`${cat.padEnd(30)}: ${matched.length} models`);
});

console.log('\n--- VERIFY AMISH-BUILT MODULAR TURNKEY CABINS ---');
const turnkeyCabins = catalog.filter(isAmishModularTurnkeyCabin);
console.log(`Total Amish-Built Modular Turnkey Cabins: ${turnkeyCabins.length}`);

const inModularHomes = turnkeyCabins.filter(p => matchProductCategory(p, 'Modular Homes'));
const inPrefabHomes = turnkeyCabins.filter(p => matchProductCategory(p, 'Prefab Homes'));
const inModularCabins = turnkeyCabins.filter(p => matchProductCategory(p, 'Modular Cabins'));
const inCabins = turnkeyCabins.filter(p => matchProductCategory(p, 'Cabins'));

console.log(`Matched in Modular Homes: ${inModularHomes.length} / ${turnkeyCabins.length}`);
console.log(`Matched in Prefab Homes : ${inPrefabHomes.length} / ${turnkeyCabins.length}`);
console.log(`Matched in Modular Cabins: ${inModularCabins.length} / ${turnkeyCabins.length}`);
console.log(`Matched in Cabins        : ${inCabins.length} / ${turnkeyCabins.length}`);

// Verify NO kits or shells leaked into Prefab Homes or Modular Homes
const kitsInPrefab = catalog.filter((p: any) => {
  const name = (p.name || '').toLowerCase();
  const slug = (p.slug || '').toLowerCase();
  const isKitOrShell = name.includes('kit') || slug.includes('-kit') || name.includes('shell') || slug.includes('shell');
  return isKitOrShell && matchProductCategory(p, 'Prefab Homes');
});
console.log(`\nKits/Shells in Prefab Homes: ${kitsInPrefab.length} (MUST BE 0)`);

const kitsInModular = catalog.filter((p: any) => {
  const name = (p.name || '').toLowerCase();
  const slug = (p.slug || '').toLowerCase();
  const isKitOrShell = name.includes('kit') || slug.includes('-kit') || name.includes('shell') || slug.includes('shell');
  return isKitOrShell && matchProductCategory(p, 'Modular Homes');
});
console.log(`Kits/Shells in Modular Homes: ${kitsInModular.length} (MUST BE 0)`);

if (inModularHomes.length !== turnkeyCabins.length || inPrefabHomes.length !== turnkeyCabins.length || kitsInPrefab.length > 0 || kitsInModular.length > 0) {
  console.error('FAIL: Verification checks did not pass!');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All Amish-Built Modular Turnkey Cabins correctly assigned to Modular Homes & Prefab Homes!');
}
