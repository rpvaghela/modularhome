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
 * Checks if a model is a DIY Kit, structural shell, timber frame, panelized kit, or broker listing.
 */
export function isKitOrShell(model: {
  name?: string;
  title?: string;
  slug?: string;
  handle?: string;
  category?: string;
}): boolean {
  const mName = (model.name || model.title || "").toLowerCase();
  const mSlug = (model.slug || model.handle || "").toLowerCase();
  const mCat = (model.category || "").toLowerCase();

  return (
    mCat.includes("kit") ||
    mName.includes("kit") ||
    mSlug.includes("-kit") ||
    mSlug.includes("kit-") ||
    mName.includes("shell") ||
    mSlug.includes("shell") ||
    mName.includes("log cabin kit") ||
    mSlug.includes("log-cabin-kit") ||
    mName.includes("timber frame") ||
    mSlug.includes("timber-frame") ||
    mName.includes("panelized") ||
    mSlug.includes("panelized") ||
    mName.includes("broker") ||
    mSlug.includes("broker") ||
    mName.includes("partner") ||
    mName.includes("dealer") ||
    mName.includes("wagon")
  );
}

/**
 * Checks if a model is an authentic Amish-Built Modular Turnkey Cabin
 * from ABC (Amish Built Cabins, e.g. /collections/amish-built-modular-cabins).
 * These are fully finished, move-in ready turnkey residences.
 * Excludes DIY kits, shells, timber frames, broker listings, and park model RVs.
 */
export function isAmishModularTurnkeyCabin(model: {
  name?: string;
  title?: string;
  slug?: string;
  handle?: string;
  category?: string;
  collections?: string[];
  tags?: string[] | string;
}): boolean {
  const mName = (model.name || model.title || "").toLowerCase();
  const mSlug = (model.slug || model.handle || "").toLowerCase();

  // Exclude kits, shells, panelized DIY kits, timber frame kits, broker listings, wagons
  if (isKitOrShell(model)) return false;

  // Exclude park model RVs (which have their own dedicated category /park-models)
  if (mName.includes("park model") || mSlug.includes("park-model")) {
    return false;
  }

  // 1. Collections: Amish-Built Modular Turnkey Cabins collection on ABC
  const cols = Array.isArray(model.collections)
    ? model.collections.map((c: any) =>
        typeof c === "string" ? c.toLowerCase() : (c.handle || c.title || "").toLowerCase()
      )
    : [];

  const hasAmishModularCol = cols.some(
    (c: string) =>
      c === "amish-built-modular-cabins" ||
      c === "turnkey-modular-cabins" ||
      c === "turnkey-cabins" ||
      c.includes("amish-built-modular")
  );

  if (hasAmishModularCol) return true;

  // 2. Name / Slug matching for Amish modular cabins & turnkey cabins
  if (
    mName.includes("amish built modular cabin") ||
    mSlug.includes("amish-built-modular-cabin") ||
    (mName.includes("amish") && mName.includes("modular cabin")) ||
    (mSlug.includes("amish") && mSlug.includes("modular-cabin")) ||
    (mName.includes("turnkey") && mName.includes("cabin")) ||
    (mSlug.includes("turnkey") && mSlug.includes("cabin"))
  ) {
    return true;
  }

  // 3. Modular cabins (finished turnkey models)
  if (mName.includes("modular cabin") || mSlug.includes("modular-cabin")) {
    return true;
  }

  return false;
}

/**
 * Checks if a model is a storage building, metal pole barn, shed, utility structure, workshop, or garage.
 */
export function isStorageBuilding(model: {
  name?: string;
  title?: string;
  slug?: string;
  handle?: string;
  category?: string;
  product_type?: string;
  series?: string;
  description?: string;
}): boolean {
  const mName = (model.name || model.title || "").toLowerCase();
  const mSlug = (model.slug || model.handle || "").toLowerCase();
  const mCat = normalizeCategory(model.category || model.product_type || model.series || "");
  const mDesc = (model.description || "").toLowerCase();

  return (
    mName.includes("pole barn") ||
    mSlug.includes("pole-barn") ||
    mCat.includes("pole barn") ||
    mName.includes("storage") ||
    mSlug.includes("storage") ||
    mCat.includes("storage") ||
    mName.includes("shed") ||
    mSlug.includes("shed") ||
    mCat.includes("shed") ||
    mName.includes("workshop") ||
    mSlug.includes("workshop") ||
    mName.includes("utility") ||
    mName.includes("garage haven") ||
    mName.includes("garage ranch") ||
    mName.includes("shop/garage") ||
    mName.includes("carport") ||
    mName.includes("metal building") ||
    mName.includes("commercial storage") ||
    mDesc.includes("storage building") ||
    mDesc.includes("pole barn")
  );
}

/**
 * Checks if a model is an affordable residential home/cabin under $100,000.
 * Strictly excludes non-residential furniture/blueprints and any model >= $100,000.
 */
