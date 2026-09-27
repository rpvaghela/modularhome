import * as dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function testAll() {
  console.log("=================================================");
  console.log("MODULARHOME ADMIN & API AUTOMATED QA SUITE");
  console.log("=================================================\n");

  const results: Array<{ test: string; status: "PASS" | "FAIL"; details: string }> = [];

  // 1. Test Admin Login and JWT token issuance
  let authCookie = "";
  try {
    const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.ADMIN_DEFAULT_EMAIL || "admin@modularhome.com",
        password: process.env.ADMIN_DEFAULT_PASSWORD || "admin@26",
      }),
    });

    const loginCookieHeader = loginRes.headers.get("set-cookie");
    if (loginCookieHeader) {
      const match = loginCookieHeader.match(/admin_session=([^;]+)/);
      if (match) authCookie = match[1];
    }

    const loginJson = await loginRes.json();
    if (loginJson.success && authCookie) {
      results.push({ test: "Admin Login & JWT Token Generation", status: "PASS", details: `User: ${loginJson.user.email} (${loginJson.user.role})` });
    } else {
      results.push({ test: "Admin Login & JWT Token Generation", status: "FAIL", details: JSON.stringify(loginJson) });
    }
  } catch (err: any) {
    results.push({ test: "Admin Login & JWT Token Generation", status: "FAIL", details: err.message });
  }

  const headers = {
    Cookie: `admin_session=${authCookie}`,
  };

  // Helper tester
  async function testRoute(name: string, path: string, validateFn: (json: any, rawRes: any) => { pass: boolean; info: string }) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, { headers });
      const json = await res.json();
      const check = validateFn(json, res);
      results.push({
        test: name,
        status: check.pass ? "PASS" : "FAIL",
        details: check.info,
      });
    } catch (err: any) {
      results.push({ test: name, status: "FAIL", details: err.message });
    }
  }

  // 2. Test /api/admin/auth/me
  await testRoute("Admin Profile (/api/admin/auth/me)", "/api/admin/auth/me", (j) => ({
    pass: j.success === true && !!j.user,
    info: j.user ? `Authenticated as ${j.user.email} (${j.user.role})` : j.error?.message || "Failed",
  }));

  // 3. Test /api/admin/dashboard/stats
  await testRoute("Dashboard Metrics (/api/admin/dashboard/stats)", "/api/admin/dashboard/stats", (j) => ({
    pass: j.success === true && j.data?.metrics?.totalProducts > 0,
    info: `Products: ${j.data?.metrics?.totalProducts}, Collections: ${j.data?.metrics?.totalCollections}, Blogs: ${j.data?.metrics?.publishedBlogs}`,
  }));

  // 4. Test /api/admin/products
  await testRoute("Home Models (/api/admin/products)", "/api/admin/products", (j) => ({
    pass: j.success === true && Array.isArray(j.data) && j.data.length > 0,
    info: `Loaded ${j.data?.length || 0} models. Sample: ${j.data?.[0]?.name} ($${j.data?.[0]?.startingPrice})`,
  }));

  // 5. Test /api/admin/collections
  await testRoute("Collections & Series (/api/admin/collections)", "/api/admin/collections", (j) => ({
    pass: j.success === true && Array.isArray(j.data) && j.data.length > 0,
    info: `Loaded ${j.data?.length || 0} collections: ${j.data?.slice(0, 3).map((c: any) => c.title).join(", ")}...`,
  }));

  // 6. Test /api/admin/floor-plans
  await testRoute("Floor Plan Kits (/api/admin/floor-plans)", "/api/admin/floor-plans", (j) => ({
    pass: j.success === true && Array.isArray(j.data) && j.data.length > 0,
    info: `Loaded ${j.data?.length || 0} floor plan architectural kits.`,
  }));

  // 7. Test /api/admin/blogs
  await testRoute("Articles & Guides CMS (/api/admin/blogs)", "/api/admin/blogs", (j) => ({
    pass: j.success === true && Array.isArray(j.data) && j.data.length > 0,
    info: `Loaded ${j.data?.length || 0} articles. Sample: ${j.data?.[0]?.title}`,
  }));

  // 8. Test /api/admin/customers
  await testRoute("Customer CRM (/api/admin/customers)", "/api/admin/customers", (j) => ({
    pass: j.success === true && Array.isArray(j.customers),
    info: `Loaded customer database with ${j.customers?.length || 0} customer records.`,
  }));

  // 9. Test /api/admin/analytics
  await testRoute("Sales & Analytics (/api/admin/analytics)", "/api/admin/analytics", (j) => ({
    pass: j.success === true && !!j.data,
    info: `Loaded conversion stats, traffic sources, and revenue metrics.`,
  }));

  // 10. Test /api/admin/pages
  await testRoute("CMS Pages (/api/admin/pages)", "/api/admin/pages", (j) => ({
    pass: j.success === true && Array.isArray(j.data),
    info: `Loaded ${j.data?.length || 0} CMS landing pages.`,
  }));

  // 11. Test /api/admin/logs
  await testRoute("Activity Logs (/api/admin/logs)", "/api/admin/logs", (j) => ({
    pass: j.success === true && Array.isArray(j.data),
    info: `Loaded ${j.data?.length || 0} audit log events.`,
  }));

  // 12. Test /api/admin/leads
  await testRoute("Inbound Leads (/api/admin/leads)", "/api/admin/leads", (j) => ({
    pass: j.success === true,
    info: `Loaded ${j.leads?.length || 0} leads pipeline.`,
  }));

  // 13. Test /api/admin/quotations
  await testRoute("Quote Submissions (/api/admin/quotations)", "/api/admin/quotations", (j) => ({
    pass: j.success === true && Array.isArray(j.data),
    info: `Loaded ${j.data?.length || 0} quote wizard submissions.`,
  }));

  // 14. Test /api/admin/orders
  await testRoute("Blueprint Orders (/api/admin/orders)", "/api/admin/orders", (j) => ({
    pass: j.success === true,
    info: `Loaded orders.`,
  }));

  // 15. Test /api/admin/settings
  await testRoute("Global Settings (/api/admin/settings)", "/api/admin/settings", (j) => ({
    pass: j.success === true && !!j.data,
    info: `Loaded SEO & global settings.`,
  }));

  // 16. Test Public Products (verify no junk / greeting cards exist)
  await testRoute("Public Products Catalog (/api/products)", "/api/products", (j) => {
    const list = j.data || [];
    const junk = list.filter((p: any) => {
      const t = ((p.name || "") + " " + (p.slug || "")).toLowerCase();
      return t.includes("greeting card") || t.includes("candle") || t.includes("jewelry") || Number(p.startingPrice) < 500;
    });
    return {
      pass: j.success === true && list.length > 0 && junk.length === 0,
      info: `Verified ${list.length} live modular homes. Junk/greeting cards found: ${junk.length}`,
    };
  });

  console.log("-------------------------------------------------");
  console.log("QA TEST RESULTS:");
  console.log("-------------------------------------------------");
  let allPassed = true;
  results.forEach((r, idx) => {
    const symbol = r.status === "PASS" ? "✓" : "✗";
    console.log(`${idx + 1}. [${r.status}] ${symbol} ${r.test}`);
    console.log(`   Details: ${r.details}`);
    if (r.status === "FAIL") allPassed = false;
  });

  console.log("\n=================================================");
  console.log(allPassed ? "🎉 ALL 16 QA TESTS PASSED WITH 100% SUCCESS!" : "❌ SOME QA TESTS FAILED");
  console.log("=================================================");
}

testAll();
