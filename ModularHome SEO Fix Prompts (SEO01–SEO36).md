# ModularHome.com: SEO Fix Prompts (SEO01–SEO36)

One copy-paste prompt per issue from the 30 October 2026 SEO and Google indexing remaining-work plan. Paste the shared context first, then the prompt for the issue you are fixing.

## Shared context (paste before every prompt)

You are a senior technical SEO engineer working on https://modularhome.com (Next.js site, custom CMS/admin, migrated from Shopify, canonical host is https://modularhome.com without www). Source rule: ModularHome Shopify is the source for approved pages, blogs and SEO; Amish Built Cabins is the source for product data. Rules: do not fabricate specs, prices, authors, ratings or reviews. Do not disable the firewall or security controls. Preserve working URLs and inbound links. Test every change in staging first. For each task, return: (1) root cause, (2) the exact code or config change, (3) a test plan with commands or URLs, (4) before/after evidence, (5) remaining risks. Do not claim Google has indexed anything unless Search Console data proves it.

## 01 · Sitemaps, redirects and crawl access

### SEO01: Video sitemap returns 404

robots.txt advertises https://modularhome.com/videos/sitemap.xml but it returns 404, and the main sitemap lists /videos but no individual watch pages. Find where the video sitemap should be generated. Build a valid video sitemap (or sitemap index) at that exact URL. Include only canonical, publicly indexable watch pages that each have a playable video, title, description, thumbnail URL and content or player URL. Exclude private, deleted, test and duplicate videos. Verify the XML validates, returns 200 with application/xml, and every URL returns 200. Check whether another submitted sitemap already covers videos so there is no duplication. Give me the Search Console submission steps.

### SEO02: Article sitemap coverage mismatch

The main sitemap has 189 article URLs but the blog index advertises 197. /blogs/building-guides/modern-barndominium-steel-clearspan is missing. Export all published articles from the CMS with slug, category, status and canonical URL. Compare them to the sitemap URLs by exact string. Output a table of missing, extra, redirected and intentionally excluded articles. Fix the sitemap generator so every published, indexable article is included, and check for caching or category-mapping bugs. Do not assume the 8-count gap equals 8 missing articles. Document any intentional exclusions.

### SEO03: Shared sitemap lastmod values

1,014 of 1,203 sitemap entries share the timestamp 2026-10-30T12:15:32.786Z, which suggests it is the generation time. Inspect the sitemap generator. Replace lastmod with each record's real last meaningful content update (updated\_at of the page, product or article, not the sitemap build time). If no reliable date exists for a record, omit lastmod for it. Do not bump dates for template or layout changes. Show before/after samples and confirm the dates are stable across repeated requests when content has not changed.

### SEO04: HTTP www uses a two-hop redirect

http://www.modularhome.com/ goes to https://www.modularhome.com/ then to https://modularhome.com/. Change the server, CDN or Next.js redirect config so http://www and https://www, and http:// non-www, all redirect in a single 301 to https://modularhome.com with the full path and query string preserved. Test with curl -I on the homepage and at least 10 deep URLs (blog, product, collection, URL with query string, trailing slash). Confirm no loops and no changes to the already-correct redirects.

### SEO05: Direct page requests return 403

Sixteen non-homepage requests from a generic HTTP client returned a generic 403. Review WAF, CDN and server logs for those requests (user agent, IP, rule ID). Determine whether the block is bot-protection for unknown clients or something that could affect Googlebot. Verify Googlebot access using reverse-DNS verification and Search Console live tests, not by spoofing user agents. Propose the narrowest rule change that allows verified search crawlers without weakening protection. Do not disable the firewall. Return a log analysis and a recommendation.

## 02 · Content corrections

### SEO06: Product defaults in educational guides (P0)

https://modularhome.com/blogs/building-guides/modern-barndominium-steel-clearspan shows a $265,000 price, conflicting areas (1,856 vs 1,750 sq ft), a "modular cabin" intro, 1 Story vs "Dual-Story", a table of contents whose 6 of 8 sections do not exist, and an invented "Architectural Review" quote. Separate the editorial article template from the model/product template. Restore the approved article body from the ModularHome Shopify source. Generate the table of contents from real H2/H3 headings only. Remove model specs, prices, quotes and claims that are not approved for editorial guides. Then find every article using the same template and report which are affected. Return the affected-URL list and a fix log.

### SEO07: Saved SEO fields not reaching the live page