export function isHomeUnder100k(model: {
  name?: string;
  title?: string;
  slug?: string;
  handle?: string;
  category?: string;
  product_type?: string;
  series?: string;
  startingPrice?: number;
  price?: number;
  sqft?: number;
}): boolean {
  const price = (model as any).startingPrice ?? (model as any).price ?? 0;
  if (price <= 15000 || price >= 100000) return false;

  const mName = (model.name || model.title || "").toLowerCase();
  const mSlug = (model.slug || model.handle || "").toLowerCase();
  const mCat = normalizeCategory(model.category || model.product_type || model.series || "");

  // Exclude furniture, broker licenses, consultations, pole barns, and blueprints/plans
  if (
    mName.includes("cabinet") ||
    mName.includes("chair") ||
    mName.includes("table") ||
    mName.includes("desk") ||
    mName.includes("broker") ||
    mName.includes("license") ||
    mName.includes("pole barn") ||
    mSlug.includes("pole-barn") ||
    (mName.includes("plan") && !mName.includes("kit") && !mName.includes("cabin") && !mName.includes("home"))
  ) {
    return false;
  }

  // Must be modular, prefab, cabin, tiny home, ADU, cottage, bungalow, or residential unit
  return (
    mCat.includes("modular") ||
    mCat.includes("prefab") ||
    mCat.includes("cabin") ||
    mCat.includes("tiny") ||
    mCat.includes("adu") ||
    mName.includes("modular") ||
    mName.includes("prefab") ||
    mName.includes("cabin") ||
    mName.includes("tiny") ||
    mName.includes("adu") ||
    mName.includes("bungalow") ||
    mName.includes("cottage") ||
    mName.includes("studio") ||
    mName.includes("retreat") ||
    mSlug.includes("modular") ||
    mSlug.includes("prefab") ||
    mSlug.includes("cabin") ||
    mSlug.includes("tiny") ||
    mSlug.includes("adu") ||
    isAmishModularTurnkeyCabin(model as any)
  );
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
    startingPrice?: number;
    price?: number;
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

  // 0a. Modular Homes Under $100k
  if (
    clean.includes("under 100k") ||
    clean.includes("under-100k") ||
    clean.includes("under $100k") ||
    clean === "modular homes under 100k" ||
    clean === "modular-homes-under-100k"
  ) {
    return isHomeUnder100k(model);
  }

  // 0b. Modular Storage Buildings & Sheds / Pole Barns / Garages / Workshops
  if (
    clean.includes("storage") ||
    clean.includes("modular-storage") ||
    clean.includes("modular storage") ||
    clean.includes("storage building")
  ) {
    return isStorageBuilding(model);
  }

  // 1. Barndominiums
  if (clean.includes("barndo")) {
    return (
      mCat.includes("barndo") ||
      mName.includes("barndo") ||
      mSlug.includes("barndo") ||
      mName.includes("pole barn") ||
      mName.includes("grandview") ||
      mSlug.includes("grandview") ||
      // ABC barndominium kit — slug-based override
      mSlug.includes("the-summit-steel-home-kit") ||
      mName.includes("summit steel")
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
      !mName.includes("barndo")
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
    if (isAmishModularTurnkeyCabin(model)) return true;

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
    // Exclude kits, shells, timber frames, wagons and broker listings from Prefab Homes
    if (isKitOrShell(model)) return false;

    // Client Requirement: Display Amish-Built Modular Turnkey Cabins in Prefab Homes
    if (isAmishModularTurnkeyCabin(model)) return true;

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
        mCat.includes("modular") ||
        mName.includes("panelized") ||
        mName.includes("sip panel")) &&
      !mName.includes("barndo") &&
      !mName.includes("pole barn") &&
      (!mName.includes("duplex") || mSlug.includes("prefab") || mName.includes("prefab")) &&
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

  // 11. Modular Homes
  // Includes move-in-ready modular cabins (from ABC's "Modular Homes" collection and Amish-Built Modular Turnkey Cabins).
  // Kits, shells, barndominium kits, duplex, ADUs, A-Frames, park models and tiny homes
  // are routed to their own collection pages instead.
  if (clean.includes("modular")) {
    const isExcluded =
      mName.includes("log cabin kit") ||
      mSlug.includes("log-cabin-kit") ||
      mName.includes(" kit") ||
      mSlug.includes("-kit") ||
      mName.includes("shell") ||
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
      mName.includes("shed");

    if (isExcluded) return false;

    // Client Requirement: Display Amish-Built Modular Turnkey Cabins in Modular Homes
    if (isAmishModularTurnkeyCabin(model)) return true;

    return (
      mCat === "modular homes" ||
      mCat === "modular" ||
      mCat.includes("modular") ||
      mName.includes("modular home") ||
      mName.includes("modular cabin") ||
      mSlug.includes("modular-cabin") ||
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
      mName.includes("farmhouse")
    );
  }

  return mCat === clean;
}
