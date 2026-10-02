import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { query } from "@/lib/db";
import { logActivity } from "@/lib/activityLog";
import { updateSection, deleteSection, isUuidString } from "@/lib/pageStore";

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

    const title = body.title !== undefined ? body.title : null;
    const subtitle = body.subtitle !== undefined ? body.subtitle : null;
    const type = body.type ? body.type.toUpperCase() : "HERO";
    const content = body.content !== undefined
      ? (typeof body.content === "object" ? JSON.stringify(body.content) : body.content)
      : "";
    const isVisible = (body.isVisible !== undefined ? body.isVisible : body.is_visible) ?? true;
    const displayOrder = Number(body.order ?? body.displayOrder ?? body.display_order ?? 1);

    let updatedDbSection: any = null;
    let pageSlug = body.pageSlug;

    // 1. Authoritative Update in PostgreSQL
    if (isUuidString(cleanId)) {
      try {
        const res = await query(
          `UPDATE page_sections SET
            type = $1,
            title = $2,
            subtitle = $3,
            content = $4,
            display_order = $5,
            is_visible = $6,
            updated_at = now()
          WHERE id = $7
          RETURNING *;`,
          [type, title, subtitle, content, displayOrder, isVisible, cleanId]
        );

        if (res && res.rows && res.rows.length > 0) {
          updatedDbSection = res.rows[0];
          // Look up page slug if not provided
          if (!pageSlug && updatedDbSection.page_id) {
            const pRes = await query(`SELECT slug, handle FROM pages WHERE id = $1 LIMIT 1;`, [updatedDbSection.page_id]);
            if (pRes && pRes.rows && pRes.rows[0]) {
              pageSlug = pRes.rows[0].slug || pRes.rows[0].handle;
            }
          }
        }
      } catch (pgErr) {
        console.warn("Postgres update section error:", pgErr);
      }
    }

    // 2. Fallback to Supabase if not yet updated
    if (!updatedDbSection && isSupabaseConfigured() && isUuidString(cleanId)) {
      try {
        const { data, error } = await supabaseAdmin
          .from("page_sections")
          .update({
            type,
            title,
            subtitle,
            content,
            display_order: displayOrder,
            is_visible: isVisible,
            updated_at: new Date().toISOString(),
          })
          .eq("id", cleanId)
          .select()
          .single();

        if (!error && data) {
          updatedDbSection = data;
        }
      } catch (sbErr) {
        console.warn("Supabase update section warning:", sbErr);
      }
    }

    // 3. Local fallback sync
    const localUpdated = updateSection(cleanId, {
      type,
      title: title || "",
      subtitle: subtitle || "",
      content,
      displayOrder,
      isVisible,
    });

    const finalResult = updatedDbSection
      ? {
          id: updatedDbSection.id,
          pageId: updatedDbSection.page_id,
          page_id: updatedDbSection.page_id,
          type: updatedDbSection.type,
          title: updatedDbSection.title || "",
          subtitle: updatedDbSection.subtitle || "",
          content: updatedDbSection.content || "",
          order: updatedDbSection.display_order,
          displayOrder: updatedDbSection.display_order,
          display_order: updatedDbSection.display_order,
          isVisible: updatedDbSection.is_visible,
          is_visible: updatedDbSection.is_visible,
        }
      : localUpdated;

    // 4. Revalidate
    try {
      if (pageSlug) {
        revalidatePath(`/${pageSlug}`);
        revalidatePath(`/pages/${pageSlug}`);
      }
      revalidatePath(`/admin/sections`);
      revalidatePath(`/admin/pages`);
    } catch {}

    // 5. Audit Log
    await logActivity(
      authResult,
      "SECTION_UPDATE",
      "SECTION",
      cleanId,
      `Updated section "${title || cleanId}" (${type})`,
      { id: cleanId, type, title }
    );

    return NextResponse.json({
      success: true,
      data: finalResult,
      message: "Section updated successfully in database.",
    });
  } catch (error: any) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to update section.", code: "UPDATE_ERROR" } },
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

    // 1. Delete from PostgreSQL
    if (isUuidString(cleanId)) {
      try {
        await query(`DELETE FROM page_sections WHERE id = $1;`, [cleanId]);
      } catch (pgErr) {
        console.warn("Postgres delete section error:", pgErr);
      }
    }

    // 2. Delete from Supabase
    if (isSupabaseConfigured() && isUuidString(cleanId)) {
      try {
        await supabaseAdmin.from("page_sections").delete().eq("id", cleanId);
      } catch (sbErr) {
        console.warn("Supabase delete section warning:", sbErr);
      }
    }

    // 3. Delete from local store
    deleteSection(cleanId);

    // 4. Revalidate
    try {
      revalidatePath(`/admin/sections`);
      revalidatePath(`/admin/pages`);
    } catch {}

    await logActivity(
      authResult,
      "SECTION_DELETE",
      "SECTION",
      cleanId,
      `Deleted section (${cleanId})`,
      { id: cleanId }
    );

    return NextResponse.json({
      success: true,
      message: "Section deleted successfully from database.",
    });
  } catch (error: any) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to delete section.", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
