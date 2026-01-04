// Asset management, scheduling, and metrics routes
const express = require('express');
const crypto = require('crypto');

const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const router = express.Router();

// In-memory stores for assets, schedules, and mock performance snapshots
const assetsStore = new Map();
const scheduleStore = new Map();

// ---------------------------------------------
// Helper utilities
// ---------------------------------------------

const EDIT_ROLES = ['owner', 'admin', 'manager', 'editor'];
const REVIEW_ROLES = ['owner', 'admin', 'manager', 'reviewer'];
const SCHEDULER_ROLES = ['owner', 'admin', 'manager'];

function generateId(prefix) {
  const uniqueId = crypto.randomUUID();
  return prefix ? `${prefix}_${uniqueId}` : uniqueId;
}

async function getTeamAccess(teamId, userId) {
  const result = await pool.query(
    `SELECT t.owner_id, tm.status as membership_status, tr.name as role_name
     FROM teams t
     LEFT JOIN team_members tm ON tm.team_id = t.id AND tm.user_id = $2
     LEFT JOIN team_roles tr ON tm.team_role_id = tr.id
     WHERE t.id = $1`,
    [teamId, userId]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  if (row.owner_id === userId) {
    return { teamId, isOwner: true, role: 'owner' };
  }

  if (row.membership_status !== 'active') return null;

  return { teamId, isOwner: false, role: row.role_name || 'member' };
}

const ensureTeamAccess = (allowedRoles = []) => asyncHandler(async (req, res, next) => {
  const teamId = req.asset?.teamId || req.body.teamId || req.query.teamId || req.params.teamId;

  if (!teamId) {
    throw ApiError.badRequest('teamId is required for this operation');
  }

  const access = await getTeamAccess(teamId, req.user.userId);
  if (!access) {
    throw ApiError.forbidden('You are not authorized to manage assets for this team');
  }

  if (
    allowedRoles.length > 0 &&
    !access.isOwner &&
    !allowedRoles.includes('*') &&
    !allowedRoles.includes(access.role)
  ) {
    throw ApiError.forbidden('Insufficient team role for this action', {
      requiredRoles: allowedRoles,
      currentRole: access.role || 'member'
    });
  }

  req.teamAccess = access;
  next();
});

const loadAsset = asyncHandler((req, res, next) => {
  const asset = assetsStore.get(req.params.id);
  if (!asset) {
    throw ApiError.notFound('Asset not found');
  }
  req.asset = asset;
  next();
});

function parseDate(value, field) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw ApiError.badRequest(`${field} must be a valid date`);
  }
  return date;
}

function datesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

function findConflicts(teamId, start, end, ignoreAssetId) {
  const conflicts = [];

  for (const [assetId, slots] of scheduleStore.entries()) {
    if (ignoreAssetId && assetId === ignoreAssetId) continue;

    const asset = assetsStore.get(assetId);
    if (!asset || asset.teamId !== teamId || asset.status === 'archived') continue;

    slots.forEach((slot) => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      if (datesOverlap(start, end, slotStart, slotEnd)) {
        conflicts.push({
          assetId,
          assetName: asset.name,
          start: slot.start,
          end: slot.end,
          status: slot.status
        });
      }
    });
  }

  return conflicts;
}

function ensureAssetSchedule(assetId) {
  if (!scheduleStore.has(assetId)) {
    scheduleStore.set(assetId, []);
  }
  return scheduleStore.get(assetId);
}

function generateMockMetrics(seed, window = '7d') {
  const base = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const impressions = (base % 5000) + 750;
  const engagements = Math.max(50, Math.round(impressions * 0.18));
  const ctr = Number(((engagements / impressions) * 100).toFixed(2));

  const trend = Array.from({ length: 7 }).map((_, idx) => {
    const dayImpressions = impressions - idx * 35 + (base % 25);
    const dayEngagements = Math.max(10, Math.round(dayImpressions * 0.17));
    return {
      date: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
      impressions: dayImpressions,
      engagements: dayEngagements,
      ctr: Number(((dayEngagements / dayImpressions) * 100).toFixed(2))
    };
  }).reverse();

  return {
    window,
    impressions,
    engagements,
    ctr,
    trend
  };
}

// ---------------------------------------------
// Asset CRUD & workflow
// ---------------------------------------------

