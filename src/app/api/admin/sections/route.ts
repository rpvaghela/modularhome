import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { query } from "@/lib/db";
import { logActivity } from "@/lib/activityLog";
import {
  saveSection,
  getPageSections,
  reorderSections,
  toggleSectionVisibility,
  isUuidString,
  readSectionsFromStore,
} from "@/lib/pageStore";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId");

    let dbSections: any[] = [];

    // 1. Direct PostgreSQL query
    try {
      if (pageId) {
        const isUuid = isUuidString(pageId);
        const sql = isUuid
          ? `SELECT * FROM page_sections WHERE page_id::text = $1 ORDER BY display_order ASC, created_at ASC;`
          : `SELECT s.* FROM page_sections s JOIN pages p ON s.page_id = p.id WHERE LOWER(p.slug) = LOWER($1) OR LOWER(p.handle) = LOWER($1) OR p.id::text = $1 ORDER BY s.display_order ASC, s.created_at ASC;`;
        const res = await query(sql, [pageId]);
        if (res && res.rows) {
          dbSections = res.rows;
        }
      } else {
        const res = await query(`SELECT * FROM page_sections ORDER BY display_order ASC, created_at ASC;`);
        if (res && res.rows) {
          dbSections = res.rows;
        }
      }
    } catch (pgErr) {
      console.warn("Postgres fetch sections warning:", pgErr);
    }

    // 2. Supabase fallback
    if (dbSections.length === 0 && isSupabaseConfigured()) {
      try {
        let targetUuid = pageId;
        if (pageId && !isUuidString(pageId)) {
          const { data: pageMatch } = await supabaseAdmin
            .from("pages")
            .select("id")
            .or(`slug.eq.${pageId.toLowerCase()},handle.eq.${pageId.toLowerCase()}`)
            .limit(1);
          if (pageMatch && pageMatch.length > 0) {
            targetUuid = pageMatch[0].id;
          }
        }

        let q = supabaseAdmin
          .from("page_sections")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (targetUuid && isUuidString(targetUuid)) {
          q = q.eq("page_id", targetUuid);
        } else if (pageId) {
          // If pageId was provided but not resolved to UUID, try filtering by page_id directly
          q = q.eq("page_id", pageId);
        }

        const { data, error } = await q;
        if (!error && data) {
          dbSections = data;
        }
      } catch (sbErr) {
        console.warn("Supabase fetch sections warning:", sbErr);
      }
    }

    // 3. Merge with local store
    const localSections = pageId ? getPageSections(pageId) : readSectionsFromStore();
    const existingIds = new Set(dbSections.map((s) => s.id));
    const merged: any[] = [...dbSections];

    for (const ls of localSections) {
      if (!existingIds.has(ls.id)) {
        merged.push(ls);
        existingIds.add(ls.id);
      }
    }

    const formatted = merged.map((s, idx) => ({
      id: s.id || s._id,
      pageId: s.page_id || s.pageId,
      page_id: s.page_id || s.pageId,
      type: (s.type || "HERO").toUpperCase(),
      title: s.title || "",
      subtitle: s.subtitle || "",
      content: s.content || (s.structured_content ? JSON.stringify(s.structured_content) : ""),
      order: s.display_order ?? s.displayOrder ?? idx + 1,
      displayOrder: s.display_order ?? s.displayOrder ?? idx + 1,
      display_order: s.display_order ?? s.displayOrder ?? idx + 1,
      isVisible: (s.is_visible !== undefined ? s.is_visible : s.isVisible) !== false,
      is_visible: (s.is_visible !== undefined ? s.is_visible : s.isVisible) !== false,
    })).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch sections.", code: "DB_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { pageId, type, title, subtitle, content, order, displayOrder, isVisible, is_visible } = body;

    if (!pageId || !type) {
      return NextResponse.json(
        { success: false, error: { message: "Page ID and Section Type are required.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const isVis = (isVisible !== undefined ? isVisible : is_visible) ?? true;
    const finalOrder = Number(order ?? displayOrder ?? 1);
    const finalContent = typeof content === "object" ? JSON.stringify(content) : content || "";

    // Resolve true page UUID if pageId was a slug
    let targetPageUuid = pageId;
    let targetPageSlug = pageId;
    try {
      const pageRes = await query(`SELECT id, slug, handle FROM pages WHERE id::text = $1 OR LOWER(slug) = LOWER($1) OR LOWER(handle) = LOWER($1) LIMIT 1;`, [pageId]);
      if (pageRes && pageRes.rows && pageRes.rows[0]) {
        targetPageUuid = pageRes.rows[0].id;
        targetPageSlug = pageRes.rows[0].slug || pageRes.rows[0].handle || pageId;
      }
    } catch {}

    let savedSection: any = null;

    // 1. Authoritative insert into PostgreSQL
    if (isUuidString(targetPageUuid)) {
      try {
        const res = await query(
          `INSERT INTO page_sections (page_id, type, title, subtitle, content, display_order, is_visible, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now())
           RETURNING *;`,
          [targetPageUuid, type.toUpperCase(), title || null, subtitle || null, finalContent || null, finalOrder, isVis]
        );
        if (res && res.rows && res.rows.length > 0) {
          savedSection = res.rows[0];
        }
      } catch (pgErr) {
        console.warn("Postgres insert section error:", pgErr);
      }
    }

    // 2. Fallback to Supabase if not yet saved
    if (!savedSection && isSupabaseConfigured() && isUuidString(targetPageUuid)) {
      try {
        const { data, error } = await supabaseAdmin
          .from("page_sections")
          .insert({
            page_id: targetPageUuid,
            type: type.toUpperCase(),
            title: title || null,
            subtitle: subtitle || null,
            content: finalContent || null,
            display_order: finalOrder,
            is_visible: isVis,
          })
          .select()
          .single();

        if (!error && data) {
          savedSection = data;
        }
      } catch (sbErr) {
        console.warn("Supabase insert section warning:", sbErr);
      }
    }

    // 3. Local fallback sync
    const localSaved = saveSection({
      pageId: targetPageUuid,
      type: type.toUpperCase(),
      title: title || "",
      subtitle: subtitle || "",
      content: finalContent,
      displayOrder: finalOrder,
      isVisible: isVis,
    });

    const finalResult = savedSection
      ? {
          id: savedSection.id,
          pageId: savedSection.page_id,
          page_id: savedSection.page_id,
          type: savedSection.type,
          title: savedSection.title || "",
          subtitle: savedSection.subtitle || "",
          content: savedSection.content || "",
          order: savedSection.display_order,
          displayOrder: savedSection.display_order,
          display_order: savedSection.display_order,
          isVisible: savedSection.is_visible,
          is_visible: savedSection.is_visible,
        }
      : localSaved;

    // 4. Revalidate pages
    try {
      revalidatePath(`/${targetPageSlug}`);
      revalidatePath(`/pages/${targetPageSlug}`);
      revalidatePath(`/admin/sections`);
      revalidatePath(`/admin/pages`);
    } catch {}

    // 5. Audit Log
    await logActivity(
      authResult,
      "SECTION_CREATE",
      "SECTION",
      finalResult.id,
      `Created ${type.toUpperCase()} section for page "${targetPageSlug}"`,
      { pageId: targetPageUuid, slug: targetPageSlug, type, title }
    );

    return NextResponse.json({
      success: true,
      data: finalResult,
      message: "Section created successfully in database.",
    });
  } catch (error: any) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to create section.", code: "CREATE_ERROR" } },
      { status: 500 }
    );
  }
}

