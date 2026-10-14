import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { clearPublicDataCache, getLocalProducts } from "@/lib/publicData";
import { readProductsFromStore, saveCustomProduct, StoredProduct } from "@/lib/productStore";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isPublishedParam = searchParams.get("isPublished");
    const search = searchParams.get("search");

    let dbProducts: any[] = [];

    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin
          .from("products")
          .select(`
            id,
            handle,
            title,
            description_html,
            vendor,
            product_type,
            status,
            seo_title,
            seo_description,
            source_id,
            published_at,
            created_at,
            updated_at,
            product_variants (
              price
            ),
            product_media (
              source_url,
              position
            ),
            product_collections (
              collection_id
            )
          `)
          .order("created_at", { ascending: false });

        if (category && category !== "ALL") {
          const stem = category.toLowerCase().replace(/s$/, "").trim();
          query = query.or(`product_type.ilike.%${stem}%,product_type.ilike.%${category}%`);
        }

        if (isPublishedParam !== null && isPublishedParam !== undefined && isPublishedParam !== "") {
          if (isPublishedParam === "true") {
            query = query.or("status.eq.active,status.is.null");
          } else {
            query = query.eq("status", "draft");
          }
        }

        if (search && search.trim()) {
          const s = search.trim();
          query = query.or(`title.ilike.%${s}%,handle.ilike.%${s}%,product_type.ilike.%${s}%`);
        }

        const { data, error } = await query;
        if (!error && data) {
          dbProducts = data;
        }
      } catch (err) {
        console.warn("Supabase query warning:", err);
      }
    }

    // Read custom local products
    const localProducts = readProductsFromStore();
    const seenSlugs = new Set<string>();
    const merged: any[] = [];

    // 1. Custom stored products take highest priority
    for (const p of localProducts) {
      const slug = (p.slug || p.handle || "").toLowerCase();
      if (!seenSlugs.has(slug)) {
        seenSlugs.add(slug);
        merged.push({
          id: p.id,
          _id: p.id,
          name: p.name || p.title || "",
          title: p.name || p.title || "",
          slug: p.slug || p.handle || "",
          handle: p.slug || p.handle || "",
          category: p.category || p.product_type || "Modular Homes",
          product_type: p.category || p.product_type || "Modular Homes",
          vendor: "ModularHome",
          description: p.description || p.description_html || "",
          description_html: p.description_html || p.description || "",
          status: p.status || "active",
          isPublished: p.status !== "draft",
          primaryImage: p.primaryImage || p.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
          image: p.primaryImage || p.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
          startingPrice: p.startingPrice || 89000,
          sqft: p.sqft || 0,
          bedrooms: p.bedrooms ?? 0,
          bathrooms: p.bathrooms ?? 0,
          stories: p.stories || 1,
          dimensions: p.dimensions || "",
          tags: p.tags || ["Custom"],
          features: p.features || [],
          specs: p.specs || [],
          architecturalStyle: p.architecturalStyle || "Modern Homes",
          series: p.series || "Essential Series",
          tagline: p.tagline || "",
          collectionIds: p.collectionIds || [],
          created_at: p.createdAt || p.created_at || new Date().toISOString(),
          updated_at: p.updatedAt || p.updated_at || new Date().toISOString(),
        });
      }
    }

    // 2. Add Supabase products
    for (const p of dbProducts) {
      const slug = (p.handle || p.slug || "").toLowerCase();
      if (!seenSlugs.has(slug)) {
        seenSlugs.add(slug);
        let primaryImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80";
        if (p.product_media && Array.isArray(p.product_media) && p.product_media.length > 0) {
          const sortedMedia = [...p.product_media].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
          primaryImg = sortedMedia[0].source_url || primaryImg;
        }

        let startingPrice = 89000;
        if (p.product_variants && Array.isArray(p.product_variants) && p.product_variants.length > 0) {
          const prices = p.product_variants
            .map((v: any) => Number(v.price))
            .filter((pr: number) => !isNaN(pr) && pr > 0);
          if (prices.length > 0) {
            startingPrice = Math.min(...prices);
          }
        }

        const collectionIds = p.product_collections
          ? p.product_collections.map((pc: any) => pc.collection_id)
          : [];

        merged.push({
          id: p.id,
          _id: p.id,
          name: p.title || p.name || "",
          title: p.title || p.name || "",
          slug: p.handle || p.slug || "",
          handle: p.handle || p.slug || "",
          category: p.product_type || "Modular Homes",
          product_type: p.product_type || "Modular Homes",
          vendor: p.vendor || "ModularHome",
          description: p.description_html || "",
          description_html: p.description_html || "",
          seo_title: p.seo_title,
          seo_description: p.seo_description,
          source_id: p.source_id,
          status: p.status || "active",
          isPublished: p.status !== "draft" && p.status !== "archived",
          primaryImage: primaryImg,
          image: primaryImg,
          startingPrice,
          sqft: p.sqft || 0,
          bedrooms: p.bedrooms ?? 0,
          bathrooms: p.bathrooms ?? 0,
          stories: p.stories || 1,
          dimensions: p.dimensions || "",
          tags: p.tags || [],
          features: p.features || [],
          specs: p.specs || [],
          architecturalStyle: p.architectural_style || "Modern Homes",
          series: p.series || "Essential Series",
          tagline: p.tagline || "",
          collectionIds,
          created_at: p.created_at,
          updated_at: p.updated_at,
        });
      }
    }

    // 3. Guaranteed sync: ensure all models from the live storefront catalog are present
    const catalogProducts = getLocalProducts();
    for (const p of catalogProducts) {
      const slug = (p.slug || "").toLowerCase().trim();
      if (slug && !seenSlugs.has(slug)) {
        seenSlugs.add(slug);
        merged.push({
          id: p.id || slug,
          _id: p.id || slug,
          name: p.name || "",
          title: p.name || "",
          slug: p.slug,
          handle: p.slug,
          category: p.category || "Modular Homes",
          product_type: p.category || "Modular Homes",
          vendor: "ModularHome",
          description: p.description || "",
          description_html: p.description || "",
          status: "active",
          isPublished: true,
          primaryImage: p.primaryImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
          image: p.primaryImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
          startingPrice: p.startingPrice || 89000,
          sqft: p.sqft || 0,
          bedrooms: p.bedrooms ?? 0,
          bathrooms: p.bathrooms ?? 0,
          stories: p.stories || 1,
          dimensions: p.dimensions || "",
          tags: p.tags || [],
          features: p.features || [],
          specs: p.specs || [],
          architecturalStyle: p.architecturalStyle || "Modern Homes",
          series: p.series || "Essential Series",
          tagline: p.tagline || "",
          collectionIds: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    let filtered = merged;
    if (category && category !== "ALL") {
      const stem = category.toLowerCase().replace(/s$/, "").trim();
      filtered = filtered.filter(
        (p) =>
          p.category.toLowerCase().includes(stem) ||
          p.category.toLowerCase().includes(category.toLowerCase()) ||
          category.toLowerCase().includes(p.category.toLowerCase())
      );
    }

    if (isPublishedParam !== null && isPublishedParam !== undefined && isPublishedParam !== "") {
      const wantPublished = isPublishedParam === "true";
      filtered = filtered.filter((p) => p.isPublished === wantPublished);
    }

    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.slug.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s)
      );
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      totalCount: filtered.length,
    });
  } catch (error: any) {
    console.error("Error fetching admin products:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to fetch products.", code: "DB_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const name = body.name || body.title;
    const rawSlug = body.slug || body.handle;

    if (!name || !rawSlug) {
      return NextResponse.json(
        { success: false, error: { message: "Product name/title and slug/handle are required.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const cleanSlug = rawSlug.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-");

    // 1. Save to persistent custom products store first
    const savedLocal = saveCustomProduct({
      name,
      title: name,
      slug: cleanSlug,
      handle: cleanSlug,
      category: body.category || body.product_type || "Modular Homes",
      product_type: body.category || body.product_type || "Modular Homes",
      series: body.series || "Essential Series",
      architecturalStyle: body.architecturalStyle || "Modern Homes",
      tagline: body.tagline || (body.sqft ? `${body.sqft} SQ FT Engineered Home` : ""),
      description: body.description || body.description_html || "",
      description_html: body.description_html || body.description || "",
      startingPrice: Number(body.startingPrice) || 89000,
      sqft: Number(body.sqft) || 0,
      bedrooms: Number(body.bedrooms ?? 0),
      bathrooms: Number(body.bathrooms ?? 0),
      stories: Number(body.stories || 1),
      dimensions: body.dimensions || "",
      primaryImage: body.primaryImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      features: Array.isArray(body.features) ? body.features : [],
      specs: Array.isArray(body.specs) ? body.specs : [],
      tags: Array.isArray(body.tags) ? body.tags : ["Featured"],
      status: body.isPublished === false || body.status === "draft" ? "draft" : "active",
      isPublished: body.isPublished !== false && body.status !== "draft",
      collectionIds: Array.isArray(body.collectionIds) ? body.collectionIds : [],
    });

    // 2. Also insert into Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const newProduct: Record<string, any> = {
          handle: cleanSlug,
          title: name,
          description_html: body.description || body.description_html || null,
          vendor: body.vendor || "ModularHome",
          product_type: body.category || body.product_type || "Modular Homes",
          status: body.isPublished === false || body.status === "draft" ? "draft" : "active",
          seo_title: body.seoTitle || body.seo_title || `${name} | ModularHome`,
          seo_description: body.metaDescription || body.seo_description || (body.description ? body.description.replace(/<[^>]*>?/gm, "").slice(0, 160) : null),
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: prod } = await supabaseAdmin
          .from("products")
          .upsert(newProduct, { onConflict: "handle" })
          .select()
          .single();

        if (prod?.id) {
          try {
            const allMediaUrls = Array.from(
              new Set([body.primaryImage, ...(Array.isArray(body.gallery) ? body.gallery : [])].filter(Boolean))
            );
            if (allMediaUrls.length > 0) {
              const mediaRows = allMediaUrls.map((url, idx) => ({
                product_id: prod.id,
                source_url: url,
                alt_text: name,
                position: idx + 1,
              }));
              await supabaseAdmin.from("product_media").insert(mediaRows);
            }
          } catch {}

          if (body.startingPrice) {
            try {
              await supabaseAdmin.from("product_variants").insert({
                product_id: prod.id,
                title: "Standard Package",
                price: Number(body.startingPrice) || 89000,
                position: 1,
              });
            } catch {}
          }
        }
      } catch (sbErr) {
        console.warn("Supabase product insert note:", sbErr);
      }
    }

    // 3. Clear public catalog cache so model appears immediately
    clearPublicDataCache();

    return NextResponse.json({
      success: true,
      data: savedLocal,
      message: "Home model created successfully and published to live catalog.",
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to create product model.", code: "CREATE_ERROR" } },
      { status: 500 }
    );
  }
}
