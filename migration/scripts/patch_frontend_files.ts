import * as fs from "fs";
import * as path from "path";

function patchFiles() {
  console.log("=== PATCHING FRONTEND & ADMIN FILES FOR REAL DATABASE INTEGRATION ===");

  // 1. Patch src/lib/publicData.ts
  const publicDataPath = path.resolve(__dirname, "../../src/lib/publicData.ts");
  let publicData = fs.readFileSync(publicDataPath, "utf8");

  // Replace formatProduct and getPublicProducts & getPublicProductBySlug
  const newFormatProduct = `export function formatProduct(p: any): BuildingModel {
  const specsArray = Array.isArray(p.specs)
    ? p.specs
    : typeof p.specs === "object" && p.specs !== null
    ? Object.entries(p.specs).map(([label, value]) => ({ label, value: String(value) }))
    : [];

  const primaryImg =
    p.primary_image_url ||
    p.hero_image ||
    p.featured_image ||
    p.primary_image ||
    (p.product_media && p.product_media.length > 0
      ? [...p.product_media].sort((a: any, b: any) => (a.position || 0) - (b.position || 0))[0]?.source_url
      : "") ||
    (Array.isArray(p.images) && p.images[0]) ||
    "/newmodularlogo.png";

  const galleryImgs =
    p.product_media && Array.isArray(p.product_media) && p.product_media.length > 0
      ? [...p.product_media]
          .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
          .map((m: any) => m.source_url)
          .filter(Boolean)
      : Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : Array.isArray(p.gallery) && p.gallery.length > 0
      ? p.gallery
      : [primaryImg];

  // Extract starting price from starting_price column or variants
  let startingPrice = Number(p.starting_price || p.price);
  if ((!startingPrice || isNaN(startingPrice) || startingPrice <= 0) && p.product_variants && Array.isArray(p.product_variants) && p.product_variants.length > 0) {
    const validPrices = p.product_variants
      .map((v: any) => Number(v.price))
      .filter((pr: number) => !isNaN(pr) && pr > 0);
    if (validPrices.length > 0) {
      startingPrice = Math.min(...validPrices);
    }
  }
  const finalPrice = startingPrice && !isNaN(startingPrice) && startingPrice > 0 ? startingPrice : 0;

  const sqft = p.sqft !== null && p.sqft !== undefined && !isNaN(Number(p.sqft)) ? Number(p.sqft) : (p.square_feet ? Number(p.square_feet) : 0);
  const bedrooms = p.bedrooms !== null && p.bedrooms !== undefined && !isNaN(Number(p.bedrooms)) ? Number(p.bedrooms) : (p.beds !== undefined ? Number(p.beds) : 0);
  const bathrooms = p.bathrooms !== null && p.bathrooms !== undefined && !isNaN(Number(p.bathrooms)) ? Number(p.bathrooms) : (p.baths !== undefined ? Number(p.baths) : 0);
  const stories = p.stories !== null && p.stories !== undefined && !isNaN(Number(p.stories)) ? Number(p.stories) : 1;
  const dimensions = p.dimensions || "";

  const collectionNames: string[] = [];
  if (Array.isArray(p.collections)) {
    p.collections.forEach((c: any) => {
      if (typeof c === "string") collectionNames.push(c);
      else if (c?.title) collectionNames.push(c.title);
      else if (c?.handle) collectionNames.push(c.handle);
    });
  } else if (Array.isArray(p.product_collections)) {
    p.product_collections.forEach((pc: any) => {
      if (pc.collections?.title) collectionNames.push(pc.collections.title);
      if (pc.collections?.handle) collectionNames.push(pc.collections.handle);
      if (pc.collection?.title) collectionNames.push(pc.collection.title);
      if (pc.collection?.handle) collectionNames.push(pc.collection.handle);
    });
  }

  return {
    id: p.id,
    slug: p.handle || p.slug || p.id,
    name: p.title || p.name || "Precision Modular Model",
    series: p.series || p.product_type || "Essential Series",
    category: p.product_type || p.category || "Modular Homes",
    architecturalStyle: p.architectural_style || p.architecturalStyle || "Modern Homes",
    tagline: p.tagline || (sqft > 0 ? \`\${sqft} Sq Ft Precision Engineered Home\` : ""),
    description: p.description || p.description_html || "",
    sqft,
    bedrooms,
    bathrooms,
    stories,
    startingPrice: finalPrice,
    dimensions,
    frameType: p.frame_type || p.frameType || "100% Commercial-Grade Galvanized Light Gauge Steel",
    roofPitch: p.roof_pitch || p.roofPitch || "4:12 Pitch (Standing Seam Ready)",
    windRating: p.wind_rating || p.windRating || "Up to 150 MPH (Engineered for Extreme Weather)",
    snowLoad: p.snow_load || p.snowLoad || "50 PSF Ground Snow Load Rated",
    warranty: p.warranty || "50-Year Structural Steel Frame Warranty",
    primaryImage: primaryImg,
    image: primaryImg,
    gallery: galleryImgs.length > 0 ? galleryImgs : [primaryImg],
    floorPlanImage: p.floor_plan_image || p.floorPlanImage || "",
    floorPlan: p.floor_plan_image || p.floorPlanImage || "",
    videoUrl: p.video_url || p.videoUrl || p.video || "",
    videoDuration: p.video_duration || p.videoDuration || "",
    videoTitle: p.video_title || p.videoTitle || "",
    features: Array.isArray(p.features) && p.features.length > 0
      ? p.features
      : [
          "Precision Commercial-Grade Galvanized Steel Framing",
          "Energy-Efficient High-R Value Structural Insulated Panels (SIPs)",
          "Engineered for Up to 150 MPH Wind & 50 PSF Snow Loads",
          "Pre-drilled MEP & Fast Modular On-Site Assembly",
        ],
    specs:
      specsArray.length > 0
        ? specsArray
        : [
            ...(dimensions ? [{ label: "Dimensions", value: dimensions }] : []),
            ...(sqft > 0 ? [{ label: "Living Area", value: \`\${sqft} SQ FT\` }] : []),
            ...(bedrooms >= 0 ? [{ label: "Bedrooms", value: bedrooms === 0 ? "Studio / Open" : \`\${bedrooms} Bed\` }] : []),
            ...(bathrooms > 0 ? [{ label: "Bathrooms", value: \`\${bathrooms} Bath\` }] : []),
            ...(stories > 0 ? [{ label: "Stories", value: \`\${stories} Level\` }] : []),
            { label: "Frame Type", value: "100% Commercial-Grade Galvanized Light Gauge Steel" },
            { label: "Warranty", value: "50-Year Structural Steel Frame Warranty" },
          ],
    customizableOptions: Array.isArray(p.customizable_options || p.customizableOptions)
      ? p.customizable_options || p.customizableOptions
      : [
          {
            id: "opt-1",
            name: "Covered Wrap-Around Timber Deck",
            price: 12500,
            description: "Solid timber posts & weather-resistant composite decking",
          },
          {
            id: "opt-2",
            name: "Premium R-38 Closed-Cell Insulation",
            price: 6800,
            description: "Extreme thermal envelope for energy cost reduction",
          },
          {
            id: "opt-3",
            name: "16ft Multi-Slide Panoramic Glass Wall",
            price: 9400,
            description: "Black aluminum double-pane argon low-E sliders",
          },
        ],
    tags: Array.isArray(p.tags)
      ? p.tags
      : typeof p.tags === "string"
      ? p.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [],
    collections: Array.from(new Set(collectionNames.filter(Boolean))),
  };
}`;

  publicData = publicData.replace(
    /export function formatProduct\(p: any\): BuildingModel \{[\s\S]*?^\}/m,
    newFormatProduct
  );

  // Replace getPublicProducts query
  const newGetPublicProducts = `export async function getPublicProducts(params?: {
  category?: string;
  search?: string;
  isFeatured?: boolean;
}): Promise<BuildingModel[]> {
  try {
    if (!isSupabaseConfigured()) {
      return [];
    }

    let query = supabaseAdmin
      .from("products")
      .select("*, product_variants(*), product_media(*), product_collections(collection_id, collections(id, handle, title))")
      .or("status.eq.active,status.is.null")
      .order("created_at", { ascending: false })
      .limit(5000);

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

  publicData = publicData.replace(
    /export async function getPublicProducts\([\s\S]*?^}/m,
    newGetPublicProducts
  );

  // Replace getPublicProductBySlug query
  const newGetPublicProductBySlug = `export async function getPublicProductBySlug(slug: string): Promise<BuildingModel | null> {
  try {
    if (isSupabaseConfigured()) {
      const clean = decodeURIComponent(slug).toLowerCase().trim();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
      const orFilter = isUuid ? \`handle.eq.\${clean},id.eq.\${clean}\` : \`handle.eq.\${clean}\`;

      const { data: product, error } = await supabaseAdmin
        .from("products")
        .select("*, product_variants(*), product_media(*), product_collections(collection_id, collections(id, handle, title))")
        .or(orFilter)
        .maybeSingle();

      if (!error && product) {
        return formatProduct(product);
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}`;

  publicData = publicData.replace(
    /export async function getPublicProductBySlug\(slug: string\): Promise<BuildingModel \| null> \{[\s\S]*?^}/m,
    newGetPublicProductBySlug
  );

  // Replace getPublicCollectionBySlug query
  const newGetPublicCollectionBySlug = `export async function getPublicCollectionBySlug(slug: string): Promise<PublicCollection | null> {
  const cleanSlug = slug.toLowerCase().trim();
  const allCols = await getPublicCollections();
  const matched = allCols.find((c) => c.slug.toLowerCase() === cleanSlug || c.id === cleanSlug);
  if (!matched) return null;

  // Retrieve products
  const allProducts = await getPublicProducts();
  const mappedProducts = matched.productIds && matched.productIds.length > 0
    ? allProducts.filter((p) => matched.productIds?.includes(p.id))
    : allProducts.filter((p) => matchProductCategory(p, matched.slug) || matchProductCategory(p, matched.name));

  return {
    ...matched,
    products: mappedProducts,
  };
}`;

  publicData = publicData.replace(
    /export async function getPublicCollectionBySlug\(slug: string\): Promise<PublicCollection \| null> \{[\s\S]*?^}/m,
    newGetPublicCollectionBySlug
  );

  fs.writeFileSync(publicDataPath, publicData, "utf8");
  console.log("✓ Updated src/lib/publicData.ts");

  // 2. Patch BuildingCard.tsx
  const buildingCardPath = path.resolve(__dirname, "../../src/components/BuildingCard.tsx");
  let buildingCard = fs.readFileSync(buildingCardPath, "utf8");

  const newBuildingCardContent = `import Link from "next/link";
import Image from "next/image";
import { BuildingModel } from "@/data/models";
import { formatPrice } from "@/utils/currency";

interface BuildingCardProps {
  model: BuildingModel;
  priority?: boolean;
}

export default function BuildingCard({ model, priority = false }: BuildingCardProps) {
  const formattedPrice = model.startingPrice && model.startingPrice > 0 
    ? formatPrice(model.startingPrice) 
    : "Custom Quote";

  const specsList: string[] = [];
  if (model.sqft && model.sqft > 0) {
    specsList.push(\`\${new Intl.NumberFormat("en-US").format(model.sqft)} sq ft\`);
  } else if (model.dimensions) {
    specsList.push(model.dimensions);
  }

  if (model.bedrooms !== undefined && model.bedrooms !== null) {
    specsList.push(model.bedrooms === 0 ? "Studio" : \`\${model.bedrooms} Bed\`);
  }

  if (model.bathrooms !== undefined && model.bathrooms !== null && model.bathrooms > 0) {
    specsList.push(\`\${model.bathrooms} Bath\`);
  }

  const specsText = specsList.length > 0 ? specsList.join(" | ") : "Precision Modular Construction";

  return (
    <div className="card overflow-hidden group hover:-translate-y-1 transition-all flex flex-col justify-between bg-white">
      {/* Image Viewport */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={model.primaryImage || model.image || "/newmodularlogo.png"}
          alt={model.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
        <div>
          <h3 className="text-base sm:text-lg font-black tracking-tight text-[#101114] group-hover:text-[#d97706] transition-colors">
            {model.name}
          </h3>
          <p className="text-xs text-[#6b7280] font-medium mt-1">
            {specsText}
          </p>
          <div className="text-lg sm:text-[21px] font-black text-[#d97706] mt-2">
            {formattedPrice}
          </div>
        </div>

        {/* View Details Button */}
        <div className="pt-2">
          <Link
            href={\`/buildings/\${model.slug}\`}
            className="w-full py-2.5 px-4 text-xs font-black rounded-[9px] text-center justify-center bg-[#0f1218] hover:bg-[#fcb907] text-white hover:text-[#101114] transition-all duration-200 shadow-xs flex items-center gap-1.5"
          >
            <span>View Details →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(buildingCardPath, newBuildingCardContent, "utf8");
  console.log("✓ Updated src/components/BuildingCard.tsx");

  // 3. Patch Admin API: src/app/api/admin/products/route.ts
  const adminProductsRoutePath = path.resolve(__dirname, "../../src/app/api/admin/products/route.ts");
  let adminRoute = fs.readFileSync(adminProductsRoutePath, "utf8");

  adminRoute = adminRoute.replace(
    /sqft: 800,[\s\S]*?stories: 1,/g,
    `sqft: p.sqft || 0,
        bedrooms: p.bedrooms ?? 0,
        bathrooms: p.bathrooms ?? 0,
        stories: p.stories || 1,
        dimensions: p.dimensions || "",
        tags: p.tags || [],
        features: p.features || [],
        specs: p.specs || [],
        architecturalStyle: p.architectural_style || "Modern Homes",
        series: p.series || "Essential Series",
        tagline: p.tagline || "",`
  );

  fs.writeFileSync(adminProductsRoutePath, adminRoute, "utf8");
  console.log("✓ Updated src/app/api/admin/products/route.ts");

  // 4. Patch Admin API: src/app/api/admin/products/[id]/route.ts
  const adminProductIdRoutePath = path.resolve(__dirname, "../../src/app/api/admin/products/[id]/route.ts");
  let adminIdRoute = fs.readFileSync(adminProductIdRoutePath, "utf8");

  adminIdRoute = adminIdRoute.replace(
    /sqft: 800,[\s\S]*?stories: 1,/g,
    `sqft: p.sqft || 0,
      bedrooms: p.bedrooms ?? 0,
      bathrooms: p.bathrooms ?? 0,
      stories: p.stories || 1,
      dimensions: p.dimensions || "",
      tags: p.tags || [],
      features: p.features || [],
      specs: p.specs || [],
      architecturalStyle: p.architectural_style || "Modern Homes",
      series: p.series || "Essential Series",
      tagline: p.tagline || "",`
  );

  // In PUT handler of admin [id], also update sqft, bedrooms, bathrooms, etc.
  const adminPutUpdates = `    if (body.sqft !== undefined) updatePayload.sqft = Number(body.sqft);
    if (body.bedrooms !== undefined) updatePayload.bedrooms = Number(body.bedrooms);
    if (body.bathrooms !== undefined) updatePayload.bathrooms = Number(body.bathrooms);
    if (body.stories !== undefined) updatePayload.stories = Number(body.stories);
    if (body.dimensions !== undefined) updatePayload.dimensions = body.dimensions;
    if (body.startingPrice !== undefined) updatePayload.starting_price = Number(body.startingPrice);
    if (body.tags !== undefined) updatePayload.tags = Array.isArray(body.tags) ? body.tags : [];
    if (body.features !== undefined) updatePayload.features = Array.isArray(body.features) ? body.features : [];
    if (body.specs !== undefined) updatePayload.specs = Array.isArray(body.specs) ? body.specs : [];
    if (body.architecturalStyle !== undefined) updatePayload.architectural_style = body.architecturalStyle;
    if (body.series !== undefined) updatePayload.series = body.series;
    if (body.tagline !== undefined) updatePayload.tagline = body.tagline;
    if (body.primaryImage !== undefined) updatePayload.primary_image_url = body.primaryImage;
`;

  if (!adminIdRoute.includes("updatePayload.sqft")) {
    adminIdRoute = adminIdRoute.replace(
      /if \(body\.seoTitle !== undefined[\s\S]*?updatePayload\.seo_description = body\.metaDescription \|\| body\.seo_description;\s*\}/,
      (match) => `${match}\n\n${adminPutUpdates}`
    );
  }

  fs.writeFileSync(adminProductIdRoutePath, adminIdRoute, "utf8");
  console.log("✓ Updated src/app/api/admin/products/[id]/route.ts");

  console.log("=== ALL FILES PATCHED SUCCESSFULLY ===");
}

patchFiles();
