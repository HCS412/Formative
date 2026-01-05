// Asset Management Routes - CRUD, workflow, scheduling, metrics
const express = require('express');
const router = express.Router();

const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const { body, param, query, validationResult } = require('express-validator');
const { ASSET_STATUSES, REVIEW_OUTCOMES, FEEDBACK_SOURCES, ASSET_PLATFORMS, ASSET_FORMATS } = require('../utils/constants');

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createAssetValidator = [
  body('name').trim().notEmpty().withMessage('Asset name is required'),
  body('platform').isIn(ASSET_PLATFORMS).withMessage('Invalid platform'),
  body('format').isIn(ASSET_FORMATS).withMessage('Invalid format'),
  body('campaignId').optional().isInt({ min: 1 }),
  body('teamId').optional().isInt({ min: 1 }),
  body('description').optional().trim(),
  body('width').optional().isInt({ min: 1 }),
  body('height').optional().isInt({ min: 1 }),
  body('durationSeconds').optional().isInt({ min: 0 }),
  body('aspectRatio').optional().trim(),
  validateRequest
];

const updateAssetValidator = [
  param('id').isInt({ min: 1 }),
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('platform').optional().isIn(ASSET_PLATFORMS),
  body('format').optional().isIn(ASSET_FORMATS),
  body('status').optional().isIn(ASSET_STATUSES),
  validateRequest
];

const feedbackValidator = [
  body('content').trim().notEmpty().withMessage('Feedback content is required'),
  body('source').optional().isIn(FEEDBACK_SOURCES).withMessage('Invalid feedback source'),
  body('reviewOutcome').optional().isIn(REVIEW_OUTCOMES),
  body('timecodeStart').optional().isFloat({ min: 0 }),
  body('timecodeEnd').optional().isFloat({ min: 0 }),
  body('parentId').optional().isInt({ min: 1 }),
  validateRequest
];

const scheduleValidator = [
  body('platform').isIn(ASSET_PLATFORMS).withMessage('Invalid platform'),
  body('scheduledAt').isISO8601().withMessage('Valid scheduled date required'),
  body('timezone').optional().trim().notEmpty(),
  body('versionId').optional().isInt({ min: 1 }),
  body('campaignId').optional().isInt({ min: 1 }),
  validateRequest
];

// ============================================
// ASSET CRUD OPERATIONS
// ============================================

