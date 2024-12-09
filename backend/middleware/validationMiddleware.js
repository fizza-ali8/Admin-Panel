const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateTransaction = [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type').isIn(['Deposit', 'Withdrawal', 'Transfer']).withMessage('Invalid transaction type'),
    body('fromAccount').isMongoId().withMessage('Invalid account ID'),
    body('toAccount').optional().isMongoId().withMessage('Invalid account ID'),
    validateRequest
];

const validateLoan = [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('term').isInt({ min: 1 }).withMessage('Term must be a positive integer'),
    body('purpose').notEmpty().withMessage('Purpose is required'),
    validateRequest
];

const validateAccount = [
    body('accountType').isIn(['Savings', 'Checking', 'Loan']).withMessage('Invalid account type'),
    body('initialDeposit').optional().isNumeric().withMessage('Initial deposit must be a number'),
    validateRequest
];

module.exports = {
    validateRequest,
    validateTransaction,
    validateLoan,
    validateAccount
}; 