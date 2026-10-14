const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('src/data/all_products_catalog.json', 'utf8'));
console.log(`Total active products in catalog: ${catalog.length}`);

// Category breakdown
const catCounts = {};
catalog.forEach(p => {
  catCounts[p.category] = (catCounts[p.category] || 0) + 1;
});
console.log('Category breakdown:', catCounts);

// Find products with move-in-ready, turnkey, modular in name, description, tags, collections
const turnkeyOrMoveIn = [];
catalog.forEach(p => {
  const text = `${p.name} ${p.slug} ${p.description || ''} ${(p.collections || []).join(' ')} ${(p.tags || []).join(' ')} ${p.series || ''}`;
  const isMoveInOrTurnkey = /move[- ]in[- ]ready|turnkey/i.test(text);
  const isModular = /modular/i.test(text);
  if (isMoveInOrTurnkey || (isModular && !/kit|shell/i.test(p.slug))) {
    turnkeyOrMoveIn.push({
      slug: p.slug,
      name: p.name,
      category: p.category,
      isMoveIn: /move[- ]in[- ]ready/i.test(text),
      isTurnkey: /turnkey/i.test(text),
      isKitOrShell: /kit|shell/i.test(p.slug) || /kit|shell/i.test(p.name),
      collections: p.collections || []
    });
  }
});

console.log(`Found ${turnkeyOrMoveIn.length} products with turnkey/move-in/modular text`);

const nonKitMoveIn = turnkeyOrMoveIn.filter(p => !p.isKitOrShell);
console.log(`Of which non-kit/non-shell: ${nonKitMoveIn.length}`);

console.log('\nSample non-kit move-in / turnkey models:');
nonKitMoveIn.slice(0, 30).forEach(p => {
  console.log(`[${p.category}] ${p.slug} | ${p.name} (moveIn: ${p.isMoveIn}, turnkey: ${p.isTurnkey})`);
});
