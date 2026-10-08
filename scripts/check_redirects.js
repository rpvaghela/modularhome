const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const seoCorrectionFile = path.resolve('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx');
const wb = xlsx.readFile(seoCorrectionFile);
const blogCorrections = xlsx.utils.sheet_to_json(wb.Sheets['Blog SEO Corrections']);
const shopifyRedirects = JSON.parse(fs.readFileSync('src/data/shopify_redirects.json', 'utf8'));

let presentCount = 0;
let missingRedirects = [];

blogCorrections.forEach((r, idx) => {
  const oldUrl = r['Old Shopify URL'];
  const newUrl = r['New Next.js URL'];
  const oldPath = oldUrl.replace('https://modularhome.com', '').toLowerCase();
  const newPath = newUrl.replace('https://modularhome.com', '').toLowerCase();

  if (oldPath !== newPath) {
    if (shopifyRedirects[oldPath]) {
      presentCount++;
      if (shopifyRedirects[oldPath].toLowerCase() !== newPath) {
        console.log(`Mismatch redirect: ${oldPath} -> current: ${shopifyRedirects[oldPath]} vs expected: ${newPath}`);
      }
    } else {
      missingRedirects.push({ oldPath, newPath, title: r['Article title'] });
    }
  }
});

console.log(`Of the 151 URL diffs, present in shopify_redirects.json: ${presentCount}, missing: ${missingRedirects.length}`);
if (missingRedirects.length > 0) {
  console.log('Sample missing redirects:', missingRedirects.slice(0, 5));
}
