// Project Management Routes - For organizing tasks
const express = require('express');
const router = express.Router();

const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const { body, validationResult } = require('express-validator');

// ============================================
// PROJECT STATUS CONSTANTS
// ============================================

const PROJECT_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  COMPLETED: 'completed'
};

// Default project colors (similar to Notion/Motion)
const PROJECT_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#64748b'  // slate
];

// Default project icons
const PROJECT_ICONS = [
  'folder', 'briefcase', 'code', 'book', 'star', 'heart',
  'home', 'camera', 'music', 'film', 'shopping-cart', 'users',
  'target', 'zap', 'coffee', 'sun', 'moon', 'globe'
];

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

const validateProject = [
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name is required (max 255 chars)'),
  body('description').optional().isString(),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/),
  body('icon').optional().isString(),
  body('status').optional().isIn(Object.values(PROJECT_STATUS))
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ============================================
// PROJECT ENDPOINTS
// ============================================

// Get all projects for user
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { status, includeTaskCounts = 'true' } = req.query;

  let queryStr = `
    SELECT p.*
  `;

  if (includeTaskCounts === 'true') {
    queryStr += `,
      (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
      (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'done') as completed_tasks,
      (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'in_progress') as active_tasks
    `;
  }

  queryStr += `
    FROM projects p
    WHERE p.user_id = $1
  `;

  const params = [userId];
  let paramIndex = 2;

  if (status) {
    queryStr += ` AND p.status = $${paramIndex++}`;
    params.push(status);
  }

  queryStr += ` ORDER BY p.name ASC`;

  const result = await pool.query(queryStr, params);

  res.json({
    success: true,
    projects: result.rows,
    colors: PROJECT_COLORS,
    icons: PROJECT_ICONS
  });
}));

// Get single project with tasks
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const projectId = parseInt(req.params.id);

  const projectResult = await pool.query(`
    SELECT p.*,
      (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
      (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'done') as completed_tasks
    FROM projects p
    WHERE p.id = $1 AND p.user_id = $2
  `, [projectId, userId]);

  if (projectResult.rows.length === 0) {
    throw new ApiError('Project not found', 404);
  }

  res.json({
    success: true,
    project: projectResult.rows[0]
  });
}));

// Get tasks for a project
router.get('/:id/tasks', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const projectId = parseInt(req.params.id);
  const { status, limit = 100, offset = 0 } = req.query;

  // Verify project ownership
  const projectResult = await pool.query(
    'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
    [projectId, userId]
  );

  if (projectResult.rows.length === 0) {
    throw new ApiError('Project not found', 404);
  }

  let queryStr = `
    SELECT t.*,
      (SELECT COUNT(*) FROM task_comments WHERE task_id = t.id) as comment_count
    FROM tasks t
    WHERE t.project_id = $1 AND t.user_id = $2
  `;
  const params = [projectId, userId];
  let paramIndex = 3;

  if (status) {
    queryStr += ` AND t.status = $${paramIndex++}`;
    params.push(status);
  }

  queryStr += `
    ORDER BY
      CASE WHEN t.status = 'done' THEN 1 ELSE 0 END,
      CASE t.priority
        WHEN 'urgent' THEN 0
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        ELSE 3
      END,
      t.position,
      t.due_date NULLS LAST
    LIMIT $${paramIndex++} OFFSET $${paramIndex}
  `;
  params.push(parseInt(limit), parseInt(offset));

  const result = await pool.query(queryStr, params);

  res.json({
    success: true,
    tasks: result.rows
  });
}));

// Create project
router.post('/', authenticateToken, validateProject, handleValidationErrors, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    name,
    description,
    color = PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)],
    icon = 'folder',
    status = 'active'
  } = req.body;

  const result = await pool.query(`
    INSERT INTO projects (user_id, name, description, color, icon, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [userId, name, description || null, color, icon, status]);

  res.status(201).json({
    success: true,
    project: result.rows[0]
  });
}));

// Update project
router.put('/:id', authenticateToken, validateProject, handleValidationErrors, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const projectId = parseInt(req.params.id);
  const updates = req.body;

  // Verify ownership
  const existing = await pool.query(
    'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
    [projectId, userId]
  );

  if (existing.rows.length === 0) {
    throw new ApiError('Project not found', 404);
  }

  const allowedFields = ['name', 'description', 'color', 'icon', 'status'];
  const setClause = [];
  const values = [projectId, userId];
  let paramIndex = 3;

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      setClause.push(`${key} = $${paramIndex++}`);
      values.push(value === undefined ? null : value);
    }
  }

  if (setClause.length === 0) {
    throw new ApiError('No valid fields to update', 400);
  }

  setClause.push('updated_at = CURRENT_TIMESTAMP');

  const result = await pool.query(`
    UPDATE projects
    SET ${setClause.join(', ')}
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `, values);

  res.json({
    success: true,
    project: result.rows[0]
  });
}));

// Delete project (tasks move to inbox)
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const projectId = parseInt(req.params.id);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verify ownership
    const existing = await client.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (existing.rows.length === 0) {
      throw new ApiError('Project not found', 404);
    }

    // Move tasks to inbox (set project_id to null)
    const movedTasks = await client.query(`
      UPDATE tasks
      SET project_id = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE project_id = $1 AND user_id = $2
      RETURNING id
    `, [projectId, userId]);

    // Delete the project
    await client.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, userId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Project deleted',
      tasksMovedToInbox: movedTasks.rows.length
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

// Archive project
router.patch('/:id/archive', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const projectId = parseInt(req.params.id);

  const result = await pool.query(`
    UPDATE projects
    SET status = 'archived', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `, [projectId, userId]);

  if (result.rows.length === 0) {
    throw new ApiError('Project not found', 404);
  }

  res.json({
    success: true,
    project: result.rows[0]
  });
}));

// Unarchive project
router.patch('/:id/unarchive', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const projectId = parseInt(req.params.id);

  const result = await pool.query(`
    UPDATE projects
    SET status = 'active', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `, [projectId, userId]);

  if (result.rows.length === 0) {
    throw new ApiError('Project not found', 404);
  }

  res.json({
    success: true,
    project: result.rows[0]
  });
}));

// ============================================
// EXPORTS
// ============================================

module.exports = router;
module.exports.PROJECT_STATUS = PROJECT_STATUS;
module.exports.PROJECT_COLORS = PROJECT_COLORS;
module.exports.PROJECT_ICONS = PROJECT_ICONS;
