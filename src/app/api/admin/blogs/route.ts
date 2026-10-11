import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { readBlogsFromStore, saveCustomBlog } from "@/lib/blogStore";
import { clearPublicDataCache } from "@/lib/publicData";

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let dbBlogs: any[] = [];

    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin
          .from("blog_posts")
          .select("*")
          .order("published_at", { ascending: false });

        if (status && status !== "ALL") {
          query = query.eq("status", status);
        }

        let { data, error } = await query;
        if (!error && data) {
          dbBlogs = data;
        }
      } catch (err) {
        console.error("Supabase blogs fetch error:", err);
      }
    }

    // Read local custom blogs
    const localBlogs = readBlogsFromStore();

    // Merge: Supabase + local custom blogs
    const existingSlugs = new Set<string>();
    const merged: any[] = [];

    // 1. Add local blogs
    for (const lb of localBlogs) {
      existingSlugs.add(lb.slug.toLowerCase());
      merged.push({
        id: lb.id,
        slug: lb.slug,
        title: lb.title,
        category: lb.category,
        author: lb.author,
        publishedAt: lb.publishedAt || lb.published_at,
        status: lb.status || "PUBLISHED",
        featuredImage: lb.featuredImage || lb.featured_image || lb.image,
        excerpt: lb.excerpt,
        introduction: lb.introduction || (lb as any).intro || (lb as any).intro_text || "",
        content: lb.content,
        sqft: lb.sqft,
        bedrooms: lb.bedrooms,
        bathrooms: lb.bathrooms,
        stories: lb.stories,
        hasLoft: lb.hasLoft,
        buildingStyle: lb.buildingStyle,
        buildType: lb.buildType,
        price: lb.price || lb.startingPrice,
        qualityBadge: lb.qualityBadge,
        pullQuote: lb.pullQuote,
        pullQuoteAuthor: lb.pullQuoteAuthor,
        customFeatures: lb.customFeatures,
        heroBackground: lb.heroBackground,
      });
    }

    // 2. Add DB blogs
    for (const db of dbBlogs) {
      const slug = db.handle || db.slug || db.id;
      if (!existingSlugs.has((slug || "").toLowerCase())) {
        existingSlugs.add((slug || "").toLowerCase());
        merged.push({
          id: db.id,
          slug,
          title: db.title,
          category: db.blog_title || db.category || (Array.isArray(db.categories) ? db.categories[0] : "Building Guides"),
          author: db.author || db.author_name || "ModularHome Engineering Team",
          publishedAt: db.published_at || db.created_at,
          status: db.status || "PUBLISHED",
          featuredImage: db.image_url || db.featured_image,
          excerpt: db.excerpt || db.seo_description,
          introduction: db.introduction || db.intro || db.intro_text || "",
          content: db.body_html || db.content,
          sqft: db.sqft,
          bedrooms: db.bedrooms,
          bathrooms: db.bathrooms,
          stories: db.stories,
          hasLoft: db.has_loft !== undefined ? db.has_loft : db.hasLoft,
          buildingStyle: db.building_style || db.buildingStyle,
          buildType: db.build_type || db.buildType,
          price: db.price || db.starting_price,
          qualityBadge: db.quality_badge || db.qualityBadge,
          pullQuote: db.pull_quote || db.pullQuote,
          pullQuoteAuthor: db.pull_quote_author || db.pullQuoteAuthor,
          customFeatures: db.custom_features || db.customFeatures,
          heroBackground: db.hero_background || db.heroBackground,
        });
      }
    }

    // Sort latest date first (newest publication date at top)
    merged.sort((a, b) => {
      const timeA = new Date(a.publishedAt || a.published_at || a.date || a.createdAt || a.created_at || 0).getTime();
      const timeB = new Date(b.publishedAt || b.published_at || b.date || b.createdAt || b.created_at || 0).getTime();
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    });

    let filtered = merged;
    if (status && status !== "ALL") {
      filtered = filtered.filter((b) => (b.status || "").toUpperCase() === status.toUpperCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (b) =>
          (b.title || "").toLowerCase().includes(q) ||
          (b.slug || "").toLowerCase().includes(q) ||
          (b.category || "").toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error: any) {
    console.error("Error fetching admin blogs:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch blogs.", code: "DB_ERROR" } },
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
      excerpt,
      introduction,
      content,
      featuredImage,
      heroBackground,
      author,
      publishedAt,
      date,
      status,
      category,
      categories,
      tags,
      embeddedVideoUrl,
      seoTitle,
      metaDescription,
      imageAltText,
      canonicalUrl,
      keyTakeaways,
      sqft,
      bedrooms,
      bathrooms,
      stories,
      hasLoft,
      buildingStyle,
      buildType,
      price,
      startingPrice,
      qualityBadge,
      pullQuote,
      pullQuoteAuthor,
      customFeatures,
    } = body;

    if (!title || (!content && !introduction)) {
      return NextResponse.json(
        { success: false, error: { message: "Title and content (or introduction) are required.", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const effectiveContent = content || (introduction ? `<p>${introduction}</p>` : "");
    const effectiveIntro = introduction || "";

    // 1. Always save to local persistent custom_blogs.json
    const savedLocal = saveCustomBlog({
      title: title.trim(),
      slug: cleanSlug,
      excerpt: excerpt || metaDescription || null,
      introduction: effectiveIntro,
      content: effectiveContent,
      featuredImage:
        featuredImage ||
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      featured_image:
        featuredImage ||
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      author: author || "ModularHome Editorial Team",
      publishedAt: publishedAt || date || new Date().toISOString(),
      published_at: publishedAt || date || new Date().toISOString(),
      date: date || publishedAt || undefined,
      status: status || "PUBLISHED",
      categories: Array.isArray(categories) ? categories : (category ? [category] : ["Building Guides"]),
      category: Array.isArray(categories) && categories.length > 0 ? categories[0] : (category || "Building Guides"),
      tags: Array.isArray(tags) ? tags : [],
      embeddedVideoUrl: embeddedVideoUrl || null,
      embedded_video_url: embeddedVideoUrl || null,
      seoTitle: seoTitle || `${title} | ModularHome.com Guide`,
      seo_title: seoTitle || `${title} | ModularHome.com Guide`,
      metaDescription: metaDescription || excerpt || null,
      meta_description: metaDescription || excerpt || null,
      imageAltText: imageAltText || title,
      image_alt_text: imageAltText || title,
      canonicalUrl: canonicalUrl || null,
      canonical_url: canonicalUrl || null,
      keyTakeaways: Array.isArray(keyTakeaways) ? keyTakeaways : [],
      sqft: sqft || null,
      bedrooms: bedrooms || null,
      bathrooms: bathrooms || null,
      stories: stories || null,
      hasLoft: hasLoft !== undefined ? hasLoft : null,
      buildingStyle: buildingStyle || null,
      buildType: buildType || null,
      price: price || startingPrice || null,
      startingPrice: startingPrice || price || null,
      qualityBadge: qualityBadge || null,
      pullQuote: pullQuote || null,
      pullQuoteAuthor: pullQuoteAuthor || null,
      customFeatures: Array.isArray(customFeatures) ? customFeatures : undefined,
      heroBackground: heroBackground || null,
    });

    // 2. Also save to Supabase blog_posts if configured
    if (isSupabaseConfigured()) {
      try {
        const catStr = Array.isArray(categories) && categories.length > 0 ? categories[0] : (category || "Building Guides");
        const tagsStr = Array.isArray(tags) ? tags.join(", ") : (tags || "");

        const { data: existingPost } = await supabaseAdmin
          .from("blog_posts")
          .select("id")
          .eq("handle", cleanSlug)
          .maybeSingle();

        const dbPostPayload: any = {
          handle: cleanSlug,
          title: title.trim(),
          excerpt: excerpt || metaDescription || null,
          body_html: effectiveContent,
          thumbnail_url: savedLocal.featuredImage,
          author: savedLocal.author,
          published_at: savedLocal.publishedAt,
          status: savedLocal.status,
          tags: tagsStr,
          blog_handle: catStr.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "news",
          seo_title: savedLocal.seoTitle,
          seo_description: savedLocal.metaDescription,
          video_embed_url: savedLocal.embeddedVideoUrl,
          updated_at: new Date().toISOString(),
        };

        if (existingPost?.id) {
          await supabaseAdmin.from("blog_posts").update(dbPostPayload).eq("id", existingPost.id);
        } else {
          dbPostPayload.id = crypto.randomUUID();
          dbPostPayload.created_at = new Date().toISOString();
          await supabaseAdmin.from("blog_posts").insert(dbPostPayload);
        }
      } catch (dbErr) {
        console.warn("Supabase blog_posts upsert warning:", dbErr);
      }
    }

    clearPublicDataCache();
    try {
      revalidatePath("/blogs");
      revalidatePath(`/blogs/${cleanSlug}`);
    } catch {}

    return NextResponse.json({
      success: true,
      data: savedLocal,
      message: "Blog article created and published successfully.",
    });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { success: false, error: { message: error?.message || "Failed to create blog.", code: "CREATE_ERROR" } },
      { status: 500 }
    );
  }
}
