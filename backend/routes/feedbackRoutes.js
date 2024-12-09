const express = require('express');
const router = express.Router();
const {
    getAllFeedback,
    submitFeedback,
    updateFeedbackStatus,
    getFeedbackAnalytics
} = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllFeedback)
    .post(protect, submitFeedback);

router.route('/:id')
    .put(protect, admin, updateFeedbackStatus);

router.get('/analytics', protect, admin, getFeedbackAnalytics);

module.exports = router; 