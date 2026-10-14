import { supabaseAdmin } from '../../src/lib/supabase';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function check() {
  const catalog = JSON.parse(fs.readFileSync('./src/data/all_products_catalog.json', 'utf8'));
  const catalogHandles = new Set(catalog.map((c: any) => c.handle));

  const { data: dbProducts } = await supabaseAdmin.from('products').select('id, handle, title, status, product_type, created_at');
  
  const notInCatalog = dbProducts?.filter(p => !catalogHandles.has(p.handle)) || [];
  console.log('Total DB products not in catalog:', notInCatalog.length);
  
  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};
  notInCatalog.forEach(p => {
    byStatus[p.status || 'null'] = (byStatus[p.status || 'null'] || 0) + 1;
    byType[p.product_type || 'Unknown'] = (byType[p.product_type || 'Unknown'] || 0) + 1;
  });
  console.log('By Status:', byStatus);
  console.log('By Type:', byType);
  console.log('List of titles and handles:');
  const dbHandles = new Set(dbProducts?.map(p => p.handle));
  const missingFromDb = catalog.filter((p: any) => !dbHandles.has(p.handle));
  console.log('Count in catalog missing from DB:', missingFromDb.length);
  missingFromDb.forEach((p: any) => console.log(`[CATALOG ONLY] ${p.handle} -> ${p.title} (${p.category || p.product_type})`));
}
check().catch(console.error);
