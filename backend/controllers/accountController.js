const asyncHandler = require('express-async-handler');
const Account = require('../models/Account');

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private/Admin
const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find({}).populate('userId', 'name email');
  res.json(accounts);
});

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
const createAccount = asyncHandler(async (req, res) => {
  const { accountType, initialDeposit } = req.body;

  // Generate unique account number
  const accountNumber = Math.random().toString().slice(2,12);

  const account = await Account.create({
    userId: req.user._id,
    accountType,
    accountNumber,
    balance: initialDeposit || 0
  });

  res.status(201).json(account);
});

// @desc    Get account balance
// @route   GET /api/accounts/:id/balance
// @access  Private
const getAccountBalance = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.params.id);

  if (account) {
    res.json({ balance: account.balance });
  } else {
    res.status(404);
    throw new Error('Account not found');
  }
});

// @desc    Update account status
// @route   PUT /api/accounts/:id/status
// @access  Private/Admin
const updateAccountStatus = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.params.id);

  if (account) {
    account.status = req.body.status;
    const updatedAccount = await account.save();
    res.json(updatedAccount);
  } else {
    res.status(404);
    throw new Error('Account not found');
  }
});

module.exports = {
  getAccounts,
  createAccount,
  getAccountBalance,
  updateAccountStatus
}; 