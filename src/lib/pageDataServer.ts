import { query } from "./db";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { readPagesFromStore, getCustomPageBySlug as getLocalPage } from "./pageStore";
import { formatCmsPage, CmsPage } from "./publicData";

/**
 * Server-only: Fetches a single published page by slug (or ID) directly from PostgreSQL, Supabase, or pageStore.
 */
export async function getPublicPageBySlug(slugParam: string): Promise<CmsPage | null> {
  const raw = slugParam ? decodeURIComponent(slugParam).toLowerCase().trim().replace(/^\/+|\/+$/g, "") : "";
  const cleanSlug = (!raw || raw === "/" || raw === "home") ? "home" : raw;

  // 1. Query Direct PostgreSQL database
  try {
    const pgRes = await query(
      `SELECT * FROM pages WHERE (LOWER(slug) = $1 OR LOWER(handle) = $1 OR ($1 = 'home' AND (LOWER(slug) = '/' OR LOWER(slug) = '' OR LOWER(slug) = 'home')) OR id::text = $1) LIMIT 1`,
      [cleanSlug]
    );

    if (pgRes && pgRes.rows.length > 0) {
      const page = pgRes.rows[0];
      let dbSections: any[] = [];
      try {
        const secRes = await query(
          `SELECT * FROM page_sections WHERE page_id::text = $1 AND is_visible = true ORDER BY display_order ASC, created_at ASC`,
          [page.id]
        );
        if (secRes) dbSections = secRes.rows;
      } catch {}

      return formatCmsPage(page, dbSections);
    }
  } catch (pgErr) {
    console.warn("Postgres fetch page warning:", pgErr);
  }

  // 2. Query Supabase
  try {
    if (isSupabaseConfigured()) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanSlug);
      const orFilter = isUuid
        ? `handle.eq.${cleanSlug},slug.eq.${cleanSlug},id.eq.${cleanSlug}`
        : `handle.eq.${cleanSlug},slug.eq.${cleanSlug}`;

      const { data: pages, error: pageError } = await supabaseAdmin
        .from("pages")
        .select("*")
        .or(orFilter);

      if (!pageError && pages && pages.length > 0) {
        const page = pages.find((p) => {
          const st = String(p.status || (p.published === false ? "DRAFT" : "PUBLISHED")).toUpperCase();
          return st === "PUBLISHED" || st === "ACTIVE";
        }) || pages[0];

        let dbSections: any[] = [];
        if (page.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(page.id)) {
          const { data } = await supabaseAdmin
            .from("page_sections")
            .select("*")
            .eq("page_id", page.id)
            .eq("is_visible", true)
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: true });
          if (data) dbSections = data;
        }

        return formatCmsPage(page, dbSections);
      }
    }
  } catch (error) {
    console.warn("Supabase fetch page warning:", error);
  }

  // 3. Fallback to local page store
  try {
    const localPage = getLocalPage(cleanSlug);
    if (localPage) {
      return formatCmsPage(localPage, localPage.sections || []);
    }
  } catch {}

  // 4. Fallback to publicData getPublicPageBySlug
  const { getPublicPageBySlug: getPublicPageFallback } = await import("./publicData");
  return await getPublicPageFallback(cleanSlug);
}

/**
 * Server-only: Fetches all published CMS pages
 */
export async function getPublicPagesServer(): Promise<CmsPage[]> {
  const result: CmsPage[] = [];
  const seenSlugs = new Set<string>();

  try {
    const pgRes = await query(`SELECT * FROM pages WHERE UPPER(status) = 'PUBLISHED' OR published = true ORDER BY created_at DESC;`);
    if (pgRes && pgRes.rows.length > 0) {
      for (const p of pgRes.rows) {
        const formatted = formatCmsPage(p);
        if (!seenSlugs.has(formatted.slug)) {
          result.push(formatted);
          seenSlugs.add(formatted.slug);
        }
      }
      return result;
    }
  } catch {}

  try {
    if (isSupabaseConfigured()) {
      const { data: dbPages, error } = await supabaseAdmin
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && dbPages && dbPages.length > 0) {
        for (const p of dbPages) {
          const formatted = formatCmsPage(p);
          if (formatted.status === "PUBLISHED" && !seenSlugs.has(formatted.slug)) {
            result.push(formatted);
            seenSlugs.add(formatted.slug);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching public pages from Supabase:", error);
  }

  try {
    const localPages = readPagesFromStore();
    for (const lp of localPages) {
      const formatted = formatCmsPage(lp);
      if (formatted.status === "PUBLISHED" && !seenSlugs.has(formatted.slug)) {
        result.push(formatted);
        seenSlugs.add(formatted.slug);
      }
    }
  } catch {}

  return result;
}
