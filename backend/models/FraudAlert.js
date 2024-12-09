const mongoose = require('mongoose');

const fraudAlertSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  alertType: {
    type: String,
    enum: ['Suspicious Amount', 'Unusual Location', 'Multiple Attempts', 'Pattern Change'],
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'Investigating', 'Resolved', 'False Positive'],
    default: 'New'
  },
  details: {
    location: String,
    deviceInfo: String,
    ipAddress: String,
    amount: Number,
    previousPatterns: Object
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: {
    action: String,
    notes: String,
    timestamp: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FraudAlert', fraudAlertSchema); 