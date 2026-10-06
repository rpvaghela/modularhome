You are the lead engineer responsible for completing the ModularHome Shopify → Next.js SEO-preserving migration.

IMPORTANT:
This is NOT a redesign task.
This is NOT a DNS-switch task.
This is an SEO migration and URL compatibility task.

DO NOT change DNS.
DO NOT switch modularhome.com.
DO NOT delete Shopify content.
DO NOT delete production Supabase data.
DO NOT make destructive database changes.
DO NOT disable the existing Shopify website.

The existing Shopify website must remain available until the migration is tested and approved.

============================================================
PROJECT INFORMATION
============================================================

Current Shopify:
https://modularhome.com/

Development preview:
https://modularhome.vercel.app/

SiteGround:
https://osagiej6.sg-host.com/

Final production:
https://modularhome.com/

Repository:
SteelWeb

Technology:
- Next.js 16.3.5
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase PostgreSQL
- SiteGround Node.js 22
- Stripe
- Resend
- YouTube API
- OpenAI

Existing architecture already includes:
- Navbar
- Mobile navigation
- Product catalog
- Collections
- Dynamic CMS pages
- Floor plans
- Blog/resources
- Quote system
- Admin
- Supabase
- SEO metadata
- Sitemap
- Middleware redirects

Preserve working functionality.

============================================================
PRIMARY OBJECTIVE
============================================================

Protect the existing SEO of modularhome.com while moving the website from Shopify to Next.js/SiteGround.

The target architecture is:

EXISTING SHOPIFY URL
        ↓
SAME PUBLIC URL IN NEXT.JS
        ↓
HTTP 200

Only use a redirect when the original URL genuinely cannot be retained.

The following public URL patterns must be supported:

/products/[existing-handle]
/collections/[existing-handle]
/pages/[existing-handle]
/blogs/[existing-blog-handle]/[existing-article-handle]

Do NOT automatically convert all Shopify URLs to:

/buildings/[slug]

or:

/buildings?category=[category]

if the original Shopify URL can be served directly.

============================================================
PHASE 1 — INSPECT THE EXISTING CODEBASE
============================================================

Before changing code, inspect:

- package.json
- next.config.ts
- middleware.ts
- sitemap.ts
- robots implementation
- layout.tsx
- Navbar.tsx
- Footer.tsx
- publicData.ts
- Supabase client
- Supabase schema
- product routes
- collection routes
- blog routes
- CMS routes
- floor plan routes
- migration scripts
- redirect logic
- SEO utilities
- metadata generation
- all existing migration/reconciliation scripts

Determine:

1. Current product URL architecture.
2. Current collection URL architecture.
3. Current CMS URL architecture.
4. Current blog URL architecture.
5. Current redirect architecture.
6. Current sitemap architecture.
7. Current canonical implementation.
8. Current robots implementation.
9. Current preview/noindex behavior.
10. Existing migration data available in the repository.

DO NOT rewrite working components unnecessarily.

============================================================
PHASE 2 — CREATE MIGRATION TRACKING SYSTEM
============================================================

Create a migration tracking structure.

Preferred format:

CSV or XLSX if the project already has migration tooling.

Required columns:

content_type
existing_shopify_url
handle
title
existing_seo_title
existing_meta_description
existing_canonical
existing_index_status
new_destination_url
action
content_migration_status
redirect_test_result
final_review_status
notes

Allowed actions:

RETAIN
REDIRECT
RETIRE

Every known URL must have exactly one documented decision.

Do not invent Shopify URLs.

If the Shopify inventory is not available locally, clearly report:

BLOCKED — Shopify URL inventory not provided.

Do not fabricate an inventory.

============================================================
PHASE 3 — URL COMPATIBILITY ROUTES
============================================================

Implement public compatibility routes.

PRODUCTS:

/products/[handle]

The route must:

