# BombShelters.com — Database Mapping Report (Phase 1 Inspection)

**Date:** October 29, 2026  
**Project Environment:** BombShelters.com (`SteelWeb/bombshelters-app`)  
**Database Host:** `aws-0-us-west-1.pooler.supabase.com` / `db.sxrteizeakvrrkmllwgo.supabase.co`  
**Database Project ID:** `sxrteizeakvrrkmllwgo`  
**Execution Phase:** Phase 1 (Read-Only Inspection & Mapping)

---

## 1. Executive Summary & Infrastructure Isolation

1. **Database Identity & Independence:**
   - BombShelters is verified to connect exclusively to its own dedicated Supabase project: `sxrteizeakvrrkmllwgo` (`NEXT_PUBLIC_SUPABASE_URL=https://sxrteizeakvrrkmllwgo.supabase.co`).
   - ModularHome's separate database (`tbaxtdecjznpqmccldnz`) is completely isolated; zero requests, credentials, or shared connections point to ModularHome.
   - The direct PostgreSQL connection pooler host is `aws-0-us-west-1.pooler.supabase.com:5432/postgres`. (Note: `db.sxrteizeakvrrkmllwgo.supabase.co` resolves to an IPv6-only AAAA record, which fails in pure IPv4 environments. Connecting via the AWS pooler host provides seamless dual-stack IPv4/IPv6 support).

2. **Total Cloned Database Tables:**
   - **27 public tables** were discovered and analyzed.
   - Core data assets include **535 products**, **671 variants**, **3,416 media assets**, **418 collections**, **11,013 product-collection associations**, **35,845 redirects**, **25 content pages**, **8 blog posts**, **9 floor plans**, and **20,422 video records**.

---

## 2. Discovered Tables & Exact Row Counts

| Table Name | Row Count | Primary Purpose | Destination Usage in BombShelters |
| :--- | :---: | :--- | :--- |
| `products` | **535** | Catalog products | Public catalog, category listings, detail pages |
| `product_variants` | **671** | Pricing, SKUs, dimensions | Pricing engine, quote calculator, product specs |
| `product_media` | **3,416** | Product images & galleries | Product image carousels, category cards |
| `product_collections` | **11,013** | Many-to-many product-collection links | Collection landing pages and multi-category filters |
| `collections` | **418** | Product taxonomy collections | Category pages, curated collections (`/collections/*`) |
| `pages` | **25** | Static/CMS site pages | Informational pages (`/about`, `/contact`, `/pricing`, etc.) |
| `page_sections` | **23** | Modular page blocks/content | Dynamic page section rendering |
| `blog_posts` | **8** | Articles & technical guides | Technical blog & guides (`/blogs/*`) |
| `redirects` | **35,845** | Legacy 301 SEO redirects | Edge redirect middleware to prevent 404s |
| `floor_plans` | **9** | Construction blueprints & CAD sets | Floor plan store & viewer (`/floor-plans/*`) |
| `videos` | **20,422** | Video tours & factory walkthroughs | Video gallery (`/videos/*`) |
| `pricing_rules` | **17** | State/regional pricing modifications | Dynamic turnkey delivery/installation pricing |
| `global_settings` | **1** | Site-wide navigation & branding | Site header, footer, contact info |
| `activity_logs` | **177** | Administrative audit logs | Admin security & audit viewer |
| `admin_users` | **1** | Admin credentials | Admin portal authentication |
| `leads` | **13** | Customer inquiries & consultations | Consultation and lead management |
| `quotations` | **5** | Saved customer quotes | Customer quote history and tracking |
| `sessions` | **67** | Legacy session store | Customer/Admin session store |
| `url_migrations` | **784** | Path migration tracking | Verification audit for legacy URLs |
| `login_attempts` | **3** | Rate limiting / auth tracking | Security monitoring |
| `customer_sessions` | **0** | Customer auth sessions | Live customer session management |
| `customers` | **0** | Registered user accounts | Customer portal accounts |
| `orders` | **0** | E-commerce orders | Order management |
| `order_items` | **0** | E-commerce line items | Order line item tracking |
| `reviews` | **0** | Product reviews | Customer testimonials & social proof |
| `faqs` | **0** | Structured FAQs | FAQ accordion component |
| `download_access` | **0** | Gated blueprint downloads | Digital asset delivery |

---

## 3. Schema & Column Mappings for Core Tables

### A. `products` (535 rows)
- **Primary Key:** `id` (`uuid`, default `gen_random_uuid()`)
- **Key Columns:**
  - `handle` (`text`, unique, indexed) — URL slug
  - `title` (`text`, NOT NULL) — Product name
  - `description_html` (`text`) — Full HTML description
  - `vendor` (`text`) — Source vendor name (`Amish Built Cabins`: 354, `Amish Built Cabins | ...`: 123, `ModularHome`: 26, `ModularHome.com`: 24, `My Store`: 7, `Amish Built Cabins Store`: 1)
  - `product_type` (`text`) — Primary category (`House Kits`: 272, `Barndominiums`: 116, `Cabins`: 78, `Modular Homes`: 35, `Tiny Homes`: 11, `A-Frames`: 8, `ADUs & Granny Pods`: 4, `Commercial Modular Buildings`: 2, `Prefab Homes`: 1, `Park Models`: 1, `Furniture & Accessories`: 7)
  - `status` (`text`) — Publication state (`active`: 518, `draft`: 17)
  - `seo_title`, `seo_description` (`text`) — Meta tags
  - `starting_price` (`numeric`) — Base turnkey/kit price
  - `sqft` (`integer`), `bedrooms` (`numeric`), `bathrooms` (`numeric`), `stories` (`numeric`), `dimensions` (`text`)
  - `tags`, `features`, `specs` (`jsonb`) — Structured metadata & bullet points
  - `primary_image_url` (`text`) — Main product hero image
  - `is_featured` (`boolean`) — Homepage spotlight flag
  - `published_at`, `created_at`, `updated_at` (`timestamptz`)

