# MASTER PROMPT: MODULARHOME.COM – COMPLETE ORGANIC SEO & TRAFFIC GROWTH SYSTEM

## PROJECT OVERVIEW

Act as a Senior Technical SEO Architect, Full-Stack Next.js Engineer, SEO Strategist, Content Marketing Specialist, Digital PR Specialist, and Analytics Engineer.

Your mission is to audit, optimize, and scale ModularHome.com into a strong global organic search destination.

**Primary business objective:** Grow ModularHome.com to 10,000 monthly organic sessions through sustainable, white-hat SEO and content marketing.

### Project technology stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase PostgreSQL
- Vercel hosting
- Existing product, collection, blog, floor plan, page, lead and quotation databases
- Existing administrative dashboard and authentication

### Existing project context

The website contains:

- Approximately 5,925 products.
- Approximately 461 collections.
- Approximately 199 blog posts.
- Approximately 233 pages.
- Approximately 6,829 redirect records.
- Existing floor plan data.
- Existing product review database.
- Approximately 1,211 URLs previously exposed through production sitemaps.

These figures are historical project figures. Revalidate current database counts and sitemap eligibility before implementation.

### Brand and design system

- Primary gold: #fcb907
- Amber: #d97706
- Ink: #101114
- Heading font: Playfair Display
- Body font: Manrope

Maintain the existing design system and website functionality.

---

# PRIMARY OBJECTIVES

1. Reach 10,000 monthly organic sessions.
2. Improve Google visibility for commercial keywords.
3. Optimize existing product and category pages.
4. Improve technical SEO.
5. Build a scalable content marketing engine.
6. Acquire relevant, authoritative backlinks.
7. Increase global brand awareness.
8. Generate more qualified quotation enquiries.
9. Build an SEO analytics dashboard inside the admin panel.
10. Implement continuous SEO monitoring and reporting.

This is a growth objective, not a guaranteed ranking or traffic outcome.

# IMPORTANT DEVELOPMENT RULES

Before making changes:

- Inspect the entire existing repository.
- Understand existing routing and database architecture.
- Reuse existing components and utilities.
- Reuse existing Supabase records.
- Never manually recreate product records.
- Never delete existing products, collections, blogs or pages.
- Preserve existing indexed URLs wherever possible.
- Preserve valid Shopify 301 redirects.
- Never create duplicate SEO landing pages.
- Never fabricate product specifications, ratings, prices or reviews.
- Never generate fake backlinks or fake analytics.
- Never publish unreviewed AI-generated content automatically.

## Environment safety

- Vercel Preview must use Supabase STAGING.
- Vercel Production must use Supabase PRODUCTION.
- Never write to production without explicit authorization.
- Do not modify production environment variables.
- Staging must use noindex,nofollow.
- Production must use the correct canonical domain.
- Never expose Supabase service-role keys or Google API secrets to client-side code.

---

# PHASE 0: COMPLETE REPOSITORY AND SEO AUDIT

Perform a read-only audit first.

Inspect:

- src/app routing
- Product routes
- Collection routes
- Blog routes
- Floor plan routes
- Static pages
- SEO utilities
- Metadata generation
- Canonical generation
- Robots.txt
- XML sitemap generation
- Redirect configuration
- Structured data
- Internal linking
- Image optimization
- Analytics integrations
- Admin architecture
- Supabase queries and schemas

Audit every eligible public URL for:

1. Missing title tags.
2. Duplicate titles.
3. Missing meta descriptions.
4. Duplicate descriptions.
5. Missing or conflicting H1 headings.
6. Incorrect canonical URLs.
7. Missing canonical URLs.
8. noindex errors.
9. Broken internal links.
10. Redirect chains.
11. Redirect loops.
12. Broken images.
13. Missing image ALT attributes.
14. Invalid sitemap URLs.
15. Missing structured data.
16. Incorrect structured data.
17. Open Graph problems.
18. Mobile usability.
19. Core Web Vitals.
20. Staging and production indexing conflicts.

Classify issues:

- Critical
- High
- Medium
- Low

Create:

reports/seo/phase-0-discovery.md

