const mongoose = require('mongoose');

const transactionLimitSchema = new mongoose.Schema({
    accountType: {
        type: String,
        enum: ['Savings', 'Checking', 'Loan'],
        required: true
    },
    dailyLimit: {
        type: Number,
        required: true,
        min: 0
    },
    monthlyLimit: {
        type: Number,
        required: true,
        min: 0
    },
    singleTransactionLimit: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TransactionLimit', transactionLimitSchema); 