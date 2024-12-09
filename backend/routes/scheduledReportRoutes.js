const express = require('express');
const router = express.Router();
const {
    getScheduledReports,
    createScheduledReport,
    updateScheduledReport,
    deleteScheduledReport
} = require('../controllers/scheduledReportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getScheduledReports)
    .post(protect, admin, createScheduledReport);

router.route('/:id')
    .put(protect, admin, updateScheduledReport)
    .delete(protect, admin, deleteScheduledReport);

module.exports = router; 