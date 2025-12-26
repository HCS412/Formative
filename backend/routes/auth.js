// Authentication Routes - Register, Login, 2FA
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const pool = require('../config/database');
const { EFFECTIVE_JWT_SECRET } = require('../config/security');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  validatePasswordStrength,
  sanitizeInput,
  logAuditEvent,
  getClientIP,
  recordFailedLogin,
  isAccountLocked,
  clearFailedLogins,
  getRemainingLockoutTime,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION
} = require('../utils/security');

// ============================================
// 2FA Helper Functions
// ============================================

// Generate a base32 secret for 2FA
function generateSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)];
  }
  return secret;
}

// Generate TOTP code
function generateTOTP(secret, timeStep = 30) {
  const time = Math.floor(Date.now() / 1000 / timeStep);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(time));
  
  // Decode base32 secret
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const char of secret.toUpperCase()) {
    const val = base32Chars.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const keyBuffer = Buffer.from(bits.match(/.{8}/g).map(b => parseInt(b, 2)));
  
  const hmac = crypto.createHmac('sha1', keyBuffer);
  hmac.update(timeBuffer);
  const hash = hmac.digest();
  
  const offset = hash[hash.length - 1] & 0xf;
  const code = ((hash[offset] & 0x7f) << 24 |
    (hash[offset + 1] & 0xff) << 16 |
    (hash[offset + 2] & 0xff) << 8 |
    (hash[offset + 3] & 0xff)) % 1000000;
  
  return code.toString().padStart(6, '0');
}

// Verify TOTP code (check current and previous time step for clock drift)
function verifyTOTP(secret, code) {
  const current = generateTOTP(secret);
  const previous = generateTOTP(secret, 30);
  return code === current || code === previous;
}

// ============================================
// AUTH ENDPOINTS
// ============================================

// User Registration
router.post('/register', authLimiter, asyncHandler(async (req, res) => {
  const clientIP = getClientIP(req);
  
  const { name, email, password, userType } = req.body;

  if (!name || !email || !password || !userType) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({ 
      error: 'Password does not meet security requirements',
      requirements: passwordValidation.errors
    });
  }

  // Validate user type
  const validUserTypes = ['influencer', 'brand', 'freelancer'];
  if (!validUserTypes.includes(userType.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid user type' });
  }

  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    await logAuditEvent(pool, 'REGISTER_DUPLICATE_EMAIL', null, { email }, clientIP);
    return res.status(400).json({ error: 'User already exists with this email' });
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash, user_type) VALUES ($1, $2, $3, $4) RETURNING id, name, email, user_type, created_at',
    [sanitizeInput(name), email.toLowerCase(), passwordHash, userType.toLowerCase()]
  );

  const user = result.rows[0];

  // Create default user settings
  await pool.query(
    'INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT DO NOTHING',
    [user.id]
  );

  const token = jwt.sign(
    { userId: user.id, email: user.email, userType: user.user_type },
    EFFECTIVE_JWT_SECRET,
    { expiresIn: '7d' }
  );

  await logAuditEvent(pool, 'USER_REGISTERED', user.id, { email: user.email, userType: user.user_type }, clientIP);
  console.log(`✅ New user registered: ${email} (${userType})`);

  res.status(201).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.user_type,
      createdAt: user.created_at
    },
    token
  });
}));

