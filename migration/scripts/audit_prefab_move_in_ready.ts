import * as fs from 'fs';
import { matchProductCategory, isAmishModularTurnkeyCabin } from '../../src/utils/categoryMatching';
import { getPublicProducts, getPublicCollectionBySlug } from '../../src/lib/publicData';

async function auditPrefab() {
  const rawLive = fs.readFileSync('C:\\Users\\cheta\\.gemini\\antigravity-ide\\brain\\2e2038b1-6944-41a3-9787-b01da6fc14e7\\.system_generated\\steps\\710\\content.md', 'utf8');
  const jsonStart = rawLive.indexOf('{');
  const liveProducts = JSON.parse(rawLive.slice(jsonStart)).products;

  console.log(`Live Move-In-Ready products count: ${liveProducts.length}`);

  const allProducts = await getPublicProducts();
  console.log(`Total public products: ${allProducts.length}`);

  const prefabMatches = allProducts.filter(p => matchProductCategory(p, 'prefab-homes'));
  console.log(`Total products matching Prefab Homes: ${prefabMatches.length}`);

  const modularMatches = allProducts.filter(p => matchProductCategory(p, 'modular-homes'));
  console.log(`Total products matching Modular Homes: ${modularMatches.length}`);

  // Check each of the 52 live Move-In-Ready products
  let inPrefabCount = 0;
  let notInPrefab: any[] = [];

  liveProducts.forEach((lp: any) => {
    const found = allProducts.find(p => p.slug === lp.handle);
    if (!found) {
      notInPrefab.push({ handle: lp.handle, reason: 'NOT IN CATALOG' });
    } else {
      const isPrefab = matchProductCategory(found, 'prefab-homes');
      if (isPrefab) {
        inPrefabCount++;
      } else {
        notInPrefab.push({ handle: lp.handle, name: found.name, category: found.category, reason: 'FILTERED OUT' });
      }
    }
  });

  console.log(`\nMove-In-Ready products in Prefab Homes: ${inPrefabCount} / ${liveProducts.length}`);
  if (notInPrefab.length > 0) {
    console.log('Not in Prefab Homes:', notInPrefab);
  } else {
    console.log('ALL 52 Move-In-Ready products appear in Prefab Homes!');
  }
}

auditPrefab().catch(console.error);
