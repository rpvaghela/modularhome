# ModularHome Web Application & Administrative CMS

> **ModularHome Consolidated Feature Scope — Phase 1 Completion Reference**  
> *Authoritative source of truth for public site presentation and operational management.*

---

## 🏗️ System Overview

ModularHome.com is a next-generation web application for custom prefabricated and precision-engineered steel modular residences, luxury barndominiums, ADUs, and cabin kits. 

The administration portal (`/admin`) serves as the operational source of truth for the public live site. Authorized administrators and sales staff can manage site configuration, architectural catalogs, pricing rules, customer inquiries, and pages without requiring source code deployments.

---

## 📋 Phase 1 Consolidated Scope & Verification Checklist

| # | Scope Item | Status | Key Components & Routes |
|---|------------|:------:|-------------------------|
| **1** | **Admin Login, Session & Route Handling**<br>Direct URL loads after browser refresh, 1-hour session security, auto-heartbeat, role preservation. | ✅ Verified | [AdminLayout](file:///src/app/admin/layout.tsx), [middleware.ts](file:///src/middleware.ts), [auth.ts](file:///src/lib/auth.ts), [/admin/login](file:///src/app/admin/login/page.tsx) |
| **2** | **Unified Dashboard & Authoritative Metrics**<br>Accurate real-time database counts, loading spinners, error states, and quick-action shortcuts. | ✅ Verified | [/admin](file:///src/app/admin/page.tsx), [/api/admin/dashboard/stats](file:///src/app/api/admin/dashboard/stats/route.ts) |
| **3** | **Security, Role Permissions, 2FA & Auditing**<br>RFC 6238 TOTP 2FA, brute-force lockout, server-side role checks (`SUPER_ADMIN`, `SALES`, `CONTENT_ADMIN`), activity audit logging. | ✅ Verified | [/admin/security](file:///src/app/admin/security/page.tsx), [/admin/users](file:///src/app/admin/users/page.tsx), [/admin/logs](file:///src/app/admin/logs/page.tsx), [totp.ts](file:///src/lib/totp.ts), [activityLog.ts](file:///src/lib/activityLog.ts) |
| **4** | **Global Settings Integration**<br>Branding logo, favicon, phone, email, address, social links, announcement bar, navigation, and reusable CTAs reflected on live site. | ✅ Verified | [/admin/settings](file:///src/app/admin/settings/page.tsx), [settings.ts](file:///src/lib/settings.ts), [Navbar.tsx](file:///src/components/Navbar.tsx), [Footer.tsx](file:///src/components/Footer.tsx), [layout.tsx](file:///src/app/layout.tsx) |
| **5** | **Page & Section CMS Controls**<br>Full create/edit/preview/publish controls, rich HTML content, reordering, visibility toggling, and SEO metadata. | ✅ Verified | [/admin/pages](file:///src/app/admin/pages/page.tsx), [/admin/sections](file:///src/app/admin/sections/page.tsx), [/pages/[slug]](file:///src/app/pages/[slug]/page.tsx), [pageStore.ts](file:///src/lib/pageStore.ts) |
| **6** | **Catalog & Content Management**<br>Home models, architectural collections, downloadable floor plan kits, blogs/guides, FAQs, customer reviews, and media library. | ✅ Verified | [/admin/products](file:///src/app/admin/products/page.tsx), [/admin/collections](file:///src/app/admin/collections/page.tsx), [/admin/floor-plans](file:///src/app/admin/floor-plans/page.tsx), [/admin/blogs](file:///src/app/admin/blogs/page.tsx), [/admin/faqs](file:///src/app/admin/faqs/page.tsx), [/admin/reviews](file:///src/app/admin/reviews/page.tsx), [/admin/media](file:///src/app/admin/media/page.tsx) |
| **7** | **Inbound Leads & Quotation Operations**<br>Lead intake CRM with contact details, notes, assignment, follow-up dates, quote calculation inspections, and cost adjustments. | ✅ Verified | [/admin/leads](file:///src/app/admin/leads/page.tsx), [/admin/quotations](file:///src/app/admin/quotations/page.tsx), [/admin/pricing](file:///src/app/admin/pricing/page.tsx), [/admin/customers](file:///src/app/admin/customers/page.tsx), [/admin/orders](file:///src/app/admin/orders/page.tsx) |
| **8** | **Live-Site Data Consistency**<br>Every admin modification persists to PostgreSQL/Supabase and local fallback stores, updating public-facing routes seamlessly. | ✅ Verified | [publicData.ts](file:///src/lib/publicData.ts), [page.tsx](file:///src/app/page.tsx), [buildings](file:///src/app/buildings/page.tsx), [models/[slug]](file:///src/app/models/[slug]/page.tsx) |

---

## 🔐 Administrative Access & Credentials

- **Admin Login URL:** `/admin/login`
- **Default Master Admin Email:** `admin@modularhome.com`
- **Default Master Password:** Configurable via `ADMIN_DEFAULT_PASSWORD` (default: `admin@26`)
- **Session Duration:** 1 hour strict inactivity timeout with live countdown pill and 2-minute renewal warning banner.

---

## 🛠️ Architecture & Module Map

### 1. Catalog & Architectural Models
- **Home Models (`/admin/products`):** Full CRUD for 3D renderings, specs, dimensions, base price, floor plans, and variants.
- **Collections & Series (`/admin/collections`):** Organize homes into architectural categories (Cabins, Barndominiums, Tiny Homes, Multi-Family).
- **Floor Plan Kits (`/admin/floor-plans`):** Architectural blueprint packages, CAD/PDF attachments, square footage, and room counts.

### 2. Marketing & CMS
- **Pages Manager (`/admin/pages`):** Manage dynamic standalone pages with custom URLs, schema markup, and OpenGraph images.
- **Section Blocks (`/admin/sections`):** Reorder and toggle visibility of homepage and landing page hero banners, trust badges, and CTA blocks.
- **Articles & Resources (`/admin/blogs`):** Technical construction guides and news articles with rich formatting and SEO controls.
- **YouTube Auto-Sync (`/admin/videos`):** Video tours and model walkthrough syndication.

### 3. Sales & Customer Pipeline
- **Inbound Leads (`/admin/leads`):** Intake from contact forms, floor plan uploads, and AI chat.
- **Quote Wizard Pipeline (`/admin/quotations`):** Instant cost calculator submissions, sqft estimations, and price reviews.
- **Pricing Engine (`/admin/pricing`):** Configure base price per sqft, multi-story multipliers, and delivery zones.

### 4. Security & Administration
- **User Roles (`/admin/users`):** `SUPER_ADMIN`, `SALES`, `CONTENT_ADMIN`.
- **Security & 2FA (`/admin/security`):** RFC 6238 TOTP enrollment with single-use emergency recovery codes.
- **Audit Logs (`/admin/logs`):** Granular record of every administrative action, IP address, and payload.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run database migration and seed scripts
npm run seed:admin
npm run seed:floor-plans

# 3. Start development server
npm run dev

# 4. Production build validation
npm run build
```