// User Login
router.post('/login', authLimiter, asyncHandler(async (req, res) => {
  const clientIP = getClientIP(req);
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if account is locked (in-memory check for quick response)
  if (isAccountLocked(email)) {
    const remainingMinutes = getRemainingLockoutTime(email);
    await logAuditEvent(pool, 'LOGIN_BLOCKED_LOCKOUT', null, { email, remainingMinutes }, clientIP);
    return res.status(423).json({ 
      error: `Account temporarily locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.`,
      lockedFor: remainingMinutes
    });
  }

  const result = await pool.query(
    'SELECT id, name, email, password_hash, user_type, profile_data, two_factor_enabled, locked_until FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    recordFailedLogin(email);
    await logAuditEvent(pool, 'LOGIN_FAILED_UNKNOWN_USER', null, { email }, clientIP);
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const user = result.rows[0];

  // Check database-level lockout
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    const remainingMinutes = Math.ceil((new Date(user.locked_until) - new Date()) / 1000 / 60);
    await logAuditEvent(pool, 'LOGIN_BLOCKED_DB_LOCKOUT', user.id, { email }, clientIP);
    return res.status(423).json({ 
      error: `Account temporarily locked. Try again in ${remainingMinutes} minutes.`,
      lockedFor: remainingMinutes
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    const attempts = recordFailedLogin(email);
    
    await pool.query(
      'UPDATE users SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1 WHERE id = $1',
      [user.id]
    );
    
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCKOUT_DURATION);
      await pool.query(
        'UPDATE users SET locked_until = $1 WHERE id = $2',
        [lockUntil, user.id]
      );
      await logAuditEvent(pool, 'ACCOUNT_LOCKED', user.id, { email, attempts }, clientIP);
      return res.status(423).json({ 
        error: `Account locked due to ${MAX_LOGIN_ATTEMPTS} failed attempts. Try again in 15 minutes.`,
        lockedFor: 15
      });
    }
    
    await logAuditEvent(pool, 'LOGIN_FAILED_WRONG_PASSWORD', user.id, { email, attempts }, clientIP);
    return res.status(401).json({ 
      error: 'Invalid email or password',
      attemptsRemaining: MAX_LOGIN_ATTEMPTS - attempts
    });
  }

  // Successful login - clear lockout
  clearFailedLogins(email);
  await pool.query(
    'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = CURRENT_TIMESTAMP, last_login_ip = $1 WHERE id = $2',
    [clientIP, user.id]
  );

  // Check if 2FA is enabled
  if (user.two_factor_enabled) {
    await logAuditEvent(pool, 'LOGIN_2FA_REQUIRED', user.id, { email }, clientIP);
    return res.json({
      requires2FA: true,
      userId: user.id
    });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, userType: user.user_type },
    EFFECTIVE_JWT_SECRET,
    { expiresIn: '7d' }
  );

  await logAuditEvent(pool, 'LOGIN_SUCCESS', user.id, { email }, clientIP);
  console.log(`✅ User logged in: ${email}`);

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.user_type,
      profileData: user.profile_data
    },
    token
  });
}));

// ============================================
// TWO-FACTOR AUTHENTICATION
// ============================================

// Setup 2FA
router.post('/2fa/setup', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  // Ensure 2FA columns exist
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255)`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE`);
  } catch (alterError) {
    console.log('2FA columns may already exist:', alterError.message);
  }
  
  // Generate secret
  const secret = generateSecret();
  
  // Store temporarily (not enabled yet)
  await pool.query(
    `UPDATE users SET two_factor_secret = $1, two_factor_enabled = false WHERE id = $2`,
    [secret, userId]
  );
  
  // Get user email for QR code
  const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
  const email = userResult.rows[0]?.email || 'user';
  
  // Generate QR code URL
  const issuer = 'Formative';
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
  const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;
  
  res.json({
    success: true,
    qrCode,
    secret // Kept for manual entry
  });
}));

// Verify and enable 2FA
router.post('/2fa/verify', authenticateToken, asyncHandler(async (req, res) => {
  const clientIP = getClientIP(req);
  const userId = req.user.userId;
  const { code } = req.body;
  
  const result = await pool.query(
    'SELECT two_factor_secret, email FROM users WHERE id = $1',
    [userId]
  );
  
  if (!result.rows[0]?.two_factor_secret) {
    return res.status(400).json({ error: 'Please setup 2FA first' });
  }
  
  const secret = result.rows[0].two_factor_secret;
  
  if (!verifyTOTP(secret, code)) {
    await logAuditEvent(pool, '2FA_ENABLE_FAILED', userId, { reason: 'invalid_code' }, clientIP);
    return res.status(400).json({ error: 'Invalid verification code' });
  }
  
  await pool.query(
    'UPDATE users SET two_factor_enabled = true WHERE id = $1',
    [userId]
  );
  
  await logAuditEvent(pool, '2FA_ENABLED', userId, { email: result.rows[0].email }, clientIP);
  res.json({ success: true });
}));

