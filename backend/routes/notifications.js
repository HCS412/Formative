// Notification Routes - Review notifications and audit logging
const express = require('express');
const router = express.Router();

const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const { body, param, query, validationResult } = require('express-validator');

// ============================================
// NOTIFICATION TYPES
// ============================================

const NOTIFICATION_TYPES = {
  // Review workflow
  ASSET_SUBMITTED: 'asset_submitted',
  ASSET_APPROVED: 'asset_approved',
  ASSET_CHANGES_REQUESTED: 'asset_changes_requested',
  ASSET_REJECTED: 'asset_rejected',

  // Feedback
  FEEDBACK_RECEIVED: 'feedback_received',
  FEEDBACK_RESOLVED: 'feedback_resolved',

  // Scheduling
  ASSET_SCHEDULED: 'asset_scheduled',
  ASSET_PUBLISHED: 'asset_published',
  ASSET_PUBLISH_FAILED: 'asset_publish_failed',

  // Team
  TEAM_INVITE: 'team_invite',
  TEAM_MEMBER_JOINED: 'team_member_joined',

  // Campaign
  CAMPAIGN_INVITE: 'campaign_invite',
  DELIVERABLE_DUE_SOON: 'deliverable_due_soon',
  DELIVERABLE_OVERDUE: 'deliverable_overdue',

  // Messages
  MESSAGE_RECEIVED: 'message_received',
  MESSAGE_READ: 'message_read',

  // Payments
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_SENT: 'payment_sent',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_FAILED: 'payment_failed',

  // Files/Uploads
  FILE_UPLOADED: 'file_uploaded',
  ASSET_COMMENT: 'asset_comment',

  // Milestones
  MILESTONE_MISSED: 'milestone_missed',
  MILESTONE_APPROACHING: 'milestone_approaching',
  MILESTONE_COMPLETED: 'milestone_completed',

  // Campaign lifecycle
  CAMPAIGN_STARTED: 'campaign_started',
  CAMPAIGN_COMPLETED: 'campaign_completed',

  // Opportunities
  OPPORTUNITY_MATCH: 'opportunity_match',
  APPLICATION_UPDATE: 'application_update',

  // General
  MENTION: 'mention',
  SYSTEM: 'system'
};

// ============================================
// AUDIT EVENT TYPES
// ============================================