The All American editor has a specific SEO description but the live meta description shows an excerpt instead. Trace the metadata precedence chain (SEO field, excerpt, default) in the Next.js generateMetadata or head logic, and any cache or ISR layer. Fix so the saved SEO title and description win when present, with a defined fallback. Check the live HTML, og:/twitter: tags and rendered output. Test editing in staging updates the correct URL. Test at least 5 other templates.

### SEO08: Incorrect structured product data (P0)

The All American admin fields show zero area/rooms even though the description says 5 bed 3 bath 2,200 sq ft, and the collection page displays it as "Studio". Catalog and quote prices differ for sampled products. Audit the product data mapping from Amish Built Cabins to the CMS, collection cards, filters, quote tool and JSON-LD. Find why bedrooms/bathrooms/area are empty or "Studio". Fix the source mapping before adding Product/Offer schema. Produce a reconciliation table (model, source values, CMS values, displayed values, quote price). Do not fabricate missing values: flag them for owner review.

### SEO09: Collection names and overlapping route variants

The collection shows "Amp" in the title and H1 ("Affordable Modular Homes Amp Houses Amish Built Quality Across America") and exists at both /collections/affordable-modular-homes-amp-houses-amish-built-quality-across-america and a root path. Fetch both and compare their content, canonical tags, status codes and internal links. Propose a clean human-readable name (for example, "Affordable Amish-Built Modular Homes"), decide the canonical destination, and 301 the other variant if intent is the same. Fix the "&" to "amp" encoding bug sitewide (search all collection names). Protect inbound links and existing traffic and give a rollout plan.

### SEO10: Publication controls and content inventory

A test floor plan is marked published, and admin dashboard totals disagree with list totals for models and blogs. Query the database for all records with status published, draft, test or archived. Identify test/placeholder records and unpublish or exclude them from public routes and the sitemap. Explain the count differences (soft deletes, filters, caching). Return a reconciliation table that matches public records to the canonical URL inventory, with a documented treatment for every excluded record.

### SEO11: Repeated intent and near-duplicate pages

Review repeated article subjects, near-identical location/collection pages (for example the ten Big Bertha state-pricing records), imported product copy and reused video descriptions. Cluster pages by search intent. For each cluster, recommend keep, improve, differentiate or consolidate based on traffic, impressions and queries (needs Search Console data), not guesses. Do not delete anything blindly. For consolidations give the target URL, 301 mapping and internal-link updates. Return a prioritized table.

## 03 · Crawl and migration

### SEO12: Master URL reconciliation

Build one master spreadsheet of every URL: old Shopify URLs, current CMS products/pages/blogs/collections, sitemap entries, Search Console landing pages and valuable backlink targets. Columns: source ID, content type, old URL, intended canonical URL, publication state, redirect target, in sitemap (Y/N), owner decision. Review all 197 advertised articles. Flag orphans, duplicates and URLs with no mapping.

### SEO13: Test redirects and add missing mappings

The admin has 1,000 configured redirects. Test them at runtime: for every old /pages/, /blogs/, /products/ and /collections/ URL and renamed category path, record status, hop count and final URL. Flag loops, 302s that should be 301, chains longer than 1 hop, generic homepage redirects and 404 targets. Add missing one-hop 301 mappings to the closest relevant equivalent page. Keep redirects that already work. Output a CSV and the config diff.

### SEO14: Canonical signal alignment

Crawl all templates and compare four signals per URL: canonical tag, redirect behavior, sitemap URL and internal links. Check HTTPS host, trailing slash, category aliases, product variants and tracking parameters. Ensure every indexable page has exactly one self-consistent canonical and duplicate variants point to it. Paginated pages should keep self-referencing canonicals. Return mismatches and fixes. Note that Google-selected canonical must be checked in Search Console.

### SEO15: Robots, noindex and private routes

Audit robots.txt, meta robots and X-Robots-Tag headers separately for all templates. Confirm no revenue or editorial page is accidentally noindexed or blocked, no CSS/JS needed for rendering is blocked, and admin/account/cart/API routes are protected by authentication, not just robots.txt. Define a policy for internal search, filters and sort parameters. Remember that a page blocked by robots.txt cannot have its noindex seen. Return an exceptions list.

### SEO16: Sitemap generation from approved publication

Rewrite the sitemap generator to read from published, indexable CMS records only. Use canonical HTTPS URLs; exclude redirected, 404, private, test and noindex URLs; include products, articles, collections, public pages and eligible video watch pages. Split into a sitemap index with files under 50,000 URLs and 50 MB each. Add a CI test comparing CMS records to the sitemap. Return the diff and test output.

