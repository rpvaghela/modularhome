import http from 'http';
import fs from 'fs';
import path from 'path';

interface UrlTestResult {
  url: string;
  expectedAction: 'RETAIN' | 'REDIRECT' | 'RETIRE';
  expectedDestination?: string;
  actualStatus: number;
  locationHeader?: string;
  finalStatus: number;
  finalUrl: string;
  pageTitle?: string;
  canonical?: string;
  robotsMeta?: string;
  isPassed: boolean;
  notes: string;
}

const BASE_URL = process.env.TEST_HOST || 'http://localhost:3000';

function fetchUrl(targetUrl: string, redirectCount = 0): Promise<{
  statusCode: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
  finalUrl: string;
  redirects: string[];
}> {
  return new Promise((resolve, reject) => {
    if (redirectCount > 10) {
      return reject(new Error('Too many redirects (chain / loop detected)'));
    }

    const parsed = new URL(targetUrl, BASE_URL);
    const req = http.request(
      parsed,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'ModularHome-Migration-URL-Tester/1.0',
          'Host': 'modularhome.com', // Simulate production host
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const location = res.headers.location;
          if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) && location) {
            const nextUrl = location.startsWith('http') ? location : new URL(location, BASE_URL).toString();
            fetchUrl(nextUrl, redirectCount + 1)
              .then((nextRes) => {
                resolve({
                  statusCode: res.statusCode || 0,
                  headers: res.headers,
                  body: nextRes.body,
                  finalUrl: nextRes.finalUrl,
                  redirects: [location, ...nextRes.redirects],
                });
              })
              .catch(reject);
          } else {
            resolve({
              statusCode: res.statusCode || 0,
              headers: res.headers,
              body: data,
              finalUrl: targetUrl,
              redirects: [],
            });
          }
        });
      }
    );

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(25000, () => {
      req.destroy(new Error('Request timeout'));
    });

    req.end();
  });
}

function extractMeta(html: string) {
  let title = '';
  let canonical = '';
  let robots = '';

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) title = titleMatch[1].trim();

  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                         html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (canonicalMatch) canonical = canonicalMatch[1].trim();

  const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/i);
  if (robotsMatch) robots = robotsMatch[1].trim();

  return { title, canonical, robots };
}

