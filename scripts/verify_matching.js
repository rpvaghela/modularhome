const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const seoCorrectionFile = path.resolve('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx');
const wb = xlsx.readFile(seoCorrectionFile);
const blogCorrections = xlsx.utils.sheet_to_json(wb.Sheets['Blog SEO Corrections']);

const migratedArticles = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));

console.log('Comparing 190 items between Excel and migrated_articles.json:');

let matchedCount = 0;
let unmatched = [];

blogCorrections.forEach((r, idx) => {
  const oldUrl = r['Old Shopify URL'];
  const newUrl = r['New Next.js URL'];
  const title = r['Article title'];
  
  // Extract slug from newUrl
  const newSlug = newUrl.split('/').pop();
  const oldSlug = oldUrl.split('/').pop();
  
  const found = migratedArticles.find(a => 
    a.slug === newSlug || 
    a.slug === oldSlug || 
    a.title.toLowerCase().trim() === title.toLowerCase().trim()
  );
  
  if (found) {
    matchedCount++;
  } else {
    unmatched.push({ idx: idx + 1, title, oldUrl, newUrl, oldSlug, newSlug });
  }
});

console.log(`Matched: ${matchedCount} / ${blogCorrections.length}`);
if (unmatched.length > 0) {
  console.log('Unmatched:', unmatched);
}

// Let's inspect category distribution in migratedArticles
const categories = {};
migratedArticles.forEach(a => {
  categories[a.category] = (categories[a.category] || 0) + 1;
});
console.log('\nCategories in migrated_articles.json:', categories);
