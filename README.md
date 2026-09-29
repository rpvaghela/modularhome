You are the lead full-stack engineer responsible for completing the ModularHome project.

PROJECT
-------
Project: ModularHome
Repository: https://github.com/chetan9130/modularhome.git
Production domain: https://modularhome.com
Preview: https://modularhome.vercel.app/

Current stack:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Vercel
- Stripe
- Resend
- Google OAuth
- YouTube Data API
- OpenAI API

IMPORTANT
---------
Do NOT blindly rewrite existing functionality.

First inspect the entire repository and understand:
- current database schema
- existing admin routes
- Page Manager
- Section Blocks
- Global Settings
- Product Manager
- Collection Manager
- Floor Plan Manager
- Blog Manager
- YouTube Manager
- Leads
- Quotations
- Customer authentication
- admin authentication
- existing AI implementation
- existing API routes
- Supabase policies/RLS
- existing middleware
- existing audit logging
- existing environment variables
- existing tests

Preserve working functionality and existing migrated data.

Do not perform destructive database migrations.
Do not delete production data.
Do not change migrated product/collection/page/blog data unless required to fix a confirmed issue.
Do not hardcode client content.
Do not expose secrets to the browser.
Do not use AI to invent final quotation prices.

==================================================
CLIENT ACCEPTANCE REQUIREMENTS
==================================================

The following requirements come directly from the client review and MUST be implemented and demonstrated.

==================================================
1. FULL WEBSITE CONTROL FROM ADMIN
==================================================

The client must be able to manage normal website updates without modifying Next.js source code.

Admin must be able to manage:

PAGES
- page title
- slug
- content
- sections
- images
- videos
- buttons
- links
- visibility
- ordering
- publish status
- SEO title
- SEO description
- SEO keywords where supported
- canonical URL
- Open Graph data
- image alt text
- created date
- updated date

SECTION BLOCKS
- each section type must have clear editable fields
- normal client users must NOT need to edit JSON
- support:
  - heading
  - subheading
  - paragraph
  - rich text
  - image
  - image alt text
  - video
  - CTA/button
  - link
  - cards
  - lists
  - visibility
  - order
  - section-specific fields

GLOBAL WEBSITE SETTINGS
Create/verify admin controls for:

HEADER
- logo
- logo link
- header visibility
- header CTA
- contact information

NAVIGATION
- menu items
- label
- URL
- internal/external link
- parent/child items
- order
- visibility

FOOTER
- footer text
- columns
- links
- social links
- contact details
- copyright
- visibility/order

CONTACT INFORMATION
- phone
- email
- address
- business hours
- social media
- CTA information

CONTENT MODULES
Admin must be able to manage:
- products
- collections
- floor plans
- blogs
- FAQs
- pages
- SEO fields
- media
- leads
- quotations

ACCEPTANCE TEST:
1. Admin changes a page/section.
2. Click Save.
3. Refresh admin.
4. Confirm the value persists.
5. Open public website.
6. Refresh public page.
7. Confirm the new value appears.
8. Confirm no source-code change is required.

==================================================
2. FIX PAGE MANAGER / SECTION BLOCK ROUTES
==================================================

Current issue:

Pages such as:
- Contact Us
- About

show:

/undefined

in their route and preview links.

Investigate the complete data flow.

Check:
- database slug
- page ID
- page handle
- route generation
- Page Manager
- Page Editor
- Section Blocks
- preview URL generation
- dynamic route
- internal links
- public page resolver

Implement one consistent canonical slug/route system.

Requirements:
- no page may produce /undefined
- existing valid pages must continue working
- preview links must work
- public routes must work
- internal links must use correct slugs
- missing slug must produce a controlled fallback/error, never /undefined

Add validation:
- slug required
- slug unique
- slug sanitized
- no accidental undefined/null URL
- safe route generation

Test:
- About
- Contact Us
- at least 5 other CMS pages
- refresh
- preview
- direct URL access

==================================================
3. FIX DASHBOARD COUNTS
==================================================