const AUDIT_EVENTS = {
  // Asset events
  ASSET_CREATED: 'asset_created',
  ASSET_UPDATED: 'asset_updated',
  ASSET_DELETED: 'asset_deleted',
  ASSET_VERSION_CREATED: 'asset_version_created',
  ASSET_SUBMITTED_FOR_REVIEW: 'asset_submitted_for_review',
  ASSET_REVIEWED: 'asset_reviewed',

  // Feedback events
  FEEDBACK_ADDED: 'feedback_added',
  FEEDBACK_RESOLVED: 'feedback_resolved',

  // Schedule events
  ASSET_SCHEDULED: 'asset_scheduled',
  SCHEDULE_UPDATED: 'schedule_updated',
  SCHEDULE_CANCELLED: 'schedule_cancelled',
  ASSET_PUBLISHED: 'asset_published',

  // Team events
  TEAM_CREATED: 'team_created',
  MEMBER_INVITED: 'member_invited',
  MEMBER_JOINED: 'member_joined',
  MEMBER_REMOVED: 'member_removed',

  // Campaign events
  CAMPAIGN_CREATED: 'campaign_created',
  DELIVERABLE_SUBMITTED: 'deliverable_submitted',
  DELIVERABLE_APPROVED: 'deliverable_approved'
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Create a notification
async function createNotification(userId, type, title, message, data = {}, linkUrl = null) {
  try {
    await pool.query(`
      INSERT INTO notifications (user_id, type, title, message, data, link_url)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [userId, type, title, message, JSON.stringify(data), linkUrl]);
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

// Create an audit log entry
async function createAuditLog(userId, eventType, entityType, entityId, details = {}, ipAddress = null) {
  try {
    await pool.query(`
      INSERT INTO audit_logs (user_id, event_type, entity_type, entity_id, details, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [userId, eventType, entityType, entityId, JSON.stringify(details), ipAddress]);
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

// Notify asset stakeholders
async function notifyAssetStakeholders(assetId, excludeUserId, type, title, message, data = {}) {
  try {
    // Get asset owner and team members
    const result = await pool.query(`
      SELECT DISTINCT u.id
      FROM users u
      LEFT JOIN assets a ON a.created_by = u.id
      LEFT JOIN team_members tm ON tm.team_id = a.team_id AND tm.user_id = u.id
      LEFT JOIN campaigns c ON c.id = a.campaign_id AND c.brand_id = u.id
      WHERE a.id = $1 AND u.id != $2
    `, [assetId, excludeUserId]);

    for (const row of result.rows) {
      await createNotification(
        row.id,
        type,
        title,
        message,
        { ...data, assetId },
        `/dashboard/workspace/assets`
      );
    }
  } catch (error) {
    console.error('Failed to notify stakeholders:', error);
  }
}

// ============================================
// NOTIFICATION ENDPOINTS
// ============================================

// Get user notifications
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { limit = 50, offset = 0, unreadOnly } = req.query;

  let queryStr = `
    SELECT * FROM notifications
    WHERE user_id = $1
  `;
  const params = [userId];
  let paramIndex = 2;

  if (unreadOnly === 'true') {
    queryStr += ` AND is_read = false`;
  }

  queryStr += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(parseInt(limit), parseInt(offset));

  const result = await pool.query(queryStr, params);

  // Get unread count
  const countResult = await pool.query(
    'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
    [userId]
  );

  res.json({
    success: true,
    notifications: result.rows,
    unreadCount: parseInt(countResult.rows[0].count)
  });
}));

// Mark notification as read
router.put('/:id/read', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const notificationId = parseInt(req.params.id);

  const result = await pool.query(`
    UPDATE notifications
    SET is_read = true, read_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `, [notificationId, userId]);

  if (result.rows.length === 0) {
    throw new ApiError('Notification not found', 404);
  }

  res.json({
    success: true,
    notification: result.rows[0]
  });
}));

// Mark all notifications as read
router.put('/read-all', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  await pool.query(`
    UPDATE notifications
    SET is_read = true, read_at = CURRENT_TIMESTAMP
    WHERE user_id = $1 AND is_read = false
  `, [userId]);

  res.json({ success: true, message: 'All notifications marked as read' });
}));

// Delete notification
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const notificationId = parseInt(req.params.id);

  await pool.query(
    'DELETE FROM notifications WHERE id = $1 AND user_id = $2',
    [notificationId, userId]
  );

  res.json({ success: true, message: 'Notification deleted' });
}));

// Delete all read notifications
router.delete('/clear-read', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  await pool.query(
    'DELETE FROM notifications WHERE user_id = $1 AND is_read = true',
    [userId]
  );

  res.json({ success: true, message: 'Read notifications cleared' });
}));

// ============================================
// REVIEW NOTIFICATION ENDPOINTS
// ============================================

// Send review request notification
router.post('/review-request', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { assetId, versionId, reviewerIds, message } = req.body;

  if (!assetId || !reviewerIds || !Array.isArray(reviewerIds)) {
    throw new ApiError('Asset ID and reviewer IDs are required', 400);
  }

  // Get asset info
  const assetResult = await pool.query(
    'SELECT name FROM assets WHERE id = $1',
    [assetId]
  );

  if (assetResult.rows.length === 0) {
    throw new ApiError('Asset not found', 404);
  }

  const assetName = assetResult.rows[0].name;

  // Get sender name
  const userResult = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
  const senderName = userResult.rows[0]?.name || 'Someone';

  // Create notifications for each reviewer
  for (const reviewerId of reviewerIds) {
    await createNotification(
      reviewerId,
      NOTIFICATION_TYPES.ASSET_SUBMITTED,
      'Review Requested',
      `${senderName} requested your review for "${assetName}"${message ? `: ${message}` : ''}`,
      { assetId, versionId, requestedBy: userId },
      `/dashboard/workspace/assets`
    );
  }

  // Audit log
  await createAuditLog(
    userId,
    AUDIT_EVENTS.ASSET_SUBMITTED_FOR_REVIEW,
    'asset',
    assetId,
    { versionId, reviewerIds, message },
    req.ip
  );

  res.json({ success: true, message: 'Review request sent' });
}));

