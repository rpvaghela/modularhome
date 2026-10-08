const fs = require('fs');

const migrated = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));
const linkRegex = /href=["']([^"']+)["']/gi;
const links = new Set();
migrated.forEach(article => {
  const contentStr = Array.isArray(article.content) ? article.content.join(' ') : (article.content || '');
  let match;
  while ((match = linkRegex.exec(contentStr)) !== null) {
    links.add(match[1]);
  }
});
console.log('All links found in 190 blog posts:', Array.from(links));
