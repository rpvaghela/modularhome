import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";
import { supabaseAdmin, isSupabaseConfigured } from "../src/lib/supabase";
import { cleanHtmlContent, cleanSeoTitle, cleanSeoDescription } from "../migration/mappers/branding_cleaner";
import { getCategoryFallbackImage } from "../src/lib/publicData";

interface ExcelRow {
  URL?: string;
  Heading?: string;
  "SEO title"?: string;
  Canonical?: string;
  "HTTP status"?: number | string;
  "Meta description"?: string;
  "Content text excerpt (full in JSON)"?: string;
}

export interface CollectionRecord {
  id?: string;
  handle: string;
  title: string;
  tagline: string;
  description_html: string;
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  published: boolean;
  image: string;
  banner_image: string;
  is_featured: boolean;
  display_order: number;
  source_id?: string;
  category_group?: string;
}

function cleanText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function deriveCategoryGroup(slug: string, title: string): string {
  const s = `${slug} ${title}`.toLowerCase();
  if (s.includes("-in-") || s.includes(" builders ") || s.includes("builder")) return "State & Regional Builders";
  if (s.includes("bedroom") || s.includes("turnkey")) return "Turnkey & Bedroom Models";
  if (s.includes("cabin") || s.includes("log")) return "Cabins & Lodges";
  if (s.includes("barndo")) return "Barndominiums & Barns";
  if (s.includes("a-frame") || s.includes("aframe")) return "A-Frame Homes";
  if (s.includes("adu") || s.includes("granny")) return "ADUs & Studios";
  if (s.includes("tiny")) return "Tiny Homes";
  if (s.includes("kit") || s.includes("sip")) return "House Kits & Framing";
  if (s.includes("commercial")) return "Commercial Buildings";
  return "Modular & Prefab Architecture";
}

function deriveTagline(slug: string, title: string, categoryGroup: string): string {
  if (categoryGroup === "State & Regional Builders") {
    // Extract state name if present
    const stateMatch = slug.match(/-in-([a-z-]+)$/);
    if (stateMatch) {
      const state = stateMatch[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return `Custom Precision Prefab & Modular Builds Delivered Across ${state}`;
    }
    return "Licensed Modular Engineering & Direct-to-Site Construction";
  }
  if (slug.includes("2-bedroom")) return "Efficient 2-Bedroom Modular Living with Premium Finishes";
  if (slug.includes("3-bedroom")) return "Spacious 3-Bedroom Turnkey Prefab & Modular Residences";
  if (slug.includes("barndo")) return "Engineered Clear-Span Steel Frame Barndominiums";
  if (slug.includes("cabin")) return "Precision Amish-Crafted Log Cabins & Modular Mountain Retreats";
  if (slug.includes("a-frame")) return "Architectural High-Ceiling A-Frame Cabin & Home Kits";
  if (slug.includes("adu")) return "Accessory Dwelling Units & Backyard Guest Residences";
  if (slug.includes("kit")) return "Pre-Engineered Panelized & Steel Structural House Kits";
  return `Engineered Architectural Series — ${title}`;
}

function formatHtmlDescription(excerpt: string | undefined, metaDesc: string | undefined, title: string): string {
  const raw = cleanText(excerpt || metaDesc || "");
  if (!raw) {
    return `<p>Explore our curated architectural series for <strong>${title}</strong>. Engineered with heavy-duty structural framing, energy-efficient building envelopes, and nationwide factory-direct delivery.</p>`;
  }

  // If already contains HTML tags, return cleaned version
  if (/<p>|<div|<h\d|<ul>/i.test(raw)) {
    return cleanHtmlContent(raw, title).cleanedHtml;
  }

  // Split into paragraphs by newline or multiple sentences
  const paragraphs = raw
    .split(/\n\n+|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1 && raw.length > 300) {
    // Split sentences into 2 readable paragraphs
    const sentences = raw.split(/(?<=[.?!])\s+/);
    const mid = Math.ceil(sentences.length / 2);
    const p1 = sentences.slice(0, mid).join(" ");
    const p2 = sentences.slice(mid).join(" ");
    const h1 = cleanHtmlContent(p1, title).cleanedHtml;
    const h2 = cleanHtmlContent(p2, title).cleanedHtml;
    return `<p>${h1}</p><p>${h2}</p>`;
  }

  const html = paragraphs.map((p) => `<p>${cleanHtmlContent(p, title).cleanedHtml}</p>`).join("");
  return html;
}

export function parseBook1Collections(): CollectionRecord[] {
  const filePath = path.resolve(process.cwd(), "migration/Book1.xlsx");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Book1.xlsx not found at ${filePath}`);
  }

  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets["Collections"];
  if (!sheet) {
    throw new Error("Sheet 'Collections' not found in Book1.xlsx");
  }

  const rows: ExcelRow[] = xlsx.utils.sheet_to_json(sheet);
  const collections: CollectionRecord[] = [];
  const seenHandles = new Set<string>();

  rows.forEach((r, idx) => {
    const rawUrl = (r.URL || "").trim();
    if (!rawUrl) return;

    let handle = rawUrl
      .replace(/^https?:\/\/[^\/]+\/collections\/?/i, "")
      .replace(/\/+$/, "")
      .toLowerCase()
      .trim();

    if (!handle) return;
    if (seenHandles.has(handle)) return;
    seenHandles.add(handle);

    // Title / Heading
    let rawHeading = cleanText(r.Heading);
    if (!rawHeading) {
      // Derive from SEO title
      const seoRaw = cleanText(r["SEO title"] || "");
      if (seoRaw) {
        rawHeading = seoRaw.split(/[–|—-]/)[0].trim();
      } else {
        rawHeading = handle.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }

    // Clean brand mentions in title if excessive
    let title = rawHeading;
    if (title.length > 120 && title.includes("|")) {
      // Some titles had entire paragraph piped: e.g. "Your Modular Partner | ... | Final Thoughts"
      title = title.split("|")[0].trim();
    }

    const categoryGroup = deriveCategoryGroup(handle, title);
    const tagline = deriveTagline(handle, title, categoryGroup);

    // SEO Title
    let rawSeo = cleanText(r["SEO title"]);
    if (!rawSeo) {
      rawSeo = `${title} – Modular Homes, Prefab Homes, Modular Cabins, Barndominiums, House Kits & Tiny Homes | ModularHome.com`;
    }
    const seo_title = cleanSeoTitle(rawSeo, title);

    // Meta Description
    let rawMeta = cleanText(r["Meta description"]);
    if (!rawMeta) {
      const excerpt = cleanText(r["Content text excerpt (full in JSON)"]);
      rawMeta = excerpt ? excerpt.slice(0, 160) : `Explore ${title}. Factory-direct modular homes, cabins, and barndominiums engineered with premium steel and nationwide delivery.`;
    }
    const seo_description = cleanSeoDescription(rawMeta, title);

    // Description HTML
    const excerpt = r["Content text excerpt (full in JSON)"];
    const description_html = formatHtmlDescription(excerpt, rawMeta, title);

    // Fallback Image
    const fallbackImage = getCategoryFallbackImage(categoryGroup, title, handle);

    collections.push({
      handle,
      title,
      tagline,
      description_html,
      seo_title,
      seo_description,
      canonical_url: `https://modularhome.com/collections/${handle}`,
      published: true,
      image: fallbackImage,
      banner_image: fallbackImage,
      is_featured: idx < 12,
      display_order: idx + 1,
      source_id: `col_book1_${idx + 1}_${handle}`,
      category_group: categoryGroup,
    });
  });

  return collections;
}

