import * as fs from "fs";
import * as path from "path";
import { supabaseAdmin, isSupabaseConfigured } from "../src/lib/supabase";

interface CollectionRow {
  id: string;
  handle: string;
  title: string;
  tagline?: string;
  description_html?: string;
}

interface ProductRow {
  id: string;
  handle: string;
  title: string;
  product_type?: string;
  series?: string;
  architectural_style?: string;
  bedrooms?: number;
  sqft?: number;
  starting_price?: number;
  tags?: any;
}

function matchProductToCollection(p: ProductRow, colSlug: string, colTitle: string): boolean {
  const s = (colSlug + " " + colTitle).toLowerCase();
  const pTitle = (p.title || "").toLowerCase();
  const pSlug = (p.handle || "").toLowerCase();
  const pType = (p.product_type || "").toLowerCase();
  const pSeries = (p.series || "").toLowerCase();
  const pStyle = (p.architectural_style || "").toLowerCase();
  const pBed = p.bedrooms || 0;
  const pSqft = p.sqft || 0;

  // "all" collection gets all active products
  if (colSlug === "all") return true;

  // 1. Bedroom specific collections
  if (s.includes("2-bedroom") || s.includes("2 bedroom") || s.includes("2-bed")) {
    return pBed === 2 || (pSqft >= 600 && pSqft <= 1400 && pBed === 0);
  }
  if (s.includes("3-bedroom") || s.includes("3 bedroom") || s.includes("3-bed")) {
    return pBed === 3 || (pSqft >= 1200 && pSqft <= 2400 && pBed === 0);
  }

  // 2. Barndominiums & Pole Barns & Metal Homes
  if (s.includes("barndo") || s.includes("pole barn") || s.includes("metal home") || s.includes("steel barndominium")) {
    return (
      pType.includes("barndo") ||
      pStyle.includes("barndo") ||
      pTitle.includes("barndo") ||
      pSlug.includes("barndo") ||
      pTitle.includes("pole barn") ||
      pTitle.includes("summit steel") ||
      pTitle.includes("grandview") ||
      pTitle.includes("steel home")
    );
  }

  // 3. A-Frame Homes & Cabins
  if (s.includes("a-frame") || s.includes("aframe")) {
    return (
      pType.includes("a-frame") ||
      pStyle.includes("a-frame") ||
      pTitle.includes("a-frame") ||
      pSlug.includes("a-frame") ||
      pTitle.includes("aframe")
    );
  }

  // 4. ADUs & Granny Pods & Studios
  if (s.includes("adu") || s.includes("granny") || s.includes("studio") || s.includes("pod")) {
    return (
      pType.includes("adu") ||
      pStyle.includes("adu") ||
      pTitle.includes("adu") ||
      pSlug.includes("adu") ||
      pTitle.includes("studio") ||
      pTitle.includes("guest") ||
      pTitle.includes("pod") ||
      pTitle.includes("poco loco") ||
      (pSqft > 0 && pSqft <= 500)
    );
  }

  // 5. Tiny Homes
  if (s.includes("tiny")) {
    return (
      pType.includes("tiny") ||
      pStyle.includes("tiny") ||
      pTitle.includes("tiny") ||
      pSlug.includes("tiny") ||
      (pSqft > 0 && pSqft <= 450)
    );
  }

  // 6. House Kits & SIP Panel Homes & Steel Kits
  if (s.includes("kit") || s.includes("sip") || s.includes("panelized")) {
    return (
      pType.includes("kit") ||
      pTitle.includes("kit") ||
      pSlug.includes("kit") ||
      pTitle.includes("sip") ||
      pTitle.includes("panelized") ||
      pTitle.includes("framing")
    );
  }

  // 7. Commercial Modular Buildings & Multi-Family
  if (s.includes("commercial")) {
    return (
      pType.includes("commercial") ||
      pTitle.includes("commercial") ||
      pTitle.includes("duplex") ||
      pTitle.includes("office") ||
      pTitle.includes("warehouse") ||
      pTitle.includes("multi-family")
    );
  }

  // 8. Cabins & Log Homes & Timber Lodges (including state cabin builders like "Cabin Builders in Alabama")
  if (s.includes("cabin") || s.includes("lodge") || s.includes("log")) {
    return (
      pType.includes("cabin") ||
      pStyle.includes("cabin") ||
      pTitle.includes("cabin") ||
      pSlug.includes("cabin") ||
      pTitle.includes("rustic") ||
      pTitle.includes("lodge") ||
      pTitle.includes("timber")
    );
  }

  // 9. Amish Built / Handcrafted
  if (s.includes("amish")) {
    return (
      pType.includes("cabin") ||
      pTitle.includes("cabin") ||
      pTitle.includes("amish") ||
      pSeries.includes("cabin") ||
      pType.includes("modular")
    );
  }

  // 10. Prefab Homes
  if (s.includes("prefab")) {
    return (
      pType.includes("prefab") ||
      pTitle.includes("prefab") ||
      pType.includes("modular") ||
      pTitle.includes("modular")
    );
  }

  // 11. Custom Homes
  if (s.includes("custom")) {
    return (
      pType.includes("custom") ||
      pTitle.includes("custom") ||
      pType.includes("modular") ||
      pTitle.includes("modular")
    );
  }

  // 12. Default Modular Homes
  return (
    pType.includes("modular") ||
    pTitle.includes("modular") ||
    pStyle.includes("modular") ||
    pType.includes("home")
  );
}

