import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { query } from "@/lib/db";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { saveCustomBlog, readBlogsFromStore } from "@/lib/blogStore";
import { logActivity } from "@/lib/activityLogger";
import { generateSeoBlogFromVideo, generateSeoSlug } from "@/lib/seoBlogGenerator";

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const {
      youtubeVideoId,
      videoUrl,
      title,
      description,
      thumbnail,
      channelTitle,
      status = "DRAFT", // Defaults to DRAFT so admin can review before publishing
    } = body;

    // Extract raw video ID if full URL was provided
    let vId = (youtubeVideoId || "").trim();
    if (!vId && videoUrl) {
      const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) vId = match[1];
    }

    if (!vId) {
      return NextResponse.json(
        { success: false, error: { message: "Valid YouTube Video ID or Video URL is required.", code: "INVALID_VIDEO_ID" } },
        { status: 400 }
      );
    }

    // 1. Check for Duplicate YouTube Video ID in PostgreSQL and Supabase
    let existingPost: any = null;
    try {
      const dupCheckSql = `
        SELECT id, slug, title, status, youtube_video_id, published_at, created_at 
        FROM blog_posts 
        WHERE youtube_video_id = $1 OR embedded_video_url LIKE $2
        LIMIT 1
      `;
      const dupRes = await query(dupCheckSql, [vId, `%${vId}%`]);
      if (dupRes && dupRes.rows.length > 0) {
        existingPost = dupRes.rows[0];
      }
    } catch (dbErr) {
      console.warn("Postgres duplicate check note:", dbErr);
    }

    if (!existingPost && isSupabaseConfigured()) {
      try {
        const { data: spDup } = await supabaseAdmin
          .from("blog_posts")
          .select("id, slug, title, status, youtube_video_id, published_at, created_at")
          .or(`youtube_video_id.eq.${vId},embedded_video_url.ilike.%${vId}%`)
          .limit(1)
          .maybeSingle();

        if (spDup) existingPost = spDup;
      } catch {}
    }

    // Also check local store
    if (!existingPost) {
      const localBlogs = readBlogsFromStore();
      const localMatch = localBlogs.find(
        (b) =>
          b.id === `blog-yt-${vId}` ||
          (b.embeddedVideoUrl && b.embeddedVideoUrl.includes(vId)) ||
          (b.embedded_video_url && b.embedded_video_url.includes(vId))
      );
      if (localMatch) {
        existingPost = localMatch;
      }
    }

    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          error: {
            message: `A blog post for YouTube Video ID "${vId}" already exists: "${existingPost.title}" (${existingPost.status}).`,
            code: "DUPLICATE_VIDEO_BLOG",
          },
          existingBlog: existingPost,
        },
        { status: 409 }
      );
    }

    // 2. Generate SEO Article Content
    const videoInput = {
      youtubeVideoId: vId,
      title: title || `Modular Home Factory Tour & Walkthrough (${vId})`,
      description: description || "Exclusive behind-the-scenes walkthrough of precision modular home engineering and construction.",
      thumbnail: thumbnail || `https://img.youtube.com/vi/${vId}/maxresdefault.jpg`,
      channelTitle: channelTitle || "ModularHome Video Hub",
    };

    // Use SEO Blog Generator
    const generatedBlog = generateSeoBlogFromVideo(videoInput);
    generatedBlog.status = status; // Set to DRAFT or PUBLISHED

    // If OPENAI_API_KEY is available in environment, enhance with OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert architectural content editor and SEO specialist for ModularHome.com, a premier builder of steel-framed modular homes and luxury barndominiums. Generate an in-depth, high-ranking SEO blog post based on the provided YouTube video metadata.",
              },
              {
                role: "user",
                content: `Title: ${videoInput.title}\nDescription: ${videoInput.description}\nVideo ID: ${vId}\n\nProvide an SEO-optimized JSON response with:
                1. "seoTitle" (under 60 chars)
                2. "metaDescription" (under 155 chars)
                3. "keyTakeaways" (array of 4-5 bullet points)
                4. "content" (array of 5 comprehensive markdown section strings covering Overview, Framing & Steel Specs, Interior Floor Plan, Delivery & Site Prep, and FAQ)`,
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
          }),
        });

        if (openAiRes.ok) {
          const aiJson = await openAiRes.json();
          const parsedAi = JSON.parse(aiJson.choices[0]?.message?.content || "{}");
          if (parsedAi.seoTitle) generatedBlog.seoTitle = parsedAi.seoTitle;
          if (parsedAi.metaDescription) generatedBlog.metaDescription = parsedAi.metaDescription;
          if (Array.isArray(parsedAi.keyTakeaways)) generatedBlog.keyTakeaways = parsedAi.keyTakeaways;
          if (Array.isArray(parsedAi.content)) generatedBlog.content = parsedAi.content;
        }
      } catch (aiErr) {
        console.warn("OpenAI enhancement error (using built-in SEO generator fallback):", aiErr);
      }
    }

    const blogId = `blog_yt_${vId}_${Date.now()}`;
    const cleanSlug = generateSeoSlug(generatedBlog.title || videoInput.title);

    // 3. Persist to Postgres database
    let persisted = false;
    try {
      const insertSql = `
        INSERT INTO blog_posts (
          id, slug, title, status, category, author_name, excerpt, content,
          featured_image, image_url, embedded_video_url, youtube_video_id,
          seo_title, seo_description, key_takeaways, read_time, published_at, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12,
          $13, $14, $15, $16, NOW(), NOW(), NOW()
        )
        RETURNING *
      `;

      const contentStr = Array.isArray(generatedBlog.content)
        ? generatedBlog.content.join("\n\n")
        : generatedBlog.content;

      const pgRes = await query(insertSql, [
        blogId,
        cleanSlug,
        generatedBlog.title,
        status,
        generatedBlog.category || "Building Guides",
        generatedBlog.author || "ModularHome Editorial Team",
        generatedBlog.excerpt,
        contentStr,
        generatedBlog.featuredImage,
        generatedBlog.featuredImage,
        generatedBlog.embeddedVideoUrl,
        vId,
        generatedBlog.seoTitle,
        generatedBlog.metaDescription,
        JSON.stringify(generatedBlog.keyTakeaways || []),
        generatedBlog.readTime,
      ]);

      if (pgRes && pgRes.rows[0]) {
        persisted = true;
      }
    } catch (pgInsertErr) {
      console.warn("Postgres blog insert error:", pgInsertErr);
    }

    if (!persisted && isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from("blog_posts").insert({
          id: blogId,
          slug: cleanSlug,
          title: generatedBlog.title,
          status,
          category: generatedBlog.category,
          author_name: generatedBlog.author,
          excerpt: generatedBlog.excerpt,
          content: Array.isArray(generatedBlog.content) ? generatedBlog.content.join("\n\n") : generatedBlog.content,
          featured_image: generatedBlog.featuredImage,
          embedded_video_url: generatedBlog.embeddedVideoUrl,
          youtube_video_id: vId,
          seo_title: generatedBlog.seoTitle,
          seo_description: generatedBlog.metaDescription,
          key_takeaways: generatedBlog.keyTakeaways,
          read_time: generatedBlog.readTime,
        });
        persisted = true;
      } catch (spErr) {
        console.warn("Supabase blog insert error:", spErr);
      }
    }

    // Always backup to local store
    saveCustomBlog({
      ...generatedBlog,
      id: blogId,
      slug: cleanSlug,
      status,
    });

    await logActivity({
      action: "CREATE",
      entityType: "BLOG_POST",
      entityId: blogId,
      details: {
        title: generatedBlog.title,
        youtubeVideoId: vId,
        status,
        slug: cleanSlug,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: blogId,
        slug: cleanSlug,
        title: generatedBlog.title,
        status,
        category: generatedBlog.category,
        excerpt: generatedBlog.excerpt,
        content: generatedBlog.content,
        featuredImage: generatedBlog.featuredImage,
        embeddedVideoUrl: generatedBlog.embeddedVideoUrl,
        youtubeVideoId: vId,
        seoTitle: generatedBlog.seoTitle,
        metaDescription: generatedBlog.metaDescription,
        keyTakeaways: generatedBlog.keyTakeaways,
        readTime: generatedBlog.readTime,
      },
      message: `AI SEO blog draft created successfully for video "${videoInput.title}".`,
    });
  } catch (error: any) {
    console.error("AI Blog generation error:", error);
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to generate blog.", code: "GENERATE_ERROR" } },
      { status: 500 }
    );
  }
}
