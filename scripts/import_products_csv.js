const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function processProductsCsv() {
  const csvPath = path.join(__dirname, '..', 'migration', 'source', 'Products.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('Products.csv not found at:', csvPath);
    return;
  }

  console.log('Reading and parsing Products.csv with streaming quote-balanced parser...');
  const fileStream = fs.createReadStream(csvPath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let headers = [];
  let isHeader = true;
  let pendingRecord = '';
  let inQuotes = false;
  const productsMap = new Map();

  function parseCsvRecord(recordStr) {
    const fields = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < recordStr.length; i++) {
      const c = recordStr[i];
      const next = recordStr[i + 1];
      if (c === '"') {
        if (inQ && next === '"') {
          cur += '"';
          i++;
        } else {
          inQ = !inQ;
        }
      } else if (c === ',' && !inQ) {
        fields.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    fields.push(cur);
    return fields;
  }

  // Helper to determine product category
  function determineCategory(type, title, tags, collections) {
    const mainText = `${type || ''} ${title || ''}`.toLowerCase();
    
    if (mainText.includes('park model') || mainText.includes('rv park model')) {
      return 'Park Models';
    }
    if (mainText.includes('barndominium') || mainText.includes('barndo') || mainText.includes('shop house') || mainText.includes('shop home')) {
      return 'Barndominiums';
    }
    if (mainText.includes('a-frame') || mainText.includes('aframe')) {
      return 'A-Frames';
    }
    if (mainText.includes('granny pod') || mainText.includes('adu') || mainText.includes('secondary dwelling') || mainText.includes('backyard suite')) {
      return 'ADUs & Granny Pods';
    }
    if (mainText.includes('tiny home') || mainText.includes('micro home') || mainText.includes('tiny house') || mainText.includes('tiny tim')) {
      return 'Tiny Homes';
    }
    if (mainText.includes('commercial building') || mainText.includes('commercial warehouse') || mainText.includes('retail office')) {
      return 'Commercial';
    }
    if (mainText.includes('house kit') || mainText.includes('metal house kit') || mainText.includes('steel house kit') || mainText.includes('home kit') || mainText.includes('sip panel')) {
      return 'House Kits';
    }
    if (mainText.includes('cabin') || mainText.includes('log home') || mainText.includes('timber frame') || mainText.includes('rustic') || mainText.includes('modern cabin')) {
      return 'Cabins';
    }
    if (mainText.includes('modular') || mainText.includes('prefab') || mainText.includes('panelized') || mainText.includes('rancher') || mainText.includes('craftsman') || mainText.includes('bungalow') || mainText.includes('chalet') || mainText.includes('cottage')) {
      return 'Modular Homes';
    }
    return 'Modular Homes';
  }

  // Helper to extract sqft, dimensions, bedrooms, bathrooms from text
  function extractSpecs(title, body) {
    const combined = `${title || ''} ${body || ''}`;
    let sqft = 0;
    let dimensions = '';
    let bedrooms = 0;
    let bathrooms = 0;

    // Sqft regex
    const sqftMatch = combined.match(/(\d{3,4}(?:,\d{3})?)\s*(?:sq(?:uare)?\.?\s*ft|sqft|square\s*feet)/i);
    if (sqftMatch) {
      sqft = parseInt(sqftMatch[1].replace(/,/g, ''), 10);
    }

    // Dimensions regex (e.g. 14 by 40, 14x40, 28x48, 14' x 40')
    const dimMatch = combined.match(/(\d{2,3})\s*(?:by|x|'|\s*x\s*)\s*(\d{2,3})/i);
    if (dimMatch) {
      dimensions = `${dimMatch[1]}x${dimMatch[2]} ft`;
      if (sqft === 0) {
        sqft = parseInt(dimMatch[1], 10) * parseInt(dimMatch[2], 10);
      }
    }

    // Beds regex
    const bedMatch = combined.match(/(\d+)\s*(?:bed(?:room)?s?)/i);
    if (bedMatch) {
      bedrooms = parseInt(bedMatch[1], 10);
    }

    // Baths regex
    const bathMatch = combined.match(/(\d+(?:\.\d+)?)\s*(?:bath(?:room)?s?)/i);
    if (bathMatch) {
      bathrooms = Math.round(parseFloat(bathMatch[1]));
    }

    return { sqft, dimensions, bedrooms, bathrooms };
  }

  for await (const line of rl) {
    if (!pendingRecord) {
      pendingRecord = line;
    } else {
      pendingRecord += '\n' + line;
    }

    let qCount = 0;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') qCount++;
    }
    if (qCount % 2 !== 0) {
      inQuotes = !inQuotes;
    }

    if (inQuotes) continue;

    const cells = parseCsvRecord(pendingRecord);
    pendingRecord = '';

    if (isHeader) {
      headers = cells.map(h => h.replace(/^\uFEFF/, '').trim());
      isHeader = false;
      continue;
    }

    const row = {};
    headers.forEach((h, i) => {
      let val = cells[i] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      row[h] = val;
    });

    const handle = row['Handle']?.toLowerCase().trim();
    if (!handle) continue;

    if (!productsMap.has(handle)) {
      const title = row['Title'] || handle.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const body = row['Body HTML'] || '';
      const type = row['Type'] || '';
      const tags = row['Tags'] || '';
      const collections = row['Collections'] || row['Custom Collections'] || '';
      const category = determineCategory(type, title, tags, collections);
      const specs = extractSpecs(title, body);

      productsMap.set(handle, {
        id: row['ID'] || `prod-${handle}`,
        handle: handle,
        slug: handle,
        name: title,
        title: title,
        description: body,
        category: category,
        series: type || 'Essential Series',
        sqft: specs.sqft,
        dimensions: specs.dimensions || 'Custom Dimensions',
        bedrooms: specs.bedrooms,
        bathrooms: specs.bathrooms,
        stories: 1,
        startingPrice: 0,
        images: [],
        primaryImage: '',
        floorPlanImage: '',
        variants: [],
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        collections: collections ? collections.split(',').map(c => c.trim()).filter(Boolean) : [],
      });
    }

    const prod = productsMap.get(handle);

    // Collect image
    const imageSrc = row['Image Src'];
    if (imageSrc && !prod.images.includes(imageSrc) && !imageSrc.includes('newmodularlogo')) {
      prod.images.push(imageSrc);
      if (!prod.primaryImage) {
        prod.primaryImage = imageSrc;
      }
      // Check if image is specifically a floor plan
      const lowerSrc = imageSrc.toLowerCase();
      if (
        (lowerSrc.includes('floor-plan') || lowerSrc.includes('floorplan') || lowerSrc.includes('blueprint') || lowerSrc.includes('cad') || lowerSrc.includes('schematic')) &&
        !prod.floorPlanImage
      ) {
        prod.floorPlanImage = imageSrc;
      }
    }

    // Collect variant
    const variantPrice = parseFloat(row['Variant Price']);
    const opt1Val = row['Option1 Value'];
    const opt2Val = row['Option2 Value'];
    const optTitle = [opt1Val, opt2Val].filter(v => v && v !== 'Default Title').join(' / ') || 'Standard Build Package';

    if (!isNaN(variantPrice) && variantPrice > 0) {
      const varId = row['Variant ID'] || `var-${prod.variants.length + 1}`;
      const existingVar = prod.variants.find(v => v.id === varId || v.title === optTitle);
      if (!existingVar) {
        prod.variants.push({
          id: varId,
          title: optTitle,
          price: variantPrice,
          sku: row['Variant SKU'] || '',
          available: true,
          option1: opt1Val || undefined,
          option2: opt2Val || undefined,
          compareAtPrice: parseFloat(row['Variant Compare At Price']) || undefined,
        });
      }
      if (prod.startingPrice === 0 || variantPrice < prod.startingPrice) {
        prod.startingPrice = variantPrice;
      }
    }
  }

  // Process and finalize all products
  const allProducts = Array.from(productsMap.values())
    .filter(p => {
      const lowerName = (p.name || '').toLowerCase();
      if (lowerName.includes('greeting card') || lowerName.includes('end table') || lowerName.includes('coffee table')) {
        return false;
      }
      return true;
    })
    .map(p => {
    // Specific curated overrides for sample products
    if (p.slug === 'azteca-modern-cabin-14-by-40' || p.slug.includes('azteca')) {
      p.sqft = 560;
      p.dimensions = '14x40 ft';
      p.bedrooms = 2;
      p.bathrooms = 1;
      p.category = 'Cabins';
      p.floorPlanImage = ''; // Clean fallback
      p.variants = [
        { id: 'azteca-shell', title: '14x40 Shell Only Package', price: 33900, available: true },
        { id: 'azteca-2b1b', title: '14x40 2 Bed 1 Bath Turnkey Finished', price: 120000, available: true },
        { id: 'azteca-2b2b', title: '14x40 2 Bed 2 Bath Turnkey Finished', price: 135000, available: true },
      ];
      p.startingPrice = 33900;
    }

    if (p.slug.includes('country-rancher')) {
      p.sqft = 1144;
      p.dimensions = '28x48 ft + 8x45 ft Porch (1,504 Total Footprint)';
      p.bedrooms = 3;
      p.bathrooms = 2;
      p.category = 'Cabins';
      p.floorPlanImage = '';
      p.variants = [
        { id: 'rancher-1bed', title: '1 Bed 1 Bath Configuration', price: 79000, available: true },
        { id: 'rancher-2bed', title: '2 Bed 1 Bath Configuration', price: 89000, available: true },
        { id: 'rancher-3bed2b-shell', title: '3 Bed 2 Bath Shell', price: 98000, available: true },
        { id: 'rancher-3bed2b-turnkey', title: '3 Bed 2 Bath Turnkey Move-In Ready', price: 165000, available: true },
      ];
      p.startingPrice = 79000;
    }

    if (p.variants.length === 0 && p.startingPrice > 0) {
      p.variants.push({
        id: `var-${p.id}`,
        title: 'Standard Build Package',
        price: p.startingPrice,
        available: true,
      });
    }

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      title: p.title,
      description: p.description,
      category: p.category,
      series: p.series,
      sqft: p.sqft,
      dimensions: p.dimensions,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      stories: p.stories,
      startingPrice: p.startingPrice,
      primaryImage: p.primaryImage || (p.images[0] || ''),
      gallery: p.images,
      floorPlanImage: p.floorPlanImage,
      variants: p.variants,
      tags: p.tags,
      collections: p.collections,
    };
  });

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'all_products_catalog.json');
  fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), 'utf8');
  console.log(`Successfully parsed and saved ${allProducts.length} products to all_products_catalog.json!`);

  // Print category breakdown
  const counts = {};
  allProducts.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  console.log('Product category breakdown:\n', counts);
}

processProductsCsv().catch(console.error);
