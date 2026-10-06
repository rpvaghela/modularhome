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

  // 1. Barndominiums
  if (clean.includes("barndo") || clean.includes("barndominium")) {
    return mCat === "barndominiums" || mName.includes("barndo") || mName.includes("barndominium");
  }

  // 2. Park Models
  if (clean === "park models" || clean === "park model") {
    return mCat === "park models" || mName.includes("park model");
  }

  // 3. A-Frames
  if (clean.includes("a frame") || clean.includes("aframe")) {
    return (
      mCat.includes("a frame") ||
      mCat.includes("aframe") ||
      mName.includes("a-frame") ||
      mName.includes("aframe")
    );
  }

  // 4. ADUs & Granny Pods
  if (clean.includes("granny pod") || clean.includes("adu")) {
    return (
      mCat.includes("adu") ||
      mCat.includes("granny pod") ||
      mName.includes("adu") ||
      mName.includes("granny pod") ||
      mName.includes("secondary dwelling")
    );
  }

  // 5. Commercial
  if (clean.includes("commercial")) {
    return (
      mCat.includes("commercial") ||
      mName.includes("commercial") ||
      mName.includes("pole barn") ||
      mName.includes("garage") ||
      mName.includes("workshop")
    );
  }

  // 6. Tiny Homes
  if (clean.includes("tiny home")) {
    return (
      mCat === "tiny homes" ||
      (mName.includes("tiny home") && !mName.includes("park model")) ||
      mName.includes("tiny house") ||
      mName.includes("tiny tim")
    );
  }

  // 7. Cabins (Must not be barndo, park model, or a-frame)
  if (clean === "cabins" || clean.includes("cabin")) {
    if (
      mName.includes("barndo") ||
      mName.includes("park model") ||
      mName.includes("a-frame") ||
      mName.includes("aframe")
    ) {
      return false;
    }
    return mCat === "cabins" || mName.includes("cabin");
  }

  // 8. Modular Homes (Strict Modular Homes - Never match barndo, cabin, house kit, log home, or park model)
  if (clean === "modular homes" || clean === "modular home" || clean === "modular") {
    if (
      mName.includes("barndo") ||
      mName.includes("cabin") ||
      mName.includes("log home") ||
      mName.includes("house kit") ||
      mName.includes("home kit") ||
      mName.includes("pole barn") ||
      mCat === "barndominiums" ||
      mCat === "cabins" ||
      mCat === "house kits" ||
      mCat === "park models"
    ) {
      return false;
    }
    return (
      mCat === "modular homes" ||
      mCat === "modular home" ||
      mName.includes("modular") ||
      mName.includes("farmhouse charm")
    );
  }

  // 9. Prefab Homes (Strict Prefab Homes - Panelized/Prefab modular homes, not barndos or cabins)
  if (clean === "prefab homes" || clean === "prefab home" || clean === "prefab") {
    if (
      mName.includes("barndo") ||
      mName.includes("cabin") ||
      mName.includes("log home") ||
      mCat === "barndominiums" ||
      mCat === "cabins" ||
      mCat === "park models"
    ) {
      return false;
    }
    return (
      mCat === "prefab homes" ||
      mCat === "prefab home" ||
      mCat === "modular homes" ||
      mName.includes("prefab") ||
      mName.includes("panelized")
    );
  }

  // 10. House Kits (Assembly packages, not barndos or cabins)
  if (clean === "house kits" || clean.includes("house kit")) {
    if (
      mName.includes("barndo") ||
      mCat === "barndominiums" ||
      mCat === "cabins"
    ) {
      return false;
    }
    return (
      mCat === "house kits" ||
      mName.includes("house kit") ||
      mName.includes("home kit") ||
      mName.includes("sip panel")
    );
  }

  // Direct normalized category match fallback
  return mCat === clean;
}
