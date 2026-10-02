import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { logAdminActivity } from "@/lib/activityLog";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminRole(["SUPER_ADMIN", "CONTENT_ADMIN"]);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, any> = {};

    const rawSource = body.sourcePath || body.from_path || body.source_path;
    const rawTarget = body.targetPath || body.to_path || body.target_path;
    const rawStatus = body.statusCode || body.http_status || body.status_code;

    if (rawSource !== undefined) {
      const cleanSource = rawSource.startsWith("/") ? rawSource : `/${rawSource}`;
      updates.from_path = cleanSource;
    }
    if (rawTarget !== undefined) {
      const cleanTarget = rawTarget.startsWith("/") || rawTarget.startsWith("http")
        ? rawTarget
        : `/${rawTarget}`;
      updates.to_path = cleanTarget;
    }
    if (rawStatus !== undefined) {
      updates.http_status = Number(rawStatus) || 301;
    }
    if (body.notes !== undefined) {
      updates.source = body.notes;
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from("redirects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      await logAdminActivity(
        authResult,
        "REDIRECT_UPDATED",
        "redirects",
        id,
        `Updated redirect: ${data?.from_path || data?.source_path} -> ${data?.to_path || data?.target_path}`
      );

      return NextResponse.json({
        success: true,
        data: {
          id: data.id,
          source_path: data.from_path,
          target_path: data.to_path,
          status_code: data.http_status,
          is_active: true,
          notes: data.source,
          created_at: data.created_at || new Date().toISOString(),
        },
        message: "Redirect rule updated successfully.",
      });
    }

    return NextResponse.json({
      success: true,
      data: { id, ...updates },
      message: "Redirect updated (offline fallback).",
    });
  } catch (error: any) {
    console.error("Error updating redirect:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to update redirect.", code: "UPDATE_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminRole(["SUPER_ADMIN", "CONTENT_ADMIN"]);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;

    if (isSupabaseConfigured()) {
      await supabaseAdmin.from("redirects").delete().eq("id", id);
    }

    await logAdminActivity(
      authResult,
      "REDIRECT_DELETED",
      "redirects",
      id,
      `Deleted redirect rule ID: ${id}`
    );

    return NextResponse.json({
      success: true,
      message: "Redirect deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting redirect:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to delete redirect.", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
