// Task Management Routes - Motion-like scheduling
const express = require('express');
const router = express.Router();

const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');
const { body, param, query, validationResult } = require('express-validator');

// ============================================
// TASK STATUS & PRIORITY CONSTANTS
// ============================================

const TASK_STATUS = {
  INBOX: 'inbox',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
};

const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

const validateTask = [
  body('title').trim().isLength({ min: 1, max: 500 }).withMessage('Title is required (max 500 chars)'),
  body('description').optional().isString(),
  body('status').optional().isIn(Object.values(TASK_STATUS)),
  body('priority').optional().isIn(Object.values(TASK_PRIORITY)),
  body('projectId').optional({ nullable: true }).isInt(),
  body('dueDate').optional({ nullable: true }).isISO8601(),
  body('dueTime').optional({ nullable: true }).matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/),
  body('scheduledStart').optional({ nullable: true }).isISO8601(),
  body('scheduledEnd').optional({ nullable: true }).isISO8601(),
  body('estimatedMinutes').optional({ nullable: true }).isInt({ min: 1, max: 10080 }),
  body('labels').optional().isArray()
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Log task activity
async function logTaskActivity(taskId, userId, action, details = {}) {
  try {
    await pool.query(`
      INSERT INTO task_activity_log (task_id, user_id, action, details)
      VALUES ($1, $2, $3, $4)
    `, [taskId, userId, action, JSON.stringify(details)]);
  } catch (error) {
    console.error('Failed to log task activity:', error);
  }
}

// ============================================
// TASK ENDPOINTS
// ============================================

// Get all tasks for user
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    status,
    projectId,
    priority,
    startDate,
    endDate,
    search,
    limit = 100,
    offset = 0
  } = req.query;

  let queryStr = `
    SELECT
      t.*,
      p.name as project_name,
      p.color as project_color,
      (SELECT COUNT(*) FROM task_comments WHERE task_id = t.id) as comment_count,
      (SELECT COUNT(*) FROM task_attachments WHERE task_id = t.id) as attachment_count
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.user_id = $1
  `;
  const params = [userId];
  let paramIndex = 2;

  if (status) {
    queryStr += ` AND t.status = $${paramIndex++}`;
    params.push(status);
  }

  if (projectId) {
    if (projectId === 'null' || projectId === 'inbox') {
      queryStr += ` AND t.project_id IS NULL`;
    } else {
      queryStr += ` AND t.project_id = $${paramIndex++}`;
      params.push(parseInt(projectId));
    }
  }

  if (priority) {
    queryStr += ` AND t.priority = $${paramIndex++}`;
    params.push(priority);
  }

  if (startDate) {
    queryStr += ` AND (t.due_date >= $${paramIndex++} OR t.scheduled_start >= $${paramIndex - 1}::timestamp)`;
    params.push(startDate);
  }

  if (endDate) {
    queryStr += ` AND (t.due_date <= $${paramIndex++} OR t.scheduled_end <= $${paramIndex - 1}::timestamp)`;
    params.push(endDate);
  }

  if (search) {
    queryStr += ` AND (t.title ILIKE $${paramIndex++} OR t.description ILIKE $${paramIndex - 1})`;
    params.push(`%${search}%`);
  }

  queryStr += ` ORDER BY
    CASE WHEN t.status = 'done' THEN 1 ELSE 0 END,
    CASE t.priority
      WHEN 'urgent' THEN 0
      WHEN 'high' THEN 1
      WHEN 'medium' THEN 2
      ELSE 3
    END,
    t.position,
    t.due_date NULLS LAST,
    t.created_at DESC
  `;

  queryStr += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  params.push(parseInt(limit), parseInt(offset));

  const result = await pool.query(queryStr, params);

  // Get counts by status
  const countsResult = await pool.query(`
    SELECT status, COUNT(*) as count
    FROM tasks
    WHERE user_id = $1
    GROUP BY status
  `, [userId]);

  const counts = countsResult.rows.reduce((acc, row) => {
    acc[row.status] = parseInt(row.count);
    return acc;
  }, { inbox: 0, todo: 0, in_progress: 0, done: 0 });

  res.json({
    success: true,
    tasks: result.rows,
    counts,
    total: result.rows.length
  });
}));

