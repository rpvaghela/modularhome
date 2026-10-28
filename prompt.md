# Task: Complete ModularHome Page & Navigation Parity in BombShelter

## Project paths
- Existing ModularHome: `SteelWeb/`
- BombShelter: `SteelWeb/bombshelters-app/`

## Objective
Audit the entire ModularHome website and recreate every relevant page and its navigation experience in BombShelter.

BombShelter must remain a separate application with its own frontend routes, APIs, admin panel, content and business logic. Only the existing Supabase/PostgreSQL database infrastructure is shared.

## 1. Audit EVERY ModularHome page

Inspect the complete ModularHome project, including:
- All public routes, nested routes and dynamic routes
- Main pages, landing pages and CMS-managed pages
- Products, product details, collections and category pages
- Blogs, article details and informational content
- Contact, consultation, quote and upload forms
- FAQs, search, legal pages and policies
- Header, navigation menus, dropdowns and mega menus
- Footer navigation and secondary links
- Admin panel pages and management features
- Redirects, internal links, breadcrumbs and API dependencies

Do not inspect only the homepage. Build a complete route inventory from the actual codebase and CMS-related route handling.

## 2. Create a route parity report

Create `bombshelters-app/docs/MODULARHOME_PAGE_PARITY.md`.

For every discovered ModularHome route, record:
- Original route and purpose
- Important functionality
- BombShelter equivalent route
- Whether it exists, is incomplete, is missing, or is not applicable
- Navigation location where users can access it
- Implementation status

Every route must be accounted for. Any route marked not applicable must include a reason.

## 3. Implement missing BombShelter pages

Create every missing applicable page in `bombshelters-app`.

Requirements:
- Preserve BombShelter's existing homepage and tactical design.
- Use BombShelter-specific content, terminology, products, categories, images and forms.
- Adapt ModularHome features to the bomb shelter business instead of copying unrelated branding or housing content.
- Implement dynamic listing and detail pages where applicable.
- Ensure all forms use BombShelter's own API endpoints.
- Add loading, error, empty and success states.
- Ensure responsive behavior on desktop, tablet and mobile.
- Add working breadcrumbs and internal navigation links.
- Do not introduce dead links or placeholder pages.

## 4. Navigation parity — MANDATORY

Make all applicable pages accessible through BombShelter's menus, similar to ModularHome.

### Header
- Inspect ModularHome's header structure and navigation hierarchy.
- Build the equivalent BombShelter header with appropriate menu items.
- Implement dropdowns or mega menus for nested sections.
- Support keyboard navigation, focus states, accessible labels and mobile menu behavior.
- Ensure all dropdown links open the correct BombShelter routes.

### Footer
- Recreate the relevant footer navigation groups.
- Include applicable informational, contact, FAQ, policy and other secondary pages.
- Verify every footer link points to a valid BombShelter route.

### Internal navigation
- Add links from relevant landing pages to detail pages.
- Add breadcrumbs where appropriate.
- Ensure product, category, blog and CMS pages can be discovered through navigation.
- Verify all pages are reachable without manually entering their URLs.

Create a navigation mapping in the parity report that shows which menu and submenu contains each page.

## 5. Backend and database isolation

- Use BombShelter API routes under `/api/bombshelter/*`.
- Use BombShelter-scoped data stores and filters.
- Do not route BombShelter business operations through ModularHome APIs.
- Do not change ModularHome APIs, UI, authentication, configuration or production data.
- Do not run production migrations or data mutations.
- Verify schema compatibility before relying on existing tables or columns.
- Do not invent database fields or assume that required production data exists.

## 6. Admin panel

Audit ModularHome's admin functionality and implement the applicable equivalent features in BombShelter's separate admin panel.

Ensure:
- Admin navigation exposes all implemented management pages.
- Products, categories, blogs, CMS pages, leads, quotations, media and settings are managed through BombShelter-specific workflows where applicable.
- Admin-only pages and API routes have server-side authorization.
- Admin CRUD operations enforce BombShelter data isolation.

If a required CMS or data-management feature is missing, document it and implement it only when the existing schema supports it safely.

## 7. Verification

Run:
- TypeScript typecheck
- Production build
- Route inventory and missing-page checks
- Header and footer link validation
- Dynamic route and breadcrumb checks
- Mobile navigation checks
- API and tenant-isolation regression tests

Report actual test results; do not claim tests passed without execution evidence.

## 8. Final deliverables

Provide:
1. Complete ModularHome route inventory.
2. Page parity matrix.
3. List of all pages created or updated.
4. Header, dropdown, mobile menu and footer navigation changes.
5. Admin navigation and feature parity report.
6. Build and test results.
7. Remaining missing pages and blockers.
8. Confirmation that ModularHome production code, configuration, schema and data were not modified.

Implement the changes in `bombshelters-app` only. Preserve existing user changes and do not deploy to production without approval.

## Definition of done

Every applicable ModularHome page has an equivalent BombShelter page, every page is reachable through an appropriate menu, dropdown, footer link or contextual internal link, and all navigation targets work correctly.

BombShelter must feel like a complete, independently operated website — not just a homepage with disconnected pages.