import 'dotenv/config';
import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
const result = await client.query(`
  update products
  set sqft = null, updated_at = now()
  where status = 'active'
    and sqft = 720
    and coalesce(dimensions, '') = 'Custom Dimensions'
    and coalesce(description_html, '') !~* '(?:living\\s*(?:area|space)|total\\s*square\\s*footage|square\\s*footage|size)[:\\s]+[0-9][0-9,]*\\s*(?:sq\\.?\\s*ft|sqft|square\\s*feet|sf\\b)'
    and (
      lower(title) like '%steel%'
      or lower(title) like '%barndominium%'
      or lower(product_type) in ('house kits', 'barndominiums')
    )
    and (
      coalesce(description_html, '') !~* '(?:living\\s*(?:area|space)|total\\s*square\\s*footage|square\\s*footage|size)[:\\s]+[0-9][0-9,]*\\s*(?:sq\\.?\\s*ft|sqft|square\\s*feet|sf\\b)'
      or coalesce(description_html, '') ~* '720\\s*sq\\.?\\s*ft\\s*[•·\\-]'
    )
  returning handle
`);
console.log(JSON.stringify({ updated: result.rowCount, handles: result.rows.map((row) => row.handle) }, null, 2));
await client.end();