// Get tasks for calendar view
router.get('/calendar', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { startDate, endDate, includeUnscheduled = false } = req.query;

  if (!startDate || !endDate) {
    throw new ApiError('Start date and end date are required', 400);
  }

  let queryStr = `
    SELECT
      t.*,
      p.name as project_name,
      p.color as project_color
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.user_id = $1
      AND t.status != 'done'
  `;
  const params = [userId, startDate, endDate];

  if (includeUnscheduled === 'true') {
    queryStr += `
      AND (
        (t.scheduled_start IS NOT NULL AND t.scheduled_start BETWEEN $2 AND $3)
        OR (t.due_date IS NOT NULL AND t.due_date BETWEEN $2::date AND $3::date)
        OR (t.scheduled_start IS NULL AND t.due_date IS NULL)
      )
    `;
  } else {
    queryStr += `
      AND (
        (t.scheduled_start IS NOT NULL AND t.scheduled_start BETWEEN $2 AND $3)
        OR (t.due_date IS NOT NULL AND t.due_date BETWEEN $2::date AND $3::date)
      )
    `;
  }

  queryStr += ` ORDER BY t.scheduled_start NULLS LAST, t.due_date NULLS LAST`;

  const result = await pool.query(queryStr, params);

  res.json({
    success: true,
    tasks: result.rows
  });
}));

// Create task
router.post('/', authenticateToken, validateTask, handleValidationErrors, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    title,
    description,
    status = 'inbox',
    priority = 'medium',
    projectId,
    dueDate,
    dueTime,
    scheduledStart,
    scheduledEnd,
    estimatedMinutes,
    labels = []
  } = req.body;

  // Get max position for the status column
  const posResult = await pool.query(`
    SELECT COALESCE(MAX(position), 0) + 1 as next_position
    FROM tasks WHERE user_id = $1 AND status = $2
  `, [userId, status]);
  const position = posResult.rows[0].next_position;

  const result = await pool.query(`
    INSERT INTO tasks (
      user_id, project_id, title, description, status, priority,
      due_date, due_time, scheduled_start, scheduled_end,
      estimated_minutes, labels, position
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `, [
    userId,
    projectId || null,
    title,
    description || null,
    status,
    priority,
    dueDate || null,
    dueTime || null,
    scheduledStart || null,
    scheduledEnd || null,
    estimatedMinutes || null,
    JSON.stringify(labels),
    position
  ]);

  const task = result.rows[0];

  // Log activity
  await logTaskActivity(task.id, userId, 'created', { title, status, priority });

  // Get project info if attached
  if (task.project_id) {
    const projectResult = await pool.query(
      'SELECT name, color FROM projects WHERE id = $1',
      [task.project_id]
    );
    if (projectResult.rows.length > 0) {
      task.project_name = projectResult.rows[0].name;
      task.project_color = projectResult.rows[0].color;
    }
  }

  res.status(201).json({
    success: true,
    task
  });
}));

// Get single task with details
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);

  const taskResult = await pool.query(`
    SELECT
      t.*,
      p.name as project_name,
      p.color as project_color
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = $1 AND t.user_id = $2
  `, [taskId, userId]);

  if (taskResult.rows.length === 0) {
    throw new ApiError('Task not found', 404);
  }

  const task = taskResult.rows[0];

  // Get comments
  const commentsResult = await pool.query(`
    SELECT tc.*, u.name as user_name, u.avatar_url
    FROM task_comments tc
    JOIN users u ON tc.user_id = u.id
    WHERE tc.task_id = $1
    ORDER BY tc.created_at ASC
  `, [taskId]);

  // Get attachments
  const attachmentsResult = await pool.query(`
    SELECT ta.*, u.name as uploaded_by_name
    FROM task_attachments ta
    JOIN users u ON ta.user_id = u.id
    WHERE ta.task_id = $1
    ORDER BY ta.created_at DESC
  `, [taskId]);

  // Get activity log
  const activityResult = await pool.query(`
    SELECT tal.*, u.name as user_name
    FROM task_activity_log tal
    JOIN users u ON tal.user_id = u.id
    WHERE tal.task_id = $1
    ORDER BY tal.created_at DESC
    LIMIT 50
  `, [taskId]);

  res.json({
    success: true,
    task: {
      ...task,
      comments: commentsResult.rows,
      attachments: attachmentsResult.rows,
      activity: activityResult.rows
    }
  });
}));

