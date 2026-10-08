const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Load articles and report
const migratedPath = path.resolve('src/data/migrated_articles.json');
const migrated = JSON.parse(fs.readFileSync(migratedPath, 'utf8'));

const redirectsPath = path.resolve('src/data/shopify_redirects.json');
const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

const reportPath = path.resolve('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx');
const wb = xlsx.readFile(reportPath);
const blogReport = xlsx.utils.sheet_to_json(wb.Sheets['Blog SEO Corrections']);

console.log(`Loaded ${migrated.length} migrated articles and ${blogReport.length} report rows.`);

// Helper to clean and build optimal SEO titles
function generateOptimizedTitle(article) {
  const { title, slug } = article;
  let raw = (title || '').trim();

  // Strip existing long suffix
  raw = raw.replace(/\s*–\s*Modular Homes,.*$/i, '');
  raw = raw.replace(/\s*\|\s*ModularHome\.com.*$/i, '');
  raw = raw.replace(/\s*-\s*ModularHome\.com.*$/i, '');
  raw = raw.replace(/\s*\|\s*Amish Built Cabins.*$/i, '');
  raw = raw.replace(/\s*\|\s*Amish Built Homes.*$/i, '');
  raw = raw.trim();

  // Specific resolution for duplicate titles
  if (slug === 'why-modularhome-com-is-becoming-one-of-the-strongest-modular-construction-brands-in-america') {
    return 'Why ModularHome.com Leads Modular Construction | ModularHome.com';
  }
  if (slug === 'why-modularhome-com-is-becoming-one-of-the-strongest-modular-construction-brands-in-america-1') {
    return 'America’s Strongest Modular Home Builders | ModularHome.com';
  }

  // Handle specific very long titles to keep them concise and impactful
  const specificOverrides = {
    'are-barndominiums-actually-cheaper-to-build-the-truth-about-barndo-pricing-in-2026': 'Barndominium Pricing Truth in 2026 | ModularHome.com',
    'are-barndominiums-actually-cheaper-to-build-the-truth-about-modern-barndo-costs': 'The Truth About Modern Barndo Costs | ModularHome.com',
    'are-barndominiums-cheaper-to-build-the-complete-cost-breakdown': 'Are Barndominiums Cheaper to Build? | ModularHome.com',
    'are-modular-buildings-built-to-the-same-codes-as-traditional-construction': 'Modular Building Codes vs Traditional | ModularHome.com',
    'are-modular-buildings-durable-the-truth-about-lifespan-structural-strength-and-long-term-performance': 'Are Modular Buildings Durable? Lifespan & Strength | ModularHome.com',
    'are-modular-cabins-cheaper-than-traditional-cabins-the-honest-cost-comparison': 'Modular Cabins vs Traditional Cost Comparison | ModularHome.com',
    'are-modular-cabins-durable-what-you-need-to-know-about-weather-resistance-and-longevity': 'Modular Cabin Durability & Weather Resistance | ModularHome.com',
    'are-modular-cabins-energy-efficient-how-insulation-and-factory-precision-cut-heating-cooling-costs': 'Are Modular Cabins Energy Efficient? | ModularHome.com',
    'are-modular-cabins-good-for-airbnb-the-ultimate-short-term-rental-guide-for-investors': 'Modular Cabins for Airbnb: Investor Guide | ModularHome.com',
    'are-modular-homes-built-to-local-building-codes-what-every-buyer-needs-to-know-about-permits-and-zoning': 'Modular Homes & Local Building Codes Guide | ModularHome.com',
    'are-modular-homes-cheaper-than-stick-built-the-honest-cost-comparison-for-2026': 'Modular vs Stick-Built Cost Comparison 2026 | ModularHome.com',
    'are-modular-homes-good-for-cold-climates-how-factory-built-homes-handle-snow-ice-and-freezing-temperatures': 'Modular Homes in Cold Climates & Snow | ModularHome.com',
    'are-modular-homes-good-for-first-time-homebuyers-how-to-buy-a-brand-new-home-without-the-traditional-hassle': 'Modular Homes for First-Time Homebuyers | ModularHome.com',
    'are-modular-homes-good-for-rental-properties-the-real-estate-investor-s-guide-to-prefab-cash-flow': 'Modular Homes for Rental Property Investors | ModularHome.com',
    'are-modular-homes-worth-it-the-honest-pros-and-cons-every-buyer-needs-to-know-in-2026': 'Are Modular Homes Worth It? 2026 Pros & Cons | ModularHome.com',
    'can-a-modular-home-be-built-on-a-basement-crawlspace-or-slab-foundation-options-explained': 'Modular Home Foundation Options Explained | ModularHome.com',
    'can-modular-homes-be-built-in-cities-how-urban-infill-modular-construction-is-changing-housing': 'Urban Infill Modular Home Construction | ModularHome.com',
    'can-modular-homes-be-financed-with-a-traditional-mortgage-the-complete-lending-guide': 'How to Finance a Modular Home: Lending Guide | ModularHome.com',
    'can-you-build-a-custom-modular-home-how-to-modify-floor-plans-and-create-your-dream-layout': 'How to Build a Custom Modular Home Layout | ModularHome.com',
    'can-you-customize-a-modular-home-floor-plan-the-complete-guide-to-options-upgrades-and-layouts': 'Customizing Modular Home Floor Plans & Options | ModularHome.com',
    'common-mistakes-to-avoid-when-buying-a-modular-home-what-every-buyer-should-know-before-ordering': 'Top Mistakes to Avoid When Buying a Modular Home | ModularHome.com',
    'how-fast-can-you-build-a-modular-home-the-complete-timeline-from-order-to-move-in': 'Modular Home Construction Timeline Guide | ModularHome.com',
    'how-much-does-a-modular-home-cost-in-2026': 'How Much Does a Modular Home Cost in 2026? | ModularHome.com',
    'how-to-buy-land-for-a-modular-home-the-complete-checklist-for-zoning-utilities-and-permits': 'How to Buy Land for a Modular Home Checklist | ModularHome.com',
    'how-to-choose-the-right-modular-home-builder-10-questions-you-must-ask-before-signing-a-contract': 'How to Choose a Modular Home Builder: 10 Questions | ModularHome.com',
    'how-to-prepare-your-land-for-a-modular-home-site-prep-permits-utilities-and-foundation-guide': 'Modular Home Land Preparation & Site Prep Guide | ModularHome.com',
    'is-a-modular-home-a-good-investment-how-modular-homes-appreciate-and-build-equity-over-time': 'Are Modular Homes a Good Investment? Equity Guide | ModularHome.com',
    'modular-homes-vs-manufactured-homes-the-complete-comparison-every-buyer-needs-to-read': 'Modular vs Manufactured Homes Comparison | ModularHome.com',
    'modular-homes-vs-mobile-homes-the-clear-difference-every-buyer-needs-to-understand': 'Modular vs Mobile Homes: Key Differences | ModularHome.com',
    'modular-homes-vs-prefab-homes-what-s-the-difference': 'Modular vs Prefab Homes: Key Differences | ModularHome.com',
    'modular-homes-vs-site-built-homes-which-is-better-in-2026': 'Modular vs Site-Built Homes in 2026 | ModularHome.com',
    'the-complete-guide-to-modular-home-financing-construction-loans-mortgages-and-down-payments': 'Complete Guide to Modular Home Financing | ModularHome.com',
    'the-complete-guide-to-modular-home-permits-and-zoning-how-to-navigate-local-regulations': 'Modular Home Permits and Zoning Guide | ModularHome.com',
    'the-environmental-benefits-of-modular-homes-less-waste-energy-efficiency-and-sustainable-building': 'Environmental Benefits of Modular Homes | ModularHome.com',
    'the-history-of-modular-homes-how-factory-built-housing-evolved-from-sears-kits-to-modern-luxury': 'The History & Evolution of Modular Homes | ModularHome.com',
    'the-step-by-step-process-of-building-a-modular-home-from-design-to-move-in-day': 'Step-by-Step Modular Home Building Process | ModularHome.com',
    'top-10-reasons-why-modular-homes-are-the-future-of-housing': 'Top 10 Reasons Modular Homes Are the Future | ModularHome.com',
    'top-25-modular-home-floor-plans-for-2026': 'Top 25 Modular Home Floor Plans for 2026 | ModularHome.com',
    'what-is-a-modular-home-the-complete-guide-for-2026': 'What Is a Modular Home? Complete 2026 Guide | ModularHome.com',
    'what-is-the-lifespan-of-a-modular-home-how-long-do-modern-factory-built-homes-last': 'What Is the Lifespan of a Modular Home? | ModularHome.com',
    'what-makes-modular-homes-energy-efficient-the-science-behind-factory-precision-and-lower-utility-bills': 'Why Modular Homes Are Energy Efficient | ModularHome.com',
    'where-can-you-build-a-modular-home-a-state-by-state-overview-of-zoning-and-regulations': 'Where Can You Build a Modular Home? State Guide | ModularHome.com',
    'why-developers-are-switching-to-modular-construction-for-residential-and-commercial-projects': 'Why Developers Choose Modular Construction | ModularHome.com',
    'why-modular-construction-is-the-solution-to-america-s-affordable-housing-crisis': 'Modular Construction & Affordable Housing | ModularHome.com',
    'why-modular-homes-are-built-stronger-than-traditional-stick-built-homes': 'Why Modular Homes Are Built Stronger | ModularHome.com',
    'why-modular-homes-have-less-construction-delays-the-factory-advantage-explained': 'Why Modular Homes Have Fewer Build Delays | ModularHome.com',
    'why-more-americans-are-choosing-modular-cabins-over-traditional-log-cabins': 'Why Americans Choose Modular Over Log Cabins | ModularHome.com',
    'why-prefab-and-modular-homes-are-the-smartest-choice-for-remote-and-rural-properties': 'Modular Homes for Remote & Rural Lots | ModularHome.com',
    'why-precision-engineering-makes-modular-homes-superior-to-site-built-construction': 'Precision Engineering in Modular Homes | ModularHome.com',
  };

  if (specificOverrides[slug]) {
    return specificOverrides[slug];
  }

  // General rule
  let candidate = `${raw} | ModularHome.com`;
  if (candidate.length <= 60) {
    return candidate;
  }
  if (raw.length <= 60) {
    return raw;
  }

  // If still long, shorten candidate gracefully
  let shortened = raw;
  if (shortened.includes(':')) {
    shortened = shortened.split(':')[0].trim();
  } else if (shortened.includes(' - ')) {
    shortened = shortened.split(' - ')[0].trim();
  } else if (shortened.includes(' | ')) {
    shortened = shortened.split(' | ')[0].trim();
  } else if (shortened.includes('?')) {
    shortened = shortened.split('?')[0].trim() + '?';
  }

  if (shortened.length + 18 <= 60) {
    return `${shortened} | ModularHome.com`;
  }
  if (shortened.length <= 60) {
    return shortened;
  }

  // Fallback trim at word boundary
  shortened = shortened.slice(0, 42).replace(/\s+\S*$/, '').trim();
  return `${shortened} Guide | ModularHome.com`;
}

