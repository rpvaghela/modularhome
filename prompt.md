# BombShelters.com — Full ModularHome Database Import, Navbar Mapping & SEO Rebranding

## Objective

The complete ModularHome Supabase database has already been cloned into the separate Supabase project used by `SteelWeb/bombshelters-app`.

Now implement a complete, validated data integration for BombShelters.com.

Requirements:

1. Import and preserve the full relevant ModularHome source catalog and content in the BombShelters database.
2. Organize products, collections, pages, blogs, floor plans and other content according to the existing BombShelters navbar and More dropdown.
3. Replace ModularHome branding in BombShelters public SEO metadata with appropriate BombShelters branding.
4. Preserve existing BombShelters URLs, canonical paths, redirect rules and SEO equity wherever possible.
5. Ensure all public pages fetch real database records.
6. Do not change ModularHome.com or its production database.

Workspace:
- ModularHome application: `SteelWeb/`
- BombShelters application: `SteelWeb/bombshelters-app/`

## Phase 1 — Inspect and Inventory the Cloned Database

Before writing or modifying data, inspect the actual BombShelters Supabase schema and verify that the cloned tables contain the expected data.

Inspect all existing tables and relationships, including where available:

- Products
- Collections
- Product-to-collection relationships
- Variants and product options
- Product images and media
- Pages and page sections
- Blog posts and articles
- Floor plans
- Redirects
- Global settings
- Navigation/menu configuration
- Product specifications
- Any additional related catalog or CMS tables

Use actual table and column names discovered in the database. Do not assume that every table exists.

Generate a source inventory with:
- Table name
- Record count
- Primary key
- Important columns
- Product/category relationships
- Publication status
- Existing slug and SEO fields
- Media references
- Missing relationships or incompatible fields

Verify the actual cloned dataset before attempting another import.

IMPORTANT: The database has already been cloned. Do not blindly import the same records again. If records are missing, identify the exact missing records and use idempotent import/upsert logic with verified keys.

## Phase 2 — Build a Complete Navbar-to-Data Mapping

Use the existing BombShelters navbar and More dropdown as the required information architecture.

### Main navbar

1. Modular Homes
2. Prefab Homes
3. Barndominiums
4. House Kits
5. Tiny Homes
6. Park Models
7. Cabins
8. ADUs & Granny Pods
9. A-Frames
10. Commercial

### More dropdown — Buyer Guides & Logistics

1. Delivery & Crane Setting
2. Frequently Asked Questions
3. Pricing & Packages
4. Financing & Mortgages
5. How It Works
6. Technical Blogs
7. Curated Collections

### More dropdown — Services & Planning

1. Floor Plan Store
2. Upload Floor Plan
3. Factory Video Tours
4. About BombShelters
5. Modular Cabins
6. Hardened Storage & Armories
7. Shelters Under $100K
8. Contact & Consultations

Preserve the existing two-column dropdown, responsive menu, labels, icons and styling unless a functional correction is necessary.

For each navbar entry, identify whether it should be backed by:
- A product category or collection
- A CMS landing page
- A blog or resource listing
- A floor-plan listing
- A form or service workflow
- A dynamic filtered catalog

Do not create a product collection for an informational page or a product listing for a form.

Create a central configuration file such as:

`bombshelters-app/config/catalog-category-map.ts`

The configuration should contain stable category identifiers, labels, route paths, mapping rules, parent/child relationships and SEO defaults.

Use the existing project conventions if an equivalent configuration already exists.

## Phase 3 — Map All Product and Collection Records

Import and retain the full relevant source catalog, including legitimate product records, variants, options, collections, specifications and media references.

Use a deterministic mapping strategy based on:
1. Existing product types
2. Collection membership
3. Structured attributes and specifications
4. Product tags
5. Titles and descriptions as a fallback

Do not categorize products solely by matching title keywords when structured data exists.

### Mapping rules

- Preserve source record IDs where safe and compatible.
- Preserve variant relationships and product options.
- Preserve product-to-collection relationships.
- Avoid duplicate products and duplicate collection memberships.
- Keep unpublished source records unpublished until their status has been reviewed.
- Retain original source data and provenance when useful.
- Maintain a report of excluded, ambiguous and unmapped products.
- Allow a product to belong to multiple legitimate categories.
- Ensure each product detail page resolves using a stable ID or slug.
- Implement pagination and efficient database queries for large catalogs.

Do not silently discard source products merely because they do not match a navbar category.

Create an appropriate data mapping for every source product. If a product does not fit any public category, retain it in the database and flag it for review instead of assigning it arbitrarily.

Some ModularHome products may be unrelated to BombShelters. Preserve those records in the cloned database, but do not publicly market them as bomb shelters or claim unsupported protection specifications.

### Data-integrity checks

- Check unique constraints before inserts or updates.
- Verify foreign keys and relationship records.
- Detect duplicate slugs.
- Validate required fields.
- Preserve prices and product specifications accurately.
- Do not invent availability, prices, certifications or product safety claims.
- Use safe, idempotent upserts when actual data correction is required.
- Produce before/after counts for every table modified.

## Phase 4 — Connect the Entire BombShelters Website to Real Data

Trace each user-facing page through:

Navbar → Category page → Database query → Product cards → Product detail page → SEO metadata.

Also connect:
- Collections
- Blog listing and article detail pages
- CMS pages
- Floor-plan store
- Product search and filters
- Related products
- Breadcrumb navigation
- Sitemap generation

Use the existing Supabase data-access layer and BombShelters-specific API routes. Do not hardcode product lists or use mock data as a substitute for database integration.

Use server-side fetching where appropriate, proper pagination, loading states, empty states and error handling.