// Get all assets (with filtering)
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    status, platform, format, campaignId, teamId,
    search, limit = 50, offset = 0, sortBy = 'created_at', sortOrder = 'desc'
  } = req.query;

  const validSortFields = ['created_at', 'updated_at', 'name', 'status', 'platform'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
  const order = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  let queryStr = `
    SELECT a.*,
      u.name as creator_name,
      (SELECT COUNT(*) FROM asset_versions WHERE asset_id = a.id) as version_count,
      (SELECT COUNT(*) FROM asset_feedback af JOIN asset_versions av ON af.version_id = av.id WHERE av.asset_id = a.id AND af.is_resolved = false) as pending_feedback_count
    FROM assets a
    JOIN users u ON a.created_by = u.id
    WHERE (a.created_by = $1
      OR a.team_id IN (SELECT team_id FROM team_members WHERE user_id = $1)
      OR a.campaign_id IN (SELECT id FROM campaigns WHERE brand_id = $1))
  `;

  const params = [userId];
  let paramIndex = 2;

  if (status) {
    queryStr += ` AND a.status = $${paramIndex++}`;
    params.push(status);
  }
  if (platform) {
    queryStr += ` AND a.platform = $${paramIndex++}`;
    params.push(platform);
  }
  if (format) {
    queryStr += ` AND a.format = $${paramIndex++}`;
    params.push(format);
  }
  if (campaignId) {
    queryStr += ` AND a.campaign_id = $${paramIndex++}`;
    params.push(parseInt(campaignId));
  }
  if (teamId) {
    queryStr += ` AND a.team_id = $${paramIndex++}`;
    params.push(parseInt(teamId));
  }
  if (search) {
    queryStr += ` AND (a.name ILIKE $${paramIndex++} OR a.description ILIKE $${paramIndex - 1})`;
    params.push(`%${search}%`);
  }

  queryStr += ` ORDER BY ${sortField} ${order} LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(parseInt(limit), parseInt(offset));

  const result = await pool.query(queryStr, params);

  // Get total count for pagination
  let countQuery = `
    SELECT COUNT(*) FROM assets a
    WHERE (a.created_by = $1
      OR a.team_id IN (SELECT team_id FROM team_members WHERE user_id = $1)
      OR a.campaign_id IN (SELECT id FROM campaigns WHERE brand_id = $1))
  `;
  const countParams = [userId];
  let countIndex = 2;

  if (status) {
    countQuery += ` AND a.status = $${countIndex++}`;
    countParams.push(status);
  }
  if (platform) {
    countQuery += ` AND a.platform = $${countIndex++}`;
    countParams.push(platform);
  }
  if (format) {
    countQuery += ` AND a.format = $${countIndex++}`;
    countParams.push(format);
  }
  if (campaignId) {
    countQuery += ` AND a.campaign_id = $${countIndex++}`;
    countParams.push(parseInt(campaignId));
  }
  if (teamId) {
    countQuery += ` AND a.team_id = $${countIndex++}`;
    countParams.push(parseInt(teamId));
  }
  if (search) {
    countQuery += ` AND (a.name ILIKE $${countIndex++} OR a.description ILIKE $${countIndex - 1})`;
    countParams.push(`%${search}%`);
  }

  const countResult = await pool.query(countQuery, countParams);

  res.json({
    success: true,
    assets: result.rows,
    pagination: {
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
}));

// Get single asset with current version
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const assetId = parseInt(req.params.id);

  const result = await pool.query(`
    SELECT a.*,
      u.name as creator_name,
      c.name as campaign_name,
      t.name as team_name
    FROM assets a
    JOIN users u ON a.created_by = u.id
    LEFT JOIN campaigns c ON a.campaign_id = c.id
    LEFT JOIN teams t ON a.team_id = t.id
    WHERE a.id = $1
      AND (a.created_by = $2
        OR a.team_id IN (SELECT team_id FROM team_members WHERE user_id = $2)
        OR a.campaign_id IN (SELECT id FROM campaigns WHERE brand_id = $2))
  `, [assetId, userId]);

  if (result.rows.length === 0) {
    throw new ApiError('Asset not found', 404);
  }

  const asset = result.rows[0];

  // Get current version with files, captions, and tags
  const versionResult = await pool.query(`
    SELECT av.*,
      u.name as creator_name,
      r.name as reviewer_name
    FROM asset_versions av
    JOIN users u ON av.created_by = u.id
    LEFT JOIN users r ON av.reviewed_by = r.id
    WHERE av.asset_id = $1 AND av.is_current = true
  `, [assetId]);

  let currentVersion = null;
  if (versionResult.rows.length > 0) {
    currentVersion = versionResult.rows[0];

    // Get files, captions, tags for current version
    const [filesResult, captionsResult, tagsResult, settingsResult] = await Promise.all([
      pool.query('SELECT * FROM asset_version_files WHERE version_id = $1 ORDER BY is_primary DESC', [currentVersion.id]),
      pool.query('SELECT * FROM asset_version_captions WHERE version_id = $1 ORDER BY is_primary DESC', [currentVersion.id]),
      pool.query('SELECT * FROM asset_version_tags WHERE version_id = $1', [currentVersion.id]),
      pool.query('SELECT * FROM asset_version_platform_settings WHERE version_id = $1', [currentVersion.id])
    ]);

    currentVersion.files = filesResult.rows;
    currentVersion.captions = captionsResult.rows;
    currentVersion.tags = tagsResult.rows;
    currentVersion.platformSettings = settingsResult.rows;
  }

  res.json({
    success: true,
    asset: {
      ...asset,
      currentVersion
    }
  });
}));

// Create new asset
router.post('/', authenticateToken, createAssetValidator, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    name, description, platform, format, campaignId, teamId,
    width, height, durationSeconds, aspectRatio, isSensitive, metadata
  } = req.body;

  const result = await pool.query(`
    INSERT INTO assets (
      name, description, platform, format, campaign_id, team_id, created_by,
      width, height, duration_seconds, aspect_ratio, is_sensitive, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `, [
    name, description || null, platform, format, campaignId || null, teamId || null, userId,
    width || null, height || null, durationSeconds || null, aspectRatio || null,
    isSensitive || false, metadata ? JSON.stringify(metadata) : '{}'
  ]);

  const asset = result.rows[0];

  // Create initial version
  const versionResult = await pool.query(`
    INSERT INTO asset_versions (asset_id, version_number, created_by, is_current)
    VALUES ($1, 1, $2, true)
    RETURNING *
  `, [asset.id, userId]);

  res.status(201).json({
    success: true,
    asset: {
      ...asset,
      currentVersion: versionResult.rows[0]
    }
  });
}));

// Update asset
router.put('/:id', authenticateToken, updateAssetValidator, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const assetId = parseInt(req.params.id);

  // Verify ownership/access
  const accessCheck = await pool.query(`
    SELECT id FROM assets
    WHERE id = $1
      AND (created_by = $2
        OR team_id IN (SELECT team_id FROM team_members WHERE user_id = $2 AND role IN ('owner', 'admin', 'manager'))
        OR campaign_id IN (SELECT id FROM campaigns WHERE brand_id = $2))
  `, [assetId, userId]);

  if (accessCheck.rows.length === 0) {
    throw new ApiError('Asset not found or access denied', 404);
  }

  const { name, description, platform, format, status, width, height, durationSeconds, aspectRatio, isSensitive, metadata } = req.body;

  const updates = [];
  const values = [];
  let paramIndex = 1;

  if (name !== undefined) { updates.push(`name = $${paramIndex++}`); values.push(name); }
  if (description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(description); }
  if (platform !== undefined) { updates.push(`platform = $${paramIndex++}`); values.push(platform); }
  if (format !== undefined) { updates.push(`format = $${paramIndex++}`); values.push(format); }
  if (status !== undefined) { updates.push(`status = $${paramIndex++}`); values.push(status); }
  if (width !== undefined) { updates.push(`width = $${paramIndex++}`); values.push(width); }
  if (height !== undefined) { updates.push(`height = $${paramIndex++}`); values.push(height); }
  if (durationSeconds !== undefined) { updates.push(`duration_seconds = $${paramIndex++}`); values.push(durationSeconds); }
  if (aspectRatio !== undefined) { updates.push(`aspect_ratio = $${paramIndex++}`); values.push(aspectRatio); }
  if (isSensitive !== undefined) { updates.push(`is_sensitive = $${paramIndex++}`); values.push(isSensitive); }
  if (metadata !== undefined) { updates.push(`metadata = $${paramIndex++}`); values.push(JSON.stringify(metadata)); }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(assetId);

  const result = await pool.query(`
    UPDATE assets SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `, values);

  res.json({
    success: true,
    asset: result.rows[0]
  });
}));

// Delete asset
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const assetId = parseInt(req.params.id);

  // Verify ownership
  const accessCheck = await pool.query(`
    SELECT id FROM assets
    WHERE id = $1 AND created_by = $2
  `, [assetId, userId]);

  if (accessCheck.rows.length === 0) {
    throw new ApiError('Asset not found or you cannot delete this asset', 404);
  }

  await pool.query('DELETE FROM assets WHERE id = $1', [assetId]);

  res.json({ success: true, message: 'Asset deleted' });
}));

// ============================================
// VERSION MANAGEMENT
// ============================================

// Get all versions of an asset
router.get('/:id/versions', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const assetId = parseInt(req.params.id);

  // Verify access
  const accessCheck = await pool.query(`
    SELECT id FROM assets
    WHERE id = $1
      AND (created_by = $2
        OR team_id IN (SELECT team_id FROM team_members WHERE user_id = $2)
        OR campaign_id IN (SELECT id FROM campaigns WHERE brand_id = $2))
  `, [assetId, userId]);

  if (accessCheck.rows.length === 0) {
    throw new ApiError('Asset not found', 404);
  }

  const result = await pool.query(`
    SELECT av.*,
      u.name as creator_name,
      r.name as reviewer_name,
      (SELECT COUNT(*) FROM asset_feedback WHERE version_id = av.id) as feedback_count
    FROM asset_versions av
    JOIN users u ON av.created_by = u.id
    LEFT JOIN users r ON av.reviewed_by = r.id
    WHERE av.asset_id = $1
    ORDER BY av.version_number DESC
  `, [assetId]);

  res.json({
    success: true,
    versions: result.rows
  });
}));

// Create new version
router.post('/:id/versions', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const assetId = parseInt(req.params.id);

  // Verify access
  const accessCheck = await pool.query(`
    SELECT id FROM assets
    WHERE id = $1
      AND (created_by = $2
        OR team_id IN (SELECT team_id FROM team_members WHERE user_id = $2 AND role IN ('owner', 'admin', 'manager', 'member')))
  `, [assetId, userId]);

  if (accessCheck.rows.length === 0) {
    throw new ApiError('Asset not found or access denied', 404);
  }

  // Get next version number
  const versionResult = await pool.query(
    'SELECT COALESCE(MAX(version_number), 0) + 1 as next_version FROM asset_versions WHERE asset_id = $1',
    [assetId]
  );
  const nextVersion = versionResult.rows[0].next_version;

  // Mark all previous versions as not current
  await pool.query('UPDATE asset_versions SET is_current = false WHERE asset_id = $1', [assetId]);

  // Create new version
  const result = await pool.query(`
    INSERT INTO asset_versions (asset_id, version_number, created_by, is_current)
    VALUES ($1, $2, $3, true)
    RETURNING *
  `, [assetId, nextVersion, userId]);

  // Update asset status back to draft
  await pool.query('UPDATE assets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['draft', assetId]);

  res.status(201).json({
    success: true,
    version: result.rows[0]
  });
}));

// Submit version for review
router.post('/:assetId/versions/:versionId/submit', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const assetId = parseInt(req.params.assetId);
  const versionId = parseInt(req.params.versionId);

  // Verify access
  const versionCheck = await pool.query(`
    SELECT av.id, a.id as asset_id
    FROM asset_versions av
    JOIN assets a ON av.asset_id = a.id
    WHERE av.id = $1 AND av.asset_id = $2
      AND (a.created_by = $3
        OR a.team_id IN (SELECT team_id FROM team_members WHERE user_id = $3))
  `, [versionId, assetId, userId]);

  if (versionCheck.rows.length === 0) {
    throw new ApiError('Version not found or access denied', 404);
  }

  await pool.query('UPDATE asset_versions SET status = $1 WHERE id = $2', ['in_review', versionId]);
  await pool.query('UPDATE assets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['in_review', assetId]);

  res.json({ success: true, message: 'Version submitted for review' });
}));

// Review version (approve/request changes/reject)
router.post('/:assetId/versions/:versionId/review', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const assetId = parseInt(req.params.assetId);
  const versionId = parseInt(req.params.versionId);
  const { outcome, notes } = req.body;

  if (!REVIEW_OUTCOMES.includes(outcome)) {
    throw new ApiError('Invalid review outcome', 400);
  }

  // Verify reviewer has access (brand owner or team admin)
  const versionCheck = await pool.query(`
    SELECT av.id, a.id as asset_id, a.campaign_id
    FROM asset_versions av
    JOIN assets a ON av.asset_id = a.id
    WHERE av.id = $1 AND av.asset_id = $2
      AND (a.campaign_id IN (SELECT id FROM campaigns WHERE brand_id = $3)
        OR a.team_id IN (SELECT team_id FROM team_members WHERE user_id = $3 AND role IN ('owner', 'admin')))
  `, [versionId, assetId, userId]);

  if (versionCheck.rows.length === 0) {
    throw new ApiError('Version not found or you cannot review this asset', 404);
  }

  const newStatus = outcome === 'approved' ? 'approved' : 'changes_requested';

  await pool.query(`
    UPDATE asset_versions
    SET status = $1, review_outcome = $2, reviewed_by = $3, review_notes = $4, reviewed_at = CURRENT_TIMESTAMP
    WHERE id = $5
  `, [newStatus, outcome, userId, notes || null, versionId]);

  await pool.query('UPDATE assets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newStatus, assetId]);

  res.json({ success: true, message: `Version ${outcome}` });
}));

// ============================================
// FEEDBACK
// ============================================

// Get feedback for a version
router.get('/:assetId/versions/:versionId/feedback', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const versionId = parseInt(req.params.versionId);

  const result = await pool.query(`
    SELECT af.*,
      u.name as user_name,
      r.name as resolved_by_name
    FROM asset_feedback af
    JOIN users u ON af.user_id = u.id
    LEFT JOIN users r ON af.resolved_by = r.id
    WHERE af.version_id = $1
    ORDER BY af.created_at ASC
  `, [versionId]);

  res.json({
    success: true,
    feedback: result.rows
  });
}));

// Add feedback to version
router.post('/:assetId/versions/:versionId/feedback', authenticateToken, feedbackValidator, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const versionId = parseInt(req.params.versionId);
  const { content, source, reviewOutcome, timecodeStart, timecodeEnd, parentId } = req.body;

  const result = await pool.query(`
    INSERT INTO asset_feedback (
      version_id, user_id, content, source, review_outcome,
      timecode_start, timecode_end, parent_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [
    versionId, userId, content, source || 'internal', reviewOutcome || null,
    timecodeStart || null, timecodeEnd || null, parentId || null
  ]);

  res.status(201).json({
    success: true,
    feedback: result.rows[0]
  });
}));

