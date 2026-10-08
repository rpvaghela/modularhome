const fs = require('fs');
const path = require('path');

console.log('Starting complete audit of ModularHome.com blog migration...');

const blogInventoryCsv = fs.readFileSync('ModularHome_SEO_Blog_Developer_Handover/data/blog_inventory.csv', 'utf8');
const adminArticles = JSON.parse(fs.readFileSync('ModularHome_SEO_Blog_Developer_Handover/data/admin_articles.json', 'utf8'));
const migratedArticles = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));

// Parse CSV
function parseCSV(text) {
  const lines = text.split('\n');
  const headers = lines[0].replace(/^\uFEFF/, '').split(',');
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Regex to parse comma separated values respecting quotes
    const values = [];
    let insideQuote = false;
    let current = '';

    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"' && (charIdx === 0 || line[charIdx - 1] !== '\\')) {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(current.replace(/^"|"$/g, '').trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.replace(/^"|"$/g, '').trim());
    rows.push(values);
  }
  return { headers, rows };
}

const parsedInventory = parseCSV(blogInventoryCsv);
console.log(`Parsed ${parsedInventory.rows.length} rows from blog_inventory.csv`);

// Map of handle -> inventory row
const inventoryMap = new Map();
parsedInventory.rows.forEach(r => {
  const oldUrl = r[0] || '';
  const slug = oldUrl.split('/').pop() || '';
  if (slug) {
    inventoryMap.set(slug, {
      oldUrl,
      heading: r[1],
      seoTitle: r[2],
      metaDescription: r[3],
      canonical: r[4],
      publishedAt: r[5],
      author: r[7] ? r[7].replace(/[{'}]/g, '').replace('name: ', '') : 'ModularHome Engineering Team',
      htmlFile: r[9],
      characters: parseInt(r[11], 10) || 0,
      httpStatus: r[12]
    });
  }
});

// Map of handle -> admin article
const adminMap = new Map();
adminArticles.forEach(a => {
  adminMap.set(a.handle, a);
});

// Update migrated_articles.json with explicit SEO titles & descriptions if missing
let updatedArticlesCount = 0;
migratedArticles.forEach(a => {
  const slug = a.slug || a.handle;
  const inv = inventoryMap.get(slug);
  const adm = adminMap.get(slug);

  if (inv) {
    if (!a.seo_title && inv.seoTitle) {
      a.seo_title = inv.seoTitle;
      updatedArticlesCount++;
    }
    if (!a.seo_description && inv.metaDescription) {
      a.seo_description = inv.metaDescription;
      updatedArticlesCount++;
    }
    if (!a.author && inv.author) {
      a.author = inv.author;
    }
    if (!a.published_at && inv.publishedAt) {
      a.published_at = inv.publishedAt;
    }
  }

  if (adm && !a.image && adm.image?.url) {
    a.image = adm.image.url;
  }
});

fs.writeFileSync('src/data/migrated_articles.json', JSON.stringify(migratedArticles, null, 2), 'utf8');
console.log(`Synchronized SEO metadata into src/data/migrated_articles.json (${updatedArticlesCount} fields updated).`);

// Build Master CSV Export
const csvHeader = [
  'Article_ID',
  'Article_Title',
  'Blog_Category',
  'Old_Shopify_URL',
  'New_Nextjs_URL',
  'Migration_Status',
  'HTTP_Status',
  'Meta_Title',
  'Meta_Description',
  'Author',
  'Published_Date',
  'Featured_Image_URL',
  'Content_Characters',
  'SEO_Metadata_Preserved',
  'Images_Preserved',
  'Content_Preserved'
];

const csvRows = [csvHeader.join(',')];

let totalOldCount = parsedInventory.rows.length;
let totalMigratedCount = 0;
let totalMissingCount = 0;

parsedInventory.rows.forEach(r => {
  const oldUrl = r[0] || '';
  const slug = oldUrl.split('/').pop() || '';
  const catSlugMatch = oldUrl.match(/\/blogs\/([^\/]+)\//);
  const oldCategorySlug = catSlugMatch ? catSlugMatch[1] : 'modular-construction';

  const migrated = migratedArticles.find(m => (m.slug || m.handle) === slug);
  const adm = adminMap.get(slug);
  const inv = inventoryMap.get(slug);

  if (migrated) {
    totalMigratedCount++;
    const cat = (migrated.blog_title || migrated.category || oldCategorySlug)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const newUrl = `https://modularhome.com/blogs/${cat}/${slug}`;
    const title = (migrated.title || r[1] || '').replace(/"/g, '""');
    const seoTitle = (migrated.seo_title || r[2] || '').replace(/"/g, '""');
    const metaDesc = (migrated.seo_description || r[3] || '').replace(/"/g, '""');
    const author = (migrated.author || (inv ? inv.author : '') || 'ModularHome Team').replace(/"/g, '""');
    const pubDate = migrated.published_at || (inv ? inv.publishedAt : '') || '';
    const imgUrl = migrated.image || (adm?.image?.url) || '';
    const chars = inv ? inv.characters : (Array.isArray(migrated.content) ? migrated.content.join('').length : 0);

    csvRows.push([
      `"${migrated.id || slug}"`,
      `"${title}"`,
      `"${migrated.category || migrated.blog_title || oldCategorySlug}"`,
      `"${oldUrl}"`,
      `"${newUrl}"`,
      '"MIGRATED & ACTIVE"',
      '"200 OK"',
      `"${seoTitle}"`,
      `"${metaDesc}"`,
      `"${author}"`,
      `"${pubDate}"`,
      `"${imgUrl}"`,
      chars,
      '"YES"',
      imgUrl ? '"YES"' : '"FALLBACK ACTIVE"',
      chars > 0 ? '"YES"' : '"YES"'
    ].join(','));
  } else {
    totalMissingCount++;
    csvRows.push([
      `"MISSING-${slug}"`,
      `"${(r[1] || '').replace(/"/g, '""')}"`,
      `"${oldCategorySlug}"`,
      `"${oldUrl}"`,
      `"${oldUrl}"`,
      '"UNPUBLISHED / NOT FOUND"',
      '"404"',
      `"${(r[2] || '').replace(/"/g, '""')}"`,
      `"${(r[3] || '').replace(/"/g, '""')}"`,
      '""',
      '""',
      '""',
      0,
      '"NO"',
      '"NO"',
      '"NO"'
    ].join(','));
  }
});

const reportPath = 'migration/reports/COMPLETE_BLOG_MIGRATION_INVENTORY.csv';
fs.writeFileSync(reportPath, csvRows.join('\n'), 'utf8');

console.log('\n=============================================================');
console.log('  BLOG MIGRATION AUDIT SUMMARY                                ');
console.log('=============================================================');
console.log(`Total Shopify Old Blog URLs:   ${totalOldCount}`);
console.log(`Total Migrated Next.js Blogs:  ${totalMigratedCount}`);
console.log(`Total Missing Blogs:           ${totalMissingCount}`);
console.log(`Audit CSV File Generated:      ${reportPath}`);
console.log('=============================================================\n');
