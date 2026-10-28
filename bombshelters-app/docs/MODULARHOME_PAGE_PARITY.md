# ModularHome to BombShelter Page & Navigation Parity Matrix

This document provides a comprehensive audit of all routes in ModularHome (`src/app/`), detailing their purpose, functionality, and their corresponding implementation status in BombShelter (`bombshelters-app/app/`).

---

## 1. Route Parity Matrix

| ModularHome Route | Purpose & Key Functionality | BombShelter Equivalent | Status | Navigation Location | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Homepage with hero, categories, trust, featured models, forms | `/` | **Implemented & Verified** | Header Logo / Home | Fully functional tactical landing page |
| `/about` | Company history, factory standards, IRC/IBC building codes | `/about` | **Implemented & Verified** | Header "More" / Footer | Adapted to blast engineering & US manufacturing |
| `/contact` | Contact directory, office locations, general inquiry form | `/contact` | **Implemented & Verified** | Header "More" / Footer | Form routes to BombShelter `/api/bombshelter/leads` |
| `/delivery` | Freight logistics, crane delivery, site prep guidelines | `/delivery` | **Implemented & Verified** | Header "More" / Footer | Adapted to subterranean excavation & rigging |
| `/faqs` | Searchable buyer questions, financing & installation FAQs | `/faqs` | **Implemented & Verified** | Header "More" / Footer | Comprehensive shelter & bunker FAQ center |
| `/financing` | Lending partners, mortgage pre-approval, cost calculator | `/financing` | **Implemented & Verified** | Header "More" / Footer | Dedicated financing calculator and consultation |
| `/how-it-works` | 5-step factory to installation process | `/how-it-works` | **Implemented & Verified** | Header "More" / Footer | 5-step subterranean installation roadmap |
| `/pricing` | Pricing tiers, square footage estimates, turnkey packages | `/pricing` | **Implemented & Verified** | Header "More" / Footer | Turnkey shelter tiers & blast rating costs |
| `/quote` | Multi-step interactive Quote Wizard | `/quote` | **Implemented & Verified** | Header CTA / Footer | Interactive wizard routing to `/api/bombshelter/quotations` |
| `/upload-floor-plan` | Architectural plan & site map file upload form | `/upload-floor-plan` | **Implemented & Verified** | Header "More" / Footer | Upload CAD/PDF plans for engineering stamps |
| `/models` | Searchable & filterable housing catalog | `/models` | **Implemented & Verified** | Header Ribbon / Footer | Comprehensive bunker & shelter catalog |
| `/models/[slug]` | Individual model specification, gallery & blueprints | `/models/[slug]` | **Implemented & Verified** | Catalog Links | Detail views with NBC ratings & blast specs |
| `/buildings` | Alias directory for building types | `/buildings` | **Implemented & Verified** | Redirect to `/models` | Alias for model catalog |
| `/buildings/[slug]` | Building detail page | `/buildings/[slug]` | **Implemented & Verified** | Catalog Links | Alias redirect to `/models/[slug]` |
| `/products/[slug]` | Product details | `/products/[slug]` | **Implemented & Verified** | Catalog Links | Product detail alias |
| `/floor-plans` | Blueprints & floor plan library | `/floor-plans` | **Implemented & Verified** | Header "More" / Footer | Hardened shelter blueprints |
| `/floor-plans/[slug]` | Floor plan detail & downloadable specifications | `/floor-plans/[slug]` | **Implemented & Verified** | Floor Plan Links | Architectural layout inspection |
| `/collections` | Curated collections (under $100k, modern, luxury) | `/collections` | **Implemented & Verified** | Header "More" / Footer | Curated shelter suites (Doomsday, Tornado, Off-Grid) |
| `/collections/[slug]` | Collection detail & filtered models | `/collections/[slug]` | **Implemented & Verified** | Collection Links | Filtered models by collection |
| `/modular-homes` | Modular homes category showcase | `/modular-homes` | **Implemented & Verified** | Header Ribbon | Hardened modular residences |
| `/prefab-homes` | Prefabricated homes category showcase | `/prefab-homes` | **Implemented & Verified** | Header Ribbon | Prefabricated ballistic homes |
| `/barndominiums` | Barndominium models & steel framing | `/barndominiums` | **Implemented & Verified** | Header Ribbon | Steel-framed barndominiums |
| `/house-kits` | Pre-engineered structural housing kits | `/house-kits` | **Implemented & Verified** | Header Ribbon | DIY hardened steel shelter kits |
| `/tiny-homes` | Micro living & tiny home options | `/tiny-homes` | **Implemented & Verified** | Header Ribbon | Bug-out shelters & compact panic pods |
| `/park-models` | Recreational park models & cabin units | `/park-models` | **Implemented & Verified** | Header Ribbon | Modular retreat units |
| `/cabins` | Timber & mountain cabin models | `/cabins` | **Implemented & Verified** | Header Ribbon | Off-grid survival cabins |
| `/modular-cabins` | Factory-built modular log cabins | `/modular-cabins` | **Implemented & Verified** | Header "More" / Footer | Hardened steel & timber hybrid cabins |
| `/adus` | Accessory dwelling units & granny flats | `/adus` | **Implemented & Verified** | Header Ribbon | Backyard safe rooms & ballistic ADUs |
| `/a-frame-homes` | Steep-pitch A-frame architectural designs | `/a-frame-homes` | **Implemented & Verified** | Header Ribbon | Heavy snow/wind blast-rated A-frames |
| `/commercial-modular-buildings` | Commercial & municipal modular structures | `/commercial-modular-buildings` | **Implemented & Verified** | Header Ribbon | Community storm & blast shelters |
| `/modular-storage` | Modular garages, workshops, and storage | `/modular-storage` | **Implemented & Verified** | Header "More" / Footer | Blast-resistant storage & armories |
| `/modular-homes-under-100k` | Affordable housing under $100k filter | `/modular-homes-under-100k` | **Implemented & Verified** | Header "More" / Footer | Budget-friendly storm shelters under $100k |
| `/blogs` | Educational articles, construction news, guides | `/blogs` | **Implemented & Verified** | Header "More" / Footer | Survival, prepper & engineering blog |
| `/blogs/[blog]` | Category blog feed | `/blogs/[blog]` | **Implemented & Verified** | Blog Links | Scoped by category/handle |
| `/blogs/[blog]/[article]` | Blog post reader with TOC and author bio | `/blogs/[blog]/[article]` | **Implemented & Verified** | Blog Links | Scoped to `blog_handle = 'bombshelters'` |
| `/videos` | Video walk-throughs & factory builds | `/videos` | **Implemented & Verified** | Header "More" / Footer | Blast testing & installation videos |
| `/videos/[slug]` | Video player with details & related models | `/videos/[slug]` | **Implemented & Verified** | Video Links | Video playback with inquiry CTA |
| `/resources` | Resource directory & buyer guides | `/resources` | **Implemented & Verified** | Footer | PDF blueprints, NBC guides, checklists |
| `/resources/[slug]` | Individual resource guide | `/resources/[slug]` | **Implemented & Verified** | Resource Links | Downloadable guide reader |
| `/pages/[slug]` | Dynamic CMS content renderer | `/pages/[slug]` | **Implemented & Verified** | Internal Links | Scoped CMS content pages |
| `/privacy-policy` | Consumer data protection & privacy terms | `/privacy-policy` | **Implemented & Verified** | Footer | BombShelters.com Privacy Policy |
| `/terms-of-service` | Contract terms, liability, dispute resolution | `/terms-of-service` | **Implemented & Verified** | Footer | BombShelters.com Terms of Service |
| `/shipping-delivery-policy` | Freight, escort vehicles & site delivery policies | `/shipping-delivery-policy` | **Implemented & Verified** | Footer | Freight & site delivery logistics policy |
| `/refund-cancellation-policy` | Custom fabrication cancellation policies | `/refund-cancellation-policy` | **Implemented & Verified** | Footer | Custom steel fabrication terms |
| `/warranty` | Structural steel & NBC equipment warranty | `/warranty` | **Implemented & Verified** | Footer | Lifetime structural warranty policy |
| `/accessibility` | ADA compliance & web accessibility statement | `/accessibility` | **Implemented & Verified** | Footer | Accessibility conformance statement |
| `/admin` | Admin dashboard overview | `/admin` | **Implemented & Verified** | Admin Nav | Command center with 6 KPI tiles, quick actions, telemetry |
| `/admin/login` | Secure admin login with rate limiting | `/admin/login` | **Implemented & Verified** | Direct / Guard | DEFCON clearance terminal with brute-force lockout & demo credentials |
| `/admin/analytics` | Traffic and conversion analytics | `/admin/analytics` | **Implemented & Verified** | Admin Nav | Pipeline analytics, conversion funnels & geographic heatmaps |
| `/admin/reports` | Financial and production reports | `/admin/reports` | **Implemented & Verified** | Admin Nav | Defense throughput & financial reports with CSV export |
| `/admin/products` | Product management listing | `/admin/products` | **Implemented & Verified** | Admin Nav | Bunker model catalog directory with blast filters & search |
| `/admin/products/new` | Create product interface | `/admin/products/new` | **Implemented & Verified** | Admin Products | Add new bunker/shelter model with blast specs |
| `/admin/products/[id]` | Edit product specifications | `/admin/products/[id]` | **Implemented & Verified** | Admin Products | Update shelter specs, NBC ratings, and images |
| `/admin/collections` | Curated collections manager | `/admin/collections` | **Implemented & Verified** | Admin Nav | Tactical bunker series & defense suites manager |
| `/admin/collections/[id]` | Edit curated collection | `/admin/collections/[id]` | **Implemented & Verified** | Admin Collections | Edit collection metadata and banner schematics |
| `/admin/floor-plans` | Manage floor plans & blueprints | `/admin/floor-plans` | **Implemented & Verified** | Admin Nav | Hardened CAD blueprint packages & digital license manager |
| `/admin/floor-plans/[id]` | Edit floor plan blueprint | `/admin/floor-plans/[id]` | **Implemented & Verified** | Admin Floor Plans | Edit architectural CAD specs, tolerances, and pricing |
| `/admin/orders` | Fabrication & blueprint orders | `/admin/orders` | **Implemented & Verified** | Admin Nav | Contract & fabrication orders with status tracking & telemetry |
| `/admin/customers` | Customer CRM directory | `/admin/customers` | **Implemented & Verified** | Admin Nav | High-security client CRM with NDA tracking & threat levels |
| `/admin/customers/[id]` | Client dossier & profile | `/admin/customers/[id]` | **Implemented & Verified** | Admin Customers | Edit client NDA status, clearance, and installation notes |
| `/admin/leads` | CRM leads pipeline & triage | `/admin/leads` | **Implemented & Verified** | Admin Nav | Strict mass-assignment protection & triage filters |
| `/admin/quotations` | Quotations manager & status updates | `/admin/quotations` | **Implemented & Verified** | Admin Nav | Multi-tier turnkey quote wizard pipeline |
| `/admin/pricing` | Dynamic pricing rules engine | `/admin/pricing` | **Implemented & Verified** | Admin Nav | Base rates, blast multipliers, and deterministic interactive test bench |
| `/admin/pages` | Manage custom CMS pages | `/admin/pages` | **Implemented & Verified** | Admin Nav | CMS page manager with status and SEO metadata |
| `/admin/pages/[id]` | Visual HTML & layout editor | `/admin/pages/[id]` | **Implemented & Verified** | Admin Pages | Real-time HTML visual content editor & preview |
| `/admin/sections` | Section blocks & homepage layout | `/admin/sections` | **Implemented & Verified** | Admin Nav | Drag/toggle section visibility & layout order |
| `/admin/reviews` | Reviews & blast testimonials | `/admin/reviews` | **Implemented & Verified** | Admin Nav | Testimonials moderation, star ratings & verification |
| `/admin/faqs` | Manage FAQ items | `/admin/faqs` | **Implemented & Verified** | Admin Nav | Searchable FAQ knowledge base management |
| `/admin/redirects` | 301/302 URL redirect rules | `/admin/redirects` | **Implemented & Verified** | Admin Nav | Zero-downtime SEO URL redirect manager |
| `/admin/settings` | General site configuration | `/admin/settings` | **Implemented & Verified** | Admin Nav | Global defense parameters & tenant branding |
| `/admin/settings/header` | Header bar configuration | `/admin/settings/header` | **Implemented & Verified** | Admin Settings | Top bar hotline, trust badges, and CTA settings |
| `/admin/settings/footer` | Footer configuration | `/admin/settings/footer` | **Implemented & Verified** | Admin Settings | Footer disclaimers, links, and hotline controls |
| `/admin/settings/navigation` | Navigation ribbon menus | `/admin/settings/navigation` | **Implemented & Verified** | Admin Settings | Ribbon hierarchy, link ordering, and category targets |
| `/admin/media` | Media asset library & upload | `/admin/media` | **Implemented & Verified** | Admin Nav | Upload/manage shelter schematics and blueprints |
| `/admin/blogs` | Blog articles management | `/admin/blogs` | **Implemented & Verified** | Admin Nav | List survival guides and technical defense briefings |
| `/admin/blogs/new` | Write new blog article | `/admin/blogs/new` | **Implemented & Verified** | Admin Blogs | Create technical survival guide |
| `/admin/blogs/[id]` | Edit blog article | `/admin/blogs/[id]` | **Implemented & Verified** | Admin Blogs | Edit article with injection shield |
| `/admin/videos` | Video gallery & walkthroughs | `/admin/videos` | **Implemented & Verified** | Admin Nav | YouTube video tour manager & blast test gallery |
| `/admin/shopify` | Store sync & catalog migration | `/admin/shopify` | **Implemented & Verified** | Admin Nav | Defense store data pipeline & Shopify catalog sync |
| `/admin/users` | Clearance users & RBAC | `/admin/users` | **Implemented & Verified** | Admin Nav | DEFCON commander & officer access provisioning |
| `/admin/security` | DEFCON security & lockout | `/admin/security` | **Implemented & Verified** | Admin Nav | MFA parameters, brute-force lockout, and rate limits |
| `/admin/logs` | Activity audit logs | `/admin/logs` | **Implemented & Verified** | Admin Nav | Real-time audit telemetry & security event stream |
| `/account/*` | End-customer e-commerce login/orders/downloads | N/A | **Excluded (Non-Applicable)** | N/A | High-ticket custom capital fabrication does not use public cart; uses turnkey quotes/leads |
| `/checkout/success` | E-commerce checkout success | N/A | **Excluded (Non-Applicable)** | N/A | BombShelter processes purchases via contracts/wire/financing |

