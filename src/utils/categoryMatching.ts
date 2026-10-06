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
  const mCat = (model.category || "").toLowerCase();
  const mSeries = (model.series || "").toLowerCase();
  const mStyle = (model.architecturalStyle || "").toLowerCase();
  const mDesc = (model.description || "").toLowerCase();
  const mTags = (model.tags || []).map((t) => t.toLowerCase());
  const mCols = (model.collections || []).map((c) => c.toLowerCase());

  // 1. Check exact or normalized collection matches
  const targetSlug = selectedCat.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  for (const col of mCols) {
    const colClean = normalizeCategory(col);
    const colSlug = col.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    if (
      colClean === clean ||
      colSlug === targetSlug ||
      colClean.includes(clean) ||
      clean.includes(colClean) ||
      col.includes(selectedCat.toLowerCase())
    ) {
      return true;
    }
  }

  // 2. Specific category / collection rules (strict, accurate matching)
  if (clean === "park models" || clean === "park model" || clean.includes("park model")) {
    return (
      mCols.some((c) => c.includes("park-model") || c.includes("park model") || c.includes("park_model")) ||
      mCat.includes("park model") ||
      mCat.includes("park-model") ||
      mSeries.includes("park model") ||
      mName.includes("park model") ||
      mName.includes("park model rv") ||
      mName.includes("rv park model") ||
      mTags.some((t) => t.includes("park model") || t.includes("park-model"))
    );
  }

  if (clean.includes("a frame") || clean.includes("aframe")) {
    return (
      mCols.some((c) => c.includes("a-frame") || c.includes("aframe")) ||
      mName.includes("a-frame") ||
      mName.includes("aframe") ||
      mCat.includes("a-frame") ||
      mStyle.includes("a-frame") ||
      mTags.some((t) => t.includes("a-frame") || t.includes("aframe"))
    );
  }

  if (clean.includes("granny pod") || clean === "adus & granny pods" || clean === "adus and granny pods" || clean === "modular adus") {
    return (
      mCols.some((c) => c.includes("adu") || c.includes("granny-pod") || c.includes("granny pods")) ||
      mName.includes("adu") ||
      mName.includes("granny pod") ||
      mCat.includes("adu") ||
      mSeries.includes("adu") ||
      mStyle.includes("adu") ||
      mTags.some((t) => t.includes("adu") || t.includes("granny pod"))
    );
  }

  if (clean.includes("barndo") || clean.includes("barndominium")) {
    return (
      mCols.some((c) => c.includes("barndo") || c.includes("barndominium")) ||
      mName.includes("barndo") ||
      mName.includes("barndominium") ||
      mCat.includes("barndo") ||
      mCat.includes("barndominium") ||
      mStyle.includes("barndominium") ||
      mSeries.includes("barndominium")
    );
  }

  if (clean === "house kits" || clean === "kit homes" || clean.includes("house kit") || clean.includes("house-kits")) {
    return (
      mCols.some((c) => c.includes("house-kits") || c.includes("house kits") || c.includes("home-kits") || c.includes("sip panel house kit")) ||
      mCat.includes("house kit") ||
      mSeries.includes("house kit") ||
      mName.includes("house kit") ||
      mName.includes("home kit") ||
      mName.includes("sip panel house kit") ||
      mName.includes("panelized sip")
    );
  }

  if (clean.includes("tiny home") || clean === "tiny homes" || clean === "tiny-homes-1") {
    return (
      mCols.some((c) => c.includes("tiny-home") || c.includes("tiny home")) ||
      mCat.includes("tiny home") ||
      mSeries.includes("tiny home") ||
      mName.includes("tiny home") ||
      mName.includes("tiny cabin") ||
      mTags.some((t) => t.includes("tiny home") || t.includes("tiny-home"))
    );
  }

  if (clean.includes("commercial")) {
    return (
      mCols.some((c) => c.includes("commercial")) ||
      mCat.includes("commercial") ||
      mSeries.includes("commercial") ||
      mStyle.includes("commercial") ||
      mName.includes("commercial")
    );
  }

  if (clean === "cabins" || clean === "cabins for sale" || clean.includes("cabins-for-sale")) {
    return (
      mCols.some((c) => c.includes("cabins-for-sale") || c === "cabins" || c.includes("cabin-plans")) ||
      mCat.includes("cabin") ||
      mSeries.includes("cabin") ||
      (mName.includes("cabin") && !mName.includes("barndo") && !mName.includes("steel house")) ||
      mStyle.includes("cabin")
    );
  }

  if (clean === "prefab homes" || clean === "prefab" || clean.includes("prefab-homes")) {
    return (
      mCols.some((c) => c.includes("prefab-homes") || c.includes("prefab")) ||
      mCat.includes("prefab") ||
      mSeries.includes("prefab") ||
      mName.includes("prefab") ||
      mTags.some((t) => t.includes("prefab"))
    );
  }

  if (clean === "custom homes" || clean.includes("custom-homes")) {
    return (
      mCols.some((c) => c.includes("custom-homes") || c.includes("custom homes")) ||
      mCat.includes("custom") ||
      mSeries.includes("custom") ||
      mTags.some((t) => t.includes("custom"))
    );
  }

  if (clean === "modular homes" || clean.includes("modular-homes") || clean.includes("modular-cabins-for-sale")) {
    return (
      mCols.some((c) => c.includes("modular-cabins-for-sale") || c.includes("modular-homes") || c === "modular homes" || c.includes("modular")) ||
      mCat.includes("modular") ||
      mSeries.includes("modular") ||
      mName.includes("modular") ||
      mTags.some((t) => t.includes("modular")) ||
      mDesc.includes("modular home") ||
      mDesc.includes("modular cabin")
    );
  }

  if (clean.includes("turnkey")) {
    return (
      mName.includes("turnkey") ||
      mName.includes("turn-key") ||
      mDesc.includes("turnkey") ||
      mDesc.includes("turn-key")
    );
  }

  // 3. Fallback: match tokens in name, category, series, tags
  const words = clean
    .split(" ")
    .filter((w) => w.length > 2 && w !== "homes" && w !== "home" && w !== "house" && w !== "and");

  if (words.length > 0) {
    const combined = `${mName} ${mCat} ${mSeries} ${mStyle} ${mTags.join(" ")}`;
    return words.every((w) => combined.includes(w));
  }

  return false;
}
