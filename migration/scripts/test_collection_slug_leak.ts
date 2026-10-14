import { getPublicCollectionBySlug, getPublicProducts } from '../../src/lib/publicData';
import { matchProductCategory } from '../../src/utils/categoryMatching';

async function testCollections() {
  const allProds = await getPublicProducts();
  console.log(`Total public products: ${allProds.length}`);

  const modularCol = await getPublicCollectionBySlug('modular-homes');
  console.log(`\ngetPublicCollectionBySlug('modular-homes') returned ${modularCol?.products?.length} products!`);
  modularCol?.products?.forEach((p: any) => console.log(`  - ${p.slug} | ${p.name}`));

  const prefabCol = await getPublicCollectionBySlug('prefab-homes');
  console.log(`\ngetPublicCollectionBySlug('prefab-homes') returned ${prefabCol?.products?.length} products!`);
  prefabCol?.products?.forEach((p: any) => console.log(`  - ${p.slug} | ${p.name}`));

  const modularMatched = allProds.filter(p => matchProductCategory(p, 'modular-homes'));
  console.log(`\nmatchProductCategory(p, 'modular-homes') matched: ${modularMatched.length} products`);

  const prefabMatched = allProds.filter(p => matchProductCategory(p, 'prefab-homes'));
  console.log(`matchProductCategory(p, 'prefab-homes') matched: ${prefabMatched.length} products`);
}

testCollections().catch(console.error);
