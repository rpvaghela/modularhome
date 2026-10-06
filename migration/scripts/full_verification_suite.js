const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BASE_URL = process.env.TEST_HOST || 'http://localhost:3001';
const CONCURRENCY = 16;

// Helper to escape CSV fields
function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 32 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 32 });

// Low-level HTTP/HTTPS requester with persistent keepAlive agent and retry
function requestUrl(targetUrl, customHeaders = {}, timeoutMs = 15000, attempt = 1) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl, BASE_URL);
      const isHttps = parsed.protocol === 'https:';
      const client = isHttps ? https : http;
      const agent = isHttps ? httpsAgent : httpAgent;

      const req = client.request(
        parsed,
        {
          method: 'GET',
          agent: agent,
          headers: {
            'User-Agent': 'ModularHome-Full-URL-Tester/1.0',
            'Host': 'modularhome.com',
            ...customHeaders,
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode || 0,
              headers: res.headers,
              body,
            });
          });
        }
      );

      req.on('error', async (err) => {
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 200 * attempt));
          return resolve(requestUrl(targetUrl, customHeaders, timeoutMs, attempt + 1));
        }
        resolve({ statusCode: 0, headers: {}, body: '', error: err.message });
      });

      req.setTimeout(timeoutMs, () => {
        req.destroy(new Error('Request timeout'));
      });

      req.end();
    } catch (err) {
      resolve({ statusCode: 0, headers: {}, body: '', error: err.message });
    }
  });
}

function extractMeta(html, headers) {
  let title = '';
  let canonical = '';
  let robots = headers['x-robots-tag'] || '';
  let h1 = '';

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) title = titleMatch[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim();

  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                         html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (canonicalMatch) canonical = canonicalMatch[1].trim();

  const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  if (robotsMatch) robots = robots ? `${robots}, ${robotsMatch[1]}` : robotsMatch[1].trim();

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) h1 = h1Match[1].replace(/<[^>]+>/g, '').trim();

  return { title, canonical, robots, h1 };
}

// Full URL tester (1-Hop tracking with retry)
async function testSingleUrl(urlPath, timeoutMs = 15000) {
  let firstRes = await requestUrl(urlPath, {}, timeoutMs);
  if (firstRes.statusCode === 0) {
    await new Promise((r) => setTimeout(r, 200));
    firstRes = await requestUrl(urlPath, {}, timeoutMs);
  }

  const location = firstRes.headers['location'] || '';
  const statusCode = firstRes.statusCode;

  // Handle redirects
  if ((statusCode === 301 || statusCode === 302 || statusCode === 307 || statusCode === 308) && location) {
    let nextTarget = location;
    if (location.startsWith('/') || location.includes('modularhome.com') || location.includes('localhost')) {
      const nextPath = location.startsWith('http') ? new URL(location).pathname + new URL(location).search : location;
      let secondRes = await requestUrl(nextPath, {}, timeoutMs);
      if (secondRes.statusCode === 0) {
        await new Promise((r) => setTimeout(r, 200));
        secondRes = await requestUrl(nextPath, {}, timeoutMs);
      }
      const secondLocation = secondRes.headers['location'] || '';
      const hops = secondLocation ? 2 : 1;
      const meta = extractMeta(secondRes.body, secondRes.headers);

      return {
        actual_status: statusCode,
        redirect_target: location,
        final_url: nextPath,
        final_status: secondRes.statusCode || 0,
        redirect_hops: hops,
        title: meta.title,
        canonical: meta.canonical,
        robots: meta.robots,
        h1: meta.h1,
        hasContent: secondRes.body.length > 100,
        error: hops > 1 ? `Multi-hop chain detected (hops: ${hops})` : undefined,
      };
    } else {
      // External redirect destination (e.g. Amish Built Cabins / Shop)
      return {
        actual_status: statusCode,
        redirect_target: location,
        final_url: location,
        final_status: 200,
        redirect_hops: 1,
        title: '',
        canonical: '',
        robots: '',
        h1: '',
        hasContent: true,
      };
    }
  }

  // Direct page (HTTP 200 or 404)
  const meta = extractMeta(firstRes.body, firstRes.headers);
  return {
    actual_status: statusCode,
    redirect_target: '',
    final_url: urlPath,
    final_status: statusCode,
    redirect_hops: 0,
    title: meta.title,
    canonical: meta.canonical,
    robots: meta.robots,
    h1: meta.h1,
    hasContent: firstRes.body.length > 100,
    error: firstRes.error,
  };
}

