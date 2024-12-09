const asyncHandler = require('express-async-handler');
const Loan = require('../models/Loan');

// @desc    Get all loans
// @route   GET /api/loans
// @access  Private/Admin
const getLoans = asyncHandler(async (req, res) => {
  const loans = await Loan.find({}).populate('userId', 'name email');
  res.json(loans);
});

// @desc    Create loan application
// @route   POST /api/loans
// @access  Private
const createLoan = asyncHandler(async (req, res) => {
  const {
    amount,
    term,
    purpose,
    interestRate
  } = req.body;

  // Calculate monthly payment using PMT formula
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                        (Math.pow(1 + monthlyRate, term) - 1);
  const totalInterest = (monthlyPayment * term) - amount;

  const loan = await Loan.create({
    userId: req.user._id,
    amount,
    term,
    purpose,
    interestRate,
    monthlyPayment,
    totalInterest
  });

  res.status(201).json(loan);
});

// @desc    Update loan status
// @route   PUT /api/loans/:id/status
// @access  Private/Admin
const updateLoanStatus = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id);

  if (!loan) {
    res.status(404);
    throw new Error('Loan not found');
  }

  loan.status = req.body.status;
  
  if (req.body.status === 'Approved') {
    loan.startDate = new Date();
    loan.nextPaymentDate = new Date();
    loan.nextPaymentDate.setMonth(loan.nextPaymentDate.getMonth() + 1);
  }

  const updatedLoan = await loan.save();
  res.json(updatedLoan);
});

// @desc    Get loan details
// @route   GET /api/loans/:id
// @access  Private
const getLoanById = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id).populate('userId', 'name email');
  
  if (loan) {
    res.json(loan);
  } else {
    res.status(404);
    throw new Error('Loan not found');
  }
});

module.exports = {
  getLoans,
  createLoan,
  updateLoanStatus,
  getLoanById
}; 