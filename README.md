# ModularHome.com — Complete Admin Panel Audit, Bug Fix & Production Sync

## Project Context

You are working on the existing ModularHome.com (SteelWeb) full-stack project.

**Technology stack:**
- Next.js App Router, React, TypeScript, Tailwind CSS
- Supabase PostgreSQL database
- Admin authentication with secure cookies/JWT
- Product catalog, collections, blogs, CMS pages, leads, quotations, orders, media uploads and global settings
- Git branches/remotes: inspect the existing configuration before making changes
- Production website: https://modularhome.com/

## PRIMARY OBJECTIVE

Perform a complete audit of the existing admin panel and all related APIs, database operations, frontend integrations, and production deployment workflows.

Find real issues, fix them safely, run appropriate tests, and prepare verified changes for integration into the `main` branch and production website.

**Do not stop after generating an audit report.** Continue through implementation, regression testing, and deployment preparation. If credentials, database access, or external permissions are missing, document the blocker and complete all safe work that is possible.

---

## PHASE 1 — PROJECT DISCOVERY AND SAFETY

1. Inspect the repository structure, `package.json`, environment variable names, admin pages, API routes, authentication utilities, database clients, storage logic, middleware, and existing tests.
2. Read the existing project documentation and recent QA reports before changing code.
3. Run:
   - `git status`
   - `git branch --show-current`
   - `git remote -v`
   - `npx tsc --noEmit`
   - Existing relevant tests
4. Identify the real production database configuration and deployment target without printing secret values.
5. Determine whether the project uses Supabase, local JSON files, or a hybrid storage model for each module.
6. Create a dedicated branch, such as `fix/admin-panel-audit`, from the correct up-to-date base branch. Do not overwrite existing user changes.
7. Record the baseline build and test results.

**Safety requirements:**
- Never expose, print, commit, or log API keys, passwords, service-role keys, JWT secrets, session cookies, or tokens.
- Do not modify production data during testing.
- Never run destructive SQL, database resets, bulk deletes, production migrations, or mass catalog imports without explicit approval and a verified backup.
- Do not replace real product data with demo data, generic placeholders, or fabricated values.
- Do not disable authentication, authorization, validation, or security checks to make a test pass.

## PHASE 2 — ADMIN AUTHENTICATION AND SECURITY

Audit the complete authentication flow, including admin login, logout, session verification, protected layouts, middleware, and every `/api/admin/*` endpoint.

Check and fix:

1. Default or hardcoded credentials, fallback passwords, and insecure authentication-secret fallbacks.
2. Missing or weak environment-variable validation.
3. JWT signing and verification consistency.
4. Cookie configuration: `HttpOnly`, `Secure` in production, appropriate `SameSite`, expiry, and path.
5. Session expiration and logout invalidation.
6. Rate limiting and login lockout.
7. Authorization checks on every sensitive server endpoint.
8. Role-based permissions if the project supports multiple admin roles.
9. CSRF protection where applicable to cookie-authenticated mutations.
10. Input validation, SQL injection risks, unsafe file uploads, path traversal, and mass assignment.
11. Error messages that reveal sensitive internal information.
12. Exposure of service-role credentials or other secrets in browser bundles.

Inspect fallback authentication code carefully. If a default credential or secret fallback creates a security weakness, remove it safely and replace it with explicit environment validation and secure failure behavior.

Do not lock out the legitimate administrator or change production credentials without a safe recovery plan.

**Tests:** Valid login, invalid login, missing configuration, unauthorized API requests, expired session, logout, repeated failed logins, and direct access to protected routes.

## PHASE 3 — DASHBOARD AND ADMIN NAVIGATION

Test the admin dashboard and every sidebar navigation item.

Verify:
- Dashboard loads without runtime errors.
- Metric cards use real data and display correct totals.
- Loading, empty, and error states work.
- Sidebar links point to valid routes.
- Active navigation state is correct.
- Search, filters, pagination, sorting, and detail views work where implemented.
- No broken buttons, dead links, console errors, or unexplained 404/500 responses exist.
- Mobile and desktop admin layouts remain usable.

Do not invent metrics or display hardcoded success values as live database statistics.

## PHASE 4 — PRODUCTS AND MODELS

Audit every implemented product/model admin workflow.

Test:
- Product listing and search.
- Create product.
- Edit product.
- Publish and unpublish.
- Delete/archive behavior, according to the existing design.
- Product image upload, gallery ordering, and image removal.
- Category and collection assignments.
- Variants, options, dimensions, square footage, bedrooms, bathrooms, stories, specifications, and prices.
- SEO title, meta description, slug, and canonical URL fields where supported.

### Data integrity rules

