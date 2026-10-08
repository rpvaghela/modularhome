const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, followRedirect = false) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          statusCode: res.statusCode,
          location: res.headers.location,
          contentType: res.headers['content-type'],
          dataLength: data.length,
          bodySnippet: data.substring(0, 300)
        });
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout requesting ${path}`));
    });
  });
}

async function runTests() {
  console.log('Waiting for Next.js server to be responsive...');
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await makeRequest('/');
      if (res.statusCode === 200) {
        ready = true;
        console.log('Server is online and responding!\n');
        break;
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!ready) {
    console.error('Server failed to respond within 30 seconds.');
    process.exit(1);
  }

  console.log('========================================================================');
  console.log('  RUNNING LIVE E2E HTTP TESTS ACROSS ALL URLS & REDIRECTS');
  console.log('========================================================================\n');

  const tests = [
    // 1. Core Landing Pages
    { path: '/', expectedStatus: [200], name: 'Homepage' },
    { path: '/buildings', expectedStatus: [200], name: 'Buildings / Models Catalog' },
    { path: '/collections', expectedStatus: [200], name: 'Collections Hub' },
    { path: '/collections/all', expectedStatus: [200], name: 'Collections All' },
    { path: '/collections/cabins', expectedStatus: [200], name: 'Cabins Collection' },
    { path: '/collections/modular-homes', expectedStatus: [200], name: 'Modular Homes Collection' },
    { path: '/collections/barndominiums', expectedStatus: [200], name: 'Barndominiums Collection' },
    { path: '/floor-plans', expectedStatus: [200], name: 'Floor Plans Catalog' },
    { path: '/quote', expectedStatus: [200], name: 'Interactive Quote Calculator' },
    { path: '/blogs', expectedStatus: [200], name: 'Blogs & Resources Hub' },
    { path: '/sitemap.xml', expectedStatus: [200], name: 'XML Sitemap' },
    { path: '/robots.txt', expectedStatus: [200], name: 'Robots.txt' },

    // 2. Direct Canonical Category Product Routes
    { path: '/cabins/el-chapo-muchacho', expectedStatus: [200], name: 'Cabin: El Chapo Muchacho' },
    { path: '/modular-homes/the-farmhouse-charm-new-model', expectedStatus: [200], name: 'Modular Home: The Farmhouse Charm' },
    { path: '/barndominiums/the-grey-haven-barndo-house-kit', expectedStatus: [200], name: 'Barndominium: The Grey Haven' },
    { path: '/cabins/the-sparrow-cabin-luxury-log-home-kit', expectedStatus: [200], name: 'Cabin: The Sparrow Cabin (6,240 Sq Ft)' },
    { path: '/house-kits/hummingbird-hollow-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit', expectedStatus: [200], name: 'House Kit: Hummingbird Hollow' },

    // 3. 301 Permanent Redirects for Legacy /buildings/ URLs
    { 
      path: '/buildings/el-chapo-muchacho', 
      expectedStatus: [301, 308], 
      expectedLocation: '/cabins/el-chapo-muchacho',
      name: '301 Redirect: /buildings/el-chapo-muchacho' 
    },
    { 
      path: '/buildings/the-farmhouse-charm-new-model', 
      expectedStatus: [301, 308], 
      expectedLocation: '/modular-homes/the-farmhouse-charm-new-model',
      name: '301 Redirect: /buildings/the-farmhouse-charm-new-model' 
    },
    { 
      path: '/buildings/the-grey-haven-barndo-house-kit', 
      expectedStatus: [301, 308], 
      expectedLocation: '/barndominiums/the-grey-haven-barndo-house-kit',
      name: '301 Redirect: /buildings/the-grey-haven-barndo-house-kit' 
    },

    // 4. 301 Permanent Redirects for Legacy Shopify /products/ URLs
    { 
      path: '/products/el-chapo-muchacho', 
      expectedStatus: [301, 308], 
      expectedLocation: '/cabins/el-chapo-muchacho',
      name: '301 Redirect: /products/el-chapo-muchacho' 
    },
    { 
      path: '/products/the-sparrow-cabin-luxury-log-home-kit', 
      expectedStatus: [301, 308], 
      expectedLocation: '/cabins/the-sparrow-cabin-luxury-log-home-kit',
      name: '301 Redirect: /products/the-sparrow-cabin-luxury-log-home-kit' 
    },
    { 
      path: '/products/the-farmhouse-charm-new-model', 
      expectedStatus: [301, 308], 
      expectedLocation: '/modular-homes/the-farmhouse-charm-new-model',
      name: '301 Redirect: /products/the-farmhouse-charm-new-model' 
    },
    { 
      path: '/products/the-grey-haven-barndo-house-kit', 
      expectedStatus: [301, 308], 
      expectedLocation: '/barndominiums/the-grey-haven-barndo-house-kit',
      name: '301 Redirect: /products/the-grey-haven-barndo-house-kit' 
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const res = await makeRequest(t.path);
      const isStatusOk = t.expectedStatus.includes(res.statusCode);
      const isLocationOk = !t.expectedLocation || (res.location && (res.location.endsWith(t.expectedLocation) || res.location === t.expectedLocation));

      if (isStatusOk && isLocationOk) {
        passed++;
        const targetInfo = res.location ? ` -> ${res.location}` : ` (${res.dataLength} bytes)`;
        console.log(`[PASS] ${t.name.padEnd(50)} HTTP ${res.statusCode}${targetInfo}`);
      } else {
        failed++;
        console.error(`[FAIL] ${t.name.padEnd(50)} Expected ${t.expectedStatus.join('/')} ${t.expectedLocation || ''}, Got ${res.statusCode} (Location: ${res.location})`);
      }
    } catch (e) {
      failed++;
      console.error(`[ERROR] ${t.name.padEnd(50)} Request error: ${e.message}`);
    }
  }

  console.log('\n========================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================================');

  if (failed > 0) process.exit(1);
}

runTests();
