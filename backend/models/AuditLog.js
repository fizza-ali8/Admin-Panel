const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    enum: ['Account', 'Transaction', 'Loan', 'User', 'Complaint'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  changes: {
    before: Object,
    after: Object
  },
  ipAddress: String,
  userAgent: String,
  status: {
    type: String,
    enum: ['Success', 'Failed'],
    required: true
  },
  metadata: Object
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema); 