// Send review decision notification
router.post('/review-decision', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { assetId, versionId, decision, notes, creatorId } = req.body;

  if (!assetId || !decision || !creatorId) {
    throw new ApiError('Asset ID, decision, and creator ID are required', 400);
  }

  // Get asset info
  const assetResult = await pool.query(
    'SELECT name FROM assets WHERE id = $1',
    [assetId]
  );

  if (assetResult.rows.length === 0) {
    throw new ApiError('Asset not found', 404);
  }

  const assetName = assetResult.rows[0].name;

  // Get reviewer name
  const userResult = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
  const reviewerName = userResult.rows[0]?.name || 'A reviewer';

  // Determine notification type and message
  let notificationType, title, message;
  switch (decision) {
    case 'approved':
      notificationType = NOTIFICATION_TYPES.ASSET_APPROVED;
      title = 'Asset Approved';
      message = `${reviewerName} approved "${assetName}"`;
      break;
    case 'changes_requested':
      notificationType = NOTIFICATION_TYPES.ASSET_CHANGES_REQUESTED;
      title = 'Changes Requested';
      message = `${reviewerName} requested changes to "${assetName}"${notes ? `: ${notes}` : ''}`;
      break;
    case 'rejected':
      notificationType = NOTIFICATION_TYPES.ASSET_REJECTED;
      title = 'Asset Rejected';
      message = `${reviewerName} rejected "${assetName}"${notes ? `: ${notes}` : ''}`;
      break;
    default:
      throw new ApiError('Invalid decision', 400);
  }

  // Notify creator
  await createNotification(
    creatorId,
    notificationType,
    title,
    message,
    { assetId, versionId, decision, notes, reviewedBy: userId },
    `/dashboard/workspace/assets`
  );

  // Audit log
  await createAuditLog(
    userId,
    AUDIT_EVENTS.ASSET_REVIEWED,
    'asset',
    assetId,
    { versionId, decision, notes, creatorId },
    req.ip
  );

  res.json({ success: true, message: 'Review decision notification sent' });
}));

// Send feedback notification
router.post('/feedback', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { assetId, versionId, feedbackId, content, recipientId } = req.body;

  if (!assetId || !recipientId || !content) {
    throw new ApiError('Asset ID, recipient ID, and content are required', 400);
  }

  // Get sender name
  const userResult = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
  const senderName = userResult.rows[0]?.name || 'Someone';

  // Get asset name
  const assetResult = await pool.query('SELECT name FROM assets WHERE id = $1', [assetId]);
  const assetName = assetResult.rows[0]?.name || 'an asset';

  await createNotification(
    recipientId,
    NOTIFICATION_TYPES.FEEDBACK_RECEIVED,
    'New Feedback',
    `${senderName} left feedback on "${assetName}": "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`,
    { assetId, versionId, feedbackId, senderId: userId },
    `/dashboard/workspace/assets`
  );

  // Audit log
  await createAuditLog(
    userId,
    AUDIT_EVENTS.FEEDBACK_ADDED,
    'asset_feedback',
    feedbackId,
    { assetId, versionId, recipientId, contentPreview: content.substring(0, 100) },
    req.ip
  );

  res.json({ success: true, message: 'Feedback notification sent' });
}));

// ============================================
// AUDIT LOG ENDPOINTS
// ============================================

// Get audit logs (admin only or self)
router.get('/audit-logs', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { entityType, entityId, eventType, limit = 100, offset = 0 } = req.query;

  let queryStr = `
    SELECT al.*, u.name as user_name
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;

  // For now, users can only see their own audit logs
  // In production, add admin check here
  queryStr += ` AND al.user_id = $${paramIndex++}`;
  params.push(userId);

  if (entityType) {
    queryStr += ` AND al.entity_type = $${paramIndex++}`;
    params.push(entityType);
  }
  if (entityId) {
    queryStr += ` AND al.entity_id = $${paramIndex++}`;
    params.push(parseInt(entityId));
  }
  if (eventType) {
    queryStr += ` AND al.event_type = $${paramIndex++}`;
    params.push(eventType);
  }

  queryStr += ` ORDER BY al.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(parseInt(limit), parseInt(offset));

  const result = await pool.query(queryStr, params);

  res.json({
    success: true,
    auditLogs: result.rows
  });
}));

