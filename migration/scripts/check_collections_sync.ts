import { getPublicCollections } from '../../src/lib/publicData';
import { supabaseAdmin, isSupabaseConfigured } from '../../src/lib/supabase';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function check() {
  const publicCols = await getPublicCollections();
  console.log('Public collections on website count:', publicCols.length);

  const localFileCols = JSON.parse(fs.readFileSync('./src/data/all_collections.json', 'utf8'));
  console.log('all_collections.json count:', Array.isArray(localFileCols) ? localFileCols.length : Object.keys(localFileCols).length);

  if (isSupabaseConfigured()) {
    const { count: dbColCount, data: dbCols } = await supabaseAdmin.from('collections').select('id, handle, title', { count: 'exact' });
    console.log('DB collections count:', dbColCount);

    const dbHandles = new Set(dbCols?.map((c: any) => c.handle?.toLowerCase()));
    const missingFromDb = publicCols.filter(c => !dbHandles.has((c.slug || c.handle || '').toLowerCase()));
    console.log('Collections in public website but missing from DB count:', missingFromDb.length);
    missingFromDb.forEach(c => console.log('  -', c.slug || c.handle, '->', c.name || c.title));

    const publicSlugs = new Set(publicCols.map(c => (c.slug || c.handle || '').toLowerCase()));
    const inDbNotPublic = dbCols?.filter((c: any) => !publicSlugs.has((c.handle || '').toLowerCase())) || [];
    console.log('Collections in DB but not on public website count:', inDbNotPublic.length);
  }
}
check().catch(console.error);
