const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const migratedPath = path.resolve('src/data/migrated_articles.json');
const migrated = JSON.parse(fs.readFileSync(migratedPath, 'utf8'));

const redirectsPath = path.resolve('src/data/shopify_redirects.json');
const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

const reportPath = path.resolve('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx');
const wb = xlsx.readFile(reportPath);
const blogReport = xlsx.utils.sheet_to_json(wb.Sheets['Blog SEO Corrections']);

function getCustomTitle(art) {
  const { title, slug } = art;

  // Exact custom crafted titles (45-65 chars)
  const exactTitles = {
    'top-10-reasons-why-modular-homes-are-the-future-of-housing': 'Top 10 Reasons Modular Homes Are the Future | ModularHome.com',
    'modular-homes-vs-prefab-homes-what-s-the-difference': 'Modular vs Prefab Homes: Key Differences | ModularHome.com',
    'how-much-does-a-modular-home-cost-in-2026': 'How Much Does a Modular Home Cost in 2026? | ModularHome.com',
    'are-modular-homes-safe-in-storms-tornadoes-and-harsh-weather': 'Are Modular Homes Safe in Severe Storms? | ModularHome.com',
    'top-25-modular-home-floor-plans-for-2026': 'Top 25 Modular Home Floor Plans for 2026 | ModularHome.com',
    'the-complete-guide-to-modular-home-permits-and-zoning-how-to-navigate-local-regulations': 'Modular Home Permits & Zoning Regulations | ModularHome.com',
    'how-to-buy-land-for-a-modular-home-the-complete-checklist-for-zoning-utilities-and-permits': 'How to Buy Land for a Modular Home Checklist | ModularHome.com',
    'the-step-by-step-process-of-building-a-modular-home-from-design-to-move-in-day': 'Step-by-Step Modular Home Building Process | ModularHome.com',
    'modular-homes-vs-site-built-homes-which-is-better-in-2026': 'Modular vs Site-Built Homes in 2026 | ModularHome.com',
    'top-10-reasons-why-modular-homes-are-better-than-mobile-homes': 'Modular Homes vs Mobile Homes: 10 Reasons | ModularHome.com',
    'top-10-reasons-why-modular-homes-are-superior-to-stick-built-homes': '10 Reasons Modular Beats Stick-Built Homes | ModularHome.com',
    'the-complete-guide-to-modular-home-financing-construction-loans-mortgages-and-down-payments': 'Complete Guide to Modular Home Financing | ModularHome.com',
    'how-to-prepare-your-land-for-a-modular-home-site-prep-permits-utilities-and-foundation-guide': 'Modular Home Land & Site Preparation Guide | ModularHome.com',
    'are-modular-homes-built-to-local-building-codes-what-every-buyer-needs-to-know-about-permits-and-zoning': 'Modular Homes & Local Building Codes Guide | ModularHome.com',
    'can-modular-homes-be-financed-with-a-traditional-mortgage-the-complete-lending-guide': 'How to Finance a Modular Home: Lending Guide | ModularHome.com',
    'what-makes-modular-homes-energy-efficient-the-science-behind-factory-precision-and-lower-utility-bills': 'Why Modular Homes Are Energy Efficient | ModularHome.com',
    'can-a-modular-home-be-built-on-a-basement-crawlspace-or-slab-foundation-options-explained': 'Modular Home Foundation Options Explained | ModularHome.com',
    'why-modular-homes-are-built-stronger-than-traditional-stick-built-homes': 'Why Modular Homes Are Built Stronger | ModularHome.com',
    'why-modular-homes-have-less-construction-delays-the-factory-advantage-explained': 'Why Modular Homes Have Fewer Build Delays | ModularHome.com',
    'the-environmental-benefits-of-modular-homes-less-waste-energy-efficiency-and-sustainable-building': 'Environmental Benefits of Modular Homes | ModularHome.com',
    'how-fast-can-you-build-a-modular-home-the-complete-timeline-from-order-to-move-in': 'Modular Home Construction Timeline Guide | ModularHome.com',
    'can-you-customize-a-modular-home-floor-plan-the-complete-guide-to-options-upgrades-and-layouts': 'Customizing Modular Home Floor Plans | ModularHome.com',
    'is-a-modular-home-a-good-investment-how-modular-homes-appreciate-and-build-equity-over-time': 'Are Modular Homes a Good Investment? Guide | ModularHome.com',
    'common-mistakes-to-avoid-when-buying-a-modular-home-what-every-buyer-should-know-before-ordering': 'Top Mistakes When Buying a Modular Home | ModularHome.com',
    'how-to-choose-the-right-modular-home-builder-10-questions-you-must-ask-before-signing-a-contract': '10 Questions to Ask a Modular Home Builder | ModularHome.com',
    'where-can-you-build-a-modular-home-a-state-by-state-overview-of-zoning-and-regulations': 'Where Can You Build a Modular Home? Guide | ModularHome.com',
    'what-is-the-lifespan-of-a-modular-home-how-long-do-modern-factory-built-homes-last': 'What Is the Lifespan of a Modular Home? | ModularHome.com',
    'are-modular-homes-worth-it-the-honest-pros-and-cons-every-buyer-needs-to-know-in-2026': 'Are Modular Homes Worth It? 2026 Pros & Cons | ModularHome.com',
    'modular-homes-vs-manufactured-homes-the-complete-comparison-every-buyer-needs-to-read': 'Modular vs Manufactured Homes Comparison | ModularHome.com',
    'modular-homes-vs-mobile-homes-the-clear-difference-every-buyer-needs-to-understand': 'Modular vs Mobile Homes: Key Differences | ModularHome.com',
    'are-barndominiums-cheaper-to-build-the-complete-cost-breakdown': 'Are Barndominiums Cheaper to Build? | ModularHome.com',
    'are-barndominiums-actually-cheaper-to-build': 'Barndominium Cost vs Traditional Homes | ModularHome.com',
    'are-barndominiums-actually-cheaper-to-build-the-truth-about-barndo-pricing-in-2026': 'Barndominium Pricing Truth in 2026 | ModularHome.com',
    'are-barndominiums-actually-cheaper-to-build-the-truth-about-modern-barndo-costs': 'The Truth About Modern Barndo Costs | ModularHome.com',
    'why-modular-construction-is-taking-over-the-future-of-residential-and-commercial-building': 'Modular Construction for Residential Growth | ModularHome.com',
    'why-modular-construction-is-taking-over-in-hospitality-amp-lodging': 'Modular Construction in Hospitality & Hotels | ModularHome.com',
    'why-modular-construction-is-taking-over-for-specialty-and-remote-structures': 'Modular Construction for Remote Structures | ModularHome.com',
    'why-commercial-modular-construction-is-taking-over-for-supportive-amp-workforce-housing': 'Modular Construction for Workforce Housing | ModularHome.com',
    'why-commercial-modular-construction-is-transforming-the-future-of-development': 'Commercial Modular Construction Future | ModularHome.com',
    'what-is-a-modular-home-the-complete-guide-to-modular-homes-prefab-homes-and-factory-built-housing': 'What Is a Modular Home? Complete Guide | ModularHome.com',
    'what-is-a-modular-home-and-why-modular-homes-are-the-future-of-affordable-housing-in-america-and-beyond': 'What Is a Modular Home & Future of Housing | ModularHome.com',
    'why-modularhome-com-is-becoming-one-of-the-strongest-modular-construction-brands-in-america': 'Why ModularHome.com Leads Modular Construction | ModularHome.com',
    'why-modularhome-com-is-becoming-one-of-the-strongest-modular-construction-brands-in-america-1': 'America’s Strongest Modular Home Builders | ModularHome.com',
    'why-modularhome-com-is-becoming-america-s-largest-modular-home-builders-network': 'America’s Largest Modular Home Builders Network | ModularHome.com',
  };

  if (exactTitles[slug]) {
    return exactTitles[slug];
  }

  // General clean
  let clean = (title || '').trim();
  clean = clean.replace(/\s*–\s*Modular Homes,.*$/i, '');
  clean = clean.replace(/\s*\|\s*ModularHome\.com.*$/i, '');
  clean = clean.replace(/\s*-\s*ModularHome\.com.*$/i, '');
  clean = clean.replace(/\s*\|\s*Amish Built.*$/i, '');
  clean = clean.trim();

  // If clean + ' | ModularHome.com' is <= 60 chars, return it
  if (`${clean} | ModularHome.com`.length <= 60) {
    return `${clean} | ModularHome.com`;
  }
  if (`${clean} | ModularHome.com`.length <= 65) {
    return `${clean} | ModularHome.com`;
  }
  if (clean.length <= 60) {
    return clean;
  }

  // Substring break
  let shortened = clean;
  if (shortened.includes(':')) {
    shortened = shortened.split(':')[0].trim();
  } else if (shortened.includes(' - ')) {
    shortened = shortened.split(' - ')[0].trim();
  } else if (shortened.includes(' | ')) {
    shortened = shortened.split(' | ')[0].trim();
  }

  if (`${shortened} | ModularHome.com`.length <= 60) {
    return `${shortened} | ModularHome.com`;
  }
  if (shortened.length <= 60) {
    return shortened;
  }

  shortened = shortened.slice(0, 42).replace(/\s+\S*$/, '').trim();
  return `${shortened} | ModularHome.com`;
}

