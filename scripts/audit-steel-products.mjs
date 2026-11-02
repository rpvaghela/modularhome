import 'dotenv/config';
import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();

const steel = await client.query(`
  select p.id, p.handle, p.title, p.product_type, p.sqft, p.dimensions,
         p.starting_price, p.status,
         array_agg(distinct c.title) filter (where c.title is not null) as collections
  from products p
  left join product_collections pc on pc.product_id = p.id
  left join collections c on c.id = pc.collection_id
  where lower(coalesce(p.title,'')) like '%steel%'
     or lower(coalesce(p.product_type,'')) like '%steel%'
     or lower(coalesce(c.title,'')) like '%steel%'
  group by p.id
  order by p.title
`);

const known = await client.query(`
  select id, handle, title, sqft, dimensions, starting_price, status
  from products
  where handle in (
    'cascade-view-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit',
    'wildwood-retreat-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit',
    'summit-haven-panelized-sip-panel-house-kit-energy-efficient-sip-home-kit'
  ) or lower(title) like '%cascade view%'
  order by title
`);

const audit = await client.query(`
  with steel as (
    select distinct p.id, p.handle, p.title, p.sqft, p.starting_price,
      coalesce(p.description_html, '') as body,
      coalesce((select min(price) from product_variants v where v.product_id = p.id and price > 0), p.starting_price) as min_variant_price
    from products p
    left join product_collections pc on pc.product_id = p.id
    left join collections c on c.id = pc.collection_id
    where p.status = 'active'
      and (
        lower(coalesce(p.title,'')) like '%steel%'
        or lower(coalesce(p.title,'')) like '%barndominium%'
        or lower(coalesce(p.product_type,'')) in ('house kits', 'barndominiums')
        or lower(coalesce(c.title,'')) like '%steel%'
      )
  )
  select count(*)::int as total,
    count(*) filter (where sqft = 720)::int as sqft_720,
    count(*) filter (where starting_price is null or starting_price <= 0)::int as missing_price,
    count(*) filter (where min_variant_price is distinct from starting_price)::int as variant_price_mismatch,
    count(*) filter (where body ~* '(?:living\\s*(?:area|space)|total\\s*square\\s*footage|square\\s*footage|size)[:\\s]+[0-9][0-9,]*\\s*(?:sq\\.?\\s*ft|sqft|square\\s*feet|sf\\b)')::int as has_explicit_area_text
  from steel
`);

const explicit = await client.query(`
  select p.handle, p.title, p.sqft, p.starting_price,
    coalesce(p.description_html, '') ~* '(?:living\\s*(?:area|space)|total\\s*square\\s*footage|square\\s*footage|size)[:\\s]+[0-9][0-9,]*\\s*(?:sq\\.?\\s*ft|sqft|square\\s*feet|sf\\b)' as has_explicit_area_text
  from products p
  where p.status = 'active' and p.sqft = 720
  order by p.title
  limit 25
`);

const placeholder = await client.query(`
  select count(*)::int as count
  from products p
  where p.status = 'active' and p.sqft = 720
    and coalesce(p.dimensions, '') = 'Custom Dimensions'
    and coalesce(p.description_html, '') = ''
`);

const priceMismatches = await client.query(`
  select p.handle, p.title, p.starting_price,
    (select min(v.price) from product_variants v where v.product_id = p.id and v.price > 0) as min_variant_price
  from products p
  where p.status = 'active'
    and p.starting_price is distinct from (select min(v.price) from product_variants v where v.product_id = p.id and v.price > 0)
  order by p.title
`);

const remaining720 = await client.query(`
  select handle, title, sqft, dimensions, starting_price, left(regexp_replace(coalesce(description_html, ''), '<[^>]+>', ' ', 'g'), 160) as description_sample
  from products
  where status = 'active' and sqft = 720
    and (lower(title) like '%steel%' or lower(title) like '%barndominium%' or lower(product_type) in ('house kits', 'barndominiums'))
  order by title
`);

console.log(JSON.stringify({ summary: audit.rows[0], placeholder_720: placeholder.rows[0], price_mismatches: priceMismatches.rows, remaining_720: remaining720.rows, sample_720: explicit.rows, known: known.rows }, null, 2));
await client.end();
