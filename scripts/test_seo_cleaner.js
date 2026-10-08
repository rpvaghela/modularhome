const fs = require('fs');

const migrated = JSON.parse(fs.readFileSync('src/data/migrated_articles.json', 'utf8'));

function cleanTitle(title, slug) {
  let t = title.trim();
  // Remove existing redundant suffixes
  t = t.replace(/\s*–\s*Modular Homes,.*$/i, '');
  t = t.replace(/\s*\|\s*ModularHome\.com.*$/i, '');
  t = t.replace(/\s*-\s*ModularHome\.com.*$/i, '');
  t = t.trim();

  // If title is specific duplicate
  if (slug === 'why-modularhome-com-is-becoming-one-of-the-strongest-modular-construction-brands-in-america') {
    return 'Why ModularHome.com Leads Modular Construction | ModularHome.com';
  }
  if (slug === 'why-modularhome-com-is-becoming-one-of-the-strongest-modular-construction-brands-in-america-1') {
    return 'Building the Future of Modular Housing | ModularHome.com';
  }

  // If t + " | ModularHome.com" is <= 60 chars, append brand
  const branded = `${t} | ModularHome.com`;
  if (branded.length <= 60) {
    return branded;
  }
  
  // If branded is between 61 and 65 chars, it's also acceptable
  if (branded.length <= 65) {
    return branded;
  }

  // Otherwise, if title itself is <= 60 chars, use title directly or truncate cleanly
  if (t.length <= 60) {
    return t;
  }

  // Shorten long title
  // Try removing unnecessary words or sub-clauses
  let shortened = t;
  if (shortened.includes(':')) {
    const parts = shortened.split(':');
    if (parts[0].length >= 30 && parts[0].length <= 60) {
      shortened = parts[0];
    }
  }
  if (shortened.includes(' - ')) {
    const parts = shortened.split(' - ');
    if (parts[0].length >= 30 && parts[0].length <= 60) {
      shortened = parts[0];
    }
  }
  if (shortened.includes(' | ')) {
    const parts = shortened.split(' | ');
    if (parts[0].length >= 30 && parts[0].length <= 60) {
      shortened = parts[0];
    }
  }

  if (shortened.length > 57) {
    shortened = shortened.slice(0, 57).replace(/\s+\S*$/, '') + '...';
  }

  const shortBranded = `${shortened} | ModularHome.com`;
  if (shortBranded.length <= 60) return shortBranded;
  return shortened;
}

function cleanDescription(article) {
  const text = (article.excerpt || article.metaDescription || article.title || '').trim();
  // Strip html tags
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Find first 1-2 complete sentences that fit under 155 chars
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
  let desc = '';
  
  for (const s of sentences) {
    const trimmedS = s.trim();
    if ((desc + ' ' + trimmedS).trim().length <= 155) {
      desc = (desc + ' ' + trimmedS).trim();
    } else {
      break;
    }
  }

  if (!desc || desc.length < 70) {
    // If first sentence was too long or too short, truncate cleanly at word boundary
    if (clean.length > 150) {
      desc = clean.slice(0, 147).replace(/\s+\S*$/, '') + '...';
    } else {
      desc = clean;
    }
  }

  // Ensure it doesn't end with awkward comma or hyphen
  desc = desc.replace(/[,;:\-\s]+(\.\.\.)?$/, '$1').trim();
  if (!desc.endsWith('.') && !desc.endsWith('!') && !desc.endsWith('?') && !desc.endsWith('...')) {
    if (desc.length <= 154) {
      desc += '.';
    }
  }

  return desc;
}

// Test against all 190 articles
let maxTitleLen = 0;
let minTitleLen = 999;
let maxDescLen = 0;
let minDescLen = 999;
const titles = [];

migrated.forEach((art, i) => {
  const t = cleanTitle(art.title, art.slug);
  const d = cleanDescription(art);
  titles.push(t);
  if (t.length > maxTitleLen) maxTitleLen = t.length;
  if (t.length < minTitleLen) minTitleLen = t.length;
  if (d.length > maxDescLen) maxDescLen = d.length;
  if (d.length < minDescLen) minDescLen = d.length;
});

console.log(`Title length range: ${minTitleLen} - ${maxTitleLen} chars`);
console.log(`Description length range: ${minDescLen} - ${maxDescLen} chars`);

// Check duplicate titles
const titleCounts = {};
titles.forEach(t => { titleCounts[t] = (titleCounts[t] || 0) + 1; });
const dups = Object.entries(titleCounts).filter(([t, c]) => c > 1);
console.log('Duplicate titles after optimization:', dups);

// Sample 5 optimized outputs
console.log('\nSample 5 optimized titles & descriptions:');
migrated.slice(0, 5).forEach((art, i) => {
  console.log(`\n[${i + 1}] Title: ${cleanTitle(art.title, art.slug)} (${cleanTitle(art.title, art.slug).length} chars)`);
  console.log(`Desc: ${cleanDescription(art)} (${cleanDescription(art).length} chars)`);
});
