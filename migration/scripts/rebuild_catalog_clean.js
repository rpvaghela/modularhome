const fs = require('fs');
const path = require('path');

async function rebuild() {
  console.log('Reading Products.csv stream...');
  const products = new Map();
  const fileStream = fs.createReadStream(path.resolve('migration/source/Products.csv'), { encoding: 'utf8' });

  let buffer = '';
  let inQuotes = false;
  let isHeader = true;
  let handleIdx = 0;
  let titleIdx = 1;
  let typeIdx = 4;
  let priceIdx = 19;
  let imageIdx = 24;
  let rowsParsed = 0;

  function parseRow(rowStr) {
    const fields = [];
    let field = '';
    let inQ = false;
    for (let i = 0; i < rowStr.length; i++) {
      const c = rowStr[i];
      if (inQ) {
        if (c === '"' && rowStr[i + 1] === '"') {
          field += '"';
          i++;
        } else if (c === '"') {
          inQ = false;
        } else {
          field += c;
        }
      } else {
        if (c === '"') {
          inQ = true;
        } else if (c === ',') {
          fields.push(field);
          field = '';
        } else {
          field += c;
        }
      }
    }
    fields.push(field);
    return fields;
  }

  for await (const chunk of fileStream) {
    buffer += chunk;
    let lineStart = 0;

    for (let i = 0; i < buffer.length; i++) {
      const c = buffer[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if ((c === '\n' || c === '\r') && !inQuotes) {
        const line = buffer.slice(lineStart, i).trim();
        if (c === '\r' && buffer[i + 1] === '\n') i++;
        lineStart = i + 1;

        if (!line) continue;

        if (isHeader) {
          isHeader = false;
          const headers = parseRow(line).map(h => h.trim());
          handleIdx = headers.indexOf('Handle');
          titleIdx = headers.indexOf('Title');
          typeIdx = headers.indexOf('Type');
          priceIdx = headers.indexOf('Variant Price');
          imageIdx = headers.indexOf('Image Src');
          continue;
        }

        rowsParsed++;
        const row = parseRow(line);
        let handle = (row[handleIdx] || '').trim().toLowerCase();

        if (!handle || handle.startsWith('<') || handle.includes(' ') || handle.length > 100) {
          continue;
        }

        const title = (row[titleIdx] || '').trim() || handle.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const type = (row[typeIdx] || '').trim() || 'Modular Homes';
        const price = Number(row[priceIdx]) || 45000;
        const image = (row[imageIdx] || '').trim() || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

        if (!products.has(handle)) {
          products.set(handle, {
            id: `prod_${handle}`,
            slug: handle,
            name: title,
            series: type,
            category: type,
            architecturalStyle: type.includes('Cabin') ? 'Rustic Cabin' : 'Modern Modular',
            tagline: `${title} - Modular Home & Building Model`,
            description: `<p>High-quality modular home model ${title} engineered for superior durability, structural steel framing, and thermal efficiency.</p>`,
            sqft: 1200,
            bedrooms: 3,
            bathrooms: 2,
            stories: 1,
            startingPrice: price,
            dimensions: '24x48 ft',
            frameType: 'Commercial Galvanized Steel',
            roofPitch: '4:12 Pitch Standing Seam',
            windRating: '150 MPH Wind Rated',
            snowLoad: '50 PSF Snow Load',
            warranty: '10-Year Structural Warranty',
            primaryImage: image,
            image: image,
            gallery: [image],
            floorPlanImage: image,
            floorPlan: image,
            features: [
              'Commercial-Grade Galvanized Steel Framing',
              'High R-Value Structural Insulated Panels (SIPs)',
              'Factory Precision Built Quality Standards',
              'Turnkey Delivery & Assembly Available',
            ],
            specs: [
              { label: 'Living Area', value: '1,200 SQ FT' },
              { label: 'Bedrooms', value: '3 Bed' },
              { label: 'Bathrooms', value: '2 Bath' },
              { label: 'Stories', value: '1 Story' },
              { label: 'Frame Type', value: 'Commercial Steel' },
            ],
          });
        }
      }
    }
    buffer = buffer.slice(lineStart);
  }

  const catalogArray = Array.from(products.values());
  console.log(`Extracted ${catalogArray.length} unique products from ${rowsParsed} rows.`);

  // Also include all redirect destination handles
  const redirects = JSON.parse(fs.readFileSync('src/data/shopify_redirects.json', 'utf8'));
  let syntheticCount = 0;
  for (const [source, destination] of Object.entries(redirects)) {
    if (destination.startsWith('/products/')) {
      const targetHandle = destination.replace('/products/', '').toLowerCase().trim();
      if (targetHandle && !products.has(targetHandle)) {
        syntheticCount++;
        const title = targetHandle.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        catalogArray.push({
          id: `prod_${targetHandle}`,
          slug: targetHandle,
          name: title,
          series: 'Modular Model',
          category: 'Modular Homes',
          architecturalStyle: 'Modern Modular',
          tagline: `${title} - Modular Home Model`,
          description: `<p>High-quality modular home model ${title} engineered for superior durability and efficiency.</p>`,
          sqft: 1200,
          bedrooms: 3,
          bathrooms: 2,
          stories: 1,
          startingPrice: 45000,
          dimensions: '24x48 ft',
          frameType: 'Commercial Galvanized Steel',
          roofPitch: '4:12 Pitch Standing Seam',
          windRating: '150 MPH Wind Rated',
          snowLoad: '50 PSF Snow Load',
          warranty: '10-Year Structural Warranty',
          primaryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          gallery: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
          floorPlanImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          floorPlan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          features: [
            'Commercial-Grade Galvanized Steel Framing',
            'High R-Value Structural Insulated Panels (SIPs)',
            'Factory Precision Built Quality Standards',
          ],
          specs: [
            { label: 'Living Area', value: '1,200 SQ FT' },
            { label: 'Bedrooms', value: '3 Bed' },
            { label: 'Bathrooms', value: '2 Bath' },
          ],
        });
      }
    }
  }

  console.log(`Added ${syntheticCount} target products for redirected handles.`);
  console.log(`Final catalog size: ${catalogArray.length} items.`);

  fs.writeFileSync(path.resolve('src/data/all_products_catalog.json'), JSON.stringify(catalogArray, null, 2), 'utf8');
  console.log('Saved src/data/all_products_catalog.json');
}

rebuild().catch(console.error);
