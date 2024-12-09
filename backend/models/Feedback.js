const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Service', 'Application', 'Support', 'Other'],
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'Reviewed', 'Addressed'],
    default: 'New'
  },
  category: {
    type: String,
    enum: ['Positive', 'Neutral', 'Negative'],
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: String,
  responseDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema); 