import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

interface ExtractedSpecs {
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  stories?: number;
  dimensions?: string;
  price?: number;
  tags?: string[];
}

export function extractProductSpecs(
  title: string,
  bodyHtml: string,
  tagsRaw: string,
  variantRows: any[]
): ExtractedSpecs {
  const text = `${title}\n${bodyHtml.replace(/<[^>]*>?/gm, " ")}\n${tagsRaw}`.replace(/&nbsp;/g, " ").replace(/\s+/g, " ");

  let sqft: number | undefined;
  let bedrooms: number | undefined;
  let bathrooms: number | undefined;
  let stories: number | undefined;
  let dimensions: string | undefined;
  let price: number | undefined;

  // 1. Price from variants
  const prices = variantRows
    .map((v) => {
      const p = parseFloat(String(v["Variant Price"] || v.price || "").replace(/[^0-9.]/g, ""));
      return isNaN(p) ? null : p;
    })
    .filter((p): p is number => p !== null && p > 0);

  if (prices.length > 0) {
    price = Math.min(...prices);
  }

  // 2. Dimensions from Title / Body
  // Patterns like 14x40, 14 by 40, 24' x 36', 40x60 ft, 14' x 52'
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
  // Patterns like "680 sq ft", "680 Sq. Ft.", "680 sqft", "680 square feet", "680 SF"
  const sqftMatch =
    text.match(/(\d{3,5})\s*(?:sq\.?\s*ft\.?|sqft|square\s*feet|square\s*foot|sf\b)/i) ||
    title.match(/(\d{3,5})\s*(?:sq\.?\s*ft\.?|sqft|sf\b)/i);

  if (sqftMatch) {
    const s = parseInt(sqftMatch[1], 10);
    if (s >= 80 && s <= 15000) {
      sqft = s;
    }
  }

  // If sqft not found but dimensions found (e.g. 14x40 = 560 sq ft)
  if (!sqft && dimMatch) {
    const d1 = parseInt(dimMatch[1], 10);
    const d2 = parseInt(dimMatch[2], 10);
    if (d1 > 0 && d2 > 0 && d1 <= 100 && d2 <= 100) {
      sqft = d1 * d2;
    }
  }

  // 4. Bedrooms
  // Patterns like "1 bedroom", "2 Bed", "3-bedroom", "1-2 Bedrooms", "Studio", "1 Bed 1 Bath"
  if (/\b(?:studio|studio model)\b/i.test(title) || /\b(?:studio apartment|studio layout)\b/i.test(text)) {
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
  // Patterns like "1 bath", "2.5 bathrooms", "1.5 Bath", "1 bathroom", "1 Bath"
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

  // 6. Stories / Levels
  // Patterns like "1-story", "2 story", "1.5 story", "single story", "two-story", "loft"
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

  // Tags
  let tags: string[] = [];
  if (tagsRaw) {
    tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return {
    sqft,
    bedrooms,
    bathrooms,
    stories,
    dimensions,
    price,
    tags,
  };
}

async function testExtraction() {
  const productsPath = path.resolve(__dirname, "../source/Products.csv");
  const wb = XLSX.readFile(productsPath, { raw: true });
  const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets["Products"] || Object.values(wb.Sheets)[0], { defval: "" });

  const productGroups = new Map<string, any[]>();
  for (const r of rows) {
    const h = String(r["Handle"] || "").trim().toLowerCase();
    if (!h) continue;
    if (!productGroups.has(h)) productGroups.set(h, []);
    productGroups.get(h)!.push(r);
  }

  console.log(`Testing spec extraction across ${productGroups.size} unique products...`);

  let withSqft = 0;
  let withBeds = 0;
  let withBaths = 0;
  let withDims = 0;
  let withStories = 0;
  let withPrice = 0;

  const samples: any[] = [];

  for (const [h, pRows] of productGroups.entries()) {
    const top = pRows.find((r) => r["Title"]) || pRows[0];
    const title = String(top["Title"] || "");
    const body = String(top["Body HTML"] || "");
    const tags = String(top["Tags"] || "");

    const specs = extractProductSpecs(title, body, tags, pRows);

    if (specs.sqft) withSqft++;
    if (specs.bedrooms !== undefined) withBeds++;
    if (specs.bathrooms !== undefined) withBaths++;
    if (specs.dimensions) withDims++;
    if (specs.stories !== undefined) withStories++;
    if (specs.price) withPrice++;

    if (samples.length < 15) {
      samples.push({
        handle: h,
        title: title.slice(0, 50),
        specs,
      });
    }
  }

  console.log("\n=== EXTRACTION STATS ===");
  console.log(`Total Products: ${productGroups.size}`);
  console.log(`With SqFt: ${withSqft} / ${productGroups.size} (${((withSqft / productGroups.size) * 100).toFixed(1)}%)`);
  console.log(`With Bedrooms: ${withBeds} / ${productGroups.size} (${((withBeds / productGroups.size) * 100).toFixed(1)}%)`);
  console.log(`With Bathrooms: ${withBaths} / ${productGroups.size} (${((withBaths / productGroups.size) * 100).toFixed(1)}%)`);
  console.log(`With Dimensions: ${withDims} / ${productGroups.size} (${((withDims / productGroups.size) * 100).toFixed(1)}%)`);
  console.log(`With Stories: ${withStories} / ${productGroups.size} (${((withStories / productGroups.size) * 100).toFixed(1)}%)`);
  console.log(`With Price: ${withPrice} / ${productGroups.size} (${((withPrice / productGroups.size) * 100).toFixed(1)}%)`);

  console.log("\n=== FIRST 15 EXTRACTED SAMPLES ===");
  console.dir(samples, { depth: null });
}

testExtraction().catch(console.error);