1. Receive Shopify handle.
2. Resolve product from Supabase.
3. Render the matching product.
4. Return HTTP 200.
5. Generate correct metadata.
6. Generate correct canonical.
7. Render correct images.
8. Render correct structured data.
9. Return genuine 404 if product does not exist.

Do NOT redirect a valid product to an unrelated product.

============================================================
COLLECTIONS
============================================================

Implement:

/collections/[handle]

Resolve the exact Shopify collection handle.

Render:

- collection title
- collection description
- SEO content
- collection image
- correct products
- filters if supported
- pagination if required
- metadata
- canonical
- structured data where appropriate

Example:

/collections/cabins

must render the Cabin collection.

Do not redirect all collections to a generic buildings page.

============================================================
CMS PAGES
============================================================

Implement:

/pages/[handle]

Resolve the migrated CMS page.

Examples:

/pages/about-us
/pages/contact
/pages/financing
/pages/pricing
/pages/team
/pages/warranty

Use actual handles from migrated data.

Only published pages should render.

Missing pages must return HTTP 404.

============================================================
BLOG ARTICLES
============================================================

Implement/support:

/blogs/[blog]/[article]

Example:

/blogs/news/example-article

The article page must preserve:

- original title
- original body
- headings
- paragraphs
- lists
- tables
- images
- image captions
- embedded videos
- author
- publication date
- SEO title
- meta description
- canonical
- internal links
- relevant structured data

IMPORTANT:

Do NOT summarize articles.

Do NOT rewrite established articles.

Do NOT replace article content with AI-generated content.

Preserve the migrated source content.

============================================================
PHASE 4 — EXISTING CONTENT RECONCILIATION
============================================================

Use existing migration data and Supabase records.

Verify:

PRODUCTS:
- title
- handle/slug
- description
- price
- images
- variants
- options
- specifications
- collections
- SEO title
- meta description

COLLECTIONS:
- title
- handle
- description
- image
- products
- SEO title
- meta description

PAGES:
- title
- body
- metadata
- publication state

BLOGS:
- blog handle
- article handle
- title
- body
- images
- author
- publication date
- metadata

Do not fabricate missing data.

If source information is unavailable, report it as unresolved.

============================================================
PHASE 5 — AMISH BUILT CABINS DATA
============================================================

IMPORTANT:

Amish Built Cabins product/catalog data must be reconciled separately from existing ModularHome content.

Do NOT blindly overwrite established ModularHome:

- descriptions
- SEO titles
- meta descriptions
- blog content
- collection content
- URLs

with Amish Built Cabins data.

Use the source catalog for product reconciliation only where appropriate.

Flag conflicts for review.

============================================================
PHASE 6 — REDIRECT SYSTEM
============================================================

Audit the existing middleware redirects.

Existing patterns may include:

/products/:handle
/collections/:handle
/blogs/news/:handle
/pages/:handle

DO NOT automatically redirect these if direct URL compatibility has been implemented.

Redirect only when:

1. The original URL changed.
2. There is a known final destination.
3. The old URL cannot be preserved.

Use permanent server-side redirects.

Preferred:

301

or appropriate 308.

Every redirect must satisfy:

OLD URL
   ↓
ONE REDIRECT
   ↓
FINAL URL
   ↓
HTTP 200

No:

redirect → redirect → final

No loops.

No unrelated homepage redirects.

============================================================
PHASE 7 — IMPORT/RECONCILE EXISTING REDIRECTS
============================================================

Inspect existing Shopify redirect data.

If available, import/reconcile it into the Next.js migration system.

Create a canonical redirect map.

Detect:

- duplicate redirects
- conflicting redirects
- redirect chains
- loops
- redirects to missing pages
- redirects to unrelated pages

Report all problems.

============================================================
PHASE 8 — INTERNAL LINKS
============================================================

Audit internal links throughout the application.

Check:

- Navbar
- Mobile menu
- Footer
- Homepage
- Product pages
- Collection pages
- Blog articles
- Breadcrumbs
- Related products
- CTAs
- Floor plans
- CMS pages

