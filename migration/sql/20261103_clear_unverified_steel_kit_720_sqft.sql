-- These four steel kit records inherited a 720 sq ft catalog default. Their
-- only area text is a generic product tagline, not a verified floor-area spec.
update products
set sqft = null,
    description_html = ltrim(substring(description_html from position('</p>' in description_html) + 4)),
    updated_at = now()
where handle in (
  'the-aquamarine-steel-house-kit',
  'the-coastal-crown-steel-house-kit',
  'the-oceanview-steel-house-kit',
  'the-saltwater-steel-house-kit'
)
  and sqft = 720
  and description_html like '<p>720 Sq Ft%';