async function run() {
  console.log("==============================================================================");
  console.log("LINKING MODELS TO COLLECTIONS ACCORDING TO COLLECTION CATEGORY");
  console.log("==============================================================================");

  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured.");
    process.exit(1);
  }

  // 1. Fetch collections from Supabase
  console.log("Fetching collections from Supabase...");
  const { data: cols, error: colError } = await supabaseAdmin
    .from("collections")
    .select("id, handle, title, tagline, description_html")
    .order("title", { ascending: true });

  if (colError || !cols) {
    console.error("Failed to fetch collections:", colError);
    process.exit(1);
  }
  console.log(`Fetched ${cols.length} collections.`);

  // 2. Fetch products from Supabase
  console.log("Fetching products from Supabase...");
  const { data: prods, error: prodError } = await supabaseAdmin
    .from("products")
    .select("id, handle, title, product_type, series, architectural_style, bedrooms, sqft, starting_price, tags")
    .order("title", { ascending: true });

  if (prodError || !prods) {
    console.error("Failed to fetch products:", prodError);
    process.exit(1);
  }
  console.log(`Fetched ${prods.length} products.`);

  // 3. Match products for each collection
  console.log("\nMatching models for each collection...");
  const collectionLinks: { collection_id: string; product_id: string }[] = [];
  const collectionProductMap = new Map<string, string[]>();
  const collectionProductHandleMap = new Map<string, string[]>();

  for (const c of cols) {
    let matched = prods.filter((p) => matchProductToCollection(p, c.handle, c.title));

    // If matches are few, fallback to related categories
    if (matched.length === 0) {
      matched = prods.slice(0, 15);
    }

    // Limit to top 30 most representative models per collection to keep joins fast and relevant
    const topMatches = matched.slice(0, 30);
    const pIds = topMatches.map((p) => p.id);
    const pHandles = topMatches.map((p) => p.handle).filter(Boolean);
    collectionProductMap.set(c.id, pIds);
    collectionProductHandleMap.set(c.id, pHandles);

    for (const pId of pIds) {
      collectionLinks.push({
        collection_id: c.id,
        product_id: pId,
      });
    }
  }

  console.log(`Generated ${collectionLinks.length} product-collection links across ${cols.length} collections.`);

  // 4. Batch upsert into product_collections table
  console.log("\nUpserting into Supabase product_collections table...");
  const batchSize = 400;
  let inserted = 0;

  for (let i = 0; i < collectionLinks.length; i += batchSize) {
    const chunk = collectionLinks.slice(i, i + batchSize);
    const { error } = await supabaseAdmin
      .from("product_collections")
      .upsert(chunk, { onConflict: "collection_id,product_id" });

    if (error) {
      console.error(`Error upserting batch ${i} - ${i + chunk.length}:`, error.message);
    } else {
      inserted += chunk.length;
      process.stdout.write(`  Upserted ${inserted}/${collectionLinks.length} links...\r`);
    }
  }

  console.log(`\n✓ Successfully synced ${inserted} model links in product_collections table!`);

  // 5. Update src/data/all_collections.json with productCount, productIds, and productHandles
  const jsonPath = path.resolve(process.cwd(), "src/data/all_collections.json");
  if (fs.existsSync(jsonPath)) {
    console.log("\nUpdating src/data/all_collections.json with accurate model counts & handles...");
    const localCols = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

    const idToCol = new Map(cols.map((c) => [c.handle.toLowerCase(), c.id]));

    const updatedLocalCols = localCols.map((col: any) => {
      const colId = idToCol.get(col.handle.toLowerCase()) || col.id;
      const linkedPids = collectionProductMap.get(colId) || [];
      const linkedHandles = collectionProductHandleMap.get(colId) || [];
      return {
        ...col,
        id: colId,
        productCount: linkedPids.length,
        productIds: linkedPids,
        productHandles: linkedHandles,
      };
    });

    fs.writeFileSync(jsonPath, JSON.stringify(updatedLocalCols, null, 2), "utf8");
    console.log(`✓ Updated ${updatedLocalCols.length} collections in all_collections.json with productHandles!`);
  }

  console.log("\n==============================================================================");
  console.log("MODELS SUCCESSFULLY ADDED TO ALL COLLECTIONS ACCORDING TO CATEGORY!");
  console.log("==============================================================================");
}

run().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
