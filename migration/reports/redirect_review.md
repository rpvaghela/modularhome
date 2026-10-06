# External Redirect Audit & Partner URL Review

## Executive Summary
During the comprehensive Shopify migration audit, three external cross-domain vanity redirects were identified in the legacy Shopify redirect table. All three redirects target `amishbuiltcabins.com` with active Social Snowball affiliate tracking parameters (`?sca_ref=...`).

---

## 1. Inventory of External Cross-Domain Redirects

| Source Path | Redirect Target | Status Code | Redirect Type | Classification |
|---|---|---|---|---|
| `/aflaki` | `https://amishbuiltcabins.com/?sca_ref=8377721.3EkXqHA1OPtz` | 301 Moved Permanently | External Partner Referral | Affiliate Campaign |
| `/osi` | `https://amishbuiltcabins.com/?sca_ref=8377703.SD6uoGR5Al7pZjX0` | 301 Moved Permanently | External Partner Referral | Affiliate Campaign |
| `/zahid` | `https://amishbuiltcabins.com/?sca_ref=8377958.xSqbXrXCd5` | 301 Moved Permanently | External Partner Referral | Affiliate Campaign |

---

## 2. Technical & SEO Findings

### A. Origin & Purpose
- **Source**: Directly recorded in Shopify's native URL Redirects export (`shopify_redirects.json` / Matrixify export).
- **Function**: Vanity short links designed for individual sales reps or affiliate partners (`aflaki`, `osi`, `zahid`) to distribute in offline collateral, social posts, or partner networks.
- **Tracking Mechanism**: The query string parameter `sca_ref` is the standard parameter used by the Social Snowball / UpPromote affiliate tracking application on Shopify.

### B. SEO & Backlink Evaluation
- **Search Equity**: These vanity paths are not standard navigational or category URLs and do not carry high-volume organic search equity.
- **External Links**: They may be linked from partner social channels, YouTube video descriptions, or business cards.
- **Destination Verification**: Tested against the live web; `https://amishbuiltcabins.com` resolves successfully with HTTP 200.

---

## 3. Risk Assessment & Recommendations

| Option | Pros | Cons | Recommendation Status |
|---|---|---|---|
| **Option A (Preserve 301)** | Maintains zero link breakage for partners and external referrals. | Directs potential ModularHome traffic to external sister site. | **CURRENT DEFAULT (Active)** |
| **Option B (Internal ModularHome Redirect)** | Captures all partner traffic directly onto ModularHome.com floor plan or quote calculator. | Requires re-assigning affiliate attribution logic within ModularHome. | **REQUIRES HUMAN APPROVAL** |
| **Option C (Retire / 404)** | Removes legacy third-party coupling. | Causes 404 errors for anyone clicking existing partner links. | **NOT RECOMMENDED** |

> [!IMPORTANT]
> **Human Review Gate**: These redirects are currently active and functioning via 1-hop 301 redirects in Next.js middleware. Business stakeholders should review whether to continue routing partner traffic to AmishBuiltCabins or transition partner attribution to ModularHome.com internal landing pages.
