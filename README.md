TASK: MAKE EVERY EXISTING MODULARHOME WEBSITE PAGE EDITABLE FROM ADMIN

The requirement is simple and strict:

EVERY EXISTING CUSTOMER-FACING PAGE ON THE MODULARHOME WEBSITE MUST BE EDITABLE FROM THE ADMIN PANEL WITHOUT MODIFYING NEXT.JS SOURCE CODE.

Do NOT only make newly created CMS pages editable.

The admin must be able to open an existing page, edit its visible content, save it, refresh, and see the changes on the public website.

==================================================
1. FIRST AUDIT EVERY EXISTING PUBLIC PAGE
==================================================

Scan the entire Next.js application and identify EVERY customer-facing route.

Inspect:

src/app/
src/components/
src/lib/
src/data/
src/app/[slug]/

Find both:

A. CMS/DYNAMIC PAGES
B. HARDCODED / COMPONENT-BASED PAGES

Create an internal inventory such as:

/                       Home
/about                  About
/contact                Contact
/models                 Models
/buildings              Buildings
/buildings/[slug]       Building Detail
/floor-plans            Floor Plans
/floor-plans/[slug]     Floor Plan Detail
/resources              Resources
/blog/[slug]            Blog Article
/videos                 Videos
/quote                  Quote
/etc.

Do not assume the list above is complete.

Use the actual repository to identify every public route.

==================================================
2. IMPORTANT: DO NOT REBUILD EXISTING PAGES
==================================================

Do NOT replace the existing frontend design.

Do NOT remove existing components.

Do NOT change the visual design unnecessarily.

The goal is:

EXISTING PAGE
+
DATABASE-BACKED CONTENT
+
ADMIN EDITOR

The public page should continue using the existing design/components.

Only the content/data source should become editable.

==================================================
3. CREATE A PAGE CONTENT MODEL
==================================================

Every existing public page should have an associated CMS record.

Use the existing `pages` table if possible.

Do NOT create duplicate page systems if an existing CMS structure can be extended.

Each page should have at minimum:

id
title
slug
status
template/type
seo_title
meta_description
canonical_url
og_title
og_description
og_image
created_at
updated_at
published_at

Add additional fields only where required.

==================================================
4. EVERY PAGE MUST HAVE EDITABLE CONTENT
==================================================

The admin must be able to edit the actual content displayed on every page.

For example:

HOME PAGE

Admin should be able to edit:

- hero heading
- hero description
- hero image
- hero image alt
- primary CTA
- primary CTA URL
- secondary CTA
- secondary CTA URL
- trust/value section
- featured models
- collections
- financing content
- video section
- testimonials
- FAQ
- gallery
- CTA section
- section visibility
- section order

ABOUT PAGE

Admin should be able to edit:

- page title
- subtitle
- hero image
- hero text
- company story
- headings
- paragraphs
- images
- image alt text
- CTA
- sections
- visibility/order

CONTACT PAGE

Admin should be able to edit:

- title
- description
- phone
- email
- address
- business hours
- contact information
- map/embed settings if applicable
- CTA
- form heading/content
- social links
- SEO fields

MODELS / BUILDINGS

Admin should be able to manage:
- page headings
- introductory text
- banners
- filters/categories where applicable
- SEO content
- featured content

PRODUCT/BUILDING DETAIL PAGE

The admin should be able to edit:
- title
- description
- images
- videos
- specifications
- features
- floor plans
- CTA
- SEO
- image alt text
- supporting content

FLOOR PLAN PAGE

Admin should be able to edit:
- title
- description
- images
- specifications
- pricing
- CTA
- SEO
- downloadable files where applicable

VIDEOS PAGE

Admin should be able to edit:
- page title
- introduction
- video sections
- video titles
- descriptions
- thumbnails
- ordering
- visibility

QUOTE PAGE

Admin should be able to edit:
- heading
- description
- instructions
- CTA text
- form labels
- supporting content
- disclaimer
- SEO fields

RESOURCES/BLOG

Admin should already be able to manage content through the Blog/Resources CMS.

==================================================
5. COMPONENT-BASED PAGES
==================================================

This is the most important part.

Find pages where content is currently hardcoded inside React/Next.js components.

For example:

<h1>Some Hardcoded Heading</h1>

<p>Some hardcoded paragraph...</p>

Instead of forcing the client to edit source code, move editable content into the CMS/database.

Example:

BEFORE:

<h1>Build Your Dream Home</h1>

AFTER:

<h1>{pageContent.hero.heading}</h1>

The database should contain:

hero.heading = "Build Your Dream Home"

