# BombShelters.com — Navbar Category Mapping Report (Phase 1)

**Date:** October 29, 2026  
**Execution Phase:** Phase 1 (Taxonomy & Categorization Mapping)  
**Target Architecture:** BombShelters.com Navigation (`bombshelters-app/data/navigation.ts`)

---

## 1. Information Architecture & Source of Truth

The BombShelters navigation is defined in [`bombshelters-app/data/navigation.ts`](file:///c:/Users/cheta/OneDrive/Desktop/Devlopment/SteelWeb/bombshelters-app/data/navigation.ts).  
All 535 products in the cloned Supabase database were analyzed against this taxonomy.

There is a **direct 1-to-1 match** between the 10 top-level navigation items on BombShelters and the `product_type` field in the database.

---

## 2. Category Assignment & Product Distribution

| Navbar Label | Target URL | Database `product_type` Match | Product Count | Primary Characteristics |
| :--- | :--- | :--- | :---: | :--- |
| **House Kits** | `/house-kits` | `House Kits` | **272** | DIY bolt-together structural steel frame kits, panelized SIP kits, shell packages |
| **Barndominiums** | `/barndominiums` | `Barndominiums` | **116** | Clearspan rigid steel frame homes, workshop living quarters, heavy-gauge structures |
| **Cabins** | `/cabins` | `Cabins` | **78** | Fortified off-grid cabins, timber/steel hybrid retreats, high snow-load packages |
| **Modular Homes** | `/modular-homes` | `Modular Homes` | **35** | Turnkey factory-built modular residences, multi-module precision steel builds |
| **Tiny Homes** | `/tiny-homes` | `Tiny Homes` | **11** | Compact small-footprint units, off-grid micro shelters, sub-500 sq ft models |
| **A-Frames** | `/a-frame-homes` | `A-Frames` | **8** | High-pitch steep roof architectural steel A-frame structures, all-weather design |
| **ADUs & Granny Pods** | `/adus` | `ADUs & Granny Pods` | **4** | Backyard accessory dwelling units, interior/exterior reinforced safe suites |
| **Commercial** | `/commercial-modular-buildings` | `Commercial Modular Buildings` | **2** | Mid-size steel commercial office complexes, industrial modular structures |
| **Prefab Homes** | `/prefab-homes` | `Prefab Homes` | **1** | Factory prefabricated high-efficiency residential models |
| **Park Models** | `/park-models` | `Park Models` | **1** | Turnkey recreational park homes & relocatable units |
| *Ambiguous / Flagged* | *(Excluded)* | `Furniture & Accessories` | **7** | Porch swings, Adirondack chairs, general yard accessories (Flagged for review) |
| **Total** | | | **535** | **528 active housing units + 7 accessories** |

---

## 3. Ambiguous & Flagged Products

Seven records in the database carry `product_type: 'Furniture & Accessories'`:
1. `amish-made-porch-swings`
2. `heavy-duty-adirondack-chair`
3. `poly-lumber-glider`
4. `outdoor-patio-picnic-table`
5. `rustic-timber-coat-rack`
6. `cedar-storage-chest`
7. `amish-rocking-chair`

**Recommendation:**  
These 7 accessory items must **NOT** be mixed into core shelter or housing categories (`/modular-homes`, `/cabins`, `/barndominiums`). They should be placed in an optional "Accessories & Supplies" sub-collection or excluded from the primary public catalog to keep the site 100% focused on shelters, bunkers, and structural modular buildings.

---

## 4. Secondary Navigation, Buyer Guides & Resources

The BombShelters **"More"** menu dropdown organizes informational and service pages into two clear columns:

### Column 1: Buyer Guides
| Navbar Label | Target URL | Database Association | Status |
| :--- | :--- | :--- | :--- |
| **Delivery & Crane Setting** | `/delivery` | CMS Page `delivery` | Verified Page |
| **Frequently Asked Questions** | `/faqs` | CMS Page `faqs` & `public.faqs` | Verified Page |
| **Pricing & Packages** | `/pricing` | CMS Page `pricing` & `public.pricing_rules` | Verified Page |
| **Financing & Mortgages** | `/financing` | CMS Page `financing` | Verified Page |
| **How It Works** | `/how-it-works` | CMS Page `how-it-works` | Verified Page |
| **Technical Blogs** | `/blogs` | `public.blog_posts` (8 published articles) | Live Dynamic Route |
| **Curated Collections** | `/collections` | `public.collections` (418 collections) | Live Dynamic Route |

### Column 2: Services & Hardened Shelters
| Navbar Label | Target URL | Database Association | Status |
| :--- | :--- | :--- | :--- |
| **Floor Plan Store** | `/floor-plans` | `public.floor_plans` (9 architectural CAD sets) | Live Dynamic Route |
| **Upload Floor Plan** | `/upload-floor-plan` | Lead form / CAD submission handler | Verified Page |
| **Factory Video Tours** | `/videos` | `public.videos` (20,422 video records) | Live Dynamic Route |
| **About BombShelters** | `/about` | CMS Page `about` | Verified Page |
| **Modular Cabins** | `/modular-cabins` | Filtered `Cabins` catalog subset | Dedicated Landing Page |
| **Hardened Storage & Armories**| `/modular-storage` | Fortified storage & ballistic vault models | Dedicated Landing Page |
| **Shelters Under $100k** | `/modular-homes-under-100k`| Products with `starting_price < 100000` | Dedicated Landing Page |
| **Contact & Consultations** | `/contact` | Consultation submission handler | Verified Page |

---

## 5. Curated Specialty Collections Mapping

In addition to top-level `product_type` listings, BombShelters features curated specialty collections on the homepage and `/collections`:

1. **Subterranean Blast Bunkers (`/collections/underground-bunkers`):** Corrugated and heavy-wall structural steel models with NBC air filtration.
2. **Luxury Subterranean Estates (`/collections/luxury-estates`):** Multi-module subterranean estates with living quarters, solar microgrids, and hydroponics.
3. **EF5 Tornado & Storm Shelters (`/collections/tornado-storm-shelters`):** Tested below-ground garage and patio tornado shelters.
4. **Fortified Off-Grid Cabins (`/collections/off-grid-cabins`):** Cold-formed steel cabins engineered for off-grid homesteads.
5. **Affordable Shelters Under $100k (`/collections/under-100k`):** Turnkey models starting under $100,000.
6. **Interior Ballistic Panic Rooms (`/collections/ballistic-safe-rooms`):** Level 4 ballistic armor plate safe rooms.

---

## 6. Proposed Category Configuration Implementation

During Phase 3, the file `bombshelters-app/config/catalog-category-map.ts` will provide the programmatic single-source-of-truth mapping:

```ts
export interface CategoryMapping {
  slug: string;
  label: string;
  productType: string;
  seoTitle: string;
  seoDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
}

export const CATALOG_CATEGORY_MAP: Record<string, CategoryMapping> = {
  "modular-homes": {
    slug: "modular-homes",
    label: "Modular Homes",
    productType: "Modular Homes",
    seoTitle: "Precision Steel Modular Homes | BombShelters.com",
    seoDescription: "Explore heavy-gauge steel modular homes engineered for maximum structural resilience and lifetime durability.",
    heroHeadline: "Precision Engineered Steel Modular Homes",
    heroSubheadline: "Factory-built modular living quarters with reinforced structural frames and turnkey finishes."
  },
  "barndominiums": {
    slug: "barndominiums",
    label: "Barndominiums",
    productType: "Barndominiums",
    seoTitle: "Steel Barndominiums & Clearspan Homes | BombShelters.com",
    seoDescription: "Industrial-grade clearspan steel barndominiums designed for living quarters, workshops, and reinforced safe rooms.",
    heroHeadline: "Clearspan Structural Steel Barndominiums",
    heroSubheadline: "Massive open-concept living quarters paired with heavy commercial steel framing."
  },
  "house-kits": {
    slug: "house-kits",
    label: "House Kits",
    productType: "House Kits",
    seoTitle: "Pre-Engineered Steel House Kits & Shells | BombShelters.com",
    seoDescription: "DIY-ready bolt-together cold-formed steel framing kits and energy-efficient SIP panel home kits.",
    heroHeadline: "Pre-Engineered Steel House Kits",
    heroSubheadline: "Precision bolt-together framing packages delivered nationwide for owner-builders."
  },
  "cabins": {
    slug: "cabins",
    label: "Cabins",
    productType: "Cabins",
    seoTitle: "Fortified Off-Grid Modular Cabins | BombShelters.com",
    seoDescription: "All-weather fortified steel cabins engineered for off-grid survival, snow loads, and high durability.",
    heroHeadline: "Fortified Modular Steel Cabins",
    heroSubheadline: "Self-sufficient retreats built with precision steel frames and heavy-duty thermal envelopes."
  },
  "tiny-homes": {
    slug: "tiny-homes",
    label: "Tiny Homes",
    productType: "Tiny Homes",
    seoTitle: "Compact Steel Tiny Homes & Micro Shelters | BombShelters.com",
    seoDescription: "Efficient compact steel tiny homes designed for emergency preparedness, guest suites, and off-grid living.",
    heroHeadline: "Compact Precision Steel Tiny Homes",
    heroSubheadline: "Sub-500 sq ft autonomous micro-homes engineered with industrial steel strength."
  },
  "a-frame-homes": {
    slug: "a-frame-homes",
    label: "A-Frames",
    productType: "A-Frames",
    seoTitle: "Architectural Steel A-Frame Homes | BombShelters.com",
    seoDescription: "Iconic steep-pitch architectural steel A-frame structures built for extreme weather and seismic resistance.",
    heroHeadline: "Architectural Steel A-Frames",
    heroSubheadline: "Steep-pitch structural steel frames designed for heavy snow and extreme wind loads."
  },
  "adus": {
    slug: "adus",
    label: "ADUs & Safe Suites",
    productType: "ADUs & Granny Pods",
    seoTitle: "Backyard ADUs & Hardened Safe Suites | BombShelters.com",
    seoDescription: "Reinforced residential accessory dwelling units and ballistic panic sanctuaries.",
    heroHeadline: "Backyard ADUs & Hardened Suites",
    heroSubheadline: "Turnkey secondary dwelling units with optional ballistic reinforcement."
  },
  "commercial-modular-buildings": {
    slug: "commercial-modular-buildings",
    label: "Commercial Modular",
    productType: "Commercial Modular Buildings",
    seoTitle: "Commercial Steel Modular Buildings | BombShelters.com",
    seoDescription: "Heavy commercial modular office complexes, emergency command centers, and industrial facilities.",
    heroHeadline: "Commercial Modular Steel Facilities",
    heroSubheadline: "Scalable commercial steel structures manufactured to industrial blast and safety codes."
  },
  "prefab-homes": {
    slug: "prefab-homes",
    label: "Prefab Homes",
    productType: "Prefab Homes",
    seoTitle: "High-Performance Prefab Homes | BombShelters.com",
    seoDescription: "Precision manufactured prefabricated homes delivering fast installation and superior structural integrity.",
    heroHeadline: "High-Performance Prefabricated Homes",
    heroSubheadline: "Factory-built precision living structures with rapid on-site assembly."
  },
  "park-models": {
    slug: "park-models",
    label: "Park Models",
    productType: "Park Models",
    seoTitle: "Relocatable Steel Park Models | BombShelters.com",
    seoDescription: "Turnkey relocatable steel park models and retreat suites built for long-term durability.",
    heroHeadline: "Relocatable Steel Park Models",
    heroSubheadline: "Mobile modular structures delivering heavy-gauge steel protection."
  }
};
```