async function runTestSuite() {
  console.log('============================================================');
  console.log('🧪 AUTOMATED MIGRATION URL TEST SUITE');
  console.log(`Target: ${BASE_URL} (Simulating host: modularhome.com)`);
  console.log('============================================================\n');

  const testCases: { path: string; expectedAction: 'RETAIN' | 'REDIRECT' | 'RETIRE'; expectedTarget?: string }[] = [
    // 1. Core Pages (RETAIN)
    { path: '/', expectedAction: 'RETAIN' },
    { path: '/buildings', expectedAction: 'RETAIN' },
    { path: '/floor-plans', expectedAction: 'RETAIN' },
    { path: '/quote', expectedAction: 'RETAIN' },
    { path: '/videos', expectedAction: 'RETAIN' },
    { path: '/about', expectedAction: 'RETAIN' },
    { path: '/contact', expectedAction: 'RETAIN' },

    // 2. Collections (RETAIN)
    { path: '/collections', expectedAction: 'RETAIN' },
    { path: '/collections/all', expectedAction: 'RETAIN' },
    { path: '/collections/cabins', expectedAction: 'RETAIN' },
    { path: '/collections/modular-homes', expectedAction: 'RETAIN' },

    // 3. Products (RETAIN)
    { path: '/products/hummingbird-hollow-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit', expectedAction: 'RETAIN' },
    { path: '/products/14-by-36-driftwood-modern-cabin-house-shell', expectedAction: 'RETAIN' },
    { path: '/products/14-by-52-sunnyside-modern-cabin-house-shell', expectedAction: 'RETAIN' },

    // 4. CMS Pages (RETAIN)
    { path: '/pages/contact', expectedAction: 'RETAIN' },
    { path: '/pages/about', expectedAction: 'RETAIN' },

    // 5. Blogs (RETAIN)
    { path: '/blogs', expectedAction: 'RETAIN' },
    { path: '/blogs/modular-cabins', expectedAction: 'RETAIN' },
    { path: '/blogs/building-guides/energy-efficiency-sip-panels', expectedAction: 'RETAIN' },
    { path: '/blogs/building-guides/barndominium-steel-kit-guide', expectedAction: 'RETAIN' },

    // 6. Shopify 301 Redirects (REDIRECT)
    { path: '/pages/the-gatlinburg-lodge', expectedAction: 'REDIRECT', expectedTarget: '/pages/the-gatlinburg-lodge-amish-built-cabin' },
    { path: '/products/grand-canyon-getaway-house-kit-1', expectedAction: 'REDIRECT', expectedTarget: '/products/grand-canyon-getaway-house-kit' },
    { path: '/collections/house-kits-prefab-home-kits', expectedAction: 'REDIRECT', expectedTarget: '/collections/house-kits' },
    { path: '/catalog', expectedAction: 'REDIRECT', expectedTarget: '/buildings' },
    { path: '/floorplans', expectedAction: 'REDIRECT', expectedTarget: '/floor-plans' },

    // 7. Non-existent URLs (RETIRE / 404)
    { path: '/products/totally-fake-product-sku-xyz-404', expectedAction: 'RETIRE' },
    { path: '/pages/totally-fake-page-xyz-404', expectedAction: 'RETIRE' },
    { path: '/collections/totally-fake-collection-404', expectedAction: 'RETIRE' },
    { path: '/blogs/news/totally-fake-article-404', expectedAction: 'RETIRE' },
  ];

  const results: UrlTestResult[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const tc of testCases) {
    try {
      const response = await fetchUrl(tc.path);
      const meta = extractMeta(response.body);

      let isPassed = false;
      let notes = '';

      if (tc.expectedAction === 'RETAIN') {
        if (response.statusCode === 200) {
          isPassed = true;
          notes = 'HTTP 200 OK — Retained URL served directly';
        } else {
          notes = `Expected 200, got ${response.statusCode}`;
        }
      } else if (tc.expectedAction === 'REDIRECT') {
        if (response.statusCode === 301 || response.statusCode === 308) {
          const loc = response.headers.location as string;
          if (!tc.expectedTarget || loc === tc.expectedTarget || loc?.endsWith(tc.expectedTarget)) {
            isPassed = true;
            notes = `301 Redirected to ${loc} -> Final Status ${response.statusCode}`;
          } else {
            notes = `Redirected to ${loc}, expected ${tc.expectedTarget}`;
          }
        } else {
          notes = `Expected 301 redirect, got ${response.statusCode}`;
        }
      } else if (tc.expectedAction === 'RETIRE') {
        if (response.statusCode === 404) {
          isPassed = true;
          notes = 'HTTP 404 Not Found — Clean genuine 404';
        } else {
          notes = `Expected 404, got ${response.statusCode}`;
        }
      }

      if (isPassed) passedCount++;
      else failedCount++;

      results.push({
        url: tc.path,
        expectedAction: tc.expectedAction,
        expectedDestination: tc.expectedTarget,
        actualStatus: response.statusCode,
        locationHeader: response.headers.location as string,
        finalStatus: response.statusCode === 200 ? 200 : (response.statusCode === 404 ? 404 : 200),
        finalUrl: response.finalUrl,
        pageTitle: meta.title,
        canonical: meta.canonical,
        robotsMeta: meta.robots,
        isPassed,
        notes,
      });

      const symbol = isPassed ? '✅' : '❌';
      console.log(`${symbol} [${tc.expectedAction}] ${tc.path.padEnd(55)} -> Status: ${response.statusCode} | Notes: ${notes}`);
    } catch (err: any) {
      failedCount++;
      console.error(`❌ [ERROR] ${tc.path}: ${err.message}`);
      results.push({
        url: tc.path,
        expectedAction: tc.expectedAction,
        actualStatus: 0,
        finalStatus: 0,
        finalUrl: tc.path,
        isPassed: false,
        notes: `Network/Server Error: ${err.message}`,
      });
    }
  }

  console.log('\n============================================================');
  console.log(`TEST SUMMARY: ${passedCount} Passed, ${failedCount} Failed (Total ${testCases.length})`);
  console.log('============================================================\n');

  fs.mkdirSync('./migration/reports', { recursive: true });
  fs.writeFileSync('./migration/reports/url_test_results.json', JSON.stringify(results, null, 2));
  console.log('Saved test results to ./migration/reports/url_test_results.json');
}

runTestSuite();