Current mismatch:

Dashboard:
- 6 floor plans
- 3 articles

Admin lists:
- 8 floor plans
- 6 articles

Investigate why.

Possible causes:
- incorrect query
- pagination
- status filtering
- published-only filtering
- deleted/archived records
- wrong table
- cached data
- stale count
- incorrect Supabase query

Do NOT simply hardcode the counts.

Create a reusable count/query strategy.

Dashboard counts must reflect the actual records according to the defined module scope.

Show:
- total
- published
- draft
- archived if applicable

Ensure dashboard and list use the same source-of-truth logic.

Test after:
- create
- edit
- publish
- unpublish
- delete/archive
- refresh

==================================================
4. HEADER / NAVIGATION / FOOTER ADMIN
==================================================

Add admin controls under Global Settings or a clearly named configuration area.

Create:

/admin/settings/header
/admin/settings/navigation
/admin/settings/footer

or integrate cleanly into the existing Global Settings architecture.

Admin must be able to:

HEADER
- edit logo
- edit CTA
- edit contact information
- enable/disable elements

NAVIGATION
- add menu item
- edit menu item
- delete menu item
- reorder
- nested menu items
- visibility
- internal/external URLs

FOOTER
- edit columns
- add/remove links
- social links
- contact details
- copyright
- visibility/order

Use database-backed configuration.

Do not hardcode navigation arrays in frontend components.

==================================================
5. ADMIN-EDITABLE QUOTATION PRICING ENGINE
==================================================

Implement a real pricing rules system.

IMPORTANT:
AI MUST NOT independently determine the final price.

AI may interpret customer requirements.

The actual price MUST come from deterministic admin-configured rules.

Create/administer rules for:

MODEL RATES
- model ID
- base price
- active/inactive
- effective date if required

SQUARE FOOTAGE
- minimum
- maximum
- rate per square foot
- pricing method

UPGRADES
Examples:
- garage
- porch
- windows
- doors
- kitchen upgrades
- bathroom upgrades
- exterior upgrades
- interior upgrades
- custom options

FEES
- delivery
- engineering
- permit
- installation
- service
- other configurable fees

EXCLUSIONS
- item
- description
- excluded amount/logic where applicable

RULE MANAGEMENT
Admin can:
- create
- edit
- deactivate
- reorder
- save
- view effective configuration

Create a deterministic pricing service.

Example architecture:

Customer Requirements
        ↓
AI interprets requirements
        ↓
Structured Quote Inputs
        ↓
Pricing Rules Engine
        ↓
Base Model Price
+ Square Footage
+ Upgrades
+ Fees
- Exclusions/adjustments
        ↓
Estimate
        ↓
Save quotation

Every quotation must store:
- customer details
- requirements
- model
- square footage
- selected upgrades
- pricing rule versions/IDs
- line-item calculation
- subtotal
- fees
- exclusions
- final estimate
- timestamp
- source
- AI interpretation if applicable

Display:

"Estimated price only. Final pricing is subject to company review."

==================================================
6. SECTION BLOCKS MUST NOT REQUIRE JSON
==================================================

Inspect all existing Section Block types.

Create schema-driven editors.

For every section type provide human-readable form fields.

Example:

Hero Section:
- heading
- description
- background image
- image alt text
- CTA label
- CTA URL
- secondary CTA
- visibility

Feature Cards:
- section heading
- cards[]
  - title
  - description
  - image
  - image alt
  - link
  - order
  - visibility

Video:
- title
- video URL
- thumbnail
- description
- CTA

Do not make ordinary admin users edit raw JSON.

If advanced JSON editing is retained, keep it as an optional advanced/debug mode, not the primary editor.

==================================================
7. PAGE STATUS AND DATES
==================================================

Current issue:
- Page Manager shows "Recent"
- Page editor shows created/updated dates as "N/A"

Fix the data model/UI.

Show:
- Draft
- Published
- Unpublished
- Scheduled if supported

