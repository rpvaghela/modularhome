import 'dotenv/config';
import { fetchSupabaseProducts, getPublicProducts } from '../src/lib/publicData';
import { isSteelHouseKit } from '../src/utils/categoryMatching';

const dbProducts = await fetchSupabaseProducts();
const products = dbProducts.length > 0 ? dbProducts : await getPublicProducts();
const steel = products.filter(isSteelHouseKit);
const counts = steel.reduce<Record<string, number>>((a, p) => {
  const k = String(p.sqft || 0);
  a[k] = (a[k] || 0) + 1;
  return a;
}, {});

console.log(JSON.stringify({
  totalPublic: products.length,
  source: dbProducts.length > 0 ? 'supabase' : 'merged-fallback',
  renderedSteel: steel.length,
  sqftCounts: Object.fromEntries(Object.entries(counts).sort(([, a], [, b]) => b - a)),
  sample: steel.map(p => ({ slug: p.slug, name: p.name, sqft: p.sqft, price: p.startingPrice, category: p.category })).slice(0, 25),
}, null, 2));