Include verified findings, affected URLs, evidence, file paths, database dependencies and recommended fixes.

Do not guess Google indexing numbers. Mark data requiring Search Console access.

---

# PHASE 1: GLOBAL KEYWORD RESEARCH AND COMPETITOR ANALYSIS

Build a comprehensive keyword research system for the global modular housing industry.

## Target categories

1. Modular Homes
2. Barndominiums
3. Steel Buildings
4. Prefab Cabins
5. Tiny Homes
6. Floor Plans
7. Residential Building Kits
8. Home Construction Guides

## Keyword examples

Modular Homes:
- modular homes for sale
- modern modular homes
- prefab modular homes
- modular home prices
- two bedroom modular homes
- three bedroom modular homes
- luxury modular homes

Barndominiums:
- barndominium kits for sale
- barndominium floor plans
- modern barndominium homes
- barndominium prices
- steel barndominium kits

Steel Buildings:
- steel house kits
- metal building homes
- steel frame homes
- residential steel buildings
- steel building prices

Cabins:
- prefab cabins for sale
- modern prefab cabins
- small cabin kits
- modular cabin homes
- prefab cabin prices

Tiny Homes:
- prefab tiny homes
- tiny modular homes
- tiny home floor plans
- small prefab houses

Floor Plans:
- two bedroom modular home plans
- three bedroom prefab home plans
- 1200 sq ft modular home plans
- 1500 sq ft house plans
- modern cabin floor plans

## Research requirements

For every keyword, record:

- Keyword
- Search volume
- Keyword difficulty
- Search intent
- Country
- CPC
- Current ranking
- Target URL
- Primary keyword
- Secondary keywords
- Priority
- Optimization status

Use Google Keyword Planner, Google Trends, Google Search Console and available approved SEO research integrations.

Do not invent search volume, CPC or keyword difficulty.

If data is unavailable, leave it blank and mark it for research.

## Competitor analysis

Research relevant companies such as:

- Lester Buildings
- DC Structures
- Worldwide Steel Buildings
- Method Homes
- Studio Shed

Analyze:

- Top-ranking pages
- Keyword opportunities
- Content gaps
- Category architecture
- Product-page structure
- Backlink sources
- Internal linking
- Content quality

## Keyword mapping

Map each keyword cluster to an existing relevant URL.

Avoid cannibalization and unnecessary new pages.

Preserve existing URLs.

Create:

- reports/seo/keyword-research.csv
- reports/seo/keyword-url-mapping.csv
- reports/seo/competitor-analysis.md
- reports/seo/content-gap-analysis.md

---

# PHASE 2: COMPLETE TECHNICAL SEO IMPLEMENTATION

Implement and validate technical SEO improvements.

## Metadata

All eligible public pages should have:

- Unique SEO title
- Unique meta description
- Correct canonical URL
- Open Graph metadata
- Twitter/X metadata
- Correct robots directives

Generate dynamic metadata from existing Supabase records.

## Sitemap architecture

Implement a sitemap index with:

- Product sitemap
- Collection sitemap
- Page sitemap
- Blog sitemap
- Floor plan sitemap
- Video sitemap

Requirements:

- Include only eligible canonical URLs.
- Exclude admin and account routes.
- Exclude draft records.
- Exclude redirecting URLs.
- Exclude duplicates.
- Exclude noindex pages.
- Use meaningful lastmod values.
- Validate every sitemap URL.
- Respect XML sitemap size and URL-count limits.

## Robots.txt

Production should allow public content and disallow private administrative and customer areas.

Staging must remain noindex,nofollow.

## Redirects

Audit all legacy Shopify redirects.

Preserve valid 301 redirects.

Detect:

- Redirect chains
- Redirect loops
- Conflicting redirects
- Broken destinations
- Incorrect canonical destinations

Do not remove existing redirect records without verified justification.

## Structured data

Implement appropriate schema:

- Organization
- WebSite
- Product
- BreadcrumbList
- Article
- VideoObject
- CollectionPage
- ItemList where appropriate

Use actual product and content data.

Only include genuine and eligible review information.

Never fabricate ratings, prices, stock status or shipping information.

Validate structured data using Google's supported validation tools.

## Performance

