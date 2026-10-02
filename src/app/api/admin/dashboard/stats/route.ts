import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { query } from "@/lib/db";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getLeadStats } from "@/lib/leadsStore";
import { readPagesFromStore } from "@/lib/pageStore";
import { readBlogsFromStore } from "@/lib/blogStore";

export async function GET() {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const localLeadStats = getLeadStats();
    const localPages = readPagesFromStore();
    const localBlogs = readBlogsFromStore();

    let totalProducts = 0;
    let totalCollections = 0;
    let totalPages = localPages.length;
    let totalFloorPlans = 0;
    let totalLeads = localLeadStats.total;
    let newLeads = localLeadStats.newLeads;
    let totalQuotations = 0;
    let pendingQuotations = 0;
    let recentLeads: any[] = localLeadStats.recent || [];
    let recentQuotations: any[] = [];
    let rawDbBlogs: any[] = [];

    let pgSuccess = false;

    // Try direct PostgreSQL pool first for maximum fidelity and exactness
    try {
      const prodRes = await query("SELECT COUNT(*)::int AS count FROM products");
      if (prodRes && prodRes.rows && prodRes.rows.length > 0) {
        const [
          collRes,
          pageRes,
          floorRes,
          blogRes,
          leadRes,
          leadListRes,
          quoteRes,
          quoteListRes,
        ] = await Promise.all([
          query("SELECT COUNT(*)::int AS count FROM collections"),
          query("SELECT COUNT(*)::int AS count FROM pages"),
          query("SELECT COUNT(*)::int AS count FROM floor_plans"),
          query("SELECT id, slug, handle, status FROM blog_posts"),
          query(`SELECT 
                  COUNT(*)::int AS total,
                  COUNT(*) FILTER (WHERE status = 'NEW')::int AS new_count
                 FROM leads`),
          query("SELECT * FROM leads ORDER BY created_at DESC LIMIT 5"),
          query(`SELECT 
                  COUNT(*)::int AS total,
                  COUNT(*) FILTER (WHERE status = 'PENDING')::int AS pending_count
                 FROM quotations`),
          query("SELECT * FROM quotations ORDER BY created_at DESC LIMIT 5"),
        ]);

        totalProducts = Number(prodRes.rows[0]?.count) || 0;
        if (collRes && collRes.rows[0]) totalCollections = Number(collRes.rows[0].count) || 0;
        if (pageRes && pageRes.rows[0]) totalPages = Math.max(Number(pageRes.rows[0].count) || 0, localPages.length);
        if (floorRes && floorRes.rows[0]) totalFloorPlans = Number(floorRes.rows[0].count) || 0;
        if (blogRes && blogRes.rows) {
          rawDbBlogs = blogRes.rows;
        }
        if (leadRes && leadRes.rows[0]) {
          totalLeads = Math.max(Number(leadRes.rows[0].total) || 0, localLeadStats.total);
          newLeads = Math.max(Number(leadRes.rows[0].new_count) || 0, localLeadStats.newLeads);
        }
        if (leadListRes && leadListRes.rows.length > 0) recentLeads = leadListRes.rows;
        if (quoteRes && quoteRes.rows[0]) {
          totalQuotations = Number(quoteRes.rows[0].total) || 0;
          pendingQuotations = Number(quoteRes.rows[0].pending_count) || 0;
        }
        if (quoteListRes && quoteListRes.rows.length > 0) recentQuotations = quoteListRes.rows;

        pgSuccess = true;
      }
    } catch (dbError) {
      console.warn("Direct Postgres query failed, falling back to Supabase client:", dbError);
    }

    // Fallback to Supabase JS client if direct Postgres is unavailable
    if (!pgSuccess && isSupabaseConfigured()) {
      try {
        const [
          { count: spTotalProducts },
          { count: spTotalCollections },
          { count: spTotalPages },
          { count: spTotalFloorPlans },
          { data: spBlogs },
          { data: spLeads, count: spTotalLeads },
          { data: spQuotations, count: spTotalQuotations },
        ] = await Promise.all([
          supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
          supabaseAdmin.from("collections").select("*", { count: "exact", head: true }),
          supabaseAdmin.from("pages").select("*", { count: "exact", head: true }),
          supabaseAdmin.from("floor_plans").select("*", { count: "exact", head: true }),
          supabaseAdmin.from("blog_posts").select("id, slug, handle, status"),
          supabaseAdmin.from("leads").select("*", { count: "exact" }).order("created_at", { ascending: false }).limit(5),
          supabaseAdmin.from("quotations").select("*", { count: "exact" }).order("created_at", { ascending: false }).limit(5),
        ]);

        if (spBlogs && spBlogs.length > 0) {
          rawDbBlogs = spBlogs;
        } else {
          const { data: legacyBlogs } = await supabaseAdmin.from("blogs").select("id, slug, handle, status");
          if (legacyBlogs) rawDbBlogs = legacyBlogs;
        }

        const { count: spNewLeads } = await supabaseAdmin
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("status", "NEW");

        const { count: spPendingQuotes } = await supabaseAdmin
          .from("quotations")
          .select("*", { count: "exact", head: true })
          .eq("status", "PENDING");

        totalProducts = spTotalProducts || 0;
        totalCollections = spTotalCollections || 0;
        totalPages = Math.max(spTotalPages || 0, localPages.length);
        totalFloorPlans = spTotalFloorPlans || 0;
        totalLeads = Math.max(spTotalLeads || 0, localLeadStats.total);
        newLeads = Math.max(spNewLeads || 0, localLeadStats.newLeads);
        totalQuotations = spTotalQuotations || 0;
        pendingQuotations = spPendingQuotes || 0;
        recentLeads = (spLeads && spLeads.length > 0) ? spLeads : (localLeadStats.recent || []);
        recentQuotations = spQuotations || [];
      } catch (spErr) {
        console.warn("Supabase dashboard stats error:", spErr);
      }
    }

    // Merge Blogs to match Articles & Resources list exactly
    const existingBlogSlugs = new Set<string>();
    let publishedBlogs = 0;
    let draftBlogs = 0;

    for (const lb of localBlogs) {
      existingBlogSlugs.add(lb.slug.toLowerCase());
      if (lb.status === "PUBLISHED" || !lb.status) publishedBlogs++;
      else draftBlogs++;
    }

    for (const db of rawDbBlogs) {
      const slug = String(db.slug || db.handle || db.id || "").toLowerCase();
      if (!existingBlogSlugs.has(slug)) {
        existingBlogSlugs.add(slug);
        if (db.status === "PUBLISHED" || db.status === "published") publishedBlogs++;
        else draftBlogs++;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalProducts,
          totalCollections,
          totalPages,
          totalFloorPlans,
          publishedBlogs,
          draftBlogs,
          totalLeads,
          newLeads,
          totalQuotations,
          pendingQuotations,
        },
        recentLeads,
        recentQuotations,
      },
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to retrieve dashboard stats.", code: "STATS_ERROR" } },
      { status: 500 }
    );
  }
}