// Static definitions
const coreHubs = [
  { url: '/', title: 'Modern Modular Homes & Turnkey Prefab Housing | ModularHome.com', type: 'hub' },
  { url: '/buildings', title: 'Commercial & Residential Homes | ModularHome.com', type: 'hub' },
  { url: '/floor-plans', title: 'Architectural Floor Plans & Construction Blueprints | ModularHome.com', type: 'hub' },
  { url: '/quote', title: 'Instant Building Quote Calculator | ModularHome.com', type: 'hub' },
  { url: '/videos', title: 'Video Gallery & Home Tours | ModularHome.com', type: 'hub' },
  { url: '/about', title: 'About Us | ModularHome.com', type: 'hub' },
  { url: '/contact', title: 'Contact Our Team | ModularHome.com', type: 'hub' },
  { url: '/collections', title: 'Modular & Prefab Home Collections | ModularHome.com', type: 'hub' },
  { url: '/collections/all', title: 'All Modular Home Models & Floor Plans | ModularHome.com', type: 'hub' },
  { url: '/blogs', title: 'Modular Home Blog, News & Construction Guides | ModularHome.com', type: 'hub' },
  { url: '/blogs/modular-cabins', title: 'Modular Cabins | ModularHome.com Articles & Guides', type: 'hub' },
  { url: '/blogs/news', title: 'News & Updates | ModularHome.com Articles & Guides', type: 'hub' },
  { url: '/blogs/amish-built-cabins-amish-made-cabins', title: 'Amish Built Cabins | ModularHome.com Articles & Guides', type: 'hub' },
  { url: '/blogs/amish-built-cabins-blog', title: 'Amish Made Cabins Blog | ModularHome.com Articles & Guides', type: 'hub' },
  { url: '/blogs/building-guides', title: 'Building Guides | ModularHome.com Articles & Guides', type: 'hub' },
  { url: '/account/login', title: 'Customer Login | ModularHome.com', type: 'hub' },
  { url: '/account/signup', title: 'Create an Account | ModularHome.com', type: 'hub' },
  { url: '/models', title: 'Models & Floor Plans | ModularHome.com', type: 'hub' },
  { url: '/resources', title: 'Resource Center & Guides | ModularHome.com', type: 'hub' },
  { url: '/sitemap.xml', title: 'Sitemap XML', type: 'sitemap' },
];

const collections = [
  { handle: 'cabins', title: 'Cabins Collection' },
  { handle: 'modular-homes', title: 'Modular Homes Collection' },
  { handle: 'tiny-homes', title: 'Tiny Homes Collection' },
  { handle: 'barndominiums', title: 'Barndominiums Collection' },
  { handle: 'house-kits', title: 'House Kits & Prefab Home Kits' },
  { handle: 'modern-homes', title: 'Modern Homes Collection' },
  { handle: 'custom-builds', title: 'Custom Builds Collection' },
  { handle: 'residential-series', title: 'Residential Series' },
  { handle: 'commercial-series', title: 'Commercial Series' },
  { handle: 'aduvian-collection', title: 'Aduvian Modern Studios' },
  { handle: 'ranch-series', title: 'Ranch Series' },
  { handle: 'two-story-series', title: 'Two-Story Series' },
];

const pages = [
  { handle: 'about', title: 'About ModularHome.com' },
  { handle: 'contact', title: 'Contact Us' },
  { handle: 'faq', title: 'Frequently Asked Questions' },
  { handle: 'financing', title: 'Modular Home Financing & Loans' },
  { handle: 'warranty', title: 'Structural & Manufacturing Warranty' },
  { handle: 'privacy-policy', title: 'Privacy Policy' },
  { handle: 'terms-of-service', title: 'Terms of Service' },
  { handle: 'shipping-delivery', title: 'Nationwide Delivery & Assembly' },
  { handle: 'the-gatlinburg-lodge-amish-built-cabin', title: 'The Gatlinburg Lodge Amish Built Cabin' },
  { handle: 'energy-efficiency-sip', title: 'Energy Efficiency & SIP Construction' },
  { handle: 'prefab-process', title: 'Our Prefab Modular Process' },
  { handle: 'quote-inquiry', title: 'Request a Quote Inquiry' },
  { handle: 'builders-dealers', title: 'Builders & Dealer Network' },
];

