const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true
  },
  term: {
    type: Number,
    required: true // in months
  },
  interestRate: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Closed'],
    default: 'Pending'
  },
  monthlyPayment: Number,
  totalInterest: Number,
  startDate: Date,
  nextPaymentDate: Date,
  purpose: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Loan', loanSchema); 