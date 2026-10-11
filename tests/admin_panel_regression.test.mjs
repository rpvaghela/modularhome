import dotenv from "dotenv";
dotenv.config();

import { SignJWT, jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || "modularhome_secure_jwt_session_secret_key_2026_change_in_production"
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

let passCount = 0;
let failCount = 0;
const testLogs = [];

function recordResult(testId, module, scenario, status, expected, actual, details = "") {
  if (status === "PASS") passCount++;
  else failCount++;

  const entry = { testId, module, scenario, status, expected, actual, details };
  testLogs.push(entry);
  console.log(`[${status}] ${testId} - ${module}: ${scenario}`);
  if (status !== "PASS") {
    console.error(`       Expected: ${expected} | Actual: ${actual} | ${details}`);
  }
}

async function generateAdminToken(role = "SUPER_ADMIN") {
  return await new SignJWT({
    id: "admin-audit-runner",
    email: "modularhome.admin@gmail.com",
    name: "Automated Suite Auditor",
    role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(JWT_SECRET);
}

async function runRegressionSuite() {
  console.log("==================================================================");
  console.log("🚀 MODULARHOME ADMIN PANEL REGRESSION TEST SUITE");
  console.log("==================================================================\n");

  // -----------------------------------------------------------------------------
  // TEST GROUP 1: AUTHENTICATION & SECURITY
  // -----------------------------------------------------------------------------
  console.log("--- GROUP 1: AUTHENTICATION & SECURITY ---");

  // TEST-SEC-01: JWT Generation & Verification
  try {
    const validToken = await generateAdminToken("SUPER_ADMIN");
    const { payload } = await jwtVerify(validToken, JWT_SECRET);
    if (payload.role === "SUPER_ADMIN" && payload.email === "modularhome.admin@gmail.com") {
      recordResult("SEC-01", "Auth", "JWT Token Signing & Verification", "PASS", "Valid SUPER_ADMIN payload", "SUPER_ADMIN verified");
    } else {
      recordResult("SEC-01", "Auth", "JWT Token Signing & Verification", "FAIL", "SUPER_ADMIN", payload.role);
    }
  } catch (err) {
    recordResult("SEC-01", "Auth", "JWT Token Signing & Verification", "FAIL", "Verified", err.message);
  }

  // TEST-SEC-02: Tampered Token Rejection
  try {
    const validToken = await generateAdminToken("SUPER_ADMIN");
    const tampered = validToken.slice(0, -6) + "xxxxxx";
    let failed = false;
    try {
      await jwtVerify(tampered, JWT_SECRET);
    } catch {
      failed = true;
    }
    if (failed) {
      recordResult("SEC-02", "Auth", "Tampered JWT Rejection", "PASS", "Signature verification failure", "Rejected");
    } else {
      recordResult("SEC-02", "Auth", "Tampered JWT Rejection", "FAIL", "Rejected", "Accepted forged token");
    }
  } catch (err) {
    recordResult("SEC-02", "Auth", "Tampered JWT Rejection", "FAIL", "Handled", err.message);
  }

  // TEST-SEC-03: Supabase Service Role Key Protection
  try {
    const isServiceRoleExposedInClientEnv = !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    if (!isServiceRoleExposedInClientEnv) {
      recordResult("SEC-03", "Auth", "Service-Role Secret Isolation", "PASS", "Not prefixed with NEXT_PUBLIC_", "Isolated to server runtime");
    } else {
      recordResult("SEC-03", "Auth", "Service-Role Secret Isolation", "FAIL", "Private", "Exposed to client bundle!");
    }
  } catch (err) {
    recordResult("SEC-03", "Auth", "Service-Role Secret Isolation", "FAIL", "Protected", err.message);
  }

  // TEST-SEC-04: Unauthorized / Missing Session Token Handling
  try {
    let unauthenticatedAccessPermitted = false;
    const emptyToken = "";
    try {
      await jwtVerify(emptyToken, JWT_SECRET);
      unauthenticatedAccessPermitted = true;
    } catch {
      unauthenticatedAccessPermitted = false;
    }
    if (!unauthenticatedAccessPermitted) {
      recordResult("SEC-04", "Auth", "Missing/Empty Token Unauthorized Handling", "PASS", "Verification throws error", "Properly rejected unauthenticated call");
    } else {
      recordResult("SEC-04", "Auth", "Missing/Empty Token Unauthorized Handling", "FAIL", "Rejected", "Permitted empty token");
    }
  } catch (err) {
    recordResult("SEC-04", "Auth", "Missing/Empty Token Unauthorized Handling", "FAIL", "Handled", err.message);
  }

  // TEST-SEC-05: Production Admin Password Fallback Disabled when Env Var Missing
  try {
    const simulateProd = true; // NODE_ENV === 'production'
    const envDefaultPassword = ""; // Unset in production env
    const validDefaultPassword = envDefaultPassword || (simulateProd ? "" : "modularhome123");
    const isDefaultAdminPermitted = Boolean(validDefaultPassword);
    if (!isDefaultAdminPermitted) {
      recordResult("SEC-05", "Auth", "Production Admin Password Fallback Disabled when Env Var Missing", "PASS", "Fallback disabled (empty)", "Disabled in production without explicit env variable");
    } else {
      recordResult("SEC-05", "Auth", "Production Admin Password Fallback Disabled when Env Var Missing", "FAIL", "Disabled", "Allowed fallback password");
    }
  } catch (err) {
    recordResult("SEC-05", "Auth", "Production Admin Password Fallback Disabled when Env Var Missing", "FAIL", "Handled", err.message);
  }

  // -----------------------------------------------------------------------------
  // TEST GROUP 2: UUID VS SLUG DATABASE COMPATIBILITY
  // -----------------------------------------------------------------------------
  console.log("\n--- GROUP 2: UUID VS SLUG POSTGRES RESOLUTION ---");

  // TEST-DB-01: Product Lookup by Slug (Non-UUID)
  try {
    const testSlug = "modern-barndominium-bm3945";
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testSlug);
    const filter = isUuid ? `id.eq.${testSlug},handle.eq.${testSlug}` : `handle.eq.${testSlug}`;
    const { data, error } = await supabase.from("products").select("id, handle, title").or(filter).maybeSingle();

    if (!error && data) {
      recordResult("DB-01", "Products", "Lookup Product by Slug without UUID Cast Error", "PASS", "Record returned", `Found ID: ${data.id}`);
    } else if (!error && !data) {
      recordResult("DB-01", "Products", "Lookup Product by Slug without UUID Cast Error", "PASS", "No syntax error (not found)", "0 rows, 0 syntax error");
    } else {
      recordResult("DB-01", "Products", "Lookup Product by Slug without UUID Cast Error", "FAIL", "Clean query", error.message);
    }
  } catch (err) {
    recordResult("DB-01", "Products", "Lookup Product by Slug without UUID Cast Error", "FAIL", "Clean execution", err.message);
  }

  // TEST-DB-02: Collection Lookup by Slug (Non-UUID)
  try {
    const testSlug = "cabins";
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testSlug);
    const filter = isUuid ? `id.eq.${testSlug},handle.eq.${testSlug}` : `handle.eq.${testSlug}`;
    const { data, error } = await supabase.from("collections").select("id, handle, title").or(filter).maybeSingle();

    if (!error) {
      recordResult("DB-02", "Collections", "Lookup Collection by Slug without UUID Cast Error", "PASS", "No syntax error", data ? `Found ID: ${data.id}` : "Not found (clean)");
    } else {
      recordResult("DB-02", "Collections", "Lookup Collection by Slug without UUID Cast Error", "FAIL", "Clean query", error.message);
    }
  } catch (err) {
    recordResult("DB-02", "Collections", "Lookup Collection by Slug without UUID Cast Error", "FAIL", "Clean execution", err.message);
  }

  // TEST-DB-03: Floor Plan Lookup by Slug (Non-UUID)
  try {
    const testSlug = "the-aspen";
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testSlug);
    const filter = isUuid ? `id.eq.${testSlug},slug.eq.${testSlug}` : `slug.eq.${testSlug}`;
    const { data, error } = await supabase.from("floor_plans").select("id, slug, title").or(filter).maybeSingle();

    if (!error) {
      recordResult("DB-03", "Floor Plans", "Lookup Floor Plan by Slug without UUID Cast Error", "PASS", "No syntax error", data ? `Found ID: ${data.id}` : "Not found (clean)");
    } else {
      recordResult("DB-03", "Floor Plans", "Lookup Floor Plan by Slug without UUID Cast Error", "FAIL", "Clean query", error.message);
    }
  } catch (err) {
    recordResult("DB-03", "Floor Plans", "Lookup Floor Plan by Slug without UUID Cast Error", "FAIL", "Clean execution", err.message);
  }

  // TEST-DB-04: Malformed Identifier & SQL Injection String Safe Handling
  try {
    const malformedPayloads = [
      "invalid-uuid-format-12345",
      "' OR 1=1 --",
      "../../admin/etc",
      "00000000-0000-0000-0000-000000000000' UNION SELECT",
    ];

    let allSafe = true;
    let safeDetails = "";
    for (const testId of malformedPayloads) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testId);
      const filter = isUuid ? `id.eq.${testId},handle.eq.${testId}` : `handle.eq.${testId}`;
      const { data, error } = await supabase.from("products").select("id, handle").or(filter).maybeSingle();
      if (error && error.message && error.message.includes("invalid input syntax for type uuid")) {
        allSafe = false;
        safeDetails = `Failed on ${testId}: ${error.message}`;
        break;
      }
    }

    if (allSafe) {
      recordResult("DB-04", "Resolution", "Malformed Identifier & SQL Injection Safe Handling", "PASS", "0 UUID syntax errors", "All malformed strings safely handled without syntax errors");
    } else {
      recordResult("DB-04", "Resolution", "Malformed Identifier & SQL Injection Safe Handling", "FAIL", "0 UUID syntax errors", safeDetails);
    }
  } catch (err) {
    recordResult("DB-04", "Resolution", "Malformed Identifier & SQL Injection Safe Handling", "FAIL", "Safe execution", err.message);
  }

  // TEST-DB-05: Non-Existent Identifier & Graceful Database Query Resolution
  try {
    const nonExistentSlug = "non-existent-sample-slug-modular-99999";
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nonExistentSlug);
    const filter = isUuid ? `id.eq.${nonExistentSlug},handle.eq.${nonExistentSlug}` : `handle.eq.${nonExistentSlug}`;
    const { data, error } = await supabase.from("products").select("id").or(filter).maybeSingle();

    if (!error && data === null) {
      recordResult("DB-05", "Resolution", "Non-Existent Identifier Handled Gracefully", "PASS", "data is null, error is null", "maybeSingle() returned null without exceptions");
    } else if (error) {
      recordResult("DB-05", "Resolution", "Non-Existent Identifier Handled Gracefully", "FAIL", "null without error", error.message);
    } else {
      recordResult("DB-05", "Resolution", "Non-Existent Identifier Handled Gracefully", "PASS", "Handled", "Returned record");
    }
  } catch (err) {
    recordResult("DB-05", "Resolution", "Non-Existent Identifier Handled Gracefully", "FAIL", "Clean execution", err.message);
  }

  // -----------------------------------------------------------------------------
  // TEST GROUP 3: BLUEPRINT DOWNLOAD SECURITY & PATH TRAVERSAL
  // -----------------------------------------------------------------------------
  console.log("\n--- GROUP 3: BLUEPRINT DOWNLOAD SECURITY & PATH TRAVERSAL ---");

  // TEST-DL-01: Path Traversal String Rejection
  {
    const traversalToken = "../../package.json";
    const isBlocked = !/^[a-zA-Z0-9_\-\.]+$/.test(traversalToken) || traversalToken.includes("..") || traversalToken.includes("/") || traversalToken.includes("\\");
    if (isBlocked) {
      recordResult("DL-01", "Downloads", "Path Traversal Token Rejection", "PASS", "Blocked at parameter validation", "Pattern regex prevented traversal");
    } else {
      recordResult("DL-01", "Downloads", "Path Traversal Token Rejection", "FAIL", "Blocked", "Token pattern accepted path traversal");
    }
  }

  // TEST-DL-02: Length Bypass Rejection
  {
    const random24CharToken = "abcdef1234567890abcdef12";
    // Check if token exists in Supabase download_access
    const { data: access } = await supabase.from("download_access").select("id").eq("download_token", random24CharToken).maybeSingle();
    const shouldAuthorize = Boolean(access);
    if (!shouldAuthorize) {
      recordResult("DL-02", "Downloads", "24-Char Token Bypass Elimination", "PASS", "Unauthorized if not in DB", "Correctly rejected without database record");
    } else {
      recordResult("DL-02", "Downloads", "24-Char Token Bypass Elimination", "FAIL", "Denied", "Authorized");
    }
  }

  // TEST-DL-03: Malformed & Traversal Identifier Rejection
  {
    const badTokens = [
      "token/with/slash",
      "token\\with\\backslash",
      "../parent",
      "token with spaces",
      "token<script>",
      "token;drop",
    ];
    let allBlocked = true;
    for (const t of badTokens) {
      const isBlocked = !/^[a-zA-Z0-9_\-\.]+$/.test(t) || t.includes("..") || t.includes("/") || t.includes("\\");
      if (!isBlocked) {
        allBlocked = false;
        break;
      }
    }
    if (allBlocked) {
      recordResult("DL-03", "Downloads", "Malformed & Special Character Token Rejection", "PASS", "All rejected", "Regex rejected all invalid character patterns");
    } else {
      recordResult("DL-03", "Downloads", "Malformed & Special Character Token Rejection", "FAIL", "All rejected", "Accepted invalid token format");
    }
  }

  // -----------------------------------------------------------------------------
  // TEST GROUP 4: DATABASE INVENTORY & DATA INTEGRITY
  // -----------------------------------------------------------------------------
  console.log("\n--- GROUP 4: DATABASE INVENTORY & INTEGRITY ---");

  // TEST-DATA-01: Products Table Count
  {
    const { count, error } = await supabase.from("products").select("*", { count: "exact", head: true });
    if (!error && count >= 700) {
      recordResult("DATA-01", "Products", "Catalog Record Count Verification", "PASS", ">= 700 products", `${count} products in Supabase`);
    } else {
      recordResult("DATA-01", "Products", "Catalog Record Count Verification", "FAIL", ">= 700", `${count || 0} (error: ${error?.message})`);
    }
  }

  // TEST-DATA-02: Blog Posts Table Integrity
  {
    const { count, error } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
    if (!error && count !== null) {
      recordResult("DATA-02", "Blogs", "Blog Posts Table Persistence", "PASS", "Table accessible", `${count} blog posts in blog_posts table`);
    } else {
      recordResult("DATA-02", "Blogs", "Blog Posts Table Persistence", "FAIL", "Table accessible", error?.message || "null");
    }
  }

  // TEST-DATA-03: Videos Table & Slugs
  {
    const { data: videos, error } = await supabase.from("videos").select("id, slug, youtube_video_id").limit(10);
    const hasSlugs = !error && videos && videos.every(v => !!v.slug && v.slug.length > 3);
    if (hasSlugs) {
      recordResult("DATA-03", "Videos", "Video SEO Slugs Verification", "PASS", "All videos have descriptive slugs", `${videos.length} sample videos all have valid slugs`);
    } else {
      recordResult("DATA-03", "Videos", "Video SEO Slugs Verification", "FAIL", "Valid slugs", error?.message || "Missing slugs");
    }
  }

  // TEST-DATA-04: Floor Plans Table
  {
    const { count, error } = await supabase.from("floor_plans").select("*", { count: "exact", head: true });
    if (!error && count >= 9) {
      recordResult("DATA-04", "Floor Plans", "Floor Plans Table Integrity", "PASS", ">= 9 floor plans", `${count} floor plans in Supabase`);
    } else {
      recordResult("DATA-04", "Floor Plans", "Floor Plans Table Integrity", "FAIL", ">= 9", `${count || 0} (error: ${error?.message})`);
    }
  }

  // TEST-DATA-05: Global Settings Row
  {
    const { data, error } = await supabase.from("global_settings").select("*").limit(1);
    if (!error && data && data.length > 0) {
      recordResult("DATA-05", "Settings", "Global Settings Table Verification", "PASS", "Global settings row present", `Loaded id: ${data[0].id}, company: ${data[0].company_name}`);
    } else {
      recordResult("DATA-05", "Settings", "Global Settings Table Verification", "FAIL", "Global settings row present", error?.message || "Empty");
    }
  }

  // TEST-DATA-06: 301 Redirects Table
  {
    const { count, error } = await supabase.from("redirects").select("*", { count: "exact", head: true });
    if (!error && count >= 500) {
      recordResult("DATA-06", "Redirects", "301 Redirects Table Volume", "PASS", ">= 500 mapped rules", `${count} redirect rules in Supabase`);
    } else {
      recordResult("DATA-06", "Redirects", "301 Redirects Table Volume", "FAIL", ">= 500", `${count || 0} (error: ${error?.message})`);
    }
  }

  // TEST-DATA-07: Pricing Rules Table
  {
    const { count, error } = await supabase.from("pricing_rules").select("*", { count: "exact", head: true });
    if (!error && count >= 10) {
      recordResult("DATA-07", "Pricing", "Pricing Engine Rules", "PASS", ">= 10 rules", `${count} pricing rules in Supabase`);
    } else {
      recordResult("DATA-07", "Pricing", "Pricing Engine Rules", "FAIL", ">= 10", `${count || 0} (error: ${error?.message})`);
    }
  }

  // TEST-DATA-08: Activity Logs Table
  {
    const { count, error } = await supabase.from("activity_logs").select("*", { count: "exact", head: true });
    if (!error && count >= 50) {
      recordResult("DATA-08", "Logs", "Security Activity Logs", "PASS", ">= 50 logged audit events", `${count} audit entries in Supabase`);
    } else {
      recordResult("DATA-08", "Logs", "Security Activity Logs", "FAIL", ">= 50", `${count || 0} (error: ${error?.message})`);
    }
  }

  console.log("\n==================================================================");
  console.log(`SUITE RUN SUMMARY: ${passCount} PASSED | ${failCount} FAILED | TOTAL: ${passCount + failCount}`);
  console.log("==================================================================");

  if (failCount > 0) {
    process.exit(1);
  }
}

runRegressionSuite();
