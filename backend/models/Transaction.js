const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  type: {
    type: String,
    enum: ['Deposit', 'Withdrawal', 'Transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Cancelled'],
    default: 'Pending'
  },
  reference: {
    type: String,
    unique: true
  },
  description: String,
  metadata: {
    location: String,
    device: String,
    ip: String
  },
  failureReason: String
}, {
  timestamps: true
});

// Generate unique reference before saving
transactionSchema.pre('save', async function(next) {
  if (!this.reference) {
    this.reference = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5);
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema); 