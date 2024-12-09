const asyncHandler = require('express-async-handler');
const Feedback = require('../models/Feedback');

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private/Admin
const getAllFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({})
        .populate('userId', 'name email')
        .populate('assignedTo', 'name email')
        .sort('-createdAt');
    res.json(feedback);
});

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Private
const submitFeedback = asyncHandler(async (req, res) => {
    const { type, rating, comment } = req.body;

    // Determine category based on rating
    let category;
    if (rating >= 4) category = 'Positive';
    else if (rating === 3) category = 'Neutral';
    else category = 'Negative';

    const feedback = await Feedback.create({
        userId: req.user._id,
        type,
        rating,
        comment,
        category
    });

    res.status(201).json(feedback);
});

// @desc    Update feedback status
// @route   PUT /api/feedback/:id
// @access  Private/Admin
const updateFeedbackStatus = asyncHandler(async (req, res) => {
    const { status, response, assignedTo } = req.body;

    const feedback = await Feedback.findById(req.params.id);

    if (feedback) {
        feedback.status = status || feedback.status;
        feedback.response = response || feedback.response;
        feedback.assignedTo = assignedTo || feedback.assignedTo;

        if (response) {
            feedback.responseDate = Date.now();
        }

        const updatedFeedback = await feedback.save();
        res.json(updatedFeedback);
    } else {
        res.status(404);
        throw new Error('Feedback not found');
    }
});

// @desc    Get feedback analytics
// @route   GET /api/feedback/analytics
// @access  Private/Admin
const getFeedbackAnalytics = asyncHandler(async (req, res) => {
    const analytics = await Feedback.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    res.json(analytics);
});

module.exports = {
    getAllFeedback,
    submitFeedback,
    updateFeedbackStatus,
    getFeedbackAnalytics
}; 