router.get('/', authenticateToken, ensureTeamAccess(), asyncHandler(async (req, res) => {
  const { search, status, campaignId, teamId } = req.query;

  const filtered = Array.from(assetsStore.values()).filter((asset) => {
    if (asset.teamId !== Number(teamId) && asset.teamId !== teamId) return false;
    if (status && asset.status !== status) return false;
    if (campaignId && asset.campaignId !== campaignId) return false;
    if (search) {
      const haystack = `${asset.name} ${asset.type} ${(asset.tags || []).join(' ')}`.toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  res.json({
    success: true,
    assets: filtered,
    total: filtered.length
  });
}));

router.post('/', authenticateToken, ensureTeamAccess(EDIT_ROLES), asyncHandler(async (req, res) => {
  const { name, type, campaignId, metadata = {}, tags = [] } = req.body;

  if (!name) {
    throw ApiError.badRequest('Asset name is required');
  }

  const now = new Date().toISOString();
  const asset = {
    id: generateId('asset'),
    name,
    type: type || 'generic',
    teamId: req.body.teamId,
    campaignId: campaignId || null,
    status: 'draft',
    metadata,
    tags,
    review: { status: 'unsubmitted', notes: [] },
    schedules: [],
    createdAt: now,
    updatedAt: now,
    version: 1
  };

  assetsStore.set(asset.id, asset);

  res.status(201).json({ success: true, asset });
}));

router.put('/:id', authenticateToken, loadAsset, ensureTeamAccess(EDIT_ROLES), asyncHandler(async (req, res) => {
  const allowedUpdates = ['name', 'type', 'campaignId', 'metadata', 'tags'];
  const now = new Date().toISOString();

  if (req.asset.status === 'archived') {
    throw ApiError.conflict('Archived assets cannot be updated');
  }

  allowedUpdates.forEach((field) => {
    if (typeof req.body[field] !== 'undefined') {
      req.asset[field] = req.body[field];
    }
  });

  req.asset.version += 1;
  req.asset.updatedAt = now;

  res.json({ success: true, asset: req.asset });
}));

router.post('/:id/upload-url', authenticateToken, loadAsset, ensureTeamAccess(EDIT_ROLES), asyncHandler(async (req, res) => {
  const token = crypto.randomBytes(16).toString('hex');
  const uploadUrl = `https://uploads.formative.example/${req.asset.id}/${token}`;

  res.json({
    success: true,
    upload: {
      url: uploadUrl,
      method: 'PUT',
      expiresIn: 900,
      headers: {
        'x-amz-meta-user': req.user.userId,
        'x-amz-meta-asset': req.asset.id
      }
    }
  });
}));

router.post('/:id/submit', authenticateToken, loadAsset, ensureTeamAccess(EDIT_ROLES), asyncHandler(async (req, res) => {
  if (req.asset.status === 'archived') {
    throw ApiError.conflict('Archived assets cannot be submitted for review');
  }

  req.asset.status = 'in_review';
  req.asset.review.status = 'submitted';
  req.asset.review.notes.push({
    message: req.body.note || 'Submitted for review',
    by: req.user.userId,
    at: new Date().toISOString()
  });
  req.asset.updatedAt = new Date().toISOString();

  res.json({ success: true, asset: req.asset });
}));

router.post('/:id/review', authenticateToken, loadAsset, ensureTeamAccess(REVIEW_ROLES), asyncHandler(async (req, res) => {
  const { action, feedback } = req.body;
  const validActions = ['approve', 'reject', 'request_changes'];

  if (!validActions.includes(action)) {
    throw ApiError.badRequest('Action must be approve, reject, or request_changes');
  }

  const now = new Date().toISOString();
  let nextStatus = req.asset.status;

  if (action === 'approve') {
    nextStatus = 'approved';
  } else if (action === 'reject') {
    nextStatus = 'rejected';
  } else if (action === 'request_changes') {
    nextStatus = 'changes_requested';
  }

  req.asset.status = nextStatus;
  req.asset.review.status = action;
  req.asset.review.notes.push({
    message: feedback || `Review action: ${action}`,
    by: req.user.userId,
    at: now
  });
  req.asset.updatedAt = now;

  res.json({ success: true, asset: req.asset });
}));

router.post('/:id/duplicate', authenticateToken, loadAsset, ensureTeamAccess(EDIT_ROLES), asyncHandler(async (req, res) => {
  const now = new Date().toISOString();
  const duplicate = {
    ...req.asset,
    id: generateId('asset'),
    name: `${req.asset.name} (Copy)`,
    status: 'draft',
    review: { status: 'unsubmitted', notes: [] },
    schedules: [],
    createdAt: now,
    updatedAt: now,
    version: 1
  };

  assetsStore.set(duplicate.id, duplicate);

  res.status(201).json({ success: true, asset: duplicate });
}));

router.post('/:id/archive', authenticateToken, loadAsset, ensureTeamAccess(EDIT_ROLES), asyncHandler(async (req, res) => {
  req.asset.status = 'archived';
  req.asset.archivedAt = new Date().toISOString();
  req.asset.updatedAt = req.asset.archivedAt;

  res.json({ success: true, asset: req.asset });
}));

// ---------------------------------------------
// Scheduling & availability
// ---------------------------------------------

router.post('/:id/schedule', authenticateToken, loadAsset, ensureTeamAccess(SCHEDULER_ROLES), asyncHandler(async (req, res) => {
  const { start, end } = req.body;

  if (!start || !end) {
    throw ApiError.badRequest('Both start and end are required');
  }

  const startDate = parseDate(start, 'start');
  const endDate = parseDate(end, 'end');

  if (startDate >= endDate) {
    throw ApiError.badRequest('start must be before end');
  }

  const conflicts = findConflicts(req.asset.teamId, startDate, endDate, req.asset.id);
  if (conflicts.length > 0) {
    return res.status(409).json({
      success: false,
      conflict: true,
      message: 'Schedule conflicts detected',
      conflicts
    });
  }

  const slot = {
    id: generateId('slot'),
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    status: 'scheduled',
    reservedBy: req.user.userId,
    createdAt: new Date().toISOString()
  };

  const schedule = ensureAssetSchedule(req.asset.id);
  schedule.push(slot);
  req.asset.schedules = schedule;
  req.asset.status = 'scheduled';
  req.asset.updatedAt = new Date().toISOString();

  res.json({ success: true, asset: req.asset, slot });
}));

router.post('/schedule/availability', authenticateToken, ensureTeamAccess(SCHEDULER_ROLES), asyncHandler(async (req, res) => {
  const { start, end, campaignId, assetId } = req.body;

  if (!start || !end) {
    throw ApiError.badRequest('Both start and end are required');
  }

  const startDate = parseDate(start, 'start');
  const endDate = parseDate(end, 'end');

  const conflicts = findConflicts(req.teamAccess.teamId, startDate, endDate, assetId);

  const suggestionOffset = conflicts.length > 0 ? 30 * 60 * 1000 : 0;
  const suggestionStart = new Date(endDate.getTime() + suggestionOffset).toISOString();
  const suggestionEnd = new Date(endDate.getTime() + suggestionOffset + (endDate - startDate)).toISOString();

  res.json({
    success: true,
    available: conflicts.length === 0,
    conflicts,
    campaignId: campaignId || null,
    suggestion: conflicts.length === 0 ? null : { start: suggestionStart, end: suggestionEnd }
  });
}));

router.post('/:id/status', authenticateToken, loadAsset, ensureTeamAccess(SCHEDULER_ROLES), asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['scheduled', 'live'];

  if (!allowedStatuses.includes(status)) {
    throw ApiError.badRequest('Status must be scheduled or live');
  }

  if (status === 'live' && (!req.asset.schedules || req.asset.schedules.length === 0)) {
    throw ApiError.badRequest('Asset must have a scheduled slot before going live');
  }

  req.asset.status = status;
  req.asset.updatedAt = new Date().toISOString();

  res.json({ success: true, asset: req.asset });
}));

// ---------------------------------------------
// Metrics & performance snapshots
// ---------------------------------------------

router.get('/campaigns/:campaignId/metrics', authenticateToken, ensureTeamAccess(), asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const window = req.query.window || '7d';

  const assets = Array.from(assetsStore.values()).filter((asset) =>
    asset.teamId === req.teamAccess.teamId && asset.campaignId === campaignId
  );

  const aggregateSeed = `${campaignId}-${assets.length || 'empty'}`;
  const metrics = generateMockMetrics(aggregateSeed, window);

  res.json({
    success: true,
    campaignId,
    window,
    assets: assets.map((asset) => asset.id),
    metrics
  });
}));

router.get('/:id/metrics', authenticateToken, loadAsset, ensureTeamAccess(), asyncHandler(async (req, res) => {
  const window = req.query.window || '7d';
  const metrics = generateMockMetrics(req.asset.id, window);

  res.json({
    success: true,
    assetId: req.asset.id,
    window,
    metrics
  });
}));

module.exports = router;