async function runImport() {
  console.log("==============================================================================");
  console.log("MODULARHOME BOOK1 COLLECTIONS DATABASE SYNC & SITE CONFIGURATION");
  console.log("==============================================================================");

  const collections = parseBook1Collections();
  console.log(`Parsed ${collections.length} valid collections from Book1.xlsx`);

  // 1. Write to src/data/all_collections.json as reliable fast store
  const targetJsonPath = path.resolve(process.cwd(), "src/data/all_collections.json");
  fs.writeFileSync(targetJsonPath, JSON.stringify(collections, null, 2), "utf8");
  console.log(`✓ Saved ${collections.length} collections to ${targetJsonPath}`);

  // 2. Upsert into Supabase collections table
  if (isSupabaseConfigured()) {
    console.log("\nConnecting to Supabase to upsert collections in batches...");
    let createdOrUpdated = 0;
    const batchSize = 50;

    for (let i = 0; i < collections.length; i += batchSize) {
      const batch = collections.slice(i, i + batchSize).map((c) => ({
        handle: c.handle,
        title: c.title,
        description_html: c.description_html,
        seo_title: c.seo_title,
        seo_description: c.seo_description,
        published: c.published,
        image: c.image,
        banner_image: c.banner_image,
        tagline: c.tagline,
        is_featured: c.is_featured,
        display_order: c.display_order,
        source_id: c.source_id,
        updated_at: new Date().toISOString(),
      }));

      const { data, error } = await supabaseAdmin
        .from("collections")
        .upsert(batch, { onConflict: "handle" });

      if (error) {
        console.error(`Error upserting batch ${i} - ${i + batch.length}:`, error);
      } else {
        createdOrUpdated += batch.length;
        process.stdout.write(`  Upserted ${createdOrUpdated}/${collections.length} collections...\r`);
      }
    }

    console.log(`\n✓ Successfully synced ${createdOrUpdated} collections into Supabase database!`);
  } else {
    console.warn("Supabase is not configured or offline; local store updated.");
  }

  // 3. Update shopify_redirects.json: Remove any /collections/<slug> redirects that exist in Book1
  const redirectsPath = path.resolve(process.cwd(), "src/data/shopify_redirects.json");
  if (fs.existsSync(redirectsPath)) {
    console.log("\nChecking shopify_redirects.json for conflict with live collections...");
    const redirectsData = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));
    const initialCount = Object.keys(redirectsData).length;

    const book1Handles = new Set(collections.map((c) => c.handle.toLowerCase()));
    let removedCount = 0;

    for (const key of Object.keys(redirectsData)) {
      const lowerKey = key.toLowerCase();
      if (lowerKey.startsWith("/collections/")) {
        const slug = lowerKey.replace(/^\/collections\//, "").replace(/\/+$/, "");
        if (book1Handles.has(slug)) {
          delete redirectsData[key];
          removedCount++;
        }
      }
    }

    fs.writeFileSync(redirectsPath, JSON.stringify(redirectsData, null, 2), "utf8");
    console.log(`✓ Removed ${removedCount} collection redirects from shopify_redirects.json (now ${Object.keys(redirectsData).length} remaining).`);
    console.log("  All Book1 collections will now return 200 OK directly with dedicated content!");
  }

  console.log("\nAll Book1 data successfully configured!");
}

if (require.main === module) {
  runImport().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
}
