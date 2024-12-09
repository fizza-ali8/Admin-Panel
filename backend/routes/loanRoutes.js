const express = require('express');
const router = express.Router();
const {
  getLoans,
  createLoan,
  updateLoanStatus,
  getLoanById
} = require('../controllers/loanController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getLoans)
  .post(protect, createLoan);

router.route('/:id')
  .get(protect, getLoanById);

router.route('/:id/status')
  .put(protect, admin, updateLoanStatus);

module.exports = router; 