---

## 2. Navigation Hierarchy
- **Header Top Row**: Logo, Search bar, 4 Trust Badges ("Nationwide Delivery", "Custom Solutions", "Expert Support", "Made in USA"), Hotline `812-595-4033`, "Get a Quote" CTA.
- **Header Ribbon (White)**:
  - `Modular Homes` -> `/modular-homes`
  - `Prefab Homes` -> `/prefab-homes`
  - `Barndominiums` -> `/barndominiums`
  - `House Kits` -> `/house-kits`
  - `Tiny Homes` -> `/tiny-homes`
  - `Park Models` -> `/park-models`
  - `Cabins` -> `/cabins`
  - `ADUs & Granny Pods` -> `/adus`
  - `A-Frames` -> `/a-frame-homes`
  - `Commercial` -> `/commercial-modular-buildings`
  - `More ⌵` -> Dropdown linking to:
    - *Buyer Guides*: `/delivery`, `/faqs`, `/pricing`, `/financing`, `/how-it-works`, `/blogs`, `/collections`
    - *Services & Planning*: `/floor-plans`, `/upload-floor-plan`, `/videos`, `/about`, `/contact`, `/modular-cabins`, `/modular-storage`, `/modular-homes-under-100k`
- **Mobile Hamburger Drawer**:
  - Full search bar
  - Top-level links matching the Ribbon (`Modular Homes`, `Prefab Homes`, `Barndominiums`, `House Kits`, `Tiny Homes`, `Park Models`, `Cabins`, `ADUs & Granny Pods`, `A-Frames`, `Commercial`)
  - Expandable accordion for `More` (Buyer Guides & Services)
  - Direct call CTA `812-595-4033`
- **Footer**:
  - *Models & Shelters*: `/models`, `/modular-homes`, `/cabins`, `/barndominiums`, `/adus`, `/floor-plans`, `/collections`
  - *Engineering & Logistics*: `/delivery`, `/how-it-works`, `/pricing`, `/financing`, `/quote`, `/upload-floor-plan`
  - *Company & Resources*: `/about`, `/contact`, `/blogs`, `/faqs`, `/videos`, `/resources`
  - *Legal & Compliance*: `/privacy-policy`, `/terms-of-service`, `/shipping-delivery-policy`, `/refund-cancellation-policy`, `/warranty`, `/accessibility`
