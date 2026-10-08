const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const xlsxPath = path.resolve('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx');
const wb = xlsx.readFile(xlsxPath);
const sheet = wb.Sheets['Blog SEO Corrections'];

// Generate CSV using xlsx utility
const csvContent = xlsx.utils.sheet_to_csv(sheet);

// Write to migration/docs/ and migration/reports/
const targetDocsCsv = path.resolve('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.csv');
const targetReportsCsv = path.resolve('migration/reports/ModularHome_190_Blog_SEO_Correction_Report.csv');

fs.writeFileSync(targetDocsCsv, csvContent, 'utf8');
fs.writeFileSync(targetReportsCsv, csvContent, 'utf8');

console.log(`CSV report generated successfully:`);
console.log(`- ${targetDocsCsv}`);
console.log(`- ${targetReportsCsv}`);

const rows = csvContent.split('\n').filter(r => r.trim().length > 0);
console.log(`Total CSV lines (1 header + 190 rows): ${rows.length}`);
console.log('Header line:', rows[0]);
console.log('Sample row 1:', rows[1]);