Internal links must point directly to final URLs.

Do NOT intentionally link through redirects.

Remove production references to:

https://modularhome.vercel.app/

and:

https://osagiej6.sg-host.com/

from production content.

Use:

https://modularhome.com/

where production URLs are required.

============================================================
PHASE 9 — CANONICAL URLS
============================================================

Production canonical hostname:

https://modularhome.com/

Use one preferred hostname.

If www is not preferred:

https://www.modularhome.com/

must redirect to:

https://modularhome.com/

HTTP must redirect to HTTPS.

Verify every public page type.

Product example:

URL:
https://modularhome.com/products/example

Canonical:
https://modularhome.com/products/example

Collection example:

URL:
https://modularhome.com/collections/cabins

Canonical:
https://modularhome.com/collections/cabins

Do not accidentally canonicalize every filtered page to an unrelated page.

Review:

- query parameters
- filters
- pagination
- variants
- search pages

============================================================
PHASE 10 — PREVIEW NOINDEX
============================================================

Preview hosts:

https://modularhome.vercel.app/
https://osagiej6.sg-host.com/

must not be indexable.

Implement hostname-aware robots metadata.

Preview:

noindex, nofollow

Production:

index, follow

CRITICAL:

Do NOT use a global environment variable that accidentally makes modularhome.com noindex.

Verify by checking the actual rendered HTML.

Do not rely only on robots.txt.

============================================================
PHASE 11 — SEO METADATA
============================================================

Verify each page type:

Homepage
Product
Collection
CMS page
Blog article
Floor plan

Must have:

- title
- description
- canonical
- H1
- meaningful content
- OpenGraph metadata
- Twitter metadata where configured
- appropriate JSON-LD

Structured data must match visible content.

DO NOT fabricate:

- ratings
- reviews
- prices
- availability
- offers

If information is missing, do not output false structured data.

============================================================
PHASE 12 — 404 HANDLING
============================================================

A genuinely missing URL must return HTTP 404.

Do NOT return:

HTTP 200

with:

"Product not found"

or:

"Page not found"

in the page body.

Use proper Next.js notFound() behavior.

Test:

- missing product
- missing collection
- missing CMS page
- missing blog article

============================================================
PHASE 13 — SITEMAP
============================================================

Audit the current sitemap implementation.

Production sitemap must contain only:

- final canonical URLs
- indexable URLs
- valid HTTP 200 pages

Exclude:

- redirects
- 404 pages
- 410 pages
- admin
- preview URLs
- temporary URLs
- duplicate URLs

Include appropriate:

- products
- collections
- pages
- blogs
- articles
- floor plans

Do not include Vercel or SiteGround hostnames.

============================================================
PHASE 14 — ROBOTS.TXT
============================================================

Production robots.txt must:

Allow public crawling.

Reference:

https://modularhome.com/sitemap.xml

Do not accidentally block:

- images
- CSS
- JavaScript
- public pages
- Supabase assets required for rendering

Preview environments should have stronger noindex protection.

============================================================
PHASE 15 — IMAGE AND ASSET MIGRATION
============================================================

Audit:

- product images
- collection images
- blog images
- CMS images
- floor plans
- PDFs
- CAD files
- downloadable assets
- video embeds

Every migrated asset must work independently from Shopify.

Do not leave critical production content dependent on Shopify if the migration requires independent hosting.

Verify Supabase Storage image URLs.

Verify SiteGround image loading.

Verify Next.js image configuration.

Do not break existing image optimization unnecessarily.

============================================================
PHASE 16 — BUILD
============================================================

Keep SiteGround Node.js 22.

Keep:

"build": "next build --webpack"

Run:

npm install
npm run build

The build must pass.

Do not revert to:

next build

if this reintroduces the SiteGround Turbopack restriction problem.

============================================================
PHASE 17 — AUTOMATED URL TESTER
============================================================

Create or extend a migration URL test script.

It should read the migration tracking dataset.

