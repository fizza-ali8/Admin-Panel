const asyncHandler = require('express-async-handler');
const Report = require('../models/Report');
const { generatePDF, generateCSV, generateExcel } = require('../utils/reportGenerators');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({})
    .populate('generatedBy', 'name email')
    .sort('-createdAt');
  res.json(reports);
});

// @desc    Generate new report
// @route   POST /api/reports
// @access  Private/Admin
const generateReport = asyncHandler(async (req, res) => {
  const { type, dateRange, format, filters } = req.body;

  const report = await Report.create({
    type,
    dateRange,
    format,
    filters,
    generatedBy: req.user._id
  });

  // Generate report file based on format
  let fileUrl;
  switch (format) {
    case 'PDF':
      fileUrl = await generatePDF(report);
      break;
    case 'CSV':
      fileUrl = await generateCSV(report);
      break;
    case 'EXCEL':
      fileUrl = await generateExcel(report);
      break;
  }

  report.fileUrl = fileUrl;
  report.status = 'Generated';
  await report.save();

  res.status(201).json(report);
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private/Admin
const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate('generatedBy', 'name email');
  
  if (report) {
    res.json(report);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

module.exports = {
  getReports,
  generateReport,
  getReportById
}; 