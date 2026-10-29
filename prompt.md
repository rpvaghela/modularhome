# BombShelters.com — Database Integration, Product Categorization & SEO Preservation

## Project Context

I have two Next.js projects:

- **ModularHome.com:** Existing website and source database.
- **BombShelters.com:** Separate website in `SteelWeb/bombshelters-app`.

The complete ModularHome Supabase database has already been cloned into the BombShelters Supabase project. The cloned database contains products, collections, pages, blog posts, redirects, media references, settings, and related records.

Now integrate the cloned data into BombShelters.com correctly. The goal is to display the appropriate products and content on the BombShelters website, organize everything according to the BombShelters navbar, and preserve or improve BombShelters SEO for every product, category, and page.

## 1. Safety Rules

Before making changes:

1. Inspect the existing BombShelters frontend, backend/API routes, Supabase schema, database records, navbar, sitemap, metadata, and current URL structure.
2. Inspect the existing ModularHome data only as a source for understanding the cloned schema and content.
3. Confirm that BombShelters is connected to its own Supabase project using its own environment variables.
4. Never modify ModularHome source code, production database, configuration, or content.
5. Do not run destructive SQL, production migrations, bulk deletes, or duplicate imports.
6. Do not assume that the cloned database has the same schema, constraints, or relationships as the application expects. Verify actual compatibility.
7. Preserve existing BombShelters branding, design, content, and custom functionality unless a specific change is required.
8. Back up the BombShelters database before any necessary data transformation.

## 2. Discover the Actual Database Structure

Inspect all relevant tables and relationships, including where available:

- `products`
- `collections`
- `product_collections`
- Product variants, options and media
- `pages`
- Page sections or blocks
- `blog_posts` or the actual blog table
- `redirects`
- `floor_plans`
- Global settings
- Navigation and menu configuration
- Product specifications and other related tables

Identify the actual column names, data types, relationships, slug formats, image fields, publication statuses, and SEO fields.

Do not assume that all these tables exist under these exact names.

Produce a mapping report containing:

- Table and column
- Existing source data
- BombShelters destination usage
- Required transformations
- Missing or incompatible fields
- Relationships that must be preserved

## 3. Define BombShelters Navbar Categories

First inspect the existing BombShelters navbar and its intended product categories.

Use the actual navbar labels and existing website structure as the source of truth. Do not invent new categories without justification.

For each navbar item, determine:

- Whether it represents a landing page, product collection, informational page, service page, or dropdown.
- Which database records belong to it.
- Which URL it should use.
- Whether it needs a dedicated category landing page.
- Whether it needs child categories or filters.

Create a category mapping file, for example:

`bombshelters-app/config/catalog-category-map.ts`

Use stable identifiers and explicit matching rules based on verified product types, collection membership, product tags, titles, and available attributes.

Example mapping structure (illustrative only; inspect the actual navbar before using these labels):

- Bomb Shelters
- Underground Shelters
- Above-Ground Shelters
- Shelter Kits
- Commercial and Government Shelters
- Accessories and Supplies
- Guides and Resources

These example categories must not replace the actual navbar categories unless they match the existing BombShelters information architecture.

### Categorization requirements

- Assign each relevant product to the correct category.
- Preserve legitimate multi-category relationships.
- Avoid assigning products using title keywords alone when structured fields are available.
- Do not invent specifications or claim that a product provides protection that its source data does not substantiate.
- Keep unrelated modular homes, cabins, sheds, and general housing products out of BombShelters public listings unless they are genuinely relevant.
- Flag ambiguous products for manual review.
- Avoid duplicate category assignments and duplicate cards.
- Ensure every public category has a useful landing page and sensible empty state.

## 4. Integrate Product and Collection Data

Connect BombShelters product listing, category, search, filtering, and product detail pages to the cloned Supabase data.

For each product, map available fields such as:

- Product name
- Stable product ID
- Slug
- Description and specifications
- Price, where appropriate
- Product images and videos
- Product type and category
- Collection relationships
- Availability or publication status
- Canonical URL and SEO fields
- Page title and meta description
- Structured data attributes, if supported by the source

Use server-side Supabase queries or the project's existing data-access layer. Reuse existing API routes where appropriate and create or update BombShelters-specific endpoints when needed.

Requirements:

- Fetch published and relevant products only.
- Use pagination for large catalogs.
- Avoid loading the entire catalog into a client component.
- Add useful search, category filtering, sorting, loading, error, and empty states.
- Ensure detail pages fetch the correct product by stable ID or slug.
- Handle missing images and incomplete data gracefully.
- Use existing image URLs where valid; do not assume cloned Storage files are available in the new project.
- Do not hardcode product cards or pretend that mock data is live data.

## 5. Preserve BombShelters SEO for Every Product and Page

Treat existing BombShelters URLs and indexed pages as the priority.

Before changing routing, crawl or inventory existing public URLs and record their current:

- Path
- Page title
- Meta description
- Canonical URL
- Indexability
- Sitemap inclusion
- Existing redirect destination, if any

Create a route-mapping report before implementing URL changes.

### SEO requirements

For every product, category, blog post, and content page:

