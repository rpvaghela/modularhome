# ModularHome Migration — Source Authority Map

| Data Type | Authoritative Source | Primary Ingestion Path / Asset | Final Application Destination |
| :--- | :--- | :--- | :--- |
| **Products & Models** | Amish Built Cabins (`https://amishbuiltcabins.com/`) | `migration/source/Products.csv` | `src/data/all_products_catalog.json`, Postgres `products` |
| **Product Variants & Pricing** | Amish Built Cabins (`https://amishbuiltcabins.com/`) | `migration/source/Products.csv` | `src/data/all_products_catalog.json`, Quote Engine |
| **Product Media & CAD** | Amish Built Cabins (`https://amishbuiltcabins.com/`) | `migration/source/Products.csv` | Next.js Image Component, CDN |
| **Blog Articles & Guides** | ModularHome (`https://modularhome.com/`) | `migration/source/admin_seo_inventory.json` | `src/data/migrated_articles.json`, `/blogs/*` |
| **CMS & Informational Pages** | ModularHome (`https://modularhome.com/`) | `migration/source/admin_seo_inventory.json` | `src/data/custom_pages.json`, `/about`, etc. |
| **Navigation & Menus** | ModularHome (`https://modularhome.com/`) | ModularHome Header Structure | `src/components/layout/Header.tsx` |
| **SEO 301 Redirect Rules** | ModularHome (`https://modularhome.com/`) | Shopify URL Export | `src/data/shopify_redirects.json`, `middleware.ts` |
