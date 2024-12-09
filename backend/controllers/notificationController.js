const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({
        userId: req.user._id,
        status: { $ne: 'Archived' }
    }).sort('-createdAt');
    res.json(notifications);
});

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
    const {
        userId,
        type,
        title,
        message,
        priority,
        metadata,
        expiresAt
    } = req.body;

    const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        priority,
        metadata,
        expiresAt
    });

    // Here you might want to trigger real-time notification via WebSocket
    // socketIO.to(userId).emit('notification', notification);

    res.status(201).json(notification);
});

// @desc    Update notification status
// @route   PUT /api/notifications/:id
// @access  Private
const updateNotificationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const notification = await Notification.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    notification.status = status;
    const updatedNotification = await notification.save();

    res.json(updatedNotification);
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllNotificationsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { userId: req.user._id, status: 'Unread' },
        { status: 'Read' }
    );

    res.json({ message: 'All notifications marked as read' });
});

module.exports = {
    getUserNotifications,
    createNotification,
    updateNotificationStatus,
    markAllNotificationsRead
}; 