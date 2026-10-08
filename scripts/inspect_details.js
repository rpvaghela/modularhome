const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const seoCorrectionFile = path.resolve('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx');
const wb = xlsx.readFile(seoCorrectionFile);
const blogCorrections = xlsx.utils.sheet_to_json(wb.Sheets['Blog SEO Corrections']);

console.log('Sample rows from Blog SEO Corrections:');
blogCorrections.forEach((r, idx) => {
  if (r['Duplicate meta title?'] === 'YES' || r['Article title'].includes('Why ModularHome.com Is Becoming')) {
    console.log(`\nDuplicate Title Row ${idx + 1}:`, {
      title: r['Article title'],
      oldUrl: r['Old Shopify URL'],
      newUrl: r['New Next.js URL'],
      metaTitleChars: r['Meta title characters'],
      metaDescChars: r['Meta description characters'],
      action: r['Developer action']
    });
  }
});

// Check all URL categories
const categoryMap = {};
blogCorrections.forEach(r => {
  const oldUrl = r['Old Shopify URL'];
  const newUrl = r['New Next.js URL'];
  const oldParts = oldUrl.replace('https://modularhome.com/', '').split('/');
  const newParts = newUrl.replace('https://modularhome.com/', '').split('/');
  const key = `${oldParts[0]}/${oldParts[1]} -> ${newParts[0]}/${newParts[1]}`;
  categoryMap[key] = (categoryMap[key] || 0) + 1;
});
console.log('\nURL Path Transitions:', categoryMap);

// Check titles with long site-wide suffixes
const migratedArticles = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));
console.log('\nSample 5 migrated article SEO Titles and Descriptions:');
migratedArticles.slice(0, 5).forEach((a, i) => {
  console.log(`\n--- Article ${i + 1}: ${a.title} ---`);
  console.log('Slug:', a.slug);
  console.log('Category:', a.category);
  console.log('seoTitle:', a.seoTitle);
  console.log('seoTitle length:', (a.seoTitle || '').length);
  console.log('metaDescription:', a.metaDescription);
  console.log('metaDescription length:', (a.metaDescription || '').length);
});

// Check the duplicate title in migratedArticles
const dupInMigrated = migratedArticles.filter(a => a.title && a.title.includes('Why ModularHome.com Is Becoming One of the Strongest'));
console.log('\nDuplicate articles in migrated_articles.json:', dupInMigrated.map(a => ({
  id: a.id,
  slug: a.slug,
  title: a.title,
  category: a.category,
  excerpt: a.excerpt ? a.excerpt.slice(0, 100) : '',
  seoTitle: a.seoTitle
})));
