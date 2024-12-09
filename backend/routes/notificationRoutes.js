const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  createNotification,
  updateNotificationStatus,
  markAllNotificationsRead
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getUserNotifications)
  .post(protect, admin, createNotification);

router.route('/:id')
  .put(protect, updateNotificationStatus);

router.put('/mark-all-read', protect, markAllNotificationsRead);

module.exports = router; 