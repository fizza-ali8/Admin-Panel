const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Alert', 'Update', 'Reminder', 'Security'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  status: {
    type: String,
    enum: ['Unread', 'Read', 'Archived'],
    default: 'Unread'
  },
  metadata: {
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    actionUrl: String
  },
  expiresAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema); 