// Resolve feedback
router.put('/feedback/:feedbackId/resolve', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const feedbackId = parseInt(req.params.feedbackId);

  const result = await pool.query(`
    UPDATE asset_feedback
    SET is_resolved = true, resolved_at = CURRENT_TIMESTAMP, resolved_by = $1
    WHERE id = $2
    RETURNING *
  `, [userId, feedbackId]);

  if (result.rows.length === 0) {
    throw new ApiError('Feedback not found', 404);
  }

  res.json({
    success: true,
    feedback: result.rows[0]
  });
}));

// ============================================
// SCHEDULING
// ============================================

// Get schedule for an asset
router.get('/:id/schedule', authenticateToken, asyncHandler(async (req, res) => {
  const assetId = parseInt(req.params.id);

  const result = await pool.query(`
    SELECT ass.*,
      u.name as created_by_name,
      av.version_number
    FROM asset_schedule_slots ass
    JOIN users u ON ass.created_by = u.id
    LEFT JOIN asset_versions av ON ass.version_id = av.id
    WHERE ass.asset_id = $1
    ORDER BY ass.scheduled_at ASC
  `, [assetId]);

  res.json({
    success: true,
    scheduleSlots: result.rows
  });
}));

// Schedule asset for publishing
router.post('/:id/schedule', authenticateToken, scheduleValidator, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const assetId = parseInt(req.params.id);
  const { platform, scheduledAt, timezone, versionId, campaignId, metadata } = req.body;

  // Verify asset exists and is approved
  const assetCheck = await pool.query(`
    SELECT id, status FROM assets WHERE id = $1 AND status = 'approved'
  `, [assetId]);

  if (assetCheck.rows.length === 0) {
    throw new ApiError('Asset not found or not approved for scheduling', 400);
  }

  const result = await pool.query(`
    INSERT INTO asset_schedule_slots (
      asset_id, version_id, campaign_id, platform, scheduled_at, timezone, created_by, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [
    assetId, versionId || null, campaignId || null, platform, scheduledAt,
    timezone || 'UTC', userId, metadata ? JSON.stringify(metadata) : '{}'
  ]);

  // Update asset status to scheduled
  await pool.query('UPDATE assets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['scheduled', assetId]);

  res.status(201).json({
    success: true,
    scheduleSlot: result.rows[0]
  });
}));

// Update schedule slot
router.put('/schedule/:slotId', authenticateToken, asyncHandler(async (req, res) => {
  const slotId = parseInt(req.params.slotId);
  const { scheduledAt, timezone, status } = req.body;

  const updates = [];
  const values = [];
  let paramIndex = 1;

  if (scheduledAt) { updates.push(`scheduled_at = $${paramIndex++}`); values.push(scheduledAt); }
  if (timezone) { updates.push(`timezone = $${paramIndex++}`); values.push(timezone); }
  if (status) { updates.push(`status = $${paramIndex++}`); values.push(status); }
  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(slotId);

  const result = await pool.query(`
    UPDATE asset_schedule_slots SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `, values);

  if (result.rows.length === 0) {
    throw new ApiError('Schedule slot not found', 404);
  }

  res.json({
    success: true,
    scheduleSlot: result.rows[0]
  });
}));

// Cancel schedule slot
router.delete('/schedule/:slotId', authenticateToken, asyncHandler(async (req, res) => {
  const slotId = parseInt(req.params.slotId);

  const result = await pool.query(`
    UPDATE asset_schedule_slots SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND status = 'scheduled'
    RETURNING asset_id
  `, [slotId]);

  if (result.rows.length === 0) {
    throw new ApiError('Schedule slot not found or already processed', 404);
  }

  // Check if asset has other scheduled slots, if not revert status
  const otherSlots = await pool.query(`
    SELECT id FROM asset_schedule_slots
    WHERE asset_id = $1 AND status = 'scheduled' AND id != $2
  `, [result.rows[0].asset_id, slotId]);

  if (otherSlots.rows.length === 0) {
    await pool.query('UPDATE assets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', ['approved', result.rows[0].asset_id]);
  }

  res.json({ success: true, message: 'Schedule slot cancelled' });
}));

// Get all scheduled slots (calendar view)
router.get('/schedule', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { startDate, endDate, platform, status } = req.query;

  let queryStr = `
    SELECT ass.*,
      a.name as asset_name,
      a.format as asset_format,
      u.name as created_by_name,
      av.version_number
    FROM asset_schedule_slots ass
    JOIN assets a ON ass.asset_id = a.id
    JOIN users u ON ass.created_by = u.id
    LEFT JOIN asset_versions av ON ass.version_id = av.id
    WHERE (a.created_by = $1
      OR a.team_id IN (SELECT team_id FROM team_members WHERE user_id = $1)
      OR a.campaign_id IN (SELECT id FROM campaigns WHERE brand_id = $1))
  `;

  const params = [userId];
  let paramIndex = 2;

  if (startDate) {
    queryStr += ` AND ass.scheduled_at >= $${paramIndex++}`;
    params.push(startDate);
  }
  if (endDate) {
    queryStr += ` AND ass.scheduled_at <= $${paramIndex++}`;
    params.push(endDate);
  }
  if (platform) {
    queryStr += ` AND ass.platform = $${paramIndex++}`;
    params.push(platform);
  }
  if (status) {
    queryStr += ` AND ass.status = $${paramIndex++}`;
    params.push(status);
  }

  queryStr += ' ORDER BY ass.scheduled_at ASC';

  const result = await pool.query(queryStr, params);

  res.json({
    success: true,
    scheduleSlots: result.rows
  });
}));

// ============================================
// METRICS
// ============================================

// Get metrics for an asset
router.get('/:id/metrics', authenticateToken, asyncHandler(async (req, res) => {
  const assetId = parseInt(req.params.id);
  const { platform, startDate, endDate } = req.query;

  let queryStr = `
    SELECT * FROM asset_metrics
    WHERE asset_id = $1
  `;

  const params = [assetId];
  let paramIndex = 2;

  if (platform) {
    queryStr += ` AND platform = $${paramIndex++}`;
    params.push(platform);
  }
  if (startDate) {
    queryStr += ` AND recorded_at >= $${paramIndex++}`;
    params.push(startDate);
  }
  if (endDate) {
    queryStr += ` AND recorded_at <= $${paramIndex++}`;
    params.push(endDate);
  }

  queryStr += ' ORDER BY recorded_at DESC';

  const result = await pool.query(queryStr, params);

  // Also get aggregated metrics
  const aggregateResult = await pool.query(`
    SELECT
      SUM(impressions) as total_impressions,
      SUM(reach) as total_reach,
      SUM(clicks) as total_clicks,
      SUM(engagements) as total_engagements,
      SUM(saves) as total_saves,
      SUM(shares) as total_shares,
      SUM(comments) as total_comments,
      SUM(likes) as total_likes,
      SUM(conversions) as total_conversions,
      SUM(conversion_value) as total_conversion_value
    FROM asset_metrics
    WHERE asset_id = $1
  `, [assetId]);

  res.json({
    success: true,
    metrics: result.rows,
    aggregate: aggregateResult.rows[0]
  });
}));

// Record metrics for an asset
router.post('/:id/metrics', authenticateToken, asyncHandler(async (req, res) => {
  const assetId = parseInt(req.params.id);
  const {
    platform, scheduleSlotId, impressions, reach, clicks, engagements,
    saves, shares, comments, likes, conversions, conversionValue, platformMetrics
  } = req.body;

  if (!ASSET_PLATFORMS.includes(platform)) {
    throw new ApiError('Invalid platform', 400);
  }

  const result = await pool.query(`
    INSERT INTO asset_metrics (
      asset_id, schedule_slot_id, platform, impressions, reach, clicks,
      engagements, saves, shares, comments, likes, conversions,
      conversion_value, platform_metrics
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `, [
    assetId, scheduleSlotId || null, platform,
    impressions || 0, reach || 0, clicks || 0, engagements || 0,
    saves || 0, shares || 0, comments || 0, likes || 0,
    conversions || 0, conversionValue || 0,
    platformMetrics ? JSON.stringify(platformMetrics) : '{}'
  ]);

  res.status(201).json({
    success: true,
    metrics: result.rows[0]
  });
}));

// Get metrics summary across all assets
router.get('/metrics/summary', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { startDate, endDate, platform } = req.query;

  let queryStr = `
    SELECT
      am.platform,
      COUNT(DISTINCT am.asset_id) as asset_count,
      SUM(am.impressions) as total_impressions,
      SUM(am.reach) as total_reach,
      SUM(am.clicks) as total_clicks,
      SUM(am.engagements) as total_engagements,
      SUM(am.likes) as total_likes,
      SUM(am.shares) as total_shares,
      SUM(am.conversions) as total_conversions,
      SUM(am.conversion_value) as total_conversion_value
    FROM asset_metrics am
    JOIN assets a ON am.asset_id = a.id
    WHERE (a.created_by = $1
      OR a.team_id IN (SELECT team_id FROM team_members WHERE user_id = $1)
      OR a.campaign_id IN (SELECT id FROM campaigns WHERE brand_id = $1))
  `;

  const params = [userId];
  let paramIndex = 2;

  if (startDate) {
    queryStr += ` AND am.recorded_at >= $${paramIndex++}`;
    params.push(startDate);
  }
  if (endDate) {
    queryStr += ` AND am.recorded_at <= $${paramIndex++}`;
    params.push(endDate);
  }
  if (platform) {
    queryStr += ` AND am.platform = $${paramIndex++}`;
    params.push(platform);
  }

  queryStr += ' GROUP BY am.platform ORDER BY total_impressions DESC';

  const result = await pool.query(queryStr, params);

  res.json({
    success: true,
    summary: result.rows
  });
}));

// ============================================
// VERSION FILES
// ============================================

// Import upload middleware and S3 service
const { assetUpload, handleUploadError } = require('../middleware/upload');
const { uploadAssetFile, deleteFile: deleteS3File } = require('../services/s3Service');

// Upload files to version (multipart/form-data)
router.post('/:assetId/versions/:versionId/upload', authenticateToken, assetUpload.array('files', 10), handleUploadError, asyncHandler(async (req, res) => {
  const assetId = parseInt(req.params.assetId);
  const versionId = parseInt(req.params.versionId);
  const userId = req.user.userId;

  // Verify asset ownership
  const assetCheck = await pool.query(
    'SELECT id FROM assets WHERE id = $1 AND created_by = $2',
    [assetId, userId]
  );
  if (assetCheck.rows.length === 0) {
    throw new ApiError('Asset not found or access denied', 404);
  }

  // Verify version exists
  const versionCheck = await pool.query(
    'SELECT id FROM asset_versions WHERE id = $1 AND asset_id = $2',
    [versionId, assetId]
  );
  if (versionCheck.rows.length === 0) {
    throw new ApiError('Version not found', 404);
  }

  if (!req.files || req.files.length === 0) {
    throw new ApiError('No files uploaded', 400);
  }

  const uploadedFiles = [];
  const isPrimaryRequested = req.body.isPrimary === 'true';

  // Check if this version already has files
  const existingFiles = await pool.query(
    'SELECT COUNT(*) as count FROM asset_version_files WHERE version_id = $1',
    [versionId]
  );
  const isFirstUpload = parseInt(existingFiles.rows[0].count) === 0;

  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];

    try {
      // Upload to S3
      const uploadResult = await uploadAssetFile(file, assetId, versionId);

      // First file is primary if no files exist yet, or if explicitly requested
      const isPrimary = (isFirstUpload && i === 0) || (isPrimaryRequested && i === 0);

      // If setting as primary, unset other primary files first
      if (isPrimary) {
        await pool.query('UPDATE asset_version_files SET is_primary = false WHERE version_id = $1', [versionId]);
      }

      // Store file metadata in database
      const result = await pool.query(`
        INSERT INTO asset_version_files (
          version_id, file_url, file_name, mime_type, file_size,
          storage_provider, is_primary, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        versionId,
        uploadResult.url,
        file.originalname,
        uploadResult.contentType,
        uploadResult.size,
        's3',
        isPrimary,
        JSON.stringify({
          thumbnailUrl: uploadResult.thumbnailUrl,
          s3Key: uploadResult.key,
          originalMimeType: file.mimetype,
        })
      ]);

      uploadedFiles.push({
        ...result.rows[0],
        thumbnailUrl: uploadResult.thumbnailUrl,
      });
    } catch (uploadError) {
      console.error('Failed to upload file:', uploadError);
      uploadedFiles.push({
        error: true,
        fileName: file.originalname,
        message: uploadError.message,
      });
    }
  }

  // Update asset's updated_at timestamp
  await pool.query('UPDATE assets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [assetId]);

  res.status(201).json({
    success: true,
    files: uploadedFiles,
    totalUploaded: uploadedFiles.filter(f => !f.error).length,
    totalFailed: uploadedFiles.filter(f => f.error).length,
  });
}));

