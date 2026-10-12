import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { clearPublicDataCache } from "@/lib/publicData";
import { saveCustomProduct, deleteCustomProduct } from "@/lib/productStore";

export const dynamic = "force-dynamic";

/**
 * Centralized Multi-Store Product Synchronization Endpoint (Client Requirement #19)
 * Synchronizes product additions, modifications, and deletions between
 * ModularHome.com, PrefabHome.com, and AmishBuiltCabins.com.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Central Sync Token
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    const expectedSecret =
      process.env.CENTRAL_SYNC_SECRET ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "modularhome_central_sync_secret_2026";

    if (!token || token !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized central sync request." },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const { action = "upsert", product, productId, targetWebsites } = payload;

    // Check target website filtering if specified
    if (Array.isArray(targetWebsites) && targetWebsites.length > 0) {
      const isTargeted = targetWebsites.some((site: string) =>
        site.toLowerCase().includes("modularhome")
      );
      if (!isTargeted) {
        return NextResponse.json({
          success: true,
          skipped: true,
          message: "Product excluded for ModularHome.com based on targetWebsites filter.",
        });
      }
    }

    // 2. Handle Deletion
    if (action === "delete") {
      const idToDelete = productId || product?.id || product?.handle;
      if (!idToDelete) {
        return NextResponse.json(
          { success: false, error: "Missing productId for deletion." },
          { status: 400 }
        );
      }

      deleteCustomProduct(idToDelete);

      if (isSupabaseConfigured()) {
        try {
          await supabaseAdmin
            .from("products")
            .delete()
            .or(`id.eq.${idToDelete},handle.eq.${idToDelete}`);
        } catch (dbErr) {
          console.error("Central Sync Supabase delete error:", dbErr);
        }
      }

      clearPublicDataCache();

      return NextResponse.json({
        success: true,
        action: "delete",
        productId: idToDelete,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Handle Upsert (Add / Update)
    if (!product || (!product.title && !product.name)) {
      return NextResponse.json(
        { success: false, error: "Missing product payload for upsert." },
        { status: 400 }
      );
    }

    const handle =
      product.handle ||
      product.slug ||
      (product.title || product.name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const synchronizedRecord = {
      id: product.id || `sync-${handle}`,
      handle,
      slug: handle,
      name: product.name || product.title,
      title: product.title || product.name,
      category: product.category || product.product_type || "Modular Homes",
      product_type: product.product_type || product.category || "Modular Homes",
      series: product.series || "Synchronized Series",
      architecturalStyle: product.architecturalStyle || "Modern Prefab",
      tagline: product.tagline || product.subtitle || "",
      description: product.description || product.description_html || "",
      description_html: product.description_html || product.description || "",
      sqft: Number(product.sqft) || 0,
      bedrooms: Number(product.bedrooms) || 0,
      bathrooms: Number(product.bathrooms) || 0,
      stories: Number(product.stories) || 1,
      startingPrice: Number(product.startingPrice || product.price) || 0,
      primaryImage: product.primaryImage || product.image || "/newmodularlogo.png",
      image: product.image || product.primaryImage || "/newmodularlogo.png",
      gallery: Array.isArray(product.gallery) ? product.gallery : [],
      features: Array.isArray(product.features) ? product.features : [],
      specs: Array.isArray(product.specs) ? product.specs : [],
      tags: Array.isArray(product.tags) ? product.tags : [],
      status: product.status || "ACTIVE",
      isPublished: product.status !== "DRAFT",
      updatedAt: new Date().toISOString(),
      sourceOrigin: product.sourceOrigin || "Central PIM / AmishBuiltCabins / PrefabHome",
    };

    // Save to local cached product store
    saveCustomProduct(synchronizedRecord);

    // Save to Supabase if active
    if (isSupabaseConfigured()) {
      try {
        const { error: upsertErr } = await supabaseAdmin.from("products").upsert({
          handle: synchronizedRecord.handle,
          title: synchronizedRecord.title,
          description_html: synchronizedRecord.description_html,
          product_type: synchronizedRecord.product_type,
          status: synchronizedRecord.status,
          updated_at: synchronizedRecord.updatedAt,
        }, { onConflict: "handle" });

        if (upsertErr) {
          console.warn("Supabase central sync upsert warning:", upsertErr.message);
        }
      } catch (dbErr) {
        console.error("Central Sync database write error:", dbErr);
      }
    }

    // Invalidate client-side and Edge cache
    clearPublicDataCache();

    return NextResponse.json({
      success: true,
      action: "upsert",
      handle: synchronizedRecord.handle,
      title: synchronizedRecord.title,
      timestamp: new Date().toISOString(),
      synchronizedTo: ["ModularHome.com"],
    });
  } catch (error: any) {
    console.error("Central Product Sync API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process central product sync." },
      { status: 500 }
    );
  }
}