Optimize:

- LCP
- INP
- CLS
- Responsive images
- WebP/AVIF delivery
- Image dimensions
- Font loading
- Server rendering
- Caching
- CDN
- JavaScript bundles
- Lazy loading
- Database queries

Target good Core Web Vitals:

- LCP <= 2.5 seconds
- INP <= 200 ms
- CLS <= 0.1

Generate:

reports/seo/phase-2-technical-seo.md

---

# PHASE 3: PRODUCT AND CATEGORY PAGE SEO

Optimize existing product and collection pages.

## Product page requirements

Each priority product should have:

- Unique SEO title
- Unique meta description
- Unique H1
- Product-specific introduction
- Accurate specifications
- Dimensions
- Floor plan information
- Materials and features
- Available configurations
- High-quality images
- Descriptive ALT text
- Related products
- Relevant category links
- Useful FAQs
- Breadcrumbs
- Product structured data where eligible
- Get a Quote CTA
- Contact CTA

Do not invent missing specifications.

## Category page requirements

Each category should include:

- Unique introduction
- Category-specific H1
- SEO metadata
- Product listing
- Buying guidance
- Relevant FAQs
- Related category links
- Relevant blog links
- Clear quotation CTA

## Prioritization

P1: Highest commercial-value pages.

P2: High-potential pages.

P3: Remaining eligible pages.

Optimize in controlled batches.

Generate:

reports/seo/phase-3-page-optimization.md

Include URLs and before-and-after changes.

---

# PHASE 4: BLOG AND CONTENT MARKETING ENGINE

Build a six-month content strategy containing 42 high-quality article opportunities.

## Content categories

### Buying guides and costs

1. Modular Home Prices: Complete Guide for 2027
2. How Much Does a Prefab Home Cost?
3. Barndominium Kits: Complete Buying Guide
4. Steel Building Home Cost Breakdown
5. Prefab Cabin Prices
6. Modular vs Traditional Home Construction
7. Hidden Costs of Building a Modular Home
8. Are Modular Homes Worth Buying?
9. How to Choose a Modular Home Manufacturer
10. Financing Considerations for Modular Homes
11. What Is Included in a Modular Home Kit?
12. How to Budget for a Prefab Home

### Design and floor plans

13. Best Two-Bedroom Modular Home Floor Plans
14. Modern Three-Bedroom Prefab Home Designs
15. Small Barndominium Floor Plans
16. Modern Steel House Design Ideas
17. Best Small Cabin Floor Plans
18. 1200 Sq Ft Modular Home Design Ideas
19. Open-Concept Barndominium Designs
20. Modern Prefab Home Interior Ideas
21. Single-Story Modular Home Designs
22. Luxury Modular Home Inspiration
23. Small Modern Homes for Narrow Lots
24. How to Select the Right Home Floor Plan

### Construction and materials

25. How Are Modular Homes Manufactured?
26. Steel Frame vs Wood Frame Homes
27. How Long Does Modular Home Construction Take?
28. What Foundation Does a Modular Home Need?
29. How Weather Affects Modular Home Construction
30. Understanding Prefabricated Building Materials
31. Insulation Options for Modular Homes
32. Modular Home Delivery and Installation Explained
33. How to Prepare Land for a Prefab Home
34. Understanding Building Permits and Local Codes

### Comparisons and education

35. Modular vs Manufactured vs Prefab Homes
36. Barndominium vs Traditional House
37. Steel Buildings vs Wood Construction
38. Prefab Cabins vs Traditional Cabins
39. Modular Homes vs Tiny Homes
40. Are Steel Homes Durable?
41. Common Modular Home Buying Mistakes
42. Questions to Ask Before Purchasing a Modular Home

## Article quality requirements

Every article must contain:

- Search-focused title
- Meta description
- H1
- Introduction
- Useful H2/H3 sections
- Original factual content
- Relevant examples
- Internal links
- Supporting images
- Descriptive ALT
- Relevant FAQs
- Reliable sources
- Author information where appropriate
- Clear CTA

Avoid duplicate, thin, repetitive or mass-produced content.

Use accurate current information.

All generated articles must be saved as drafts for editorial review.