// Get files for a version
router.get('/:assetId/versions/:versionId/files', authenticateToken, asyncHandler(async (req, res) => {
  const versionId = parseInt(req.params.versionId);

  const result = await pool.query(`
    SELECT * FROM asset_version_files
    WHERE version_id = $1
    ORDER BY is_primary DESC, created_at ASC
  `, [versionId]);

  res.json({
    success: true,
    files: result.rows.map(f => ({
      ...f,
      thumbnailUrl: f.metadata?.thumbnailUrl || null,
    }))
  });
}));

// Add file to version (JSON - for external URLs)
router.post('/:assetId/versions/:versionId/files', authenticateToken, asyncHandler(async (req, res) => {
  const versionId = parseInt(req.params.versionId);
  const { fileUrl, fileName, mimeType, fileSize, storageProvider, checksum, isPrimary, metadata } = req.body;

  if (!fileUrl || !fileName) {
    throw new ApiError('File URL and name are required', 400);
  }

  // If setting as primary, unset other primary files
  if (isPrimary) {
    await pool.query('UPDATE asset_version_files SET is_primary = false WHERE version_id = $1', [versionId]);
  }

  const result = await pool.query(`
    INSERT INTO asset_version_files (
      version_id, file_url, file_name, mime_type, file_size,
      storage_provider, checksum, is_primary, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `, [
    versionId, fileUrl, fileName, mimeType || null, fileSize || null,
    storageProvider || 'local', checksum || null, isPrimary || false,
    metadata ? JSON.stringify(metadata) : '{}'
  ]);

  res.status(201).json({
    success: true,
    file: result.rows[0]
  });
}));

