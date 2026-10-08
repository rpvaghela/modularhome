const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../src/data/all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseMoney(val) {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}

const cleanedCatalog = catalog.map((item) => {
  const rawHtml = item.description || item.description_html || item.body_html || '';
  const plainText = cleanHtml(rawHtml);
  const title = (item.title || item.name || '').trim();
  const slug = (item.slug || item.handle || item.id || '').trim().toLowerCase();

  // Strip footer boilerplate before spec search
  let relevantText = plainText;
  const boilerplateIdx = relevantText.search(/Discover our wide array|Explore our expansive selection|Check out our other|Browse our full collection|Due to high demand, the current turnaround|📞 To order|Amish Built Cabins proudly ships/i);
  if (boilerplateIdx !== -1) {
    relevantText = relevantText.substring(0, boilerplateIdx);
  }

  // 1. Resolve SQFT
  let sqft = null;

  // Title sqft
  const titleSqftMatch = title.match(/(\d{1,2},\d{3}|\d{2,5})\s*(?:sq\.?\s*ft\.?|sqft|square\s*feet|square\s*foot|sf\b)/i);
  if (titleSqftMatch) {
    const num = parseInt(titleSqftMatch[1].replace(/,/g, ''), 10);
    if (num >= 50 && num <= 25000) sqft = num;
  }

  // Summary bullet line in description
  if (!sqft) {
    const summaryMatch = relevantText.match(/(?:^|[\n\.\-·|•])\s*(?:[^\n\.\-·|•]*?·\s*)*(\d{1,2},\d{3}|\d{2,5})\s*(?:sq\.?\s*ft\.?|sqft|square\s*feet|square\s*foot|sf\b)/i);
    if (summaryMatch) {
      const num = parseInt(summaryMatch[1].replace(/,/g, ''), 10);
      if (num >= 50 && num <= 25000) sqft = num;
    }
  }

  // First 400 characters
  if (!sqft) {
    const topDesc = relevantText.substring(0, 400);
    const topSqftMatch = topDesc.match(/(\d{1,2},\d{3}|\d{2,5})\s*(?:sq\.?\s*ft\.?|sqft|square\s*feet|square\s*foot|sf\b)/i);
    if (topSqftMatch) {
      const num = parseInt(topSqftMatch[1].replace(/,/g, ''), 10);
      if (num >= 50 && num <= 25000) sqft = num;
    }
  }

  // Dimensions extraction
  let dimensions = item.dimensions || '';
  const dimMatch = (title + ' ' + relevantText).match(/(\d{2})\s*(?:by|x|\*|\'|ft\.?|’|′|X)\s*(\d{2,3})/i);
  if (dimMatch) {
    const d1 = parseInt(dimMatch[1], 10);
    const d2 = parseInt(dimMatch[2], 10);
    if (d1 >= 10 && d1 <= 100 && d2 >= 10 && d2 <= 200) {
      dimensions = `${d1}x${d2} ft`;
      if (!sqft) sqft = d1 * d2;
    }
  }

  if (!sqft) {
    if (item.sqft && item.sqft >= 50 && item.sqft <= 25000) {
      sqft = item.sqft;
    } else {
      sqft = 720;
    }
  }

  // 2. Resolve Bedrooms & Bathrooms & Stories
  let bedrooms = item.bedrooms;
  const bedMatch = (title + ' ' + relevantText).match(/(\d+)\s*(?:bed|bedroom|br\b)/i);
  if (bedMatch) {
    bedrooms = parseInt(bedMatch[1], 10);
  } else if (/studio|open concept/i.test(title + ' ' + relevantText)) {
    bedrooms = 0;
  } else if (!bedrooms || isNaN(bedrooms)) {
    bedrooms = sqft >= 1800 ? 3 : sqft >= 800 ? 2 : 1;
  }

  let bathrooms = item.bathrooms;
  const bathMatch = (title + ' ' + relevantText).match(/(\d+(?:\.\d+)?)\s*(?:bath|bathroom|ba\b)/i);
  if (bathMatch) {
    bathrooms = parseFloat(bathMatch[1]);
  } else if (!bathrooms || isNaN(bathrooms)) {
    bathrooms = sqft >= 2000 ? 2.5 : sqft >= 1000 ? 2 : 1;
  }

  let stories = item.stories;
  const storyMatch = (title + ' ' + relevantText).match(/(\d+)\s*(?:story|stories|floor|floors|level|levels)/i);
  if (storyMatch) {
    stories = parseInt(storyMatch[1], 10);
  } else if (!stories || isNaN(stories)) {
    stories = /loft|2-story|two story|two-story|3-story|three story/i.test(title + ' ' + relevantText) ? 2 : 1;
  }

  // 3. Resolve Pricing & Variants
  const rawVariants = item.product_variants || item.variants || [];
  let minVariantPrice = 0;
  const formattedVariants = rawVariants.map((v, idx) => {
    const vPrice = parseMoney(v.price || v.starting_price || item.price || item.starting_price);
    if (vPrice > 0 && (minVariantPrice === 0 || vPrice < minVariantPrice)) {
      minVariantPrice = vPrice;
    }
    return {
      id: String(v.id || `var-${slug}-${idx + 1}`),
      title: (v.title || v.name || 'Standard Build Package').trim(),
      price: vPrice || 49500,
      sku: v.sku || '',
      available: v.available !== false,
      option1: v.option1 || v.title || 'Standard',
      option2: v.option2 || undefined,
      compareAtPrice: v.compare_at_price ? parseMoney(v.compare_at_price) : undefined
    };
  });

  if (minVariantPrice === 0) {
    const priceMatch = relevantText.match(/price:?\s*\$([0-9,]+)/i) || relevantText.match(/\$([0-9]{2,3},[0-9]{3})/);
    if (priceMatch) {
      minVariantPrice = parseMoney(priceMatch[1]);
    }
  }

  if (minVariantPrice === 0) {
    minVariantPrice = parseMoney(item.starting_price || item.price) || 49500;
  }

  if (formattedVariants.length === 0) {
    formattedVariants.push({
      id: `var-${slug}-std`,
      title: 'Standard Build Package',
      price: minVariantPrice,
      available: true,
      option1: 'Standard Build Package'
    });
  }

  // 4. Resolve Canonical Category with Title-First Specificity
  const titleLower = title.toLowerCase();
  const slugLower = slug.toLowerCase();
  const titleAndSlug = `${titleLower} ${slugLower}`;

  let finalCategory = 'Modular Homes';

  if (titleAndSlug.includes('barndo') || titleAndSlug.includes('barndominium')) {
    finalCategory = 'Barndominiums';
  } else if (
    titleAndSlug.includes('cabin') ||
    titleAndSlug.includes('log home') ||
    titleAndSlug.includes('timber') ||
    slugLower.includes('muchacho') ||
    slugLower.includes('sparrow') ||
    slugLower.includes('bertha') ||
    slugLower.includes('lodge') ||
    slugLower.includes('gatlinburg') ||
    slugLower.includes('appalachian')
  ) {
    finalCategory = 'Cabins';
  } else if (titleAndSlug.includes('tiny home') || titleAndSlug.includes('tiny house') || slugLower.includes('tiny')) {
    finalCategory = 'Tiny Homes';
  } else if (titleAndSlug.includes('park model') || titleAndSlug.includes('rv')) {
    finalCategory = 'Park Models';
  } else if (titleAndSlug.includes('adu') || titleAndSlug.includes('granny pod') || titleAndSlug.includes('in-law') || titleAndSlug.includes('guest house')) {
    finalCategory = 'ADUs & Granny Pods';
  } else if (titleAndSlug.includes('a-frame') || titleAndSlug.includes('aframe')) {
    finalCategory = 'A-Frame Homes';
  } else if (
    titleAndSlug.includes('sip panel') ||
    titleAndSlug.includes('panelized') ||
    titleAndSlug.includes('house kit') ||
    titleAndSlug.includes('home kit') ||
    slugLower.includes('house-kit')
  ) {
    finalCategory = 'House Kits';
  } else if (titleAndSlug.includes('commercial') || titleAndSlug.includes('warehouse') || titleAndSlug.includes('office building')) {
    finalCategory = 'Commercial Buildings';
  } else if (titleAndSlug.includes('custom home') || titleAndSlug.includes('custom-designed')) {
    finalCategory = 'Custom Homes';
  } else if (titleAndSlug.includes('farmhouse') || titleAndSlug.includes('modular') || titleAndSlug.includes('prefab')) {
    finalCategory = 'Modular Homes';
  } else {
    // Check description if title was ambiguous
    const descLower = relevantText.toLowerCase();
    if (descLower.includes('barndominium') || descLower.includes('barndo')) {
      finalCategory = 'Barndominiums';
    } else if (descLower.includes('log cabin') || descLower.includes('timber frame')) {
      finalCategory = 'Cabins';
    } else if (descLower.includes('sip panel') || descLower.includes('panelized')) {
      finalCategory = 'House Kits';
    } else {
      finalCategory = 'Modular Homes';
    }
  }

  const isCabin = finalCategory === 'Cabins';
  const defaultFrame = isCabin
    ? 'Precision-Engineered Heavy Timber & Milled Solid Log Wall System'
    : '100% Commercial-Grade Galvanized Light Gauge Steel';
  const defaultWarranty = isCabin
    ? '25-Year Structural Integrity & Craftsmanship Warranty'
    : '50-Year Structural Steel Frame Warranty';

  const specs = [
    ...(dimensions ? [{ label: 'Dimensions', value: dimensions }] : []),
    { label: 'Living Area', value: `${sqft.toLocaleString()} SQ FT` },
    { label: 'Bedrooms', value: bedrooms === 0 ? 'Studio / Open Concept' : `${bedrooms} Bed` },
    { label: 'Bathrooms', value: `${bathrooms} Bath` },
    { label: 'Stories', value: `${stories} Level` },
    { label: 'Frame Type', value: item.frame_type || item.frameType || defaultFrame },
    { label: 'Warranty', value: item.warranty || defaultWarranty },
    { label: 'Wind Rating', value: item.wind_rating || item.windRating || (isCabin ? '130+ MPH Wind Rated' : 'Up to 150 MPH') },
    { label: 'Snow Load', value: item.snow_load || item.snowLoad || '50 PSF Ground Snow Load Rated' }
  ];

  return {
    ...item,
    id: String(item.id || slug),
    slug,
    handle: slug,
    title,
    name: title,
    category: finalCategory,
    product_type: finalCategory,
    sqft,
    bedrooms,
    bathrooms,
    stories,
    dimensions: dimensions || `${Math.round(Math.sqrt(sqft))}x${Math.round(Math.sqrt(sqft))} ft`,
    startingPrice: minVariantPrice,
    starting_price: minVariantPrice,
    price: minVariantPrice,
    variants: formattedVariants,
    product_variants: formattedVariants,
    specs,
    tagline: `${sqft.toLocaleString()} Sq Ft • ${bedrooms === 0 ? 'Studio' : `${bedrooms} Bed`} • ${bathrooms} Bath ${finalCategory}`,
    primaryImage: item.primaryImage || item.primary_image_url || item.image || item.featured_image || 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345',
    gallery: Array.isArray(item.gallery) && item.gallery.length > 0 ? item.gallery : (Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.primaryImage || item.primary_image_url || 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345'])
  };
});

fs.writeFileSync(catalogPath, JSON.stringify(cleanedCatalog, null, 2), 'utf8');
console.log(`Successfully updated ${catalogPath} with ${cleanedCatalog.length} repaired models.`);

// Verify specific user models
const checks = [
  'el-chapo-muchacho',
  'the-farmhouse-charm-new-model',
  'the-grey-haven-barndo-house-kit',
  'the-sparrow-cabin-luxury-log-home-kit'
];

console.log('\n=== Verification of Key Models ===');
checks.forEach(h => {
  const p = cleanedCatalog.find(item => item.slug === h);
  if (p) {
    console.log(`\nModel: ${p.title} (${p.slug})`);
    console.log(`  Category: ${p.category}`);
    console.log(`  SqFt: ${p.sqft.toLocaleString()} SQ FT`);
    console.log(`  Price: $${p.startingPrice.toLocaleString()}`);
    console.log(`  Variants: ${p.variants.length} (${p.variants.map(v => `${v.title}: $${v.price}`).join(' | ')})`);
    console.log(`  Dimensions: ${p.dimensions}`);
  }
});