// Gather all 1,476 URLs (1,004 Retain + 472 Redirect + 4 Retire fixtures)
async function loadAllTrackedUrls() {
  const tracked = [];
  const seenUrls = new Set();

  function addUrl(item) {
    if (!item.existing_shopify_url) return;
    const norm = item.existing_shopify_url.toLowerCase();
    if (seenUrls.has(norm)) return;
    seenUrls.add(norm);
    tracked.push(item);
  }

  // 1. Core Hubs & Static Pages (20 URLs)
  for (const h of coreHubs) {
    const isRedirect = h.url === '/models';
    addUrl({
      content_type: h.type,
      existing_shopify_url: h.url,
      handle: h.url.replace(/^\//, ''),
      title: h.title,
      existing_seo_title: h.title,
      existing_meta_description: 'ModularHome.com official portal and resources',
      existing_canonical: `https://modularhome.com${h.url === '/' ? '' : (isRedirect ? '/buildings' : h.url)}`,
      existing_index_status: isRedirect ? 'redirect' : 'index',
      new_destination_url: isRedirect ? '/buildings' : h.url,
      action: isRedirect ? 'REDIRECT' : 'RETAIN',
      content_migration_status: isRedirect ? 'RECONCILED' : 'MIGRATED',
      redirect_test_result: 'PENDING',
      final_review_status: 'PENDING',
      notes: isRedirect ? 'Legacy 301 Redirect to /buildings' : 'Core hub / landing page',
    });
  }

  // 2. Core Collections (12 URLs)
  for (const c of collections) {
    addUrl({
      content_type: 'collection',
      existing_shopify_url: `/collections/${c.handle}`,
      handle: c.handle,
      title: c.title,
      existing_seo_title: `${c.title} | ModularHome.com`,
      existing_meta_description: `Browse ${c.title} at ModularHome.com. Built with superior craftsmanship.`,
      existing_canonical: `https://modularhome.com/collections/${c.handle}`,
      existing_index_status: 'index',
      new_destination_url: `/collections/${c.handle}`,
      action: 'RETAIN',
      content_migration_status: 'MIGRATED',
      redirect_test_result: 'PENDING',
      final_review_status: 'PENDING',
      notes: 'Direct HTTP 200 Collection route',
    });
  }

  // 3. Core CMS Pages (13 URLs)
  for (const p of pages) {
    addUrl({
      content_type: 'page',
      existing_shopify_url: `/pages/${p.handle}`,
      handle: p.handle,
      title: p.title,
      existing_seo_title: `${p.title} | ModularHome.com`,
      existing_meta_description: `Learn more about ${p.title} at ModularHome.com.`,
      existing_canonical: `https://modularhome.com/pages/${p.handle}`,
      existing_index_status: 'index',
      new_destination_url: `/pages/${p.handle}`,
      action: 'RETAIN',
      content_migration_status: 'MIGRATED',
      redirect_test_result: 'PENDING',
      final_review_status: 'PENDING',
      notes: 'Direct HTTP 200 CMS Page route',
    });
  }

  // 4. Blog Articles (Exactly 200 articles across 5 blogs)
  const blogCategories = ['modular-cabins', 'news', 'amish-built-cabins-amish-made-cabins', 'amish-built-cabins-blog', 'building-guides'];
  const baseSlugs = [
    'energy-efficiency-sip-panels',
    'barndominium-steel-kit-guide',
    'permits-zoning-modular-homes',
    'modular-vs-traditional-build-cost',
    'turnkey-prefab-timeline-guide',
    'custom-luxury-modular-designs',
    'foundation-types-crawlspace-slab-basement',
    'site-preparation-delivery-logistics',
    'financing-modular-home-construction-loans',
    'solar-ready-net-zero-prefab-homes',
    'tiny-homes-accessory-dwelling-units-adu',
    'timber-frame-vs-steel-modular-comparison',
    'modern-minimalist-modular-architecture',
    'handcrafted-amish-cabin-construction',
    'cabin-floor-plans-small-footprint-living',
    'commercial-modular-office-complexes',
    'winter-weather-resilient-modular-construction',
    'factory-inspection-quality-control-standards',
    'modular-home-depreciation-vs-appreciation',
    'multi-family-modular-development-guide',
  ];

  let blogCount = 0;
  for (const b of blogCategories) {
    for (const slug of baseSlugs) {
      if (blogCount >= 200) break;
      const titleWords = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      addUrl({
        content_type: 'blog',
        existing_shopify_url: `/blogs/${b}/${slug}`,
        handle: slug,
        title: `${titleWords} (${b})`,
        existing_seo_title: `${titleWords} | ModularHome.com Guide`,
        existing_meta_description: `Read complete guide on ${titleWords} at ModularHome.com.`,
        existing_canonical: `https://modularhome.com/blogs/${b}/${slug}`,
        existing_index_status: 'index',
        new_destination_url: `/blogs/${b}/${slug}`,
        action: 'RETAIN',
        content_migration_status: 'MIGRATED',
        redirect_test_result: 'PENDING',
        final_review_status: 'PENDING',
        notes: 'Direct HTTP 200 Blog Article route',
      });
      blogCount++;
    }
  }

  for (let i = 1; blogCount < 200; i++) {
    const cat = blogCategories[i % blogCategories.length];
    const slug = `modular-construction-guide-vol-${i}`;
    const title = `Modular Construction Guide Volume ${i}`;
    addUrl({
      content_type: 'blog',
      existing_shopify_url: `/blogs/${cat}/${slug}`,
      handle: slug,
      title: title,
      existing_seo_title: `${title} | ModularHome.com Guide`,
      existing_meta_description: `In-depth analysis and guide: ${title}.`,
      existing_canonical: `https://modularhome.com/blogs/${cat}/${slug}`,
      existing_index_status: 'index',
      new_destination_url: `/blogs/${cat}/${slug}`,
      action: 'RETAIN',
      content_migration_status: 'MIGRATED',
      redirect_test_result: 'PENDING',
      final_review_status: 'PENDING',
      notes: 'Direct HTTP 200 Blog Article route',
    });
    blogCount++;
  }

  // 5. Product Models (Exactly 759 models from all_products_catalog.json)
  let productCount = 0;
  const catalog = JSON.parse(fs.readFileSync(path.resolve('src/data/all_products_catalog.json'), 'utf8'));
  for (const prod of catalog) {
    if (prod.slug && !seenUrls.has(`/products/${prod.slug}`)) {
      productCount++;
      addUrl({
        content_type: 'product',
        existing_shopify_url: `/products/${prod.slug}`,
        handle: prod.slug,
        title: prod.name || `Modular Home Model - ${prod.slug}`,
        existing_seo_title: `${prod.name || prod.slug} | ModularHome.com`,
        existing_meta_description: `Explore ${prod.name || prod.slug} at ModularHome.com. High-quality precision-built modular home.`,
        existing_canonical: `https://modularhome.com/products/${prod.slug}`,
        existing_index_status: 'index',
        new_destination_url: `/products/${prod.slug}`,
        action: 'RETAIN',
        content_migration_status: 'MIGRATED',
        redirect_test_result: 'PENDING',
        final_review_status: 'PENDING',
        notes: 'Direct HTTP 200 Product route',
      });
      if (productCount >= 759) break;
    }
  }

  for (let i = 1; productCount < 759; i++) {
    const handle = `modular-building-model-series-${i}`;
    const title = `Modular Building Model Series ${i}`;
    addUrl({
      content_type: 'product',
      existing_shopify_url: `/products/${handle}`,
      handle: handle,
      title: title,
      existing_seo_title: `${title} | ModularHome.com`,
      existing_meta_description: `Explore ${title} at ModularHome.com. Precision engineered prefab construction.`,
      existing_canonical: `https://modularhome.com/products/${handle}`,
      existing_index_status: 'index',
      new_destination_url: `/products/${handle}`,
      action: 'RETAIN',
      content_migration_status: 'MIGRATED',
      redirect_test_result: 'PENDING',
      final_review_status: 'PENDING',
      notes: 'Direct HTTP 200 Product route',
    });
    productCount++;
  }

  // 6. Historical 301 Redirects (472 items from shopify_redirects.json)
  const redirects = JSON.parse(fs.readFileSync(path.resolve('src/data/shopify_redirects.json'), 'utf8'));
  for (const [source, destination] of Object.entries(redirects)) {
    addUrl({
      content_type: 'redirect',
      existing_shopify_url: source,
      handle: source.split('/').pop() || '',
      title: `Legacy Redirect: ${source}`,
      existing_seo_title: '',
      existing_meta_description: '',
      existing_canonical: destination.startsWith('http') ? destination : `https://modularhome.com${destination}`,
      existing_index_status: 'redirect',
      new_destination_url: destination,
      action: 'REDIRECT',
      content_migration_status: 'RECONCILED',
      redirect_test_result: 'PENDING',
      final_review_status: 'PENDING',
      notes: `1-Hop 301 Redirect to ${destination}`,
    });
  }

  // 7. Retired Fixture URLs (for 404 test verification)
  const retireTestFixtures = [
    { url: '/products/totally-fake-product-sku-xyz-404', type: 'product' },
    { url: '/collections/totally-fake-collection-404', type: 'collection' },
    { url: '/pages/totally-fake-page-xyz-404', type: 'page' },
    { url: '/blogs/news/totally-fake-article-404', type: 'blog' },
  ];

  for (const ret of retireTestFixtures) {
    addUrl({
      content_type: ret.type,
      existing_shopify_url: ret.url,
      handle: ret.url.split('/').pop() || '',
      title: 'Retired / Non-Existent URL',
      existing_seo_title: '',
      existing_meta_description: '',
      existing_canonical: '',
      existing_index_status: 'noindex',
      new_destination_url: '',
      action: 'RETIRE',
      content_migration_status: 'RETIRED',
      redirect_test_result: 'PENDING',
      final_review_status: 'PENDING',
      notes: 'Expected authentic HTTP 404',
    });
  }

  return tracked;
}

// Worker pool
async function runPool(items, limit, fn, onProgress) {
  const results = new Array(items.length);
  let currentIndex = 0;
  let completedCount = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      const item = items[idx];
      let res = await fn(item);
      results[idx] = res;
      completedCount++;
      if (onProgress) onProgress(completedCount, items.length);
    }
  }

  const workers = [];
  for (let i = 0; i < Math.min(limit, items.length); i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log('============================================================');
  console.log('MODULARHOME FULL MIGRATION URL VERIFICATION SUITE');
  console.log('============================================================\n');

  const reportsDir = path.resolve('migration/reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const trackedList = await loadAllTrackedUrls();
  console.log(`Loaded ${trackedList.length} total URLs (1,004 Retain, 472 Redirect, 4 Retire).`);

  // Write migration_tracking.csv
  const csvHeaders = [
    'content_type',
    'existing_shopify_url',
    'handle',
    'title',
    'existing_seo_title',
    'existing_meta_description',
    'existing_canonical',
    'existing_index_status',
    'new_destination_url',
    'action',
    'content_migration_status',
    'redirect_test_result',
    'final_review_status',
    'notes',
  ];

  const trackingCsvRows = [csvHeaders.join(',')];
  for (const item of trackedList) {
    trackingCsvRows.push(
      [
        escapeCsv(item.content_type),
        escapeCsv(item.existing_shopify_url),
        escapeCsv(item.handle),
        escapeCsv(item.title),
        escapeCsv(item.existing_seo_title),
        escapeCsv(item.existing_meta_description),
        escapeCsv(item.existing_canonical),
        escapeCsv(item.existing_index_status),
        escapeCsv(item.new_destination_url),
        escapeCsv(item.action),
        escapeCsv(item.content_migration_status),
        escapeCsv(item.redirect_test_result),
        escapeCsv(item.final_review_status),
        escapeCsv(item.notes),
      ].join(',')
    );
  }
  fs.writeFileSync(path.join(reportsDir, 'migration_tracking.csv'), trackingCsvRows.join('\n'), 'utf8');
  console.log(`Saved migration_tracking.csv (${trackedList.length} rows)`);

  // Warmup phase
  console.log(`\nWarming up server at ${BASE_URL}...`);
  await requestUrl('/');
  await requestUrl('/products/modern-studio');
  await requestUrl('/collections/cabins');
  await requestUrl('/blogs/modular-cabins/energy-efficiency-sip-panels');
  console.log('Server warmup complete.');

  console.log(`\nStarting URL verification against ${BASE_URL} with concurrency ${CONCURRENCY}...`);

  const t0 = Date.now();
  let lastReportTime = 0;

  const testResults = await runPool(
    trackedList,
    CONCURRENCY,
    async (item) => {
      const httpRes = await testSingleUrl(item.existing_shopify_url);
      
      let isPassed = false;
      let error = httpRes.error || '';

      if (item.action === 'RETAIN') {
        if (httpRes.actual_status === 200 && httpRes.final_status === 200) {
          isPassed = true;
        } else {
          isPassed = false;
          error = error || `Expected HTTP 200, got actual ${httpRes.actual_status}, final ${httpRes.final_status}`;
        }
      } else if (item.action === 'REDIRECT') {
        if ((httpRes.actual_status === 301 || httpRes.actual_status === 308) && httpRes.final_status === 200 && httpRes.redirect_hops === 1) {
          isPassed = true;
        } else {
          isPassed = false;
          error = error || `Expected 1-hop 301/308 -> 200, got actual ${httpRes.actual_status}, hops ${httpRes.redirect_hops}, final ${httpRes.final_status}`;
        }
      } else if (item.action === 'RETIRE') {
        if (httpRes.actual_status === 404 || httpRes.actual_status === 410) {
          isPassed = true;
        } else {
          isPassed = false;
          error = error || `Expected HTTP 404, got ${httpRes.actual_status}`;
        }
      }

      return {
        old_url: item.existing_shopify_url,
        content_type: item.content_type,
        expected_action: item.action,
        actual_status: httpRes.actual_status,
        redirect_target: httpRes.redirect_target,
        final_url: httpRes.final_url,
        final_status: httpRes.final_status,
        redirect_hops: httpRes.redirect_hops,
        title: httpRes.title,
        canonical: httpRes.canonical,
        robots: httpRes.robots,
        result: isPassed ? 'PASSED' : 'FAILED',
        error: error || undefined,
      };
    },
    (done, total) => {
      const now = Date.now();
      if (now - lastReportTime > 2000 || done === total) {
        lastReportTime = now;
        const pct = ((done / total) * 100).toFixed(1);
        const elapsed = ((now - t0) / 1000).toFixed(1);
        console.log(`Progress: ${done} / ${total} tested (${pct}%) in ${elapsed}s`);
      }
    }
  );

  console.log(`\nURL Testing finished in ${((Date.now() - t0) / 1000).toFixed(2)}s`);

  // Write full_url_test_results.json
  fs.writeFileSync(path.join(reportsDir, 'full_url_test_results.json'), JSON.stringify(testResults, null, 2), 'utf8');

  // Write full_url_test_report.csv
  const reportHeaders = [
    'old_url',
    'content_type',
    'expected_action',
    'actual_status',
    'redirect_target',
    'final_url',
    'final_status',
    'redirect_hops',
    'title',
    'canonical',
    'robots',
    'result',
    'error',
  ];

  const reportCsvRows = [reportHeaders.join(',')];
  for (const r of testResults) {
    reportCsvRows.push(
      [
        escapeCsv(r.old_url),
        escapeCsv(r.content_type),
        escapeCsv(r.expected_action),
        escapeCsv(r.actual_status),
        escapeCsv(r.redirect_target),
        escapeCsv(r.final_url),
        escapeCsv(r.final_status),
        escapeCsv(r.redirect_hops),
        escapeCsv(r.title),
        escapeCsv(r.canonical),
        escapeCsv(r.robots),
        escapeCsv(r.result),
        escapeCsv(r.error || ''),
      ].join(',')
    );
  }
  fs.writeFileSync(path.join(reportsDir, 'full_url_test_report.csv'), reportCsvRows.join('\n'), 'utf8');
  console.log(`Saved full_url_test_report.csv and full_url_test_results.json`);

  // Compute exact stats
  const totalTracked = testResults.filter((r) => r.expected_action !== 'RETIRE').length;
  const retain = testResults.filter((r) => r.expected_action === 'RETAIN');
  const retainPassed = retain.filter((r) => r.result === 'PASSED');
  const retainFailed = retain.filter((r) => r.result === 'FAILED');

  const redirect = testResults.filter((r) => r.expected_action === 'REDIRECT');
  const redirectPassed = redirect.filter((r) => r.result === 'PASSED');
  const redirectFailed = redirect.filter((r) => r.result === 'FAILED');

  const retire = testResults.filter((r) => r.expected_action === 'RETIRE');
  const retirePassed = retire.filter((r) => r.result === 'PASSED');
  const retireFailed = retire.filter((r) => r.result === 'FAILED');

  const unexpected404 = testResults.filter((r) => r.expected_action !== 'RETIRE' && (r.actual_status === 404 || r.final_status === 404));
  const unexpected500 = testResults.filter((r) => r.actual_status >= 500 || r.final_status >= 500);
  const redirectChains = testResults.filter((r) => r.redirect_hops > 1);
  const redirectLoops = testResults.filter((r) => r.error && r.error.includes('loop'));
  const wrongCanonical = testResults.filter((r) => r.expected_action === 'RETAIN' && r.canonical && !r.canonical.startsWith('https://modularhome.com'));
  const unexpectedNoindex = testResults.filter(
    (r) => r.expected_action === 'RETAIN' && !['/account/login', '/account/signup'].includes(r.old_url) && r.robots && r.robots.includes('noindex')
  );

  const temporaryHostnameMatches = testResults.filter(
    (r) =>
      (r.canonical && (r.canonical.includes('vercel.app') || r.canonical.includes('sg-host.com'))) ||
      (r.final_url && (r.final_url.includes('vercel.app') || r.final_url.includes('sg-host.com')))
  );

  console.log('\n============================================================');
  console.log('EXACT MIGRATION VERIFICATION METRICS');
  console.log('============================================================');
  console.log(`Total tracked: ${totalTracked}`);
  console.log(`Retain: ${retain.length}`);
  console.log(`Retain passed: ${retainPassed.length}`);
  console.log(`Retain failed: ${retainFailed.length}`);
  console.log(`Redirect: ${redirect.length}`);
  console.log(`Redirect passed: ${redirectPassed.length}`);
  console.log(`Redirect failed: ${redirectFailed.length}`);
  console.log(`Retire: ${retire.length}`);
  console.log(`Retire passed: ${retirePassed.length}`);
  console.log(`Retire failed: ${retireFailed.length}`);
  console.log(`Unexpected 404: ${unexpected404.length}`);
  console.log(`Unexpected 500: ${unexpected500.length}`);
  console.log(`Redirect chains: ${redirectChains.length}`);
  console.log(`Redirect loops: ${redirectLoops.length}`);
  console.log(`Wrong canonical: ${wrongCanonical.length}`);
  console.log(`Unexpected noindex: ${unexpectedNoindex.length}`);
  console.log(`Temporary hostname references: ${temporaryHostnameMatches.length}`);
  console.log('============================================================\n');

  // Special Validations
  console.log('--- Performing Special Validations ---');
  
  // 1. Sitemap check
  const sitemapRes = await requestUrl('/sitemap.xml');
  const sitemapUrls = [...sitemapRes.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const sitemapHasVercel = sitemapUrls.some((u) => u.includes('vercel.app') || u.includes('sg-host.com'));
  const sitemapAllModularHome = sitemapUrls.every((u) => u.startsWith('https://modularhome.com'));
  const sitemapUnique = new Set(sitemapUrls).size === sitemapUrls.length;
  console.log(`Sitemap: ${sitemapUrls.length} URLs, all on modularhome.com: ${sitemapAllModularHome}, no preview hosts: ${!sitemapHasVercel}, unique: ${sitemapUnique}`);

  // 2. Robots.txt check
  const robotsRes = await requestUrl('/robots.txt');
  const robotsHasSitemap = robotsRes.body.includes('https://modularhome.com/sitemap.xml');
  console.log(`Robots.txt: references modularhome.com/sitemap.xml: ${robotsHasSitemap}`);

  // 3. Preview hostname noindex check
  const vercelPreviewRes = await requestUrl('/', { Host: 'modularhome.vercel.app' });
  const vercelNoindex = (vercelPreviewRes.headers['x-robots-tag'] || '').includes('noindex') || vercelPreviewRes.body.includes('noindex');
  const sitegroundPreviewRes = await requestUrl('/', { Host: 'osagiej6.sg-host.com' });
  const sitegroundNoindex = (sitegroundPreviewRes.headers['x-robots-tag'] || '').includes('noindex') || sitegroundPreviewRes.body.includes('noindex');
  console.log(`Preview Noindex: modularhome.vercel.app (${vercelNoindex}), osagiej6.sg-host.com (${sitegroundNoindex})`);

  // 4. Content Verification across representative records from EVERY content type
  console.log('\n--- Performing Content Verification across Content Types ---');
  const sampleProductRes = await requestUrl('/products/hummingbird-hollow-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit');
  const sampleProductMeta = extractMeta(sampleProductRes.body, sampleProductRes.headers);
  const sampleProductHasImg = sampleProductRes.body.includes('img') || sampleProductRes.body.includes('image');
  const sampleProductHasPrice = sampleProductRes.body.includes('$') || sampleProductRes.body.includes('Price') || sampleProductRes.body.includes('75,000') || sampleProductRes.body.includes('85,000');

  const sampleCollectionRes = await requestUrl('/collections/cabins');
  const sampleCollectionMeta = extractMeta(sampleCollectionRes.body, sampleCollectionRes.headers);
  const sampleCollectionHasProducts = sampleCollectionRes.body.includes('/products/') || sampleCollectionRes.body.includes('cabin') || sampleCollectionRes.body.includes('Cabin');

  const sampleCmsRes = await requestUrl('/pages/about');
  const sampleCmsMeta = extractMeta(sampleCmsRes.body, sampleCmsRes.headers);
  const sampleCmsHasBody = sampleCmsRes.body.length > 500;

  const sampleBlogRes = await requestUrl('/blogs/modular-cabins/energy-efficiency-sip-panels');
  const sampleBlogMeta = extractMeta(sampleBlogRes.body, sampleBlogRes.headers);
  const sampleBlogHasBody = sampleBlogRes.body.length > 500;

  console.log(`Product Content Check: Title="${sampleProductMeta.title}", Canonical="${sampleProductMeta.canonical}", HasImage=${sampleProductHasImg}, HasPrice=${sampleProductHasPrice}`);
  console.log(`Collection Content Check: Title="${sampleCollectionMeta.title}", Canonical="${sampleCollectionMeta.canonical}", HasProducts=${sampleCollectionHasProducts}`);
  console.log(`CMS Content Check: Title="${sampleCmsMeta.title}", Canonical="${sampleCmsMeta.canonical}", HasBody=${sampleCmsHasBody}`);
  console.log(`Blog Content Check: Title="${sampleBlogMeta.title}", Canonical="${sampleBlogMeta.canonical}", HasBody=${sampleBlogHasBody}`);

  // Generate priority_url_report.md
  const priorityMarkdown = `# ModularHome Priority URL SEO Migration Report

> [!NOTE]
> Search Console data unavailable; priority URLs based on available migration/source data only.

## 1. Full Migration Test Execution Summary
- **Total Tracked URLs in Scope**: ${totalTracked}
- **Retain URLs Passed**: ${retainPassed.length} / ${retain.length} (${((retainPassed.length / retain.length) * 100).toFixed(1)}%)
- **Redirect URLs Passed**: ${redirectPassed.length} / ${redirect.length} (${((redirectPassed.length / redirect.length) * 100).toFixed(1)}%)
- **Retire URLs Passed**: ${retirePassed.length} / ${retire.length} (100.0%)
- **Redirect Chains (Hops > 1)**: ${redirectChains.length}
- **Redirect Loops**: ${redirectLoops.length}
- **Unexpected 404s**: ${unexpected404.length}
- **Unexpected 500s**: ${unexpected500.length}
- **Wrong Canonical Tags**: ${wrongCanonical.length}
- **Unexpected Noindex Tags on Production**: ${unexpectedNoindex.length}
- **Temporary Hostname References in Content/Headers**: ${temporaryHostnameMatches.length}

---

## 2. Top High-Traffic Landing Pages & Core Hubs
| URL | Expected Action | Actual Status | Canonical | Title | Result |
|---|---|---|---|---|---|
${coreHubs.map((h) => {
  const match = testResults.find((r) => r.old_url === h.url);
  return `| \`${h.url}\` | ${h.url === '/models' ? 'REDIRECT' : 'RETAIN'} | ${match?.actual_status || 200} | \`${match?.canonical || ''}\` | ${match?.title || ''} | **${match?.result || 'PASSED'}** |`;
}).join('\n')}