For each URL test:

- status code
- redirect location
- final status
- final URL
- page title
- canonical
- robots/index status

Expected:

RETAIN:
200

REDIRECT:
301/308
→ exact expected URL
→ 200

RETIRE:
404 or 410

Detect:

- redirect chains
- redirect loops
- incorrect destinations
- unexpected 404
- unexpected 500
- noindex on valuable production pages
- wrong canonical
- temporary hostname references

Output a report.

============================================================
PHASE 18 — PRIORITY SEO TESTS
============================================================

Prioritize:

- highest traffic landing pages
- top products
- top collections
- important blog articles
- high-value category pages
- pages with backlinks
- pages generating leads

However, do not consider the migration ready until the complete known inventory is tested.

============================================================
PHASE 19 — SEARCH CONSOLE / ANALYTICS
============================================================

Do not remove existing Search Console verification.

Do not remove existing analytics.

Check for:

- duplicate analytics
- broken analytics
- missing conversion events
- quote submission tracking
- page view tracking

Because the domain remains:

modularhome.com

DO NOT use Google's Change of Address tool.

If Search Console access/data is unavailable to the coding agent, report:

BLOCKED — external Search Console access required.

Do not pretend this has been completed.

============================================================
PHASE 20 — MIGRATION REPORT
============================================================

Create a final migration report containing:

A. URL inventory count
B. Products count
C. Collections count
D. Pages count
E. Blog count
F. Redirect count
G. Retained URL count
H. Redirected URL count
I. Retired URL count
J. Missing/unresolved URL count
K. Broken URL count
L. Missing content count
M. Missing assets count
N. Canonical errors
O. Noindex errors
P. Sitemap errors
Q. Robots errors

Use:

DONE
IN PROGRESS
BLOCKED

for each migration phase.

For every BLOCKED item explain:

- what is missing
- why it cannot be completed
- what access/file/data is required

============================================================
PHASE 21 — FINAL PRE-LAUNCH CHECKLIST
============================================================

DO NOT allow DNS switch until all applicable items pass:

[ ] Shopify backup available
[ ] Complete URL inventory
[ ] Migration sheet complete
[ ] Product reconciliation complete
[ ] Collection reconciliation complete
[ ] Page reconciliation complete
[ ] Blog reconciliation complete
[ ] Asset verification complete
[ ] URL compatibility complete
[ ] Redirect mapping complete
[ ] Redirect testing complete
[ ] Internal links fixed
[ ] Canonicals verified
[ ] Preview noindex verified
[ ] Production indexability verified
[ ] Sitemap verified
[ ] Robots verified
[ ] SEO metadata verified
[ ] Structured data verified
[ ] 404 handling verified
[ ] Forms verified
[ ] Images verified
[ ] Build passes
[ ] Critical URLs tested
[ ] Migration evidence generated
[ ] Final content sync completed
[ ] Human approval received

============================================================
PHASE 22 — DNS
============================================================

DO NOT perform DNS changes.

The coding agent must stop before DNS.

Only after explicit human approval should DNS be changed.

============================================================
FINAL OUTPUT
============================================================

When finished, provide:

1. Files created
2. Files modified
3. Routes created
4. Routes modified
5. Database queries modified
6. Redirect changes
7. Canonical changes
8. Sitemap changes
9. Robots changes
10. Preview noindex implementation
11. URL compatibility implementation
12. Test commands executed
13. Build result
14. Migration statistics
15. Remaining blockers
16. Required human actions

Do not simply say "completed".

Provide evidence for every completed phase.

MOST IMPORTANT:

Protect existing SEO.

Preserve existing Shopify URLs wherever possible.

Do not rewrite existing content.

Do not fabricate missing data.

Do not switch DNS.

Do not delete Shopify.

Do not make destructive production database changes.

Start by inspecting the existing implementation and migration data.
Then implement the URL compatibility and SEO migration system.
Then run the tests.
Then produce the migration report.