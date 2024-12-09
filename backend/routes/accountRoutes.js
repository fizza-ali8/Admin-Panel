const express = require('express');
const router = express.Router();
const {
  getAccounts,
  createAccount,
  getAccountBalance,
  updateAccountStatus
} = require('../controllers/accountController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getAccounts)
  .post(protect, createAccount);

router.route('/:id/balance')
  .get(protect, getAccountBalance);

router.route('/:id/status')
  .put(protect, admin, updateAccountStatus);

module.exports = router; 