const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const seoCorrectionFile = path.resolve('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx');
const wb = xlsx.readFile(seoCorrectionFile);
const blogCorrections = xlsx.utils.sheet_to_json(wb.Sheets['Blog SEO Corrections']);

console.log('Total blog corrections in report:', blogCorrections.length);

const migratedArticles = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));
console.log('Total migrated articles:', migratedArticles.length);

// Analyze URL differences
const diffUrls = blogCorrections.filter(r => r['URL path changed?'] === 'YES' || r['Old Shopify URL'] !== r['New Next.js URL']);
console.log('URL path differences count:', diffUrls.length);

// Check duplicate titles in report
const titleCount = {};
for (const r of blogCorrections) {
  const t = (r['Article title'] || '').trim();
  titleCount[t] = (titleCount[t] || 0) + 1;
}
const dupTitles = Object.entries(titleCount).filter(([t, c]) => c > 1);
console.log('Duplicate titles in report:', dupTitles);

// Check duplicate titles in migrated_articles.json
const titleCountMigrated = {};
for (const r of migratedArticles) {
  const t = (r.seoTitle || r.title || '').trim();
  titleCountMigrated[t] = (titleCountMigrated[t] || 0) + 1;
}
const dupTitlesMigrated = Object.entries(titleCountMigrated).filter(([t, c]) => c > 1);
console.log('Duplicate SEO titles in migrated articles:', dupTitlesMigrated);

// Check sample diff URLs
console.log('\nSample 5 URL diffs:');
for (let i = 0; i < Math.min(5, diffUrls.length); i++) {
  console.log(`Old: ${diffUrls[i]['Old Shopify URL']}`);
  console.log(`New: ${diffUrls[i]['New Next.js URL']}`);
  console.log(`Title: ${diffUrls[i]['Article title']}`);
  console.log('---');
}

// Check what admin_articles.json and admin_seo_articles.json contain
const adminArticlesPath = 'ModularHome_SEO_Blog_Developer_Handover/data/admin_articles.json';
if (fs.existsSync(adminArticlesPath)) {
  const adminArticles = JSON.parse(fs.readFileSync(adminArticlesPath, 'utf8'));
  console.log('Admin articles count:', Array.isArray(adminArticles) ? adminArticles.length : Object.keys(adminArticles).length);
}

const adminSeoArticlesPath = 'ModularHome_SEO_Blog_Developer_Handover/data/admin_seo_articles.json';
if (fs.existsSync(adminSeoArticlesPath)) {
  const adminSeo = JSON.parse(fs.readFileSync(adminSeoArticlesPath, 'utf8'));
  console.log('Admin SEO articles count:', Array.isArray(adminSeo) ? adminSeo.length : Object.keys(adminSeo).length);
  if (Array.isArray(adminSeo) && adminSeo.length > 0) {
    console.log('Sample admin SEO:', adminSeo[0]);
  }
}
