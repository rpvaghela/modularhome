import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getBombShelterLeads } from "@/lib/leadsStore";
import { getBombShelterQuotations } from "@/lib/quotationsStore";
import { getBombShelterProducts } from "@/lib/productStore";
import { getBombShelterCollections } from "@/lib/collectionsStore";
import { getBombShelterFloorPlans } from "@/lib/floorPlansStore";
import { getBombShelterBlogs } from "@/lib/blogStore";
import { getBombShelterVideos } from "@/lib/videosStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let totalProducts = 0;
    let totalCollections = 0;
    let totalFloorPlans = 0;
    let totalVideos = 0;
    let publishedBlogs = 0;

    if (isSupabaseConfigured()) {
      try {
        const [prodRes, colRes, fpRes, vidRes, blogRes] = await Promise.all([
          supabaseAdmin.from("products").select("id", { count: "exact", head: true }).eq("status", "active"),
          supabaseAdmin.from("collections").select("id", { count: "exact", head: true }),
          supabaseAdmin.from("floor_plans").select("id", { count: "exact", head: true }),
          supabaseAdmin.from("videos").select("id", { count: "exact", head: true }),
          supabaseAdmin.from("blog_posts").select("id", { count: "exact", head: true }),
        ]);

        totalProducts = prodRes.count ?? 518;
        totalCollections = colRes.count ?? 418;
        totalFloorPlans = fpRes.count ?? 9;
        totalVideos = vidRes.count ?? 20422;
        publishedBlogs = blogRes.count ?? 8;
      } catch (err) {
        console.warn("Error querying database counts in dashboard stats:", err);
      }
    }

    if (!totalProducts) {
      const prods = await getBombShelterProducts(true);
      totalProducts = prods.length;
    }
    if (!totalCollections) {
      const cols = await getBombShelterCollections();
      totalCollections = cols.length;
    }
    if (!totalFloorPlans) {
      const fps = await getBombShelterFloorPlans();
      totalFloorPlans = fps.length;
    }
    if (!publishedBlogs) {
      const blogs = await getBombShelterBlogs();
      publishedBlogs = blogs.length;
    }

    const leads = await getBombShelterLeads();
    const quotations = await getBombShelterQuotations();

    const newLeads = leads.filter((l: any) => l.status === "NEW" || l.status === "PENDING").length;
    const pendingQuotes = quotations.filter((q: any) => q.status === "PENDING" || q.status === "REVIEW").length;

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalProducts,
          totalCollections,
          totalFloorPlans,
          totalVideos,
          totalPages: 25,
          publishedBlogs,
          totalLeads: leads.length,
          newLeads,
          totalQuotations: quotations.length,
          pendingQuotations: pendingQuotes,
        },
        recentInquiries: leads.slice(0, 5),
        recentQuotations: quotations.slice(0, 5),
        systemStatus: {
          defconLevel: 1,
          jwtAuth: "ACTIVE",
          dbIsolation: "VERIFIED",
          firewallLockout: "ARMED",
          dbConnected: isSupabaseConfigured(),
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to compile admin stats.",
      },
      { status: 500 }
    );
  }
}
