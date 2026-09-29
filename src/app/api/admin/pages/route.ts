import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { logActivity } from "@/lib/activityLog";
import {
  saveCustomPage,
  readPagesFromStore,
  getPageSectionCounts,
  getPageSections,
} from "@/lib/pageStore";
import { formatCmsPage } from "@/lib/publicData";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.toLowerCase().trim();

    let dbPages: any[] = [];
    const dbSectionCounts: Record<string, number> = {};

    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin
          .from("pages")
          .select("*")
          .order("created_at", { ascending: false });

        if (status && status !== "ALL") {
          if (status === "PUBLISHED") {
            query = query.or("status.eq.PUBLISHED,published.eq.true");
          } else if (status === "DRAFT") {
            query = query.or("status.eq.DRAFT,published.eq.false");
          } else {
            query = query.eq("status", status);
          }
        }

        const { data, error } = await query;
        if (!error && data) {
          dbPages = data;
        }

        // Also fetch Supabase page sections count
        const { data: dbSecs } = await supabaseAdmin
          .from("page_sections")
          .select("id, page_id");

        if (dbSecs) {
          for (const s of dbSecs) {
            if (s.page_id) {
              dbSectionCounts[s.page_id] = (dbSectionCounts[s.page_id] || 0) + 1;
            }
          }
        }
      } catch (dbErr) {
        console.warn("Supabase fetch pages warning:", dbErr);
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
        if (!status || status === "ALL" || normalizedLp.status === status) {
          merged.push(normalizedLp);
          existingSlugs.add(normalizedLp.slug.toLowerCase());
        }
      }
    }

    // Apply optional search filter
    let filtered = merged;
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(search) ||
          p.slug?.toLowerCase().includes(search) ||
          p.subtitle?.toLowerCase().includes(search)
      );
    }

    // Attach accurate section count to every page
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

      return {
        ...page,
        id: pageId,
        _id: pageId,
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
      { success: false, error: { message: "Failed to fetch pages.", code: "DB_ERROR" } },
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
      seoTitle,
      seo_title,
      metaDescription,
      meta_description,
      canonicalUrl,
      canonical_url,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: { message: "Page title and slug are required.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
    if (!cleanSlug) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid page slug format.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const pageStatus = status || "PUBLISHED";

    const newPage = {
      title,
      handle: cleanSlug,
      slug: cleanSlug,
      subtitle: subtitle || null,
      body_html: content || null,
      published: pageStatus !== "DRAFT",
      status: pageStatus,
      featured_image: featuredImage || featured_image || null,
      seo_title: seoTitle || seo_title || `${title} | ModularHome.com`,
      seo_description: metaDescription || meta_description || subtitle || null,
      canonical_url: canonicalUrl || canonical_url || null,
    };

    // 1. Save into local persistent store
    const localSaved = saveCustomPage({
      title,
      slug: cleanSlug,
      subtitle: subtitle || "",
      content: content || "",
      status: pageStatus,
      featuredImage: featuredImage || featured_image || "",
      seoTitle: seoTitle || seo_title || `${title} | ModularHome.com`,
      metaDescription: metaDescription || meta_description || subtitle || "",
      canonicalUrl: canonicalUrl || canonical_url || "",
    });

    // 2. Also save into Supabase if configured
    let savedPageId = localSaved.id;
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from("pages")
          .insert(newPage)
          .select()
          .single();

        if (!error && data) {
          savedPageId = data.id;
          const formatted = formatCmsPage(data);
          
          await logActivity(
            authResult,
            "PAGE_CREATE",
            "PAGE",
            savedPageId,
            `Created landing page "${title}" (/${cleanSlug})`,
            { title, slug: cleanSlug, status: pageStatus }
          );

          return NextResponse.json({
            success: true,
            data: { ...formatted, sectionCount: 0, _count: { sections: 0 } },
            message: "Page created successfully.",
          });
        }
      } catch (sbErr) {
        console.warn("Supabase insert warning, saved locally:", sbErr);
      }
    }

    await logActivity(
      authResult,
      "PAGE_CREATE",
      "PAGE",
      savedPageId,
      `Created landing page "${title}" (/${cleanSlug})`,
      { title, slug: cleanSlug, status: pageStatus }
    );

    return NextResponse.json({
      success: true,
      data: { ...localSaved, sectionCount: 0, _count: { sections: 0 } },
      message: "Page created successfully.",
    });
  } catch (error: any) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to create page.", code: "CREATE_ERROR" } },
      { status: 500 }
    );
  }
}