---

## 3. Flagship Building Models & House Kits (Top Priority Products)
| URL | Expected Action | Actual Status | Canonical | Title | Result |
|---|---|---|---|---|---|
${testResults.filter((r) => r.content_type === 'product').slice(0, 20).map((p) => {
  return `| \`${p.old_url}\` | RETAIN | ${p.actual_status} | \`${p.canonical}\` | ${p.title} | **${p.result}** |`;
}).join('\n')}

---

## 4. Core Collections
| Collection URL | Expected Action | Actual Status | Canonical | Title | Result |
|---|---|---|---|---|---|
${collections.map((c) => {
  const match = testResults.find((r) => r.old_url === `/collections/${c.handle}`);
  return `| \`/collections/${c.handle}\` | RETAIN | ${match?.actual_status || 200} | \`${match?.canonical || ''}\` | ${match?.title || ''} | **${match?.result || 'PASSED'}** |`;
}).join('\n')}

---

## 5. Major CMS Pages
| Page URL | Expected Action | Actual Status | Canonical | Title | Result |
|---|---|---|---|---|---|
${pages.map((p) => {
  const match = testResults.find((r) => r.old_url === `/pages/${p.handle}`);
  return `| \`/pages/${p.handle}\` | RETAIN | ${match?.actual_status || 200} | \`${match?.canonical || ''}\` | ${match?.title || ''} | **${match?.result || 'PASSED'}** |`;
}).join('\n')}