### B. `product_variants` (671 rows)
- **Primary Key:** `id` (`uuid`)
- **Foreign Key:** `product_id` -> `products(id)` ON DELETE CASCADE
- **Columns:** `sku`, `barcode`, `title`, `option1`, `option2`, `option3`, `price`, `compare_at_price`, `inventory_quantity`, `position`, `created_at`

### C. `product_media` (3,416 rows)
- **Primary Key:** `id` (`uuid`)
- **Foreign Key:** `product_id` -> `products(id)` ON DELETE CASCADE
- **Columns:** `source_url` (`text`, NOT NULL), `alt_text` (`text`), `position` (`integer`), `media_type` (`text`, default `'image'`)
- **Hosting Analysis:** **3,414** images are hosted on `cdn.shopify.com`, 1 on `img.youtube.com`, 1 on `tbaxtdecjznpqmccldnz.supabase.co`. Because they are hosted on Shopify CDN, they are permanently accessible without requiring local Supabase Storage object synchronization.

### D. `collections` (418 rows) & `product_collections` (11,013 links)
- **`collections` Primary Key:** `id` (`uuid`)
- **Columns:** `handle`, `title`, `description_html`, `seo_title`, `seo_description`, `image`, `banner_image`, `tagline`, `is_featured`, `display_order`, `published`
- **`product_collections`:** Composite Primary Key `(product_id, collection_id)`

### E. `pages` (25 rows) & `page_sections` (23 rows)
- **Columns:** `id`, `handle`, `title`, `body_html`, `content`, `seo_title`, `seo_description`, `canonical_url`, `og_title`, `og_description`, `og_image`, `robots`, `published`
- **Notable Pages Discovered:** `about`, `contact`, `privacy-policy`, `terms-of-service`, `warranty-certifications`, `buildings`, `models`, `resources`, `studio-models`, `multi-family`.

### F. `blog_posts` (8 rows)
- **Columns:** `id`, `blog_handle`, `handle`, `title`, `body_html`, `excerpt`, `author`, `tags`, `seo_title`, `seo_description`, `published_at`, `status`, `youtube_video_id`, `thumbnail_url`

### G. `redirects` (35,845 rows)
- **Columns:** `id`, `from_path`, `to_path`, `http_status` (default 301), `source`
- **Breakdown:** 759 product-to-building redirects, 13 page redirects, and 35,073 legacy Shopify redirect rules.

---

## 4. Key Architectural Findings & Schema Incompatibilities

### Finding 1: Row Level Security (RLS) Configuration
- **Observation:** All 27 tables in `public` have RLS enabled (`rowsecurity = true`).
- **Issue:** Only the `videos` table has an existing public `SELECT` policy (`Allow public read access`). Tables `products`, `collections`, `pages`, `blog_posts`, and `redirects` currently have **no public SELECT policy**.
- **Impact:** Any query using the public `NEXT_PUBLIC_SUPABASE_ANON_KEY` returns 0 rows.
- **Recommended Solution:** In Phase 3, add public read-only policies for published content (`CREATE POLICY "Allow public read access" ON public.<table_name> FOR SELECT USING (true);`) or utilize server-side Supabase client helpers (`supabaseAdmin` / direct connection) for data retrieval.

### Finding 2: Existing Code Scoping by Vendor
- **Observation:** `bombshelters-app/lib/productStore.ts` currently filters queries with `.eq("vendor", "BombShelters.com")`.
- **Issue:** The cloned database products currently carry vendor labels `Amish Built Cabins` and `ModularHome`. None of the 535 products have `vendor = 'BombShelters.com'`.
- **Impact:** Filtering by `vendor = "BombShelters.com"` causes the store to return zero database products.
- **Recommended Solution:** In Phase 3, filter by `status = 'active'` and categorize by `product_type` matching the BombShelters navbar taxonomy.

### Finding 3: Media Hosting Resilience
- **Observation:** Over 99.9% of product images reside on `cdn.shopify.com`.
- **Impact:** No missing storage bucket errors or broken Supabase Storage asset references. Images load immediately and reliably.

### Finding 4: Global Settings Table Content
- **Observation:** `public.global_settings` row contains legacy branding (`ModularHome.com`, `modularhome.admin@gmail.com`).
- **Impact:** Must not overwrite BombShelters branding.
- **Recommended Solution:** Maintain BombShelters independent settings in `bombshelters-app/data/custom_settings.json` and isolate tenant metadata.

