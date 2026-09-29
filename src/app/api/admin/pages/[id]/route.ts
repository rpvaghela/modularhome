import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { logActivity } from "@/lib/activityLog";
import {
  saveCustomPage,
  deleteCustomPage,
  readPagesFromStore,
  getPageSections,
  isUuidString,
} from "@/lib/pageStore";
import { formatCmsPage } from "@/lib/publicData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    let foundPage: any = null;

    if (isSupabaseConfigured()) {
      try {
        const isUuid = isUuidString(id);
        const orFilter = isUuid ? `id.eq.${id},handle.eq.${id},slug.eq.${id}` : `handle.eq.${id},slug.eq.${id}`;
        const { data: pages, error } = await supabaseAdmin
          .from("pages")
          .select("*")
          .or(orFilter);

        if (!error && pages && pages.length > 0) {
          foundPage = pages[0];
        }
      } catch {}
    }

    if (!foundPage) {
      const localPages = readPagesFromStore();
      const local = localPages.find((p) => p.id === id || p.slug === id || p.slug?.toLowerCase() === id.toLowerCase());
      if (local) {
        foundPage = local;
      }
    }

    if (!foundPage) {
      return NextResponse.json(
        { success: false, error: { message: "Page not found.", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const formatted = formatCmsPage(foundPage);
    const sections = getPageSections(formatted.id || formatted.slug || id);

    const result = {
      ...formatted,
      sections,
      sectionCount: sections.length,
      _count: { sections: sections.length },
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error fetching page details:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch page.", code: "DB_ERROR" } },
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

    const cleanSlug = (body.slug || body.handle || id)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const pageStatus = body.status || "PUBLISHED";
    const now = new Date().toISOString();

    const updatePayload: Record<string, any> = {
      updated_at: now,
    };

    if (body.title !== undefined) updatePayload.title = body.title;
    if (cleanSlug) {
      updatePayload.slug = cleanSlug;
      updatePayload.handle = cleanSlug;
    }
    if (body.subtitle !== undefined) updatePayload.subtitle = body.subtitle;
    if (body.content !== undefined || body.body_html !== undefined) {
      updatePayload.body_html = body.content || body.body_html || "";
    }
    if (body.status !== undefined) {
      updatePayload.status = pageStatus;
      updatePayload.published = pageStatus !== "DRAFT";
    }
    if (body.featuredImage !== undefined || body.featured_image !== undefined) {
      updatePayload.featured_image = body.featuredImage || body.featured_image || null;
    }
    if (body.seoTitle !== undefined || body.seo_title !== undefined) {
      updatePayload.seo_title = body.seoTitle || body.seo_title || `${body.title} | ModularHome.com`;
    }
    if (body.metaDescription !== undefined || body.meta_description !== undefined) {
      updatePayload.seo_description = body.metaDescription || body.meta_description || null;
    }
    if (body.canonicalUrl !== undefined || body.canonical_url !== undefined) {
      updatePayload.canonical_url = body.canonicalUrl || body.canonical_url || null;
    }

    // 1. Save locally
    const savedLocal = saveCustomPage({
      id,
      title: body.title || "Custom Page",
      slug: cleanSlug,
      subtitle: body.subtitle,
      content: body.content || body.body_html,
      status: pageStatus,
      featuredImage: body.featuredImage || body.featured_image,
      seoTitle: body.seoTitle || body.seo_title,
      metaDescription: body.metaDescription || body.meta_description,
      canonicalUrl: body.canonicalUrl || body.canonical_url,
    });

    // 2. Save in Supabase if UUID
    let updatedPage = savedLocal;
    if (isSupabaseConfigured() && isUuidString(id)) {
      try {
        const { data, error } = await supabaseAdmin
          .from("pages")
          .update(updatePayload)
          .eq("id", id)
          .select()
          .single();

        if (!error && data) {
          updatedPage = formatCmsPage(data);
        }
      } catch (sbErr) {
        console.warn("Supabase update warning, updated locally:", sbErr);
      }
    }

    await logActivity(
      authResult,
      "PAGE_UPDATE",
      "PAGE",
      id,
      `Updated landing page "${body.title || id}" (/${cleanSlug})`,
      { id, title: body.title, slug: cleanSlug, status: pageStatus }
    );

    return NextResponse.json({
      success: true,
      data: updatedPage,
      message: "Page updated successfully.",
    });
  } catch (error: any) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to update page.", code: "UPDATE_ERROR" } },
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

    // 1. Delete locally
    deleteCustomPage(id);

    // 2. Delete from Supabase if UUID
    if (isSupabaseConfigured() && isUuidString(id)) {
      try {
        await supabaseAdmin.from("page_sections").delete().eq("page_id", id);
        await supabaseAdmin.from("pages").delete().eq("id", id);
      } catch (err) {}
    }

    await logActivity(
      authResult,
      "PAGE_DELETE",
      "PAGE",
      id,
      `Deleted landing page (${id})`,
      { id }
    );

    return NextResponse.json({
      success: true,
      message: "Page deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to delete page.", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
