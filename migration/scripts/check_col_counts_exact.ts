import { getPublicCollectionBySlug } from '../../src/lib/publicData';

async function check() {
  const mod = await getPublicCollectionBySlug('modular-homes');
  const pref = await getPublicCollectionBySlug('prefab-homes');
  console.log(`getPublicCollectionBySlug('modular-homes') count: ${mod?.products?.length}`);
  console.log(`getPublicCollectionBySlug('prefab-homes') count: ${pref?.products?.length}`);
}

check().catch(console.error);
