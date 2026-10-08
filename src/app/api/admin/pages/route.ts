import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { query } from "@/lib/db";
import { logActivity } from "@/lib/activityLog";
import {
  saveCustomPage,
  readPagesFromStore,
  getPageSectionCounts,
} from "@/lib/pageStore";
import { formatCmsPage, getPageUrl, clearPublicDataCache } from "@/lib/publicData";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase().trim();

    let dbPages: any[] = [];
    const dbSectionCounts: Record<string, number> = {};

    // 1. Try PostgreSQL pool first
    try {
      const pgRes = await query(`SELECT * FROM pages ORDER BY created_at DESC;`);
      if (pgRes && pgRes.rows && pgRes.rows.length > 0) {
        dbPages = pgRes.rows;
      }
    } catch (pgErr) {
      console.warn("Postgres fetch admin pages error:", pgErr);
    }

    // 2. Fallback / Supabase query
    if (dbPages.length === 0 && isSupabaseConfigured()) {
      try {
        let q = supabaseAdmin.from("pages").select("*").order("created_at", { ascending: false });
        const { data, error } = await q;
        if (!error && data) {
          dbPages = data;
        }
      } catch (sbErr) {
        console.warn("Supabase fetch pages warning:", sbErr);
      }
    }

    // 3. Fetch section counts
    try {
      const secRes = await query(`SELECT page_id, count(*)::int as count FROM page_sections GROUP BY page_id;`);
      if (secRes && secRes.rows && secRes.rows.length > 0) {
        for (const row of secRes.rows) {
          if (row.page_id) {
            dbSectionCounts[row.page_id] = Number(row.count) || 0;
          }
        }
      }
    } catch {}

    if (Object.keys(dbSectionCounts).length === 0 && isSupabaseConfigured()) {
      try {
        const { data: secData, error: secErr } = await supabaseAdmin
          .from("page_sections")
          .select("page_id");
        if (!secErr && secData) {
          for (const row of secData) {
            if (row.page_id) {
              dbSectionCounts[row.page_id] = (dbSectionCounts[row.page_id] || 0) + 1;
            }
          }
        }
      } catch (sbSecErr) {
        console.warn("Supabase fetch section counts warning:", sbSecErr);
      }
    }

    // Standardize all database pages through formatCmsPage
    const normalizedDbPages = dbPages.map((p) => formatCmsPage(p));

    // Merge with local persistent store
    const localPages = readPagesFromStore();
    const localSectionCounts = getPageSectionCounts();
    const existingSlugs = new Set(normalizedDbPages.map((p) => p.slug.toLowerCase()));
    const merged: any[] = [...normalizedDbPages];

    for (const lp of localPages) {
      const normalizedLp = formatCmsPage(lp);
      if (!existingSlugs.has(normalizedLp.slug.toLowerCase())) {
        merged.push(normalizedLp);
        existingSlugs.add(normalizedLp.slug.toLowerCase());
      }
    }

    // Filter by status if specified
    let filtered = merged;
    if (status && status !== "ALL") {
      filtered = filtered.filter((p) => p.status === status);
    }

    // Apply optional search filter
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(search) ||
          p.slug?.toLowerCase().includes(search) ||
          p.subtitle?.toLowerCase().includes(search)
      );
    }

    // Attach accurate section count and safe URL to every page
    const formattedPages = filtered.map((page) => {
      const pageId = page.id;
      const slug = page.slug;

      const dbCount = (pageId && dbSectionCounts[pageId]) || 0;
      const localCount =
        (pageId && localSectionCounts[pageId]) ||
        (slug && localSectionCounts[slug]) ||
        0;
      const inlineCount = Array.isArray(page.sections) ? page.sections.length : 0;
      const finalCount = Math.max(dbCount, localCount, inlineCount);
      const safeUrl = getPageUrl(page);

      return {
        ...page,
        id: pageId,
        _id: pageId,
        publicUrl: safeUrl,
        sectionCount: finalCount,
        _count: {
          sections: finalCount,
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedPages,
    });
  } catch (error: any) {
    console.error("Error fetching admin pages:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch pages from database.", code: "DB_ERROR" } },
      { status: 500 }
    );
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
      subtitle,
      content,
      status,
      featuredImage,
      featured_image,
      imageAlt,
      image_alt,
      seoTitle,
      seo_title,
      metaDescription,
      meta_description,
      canonicalUrl,
      canonical_url,
      ogTitle,
      og_title,
      ogDescription,
      og_description,
      ogImage,
      og_image,
      robots,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: { message: "Page title is required.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    if (!slug || !slug.trim()) {
      return NextResponse.json(
        { success: false, error: { message: "Page URL slug is required.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!cleanSlug || cleanSlug === "undefined" || cleanSlug === "null") {
      return NextResponse.json(
        { success: false, error: { message: "Invalid URL slug format.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    // Check for reserved internal system routes
    const reservedRoutes = [
      "api", "admin", "checkout", "login", "signup", "verify-email", "upload-floor-plan",
      "quote", "floor-plans", "buildings", "models", "videos", "resources", "sitemap.xml", "robots.txt"
    ];
    if (reservedRoutes.includes(cleanSlug)) {
      return NextResponse.json(
        { success: false, error: { message: `"${cleanSlug}" is a reserved system route. Please choose a different slug.`, code: "RESERVED_SLUG" } },
        { status: 400 }
      );
    }

    // Check slug uniqueness in database
    try {
      const existing = await query(`SELECT id, title FROM pages WHERE LOWER(slug) = $1 OR LOWER(handle) = $1 LIMIT 1;`, [cleanSlug]);
      if (existing && existing.rows && existing.rows.length > 0) {
        return NextResponse.json(
          { success: false, error: { message: `A page with URL slug "/${cleanSlug}" already exists ("${existing.rows[0].title}"). Please choose a unique slug.`, code: "DUPLICATE_SLUG" } },
          { status: 400 }
        );
      }
    } catch {}

    const pageStatus = status === "DRAFT" || status === "ARCHIVED" ? status : "PUBLISHED";
    const now = new Date().toISOString();

    const insertPayload = {
      title: title.trim(),
      handle: cleanSlug,
      slug: cleanSlug,
      subtitle: subtitle ? subtitle.trim() : null,
      body_html: content || "",
      published: pageStatus !== "DRAFT",
      status: pageStatus,
      featured_image: featuredImage || featured_image || null,
      image_alt: imageAlt || image_alt || `${title.trim()} banner`,
      seo_title: seoTitle || seo_title || `${title.trim()} | ModularHome.com`,
      seo_description: metaDescription || meta_description || subtitle || null,
      canonical_url: canonicalUrl || canonical_url || null,
      og_title: ogTitle || og_title || seoTitle || `${title.trim()} | ModularHome.com`,
      og_description: ogDescription || og_description || metaDescription || subtitle || null,
      og_image: ogImage || og_image || featuredImage || null,
      robots: robots || "index, follow",
      published_at: pageStatus === "PUBLISHED" ? now : null,
      created_at: now,
      updated_at: now,
    };

    // 1. Authoritative insert into PostgreSQL / Supabase
    let savedPage: any = null;
    try {
      const insertSql = `
        INSERT INTO pages (
          handle, slug, title, subtitle, body_html, published, status,
          featured_image, image_alt, seo_title, seo_description, canonical_url,
          og_title, og_description, og_image, robots, published_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *;
      `;
      const res = await query(insertSql, [
        insertPayload.handle,
        insertPayload.slug,
        insertPayload.title,
        insertPayload.subtitle,
        insertPayload.body_html,
        insertPayload.published,
        insertPayload.status,
        insertPayload.featured_image,
        insertPayload.image_alt,
        insertPayload.seo_title,
        insertPayload.seo_description,
        insertPayload.canonical_url,
        insertPayload.og_title,
        insertPayload.og_description,
        insertPayload.og_image,
        insertPayload.robots,
        insertPayload.published_at,
        insertPayload.created_at,
        insertPayload.updated_at,
      ]);

      if (res && res.rows && res.rows.length > 0) {
        savedPage = formatCmsPage(res.rows[0]);
      }
    } catch (pgErr: any) {
      console.error("Postgres insert page error:", pgErr);
      return NextResponse.json(
        { success: false, error: { message: `Database error creating page: ${pgErr.message}`, code: "DB_INSERT_ERROR" } },
        { status: 500 }
      );
    }

    if (!savedPage && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin.from("pages").insert(insertPayload).select().single();
        if (error) {
          return NextResponse.json(
            { success: false, error: { message: error.message || "Failed to save page to database.", code: "DB_INSERT_ERROR" } },
            { status: 500 }
          );
        }
        if (data) {
          savedPage = formatCmsPage(data);
        }
      } catch (sbErr: any) {
        return NextResponse.json(
          { success: false, error: { message: sbErr.message || "Database insert error.", code: "DB_INSERT_ERROR" } },
          { status: 500 }
        );
      }
    }

    // 2. Secondary sync to local store
    saveCustomPage({
      id: savedPage?.id,
      title: insertPayload.title,
      slug: cleanSlug,
      subtitle: insertPayload.subtitle || "",
      content: insertPayload.body_html || "",
      status: pageStatus,
      featuredImage: insertPayload.featured_image || "",
      imageAlt: insertPayload.image_alt || "",
      seoTitle: insertPayload.seo_title || "",
      metaDescription: insertPayload.seo_description || "",
      canonicalUrl: insertPayload.canonical_url || "",
      ogTitle: insertPayload.og_title || "",
      ogDescription: insertPayload.og_description || "",
      ogImage: insertPayload.og_image || "",
      robots: insertPayload.robots,
      publishedAt: insertPayload.published_at || now,
    });

    // 3. Revalidate Next.js cache and public data cache
    try {
      revalidatePath(`/${cleanSlug}`);
      revalidatePath(`/pages/${cleanSlug}`);
      revalidatePath(`/admin/pages`);
      clearPublicDataCache();
    } catch {}

    // 4. Audit log
    await logActivity(
      authResult,
      "PAGE_CREATE",
      "PAGE",
      savedPage?.id || cleanSlug,
      `Created landing page "${title}" (/${cleanSlug})`,
      { title, slug: cleanSlug, status: pageStatus }
    );

    return NextResponse.json({
      success: true,
      data: {
        ...savedPage,
        publicUrl: `/${cleanSlug}`,
        sectionCount: 0,
        _count: { sections: 0 },
      },
      message: "Page saved successfully to database.",
    });
  } catch (error: any) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to create page.", code: "CREATE_ERROR" } },
      { status: 500 }
    );
  }
}
