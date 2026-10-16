import http from 'http';
import { SignJWT } from 'jose';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || "modularhome_secure_jwt_session_secret_key_2026_change_in_production"
);

async function getAdminToken() {
  return await new SignJWT({
    id: "admin-audit-runner",
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
    const defaultHeaders = {
      'Host': 'localhost:3000',
    };
    const reqOptions = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: options.method || 'GET',
      headers: { ...defaultHeaders, ...(options.headers || {}) },
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          location: res.headers.location,
          body,
          json
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout on ${path}`));
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runComprehensiveAudit() {
  console.log("===============================================================================");
  console.log("  COMPREHENSIVE BIDIRECTIONAL CONNECTION AUDIT: ADMIN <---> MAIN WEBSITE");
  console.log("===============================================================================\n");

  const token = await getAdminToken();
  const authHeaders = {
    Cookie: `admin_session=${token}`,
    "Content-Type": "application/json"
  };

  const auditReport = {
    mainToAdmin: [],
    adminToMain: [],
    securityAndAuth: [],
    summary: { passed: 0, failed: 0 }
  };

  function record(category, testName, passed, details) {
    const item = { testName, passed, details };
    auditReport[category].push(item);
    if (passed) {
      auditReport.summary.passed++;
      console.log(`✅ [PASS] ${testName}`);
    } else {
      auditReport.summary.failed++;
      console.log(`❌ [FAIL] ${testName}`);
    }
    if (details) {
      console.log(`       Details: ${details}`);
    }
  }

  // -------------------------------------------------------------------------
  // 1. SECURITY & ACCESS CONTROL
  // -------------------------------------------------------------------------
  console.log("\n--- SECTION 1: SECURITY, AUTHENTICATION & ACCESS CONTROL ---");

  // 1.1 Unauthenticated access to /admin UI should redirect to /admin/login
  const unauthAdminUI = await request('/admin', { method: 'GET' });
  const isRedirect = unauthAdminUI.statusCode === 301 || unauthAdminUI.statusCode === 302 || unauthAdminUI.statusCode === 307;
  const redirectsToLogin = (unauthAdminUI.location || '').includes('/admin/login');
  record(
    'securityAndAuth',
    'Unauthenticated /admin Access Protection',
    isRedirect && redirectsToLogin,
    `HTTP ${unauthAdminUI.statusCode} -> Location: ${unauthAdminUI.location}`
  );

  // 1.2 Unauthenticated access to /api/admin/products should return 401 Unauthorized
  const unauthAdminApi = await request('/api/admin/products', { method: 'GET' });
  record(
    'securityAndAuth',
    'Unauthenticated /api/admin/* API Route Guard',
    unauthAdminApi.statusCode === 401,
    `HTTP ${unauthAdminApi.statusCode} (Expected 401, error: ${unauthAdminApi.json?.error?.message || 'Unauthorized'})`
  );

  // 1.3 Authenticated access with valid admin_session to /api/admin/auth/me
  const authMe = await request('/api/admin/auth/me', { method: 'GET', headers: authHeaders });
  record(
    'securityAndAuth',
    'Admin Token Verification (/api/admin/auth/me)',
    authMe.statusCode === 200 && authMe.json?.success === true,
    `HTTP ${authMe.statusCode}, user: ${authMe.json?.user?.email || 'N/A'}, role: ${authMe.json?.user?.role || 'N/A'}`
  );

  // -------------------------------------------------------------------------
  // 2. MAIN WEBSITE ---> ADMIN PANEL DATA FLOW
  // -------------------------------------------------------------------------
  console.log("\n--- SECTION 2: MAIN WEBSITE ---> ADMIN PANEL DATA FLOW ---");

  // 2.1 Inbound Lead Submission from Main Website (Contact Form)
  const testLeadTimestamp = Date.now();
  const testLeadEmail = `lead.audit.${testLeadTimestamp}@modularhome-test.com`;
  const leadPayload = {
    name: "Auditor Lead Test",
    email: testLeadEmail,
    phone: "+1-800-555-0199",
    city: "Indianapolis",
    zip: "46201",
    projectType: "Modular Homes",
    budget: "$150,000 - $250,000",
    enquiryDetails: "Bidirectional automated connection verification probe.",
    source: "AUDIT_TEST"
  };

  const leadSubmitRes = await request('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: leadPayload
  });

  const leadSubmittedOk = leadSubmitRes.statusCode === 200 && leadSubmitRes.json?.success === true;
  record(
    'mainToAdmin',
    'Main Website Lead Submission (POST /api/leads)',
    leadSubmittedOk,
    `HTTP ${leadSubmitRes.statusCode}, leadId: ${leadSubmitRes.json?.data?.id || 'none'}`
  );

  // 2.2 Verify Lead Immediately Visible in Admin Panel (/api/admin/leads)
  let leadFoundInAdmin = false;
  if (leadSubmittedOk) {
    const adminLeadsRes = await request('/api/admin/leads', { method: 'GET', headers: authHeaders });
    const allLeads = adminLeadsRes.json?.data || [];
    leadFoundInAdmin = allLeads.some(l => l.email === testLeadEmail);
    record(
      'mainToAdmin',
      'Inbound Lead Visibility in Admin Panel (/api/admin/leads)',
      leadFoundInAdmin,
      `Found: ${leadFoundInAdmin ? 'YES' : 'NO'} across ${allLeads.length} total admin leads`
    );
  }

  // 2.3 Quotation Wizard Submission from Main Website (/api/quotations)
  const testQuoteEmail = `quote.audit.${testLeadTimestamp}@modularhome-test.com`;
  const quotePayload = {
    customerName: "Auditor Quoter Test",
    customerEmail: testQuoteEmail,
    customerPhone: "+1-800-555-0144",
    customerZip: "46201",
    modelSlug: "the-farmhouse-charm-new-model",
    modelName: "The Farmhouse Charm",
    sqft: 1850,
    finishLevel: "PREMIUM",
    source: "QUOTE_WIZARD"
  };

  const quoteSubmitRes = await request('/api/quotations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: quotePayload
  });

  const quoteSubmittedOk = quoteSubmitRes.statusCode === 200 && quoteSubmitRes.json?.success === true;
  record(
    'mainToAdmin',
    'Main Website Quote Wizard Submission (POST /api/quotations)',
    quoteSubmittedOk,
    `HTTP ${quoteSubmitRes.statusCode}, quoteId: ${quoteSubmitRes.json?.data?.id || 'none'}, estimatedAmount: $${quoteSubmitRes.json?.data?.estimated_amount || 0}`
  );

  // 2.4 Verify Quotation Immediately Visible in Admin (/api/admin/quotations)
  let quoteFoundInAdmin = false;
  if (quoteSubmittedOk) {
    const adminQuotesRes = await request('/api/admin/quotations', { method: 'GET', headers: authHeaders });
    const allQuotes = adminQuotesRes.json?.data || [];
    quoteFoundInAdmin = allQuotes.some(q => q.customer_email === testQuoteEmail || q.id === quoteSubmitRes.json?.data?.id);
    record(
      'mainToAdmin',
      'Inbound Quote Visibility in Admin Panel (/api/admin/quotations)',
      quoteFoundInAdmin,
      `Found: ${quoteFoundInAdmin ? 'YES' : 'NO'} across ${allQuotes.length} total quotations`
    );
  }

  // 2.5 Blueprint / Customer Orders in Admin Panel
  const adminOrdersRes = await request('/api/admin/orders', { method: 'GET', headers: authHeaders });
  record(
    'mainToAdmin',
    'Customer Blueprint Orders Flow (/api/admin/orders)',
    adminOrdersRes.statusCode === 200,
    `HTTP ${adminOrdersRes.statusCode}, ${adminOrdersRes.json?.data?.length || 0} active orders tracked`
  );

  // 2.6 Customer CRM Synchronization (/api/admin/customers)
  const adminCustRes = await request('/api/admin/customers', { method: 'GET', headers: authHeaders });
  record(
    'mainToAdmin',
    'Customer CRM Directory Synchronization (/api/admin/customers)',
    adminCustRes.statusCode === 200 && adminCustRes.json?.success === true,
    `HTTP ${adminCustRes.statusCode}, Total customers: ${adminCustRes.json?.totalCount ?? 0}`
  );

  // -------------------------------------------------------------------------
  // 3. ADMIN PANEL ---> MAIN WEBSITE DATA FLOW
  // -------------------------------------------------------------------------
  console.log("\n--- SECTION 3: ADMIN PANEL ---> MAIN WEBSITE DATA FLOW ---");

  // 3.1 Products / Home Models Sync (Admin -> Public)
  const adminProdRes = await request('/api/admin/products', { method: 'GET', headers: authHeaders });
  const publicProdRes = await request('/api/products', { method: 'GET' });
  const adminProdCount = adminProdRes.json?.data?.length || 0;
  const publicProdCount = publicProdRes.json?.count || publicProdRes.json?.data?.length || 0;
  record(
    'adminToMain',
    'Home Models (Products) Catalog Synchronization',
    adminProdRes.statusCode === 200 && publicProdRes.statusCode === 200 && publicProdCount > 0,
    `Admin models: ${adminProdCount} | Public models: ${publicProdCount}`
  );

  // 3.2 Collections & Series Sync (Admin -> Public)
  const adminColRes = await request('/api/admin/collections', { method: 'GET', headers: authHeaders });
  const publicColRes = await request('/api/collections', { method: 'GET' });
  const adminColCount = adminColRes.json?.data?.length || 0;
  const publicColCount = publicColRes.json?.data?.length || 0;
  record(
    'adminToMain',
    'Collections & Series Synchronization',
    adminColRes.statusCode === 200 && publicColRes.statusCode === 200 && publicColCount > 0,
    `Admin collections: ${adminColCount} | Public collections: ${publicColCount}`
  );

  // 3.3 Floor Plan Kits Sync (Admin -> Public)
  const adminFpRes = await request('/api/admin/floor-plans', { method: 'GET', headers: authHeaders });
  const publicFpRes = await request('/api/floor-plans', { method: 'GET' });
  const adminFpCount = adminFpRes.json?.data?.length || 0;
  const publicFpCount = publicFpRes.json?.data?.length || 0;
  record(
    'adminToMain',
    'Floor Plan Kits Synchronization',
    adminFpRes.statusCode === 200 && publicFpRes.statusCode === 200 && publicFpCount > 0,
    `Admin floor plans: ${adminFpCount} | Public floor plans: ${publicFpCount}`
  );

  // 3.4 Blog Articles Sync (Admin -> Public)
  const adminBlogRes = await request('/api/admin/blogs', { method: 'GET', headers: authHeaders });
  const publicBlogRes = await request('/api/blogs', { method: 'GET' });
  const adminBlogCount = adminBlogRes.json?.blogs?.length || adminBlogRes.json?.data?.length || 0;
  const publicBlogCount = publicBlogRes.json?.blogs?.length || publicBlogRes.json?.data?.length || 0;
  record(
    'adminToMain',
    'Blog Articles Synchronization',
    adminBlogRes.statusCode === 200 && publicBlogRes.statusCode === 200 && publicBlogCount > 0,
    `Admin articles: ${adminBlogCount} | Public articles: ${publicBlogCount}`
  );

  // 3.5 Video Walkthroughs Sync (Admin -> Public)
  const adminVidRes = await request('/api/admin/videos', { method: 'GET', headers: authHeaders });
  const publicVidRes = await request('/api/videos', { method: 'GET' });
  const adminVidCount = adminVidRes.json?.data?.length || 0;
  const publicVidCount = publicVidRes.json?.data?.length || 0;
  record(
    'adminToMain',
    'Video Walkthroughs & YouTube Sync',
    adminVidRes.statusCode === 200 && publicVidRes.statusCode === 200,
    `Admin videos: ${adminVidCount} | Public videos: ${publicVidCount}`
  );

  // 3.6 Global Settings Sync (Admin -> Public)
  const adminSettingsRes = await request('/api/admin/settings', { method: 'GET', headers: authHeaders });
  const publicSettingsRes = await request('/api/settings', { method: 'GET' });
  const adminCompanyName = adminSettingsRes.json?.data?.companyName || adminSettingsRes.json?.companyName;
  const publicCompanyName = publicSettingsRes.json?.data?.companyName || publicSettingsRes.json?.companyName;
  record(
    'adminToMain',
    'Global Store Settings Synchronization',
    adminSettingsRes.statusCode === 200 && publicSettingsRes.statusCode === 200 && Boolean(publicCompanyName),
    `Company: "${publicCompanyName}", Phone: "${publicSettingsRes.json?.data?.phone || 'N/A'}"`
  );

  // 3.7 Redirects Engine Execution on Main Website
  const redirectTestRes = await request('/catalog', { method: 'GET' });
  const redirectPassed = (redirectTestRes.statusCode === 301 || redirectTestRes.statusCode === 308) &&
                         (redirectTestRes.location === '/buildings' || redirectTestRes.location?.endsWith('/buildings'));
  record(
    'adminToMain',
    '301 Permanent Redirect Rule Execution (/catalog -> /buildings)',
    redirectPassed,
    `HTTP ${redirectTestRes.statusCode} -> Location: ${redirectTestRes.location}`
  );

  // 3.8 Admin UI "View Live Website" Link Verification
  const liveSiteRes = await request('/', { method: 'GET' });
  record(
    'adminToMain',
    'Admin Header "View Live Website" Destination (/ Homepage)',
    liveSiteRes.statusCode === 200,
    `HTTP ${liveSiteRes.statusCode}, Content length: ${liveSiteRes.body.length} bytes`
  );

  // 3.9 Admin Product Preview Link to Public Route
  const sampleProductRes = await request('/buildings/the-farmhouse-charm-new-model', { method: 'GET' });
  const productRedirectOr200 = sampleProductRes.statusCode === 200 || sampleProductRes.statusCode === 301;
  record(
    'adminToMain',
    'Admin Product Live Preview Link (/buildings/the-farmhouse-charm-new-model)',
    productRedirectOr200,
    `HTTP ${sampleProductRes.statusCode} (Redirect or 200 to canonical model page)`
  );

  // 3.10 Admin Blog Preview Link to Public Route
  const sampleBlogRes = await request('/blogs', { method: 'GET' });
  record(
    'adminToMain',
    'Admin Blog Live Route (/blogs)',
    sampleBlogRes.statusCode === 200,
    `HTTP ${sampleBlogRes.statusCode}, Content length: ${sampleBlogRes.body.length} bytes`
  );

  console.log("\n===============================================================================");
  console.log(`AUDIT RESULTS: ${auditReport.summary.passed} PASSED / ${auditReport.summary.failed} FAILED`);
  console.log("===============================================================================");

  return auditReport;
}

runComprehensiveAudit();