// Update task
router.put('/:id', authenticateToken, validateTask, handleValidationErrors, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);
  const updates = req.body;

  // Verify ownership
  const existing = await pool.query(
    'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
    [taskId, userId]
  );

  if (existing.rows.length === 0) {
    throw new ApiError('Task not found', 404);
  }

  const oldTask = existing.rows[0];

  const allowedFields = [
    'title', 'description', 'status', 'priority', 'project_id',
    'due_date', 'due_time', 'scheduled_start', 'scheduled_end',
    'estimated_minutes', 'labels', 'position'
  ];

  const setClause = [];
  const values = [taskId, userId];
  let paramIndex = 3;

  // Map camelCase to snake_case
  const fieldMap = {
    projectId: 'project_id',
    dueDate: 'due_date',
    dueTime: 'due_time',
    scheduledStart: 'scheduled_start',
    scheduledEnd: 'scheduled_end',
    estimatedMinutes: 'estimated_minutes'
  };

  const changes = {};

  for (const [key, value] of Object.entries(updates)) {
    const dbField = fieldMap[key] || key;
    if (allowedFields.includes(dbField)) {
      setClause.push(`${dbField} = $${paramIndex++}`);
      if (dbField === 'labels') {
        values.push(JSON.stringify(value));
      } else {
        values.push(value === undefined ? null : value);
      }
      changes[dbField] = value;
    }
  }

  // Handle completed_at
  if (updates.status === 'done' && oldTask.status !== 'done') {
    setClause.push(`completed_at = CURRENT_TIMESTAMP`);
    changes.completed_at = new Date().toISOString();
  } else if (updates.status && updates.status !== 'done' && oldTask.status === 'done') {
    setClause.push(`completed_at = NULL`);
    changes.completed_at = null;
  }

  if (setClause.length === 0) {
    throw new ApiError('No valid fields to update', 400);
  }

  setClause.push('updated_at = CURRENT_TIMESTAMP');

  const result = await pool.query(`
    UPDATE tasks
    SET ${setClause.join(', ')}
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `, values);

  const task = result.rows[0];

  // Log activity
  await logTaskActivity(taskId, userId, 'updated', changes);

  // Get project info
  if (task.project_id) {
    const projectResult = await pool.query(
      'SELECT name, color FROM projects WHERE id = $1',
      [task.project_id]
    );
    if (projectResult.rows.length > 0) {
      task.project_name = projectResult.rows[0].name;
      task.project_color = projectResult.rows[0].color;
    }
  }

  res.json({
    success: true,
    task
  });
}));

// Quick status update (for Kanban drag)
router.patch('/:id/status', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);
  const { status, position } = req.body;

  if (!status || !Object.values(TASK_STATUS).includes(status)) {
    throw new ApiError('Valid status is required', 400);
  }

  // Verify ownership and get old status
  const existing = await pool.query(
    'SELECT status FROM tasks WHERE id = $1 AND user_id = $2',
    [taskId, userId]
  );

  if (existing.rows.length === 0) {
    throw new ApiError('Task not found', 404);
  }

  const oldStatus = existing.rows[0].status;

  let queryStr = `
    UPDATE tasks
    SET status = $3, updated_at = CURRENT_TIMESTAMP
  `;
  const params = [taskId, userId, status];
  let paramIndex = 4;

  // Handle completed_at
  if (status === 'done' && oldStatus !== 'done') {
    queryStr += `, completed_at = CURRENT_TIMESTAMP`;
  } else if (status !== 'done' && oldStatus === 'done') {
    queryStr += `, completed_at = NULL`;
  }

  if (position !== undefined) {
    queryStr += `, position = $${paramIndex++}`;
    params.push(position);
  }

  queryStr += ` WHERE id = $1 AND user_id = $2 RETURNING *`;

  const result = await pool.query(queryStr, params);

  // Log activity
  await logTaskActivity(taskId, userId, 'status_changed', {
    from: oldStatus,
    to: status
  });

  res.json({
    success: true,
    task: result.rows[0]
  });
}));

