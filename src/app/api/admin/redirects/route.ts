import { NextRequest, NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { logAdminActivity } from "@/lib/activityLog";

let memoryRedirects: any[] = [
  {
    id: "red-1",
    source_path: "/collections/all",
    target_path: "/buildings",
    status_code: 301,
    is_active: true,
    notes: "Legacy Shopify all collections URL",
    created_at: new Date().toISOString(),
  },
  {
    id: "red-2",
    source_path: "/catalog",
    target_path: "/buildings",
    status_code: 301,
    is_active: true,
    notes: "Legacy catalog URL",
    created_at: new Date().toISOString(),
  },
  {
    id: "red-3",
    source_path: "/floorplans",
    target_path: "/floor-plans",
    status_code: 301,
    is_active: true,
    notes: "Shopify unhyphenated floorplans link",
    created_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const authResult = await requireAdminRole(["SUPER_ADMIN", "CONTENT_ADMIN"]);
  if (authResult instanceof NextResponse) return authResult;

  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from("redirects")
        .select("*")
        .order("from_path", { ascending: true });

      if (!error && data) {
        const normalized = data.map((r: any) => ({
          id: r.id,
          source_path: r.source_path || r.from_path,
          from_path: r.from_path || r.source_path,
          target_path: r.target_path || r.to_path,
          to_path: r.to_path || r.target_path,
          status_code: Number(r.status_code || r.http_status || 301),
          http_status: Number(r.http_status || r.status_code || 301),
          is_active: r.is_active !== false,
          notes: r.notes || r.source || null,
          created_at: r.created_at || new Date().toISOString(),
        }));
        return NextResponse.json({ success: true, data: normalized });
      }
    }

    return NextResponse.json({ success: true, data: memoryRedirects });
  } catch (error: any) {
    console.error("Error fetching redirects:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch redirects.", code: "REDIRECTS_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminRole(["SUPER_ADMIN", "CONTENT_ADMIN"]);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { sourcePath, targetPath, statusCode, isActive, notes } = body;

    const rawSource = sourcePath || body.from_path || body.source_path;
    const rawTarget = targetPath || body.to_path || body.target_path;

    if (!rawSource || !rawTarget) {
      return NextResponse.json(
        { success: false, error: { message: "Source path and target path are required.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const cleanSource = rawSource.startsWith("/") ? rawSource : `/${rawSource}`;
    const cleanTarget = rawTarget.startsWith("/") || rawTarget.startsWith("http") ? rawTarget : `/${rawTarget}`;
    const statusNum = Number(statusCode || body.status_code || body.http_status) || 301;
    const activeBool = isActive !== undefined ? Boolean(isActive) : true;

    const insertPayload = {
      from_path: cleanSource,
      to_path: cleanTarget,
      http_status: statusNum,
      source: notes || "admin_manual",
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from("redirects")
        .upsert(insertPayload, { onConflict: "from_path" })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return NextResponse.json(
            { success: false, error: { message: "A redirect rule for this source path already exists.", code: "DUPLICATE_SOURCE" } },
            { status: 400 }
          );
        }
        throw error;
      }

      await logAdminActivity(
        authResult,
        "REDIRECT_CREATED",
        "redirects",
        data.id,
        `Created 301 redirect: ${cleanSource} -> ${cleanTarget}`
      );

      return NextResponse.json({
        success: true,
        data: {
          id: data.id,
          source_path: data.from_path || cleanSource,
          target_path: data.to_path || cleanTarget,
          status_code: data.http_status || statusNum,
          is_active: true,
          notes: data.source,
          created_at: new Date().toISOString(),
        },
        message: "Redirect rule created successfully.",
      });
    }

    const mock = {
      id: `red_${Date.now()}`,
      source_path: cleanSource,
      target_path: cleanTarget,
      status_code: statusNum,
      is_active: activeBool,
      notes,
      created_at: new Date().toISOString(),
    };
    memoryRedirects.unshift(mock);

    return NextResponse.json({
      success: true,
      data: mock,
      message: "Redirect created (offline fallback).",
    });
  } catch (error: any) {
    console.error("Error creating redirect:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to create redirect.", code: "CREATE_ERROR" } },
      { status: 500 }
    );
  }
}
