import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { Client } from "pg";
import { cleanHtmlContent, cleanSeoTitle, cleanSeoDescription } from "../mappers/branding_cleaner";

interface RefinedSpecs {
  sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  stories: number | null;
  dimensions: string | null;
  starting_price: number | null;
  tags: string[];
  features: string[];
  specs: Array<{ label: string; value: string }>;
  architectural_style: string;
  series: string;
  tagline: string;
  primary_image_url: string | null;
}

export function extractDetailedSpecs(
  handle: string,
  title: string,
  rawBody: string,
  rawTags: string,
  rawType: string,
  variantRows: any[],
  imageRows: string[]
): RefinedSpecs {
  const { cleanedHtml } = cleanHtmlContent(rawBody, `Product: ${handle}`);
  const text = `${title}\n${cleanedHtml.replace(/<[^>]*>?/gm, " ")}\n${rawTags}`
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");

  let sqft: number | null = null;
  let bedrooms: number | null = null;
  let bathrooms: number | null = null;
  let stories: number | null = null;
  let dimensions: string | null = null;
  let starting_price: number | null = null;

  // 1. Starting Price from Variants
  const validPrices = variantRows
    .map((v) => {
      const p = parseFloat(String(v["Variant Price"] || v.price || "").replace(/[^0-9.]/g, ""));
      return isNaN(p) ? null : p;
    })
    .filter((p): p is number => p !== null && p > 0);

  if (validPrices.length > 0) {
    starting_price = Math.min(...validPrices);
  }

  // 2. Dimensions
  const dimMatch =
    title.match(/(\b\d{2,3})\s*(?:by|x|\*|'x|'\s*x|'\s*by)\s*(\d{2,3})(?:'|\s*ft|\s*foot|\b)/i) ||
    text.match(/(\b\d{2,3})['’]?\s*(?:x|by|\*)\s*(\d{2,3})['’]?(?:\s*(?:ft|feet|foot|wide|long|\.|\b))/i) ||
    text.match(/dimensions?[:\s-]+(\d{2,3})['’]?\s*(?:x|by)\s*(\d{2,3})['’]?/i);

  if (dimMatch) {
    const d1 = parseInt(dimMatch[1], 10);
    const d2 = parseInt(dimMatch[2], 10);
    if (d1 > 0 && d2 > 0 && d1 <= 200 && d2 <= 200) {
      dimensions = `${d1}' x ${d2}'`;
    }
  }

  // 3. Square Footage
  const sqftMatch =
    text.match(/(\d{3,5})\s*(?:sq\.?\s*ft\.?|sqft|square\s*feet|square\s*foot|sf\b)/i) ||
    title.match(/(\d{3,5})\s*(?:sq\.?\s*ft\.?|sqft|sf\b)/i);

  if (sqftMatch) {
    const s = parseInt(sqftMatch[1], 10);
    if (s >= 80 && s <= 15000) {
      sqft = s;
    }
  }

  // Fallback sqft from dimensions if dimensions present and sqft not stated
  if (!sqft && dimMatch) {
    const d1 = parseInt(dimMatch[1], 10);
    const d2 = parseInt(dimMatch[2], 10);
    if (d1 > 0 && d2 > 0 && d1 <= 100 && d2 <= 100) {
      sqft = d1 * d2;
    }
  }

  // 4. Bedrooms
  if (
    /\b(?:studio|studio model|studio cabin|open layout)\b/i.test(title) ||
    /\b(?:studio apartment|studio layout|efficiency studio)\b/i.test(text)
  ) {
    bedrooms = 0;
  } else {
    const bedMatch =
      title.match(/(\d+)\s*(?:bed|bedroom|bdrm|br\b)/i) ||
      text.match(/(\d+)\s*(?:bedroom|bed|bdrm|br\b)/i) ||
      text.match(/bedrooms?[:\s-]+(\d+)/i);
    if (bedMatch) {
      const b = parseInt(bedMatch[1], 10);
      if (b >= 0 && b <= 12) {
        bedrooms = b;
      }
    }
  }

  // 5. Bathrooms
  const bathMatch =
    title.match(/(\d+(?:\.\d+)?)\s*(?:bath|bathroom|bth|ba\b)/i) ||
    text.match(/(\d+(?:\.\d+)?)\s*(?:bathroom|bath|bth|ba\b)/i) ||
    text.match(/bathrooms?[:\s-]+(\d+(?:\.\d+)?)/i);

  if (bathMatch) {
    const ba = parseFloat(bathMatch[1]);
    if (ba >= 0 && ba <= 10) {
      bathrooms = ba;
    }
  }

  // 6. Stories
  if (/\b(?:single[- ]story|1[- ]story|one[- ]story|1 level|single level)\b/i.test(text)) {
    stories = 1;
  } else if (/\b(?:two[- ]story|2[- ]story|second story|2 level|two level)\b/i.test(text)) {
    stories = 2;
  } else if (/\b(?:1\.5[- ]story|1 1\/2[- ]story|loft)\b/i.test(text)) {
    stories = 1.5;
  } else if (/\b(?:three[- ]story|3[- ]story)\b/i.test(text)) {
    stories = 3;
  } else {
    const storyMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:story|stories|level)/i);
    if (storyMatch) {
      const st = parseFloat(storyMatch[1]);
      if (st >= 1 && st <= 4) {
        stories = st;
      }
    }
  }

  // 7. Architectural Style & Series
  let architectural_style = "Modern Homes";
  let series = "Essential Series";

  const lowerTitle = title.toLowerCase();
  const lowerHandle = handle.toLowerCase();

  if (lowerTitle.includes("barndo") || lowerHandle.includes("barndo")) {
    architectural_style = "Barndominium";
    series = "Barndominium Series";
  } else if (lowerTitle.includes("cabin") || lowerHandle.includes("cabin") || lowerTitle.includes("chalet") || lowerTitle.includes("a-frame")) {
    architectural_style = "Cabin";
    series = "Cabin Series";
  } else if (lowerTitle.includes("ranch") || lowerHandle.includes("ranch")) {
    architectural_style = "Ranch";
    series = "Ranch Series";
  } else if (lowerTitle.includes("farmhouse") || lowerHandle.includes("farmhouse")) {
    architectural_style = "Farmhouse";
    series = "Farmhouse Series";
  } else if (lowerTitle.includes("tiny") || lowerHandle.includes("tiny") || lowerTitle.includes("granny") || lowerHandle.includes("adu")) {
    architectural_style = "ADU";
    series = "Compact ADU Series";
  } else if (lowerTitle.includes("commercial") || lowerHandle.includes("commercial")) {
    architectural_style = "Commercial";
    series = "Commercial Series";
  } else if (lowerTitle.includes("contemporary") || lowerTitle.includes("modern")) {
    architectural_style = "Contemporary";
    series = "Modern Architectural Series";
  }

  // 8. Tagline
  let tagline = `Precision-Engineered ${architectural_style} Modular Home`;
  if (sqft && bedrooms !== null && bathrooms !== null) {
    const bedStr = bedrooms === 0 ? "Studio" : `${bedrooms} Bed`;
    tagline = `${sqft} Sq Ft • ${bedStr} • ${bathrooms} Bath ${architectural_style} Design`;
  } else if (sqft) {
    tagline = `${sqft} Sq Ft Precision Steel ${architectural_style}`;
  } else if (dimensions) {
    tagline = `${dimensions} Precision Modular ${architectural_style}`;
  }

  // 9. Primary Image URL
  const primary_image_url = imageRows.length > 0 ? imageRows[0] : null;

  // 10. Tags
  let tags: string[] = [];
  if (rawTags) {
    tags = rawTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // 11. Features
  const features: string[] = [
    "Precision Commercial-Grade Galvanized Steel Framing",
    "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
    "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
    "Pre-drilled MEP & Fast Modular On-Site Assembly",
  ];

  // 12. Structured Specs Array
  const specs: Array<{ label: string; value: string }> = [];
  if (dimensions) specs.push({ label: "Dimensions", value: dimensions });
  if (sqft) specs.push({ label: "Living Area", value: `${sqft} SQ FT` });
  if (bedrooms !== null) specs.push({ label: "Bedrooms", value: bedrooms === 0 ? "Studio / Open" : `${bedrooms} Bed` });
  if (bathrooms !== null) specs.push({ label: "Bathrooms", value: `${bathrooms} Bath` });
  if (stories !== null) specs.push({ label: "Stories", value: `${stories} Level` });
  if (starting_price) specs.push({ label: "Base Price", value: `$${starting_price.toLocaleString()}` });
  specs.push({ label: "Frame Type", value: "100% Commercial-Grade Galvanized Light Gauge Steel" });
  specs.push({ label: "Warranty", value: "50-Year Structural Steel Frame Warranty" });

  return {
    sqft,
    bedrooms,
    bathrooms,
    stories,
    dimensions,
    starting_price,
    tags,
    features,
    specs,
    architectural_style,
    series,
    tagline,
    primary_image_url,
  };
}

