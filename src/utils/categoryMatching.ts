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

  // 1. Cabins (High priority isolation to prevent rustic cabins bleeding into Modular Homes)
  if (clean === "cabins" || clean.includes("cabin")) {
    return (
      mCat === "cabins" ||
      (mName.includes("cabin") &&
        !mName.includes("barndo") &&
        !mName.includes("park model") &&
        !mName.includes("a-frame") &&
        !mName.includes("aframe"))
    );
  }

  // 2. Modular Homes (Strict Modular Homes; NEVER match Cabins)
  if (clean === "modular homes" || clean === "modular home" || clean === "modular") {
    if (mCat === "cabins" || mName.includes("cabin")) return false;
    return (
      mCat === "modular homes" ||
      mCat === "modular home" ||
      (mName.includes("modular") && !mName.includes("cabin")) ||
      (mName.includes("rancher") && !mName.includes("cabin") && !mCat.includes("cabin")) ||
      (mName.includes("craftsman") && !mName.includes("cabin") && !mCat.includes("cabin"))
    );
  }

  // 3. Prefab Homes (Strict Prefab Homes; NEVER match Cabins)
  if (clean === "prefab homes" || clean === "prefab home" || clean === "prefab") {
    if (mCat === "cabins" || mName.includes("cabin")) return false;
    return (
      mCat === "prefab homes" ||
      mCat === "prefab home" ||
      mCat === "modular homes" ||
      (mName.includes("prefab") && !mName.includes("cabin")) ||
      (mName.includes("panelized") && !mName.includes("cabin"))
    );
  }

  // 4. Barndominiums
  if (clean.includes("barndo") || clean.includes("barndominium")) {
    return mCat === "barndominiums" || mName.includes("barndo") || mName.includes("barndominium");
  }

  // 5. House Kits
  if (clean === "house kits" || clean.includes("house kit")) {
    if (mCat === "cabins" || mName.includes("cabin")) return false;
    return (
      mCat === "house kits" ||
      mName.includes("house kit") ||
      mName.includes("home kit") ||
      mName.includes("sip panel")
    );
  }

  // 6. Tiny Homes
  if (clean.includes("tiny home")) {
    return (
      mCat === "tiny homes" ||
      mName.includes("tiny home") ||
      mName.includes("tiny house") ||
      mName.includes("tiny tim")
    );
  }

  // 7. Park Models
  if (clean === "park models" || clean === "park model") {
    return mCat === "park models" || mName.includes("park model");
  }

  // 8. ADUs & Granny Pods
  if (clean.includes("granny pod") || clean.includes("adu")) {
    return (
      mCat === "adus & granny pods" ||
      mCat === "adus and granny pods" ||
      mName.includes("adu") ||
      mName.includes("granny pod") ||
      mName.includes("secondary dwelling")
    );
  }

  // 9. A-Frames
  if (clean.includes("a frame") || clean.includes("aframe")) {
    return (
      mCat === "a-frames" ||
      mCat === "a frames" ||
      mName.includes("a-frame") ||
      mName.includes("aframe")
    );
  }

  // 10. Commercial
  if (clean.includes("commercial")) {
    return (
      mCat === "commercial" ||
      mCat.includes("commercial") ||
      mName.includes("commercial") ||
      mName.includes("pole barn") ||
      mName.includes("garage") ||
      mName.includes("workshop")
    );
  }

  // Direct normalized category match fallback
  return mCat === clean;
}
