import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { Client } from "pg";

async function main() {
  console.log("=== DEEP AUDIT OF SOURCE DATA & DATABASE ===");

  const sourceDir = path.resolve(__dirname, "../source");

  // 1. Pages.csv
  const pagesPath = path.join(sourceDir, "Pages.csv");
  let pagesRows: any[] = [];
  if (fs.existsSync(pagesPath)) {
    const wb = XLSX.readFile(pagesPath, { raw: true });
    pagesRows = XLSX.utils.sheet_to_json(wb.Sheets["Pages"] || Object.values(wb.Sheets)[0], { defval: "" });
    console.log(`Pages.csv: ${pagesRows.length} rows`);
    console.log("Pages handles:", pagesRows.map(r => r.Handle));
  }

  // 2. Collections.csv
  const collectionsPath = path.join(sourceDir, "Collections.csv");
  let collectionRows: any[] = [];
  const colDefMap = new Map<string, any>();
  const colProductsMap = new Map<string, Set<string>>();

  if (fs.existsSync(collectionsPath)) {
    const wb = XLSX.readFile(collectionsPath, { raw: true });
    collectionRows = XLSX.utils.sheet_to_json(wb.Sheets["Collections"] || Object.values(wb.Sheets)[0], { defval: "" });
    console.log(`Collections.csv: ${collectionRows.length} rows`);

    let currentHandle = "";
    for (const r of collectionRows) {
      if (r["Handle"]) {
        currentHandle = String(r["Handle"]).trim().toLowerCase();
      }
      if (r["Title"] && !colDefMap.has(currentHandle)) {
        colDefMap.set(currentHandle, r);
      }
      if (!colProductsMap.has(currentHandle)) {
        colProductsMap.set(currentHandle, new Set());
      }

      // Check product linkages in collection rows
      const sortProdHandle = r["Sort: Product Handle"] ? String(r["Sort: Product Handle"]).trim().toLowerCase() : "";
      const condVal = r["Condition: Value"] ? String(r["Condition: Value"]).trim().toLowerCase() : "";
      
      if (sortProdHandle) {
        colProductsMap.get(currentHandle)!.add(sortProdHandle);
      }
      if (condVal && r["Condition: Command"] === "MERGE" && r["Condition: Field"] === "Manual Selection") {
        colProductsMap.get(currentHandle)!.add(condVal);
      }
    }

    console.log(`Found ${colDefMap.size} unique collection definitions:`);
    for (const [h, def] of colDefMap.entries()) {
      const prodCount = colProductsMap.get(h)?.size || 0;
      console.log(`  - [${h}] "${def.Title}": ${prodCount} products listed in Collections.csv`);
    }
  }

  // 3. Products.csv
  const productsPath = path.join(sourceDir, "Products.csv");
  console.log("\nReading Products.csv...");
  const wbProd = XLSX.readFile(productsPath, { raw: true });
  const prodRows: any[] = XLSX.utils.sheet_to_json(wbProd.Sheets["Products"] || Object.values(wbProd.Sheets)[0], { defval: "" });
  console.log(`Products.csv: ${prodRows.length} total rows`);

  const uniqueProductMap = new Map<string, any>();
  const productImagesMap = new Map<string, string[]>();
  const productVariantsMap = new Map<string, any[]>();
  const productCollectionsFromProductRows = new Map<string, Set<string>>();

  let currProdHandle = "";
  for (const r of prodRows) {
    if (r["Handle"]) {
      currProdHandle = String(r["Handle"]).trim().toLowerCase();
    }
    if (!currProdHandle) continue;

    if (r["Title"] && !uniqueProductMap.has(currProdHandle)) {
      uniqueProductMap.set(currProdHandle, r);
    }

    if (!productImagesMap.has(currProdHandle)) {
      productImagesMap.set(currProdHandle, []);
    }
    if (r["Image Src"]) {
      const img = String(r["Image Src"]).trim();
      if (img && !productImagesMap.get(currProdHandle)!.includes(img)) {
        productImagesMap.get(currProdHandle)!.push(img);
      }
    }

    if (!productVariantsMap.has(currProdHandle)) {
      productVariantsMap.set(currProdHandle, []);
    }
    const varPrice = r["Variant Price"];
    const varSku = r["Variant SKU"];
    const varOpt1 = r["Option1 Value"];
    if (varPrice || varSku || varOpt1) {
      productVariantsMap.get(currProdHandle)!.push({
        sku: varSku,
        title: r["Variant Title"] || varOpt1,
        price: varPrice,
        comparePrice: r["Variant Compare At Price"],
        option1: varOpt1,
        option2: r["Option2 Value"],
        option3: r["Option3 Value"],
      });
    }

    // Check Collections column
    const rawCols = r["Collections"] || r["Custom Collections"] || r["Smart Collections"];
    if (rawCols) {
      if (!productCollectionsFromProductRows.has(currProdHandle)) {
        productCollectionsFromProductRows.set(currProdHandle, new Set());
      }
      String(rawCols).split(",").forEach(c => {
        const clean = c.trim().toLowerCase();
        if (clean) productCollectionsFromProductRows.get(currProdHandle)!.add(clean);
      });
    }
  }

  console.log(`Unique products in Products.csv: ${uniqueProductMap.size}`);

  // Sample 5 products to inspect their titles, descriptions, and specs
  console.log("\n--- Sample 5 Products from Products.csv ---");
  let sampleCount = 0;
  for (const [h, p] of uniqueProductMap.entries()) {
    if (sampleCount >= 5) break;
    console.log(`\nProduct [${h}]:`);
    console.log(`  Title: ${p.Title}`);
    console.log(`  Type: ${p.Type || p["Product Type"]}`);
    console.log(`  Tags: ${p.Tags}`);
    console.log(`  Images count: ${productImagesMap.get(h)?.length || 0}`);
    console.log(`  Variants count: ${productVariantsMap.get(h)?.length || 0}`);
    console.log(`  Variant prices: ${JSON.stringify(productVariantsMap.get(h)?.map(v => v.price))}`);
    console.log(`  Body HTML snippet: ${String(p["Body HTML"] || "").slice(0, 300)}...`);
    sampleCount++;
  }

  // 4. Connect to Postgres to check DB counts
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    await client.connect();

    console.log("\n=== DATABASE COUNTS ===");
    const tables = [
      "collections",
      "products",
      "product_variants",
      "product_media",
      "product_collections",
      "pages",
      "redirects",
      "url_migrations",
      "floor_plans"
    ];

    for (const t of tables) {
      const res = await client.query(`SELECT count(*) FROM "${t}";`);
      console.log(`  Table [${t}]: ${res.rows[0].count} rows`);
    }

    // Check collection product counts in DB
    const colCounts = await client.query(`
      SELECT c.handle, c.title, count(pc.product_id) as prod_count
      FROM collections c
      LEFT JOIN product_collections pc ON pc.collection_id = c.id
      GROUP BY c.id, c.handle, c.title
      ORDER BY prod_count DESC;
    `);
    console.log("\nDB Collection Counts:");
    console.table(colCounts.rows);

    await client.end();
  }
}

main().catch(console.error);
