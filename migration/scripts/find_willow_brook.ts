import * as fs from 'fs';
import * as path from 'path';

// 1. Check all_products_catalog.json
const catalogPath = path.join(__dirname, '..', '..', 'src', 'data', 'all_products_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const willowCatalog = catalog.filter((p: any) => {
  const text = `${p.name} ${p.slug} ${p.title || ''} ${p.handle || ''}`.toLowerCase();
  return text.includes('willow') && text.includes('brook');
});

console.log(`Found ${willowCatalog.length} Willow Brook products in all_products_catalog.json:`);
willowCatalog.forEach((p: any, idx: number) => {
  console.log(`${idx + 1}. [${p.category}] "${p.name}" (slug: ${p.slug})`);
});

// 2. Check models.ts
const modelsPath = path.join(__dirname, '..', '..', 'src', 'data', 'models.ts');
const modelsContent = fs.readFileSync(modelsPath, 'utf8');
const hasInModels = modelsContent.toLowerCase().includes('willow') && modelsContent.toLowerCase().includes('brook');
console.log(`\nPresent in src/data/models.ts: ${hasInModels}`);

// 3. Check shopify_redirects.json
const redirectsPath = path.join(__dirname, '..', '..', 'src', 'data', 'shopify_redirects.json');
const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

const willowRedirects = Object.entries(redirects).filter(([src, dest]) => {
  return src.toLowerCase().includes('willow-brook') || (typeof dest === 'string' && dest.toLowerCase().includes('willow-brook'));
});
console.log(`\nFound ${willowRedirects.length} entries in shopify_redirects.json referencing willow-brook.`);
willowRedirects.slice(0, 10).forEach(([src, dest]) => console.log(`  ${src} -> ${dest}`));
if (willowRedirects.length > 10) console.log(`  ... and ${willowRedirects.length - 10} more`);

// 4. Check other data files (pages, blogs, etc.)
const pagesPath = path.join(__dirname, '..', '..', 'src', 'data', 'migrated_pages.json');
if (fs.existsSync(pagesPath)) {
  const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
  const willowPages = pages.filter((p: any) => JSON.stringify(p).toLowerCase().includes('willow-brook') || JSON.stringify(p).toLowerCase().includes('willow brook'));
  console.log(`\nFound ${willowPages.length} in migrated_pages.json`);
}

const blogsPath = path.join(__dirname, '..', '..', 'src', 'data', 'migrated_articles.json');
if (fs.existsSync(blogsPath)) {
  const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
  const willowBlogs = blogs.filter((b: any) => JSON.stringify(b).toLowerCase().includes('willow-brook') || JSON.stringify(b).toLowerCase().includes('willow brook'));
  console.log(`Found ${willowBlogs.length} in migrated_articles.json`);
}
