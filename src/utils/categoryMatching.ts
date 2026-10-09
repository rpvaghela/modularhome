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

  // Ignore furniture and non-home accessories
  if (mName.includes("cabinet") || mName.includes("chair") || mName.includes("table") || mName.includes("desk")) {
    return false;
  }

  // 1. Barndominiums
  if (clean.includes("barndo")) {
    return (
      mCat.includes("barndo") ||
      mName.includes("barndo") ||
      mSlug.includes("barndo") ||
      mName.includes("pole barn")
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
      mCat.includes("park model") ||
      mName.includes("park model") ||
      mSlug.includes("park-model") ||
      mName.includes("rv cottage") ||
      mName.includes("park model rv")
    );
  }

  // 4. ADUs & Granny Pods
  if (clean.includes("adu") || clean.includes("granny") || clean.includes("pod")) {
    return (
      (mCat.includes("adu") ||
        mCat.includes("granny") ||
        mName.includes("adu") ||
        mSlug.includes("adu") ||
        mName.includes("granny") ||
        mName.includes("pod") ||
        mName.includes("guest") ||
        mName.includes("backyard") ||
        mName.includes("bungalow") ||
        mName.includes("cottage") ||
        mName.includes("den") ||
        mName.includes("nook") ||
        (mName.includes("studio") && !mName.includes("house kit")) ||
        (sqft > 0 && sqft <= 850 && (mName.includes("cabin") || mName.includes("retreat")))) &&
      !mName.includes("barndo")
    );
  }

  // 5. Tiny Homes
  if (clean.includes("tiny home") || clean.includes("tiny")) {
    return (
      mCat.includes("tiny") ||
      mName.includes("tiny") ||
      mSlug.includes("tiny") ||
      mName.includes("micro") ||
      (sqft > 0 && sqft <= 500)
    );
  }

  // 6. House Kits
  if (clean.includes("house kit") || clean.includes("home kit")) {
    return (
      (mCat.includes("house kit") ||
        mName.includes("house kit") ||
        mName.includes("home kit") ||
        mName.includes("steel kit") ||
        mName.includes("sip panel") ||
        mName.includes("panelized")) &&
      !mName.includes("barndo") &&
      !mName.includes("cabin")
    );
  }

  // 7. Cabins
  if (clean.includes("cabin")) {
    return (
      (mCat.includes("cabin") ||
        mName.includes("cabin") ||
        mSlug.includes("cabin") ||
        mName.includes("lodge") ||
        mName.includes("log home") ||
        mName.includes("rustic")) &&
      !mName.includes("barndo")
    );
  }

  // 8. Prefab Homes
  if (clean.includes("prefab")) {
    return (
      (mCat.includes("prefab") ||
        mName.includes("prefab") ||
        mSlug.includes("prefab") ||
        mCat.includes("modular") ||
        (mName.includes("modular") && !mName.includes("cabin") && !mName.includes("kit")) ||
        mName.includes("sip panel") ||
        mName.includes("panelized")) &&
      !mName.includes("barndo")
    );
  }

  // 9. Commercial Buildings
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

  // 11. Modular Homes
  if (clean.includes("modular")) {
    return (
      (mCat.includes("modular") ||
        mName.includes("modular") ||
        mSlug.includes("modular") ||
        mName.includes("residence") ||
        mName.includes("duplex") ||
        mName.includes("rancher") ||
        mName.includes("cottage") ||
        mName.includes("chalet") ||
        mName.includes("haven")) &&
      !mName.includes("barndo") &&
      !mName.includes("dealer") &&
      !mName.includes("broker")
    );
  }

  return mCat === clean;
}
