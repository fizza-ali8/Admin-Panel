const asyncHandler = require('express-async-handler');
const TransactionLimit = require('../models/TransactionLimit');

// @desc    Get all transaction limits
// @route   GET /api/transaction-limits
// @access  Private/Admin
const getTransactionLimits = asyncHandler(async (req, res) => {
    const limits = await TransactionLimit.find({})
        .populate('lastUpdatedBy', 'name email');
    res.json(limits);
});

// @desc    Update transaction limits
// @route   PUT /api/transaction-limits/:accountType
// @access  Private/Admin
const updateTransactionLimits = asyncHandler(async (req, res) => {
    const { dailyLimit, monthlyLimit, singleTransactionLimit } = req.body;

    let limit = await TransactionLimit.findOne({ accountType: req.params.accountType });

    if (limit) {
        limit.dailyLimit = dailyLimit;
        limit.monthlyLimit = monthlyLimit;
        limit.singleTransactionLimit = singleTransactionLimit;
        limit.lastUpdatedBy = req.user._id;
    } else {
        limit = new TransactionLimit({
            accountType: req.params.accountType,
            dailyLimit,
            monthlyLimit,
            singleTransactionLimit,
            lastUpdatedBy: req.user._id
        });
    }

    const updatedLimit = await limit.save();
    res.json(updatedLimit);
});

// @desc    Check transaction against limits
// @route   POST /api/transaction-limits/check
// @access  Private
const checkTransactionLimit = asyncHandler(async (req, res) => {
    const { accountType, amount, transactionType } = req.body;

    const limit = await TransactionLimit.findOne({ accountType });
    if (!limit) {
        res.status(404);
        throw new Error('Transaction limits not found for this account type');
    }

    const validations = {
        singleTransaction: amount <= limit.singleTransactionLimit,
        // Additional checks for daily and monthly limits would require
        // aggregating transaction history
    };

    res.json({
        allowed: validations.singleTransaction,
        validations,
        limits: {
            singleTransactionLimit: limit.singleTransactionLimit,
            dailyLimit: limit.dailyLimit,
            monthlyLimit: limit.monthlyLimit
        }
    });
});

module.exports = {
    getTransactionLimits,
    updateTransactionLimits,
    checkTransactionLimit
}; 