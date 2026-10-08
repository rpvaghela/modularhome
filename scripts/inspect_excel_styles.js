const ExcelJS = require('exceljs');
const path = require('path');

async function inspectWorkbook() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.resolve('migration/docs/ModularHome_190_Blog_SEO_Correction_Report.xlsx'));
  
  console.log('Worksheets:', wb.worksheets.map(w => w.name));
  
  const sheet1 = wb.getWorksheet('Blog SEO Corrections');
  console.log('Sheet 1 row count:', sheet1.rowCount);
  console.log('Sheet 1 col count:', sheet1.columnCount);
  
  const headers = [];
  sheet1.getRow(1).eachCell((cell, colNum) => {
    headers.push({ colNum, value: cell.value });
  });
  console.log('Headers:', headers);
  
  const sheet2 = wb.getWorksheet('Summary');
  if (sheet2) {
    console.log('Sheet 2 rows:');
    sheet2.eachRow((row, rowNum) => {
      console.log(`Row ${rowNum}:`, row.values);
    });
  }
}

inspectWorkbook();
