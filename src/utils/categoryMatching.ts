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
  const beds = model.bedrooms || 0;

  // 1. Barndominiums
  if (clean.includes("barndo")) {
    return (
      mCat === "barndominiums" ||
      mCat.includes("barndo") ||
      mName.includes("barndo") ||
      mSlug.includes("barndo")
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
      mName.includes("park-model") ||
      mSlug.includes("park-model") ||
      mSlug.includes("park_model") ||
      mName.includes("rv cottage") ||
      mName.includes("park model rv")
    );
  }

  // 4. ADUs & Granny Pods
  if (clean.includes("adu") || clean.includes("granny")) {
    return (
      mCat.includes("adu") ||
      mCat.includes("granny") ||
      mName.includes("adu") ||
      mSlug.includes("adu") ||
      mName.includes("granny") ||
      mName.includes("pod") ||
      (mName.includes("studio") && !mName.includes("house kit"))
    );
  }

  // 5. Tiny Homes
  if (clean.includes("tiny home") || clean.includes("tiny")) {
    return (
      mCat === "tiny homes" ||
      mCat.includes("tiny") ||
      mName.includes("tiny home") ||
      mName.includes("tiny house") ||
      mName.includes("micro") ||
      mSlug.includes("tiny")
    );
  }

  // 6. House Kits
  if (clean.includes("house kit") || clean.includes("home kit")) {
    return (
      (mCat === "house kits" ||
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
  if (clean === "cabins" || clean.includes("cabin")) {
    return (
      (mCat === "cabins" ||
        mCat.includes("cabin") ||
        mName.includes("cabin") ||
        mSlug.includes("cabin") ||
        mName.includes("lodge") ||
        mName.includes("log home")) &&
      !mName.includes("barndo")
    );
  }

  // 8. Prefab Homes
  if (clean.includes("prefab")) {
    return (
      (mCat === "prefab homes" ||
        mCat.includes("prefab") ||
        mName.includes("prefab") ||
        mSlug.includes("prefab") ||
        mCat === "modular homes" ||
        (mName.includes("modular") && !mName.includes("cabin") && !mName.includes("kit"))) &&
      !mName.includes("cabin") &&
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
      mName.includes("multi family") ||
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
  if (clean === "modular homes" || clean === "modular home" || clean === "modular") {
    return (
      (mCat === "modular homes" ||
        mName.includes("modular home") ||
        mName.includes("modular residence") ||
        (mName.includes("modular") && !mName.includes("cabin") && !mName.includes("kit"))) &&
      !mName.includes("cabin") &&
      !mName.includes("barndo") &&
      !mName.includes("house kit") &&
      !mName.includes("sip panel") &&
      !mName.includes("dealer") &&
      !mName.includes("broker")
    );
  }

  return mCat === clean;
}
