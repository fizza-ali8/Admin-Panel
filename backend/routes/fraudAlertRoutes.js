const express = require('express');
const router = express.Router();
const {
  getFraudAlerts,
  createFraudAlert,
  updateFraudAlertStatus
} = require('../controllers/fraudAlertController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getFraudAlerts)
  .post(protect, createFraudAlert);

router.route('/:id')
  .put(protect, admin, updateFraudAlertStatus);

module.exports = router; 