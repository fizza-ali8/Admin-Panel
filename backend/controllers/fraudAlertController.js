const asyncHandler = require('express-async-handler');
const FraudAlert = require('../models/FraudAlert');
const Transaction = require('../models/Transaction');

// @desc    Get all fraud alerts
// @route   GET /api/fraud-alerts
// @access  Private/Admin
const getFraudAlerts = asyncHandler(async (req, res) => {
  const alerts = await FraudAlert.find({})
    .populate('transactionId')
    .populate('accountId')
    .populate('resolvedBy', 'name email')
    .sort('-createdAt');
  res.json(alerts);
});

// @desc    Create fraud alert
// @route   POST /api/fraud-alerts
// @access  Private
const createFraudAlert = asyncHandler(async (req, res) => {
  const {
    transactionId,
    accountId,
    alertType,
    riskLevel,
    details
  } = req.body;

  const alert = await FraudAlert.create({
    transactionId,
    accountId,
    alertType,
    riskLevel,
    details
  });

  // Update transaction status
  await Transaction.findByIdAndUpdate(transactionId, {
    status: 'Pending',
    metadata: { fraudAlert: alert._id }
  });

  res.status(201).json(alert);
});

// @desc    Update fraud alert status
// @route   PUT /api/fraud-alerts/:id
// @access  Private/Admin
const updateFraudAlertStatus = asyncHandler(async (req, res) => {
  const { status, resolution } = req.body;

  const alert = await FraudAlert.findById(req.params.id);

  if (!alert) {
    res.status(404);
    throw new Error('Fraud alert not found');
  }

  alert.status = status;
  if (resolution) {
    alert.resolution = {
      ...resolution,
      timestamp: new Date()
    };
    alert.resolvedBy = req.user._id;
  }

  const updatedAlert = await alert.save();

  // Update associated transaction if alert is resolved
  if (status === 'Resolved') {
    await Transaction.findByIdAndUpdate(alert.transactionId, {
      status: resolution.action === 'approve' ? 'Completed' : 'Failed',
      metadata: { 
        ...alert.details,
        resolution: resolution.notes
      }
    });
  }

  res.json(updatedAlert);
});

module.exports = {
  getFraudAlerts,
  createFraudAlert,
  updateFraudAlertStatus
}; 