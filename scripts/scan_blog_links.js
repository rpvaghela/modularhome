const fs = require('fs');

const migrated = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));
const linkRegex = /href=["']([^"']+)["']/gi;

const internalLinks = new Set();
const oldBlogLinks = new Set();
const shopifyCdnLinks = new Set();

migrated.forEach(article => {
  const contentStr = Array.isArray(article.content) ? article.content.join(' ') : (article.content || '');
  let match;
  while ((match = linkRegex.exec(contentStr)) !== null) {
    const url = match[1];
    if (url.startsWith('/') || url.includes('modularhome.com')) {
      internalLinks.add(url);
      if (url.includes('/blogs/modular-homes/')) {
        oldBlogLinks.add(url);
      }
    }
    if (url.includes('cdn.shopify.com')) {
      shopifyCdnLinks.add(url);
    }
  }
});

console.log(`Found ${internalLinks.size} unique internal links in 190 blogs.`);
console.log(`Found ${oldBlogLinks.size} links to old /blogs/modular-homes/ in blog bodies:`);
console.log(Array.from(oldBlogLinks).slice(0, 10));
console.log(`\nFound ${shopifyCdnLinks.size} CDN asset links.`);
