/**
 * Category Normalization and Matching Utilities
 */

/**
 * Normalizes a category name or slug to a clean, lowercase space-separated string
 */
export function normalizeCategory(cat?: string | null): string {
  if (!cat) return "";
  return cat
    .toLowerCase()
    .replace(/[-_&+/|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts clean base model name without redundant ( STATE PRICING ) suffix
 */
export function getBaseModelName(title?: string | null): string {
  if (!title) return "";
  return title
    .replace(/\s*\([^)]*PRICING[^)]*\)/gi, "")
    .replace(/\s*-\s*[^-(]+PRICING.*$/gi, "")
    .replace(/\s*\(Shipping\s*&\s*Set\s*up[^\)]*\)/gi, "")
    .replace(/\s*\(Copy\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if two category labels refer to the same category
 */
export function isCategorySelected(currentCat?: string | null, tabName?: string | null): boolean {
  if (!currentCat || !tabName) return false;
  if (currentCat.toLowerCase() === tabName.toLowerCase()) return true;
  return normalizeCategory(currentCat) === normalizeCategory(tabName);
}

/**
 * Robustly matches a product/model against a selected category or slug
 */
export function matchProductCategory(
  model: {
    name?: string;
    title?: string;
    slug?: string;
    handle?: string;
    category?: string;
    series?: string;
    product_type?: string;
    tags?: string[] | string;
    collections?: string[];
    description?: string;
    architecturalStyle?: string;
    sqft?: number;
    bedrooms?: number;
  },
  selectedCat: string
): boolean {
  if (!selectedCat || selectedCat === "All" || selectedCat === "ALL") {
    return true;
  }

  const clean = normalizeCategory(selectedCat);
  if (!clean || clean === "all") return true;

  const mName = (model.name || model.title || "").toLowerCase();
  const mSlug = (model.slug || model.handle || "").toLowerCase();
  const mCat = normalizeCategory(model.category || model.product_type || model.series || "");
  const sqft = model.sqft || 0;

  // Exclude non-home items, broker/agent listings, directories, and partnership ads
  if (
    mName.includes("cabinet") ||
    mName.includes("chair") ||
    mName.includes("table") ||
    mName.includes("desk") ||
    mName.includes("broker") ||
    mName.includes("sales partner") ||
    mName.includes("become a") ||
    mName.includes("dealer network") ||
    mName.includes("partner with") ||
    mSlug.includes("broker")
  ) {
    return false;
  }

  // 1. Barndominiums
  if (clean.includes("barndo")) {
    return (
      mCat.includes("barndo") ||
      mName.includes("barndo") ||
      mSlug.includes("barndo") ||
      mName.includes("pole barn") ||
      mName.includes("grandview") ||
      mSlug.includes("grandview")
    );
  }

  // 2. A-Frames
  if (clean.includes("a frame") || clean.includes("aframe")) {
    return (
      mCat.includes("a frame") ||
      mCat.includes("aframe") ||
      mName.includes("a-frame") ||
      mSlug.includes("a-frame") ||
      mName.includes("aframe") ||
      mSlug.includes("aframe")
    );
  }

  // 3. Park Models
  if (clean.includes("park model")) {
    return (
      (mCat.includes("park model") ||
        mName.includes("park model") ||
        mSlug.includes("park-model") ||
        mName.includes("rv cottage") ||
        mName.includes("park model rv")) &&
      !mName.includes("house kit") &&
      !mName.includes("steel house kit")
    );
  }

  // 4. Commercial Buildings / Multi-Family / Duplexes
  if (clean.includes("commercial")) {
    return (
      mCat.includes("commercial") ||
      mName.includes("commercial") ||
      mSlug.includes("commercial") ||
      mName.includes("duplex") ||
      mName.includes("multi-family") ||
      mName.includes("office") ||
      mName.includes("warehouse")
    );
  }

  // 5. House Kits
  if (clean.includes("house kit") || clean.includes("home kit")) {
    return (
      (mCat.includes("house kit") ||
        mName.includes("house kit") ||
        mName.includes("home kit") ||
        mName.includes("steel kit") ||
        mName.includes("sip panel") ||
        mName.includes("panelized")) &&
      !mName.includes("barndo") &&
      !mName.includes("duplex")
    );
  }

  // 6. Tiny Homes
  if (clean.includes("tiny home") || clean.includes("tiny")) {
    return (
      (mCat.includes("tiny") ||
        mName.includes("tiny home") ||
        mName.includes("tiny house") ||
        mName.includes("tiny tim") ||
        mSlug.includes("tiny") ||
        mName.includes("micro") ||
        (sqft > 0 && sqft <= 450)) &&
      !mName.includes("barndo") &&
      !mName.includes("duplex") &&
      !mName.includes("house kit") &&
      !mName.includes("broker")
    );
  }

  // 7. ADUs & Granny Pods
  if (clean.includes("adu") || clean.includes("granny") || clean.includes("pod")) {
    return (
      (mCat.includes("adu") ||
        mCat.includes("granny") ||
        mName.includes("adu") ||
        mSlug.includes("adu") ||
        mName.includes("granny") ||
        mName.includes("pod") ||
        mName.includes("guest suite") ||
        mName.includes("backyard") ||
        mName.includes("el poco loco") ||
        (mName.includes("studio") && !mName.includes("house kit")) ||
        (mName.includes("bungalow") && !mName.includes("house kit")) ||
        (mName.includes("cottage") && !mName.includes("house kit") && !mName.includes("modular cabin"))) &&
      !mName.includes("barndo") &&
      !mName.includes("duplex")
    );
  }

  // 8a. Modular Cabins & Prefab Cabins (Dedicated collection at /modular-cabins)
  if (
    clean.includes("modular cabin") ||
    clean.includes("prefab cabin") ||
    clean === "modular cabins" ||
    clean === "modular cabin" ||
    clean === "modular-cabins" ||
    clean === "prefab-cabins"
  ) {
    return (
      (mCat.includes("cabin") ||
        mName.includes("cabin") ||
        mSlug.includes("cabin") ||
        mName.includes("lodge") ||
        mName.includes("log home") ||
        mName.includes("rustic") ||
        mName.includes("muchacho") ||
        mName.includes("bertha") ||
        mName.includes("sparrow") ||
        mName.includes("gatlinburg") ||
        mName.includes("amish")) &&
      !mName.includes("barndo") &&
      !mName.includes("house kit") &&
      !mName.includes("home kit") &&
      !mName.includes("duplex") &&
      !mName.includes("park model") &&
      !mName.includes("a-frame")
    );
  }

  // 8b. Cabins (All Handcrafted Log Cabins & Modular Cabins)
  if (clean.includes("cabin")) {
    return (
      (mCat.includes("cabin") ||
        mName.includes("cabin") ||
        mSlug.includes("cabin") ||
        mName.includes("lodge") ||
        mName.includes("log home") ||
        mName.includes("rustic")) &&
      !mName.includes("barndo") &&
      !mName.includes("house kit") &&
      !mName.includes("home kit") &&
      !mName.includes("duplex") &&
      !mName.includes("park model") &&
      !mName.includes("a-frame")
    );
  }

  // 9. Prefab Homes
  if (clean.includes("prefab")) {
    const hasPrefabCollection = Array.isArray(model.collections) &&
      model.collections.some((c: string) => typeof c === "string" && c.toLowerCase().includes("prefab"));
    const hasPrefabTag = Array.isArray(model.tags)
      ? model.tags.some((t: string) => typeof t === "string" && t.toLowerCase().includes("prefab"))
      : typeof model.tags === "string" && (model.tags as string).toLowerCase().includes("prefab");

    return (
      (mCat.includes("prefab") ||
        mName.includes("prefab") ||
        mSlug.includes("prefab") ||
        hasPrefabCollection ||
        hasPrefabTag ||
        (mCat.includes("modular") && !mName.includes("cabin")) ||
        mName.includes("panelized") ||
        mName.includes("sip panel")) &&
      !mName.includes("barndo") &&
      !mName.includes("pole barn") &&
      !mName.includes("duplex") &&
      !mName.includes("house kit")
    );
  }

  // 10. Custom Homes
  if (clean.includes("custom")) {
    return (
      mCat.includes("custom") ||
      mName.includes("custom") ||
      mSlug.includes("custom") ||
      mName.includes("bespoke") ||
      mName.includes("architectural")
    );
  }

  // 11. Modular Homes (Strictly Single-Family Modular Homes & Modular Residences - No Cabins)
  if (clean.includes("modular")) {
    const isExcluded =
      mName.includes("cabin") ||
      mName.includes("kit") ||
      mName.includes("duplex") ||
      mName.includes("barndo") ||
      mName.includes("grandview") ||
      mSlug.includes("grandview") ||
      mName.includes("a-frame") ||
      mName.includes("park model") ||
      mName.includes("tiny") ||
      mName.includes("adu") ||
      mName.includes("dealer") ||
      mName.includes("broker") ||
      mName.includes("pole barn") ||
      mName.includes("shed") ||
      mSlug.includes("cabin");

    return (
      !isExcluded &&
      (mCat === "modular homes" ||
        mCat === "modular" ||
        mName.includes("modular home") ||
        mName.includes("modular residence") ||
        mName.includes("modular estate") ||
        mName.includes("farmhouse charm") ||
        mName.includes("modern craftsman") ||
        mName.includes("aspen ridge") ||
        mName.includes("prairie modern") ||
        mName.includes("cascade valley") ||
        mName.includes("copper house") ||
        mName.includes("rancher") ||
        mName.includes("residence") ||
        mName.includes("craftsman") ||
        mName.includes("farmhouse"))
    );
  }

  return mCat === clean;
}
