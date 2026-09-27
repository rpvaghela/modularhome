import * as fs from "fs";
import * as path from "path";

function cleanPublicData() {
  const filePath = path.resolve(__dirname, "../../src/lib/publicData.ts");
  let content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

  // Remove the duplicated getPublicProducts block if present
  const dupBlock = `}): Promise<BuildingModel[]> {
  try {
    if (!isSupabaseConfigured()) {
      return [];
    }

    let query = supabaseAdmin
      .from("products")
      .select("*, product_variants(*), product_media(*)")
      .or("status.eq.active,status.is.null")
      .order("created_at", { ascending: false });

    if (params?.isFeatured) {
      query = query.eq("is_featured", true);
    }

    const { data: dbProducts, error } = await query;
    if (error || !dbProducts || dbProducts.length === 0) {
      return [];
    }

    let formatted = dbProducts.map(formatProduct);

    // Filter by Category
    if (params?.category && params.category !== "All" && params.category !== "ALL") {
      formatted = formatted.filter((m) => matchProductCategory(m, params.category!));
    }

    // Filter by Search Query
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      formatted = formatted.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.series.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          (m.tags && m.tags.some((t) => t.toLowerCase().includes(q))) ||
          (m.architecturalStyle && m.architecturalStyle.toLowerCase().includes(q))
      );
    }

    return formatted;
  } catch (error) {
    console.error("Error fetching public products:", error);
    return [];
  }
}`;

  if (content.includes(dupBlock)) {
    content = content.replace(dupBlock, "");
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✓ Removed duplicated block from publicData.ts");
  } else {
    console.log("Duplicate block not found by exact string, checking regex...");
    content = content.replace(/\}\): Promise<BuildingModel\[\]> \{[\s\S]*?catch \(error\) \{[\s\S]*?return \[\];\s*\}\s*\}/, "");
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✓ Removed via regex from publicData.ts");
  }
}

cleanPublicData();