Never automatically publish without approval.

Create:

- reports/seo/phase-4-content-strategy.md
- reports/seo/editorial-calendar.csv

---

# PHASE 5: WHITE-HAT BACKLINK AND DIGITAL PR

Develop an ethical link acquisition system.

Target:

- Architecture websites
- Construction publications
- Home improvement blogs
- Real estate websites
- Building material suppliers
- Relevant industry directories
- Home design communities
- Relevant creators

Create linkable resources:

1. Modular Home Planning Checklist.
2. Barndominium Floor Plan Collection.
3. Steel Building Construction Guide.
4. Modular Home Cost Planning Worksheet.
5. Prefab Cabin Design Gallery.
6. Building Materials Comparison Guide.

Build a prospect database containing:

- Website
- Domain
- Topic relevance
- Contact page
- Outreach opportunity
- Priority
- Outreach status
- Published link
- Destination URL
- Referring domain

Prepare personalized outreach email drafts.

Never send emails without approval.

Do not use:

- Private blog networks
- Bulk spam links
- Automated link submissions
- Fake editorial links
- Purchased link farms

Generate:

- reports/seo/phase-5-link-building.md
- reports/seo/backlink-prospects.csv

---

# PHASE 6: GLOBAL SOCIAL MEDIA MARKETING

Create a social media distribution strategy.

Platforms:

1. Pinterest
2. Instagram
3. YouTube
4. Facebook

## Pinterest

Publish 15–20 fresh pins weekly.

Content:

- Home designs
- Floor plans
- Cabin inspiration
- Barndominium exteriors
- Product images

## Instagram

Publish 3–4 posts or reels weekly.

Content:

- Product walkthroughs
- Home design inspiration
- Construction education
- Product showcases

## YouTube

Publish:

- 2 long-form videos monthly
- 4–6 Shorts monthly

Topics:

- Modular home tours
- Barndominium designs
- Steel building construction
- Cabin walkthroughs
- Floor plan explanations
- Construction cost guides

## Facebook

Publish approximately 3 useful posts weekly.

Focus on:

- Home building communities
- Product education
- Customer questions
- Project showcases

## Social tracking

Create UTM parameters for every website campaign.

Track:

- Referral sessions
- Engaged sessions
- Landing page performance
- Conversions

Create a 30-day content calendar.

Prepare captions, titles, creative briefs, hashtags and destination URLs.

Do not automate spam or unsolicited messaging.

Generate:

- reports/seo/phase-6-social-strategy.md
- reports/seo/social-calendar.csv

---

# PHASE 7: GOOGLE ANALYTICS AND SEO ADMIN DASHBOARD

Build an SEO analytics dashboard within the existing ModularHome admin panel.

## Integrations

Use:

- Google Search Console API
- Google Analytics Data API
- Supabase
- Existing admin authentication

Use secure server-side OAuth or approved service authentication.

Never expose credentials in browser code.

## Dashboard metrics

Display:

- Organic sessions
- Organic users
- Search impressions
- Search clicks
- CTR
- Average position
- Top landing pages
- Top search queries
- Indexed page trends
- Organic leads
- Conversion rate
- Traffic by country
- Traffic by device

## Dashboard features

Add:

- Date range filters
- Country filters
- Landing page filters
- Device filters
- Keyword filters
- Daily reports
- Weekly reports
- Monthly reports
- Last sync timestamp
- API error status
- Data freshness indicator

## GA4 events

Track:

- page_view
- view_item
- view_item_list
- generate_lead
- form_start
- form_submit
- click_phone
- click_email
- upload_floor_plan
- request_quote

Only record successful lead submissions as completed conversions.

Use the existing leads and quotations tables for business outcome analysis.

Do not unnecessarily expose personal customer information.

Clearly distinguish GA4 and Search Console metrics.

Create the dashboard using the existing admin design system.

Generate:

reports/seo/phase-7-analytics.md

---

# PHASE 8: AUTOMATED SEO MONITORING

Create a recurring SEO health monitoring workflow.

Monitor:

