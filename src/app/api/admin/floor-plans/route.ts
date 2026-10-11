import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { clearPublicDataCache } from "@/lib/publicData";
import { readFloorPlansFromStore, saveCustomFloorPlan } from "@/lib/floorPlanStore";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let customPlans: any[] = [];
    try {
      customPlans = readFloorPlansFromStore();
    } catch {}

    let dbPlans: any[] = [];
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin
          .from("floor_plans")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (category && category !== "ALL") {
          query = query.eq("category", category);
        }
        if (status && status !== "ALL") {
          query = query.eq("status", status);
        }

        const { data, error } = await query;
        if (!error && data) {
          dbPlans = data;
        }
      } catch (e) {
        console.warn("Supabase query error on floor_plans:", e);
      }
    }

    const merged: any[] = [];
    const seenIds = new Set<string>();

    // 1. Custom floor plans from store
    for (const p of customPlans) {
      const key = (p.id || p.slug || "").toLowerCase().trim();
      if (!seenIds.has(key)) {
        seenIds.add(key);
        if (p.slug) seenIds.add(p.slug.toLowerCase().trim());
        merged.push(p);
      }
    }

    // 2. Database plans from Supabase
    for (const p of dbPlans) {
      const key = (p.id || p.slug || "").toLowerCase().trim();
      if (!seenIds.has(key)) {
        seenIds.add(key);
        if (p.slug) seenIds.add(p.slug.toLowerCase().trim());
        merged.push(p);
      }
    }

    let filtered = [...merged];

    if (category && category !== "ALL") {
      filtered = filtered.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase());
    }
    if (status && status !== "ALL") {
      filtered = filtered.filter((p) => (p.status || "").toLowerCase() === status.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter((p) =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.slug || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error: any) {
    console.error("Error fetching floor plans:", error);
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const {
      title,
      slug,
      tagline,
      description,
      price,
      salePrice,
      previewImage,
      gallery,
      filePath,
      fileFormat,
      category,
      bedrooms,
      bathrooms,
      squareFeet,
      dimensions,
      stories,
      includedItems,
      features,
      specs,
      status,
      isFeatured,
      displayOrder,
      seoTitle,
      metaDescription,
    } = body;

    if (!title || !slug || !price) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Title, slug, and price are required.", code: "VALIDATION_ERROR" },
        },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-");

    const parseJson = (val: any, fallback: any) => {
      if (!val) return fallback;
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return fallback;
        }
      }
      return val;
    };

    // 1. Save to local store
    const localSaved = saveCustomFloorPlan({
      title,
      slug: cleanSlug,
      tagline: tagline || null,
      description: description || null,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      previewImage:
        previewImage ||
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop",
      gallery: parseJson(gallery, []),
      filePath: filePath || null,
      fileFormat: fileFormat || "PDF + CAD (DWG)",
      category: category || "ADUs",
      bedrooms: Number(bedrooms) || 2,
      bathrooms: Number(bathrooms) || 1,
      squareFeet: Number(squareFeet) || 800,
      dimensions: dimensions || "24x36 ft",
      stories: Number(stories) || 1,
      includedItems: parseJson(includedItems, [
        "Full Construction Blueprints",
        "Structural Steel Framing & Truss Layouts",
        "Electrical & Plumbing Schematics",
      ]),
      features: parseJson(features, []),
      specs: parseJson(specs, {}),
      status: status || "PUBLISHED",
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      displayOrder: Number(displayOrder) || 0,
      seoTitle: seoTitle || `${title} Blueprint Package | ModularHome`,
      metaDescription: metaDescription || description?.slice(0, 160) || null,
    });

    // 2. Also save to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const newPlan = {
          title,
          slug: cleanSlug,
          tagline: tagline || null,
          description: description || null,
          price: Number(price),
          sale_price: salePrice ? Number(salePrice) : null,
          preview_image:
            previewImage ||
            "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop",
          gallery: parseJson(gallery, []),
          file_path: filePath || null,
          file_format: fileFormat || "PDF + CAD (DWG)",
          category: category || "ADUs",
          bedrooms: Number(bedrooms) || 2,
          bathrooms: Number(bathrooms) || 1,
          square_feet: Number(squareFeet) || 800,
          dimensions: dimensions || "24x36 ft",
          stories: Number(stories) || 1,
          included_items: parseJson(includedItems, [
            "Full Construction Blueprints",
            "Structural Steel Framing & Truss Layouts",
            "Electrical & Plumbing Schematics",
          ]),
          features: parseJson(features, []),
          specs: parseJson(specs, {}),
          status: status || "PUBLISHED",
          is_featured: isFeatured !== undefined ? isFeatured : false,
          display_order: Number(displayOrder) || 0,
          seo_title: seoTitle || `${title} Blueprint Package | ModularHome`,
          meta_description: metaDescription || description?.slice(0, 160) || null,
        };

        await supabaseAdmin.from("floor_plans").upsert(newPlan, { onConflict: "slug" });
      } catch (sbErr) {
        console.warn("Supabase floor plan insert note:", sbErr);
      }
    }

    clearPublicDataCache();

    return NextResponse.json({
      success: true,
      data: localSaved,
      message: "Floor plan blueprint kit created successfully.",
    });
  } catch (error: any) {
    console.error("Error creating floor plan:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: error?.message || "Failed to create floor plan.", code: "CREATE_ERROR" },
      },
      { status: 500 }
    );
  }
}
