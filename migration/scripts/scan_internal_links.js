const fs = require('fs');
const path = require('path');

const redirects = JSON.parse(fs.readFileSync(path.resolve('src/data/shopify_redirects.json'), 'utf8'));
const redirectSources = Object.keys(redirects);

function scanSrc(dir, matches = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      scanSrc(full, matches);
    } else if (/\.(tsx|ts|jsx|js)$/.test(f)) {
      const content = fs.readFileSync(full, 'utf8');
      for (const src of redirectSources) {
        if (content.includes(`"${src}"`) || content.includes(`'${src}'`) || content.includes(`\`${src}\``) || content.includes(`href="${src}"`) || content.includes(`href='${src}'`)) {
          matches.push({ file: path.relative('.', full), oldUrl: src, newUrl: redirects[src] });
        }
      }
    }
  }
  return matches;
}

const found = scanSrc(path.resolve('src'));
console.log('Internal links pointing to old URLs in src/:', found.length);
if (found.length > 0) {
  console.log(JSON.stringify(found, null, 2));
} else {
  console.log('All internal links point directly to their final canonical URLs.');
}
