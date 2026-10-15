async function test() {
  const urls = [
    'http://localhost:3000/commercial-buildings/',
    'http://localhost:3000/commercial-buildings',
    'http://localhost:3000/collections/barndominiums',
    'http://localhost:3000/collections/prefab-homes',
    'http://localhost:3000/products/el-chapo-muchacho',
    'http://localhost:3000/buildings/el-chapo-muchacho',
    'http://localhost:3000/products/farmhouse-metal-house-kit-1',
    'http://localhost:3000/house-kits/farmhouse-metal-house-kit-1'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { redirect: 'manual' });
      const location = res.headers.get('location');
      console.log(`${url}\n  Status: ${res.status} | Location: ${location}`);
    } catch (err: any) {
      console.log(`${url}\n  Error: ${err.message}`);
    }
  }
}

test().catch(console.error);
