const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private/Admin
const getComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({})
    .populate('customerId', 'name email')
    .populate('assignedTo', 'name');
  res.json(complaints);
});

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = asyncHandler(async (req, res) => {
  const { subject, description, priority } = req.body;

  const complaint = await Complaint.create({
    customerId: req.user._id,
    subject,
    description,
    priority
  });

  res.status(201).json(complaint);
});

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin
const updateComplaintStatus = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (complaint) {
    complaint.status = req.body.status;
    if (req.body.status === 'Resolved') {
      complaint.resolvedAt = Date.now();
    }
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } else {
    res.status(404);
    throw new Error('Complaint not found');
  }
});

module.exports = {
  getComplaints,
  createComplaint,
  updateComplaintStatus
}; 