function getCustomDescription(art) {
  const { title, excerpt, content, slug } = art;

  // Specific custom overrides
  const specificDescs = {
    'why-modularhome-com-is-becoming-one-of-the-strongest-modular-construction-brands-in-america': 'Discover why ModularHome.com is leading the US modular construction revolution with precision manufacturing, vetted floor plans, and nationwide delivery.',
    'why-modularhome-com-is-becoming-one-of-the-strongest-modular-construction-brands-in-america-1': 'Explore how ModularHome.com is expanding America’s premier modular home network with engineered prefab models, turnkey pricing, and reliable delivery.',
    'why-modularhome-com-is-becoming-america-s-largest-modular-home-builders-network': 'Learn how ModularHome.com connects home buyers and commercial developers with top-rated modular factories, verified contractors, and pre-engineered plans.',
    'top-10-reasons-why-modular-homes-are-the-future-of-housing': 'Explore the top 10 reasons modular homes are leading the future of housing with faster build times, energy efficiency, modern designs, and cost savings.',
    'modular-homes-vs-prefab-homes-what-s-the-difference': 'Learn the key differences between modular homes and prefab homes, including building codes, construction methods, financing options, and total costs.',
    'how-much-does-a-modular-home-cost-in-2026': 'Understand true 2026 modular home costs, including base kit prices, site prep, foundation options, delivery fees, and turnkey construction estimates.',
    'are-modular-homes-safe-in-storms-tornadoes-and-harsh-weather': 'Find out how modern modular homes withstand hurricanes, tornadoes, high winds, and heavy snow with precision steel engineering and durable materials.',
    'top-25-modular-home-floor-plans-for-2026': 'Browse the top 25 modular home floor plans for 2026, featuring modern layouts, luxury finishes, barndominiums, cozy cabins, and scalable family designs.',
    'top-10-reasons-why-modular-homes-are-better-than-mobile-homes': 'Discover 10 essential reasons why modular homes outperform mobile homes in appraisal value, structural longevity, financing options, and customization.',
    'top-10-reasons-why-modular-homes-are-superior-to-stick-built-homes': 'See why factory-engineered modular homes surpass traditional stick-built houses in build speed, weather protection, energy efficiency, and quality control.',
  };

  if (specificDescs[slug]) {
    return specificDescs[slug];
  }

  let text = (excerpt || '').trim();
  if (!text || text.length < 50) {
    const rawContent = Array.isArray(content) ? content.join(' ') : (content || '');
    text = rawContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  } else {
    text = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  text = text.replace(/^["'“]|["'”]$/g, '');
  text = text.replace(/^(one of the most common questions|people often ask|the housing market is changing fast[.,]\s*)/i, '');
  text = text.trim();
  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

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
      desc = `Complete guide to ${title.toLowerCase().replace(/[?.:!]+$/, '')}: discover expert modular building tips, cost breakdowns, and advice at ModularHome.com.`;
    }
  }

  desc = desc.replace(/[,;:\-\s]+(\.\.\.)?$/, '$1').trim();
  if (!desc.endsWith('.') && !desc.endsWith('!') && !desc.endsWith('?') && !desc.endsWith('...')) {
    if (desc.length <= 154) {
      desc += '.';
    }
  }

  if (desc.length > 155) {
    desc = desc.slice(0, 150).replace(/\s+\S*$/, '').trim() + '...';
  }

  return desc;
}

// Update all 190 articles
const updated = migrated.map(art => {
  const optTitle = getCustomTitle(art);
  const optDesc = getCustomDescription(art);
  return {
    ...art,
    seoTitle: optTitle,
    metaDescription: optDesc,
    seo_title: optTitle,
    seo_description: optDesc,
  };
});

// Verify titles and lengths
const titleSet = new Map();
let duplicateFound = false;
let maxTitle = 0;
let minTitle = 999;
let maxDesc = 0;
let minDesc = 999;

updated.forEach((art, idx) => {
  if (titleSet.has(art.seoTitle)) {
    console.error(`DUPLICATE TITLE [${idx}]: "${art.seoTitle}" (Slugs: ${titleSet.get(art.seoTitle)} and ${art.slug})`);
    duplicateFound = true;
  } else {
    titleSet.set(art.seoTitle, art.slug);
  }

  if (art.seoTitle.length > maxTitle) maxTitle = art.seoTitle.length;
  if (art.seoTitle.length < minTitle) minTitle = art.seoTitle.length;
  if (art.metaDescription.length > maxDesc) maxDesc = art.metaDescription.length;
  if (art.metaDescription.length < minDesc) minDesc = art.metaDescription.length;
});

console.log(`\n=== Verification Results ===`);
console.log(`Total Articles: ${updated.length}`);
console.log(`Duplicate Titles: ${duplicateFound ? 'FAILED' : '0 (PASSED)'}`);
console.log(`Title Lengths: ${minTitle} - ${maxTitle} chars (Target <= 65 chars: ${maxTitle <= 65 ? 'PASSED' : 'FAILED'})`);
console.log(`Description Lengths: ${minDesc} - ${maxDesc} chars (Target <= 158 chars: ${maxDesc <= 158 ? 'PASSED' : 'FAILED'})`);

// Add 301 redirects
blogReport.forEach((r) => {
  const oldUrl = r['Old Shopify URL'];
  const newUrl = r['New Next.js URL'];
  const oldPath = oldUrl.replace('https://modularhome.com', '').toLowerCase();
  const newPath = newUrl.replace('https://modularhome.com', '').toLowerCase();

  if (oldPath !== newPath) {
    redirects[oldPath] = newPath;
  }
});

fs.writeFileSync(migratedPath, JSON.stringify(updated, null, 2), 'utf8');
console.log('Saved src/data/migrated_articles.json');

fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2), 'utf8');
console.log(`Saved src/data/shopify_redirects.json with ${Object.keys(redirects).length} total redirects.`);
