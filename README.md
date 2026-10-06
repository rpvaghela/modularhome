# MODULARHOME — COMPLETE DATA CORRECTION & MIGRATION RECONCILIATION

You are working on the ModularHome.com migration project.

IMPORTANT:
This is NOT a request to manually patch a few example products.
The client has identified systemic data migration, product mapping, category,
image, pricing, SEO, URL and frontend data-binding problems.

You must audit and correct the migration at the SOURCE → DATA → DATABASE →
FRONTEND level.

DO NOT mark the migration complete until the complete audit passes.

============================================================
0. CRITICAL RULES
============================================================

DO NOT change DNS.

DO NOT switch modularhome.com from Shopify.

DO NOT modify the live Shopify website.

DO NOT delete source migration files.

DO NOT invent product information.

DO NOT generate fake prices, dimensions, specifications, variants,
warranties or features.

DO NOT manually hardcode individual product fixes.

DO NOT fix only the examples mentioned by the client.

The examples are symptoms of a larger data-mapping problem.

Every correction must be made through the authoritative data pipeline
so that the correction automatically appears everywhere.

============================================================
1. AUTHORITATIVE DATA SOURCES
============================================================

There are TWO different authoritative sources.

SOURCE A — MODULARHOME
https://modularhome.com/

Use ModularHome as the authority for:

- Navigation
- Menus
- Submenus
- Pages
- Blogs/articles
- Existing SEO content
- SEO titles
- Meta descriptions
- Existing URLs
- URL slugs
- Internal links
- Canonical strategy
- Existing Shopify redirects

SOURCE B — AMISH BUILT CABINS
https://amishbuiltcabins.com/

Use Amish Built Cabins as the authority for:

- Products
- Product/model names
- Product descriptions
- Product categories
- Prices
- Variants
- Options
- Dimensions
- Square footage
- Living area
- Porch area
- Bedrooms
- Bathrooms
- Features
- Specifications
- Product images
- Gallery images
- Floor plans
- Actual product information

NEVER mix the two source authorities.

============================================================
2. FIRST — CREATE A COMPLETE SOURCE AUDIT
============================================================

Before modifying production application data, inspect the current
migration source files and application data.

Identify:

- Product source files
- Blog source files
- Page source files
- Collection source files
- SEO files
- URL mapping
- Redirect mapping
- Product catalog
- Existing database seed files
- Existing hardcoded product data
- Quote/pricing data
- Menu data
- Image mappings

Create:

migration/reports/source_authority_map.md

Document:

DATA TYPE | AUTHORITATIVE SOURCE | SOURCE FILE | DESTINATION

Example:

Products | Amish Built Cabins | Products.csv | Product catalog
Blogs | ModularHome | admin_articles.json | Blog database
Pages | ModularHome | admin_pages.json | CMS pages
SEO | ModularHome | admin_seo_combined.json | SEO metadata
Menus | ModularHome | admin_menus.json | Navigation
Redirects | ModularHome | existing_redirects.csv | Middleware

============================================================
3. PRODUCT MASTER DATA PIPELINE
============================================================

Create ONE canonical product data model.

The frontend, collections, search, homepage cards and quote system
must all consume this same product model.

Recommended canonical structure:

{
  id,
  slug,
  name,
  description,
  category,
  subcategory,
  sqft,
  dimensions,
  livingArea,
  porchArea,
  bedrooms,
  bathrooms,
  specifications,
  features,
  startingPrice,
  variants,
  availability,
  primaryImage,
  gallery,
  floorPlanImage,
  floorPlanAvailable,
  sourceUrl
}

Do not create separate competing values for:

- Homepage
- Product card
- Product detail
- Quote wizard
- Search
- Collection

All must read the same canonical product record.

============================================================
4. PRODUCT SOURCE RECONCILIATION
============================================================

Audit EVERY product.

Do not audit only:

- Azteca Modern Cabin
- Country Rancher

Those are examples of the problem.

For every product compare:

SOURCE
vs
CURRENT DATABASE/CATALOG

Check:

