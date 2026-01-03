// Security Middleware and Utilities
const crypto = require('crypto');

/**
 * Request ID middleware
 * Adds a unique ID to each request for tracking and debugging
 */
const requestIdMiddleware = (req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};

/**
 * Get client IP address handling proxies
 */
const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.socket?.remoteAddress ||
         'unknown';
};

/**
 * Secure logging - sanitizes sensitive data
 * Use this instead of directly logging user data
 */
const secureLog = (level, message, data = {}) => {
  const sanitized = { ...data };

  // Remove or mask sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'accessToken', 'refreshToken', 'apiKey'];
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  // Mask email addresses
  if (sanitized.email) {
    const [local, domain] = sanitized.email.split('@');
    if (local && domain) {
      sanitized.email = `${local.charAt(0)}***@${domain}`;
    }
  }

  // Log with timestamp and request ID
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...sanitized
  };

  if (level === 'error') {
    console.error(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
};

/**
 * Audit event logger with secure logging
 */
const createAuditLogger = (pool) => {
  return async (eventType, userId, details, req) => {
    const ipAddress = req ? getClientIP(req) : 'unknown';
    const userAgent = req?.headers['user-agent'] || 'unknown';
    const requestId = req?.id || 'unknown';

    try {
      await pool.query(
        `INSERT INTO audit_logs (event_type, user_id, details, ip_address, user_agent, created_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
        [eventType, userId, JSON.stringify({ ...details, requestId }), ipAddress, userAgent]
      );

      // Secure log (no email in console)
      secureLog('info', `Audit: ${eventType}`, {
        userId,
        requestId,
        ip: ipAddress
      });
    } catch (error) {
      secureLog('error', 'Failed to log audit event', {
        eventType,
        error: error.message
      });
    }
  };
};

/**
 * Input sanitization - removes XSS vectors
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Recursively sanitize object properties
 */
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Body sanitization middleware
 */
const sanitizeBodyMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

/**
 * Password strength validation
 */
const validatePasswordStrength = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters long');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain at least one special character');
  return { isValid: errors.length === 0, errors };
};

/**
 * Account lockout tracking (in-memory, use Redis in production)
 */
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const recordFailedLogin = (email) => {
  const key = email.toLowerCase();
  const attempts = loginAttempts.get(key) || { count: 0, firstAttempt: Date.now() };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(key, attempts);
  return attempts.count;
};

const isAccountLocked = (email) => {
  const key = email.toLowerCase();
  const attempts = loginAttempts.get(key);
  if (!attempts) return false;

  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeSinceLast = Date.now() - attempts.lastAttempt;
    if (timeSinceLast > LOCKOUT_DURATION) {
      loginAttempts.delete(key);
      return false;
    }
    return true;
  }
  return false;
};

const clearFailedLogins = (email) => {
  loginAttempts.delete(email.toLowerCase());
};

const getRemainingLockoutTime = (email) => {
  const key = email.toLowerCase();
  const attempts = loginAttempts.get(key);
  if (!attempts) return 0;
  const remaining = LOCKOUT_DURATION - (Date.now() - attempts.lastAttempt);
  return Math.max(0, Math.ceil(remaining / 1000 / 60));
};

/**
 * CSRF token generation and validation
 */
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const validateCSRFToken = (req, res, next) => {
  // Skip for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip for API endpoints that use JWT (mobile apps, etc.)
  // CSRF is mainly for browser-based sessions
  if (req.headers['authorization']) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

/**
 * Additional security headers middleware
 */
const additionalSecurityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  next();
};

/**
 * Ownership verification helper
 * Use in routes to verify resource ownership
 */
const verifyOwnership = async (pool, table, idColumn, resourceId, userId, ownerColumn = 'user_id') => {
  const result = await pool.query(
    `SELECT ${ownerColumn} FROM ${table} WHERE ${idColumn} = $1`,
    [resourceId]
  );

  if (result.rows.length === 0) {
    return { exists: false, isOwner: false };
  }

  return {
    exists: true,
    isOwner: result.rows[0][ownerColumn] === userId,
    ownerId: result.rows[0][ownerColumn]
  };
};

module.exports = {
  requestIdMiddleware,
  getClientIP,
  secureLog,
  createAuditLogger,
  sanitizeInput,
  sanitizeObject,
  sanitizeBodyMiddleware,
  validatePasswordStrength,
  recordFailedLogin,
  isAccountLocked,
  clearFailedLogins,
  getRemainingLockoutTime,
  generateCSRFToken,
  validateCSRFToken,
  additionalSecurityHeaders,
  verifyOwnership,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION
};
