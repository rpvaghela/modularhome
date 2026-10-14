import { getPublicProducts, getLocalProducts } from '../../src/lib/publicData';
import { supabaseAdmin, isSupabaseConfigured } from '../../src/lib/supabase';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

export async function syncModelsToSupabase() {
  console.log('=== STARTING SYNC OF STOREFRONT MODELS TO SUPABASE ===\n');

  if (!isSupabaseConfigured()) {
    console.log('Supabase is not configured. Skipping DB insert.');
    return { success: false, message: 'Supabase is not configured' };
  }

  const catalogProducts = await getPublicProducts();
  console.log(`Total public catalog models to verify: ${catalogProducts.length}`);

  // Fetch all existing handles from DB
  const { data: dbProducts, error } = await supabaseAdmin.from('products').select('id, handle');
  if (error) {
    console.error('Error fetching DB products:', error);
    return { success: false, error };
  }

  const dbHandleMap = new Map<string, string>();
  dbProducts?.forEach((p: any) => {
    if (p.handle) dbHandleMap.set(p.handle.toLowerCase().trim(), p.id);
  });
  console.log(`Existing products in Supabase: ${dbHandleMap.size}`);

  const missing = catalogProducts.filter(p => !dbHandleMap.has(p.slug.toLowerCase().trim()));
  console.log(`Models in catalog missing from Supabase: ${missing.length}\n`);

  let insertedCount = 0;
  for (const p of missing) {
    try {
      const handle = p.slug.toLowerCase().trim();
      const title = p.name || p.title || handle;
      const productType = p.category || 'Modular Homes';
      const desc = p.description || `<p>${p.tagline || title}</p>`;
      const price = p.startingPrice || 89000;
      const primaryImg = p.primaryImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';

      const { data: newProd, error: insertErr } = await supabaseAdmin
        .from('products')
        .insert({
          handle,
          title,
          description_html: desc,
          vendor: 'ModularHome',
          product_type: productType,
          status: 'active',
          seo_title: `${title} | ModularHome`,
          seo_description: p.tagline || `Explore the ${title} modular home model.`,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (insertErr || !newProd) {
        console.error(`Failed to insert product ${handle}:`, insertErr?.message);
        continue;
      }

      const prodId = newProd.id;

      // Insert primary variant
      await supabaseAdmin.from('product_variants').insert({
        product_id: prodId,
        title: 'Default Title',
        price: price,
        sku: `SKU-${handle.slice(0, 20).toUpperCase()}`,
        position: 1,
      });

      // Insert media
      const images = Array.from(new Set([primaryImg, ...(p.gallery || [])].filter(Boolean)));
      const mediaRows = images.slice(0, 10).map((url, idx) => ({
        product_id: prodId,
        source_url: url,
        position: idx + 1,
      }));

      if (mediaRows.length > 0) {
        await supabaseAdmin.from('product_media').insert(mediaRows);
      }

      console.log(`✓ Inserted model: ${handle} (ID: ${prodId})`);
      insertedCount++;
    } catch (err: any) {
      console.error(`Error syncing model ${p.slug}:`, err.message);
    }
  }

  console.log(`\n=== SYNC COMPLETE: ${insertedCount} new models synced to Supabase ===`);
  return { success: true, insertedCount, totalChecked: catalogProducts.length };
}

if (require.main === module) {
  syncModelsToSupabase().catch(console.error);
}
