import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/auth";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getCustomBlogByIdOrSlug, saveCustomBlog, deleteCustomBlog } from "@/lib/blogStore";
import { clearPublicDataCache, getPublicBlogBySlug } from "@/lib/publicData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const rawId = (await params).id;
    const id = decodeURIComponent(rawId).trim();

    // 1. Check local store
    const localBlog = getCustomBlogByIdOrSlug(id);
    if (localBlog) {
      return NextResponse.json({ success: true, data: localBlog });
    }

    // 2. Check Supabase
    if (isSupabaseConfigured()) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const orFilter = isUuid ? `id.eq.${id},handle.eq.${id}` : `handle.eq.${id}`;

      const { data: blog } = await supabaseAdmin
        .from("blog_posts")
        .select("*")
        .or(orFilter)
        .maybeSingle();

      if (blog) {
        return NextResponse.json({
          success: true,
          data: {
            id: blog.id,
            slug: blog.handle || blog.slug,
            title: blog.title,
            category: blog.blog_title || blog.category || "Building Guides",
            readTime: blog.read_time || "5 min read",
            excerpt: blog.excerpt || blog.seo_description || "",
            introduction: blog.introduction || blog.intro || blog.intro_text || "",
            content: blog.body_html || blog.content || "",
            featuredImage: blog.image_url || blog.featured_image || "",
            featured_image: blog.image_url || blog.featured_image || "",
            author: blog.author || blog.author_name || "ModularHome Engineering Team",
            status: blog.status || "PUBLISHED",
            publishedAt: blog.published_at || blog.created_at,
            tags: Array.isArray(blog.tags) ? blog.tags : [],
            keyTakeaways: Array.isArray(blog.key_takeaways) ? blog.key_takeaways : [],
            sqft: blog.sqft,
            bedrooms: blog.bedrooms,
            bathrooms: blog.bathrooms,
            stories: blog.stories,
            hasLoft: blog.has_loft !== undefined ? blog.has_loft : blog.hasLoft,
            buildingStyle: blog.building_style || blog.buildingStyle,
            buildType: blog.build_type || blog.buildType,
            price: blog.price || blog.starting_price,
            qualityBadge: blog.quality_badge || blog.qualityBadge,
            pullQuote: blog.pull_quote || blog.pullQuote,
            pullQuoteAuthor: blog.pull_quote_author || blog.pullQuoteAuthor,
            customFeatures: blog.custom_features || blog.customFeatures,
            heroBackground: blog.hero_background || blog.heroBackground,
          },
        });
      }
    }

    // 3. Fallback to catalog articles
    const fallbackArticle = await getPublicBlogBySlug(id);
    if (fallbackArticle) {
      return NextResponse.json({
        success: true,
        data: {
          id: fallbackArticle.id,
          slug: fallbackArticle.slug,
          title: fallbackArticle.title,
          category: fallbackArticle.category || "Building Guides",
          readTime: fallbackArticle.readTime || "5 min read",
          excerpt: fallbackArticle.excerpt || "",
          introduction: fallbackArticle.introduction || "",
          content: Array.isArray(fallbackArticle.content)
            ? fallbackArticle.content.join("\n\n")
            : (fallbackArticle.content || ""),
          featuredImage: fallbackArticle.image || "",
          featured_image: fallbackArticle.image || "",
          author: fallbackArticle.author || "ModularHome Engineering Team",
          status: "PUBLISHED",
          publishedAt: fallbackArticle.published_at || fallbackArticle.date || new Date().toISOString(),
          tags: fallbackArticle.tags || [],
          keyTakeaways: fallbackArticle.keyTakeaways || [],
          sqft: fallbackArticle.sqft,
          bedrooms: fallbackArticle.bedrooms,
          bathrooms: fallbackArticle.bathrooms,
          stories: fallbackArticle.stories,
          hasLoft: fallbackArticle.hasLoft,
          buildingStyle: fallbackArticle.buildingStyle,
          buildType: fallbackArticle.buildType,
          price: fallbackArticle.price || fallbackArticle.startingPrice,
          qualityBadge: fallbackArticle.qualityBadge,
          pullQuote: fallbackArticle.pullQuote,
          pullQuoteAuthor: fallbackArticle.pullQuoteAuthor,
          customFeatures: fallbackArticle.customFeatures,
          heroBackground: fallbackArticle.heroBackground,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: { message: "Blog article not found.", code: "NOT_FOUND" } },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Error fetching blog details:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch blog.", code: "DB_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const rawId = (await params).id;
    const id = decodeURIComponent(rawId).trim();
    const body = await request.json();

    // 1. Fetch existing blog from local store or Supabase
    const existingLocal = getCustomBlogByIdOrSlug(id);
    let existingDb: any = null;

    if (isSupabaseConfigured()) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const { data } = await supabaseAdmin
          .from("blog_posts")
          .select("*")
          .or(isUuid ? `id.eq.${id},handle.eq.${id}` : `handle.eq.${id}`)
          .maybeSingle();
        existingDb = data;
      } catch {}
    }

    // Determine clean slug (preserve existing if not explicitly changed)
    const cleanSlug = body.slug
      ? body.slug.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-")
      : (existingLocal?.slug || existingDb?.handle || id.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-"));

    const effectiveDate = body.publishedAt !== undefined
      ? body.publishedAt
      : (body.published_at !== undefined ? body.published_at : (body.date !== undefined ? body.date : existingLocal?.publishedAt || existingDb?.published_at));

    // 2. Save in local store with merge
    const savedLocal = saveCustomBlog({
      id: existingLocal?.id || existingDb?.id || id,
      slug: cleanSlug,
      title: body.title !== undefined ? body.title : (existingLocal?.title || existingDb?.title || "Untitled Article"),
      excerpt: body.excerpt !== undefined ? body.excerpt : (existingLocal?.excerpt || existingDb?.excerpt),
      introduction: body.introduction !== undefined ? body.introduction : existingLocal?.introduction,
      content: body.content !== undefined ? body.content : (existingLocal?.content || existingDb?.body_html),
      featuredImage: body.featuredImage !== undefined ? body.featuredImage : (body.featured_image !== undefined ? body.featured_image : existingLocal?.featuredImage || existingDb?.thumbnail_url),
      featured_image: body.featuredImage !== undefined ? body.featuredImage : (body.featured_image !== undefined ? body.featured_image : existingLocal?.featuredImage || existingDb?.thumbnail_url),
      author: body.author !== undefined ? body.author : (existingLocal?.author || existingDb?.author),
      publishedAt: effectiveDate,
      published_at: effectiveDate,
      date: effectiveDate,
      status: body.status !== undefined ? body.status : (existingLocal?.status || existingDb?.status || "PUBLISHED"),
      category: body.category !== undefined ? body.category : existingLocal?.category,
      categories: body.categories !== undefined ? body.categories : existingLocal?.categories,
      tags: body.tags !== undefined ? body.tags : existingLocal?.tags,
      embeddedVideoUrl: body.embeddedVideoUrl !== undefined ? body.embeddedVideoUrl : (existingLocal?.embeddedVideoUrl || existingDb?.video_embed_url),
      embedded_video_url: body.embeddedVideoUrl !== undefined ? body.embeddedVideoUrl : (existingLocal?.embeddedVideoUrl || existingDb?.video_embed_url),
      seoTitle: body.seoTitle !== undefined ? body.seoTitle : (existingLocal?.seoTitle || existingDb?.seo_title),
      seo_title: body.seoTitle !== undefined ? body.seoTitle : (existingLocal?.seoTitle || existingDb?.seo_title),
      metaDescription: body.metaDescription !== undefined ? body.metaDescription : (existingLocal?.metaDescription || existingDb?.seo_description),
      meta_description: body.metaDescription !== undefined ? body.metaDescription : (existingLocal?.metaDescription || existingDb?.seo_description),
      imageAltText: body.imageAltText !== undefined ? body.imageAltText : existingLocal?.imageAltText,
      canonicalUrl: body.canonicalUrl !== undefined ? body.canonicalUrl : existingLocal?.canonicalUrl,
      keyTakeaways: body.keyTakeaways !== undefined ? body.keyTakeaways : existingLocal?.keyTakeaways,
      sqft: body.sqft !== undefined ? body.sqft : existingLocal?.sqft,
      bedrooms: body.bedrooms !== undefined ? body.bedrooms : existingLocal?.bedrooms,
      bathrooms: body.bathrooms !== undefined ? body.bathrooms : existingLocal?.bathrooms,
      stories: body.stories !== undefined ? body.stories : existingLocal?.stories,
      hasLoft: body.hasLoft !== undefined ? body.hasLoft : existingLocal?.hasLoft,
      buildingStyle: body.buildingStyle !== undefined ? body.buildingStyle : existingLocal?.buildingStyle,
      buildType: buildTypeOrFallback(body.buildType, existingLocal?.buildType),
      price: body.price !== undefined ? body.price : existingLocal?.price,
      startingPrice: body.startingPrice !== undefined ? body.startingPrice : existingLocal?.startingPrice,
      qualityBadge: body.qualityBadge !== undefined ? body.qualityBadge : existingLocal?.qualityBadge,
      pullQuote: body.pullQuote !== undefined ? body.pullQuote : existingLocal?.pullQuote,
      pullQuoteAuthor: body.pullQuoteAuthor !== undefined ? body.pullQuoteAuthor : existingLocal?.pullQuoteAuthor,
      customFeatures: body.customFeatures !== undefined ? body.customFeatures : existingLocal?.customFeatures,
      heroBackground: body.heroBackground !== undefined ? body.heroBackground : existingLocal?.heroBackground,
    });

    // 3. Update in Supabase blog_posts
    if (isSupabaseConfigured()) {
      try {
        const targetDbId = existingDb?.id || (existingLocal?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(existingLocal.id) ? existingLocal.id : null);

        const updates: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };

        if (body.title !== undefined) updates.title = body.title;
        if (cleanSlug !== undefined) updates.handle = cleanSlug;
        if (body.excerpt !== undefined) updates.excerpt = body.excerpt;
        if (body.content !== undefined || body.introduction !== undefined) {
          updates.body_html = body.content || (body.introduction ? `<p>${body.introduction}</p>` : "");
        }
        if (body.featuredImage !== undefined || body.featured_image !== undefined) {
          updates.thumbnail_url = body.featuredImage || body.featured_image;
        }
        if (body.author !== undefined) updates.author = body.author;
        if (effectiveDate !== undefined) updates.published_at = savedLocal.publishedAt;
        if (body.status !== undefined) updates.status = body.status;
        if (body.tags !== undefined) {
          updates.tags = Array.isArray(body.tags) ? body.tags.join(", ") : String(body.tags);
        }
        if (body.embeddedVideoUrl !== undefined) updates.video_embed_url = body.embeddedVideoUrl;
        if (body.seoTitle !== undefined) updates.seo_title = body.seoTitle;
        if (body.metaDescription !== undefined) updates.seo_description = body.metaDescription;

        if (targetDbId) {
          await supabaseAdmin.from("blog_posts").update(updates).eq("id", targetDbId);
        } else {
          await supabaseAdmin.from("blog_posts").update(updates).eq("handle", cleanSlug);
        }
      } catch (dbErr) {
        console.warn("Supabase blog_posts update note:", dbErr);
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
      message: "Blog article updated successfully.",
    });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to update blog.", code: "UPDATE_ERROR" } },
      { status: 500 }
    );
  }
}

function buildTypeOrFallback(val: any, fallback: any) {
  return val !== undefined ? val : fallback;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const rawId = (await params).id;
    const id = decodeURIComponent(rawId).trim();

    // 1. Delete from local store
    deleteCustomBlog(id);

    // 2. Delete from Supabase blog_posts
    if (isSupabaseConfigured()) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUuid) {
          await supabaseAdmin.from("blog_posts").delete().eq("id", id);
        } else {
          await supabaseAdmin.from("blog_posts").delete().eq("handle", id);
        }
      } catch (dbErr) {
        console.warn("Supabase delete note:", dbErr);
      }
    }

    clearPublicDataCache();
    try {
      revalidatePath("/blogs");
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Blog article deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to delete blog.", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