// Delete file from version
router.delete('/files/:fileId', authenticateToken, asyncHandler(async (req, res) => {
  const fileId = parseInt(req.params.fileId);

  // Get file info before deleting
  const fileResult = await pool.query('SELECT * FROM asset_version_files WHERE id = $1', [fileId]);

  if (fileResult.rows.length > 0) {
    const file = fileResult.rows[0];

    // Delete from S3 if it's an S3 file
    if (file.storage_provider === 's3' && file.file_url) {
      await deleteS3File(file.file_url);
      // Also delete thumbnail if exists
      if (file.metadata?.thumbnailUrl) {
        await deleteS3File(file.metadata.thumbnailUrl);
      }
    }
  }

  await pool.query('DELETE FROM asset_version_files WHERE id = $1', [fileId]);

  res.json({ success: true, message: 'File removed' });
}));

// ============================================
// VERSION CAPTIONS
// ============================================

// Add/update caption
router.post('/:assetId/versions/:versionId/captions', authenticateToken, asyncHandler(async (req, res) => {
  const versionId = parseInt(req.params.versionId);
  const { caption, locale, isPrimary } = req.body;

  if (!caption) {
    throw new ApiError('Caption content is required', 400);
  }

  // If setting as primary, unset other primary captions
  if (isPrimary) {
    await pool.query('UPDATE asset_version_captions SET is_primary = false WHERE version_id = $1', [versionId]);
  }

  const result = await pool.query(`
    INSERT INTO asset_version_captions (version_id, caption, locale, is_primary)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (version_id, locale)
    DO UPDATE SET caption = EXCLUDED.caption, is_primary = EXCLUDED.is_primary, updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `, [versionId, caption, locale || 'en', isPrimary || false]);

  res.status(201).json({
    success: true,
    caption: result.rows[0]
  });
}));

