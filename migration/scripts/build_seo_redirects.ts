import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";
import { resolveSimilarCategoryPath, CATEGORY_SLUG_MAP } from "../../src/utils/productUrls";

const WORKBOOK_PATH = path.resolve(process.cwd(), "migration/ModularHome_SEO_Blog_Migration_Workbook.xlsx");
const REDIRECTS_PATH = path.resolve(process.cwd(), "src/data/shopify_redirects.json");
const CATALOG_PATH = path.resolve(process.cwd(), "src/data/all_products_catalog.json");
const BLOGS_PATH = path.resolve(process.cwd(), "src/data/custom_blogs.json");

interface CatalogItem {
  id?: string | number;
  handle?: string;
  slug?: string;
  title?: string;
  category?: string;
}

interface BlogItem {
  id?: string | number;
  slug?: string;
  title?: string;
  category?: string;
}

function getProductCategorySlug(p: CatalogItem): string {
  const cat = (p.category || "").toLowerCase();
  if (cat.includes("barndo")) return "barndominiums";
  if (cat.includes("cabin")) return "cabins";
  if (cat.includes("tiny")) return "tiny-homes";
  if (cat.includes("park") || cat.includes("rv")) return "park-models";
  if (cat.includes("adu") || cat.includes("granny")) return "adus";
  if (cat.includes("a-frame") || cat.includes("aframe")) return "a-frame-homes";
  if (cat.includes("kit") || cat.includes("sip")) return "house-kits";
  if (cat.includes("commercial")) return "commercial-modular-buildings";
  if (cat.includes("custom")) return "custom-homes";
  if (cat.includes("prefab")) return "prefab-homes";
  return "modular-homes";
}

function normalizePath(raw: string): string {
  if (!raw) return "";
  let p = raw.trim();
  if (p.startsWith("http://") || p.startsWith("https://")) {
    try {
      const u = new URL(p);
      p = u.pathname;
    } catch {
      return "";
    }
  }
  p = p.split("?")[0].split("#")[0];
  if (!p.startsWith("/")) p = "/" + p;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p.toLowerCase();
}

function normalizeTarget(raw: string): string {
  if (!raw) return "/modular-homes";
  let target = raw.trim();
  if (target.startsWith("http://") || target.startsWith("https://")) {
    try {
      const u = new URL(target);
      if (u.hostname.includes("modularhome") || u.hostname.includes("shopify")) {
        target = u.pathname;
      } else {
        return target; // external url
      }
    } catch {
      return "/modular-homes";
    }
  }
  target = target.split("?")[0].split("#")[0];
  if (!target.startsWith("/")) target = "/" + target;
  if (target.length > 1 && target.endsWith("/")) target = target.slice(0, -1);

  // Normalize commercial buildings
  if (target === "/commercial-buildings" || target.startsWith("/commercial-buildings/")) {
    target = target.replace(/^\/commercial-buildings/, "/commercial-modular-buildings");
  }

  return target;
}

