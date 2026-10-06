const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function main() {
  console.log('Inspecting source files for URL inventory...');

  // 1. Products.csv
  const productHandles = new Map();
  if (fs.existsSync('migration/source/Products.csv')) {
    const rl = readline.createInterface({
      input: fs.createReadStream('migration/source/Products.csv'),
      crlfDelay: Infinity,
    });

    let headerLine = null;
    let handleIdx = -1;
    let titleIdx = -1;
    let topRowIdx = -1;

    for await (const line of rl) {
      if (!headerLine) {
        headerLine = line;
        // Parse CSV header
        const headers = line.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
        handleIdx = headers.indexOf('Handle');
        titleIdx = headers.indexOf('Title');
        topRowIdx = headers.indexOf('Top Row');
        continue;
      }

      // Simple CSV line parser
      const cols = [];
      let inQuote = false;
      let cur = '';
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          inQuote = !inQuote;
        } else if (c === ',' && !inQuote) {
          cols.push(cur);
          cur = '';
        } else {
          cur += c;
        }
      }
      cols.push(cur);

      const handle = (cols[handleIdx] || '').replace(/^["']|["']$/g, '').trim().toLowerCase();
      const title = (cols[titleIdx] || '').replace(/^["']|["']$/g, '').trim();
      const isTop = (cols[topRowIdx] || '').replace(/^["']|["']$/g, '').trim();

      if (handle && (!productHandles.has(handle) || (title && !productHandles.get(handle)))) {
        productHandles.set(handle, title || handle);
      }
    }
  }
  console.log(`Products.csv: ${productHandles.size} unique handles`);

  // 2. Collections.csv
  const collectionHandles = new Map();
  if (fs.existsSync('migration/source/Collections.csv')) {
    const rl = readline.createInterface({
      input: fs.createReadStream('migration/source/Collections.csv'),
      crlfDelay: Infinity,
    });

    let headerLine = null;
    let handleIdx = -1;
    let titleIdx = -1;

    for await (const line of rl) {
      if (!headerLine) {
        headerLine = line;
        const headers = line.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
        handleIdx = headers.indexOf('Handle');
        titleIdx = headers.indexOf('Title');
        continue;
      }

      const cols = line.split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
      const handle = (cols[handleIdx] || '').toLowerCase();
      const title = cols[titleIdx] || '';
      if (handle && !collectionHandles.has(handle)) {
        collectionHandles.set(handle, title || handle);
      }
    }
  }
  console.log(`Collections.csv: ${collectionHandles.size} unique collection handles`);

  // 3. Pages.csv
  const pageHandles = new Map();
  if (fs.existsSync('migration/source/Pages.csv')) {
    const rl = readline.createInterface({
      input: fs.createReadStream('migration/source/Pages.csv'),
      crlfDelay: Infinity,
    });

    let headerLine = null;
    let handleIdx = -1;
    let titleIdx = -1;

    for await (const line of rl) {
      if (!headerLine) {
        headerLine = line;
        const headers = line.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
        handleIdx = headers.indexOf('Handle');
        titleIdx = headers.indexOf('Title');
        continue;
      }

      const cols = line.split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
      const handle = (cols[handleIdx] || '').toLowerCase();
      const title = cols[titleIdx] || '';
      if (handle && !pageHandles.has(handle)) {
        pageHandles.set(handle, title || handle);
      }
    }
  }
  console.log(`Pages.csv: ${pageHandles.size} unique page handles`);

  // 4. Redirects
  const redirects = JSON.parse(fs.readFileSync('src/data/shopify_redirects.json', 'utf8'));
  console.log(`shopify_redirects.json: ${Object.keys(redirects).length} redirects`);
}

main().catch(console.error);