// ============================================
// VERSION TAGS
// ============================================

// Add tags
router.post('/:assetId/versions/:versionId/tags', authenticateToken, asyncHandler(async (req, res) => {
  const versionId = parseInt(req.params.versionId);
  const { tags, tagType } = req.body;

  if (!Array.isArray(tags) || tags.length === 0) {
    throw new ApiError('Tags array is required', 400);
  }

  const insertedTags = [];
  for (const tag of tags) {
    try {
      const result = await pool.query(`
        INSERT INTO asset_version_tags (version_id, tag, tag_type)
        VALUES ($1, $2, $3)
        ON CONFLICT (version_id, tag, tag_type) DO NOTHING
        RETURNING *
      `, [versionId, tag.toLowerCase().trim(), tagType || 'general']);

      if (result.rows.length > 0) {
        insertedTags.push(result.rows[0]);
      }
    } catch (e) {
      // Ignore duplicate errors
    }
  }

  res.status(201).json({
    success: true,
    tags: insertedTags
  });
}));

// Remove tag
router.delete('/tags/:tagId', authenticateToken, asyncHandler(async (req, res) => {
  const tagId = parseInt(req.params.tagId);

  await pool.query('DELETE FROM asset_version_tags WHERE id = $1', [tagId]);

  res.json({ success: true, message: 'Tag removed' });
}));

module.exports = router;