Show:
- Created At
- Updated At
- Published At

Use actual database timestamps.

Format dates consistently.

Example:
Created: 29 Sep 2026, 10:42 AM
Updated: 29 Sep 2026, 01:15 PM

Do not display fake "Recent" values.

==================================================
8. PRODUCT COUNT RECONCILIATION
==================================================

Current issue:

UI says:
749 Home Models

Table reports:
750 items

Investigate the exact discrepancy.

Check:
- query
- filters
- pagination
- category
- collection
- archived products
- unpublished products
- duplicate rows
- deleted rows
- count query

Determine the actual source-of-truth count.

Make dashboard/table/filter counts consistent.

Do not simply change 750 to 749 without identifying why.

Add automated tests for count consistency.

==================================================
9. SEO AND IMAGE ALT TEXT
==================================================

Complete SEO controls for:

PAGES
PRODUCTS
COLLECTIONS
BLOGS

Support:
- SEO title
- meta description
- canonical URL
- slug
- Open Graph title
- Open Graph description
- Open Graph image
- robots/indexing settings where appropriate
- image alt text

Media fields:
- alt text
- title/caption where appropriate

Ensure frontend uses these values.

Check:
- page metadata
- product metadata
- collection metadata
- blog metadata
- sitemap
- canonical URLs
- robots behavior

Do not break existing SEO URLs.

==================================================
10. YOUTUBE → AI BLOG WORKFLOW
==================================================

Build the complete workflow.

SOURCE:
Approved ModularHome YouTube channel.

Use the YouTube Data API to identify eligible videos.

Use the YouTube video ID as the primary duplicate-prevention identifier. YouTube's video resource exposes a unique video ID and metadata through the API. :contentReference[oaicite:0]{index=0}

Workflow:

1. Detect new eligible video.
2. Extract:
   - video ID
   - title
   - description
   - published date
   - channel ID
   - thumbnail
   - video URL/embed URL
3. Check database for existing video ID.
4. If already processed:
   - do NOT create another blog.
5. If new:
   - create generation job.
6. Generate SEO blog draft using OpenAI.
7. Generate:
   - blog title
   - slug
   - meta title
   - meta description
   - headings
   - article body
   - introduction
   - conclusion
   - YouTube embed
   - thumbnail
8. Save as DRAFT.
9. Show generation status.
10. Show errors if generation fails.
11. Admin can:
    - review
    - edit
    - save
    - publish
    - unpublish
12. Store source YouTube video ID.
13. Enforce unique constraint on YouTube video ID.

Suggested statuses:

PENDING
PROCESSING
GENERATED
DRAFT
PUBLISHED
UNPUBLISHED
FAILED

Admin UI must show:
- Video
- Video ID
- Generation status
- Blog status
- Created date
- Error
- Retry
- View draft
- Edit
- Publish

Never automatically publish AI-generated content unless explicitly configured by the client.

==================================================
11. AI CHATBOT + LEAD GENERATION
==================================================

Create a reliable ModularHome AI assistant.

Knowledge sources:
- products
- models
- collections
- FAQs
- company information
- approved website content

The chatbot should NOT invent product facts.

If sufficient information exists:
- answer question
- recommend relevant models

If information is insufficient:
- clearly state that it needs human assistance
- offer human follow-up

Collect:

Customer:
- name
- email
- phone
- location

Project:
- project type
- preferred model
- approximate size
- budget
- timeline
- requirements

Conversation:
- source
- timestamp
- useful conversation context
- qualification information

When qualified:
CREATE A CENTRAL LEAD.

Lead fields:

id
name
email
phone
location
project_type
preferred_model
approximate_size
budget
timeline
requirements
source
conversation_summary
conversation_context
status
assigned_to
internal_notes
created_at
updated_at

Lead statuses:
- New
- Contacted
- Qualified
- Proposal
- Won
- Lost
- Follow-up

Admin features:
- search
- filter
- sort
- view details
- update status
- assign
- add internal notes
- view conversation context

