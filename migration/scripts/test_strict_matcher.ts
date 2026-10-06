import * as fs from 'fs';
import * as path from 'path';

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

export function matchProductCategoryStrict(
  model: {
    name?: string;
    category?: string;
    series?: string;
  },
  selectedCat: string
): boolean {
  if (!selectedCat || selectedCat === "All" || selectedCat === "ALL") return true;

  const clean = selectedCat.toLowerCase().replace(/[-_&+/|]/g, " ").replace(/\s+/g, " ").trim();
  if (!clean || clean === "all") return true;

  const mName = (model.name || "").toLowerCase();
  const mCat = (model.category || "").toLowerCase().replace(/[-_&+/|]/g, " ").replace(/\s+/g, " ").trim();

  // 1. Cabins (High priority isolation to prevent bleeding into Modular Homes or Prefab Homes)
  if (clean === "cabins" || clean.includes("cabin")) {
    return (
      mCat === "cabins" ||
      (mName.includes("cabin") && !mName.includes("barndo") && !mName.includes("park model") && !mName.includes("a frame") && !mName.includes("aframe"))
    );
  }

  // 2. Modular Homes (Strictly Modular Homes; NEVER match Cabins)
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

  // 3. Prefab Homes (Strictly Prefab Homes; NEVER match Cabins)
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
    return mCat === "house kits" || mName.includes("house kit") || mName.includes("home kit") || mName.includes("sip panel");
  }

  // 6. Tiny Homes
  if (clean.includes("tiny home")) {
    return mCat === "tiny homes" || mName.includes("tiny home") || mName.includes("tiny house");
  }

  // 7. Park Models
  if (clean === "park models" || clean === "park model") {
    return mCat === "park models" || mName.includes("park model");
  }

  // 8. ADUs & Granny Pods
  if (clean.includes("granny pod") || clean.includes("adu")) {
    return mCat.includes("adu") || mCat.includes("granny pod") || mName.includes("adu") || mName.includes("granny pod");
  }

  // 9. A-Frames
  if (clean.includes("a frame") || clean.includes("aframe")) {
    return mCat.includes("a frame") || mCat.includes("aframe") || mName.includes("a frame") || mName.includes("aframe");
  }

  // 10. Commercial
  if (clean.includes("commercial")) {
    return mCat === "commercial" || mCat.includes("commercial") || mName.includes("commercial") || mName.includes("pole barn") || mName.includes("garage") || mName.includes("workshop");
  }

  // Direct exact category match fallback
  return mCat === clean;
}

const categories = [
  'Modular Homes',
  'Prefab Homes',
  'Cabins',
  'Barndominiums',
  'House Kits',
  'Tiny Homes',
  'Park Models',
  'ADUs & Granny Pods',
  'A-Frames',
  'Commercial Buildings'
];

categories.forEach(cat => {
  const matched = catalog.filter((p: any) => matchProductCategoryStrict(p, cat));
  console.log(`\n=== Category: ${cat} (${matched.length} items) ===`);
  matched.slice(0, 5).forEach((p: any) => {
    console.log(` - [${p.category}] ${p.name}`);
  });
});
