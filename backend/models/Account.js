const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  accountType: {
    type: String,
    enum: ['Savings', 'Checking', 'Loan'],
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Frozen'],
    default: 'Active'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  lastTransactionDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Account', accountSchema); 