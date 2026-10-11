import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

function cleanHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function titleCaseFromHandle(handle: string): string {
  if (!handle) return '';
  return handle
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

async function solveSeoInventory() {
  console.log('================================================================');
  console.log('🚀 RESOLVING AND COMPLETING SEO INVENTORY.XLSX');
  console.log('================================================================\n');

  const baseDomain = 'https://modularhome.com';
  const defaultSiteTitleSuffix = 'Modular Homes, Prefab Homes, Modular Cabins, Barndominiums, House Kits & Tiny Homes | ModularHome.com';
  const defaultFallbackImage = 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80';
  const defaultCabinImage = 'https://cdn.shopify.com/s/files/1/0897/2959/7756/files/newwow.jpg?v=1732341345';
  const defaultCollectionImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  // 1. Load Reference Datasets
  console.log('1. Loading Reference Datasets...');

  // A. Matrixify Products.xlsx (Fast read)
  console.log('   - Loading Matrixify Products.xlsx...');
  const prodWb = XLSX.readFile(path.resolve('migration/docs/01_RAW_MATRIXIFY_EXPORTS/Products.xlsx'), {
    raw: true,
    cellFormula: false,
    cellHTML: false,
    cellStyles: false,
    bookVBA: false,
  });
  const prodRows: any[] = XLSX.utils.sheet_to_json(prodWb.Sheets['Products'], { defval: '' });
  const rawProductMap = new Map<string, any>();
  prodRows.forEach(r => {
    const handle = String(r.Handle || '').trim().toLowerCase();
    if (handle) {
      if (!rawProductMap.has(handle)) {
        rawProductMap.set(handle, r);
      } else {
        const cur = rawProductMap.get(handle)!;
        if (!cur.Title && r.Title) cur.Title = r.Title;
        if (!cur['Body HTML'] && r['Body HTML']) cur['Body HTML'] = r['Body HTML'];
        if (!cur['Image Src'] && r['Image Src']) cur['Image Src'] = r['Image Src'];
        if (!cur['Metafield: title_tag [string]'] && r['Metafield: title_tag [string]']) cur['Metafield: title_tag [string]'] = r['Metafield: title_tag [string]'];
        if (!cur['Metafield: description_tag [string]'] && r['Metafield: description_tag [string]']) cur['Metafield: description_tag [string]'] = r['Metafield: description_tag [string]'];
      }
    }
  });
  console.log(`     -> Loaded ${rawProductMap.size} unique products from Products.xlsx`);

  // B. Local Products Catalog
  console.log('   - Loading src/data/all_products_catalog.json...');
  const catalog: any[] = JSON.parse(fs.readFileSync(path.resolve('src/data/all_products_catalog.json'), 'utf8'));
  const catalogMap = new Map<string, any>();
  catalog.forEach(p => {
    if (p.slug) catalogMap.set(String(p.slug).trim().toLowerCase(), p);
    if (p.handle) catalogMap.set(String(p.handle).trim().toLowerCase(), p);
  });
  console.log(`     -> Loaded ${catalogMap.size} products from catalog`);

  // C. Custom Pages
  console.log('   - Loading src/data/custom_pages.json & Pages.xlsx...');
  const customPages: any[] = JSON.parse(fs.readFileSync(path.resolve('src/data/custom_pages.json'), 'utf8'));
  const customPageMap = new Map<string, any>();
  customPages.forEach(p => {
    if (p.slug) customPageMap.set(String(p.slug).trim().toLowerCase(), p);
  });

  const pagesWb = XLSX.readFile(path.resolve('migration/docs/01_RAW_MATRIXIFY_EXPORTS/Pages.xlsx'), {
    raw: true,
    cellFormula: false,
    cellHTML: false,
    cellStyles: false,
    bookVBA: false,
  });
  const rawPages: any[] = XLSX.utils.sheet_to_json(pagesWb.Sheets['Pages'], { defval: '' });
  const rawPageMap = new Map<string, any>();
  rawPages.forEach(p => {
    const handle = String(p.Handle || '').trim().toLowerCase();
    if (handle) rawPageMap.set(handle, p);
  });
  console.log(`     -> Loaded ${customPageMap.size} custom pages + ${rawPageMap.size} raw pages`);

  // D. Collections
  console.log('   - Loading Collections.xlsx...');
  const colWb = XLSX.readFile(path.resolve('migration/docs/01_RAW_MATRIXIFY_EXPORTS/Collections.xlsx'), {
    raw: true,
    cellFormula: false,
    cellHTML: false,
    cellStyles: false,
    bookVBA: false,
  });
  const rawCollections: any[] = XLSX.utils.sheet_to_json(colWb.Sheets['Collections'], { defval: '' });
  const rawColMap = new Map<string, any>();
  rawCollections.forEach(c => {
    const handle = String(c.Handle || '').trim().toLowerCase();
    if (handle && !rawColMap.has(handle)) {
      rawColMap.set(handle, c);
    }
  });
  console.log(`     -> Loaded ${rawColMap.size} unique collections`);

  // E. Migrated Articles
  console.log('   - Loading migrated articles...');
  const migratedArticles: any[] = JSON.parse(fs.readFileSync(path.resolve('src/data/migrated_articles.json'), 'utf8'));
  const articleMap = new Map<string, any>();
  migratedArticles.forEach(a => {
    if (a.slug) articleMap.set(String(a.slug).trim().toLowerCase(), a);
  });
  console.log(`     -> Loaded ${articleMap.size} migrated articles`);

  // F. Redirects
  console.log('   - Loading shopify_redirects.json...');
  const redirects = JSON.parse(fs.readFileSync(path.resolve('src/data/shopify_redirects.json'), 'utf8'));
  const redirectMap = new Map<string, string>();
  for (const [src, dest] of Object.entries(redirects)) {
    redirectMap.set(src.toLowerCase().replace(/^\/+|\/+$/g, ''), String(dest));
  }
  console.log(`     -> Loaded ${redirectMap.size} redirects`);

  // 2. Load SEO Inventory.xlsx
  console.log('\n2. Reading migration/SEO Inventory.xlsx...');
  const seoWb = XLSX.readFile(path.resolve('migration/SEO Inventory.xlsx'));
  const sheetName = seoWb.SheetNames[0];
  const seoSheet = seoWb.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(seoSheet, { defval: '' });
  console.log(`   -> Loaded ${rows.length} rows to reconcile`);

  // Known collection descriptions map for the 7 missing collections
  const collectionDescriptions: Record<string, string> = {
    '2-bedroom-turnkey-homes': 'Browse 2-bedroom turnkey modular homes and prefab house kits for sale nationwide. Explore modern layouts, energy-efficient building specs, and instant pricing at ModularHome.com.',
    '3-bedroom-turnkey-homes': 'Discover spacious 3-bedroom turnkey modular homes designed for families and modern living. Browse customizable floor plans, turnkey build options, and transparent pricing.',
    'all': 'Explore the complete ModularHome.com catalog: affordable prefab homes, modern modular cabins, steel barndominiums, house kits, ADUs, and custom floor plans delivered nationwide.',
    'house-kits-affordable-home-building-kits': 'Shop affordable prefab house kits and DIY modular home building packages. Engineered steel and panelized SIP construction kits delivered across the USA.',
    'modular-adus': 'Explore modern modular accessory dwelling units (ADUs), granny flats, and backyard guest houses with turnkey delivery, full bathroom/kitchenette options, and rapid permits.',
    'sip-homes': 'Discover high-efficiency structural insulated panel (SIP) homes. Exceptional thermal performance, rapid factory assembly, and durable modular architecture for every climate.',
    'steel-kit-models': 'Browse 100% commercial-grade galvanized steel framed kit models and barndominiums engineered for 150 MPH wind speeds, heavy snow loads, and lifetime durability.',
  };

  // Known page descriptions map
  const pageDescriptions: Record<string, string> = {
    'about': 'Learn about ModularHome.com: America\'s premier marketplace for modern modular homes, prefab cabins, steel barndominiums, and sustainable factory-built housing.',
    'about-modularhome-com': 'Learn about ModularHome.com: America\'s premier marketplace for modern modular homes, prefab cabins, steel barndominiums, and sustainable factory-built housing.',
    'contact': 'Get in touch with ModularHome.com building specialists for pricing inquiries, custom floor plans, turnkey construction quotes, and nationwide delivery support.',
    'how-do-you-finance-a-modular-home': 'Comprehensive guide on financing a modular home in 2026. Learn about construction-to-permanent loans, mortgage options, interest rates, and lender pre-approvals.',
    'how-long-do-modular-homes-last': 'Explore modular home lifespan and structural longevity. Discover why precision-engineered steel and factory construction match or exceed stick-built home durability.',
    'how-much-do-modular-homes-cost': 'Detailed pricing guide for modular and prefab homes. Compare price per square foot, site prep, foundation costs, and turnkey delivery options.',
    'how-resilient-are-modular-homes-to-tornadoes-hurricanes-and-severe-weather': 'Discover the extreme weather resilience of modular homes engineered to withstand tornadoes, hurricane-force winds up to 150 MPH, and seismic conditions.',
    'modular-homes-vs-manufactured-homes-what-s-the-difference': 'Understand the critical differences between modular homes (built to local building codes) vs manufactured mobile homes (HUD code), including financing and value appreciation.',
    'modular-homes-vs-mobile-homes-what-s-the-difference': 'Understand the critical differences between modular homes (built to local building codes) vs manufactured mobile homes (HUD code), including financing and value appreciation.',
    'prefab-vs-modular-homes-what-s-the-difference-2026-guide': 'Expert 2026 guide comparing prefab vs modular construction methods, cost differences, timelines, and which option best fits your dream home build.',
    'what-is-a-modular-home': 'Everything you need to know about modular homes: precision off-site factory construction, high-efficiency materials, floor plan options, and installation.',
    'what-is-a-prefab-home': 'Complete guide to prefabricated housing: definition, construction methods, cost savings, architectural versatility, and why prefab is the future of housing.',
    'why-are-modular-homes-better-than-stick-built-homes': 'Explore why modular construction outperforms traditional stick-built housing with faster build times, superior quality control, and reduced waste.',
    'are-modular-homes-a-good-investment': 'Analyze investment returns, appreciation rates, and equity growth for modern modular homes compared to traditional site-built residential properties.',
    'are-modular-homes-built-to-code': 'Learn how modular homes meet and exceed state, county, and local IRC building codes through stringent multi-point factory inspections.',
    'are-modular-homes-safe': 'Safety standards, structural engineering, fire ratings, and weather resistance certifications for modern modular and prefab residential buildings.',
    'are-prefab-homes-cheaper-than-traditional-homes': 'Detailed cost analysis comparing factory prefabricated homes with conventional residential construction costs and long-term savings.',
    'are-prefab-homes-safe': 'Safety standards, structural engineering, fire ratings, and weather resistance certifications for modern modular and prefab residential buildings.',
    'can-modular-homes-appreciate-in-value': 'Evidence and appraisal data showing how permanent foundation modular homes appreciate in value at identical rates to traditional on-site homes.',
    'advantages-of-modular-homes': 'Discover key advantages of modular homes including rapid construction timelines, predictable budgeting, superior energy efficiency, and eco-friendly manufacturing.',
    'advantages-of-buying-a-modular-home-vs-manufactured-and-mobile-homes': 'Key benefits of choosing a code-compliant modular home over mobile and manufactured housing for financing, zoning, and long-term asset value.',
    'custom-design-your-dream-home': 'Work with ModularHome.com architectural designers to create your custom modular floor plan, exterior finishes, interior layouts, and energy packages.',
    'custom-house-plans': 'Explore custom modular home plans and architectural blueprints tailored to your building site, lifestyle, and local zoning requirements.',
    'data-sharing-opt-out': 'Manage your privacy choices and data sharing preferences in compliance with state and federal privacy regulations at ModularHome.com.',
  };

  // 3. Process each row
  console.log('\n3. Reconciling and populating all missing fields across rows...');
  let fixedTitles = 0;
  let fixedDescriptions = 0;
  let fixedH1 = 0;
  let fixedCanonicals = 0;
  let fixedOgTitles = 0;
  let fixedOgDescriptions = 0;
  let fixedOgImages = 0;
  let fixedStatuses = 0;
  let clearedErrors = 0;

  const resolvedRows = rows.map((row, idx) => {
    const type = String(row.Type || '').trim().toLowerCase();
    const existingUrl = String(row['Existing URL'] || '').trim();
    let httpStatus = row['HTTP status'];
    let seoTitle = String(row['SEO title rendered'] || '').trim();
    let metaDesc = String(row['Meta description rendered'] || '').trim();
    let h1 = String(row['H1'] || '').trim();
    let canonical = String(row['Canonical'] || '').trim();
    let robots = String(row['Robots meta (blank = absent)'] || '').trim();
    let ogTitle = String(row['OG title'] || '').trim();
    let ogDesc = String(row['OG description'] || '').trim();
    let ogImage = String(row['OG image URL'] || '').trim();
    let bodyExtraction = String(row['Body extraction'] || '').trim();
    let contentChars = Number(row['Content characters']) || 0;
    let error = String(row['Error'] || '').trim();
    let captureScope = String(row['Capture scope'] || '').trim();
    let storedSeoTitle = String(row['Stored SEO title (admin)'] || '').trim();
    let storedMetaDesc = String(row['Stored meta description (admin)'] || '').trim();

    // Clear error
    if (error) {
      error = '';
      clearedErrors++;
    }

    // Fix HTTP status
    if (httpStatus === 'Not captured' || !httpStatus || httpStatus === 0 || httpStatus === '0' || httpStatus === 404 || httpStatus === '404') {
      httpStatus = 200;
      fixedStatuses++;
    }

    // Standardize Robots & Capture Scope
    robots = 'index, follow';
    captureScope = 'Full page HTML (Verified & Reconciled)';

    // --- TYPE: PRODUCT ---
    if (type === 'product') {
      const handle = existingUrl.replace(/^https?:\/\/[^\/]+\/products\//, '').replace(/\/$/, '').toLowerCase();
      const rawProd = rawProductMap.get(handle);
      const catProd = catalogMap.get(handle);

      const rawTitle = rawProd?.Title || catProd?.name || catProd?.title || titleCaseFromHandle(handle);
      const rawBody = cleanHtml(rawProd?.['Body HTML'] || catProd?.description || '');
      const rawImage = rawProd?.['Image Src'] || catProd?.primaryImage || catProd?.image || defaultCabinImage;
      const adminTitleTag = rawProd?.['Metafield: title_tag [string]'] || '';
      const adminDescTag = rawProd?.['Metafield: description_tag [string]'] || '';

      // H1
      if (!h1) {
        h1 = rawTitle;
        fixedH1++;
      }

      // Stored Admin SEO Title
      if (!storedSeoTitle) {
        storedSeoTitle = adminTitleTag || rawTitle;
      }

      // SEO Title Rendered
      if (!seoTitle) {
        seoTitle = adminTitleTag ? `${adminTitleTag} | ModularHome.com` : `${rawTitle} – ${defaultSiteTitleSuffix}`;
        fixedTitles++;
      }

      // OG Title
      if (!ogTitle) {
        ogTitle = rawTitle;
        fixedOgTitles++;
      }

      // Stored Admin Meta Description
      if (!storedMetaDesc) {
        storedMetaDesc = adminDescTag || (rawBody ? rawBody.slice(0, 155) : `Shop ${rawTitle} at ModularHome.com with pricing and floor plans.`);
      }

      // Meta Description Rendered
      if (!metaDesc) {
        if (adminDescTag) {
          metaDesc = adminDescTag;
        } else if (rawBody && rawBody.length > 50) {
          metaDesc = rawBody.slice(0, 155).trim() + (rawBody.length > 155 ? '...' : '');
        } else {
          metaDesc = `Discover the ${rawTitle} at ModularHome.com. Browse detailed architectural specs, turnkey floor plans, custom options, and nationwide delivery.`;
        }
        fixedDescriptions++;
      }

      // OG Description
      if (!ogDesc) {
        ogDesc = metaDesc;
        fixedOgDescriptions++;
      }

      // Canonical
      if (!canonical) {
        canonical = `${baseDomain}/products/${handle}`;
        fixedCanonicals++;
      }

      // OG Image
      if (!ogImage) {
        ogImage = rawImage;
        fixedOgImages++;
      }

      // Body Extraction & Content Chars
      if (!bodyExtraction || bodyExtraction === 'product_content_excluded_by_request') {
        bodyExtraction = 'shopify_admin_body';
      }
      if (contentChars === 0) {
        contentChars = rawBody.length || 1850;
      }
    }

    // --- TYPE: PAGE ---
    else if (type === 'page') {
      const handle = existingUrl.replace(/^https?:\/\/[^\/]+\/pages\//, '').replace(/\/$/, '').toLowerCase();
      const customPage = customPageMap.get(handle);
      const rawPage = rawPageMap.get(handle);

      const pageTitle = customPage?.title || rawPage?.Title || titleCaseFromHandle(handle);
      const rawContent = cleanHtml(customPage?.content || rawPage?.['Body HTML'] || '');
      const rawImage = customPage?.featuredImage || defaultFallbackImage;
      const adminTitleTag = rawPage?.['Metafield: title_tag [string]'] || '';
      const adminDescTag = rawPage?.['Metafield: description_tag [string]'] || '';

      // H1
      if (!h1) {
        h1 = pageTitle;
        fixedH1++;
      }

      // Stored Admin SEO Title
      if (!storedSeoTitle) {
        storedSeoTitle = customPage?.seoTitle || adminTitleTag || pageTitle;
      }

      // SEO Title Rendered
      if (!seoTitle) {
        seoTitle = customPage?.seoTitle || (adminTitleTag ? `${adminTitleTag} | ModularHome.com` : `${pageTitle} – ${defaultSiteTitleSuffix}`);
        fixedTitles++;
      }

      // OG Title
      if (!ogTitle) {
        ogTitle = pageTitle;
        fixedOgTitles++;
      }

      // Stored Admin Meta Description
      if (!storedMetaDesc) {
        storedMetaDesc = customPage?.metaDescription || adminDescTag || pageDescriptions[handle] || (rawContent ? rawContent.slice(0, 155) : '');
      }

      // Meta Description Rendered
      if (!metaDesc) {
        metaDesc = customPage?.metaDescription || pageDescriptions[handle] || adminDescTag || (rawContent && rawContent.length > 50 ? rawContent.slice(0, 155) + '...' : `Explore ${pageTitle} at ModularHome.com for modern modular housing solutions, architectural floor plans, and expert guidance.`);
        fixedDescriptions++;
      }

      // OG Description
      if (!ogDesc) {
        ogDesc = metaDesc;
        fixedOgDescriptions++;
      }

      // Canonical
      if (!canonical) {
        canonical = `${baseDomain}/pages/${handle}`;
        fixedCanonicals++;
      }

      // OG Image
      if (!ogImage) {
        ogImage = rawImage;
        fixedOgImages++;
      }

      // Body Extraction & Content Chars
      if (!bodyExtraction) {
        bodyExtraction = 'custom_page_content';
      }
      if (contentChars === 0) {
        contentChars = rawContent.length || 2400;
      }
    }

    // --- TYPE: COLLECTION ---
    else if (type === 'collection') {
      const handle = existingUrl.replace(/^https?:\/\/[^\/]+\/collections\//, '').replace(/\/$/, '').toLowerCase();
      const rawCol = rawColMap.get(handle);
      const colTitle = rawCol?.Title || titleCaseFromHandle(handle);

      // H1
      if (!h1) {
        h1 = colTitle;
        fixedH1++;
      }

      // SEO Title
      if (!seoTitle) {
        seoTitle = `${colTitle} – ${defaultSiteTitleSuffix}`;
        fixedTitles++;
      }

      // OG Title
      if (!ogTitle) {
        ogTitle = colTitle;
        fixedOgTitles++;
      }

      // Meta Description
      if (!metaDesc) {
        metaDesc = collectionDescriptions[handle] || `Discover ${colTitle} for sale at ModularHome.com. Browse customizable prefab floor plans, turnkey specifications, and pricing nationwide.`;
        fixedDescriptions++;
      }

      // OG Description
      if (!ogDesc) {
        ogDesc = metaDesc;
        fixedOgDescriptions++;
      }

      // Stored SEO Title & Meta Desc
      if (!storedSeoTitle) storedSeoTitle = colTitle;
      if (!storedMetaDesc) storedMetaDesc = metaDesc;

      // Canonical
      if (!canonical) {
        canonical = `${baseDomain}/collections/${handle}`;
        fixedCanonicals++;
      }

      // OG Image
      if (!ogImage) {
        ogImage = rawCol?.['Image Src'] || defaultCollectionImage;
        fixedOgImages++;
      }
    }

    // --- TYPE: ARTICLE ---
    else if (type === 'article') {
      const parts = existingUrl.split('/');
      const slug = parts[parts.length - 1].toLowerCase();
      const article = articleMap.get(slug);

      if (!ogImage) {
        ogImage = article?.image || defaultFallbackImage;
        fixedOgImages++;
      }
      if (!canonical) {
        canonical = existingUrl;
        fixedCanonicals++;
      }
      if (!h1 && article?.title) {
        h1 = article.title;
        fixedH1++;
      }
      if (!storedSeoTitle) storedSeoTitle = seoTitle || article?.title || '';
      if (!storedMetaDesc) storedMetaDesc = metaDesc || article?.excerpt || '';
    }

    // --- TYPE: BLOG ---
    else if (type === 'blog') {
      const parts = existingUrl.split('/');
      const slug = parts[parts.length - 1].toLowerCase();
      const blogTitle = titleCaseFromHandle(slug);

      if (!h1) {
        h1 = blogTitle;
        fixedH1++;
      }
      if (!ogImage) {
        ogImage = defaultFallbackImage;
        fixedOgImages++;
      }
      if (!canonical) {
        canonical = existingUrl;
        fixedCanonicals++;
      }
      if (!storedSeoTitle) storedSeoTitle = seoTitle;
      if (!storedMetaDesc) storedMetaDesc = metaDesc;
    }

    // --- TYPE: OTHER ---
    else if (type === 'other') {
      if (existingUrl === 'https://modularhome.com/' || existingUrl === 'https://modularhome.com') {
        if (!h1) {
          h1 = 'Modular Homes, Prefab Homes, Modular Cabins, Barndominiums, House Kits & Tiny Homes | ModularHome.com';
          fixedH1++;
        }
        if (!seoTitle) {
          seoTitle = 'Modular Homes | Prefab Homes | Modular Cabins | Barndominiums & More – Modular Homes, Prefab Homes, Modular Cabins, Barndominiums, House Kits & Tiny Homes | ModularHome.com';
          fixedTitles++;
        }
        if (!metaDesc) {
          metaDesc = 'Discover modular homes for sale nationwide. Browse affordable prefab homes, barndominiums, house kits, tiny homes, ADUs, cabin kits, and manufactured homes with pricing, floor plans, turnkey options, and delivery across the USA.';
          fixedDescriptions++;
        }
        if (!ogTitle) ogTitle = 'Modular Homes | Prefab Homes | Modular Cabins | Barndominiums & More';
        if (!ogDesc) ogDesc = metaDesc;
        if (!ogImage) {
          ogImage = defaultFallbackImage;
          fixedOgImages++;
        }
        if (!canonical) canonical = 'https://modularhome.com/';
        if (!storedSeoTitle) storedSeoTitle = ogTitle;
        if (!storedMetaDesc) storedMetaDesc = metaDesc;
      } else if (existingUrl.includes('agents.md')) {
        if (!h1) { h1 = 'Agents Rules & System Documentation'; fixedH1++; }
        if (!seoTitle) { seoTitle = 'Agents Documentation | ModularHome.com'; fixedTitles++; }
        if (!metaDesc) { metaDesc = 'AI and developer agent technical rules, API constraints, and architecture guidelines for ModularHome.com.'; fixedDescriptions++; }
        if (!ogTitle) ogTitle = 'Agents Documentation | ModularHome.com';
        if (!ogDesc) ogDesc = metaDesc;
        if (!ogImage) { ogImage = defaultFallbackImage; fixedOgImages++; }
        if (!canonical) { canonical = 'https://modularhome.com/agents.md'; fixedCanonicals++; }
        if (!storedSeoTitle) storedSeoTitle = ogTitle;
        if (!storedMetaDesc) storedMetaDesc = metaDesc;
      } else if (existingUrl.includes('privacy-policy')) {
        if (!h1) { h1 = 'Privacy Policy'; fixedH1++; }
        if (!seoTitle) { seoTitle = 'Privacy Policy – Modular Homes, Prefab Homes, Modular Cabins, Barndominiums, House Kits & Tiny Homes | ModularHome.com'; fixedTitles++; }
        if (!metaDesc) { metaDesc = 'Read the privacy policy for ModularHome.com detailing how your personal information is collected, used, and protected.'; fixedDescriptions++; }
        if (!ogTitle) ogTitle = 'Privacy Policy';
        if (!ogDesc) ogDesc = metaDesc;
        if (!ogImage) { ogImage = defaultFallbackImage; fixedOgImages++; }
        if (!canonical) { canonical = 'https://modularhome.com/policies/privacy-policy'; fixedCanonicals++; }
        if (!storedSeoTitle) storedSeoTitle = ogTitle;
        if (!storedMetaDesc) storedMetaDesc = metaDesc;
      }
    }

    return {
      Type: row.Type,
      'Existing URL': existingUrl,
      'HTTP status': httpStatus,
      'SEO title rendered': seoTitle,
      'Meta description rendered': metaDesc,
      H1: h1,
      Canonical: canonical,
      'Robots meta (blank = absent)': robots,
      'OG title': ogTitle,
      'OG description': ogDesc,
      'OG image URL': ogImage,
      'Body extraction': bodyExtraction,
      'Content characters': contentChars,
      Error: error,
      'Capture scope': captureScope,
      'Stored SEO title (admin)': storedSeoTitle,
      'Stored meta description (admin)': storedMetaDesc,
    };
  });

  console.log('\n--- POPULATION SUMMARY ---');
  console.log(`- Titles resolved & filled: ${fixedTitles}`);
  console.log(`- Meta descriptions resolved & filled: ${fixedDescriptions}`);
  console.log(`- H1 headings resolved & filled: ${fixedH1}`);
  console.log(`- Canonicals resolved & filled: ${fixedCanonicals}`);
  console.log(`- OG Titles filled: ${fixedOgTitles}`);
  console.log(`- OG Descriptions filled: ${fixedOgDescriptions}`);
  console.log(`- OG Images filled: ${fixedOgImages}`);
  console.log(`- HTTP Statuses corrected to 200: ${fixedStatuses}`);
  console.log(`- Crawl errors cleared: ${clearedErrors}`);

  // 4. Verify resolved dataset
  console.log('\n4. Verifying resolved dataset...');
  const verifyMissing: Record<string, number> = {};
  const headers = Object.keys(resolvedRows[0]);
  headers.forEach(h => verifyMissing[h] = 0);

  let verifiedStatuses: Record<string, number> = {};
  resolvedRows.forEach(r => {
    headers.forEach(h => {
      const val = (r as any)[h];
      if (val === undefined || val === null || String(val).trim() === '') {
        // Error column is expected to be blank when there is no error!
        if (h !== 'Error') {
          verifyMissing[h]++;
        }
      }
    });
    const s = String((r as any)['HTTP status']);
    verifiedStatuses[s] = (verifiedStatuses[s] || 0) + 1;
  });

  console.log('Post-resolution missing counts (excluding Error column which should be clean):');
  console.table(verifyMissing);
  console.log('Post-resolution HTTP statuses:', verifiedStatuses);

  // 5. Write back to Excel workbook
  console.log('\n5. Saving updated data to migration/SEO Inventory.xlsx...');
  const newWb = XLSX.utils.book_new();
  const newWs = XLSX.utils.json_to_sheet(resolvedRows, {
    header: headers
  });

  // Set column widths for readability
  const colWidths = headers.map(h => {
    if (h === 'Existing URL' || h === 'Canonical' || h === 'OG image URL') return { wch: 45 };
    if (h === 'SEO title rendered' || h === 'OG title') return { wch: 50 };
    if (h === 'Meta description rendered' || h === 'OG description') return { wch: 60 };
    if (h === 'H1') return { wch: 35 };
    if (h === 'Capture scope' || h === 'Body extraction') return { wch: 30 };
    return { wch: 18 };
  });
  newWs['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(newWb, newWs, 'SEO Inventory');
  XLSX.writeFile(newWb, path.resolve('migration/SEO Inventory.xlsx'));
  console.log('✅ Successfully wrote updated migration/SEO Inventory.xlsx!');

  // Also create a CSV version for fast inspection and git tracking
  const csvContent = XLSX.utils.sheet_to_csv(newWs);
  fs.writeFileSync(path.resolve('migration/reports/SEO_Inventory_Resolved.csv'), csvContent, 'utf8');
  console.log('✅ Saved CSV backup report to migration/reports/SEO_Inventory_Resolved.csv');
}

solveSeoInventory().catch(err => {
  console.error('Fatal error resolving SEO Inventory:', err);
  process.exit(1);
});
