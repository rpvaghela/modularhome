const fs = require('fs');
const path = require('path');

// 1. Parse CSV safely
function parseCsv(content) {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];
  const headerLine = lines[0].replace(/^\uFEFF/, '').trim();
  const headers = headerLine.split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = [];
    let insideQuotes = false;
    let currentCell = '';

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        if (insideQuotes && line[c + 1] === '"') {
          currentCell += '"';
          c++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        cells.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.trim());

    const row = {};
    headers.forEach((h, idx) => {
      let val = cells[idx] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      row[h] = val;
    });
    rows.push(row);
  }
  return rows;
}

// Load SEO inventory
const seoCsvPath = path.join(__dirname, '..', 'ModularHome_SEO_Blog_Developer_Handover', 'data', 'seo_inventory.csv');
const seoRows = fs.existsSync(seoCsvPath) ? parseCsv(fs.readFileSync(seoCsvPath, 'utf8')) : [];
const seoUrlMap = new Map();
seoRows.forEach(r => {
  if (r.url) {
    const cleanUrl = r.url.replace(/^https?:\/\/[^\/]+/, '').toLowerCase().replace(/\/+$/, '');
    seoUrlMap.set(cleanUrl, r);
  }
});
console.log('Loaded SEO inventory items:', seoUrlMap.size);

// Load Articles
const articlesPath = path.join(__dirname, '..', 'ModularHome_SEO_Blog_Developer_Handover', 'data', 'admin_articles.json');
const adminArticles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

const defaultBlogImg = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';

const migratedArticles = adminArticles.map(a => {
  const handle = a.handle || '';
  const urlPath = `/blogs/modular-homes/${handle}`.toLowerCase();
  const altPath = `/blogs/modular-cabins/${handle}`.toLowerCase();
  const seoData = seoUrlMap.get(urlPath) || seoUrlMap.get(altPath) || {};

  let formattedDate = 'Recent';
  if (a.publishedAt || a.createdAt) {
    try {
      const d = new Date(a.publishedAt || a.createdAt);
      if (!isNaN(d.getTime())) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        formattedDate = `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
      }
    } catch {}
  }

  const rawImg = a.image ? (typeof a.image === 'string' ? a.image : (a.image.url || a.image.src)) : null;
  const image = (rawImg && !rawImg.includes('newmodularlogo') && !rawImg.includes('finallogo'))
    ? rawImg
    : (seoData.og_image || defaultBlogImg);

  const cleanBody = (a.body || '').trim();
  const excerpt = a.summary || seoData.meta_description || (cleanBody ? cleanBody.replace(/<[^>]*>/g, ' ').slice(0, 180).trim() + '...' : '');

  const wordCount = (cleanBody.replace(/<[^>]*>/g, ' ').match(/\S+/g) || []).length;
  const minutes = Math.max(3, Math.ceil(wordCount / 200));

  return {
    id: a.id || `art-${handle}`,
    slug: handle,
    title: a.title,
    category: (a.blog && a.blog.title) ? a.blog.title : 'Building Guides',
    readTime: `${minutes} min read`,
    author: (a.author && typeof a.author === 'object') ? (a.author.name || 'ModularHome Team') : (a.author || 'ModularHome Team'),
    excerpt: excerpt,
    content: cleanBody ? [cleanBody] : [],
    image: image,
    date: formattedDate,
    published_at: a.publishedAt || a.createdAt,
    status: a.isPublished !== false ? 'PUBLISHED' : 'DRAFT',
    tags: Array.isArray(a.tags) ? a.tags : (typeof a.tags === 'string' ? a.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
    seoTitle: seoData.seo_title || `${a.title} | ModularHome.com Guide`,
    metaDescription: seoData.meta_description || excerpt
  };
});

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'migrated_articles.json'),
  JSON.stringify(migratedArticles, null, 2),
  'utf8'
);
console.log('Saved migrated_articles.json count:', migratedArticles.length);

// Load Pages
const pagesPath = path.join(__dirname, '..', 'ModularHome_SEO_Blog_Developer_Handover', 'data', 'admin_pages.json');
const adminPages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));

const defaultPageImg = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';

const migratedPages = adminPages.map(p => {
  const handle = p.handle || '';
  const urlPath = `/pages/${handle}`.toLowerCase();
  const seoData = seoUrlMap.get(urlPath) || {};

  const cleanBody = (p.body || '').trim();
  const subtitle = seoData.meta_description || (cleanBody ? cleanBody.replace(/<[^>]*>/g, ' ').slice(0, 140).trim() + '...' : `Explore ${p.title} architectural plans and options.`);

  return {
    id: p.id || `page-${handle}`,
    title: p.title,
    slug: handle,
    subtitle: subtitle,
    content: cleanBody || `<p>Welcome to ${p.title}. Explore precision modular construction options, engineered floor plans, and rapid prefab delivery options across North America.</p>`,
    status: p.isPublished !== false ? 'PUBLISHED' : 'DRAFT',
    featuredImage: seoData.og_image || defaultPageImg,
    seoTitle: seoData.seo_title || `${p.title} | ModularHome.com`,
    metaDescription: seoData.meta_description || subtitle,
    sections: [
      {
        id: `sec-${handle}-trust`,
        pageId: p.id || `page-${handle}`,
        type: 'TRUST',
        title: `Why Build With ModularHome.com`,
        displayOrder: 1,
        isVisible: true
      },
      {
        id: `sec-${handle}-cta`,
        pageId: p.id || `page-${handle}`,
        type: 'CTA',
        title: `Ready to Build ${p.title}?`,
        subtitle: `Get an itemized quote or consult with our architectural design team.`,
        displayOrder: 2,
        isVisible: true
      }
    ]
  };
});

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'custom_pages.json'),
  JSON.stringify(migratedPages, null, 2),
  'utf8'
);
console.log('Saved custom_pages.json count:', migratedPages.length);

// Update Redirects
const redirectsPath = path.join(__dirname, '..', 'src', 'data', 'shopify_redirects.json');
const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

const existingRedirectsCsvPath = path.join(__dirname, '..', 'ModularHome_SEO_Blog_Developer_Handover', 'data', 'existing_redirects.csv');
if (fs.existsSync(existingRedirectsCsvPath)) {
  const existingCsv = parseCsv(fs.readFileSync(existingRedirectsCsvPath, 'utf8'));
  existingCsv.forEach(r => {
    if (r.path && r.target) {
      redirects[r.path.toLowerCase()] = r.target;
    }
  });
}

fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2), 'utf8');
console.log('Updated shopify_redirects.json total keys:', Object.keys(redirects).length);
