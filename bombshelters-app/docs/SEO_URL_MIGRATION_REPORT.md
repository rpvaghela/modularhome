# BombShelters.com — SEO & URL Migration Report (Phase 1)

**Date:** October 29, 2026  
**Execution Phase:** Phase 1 (SEO Audit, Canonical Host & URL Strategy)  
**Primary Canonical Domain:** `https://bombshelters.com`

---

## 1. SEO Safety Principles & Domain Isolation

1. **Strict Canonical Isolation:**
   - All canonical URLs, Open Graph tags, and Twitter Cards on BombShelters must point exclusively to `https://bombshelters.com`.
   - **Zero cross-domain references:** `modularhome.com` must **never** be used as a canonical domain, link destination, or metadata author on BombShelters.com.

2. **No Fabricated Schema Data:**
   - Product structured data (`ld+json`) must use real prices from `product_variants.price` or `products.starting_price`.
   - No fabricated aggregate ratings, star counts, or fake reviews will be injected into JSON-LD.

---

## 2. Complete BombShelters URL Inventory

### A. Core Category Landing Pages (10 Routes)
| Route Path | Intended Title | Robots Directive | Canonical Format |
| :--- | :--- | :--- | :--- |
| `/modular-homes` | Precision Steel Modular Homes \| BombShelters.com | `index, follow` | `https://bombshelters.com/modular-homes` |
| `/prefab-homes` | High-Performance Prefab Homes \| BombShelters.com | `index, follow` | `https://bombshelters.com/prefab-homes` |
| `/barndominiums` | Steel Barndominiums & Clearspan Homes \| BombShelters.com | `index, follow` | `https://bombshelters.com/barndominiums` |
| `/house-kits` | Pre-Engineered Steel House Kits & Shells \| BombShelters.com | `index, follow` | `https://bombshelters.com/house-kits` |
| `/tiny-homes` | Compact Steel Tiny Homes & Micro Shelters \| BombShelters.com | `index, follow` | `https://bombshelters.com/tiny-homes` |
| `/park-models` | Relocatable Steel Park Models \| BombShelters.com | `index, follow` | `https://bombshelters.com/park-models` |
| `/cabins` | Fortified Off-Grid Modular Cabins \| BombShelters.com | `index, follow` | `https://bombshelters.com/cabins` |
| `/adus` | Backyard ADUs & Hardened Safe Suites \| BombShelters.com | `index, follow` | `https://bombshelters.com/adus` |
| `/a-frame-homes` | Architectural Steel A-Frame Homes \| BombShelters.com | `index, follow` | `https://bombshelters.com/a-frame-homes` |
| `/commercial-modular-buildings` | Commercial Steel Modular Buildings \| BombShelters.com | `index, follow` | `https://bombshelters.com/commercial-modular-buildings` |

### B. Dynamic Catalog & Resource Detail Pages (7 Routes)
| Route Path | Data Source | Slug Source | Canonical Format |
| :--- | :--- | :--- | :--- |
| `/products/[slug]` | `public.products` (535 rows) | `products.handle` | `https://bombshelters.com/products/[slug]` |
| `/buildings/[slug]` | `public.products` (legacy path) | `products.handle` | 301 Redirect or Canonical to `/products/[slug]` |
| `/models/[slug]` | Curated Shelter Models | Model ID / handle | `https://bombshelters.com/models/[slug]` |
| `/collections/[slug]`| `public.collections` (418 rows) | `collections.handle` | `https://bombshelters.com/collections/[slug]` |
| `/floor-plans/[slug]`| `public.floor_plans` (9 rows) | `floor_plans.slug` | `https://bombshelters.com/floor-plans/[slug]` |
| `/blogs/[blog]/[article]` | `public.blog_posts` (8 rows) | `blog_handle` + `handle` | `https://bombshelters.com/blogs/[blog]/[article]` |
| `/videos/[slug]` | `public.videos` (20,422 rows) | `videos.slug` | `https://bombshelters.com/videos/[slug]` |