- Never silently insert a fabricated price, generic image, incorrect square footage, or default specification.
- Required missing data should produce clear validation errors.
- Optional missing data should remain null/empty when appropriate.
- Prices must use validated numeric values and consistent currency formatting.
- Existing verified catalog records must not be overwritten by placeholder values.
- Check slug uniqueness and prevent accidental duplicate records.
- Confirm all edits persist after a page refresh and a new admin session.
- Confirm the public listing, product detail page, quote flow, and relevant collection pages use the same saved product record.

Test product creation and editing with a clearly identifiable QA fixture only in a local or dedicated test environment. Clean up only that known test fixture after verification.

## PHASE 5 — BLOGS AND ARTICLES

Audit:
- Blog/article listing.
- Search, category filtering, and pagination.
- Create and edit forms.
- Introduction field.
- Full article content and formatting.
- Featured images and inline media.
- Author, date, tags, categories, slug, SEO metadata, and publish status.
- Preview and published article routes.
- Admin edit links and 404 handling.

Verify that saving an article updates the actual persistent record and that the public article displays the saved content.

Do not regenerate, shorten, or replace existing source articles without explicit authorization.

Check that article slugs are unique and that existing SEO URLs remain intact or receive appropriate redirects when necessary.

## PHASE 6 — COLLECTIONS, MENUS, PAGES, AND SETTINGS

Audit all implemented CMS workflows.

### Collections
- Create/edit/publish operations.
- Correct product-to-collection relationships.
- Collection image and description.
- Slug and SEO fields.
- Accurate product counts.
- Correct public category listing.

### Navigation and menus
- Header menu and dropdowns.
- Footer links.
- Menu ordering and nesting.
- Valid destinations and no broken links.
- Saved menu changes reflected on the public website.

### CMS pages and global settings
- Page editing and publishing.
- Homepage sections, where managed by the admin.
- Contact details and support email.
- Header/footer settings.
- SEO and social metadata.
- Image/media management.

Preserve the approved ModularHome.com navigation and SEO URL structure. Do not create broad redirects to the homepage as a workaround for missing pages.

## PHASE 7 — LEADS, QUOTES, ORDERS, AND BLUEPRINTS

Audit every existing workflow for these modules:

### Leads
- Listing, search, filters, lead details, and supported status updates.
- Correct persistence and timestamps.
- No accidental exposure of private customer information.

### Quotes
- Quote creation and retrieval.
- Product and variant linkage.
- Pricing engine integration.
- Correct quantity, options, and totals.
- Invalid or unsupported configurations handled safely.
- Quote data remains consistent between the admin view and customer-facing flow.

### Orders and payments
- Order records and payment status.
- Correct synchronization between local storage and Supabase if both are intentionally used.
- No duplicate orders or inconsistent statuses.
- Correct handling of failed, pending, and successful payment states.
- Never mark an order as paid solely because a client-side request says it succeeded.

### Blueprint downloads
- Access-token validation and expiry.
- Authorization against the relevant order/customer.
- Secure file delivery and correct content type.
- No arbitrary filesystem access or exposure of private files.

Use test transactions or provider test mode only. Do not charge real customers or alter real orders during testing.

## PHASE 8 — DATABASE AND STORAGE AUDIT

Create a module-by-module data flow map documenting:

- Admin page.
- API route.
- Validation/schema.
- Database table or storage source.
- Create/read/update/delete operations supported.
- Public frontend consumers.
- Cache invalidation or revalidation behavior.

Check for:
- Missing tables or columns.
- Supabase permission/RLS problems.
- Incorrect filters and joins.
- Duplicate writes.
- Race conditions.
- Swallowed errors.
- Silent fallback to local files.
- Inconsistent local-file and database records.
- Incorrect environment selection between local, staging, and production.
- Unhandled database failures.

Use the existing database schema and migration history as the source of truth. Do not invent migrations or assume a table exists without verification.

Never use an elevated service-role client in browser code. Use the least-privileged database access pattern appropriate to the existing architecture.

If production database access is unavailable, test against local fixtures or a dedicated staging database and explicitly mark production persistence as unverified.

## PHASE 9 — MAIN WEBSITE SYNCHRONIZATION

For each editable module, verify this complete flow:

**Admin UI → API validation → persistent database → cache invalidation/revalidation → public frontend.**

Test the following:

1. Create or edit a QA record in a safe test environment.
2. Confirm the API response accurately reflects the operation.
3. Read the record directly from the intended test database.
4. Refresh the admin page and confirm the saved values remain.
5. Open the relevant public route and verify the update is visible.
6. Test the same route in a fresh session to avoid relying on stale browser state.
7. Verify the expected cache revalidation mechanism.
8. Check for inconsistent data between listings, detail pages, quotes, and admin views.
9. Verify that unpublished or private content does not become publicly visible.
10. Verify that public changes do not unintentionally expose private fields.

Implement appropriate Next.js cache invalidation or revalidation only after identifying the actual caching strategy used by this repository.

Do not force-push, overwrite the production branch, or deploy untested changes.

