import * as dotenv from "dotenv";
import { supabaseAdmin, isSupabaseConfigured } from "../../src/lib/supabase";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function testSupabase() {
  if (!isSupabaseConfigured()) {
    console.log("Supabase is not configured.");
    return;
  }

  const migratedArticlesPath = path.join(process.cwd(), "src", "data", "migrated_articles.json");
  const blogs = JSON.parse(fs.readFileSync(migratedArticlesPath, "utf8"));

  console.log(`Attempting to sync ${blogs.length} blogs to Supabase...`);

  // Let's test single row insert to blog_posts
  const testPost = blogs[0];
  const postPayload = {
    id: testPost.id,
    slug: testPost.slug,
    handle: testPost.handle,
    title: testPost.title,
    category: testPost.category,
    blog_title: testPost.category,
    blog_handle: testPost.category_slug,
    author: testPost.author,
    excerpt: testPost.excerpt,
    body_html: testPost.body_html,
    featured_image: testPost.image,
    image_url: testPost.image,
    thumbnail_url: testPost.image,
    status: testPost.status,
    published_at: testPost.published_at,
    created_at: testPost.created_at,
    tags: testPost.tags,
    key_takeaways: testPost.keyTakeaways,
    seo_title: testPost.seoTitle,
    seo_description: testPost.metaDescription,
    meta_description: testPost.metaDescription,
    canonical_url: testPost.canonical_url,
  };

  const { data: bpData, error: bpError } = await supabaseAdmin
    .from("blog_posts")
    .upsert([postPayload], { onConflict: "slug" });

  console.log("blog_posts single test result:", { error: bpError?.message });

  if (bpError) {
    console.log("Trying blogs table instead...");
    const blogsPayload = {
      title: testPost.title,
      slug: testPost.slug,
      excerpt: testPost.excerpt,
      content: testPost.content,
      featured_image: testPost.image,
      author: testPost.author,
      published_at: testPost.published_at,
      status: testPost.status,
      categories: [testPost.category],
      tags: testPost.tags,
      seo_title: testPost.seoTitle,
      meta_description: testPost.metaDescription,
      canonical_url: testPost.canonical_url,
    };
    const { data: bData, error: bError } = await supabaseAdmin
      .from("blogs")
      .upsert([blogsPayload], { onConflict: "slug" });
    console.log("blogs table test result:", { error: bError?.message });
  }

  // Now let's batch insert into blog_posts (or blogs)
  const chunkSize = 25;
  let successCount = 0;
  for (let i = 0; i < blogs.length; i += chunkSize) {
    const chunk = blogs.slice(i, i + chunkSize).map((b: any) => ({
      id: b.id,
      slug: b.slug,
      handle: b.handle,
      title: b.title,
      category: b.category,
      blog_title: b.category,
      blog_handle: b.category_slug,
      author: b.author,
      excerpt: b.excerpt,
      body_html: b.body_html,
      featured_image: b.image,
      image_url: b.image,
      thumbnail_url: b.image,
      status: b.status,
      published_at: b.published_at,
      created_at: b.created_at,
      tags: b.tags,
      key_takeaways: b.keyTakeaways,
      seo_title: b.seoTitle,
      seo_description: b.metaDescription,
      meta_description: b.metaDescription,
      canonical_url: b.canonical_url,
    }));

    const { error } = await supabaseAdmin
      .from("blog_posts")
      .upsert(chunk, { onConflict: "slug" });

    if (!error) {
      successCount += chunk.length;
      console.log(`Upserted batch ${i / chunkSize + 1} (${successCount}/${blogs.length})`);
    } else {
      console.warn(`Batch ${i / chunkSize + 1} error:`, error.message);
    }
  }

  console.log(`Finished. Total synced to Supabase: ${successCount}`);
}

testSupabase().catch(console.error);