### C. Buyer Guides & Informational Pages (15 Routes)
- `/about` — Company history, blast standards & engineering certifications
- `/accessibility` — ADA accessibility statement
- `/contact` — Nationwide consultation & contact details
- `/delivery` — Nationwide freight, crane setting & site excavation guide
- `/faqs` — Comprehensive buyer questions & answers
- `/financing` — Structural construction loans & mortgage guidance
- `/how-it-works` — Step-by-step engineering, fabrication, and subterranean set
- `/pricing` — Turnkey pricing packages & cost breakdown
- `/privacy-policy` — Compliance & privacy policy
- `/quote` — Interactive custom quote request engine
- `/refund-cancellation-policy` — Order cancellation & refund terms
- `/shipping-delivery-policy` — Delivery inspection & logistics policy
- `/terms-of-service` — Customer terms & conditions
- `/upload-floor-plan` — CAD blueprint submission portal
- `/warranty` — 50-year structural steel warranty terms

---

## 3. Redirect Database Analysis (35,845 Rules)

The cloned database includes **35,845 rows** in `public.redirects`:
- **759 redirects** map old `/products/*` paths to `/buildings/*`.
- **13 redirects** map legacy `/pages/*` paths.
- **35,073 redirects** represent legacy Shopify URL paths.

### Strategy for Redirect Execution:
1. **Loop Prevention:** Never create bidirectional rules (e.g. `/products/a -> /buildings/a -> /products/a`).
2. **Standard Target Resolution:** Determine the primary product route for BombShelters (`/products/[slug]`). If `/buildings/[slug]` is requested, render or cleanly redirect without chaining.
3. **High-Performance Middleware Lookup:** Instead of loading all 35,845 records in memory on every request, perform index-accelerated lookups via direct PostgreSQL or cache the top active route redirects.
4. **404 Elimination:** Unmatched legacy paths should route to their respective category landing page rather than blindly falling back to the homepage.

---

## 4. Metadata & Structured Data Standards

### A. Meta Title & Description Formula
- **Product Detail:** `{Product Title} | Structural Steel {Category} | BombShelters.com`
- **Category Pages:** `{Category Label} — Heavy-Gauge Steel Pre-Engineered Builds | BombShelters.com`
- **Technical Blogs:** `{Blog Title} | Engineering Guides | BombShelters.com`

### B. Schema.org Structured Data
1. **Product Pages:**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Product",
     "name": "The Stormview Lodge Steel Barndo House Kit",
     "description": "...",
     "image": "https://cdn.shopify.com/...",
     "offers": {
       "@type": "Offer",
       "price": "414900.00",
       "priceCurrency": "USD",
       "availability": "https://schema.org/InStock",
       "url": "https://bombshelters.com/products/the-stormview-lodge-steel-barndo-house-kit"
     }
   }
   ```
2. **BreadcrumbList:**
   Rendered on all category and product pages: `Home > [Category] > [Product Name]`.

---

## 5. Robots & Sitemap Configuration

1. **`robots.txt` Rules:**
   - **Allowed:** `/`, `/[categories]`, `/products/*`, `/collections/*`, `/floor-plans/*`, `/blogs/*`, `/videos/*`, `/about`, `/contact`, `/pricing`, `/financing`, `/delivery`, `/faqs`, `/how-it-works`.
   - **Disallowed:** `/admin/*`, `/api/*`, `/account/*`, `/*?*` (internal search parameters).
   - **Sitemap Index:** `https://bombshelters.com/sitemap.xml`.

2. **Dynamic Sitemap (`app/sitemap.ts`):**
   - Automatically queries published `products` (`status = 'active'`), `collections` (`published = true`), `blog_posts` (`status = 'PUBLISHED'`), and static pages.
   - Sets appropriate `changeFrequency` (`daily` for catalog, `weekly` for guides, `monthly` for legal policies).