### SEO17: Missing, orphan and broken links

Crawl the site with and without JavaScript. Check menus, footers, cards, breadcrumbs, related content, downloads and article links. Report broken internal links (4xx/5xx), links to redirected or retired paths, orphan pages (in sitemap but with no internal links) and links to unrelated forms. Missing pages should return true 404/410; redirect only if a real replacement exists. Fix templates, then re-crawl beyond one sample page.

## 04 · On-page and structured data

### SEO18: Titles, descriptions and headings

Crawl all indexable pages and export title, meta description, H1 and heading outline. Find empty, duplicate, truncated or irrelevant metadata, duplicated brand suffixes, internal labels and slug fragments (for example "Amp"). Generate corrected titles and descriptions from approved CMS fields, one H1 per page. Treat length limits as guidance, not rules. Output a before/after table for reviewer approval. Do not flag normal pagination titles as defects.

### SEO19: Articles, authors and factual quality

Audit all articles for body completeness, category, images, author attribution, publication/update dates and real reading time (calculated from word count). List thin articles and those with unverified claims (pricing, warranty, financing, engineering, "build 50% faster"). Never invent author credentials. Keep original URLs. Output a per-article checklist with flagged claims for owner approval.

### SEO20: Product and collection content

For each product page and collection, check that content states real specs, package inclusions, variants, delivery limits and price units, and distinguishes shell, turnkey home, service and downloadable plan. Flag pages that only repeat supplier copy. Draft a helpful intro section for each major collection (what it is, who it suits, how pricing works) using only approved facts. Ensure category names match their products. Return a gap table and draft copy marked "needs owner approval".

### SEO21: Structured data

Test the rendered and raw HTML of the homepage, a collection, a product, an article and a watch page. Implement valid JSON-LD where applicable: Organization and WebSite (home), BreadcrumbList (all), Product/Offer (products, only with verified price and availability), Article/BlogPosting (articles), VideoObject (watch pages). Markup must match visible content. Do not add fake reviews or ratings. Validate with the Rich Results Test and Schema.org validator. Return the code and validation results.

### SEO22: Images, social previews and accessibility

Audit images on key templates: alt text quality (not just presence), decorative images with empty alt, broken or unstable URLs, missing width/height, responsive srcset, next/image usage and lazy loading. Check og:image and twitter:image render correctly on each template. Fix without keyword stuffing. Confirm image rights for supplier images with the owner. Return a list of issues and fixes.

### SEO23: Internal links and navigation

Map priority pages (models, categories, guides) and ensure each is linked from relevant category pages, related content and nav via plain anchor \<a href> links, not buttons or JS-only handlers. Fix wrong CTAs, such as "Download Brochure" going to /floor-plans or advertised plans leading only to an upload form. Update internal links that point to redirected URLs to final URLs. Return a link-change list.

## 05 · Rendering and performance

### SEO24: Reliable rendering of important content

For the homepage, collection, product, blog, watch and /buildings templates, compare raw initial HTML, browser-rendered DOM and Search Console tested HTML. /buildings previously showed a loading state. Move critical content (title, canonical, H1, main copy, product/article links) to server rendering or static generation. Ensure failed data calls return a proper error status (not an indexable empty shell or false product data). Return a before/after comparison per template.

### SEO25: Crawlable pagination

The collection index uses "Load More" (for example "Showing 72 of 547 models"). Implement real paginated URLs (?page=2 or /page/2) with anchor links, self-referencing canonicals (not page 1), and server-rendered content. Keep infinite scroll or Load More as progressive enhancement. Define rules for filters and sort parameters (noindex or canonical to base). Test that a link-following crawl without JS discovers all 547 models, with no duplicates or skipped records.

### SEO26: Large homepage HTML

The homepage HTML body is about 4.63 MB. Profile the response: find serialized state (**NEXT\_DATA** or RSC payload), duplicated product/video data and unused fields. Return only the data each component needs; paginate or lazy-load the rest through APIs. Record before/after: HTML bytes, gzip/brotli size, total page weight, TTFB and cache headers. Do not degrade crawlable content or links.

### SEO27: Core Web Vitals by template

Measure homepage, category, product, blog and watch page on mobile and desktop. Use CrUX and Search Console field data where available; use Lighthouse or PageSpeed lab data only as diagnosis. Targets at p75: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Identify causes (hero media, main-thread JS, layout shifts, heavy embeds, server response). Implement fixes and re-measure. Report date, URL, device and metric source for every number.

