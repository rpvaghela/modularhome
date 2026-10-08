const http = require('http');

const PORT = 3000;

function sendTestRequest({ host, proto = 'https', path = '/', headers = {} }) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: 'GET',
      headers: {
        'Host': host,
        'x-forwarded-proto': proto,
        'x-forwarded-host': host,
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          location: res.headers['location'],
          body: data
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error(`Timeout for ${host}${path}`));
    });
    req.end();
  });
}

async function runWwwTests() {
  console.log('Waiting for Next.js server on port 3000...');
  for (let i = 0; i < 30; i++) {
    try {
      const res = await sendTestRequest({ host: 'localhost:3000', proto: 'http', path: '/' });
      if (res.statusCode === 200 || res.statusCode === 304) {
        console.log('Server is responsive! Starting WWW to Non-WWW & HTTPS QA tests...\n');
        break;
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('========================================================================');
  console.log('  TESTING WWW TO NON-WWW & HTTP TO HTTPS 301 REDIRECTS');
  console.log('========================================================================\n');

  const testCases = [
    // 1. Homepage www -> non-www
    {
      name: 'Homepage: https://www.modularhome.com/ -> https://modularhome.com/',
      req: { host: 'www.modularhome.com', proto: 'https', path: '/' },
      expectedStatus: 301,
      expectedLocation: 'https://modularhome.com/'
    },
    // 2. HTTP to HTTPS www -> non-www
    {
      name: 'Homepage HTTP: http://www.modularhome.com/ -> https://modularhome.com/',
      req: { host: 'www.modularhome.com', proto: 'http', path: '/' },
      expectedStatus: 301,
      expectedLocation: 'https://modularhome.com/'
    },
    // 3. HTTP to HTTPS non-www
    {
      name: 'Homepage HTTP non-www: http://modularhome.com/ -> https://modularhome.com/',
      req: { host: 'modularhome.com', proto: 'http', path: '/' },
      expectedStatus: 301,
      expectedLocation: 'https://modularhome.com/'
    },
    // 4. Product page www -> non-www with query parameters preserved
    {
      name: 'Product URL with Query Params: www.modularhome.com/cabins/el-chapo-muchacho?src=ad&gclid=123',
      req: { host: 'www.modularhome.com', proto: 'https', path: '/cabins/el-chapo-muchacho?src=ad&gclid=123' },
      expectedStatus: 301,
      expectedLocation: 'https://modularhome.com/cabins/el-chapo-muchacho?src=ad&gclid=123'
    },
    // 5. Single-hop legacy path + www -> canonical non-www URL
    {
      name: 'Single-hop Legacy + WWW: www.modularhome.com/buildings/el-chapo-muchacho?color=rustic',
      req: { host: 'www.modularhome.com', proto: 'https', path: '/buildings/el-chapo-muchacho?color=rustic' },
      expectedStatus: 301,
      expectedLocation: 'https://modularhome.com/cabins/el-chapo-muchacho?color=rustic'
    },
    // 6. Single-hop legacy Shopify product + www -> canonical non-www URL
    {
      name: 'Single-hop Shopify + WWW: http://www.modularhome.com/products/the-sparrow-cabin-luxury-log-home-kit',
      req: { host: 'www.modularhome.com', proto: 'http', path: '/products/the-sparrow-cabin-luxury-log-home-kit' },
      expectedStatus: 301,
      expectedLocation: 'https://modularhome.com/cabins/the-sparrow-cabin-luxury-log-home-kit'
    },
    // 7. Collections page www -> non-www
    {
      name: 'Collections: www.modularhome.com/collections/barndominiums?sort=price',
      req: { host: 'www.modularhome.com', proto: 'https', path: '/collections/barndominiums?sort=price' },
      expectedStatus: 301,
      expectedLocation: 'https://modularhome.com/collections/barndominiums?sort=price'
    },
    // 8. Blogs page www -> non-www
    {
      name: 'Blogs: www.modularhome.com/blogs/modular-construction/factory-to-foundation',
      req: { host: 'www.modularhome.com', proto: 'https', path: '/blogs/modular-construction/factory-to-foundation' },
      expectedStatus: 301,
      expectedLocation: 'https://modularhome.com/blogs/modular-construction/factory-to-foundation'
    },
    // 9. Standard non-www direct request -> 200 OK (no redirect loop!)
    {
      name: 'Canonical Non-WWW Direct Request: https://modularhome.com/cabins/el-chapo-muchacho',
      req: { host: 'modularhome.com', proto: 'https', path: '/cabins/el-chapo-muchacho' },
      expectedStatus: 200,
      expectedLocation: undefined
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    try {
      const res = await sendTestRequest(tc.req);
      const isStatusMatch = res.statusCode === tc.expectedStatus;
      const isLocationMatch = !tc.expectedLocation || res.location === tc.expectedLocation;

      if (isStatusMatch && isLocationMatch) {
        passed++;
        const targetStr = res.location ? ` -> ${res.location}` : '';
        console.log(`[PASS] ${tc.name}\n       HTTP ${res.statusCode}${targetStr}\n`);
      } else {
        failed++;
        console.error(`[FAIL] ${tc.name}\n       Expected: HTTP ${tc.expectedStatus} ${tc.expectedLocation || ''}\n       Actual:   HTTP ${res.statusCode} ${res.location || ''}\n`);
      }
    } catch (e) {
      failed++;
      console.error(`[ERROR] ${tc.name}: ${e.message}\n`);
    }
  }

  // 10. Check Sitemap and Canonical host in output
  console.log('--- Checking Sitemap & Canonical Directives ---');
  try {
    const sitemapRes = await sendTestRequest({ host: 'modularhome.com', proto: 'https', path: '/sitemap.xml' });
    const hasWwwInSitemap = sitemapRes.body.includes('https://www.modularhome.com');
    const hasNonWwwInSitemap = sitemapRes.body.includes('https://modularhome.com');
    if (!hasWwwInSitemap && hasNonWwwInSitemap) {
      passed++;
      console.log('[PASS] Sitemap /sitemap.xml contains 100% non-www canonical URLs (0 www URLs found)\n');
    } else {
      failed++;
      console.error('[FAIL] Sitemap contains unexpected www URLs!\n');
    }

    const robotsRes = await sendTestRequest({ host: 'modularhome.com', proto: 'https', path: '/robots.txt' });
    if (robotsRes.body.includes('Sitemap: https://modularhome.com/sitemap.xml')) {
      passed++;
      console.log('[PASS] Robots.txt sitemap directive points to non-www: https://modularhome.com/sitemap.xml\n');
    } else {
      failed++;
      console.error('[FAIL] Robots.txt sitemap directive incorrect: ' + robotsRes.body + '\n');
    }
  } catch (e) {
    failed++;
    console.error('[ERROR] Sitemap/robots check failed:', e.message);
  }

  console.log('========================================================================');
  console.log(`  WWW & HTTPS REDIRECT RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================================');

  if (failed > 0) process.exit(1);
}

runWwwTests();
