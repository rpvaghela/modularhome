const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function buildFullCatalog() {
  console.log('Building full products catalog from migration/source/Products.csv...');

  const rl = readline.createInterface({
    input: fs.createReadStream('migration/source/Products.csv'),
    crlfDelay: Infinity,
  });

  let headerLine = null;
  let headers = [];
  let handleIdx = -1;
  let titleIdx = -1;
  let bodyIdx = -1;
  let typeIdx = -1;
  let vendorIdx = -1;
  let priceIdx = -1;
  let imageIdx = -1;
  let topRowIdx = -1;

  const productMap = new Map();

  for await (const line of rl) {
    if (!headerLine) {
      headerLine = line;
      headers = line.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
      handleIdx = headers.indexOf('Handle');
      titleIdx = headers.indexOf('Title');
      bodyIdx = headers.indexOf('Body HTML');
      typeIdx = headers.indexOf('Type');
      vendorIdx = headers.indexOf('Vendor');
      priceIdx = headers.indexOf('Variant Price');
      imageIdx = headers.indexOf('Image Src');
      topRowIdx = headers.indexOf('Top Row');
      continue;
    }

    // CSV line parser
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
    const body = (cols[bodyIdx] || '').replace(/^["']|["']$/g, '').trim();
    const type = (cols[typeIdx] || '').replace(/^["']|["']$/g, '').trim() || 'Modular Homes';
    const vendor = (cols[vendorIdx] || '').replace(/^["']|["']$/g, '').trim() || 'ModularHome';
    const priceStr = (cols[priceIdx] || '').replace(/^["']|["']$/g, '').trim();
    const image = (cols[imageIdx] || '').replace(/^["']|["']$/g, '').trim();
    const isTop = (cols[topRowIdx] || '').replace(/^["']|["']$/g, '').trim().toLowerCase() === 'true';

    if (!handle) continue;

    if (!productMap.has(handle)) {
      // Parse SQFT from title or body
      let sqft = 0;
      const sqftMatch = (title + ' ' + body).match(/(\d[\d,]*)\s*(?:sq(?:uare)?\.?\s*ft|sqft)/i);
      if (sqftMatch) {
        sqft = parseInt(sqftMatch[1].replace(/,/g, ''), 10);
      }

      // Parse dimensions e.g. 14x36 or 14 by 36
      let dimensions = '';
      const dimMatch = title.match(/(\d+)\s*(?:by|x|\*)\s*(\d+)/i);
      if (dimMatch) {
        dimensions = `${dimMatch[1]}x${dimMatch[2]} ft`;
      }

      const price = parseFloat(priceStr) || (sqft > 0 ? sqft * 110 : 49500);

      const isCabin = handle.includes('cabin') || title.toLowerCase().includes('cabin') || type.toLowerCase().includes('cabin');
      const defaultImg = isCabin
        ? 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345'
        : 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/yellowstone_1.jpg?v=1732331743';

      productMap.set(handle, {
        id: `prod_${handle}`,
        slug: handle,
        name: title || handle,
        series: isCabin ? 'Timber & Cabin Series' : 'Architectural Series',
        category: type,
        architecturalStyle: isCabin ? 'Rustic Cabin' : 'Modern Homes',
        tagline: sqft > 0 ? `${sqft} SQ FT Precision Engineered Model` : 'Turnkey Modular Home Kit',
        description: body || `<p>The <strong>${title || handle}</strong> is an engineered modular home model precision-crafted for structural durability and energy efficiency.</p>`,
        sqft: sqft || 680,
        bedrooms: sqft > 1200 ? 3 : sqft > 600 ? 2 : 1,
        bathrooms: sqft > 1200 ? 2 : 1,
        stories: title.toLowerCase().includes('two story') || title.toLowerCase().includes('2-story') ? 2 : 1,
        startingPrice: price,
        dimensions: dimensions || '24x36 ft',
        frameType: isCabin ? 'Heavy Timber & Milled Solid Log Wall System' : '100% Commercial-Grade Galvanized Light Gauge Steel',
        roofPitch: '4:12 Pitch',
        windRating: 'Up to 150 MPH',
        snowLoad: '50 PSF Ground Snow Load Rated',
        warranty: '50-Year Structural Frame Warranty',
        primaryImage: image || defaultImg,
        image: image || defaultImg,
        gallery: image ? [image] : [defaultImg],
        floorPlanImage: '',
        features: [
          'Precision Commercial-Grade Framing',
          'Energy-Efficient High-R Value Insulation',
          'Engineered for Extreme Weather',
          'Turnkey Assembly Documentation',
        ],
        specs: [
          { label: 'Living Area', value: `${sqft || 680} SQ FT` },
          { label: 'Dimensions', value: dimensions || '24x36 ft' },
          { label: 'Warranty', value: '50-Year Structural Frame Warranty' },
        ],
        customizableOptions: [],
      });
    } else {
      // Append gallery image if present
      const existing = productMap.get(handle);
      if (image && !existing.gallery.includes(image)) {
        existing.gallery.push(image);
      }
    }
  }

  const allProducts = Array.from(productMap.values());
  console.log(`Generated ${allProducts.length} complete product models.`);

  const outPath = path.resolve('src/data/all_products_catalog.json');
  fs.writeFileSync(outPath, JSON.stringify(allProducts, null, 2), 'utf8');
  console.log(`Saved full product catalog to: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}

buildFullCatalog().catch(console.error);
