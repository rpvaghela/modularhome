import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { clearPublicDataCache, getCategoryFallbackImage, normalizeImageUrl } from "@/lib/publicData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: { message: "Database not configured.", code: "NOT_CONFIGURED" } },
        { status: 503 }
      );
    }

    const { data: collection, error } = await supabaseAdmin
      .from("collections")
      .select(`
        *,
        product_collections (
          product_id
        )
      `)
      .or(`id.eq.${id},handle.eq.${id}`)
      .single();

    if (error || !collection) {
      return NextResponse.json(
        { success: false, error: { message: "Collection not found.", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const pIds = collection.product_collections
      ? collection.product_collections.map((pc: any) => pc.product_id)
      : [];

    const title = collection.title || collection.name || "";
    const handle = collection.handle || collection.slug || "";
    const fallbackImg = getCategoryFallbackImage(title, title, handle);
    const isGeneric = (u?: string | null) =>
      !u ||
      u.includes("unsplash.com") ||
      u.includes("placeholder") ||
      u.includes("newmodularlogo") ||
      u.includes("finallogo") ||
      u === "undefined" ||
      u === "null";

    const formatted = {
      ...collection,
      name: title,
      title: title,
      slug: handle,
      handle: handle,
      description: collection.description_html || collection.description || "",
      description_html: collection.description_html || collection.description || "",
      image: isGeneric(collection.image || collection.banner_image)
        ? fallbackImg
        : normalizeImageUrl(collection.image || collection.banner_image, fallbackImg),
      bannerImage: isGeneric(collection.banner_image || collection.image)
        ? fallbackImg
        : normalizeImageUrl(collection.banner_image || collection.image, fallbackImg),
      status: collection.published !== false ? "PUBLISHED" : "DRAFT",
      published: collection.published !== false,
      productIds: pIds,
      productCount: pIds.length,
    };

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch collection.", code: "DB_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const body = await request.json();

    const rawSlug = body.slug || body.handle;
    const cleanSlug = rawSlug
      ? rawSlug.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-")
      : undefined;

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined || body.name !== undefined) {
      updates.title = body.title || body.name;
    }
    if (cleanSlug !== undefined) {
      updates.handle = cleanSlug;
    }
    if (body.description_html !== undefined || body.description !== undefined) {
      updates.description_html = body.description_html || body.description;
    }
    if (body.seoTitle !== undefined || body.seo_title !== undefined) {
      updates.seo_title = body.seoTitle || body.seo_title;
    }
    if (body.metaDescription !== undefined || body.seo_description !== undefined) {
      updates.seo_description = body.metaDescription || body.seo_description;
    }
    if (body.published !== undefined) {
      updates.published = Boolean(body.published);
    } else if (body.status !== undefined) {
      updates.published = body.status === "PUBLISHED";
    }
    if (body.image !== undefined) {
      updates.image = body.image;
    }
    if (body.bannerImage !== undefined || body.banner_image !== undefined) {
      updates.banner_image = body.bannerImage || body.banner_image;
    }

    if (isSupabaseConfigured()) {
      const { data: updated, error } = await supabaseAdmin
        .from("collections")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      if (Array.isArray(body.productIds)) {
        await supabaseAdmin.from("product_collections").delete().eq("collection_id", id);
        if (body.productIds.length > 0) {
          const mappings = body.productIds.map((pId: string) => ({
            collection_id: id,
            product_id: pId,
          }));
          await supabaseAdmin.from("product_collections").insert(mappings);
        }
      }

      clearPublicDataCache();

      return NextResponse.json({
        success: true,
        data: {
          ...updated,
          name: updated.title,
          slug: updated.handle,
          status: updated.published ? "PUBLISHED" : "DRAFT",
          productIds: body.productIds || [],
          productCount: (body.productIds || []).length,
        },
        message: "Collection updated successfully.",
      });
    }

    clearPublicDataCache();

    return NextResponse.json({
      success: true,
      data: { id, ...updates },
      message: "Collection updated successfully (offline fallback).",
    });
  } catch (error: any) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to update collection.", code: "UPDATE_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;

    if (isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from("collections").delete().eq("id", id);
      if (error) throw error;
    }

    clearPublicDataCache();

    return NextResponse.json({
      success: true,
      message: "Collection deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to delete collection.", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