// Schedule task (for calendar drag)
router.patch('/:id/schedule', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);
  const { scheduledStart, scheduledEnd, dueDate } = req.body;

  // Verify ownership
  const existing = await pool.query(
    'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
    [taskId, userId]
  );

  if (existing.rows.length === 0) {
    throw new ApiError('Task not found', 404);
  }

  const setClause = ['updated_at = CURRENT_TIMESTAMP'];
  const values = [taskId, userId];
  let paramIndex = 3;

  if (scheduledStart !== undefined) {
    setClause.push(`scheduled_start = $${paramIndex++}`);
    values.push(scheduledStart || null);
  }

  if (scheduledEnd !== undefined) {
    setClause.push(`scheduled_end = $${paramIndex++}`);
    values.push(scheduledEnd || null);
  }

  if (dueDate !== undefined) {
    setClause.push(`due_date = $${paramIndex++}`);
    values.push(dueDate || null);
  }

  const result = await pool.query(`
    UPDATE tasks
    SET ${setClause.join(', ')}
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `, values);

  // Log activity
  await logTaskActivity(taskId, userId, 'rescheduled', {
    scheduledStart,
    scheduledEnd,
    dueDate
  });

  res.json({
    success: true,
    task: result.rows[0]
  });
}));

// Reorder tasks (bulk position update)
router.post('/reorder', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { tasks } = req.body;

  if (!Array.isArray(tasks)) {
    throw new ApiError('Tasks array is required', 400);
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const task of tasks) {
      await client.query(`
        UPDATE tasks
        SET position = $3, status = COALESCE($4, status), updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND user_id = $2
      `, [task.id, userId, task.position, task.status || null]);
    }

    await client.query('COMMIT');

    res.json({ success: true, message: 'Tasks reordered' });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

// Delete task
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);

  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id, title',
    [taskId, userId]
  );

  if (result.rows.length === 0) {
    throw new ApiError('Task not found', 404);
  }

  res.json({
    success: true,
    message: 'Task deleted',
    deletedTask: result.rows[0]
  });
}));

// ============================================
// TASK COMMENTS
// ============================================

// Add comment
router.post('/:id/comments', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);
  const { content } = req.body;

  if (!content || !content.trim()) {
    throw new ApiError('Comment content is required', 400);
  }

  // Verify task ownership
  const taskResult = await pool.query(
    'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
    [taskId, userId]
  );

  if (taskResult.rows.length === 0) {
    throw new ApiError('Task not found', 404);
  }

  const result = await pool.query(`
    INSERT INTO task_comments (task_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [taskId, userId, content.trim()]);

  // Get user info for response
  const userResult = await pool.query(
    'SELECT name, avatar_url FROM users WHERE id = $1',
    [userId]
  );

  const comment = {
    ...result.rows[0],
    user_name: userResult.rows[0]?.name,
    avatar_url: userResult.rows[0]?.avatar_url
  };

  // Log activity
  await logTaskActivity(taskId, userId, 'comment_added', {
    commentId: comment.id,
    preview: content.substring(0, 50)
  });

  res.status(201).json({
    success: true,
    comment
  });
}));

// Get comments for task
router.get('/:id/comments', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const taskId = parseInt(req.params.id);

  // Verify task ownership
  const taskResult = await pool.query(
    'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
    [taskId, userId]
  );

  if (taskResult.rows.length === 0) {
    throw new ApiError('Task not found', 404);
  }

  const result = await pool.query(`
    SELECT tc.*, u.name as user_name, u.avatar_url
    FROM task_comments tc
    JOIN users u ON tc.user_id = u.id
    WHERE tc.task_id = $1
    ORDER BY tc.created_at ASC
  `, [taskId]);

  res.json({
    success: true,
    comments: result.rows
  });
}));

// Delete comment
router.delete('/:taskId/comments/:commentId', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { taskId, commentId } = req.params;

  // Verify comment ownership
  const result = await pool.query(`
    DELETE FROM task_comments
    WHERE id = $1 AND task_id = $2 AND user_id = $3
    RETURNING id
  `, [parseInt(commentId), parseInt(taskId), userId]);

  if (result.rows.length === 0) {
    throw new ApiError('Comment not found or not authorized', 404);
  }

  res.json({
    success: true,
    message: 'Comment deleted'
  });
}));

// ============================================
// EXPORTS
// ============================================

module.exports = router;
module.exports.TASK_STATUS = TASK_STATUS;
module.exports.TASK_PRIORITY = TASK_PRIORITY;
module.exports.logTaskActivity = logTaskActivity;
