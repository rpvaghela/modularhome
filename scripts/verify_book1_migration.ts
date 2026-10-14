import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";
import { getPublicCollections, getPublicCollectionBySlug } from "../src/lib/publicData";
import sitemap from "../src/app/sitemap";

async function main() {
  console.log("==============================================================================");
  console.log("BOOK1 COLLECTIONS & SEO REDIRECTS COMPREHENSIVE VERIFICATION");
  console.log("==============================================================================");

  // 1. Verify Book1.xlsx source count
  const book1Path = path.resolve(process.cwd(), "migration/Book1.xlsx");
  const wb = xlsx.readFile(book1Path);
  const rawRows = xlsx.utils.sheet_to_json<any>(wb.Sheets["Collections"]);
  console.log(`✓ 1. Book1.xlsx loaded: ${rawRows.length} source collections.`);

  // 2. Verify all_collections.json
  const jsonPath = path.resolve(process.cwd(), "src/data/all_collections.json");
  const jsonCols = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`✓ 2. all_collections.json verified: ${jsonCols.length} collections stored.`);

  // 3. Verify getPublicCollections()
  const publicCols = await getPublicCollections();
  console.log(`✓ 3. getPublicCollections() returned: ${publicCols.length} collections.`);
  if (publicCols.length < 413) {
    throw new Error(`Expected at least 413 collections, got ${publicCols.length}`);
  }

  // 4. Test Sample Lookups
  const sampleSlugs = [
    "2-bedroom-turnkey-homes",
    "3-bedroom-turnkey-homes",
    "amish-built-homes-and-amish-built-houses",
    "cabin-builders-in-alabama",
    "barndo-kits-barndo-house-kits",
    "prefab-homes",
    "a-frame-cabins-aframe-cabins",
    "all",
  ];

  console.log("\n✓ 4. Testing Sample Collections Resolution & SEO Metadata:");
  for (const s of sampleSlugs) {
    const col = await getPublicCollectionBySlug(s);
    if (!col) {
      throw new Error(`Failed to resolve collection for slug: ${s}`);
    }
    console.log(`  - [${s}]:`);
    console.log(`    Title: "${col.name}"`);
    console.log(`    SEO Title: "${col.seoTitle?.slice(0, 60)}..."`);
    console.log(`    Meta Desc: "${col.metaDescription?.slice(0, 60)}..."`);
    console.log(`    Canonical: "${col.canonicalUrl || 'default'}"`);
    console.log(`    Products Count: ${col.productCount || col.products?.length || 0}`);
  }

  // 5. Verify shopify_redirects.json
  const redirectsPath = path.resolve(process.cwd(), "src/data/shopify_redirects.json");
  const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));
  const book1Handles = new Set(rawRows.map((r: any) => {
    return (r.URL || "").replace(/^https?:\/\/[^\/]+\/collections\/?/i, "").replace(/\/+$/, "").toLowerCase();
  }));

  let conflictingRedirects = 0;
  for (const k of Object.keys(redirects)) {
    const lower = k.toLowerCase();
    if (lower.startsWith("/collections/")) {
      const slug = lower.replace(/^\/collections\//, "").replace(/\/+$/, "");
      if (book1Handles.has(slug)) {
        conflictingRedirects++;
      }
    }
  }
  console.log(`\n✓ 5. shopify_redirects.json check: ${conflictingRedirects} conflicting collection redirects found.`);
  if (conflictingRedirects > 0) {
    throw new Error(`Found ${conflictingRedirects} conflicting collection redirects!`);
  }

  // 6. Verify Sitemap Generation
  console.log("\n✓ 6. Testing sitemap() generation:");
  const sm = await sitemap();
  const smCollectionUrls = sm.filter((item) => item.url.includes("/collections/"));
  console.log(`  Total URLs in Sitemap: ${sm.length}`);
  console.log(`  Collection URLs in Sitemap: ${smCollectionUrls.length}`);
  if (smCollectionUrls.length < 413) {
    throw new Error(`Expected at least 413 collection URLs in sitemap, got ${smCollectionUrls.length}`);
  }

  console.log("\n==============================================================================");
  console.log("ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!");
  console.log("==============================================================================");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