// Disable 2FA
router.post('/2fa/disable', authenticateToken, asyncHandler(async (req, res) => {
  const clientIP = getClientIP(req);
  const userId = req.user.userId;
  const { code } = req.body;
  
  const result = await pool.query(
    'SELECT two_factor_secret, email FROM users WHERE id = $1',
    [userId]
  );
  
  if (!result.rows[0]?.two_factor_secret) {
    return res.status(400).json({ error: '2FA is not enabled' });
  }
  
  if (!verifyTOTP(result.rows[0].two_factor_secret, code)) {
    await logAuditEvent(pool, '2FA_DISABLE_FAILED', userId, { reason: 'invalid_code' }, clientIP);
    return res.status(400).json({ error: 'Invalid verification code' });
  }
  
  await pool.query(
    'UPDATE users SET two_factor_enabled = false, two_factor_secret = NULL WHERE id = $1',
    [userId]
  );
  
  await logAuditEvent(pool, '2FA_DISABLED', userId, { email: result.rows[0].email }, clientIP);
  res.json({ success: true });
}));

// 2FA Login verification
router.post('/2fa/login', authLimiter, asyncHandler(async (req, res) => {
  const clientIP = getClientIP(req);
  const { userId, code, rememberMe } = req.body;
  
  const result = await pool.query(
    'SELECT id, name, email, user_type, two_factor_secret, profile_data FROM users WHERE id = $1 AND two_factor_enabled = true',
    [userId]
  );
  
  if (result.rows.length === 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  
  const user = result.rows[0];
  
  if (!verifyTOTP(user.two_factor_secret, code)) {
    await logAuditEvent(pool, '2FA_LOGIN_FAILED', user.id, { email: user.email, reason: 'invalid_code' }, clientIP);
    return res.status(400).json({ error: 'Invalid verification code' });
  }
  
  await pool.query(
    'UPDATE users SET last_login_at = CURRENT_TIMESTAMP, last_login_ip = $1 WHERE id = $2',
    [clientIP, user.id]
  );
  
  const token = jwt.sign(
    { userId: user.id, email: user.email, userType: user.user_type },
    EFFECTIVE_JWT_SECRET,
    { expiresIn: rememberMe ? '30d' : '1d' }
  );
  
  await logAuditEvent(pool, 'LOGIN_SUCCESS_2FA', user.id, { email: user.email }, clientIP);
  
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      user_type: user.user_type,
      profileData: user.profile_data
    },
    token
  });
}));

// Get user permissions
router.get('/permissions', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  // Get user's roles
  const rolesResult = await pool.query(`
    SELECT r.id, r.name, r.description
    FROM roles r
    JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = $1
  `, [userId]);
  
  // Get user's permissions through roles
  const permissionsResult = await pool.query(`
    SELECT DISTINCT p.id, p.name, p.description, p.resource, p.action
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN user_roles ur ON rp.role_id = ur.role_id
    WHERE ur.user_id = $1
  `, [userId]);
  
  // Get user's team memberships
  const teamsResult = await pool.query(`
    SELECT t.id, t.name, tm.role as team_role
    FROM teams t
    JOIN team_members tm ON t.id = tm.team_id
    WHERE tm.user_id = $1
  `, [userId]);
  
  res.json({
    success: true,
    roles: rolesResult.rows,
    permissions: permissionsResult.rows,
    teams: teamsResult.rows
  });
}));

module.exports = router;
