// Security configuration - Environment validation and encryption
const crypto = require('crypto');

// ============================================
// Environment Validation
// ============================================

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
  const missing = requiredEnvVars.filter(v => !process.env[v]);
  if (missing.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

// JWT Secret - NO FALLBACK in production
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (isProduction) {
    console.error('FATAL: JWT_SECRET environment variable is required');
    process.exit(1);
  } else {
    console.warn('WARNING: JWT_SECRET not set, using insecure default for development only');
  }
}
const EFFECTIVE_JWT_SECRET = JWT_SECRET || 'dev-only-insecure-secret-do-not-use-in-production';

// ============================================
// Token Encryption for OAuth
// ============================================

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

// Check if encryption is available
const encryptionAvailable = ENCRYPTION_KEY && ENCRYPTION_KEY.length === 64;

if (isProduction && !encryptionAvailable) {
  console.warn('WARNING: ENCRYPTION_KEY not set or invalid. OAuth tokens will be stored unencrypted.');
  console.warn('         Set ENCRYPTION_KEY to a 64-character hex string for token encryption.');
}

/**
 * Encrypt sensitive data (OAuth tokens)
 * Returns format: iv:authTag:encryptedData (all hex encoded)
 */
function encryptToken(plaintext) {
  if (!encryptionAvailable || !plaintext) return plaintext;
  
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error.message);
    return plaintext; // Fallback to unencrypted on error
  }
}

/**
 * Decrypt sensitive data (OAuth tokens)
 * Handles both encrypted (iv:authTag:data) and legacy unencrypted tokens
 */
function decryptToken(ciphertext) {
  if (!ciphertext) return ciphertext;
  
  // Check if this looks like an encrypted token (iv:authTag:data format)
  const parts = ciphertext.split(':');
  if (parts.length !== 3 || !encryptionAvailable) {
    // Return as-is (either unencrypted legacy token or encryption not available)
    return ciphertext;
  }
  
  try {
    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    // If decryption fails, assume it's a legacy unencrypted token
    console.warn('Token decryption failed, treating as legacy unencrypted token');
    return ciphertext;
  }
}

module.exports = {
  isProduction,
  EFFECTIVE_JWT_SECRET,
  encryptToken,
  decryptToken,
  encryptionAvailable
};
