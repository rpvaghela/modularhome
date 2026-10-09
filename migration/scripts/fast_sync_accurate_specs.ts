import "dotenv/config";
import * as path from "path";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";
import { extractDetailedSpecs } from "./refine_product_specs";

async function fastSync() {
  console.log("=== FAST PARALLEL ACCURATE SPEC RECONCILIATION ===");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing");

  const supabase = createClient(supabaseUrl, supabaseKey);

  const sourceDir = path.resolve(__dirname, "../source");
  const productsPath = path.join(sourceDir, "Products.csv");

  const wb = XLSX.readFile(productsPath, { raw: true });
  const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets["Products"] || Object.values(wb.Sheets)[0], { defval: "" });

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

  const entries = Array.from(productData.entries());
  const BATCH_SIZE = 25;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async ([handle, data]) => {
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

        const updatePayload: Record<string, any> = {
          sqft: specs.sqft,
          bedrooms: specs.bedrooms,
          bathrooms: specs.bathrooms,
          stories: specs.stories,
          dimensions: specs.dimensions,
          starting_price: specs.starting_price,
          tags: specs.tags,
          features: specs.features,
          specs: specs.specs,
          architectural_style: specs.architectural_style,
          series: specs.series,
          tagline: specs.tagline,
          primary_image_url: specs.primary_image_url,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("products")
          .update(updatePayload)
          .eq("handle", handle);

        if (error) {
          failCount++;
        } else {
          successCount++;
        }
      })
    );
    process.stdout.write(`\rProgress: ${Math.min(i + BATCH_SIZE, entries.length)} / ${entries.length} products processed`);
  }

  console.log(`\n\n✓ Successfully synced ${successCount} products with accurate specifications!`);
  if (failCount > 0) {
    console.log(`Failed/skipped ${failCount} products.`);
  }

  // Verify Country Rancher in DB
  const { data: verified } = await supabase
    .from("products")
    .select("handle, title, sqft, bedrooms, bathrooms, dimensions, starting_price, tagline")
    .eq("handle", "the-country-rancher-amish-built-modular-cabin");

  console.log("\n=== VERIFICATION IN DATABASE ===");
  console.log(verified);
}

fastSync().catch(console.error);
