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
  const tagsStr = Array.isArray(model.tags)
    ? model.tags.join(" ").toLowerCase()
    : (model.tags || "").toLowerCase();
  const colsStr = Array.isArray(model.collections)
    ? model.collections.join(" ").toLowerCase()
    : (model.collections || "").toLowerCase();

  const meta = `${mName} ${mSlug} ${mCat} ${tagsStr}`;

  // 1. Barndominiums
  if (clean.includes("barndo")) {
    return mCat === "barndominiums" || meta.includes("barndo") || meta.includes("barndominium") || colsStr.includes("barndominium");
  }

  // 2. A-Frames
  if (clean.includes("a frame") || clean.includes("aframe")) {
    return (
      mCat.includes("a frame") ||
      mCat.includes("aframe") ||
      meta.includes("a-frame") ||
      meta.includes("aframe") ||
      colsStr.includes("a-frame")
    );
  }

  // 3. Park Models
  if (clean.includes("park model")) {
    return (
      mCat.includes("park model") ||
      meta.includes("park model") ||
      meta.includes("park-model") ||
      meta.includes("park_model") ||
      colsStr.includes("park-model")
    );
  }

  // 4. ADUs & Granny Pods
  if (clean.includes("adu") || clean.includes("granny")) {
    return (
      mCat.includes("adu") ||
      mCat.includes("granny") ||
      meta.includes("adu") ||
      meta.includes("granny pod") ||
      meta.includes("backyard") ||
      meta.includes("secondary dwelling") ||
      colsStr.includes("adu")
    );
  }

  // 5. Tiny Homes
  if (clean.includes("tiny home")) {
    return (
      mCat === "tiny homes" ||
      meta.includes("tiny home") ||
      meta.includes("tiny house") ||
      meta.includes("tiny cabin") ||
      meta.includes("cube link") ||
      meta.includes("micro home") ||
      colsStr.includes("tiny-home")
    );
  }

  // 6. House Kits
  if (clean.includes("house kit")) {
    if (meta.includes("barndo")) return false;
    return (
      mCat === "house kits" ||
      meta.includes("house kit") ||
      meta.includes("home kit") ||
      meta.includes("sip panel") ||
      meta.includes("panelized") ||
      colsStr.includes("house-kits")
    );
  }

  // 7. Cabins
  if (clean === "cabins" || clean.includes("cabin")) {
    if (meta.includes("barndo") || meta.includes("park model") || meta.includes("a-frame") || meta.includes("aframe")) {
      return false;
    }
    return (
      mCat === "cabins" ||
      meta.includes("cabin") ||
      meta.includes("lodge") ||
      meta.includes("muchacho") ||
      meta.includes("bertha") ||
      meta.includes("sparrow") ||
      meta.includes("cub") ||
      colsStr.includes("cabin")
    );
  }

  // 8. Prefab Homes
  if (clean.includes("prefab")) {
    if (meta.includes("barndo") || meta.includes("cabin")) return false;
    return (
      mCat.includes("prefab") ||
      meta.includes("prefab") ||
      meta.includes("pre-fabricated") ||
      meta.includes("panelized") ||
      colsStr.includes("prefab")
    );
  }

  // 9. Commercial Buildings
  if (clean.includes("commercial")) {
    return (
      mCat.includes("commercial") ||
      meta.includes("commercial") ||
      meta.includes("office") ||
      meta.includes("warehouse") ||
      meta.includes("steel building") ||
      colsStr.includes("commercial")
    );
  }

  // 10. Custom Homes
  if (clean.includes("custom")) {
    return (
      mCat.includes("custom") ||
      meta.includes("custom") ||
      meta.includes("bespoke") ||
      meta.includes("architectural") ||
      colsStr.includes("custom")
    );
  }

  // 11. Modular Homes (Default & Dedicated Modular Homes)
  if (clean === "modular homes" || clean === "modular home" || clean === "modular") {
    if (meta.includes("barndo") || meta.includes("park model")) return false;
    return (
      mCat === "modular homes" ||
      meta.includes("modular") ||
      colsStr.includes("modular-homes") ||
      colsStr.includes("house-plans") ||
      colsStr.includes("home-plans") ||
      (!meta.includes("cabin") && !meta.includes("barndo"))
    );
  }

  return mCat === clean;
}