async function run() {
  console.log("Reading data...");
  const existingRedirects: Record<string, string> = JSON.parse(fs.readFileSync(REDIRECTS_PATH, "utf8"));
  console.log("Current redirects in json:", Object.keys(existingRedirects).length);

  const catalog: CatalogItem[] = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const catalogByHandle = new Map<string, CatalogItem>();
  for (const item of catalog) {
    if (item.handle) catalogByHandle.set(item.handle.toLowerCase(), item);
    if (item.slug) catalogByHandle.set(item.slug.toLowerCase(), item);
  }

  let blogs: BlogItem[] = [];
  if (fs.existsSync(BLOGS_PATH)) {
    blogs = JSON.parse(fs.readFileSync(BLOGS_PATH, "utf8"));
  }
  const blogsBySlug = new Map<string, BlogItem>();
  for (const b of blogs) {
    if (b.slug) blogsBySlug.set(b.slug.toLowerCase(), b);
  }

  const wb = xlsx.readFile(WORKBOOK_PATH);

  const finalRedirects: Record<string, string> = {};

  // 1. Seed with existing redirects
  for (const [from, to] of Object.entries(existingRedirects)) {
    const cleanFrom = normalizePath(from);
    const cleanTo = normalizeTarget(to);
    if (cleanFrom && cleanTo && cleanFrom !== cleanTo) {
      finalRedirects[cleanFrom] = cleanTo;
    }
  }

  // 2. Existing Redirects sheet from workbook (explicit high priority)
  if (wb.Sheets["Existing Redirects"]) {
    const rows = xlsx.utils.sheet_to_json<any>(wb.Sheets["Existing Redirects"]);
    for (const r of rows) {
      const from = normalizePath(r["Existing path"] || "");
      let to = normalizeTarget(r["Existing target"] || "");
      if (from) {
        if (to.startsWith("/collections/")) {
          const colSlug = to.replace(/^\/collections\//, "");
          to = resolveSimilarCategoryPath(colSlug);
        } else if (to.startsWith("/products/")) {
          const prodSlug = to.replace(/^\/products\//, "");
          const match = catalogByHandle.get(prodSlug);
          if (match) {
            to = `/${getProductCategorySlug(match)}/${match.slug || match.handle}`;
          } else {
            to = resolveSimilarCategoryPath(prodSlug);
          }
        }
        if (from !== to) {
          finalRedirects[from] = to;
        }
      }
    }
  }

  // Helper to map a path and title to its target
  function resolveTarget(p: string, title?: string): string {
    const clean = normalizePath(p);
    const slug = clean.split("/").pop() || "";
    const cleanTitle = (title || "")
      .replace(/[–-]\s*modular homes.*$/i, "")
      .replace(/\|\s*modularhome\.com.*$/i, "")
      .replace(/[–-]\s*modularhome\.com.*$/i, "")
      .trim();
    const combined = `${slug} ${cleanTitle}`.trim();

    // Product URLs
    if (clean.startsWith("/products/")) {
      const match = catalogByHandle.get(slug);
      if (match) {
        return `/${getProductCategorySlug(match)}/${match.slug || match.handle}`;
      }
      return resolveSimilarCategoryPath(combined);
    }

    // Collection URLs
    if (clean.startsWith("/collections/")) {
      if (slug === "all") return "/collections/all";
      return resolveSimilarCategoryPath(combined);
    }

    // Blog / Article URLs
    if (clean.startsWith("/blogs/")) {
      const articleMatch = blogsBySlug.get(slug);
      if (articleMatch) {
        const cat = (articleMatch.category || "modular-cabins").toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return `/blogs/${cat}/${articleMatch.slug}`;
      }
      // If index
      if (clean === "/blogs" || clean === "/blogs/all") return "/blogs";
      return resolveSimilarCategoryPath(combined);
    }

    // Page URLs
    if (clean.startsWith("/pages/")) {
      if (slug === "contact") return "/quote";
      if (slug.includes("finance")) return "/financing";
      if (slug.includes("pricing") || slug.includes("cost")) return "/pricing";
      if (slug.includes("privacy")) return "/privacy-policy";
      if (slug.includes("about")) return "/how-it-works";
      return resolveSimilarCategoryPath(combined);
    }

    // Other / Root / Policies
    if (clean === "/" || clean === "") return "/";
    if (clean.includes("privacy")) return "/privacy-policy";
    if (clean.includes("terms")) return "/terms-of-service";
    if (clean.includes("refund")) return "/refund-cancellation-policy";
    if (clean.includes("shipping")) return "/shipping-delivery-policy";

    return resolveSimilarCategoryPath(combined);
  }

  // 3. Admin SEO sheet
  if (wb.Sheets["Admin SEO"]) {
    const rows = xlsx.utils.sheet_to_json<any>(wb.Sheets["Admin SEO"]);
    console.log("Processing Admin SEO rows:", rows.length);
    for (const r of rows) {
      const p = normalizePath(r.URL || (r.Handle ? `/${r.Type}/${r.Handle}` : ""));
      if (!p || p === "/" || p.includes("/cdn/shop/")) continue;
      const target = resolveTarget(p, r["Content title"]);
      if (target && p !== target) {
        finalRedirects[p] = target;
      }
    }
  }

  // 4. Collections sheet
  if (wb.Sheets["Collections"]) {
    const rows = xlsx.utils.sheet_to_json<any>(wb.Sheets["Collections"]);
    console.log("Processing Collections rows:", rows.length);
    for (const r of rows) {
      const p = normalizePath(r.URL || "");
      if (!p || p === "/" || p === "/collections/all") continue;
      const target = resolveTarget(p, r.Heading || r["SEO title"]);
      if (target && p !== target) {
        finalRedirects[p] = target;
      }
    }
  }

  // 5. Pages sheet
  if (wb.Sheets["Pages"]) {
    const rows = xlsx.utils.sheet_to_json<any>(wb.Sheets["Pages"]);
    console.log("Processing Pages rows:", rows.length);
    for (const r of rows) {
      const p = normalizePath(r.URL || "");
      if (!p || p === "/") continue;
      const target = resolveTarget(p, r.Heading || r["SEO title"]);
      if (target && p !== target) {
        finalRedirects[p] = target;
      }
    }
  }

  // 6. Blogs sheet
  if (wb.Sheets["Blogs"]) {
    const rows = xlsx.utils.sheet_to_json<any>(wb.Sheets["Blogs"]);
    console.log("Processing Blogs rows:", rows.length);
    for (const r of rows) {
      const p = normalizePath(r["Existing URL"] || "");
      if (!p || p === "/") continue;
      const target = resolveTarget(p, r.Heading || r["SEO title"]);
      if (target && p !== target) {
        finalRedirects[p] = target;
      }
    }
  }

  // 7. URL Mapping sheet
  if (wb.Sheets["URL Mapping"]) {
    const rows = xlsx.utils.sheet_to_json<any>(wb.Sheets["URL Mapping"]);
    console.log("Processing URL Mapping rows:", rows.length);
    for (const r of rows) {
      const p = normalizePath(r["Existing URL"] || "");
      if (!p || p === "/" || p.includes(".xml") || p.includes("agents.md")) continue;
      if (!finalRedirects[p]) {
        const target = resolveTarget(p, r.Heading);
        if (target && p !== target) {
          finalRedirects[p] = target;
        }
      }
    }
  }

  // 8. Issues sheet
  if (wb.Sheets["Issues"]) {
    const rows = xlsx.utils.sheet_to_json<any>(wb.Sheets["Issues"]);
    console.log("Processing Issues rows:", rows.length);
    for (const r of rows) {
      const p = normalizePath(r.URL || "");
      if (!p || p === "/") continue;
      if (!finalRedirects[p]) {
        const target = resolveTarget(p);
        if (target && p !== target) {
          finalRedirects[p] = target;
        }
      }
    }
  }

  // 9. SEO Inventory sheet
  if (wb.Sheets["SEO Inventory"]) {
    const rows = xlsx.utils.sheet_to_json<any>(wb.Sheets["SEO Inventory"]);
    console.log("Processing SEO Inventory rows:", rows.length);
    for (const r of rows) {
      const p = normalizePath(r["Existing URL"] || "");
      if (!p || p === "/" || p.includes(".xml")) continue;
      if (!finalRedirects[p]) {
        const target = resolveTarget(p, r.H1 || r["SEO title rendered"]);
        if (target && p !== target) {
          finalRedirects[p] = target;
        }
      }
    }
  }

  // 10. Flatten multi-hop redirects and eliminate loops
  console.log("Flattening redirect chains...");
  const keys = Object.keys(finalRedirects);
  for (const from of keys) {
    let curr = finalRedirects[from];
    let hops = 0;
    while (finalRedirects[curr] && hops < 5) {
      if (finalRedirects[curr] === from || finalRedirects[curr] === curr) break;
      curr = finalRedirects[curr];
      hops++;
    }
    finalRedirects[from] = curr;
  }

  // Clean self-redirects
  for (const [from, to] of Object.entries(finalRedirects)) {
    if (from === to) {
      delete finalRedirects[from];
    }
  }

  console.log("Total finalized redirects:", Object.keys(finalRedirects).length);

  // Sort keys alphabetically for clean diffs
  const sorted: Record<string, string> = {};
  for (const k of Object.keys(finalRedirects).sort()) {
    sorted[k] = finalRedirects[k];
  }

  fs.writeFileSync(REDIRECTS_PATH, JSON.stringify(sorted, null, 2) + "\n", "utf8");
  console.log("Successfully written to", REDIRECTS_PATH);
}

run().catch((err) => {
  console.error("Error building redirects:", err);
  process.exit(1);
});
