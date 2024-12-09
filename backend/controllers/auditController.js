const asyncHandler = require('express-async-handler');
const AuditLog = require('../models/AuditLog');

// @desc    Create audit log entry
// @route   POST /api/audit
// @access  Private
const createAuditLog = asyncHandler(async (req, res) => {
    const {
        action,
        entityType,
        entityId,
        changes,
        status,
        metadata
    } = req.body;

    const auditLog = await AuditLog.create({
        userId: req.user._id,
        action,
        entityType,
        entityId,
        changes,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        status,
        metadata
    });

    res.status(201).json(auditLog);
});

// @desc    Get audit logs
// @route   GET /api/audit
// @access  Private/Admin
const getAuditLogs = asyncHandler(async (req, res) => {
    const { entityType, entityId, startDate, endDate } = req.query;

    let query = {};

    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const auditLogs = await AuditLog.find(query)
        .populate('userId', 'name email')
        .sort('-createdAt');

    res.json(auditLogs);
});

module.exports = {
    createAuditLog,
    getAuditLogs
}; 