async function runUpdate() {
  console.log("=== REFINING SPECIFICATIONS ACROSS ALL PRODUCTS IN DATABASE ===");

  const sourceDir = path.resolve(__dirname, "../source");
  const productsPath = path.join(sourceDir, "Products.csv");

  const wb = XLSX.readFile(productsPath, { raw: true });
  const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets["Products"] || Object.values(wb.Sheets)[0], { defval: "" });

  // Group by product handle
  const productData = new Map<string, {
    topRow: any;
    variants: any[];
    images: string[];
  }>();

  for (const r of rows) {
    const handle = String(r["Handle"] || "").trim().toLowerCase();
    if (!handle) continue;

    if (!productData.has(handle)) {
      productData.set(handle, {
        topRow: r["Title"] ? r : null,
        variants: [],
        images: [],
      });
    }

    const p = productData.get(handle)!;
    if (r["Title"] && !p.topRow) {
      p.topRow = r;
    }

    if (r["Image Src"]) {
      const src = String(r["Image Src"]).trim();
      if (src && !p.images.includes(src)) {
        p.images.push(src);
      }
    }

    const varPrice = r["Variant Price"];
    const varSku = r["Variant SKU"];
    const varOpt1 = r["Option1 Value"];
    if (varPrice || varSku || varOpt1) {
      p.variants.push(r);
    }
  }

  console.log(`Parsed ${productData.size} products from Products.csv`);

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is missing");

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to database. Applying accurate product specs...");

  let updatedCount = 0;
  let skippedCount = 0;

  for (const [handle, data] of productData.entries()) {
    const top = data.topRow || {};
    const title = String(top["Title"] || handle);
    const rawBody = String(top["Body HTML"] || "");
    const rawTags = String(top["Tags"] || "");
    const rawType = String(top["Type"] || top["Product Type"] || "");

    const specs = extractDetailedSpecs(
      handle,
      title,
      rawBody,
      rawTags,
      rawType,
      data.variants,
      data.images
    );

    const updateQuery = `
      UPDATE products
      SET
        sqft = $1,
        bedrooms = $2,
        bathrooms = $3,
        stories = $4,
        dimensions = $5,
        starting_price = $6,
        tags = $7::jsonb,
        features = $8::jsonb,
        specs = $9::jsonb,
        architectural_style = $10,
        series = $11,
        tagline = $12,
        primary_image_url = $13,
        updated_at = now()
      WHERE handle = $14;
    `;

    const values = [
      specs.sqft,
      specs.bedrooms,
      specs.bathrooms,
      specs.stories,
      specs.dimensions,
      specs.starting_price,
      JSON.stringify(specs.tags),
      JSON.stringify(specs.features),
      JSON.stringify(specs.specs),
      specs.architectural_style,
      specs.series,
      specs.tagline,
      specs.primary_image_url,
      handle,
    ];

    const res = await client.query(updateQuery, values);
    if (res.rowCount && res.rowCount > 0) {
      updatedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`\n✓ Successfully updated ${updatedCount} products with real source specs!`);
  if (skippedCount > 0) {
    console.log(`Skipped ${skippedCount} products (not present in products table).`);
  }

  // Verify Hummingbird Hollow and top samples
  const checkSample = await client.query(`
    SELECT handle, title, sqft, bedrooms, bathrooms, dimensions, starting_price, primary_image_url
    FROM products
    WHERE handle IN (
      'hummingbird-hollow-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit',
      '14-by-36-driftwood-modern-cabin-house-shell',
      '14-by-52-sunnyside-modern-cabin-house-shell',
      '14-by-40-azteca-modern-cabin'
    );
  `);

  console.log("\n=== VERIFICATION OF SAMPLE PRODUCTS IN DB ===");
  console.table(checkSample.rows);

  await client.end();
}

runUpdate().catch(console.error);
