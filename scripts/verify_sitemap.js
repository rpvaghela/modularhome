const fs = require('fs');
const xlsx = require('xlsx');

const migrated = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));
const wb = xlsx.readFile('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx');
const blogReport = xlsx.utils.sheet_to_json(wb.Sheets['Blog SEO Corrections']);

const sitemapUrls = new Set();
const baseUrl = 'https://modularhome.com';

migrated.forEach((art) => {
  const slug = art.handle || art.slug;
  if (slug) {
    const cat = (art.blog_title || art.category || "modular-construction")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    const fullUrl = `${baseUrl}/blogs/${cat}/${slug}`;
    sitemapUrls.add(fullUrl);
  }
});

console.log(`Generated ${sitemapUrls.size} sitemap blog URLs.`);

let matched = 0;
let mismatches = [];

blogReport.forEach((r, idx) => {
  const expectedUrl = r['New Next.js URL'];
  if (sitemapUrls.has(expectedUrl)) {
    matched++;
  } else {
    mismatches.push({ idx: idx + 1, expectedUrl });
  }
});

console.log(`Sitemap matching with Excel report: ${matched} / ${blogReport.length}`);
if (mismatches.length > 0) {
  console.log('Mismatches:', mismatches);
}
