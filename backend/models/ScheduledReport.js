const mongoose = require('mongoose');

const scheduledReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  reportType: {
    type: String,
    enum: ['Transaction', 'Account', 'Loan', 'Audit'],
    required: true
  },
  format: {
    type: String,
    enum: ['PDF', 'CSV', 'EXCEL'],
    default: 'PDF'
  },
  recipients: [{
    type: String, // email addresses
    required: true
  }],
  filters: {
    type: Map,
    of: String
  },
  status: {
    type: String,
    enum: ['active', 'paused'],
    default: 'active'
  },
  lastRun: Date,
  nextRun: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ScheduledReport', scheduledReportSchema); 