// Get audit log for a specific entity
router.get('/audit-logs/entity/:type/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  const result = await pool.query(`
    SELECT al.*, u.name as user_name
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.entity_type = $1 AND al.entity_id = $2
    ORDER BY al.created_at DESC
    LIMIT $3 OFFSET $4
  `, [type, parseInt(id), parseInt(limit), parseInt(offset)]);

  res.json({
    success: true,
    auditLogs: result.rows
  });
}));

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

// Get notification preferences
router.get('/preferences', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  let result = await pool.query(
    'SELECT * FROM notification_preferences WHERE user_id = $1',
    [userId]
  );

  // Create default preferences if none exist
  if (result.rows.length === 0) {
    result = await pool.query(`
      INSERT INTO notification_preferences (user_id)
      VALUES ($1)
      RETURNING *
    `, [userId]);
  }

  res.json({ success: true, preferences: result.rows[0] });
}));

// Update notification preferences
router.put('/preferences', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const updates = req.body;

  const allowedFields = [
    'in_app_messages', 'in_app_payments', 'in_app_milestones', 'in_app_uploads',
    'in_app_mentions', 'in_app_system',
    'email_messages', 'email_payments', 'email_milestones', 'email_uploads',
    'email_digest', 'email_digest_frequency',
    'push_messages', 'push_payments', 'push_milestones', 'push_uploads',
    'quiet_hours_enabled', 'quiet_hours_start', 'quiet_hours_end', 'timezone'
  ];

  const setClause = [];
  const values = [userId];
  let paramIndex = 2;

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      setClause.push(`${key} = $${paramIndex++}`);
      values.push(value);
    }
  }

  if (setClause.length === 0) {
    throw new ApiError('No valid fields to update', 400);
  }

  setClause.push('updated_at = CURRENT_TIMESTAMP');

  // Use upsert to handle both insert and update
  const result = await pool.query(`
    INSERT INTO notification_preferences (user_id)
    VALUES ($1)
    ON CONFLICT (user_id) DO UPDATE SET ${setClause.join(', ')}
    RETURNING *
  `, values);

  res.json({ success: true, preferences: result.rows[0] });
}));

// ============================================
// PUSH NOTIFICATION SUBSCRIPTIONS
// ============================================

// Get VAPID public key
router.get('/push/vapid-key', (req, res) => {
  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY || null,
    enabled: !!process.env.VAPID_PUBLIC_KEY
  });
});

// Register push subscription
router.post('/push/subscribe', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { endpoint, keys, userAgent } = req.body;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    throw new ApiError('Invalid subscription data', 400);
  }

  await pool.query(`
    INSERT INTO push_subscriptions (user_id, endpoint, p256dh_key, auth_key, user_agent)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (endpoint) DO UPDATE SET
      user_id = $1,
      p256dh_key = $3,
      auth_key = $4,
      user_agent = $5,
      last_used_at = CURRENT_TIMESTAMP
  `, [userId, endpoint, keys.p256dh, keys.auth, userAgent || null]);

  res.json({ success: true, message: 'Push subscription registered' });
}));

// Unsubscribe from push
router.delete('/push/unsubscribe', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { endpoint } = req.body;

  if (!endpoint) {
    throw new ApiError('Endpoint is required', 400);
  }

  await pool.query(
    'DELETE FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2',
    [userId, endpoint]
  );

  res.json({ success: true, message: 'Push subscription removed' });
}));

// Get user's push subscriptions
router.get('/push/subscriptions', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const result = await pool.query(
    'SELECT id, endpoint, user_agent, created_at, last_used_at FROM push_subscriptions WHERE user_id = $1',
    [userId]
  );

  res.json({ success: true, subscriptions: result.rows });
}));

// ============================================
// EXPORTS
// ============================================

module.exports = router;
module.exports.createNotification = createNotification;
module.exports.createAuditLog = createAuditLog;
module.exports.notifyAssetStakeholders = notifyAssetStakeholders;
module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
module.exports.AUDIT_EVENTS = AUDIT_EVENTS;