- Generate unique, meaningful page titles and meta descriptions from verified content.
- Preserve existing BombShelters slugs and indexed paths wherever possible.
- Keep canonical URLs on the BombShelters domain.
- Do not use ModularHome.com as the canonical domain for BombShelters pages.
- Avoid duplicate title tags, meta descriptions, and canonical URLs.
- Use correct robots metadata for public and private pages.
- Exclude admin pages, internal search pages, unpublished products, and staging pages from indexing as appropriate.
- Update the sitemap dynamically from published BombShelters content.
- Verify robots.txt and canonical host configuration.
- Add appropriate Open Graph and social-sharing metadata.
- Generate structured data only when the required facts are available and accurate.
- Use appropriate Product, BreadcrumbList, Organization, Article, or WebPage structured data where justified.
- Do not generate Product structured data with fabricated prices, ratings, availability, or reviews.

### URL preservation

Use existing BombShelters paths when they already exist and are appropriate.

If a URL must change:

1. Record the old path and new path.
2. Create a permanent 301 redirect.
3. Ensure the destination returns a successful response.
4. Avoid redirect chains and loops.
5. Update internal links, canonical metadata, and sitemap entries.
6. Preserve existing redirect rules unless they conflict with a verified requirement.

Never redirect unrelated BombShelters pages to a generic homepage merely to avoid a 404.

## 6. Integrate Content Pages and Blog Posts

Inspect existing pages and blog content before publishing anything.

- Match source records to existing BombShelters pages using verified slugs, titles, and content.
- Preserve existing BombShelters copy when it is already correct.
- Adapt imported content to the BombShelters product catalog and brand only when factually supported.
- Remove irrelevant ModularHome-specific references from content intended for BombShelters.
- Preserve useful content structure, headings, internal links, images, publication dates, and SEO metadata when appropriate.
- Do not publish unrelated, duplicated, or incomplete content automatically.
- Keep drafts unpublished until reviewed.
- Preserve redirects for any replaced URLs.

Do not blindly copy every ModularHome page or blog post to the public BombShelters website.

## 7. Media and Images

Check whether the cloned records reference valid image URLs and whether the corresponding files exist in the BombShelters Storage project.

- Verify image URLs before rendering them.
- Identify references to inaccessible Storage buckets or files.
- Copy only required media assets when necessary and permitted.
- Preserve useful filenames and alt text.
- Use meaningful alt text based on the actual image.
- Avoid copying files repeatedly or creating duplicate assets.
- Use responsive image sizes and lazy loading where appropriate.
- Do not fabricate image paths or assume a successful database clone also copied Storage objects.

## 8. Data Isolation and Security

BombShelters must operate independently.

- Use BombShelters-specific Supabase credentials.
- Use server-side access for privileged operations.
- Keep service-role keys out of browser bundles.
- Verify Row Level Security policies and permissions.
- Do not rely exclusively on client-side category filters for access control.
- Ensure admin endpoints enforce BombShelters authentication and authorization.
- Preserve existing BombShelters admin functions.
- Prevent accidental access to ModularHome's live database through fallback environment variables or shared connection strings.

If the cloned database contains customer records, leads, quotations, sessions, or authentication data, do not expose or use them for public product listings. Determine which records should be retained, isolated, anonymized, or excluded before any cleanup.

## 9. Validation and Testing

Test the complete flow:

Navbar category → Category landing page → Product listing → Product detail page → SEO metadata → Sitemap and canonical URL.

Validate:

- Every navbar link opens the correct page.
- Every public category shows the correct products.
- Products are not duplicated unexpectedly.
- Product detail pages use real Supabase data.
- Every published product has a valid slug and URL.
- Existing BombShelters URLs remain accessible.
- Redirects work without loops.
- Canonical URLs use the BombShelters domain.
- Metadata is unique and valid.
- Unpublished and irrelevant content is not indexed.
- Images load correctly.
- Pagination and filters work.
- Missing data does not crash a page.
- No ModularHome source or production data has been changed.

Run TypeScript checks, linting, regression tests, and a production build using the project's existing scripts. Use read-only database checks first and safe staging tests for mutations.

Do not mark a feature as passed merely because the route returns HTTP 200.

## 10. Required Deliverables

Create these documents:

1. `bombshelters-app/docs/DATABASE_MAPPING_REPORT.md`
2. `bombshelters-app/docs/NAVBAR_CATEGORY_MAPPING.md`
3. `bombshelters-app/docs/SEO_URL_MIGRATION_REPORT.md`
4. `bombshelters-app/docs/DATA_INTEGRATION_TEST_REPORT.md`

Include:

- Actual tables and columns discovered
- Product and collection counts
- Products assigned to each real navbar category
- Unmatched and ambiguous products
- Existing versus new URLs
- Redirects required
- SEO metadata coverage
- Broken media references
- Missing fields and schema incompatibilities
- Test results and unresolved blockers

## Execution Order

Phase 1: Read-only inspection and reporting.

Phase 2: Approve the category mapping and URL migration plan.

Phase 3: Implement the data-access layer and frontend integration.

Phase 4: Validate SEO, redirects, images, and category assignments.

Phase 5: Run tests and provide the final report.

Start with Phase 1. Do not run destructive operations or bulk-update records until the mapping and migration plan have been reviewed.