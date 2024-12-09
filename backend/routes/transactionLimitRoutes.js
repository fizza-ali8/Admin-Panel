const express = require('express');
const router = express.Router();
const {
  getTransactionLimits,
  updateTransactionLimits,
  checkTransactionLimit
} = require('../controllers/transactionLimitController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getTransactionLimits);

router.route('/:accountType')
  .put(protect, admin, updateTransactionLimits);

router.route('/check')
  .post(protect, checkTransactionLimit);

module.exports = router; 