- Name
- Slug
- Description
- Category
- Dimensions
- Square footage
- Living area
- Porch area
- Bedrooms
- Bathrooms
- Specifications
- Features
- Starting price
- Variant prices
- Variant names
- Availability
- Primary image
- Gallery
- Floor plan

Create:

migration/reports/product_source_reconciliation.csv

Columns:

product_slug
product_name
source_url
field
source_value
current_value
match_status
recommended_action

match_status:

MATCH
MISMATCH
MISSING_SOURCE
MISSING_DESTINATION
DUPLICATE
HUMAN_REVIEW

IMPORTANT:

If the source does not contain a value:

DO NOT invent it.

Use:

NULL
NOT_AVAILABLE
or the application's approved empty-state.

============================================================
5. AZTECA VALIDATION
============================================================

Explicitly verify the Azteca Modern Cabin against the Amish source.

The client reported:

Homepage:
560 sq ft

Product page:
850 sq ft / 24x36

Product name:
14x40

Find the authoritative source value.

Then make the canonical product record contain ONLY the verified
source value.

After correction verify:

Homepage
Collection card
Search result
Product page
Quote wizard
Admin

all display the SAME value.

Do not manually patch the homepage.

============================================================
6. COUNTRY RANCHER VALIDATION
============================================================

The client reported:

New website:
144 sq ft

Source:
1,144 sq ft living area
+
360 sq ft porch

Verify the source.

Correct the canonical product record.

Then verify the value everywhere:

Homepage
Collection
Search
Product detail
Quote
Admin

No individual component should contain a hardcoded alternative value.

============================================================
7. PRODUCT CONSISTENCY TEST
============================================================

Create an automated consistency test.

For every public product:

DATABASE
==
LISTING CARD
==
PRODUCT DETAIL
==
QUOTE DATA

Check:

name
sqft
dimensions
price
variants
images
category

Create:

migration/scripts/test_product_consistency.ts

Output:

TOTAL PRODUCTS
PASSED
FAILED
MISMATCH COUNT

The test must fail if one product has different values between
components.

============================================================
8. CATEGORY / COLLECTION RECONCILIATION
============================================================

Rebuild product-to-category mapping from the authoritative
Amish Built Cabins source.

Do NOT trust the existing category assignment blindly.

For every product determine:

primary category
secondary category
collection membership

Remove unrelated products.

Pay special attention to:

- Park Models
- Cabins
- House Kits
- Barndominiums
- Modular Homes
- ADUs & Granny Pods
- Tiny Homes
- A-Frames

The client reported:

Park Models incorrectly contains approximately 729 products including
steel house kits and barndominiums.

Audit the entire category.

DO NOT manually remove a few products.

Rebuild the relationship from source data.

Create:

migration/reports/category_reconciliation.csv

Columns:

product_slug
product_name
source_category
current_category
source_collections
current_collections
status
action

============================================================
9. COLLECTION COUNT VERIFICATION
============================================================

For every collection:

Calculate actual product count from canonical product data.

Compare:

source count
database count
frontend count

Create:

migration/scripts/test_collection_counts.ts

The test must detect:

- unrelated products
- missing products
- duplicate products
- incorrect counts

============================================================
10. MENU → COLLECTION → PRODUCT RELATIONSHIP
============================================================

Use ModularHome as the authoritative source for menu hierarchy.

Verify:

Menu
 ↓
Submenu
 ↓
Collection
 ↓
Products

Every menu item must point to the correct collection.

Every collection must contain the correct products.

Every product must belong to the correct category.

Do not change menu names unless required by the ModularHome source.

Create:

migration/reports/menu_collection_product_audit.md

============================================================
11. IMAGE / GALLERY RECONCILIATION
============================================================

Use Amish Built Cabins as the product image authority.

For every product verify:

primary image
gallery
image order
duplicates
cross-product images
floor plan

Create:

migration/reports/product_media_reconciliation.csv

Columns:

product_slug
primary_image
gallery_count
floor_plan
image_status
floor_plan_status
source_reference
action

Classifications:

MATCH
MISSING
WRONG_PRODUCT
DUPLICATE
FLOOR_PLAN_MISSING
HUMAN_REVIEW

============================================================
12. FLOOR PLAN SAFETY RULE
============================================================