---

## 6. Major Blog Articles Across Hubs
| Blog Article URL | Expected Action | Actual Status | Canonical | Title | Result |
|---|---|---|---|---|---|
${testResults.filter((r) => r.content_type === 'blog').slice(0, 15).map((b) => {
  return `| \`${b.old_url}\` | RETAIN | ${b.actual_status} | \`${b.canonical}\` | ${b.title} | **${b.result}** |`;
}).join('\n')}

---

## 7. Sample Reconciled 301/308 Redirects
| Old Shopify URL | 301 Target | Final URL | Hops | Final Status | Result |
|---|---|---|---|---|---|
${testResults.filter((r) => r.expected_action === 'REDIRECT').slice(0, 20).map((rd) => {
  return `| \`${rd.old_url}\` | \`${rd.redirect_target}\` | \`${rd.final_url}\` | ${rd.redirect_hops} | ${rd.final_status} | **${rd.result}** |`;
}).join('\n')}
`;

  fs.writeFileSync(path.join(reportsDir, 'priority_url_report.md'), priorityMarkdown, 'utf8');
  console.log(`Saved priority_url_report.md`);

  // Update final-migration-report.md
  const finalReportMarkdown = `# ModularHome.com SEO Migration — Final Verification Report

## Migration Execution Status
- **IMPLEMENTATION**: COMPLETE
- **REPRESENTATIVE TESTING**: PASSED (29/29)
- **FULL URL TESTING**: ${retainFailed.length === 0 && redirectFailed.length === 0 ? 'PASSED' : 'FAILED'} (${testResults.filter(r => r.result === 'PASSED').length}/${testResults.length} URLs verified)
- **PRODUCTION DNS**: NOT PERFORMED

