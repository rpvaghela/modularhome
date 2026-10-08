import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.replace(/\r/g, "").split("\n");
  if (lines.length < 2) return [];

  // Parse header
  const headers: string[] = [];
  let cur = "";
  let inQuotes = false;
  const headerLine = lines[0].replace(/^\uFEFF/, "");
  for (let i = 0; i < headerLine.length; i++) {
    const c = headerLine[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (c === "," && !inQuotes) {
      headers.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  headers.push(cur.trim());

  const rows: Record<string, string>[] = [];
  for (let r = 1; r < lines.length; r++) {
    const line = lines[r];
    if (!line.trim()) continue;
    const values: string[] = [];
    cur = "";
    inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === "," && !inQuotes) {
        values.push(cur.trim());
        cur = "";
      } else {
        cur += c;
      }
    }
    values.push(cur.trim());

    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || "";
    });
    rows.push(obj);
  }
  return rows;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanAuthor(author: any): string {
  if (!author) return "ModularHome Engineering Team";
  if (typeof author === "string") {
    if (author.startsWith("{") && author.includes("name")) {
      try {
        const parsed = JSON.parse(author.replace(/'/g, '"'));
        return parsed.name || "ModularHome Engineering Team";
      } catch {
        const match = author.match(/['"]name['"]\s*:\s*['"]([^'"]+)['"]/);
        if (match) return match[1];
      }
    }
    return author;
  }
  if (typeof author === "object" && author.name) {
    return author.name;
  }
  return "ModularHome Engineering Team";
}

async function run() {
  console.log("=== STEP 1: LOAD SOURCE FILES ===");
  
  const csvReportPath = path.join(process.cwd(), "migration", "docs", "ModularHome_190_Blog_SEO_Correction_Report.csv");
  const blogInvPath = path.join(process.cwd(), "ModularHome_SEO_Blog_Developer_Handover", "data", "blog_inventory.csv");
  const adminArticlesPath = path.join(process.cwd(), "ModularHome_SEO_Blog_Developer_Handover", "data", "admin_articles.json");
  const migratedArticlesPath = path.join(process.cwd(), "src", "data", "migrated_articles.json");

  const reportRows = parseCSV(fs.readFileSync(csvReportPath, "utf8"));
  console.log(`Loaded ${reportRows.length} rows from ModularHome_190_Blog_SEO_Correction_Report.csv`);

  const blogInvRows = fs.existsSync(blogInvPath) ? parseCSV(fs.readFileSync(blogInvPath, "utf8")) : [];
  console.log(`Loaded ${blogInvRows.length} rows from blog_inventory.csv`);

  const adminArticles = fs.existsSync(adminArticlesPath) ? JSON.parse(fs.readFileSync(adminArticlesPath, "utf8")) : [];
  console.log(`Loaded ${adminArticles.length} admin articles`);

  const migratedArticles = fs.existsSync(migratedArticlesPath) ? JSON.parse(fs.readFileSync(migratedArticlesPath, "utf8")) : [];
  console.log(`Loaded ${migratedArticles.length} existing migrated articles`);

  // Build maps
  const adminByHandle = new Map<string, any>();
  const adminById = new Map<string, any>();
  for (const a of adminArticles) {
    if (a.handle) adminByHandle.set(a.handle.toLowerCase(), a);
    if (a.id) adminById.set(a.id, a);
  }

  const blogInvByUrl = new Map<string, any>();
  const blogInvBySlug = new Map<string, any>();
  for (const b of blogInvRows) {
    if (b.url) blogInvByUrl.set(b.url.toLowerCase().trim(), b);
    const slug = b.url ? b.url.split("/").filter(Boolean).pop() : "";
    if (slug) blogInvBySlug.set(slug.toLowerCase(), b);
  }

  const migratedBySlug = new Map<string, any>();
  for (const m of migratedArticles) {
    if (m.slug) migratedBySlug.set(m.slug.toLowerCase(), m);
  }

  console.log("\n=== STEP 2: CONSTRUCT 190 COMPLETE BLOG RECORDS ===");

  const finalBlogs: any[] = [];

  for (const rep of reportRows) {
    const title = rep["Article title"];
    const category = rep["Blog category"] || "Modular Construction";
    const oldUrl = rep["Old Shopify URL"];
    const nextUrl = rep["New Next.js URL"] || oldUrl;

    const urlParts = nextUrl.split("/").filter(Boolean);
    const articleSlug = urlParts[urlParts.length - 1] || slugify(title);
    const categorySlug = urlParts[urlParts.length - 2] && urlParts[urlParts.length - 2] !== "blogs"
      ? urlParts[urlParts.length - 2]
      : slugify(category);

    const adminArt = adminByHandle.get(articleSlug.toLowerCase()) || adminByHandle.get(slugify(title));
    const invArt = blogInvByUrl.get(oldUrl.toLowerCase()) || blogInvByUrl.get(nextUrl.toLowerCase()) || blogInvBySlug.get(articleSlug.toLowerCase());
    const migArt = migratedBySlug.get(articleSlug.toLowerCase());

    const id = adminArt?.id || migArt?.id || `gid://shopify/Article/${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const author = cleanAuthor(adminArt?.author || migArt?.author || invArt?.author_schema);
    const publishedAt = adminArt?.publishedAt || migArt?.published_at || invArt?.published_schema_meta || "2026-05-18T00:00:00Z";
    const createdAt = adminArt?.createdAt || migArt?.date || publishedAt;

    let dateFormatted = "Recent";
    try {
      const d = new Date(publishedAt);
      if (!isNaN(d.getTime())) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        dateFormatted = `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
      }
    } catch {}

    const rawBody = adminArt?.body || (migArt?.content ? (Array.isArray(migArt.content) ? migArt.content.join("\n") : migArt.content) : "");
    const excerpt = adminArt?.summary || migArt?.excerpt || invArt?.meta_description || "";
    
    // SEO fields
    const seoTitle = migArt?.seoTitle || migArt?.seo_title || (invArt?.seo_title ? invArt.seo_title.replace(/\s*–\s*Modular Homes.*$/i, "").trim() : "") || `${title} | ModularHome.com`;
    const metaDescription = migArt?.metaDescription || migArt?.seo_description || invArt?.meta_description || excerpt;
    const canonical = `https://modularhome.com/blogs/${categorySlug}/${articleSlug}`;

    const image = adminArt?.image?.url || migArt?.image || "https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345";

    const tags = adminArt?.tags ? (Array.isArray(adminArt.tags) ? adminArt.tags : adminArt.tags.split(",").map((t: string) => t.trim())) : (migArt?.tags || [category]);

    const keyTakeaways = migArt?.keyTakeaways || [
      `Complete guide and specifications for ${title}.`,
      "Engineered precision construction with factory quality control.",
      "Cost-effective modular design and streamlined timeline."
    ];

    finalBlogs.push({
      id,
      slug: articleSlug,
      handle: articleSlug,
      title,
      category,
      category_slug: categorySlug,
      readTime: migArt?.readTime || "6 min read",
      author,
      excerpt,
      body_html: rawBody,
      content: Array.isArray(migArt?.content) ? migArt.content : [rawBody],
      image,
      date: dateFormatted,
      published_at: publishedAt,
      created_at: createdAt,
      status: "PUBLISHED",
      tags,
      keyTakeaways,
      seoTitle,
      metaDescription,
      seo_title: seoTitle,
      seo_description: metaDescription,
      canonical_url: canonical,
      old_shopify_url: oldUrl,
      new_nextjs_url: nextUrl,
    });
  }

  // Deduplicate articles by normalized title and content
  const seenKeys = new Set<string>();
  const uniqueBlogs: any[] = [];
  for (const b of finalBlogs) {
    const normTitle = (b.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (seenKeys.has(normTitle)) {
      console.log(`Removed duplicate blog: "${b.title}" (${b.slug})`);
      continue;
    }
    seenKeys.add(normTitle);
    uniqueBlogs.push(b);
  }

  console.log(`Generated ${uniqueBlogs.length} unique processed blogs (removed ${finalBlogs.length - uniqueBlogs.length} duplicates).`);

  // Write to src/data/migrated_articles.json
  fs.writeFileSync(migratedArticlesPath, JSON.stringify(uniqueBlogs, null, 2), "utf8");
  console.log(`Updated ${migratedArticlesPath}`);

  // Write to src/data/custom_blogs.json
  const customBlogsPath = path.join(process.cwd(), "src", "data", "custom_blogs.json");
  fs.writeFileSync(customBlogsPath, JSON.stringify(uniqueBlogs, null, 2), "utf8");
  console.log(`Updated ${customBlogsPath}`);

  // Update src/data/resources.ts
  const categoriesSet = new Set<string>(["All"]);
  uniqueBlogs.forEach(b => categoriesSet.add(b.category));
  const categoriesArr = Array.from(categoriesSet);

  const resourcesTsPath = path.join(process.cwd(), "src", "data", "resources.ts");
  const resourcesTsContent = `import MIGRATED_ARTICLES from "./migrated_articles.json";

export interface ResourceArticle {
  id: string;
  slug: string;
  handle?: string;
  title: string;
  category: string;
  category_slug?: string;
  readTime: string;
  excerpt: string;
  content: string[];
  body_html?: string;
  image: string;
  date: string;
  author?: string;
  published_at?: string;
  created_at?: string;
  status?: string;
  tags?: string[];
  keyTakeaways?: string[];
  embeddedVideoUrl?: string;
  seoTitle?: string;
  metaDescription?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  old_shopify_url?: string;
  new_nextjs_url?: string;
}

export const RESOURCE_CATEGORIES = ${JSON.stringify(categoriesArr, null, 2)} as const;

export const RESOURCE_ARTICLES: ResourceArticle[] = MIGRATED_ARTICLES as unknown as ResourceArticle[];
`;
  fs.writeFileSync(resourcesTsPath, resourcesTsContent, "utf8");
  console.log(`Updated ${resourcesTsPath}`);
}

run().catch(console.error);
