const fs = require('fs');
const path = require('path');

const redirectsPath = path.join(__dirname, '..', 'src', 'data', 'shopify_redirects.json');
const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

const states = [
  'alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware','florida','georgia',
  'hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana','maine','maryland','massachusetts',
  'massachussetts','michigan','minnesota','mississippi','missouri','montana','nebraska','nevada','new-hampshire',
  'new-jersey','new-mexico','new-york','north-carolina','north-dakota','ohio','oklahoma','oregon','pennsylvania',
  'pennysylvania','rhode-island','south-carolina','south-dakota','tennessee','texas','utah','vermont','virginia',
  'virgina','washington','west-virginia','west-virgina','wisconsin','wyoming'
];

// Willow Brook slugs
const wbSlugs = new Set([
  'the-willow-brook',
  'the-willow-brook-cabin',
  ...states.map(s => 'the-willow-brook-cabin-' + s + '-pricing')
]);

// Meadow Ridge slugs
const mrSlugs = new Set([
  'the-meadow-ridge-adu-cabin-series',
  'the-meadow-brook-adu-cabin-series',
  ...states.map(s => 'the-meadow-ridge-adu-cabin-series-' + s + '-pricing'),
  ...states.map(s => 'the-meadow-brook-adu-cabin-series-' + s + '-pricing')
]);

let addedWb = 0;
wbSlugs.forEach(slug => {
  const paths = [
    '/park-models/' + slug,
    '/park-models/' + slug + '/',
    '/cabins/' + slug,
    '/cabins/' + slug + '/',
    '/tiny-homes/' + slug,
    '/tiny-homes/' + slug + '/',
    '/products/' + slug,
    '/products/' + slug + '/',
    '/buildings/' + slug,
    '/buildings/' + slug + '/',
    '/models/' + slug,
    '/models/' + slug + '/'
  ];
  paths.forEach(p => {
    if (redirects[p] !== '/cabins') {
      redirects[p] = '/cabins';
      addedWb++;
    }
  });
});

let addedMr = 0;
mrSlugs.forEach(slug => {
  const paths = [
    '/adus/' + slug,
    '/adus/' + slug + '/',
    '/park-models/' + slug,
    '/park-models/' + slug + '/',
    '/cabins/' + slug,
    '/cabins/' + slug + '/',
    '/tiny-homes/' + slug,
    '/tiny-homes/' + slug + '/',
    '/products/' + slug,
    '/products/' + slug + '/',
    '/buildings/' + slug,
    '/buildings/' + slug + '/',
    '/models/' + slug,
    '/models/' + slug + '/'
  ];
  paths.forEach(p => {
    if (redirects[p] !== '/adus') {
      redirects[p] = '/adus';
      addedMr++;
    }
  });
});

console.log('Added/updated Willow Brook redirect paths:', addedWb);
console.log('Added/updated Meadow Ridge redirect paths:', addedMr);

fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2), 'utf8');
console.log('Saved updated shopify_redirects.json');
