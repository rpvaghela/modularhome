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

  // 2. Specific collection / category logic
  if (clean.includes("a frame") || clean.includes("aframe")) {
    return (
      mName.includes("a-frame") ||
      mName.includes("aframe") ||
      mName.includes("a frame") ||
      mDesc.includes("a-frame") ||
      mDesc.includes("aframe") ||
      mCols.some((c) => c.includes("a-frame") || c.includes("aframe"))
    );
  }

  if (clean.includes("granny pod")) {
    return (
      mName.includes("granny pod") ||
      mDesc.includes("granny pod") ||
      mCols.some((c) => c.includes("granny-pod") || c.includes("granny pods"))
    );
  }

  if (clean.includes("barndo") || clean.includes("barndominium")) {
    return (
      mName.includes("barndo") ||
      mName.includes("barndominium") ||
      mStyle.includes("barndominium") ||
      mSeries.includes("barndominium") ||
      mCols.some((c) => c.includes("barndo") || c.includes("barndominium"))
    );
  }

  if (clean === "house kits" || clean === "kit homes" || clean.includes("house kit")) {
    return (
      mCols.some((c) => c.includes("house-kits") || c.includes("sip panel house kit")) ||
      mName.includes("house kit") ||
      mName.includes("home kit") ||
      mName.includes("sip panel") ||
      mName.includes("panelized")
    );
  }

  if (clean.includes("prefab home") || clean === "prefab homes") {
    return (
      mCols.some((c) => c.includes("prefab-homes") || c.includes("prefab")) ||
      mName.includes("prefab") ||
      mCat.includes("prefab") ||
      mDesc.includes("prefab")
    );
  }

  if (clean.includes("tiny home") || clean === "tiny homes" || clean.includes("tiny")) {
    return (
      mCols.some((c) => c.includes("tiny-homes") || c.includes("tiny")) ||
      mName.includes("tiny") ||
      mDesc.includes("tiny home") ||
      mStyle.includes("adu")
    );
  }

  if (clean.includes("commercial")) {
    return (
      mCols.some((c) => c.includes("commercial")) ||
      mName.includes("commercial") ||
      mStyle.includes("commercial") ||
      mDesc.includes("commercial")
    );
  }

  if (clean.includes("cabin")) {
    return (
      mCols.some((c) => c.includes("cabin")) ||
      mName.includes("cabin") ||
      mStyle.includes("cabin") ||
      mDesc.includes("cabin") ||
      mName.includes("chalet")
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

  if (clean.includes("modular")) {
    return true; // All precision homes in catalog are modular
  }

  // 3. Fallback: match tokens in name or style
  const words = clean
    .split(" ")
    .filter((w) => w.length > 2 && w !== "homes" && w !== "home" && w !== "house" && w !== "and");

  if (words.length > 0) {
    const combined = `${mName} ${mCat} ${mSeries} ${mStyle} ${mTags.join(" ")}`;
    return words.some((w) => combined.includes(w));
  }

  return false;
}
