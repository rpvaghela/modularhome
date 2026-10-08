const fs = require('fs');

const migrated = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));

console.log(`Verifying full content integrity for ${migrated.length} blogs...`);

let passed = 0;
const errors = [];

migrated.forEach((art, idx) => {
  const issues = [];
  if (!art.id) issues.push('Missing ID');
  if (!art.title || art.title.length < 5) issues.push('Missing or invalid title');
  if (!art.slug || art.slug.length < 3) issues.push('Missing or invalid slug');
  if (!art.category) issues.push('Missing category');
  if (!art.date) issues.push('Missing date');
  if (!art.image || art.image.length < 5) issues.push('Missing image');
  if (!art.content || (Array.isArray(art.content) && art.content.length === 0)) issues.push('Missing content');
  if (!art.seoTitle || art.seoTitle.length < 20 || art.seoTitle.length > 70) issues.push(`Invalid seoTitle length: ${(art.seoTitle || '').length}`);
  if (!art.metaDescription || art.metaDescription.length < 80 || art.metaDescription.length > 165) issues.push(`Invalid metaDescription length: ${(art.metaDescription || '').length}`);

  if (issues.length === 0) {
    passed++;
  } else {
    errors.push({ idx: idx + 1, slug: art.slug, issues });
  }
});

console.log(`Content Integrity Results: ${passed} / ${migrated.length} Passed`);
if (errors.length > 0) {
  console.log('Errors found:', errors);
}
