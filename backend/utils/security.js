// Security utility functions

// ============================================
// Account Lockout Tracking
// ============================================
const loginAttempts = new Map(); // In production, use Redis

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function recordFailedLogin(email) {
  const attempts = loginAttempts.get(email) || { count: 0, firstAttempt: Date.now() };
  attempts.count++;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(email, attempts);
  return attempts.count;
}

function isAccountLocked(email) {
  const attempts = loginAttempts.get(email);
  if (!attempts) return false;
  
  // Reset if lockout period has passed
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const timeSinceLast = Date.now() - attempts.lastAttempt;
    if (timeSinceLast > LOCKOUT_DURATION) {
      loginAttempts.delete(email);
      return false;
    }
    return true;
  }
  return false;
}

function clearFailedLogins(email) {
  loginAttempts.delete(email);
}

function getRemainingLockoutTime(email) {
  const attempts = loginAttempts.get(email);
  if (!attempts) return 0;
  const remaining = LOCKOUT_DURATION - (Date.now() - attempts.lastAttempt);
  return Math.max(0, Math.ceil(remaining / 1000 / 60)); // Return minutes
}

// ============================================
// Password Strength Validation
// ============================================
function validatePasswordStrength(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================
// Input Sanitization
// ============================================
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // Remove potential XSS vectors
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  
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
}

// ============================================
// Audit Logging
// ============================================
async function logAuditEvent(pool, eventType, userId, details, ipAddress) {
  try {
    await pool.query(`
      INSERT INTO audit_logs (event_type, user_id, details, ip_address, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    `, [eventType, userId, JSON.stringify(details), ipAddress]);
  } catch (error) {
    console.error('Failed to log audit event:', error.message);
  }
}

// Get client IP address
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
         req.headers['x-real-ip'] || 
         req.socket?.remoteAddress || 
         'unknown';
}

module.exports = {
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION,
  recordFailedLogin,
  isAccountLocked,
  clearFailedLogins,
  getRemainingLockoutTime,
  validatePasswordStrength,
  sanitizeInput,
  sanitizeObject,
  logAuditEvent,
  getClientIP
};
