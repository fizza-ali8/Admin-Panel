const asyncHandler = require('express-async-handler');
const ScheduledReport = require('../models/ScheduledReport');
const { calculateNextRunDate } = require('../utils/dateUtils');

// @desc    Get all scheduled reports
// @route   GET /api/scheduled-reports
// @access  Private/Admin
const getScheduledReports = asyncHandler(async (req, res) => {
    const reports = await ScheduledReport.find({})
        .populate('createdBy', 'name email')
        .sort('-createdAt');
    res.json(reports);
});

// @desc    Create scheduled report
// @route   POST /api/scheduled-reports
// @access  Private/Admin
const createScheduledReport = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        frequency,
        reportType,
        format,
        recipients,
        filters
    } = req.body;

    const nextRun = calculateNextRunDate(frequency);

    const report = await ScheduledReport.create({
        name,
        description,
        frequency,
        reportType,
        format,
        recipients,
        filters,
        nextRun,
        createdBy: req.user._id
    });

    res.status(201).json(report);
});

// @desc    Update scheduled report
// @route   PUT /api/scheduled-reports/:id
// @access  Private/Admin
const updateScheduledReport = asyncHandler(async (req, res) => {
    const report = await ScheduledReport.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error('Scheduled report not found');
    }

    const {
        name,
        description,
        frequency,
        reportType,
        format,
        recipients,
        filters,
        status
    } = req.body;

    report.name = name || report.name;
    report.description = description || report.description;
    report.frequency = frequency || report.frequency;
    report.reportType = reportType || report.reportType;
    report.format = format || report.format;
    report.recipients = recipients || report.recipients;
    report.filters = filters || report.filters;
    report.status = status || report.status;

    if (frequency !== report.frequency) {
        report.nextRun = calculateNextRunDate(frequency);
    }

    const updatedReport = await report.save();
    res.json(updatedReport);
});

// @desc    Delete scheduled report
// @route   DELETE /api/scheduled-reports/:id
// @access  Private/Admin
const deleteScheduledReport = asyncHandler(async (req, res) => {
    const report = await ScheduledReport.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error('Scheduled report not found');
    }

    await report.remove();
    res.json({ message: 'Scheduled report removed' });
});

module.exports = {
    getScheduledReports,
    createScheduledReport,
    updateScheduledReport,
    deleteScheduledReport
}; 