NEVER use an exterior product photograph as a floor plan.

If:

floorPlanImage == exteriorImage

or the image is not actually a blueprint/floor plan:

REMOVE IT.

Use the approved UI:

"Floor Plan Not Available"

or:

"Architectural Blueprint Available Upon Request"

Do NOT substitute an unrelated image.

Explicitly test the Azteca example.

============================================================
13. PRICING & VARIANT RECONCILIATION
============================================================

Use Amish Built Cabins as the pricing authority.

For every product compare:

base price
variant prices
option names
variant names
package names

Do NOT generate generic upgrade pricing.

Explicitly verify the Azteca source options.

The client reported:

$33,900
$120,000
$135,000

Verify these against the source.

Then store the actual source variants.

Create:

migration/reports/product_pricing_reconciliation.csv

Columns:

product_slug
variant
source_price
current_price
match_status
action

============================================================
14. QUOTE SYSTEM REBUILD
============================================================

The quote system MUST consume the same canonical product data.

Do NOT maintain separate hardcoded quote prices.

Flow:

Product
 ↓
Variant
 ↓
Base Price
 ↓
Selected Options
 ↓
Quote Calculation

Create:

migration/scripts/test_quote_product_consistency.ts

For each tested product verify:

product price
variant price
quote base price

are identical to canonical product data.

Test:

Azteca
Country Rancher
Pioneer Rancher
Campfire Rancher

plus samples from EVERY major category.

============================================================
15. REMOVE HARD-CODED PRODUCT VALUES
============================================================

Search the entire codebase for hardcoded product values.

Search for:

sqft
price
dimensions
bedrooms
bathrooms
variant
startingPrice
floorPlan
product names

Identify values embedded directly in:

.ts
.tsx
.json
constants
components
quote logic
homepage cards
collection cards

Create:

migration/reports/hardcoded_product_data_audit.md

Replace hardcoded values with canonical product data.

Exception:

Static UI labels are allowed.

Product facts are NOT allowed to be hardcoded.

============================================================
16. BLOG MIGRATION
============================================================

Use ModularHome as the authoritative source.

Verify all 190 articles.

Check:

title
full HTML body
headings
author
publication date
featured image
content images
videos
tags
category
SEO title
meta description
slug
canonical
internal links

Do NOT rewrite or summarize articles.

Create:

migration/reports/blog_final_reconciliation.csv

============================================================
17. PAGE & SEO MIGRATION
============================================================

Use ModularHome as authority.

Verify all existing public pages.

Check:

title
H1
content
SEO title
meta description
canonical
slug
internal links
image alt text where available

Blank stored SEO override does NOT automatically mean no SEO metadata.

Use rendered SEO baseline where appropriate.

============================================================
18. URL MIGRATION
============================================================

Build one complete URL inventory.

For every source URL determine:

KEEP
301
404/RETIRE
HUMAN_REVIEW

Never redirect all URLs to homepage.

Create:

migration/reports/final_url_mapping.csv

Columns:

old_url
new_url
action
status_code
canonical
reason

============================================================
19. REDIRECT VALIDATION
============================================================

Verify:

- All original Shopify redirects
- All additional migration redirects
- Affiliate redirects:
  /aflaki
  /osi
  /zahid

Every redirect must be:

301
one-hop
no loop
no chain

Create:

migration/scripts/test_all_redirects.ts

Output:

TOTAL
PASS
FAIL
CHAINS
LOOPS

============================================================
20. FRONTEND DATA-BINDING AUDIT
============================================================

Trace the complete data flow.

For product:

SOURCE
 ↓
IMPORT
 ↓
DATABASE / JSON
 ↓
PUBLIC DATA LAYER
 ↓
SERVER COMPONENT
 ↓
CLIENT COMPONENT
 ↓
UI

Identify any component that bypasses the canonical data layer.

Pay special attention to:

Homepage
Product cards
Collection pages
Search
Product detail
Quote wizard
Admin product management
Mega menu

Every product fact must originate from canonical product data.

============================================================
21. FULL END-TO-END TEST
============================================================

Create:

migration/scripts/run_final_data_audit.ts

