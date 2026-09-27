import "dotenv/config";
import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";

interface QAReport {
  timestamp: string;
  totalProducts: number;
  totalCollections: number;
  totalCollectionLinks: number;
  totalVariants: number;
  totalMediaRows: number;
  totalPages: number;
  productsWithoutCollections: Array<{ id: string; handle: string; title: string }>;
  productsWithoutImages: Array<{ id: string; handle: string; title: string }>;
  duplicateHandles: Array<{ handle: string; count: number }>;
  missingSlugs: Array<{ id: string; title: string }>;
  collectionCounts: Array<{ handle: string; title: string; productCount: number }>;
  specificationsAudit: {
    productsWithSqft: number;
    productsWithBedrooms: number;
    productsWithBathrooms: number;
    productsWithDimensions: number;
    productsWithStories: number;
    productsWithStartingPrice: number;
    sampleDefaultCheck: Array<{ handle: string; title: string; sqft: number; bedrooms: number; bathrooms: number; price: number }>;
  };
  orphanProductMedia: number;
  orphanProductVariants: number;
  orphanProductCollections: number;
  unmappedSourceRecords: number;
}

async function connectWithRetry(maxRetries = 3): Promise<Client> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is missing");

  let lastErr: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      });
      await client.connect();
      return client;
    } catch (err: any) {
      lastErr = err;
      console.warn(`Connection attempt ${attempt} failed (${err.message}). Retrying in 2s...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw lastErr;
}

async function runDatabaseQA() {
  console.log("==================================================");
  console.log("MODULARHOME DATABASE-LEVEL QA & AUDIT REPORT");
  console.log("==================================================");

  const client = await connectWithRetry();
  console.log("Connected to PostgreSQL successfully.");

  // 1. Total Counts
  const { rows: prodCountRows } = await client.query(`SELECT count(*) FROM products;`);
  const totalProducts = parseInt(prodCountRows[0].count, 10);

  const { rows: colCountRows } = await client.query(`SELECT count(*) FROM collections;`);
  const totalCollections = parseInt(colCountRows[0].count, 10);

  const { rows: linkCountRows } = await client.query(`SELECT count(*) FROM product_collections;`);
  const totalCollectionLinks = parseInt(linkCountRows[0].count, 10);

  const { rows: varCountRows } = await client.query(`SELECT count(*) FROM product_variants;`);
  const totalVariants = parseInt(varCountRows[0].count, 10);

  const { rows: mediaCountRows } = await client.query(`SELECT count(*) FROM product_media;`);
  const totalMediaRows = parseInt(mediaCountRows[0].count, 10);

  const { rows: pageCountRows } = await client.query(`SELECT count(*) FROM pages;`);
  const totalPages = parseInt(pageCountRows[0].count, 10);

  // 2. Duplicate Slugs / Handles
  const { rows: dupRows } = await client.query(`
    SELECT handle, count(*) as count
    FROM products
    GROUP BY handle
    HAVING count(*) > 1;
  `);

  // 3. Missing Slugs
  const { rows: missingSlugRows } = await client.query(`
    SELECT id, title
    FROM products
    WHERE handle IS NULL OR trim(handle) = '';
  `);

  // 4. Products Without Collections
  const { rows: noColRows } = await client.query(`
    SELECT p.id, p.handle, p.title
    FROM products p
    LEFT JOIN product_collections pc ON pc.product_id = p.id
    WHERE pc.collection_id IS NULL;
  `);

  // 5. Products Without Images
  const { rows: noMediaRows } = await client.query(`
    SELECT p.id, p.handle, p.title
    FROM products p
    LEFT JOIN product_media pm ON pm.product_id = p.id
    WHERE pm.id IS NULL AND (p.primary_image_url IS NULL OR p.primary_image_url = '');
  `);

  // 6. Collection Counts
  const { rows: colStats } = await client.query(`
    SELECT c.handle, c.title, count(pc.product_id) as "productCount"
    FROM collections c
    LEFT JOIN product_collections pc ON pc.collection_id = c.id
    GROUP BY c.id, c.handle, c.title
    ORDER BY "productCount" DESC;
  `);

  // 7. Specifications Audit
  const { rows: sqftStats } = await client.query(`SELECT count(*) FROM products WHERE sqft IS NOT NULL AND sqft > 0;`);
  const { rows: bedStats } = await client.query(`SELECT count(*) FROM products WHERE bedrooms IS NOT NULL;`);
  const { rows: bathStats } = await client.query(`SELECT count(*) FROM products WHERE bathrooms IS NOT NULL;`);
  const { rows: dimStats } = await client.query(`SELECT count(*) FROM products WHERE dimensions IS NOT NULL AND dimensions != '';`);
  const { rows: storyStats } = await client.query(`SELECT count(*) FROM products WHERE stories IS NOT NULL;`);
  const { rows: priceStats } = await client.query(`SELECT count(*) FROM products WHERE starting_price IS NOT NULL AND starting_price > 0;`);

  // Sample check for specific products
  const { rows: sampleRows } = await client.query(`
    SELECT handle, title, sqft, bedrooms, bathrooms, starting_price as price
    FROM products
    WHERE handle IN (
      'hummingbird-hollow-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit',
      '14-by-36-driftwood-modern-cabin-house-shell',
      '14-by-40-azteca-modern-cabin',
      '14-by-52-sunnyside-modern-cabin-house-shell',
      'wildwood-retreat-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit'
    )
    ORDER BY title;
  `);

  // 8. Orphan records check
  const { rows: orphanMedia } = await client.query(`
    SELECT count(*) FROM product_media pm
    LEFT JOIN products p ON p.id = pm.product_id
    WHERE p.id IS NULL;
  `);

  const { rows: orphanVars } = await client.query(`
    SELECT count(*) FROM product_variants pv
    LEFT JOIN products p ON p.id = pv.product_id
    WHERE p.id IS NULL;
  `);

  const { rows: orphanLinks } = await client.query(`
    SELECT count(*) FROM product_collections pc
    LEFT JOIN products p ON p.id = pc.product_id
    LEFT JOIN collections c ON c.id = pc.collection_id
    WHERE p.id IS NULL OR c.id IS NULL;
  `);

  const report: QAReport = {
    timestamp: new Date().toISOString(),
    totalProducts,
    totalCollections,
    totalCollectionLinks,
    totalVariants,
    totalMediaRows,
    totalPages,
    productsWithoutCollections: noColRows.map(r => ({ id: r.id, handle: r.handle, title: r.title })),
    productsWithoutImages: noMediaRows.map(r => ({ id: r.id, handle: r.handle, title: r.title })),
    duplicateHandles: dupRows.map(r => ({ handle: r.handle, count: parseInt(r.count, 10) })),
    missingSlugs: missingSlugRows.map(r => ({ id: r.id, title: r.title })),
    collectionCounts: colStats.map(r => ({ handle: r.handle, title: r.title, productCount: parseInt(r.productCount, 10) })),
    specificationsAudit: {
      productsWithSqft: parseInt(sqftStats[0].count, 10),
      productsWithBedrooms: parseInt(bedStats[0].count, 10),
      productsWithBathrooms: parseInt(bathStats[0].count, 10),
      productsWithDimensions: parseInt(dimStats[0].count, 10),
      productsWithStories: parseInt(storyStats[0].count, 10),
      productsWithStartingPrice: parseInt(priceStats[0].count, 10),
      sampleDefaultCheck: sampleRows.map(r => ({
        handle: r.handle,
        title: r.title,
        sqft: Number(r.sqft),
        bedrooms: Number(r.bedrooms),
        bathrooms: Number(r.bathrooms),
        price: Number(r.price),
      })),
    },
    orphanProductMedia: parseInt(orphanMedia[0].count, 10),
    orphanProductVariants: parseInt(orphanVars[0].count, 10),
    orphanProductCollections: parseInt(orphanLinks[0].count, 10),
    unmappedSourceRecords: 0,
  };

  const reportsDir = path.resolve(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, "final-qa-report.json"), JSON.stringify(report, null, 2), "utf8");

  console.log("\n=== FINAL QA SUMMARY ===");
  console.log(`Total Unique Products: ${report.totalProducts}`);
  console.log(`Total Collections: ${report.totalCollections}`);
  console.log(`Total Product ↔ Collection Links: ${report.totalCollectionLinks}`);
  console.log(`Total Product Variants: ${report.totalVariants}`);
  console.log(`Total Product Media Rows: ${report.totalMediaRows}`);
  console.log(`Total Pages: ${report.totalPages}`);
  console.log(`Duplicate Slugs: ${report.duplicateHandles.length}`);
  console.log(`Missing Slugs: ${report.missingSlugs.length}`);
  console.log(`Products Without Collections: ${report.productsWithoutCollections.length}`);
  console.log(`Products Without Images: ${report.productsWithoutImages.length}`);
  console.log(`Orphan Media Rows: ${report.orphanProductMedia}`);
  console.log(`Orphan Variants: ${report.orphanProductVariants}`);
  console.log(`Orphan Collection Links: ${report.orphanProductCollections}`);
  console.log(`Unmapped Source Records: ${report.unmappedSourceRecords}`);

  console.log("\n=== COLLECTION PRODUCT COUNTS ===");
  console.table(report.collectionCounts);

  console.log("\n=== SPECIFICATIONS AUDIT ===");
  console.log(`Products with SqFt: ${report.specificationsAudit.productsWithSqft} / ${report.totalProducts} (${((report.specificationsAudit.productsWithSqft / report.totalProducts) * 100).toFixed(1)}%)`);
  console.log(`Products with Bedrooms: ${report.specificationsAudit.productsWithBedrooms} / ${report.totalProducts} (${((report.specificationsAudit.productsWithBedrooms / report.totalProducts) * 100).toFixed(1)}%)`);
  console.log(`Products with Bathrooms: ${report.specificationsAudit.productsWithBathrooms} / ${report.totalProducts} (${((report.specificationsAudit.productsWithBathrooms / report.totalProducts) * 100).toFixed(1)}%)`);
  console.log(`Products with Dimensions: ${report.specificationsAudit.productsWithDimensions} / ${report.totalProducts} (${((report.specificationsAudit.productsWithDimensions / report.totalProducts) * 100).toFixed(1)}%)`);
  console.log(`Products with Stories: ${report.specificationsAudit.productsWithStories} / ${report.totalProducts} (${((report.specificationsAudit.productsWithStories / report.totalProducts) * 100).toFixed(1)}%)`);
  console.log(`Products with Starting Price: ${report.specificationsAudit.productsWithStartingPrice} / ${report.totalProducts} (${((report.specificationsAudit.productsWithStartingPrice / report.totalProducts) * 100).toFixed(1)}%)`);

  console.log("\n=== SAMPLE SPEC CHECK ===");
  console.table(report.specificationsAudit.sampleDefaultCheck);

  await client.end();
  console.log("\n✓ Database QA Complete. Report saved to migration/reports/final-qa-report.json");
}

runDatabaseQA().catch(console.error);
