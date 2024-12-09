const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private/Admin
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({})
    .populate('fromAccount')
    .populate('toAccount');
  res.json(transactions);
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const { fromAccountId, toAccountId, amount, type, description } = req.body;

  // Start a session for transaction atomicity
  const session = await Transaction.startSession();
  session.startTransaction();

  try {
    const fromAccount = await Account.findById(fromAccountId);
    const toAccount = toAccountId ? await Account.findById(toAccountId) : null;

    // Validate sufficient balance for withdrawals/transfers
    if (type !== 'Deposit' && fromAccount.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Create transaction record
    const transaction = await Transaction.create([{
      fromAccount: fromAccountId,
      toAccount: toAccountId,
      type,
      amount,
      description,
      status: 'Completed'
    }], { session });

    // Update account balances
    if (type === 'Withdrawal' || type === 'Transfer') {
      fromAccount.balance -= amount;
      await fromAccount.save({ session });
    }
    
    if (type === 'Deposit' || type === 'Transfer') {
      const accountToCredit = type === 'Deposit' ? fromAccount : toAccount;
      accountToCredit.balance += amount;
      await accountToCredit.save({ session });
    }

    await session.commitTransaction();
    res.status(201).json(transaction[0]);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

module.exports = {
  getTransactions,
  createTransaction
}; 