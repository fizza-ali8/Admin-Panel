const express = require('express');
const router = express.Router();
const {
  createAuditLog,
  getAuditLogs
} = require('../controllers/auditController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createAuditLog)
  .get(protect, admin, getAuditLogs);

module.exports = router; 