AI must not expose internal/admin information.

==================================================
12. AI-ASSISTED QUOTATIONS
==================================================

Implement:

Customer
 ↓
Quote form/chat
 ↓
AI interprets requirements
 ↓
Structured JSON requirements
 ↓
Validation
 ↓
Deterministic pricing engine
 ↓
Estimate
 ↓
Save quotation

AI can interpret:

"3 bedroom house around 1800 square feet with a garage and upgraded kitchen"

into structured requirements such as:

{
  "bedrooms": 3,
  "squareFootage": 1800,
  "garage": true,
  "upgrades": ["kitchen-upgrade"]
}

Then pricing engine calculates.

AI MUST NOT output a final price that bypasses the pricing engine.

Validate all AI-generated fields before pricing.

If the model or upgrade cannot be matched:
- mark as unknown
- ask clarification
- or send for human review

Quotation must save:
- customer
- inputs
- interpreted requirements
- pricing rules used
- line-item breakdown
- fees
- exclusions
- estimate
- created date
- source

Admin quotation list:
- search
- filter
- view
- edit where permitted
- status
- notes
- customer information
- calculation breakdown

==================================================
13. ADMIN SECURITY
==================================================

Protect every admin route.

Protect:
- /admin/*
- /api/admin/*

Implement/verify:
- authentication
- authorization
- role permissions
- session validation
- session expiry
- protected server routes
- protected API routes
- RLS where applicable
- no privilege escalation

Use role-based access control where appropriate. Supabase supports authentication/authorization through Auth, JWTs and RLS, and provides RBAC/custom-claims patterns for role-based access. :contentReference[oaicite:1]{index=1}

Suggested roles:

SUPER_ADMIN
ADMIN
EDITOR
CONTENT_MANAGER
SALES

Define permissions explicitly.

Example:

SUPER_ADMIN:
all permissions

ADMIN:
all content + leads + quotations

EDITOR:
pages + sections + blogs + media

SALES:
leads + quotations

CONTENT_MANAGER:
pages + blogs + media

Never rely only on hiding UI buttons.
Every protected API/database operation must enforce authorization server-side.

==================================================
14. SESSION EXPIRY
==================================================

Verify:
- session timeout
- invalid session
- expired session
- logout
- refresh
- unauthorized API access

Expired sessions must:
- reject protected API calls
- redirect to login where appropriate
- not expose protected data

==================================================
15. AUDIT LOGGING
==================================================

Create/verify application-level admin audit logs.

Track:
- login
- logout
- failed login
- page create
- page update
- page publish
- page unpublish
- product changes
- collection changes
- floor plan changes
- blog changes
- pricing rule changes
- quotation changes
- lead changes
- settings changes
- role/permission changes

Store:

id
actor_user_id
actor_email
action
resource_type
resource_id
before_data
after_data
timestamp
IP if safely available
user_agent if appropriate

Do not store secrets or sensitive credentials in audit logs.

Supabase Auth also provides authentication audit logs for events such as sign-ins, sign-outs, verification, password changes and token events. Use these where appropriate, while keeping application-level audit logs for business/admin actions. :contentReference[oaicite:2]{index=2}

==================================================
16. DATABASE REQUIREMENTS
==================================================

Before changing schema:

1. Inspect existing tables.
2. Reuse existing structures where possible.
3. Add migrations only when necessary.
4. Add foreign keys.
5. Add indexes.
6. Add unique constraints.
7. Add created_at / updated_at where missing.
8. Add appropriate RLS policies.
9. Test migrations locally/staging first.

Potential tables/entities:

page_sections
site_settings
navigation_menus
navigation_items
footer_settings
pricing_rules
pricing_rule_versions
quote_calculations
youtube_videos
ai_blog_jobs
leads
lead_conversations
admin_audit_logs

Do not create duplicate tables if equivalent existing tables already exist.

==================================================
17. ADMIN UX REQUIREMENTS
==================================================

Admin interfaces must be understandable to a non-developer.

Avoid:
- raw JSON as primary editing
- unclear labels
- technical database field names
- unexplained IDs

Use:
- forms
- dropdowns
- toggles
- date pickers
- drag/reorder controls
- media selectors
- rich-text editors
- validation messages
- save confirmation
- unsaved changes warning
- loading states
- error states

Every save operation should clearly report:
- Saving...
- Saved successfully
- Save failed

==================================================
18. REFRESH/PERSISTENCE TEST
==================================================

For EVERY major admin module:

CREATE
→ Save
→ Refresh
→ Verify

EDIT
→ Save
→ Refresh
→ Verify

PUBLISH
→ Refresh
→ Verify

UNPUBLISH
→ Refresh
→ Verify

SEARCH
→ Search
→ Verify correct results

FILTER
→ Filter
→ Verify correct results

The following modules must be tested:

- Pages
- Section Blocks
- Products
- Collections
- Floor Plans
- Blogs
- FAQs
- Header
- Navigation
- Footer
- Pricing Rules
- Leads
- Quotations
- YouTube Manager
- Global Settings
- SEO

==================================================
19. END-TO-END DEMONSTRATION
==================================================

Prepare the application so the following can be demonstrated on screen.

DEMO 1 — WEBSITE CONTROL

1. Open admin.
2. Open a page.
3. Change section text.
4. Save.
5. Refresh admin.
6. Open public website.
7. Refresh.
8. Show changed content.

DEMO 2 — YOUTUBE TO BLOG

1. Show a new eligible YouTube video.
2. Run detection/sync.
3. Show video ID.
4. Show generation status.
5. Generate blog.
6. Show generated draft.
7. Confirm title.
8. Confirm headings.
9. Confirm article body.
10. Confirm meta title.
11. Confirm meta description.
12. Confirm slug.
13. Confirm video embed.
14. Confirm thumbnail.
15. Edit draft.
16. Save.
17. Publish.
18. Unpublish.
19. Run detection again.
20. Confirm duplicate blog is NOT created.

DEMO 3 — CHATBOT TO LEAD

1. Open chatbot.
2. Ask a real ModularHome product question.
3. Show product/model recommendation.
4. Provide customer requirements.
5. Provide:
   - name
   - email
   - phone
   - location
   - project type
   - model
   - size
   - budget
   - timeline
6. Complete conversation.
7. Open Admin → Leads.
8. Show newly created lead.
9. Show source.
10. Show timestamp.
11. Show requirements.
12. Show conversation context.
13. Change lead status.
14. Add internal note.
15. Refresh and verify persistence.

DEMO 4 — AI QUOTATION

1. Open quote flow.
2. Enter customer requirements.
3. Show AI interpretation.
4. Show structured inputs.
5. Show pricing rules being used.
6. Show calculation breakdown.
7. Show estimate.
8. Show disclaimer:
   "Estimated price only. Final pricing is subject to company review."
9. Save quotation.
10. Open admin quotations.
11. Show saved quotation.
12. Change an admin pricing rule.
13. Create a NEW test estimate.
14. Show that the new estimate changes according to the changed rule.
15. Confirm AI did not independently determine the final price.

DEMO 5 — ADMIN MODULE QA

Demonstrate:
- create
- edit
- publish
- unpublish
- search
- filter
- save
- refresh

for the main admin modules.

DEMO 6 — SECURITY

Demonstrate:
- protected admin route
- unauthenticated access denied
- role restriction
- session expiry
- logout
- audit log entry
- unauthorized API request denied

==================================================
20. TESTING REQUIREMENTS
==================================================

Run:

npx tsc --noEmit

Then run the production build.

Also add/run tests for:

- page slug generation
- /undefined prevention
- dashboard counts
- product count consistency
- pricing calculations
- pricing rule changes
- YouTube duplicate detection
- AI blog generation
- lead creation
- lead updates
- quotation persistence
- role permissions
- session expiry
- audit logs

Do not report "all tests passed" unless they actually pass.

==================================================
21. EXTERNAL API / CREDENTIAL HANDLING
==================================================

The following may require credentials/configuration:

OPENAI_API_KEY
YOUTUBE_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY

If a required credential is missing:

DO NOT fake successful integration.

Instead:
- implement the integration
- add environment variable documentation
- provide clear configuration error
- create mock/test adapter only for automated development tests
- mark real end-to-end testing as BLOCKED/PENDING

Never put real secrets in source code.

==================================================
22. ENVIRONMENT FILE
==================================================

Inspect existing .env.example.

Update it with all required variables, without real secrets.

Clearly group:

# Supabase
...

# OpenAI
OPENAI_API_KEY=

# YouTube
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

==================================================
23. NO FALSE COMPLETION
==================================================

This is extremely important.

Do NOT claim a requirement is completed merely because:
- UI exists
- API route exists
- database table exists
- code compiles

A requirement is COMPLETE only when:
1. implementation exists
2. functionality works
3. persistence works
4. relevant tests pass
5. end-to-end behavior is verified

If external credentials are missing:
STATUS = BLOCKED / PENDING EXTERNAL CONFIGURATION

If implementation exists but needs real-world QA:
STATUS = READY FOR QA

If development is incomplete:
STATUS = IN PROGRESS

Only use:
COMPLETED
when the acceptance test has actually passed.

==================================================
24. FINAL STATUS REPORT
==================================================

At the end provide a report:

A. REQUIREMENTS COMPLETED
- requirement
- implementation
- test evidence

B. READY FOR QA
- requirement
- what remains to test

C. BLOCKED
- requirement
- exact missing dependency
- required credential/configuration

D. BUGS FIXED
- issue
- root cause
- fix

E. DATABASE CHANGES
- migration
- tables
- indexes
- constraints
- RLS

F. API/ENVIRONMENT CHANGES
- new variables
- integrations
- configuration required

G. TEST RESULTS
- TypeScript
- build
- unit tests
- integration tests
- E2E tests

H. CLIENT DEMONSTRATION CHECKLIST
Mark each:

[ ] Website content edit reflected publicly
[ ] YouTube → blog
[ ] Duplicate prevention
[ ] Chatbot → lead
[ ] Lead admin management
[ ] AI quotation
[ ] Pricing rule change affects new quote
[ ] Admin CRUD
[ ] Publish/unpublish
[ ] Search/filter
[ ] Refresh persistence
[ ] Role permissions
[ ] Session expiry
[ ] Audit logging

I. REMAINING WORK
Give exact remaining tasks.

J. ESTIMATED COMPLETION
Give a realistic estimate based on actual remaining work.

==================================================
25. GIT REQUIREMENTS
==================================================

Before changes:
- inspect git status
- inspect current branch
- inspect recent commits

After implementation:
- run tests
- run build
- review changed files
- ensure no secrets were committed
- ensure no accidental database dumps were committed
- commit with a clear message

Example:

feat: complete admin CMS and AI workflow acceptance requirements

Do not push blindly if tests fail.

==================================================
FINAL INSTRUCTION
==================================================

Start by auditing the existing ModularHome repository.

DO NOT immediately start coding.

First produce an internal implementation map based on the actual codebase:
- existing functionality
- missing functionality
- bugs
- database gaps
- API gaps
- security gaps
- testing gaps

Then implement the requirements systematically.

Prioritize:

1. Admin CMS control
2. Existing admin bugs
3. Pricing rule engine
4. YouTube → blog workflow
5. AI chatbot → leads
6. AI-assisted quotations
7. Security/RBAC/session/audit
8. SEO/alt text
9. Testing
10. Demonstration readiness

Do not replace working functionality unnecessarily.

Do not fake integrations.

Do not fabricate test results.

Do not mark blocked external integrations as completed.

The final goal is not merely "code implemented".

The final goal is:

BUILD → TEST → DEMONSTRATE → READY FOR CLIENT RETEST.