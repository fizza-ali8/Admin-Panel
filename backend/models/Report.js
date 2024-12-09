const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Transaction', 'Account', 'Loan', 'Audit'],
    required: true
  },
  dateRange: {
    start: Date,
    end: Date
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  format: {
    type: String,
    enum: ['PDF', 'CSV', 'EXCEL'],
    default: 'PDF'
  },
  status: {
    type: String,
    enum: ['Pending', 'Generated', 'Failed'],
    default: 'Pending'
  },
  filters: {
    type: Map,
    of: String
  },
  fileUrl: String,
  metadata: {
    recordCount: Number,
    totalAmount: Number,
    summary: Object
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema); 