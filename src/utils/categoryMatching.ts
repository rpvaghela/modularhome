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
    category?: string;
    series?: string;
    tags?: string[];
    collections?: string[];
    description?: string;
    architecturalStyle?: string;
  },
  selectedCat: string
): boolean {
  if (!selectedCat || selectedCat === "All" || selectedCat === "ALL") {
    return true;
  }

  const clean = normalizeCategory(selectedCat);
  if (!clean || clean === "all") return true;

  const mName = (model.name || "").toLowerCase();
  const mCat = normalizeCategory(model.category || "");
  const mSeries = (model.series || "").toLowerCase();

  // 1. Direct normalized category match
  if (mCat === clean) {
    return true;
  }

  // 2. Specific category / collection rules (strict, accurate matching without 50-state tag bleed)
  if (clean === "park models" || clean === "park model") {
    return mCat === "park models" || mName.includes("park model");
  }

  if (clean.includes("a frame") || clean.includes("aframe")) {
    return mCat === "a-frames" || mName.includes("a-frame") || mName.includes("aframe");
  }

  if (clean.includes("granny pod") || clean.includes("adu")) {
    return (
      mCat === "adus & granny pods" ||
      mCat === "adus and granny pods" ||
      mName.includes("adu") ||
      mName.includes("granny pod") ||
      mName.includes("secondary dwelling")
    );
  }

  if (clean.includes("barndo") || clean.includes("barndominium")) {
    return mCat === "barndominiums" || mName.includes("barndo") || mName.includes("barndominium");
  }

  if (clean === "house kits" || clean.includes("house kit")) {
    return mCat === "house kits" || mName.includes("house kit") || mName.includes("home kit");
  }

  if (clean.includes("tiny home")) {
    return (
      mCat === "tiny homes" ||
      mName.includes("tiny home") ||
      mName.includes("tiny house") ||
      mName.includes("tiny tim")
    );
  }

  if (clean === "cabins" || clean.includes("cabin")) {
    return (
      mCat === "cabins" ||
      (mName.includes("cabin") &&
        !mName.includes("barndo") &&
        !mName.includes("park model") &&
        !mName.includes("a-frame"))
    );
  }

  if (clean === "prefab homes" || clean.includes("prefab")) {
    return (
      mCat === "prefab homes" ||
      mCat === "modular homes" ||
      mName.includes("prefab") ||
      mName.includes("panelized") ||
      mName.includes("sip panel")
    );
  }

  if (clean === "modular homes" || clean.includes("modular")) {
    return (
      mCat === "modular homes" ||
      mName.includes("modular") ||
      mName.includes("rancher") ||
      mName.includes("craftsman") ||
      mName.includes("chalet")
    );
  }

  if (clean.includes("commercial")) {
    return (
      mCat === "commercial" ||
      mName.includes("commercial") ||
      mName.includes("pole barn") ||
      mName.includes("garage") ||
      mName.includes("workshop")
    );
  }

  return false;
}