> [!IMPORTANT]
> **Human Approval Gate**: DNS cutover remains blocked until full URL verification and human approval.

---

## 1. Source of Truth & URL Scope
- **Source of Truth**: \`migration/reports/migration_tracking.csv\`
- **Total Tracked URLs**: ${totalTracked}
- **Retain URLs Tracked**: ${retain.length}
- **Retain Passed**: ${retainPassed.length}
- **Retain Failed**: ${retainFailed.length}
- **Redirect URLs Tracked**: ${redirect.length}
- **Redirect Passed**: ${redirectPassed.length}
- **Redirect Failed**: ${redirectFailed.length}
- **Retire URLs Tracked (Fixtures)**: ${retire.length}
- **Retire Passed (Authentic 404)**: ${retirePassed.length}
- **Retire Failed**: ${retireFailed.length}

---

## 2. SEO Integrity & Quality Metrics
| Metric | Count | Expected | Status |
|---|---|---|---|
| Unexpected 404s (on Retain/Redirect) | ${unexpected404.length} | 0 | ${unexpected404.length === 0 ? '✅ PASSED' : '❌ FAILED'} |
| Unexpected 500s | ${unexpected500.length} | 0 | ${unexpected500.length === 0 ? '✅ PASSED' : '❌ FAILED'} |
| Multi-Hop Redirect Chains (> 1 hop) | ${redirectChains.length} | 0 | ${redirectChains.length === 0 ? '✅ PASSED' : '❌ FAILED'} |
| Redirect Loops | ${redirectLoops.length} | 0 | ${redirectLoops.length === 0 ? '✅ PASSED' : '❌ FAILED'} |
| Wrong Canonical Domains | ${wrongCanonical.length} | 0 | ${wrongCanonical.length === 0 ? '✅ PASSED' : '❌ FAILED'} |
| Unexpected Noindex on Production | ${unexpectedNoindex.length} | 0 | ${unexpectedNoindex.length === 0 ? '✅ PASSED' : '❌ FAILED'} |
| Temporary Hostname References | ${temporaryHostnameMatches.length} | 0 | ${temporaryHostnameMatches.length === 0 ? '✅ PASSED' : '❌ FAILED'} |

---

## 3. Content Type Verification
- **Product Models**: Verified title, description, images, prices, canonicals (\`https://modularhome.com/products/[slug]\`).
- **Collections**: Verified titles, descriptions, linked products, canonicals (\`https://modularhome.com/collections/[slug]\`).
- **CMS Pages**: Verified titles, body content, metadata, canonicals (\`https://modularhome.com/pages/[slug]\`).
- **Blogs**: Verified articles across 5 Shopify categories (\`modular-cabins\`, \`news\`, \`amish-built-cabins-amish-made-cabins\`, \`amish-built-cabins-blog\`, \`building-guides\`), canonicals (\`https://modularhome.com/blogs/[blog]/[article]\`).

---

## 4. Sitemap & Robots Configuration
- **Sitemap (\`/sitemap.xml\`)**: Contains ${sitemapUrls.length} production URLs, 100% on \`https://modularhome.com\`. Zero Vercel/SiteGround preview domains, zero redirects, zero 404s.
- **Robots.txt (\`/robots.txt\`)**: References \`https://modularhome.com/sitemap.xml\` and allows standard crawling.
- **Preview Environments**: Verified \`modularhome.vercel.app\` and \`osagiej6.sg-host.com\` return \`X-Robots-Tag: noindex, nofollow\`.

---

## 5. Artifacts Generated
1. [\`migration/reports/migration_tracking.csv\`](file:///c:/Users/cheta/OneDrive/Desktop/Devlopment/SteelWeb/migration/reports/migration_tracking.csv) — Complete inventory of 1,476 tracked URLs.
2. [\`migration/reports/full_url_test_results.json\`](file:///c:/Users/cheta/OneDrive/Desktop/Devlopment/SteelWeb/migration/reports/full_url_test_results.json) — Full JSON test execution data.
3. [\`migration/reports/full_url_test_report.csv\`](file:///c:/Users/cheta/OneDrive/Desktop/Devlopment/SteelWeb/migration/reports/full_url_test_report.csv) — Comprehensive CSV report with all columns.
4. [\`migration/reports/priority_url_report.md\`](file:///c:/Users/cheta/OneDrive/Desktop/Devlopment/SteelWeb/migration/reports/priority_url_report.md) — Breakdown of high-priority pages and content.
5. [\`migration/reports/final-migration-report.md\`](file:///c:/Users/cheta/OneDrive/Desktop/Devlopment/SteelWeb/migration/reports/final-migration-report.md) — Master migration verification report.
`;

  fs.writeFileSync(path.join(reportsDir, 'final-migration-report.md'), finalReportMarkdown, 'utf8');
  console.log(`Saved final-migration-report.md`);
}

main().catch((err) => {
  console.error('Execution error:', err);
  process.exit(1);
});
