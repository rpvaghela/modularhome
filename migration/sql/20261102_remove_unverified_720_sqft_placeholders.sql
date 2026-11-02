-- The import used 720 sq ft as a default for records whose source did not
-- provide an area. Preserve the records and prices, but clear only the
-- unmistakable placeholder pattern so the UI does not publish a false size.
update products
set sqft = null,
    updated_at = now()
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
  );
