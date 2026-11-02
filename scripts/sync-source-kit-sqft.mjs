import 'dotenv/config';
import { Client } from 'pg';

const SOURCES = [
  { category: 'steel-house-kits', url: 'https://amishbuiltcabins.com/collections/barndominium-steel-house-kits/products.json?limit=250' },
  { category: 'budget-house-kits', url: 'https://amishbuiltcabins.com/collections/house-kit/products.json?limit=250' },
];

function stripHtml(value = '') {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractAreas(bodyHtml) {
  const text = stripHtml(bodyHtml);
  const matches = [...text.matchAll(/(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft|square\s*feet|sf\b)/gi)]
    .map((m) => Number(m[1].replace(/,/g, '')))
    .filter((n) => n >= 80 && n <= 25000);
  return [...new Set(matches)];
}

function extractPrimaryArea(bodyHtml) {
  const text = stripHtml(bodyHtml);
  const labeled = text.match(/(?:total\s+)?(?:finished\s+)?living\s+(?:area|space)\s*:\s*(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft|square\s*feet|sf\b)/i);
  const finished = text.match(/(\d[\d,]*)\s*sq\.?\s*ft\s*(?:finished|living|of\s+(?:finished\s+)?living\s+space)/i);
  const first = labeled || finished || text.match(/(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft|square\s*feet|sf\b)/i);
  if (!first) return null;
  const value = Number(first[1].replace(/,/g, ''));
  return value >= 80 && value <= 25000 ? value : null;
}

function extractDetails(bodyHtml, title) {
  const text = stripHtml(bodyHtml);
  const beds = text.match(/(?:bedrooms?|beds?)\s*:\s*(\d+)/i) || text.match(/(?:with\s+)?(\d+)\s*(?:bedrooms?|beds?)\b/i);
  const baths = text.match(/(?:bathrooms?|baths?)\s*:\s*(\d+(?:\.\d+)?)/i) || text.match(/(?:with\s+)?(\d+(?:\.\d+)?)\s*(?:bathrooms?|baths?)\b/i);
  const dimensions = text.match(/(?:width|dimensions?)\s*:\s*([^.;]{3,80})/i)?.[1]?.trim() || null;
  return {
    sourceBedrooms: beds ? Number(beds[1]) : null,
    sourceBathrooms: baths ? Number(baths[1]) : null,
    sourceDimensions: dimensions,
    normalizedTitle: title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(),
  };
}

const feeds = [];
for (const source of SOURCES) {
  const response = await fetch(source.url);
  if (!response.ok) throw new Error(`${source.category} feed returned ${response.status}`);
  const json = await response.json();
  feeds.push(...json.products.map((product) => ({
    sourceCategory: source.category,
    handle: product.handle,
    title: product.title,
    sourcePrice: Math.min(...product.variants.map((variant) => Number(variant.price)).filter((price) => price > 0)),
    sourceSqft: extractPrimaryArea(product.body_html || ''),
    sourceAreas: extractAreas(product.body_html || ''),
    ...extractDetails(product.body_html || '', product.title),
    sourceVariantCount: product.variants.length,
  })));
}

const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
const db = await client.query(`
  select p.id, p.handle, p.title, p.sqft, p.starting_price, p.product_type, p.bedrooms, p.bathrooms, p.dimensions,
    (select count(*)::int from product_variants v where v.product_id = p.id) as variant_count
  from products p
  where p.status = 'active'
`);
const byHandle = new Map(db.rows.map((row) => [row.handle, row]));

const report = feeds.map((source) => {
  const row = byHandle.get(source.handle);
  const details = extractDetails('', row?.title || '');
  const sourceTitle = source.normalizedTitle;
  const dbTitle = details.normalizedTitle;
  return {
    ...source,
    matched: Boolean(row),
    dbTitle: row?.title || null,
    dbSqft: row?.sqft == null ? null : Number(row.sqft),
    dbPrice: row?.starting_price == null ? null : Number(row.starting_price),
    dbBedrooms: row?.bedrooms == null ? null : Number(row.bedrooms),
    dbBathrooms: row?.bathrooms == null ? null : Number(row.bathrooms),
    dbDimensions: row?.dimensions || null,
    dbVariantCount: row?.variant_count == null ? null : Number(row.variant_count),
    titleMatches: sourceTitle === dbTitle,
    bedroomMatches: source.sourceBedrooms === null || row?.bedrooms == null || source.sourceBedrooms === Number(row.bedrooms),
    bathroomMatches: source.sourceBathrooms === null || row?.bathrooms == null || source.sourceBathrooms === Number(row.bathrooms),
    variantCountMatches: row?.variant_count == null || source.sourceVariantCount === Number(row.variant_count),
    sqftChanged: Boolean(row && source.sourceSqft !== null && Number(row.sqft) !== source.sourceSqft),
    priceDiffers: Boolean(row && source.sourcePrice > 0 && Number(row.starting_price) !== source.sourcePrice),
  };
});

if (process.argv.includes('--apply')) {
  await client.query('begin');
  try {
    for (const item of report) {
      if (!item.matched || item.sourceSqft === null || !item.sqftChanged) continue;
      await client.query('update products set sqft = $1, updated_at = now() where id = $2', [item.sourceSqft, byHandle.get(item.handle).id]);
    }
    await client.query('commit');
  } catch (error) {
    await client.query('rollback');
    throw error;
  }
}

console.log(JSON.stringify({
  applied: process.argv.includes('--apply'),
  feedCounts: Object.fromEntries(SOURCES.map((source) => [source.category, feeds.filter((item) => item.sourceCategory === source.category).length])),
  matched: report.filter((item) => item.matched).length,
  unmatched: report.filter((item) => !item.matched).map(({ sourceCategory, handle, title }) => ({ sourceCategory, handle, title })),
  missingSourceSqft: report.filter((item) => item.sourceSqft === null).map(({ sourceCategory, handle, title }) => ({ sourceCategory, handle, title })),
  sqftChanges: report.filter((item) => item.sqftChanged).map(({ sourceCategory, handle, title, dbSqft, sourceSqft, sourceAreas }) => ({ sourceCategory, handle, title, dbSqft, sourceSqft, sourceAreas })),
  priceDifferences: report.filter((item) => item.priceDiffers).map(({ sourceCategory, handle, title, dbPrice, sourcePrice }) => ({ sourceCategory, handle, title, dbPrice, sourcePrice })),
  detailMismatches: report.filter((item) => item.matched && (!item.titleMatches || !item.bedroomMatches || !item.bathroomMatches || !item.variantCountMatches)).map(({ sourceCategory, handle, title, dbTitle, sourceBedrooms, dbBedrooms, sourceBathrooms, dbBathrooms, sourceVariantCount, dbVariantCount, titleMatches, bedroomMatches, bathroomMatches, variantCountMatches }) => ({ sourceCategory, handle, title, dbTitle, sourceBedrooms, dbBedrooms, sourceBathrooms, dbBathrooms, sourceVariantCount, dbVariantCount, titleMatches, bedroomMatches, bathroomMatches, variantCountMatches })),
}, null, 2));

await client.end();