Verify that every category points to the correct route and returns the correct records.

Do not expose Supabase service-role credentials in client-side code.

## Phase 5 — Rebrand SEO Metadata from ModularHome to BombShelters

Inspect SEO metadata across all public routes, product records, category pages, CMS pages and blog posts.

Replace inappropriate ModularHome brand references with BombShelters branding in the BombShelters application only.

Review:
- HTML title tags
- Meta descriptions
- Canonical URLs
- Open Graph title, description, URL and image
- Twitter/X metadata
- JSON-LD structured data
- Breadcrumb URLs
- Sitemap entries
- Robots metadata
- Internal links
- Product SEO fields
- Category SEO fields
- CMS and blog SEO fields

### Branding rules

Use BombShelters.com as the public canonical domain.

Do not change ModularHome's production SEO settings, metadata, domain or canonical URLs.

Do not perform a blind global replacement of every occurrence of `ModularHome`.

Instead, classify each occurrence:

1. **Public SEO branding:** Replace with BombShelters where appropriate.
2. **Public content:** Rewrite only when the content is factually suitable for BombShelters.
3. **Database schema and internal identifiers:** Preserve names when changing them could break queries or relationships.
4. **Source provenance and migration records:** Preserve the original source identity.
5. **External links:** Review individually; do not rewrite unrelated external URLs automatically.
6. **Historical redirect records:** Preserve unless a verified route migration requires a change.

Use natural, accurate BombShelters-specific titles and descriptions. Do not generate repetitive metadata by merely appending the brand name to every title.

### Metadata requirements

- Unique title and meta description for each indexable product, category and page.
- Canonical URL on the BombShelters domain.
- Correct canonical path matching the actual public route.
- No canonical URLs pointing to ModularHome for BombShelters content.
- Correct Open Graph URLs and images.
- Appropriate Product, Organization, BreadcrumbList, Article and WebPage structured data when supported by real data.
- No fabricated ratings, review counts, prices or product specifications.
- No indexing of admin pages, unpublished products, internal search results or staging deployments.
- Update `robots.txt` and sitemap generation as required.

## Phase 6 — Preserve Existing BombShelters URLs and Redirects

Before changing any slug or route, inventory the existing BombShelters URLs.

Preserve existing indexed BombShelters paths whenever possible, even when the cloned source uses different slugs.

Create an explicit route mapping for any necessary change:
- Old BombShelters URL
- New BombShelters URL
- Reason for change
- Redirect status
- Canonical destination
- Sitemap/internal-link update status

Use permanent 301 redirects when a path genuinely needs to change.

Do not redirect every old path to the homepage. Prevent redirect chains, loops and collisions between product, category, CMS and blog routes.

If the cloned ModularHome database contains redirect records, inspect and adapt only those applicable to BombShelters routes. Do not blindly import ModularHome-domain redirects.

## Phase 7 — Media and Storage

A database clone does not guarantee that Storage buckets and files were copied.

Inspect every relevant image and media reference:
- Verify that the asset is reachable.
- Identify inaccessible source-project Storage URLs.
- Copy required assets into BombShelters-owned storage where authorized.
- Preserve valid URLs when the asset is intentionally hosted externally.
- Avoid duplicate uploads.
- Preserve useful alt text and filenames.
- Use safe image fallbacks for missing files.

Do not fabricate storage paths.

## Phase 8 — Database Security and Environment Isolation

Verify that BombShelters uses its own Supabase project URL, anon key and server-only service-role key.

Check:
- Row Level Security
- Server-side authorization
- BombShelters admin access
- Public read policies for published catalog content
- Restricted writes for admin operations
- Separation of customers, leads, quotations and sessions
- No fallback connection to ModularHome production

Do not expose cloned ModularHome customer records, sessions, leads or quotations on the public website.

Do not copy or reuse production authentication sessions or secrets.

Do not change the existing BombShelters authentication architecture without verifying its dependencies.

## Phase 9 — Test and Validate

Run tests in local or isolated staging environments.

Validate:
- Every navbar item and dropdown link.
- Every product category and category count.
- Product detail routes and slug resolution.
- Product-to-collection relationships.
- CMS and blog pages.
- Pagination, filtering and search.
- Product image availability.
- SEO metadata for all public route types.
- Canonical URLs and sitemap entries.
- Redirect behavior and collision checks.
- Missing or duplicate slugs.
- Database relationship integrity.
- Authentication and authorization.
- TypeScript, linting, regression tests and production build.

A successful HTTP 200 response alone is not proof that a page is correctly integrated.

Do not run destructive tests or bulk updates against production.

## Required reports

Create or update:

1. `bombshelters-app/docs/DATABASE_MAPPING_REPORT.md`
2. `bombshelters-app/docs/NAVBAR_CATEGORY_MAPPING.md`
3. `bombshelters-app/docs/SEO_URL_MIGRATION_REPORT.md`
4. `bombshelters-app/docs/DATA_INTEGRATION_TEST_REPORT.md`

Report actual database counts, products mapped to each navbar category, excluded or ambiguous products, URL changes, redirect requirements, SEO coverage, broken media and unresolved schema issues.

Clearly distinguish verified results from assumptions.

## Execution Order

1. Inspect and inventory the cloned database.
2. Build the mapping plan and inspect existing SEO URLs.
3. Verify category assignments and schema compatibility.
4. Implement the data-access and frontend integration.
5. Update BombShelters SEO metadata and URL mappings.
6. Validate media, redirects and data integrity.
7. Run tests and provide a final report.

Begin with inspection. Do not re-import the entire database if it is already present. Do not make destructive changes, deploy, or modify ModularHome production.