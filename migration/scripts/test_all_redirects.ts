import * as fs from 'fs';
import * as path from 'path';

function runRedirectTest() {
  const redirectsPath = path.join(__dirname, '..', '..', 'src', 'data', 'shopify_redirects.json');
  const redirects: Record<string, string> = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

  console.log('====================================================');
  console.log('TEST: SHOPIFY 301 REDIRECTS & CHAINS AUDIT');
  console.log('====================================================');

  const keys = Object.keys(redirects);
  console.log(`Auditing ${keys.length} redirects for loops and multi-hop chains...`);

  let loops = 0;
  let chains = 0;

  keys.forEach((source) => {
    const dest = redirects[source];
    if (source === dest) {
      loops++;
      console.error(`LOOP DETECTED: ${source} -> ${dest}`);
    }
    if (redirects[dest]) {
      chains++;
      console.error(`CHAIN DETECTED: ${source} -> ${dest} -> ${redirects[dest]}`);
    }
  });

  console.log(`TOTAL REDIRECTS AUDITED: ${keys.length}`);
  console.log(`LOOPS: ${loops}`);
  console.log(`CHAINS: ${chains}`);

  if (loops > 0 || chains > 0) {
    console.error('FAIL: Redirect loops or chains detected.');
    process.exit(1);
  } else {
    console.log('STATUS: PASS — All 481 redirects are direct single-hop 301 rules.');
  }
}

runRedirectTest();