The admin edits the database value through the Admin UI.

Do this systematically for ALL customer-visible editable content.

==================================================
6. DO NOT MAKE EVERYTHING RAW JSON
==================================================

The client must NOT need to edit JSON.

Every section must have a proper form.

For example:

HERO SECTION

Heading:
[________________________]

Description:
[________________________]

Image:
[Upload / Select Image]

Image Alt:
[________________________]

Primary Button:
[________________________]

Primary URL:
[________________________]

Secondary Button:
[________________________]

Secondary URL:
[________________________]

Visible:
[ON/OFF]

==================================================
7. SECTION TYPES
==================================================

Reuse the existing Section Block system wherever possible.

Existing section types include:

HERO
TRUST
PRODUCT_GRID
COLLECTION_GRID
HOW_IT_WORKS
FINANCING
VIDEO
TESTIMONIALS
FAQ
GALLERY
CTA
RICH_CONTENT

Make these reusable across ALL pages.

Do not create a different editor for every page unless the page genuinely requires a unique section.

==================================================
8. PAGE TEMPLATE SYSTEM
==================================================

Create a clean template architecture.

Example:

PAGE
 ├── metadata
 ├── hero
 ├── sections[]
 │    ├── HERO
 │    ├── RICH_CONTENT
 │    ├── PRODUCT_GRID
 │    ├── COLLECTION_GRID
 │    ├── VIDEO
 │    ├── FAQ
 │    ├── GALLERY
 │    └── CTA
 └── SEO

Then:

Admin
 ↓
Edit Page
 ↓
Edit Sections
 ↓
Save
 ↓
Supabase
 ↓
Public Page
 ↓
Refresh
 ↓
Updated content appears

==================================================
9. PAGE MANAGER UI
==================================================

Update:

/admin/pages

The page list should show ALL existing public pages.

Columns:

Page
URL
Template
Status
Created
Updated
Actions

Actions:

Edit
Preview
Sections
SEO
Publish/Unpublish

Example:

| Page | URL | Status | Updated | Actions |
|------|-----|--------|---------|---------|
| Home | / | Published | 30 Sep 2026 | Edit |
| About | /about | Published | 30 Sep 2026 | Edit |
| Contact | /contact | Published | 29 Sep 2026 | Edit |
| Buildings | /buildings | Published | 29 Sep 2026 | Edit |

==================================================
10. EXISTING PAGE DISCOVERY
==================================================

Do NOT only use records already present in the `pages` table.

Compare:

DATABASE PAGES

against:

ACTUAL NEXT.JS PUBLIC ROUTES

Find pages that exist in code but do not have CMS records.

For each missing page:

Create a corresponding CMS page record.

Example:

Existing code:

src/app/about/page.tsx

but database has no:

/about

Create:

Page:
About

Slug:
/about

Template:
ABOUT

Then connect the existing `/about` frontend page to the CMS content.

==================================================
11. ROOT HOME PAGE
==================================================

Pay special attention to:

src/app/page.tsx

The homepage must also be editable.

Do NOT force the admin to create a new page for the homepage.

Create/identify:

Home

Slug:

/

Then connect editable homepage sections to the existing design.

==================================================
12. DYNAMIC PRODUCT PAGES
==================================================

Do NOT duplicate product data into CMS pages.

Product-specific data should remain in:

products
product_variants
product_media
collections
etc.

But the surrounding page content should be editable.

For example:

Product database:
- name
- price
- images
- variants
- specifications

CMS-controlled content:
- intro text
- CTA
- promotional section
- FAQ
- supporting content
- SEO

Maintain proper separation.

==================================================
13. GLOBAL HEADER
==================================================

Header must be independently editable.

Admin:

Admin → Global Settings → Header

Editable:

- logo
- logo alt
- phone
- email
- CTA
- CTA URL
- announcement
- visibility

==================================================
14. NAVIGATION
==================================================

Admin:

Admin → Global Settings → Navigation

Editable:

- label
- URL
- parent
- order
- visibility
- external/internal
- CTA style

Do not hardcode navigation.

==================================================
15. FOOTER
==================================================

Admin:

Admin → Global Settings → Footer

Editable:

- footer columns
- headings
- links
- contact
- social links
- copyright
- visibility

==================================================
16. SEO
==================================================

Every existing page must have:

SEO Title
Meta Description
Canonical URL
OG Title
OG Description
OG Image
Robots setting where appropriate

Also support image alt text.

Admin should be able to edit these without code.

==================================================
17. SLUG MANAGEMENT
==================================================

Fix the existing `/undefined` issue.

