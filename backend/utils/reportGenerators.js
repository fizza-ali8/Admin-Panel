const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const generatePDF = async (reportData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const fileName = `report_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../uploads', fileName);
    
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Add report header
    doc.fontSize(20).text(reportData.type + ' Report', { align: 'center' });
    doc.moveDown();

    // Add report content based on type
    if (reportData.data) {
      Object.entries(reportData.data).forEach(([key, value]) => {
        doc.fontSize(12).text(`${key}: ${value}`);
      });
    }

    doc.end();

    stream.on('finish', () => {
      resolve(`/uploads/${fileName}`);
    });

    stream.on('error', reject);
  });
};

const generateCSV = async (reportData) => {
  const fileName = `report_${Date.now()}.csv`;
  const filePath = path.join(__dirname, '../uploads', fileName);
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Add headers
  if (reportData.headers) {
    worksheet.addRow(reportData.headers);
  }

  // Add data rows
  if (reportData.rows) {
    reportData.rows.forEach(row => {
      worksheet.addRow(row);
    });
  }

  await workbook.csv.writeFile(filePath);
  return `/uploads/${fileName}`;
};

const generateExcel = async (reportData) => {
  const fileName = `report_${Date.now()}.xlsx`;
  const filePath = path.join(__dirname, '../uploads', fileName);
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Add styling
  worksheet.getRow(1).font = { bold: true };
  
  // Add headers
  if (reportData.headers) {
    worksheet.addRow(reportData.headers);
  }

  // Add data rows
  if (reportData.rows) {
    reportData.rows.forEach(row => {
      worksheet.addRow(row);
    });
  }

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    column.width = Math.max(
      ...worksheet.getColumn(column.number).values
        .map(v => v ? v.toString().length : 0)
    );
  });

  await workbook.xlsx.writeFile(filePath);
  return `/uploads/${fileName}`;
};

module.exports = {
  generatePDF,
  generateCSV,
  generateExcel
}; 