For every major category select representative products.

Minimum:

Modular Homes
Cabins
House Kits
Barndominiums
ADUs
Park Models
Tiny Homes
A-Frames

For each sample test:

SOURCE
→ DATABASE
→ COLLECTION
→ PRODUCT CARD
→ PRODUCT PAGE
→ QUOTE

Verify:

name
price
sqft
dimensions
variants
images
floor plan
category

============================================================
22. DO NOT STOP AT EXAMPLES
============================================================

The client explicitly said:

"Please check every product for similar errors, not just these two."

Therefore:

DO NOT declare success because:

Azteca passes
Country Rancher passes

The complete dataset must pass.

============================================================
23. FINAL BUILD
============================================================

Run:

npm run build

Use the project's configured production build command.

Resolve all build errors.

Then run:

npx tsx migration/scripts/run_final_data_audit.ts

and all supporting migration tests.

============================================================
24. FINAL REPORTS
============================================================

Generate all of these:

migration/reports/product_source_reconciliation.csv
migration/reports/category_reconciliation.csv
migration/reports/product_media_reconciliation.csv
migration/reports/product_pricing_reconciliation.csv
migration/reports/blog_final_reconciliation.csv
migration/reports/final_url_mapping.csv
migration/reports/menu_collection_product_audit.md
migration/reports/hardcoded_product_data_audit.md
migration/reports/final_data_audit.md

============================================================
25. FINAL REPORT FORMAT
============================================================

final_data_audit.md must contain:

# ModularHome Final Data Migration Audit

## Source Authority
ModularHome:
https://modularhome.com/

Amish Built Cabins:
https://amishbuiltcabins.com/

## Products

Source records:
Imported:
Matched:
Mismatched:
Missing:
Human review:

## Categories

Total categories:
Products checked:
Incorrect mappings:
Corrected:

## Images

Products checked:
Correct:
Missing:
Wrong:
Duplicate:

## Floor Plans

Available:
Missing:
Incorrect:
Corrected:

## Pricing

Products checked:
Variants checked:
Price mismatches:
Corrected:

## Blogs

Source:
Imported:
Missing:
Mismatched:

## Pages

Source:
Imported:
Missing:
Mismatched:

## URLs

Total:
200:
301:
404:
Unexpected:

## Frontend Consistency

Database = Listing:
Database = Product Page:
Database = Quote:

## Build

Build:
PASS/FAIL

## Final Result

PASS
or
REVIEW REQUIRED

============================================================
26. FINAL PASS CONDITIONS
============================================================

Only report:

FINAL RESULT: PASS

when ALL are true:

- Every product audited
- No unexplained product mismatch
- No incorrect category mapping
- No wrong product image
- No exterior image used as floor plan
- No unexplained pricing mismatch
- No unexplained variant mismatch
- Quote uses canonical product data
- Homepage uses canonical product data
- Collection pages use canonical product data
- Product pages use canonical product data
- 190 blogs verified
- 51 pages verified
- URLs mapped
- Redirects verified
- No redirect loops
- No redirect chains
- Build passes
- Final automated audit passes

If any item remains unresolved:

FINAL RESULT: REVIEW REQUIRED

============================================================
27. DNS SAFETY
============================================================

ABSOLUTELY DO NOT:

- change DNS
- change domain records
- disconnect Shopify
- point modularhome.com to SiteGround
- delete Shopify data

Keep:

https://modularhome.com/

on Shopify.

Use:

https://osagiej6.sg-host.com/

for staging verification.

Only after stakeholder approval should DNS cutover be performed.

============================================================
FINAL INSTRUCTION
============================================================

Do not simply tell me what is wrong.

IMPLEMENT THE CORRECTIONS.

Start with the source/data reconciliation, then fix the canonical product
data model, category relationships, media mappings, pricing/variants and
quote integration.

After implementation, run the complete audit.

Return:

1. Files changed
2. Data records corrected
3. Number of products audited
4. Number of mismatches found
5. Number of mismatches corrected
6. Remaining issues
7. Test results
8. Build result
9. Final recommendation

DO NOT claim completion until the complete dataset passes.