Every page must have a valid route.

Never generate:

/undefined
/null
/

unless the page is intentionally the homepage.

Slug validation:

- required
- unique
- sanitized
- no undefined
- no null

If slug changes:

old URL
 ↓
301 redirect
 ↓
new URL

where appropriate.

Do not break existing SEO URLs.

==================================================
18. DATABASE SOURCE OF TRUTH
==================================================

Supabase must be the production source of truth.

Do NOT silently save production changes to:

custom_pages.json
custom_sections.json

If JSON fallback exists, it should be development/seeding only.

Production:

Admin Save
 ↓
Supabase
 ↓
success
 ↓
show "Saved successfully"

If database save fails:

show:
"Save failed. Your changes were not saved."

Never show false success.

==================================================
19. PUBLIC WEBSITE REFRESH
==================================================

Critical requirement:

Admin changes content
 ↓
Save
 ↓
Refresh Admin
 ↓
Change persists
 ↓
Open public page
 ↓
Refresh
 ↓
Change appears

Use appropriate Next.js cache invalidation:

revalidatePath()
or
revalidateTag()

after successful CMS updates.

Handle:
- page changes
- section changes
- slug changes
- header changes
- navigation changes
- footer changes

==================================================
20. PAGE EDITOR SHOULD HAVE TWO LEVELS
==================================================

PAGE SETTINGS

- title
- slug
- status
- SEO
- hero media
- timestamps

PAGE CONTENT

- sections
- section order
- section visibility
- section fields
- media
- buttons
- links

This makes it easy for a client/non-developer to manage pages.

==================================================
21. PREVIEW
==================================================

Every page must have:

Preview

button.

Preview should open the actual public design.

If page is draft:

use a secure preview mechanism if required.

Never generate:

/undefined

==================================================
22. SECURITY
==================================================

Only authorized admins can edit pages.

Protect:

/admin/pages/*
/admin/sections/*
/api/admin/pages/*
/api/admin/sections/*

Enforce authorization server-side.

Do not rely only on frontend route protection.

==================================================
23. AUDIT LOGGING
==================================================

Record:

PAGE_CREATED
PAGE_UPDATED
PAGE_PUBLISHED
PAGE_UNPUBLISHED
PAGE_DELETED

SECTION_CREATED
SECTION_UPDATED
SECTION_REORDERED
SECTION_DELETED

HEADER_UPDATED
NAVIGATION_UPDATED
FOOTER_UPDATED

SEO_UPDATED

==================================================
24. TEST EVERY EXISTING PAGE
==================================================

After implementation, generate a list of every public route.

For every route:

1. Open admin.
2. Open page.
3. Edit a test-safe piece of content.
4. Save.
5. Refresh admin.
6. Confirm persistence.
7. Open public page.
8. Refresh.
9. Confirm updated content.
10. Restore original value if required.

Test at minimum:

/
 /about
 /contact
 /models
 /buildings
 /floor-plans
 /resources
 /videos
 /quote

plus EVERY OTHER PUBLIC ROUTE FOUND DURING THE REPOSITORY AUDIT.

==================================================
25. FINAL ACCEPTANCE CRITERIA
==================================================

The task is COMPLETE only when:

[ ] Every existing public page is visible in Page Manager
[ ] Every existing page has an Edit button
[ ] Existing hardcoded content has been connected to CMS where appropriate
[ ] Admin can edit page content
[ ] Admin can edit sections
[ ] Admin can reorder sections
[ ] Admin can hide/show sections
[ ] Admin can edit images
[ ] Admin can edit image alt text
[ ] Admin can edit videos
[ ] Admin can edit buttons
[ ] Admin can edit links
[ ] Admin can edit SEO
[ ] Admin can publish/unpublish
[ ] Admin can edit header
[ ] Admin can edit navigation
[ ] Admin can edit footer
[ ] Admin changes persist after refresh
[ ] Public website reflects changes after refresh
[ ] No /undefined routes
[ ] No /null routes
[ ] Existing SEO URLs are preserved
[ ] Unauthorized users cannot edit pages
[ ] Audit logs record changes
[ ] TypeScript passes
[ ] Production build passes

FINAL REPORT
------------

Provide:

1. Complete list of existing public pages discovered.
2. Pages already CMS-editable.
3. Pages converted to CMS-editable.
4. Pages that remain intentionally data-driven.
5. Database changes.
6. API changes.
7. Admin UI changes.
8. Security changes.
9. Test results.
10. Any remaining blockers.

DO NOT claim "all pages are editable" until every public route has been checked against the actual repository.