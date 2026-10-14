import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getPublicProducts, getPublicCollections, clearPublicDataCache } from "@/lib/publicData";

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    clearPublicDataCache();
    const publicProducts = await getPublicProducts();
    const publicCollections = await getPublicCollections();

    let insertedModels = 0;
    let dbModelsCount = 0;
    let dbCollectionsCount = 0;

    if (isSupabaseConfigured()) {
      // 1. Sync Products
      const { data: dbProducts } = await supabaseAdmin.from("products").select("id, handle");
      const dbHandleMap = new Map<string, string>();
      dbProducts?.forEach((p: any) => {
        if (p.handle) dbHandleMap.set(p.handle.toLowerCase().trim(), p.id);
      });
      dbModelsCount = dbHandleMap.size;

      const missingProducts = publicProducts.filter(
        (p) => !dbHandleMap.has(p.slug.toLowerCase().trim())
      );

      for (const p of missingProducts) {
        try {
          const handle = p.slug.toLowerCase().trim();
          const title = p.name || (p as any).title || handle;
          const productType = p.category || "Modular Homes";
          const desc = p.description || `<p>${p.tagline || title}</p>`;
          const price = p.startingPrice || 89000;
          const primaryImg =
            p.primaryImage ||
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80";

          const { data: newProd, error: insertErr } = await supabaseAdmin
            .from("products")
            .insert({
              handle,
              title,
              description_html: desc,
              vendor: "ModularHome",
              product_type: productType,
              status: "active",
              seo_title: `${title} | ModularHome`,
              seo_description: p.tagline || `Explore the ${title} modular home model.`,
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select("id")
            .single();

          if (insertErr || !newProd) continue;

          await supabaseAdmin.from("product_variants").insert({
            product_id: newProd.id,
            title: "Default Title",
            price: price,
            sku: `SKU-${handle.slice(0, 20).toUpperCase()}`,
            position: 1,
          });

          const images = Array.from(new Set([primaryImg, ...(p.gallery || [])].filter(Boolean)));
          const mediaRows = images.slice(0, 10).map((url, idx) => ({
            product_id: newProd.id,
            source_url: url,
            position: idx + 1,
          }));

          if (mediaRows.length > 0) {
            await supabaseAdmin.from("product_media").insert(mediaRows);
          }

          insertedModels++;
        } catch (e) {
          console.warn(`Failed to sync product ${p.slug}:`, e);
        }
      }

      // Refresh final counts
      const { count: finalProdCount } = await supabaseAdmin
        .from("products")
        .select("*", { count: "exact", head: true });
      const { count: finalColCount } = await supabaseAdmin
        .from("collections")
        .select("*", { count: "exact", head: true });

      dbModelsCount = finalProdCount || dbModelsCount + insertedModels;
      dbCollectionsCount = finalColCount || publicCollections.length;
    }

    clearPublicDataCache();

    return NextResponse.json({
      success: true,
      message: "Catalog successfully synchronized with admin panel and database.",
      data: {
        totalStorefrontModels: publicProducts.length,
        totalStorefrontCollections: publicCollections.length,
        totalDbModels: dbModelsCount,
        totalDbCollections: dbCollectionsCount,
        insertedModels,
      },
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Sync failed", code: "SYNC_ERROR" } },
      { status: 500 }
    );
  }
}