## PHASE 10 — AUTOMATED TESTING

Build on the project's existing test framework. Do not install a large new testing framework unless necessary.

Add or improve automated tests for:
- Authentication and authorization.
- Admin CRUD APIs.
- Input validation.
- Product data integrity.
- Blog create/edit/publish workflows.
- Collection assignments.
- Lead and quote persistence.
- Database failure handling.
- Cache revalidation.
- Public rendering of updated content.

Use mocks or isolated fixtures for tests that could modify real data.

Run the available checks, including:

`npx tsc --noEmit`

`npm run build`

Run the project's actual unit/integration tests and the new admin regression suite.

If browser automation is already configured, use it to test the most important user flows. Otherwise, document manual verification steps rather than claiming browser tests passed.

Do not claim a test passed if it was not actually executed. Capture real exit codes, HTTP statuses, assertion results, and relevant errors.

## PHASE 11 — BUG FIXING AND REGRESSION

For each issue discovered:

1. Record the issue, severity, affected module, and reproduction steps.
2. Identify the root cause before editing code.
3. Implement the smallest safe fix.
4. Add a regression test where practical.
5. Rerun the affected test.
6. Rerun TypeScript and build checks.
7. Check adjacent features for regressions.

Prioritize:
- Critical: authentication bypass, secret exposure, unauthorized access, data corruption.
- High: failed saves, incorrect prices/specifications, lost changes, broken publishing, inconsistent production data.
- Medium: incorrect filters, missing content, navigation errors, broken image handling.
- Low: visual defects and minor usability issues.

Do not hide failures by weakening assertions or removing tests.

## PHASE 12 — GIT, MAIN BRANCH, AND DEPLOYMENT

1. Inspect current branch and remotes.
2. Keep all fixes on the dedicated audit branch initially.
3. Review the final diff and ensure no secrets, credentials, local logs, test customer data, or unintended data exports are committed.
4. Run all required checks.
5. Commit changes with clear, descriptive messages.
6. Push the audit branch to the correct existing remote.
7. Prepare a pull request or a clear merge-ready summary for `main`.
8. Merge only when the changes are verified and the project's workflow permits it.
9. Inspect the actual deployment configuration before triggering a production deployment.
10. Deploy only after approval and successful checks.
11. Run production smoke tests after deployment without destructive operations.
12. If deployment credentials or permissions are unavailable, stop at a tested, merge-ready state and provide exact manual deployment steps.

Do not claim that `main` is updated or the live website is synchronized unless you verify the relevant Git and deployment results.

## REQUIRED DELIVERABLES

Generate these files in the repository:

### 1. `reports/ADMIN_PANEL_AUDIT.md`
Include:
- Architecture and data flow.
- All admin modules audited.
- Files and APIs inspected.
- Security findings.
- Database and synchronization findings.
- Severity and evidence for each issue.
- Fixed, open, blocked, and unverified items.

### 2. `reports/ADMIN_PANEL_TEST_RESULTS.md`
Include:
- Test ID.
- Module and scenario.
- Expected result.
- Actual result.
- PASS / FAIL / BLOCKED / NOT RUN.
- Evidence, HTTP status, and failure details.
- Regression test reference.

### 3. `reports/ADMIN_PANEL_FIX_LOG.md`
Include:
- Root cause.
- Files changed.
- Fix implemented.
- Tests run.
- Remaining risks.

### 4. `reports/ADMIN_TO_LIVE_SYNC_MATRIX.md`
For each module, document:
- Admin page.
- API endpoint.
- Data source/table.
- Public page or consumer.
- Cache strategy.
- Persistence verification.
- Public reflection verification.
- Final sync status.

### 5. `reports/ADMIN_PANEL_FINAL_SUMMARY.md`
Include:
- Total tests run, passed, failed, blocked, and not run.
- Issues found and fixed.
- Remaining critical/high-severity issues.
- TypeScript and production build results.
- Branch and commit hashes.
- Remote push result.
- Pull request/merge status.
- Production deployment and smoke-test status.
- Exact manual actions still required.

## FINAL ACCEPTANCE CRITERIA

The task is complete only when:

- Admin authentication and sensitive APIs are secure.
- All implemented admin modules have been audited.
- CRUD operations persist correctly in the intended database.
- Product data, pricing, blogs, collections, pages, and settings remain consistent.
- Customer leads, quotes, orders, and blueprint files are handled securely.
- Cache invalidation and frontend synchronization work where applicable.
- Automated checks pass, or failures are clearly documented.
- No unverified test is reported as passed.
- Changes are committed and pushed to the correct branch.
- Main-branch merge and production deployment status are explicitly verified.
- All remaining blockers and manual steps are documented.

Start by inspecting the current project and existing test reports. Then execute the phases in order, fix confirmed defects, and continue until the safe stopping point. Do not merely describe what should be done—perform the available work and report the actual results.