// Bulk reorder or visibility toggle
export async function PUT(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { action, reorderedItems, sectionId, isVisible, pageSlug } = body;

    if (action === "reorder" && Array.isArray(reorderedItems)) {
      // 1. Reorder in PostgreSQL
      for (let i = 0; i < reorderedItems.length; i++) {
        const item = reorderedItems[i];
        const secId = item.id || item._id;
        const newOrder = i + 1;
        if (secId && isUuidString(secId)) {
          try {
            await query(`UPDATE page_sections SET display_order = $1, updated_at = now() WHERE id = $2;`, [newOrder, secId]);
          } catch {}
        }
      }

      // 2. Reorder in Supabase
      if (isSupabaseConfigured()) {
        try {
          const updatePromises = reorderedItems
            .filter((item: any) => isUuidString(item.id || item._id))
            .map((item: any, index: number) => {
              const id = item.id || item._id;
              return supabaseAdmin
                .from("page_sections")
                .update({ display_order: index + 1, updated_at: new Date().toISOString() })
                .eq("id", id);
            });
          await Promise.all(updatePromises);
        } catch (sbErr) {
          console.warn("Supabase reorder warning:", sbErr);
        }
      }

      // 3. Reorder in local store
      reorderSections(
        reorderedItems.map((item: any, index: number) => ({
          id: item.id || item._id,
          order: index + 1,
        }))
      );

      // 4. Revalidate
      try {
        if (pageSlug) {
          revalidatePath(`/${pageSlug}`);
          revalidatePath(`/pages/${pageSlug}`);
        }
        revalidatePath(`/admin/sections`);
      } catch {}

      await logActivity(
        authResult,
        "SECTION_REORDER",
        "SECTION",
        undefined,
        `Reordered ${reorderedItems.length} sections`,
        { count: reorderedItems.length }
      );

      return NextResponse.json({ success: true, message: "Sections reordered successfully." });
    }

    if (action === "toggleVisibility" && sectionId) {
      const vis = !!isVisible;

      // 1. Toggle in PostgreSQL
      if (isUuidString(sectionId)) {
        try {
          await query(`UPDATE page_sections SET is_visible = $1, updated_at = now() WHERE id = $2;`, [vis, sectionId]);
        } catch {}
      }

      // 2. Toggle in Supabase
      if (isSupabaseConfigured() && isUuidString(sectionId)) {
        try {
          await supabaseAdmin
            .from("page_sections")
            .update({ is_visible: vis, updated_at: new Date().toISOString() })
            .eq("id", sectionId);
        } catch {}
      }

      // 3. Toggle in local store
      toggleSectionVisibility(sectionId, vis);

      // 4. Revalidate
      try {
        if (pageSlug) {
          revalidatePath(`/${pageSlug}`);
          revalidatePath(`/pages/${pageSlug}`);
        }
        revalidatePath(`/admin/sections`);
      } catch {}

      await logActivity(
        authResult,
        "SECTION_UPDATE",
        "SECTION",
        sectionId,
        `Toggled section visibility to ${vis ? "visible" : "hidden"}`,
        { sectionId, isVisible: vis }
      );

      return NextResponse.json({ success: true, message: "Visibility updated in database." });
    }

    return NextResponse.json(
      { success: false, error: { message: "Invalid action specified.", code: "INVALID_ACTION" } },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error updating sections:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to process section update.", code: "UPDATE_ERROR" } },
      { status: 500 }
    );
  }
}
