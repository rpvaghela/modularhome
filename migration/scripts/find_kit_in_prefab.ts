import { getPublicProducts } from '../../src/lib/publicData';
import { matchProductCategory, isKitOrShell } from '../../src/utils/categoryMatching';

async function check() {
  const products = await getPublicProducts();
  const kitsInPrefab = products.filter(p => isKitOrShell(p) && matchProductCategory(p, 'prefab-homes'));
  console.log('Kits in Prefab count:', kitsInPrefab.length);
  kitsInPrefab.forEach(p => console.log(p.slug, '->', p.name, '|| category:', p.category));
}
check().catch(console.error);
