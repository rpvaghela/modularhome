import * as fs from 'fs';
import * as path from 'path';

const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

export function matchProductCategory(
  model: {
    name?: string;
    category?: string;
  },
  selectedCat: string
): boolean {
  if (!selectedCat || selectedCat === "All" || selectedCat === "ALL") return true;

  const clean = selectedCat.toLowerCase().replace(/[-_&+/|]/g, " ").replace(/\s+/g, " ").trim();
  if (!clean || clean === "all") return true;

  const mName = (model.name || "").toLowerCase();
  const mCat = (model.category || "").toLowerCase().replace(/[-_&+/|]/g, " ").replace(/\s+/g, " ").trim();

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
    return mCat.includes("a frame") || mCat.includes("aframe") || mName.includes("a-frame") || mName.includes("aframe");
  }

  // 4. ADUs & Granny Pods
  if (clean.includes("granny pod") || clean.includes("adu")) {
    return mCat.includes("adu") || mCat.includes("granny pod") || mName.includes("adu") || mName.includes("granny pod");
  }

  // 5. Commercial
  if (clean.includes("commercial")) {
    return mCat.includes("commercial") || mName.includes("commercial") || mName.includes("pole barn") || mName.includes("garage") || mName.includes("workshop");
  }

  // 6. Tiny Homes
  if (clean.includes("tiny home")) {
    return mCat === "tiny homes" || (mName.includes("tiny home") && !mName.includes("park model")) || mName.includes("tiny house");
  }

  // 7. Cabins (Must not be barndo, park model, or a-frame)
  if (clean === "cabins" || clean.includes("cabin")) {
    if (mName.includes("barndo") || mName.includes("park model") || mName.includes("a-frame") || mName.includes("aframe")) {
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

  // 10. House Kits
  if (clean === "house kits" || clean.includes("house kit")) {
    if (mName.includes("barndo") || mCat === "barndominiums" || mCat === "cabins") {
      return false;
    }
    return mCat === "house kits" || mName.includes("house kit") || mName.includes("home kit") || mName.includes("sip panel");
  }

  return mCat === clean;
}

const categories = [
  'Modular Homes',
  'Prefab Homes',
  'Barndominiums',
  'House Kits',
  'Tiny Homes',
  'Park Models',
  'Cabins',
  'ADUs & Granny Pods',
  'A-Frames',
  'Commercial Buildings'
];

categories.forEach(cat => {
  const matched = catalog.filter((p: any) => matchProductCategory(p, cat));
  console.log(`\n======================================================`);
  console.log(`CATEGORY: ${cat} (${matched.length} items)`);
  console.log(`======================================================`);
  matched.slice(0, 6).forEach((p: any) => {
    console.log(`  * ${p.name} ($${p.startingPrice || 0}, ${p.sqft || 0} sqft) [Original Cat: ${p.category}]`);
  });
});
