const xlsx = require('xlsx');
const path = require('path');

const filePath = path.resolve('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx');
const wb = xlsx.readFile(filePath);
console.log('Sheet Names:', wb.SheetNames);

for (const name of wb.SheetNames) {
  const sheet = wb.Sheets[name];
  const json = xlsx.utils.sheet_to_json(sheet);
  console.log(`\n=== Sheet: ${name} (Total rows: ${json.length}) ===`);
  if (json.length > 0) {
    console.log('Columns:', Object.keys(json[0]));
    console.log('First 2 rows:', JSON.stringify(json.slice(0, 2), null, 2));
  }
}