### SEO28: Mobile usability

Test at 360, 390, 768 and 1280 px widths: navigation, filters, sticky elements, newsletter popup, chat overlays, tables, images and forms. Check horizontal overflow, tap targets, zoom, readable text, keyboard focus and form labels. Fix anything that obscures content or blocks primary actions. Confirm mobile pages contain the same content, links and metadata as desktop. Return screenshots and a bug list.

## 06 · Video and regional content

### SEO29: Reconcile videos by YouTube ID

Export all video records. Normalize each YouTube link to its 11-character video ID, stripping timestamp and tracking parameters. Create an inventory: video ID, watch-page URL, title, description, thumbnail, status, related model. Detect duplicates, deleted/private videos, wrong categories and broken embeds, using the YouTube API or oEmbed if allowed. Explain any difference between public and database counts.

### SEO30: Useful, specific watch pages

For priority videos, make the page's main content a single playable video, with a unique title, a useful summary, related model links and a transcript or captions where available. Render the video in the initial HTML, not only after a click. Do not rewrite or request indexing for every imported video. Preserve pages that already perform well. Propose a priority list based on Search Console data.

### SEO31: Video markup, sitemap and indexed state

Add valid VideoObject JSON-LD per watch page (name, description, thumbnailUrl, uploadDate, embedUrl or contentUrl, duration where known) matching visible content. Ensure each eligible page is in the repaired video sitemap (SEO01). Verify in Search Console both page indexing and video indexing, since a page may be indexed without its video. Report status and reasons for a sample of 10 pages. Do not promise video indexing.

### SEO32: State and regional pages

Audit location collections and state routes. For each, verify the service area is real, models listed are actually available there, and the content has unique, useful local information (delivery, permits, zoning, climate, lead times) rather than swapped place names. Recommend keep/improve/consolidate per page, with 301 mappings for consolidations. Do not create fake offices or addresses. Return a table.

### SEO33: Brand and off-site consistency

Compare business name, phone, email, hours, address and service area across the site, footer, schema and existing profiles (Google Business Profile, social, directories). Export Search Console links and known referral/supplier links, check where they land after migration, and fix any that now 404 or redirect poorly. Do not build bulk low-quality links. Return an inconsistency list and recommended corrections.

## 07 · Search Console and verification

### SEO34: Collect Search Console reports

Write a checklist and export instructions for the property owner to deliver, for the Domain property modularhome.com: Page indexing (with exclusion reasons and example URLs), Sitemaps (submitted URL, status, last read, discovered URLs), Video indexing, Performance (pre/post-migration, same-length periods), Core Web Vitals, Crawl stats, Manual actions, Security issues, Links and Removals. Specify file names, dates and who owns each. Remind them to grant access instead of sharing passwords.

### SEO35: Inspect a representative URL set

For each URL in this set, run URL Inspection and record the indexed result separately from the Test Live URL result: homepage; Modular Homes, Park Models and Commercial categories; All American and another product; a legacy collection and its root alternative; the construction guide and two older blogs; floor-plan index and one detail page; three watch pages; a new article; one old redirected URL. Columns: URL, indexed status, last crawl, user canonical, Google canonical, fetch status, indexing allowed, notes. A live test is not proof of indexing.

### SEO36: Submit corrections and verify outcomes

After fixes are deployed and live-tested, create a submission plan: request indexing only for a small set of important corrected URLs, resubmit corrected sitemaps, use Validate Fix where offered, and record dates. Use the Page indexing triage table: Discovered not indexed (improve links, sitemap), Crawled not indexed (content quality, duplicates), Duplicate canonical (align signals), Page with redirect (expected), Blocked (keep intentional), 404/soft 404 (fix or leave 410), 403/5xx (investigate access). Do not repeatedly submit unchanged URLs or buy indexing. Schedule follow-up checks at 1, 2 and 4 weeks and assign an owner to each remaining exception.

## Order of work

1. SEO06, SEO08, SEO10 (P0 content and data corrections)
2. SEO01, SEO02, SEO03, SEO16 (sitemaps)
3. SEO05, SEO13–SEO15, SEO17 (crawl access, redirects, canonicals, noindex)
4. SEO07, SEO09, SEO18–SEO25 (metadata, schema, rendering, pagination)
5. SEO26–SEO28 (performance and mobile)
6. SEO29–SEO33 (video and regional)
7. SEO34–SEO36 (Search Console verification and follow-up)