1. Sitemap availability.
2. Robots.txt availability.
3. Canonical consistency.
4. Broken important URLs.
5. Redirect chains.
6. Redirect loops.
7. Missing metadata.
8. noindex issues.
9. Structured data errors.
10. Core Web Vitals.
11. Organic traffic trends.
12. Search Console indexing changes.
13. Missing images.
14. Important page response status.

For every detected issue, record:

- URL
- Issue type
- Severity
- First detected date
- Description
- Recommended fix
- Resolution status

Create an SEO issue log and weekly report.

Use scheduled jobs or approved automation tools where appropriate.

Avoid excessive crawling and respect website resources.

Never automatically modify production SEO settings.

Generate:

reports/seo/phase-8-monitoring.md

---

# PHASE 9: GLOBAL SEO AND INTERNATIONAL TARGETING

Prepare an international SEO strategy for:

- United States
- Canada
- United Kingdom
- Australia
- New Zealand
- Europe

Research demand and actual service availability in each market.

Do not create duplicate country pages simply to target more keywords.

If localized pages are justified, implement appropriate:

- Localized content
- Regional product availability
- Accurate pricing and delivery information
- Local terminology
- Appropriate hreflang annotations
- Correct canonical relationships

Do not automatically redirect visitors based only on IP address.

Do not claim products are available in a country without verification.

Generate:

reports/seo/phase-9-international-seo.md

---

# FINAL PHASE: QA, RELEASE AND EXECUTION REPORT

Before release:

1. Run TypeScript checks.
2. Run ESLint.
3. Run production build.
4. Validate sitemap XML.
5. Validate canonical URLs.
6. Validate robots directives.
7. Test structured data.
8. Test important product pages.
9. Test important collection pages.
10. Test blogs and floor plans.
11. Test redirects.
12. Test image loading.
13. Test mobile responsiveness.
14. Test analytics events.
15. Test admin security.
16. Verify staging and production separation.

Do not deploy to production without explicit approval.

## Final deliverables

Create the following documentation:

reports/seo/FINAL-SEO-EXECUTION-REPORT.md

reports/seo/SEO-IMPLEMENTATION-STATUS.csv

reports/seo/TECHNICAL-SEO-AUDIT.md

reports/seo/KEYWORD-RESEARCH.csv

reports/seo/KEYWORD-URL-MAPPING.csv

reports/seo/CONTENT-CALENDAR.csv

reports/seo/BACKLINK-PROSPECTS.csv

reports/seo/SOCIAL-MEDIA-CALENDAR.csv

reports/seo/SEO-MONITORING-REPORT.md

The final report must include:

- Initial website condition
- Existing traffic baseline
- Technical issues discovered
- Fixes implemented
- Files modified
- Database changes, if any
- Pages optimized
- Keywords mapped
- Content created
- Content awaiting approval
- Backlink outreach progress
- Analytics integration status
- Performance improvements
- Remaining issues
- Deployment status
- Next actions

Clearly distinguish between completed, tested, pending and blocked tasks.

Never report a feature as implemented unless it has been implemented and tested.

---

# EXECUTION INSTRUCTIONS

Execute the entire project through controlled phases.

Follow this sequence:

Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9 → Final QA.

At the end of each phase:

1. Summarize findings.
2. List modified files.
3. List database changes.
4. Run relevant tests.
5. Generate the phase report.
6. Identify blockers.
7. Obtain approval before proceeding to risky production-affecting changes.

Do not stop after creating a plan. Implement the approved work.

However, do not bypass approvals, invent data, publish content without review or change production data without authorization.

## FINAL SUCCESS OBJECTIVE

Build a sustainable organic growth system for ModularHome.com that aims for:

**10,000 monthly organic sessions**

With:

- Strong technical SEO
- High-quality product pages
- Search-focused category pages
- 42 planned content opportunities
- Ethical backlink acquisition
- Consistent social distribution
- Google Search Console integration
- GA4 conversion tracking
- Admin SEO analytics dashboard
- Automated weekly monitoring
- Measurable qualified quotation enquiries

Focus on sustainable rankings, genuine search visibility, qualified global visitors and actual business growth.

Begin with Phase 0: inspect the existing repository and produce the complete SEO discovery report. Do not modify production during the discovery phase.