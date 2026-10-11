import http from 'http';
import { SignJWT } from 'jose';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || "modularhome_secure_jwt_session_secret_key_2026_change_in_production"
);

async function getAdminToken() {
  return await new SignJWT({
    id: "admin-audit-user",
    email: "modularhome.admin@gmail.com",
    name: "System Auditor",
    role: "SUPER_ADMIN",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(JWT_SECRET);
}

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:3000${path}`, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          json
        });
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

const adminMenus = [
  { name: "Overview / Dashboard", api: "/api/admin/dashboard/stats", page: "/admin" },
  { name: "Home Models (Products)", api: "/api/admin/products", page: "/admin/products", publicCheck: "/api/products" },
  { name: "Collections & Series", api: "/api/admin/collections", page: "/admin/collections", publicCheck: "/api/collections" },
  { name: "Floor Plan Kits", api: "/api/admin/floor-plans", page: "/admin/floor-plans", publicCheck: "/api/floor-plans" },
  { name: "Blueprint Orders", api: "/api/admin/orders", page: "/admin/orders" },
  { name: "Customer CRM", api: "/api/admin/customers", page: "/admin/customers" },
  { name: "Inbound Leads", api: "/api/admin/leads", page: "/admin/leads" },
  { name: "Quote Wizard Pipeline", api: "/api/admin/quotations", page: "/admin/quotations" },
  { name: "Pricing Rules Engine", api: "/api/admin/pricing", page: "/admin/pricing" },
  { name: "Sales & Analytics", api: "/api/admin/analytics", page: "/admin/analytics" },
  { name: "Financial Reports", api: "/api/admin/reports/orders", page: "/admin/reports" },
  { name: "Page Manager (CMS)", api: "/api/admin/pages", page: "/admin/pages" },
  { name: "Section Blocks", api: "/api/admin/sections", page: "/admin/sections" },
  { name: "Reviews & Testimonials", api: "/api/admin/reviews", page: "/admin/reviews" },
  { name: "FAQs Manager", api: "/api/admin/faqs", page: "/admin/faqs" },
  { name: "301 Redirects", api: "/api/admin/redirects", page: "/admin/redirects" },
  { name: "Global Settings", api: "/api/admin/settings", page: "/admin/settings", publicCheck: "/api/settings" },
  { name: "Media Library", api: "/api/admin/media", page: "/admin/media" },
  { name: "Blogs & Articles", api: "/api/admin/blogs", page: "/admin/blogs", publicCheck: "/api/blogs" },
  { name: "YouTube Auto-Sync", api: "/api/admin/videos", page: "/admin/videos", publicCheck: "/api/videos" },
  { name: "Shopify Sync", api: "/api/admin/shopify/migrate", page: "/admin/shopify", method: "GET" },
  { name: "Admin Users & Roles", api: "/api/admin/users", page: "/admin/users" },
  { name: "Security & 2FA", api: "/api/admin/security", page: "/admin/security" },
  { name: "Activity Logs & Audits", api: "/api/admin/logs", page: "/admin/logs" },
];

async function runAudit() {
  console.log("=================================================");
  console.log("ADMIN PANEL TO MAIN WEBSITE CONNECTION AUDIT");
  console.log("=================================================\n");

  const token = await getAdminToken();
  const authHeaders = {
    Cookie: `admin_session=${token}`,
    "Content-Type": "application/json"
  };

  const results = [];

  for (const menu of adminMenus) {
    // 1. Test Admin Page UI route
    const pageRes = await request(menu.page, {
      method: "GET",
      headers: authHeaders
    });

    // 2. Test Admin Backend API route
    let apiRes = { statusCode: 0 };
    try {
      apiRes = await request(menu.api, {
        method: menu.method || "GET",
        headers: authHeaders
      });
    } catch (err) {
      apiRes = { statusCode: 500, error: err.message };
    }

    // 3. Test Public Website integration if applicable
    let publicRes = null;
    if (menu.publicCheck) {
      try {
        publicRes = await request(menu.publicCheck, { method: "GET" });
      } catch (err) {
        publicRes = { statusCode: 500, error: err.message };
      }
    }

    const pageOk = pageRes.statusCode === 200;
    const apiOk = apiRes.statusCode === 200 || apiRes.statusCode === 405; // 405 if GET not supported by endpoint
    const publicOk = publicRes ? publicRes.statusCode === 200 : true;

    const status = (pageOk && apiOk && publicOk) ? "PASS" : "WARN/FAIL";

    const dataCount = apiRes.json?.data
      ? (Array.isArray(apiRes.json.data) ? `${apiRes.json.data.length} items` : 'object')
      : (apiRes.json?.products ? `${apiRes.json.products.length} products` : (apiRes.json?.blogs ? `${apiRes.json.blogs.length} blogs` : (apiRes.json?.success ? 'success' : 'no items')));

    console.log(`[${status}] Menu: ${menu.name}`);
    console.log(`       Admin UI Page:  ${menu.page} -> HTTP ${pageRes.statusCode}`);
    console.log(`       Admin API:      ${menu.api} -> HTTP ${apiRes.statusCode} (${dataCount})`);
    if (menu.publicCheck) {
      console.log(`       Public Website: ${menu.publicCheck} -> HTTP ${publicRes?.statusCode}`);
    }
    console.log("");

    results.push({
      menu: menu.name,
      pageOk,
      apiOk,
      publicOk,
      pageStatus: pageRes.statusCode,
      apiStatus: apiRes.statusCode,
      publicStatus: publicRes?.statusCode
    });
  }

  const failed = results.filter(r => !r.pageOk || !r.apiOk || !r.publicOk);
  console.log("=================================================");
  console.log(`AUDIT COMPLETE: ${results.length - failed.length} / ${results.length} MENUS VERIFIED`);
  if (failed.length > 0) {
    console.log(`ATTENTION REQUIRED on ${failed.length} menus:`);
    failed.forEach(f => console.log(` - ${f.menu} (Page: ${f.pageStatus}, API: ${f.apiStatus}, Public: ${f.publicStatus})`));
  } else {
    console.log("ALL ADMIN PANEL MENUS PROPERLY CONNECTED!");
  }
}

runAudit();
