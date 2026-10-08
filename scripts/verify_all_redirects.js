const fs = require('fs');
const xlsx = require('xlsx');

const redirects = JSON.parse(fs.readFileSync('src/data/shopify_redirects.json', 'utf8'));
const migrated = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));
const wb = xlsx.readFile('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx');
const blogReport = xlsx.utils.sheet_to_json(wb.Sheets['Blog SEO Corrections']);

const migratedSlugs = new Set(migrated.map(a => a.slug.toLowerCase()));

let redirectPassed = 0;
let redirectFailed = [];
let directPassed = 0;
let directFailed = [];

blogReport.forEach((r, idx) => {
  const oldUrl = r['Old Shopify URL'];
  const newUrl = r['New Next.js URL'];
  const oldPath = oldUrl.replace('https://modularhome.com', '').toLowerCase();
  const newPath = newUrl.replace('https://modularhome.com', '').toLowerCase();
  const newSlug = newUrl.split('/').pop().toLowerCase();

  if (oldPath !== newPath) {
    // Should have 301 redirect in redirects
    const target = redirects[oldPath];
    if (!target) {
      redirectFailed.push({ idx: idx + 1, oldPath, expected: newPath, error: 'No redirect entry' });
    } else if (target.toLowerCase() !== newPath) {
      redirectFailed.push({ idx: idx + 1, oldPath, expected: newPath, actual: target, error: 'Target mismatch' });
    } else {
      // Check if target redirects again (avoid redirect chain)
      if (redirects[target.toLowerCase()]) {
        redirectFailed.push({ idx: idx + 1, oldPath, target, secondHop: redirects[target.toLowerCase()], error: 'Redirect chain detected' });
      } else if (!migratedSlugs.has(newSlug)) {
        redirectFailed.push({ idx: idx + 1, oldPath, newSlug, error: 'Destination article slug not found in migrated articles' });
      } else {
        redirectPassed++;
      }
    }
  } else {
    // Direct match (no redirect needed)
    if (!migratedSlugs.has(newSlug)) {
      directFailed.push({ idx: idx + 1, newPath, newSlug, error: 'Direct article slug not found in migrated articles' });
    } else {
      directPassed++;
    }
  }
});

console.log(`\n=== 301 Redirect & Route Verification ===`);
console.log(`301 Redirects Tested: ${redirectPassed + redirectFailed.length} (Expected 151)`);
console.log(`301 Redirects Passed (Direct 1-Hop, No Chains): ${redirectPassed}`);
console.log(`301 Redirects Failed: ${redirectFailed.length}`);
if (redirectFailed.length > 0) {
  console.log('Failed redirects:', redirectFailed);
}

console.log(`\nDirect 200 OK Routes Tested: ${directPassed + directFailed.length} (Expected 39)`);
console.log(`Direct 200 OK Routes Passed: ${directPassed}`);
console.log(`Direct 200 OK Routes Failed: ${directFailed.length}`);
