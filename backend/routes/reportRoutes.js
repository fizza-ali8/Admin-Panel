const express = require('express');
const router = express.Router();
const {
  getReports,
  generateReport,
  getReportById
} = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getReports)
  .post(protect, admin, generateReport);

router.route('/:id')
  .get(protect, admin, getReportById);

module.exports = router; 