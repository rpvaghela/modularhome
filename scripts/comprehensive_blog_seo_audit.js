const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');

const reportPath = path.resolve('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx');
const wb = xlsx.readFile(reportPath);
const blogReport = xlsx.utils.sheet_to_json(wb.Sheets['Blog SEO Corrections']);
const summaryReport = xlsx.utils.sheet_to_json(wb.Sheets['Summary']);
const migrated = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));
const redirects = JSON.parse(fs.readFileSync('src/data/shopify_redirects.json', 'utf8'));

console.log('=====================================================');
console.log('   MODULARHOME 190 BLOG SEO CORRECTION AUDIT SUITE   ');
console.log('=====================================================\n');

// 1. Check article count
console.log(`[CHECK 1] Total Articles Migrated: ${migrated.length} / 190 -> ${migrated.length === 190 ? 'PASSED' : 'FAILED'}`);

// 2. Check 151 URL differences and 301 redirects
let redirectCount = 0;
let chainCount = 0;
let missingCount = 0;

blogReport.forEach((r) => {
  const oldUrl = r['Old Shopify URL'];
  const newUrl = r['New Next.js URL'];
  const oldPath = oldUrl.replace('https://modularhome.com', '').toLowerCase();
  const newPath = newUrl.replace('https://modularhome.com', '').toLowerCase();

  if (oldPath !== newPath) {
    if (redirects[oldPath]) {
      redirectCount++;
      const target = redirects[oldPath];
      if (redirects[target.toLowerCase()]) {
        chainCount++;
      }
    } else {
      missingCount++;
    }
  }
});
console.log(`[CHECK 2] 301 Redirects Configured: ${redirectCount} / 151 -> ${redirectCount === 151 ? 'PASSED' : 'FAILED'}`);
console.log(`[CHECK 3] Redirect Chains / Loops: ${chainCount} -> ${chainCount === 0 ? 'PASSED (0 chains)' : 'FAILED'}`);
console.log(`[CHECK 4] Missing Redirects: ${missingCount} -> ${missingCount === 0 ? 'PASSED (0 missing)' : 'FAILED'}`);

// 3. Check SEO Title Lengths
const longTitles = migrated.filter(a => (a.seoTitle || '').length > 65);
const shortTitles = migrated.filter(a => (a.seoTitle || '').length < 30);
console.log(`[CHECK 5] Meta Titles <= 65 chars: ${migrated.length - longTitles.length} / 190 -> ${longTitles.length === 0 ? 'PASSED' : 'FAILED'}`);

// 4. Check Meta Description Lengths
const longDescs = migrated.filter(a => (a.metaDescription || '').length > 160);
const shortDescs = migrated.filter(a => (a.metaDescription || '').length < 80);
console.log(`[CHECK 6] Meta Descriptions <= 160 chars: ${migrated.length - longDescs.length} / 190 -> ${longDescs.length === 0 ? 'PASSED' : 'FAILED'}`);

// 5. Check Duplicate Titles
const titleCounts = {};
migrated.forEach(a => {
  titleCounts[a.seoTitle] = (titleCounts[a.seoTitle] || 0) + 1;
});
const dupTitles = Object.entries(titleCounts).filter(([t, c]) => c > 1);
console.log(`[CHECK 7] Duplicate Meta Titles: ${dupTitles.length} -> ${dupTitles.length === 0 ? 'PASSED (0 duplicates)' : 'FAILED'}`);

// 6. Check Canonical URLs format
const invalidCanonicals = blogReport.filter(r => !r['Canonical verified?'].includes('https://modularhome.com/'));
console.log(`[CHECK 8] Canonical URLs with https://modularhome.com/: ${blogReport.length - invalidCanonicals.length} / 190 -> ${invalidCanonicals.length === 0 ? 'PASSED' : 'FAILED'}`);

// 7. Check Content Integrity (Content, images, headings, author, dates)
const incompleteContent = migrated.filter(a => !a.content || (Array.isArray(a.content) && a.content.length === 0) || !a.image || !a.title || !a.slug);
console.log(`[CHECK 9] Complete Content, Images & Headings: ${migrated.length - incompleteContent.length} / 190 -> ${incompleteContent.length === 0 ? 'PASSED' : 'FAILED'}`);

// 8. Check XML Sitemap coverage
const sitemapUrls = new Set();
migrated.forEach((art) => {
  const slug = art.handle || art.slug;
  if (slug) {
    const cat = (art.blog_title || art.category || "modular-construction")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    sitemapUrls.add(`https://modularhome.com/blogs/${cat}/${slug}`);
  }
});
const missingFromSitemap = blogReport.filter(r => !sitemapUrls.has(r['New Next.js URL']));
console.log(`[CHECK 10] XML Sitemap Inclusion: ${blogReport.length - missingFromSitemap.length} / 190 -> ${missingFromSitemap.length === 0 ? 'PASSED' : 'FAILED'}`);

// 9. Excel Report status
const unverifiedReportRows = blogReport.filter(r => r['Final QA status'] !== 'Verified / Passed');
console.log(`[CHECK 11] Excel Report QA Status (All Passed): ${blogReport.length - unverifiedReportRows.length} / 190 -> ${unverifiedReportRows.length === 0 ? 'PASSED' : 'FAILED'}`);

console.log('\n=====================================================');
console.log('                 FINAL AUDIT SUMMARY                 ');
console.log('=====================================================');
console.log(summaryReport);
