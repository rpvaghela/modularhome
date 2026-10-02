import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { query } from "@/lib/db";
import { logActivity } from "@/lib/activityLog";
import {
  saveCustomPage,
  deleteCustomPage,
  readPagesFromStore,
  getPageSections,
  isUuidString,
} from "@/lib/pageStore";
import { formatCmsPage, getPageUrl } from "@/lib/publicData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id).trim();
    let foundPage: any = null;

    // 1. Direct PostgreSQL query
    try {
      const pgRes = await query(
        `SELECT * FROM pages WHERE id::text = $1 OR LOWER(slug) = LOWER($1) OR LOWER(handle) = LOWER($1) LIMIT 1;`,
        [cleanId]
      );
      if (pgRes && pgRes.rows && pgRes.rows.length > 0) {
        foundPage = pgRes.rows[0];
      }
    } catch (pgErr) {
      console.warn("Postgres fetch page error:", pgErr);
    }

    // 2. Fallback to Supabase query
    if (!foundPage && isSupabaseConfigured()) {
      try {
        const isUuid = isUuidString(cleanId);
        const orFilter = isUuid
          ? `id.eq.${cleanId},handle.eq.${cleanId},slug.eq.${cleanId}`
          : `handle.eq.${cleanId},slug.eq.${cleanId}`;
        const { data: pages, error } = await supabaseAdmin.from("pages").select("*").or(orFilter);

        if (!error && pages && pages.length > 0) {
          foundPage = pages[0];
        }
      } catch (sbErr) {
        console.warn("Supabase fetch page error:", sbErr);
      }
    }

    // 3. Fallback to local store
    if (!foundPage) {
      const localPages = readPagesFromStore();
      const local = localPages.find(
        (p) =>
          p.id === cleanId ||
          p.slug === cleanId ||
          p.slug?.toLowerCase() === cleanId.toLowerCase()
      );
      if (local) {
        foundPage = local;
      }
    }

    if (!foundPage) {
      return NextResponse.json(
        { success: false, error: { message: "Page not found in database.", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const formatted = formatCmsPage(foundPage);
    const sections = getPageSections(formatted.id || formatted.slug || cleanId);
    const publicUrl = getPageUrl(formatted);

    const result = {
      ...formatted,
      publicUrl,
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
    const cleanId = decodeURIComponent(id).trim();
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: { message: "Page title cannot be empty.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const rawSlug = body.slug || body.handle || cleanId;
    const cleanSlug = String(rawSlug)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!cleanSlug || cleanSlug === "undefined" || cleanSlug === "null") {
      return NextResponse.json(
        { success: false, error: { message: "Valid URL slug is required.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    // Check slug uniqueness against other pages
    try {
      const dupCheck = await query(
        `SELECT id, title FROM pages WHERE (LOWER(slug) = $1 OR LOWER(handle) = $1) AND id::text != $2 LIMIT 1;`,
        [cleanSlug, cleanId]
      );
      if (dupCheck && dupCheck.rows && dupCheck.rows.length > 0) {
        return NextResponse.json(
          { success: false, error: { message: `URL slug "/${cleanSlug}" is already used by page "${dupCheck.rows[0].title}". Please choose a unique slug.`, code: "DUPLICATE_SLUG" } },
          { status: 400 }
        );
      }
    } catch {}

    const pageStatus = body.status === "DRAFT" || body.status === "ARCHIVED" ? body.status : "PUBLISHED";
    const now = new Date().toISOString();

    // Fetch existing page to get original slug for revalidation and preserve createdAt
    let oldSlug = cleanSlug;
    let existingCreatedAt = now;
    try {
      const oldRes = await query(`SELECT slug, handle, created_at FROM pages WHERE id::text = $1 OR LOWER(slug) = LOWER($1) OR LOWER(handle) = LOWER($1) LIMIT 1;`, [cleanId]);
      if (oldRes && oldRes.rows && oldRes.rows[0]) {
        oldSlug = oldRes.rows[0].slug || oldRes.rows[0].handle || cleanSlug;
        existingCreatedAt = oldRes.rows[0].created_at || now;
      }
    } catch {}

    const title = body.title.trim();
    const subtitle = body.subtitle ? body.subtitle.trim() : null;
    const content = body.content !== undefined ? body.content : (body.body_html || "");
    const featuredImage = body.featuredImage || body.featured_image || null;
    const imageAlt = body.imageAlt || body.image_alt || `${title} banner`;
    const seoTitle = body.seoTitle || body.seo_title || `${title} | ModularHome.com`;
    const metaDescription = body.metaDescription || body.meta_description || subtitle || null;
    const canonicalUrl = body.canonicalUrl || body.canonical_url || null;
    const ogTitle = body.ogTitle || body.og_title || seoTitle;
    const ogDescription = body.ogDescription || body.og_description || metaDescription;
    const ogImage = body.ogImage || body.og_image || featuredImage;
    const robots = body.robots || "index, follow";
    const publishedAt = pageStatus === "PUBLISHED" ? (body.publishedAt || body.published_at || now) : null;

    let updatedDbPage: any = null;

    // 1. Authoritative Update in PostgreSQL
    try {
      const updateSql = `
        UPDATE pages SET
          title = $1,
          slug = $2,
          handle = $2,
          subtitle = $3,
          body_html = $4,
          published = $5,
          status = $6,
          featured_image = $7,
          image_alt = $8,
          seo_title = $9,
          seo_description = $10,
          canonical_url = $11,
          og_title = $12,
          og_description = $13,
          og_image = $14,
          robots = $15,
          published_at = $16,
          updated_at = $17
        WHERE id::text = $18 OR LOWER(slug) = LOWER($18) OR LOWER(handle) = LOWER($18)
        RETURNING *;
      `;
      const res = await query(updateSql, [
        title,
        cleanSlug,
        subtitle,
        content,
        pageStatus !== "DRAFT",
        pageStatus,
        featuredImage,
        imageAlt,
        seoTitle,
        metaDescription,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImage,
        robots,
        publishedAt,
        now,
        cleanId,
      ]);

      if (res && res.rows && res.rows.length > 0) {
        updatedDbPage = formatCmsPage(res.rows[0]);
      }
    } catch (pgErr: any) {
      console.error("Postgres update page error:", pgErr);
      return NextResponse.json(
        { success: false, error: { message: `Database update error: ${pgErr.message}`, code: "DB_UPDATE_ERROR" } },
        { status: 500 }
      );
    }

    // 2. Supabase fallback update if needed
    if (!updatedDbPage && isSupabaseConfigured()) {
      try {
        const sbPayload = {
          title,
          slug: cleanSlug,
          handle: cleanSlug,
          subtitle,
          body_html: content,
          published: pageStatus !== "DRAFT",
          status: pageStatus,
          featured_image: featuredImage,
          image_alt: imageAlt,
          seo_title: seoTitle,
          seo_description: metaDescription,
          canonical_url: canonicalUrl,
          og_title: ogTitle,
          og_description: ogDescription,
          og_image: ogImage,
          robots,
          published_at: publishedAt,
          updated_at: now,
        };

        const { data, error } = isUuidString(cleanId)
          ? await supabaseAdmin.from("pages").update(sbPayload).eq("id", cleanId).select().single()
          : await supabaseAdmin.from("pages").update(sbPayload).eq("slug", cleanId).select().single();

        if (!error && data) {
          updatedDbPage = formatCmsPage(data);
        }
      } catch (sbErr) {
        console.warn("Supabase update error:", sbErr);
      }
    }

    // 3. Secondary local store update
    const localSaved = saveCustomPage({
      id: updatedDbPage?.id || cleanId,
      title,
      slug: cleanSlug,
      subtitle: subtitle || "",
      content,
      status: pageStatus,
      featuredImage: featuredImage || "",
      imageAlt: imageAlt || "",
      seoTitle,
      metaDescription: metaDescription || "",
      canonicalUrl: canonicalUrl || "",
      ogTitle,
      ogDescription,
      ogImage: ogImage || "",
      robots,
      publishedAt: publishedAt || now,
      createdAt: existingCreatedAt,
    });

    const finalPage = updatedDbPage || localSaved;

    // 4. Auto-create 301 Redirect if Slug Changed
    if (oldSlug && oldSlug.toLowerCase() !== cleanSlug.toLowerCase()) {
      const fromPath = `/${oldSlug.toLowerCase()}`;
      const toPath = `/${cleanSlug.toLowerCase()}`;
      try {
        await query(
          `INSERT INTO redirects (from_path, to_path, http_status, source, is_active, updated_at)
           VALUES ($1, $2, 301, 'PAGE_SLUG_RENAME', true, NOW())
           ON CONFLICT (from_path) DO UPDATE SET to_path = $2, is_active = true, updated_at = NOW();`,
          [fromPath, toPath]
        );
      } catch (pgErr) {}

      if (isSupabaseConfigured()) {
        try {
          await supabaseAdmin.from("redirects").upsert(
            {
              from_path: fromPath,
              to_path: toPath,
              http_status: 301,
              source: "PAGE_SLUG_RENAME",
            },
            { onConflict: "from_path" }
          );
        } catch (sbErr) {}
      }
    }

    // 5. Next.js Path Revalidation
    try {
      revalidatePath(`/${cleanSlug}`);
      revalidatePath(`/pages/${cleanSlug}`);
      if (oldSlug && oldSlug !== cleanSlug) {
        revalidatePath(`/${oldSlug}`);
        revalidatePath(`/pages/${oldSlug}`);
      }
      revalidatePath(`/admin/pages`);
      revalidatePath(`/admin/pages/${cleanId}`);
    } catch {}

    // 5. Audit log
    await logActivity(
      authResult,
      "PAGE_UPDATE",
      "PAGE",
      finalPage.id || cleanId,
      `Updated landing page "${title}" (/${cleanSlug})`,
      { id: cleanId, title, slug: cleanSlug, status: pageStatus }
    );

    return NextResponse.json({
      success: true,
      data: {
        ...finalPage,
        publicUrl: `/${cleanSlug}`,
      },
      message: "Page saved successfully to database.",
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
    const cleanId = decodeURIComponent(id).trim();

    // 1. Delete associated sections and page from PostgreSQL
    try {
      await query(`DELETE FROM page_sections WHERE page_id::text = $1;`, [cleanId]);
      await query(`DELETE FROM pages WHERE id::text = $1 OR LOWER(slug) = LOWER($1) OR LOWER(handle) = LOWER($1);`, [cleanId]);
    } catch (pgErr) {
      console.warn("Postgres delete error:", pgErr);
    }

    // 2. Delete from Supabase
    if (isSupabaseConfigured()) {
      try {
        if (isUuidString(cleanId)) {
          await supabaseAdmin.from("page_sections").delete().eq("page_id", cleanId);
          await supabaseAdmin.from("pages").delete().eq("id", cleanId);
        } else {
          await supabaseAdmin.from("pages").delete().eq("slug", cleanId);
        }
      } catch (sbErr) {}
    }

    // 3. Delete from local store
    deleteCustomPage(cleanId);

    // 4. Revalidate cache
    try {
      revalidatePath(`/${cleanId}`);
      revalidatePath(`/pages/${cleanId}`);
      revalidatePath("/admin/pages");
    } catch {}

    await logActivity(
      authResult,
      "PAGE_DELETE",
      "PAGE",
      cleanId,
      `Deleted landing page (${cleanId})`,
      { id: cleanId }
    );

    return NextResponse.json({
      success: true,
      message: "Page deleted successfully from database.",
    });
  } catch (error: any) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to delete page.", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