// Helper to generate concise, high-CTR meta descriptions (125 - 155 chars)
function generateOptimizedDescription(article) {
  const { title, excerpt, content, slug } = article;

  const specificDescOverrides = {
    'why-modularhome-com-is-becoming-one-of-the-strongest-modular-construction-brands-in-america': 'Discover why ModularHome.com is leading the US modular construction revolution with precision manufacturing, vetted floor plans, and nationwide delivery.',
    'why-modularhome-com-is-becoming-one-of-the-strongest-modular-construction-brands-in-america-1': 'Explore how ModularHome.com is expanding America’s premier modular home network with engineered prefab models, turnkey pricing, and reliable delivery.',
    'top-10-reasons-why-modular-homes-are-the-future-of-housing': 'Explore the top 10 reasons modular homes are leading the future of housing with faster build times, energy efficiency, modern designs, and cost savings.',
    'modular-homes-vs-prefab-homes-what-s-the-difference': 'Learn the key differences between modular homes and prefab homes, including building codes, construction methods, financing options, and total costs.',
    'how-much-does-a-modular-home-cost-in-2026': 'Understand true 2026 modular home costs, including base kit prices, site prep, foundation options, delivery fees, and turnkey construction estimates.',
    'are-modular-homes-safe-in-storms-tornadoes-and-harsh-weather': 'Find out how modern modular homes withstand hurricanes, tornadoes, high winds, and heavy snow with precision steel engineering and durable materials.',
    'top-25-modular-home-floor-plans-for-2026': 'Browse the top 25 modular home floor plans for 2026, featuring modern layouts, luxury finishes, barndominiums, cozy cabins, and scalable family designs.',
    'what-is-a-modular-home-the-complete-guide-for-2026': 'Complete 2026 buyer guide to modular homes: explore factory construction benefits, customization options, zoning permits, financing, and move-in timelines.',
    'are-barndominiums-actually-cheaper-to-build': 'Compare barndominium construction costs against traditional stick-built and modular homes to find out if building a barndo actually saves you money.',
    'how-to-buy-land-for-a-modular-home-the-complete-checklist-for-zoning-utilities-and-permits': 'Essential checklist for buying land for a modular home. Learn how to verify zoning laws, soil conditions, utilities, access roads, and local building permits.',
    'the-complete-guide-to-modular-home-financing-construction-loans-mortgages-and-down-payments': 'Everything you need to know about financing a modular home, from construction loans and down payments to conventional mortgages and government-backed lending.',
    'can-you-customize-a-modular-home-floor-plan-the-complete-guide-to-options-upgrades-and-layouts': 'Discover how to customize modular home floor plans with expanded room layouts, kitchen upgrades, architectural finishes, porches, and energy-saving features.',
  };

  if (specificDescOverrides[slug]) {
    return specificDescOverrides[slug];
  }

  // Extract clean text from excerpt or body
  let text = (excerpt || '').trim();
  if (!text || text.length < 50) {
    const rawContent = Array.isArray(content) ? content.join(' ') : (content || '');
    text = rawContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  } else {
    text = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Clean out quotes, markdown, and conversational filler
  text = text.replace(/^["'“]|["'”]$/g, '');
  text = text.replace(/^(one of the most common questions|people often ask|the housing market is changing fast[.,]\s*)/i, '');
  text = text.trim();
  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Extract first 1-2 complete sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let desc = '';
  for (const s of sentences) {
    const cleanS = s.trim();
    if ((desc + ' ' + cleanS).trim().length <= 150) {
      desc = (desc + ' ' + cleanS).trim();
    } else {
      break;
    }
  }

  if (!desc || desc.length < 90) {
    if (text.length > 145) {
      desc = text.slice(0, 142).replace(/\s+\S*$/, '').trim() + '...';
    } else if (text.length >= 80) {
      desc = text;
    } else {
      desc = `Read our comprehensive guide on ${title.toLowerCase().replace(/[?.:!]+$/, '')} with expert insights, construction tips, and cost breakdowns from ModularHome.com.`;
      if (desc.length > 155) {
        desc = `Expert guide to ${title.toLowerCase().replace(/[?.:!]+$/, '')}: discover building tips, costs, and key modular construction insights at ModularHome.com.`;
      }
    }
  }

  // Clean trailing punctuation
  desc = desc.replace(/[,;:\-\s]+(\.\.\.)?$/, '$1').trim();
  if (!desc.endsWith('.') && !desc.endsWith('!') && !desc.endsWith('?') && !desc.endsWith('...')) {
    if (desc.length <= 154) {
      desc += '.';
    }
  }

  // Safety length trim
  if (desc.length > 155) {
    desc = desc.slice(0, 150).replace(/\s+\S*$/, '').trim() + '...';
  }

  return desc;
}

// 1. Process all 190 articles in migrated_articles.json
const updatedMigrated = migrated.map((art) => {
  const optTitle = generateOptimizedTitle(art);
  const optDesc = generateOptimizedDescription(art);

  return {
    ...art,
    seoTitle: optTitle,
    metaDescription: optDesc,
    seo_title: optTitle,
    seo_description: optDesc,
  };
});

// Check for any duplicate titles
const titleMap = new Map();
updatedMigrated.forEach((art, idx) => {
  if (titleMap.has(art.seoTitle)) {
    console.error(`Duplicate title found at index ${idx}: "${art.seoTitle}" (Slugs: ${titleMap.get(art.seoTitle)} and ${art.slug})`);
  } else {
    titleMap.set(art.seoTitle, art.slug);
  }
});

// 2. Add all 151 old Shopify blog redirects to shopify_redirects.json
let redirectsAddedCount = 0;
blogReport.forEach((r) => {
  const oldUrl = r['Old Shopify URL'];
  const newUrl = r['New Next.js URL'];
  const oldPath = oldUrl.replace('https://modularhome.com', '').toLowerCase();
  const newPath = newUrl.replace('https://modularhome.com', '').toLowerCase();

  if (oldPath !== newPath) {
    redirects[oldPath] = newPath;
    redirectsAddedCount++;
  }
});

console.log(`Total 301 redirects in updated shopify_redirects.json: ${Object.keys(redirects).length} (Added: ${redirectsAddedCount})`);

// Write updated migrated_articles.json and shopify_redirects.json
fs.writeFileSync(migratedPath, JSON.stringify(updatedMigrated, null, 2), 'utf8');
console.log('Saved updated migrated_articles.json');

fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2), 'utf8');
console.log('Saved updated shopify_redirects.json');
