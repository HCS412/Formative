// Backend API server for Formative Platform with OAuth Support
// Modular architecture with centralized error handling and comprehensive security
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Use node-fetch for Node.js < 18, native fetch for Node.js >= 18
let fetch;
try {
  fetch = globalThis.fetch || require('node-fetch');
} catch (e) {
  fetch = require('node-fetch');
}

// ============================================
// MODULAR IMPORTS
// ============================================

// Centralized error handling utilities
const { ApiError, asyncHandler, errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Rate limiters
const {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  twoFactorLimiter,
  messageLimiter,
  conversationLimiter,
  inviteLimiter,
  campaignInviteLimiter,
  checkoutLimiter,
  productLimiter,
  downloadLimiter,
  applicationLimiter,
  opportunityLimiter,
  accountModifyLimiter,
  socialConnectLimiter,
  searchLimiter
} = require('./middleware/rateLimiter');

// Input validators
const validators = require('./middleware/validators');

// Security utilities
const {
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
  additionalSecurityHeaders,
  verifyOwnership,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION
} = require('./middleware/security');

// Route modules
const assetRoutes = require('./routes/assets');
const notificationRoutes = require('./routes/notifications');

// ============================================
// DATABASE CONNECTION
// ============================================
const sslConfig = (() => {
  if (process.env.NODE_ENV !== 'production') return false;
  const rejectUnauthorized = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true';
  return { rejectUnauthorized };
})();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  secureLog('error', 'Unexpected database pool error', { error: err.message });
});

// Create audit logger with pool reference
const logAuditEvent = createAuditLogger(pool);

// ============================================
// SECURITY: JWT & Encryption
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

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && isProduction) {
  console.error('FATAL: JWT_SECRET environment variable is required');
  process.exit(1);
}
const EFFECTIVE_JWT_SECRET = JWT_SECRET || 'dev-only-insecure-secret';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const encryptionAvailable = ENCRYPTION_KEY && ENCRYPTION_KEY.length === 64;

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
    return plaintext;
  }
}

function decryptToken(ciphertext) {
  if (!ciphertext) return ciphertext;
  const parts = ciphertext.split(':');
  if (parts.length !== 3 || !encryptionAvailable) return ciphertext;
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
    console.warn('Token decryption failed, treating as legacy unencrypted token');
    return ciphertext;
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// TRUST PROXY: Required for Railway/Heroku/etc behind load balancers
// This allows express-rate-limit to correctly identify users by IP
// ============================================
if (isProduction) {
  app.set('trust proxy', 1); // Trust first proxy (Railway's load balancer)
}

// ============================================
// SECURITY: Helmet Security Headers
// ============================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Required for React
      connectSrc: ["'self'", "https:", "wss:"],
      frameSrc: ["'self'", "https://verify.walletconnect.com", "https://verify.walletconnect.org"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for some wallet connections
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Required for OAuth popups
}));

// Additional security headers (from middleware/security.js)
app.use(additionalSecurityHeaders);

// Request ID tracking for debugging and logging
app.use(requestIdMiddleware);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://formativeunites.us', 'https://www.formativeunites.us', 'https://hcs412.github.io', 'https://formative-production.up.railway.app', 'https://chic-patience-production.up.railway.app']
    : '*',
  credentials: true
}));

// Apply general rate limiting to all routes
app.use('/api/', generalLimiter);

// Parse JSON with size limit
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks

// Sanitize all incoming request bodies (from middleware/security.js)
app.use(sanitizeBodyMiddleware);

// Serve React app from dist folder (built by Vite)
const distPath = path.join(__dirname, '../dist');
const fs = require('fs');

console.log('📂 Checking dist folder at:', distPath);
if (fs.existsSync(distPath)) {
  console.log('✅ dist folder found. Contents:', fs.readdirSync(distPath));
} else {
  console.log('❌ dist folder NOT FOUND!');
}

// ONLY serve React app assets - never serve old static HTML files
if (fs.existsSync(distPath)) {
  // Serve static assets (JS, CSS, images) from dist folder
  app.use(express.static(distPath, { 
    index: false, // Don't serve index.html automatically
    setHeaders: (res, path) => {
      // Don't cache index.html
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else {
        // Cache other assets (JS, CSS, etc.)
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    }
  }));
}
// NO fallback to old static files - React app is required

// OAuth Configuration
// IMPORTANT: Set OAUTH_REDIRECT_BASE environment variable in production
const OAUTH_REDIRECT_BASE = process.env.OAUTH_REDIRECT_BASE || 'https://chic-patience-production.up.railway.app';

const OAUTH_CONFIG = {
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    userUrl: 'https://api.twitter.com/2/users/me',
    scopes: ['tweet.read', 'users.read', 'follows.read', 'offline.access'],
    redirectUri: `${OAUTH_REDIRECT_BASE}/api/oauth/twitter/callback`
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    userUrl: 'https://graph.instagram.com/me',
    scopes: ['user_profile', 'user_media'],
    redirectUri: `${OAUTH_REDIRECT_BASE}/api/oauth/instagram/callback`
  },
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_ID,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    userUrl: 'https://open.tiktokapis.com/v2/user/info/',
    scopes: ['user.info.basic', 'user.info.stats', 'video.list'],
    redirectUri: `${OAUTH_REDIRECT_BASE}/api/oauth/tiktok/callback`
  },
  youtube: {
    clientId: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/userinfo.profile'],
    redirectUri: `${OAUTH_REDIRECT_BASE}/api/oauth/youtube/callback`
  }
};

// Frontend URL for OAuth redirects (with safety check for misconfigured env var)
const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://chic-patience-production.up.railway.app').replace(/^FRONTEND_URL=/, '');

// In-memory store for OAuth state (in production, use Redis)
const oauthStates = new Map();

// ============================================
// DATABASE INITIALIZATION - COMPLETE SCHEMA
// ============================================
async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Initializing database schema...');
    
    await client.query('BEGIN');

    // 1. USERS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        user_type VARCHAR(50) NOT NULL,
        profile_data JSONB DEFAULT '{}',
        email_verified BOOLEAN DEFAULT FALSE,
        avatar_url TEXT,
        location VARCHAR(255),
        bio TEXT,
        website VARCHAR(500),
        is_public BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. SOCIAL ACCOUNTS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS social_accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        username VARCHAR(255),
        platform_user_id VARCHAR(255),
        access_token TEXT,
        refresh_token TEXT,
        token_expires_at TIMESTAMP,
        stats JSONB DEFAULT '{}',
        last_synced_at TIMESTAMP,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, platform)
      )
    `);

    // Create indexes for social_accounts
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform)
    `);
    
    // Add missing columns to social_accounts if they don't exist (for existing tables)
    const socialAccountColumns = [
      { name: 'platform_user_id', type: 'VARCHAR(255)' },
      { name: 'is_verified', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'last_synced_at', type: 'TIMESTAMP' },
      { name: 'access_token', type: 'TEXT' },
      { name: 'refresh_token', type: 'TEXT' },
      { name: 'token_expires_at', type: 'TIMESTAMP' },
      { name: 'stats', type: "JSONB DEFAULT '{}'" }
    ];
    
    for (const col of socialAccountColumns) {
      try {
        await client.query(`ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
      } catch (e) {
        // Column might already exist, ignore error
      }
    }
    
    // Add missing columns to users if they don't exist (for existing tables)
    const userColumns = [
      { name: 'avatar_url', type: 'TEXT' },
      { name: 'bio', type: 'TEXT' },
      { name: 'location', type: 'VARCHAR(255)' },
      { name: 'website', type: 'VARCHAR(500)' },
      { name: 'username', type: 'VARCHAR(50) UNIQUE' },
      { name: 'is_public', type: 'BOOLEAN DEFAULT TRUE' }
    ];
    
    for (const col of userColumns) {
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
      } catch (e) {
        // Column might already exist, ignore error
      }
    }

    // 3. OPPORTUNITIES TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS opportunities (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        industry VARCHAR(100),
        budget_range VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        views_count INTEGER DEFAULT 0,
        applications_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add missing columns to opportunities if they don't exist
    const oppColumns = [
      { name: 'budget_min', type: 'INTEGER' },
      { name: 'budget_max', type: 'INTEGER' },
      { name: 'requirements', type: "JSONB DEFAULT '[]'" },
      { name: 'platforms', type: "JSONB DEFAULT '[]'" },
      { name: 'created_by', type: 'INTEGER' },
      { name: 'deadline', type: 'TIMESTAMP' },
      { name: 'location', type: 'VARCHAR(255)' },
      { name: 'is_remote', type: 'BOOLEAN DEFAULT TRUE' }
    ];
    
    for (const col of oppColumns) {
      try {
        await client.query(`ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
      } catch (e) {
        // Column might already exist, ignore error
      }
    }

    // 4. APPLICATIONS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        opportunity_id INTEGER NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        message TEXT,
        proposed_rate INTEGER,
        portfolio_links JSONB DEFAULT '[]',
        response_message TEXT,
        responded_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, opportunity_id)
      )
    `);

    // 5. MESSAGES TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER,
        sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'text',
        attachment_url TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add conversation_id column as INTEGER if it doesn't exist or is wrong type
    try {
      await client.query(`ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id INTEGER`);
    } catch (e) {
      // Column might already exist
    }

    // Create indexes for messages
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id)
    `);

    // 6. CONVERSATIONS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user1_id, user2_id)
      )
    `);
    
    // Add missing columns to conversations if they don't exist
    const convColumns = [
      { name: 'user1_id', type: 'INTEGER' },
      { name: 'user2_id', type: 'INTEGER' },
      { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
    ];
    
    for (const col of convColumns) {
      try {
        await client.query(`ALTER TABLE conversations ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
      } catch (e) {
        // Column might already exist, ignore error
      }
    }
    
    // If old schema exists with participant_1/participant_2, migrate data
    try {
      const hasOldSchema = await client.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'conversations' AND column_name = 'participant_1'
      `);
      
      if (hasOldSchema.rows.length > 0) {
        // Check if user1_id has data
        const hasNewData = await client.query(`SELECT user1_id FROM conversations WHERE user1_id IS NOT NULL LIMIT 1`);
        if (hasNewData.rows.length === 0) {
          // Migrate data from old columns
          await client.query(`UPDATE conversations SET user1_id = participant_1, user2_id = participant_2 WHERE user1_id IS NULL`);
          console.log('📦 Migrated conversations from old schema');
        }
      }
    } catch (e) {
      // Old schema doesn't exist, that's fine
    }

    // 8. COLLABORATIONS TABLE (for brand-influencer partnerships)
    await client.query(`
      CREATE TABLE IF NOT EXISTS collaborations (
        id SERIAL PRIMARY KEY,
        opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE SET NULL,
        brand_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        influencer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        application_id INTEGER REFERENCES applications(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'accepted',
        agreed_rate INTEGER,
        notes TEXT,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes for collaborations
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_collaborations_brand ON collaborations(brand_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_collaborations_influencer ON collaborations(influencer_id)
    `);

    // 7. NOTIFICATIONS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        message TEXT,
        link VARCHAR(500),
        related_id INTEGER,
        related_type VARCHAR(50),
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add missing columns to notifications if they don't exist
    const notifColumns = [
      { name: 'message', type: 'TEXT' },
      { name: 'related_id', type: 'INTEGER' },
      { name: 'related_type', type: 'VARCHAR(50)' }
    ];
    
    for (const col of notifColumns) {
      try {
        await client.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
      } catch (e) {
        // Column might already exist, ignore error
      }
    }

    // Create index for notifications
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)
    `);

    // 8. USER SETTINGS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        email_notifications JSONB DEFAULT '{"opportunities": true, "messages": true, "campaigns": true, "marketing": false}',
        privacy_settings JSONB DEFAULT '{"public_profile": true, "show_email": false, "show_stats": true}',
        timezone VARCHAR(50) DEFAULT 'UTC',
        language VARCHAR(10) DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 9. CAMPAIGNS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        brand_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'draft',
        budget INTEGER,
        start_date DATE,
        end_date DATE,
        goals JSONB DEFAULT '{}',
        metrics JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_campaigns_brand ON campaigns(brand_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status)`);

    // 10. CAMPAIGN PARTICIPANTS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaign_participants (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'influencer',
        status VARCHAR(50) DEFAULT 'invited',
        payment_amount INTEGER,
        payment_status VARCHAR(50) DEFAULT 'pending',
        deliverables JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(campaign_id, user_id)
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_campaign_participants_campaign ON campaign_participants(campaign_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_campaign_participants_user ON campaign_participants(user_id)`);

    // 11. DELIVERABLES TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS deliverables (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
        participant_id INTEGER NOT NULL REFERENCES campaign_participants(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        platform VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        due_date DATE,
        submitted_at TIMESTAMP,
        submitted_url TEXT,
        submitted_content TEXT,
        feedback TEXT,
        approved_at TIMESTAMP,
        approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_deliverables_campaign ON deliverables(campaign_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_deliverables_participant ON deliverables(participant_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_deliverables_status ON deliverables(status)`);

    // 12. REVIEWS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reviewed_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        content TEXT,
        is_public BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(reviewer_id, reviewed_user_id, campaign_id)
      )
    `);

    // 13. PAYMENT METHODS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        stripe_account_id VARCHAR(255),
        stripe_account_status VARCHAR(50),
        wallet_address VARCHAR(255),
        wallet_network VARCHAR(50),
        bank_last_four VARCHAR(4),
        bank_name VARCHAR(255),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id)`);

    // 14. PAYMENTS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
        participant_id INTEGER REFERENCES campaign_participants(id) ON DELETE SET NULL,
        payer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        payee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        platform_fee INTEGER DEFAULT 0,
        net_amount INTEGER NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_method_id INTEGER REFERENCES payment_methods(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'pending',
        stripe_payment_id VARCHAR(255),
        stripe_transfer_id VARCHAR(255),
        crypto_tx_hash VARCHAR(255),
        description TEXT,
        metadata JSONB DEFAULT '{}',
        processed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_payments_campaign ON payments(campaign_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_payments_payer ON payments(payer_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_payments_payee ON payments(payee_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)`);

    // 15. ANALYTICS EVENTS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        event_type VARCHAR(100) NOT NULL,
        event_category VARCHAR(50) NOT NULL,
        page VARCHAR(255),
        referrer VARCHAR(500),
        target_type VARCHAR(50),
        target_id INTEGER,
        properties JSONB DEFAULT '{}',
        session_id VARCHAR(255),
        device_type VARCHAR(50),
        browser VARCHAR(100),
        ip_address INET,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC)`);

    // 16. SAVED ITEMS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        item_type VARCHAR(50) NOT NULL,
        item_id INTEGER NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, item_type, item_id)
      )
    `);

    // Add 2FA columns to users if they don't exist
    try {
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret TEXT`);
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE`);
    } catch (e) {
      // Columns might already exist
    }

    // Add account lockout columns
    try {
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0`);
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP`);
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP`);
      await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45)`);
    } catch (e) {
      // Columns might already exist
    }

    // 17. AUDIT LOGS TABLE (Security)
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        details JSONB DEFAULT '{}',
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_type ON audit_logs(event_type)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC)`);

    // ========================================
    // RBAC: ROLES & PERMISSIONS TABLES
    // ========================================
    
    // 18. ROLES TABLE - System roles
    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        description TEXT,
        is_system_role BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 19. PERMISSIONS TABLE - Granular permissions
    await client.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        display_name VARCHAR(150) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 20. ROLE_PERMISSIONS TABLE - Maps roles to permissions
    await client.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id SERIAL PRIMARY KEY,
        role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
        UNIQUE(role_id, permission_id)
      )
    `);
    
    // 21. USER_ROLES TABLE - Assigns roles to users
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, role_id)
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id)`);
    
    // ========================================
    // TEAMS & ORGANIZATIONS
    // ========================================
    
    // 22. TEAMS TABLE - Organizations/Teams
    await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        logo_url VARCHAR(500),
        owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        team_type VARCHAR(50) DEFAULT 'brand',
        settings JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_teams_owner ON teams(owner_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug)`);
    
    // 23. TEAM_ROLES TABLE - Team-specific roles
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_roles (
        id SERIAL PRIMARY KEY,
        team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        permissions JSONB DEFAULT '[]',
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(team_id, name)
      )
    `);
    
    // 24. TEAM_MEMBERS TABLE - Team membership
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        team_role_id INTEGER REFERENCES team_roles(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'active',
        invited_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        joined_at TIMESTAMP,
        UNIQUE(team_id, user_id)
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id)`);
    
    // ========================================
    // FEATURE FLAGS
    // ========================================
    
    // 25. FEATURE_FLAGS TABLE - Feature toggles
    await client.query(`
      CREATE TABLE IF NOT EXISTS feature_flags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        display_name VARCHAR(150) NOT NULL,
        description TEXT,
        is_enabled BOOLEAN DEFAULT FALSE,
        rollout_percentage INTEGER DEFAULT 0,
        allowed_user_types TEXT[] DEFAULT '{}',
        allowed_roles TEXT[] DEFAULT '{}',
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 26. USER_FEATURE_FLAGS TABLE - Per-user overrides
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_feature_flags (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        feature_flag_id INTEGER NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
        is_enabled BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, feature_flag_id)
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_user_features_user ON user_feature_flags(user_id)`);
    
    // ========================================
    // SUBSCRIPTION TIERS & ENTITLEMENTS
    // ========================================
    
    // 27. SUBSCRIPTION_TIERS TABLE - Plans
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscription_tiers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        description TEXT,
        price_monthly INTEGER DEFAULT 0,
        price_yearly INTEGER DEFAULT 0,
        features JSONB DEFAULT '[]',
        limits JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 28. USER_SUBSCRIPTIONS TABLE - User subscription status
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tier_id INTEGER NOT NULL REFERENCES subscription_tiers(id),
        status VARCHAR(50) DEFAULT 'active',
        billing_cycle VARCHAR(20) DEFAULT 'monthly',
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        stripe_subscription_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_user_subs_user ON user_subscriptions(user_id)`);
    
    // 29. ENTITLEMENTS TABLE - Feature entitlements per tier
    await client.query(`
      CREATE TABLE IF NOT EXISTS entitlements (
        id SERIAL PRIMARY KEY,
        tier_id INTEGER NOT NULL REFERENCES subscription_tiers(id) ON DELETE CASCADE,
        feature_name VARCHAR(100) NOT NULL,
        limit_value INTEGER,
        is_unlimited BOOLEAN DEFAULT FALSE,
        metadata JSONB DEFAULT '{}',
        UNIQUE(tier_id, feature_name)
      )
    `);

    // ========================================
    // SHOP / E-COMMERCE TABLES
    // ========================================
    
    // 30. PRODUCTS TABLE - Digital products, services, etc.
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        description TEXT,
        short_description VARCHAR(500),
        type VARCHAR(50) DEFAULT 'digital',
        price INTEGER NOT NULL,
        compare_at_price INTEGER,
        currency VARCHAR(10) DEFAULT 'USD',
        cover_image VARCHAR(500),
        gallery_images JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        download_limit INTEGER,
        metadata JSONB DEFAULT '{}',
        tags TEXT[] DEFAULT '{}',
        sales_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(creator_id, slug)
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_creator ON products(creator_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_type ON products(type)`);
    
    // 31. PRODUCT_FILES TABLE - Downloadable files for digital products
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_files (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_url VARCHAR(1000) NOT NULL,
        file_size INTEGER,
        file_type VARCHAR(100),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_product_files_product ON product_files(product_id)`);
    
    // 32. SHOP_SETTINGS TABLE - Creator shop configuration
    await client.query(`
      CREATE TABLE IF NOT EXISTS shop_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        shop_name VARCHAR(255),
        shop_description TEXT,
        shop_logo VARCHAR(500),
        shop_banner VARCHAR(500),
        stripe_account_id VARCHAR(255),
        stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
        currency VARCHAR(10) DEFAULT 'USD',
        theme JSONB DEFAULT '{"primary_color": "#14b8a6", "style": "modern"}',
        social_links JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 33. SHOP_ORDERS TABLE - Purchase records
    await client.query(`
      CREATE TABLE IF NOT EXISTS shop_orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE SET NULL,
        creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255),
        amount INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        platform_fee INTEGER DEFAULT 0,
        creator_payout INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        stripe_payment_intent_id VARCHAR(255),
        stripe_checkout_session_id VARCHAR(255),
        download_count INTEGER DEFAULT 0,
        download_token VARCHAR(255) UNIQUE,
        download_expires_at TIMESTAMP,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_shop_orders_creator ON shop_orders(creator_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_shop_orders_product ON shop_orders(product_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_shop_orders_status ON shop_orders(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_shop_orders_token ON shop_orders(download_token)`);

    // ========================================
    // ASSET MANAGEMENT TABLES
    // ========================================

    // 34. ASSETS TABLE - Core asset records
    await client.query(`
      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
        campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
        created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        platform VARCHAR(50) NOT NULL,
        format VARCHAR(50) NOT NULL,
        width INTEGER,
        height INTEGER,
        duration_seconds INTEGER,
        aspect_ratio VARCHAR(20),
        status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'changes_requested', 'scheduled', 'live')),
        risk_flags JSONB DEFAULT '[]',
        is_sensitive BOOLEAN DEFAULT FALSE,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_assets_team ON assets(team_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_assets_campaign ON assets(campaign_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_assets_created_by ON assets(created_by)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_assets_platform ON assets(platform)`);

    // 35. ASSET_VERSIONS TABLE - Version history with review workflow
    await client.query(`
      CREATE TABLE IF NOT EXISTS asset_versions (
        id SERIAL PRIMARY KEY,
        asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
        version_number INTEGER NOT NULL DEFAULT 1,
        status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'changes_requested', 'scheduled', 'live')),
        review_outcome VARCHAR(50) CHECK (review_outcome IN ('approved', 'changes_requested', 'rejected')),
        created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        review_notes TEXT,
        is_current BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP,
        UNIQUE(asset_id, version_number)
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_versions_asset ON asset_versions(asset_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_versions_current ON asset_versions(asset_id, is_current) WHERE is_current = TRUE`);

    // 36. ASSET_VERSION_FILES TABLE - File references per version
    await client.query(`
      CREATE TABLE IF NOT EXISTS asset_version_files (
        id SERIAL PRIMARY KEY,
        version_id INTEGER NOT NULL REFERENCES asset_versions(id) ON DELETE CASCADE,
        file_url TEXT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100),
        file_size INTEGER,
        storage_provider VARCHAR(50) DEFAULT 'local',
        checksum VARCHAR(64),
        is_primary BOOLEAN DEFAULT FALSE,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_version_files_version ON asset_version_files(version_id)`);

    // 37. ASSET_VERSION_CAPTIONS TABLE - Multi-locale captions
    await client.query(`
      CREATE TABLE IF NOT EXISTS asset_version_captions (
        id SERIAL PRIMARY KEY,
        version_id INTEGER NOT NULL REFERENCES asset_versions(id) ON DELETE CASCADE,
        locale VARCHAR(10) DEFAULT 'en',
        caption TEXT NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(version_id, locale)
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_version_captions_version ON asset_version_captions(version_id)`);

    // 38. ASSET_VERSION_TAGS TABLE - Flexible tagging
    await client.query(`
      CREATE TABLE IF NOT EXISTS asset_version_tags (
        id SERIAL PRIMARY KEY,
        version_id INTEGER NOT NULL REFERENCES asset_versions(id) ON DELETE CASCADE,
        tag VARCHAR(100) NOT NULL,
        tag_type VARCHAR(50) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(version_id, tag, tag_type)
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_version_tags_version ON asset_version_tags(version_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_version_tags_tag ON asset_version_tags(tag)`);

    // 39. ASSET_VERSION_PLATFORM_SETTINGS TABLE - Platform-specific config
    await client.query(`
      CREATE TABLE IF NOT EXISTS asset_version_platform_settings (
        id SERIAL PRIMARY KEY,
        version_id INTEGER NOT NULL REFERENCES asset_versions(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        settings JSONB DEFAULT '{}',
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(version_id, platform)
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_version_platform_settings_version ON asset_version_platform_settings(version_id)`);

    // 40. ASSET_FEEDBACK TABLE - Review comments and feedback
    await client.query(`
      CREATE TABLE IF NOT EXISTS asset_feedback (
        id SERIAL PRIMARY KEY,
        version_id INTEGER NOT NULL REFERENCES asset_versions(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        source VARCHAR(50) DEFAULT 'internal' CHECK (source IN ('internal', 'client', 'creator', 'qa', 'system')),
        content TEXT NOT NULL,
        review_outcome VARCHAR(50) CHECK (review_outcome IN ('approved', 'changes_requested', 'rejected')),
        timecode_start DECIMAL(10,3),
        timecode_end DECIMAL(10,3),
        parent_id INTEGER REFERENCES asset_feedback(id) ON DELETE CASCADE,
        is_resolved BOOLEAN DEFAULT FALSE,
        resolved_at TIMESTAMP,
        resolved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_feedback_version ON asset_feedback(version_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_feedback_user ON asset_feedback(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_feedback_parent ON asset_feedback(parent_id)`);

    // 41. ASSET_SCHEDULE_SLOTS TABLE - Scheduled publishing
    await client.query(`
      CREATE TABLE IF NOT EXISTS asset_schedule_slots (
        id SERIAL PRIMARY KEY,
        asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
        version_id INTEGER REFERENCES asset_versions(id) ON DELETE SET NULL,
        campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
        platform VARCHAR(50) NOT NULL,
        scheduled_at TIMESTAMP NOT NULL,
        timezone VARCHAR(50) DEFAULT 'UTC',
        status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
        published_at TIMESTAMP,
        published_url TEXT,
        error_message TEXT,
        metadata JSONB DEFAULT '{}',
        created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_schedule_slots_asset ON asset_schedule_slots(asset_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_schedule_slots_scheduled ON asset_schedule_slots(scheduled_at)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_schedule_slots_status ON asset_schedule_slots(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_schedule_slots_platform ON asset_schedule_slots(platform)`);

    // 42. ASSET_METRICS TABLE - Performance tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS asset_metrics (
        id SERIAL PRIMARY KEY,
        asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
        schedule_slot_id INTEGER REFERENCES asset_schedule_slots(id) ON DELETE SET NULL,
        platform VARCHAR(50) NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        impressions INTEGER DEFAULT 0,
        reach INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        engagements INTEGER DEFAULT 0,
        saves INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        conversion_value DECIMAL(10,2) DEFAULT 0,
        platform_metrics JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_metrics_asset ON asset_metrics(asset_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_metrics_recorded ON asset_metrics(recorded_at)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_asset_metrics_platform ON asset_metrics(platform)`);

    // ========================================
    // SEED DEFAULT ROLES & PERMISSIONS
    // ========================================
    
    // Insert default system roles
    await client.query(`
      INSERT INTO roles (name, display_name, description, is_system_role) VALUES
        ('admin', 'Administrator', 'Full system access', TRUE),
        ('creator', 'Creator', 'Content creator / influencer', TRUE),
        ('brand', 'Brand', 'Brand or business account', TRUE),
        ('agency', 'Agency', 'Agency managing multiple creators or brands', TRUE),
        ('moderator', 'Moderator', 'Content and community moderation', TRUE)
      ON CONFLICT (name) DO NOTHING
    `);
    
    // Insert default permissions
    await client.query(`
      INSERT INTO permissions (name, display_name, description, category) VALUES
        -- User permissions
        ('users.view', 'View Users', 'View user profiles', 'users'),
        ('users.edit', 'Edit Users', 'Edit user profiles', 'users'),
        ('users.delete', 'Delete Users', 'Delete user accounts', 'users'),
        ('users.manage_roles', 'Manage User Roles', 'Assign and remove user roles', 'users'),
        
        -- Campaign permissions
        ('campaigns.view', 'View Campaigns', 'View campaigns', 'campaigns'),
        ('campaigns.create', 'Create Campaigns', 'Create new campaigns', 'campaigns'),
        ('campaigns.edit', 'Edit Campaigns', 'Edit campaign details', 'campaigns'),
        ('campaigns.delete', 'Delete Campaigns', 'Delete campaigns', 'campaigns'),
        ('campaigns.manage_participants', 'Manage Participants', 'Add/remove campaign participants', 'campaigns'),
        
        -- Opportunity permissions
        ('opportunities.view', 'View Opportunities', 'View opportunities', 'opportunities'),
        ('opportunities.create', 'Create Opportunities', 'Post new opportunities', 'opportunities'),
        ('opportunities.edit', 'Edit Opportunities', 'Edit opportunity details', 'opportunities'),
        ('opportunities.delete', 'Delete Opportunities', 'Delete opportunities', 'opportunities'),
        
        -- Team permissions
        ('teams.view', 'View Teams', 'View team information', 'teams'),
        ('teams.create', 'Create Teams', 'Create new teams', 'teams'),
        ('teams.edit', 'Edit Teams', 'Edit team settings', 'teams'),
        ('teams.delete', 'Delete Teams', 'Delete teams', 'teams'),
        ('teams.manage_members', 'Manage Team Members', 'Add/remove team members', 'teams'),
        
        -- Payment permissions
        ('payments.view', 'View Payments', 'View payment history', 'payments'),
        ('payments.create', 'Create Payments', 'Initiate payments', 'payments'),
        ('payments.manage', 'Manage Payments', 'Full payment management', 'payments'),
        
        -- Analytics permissions
        ('analytics.view', 'View Analytics', 'View analytics dashboards', 'analytics'),
        ('analytics.export', 'Export Analytics', 'Export analytics data', 'analytics'),

        -- Asset permissions
        ('assets.view', 'View Assets', 'View asset library', 'assets'),
        ('assets.create', 'Create Assets', 'Upload and create assets', 'assets'),
        ('assets.edit', 'Edit Assets', 'Edit asset details', 'assets'),
        ('assets.delete', 'Delete Assets', 'Delete assets', 'assets'),
        ('assets.review', 'Review Assets', 'Review and approve assets', 'assets'),
        ('assets.schedule', 'Schedule Assets', 'Schedule assets for publishing', 'assets'),

        -- Admin permissions
        ('admin.dashboard', 'Admin Dashboard', 'Access admin dashboard', 'admin'),
        ('admin.settings', 'Admin Settings', 'Manage system settings', 'admin'),
        ('admin.feature_flags', 'Manage Feature Flags', 'Enable/disable features', 'admin'),
        ('admin.audit_logs', 'View Audit Logs', 'Access security audit logs', 'admin')
      ON CONFLICT (name) DO NOTHING
    `);
    
    // Assign permissions to admin role
    await client.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'admin'
      ON CONFLICT DO NOTHING
    `);
    
    // Assign permissions to creator role
    await client.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id FROM roles r, permissions p 
      WHERE r.name = 'creator' 
      AND p.name IN ('opportunities.view', 'campaigns.view', 'payments.view', 'analytics.view', 'teams.view')
      ON CONFLICT DO NOTHING
    `);
    
    // Assign permissions to brand role
    await client.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id FROM roles r, permissions p 
      WHERE r.name = 'brand' 
      AND p.name IN (
        'opportunities.view', 'opportunities.create', 'opportunities.edit', 'opportunities.delete',
        'campaigns.view', 'campaigns.create', 'campaigns.edit', 'campaigns.manage_participants',
        'payments.view', 'payments.create', 'analytics.view', 'analytics.export',
        'teams.view', 'teams.create', 'teams.edit', 'teams.manage_members'
      )
      ON CONFLICT DO NOTHING
    `);
    
    // Assign permissions to agency role
    await client.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id FROM roles r, permissions p 
      WHERE r.name = 'agency' 
      AND p.name IN (
        'users.view', 'opportunities.view', 'opportunities.create', 'opportunities.edit',
        'campaigns.view', 'campaigns.create', 'campaigns.edit', 'campaigns.manage_participants',
        'payments.view', 'payments.create', 'payments.manage', 'analytics.view', 'analytics.export',
        'teams.view', 'teams.create', 'teams.edit', 'teams.delete', 'teams.manage_members'
      )
      ON CONFLICT DO NOTHING
    `);
    
    // Insert default subscription tiers
    await client.query(`
      INSERT INTO subscription_tiers (name, display_name, description, price_monthly, price_yearly, features, limits, sort_order) VALUES
        ('free', 'Free', 'Basic features for getting started', 0, 0, 
         '["Basic profile", "Apply to opportunities", "5 applications/month", "Basic analytics"]'::jsonb,
         '{"applications_per_month": 5, "campaigns": 1, "team_members": 1, "storage_mb": 100}'::jsonb, 0),
        ('starter', 'Starter', 'Essential tools for growing creators', 1900, 19000,
         '["Everything in Free", "Unlimited applications", "Advanced analytics", "Priority support", "Custom media kit"]'::jsonb,
         '{"applications_per_month": -1, "campaigns": 5, "team_members": 3, "storage_mb": 1000}'::jsonb, 1),
        ('pro', 'Pro', 'Professional tools for serious creators', 4900, 49000,
         '["Everything in Starter", "Team collaboration", "API access", "White-label options", "Dedicated support"]'::jsonb,
         '{"applications_per_month": -1, "campaigns": 25, "team_members": 10, "storage_mb": 10000}'::jsonb, 2),
        ('enterprise', 'Enterprise', 'Custom solutions for agencies and brands', 0, 0,
         '["Everything in Pro", "Custom integrations", "Unlimited everything", "SLA guarantee", "Account manager"]'::jsonb,
         '{"applications_per_month": -1, "campaigns": -1, "team_members": -1, "storage_mb": -1}'::jsonb, 3)
      ON CONFLICT (name) DO NOTHING
    `);
    
    // Insert default entitlements
    await client.query(`
      INSERT INTO entitlements (tier_id, feature_name, limit_value, is_unlimited) 
      SELECT t.id, 'campaigns', 1, FALSE FROM subscription_tiers t WHERE t.name = 'free'
      ON CONFLICT DO NOTHING
    `);
    
    // Insert default feature flags
    await client.query(`
      INSERT INTO feature_flags (name, display_name, description, is_enabled, allowed_user_types) VALUES
        ('smart_contracts', 'Smart Contract Escrow', 'Enable blockchain escrow for campaigns', FALSE, '{"brand", "agency"}'::text[]),
        ('ai_matching', 'AI Creator Matching', 'AI-powered brand-creator matching', FALSE, '{"brand", "agency"}'::text[]),
        ('advanced_analytics', 'Advanced Analytics', 'Detailed performance analytics', TRUE, '{"creator", "brand", "agency"}'::text[]),
        ('team_collaboration', 'Team Collaboration', 'Multi-user team features', TRUE, '{"brand", "agency"}'::text[]),
        ('api_access', 'API Access', 'External API access', FALSE, '{"brand", "agency"}'::text[]),
        ('white_label', 'White Label', 'Custom branding options', FALSE, '{"agency"}'::text[]),
        ('bulk_messaging', 'Bulk Messaging', 'Send messages to multiple users', FALSE, '{"brand", "agency"}'::text[]),
        ('calendar_integration', 'Calendar Integration', 'Sync with external calendars', TRUE, '{"creator", "brand", "agency"}'::text[])
      ON CONFLICT (name) DO NOTHING
    `);

    console.log('✅ All tables created/verified (including RBAC & permissions)');

    // Insert sample opportunities if none exist
    const existingOpportunities = await client.query('SELECT COUNT(*) FROM opportunities');
    
    if (parseInt(existingOpportunities.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO opportunities (title, description, type, industry, budget_range, budget_min, budget_max, status)
        VALUES 
          ('Social Media Campaign for Tech Startup', 'Looking for micro-influencers to promote our new productivity app.', 'influencer', 'technology', '$500-$2000', 500, 2000, 'active'),
          ('Lifestyle Photography for Fashion Brand', 'Need professional photographers for our new sustainable fashion collection.', 'freelancer', 'fashion', '$1000-$5000', 1000, 5000, 'active'),
          ('Video Editor for YouTube Channel', 'Seeking experienced video editor for gaming content.', 'freelancer', 'entertainment', '$2000-$8000', 2000, 8000, 'active'),
          ('Brand Partnership for Outdoor Gear', 'Adventure and outdoor enthusiasts wanted for brand partnership.', 'influencer', 'sports', '$1000-$3000', 1000, 3000, 'active'),
          ('UGC Creator for Beauty Brand', 'Looking for diverse UGC creators for our skincare line.', 'influencer', 'beauty', '$200-$800', 200, 800, 'active')
        ON CONFLICT DO NOTHING
      `);
      console.log('🎯 Sample opportunities inserted');
    }

    await client.query('COMMIT');
    
    console.log('✅ Database schema initialized successfully');
    console.log('📊 Tables: users, social_accounts, opportunities, applications, messages, conversations,');
    console.log('           notifications, user_settings, campaigns, campaign_participants, deliverables,');
    console.log('           reviews, payment_methods, payments, analytics_events, saved_items,');
    console.log('           assets, asset_versions, asset_version_files, asset_version_captions,');
    console.log('           asset_version_tags, asset_version_platform_settings, asset_feedback,');
    console.log('           asset_schedule_slots, asset_metrics');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database initialization error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// ============================================
// AUTH MIDDLEWARE
// ============================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, EFFECTIVE_JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Flexible auth middleware (accepts token from query or header)
const authenticateTokenFlexible = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Remove any accidental quotes around the token (URL decoded or literal)
  token = token.replace(/^["']|["']$/g, '');
  
  // Validate token format
  if (!token.startsWith('eyJ')) {
    return res.status(403).json({ error: 'Invalid token format. Please log in again.' });
  }

  jwt.verify(token, EFFECTIVE_JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
    }
    req.user = user;
    next();
  });
};

// ============================================
// RBAC: Permission & Role Middleware
// ============================================

// Check if user has specific permission(s)
const requirePermission = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      
      // Get user's permissions through their roles
      const result = await pool.query(`
        SELECT DISTINCT p.name 
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = $1
      `, [userId]);
      
      const userPermissions = result.rows.map(r => r.name);
      
      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every(perm => 
        userPermissions.includes(perm)
      );
      
      if (!hasAllPermissions) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: requiredPermissions,
          message: 'You do not have permission to perform this action'
        });
      }
      
      req.userPermissions = userPermissions;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Permission verification failed' });
    }
  };
};

// Check if user has any of the specified permissions
const requireAnyPermission = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      
      const result = await pool.query(`
        SELECT DISTINCT p.name 
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = $1
      `, [userId]);
      
      const userPermissions = result.rows.map(r => r.name);
      
      const hasAnyPermission = requiredPermissions.some(perm => 
        userPermissions.includes(perm)
      );
      
      if (!hasAnyPermission) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: requiredPermissions,
          message: 'You do not have permission to perform this action'
        });
      }
      
      req.userPermissions = userPermissions;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Permission verification failed' });
    }
  };
};

// Check if user has specific role(s)
const requireRole = (...requiredRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      
      const result = await pool.query(`
        SELECT r.name 
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1
      `, [userId]);
      
      const userRoles = result.rows.map(r => r.name);
      
      // Also check user_type from JWT for backward compatibility
      if (req.user.userType) {
        userRoles.push(req.user.userType);
      }
      
      const hasRequiredRole = requiredRoles.some(role => 
        userRoles.includes(role)
      );
      
      if (!hasRequiredRole) {
        return res.status(403).json({ 
          error: 'Insufficient role',
          required: requiredRoles,
          message: 'You do not have the required role to perform this action'
        });
      }
      
      req.userRoles = userRoles;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Role verification failed' });
    }
  };
};

// Check if user is team member with specific role
const requireTeamRole = (teamIdParam, ...requiredTeamRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const teamId = req.params[teamIdParam] || req.body.teamId;
      
      if (!teamId) {
        return res.status(400).json({ error: 'Team ID required' });
      }
      
      const result = await pool.query(`
        SELECT tm.*, tr.name as role_name, tr.permissions as role_permissions, t.owner_id
        FROM team_members tm
        LEFT JOIN team_roles tr ON tm.team_role_id = tr.id
        JOIN teams t ON tm.team_id = t.id
        WHERE tm.team_id = $1 AND tm.user_id = $2 AND tm.status = 'active'
      `, [teamId, userId]);
      
      if (result.rows.length === 0) {
        // Check if user is team owner
        const ownerCheck = await pool.query(
          'SELECT id FROM teams WHERE id = $1 AND owner_id = $2',
          [teamId, userId]
        );
        
        if (ownerCheck.rows.length === 0) {
          return res.status(403).json({ 
            error: 'Not a team member',
            message: 'You are not a member of this team'
          });
        }
        
        // Owner has all permissions
        req.teamMember = { isOwner: true, permissions: ['*'] };
        return next();
      }
      
      const member = result.rows[0];
      const roleName = member.role_name || 'member';
      
      if (requiredTeamRoles.length > 0 && !requiredTeamRoles.includes(roleName) && !requiredTeamRoles.includes('*')) {
        return res.status(403).json({ 
          error: 'Insufficient team role',
          required: requiredTeamRoles,
          message: 'You do not have the required team role'
        });
      }
      
      req.teamMember = {
        ...member,
        permissions: member.role_permissions || []
      };
      next();
    } catch (error) {
      console.error('Team role check error:', error);
      res.status(500).json({ error: 'Team role verification failed' });
    }
  };
};

// Check if feature flag is enabled for user
const requireFeatureFlag = (featureName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      const userType = req.user?.userType;
      
      // Check user-specific override first
      if (userId) {
        const userOverride = await pool.query(`
          SELECT uff.is_enabled 
          FROM user_feature_flags uff
          JOIN feature_flags ff ON uff.feature_flag_id = ff.id
          WHERE ff.name = $1 AND uff.user_id = $2
        `, [featureName, userId]);
        
        if (userOverride.rows.length > 0) {
          if (!userOverride.rows[0].is_enabled) {
            return res.status(403).json({ 
              error: 'Feature not available',
              feature: featureName,
              message: 'This feature is not enabled for your account'
            });
          }
          return next();
        }
      }
      
      // Check global feature flag
      const flagResult = await pool.query(`
        SELECT * FROM feature_flags WHERE name = $1
      `, [featureName]);
      
      if (flagResult.rows.length === 0) {
        return res.status(404).json({ error: 'Feature not found' });
      }
      
      const flag = flagResult.rows[0];
      
      // Check if globally disabled
      if (!flag.is_enabled) {
        return res.status(403).json({ 
          error: 'Feature not available',
          feature: featureName,
          message: 'This feature is currently disabled'
        });
      }
      
      // Check user type restriction
      if (flag.allowed_user_types && flag.allowed_user_types.length > 0) {
        if (!flag.allowed_user_types.includes(userType)) {
          return res.status(403).json({ 
            error: 'Feature not available',
            feature: featureName,
            message: 'This feature is not available for your account type'
          });
        }
      }
      
      // Check rollout percentage
      if (flag.rollout_percentage > 0 && flag.rollout_percentage < 100 && userId) {
        const hash = crypto.createHash('md5').update(`${userId}-${featureName}`).digest('hex');
        const userBucket = parseInt(hash.substring(0, 8), 16) % 100;
        
        if (userBucket >= flag.rollout_percentage) {
          return res.status(403).json({ 
            error: 'Feature not available',
            feature: featureName,
            message: 'This feature is being rolled out gradually'
          });
        }
      }
      
      req.featureFlag = flag;
      next();
    } catch (error) {
      console.error('Feature flag check error:', error);
      res.status(500).json({ error: 'Feature flag verification failed' });
    }
  };
};

// Check subscription entitlement
const requireEntitlement = (featureName, requiredLimit = null) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      
      // Get user's subscription and entitlements
      const result = await pool.query(`
        SELECT st.*, us.status as subscription_status, e.limit_value, e.is_unlimited
        FROM user_subscriptions us
        JOIN subscription_tiers st ON us.tier_id = st.id
        LEFT JOIN entitlements e ON st.id = e.tier_id AND e.feature_name = $2
        WHERE us.user_id = $1 AND us.status = 'active'
      `, [userId, featureName]);
      
      // Default to free tier if no subscription
      if (result.rows.length === 0) {
        const freeTier = await pool.query(`
          SELECT st.*, e.limit_value, e.is_unlimited
          FROM subscription_tiers st
          LEFT JOIN entitlements e ON st.id = e.tier_id AND e.feature_name = $1
          WHERE st.name = 'free'
        `, [featureName]);
        
        if (freeTier.rows.length > 0) {
          req.subscription = { tier: 'free', ...freeTier.rows[0] };
        } else {
          req.subscription = { tier: 'free', limit_value: 0, is_unlimited: false };
        }
      } else {
        req.subscription = result.rows[0];
      }
      
      const { limit_value, is_unlimited } = req.subscription;
      
      // Check if feature is available at this tier
      if (!is_unlimited && limit_value === null) {
        return res.status(403).json({ 
          error: 'Feature not available',
          feature: featureName,
          message: 'Upgrade your subscription to access this feature'
        });
      }
      
      // Check limit if required
      if (requiredLimit !== null && !is_unlimited && limit_value !== null) {
        if (requiredLimit > limit_value) {
          return res.status(403).json({ 
            error: 'Limit exceeded',
            feature: featureName,
            limit: limit_value,
            requested: requiredLimit,
            message: 'You have reached the limit for this feature. Upgrade to increase your limit.'
          });
        }
      }
      
      next();
    } catch (error) {
      console.error('Entitlement check error:', error);
      res.status(500).json({ error: 'Entitlement verification failed' });
    }
  };
};

// Helper: Get all user permissions
async function getUserPermissions(userId) {
  const result = await pool.query(`
    SELECT DISTINCT p.name, p.display_name, p.category
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN user_roles ur ON rp.role_id = ur.role_id
    WHERE ur.user_id = $1
  `, [userId]);
  return result.rows;
}

// Helper: Get all user roles
async function getUserRoles(userId) {
  const result = await pool.query(`
    SELECT r.name, r.display_name, r.description
    FROM roles r
    JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = $1
  `, [userId]);
  return result.rows;
}

// Helper: Check feature flag status
async function isFeatureEnabled(featureName, userId = null, userType = null) {
  // Check user override
  if (userId) {
    const override = await pool.query(`
      SELECT uff.is_enabled 
      FROM user_feature_flags uff
      JOIN feature_flags ff ON uff.feature_flag_id = ff.id
      WHERE ff.name = $1 AND uff.user_id = $2
    `, [featureName, userId]);
    
    if (override.rows.length > 0) {
      return override.rows[0].is_enabled;
    }
  }
  
  // Check global flag
  const flag = await pool.query('SELECT * FROM feature_flags WHERE name = $1', [featureName]);
  if (flag.rows.length === 0) return false;
  
  const f = flag.rows[0];
  if (!f.is_enabled) return false;
  if (f.allowed_user_types?.length > 0 && userType && !f.allowed_user_types.includes(userType)) {
    return false;
  }
  
  return true;
}

// ============================================
// OAUTH HELPER FUNCTIONS
// ============================================

function generateOAuthState() {
  return crypto.randomBytes(32).toString('hex');
}

function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
  return { verifier, challenge };
}

function isTokenExpired(expiresAt) {
  if (!expiresAt) return true;
  return new Date(expiresAt) <= new Date();
}

async function refreshOAuthToken(platform, refreshToken) {
  const config = OAUTH_CONFIG[platform];
  
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: config.clientId
    });

    if (platform === 'twitter') {
      const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
      
      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token || refreshToken,
        expires_in: data.expires_in
      };
    } else {
      params.append('client_secret', config.clientSecret);
      
      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token || refreshToken,
        expires_in: data.expires_in
      };
    }
  } catch (error) {
    console.error(`Error refreshing ${platform} token:`, error);
    throw error;
  }
}

async function getValidAccessToken(userId, platform) {
  const result = await pool.query(
    'SELECT access_token, refresh_token, token_expires_at FROM social_accounts WHERE user_id = $1 AND platform = $2',
    [userId, platform]
  );

  if (result.rows.length === 0) {
    throw new Error('Account not connected');
  }

  const account = result.rows[0];
  
  // Decrypt tokens (handles both encrypted and legacy unencrypted tokens)
  const accessToken = decryptToken(account.access_token);
  const refreshToken = decryptToken(account.refresh_token);

  if (isTokenExpired(account.token_expires_at) && refreshToken) {
    console.log(`Token expired for ${platform}, refreshing...`);
    
    const newTokens = await refreshOAuthToken(platform, refreshToken);
    const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000);
    
    // Encrypt new tokens before storing
    const encryptedAccessToken = encryptToken(newTokens.access_token);
    const encryptedRefreshToken = encryptToken(newTokens.refresh_token);
    
    await pool.query(
      `UPDATE social_accounts 
       SET access_token = $1, refresh_token = $2, token_expires_at = $3, updated_at = NOW()
       WHERE user_id = $4 AND platform = $5`,
      [encryptedAccessToken, encryptedRefreshToken, expiresAt, userId, platform]
    );

    return newTokens.access_token;
  }

  return accessToken;
}

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', asyncHandler(async (req, res) => {
  // Test database connection
  const dbResult = await pool.query('SELECT NOW()');
  res.json({
    status: 'OK',
    message: 'Formative API is running',
    database: 'connected',
    timestamp: dbResult.rows[0].now
  });
}));

// ============================================
// AUTH ENDPOINTS
// ============================================

// User Registration
app.post('/api/auth/register', authLimiter, validators.registerValidator, asyncHandler(async (req, res) => {
  const { name, email, password, userType } = req.body;

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    throw ApiError.badRequest('Password does not meet security requirements', passwordValidation.errors);
  }

  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    await logAuditEvent('REGISTER_DUPLICATE_EMAIL', null, {}, req);
    throw ApiError.conflict('User already exists with this email');
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash, user_type) VALUES ($1, $2, $3, $4) RETURNING id, name, email, user_type, created_at',
    [name, email.toLowerCase(), passwordHash, userType.toLowerCase()]
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

  await logAuditEvent('USER_REGISTERED', user.id, { userType: user.user_type }, req);
  secureLog('info', 'New user registered', { userId: user.id, userType, requestId: req.id });

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
app.post('/api/auth/login', authLimiter, validators.loginValidator, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const clientIP = getClientIP(req);

  // Check if account is locked (in-memory check for quick response)
  if (isAccountLocked(email)) {
    const remainingMinutes = getRemainingLockoutTime(email);
    await logAuditEvent('LOGIN_BLOCKED_LOCKOUT', null, { remainingMinutes }, req);
    throw ApiError.tooManyRequests(`Account temporarily locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.`);
  }

  const result = await pool.query(
    'SELECT id, name, email, password_hash, user_type, profile_data, two_factor_enabled, locked_until FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    // Record failed attempt even for non-existent users (prevents user enumeration timing attacks)
    recordFailedLogin(email);
    await logAuditEvent('LOGIN_FAILED_UNKNOWN_USER', null, {}, req);
    throw ApiError.unauthorized('Invalid email or password');
  }

  const user = result.rows[0];

  // Check database-level lockout (more persistent)
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    const remainingMinutes = Math.ceil((new Date(user.locked_until) - new Date()) / 1000 / 60);
    await logAuditEvent('LOGIN_BLOCKED_DB_LOCKOUT', user.id, {}, req);
    throw ApiError.tooManyRequests(`Account temporarily locked. Try again in ${remainingMinutes} minutes.`);
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    const attempts = recordFailedLogin(email);

    // Also update database for persistence across server restarts
    await pool.query(
      'UPDATE users SET failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1 WHERE id = $1',
      [user.id]
    );

    // Lock account after max attempts
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCKOUT_DURATION);
      await pool.query(
        'UPDATE users SET locked_until = $1 WHERE id = $2',
        [lockUntil, user.id]
      );
      await logAuditEvent('ACCOUNT_LOCKED', user.id, { attempts }, req);
      throw ApiError.tooManyRequests(`Account locked due to ${MAX_LOGIN_ATTEMPTS} failed attempts. Try again in 15 minutes.`);
    }

    await logAuditEvent('LOGIN_FAILED_WRONG_PASSWORD', user.id, { attempts }, req);
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
    await logAuditEvent('LOGIN_2FA_REQUIRED', user.id, {}, req);
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

  await logAuditEvent('LOGIN_SUCCESS', user.id, {}, req);
  secureLog('info', 'User logged in', { userId: user.id, requestId: req.id });

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
// TWO-FACTOR AUTHENTICATION ENDPOINTS
// Using speakeasy library for secure TOTP implementation
// ============================================

// Setup 2FA - Generate secret and QR code
app.post('/api/auth/2fa/setup', authenticateToken, twoFactorLimiter, asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Get user email for QR code label
  const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
  const email = userResult.rows[0]?.email || 'user';

  // Generate secret using speakeasy (cryptographically secure)
  const secret = speakeasy.generateSecret({
    name: `Formative:${email}`,
    issuer: 'Formative',
    length: 32
  });

  // Store secret temporarily (not enabled yet) - store base32 version
  await pool.query(
    `UPDATE users SET two_factor_secret = $1, two_factor_enabled = false WHERE id = $2`,
    [secret.base32, userId]
  );

  // Generate QR code as data URL
  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

  secureLog('info', '2FA setup initiated', { userId, requestId: req.id });

  res.json({
    success: true,
    qrCode: qrCodeDataUrl, // Data URL for direct display
    secret: secret.base32, // For manual entry
    otpauthUrl: secret.otpauth_url // For custom QR handling
  });
}));

// Verify and enable 2FA
app.post('/api/auth/2fa/verify', authenticateToken, twoFactorLimiter, validators.twoFactorCodeValidator, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { code } = req.body;

  // Get secret
  const result = await pool.query(
    'SELECT two_factor_secret, email FROM users WHERE id = $1',
    [userId]
  );

  if (!result.rows[0]?.two_factor_secret) {
    throw ApiError.badRequest('Please setup 2FA first');
  }

  const secret = result.rows[0].two_factor_secret;

  // Verify code using speakeasy with window for clock drift
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: code,
    window: 2 // Allow 2 time steps before/after for clock drift
  });

  if (!verified) {
    await logAuditEvent('2FA_ENABLE_FAILED', userId, { reason: 'invalid_code' }, req);
    throw ApiError.badRequest('Invalid verification code');
  }

  // Enable 2FA
  await pool.query(
    'UPDATE users SET two_factor_enabled = true WHERE id = $1',
    [userId]
  );

  await logAuditEvent('2FA_ENABLED', userId, {}, req);
  secureLog('info', '2FA enabled', { userId, requestId: req.id });

  res.json({ success: true });
}));

// Disable 2FA
app.post('/api/auth/2fa/disable', authenticateToken, twoFactorLimiter, validators.twoFactorCodeValidator, asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { code } = req.body;

  // Get secret
  const result = await pool.query(
    'SELECT two_factor_secret, email FROM users WHERE id = $1',
    [userId]
  );

  if (!result.rows[0]?.two_factor_secret) {
    throw ApiError.badRequest('2FA is not enabled');
  }

  // Verify code using speakeasy
  const verified = speakeasy.totp.verify({
    secret: result.rows[0].two_factor_secret,
    encoding: 'base32',
    token: code,
    window: 2
  });

  if (!verified) {
    await logAuditEvent('2FA_DISABLE_FAILED', userId, { reason: 'invalid_code' }, req);
    throw ApiError.badRequest('Invalid verification code');
  }

  // Disable 2FA
  await pool.query(
    'UPDATE users SET two_factor_enabled = false, two_factor_secret = NULL WHERE id = $1',
    [userId]
  );

  await logAuditEvent('2FA_DISABLED', userId, {}, req);
  secureLog('info', '2FA disabled', { userId, requestId: req.id });

  res.json({ success: true });
}));

// 2FA Login verification
app.post('/api/auth/2fa/login', twoFactorLimiter, validators.twoFactorLoginValidator, asyncHandler(async (req, res) => {
  const { userId, code, rememberMe } = req.body;

  // Get user and secret
  const result = await pool.query(
    'SELECT id, name, email, user_type, two_factor_secret, profile_data FROM users WHERE id = $1 AND two_factor_enabled = true',
    [userId]
  );

  if (result.rows.length === 0) {
    throw ApiError.badRequest('Invalid request');
  }

  const user = result.rows[0];

  // Verify code using speakeasy
  const verified = speakeasy.totp.verify({
    secret: user.two_factor_secret,
    encoding: 'base32',
    token: code,
    window: 2
  });

  if (!verified) {
    await logAuditEvent('2FA_LOGIN_FAILED', user.id, { reason: 'invalid_code' }, req);
    throw ApiError.badRequest('Invalid verification code');
  }

  // Clear any failed login attempts on successful 2FA
  clearFailedLogins(user.email);

  // Update last login
  const clientIP = getClientIP(req);
  await pool.query(
    'UPDATE users SET last_login_at = CURRENT_TIMESTAMP, last_login_ip = $1 WHERE id = $2',
    [clientIP, user.id]
  );

  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email, userType: user.user_type },
    EFFECTIVE_JWT_SECRET,
    { expiresIn: rememberMe ? '30d' : '1d' }
  );

  await logAuditEvent('LOGIN_SUCCESS_2FA', user.id, {}, req);
  secureLog('info', '2FA login successful', { userId: user.id, requestId: req.id });

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

// ============================================
// USER PROFILE ENDPOINTS
// ============================================

// Search users (for messaging)
app.get('/api/users/search', authenticateToken, searchLimiter, asyncHandler(async (req, res) => {
  const { q } = req.query;
  const currentUserId = req.user.userId;

  if (!q || q.length < 2) {
    return res.json({ users: [] });
  }

  // Search by name or email (exclude current user)
  const result = await pool.query(`
    SELECT id, name, user_type, avatar_url
    FROM users
    WHERE id != $1
      AND (
        LOWER(name) LIKE LOWER($2)
        OR LOWER(email) LIKE LOWER($2)
      )
    ORDER BY name ASC
    LIMIT 20
  `, [currentUserId, `%${q}%`]);

  res.json({ success: true, users: result.rows });
}));

// Get user profile
app.get('/api/user/profile', authenticateToken, asyncHandler(async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, email, user_type, profile_data, avatar_url, location, bio, website, created_at FROM users WHERE id = $1',
    [req.user.userId]
  );

  if (result.rows.length === 0) {
    throw ApiError.notFound('User not found');
  }

  res.json({ success: true, user: result.rows[0] });
}));

// Update user profile
app.put('/api/user/profile', authenticateToken, validators.updateProfileValidator, asyncHandler(async (req, res) => {
  const { name, profileData, location, bio, website, avatarUrl } = req.body;

  const result = await pool.query(
    `UPDATE users SET
      name = COALESCE($1, name),
      profile_data = COALESCE($2, profile_data),
      location = COALESCE($3, location),
      bio = COALESCE($4, bio),
      website = COALESCE($5, website),
      avatar_url = COALESCE($6, avatar_url),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING id, name, email, user_type, profile_data, location, bio, website, avatar_url`,
    [name, JSON.stringify(profileData), location, bio, website, avatarUrl, req.user.userId]
  );

  res.json({ success: true, user: result.rows[0] });
}));

// Save onboarding data
app.post('/api/user/onboarding', authenticateToken, asyncHandler(async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userId = req.user.userId;
    const { socialAccounts, location, bio, website, ...otherData } = req.body;

    // Update user profile
    await client.query(
      `UPDATE users SET
        profile_data = $1,
        location = COALESCE($2, location),
        bio = COALESCE($3, bio),
        website = COALESCE($4, website),
        updated_at = NOW()
      WHERE id = $5`,
      [JSON.stringify(otherData), location, bio, website, userId]
    );

    // Save social accounts
    if (socialAccounts && typeof socialAccounts === 'object') {
      for (const [platform, username] of Object.entries(socialAccounts)) {
        if (username && username.trim()) {
          await client.query(
            `INSERT INTO social_accounts (user_id, platform, username, created_at, updated_at)
             VALUES ($1, $2, $3, NOW(), NOW())
             ON CONFLICT (user_id, platform)
             DO UPDATE SET username = $3, updated_at = NOW()`,
            [userId, platform.toLowerCase(), username.trim()]
          );
        }
      }
    }

    await client.query('COMMIT');

    const result = await client.query(
      'SELECT id, name, email, user_type, profile_data FROM users WHERE id = $1',
      [userId]
    );

    secureLog('info', 'Onboarding completed', { userId, requestId: req.id });

    res.json({
      success: true,
      message: 'Onboarding data saved successfully',
      user: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

// ============================================
// SOCIAL ACCOUNTS ENDPOINTS
// ============================================

// Get user's connected social accounts
app.get('/api/user/social-accounts', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT platform, username, stats, last_synced_at, is_verified, created_at 
       FROM social_accounts 
       WHERE user_id = $1 
       ORDER BY created_at ASC`,
      [req.user.userId]
    );
    
    res.json({ 
      success: true,
      accounts: result.rows 
    });
    
  } catch (error) {
    console.error('Social accounts fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Disconnect a social media account
app.delete('/api/social/disconnect/:platform', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.params;
    
    const result = await pool.query(
      'DELETE FROM social_accounts WHERE user_id = $1 AND platform = $2 RETURNING platform',
      [req.user.userId, platform.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Social account not found' });
    }
    
    console.log(`✅ Disconnected ${platform} account for user ${req.user.userId}`);
    
    res.json({ 
      success: true,
      message: `${platform} account disconnected successfully`
    });
    
  } catch (error) {
    console.error('Social account disconnect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// OAUTH INITIATION ENDPOINTS
// ============================================

// Check if OAuth is configured for a platform
app.get('/api/oauth/status', (req, res) => {
  const status = {
    twitter: !!OAUTH_CONFIG.twitter.clientId,
    instagram: !!OAUTH_CONFIG.instagram.clientId,
    tiktok: !!OAUTH_CONFIG.tiktok.clientId,
    bluesky: true // Always available (no OAuth needed)
  };
  
  res.json({ success: true, configured: status });
});

// Twitter OAuth - Initiate
app.get('/api/oauth/twitter/authorize', authenticateTokenFlexible, (req, res) => {
  if (!OAUTH_CONFIG.twitter.clientId) {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_not_configured&platform=twitter`);
  }

  const state = generateOAuthState();
  const { verifier, challenge } = generatePKCE();
  
  oauthStates.set(state, {
    userId: req.user.userId,
    verifier,
    platform: 'twitter',
    timestamp: Date.now()
  });

  setTimeout(() => oauthStates.delete(state), 10 * 60 * 1000);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: OAUTH_CONFIG.twitter.clientId,
    redirect_uri: OAUTH_CONFIG.twitter.redirectUri,
    scope: OAUTH_CONFIG.twitter.scopes.join(' '),
    state: state,
    code_challenge: challenge,
    code_challenge_method: 'S256'
  });

  res.redirect(`${OAUTH_CONFIG.twitter.authUrl}?${params}`);
});

// Instagram OAuth - Initiate
app.get('/api/oauth/instagram/authorize', authenticateTokenFlexible, (req, res) => {
  if (!OAUTH_CONFIG.instagram.clientId) {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_not_configured&platform=instagram`);
  }

  const state = generateOAuthState();
  
  oauthStates.set(state, {
    userId: req.user.userId,
    platform: 'instagram',
    timestamp: Date.now()
  });

  setTimeout(() => oauthStates.delete(state), 10 * 60 * 1000);

  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.instagram.clientId,
    redirect_uri: OAUTH_CONFIG.instagram.redirectUri,
    scope: OAUTH_CONFIG.instagram.scopes.join(','),
    response_type: 'code',
    state: state
  });

  res.redirect(`${OAUTH_CONFIG.instagram.authUrl}?${params}`);
});

// TikTok OAuth - Initiate
app.get('/api/oauth/tiktok/authorize', authenticateTokenFlexible, (req, res) => {
  if (!OAUTH_CONFIG.tiktok.clientId) {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_not_configured&platform=tiktok`);
  }

  const state = generateOAuthState();
  
  oauthStates.set(state, {
    userId: req.user.userId,
    platform: 'tiktok',
    timestamp: Date.now()
  });

  setTimeout(() => oauthStates.delete(state), 10 * 60 * 1000);

  const params = new URLSearchParams({
    client_key: OAUTH_CONFIG.tiktok.clientId,
    redirect_uri: OAUTH_CONFIG.tiktok.redirectUri,
    response_type: 'code',
    scope: OAUTH_CONFIG.tiktok.scopes.join(','),
    state: state
  });

  res.redirect(`${OAUTH_CONFIG.tiktok.authUrl}?${params}`);
});

// YouTube OAuth - Authorize
app.get('/api/oauth/youtube/authorize', authenticateTokenFlexible, (req, res) => {
  if (!OAUTH_CONFIG.youtube.clientId) {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_not_configured&platform=youtube`);
  }

  const state = generateOAuthState();
  
  oauthStates.set(state, {
    userId: req.user.userId,
    platform: 'youtube',
    timestamp: Date.now()
  });

  setTimeout(() => oauthStates.delete(state), 10 * 60 * 1000);

  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.youtube.clientId,
    redirect_uri: OAUTH_CONFIG.youtube.redirectUri,
    response_type: 'code',
    scope: OAUTH_CONFIG.youtube.scopes.join(' '),
    state: state,
    access_type: 'offline',
    prompt: 'consent'
  });

  res.redirect(`${OAUTH_CONFIG.youtube.authUrl}?${params}`);
});

// ============================================
// OAUTH CALLBACK ENDPOINTS
// ============================================

// FRONTEND_URL is defined at the top of the file

// Twitter OAuth - Callback
app.get('/api/oauth/twitter/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_denied&platform=twitter`);
  }

  const stateData = oauthStates.get(state);
  if (!stateData || stateData.platform !== 'twitter') {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=invalid_state`);
  }

  oauthStates.delete(state);

  try {
    const auth = Buffer.from(`${OAUTH_CONFIG.twitter.clientId}:${OAUTH_CONFIG.twitter.clientSecret}`).toString('base64');
    
    const tokenResponse = await fetch(OAUTH_CONFIG.twitter.tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: OAUTH_CONFIG.twitter.redirectUri,
        code_verifier: stateData.verifier
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed');
    }

    const tokens = await tokenResponse.json();

    const userResponse = await fetch(`${OAUTH_CONFIG.twitter.userUrl}?user.fields=public_metrics,username,name,profile_image_url,description`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    const userData = await userResponse.json();
    const username = '@' + userData.data.username;
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
    
    // Extract and store public metrics (follower count, etc.)
    const metrics = userData.data.public_metrics || {};
    const engagementRate = metrics.followers_count > 0 
      ? ((metrics.tweet_count / metrics.followers_count) * 10).toFixed(2)
      : 0;
    
    const stats = {
      followers: metrics.followers_count || 0,
      following: metrics.following_count || 0,
      tweets: metrics.tweet_count || 0,
      engagementRate: parseFloat(engagementRate),
      displayName: userData.data.name || username,
      profileImage: userData.data.profile_image_url || null,
      bio: userData.data.description || null
    };
    
    // Encrypt tokens before storing
    const encryptedAccessToken = encryptToken(tokens.access_token);
    const encryptedRefreshToken = encryptToken(tokens.refresh_token);
    
    await pool.query(
      `INSERT INTO social_accounts 
        (user_id, platform, username, platform_user_id, access_token, refresh_token, token_expires_at, is_verified, stats, last_synced_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, $8, NOW(), NOW(), NOW())
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET 
         username = $3,
         platform_user_id = $4,
         access_token = $5,
         refresh_token = $6,
         token_expires_at = $7,
         is_verified = TRUE,
         stats = $8,
         last_synced_at = NOW(),
         updated_at = NOW()`,
      [stateData.userId, 'twitter', username, userData.data.id, encryptedAccessToken, encryptedRefreshToken, expiresAt, JSON.stringify(stats)]
    );

    console.log(`✅ Twitter connected for user ${stateData.userId}: ${username} (${stats.followers} followers)`);

    res.redirect(`${FRONTEND_URL}/dashboard.html?oauth=success&platform=twitter`);
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_failed&platform=twitter`);
  }
});

// Instagram OAuth - Callback
app.get('/api/oauth/instagram/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_denied&platform=instagram`);
  }

  const stateData = oauthStates.get(state);
  if (!stateData || stateData.platform !== 'instagram') {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=invalid_state`);
  }

  oauthStates.delete(state);

  try {
    const tokenResponse = await fetch(OAUTH_CONFIG.instagram.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: OAUTH_CONFIG.instagram.clientId,
        client_secret: OAUTH_CONFIG.instagram.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: OAUTH_CONFIG.instagram.redirectUri,
        code
      })
    });

    const tokens = await tokenResponse.json();

    if (tokens.error_message) {
      throw new Error(tokens.error_message);
    }

    const userResponse = await fetch(
      `${OAUTH_CONFIG.instagram.userUrl}?fields=id,username&access_token=${tokens.access_token}`
    );

    const userData = await userResponse.json();
    const username = '@' + userData.username;
    const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days

    // Encrypt token before storing
    const encryptedAccessToken = encryptToken(tokens.access_token);

    await pool.query(
      `INSERT INTO social_accounts 
        (user_id, platform, username, platform_user_id, access_token, token_expires_at, is_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW(), NOW())
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET 
         username = $3,
         platform_user_id = $4,
         access_token = $5,
         token_expires_at = $6,
         is_verified = TRUE,
         updated_at = NOW()`,
      [stateData.userId, 'instagram', username, userData.id, encryptedAccessToken, expiresAt]
    );

    console.log(`✅ Instagram connected for user ${stateData.userId}: ${username}`);

    res.redirect(`${FRONTEND_URL}/dashboard.html?oauth=success&platform=instagram`);
  } catch (error) {
    console.error('Instagram OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_failed&platform=instagram`);
  }
});

// TikTok OAuth - Callback
app.get('/api/oauth/tiktok/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_denied&platform=tiktok`);
  }

  const stateData = oauthStates.get(state);
  if (!stateData || stateData.platform !== 'tiktok') {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=invalid_state`);
  }

  oauthStates.delete(state);

  try {
    const tokenResponse = await fetch(OAUTH_CONFIG.tiktok.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: OAUTH_CONFIG.tiktok.clientId,
        client_secret: OAUTH_CONFIG.tiktok.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: OAUTH_CONFIG.tiktok.redirectUri
      })
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      throw new Error(tokens.error_description || tokens.error);
    }

    const userResponse = await fetch(OAUTH_CONFIG.tiktok.userUrl, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    const userData = await userResponse.json();
    const username = '@' + userData.data.user.display_name;
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    // Encrypt tokens before storing
    const encryptedAccessToken = encryptToken(tokens.access_token);
    const encryptedRefreshToken = encryptToken(tokens.refresh_token);

    await pool.query(
      `INSERT INTO social_accounts 
        (user_id, platform, username, access_token, refresh_token, token_expires_at, is_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW(), NOW())
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET 
         username = $3,
         access_token = $4,
         refresh_token = $5,
         token_expires_at = $6,
         is_verified = TRUE,
         updated_at = NOW()`,
      [stateData.userId, 'tiktok', username, encryptedAccessToken, encryptedRefreshToken, expiresAt]
    );

    console.log(`✅ TikTok connected for user ${stateData.userId}: ${username}`);

    res.redirect(`${FRONTEND_URL}/dashboard.html?oauth=success&platform=tiktok`);
  } catch (error) {
    console.error('TikTok OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_failed&platform=tiktok`);
  }
});

// YouTube OAuth - Callback
app.get('/api/oauth/youtube/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_denied&platform=youtube`);
  }

  const stateData = oauthStates.get(state);
  if (!stateData || stateData.platform !== 'youtube') {
    return res.redirect(`${FRONTEND_URL}/dashboard.html?error=invalid_state`);
  }

  oauthStates.delete(state);

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(OAUTH_CONFIG.youtube.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: OAUTH_CONFIG.youtube.clientId,
        client_secret: OAUTH_CONFIG.youtube.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: OAUTH_CONFIG.youtube.redirectUri
      })
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      throw new Error(tokens.error_description || tokens.error);
    }

    // Get the user's YouTube channel info
    const channelResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`
        }
      }
    );

    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('No YouTube channel found for this account');
    }

    const channel = channelData.items[0];
    const username = channel.snippet.title;
    const channelId = channel.id;
    const stats = {
      subscribers: parseInt(channel.statistics.subscriberCount) || 0,
      views: parseInt(channel.statistics.viewCount) || 0,
      videos: parseInt(channel.statistics.videoCount) || 0,
      hiddenSubscriberCount: channel.statistics.hiddenSubscriberCount || false
    };

    const expiresAt = new Date(Date.now() + (tokens.expires_in || 3600) * 1000);

    // Encrypt tokens before storing
    const encryptedAccessToken = encryptToken(tokens.access_token);
    const encryptedRefreshToken = encryptToken(tokens.refresh_token);

    await pool.query(
      `INSERT INTO social_accounts 
        (user_id, platform, username, platform_user_id, access_token, refresh_token, token_expires_at, stats, is_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, NOW(), NOW())
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET 
         username = $3,
         platform_user_id = $4,
         access_token = $5,
         refresh_token = $6,
         token_expires_at = $7,
         stats = $8,
         is_verified = TRUE,
         updated_at = NOW()`,
      [stateData.userId, 'youtube', username, channelId, encryptedAccessToken, encryptedRefreshToken, expiresAt, JSON.stringify(stats)]
    );

    console.log(`✅ YouTube connected for user ${stateData.userId}: ${username} (${stats.subscribers} subscribers)`);

    res.redirect(`${FRONTEND_URL}/dashboard.html?oauth=success&platform=youtube`);
  } catch (error) {
    console.error('YouTube OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/dashboard.html?error=oauth_failed&platform=youtube&message=${encodeURIComponent(error.message)}`);
  }
});

// ============================================
// BLUESKY (SIMPLE VERIFICATION - NO OAUTH)
// ============================================

// Connect Bluesky account
app.post('/api/social/bluesky/connect', authenticateToken, async (req, res) => {
  try {
    const { handle } = req.body;
    
    if (!handle) {
      return res.status(400).json({ error: 'Bluesky handle is required' });
    }
    
    let cleanHandle = handle.trim();
    if (cleanHandle.startsWith('@')) {
      cleanHandle = cleanHandle.substring(1);
    }
    if (!cleanHandle.includes('.')) {
      cleanHandle = `${cleanHandle}.bsky.social`;
    }
    
    // Verify account exists
    const profileUrl = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${cleanHandle}`;
    const response = await fetch(profileUrl);
    
    if (!response.ok) {
      return res.status(404).json({ error: 'Bluesky account not found' });
    }
    
    const profileData = await response.json();
    
    const engagementRate = profileData.followersCount > 0
      ? ((profileData.postsCount / profileData.followersCount) * 10).toFixed(2)
      : 0;
    
    const stats = {
      followers: profileData.followersCount || 0,
      following: profileData.followsCount || 0,
      posts: profileData.postsCount || 0,
      engagementRate: parseFloat(engagementRate),
      displayName: profileData.displayName || cleanHandle,
      avatar: profileData.avatar || null,
      description: profileData.description || null
    };
    
    await pool.query(
      `INSERT INTO social_accounts 
        (user_id, platform, username, stats, last_synced_at, is_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), TRUE, NOW(), NOW())
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET 
         username = $3,
         stats = $4,
         last_synced_at = NOW(),
         is_verified = TRUE,
         updated_at = NOW()`,
      [req.user.userId, 'bluesky', '@' + cleanHandle, JSON.stringify(stats)]
    );
    
    console.log(`✅ Bluesky connected for user ${req.user.userId}: @${cleanHandle}`);
    
    res.json({
      success: true,
      platform: 'bluesky',
      username: '@' + cleanHandle,
      stats,
      message: 'Bluesky account connected successfully'
    });
    
  } catch (error) {
    console.error('Bluesky connect error:', error);
    res.status(500).json({ 
      error: 'Failed to connect Bluesky account',
      message: error.message 
    });
  }
});

// Get Bluesky stats
app.get('/api/social/bluesky/stats', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT username, stats, last_synced_at FROM social_accounts WHERE user_id = $1 AND platform = $2',
      [req.user.userId, 'bluesky']
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bluesky account not connected' });
    }
    
    const account = result.rows[0];
    let handle = account.username.replace('@', '');
    
    const profileUrl = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`;
    const response = await fetch(profileUrl);
    
    if (!response.ok) {
      throw new Error(`Bluesky API error: ${response.status}`);
    }
    
    const profileData = await response.json();
    
    const engagementRate = profileData.followersCount > 0
      ? ((profileData.postsCount / profileData.followersCount) * 10).toFixed(2)
      : 0;
    
    const stats = {
      followers: profileData.followersCount || 0,
      following: profileData.followsCount || 0,
      posts: profileData.postsCount || 0,
      engagementRate: parseFloat(engagementRate),
      displayName: profileData.displayName || handle,
      avatar: profileData.avatar || null,
      description: profileData.description || null
    };
    
    await pool.query(
      `UPDATE social_accounts 
       SET stats = $1, last_synced_at = NOW(), updated_at = NOW()
       WHERE user_id = $2 AND platform = 'bluesky'`,
      [JSON.stringify(stats), req.user.userId]
    );
    
    res.json({
      success: true,
      platform: 'bluesky',
      username: '@' + handle,
      stats,
      fetchedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Bluesky stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Bluesky stats',
      message: error.message 
    });
  }
});

// ============================================
// TWITTER STATS (OAuth-based)
// ============================================

app.get('/api/social/twitter/stats', authenticateToken, async (req, res) => {
  try {
    const accessToken = await getValidAccessToken(req.user.userId, 'twitter');

    const response = await fetch(
      'https://api.twitter.com/2/users/me?user.fields=public_metrics,username,name,profile_image_url,description',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }

    const data = await response.json();
    const userData = data.data;
    const metrics = userData.public_metrics;

    const engagementRate = metrics.followers_count > 0 
      ? ((metrics.tweet_count / metrics.followers_count) * 10).toFixed(2)
      : 0;

    const stats = {
      followers: metrics.followers_count,
      following: metrics.following_count,
      tweets: metrics.tweet_count,
      engagementRate: parseFloat(engagementRate),
      displayName: userData.name,
      profileImage: userData.profile_image_url,
      bio: userData.description
    };

    await pool.query(
      `UPDATE social_accounts 
       SET stats = $1, last_synced_at = NOW(), updated_at = NOW()
       WHERE user_id = $2 AND platform = 'twitter'`,
      [JSON.stringify(stats), req.user.userId]
    );

    res.json({
      success: true,
      platform: 'twitter',
      username: '@' + userData.username,
      stats,
      fetchedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Twitter stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Twitter stats',
      message: error.message 
    });
  }
});

// YouTube Stats - Refresh
app.get('/api/social/youtube/stats', authenticateToken, async (req, res) => {
  try {
    const accessToken = await getValidAccessToken(req.user.userId, 'youtube');

    const response = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No YouTube channel found');
    }

    const channel = data.items[0];
    const stats = {
      subscribers: parseInt(channel.statistics.subscriberCount) || 0,
      followers: parseInt(channel.statistics.subscriberCount) || 0, // Alias for consistency
      views: parseInt(channel.statistics.viewCount) || 0,
      videos: parseInt(channel.statistics.videoCount) || 0,
      hiddenSubscriberCount: channel.statistics.hiddenSubscriberCount || false,
      displayName: channel.snippet.title,
      profileImage: channel.snippet.thumbnails?.default?.url,
      description: channel.snippet.description
    };

    await pool.query(
      `UPDATE social_accounts 
       SET stats = $1, last_synced_at = NOW(), updated_at = NOW()
       WHERE user_id = $2 AND platform = 'youtube'`,
      [JSON.stringify(stats), req.user.userId]
    );

    res.json({
      success: true,
      platform: 'youtube',
      username: channel.snippet.title,
      stats,
      fetchedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('YouTube stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch YouTube stats',
      message: error.message 
    });
  }
});

// ============================================
// OPPORTUNITIES ENDPOINTS
// ============================================

// Get opportunities
app.get('/api/opportunities', async (req, res) => {
  try {
    const { type, industry, status = 'active', limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT o.*, u.name as created_by_name 
      FROM opportunities o 
      LEFT JOIN users u ON o.created_by = u.id 
      WHERE o.status = $1
    `;
    const params = [status];
    let paramCount = 1;

    if (type) {
      paramCount++;
      query += ` AND o.type = $${paramCount}`;
      params.push(type);
    }

    if (industry) {
      paramCount++;
      query += ` AND o.industry = $${paramCount}`;
      params.push(industry);
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    
    res.json({ 
      success: true,
      opportunities: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Opportunities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single opportunity
app.get('/api/opportunities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT o.*, u.name as created_by_name 
       FROM opportunities o 
       LEFT JOIN users u ON o.created_by = u.id 
       WHERE o.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    
    // Increment view count
    await pool.query(
      'UPDATE opportunities SET views_count = views_count + 1 WHERE id = $1',
      [id]
    );
    
    res.json({ success: true, opportunity: result.rows[0] });
  } catch (error) {
    console.error('Opportunity fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create opportunity
app.post('/api/opportunities', authenticateToken, async (req, res) => {
  try {
    const { title, description, type, industry, budgetRange, budgetMin, budgetMax, requirements, platforms, deadline } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    const result = await pool.query(
      `INSERT INTO opportunities 
        (title, description, type, industry, budget_range, budget_min, budget_max, requirements, platforms, deadline, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [title, description, type, industry, budgetRange, budgetMin, budgetMax, 
       JSON.stringify(requirements || []), JSON.stringify(platforms || []), deadline, req.user.userId]
    );

    console.log(`✅ New opportunity created: ${title}`);

    res.status(201).json({ success: true, opportunity: result.rows[0] });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Apply to opportunity
app.post('/api/opportunities/:id/apply', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { message, proposedRate, portfolioLinks } = req.body;

    const existingApplication = await pool.query(
      'SELECT id FROM applications WHERE user_id = $1 AND opportunity_id = $2',
      [req.user.userId, id]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ error: 'Already applied to this opportunity' });
    }

    const result = await pool.query(
      `INSERT INTO applications (user_id, opportunity_id, message, proposed_rate, portfolio_links) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [req.user.userId, id, message, proposedRate, JSON.stringify(portfolioLinks || [])]
    );

    // Update applications count
    await pool.query(
      'UPDATE opportunities SET applications_count = applications_count + 1 WHERE id = $1',
      [id]
    );

    console.log(`✅ Application submitted for opportunity ${id} by user ${req.user.userId}`);

    res.status(201).json({ success: true, application: result.rows[0] });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// NOTIFICATIONS ENDPOINTS
// ============================================

// Get user notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, unread_only = false } = req.query;
    
    let query = 'SELECT * FROM notifications WHERE user_id = $1';
    const params = [req.user.userId];
    
    if (unread_only === 'true') {
      query += ' AND is_read = FALSE';
    }
    
    query += ' ORDER BY created_at DESC LIMIT $2';
    params.push(parseInt(limit));
    
    const result = await pool.query(query, params);
    
    // Get unread count
    const unreadResult = await pool.query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE',
      [req.user.userId]
    );
    
    res.json({ 
      success: true,
      notifications: result.rows,
      unreadCount: parseInt(unreadResult.rows[0].count)
    });
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all notifications as read
app.put('/api/notifications/read-all', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE user_id = $1 AND is_read = FALSE',
      [req.user.userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// MESSAGING ENDPOINTS
// ============================================

// Get all conversations for current user
app.get('/api/messages/conversations', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Get all conversations where user is a participant
  const result = await pool.query(`
    SELECT
      c.id,
      c.created_at,
      c.updated_at,
      CASE
        WHEN c.user1_id = $1 THEN c.user2_id
        ELSE c.user1_id
      END as other_user_id,
      CASE
        WHEN c.user1_id = $1 THEN u2.name
        ELSE u1.name
      END as other_user_name,
      CASE
        WHEN c.user1_id = $1 THEN u2.user_type
        ELSE u1.user_type
      END as other_user_type,
      CASE
        WHEN c.user1_id = $1 THEN u2.avatar_url
        ELSE u1.avatar_url
      END as other_user_avatar,
      (
        SELECT content FROM messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC LIMIT 1
      ) as last_message_preview,
      (
        SELECT created_at FROM messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC LIMIT 1
      ) as last_message_at,
      (
        SELECT COUNT(*) FROM messages
        WHERE conversation_id = c.id
          AND receiver_id = $1
          AND is_read = FALSE
      )::int as unread_count
    FROM conversations c
    JOIN users u1 ON c.user1_id = u1.id
    JOIN users u2 ON c.user2_id = u2.id
    WHERE c.user1_id = $1 OR c.user2_id = $1
    ORDER BY c.updated_at DESC
  `, [userId]);

  // Transform to include unread boolean
  const conversations = result.rows.map(conv => ({
    ...conv,
    unread: conv.unread_count > 0
  }));

  res.json({ success: true, conversations });
}));

// Get messages for a specific conversation
app.get('/api/messages/conversation/:conversationId', authenticateToken, asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.userId;

  // Verify user is part of this conversation
  const convCheck = await pool.query(
    'SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)',
    [conversationId, userId]
  );

  if (convCheck.rows.length === 0) {
    throw ApiError.forbidden('Access denied to this conversation');
  }

  // Get messages
  const result = await pool.query(`
    SELECT
      m.id,
      m.sender_id,
      m.receiver_id,
      m.content,
      m.is_read,
      m.created_at,
      u.name as sender_name
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = $1
    ORDER BY m.created_at ASC
  `, [conversationId]);

  // Mark messages as read
  await pool.query(`
    UPDATE messages
    SET is_read = TRUE, read_at = NOW()
    WHERE conversation_id = $1 AND receiver_id = $2 AND is_read = FALSE
  `, [conversationId, userId]);

  res.json({ success: true, messages: result.rows });
}));

// Send a message
app.post('/api/messages', authenticateToken, messageLimiter, validators.sendMessageValidator, asyncHandler(async (req, res) => {
  const { receiverId, content, conversationId } = req.body;
  const senderId = req.user.userId;

  let finalConversationId = conversationId;
  let finalReceiverId = receiverId;

  // If conversationId provided, get receiver from conversation
  if (conversationId && !receiverId) {
    const convResult = await pool.query(
      'SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)',
      [conversationId, senderId]
    );

    if (convResult.rows.length === 0) {
      throw ApiError.forbidden('Access denied to this conversation');
    }

    const conv = convResult.rows[0];
    finalReceiverId = conv.user1_id === senderId ? conv.user2_id : conv.user1_id;
  }

  // If no conversationId, find or create conversation
  if (!finalConversationId) {
    // Check for existing conversation
    const existingConv = await pool.query(`
      SELECT id FROM conversations
      WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)
    `, [senderId, finalReceiverId]);

    if (existingConv.rows.length > 0) {
      finalConversationId = existingConv.rows[0].id;
    } else {
      // Create new conversation
      const newConv = await pool.query(`
        INSERT INTO conversations (user1_id, user2_id)
        VALUES ($1, $2)
        RETURNING id
      `, [senderId, finalReceiverId]);
      finalConversationId = newConv.rows[0].id;
    }
  }

  // Insert message
  const result = await pool.query(`
    INSERT INTO messages (conversation_id, sender_id, receiver_id, content)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [finalConversationId, senderId, finalReceiverId, content.trim()]);

  // Update conversation timestamp
  await pool.query(
    'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
    [finalConversationId]
  );

  // Create notification for receiver
  await pool.query(`
    INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
    VALUES ($1, 'message', 'New Message', $2, $3, 'message')
  `, [finalReceiverId, 'You have a new message', result.rows[0].id]);

  res.json({
    success: true,
    message: result.rows[0],
    conversationId: finalConversationId
  });
}));

// Start a new conversation (or get existing one)
app.post('/api/messages/start-conversation', authenticateToken, conversationLimiter, validators.startConversationValidator, asyncHandler(async (req, res) => {
  const { userId: otherUserId, initialMessage } = req.body;
  const currentUserId = req.user.userId;

  if (otherUserId === currentUserId) {
    throw ApiError.badRequest('Cannot start conversation with yourself');
  }

  // Check if user exists
  const userCheck = await pool.query('SELECT id, name FROM users WHERE id = $1', [otherUserId]);
  if (userCheck.rows.length === 0) {
    throw ApiError.notFound('User not found');
  }

  // Find or create conversation
  let conversation;
  const existingConv = await pool.query(`
    SELECT * FROM conversations
    WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)
  `, [currentUserId, otherUserId]);

  if (existingConv.rows.length > 0) {
    conversation = existingConv.rows[0];
  } else {
    const newConv = await pool.query(`
      INSERT INTO conversations (user1_id, user2_id)
      VALUES ($1, $2)
      RETURNING *
    `, [currentUserId, otherUserId]);
    conversation = newConv.rows[0];
  }

  // If initial message provided, send it
  if (initialMessage && initialMessage.trim()) {
    await pool.query(`
      INSERT INTO messages (conversation_id, sender_id, receiver_id, content)
      VALUES ($1, $2, $3, $4)
    `, [conversation.id, currentUserId, otherUserId, initialMessage.trim()]);

    await pool.query(
      'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
      [conversation.id]
    );
  }

  res.json({
    success: true,
    conversationId: conversation.id,
    otherUser: userCheck.rows[0]
  });
}));

// Get unread message count
app.get('/api/messages/unread-count', authenticateToken, asyncHandler(async (req, res) => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM messages WHERE receiver_id = $1 AND is_read = FALSE',
    [req.user.userId]
  );

  res.json({
    success: true,
    unreadCount: parseInt(result.rows[0].count)
  });
}));

// Mark conversation messages as read
app.put('/api/messages/conversation/:conversationId/read', authenticateToken, asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.userId;

  await pool.query(`
    UPDATE messages
    SET is_read = TRUE, read_at = NOW()
    WHERE conversation_id = $1 AND receiver_id = $2 AND is_read = FALSE
  `, [conversationId, userId]);

  res.json({ success: true });
}));

// ============================================
// STATIC FILE SERVING
// ============================================

// Note: Static files served via express.static() earlier
// SPA catch-all at the end handles React client-side routing

// ============================================
// BRAND DASHBOARD ENDPOINTS
// ============================================

// Get brand's own opportunities
app.get('/api/brand/opportunities', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT o.*, 
        (SELECT COUNT(*) FROM applications WHERE opportunity_id = o.id) as applications_count
      FROM opportunities o 
      WHERE o.created_by = $1
    `;
    const params = [req.user.userId];
    
    if (status) {
      query += ` AND o.status = $2`;
      params.push(status);
    }
    
    query += ` ORDER BY o.created_at DESC`;
    
    const result = await pool.query(query, params);
    
    res.json({ 
      success: true,
      opportunities: result.rows
    });
  } catch (error) {
    console.error('Brand opportunities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update opportunity (brand only)
app.put('/api/brand/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, industry, budgetRange, status } = req.body;
    
    // Verify ownership
    const ownership = await pool.query(
      'SELECT id FROM opportunities WHERE id = $1 AND created_by = $2',
      [id, req.user.userId]
    );
    
    if (ownership.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to edit this opportunity' });
    }
    
    const result = await pool.query(
      `UPDATE opportunities 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           type = COALESCE($3, type),
           industry = COALESCE($4, industry),
           budget_range = COALESCE($5, budget_range),
           status = COALESCE($6, status),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, description, type, industry, budgetRange, status, id]
    );
    
    res.json({ success: true, opportunity: result.rows[0] });
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete opportunity (brand only)
app.delete('/api/brand/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const result = await pool.query(
      'DELETE FROM opportunities WHERE id = $1 AND created_by = $2 RETURNING id',
      [id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete this opportunity' });
    }
    
    res.json({ success: true, message: 'Opportunity deleted' });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all applications for brand's opportunities
app.get('/api/brand/applications', authenticateToken, async (req, res) => {
  try {
    const { status, opportunityId } = req.query;
    
    let query = `
      SELECT 
        a.*,
        o.title as opportunity_title,
        o.type as opportunity_type,
        o.budget_range,
        u.id as applicant_id,
        u.name as applicant_name,
        u.email as applicant_email,
        u.user_type as applicant_type,
        u.avatar_url as applicant_avatar,
        u.bio as applicant_bio,
        u.location as applicant_location,
        (
          SELECT json_agg(json_build_object(
            'platform', sa.platform,
            'username', sa.username,
            'stats', sa.stats,
            'is_verified', sa.is_verified
          ))
          FROM social_accounts sa
          WHERE sa.user_id = u.id
        ) as applicant_social_accounts
      FROM applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      JOIN users u ON a.user_id = u.id
      WHERE o.created_by = $1
    `;
    const params = [req.user.userId];
    let paramCount = 1;
    
    if (status) {
      paramCount++;
      query += ` AND a.status = $${paramCount}`;
      params.push(status);
    }
    
    if (opportunityId) {
      paramCount++;
      query += ` AND a.opportunity_id = $${paramCount}`;
      params.push(opportunityId);
    }
    
    query += ` ORDER BY a.created_at DESC`;
    
    const result = await pool.query(query, params);
    
    res.json({ 
      success: true,
      applications: result.rows
    });
  } catch (error) {
    console.error('Brand applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single application details
app.get('/api/brand/applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        a.*,
        o.title as opportunity_title,
        o.type as opportunity_type,
        o.budget_range,
        o.description as opportunity_description,
        u.id as applicant_id,
        u.name as applicant_name,
        u.email as applicant_email,
        u.user_type as applicant_type,
        u.avatar_url as applicant_avatar,
        u.bio as applicant_bio,
        u.location as applicant_location,
        u.website as applicant_website,
        (
          SELECT json_agg(json_build_object(
            'platform', sa.platform,
            'username', sa.username,
            'stats', sa.stats,
            'is_verified', sa.is_verified
          ))
          FROM social_accounts sa
          WHERE sa.user_id = u.id
        ) as applicant_social_accounts
      FROM applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      JOIN users u ON a.user_id = u.id
      WHERE a.id = $1 AND o.created_by = $2
    `, [id, req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ success: true, application: result.rows[0] });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Accept application (creates collaboration)
app.post('/api/brand/applications/:id/accept', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { agreedRate, notes } = req.body;
    
    await client.query('BEGIN');
    
    // Get application and verify ownership
    const appResult = await client.query(`
      SELECT a.*, o.created_by as brand_id, o.title as opportunity_title
      FROM applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      WHERE a.id = $1 AND o.created_by = $2
    `, [id, req.user.userId]);
    
    if (appResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const application = appResult.rows[0];
    
    if (application.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Application already processed' });
    }
    
    // Update application status
    await client.query(
      `UPDATE applications SET status = 'accepted', responded_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [id]
    );
    
    // Create collaboration
    const collabResult = await client.query(
      `INSERT INTO collaborations 
        (opportunity_id, brand_id, influencer_id, application_id, agreed_rate, notes, started_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [application.opportunity_id, req.user.userId, application.user_id, id, agreedRate || application.proposed_rate, notes]
    );
    
    // Create or get conversation
    const existingConvo = await client.query(
      `SELECT id FROM conversations 
       WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`,
      [req.user.userId, application.user_id]
    );
    
    let conversationId;
    if (existingConvo.rows.length > 0) {
      conversationId = existingConvo.rows[0].id;
    } else {
      const newConvo = await client.query(
        `INSERT INTO conversations (user1_id, user2_id) VALUES ($1, $2) RETURNING id`,
        [req.user.userId, application.user_id]
      );
      conversationId = newConvo.rows[0].id;
    }
    
    // Send automatic message
    await client.query(
      `INSERT INTO messages (conversation_id, sender_id, receiver_id, content)
       VALUES ($1, $2, $3, $4)`,
      [conversationId, req.user.userId, application.user_id, 
       `🎉 Great news! Your application for "${application.opportunity_title}" has been accepted! Let's discuss the details.`]
    );
    
    // Update conversation timestamp
    await client.query(
      `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
      [conversationId]
    );
    
    // Create notification for influencer
    await client.query(
      `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
       VALUES ($1, 'application_accepted', 'Application Accepted!', $2, $3, 'collaboration')`,
      [application.user_id, `Your application for "${application.opportunity_title}" has been accepted!`, collabResult.rows[0].id]
    );
    
    await client.query('COMMIT');
    
    console.log(`✅ Application ${id} accepted, collaboration ${collabResult.rows[0].id} created`);
    
    res.json({ 
      success: true, 
      collaboration: collabResult.rows[0],
      conversationId
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Accept application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Reject application
app.post('/api/brand/applications/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { responseMessage } = req.body;
    
    // Verify ownership
    const appResult = await pool.query(`
      SELECT a.*, o.title as opportunity_title
      FROM applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      WHERE a.id = $1 AND o.created_by = $2
    `, [id, req.user.userId]);
    
    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const application = appResult.rows[0];
    
    // Update application
    await pool.query(
      `UPDATE applications 
       SET status = 'rejected', response_message = $1, responded_at = NOW(), updated_at = NOW() 
       WHERE id = $2`,
      [responseMessage, id]
    );
    
    // Create notification for influencer
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
       VALUES ($1, 'application_rejected', 'Application Update', $2, $3, 'application')`,
      [application.user_id, `Your application for "${application.opportunity_title}" was not selected this time.`, id]
    );
    
    res.json({ success: true, message: 'Application rejected' });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get brand's collaborations
app.get('/api/brand/collaborations', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT 
        c.*,
        o.title as opportunity_title,
        o.type as opportunity_type,
        u.name as influencer_name,
        u.email as influencer_email,
        u.avatar_url as influencer_avatar,
        (
          SELECT json_agg(json_build_object(
            'platform', sa.platform,
            'username', sa.username,
            'stats', sa.stats
          ))
          FROM social_accounts sa
          WHERE sa.user_id = u.id
        ) as influencer_social_accounts
      FROM collaborations c
      LEFT JOIN opportunities o ON c.opportunity_id = o.id
      JOIN users u ON c.influencer_id = u.id
      WHERE c.brand_id = $1
    `;
    const params = [req.user.userId];
    
    if (status) {
      query += ` AND c.status = $2`;
      params.push(status);
    }
    
    query += ` ORDER BY c.created_at DESC`;
    
    const result = await pool.query(query, params);
    
    res.json({ success: true, collaborations: result.rows });
  } catch (error) {
    console.error('Brand collaborations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update collaboration status
app.put('/api/brand/collaborations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const validStatuses = ['accepted', 'in_progress', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await pool.query(
      `UPDATE collaborations 
       SET status = COALESCE($1, status),
           notes = COALESCE($2, notes),
           completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE completed_at END,
           updated_at = NOW()
       WHERE id = $3 AND brand_id = $4
       RETURNING *`,
      [status, notes, id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }
    
    res.json({ success: true, collaboration: result.rows[0] });
  } catch (error) {
    console.error('Update collaboration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get brand dashboard stats
app.get('/api/brand/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get counts
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM opportunities WHERE created_by = $1 AND status = 'active') as active_opportunities,
        (SELECT COUNT(*) FROM applications a JOIN opportunities o ON a.opportunity_id = o.id WHERE o.created_by = $1 AND a.status = 'pending') as pending_applications,
        (SELECT COUNT(*) FROM collaborations WHERE brand_id = $1) as total_collaborations,
        (SELECT COUNT(*) FROM collaborations WHERE brand_id = $1 AND status = 'in_progress') as active_collaborations,
        (SELECT COUNT(*) FROM collaborations WHERE brand_id = $1 AND status = 'completed') as completed_collaborations
    `, [userId]);
    
    res.json({ success: true, stats: stats.rows[0] });
  } catch (error) {
    console.error('Brand stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// INFLUENCER DASHBOARD ENDPOINTS
// ============================================

// Get influencer's applications
app.get('/api/influencer/applications', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT 
        a.*,
        o.title as opportunity_title,
        o.type as opportunity_type,
        o.budget_range,
        o.industry,
        u.name as brand_name,
        u.avatar_url as brand_avatar
      FROM applications a
      JOIN opportunities o ON a.opportunity_id = o.id
      LEFT JOIN users u ON o.created_by = u.id
      WHERE a.user_id = $1
    `;
    const params = [req.user.userId];
    
    if (status) {
      query += ` AND a.status = $2`;
      params.push(status);
    }
    
    query += ` ORDER BY a.created_at DESC`;
    
    const result = await pool.query(query, params);
    
    res.json({ success: true, applications: result.rows });
  } catch (error) {
    console.error('Influencer applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get influencer's collaborations
app.get('/api/influencer/collaborations', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT 
        c.*,
        o.title as opportunity_title,
        o.type as opportunity_type,
        u.name as brand_name,
        u.email as brand_email,
        u.avatar_url as brand_avatar
      FROM collaborations c
      LEFT JOIN opportunities o ON c.opportunity_id = o.id
      JOIN users u ON c.brand_id = u.id
      WHERE c.influencer_id = $1
    `;
    const params = [req.user.userId];
    
    if (status) {
      query += ` AND c.status = $2`;
      params.push(status);
    }
    
    query += ` ORDER BY c.created_at DESC`;
    
    const result = await pool.query(query, params);
    
    res.json({ success: true, collaborations: result.rows });
  } catch (error) {
    console.error('Influencer collaborations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PUBLIC MEDIA KIT ENDPOINTS
// ============================================

// Check username availability
app.get('/api/user/username/check/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Validate username format (alphanumeric, underscores, hyphens, 3-30 chars)
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return res.json({ 
        available: false, 
        error: 'Username must be 3-30 characters and contain only letters, numbers, underscores, or hyphens' 
      });
    }
    
    // Check reserved usernames
    const reserved = ['admin', 'api', 'dashboard', 'profile', 'settings', 'login', 'register', 'kit', 'help', 'support'];
    if (reserved.includes(username.toLowerCase())) {
      return res.json({ available: false, error: 'This username is reserved' });
    }
    
    // Ensure username column exists
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE`);
    } catch (alterError) {
      // Column might already exist or we don't have permissions - that's ok
      console.log('Note: Could not add username column (may already exist)');
    }
    
    const result = await pool.query('SELECT id FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    res.json({ available: result.rows.length === 0 });
  } catch (error) {
    console.error('Username check error:', error);
    // If query fails (column doesn't exist), assume available
    // The save endpoint will do full validation
    res.json({ available: true, note: 'Could not verify, will validate on save' });
  }
});

// Set/update username
app.put('/api/user/username', authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.userId;
    
    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        error: 'Username must be 3-30 characters and contain only letters, numbers, underscores, or hyphens' 
      });
    }
    
    // Check reserved usernames
    const reserved = ['admin', 'api', 'dashboard', 'profile', 'settings', 'login', 'register', 'kit', 'help', 'support'];
    if (reserved.includes(username.toLowerCase())) {
      return res.status(400).json({ error: 'This username is reserved' });
    }
    
    // Ensure username column exists
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE`);
    } catch (alterError) {
      console.log('Note: Could not add username column (may already exist)');
    }
    
    // Check if username is already taken by another user
    const existing = await pool.query(
      'SELECT id FROM users WHERE LOWER(username) = LOWER($1) AND id != $2', 
      [username, userId]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Username is already taken' });
    }
    
    // Update username
    const result = await pool.query(
      'UPDATE users SET username = $1, updated_at = NOW() WHERE id = $2 RETURNING username',
      [username.toLowerCase(), userId]
    );
    
    res.json({ 
      success: true, 
      username: result.rows[0].username,
      kitUrl: `${FRONTEND_URL}/kit.html?u=${result.rows[0].username}`
    });
  } catch (error) {
    console.error('Set username error:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Username is already taken' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user's username
app.get('/api/user/username', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT username FROM users WHERE id = $1', [req.user.userId]);
    res.json({ 
      username: result.rows[0]?.username || null,
      kitUrl: result.rows[0]?.username ? `${FRONTEND_URL}/kit.html?u=${result.rows[0].username}` : null
    });
  } catch (error) {
    console.error('Get username error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUBLIC: Get media kit by username (no authentication required!)
app.get('/api/kit/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find user by username first, then by ID
    let userResult = await pool.query(`
      SELECT 
        id, name, username, user_type, bio, location, website, avatar_url, 
        is_public, created_at, email,
        profile_data
      FROM users 
      WHERE LOWER(username) = LOWER($1)
    `, [identifier]);
    
    // If not found by username, try by ID (for backwards compatibility)
    if (userResult.rows.length === 0 && !isNaN(identifier)) {
      userResult = await pool.query(`
        SELECT 
          id, name, username, user_type, bio, location, website, avatar_url, 
          is_public, created_at, email,
          profile_data
        FROM users 
        WHERE id = $1
      `, [identifier]);
    }
    
    // If still not found, try by name (slug format: john-doe)
    if (userResult.rows.length === 0) {
      const nameFromSlug = identifier.replace(/-/g, ' ');
      userResult = await pool.query(`
        SELECT 
          id, name, username, user_type, bio, location, website, avatar_url, 
          is_public, created_at, email,
          profile_data
        FROM users 
        WHERE LOWER(REPLACE(name, ' ', '-')) = LOWER($1)
           OR LOWER(name) = LOWER($2)
      `, [identifier, nameFromSlug]);
    }
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    // Check if profile is public
    if (user.is_public === false) {
      return res.status(403).json({ error: 'This media kit is private' });
    }
    
    // Get connected social accounts with stats
    const socialResult = await pool.query(`
      SELECT 
        id, platform, username, stats, is_verified, last_synced_at
      FROM social_accounts 
      WHERE user_id = $1
      ORDER BY 
        CASE platform 
          WHEN 'twitter' THEN 1 
          WHEN 'instagram' THEN 2 
          WHEN 'tiktok' THEN 3 
          WHEN 'youtube' THEN 4 
          WHEN 'bluesky' THEN 5 
          ELSE 6 
        END
    `, [user.id]);
    
    // Calculate total followers and average engagement
    let totalFollowers = 0;
    let totalEngagement = 0;
    let engagementCount = 0;
    
    const platforms = socialResult.rows.map(account => {
      const stats = account.stats || {};
      if (stats.followers) totalFollowers += parseInt(stats.followers) || 0;
      if (stats.engagementRate) {
        totalEngagement += parseFloat(stats.engagementRate) || 0;
        engagementCount++;
      }
      
      return {
        platform: account.platform,
        username: account.username,
        followers: stats.followers || 0,
        engagementRate: stats.engagementRate || null,
        isVerified: account.is_verified || false,
        lastSynced: account.last_synced_at
      };
    });
    
    const avgEngagement = engagementCount > 0 ? (totalEngagement / engagementCount).toFixed(2) : null;
    
    // Get collaboration/review stats (optional enhancement)
    let collaborationsCount = 0;
    let averageRating = null;
    
    try {
      const collabResult = await pool.query(`
        SELECT COUNT(*) as count FROM collaborations 
        WHERE influencer_id = $1 AND status = 'completed'
      `, [user.id]);
      collaborationsCount = parseInt(collabResult.rows[0].count) || 0;
      
      const reviewResult = await pool.query(`
        SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews 
        WHERE reviewed_user_id = $1 AND is_public = true
      `, [user.id]);
      if (reviewResult.rows[0].count > 0) {
        averageRating = parseFloat(reviewResult.rows[0].avg_rating).toFixed(1);
      }
    } catch (e) {
      // Tables might not exist, that's okay
    }
    
    res.json({
      success: true,
      kit: {
        name: user.name,
        username: user.username,
        userType: user.user_type,
        bio: user.bio,
        location: user.location,
        website: user.website,
        avatarUrl: user.avatar_url,
        memberSince: user.created_at,
        stats: {
          totalFollowers,
          avgEngagement,
          platformCount: platforms.length,
          collaborationsCompleted: collaborationsCount,
          averageRating
        },
        platforms
      }
    });
  } catch (error) {
    console.error('Get media kit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// CAMPAIGNS API ENDPOINTS
// ============================================

// Get all campaigns for user (as brand owner or participant)
app.get('/api/campaigns', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.userId;
    const userType = req.user.userType;
    
    let query;
    let params = [userId];
    
    if (userType === 'brand') {
      // Brands see campaigns they created
      query = `
        SELECT c.*, 
          (SELECT COUNT(*) FROM campaign_participants WHERE campaign_id = c.id) as participants_count,
          (SELECT COUNT(*) FROM deliverables d 
           JOIN campaign_participants cp ON d.participant_id = cp.id 
           WHERE cp.campaign_id = c.id AND d.status = 'approved') as completed_deliverables
        FROM campaigns c
        WHERE c.brand_id = $1
      `;
      
      if (status && status !== 'all') {
        query += ` AND c.status = $2`;
        params.push(status);
      }
      
      query += ` ORDER BY c.created_at DESC`;
    } else {
      // Influencers/freelancers see campaigns they're participating in
      query = `
        SELECT c.*, cp.status as participant_status, cp.payment_amount, cp.payment_status,
          u.name as brand_name,
          (SELECT COUNT(*) FROM deliverables WHERE participant_id = cp.id) as total_deliverables,
          (SELECT COUNT(*) FROM deliverables WHERE participant_id = cp.id AND status = 'approved') as completed_deliverables
        FROM campaigns c
        JOIN campaign_participants cp ON c.id = cp.campaign_id
        JOIN users u ON c.brand_id = u.id
        WHERE cp.user_id = $1
      `;
      
      if (status && status !== 'all') {
        query += ` AND c.status = $2`;
        params.push(status);
      }
      
      query += ` ORDER BY c.created_at DESC`;
    }
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      campaigns: result.rows
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single campaign with details
app.get('/api/campaigns/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    // Get campaign
    const campaignResult = await pool.query(`
      SELECT c.*, u.name as brand_name, u.avatar_url as brand_avatar
      FROM campaigns c
      JOIN users u ON c.brand_id = u.id
      WHERE c.id = $1
    `, [id]);
    
    if (campaignResult.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    const campaign = campaignResult.rows[0];
    
    // Check if user has access (brand owner or participant)
    const accessCheck = await pool.query(`
      SELECT 1 FROM campaign_participants WHERE campaign_id = $1 AND user_id = $2
      UNION
      SELECT 1 FROM campaigns WHERE id = $1 AND brand_id = $2
    `, [id, userId]);
    
    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get participants
    const participants = await pool.query(`
      SELECT cp.*, u.name, u.avatar_url, u.email
      FROM campaign_participants cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.campaign_id = $1
    `, [id]);
    
    // Get deliverables
    const deliverables = await pool.query(`
      SELECT d.*, u.name as participant_name
      FROM deliverables d
      JOIN campaign_participants cp ON d.participant_id = cp.id
      JOIN users u ON cp.user_id = u.id
      WHERE cp.campaign_id = $1
      ORDER BY d.due_date ASC
    `, [id]);
    
    res.json({
      success: true,
      campaign: {
        ...campaign,
        participants: participants.rows,
        deliverables: deliverables.rows
      }
    });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create campaign (brand only)
app.post('/api/campaigns', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'brand') {
      return res.status(403).json({ error: 'Only brands can create campaigns' });
    }
    
    const { name, description, budget, startDate, endDate, goals, opportunityId } = req.body;
    
    const result = await pool.query(`
      INSERT INTO campaigns (name, description, brand_id, budget, start_date, end_date, goals, opportunity_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')
      RETURNING *
    `, [name, description, req.user.userId, budget, startDate, endDate, JSON.stringify(goals || {}), opportunityId]);
    
    res.json({
      success: true,
      campaign: result.rows[0]
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update campaign
app.put('/api/campaigns/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, budget, startDate, endDate, goals } = req.body;
    
    // Verify ownership
    const campaign = await pool.query('SELECT brand_id FROM campaigns WHERE id = $1', [id]);
    if (campaign.rows.length === 0 || campaign.rows[0].brand_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const result = await pool.query(`
      UPDATE campaigns 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          budget = COALESCE($4, budget),
          start_date = COALESCE($5, start_date),
          end_date = COALESCE($6, end_date),
          goals = COALESCE($7, goals),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [name, description, status, budget, startDate, endDate, goals ? JSON.stringify(goals) : null, id]);
    
    res.json({
      success: true,
      campaign: result.rows[0]
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete campaign
app.delete('/api/campaigns/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const campaign = await pool.query('SELECT brand_id FROM campaigns WHERE id = $1', [id]);
    if (campaign.rows.length === 0 || campaign.rows[0].brand_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await pool.query('DELETE FROM campaigns WHERE id = $1', [id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Invite user to campaign
app.post('/api/campaigns/:id/invite', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, paymentAmount, role } = req.body;
    
    // Verify ownership
    const campaign = await pool.query('SELECT brand_id, name FROM campaigns WHERE id = $1', [id]);
    if (campaign.rows.length === 0 || campaign.rows[0].brand_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Add participant
    const result = await pool.query(`
      INSERT INTO campaign_participants (campaign_id, user_id, role, payment_amount, status)
      VALUES ($1, $2, $3, $4, 'invited')
      ON CONFLICT (campaign_id, user_id) DO UPDATE SET status = 'invited', updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [id, userId, role || 'influencer', paymentAmount]);
    
    // Create notification for invited user
    await pool.query(`
      INSERT INTO notifications (user_id, type, title, content, link)
      VALUES ($1, 'campaign', 'Campaign Invitation', $2, $3)
    `, [userId, `You've been invited to join "${campaign.rows[0].name}"`, `/dashboard/campaigns`]);
    
    res.json({
      success: true,
      participant: result.rows[0]
    });
  } catch (error) {
    console.error('Invite to campaign error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Accept/decline campaign invitation
app.put('/api/campaigns/:id/respond', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { accept } = req.body;
    
    const result = await pool.query(`
      UPDATE campaign_participants
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE campaign_id = $2 AND user_id = $3
      RETURNING *
    `, [accept ? 'accepted' : 'declined', id, req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invitation not found' });
    }
    
    res.json({
      success: true,
      participant: result.rows[0]
    });
  } catch (error) {
    console.error('Respond to campaign error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit deliverable
app.post('/api/campaigns/:campaignId/deliverables/:deliverableId/submit', authenticateToken, async (req, res) => {
  try {
    const { campaignId, deliverableId } = req.params;
    const { url, content } = req.body;
    
    // Verify participant owns this deliverable
    const deliverable = await pool.query(`
      SELECT d.* FROM deliverables d
      JOIN campaign_participants cp ON d.participant_id = cp.id
      WHERE d.id = $1 AND cp.campaign_id = $2 AND cp.user_id = $3
    `, [deliverableId, campaignId, req.user.userId]);
    
    if (deliverable.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const result = await pool.query(`
      UPDATE deliverables
      SET status = 'submitted', submitted_url = $1, submitted_content = $2, submitted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [url, content, deliverableId]);
    
    res.json({
      success: true,
      deliverable: result.rows[0]
    });
  } catch (error) {
    console.error('Submit deliverable error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/reject deliverable (brand only)
app.put('/api/campaigns/:campaignId/deliverables/:deliverableId/review', authenticateToken, async (req, res) => {
  try {
    const { campaignId, deliverableId } = req.params;
    const { approve, feedback } = req.body;
    
    // Verify brand owns campaign
    const campaign = await pool.query('SELECT brand_id FROM campaigns WHERE id = $1', [campaignId]);
    if (campaign.rows.length === 0 || campaign.rows[0].brand_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const newStatus = approve ? 'approved' : 'revision_requested';
    
    const result = await pool.query(`
      UPDATE deliverables
      SET status = $1, feedback = $2, 
          approved_at = $3, approved_by = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [newStatus, feedback, approve ? new Date() : null, approve ? req.user.userId : null, deliverableId]);
    
    res.json({
      success: true,
      deliverable: result.rows[0]
    });
  } catch (error) {
    console.error('Review deliverable error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PAYMENTS API ENDPOINTS
// ============================================

// Get user's payment methods
app.get('/api/payments/methods', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, type, is_default, is_verified, stripe_account_status, 
             wallet_address, wallet_network, bank_last_four, bank_name, created_at
      FROM payment_methods
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC
    `, [req.user.userId]);
    
    res.json({
      success: true,
      methods: result.rows
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add payment method
app.post('/api/payments/methods', authenticateToken, async (req, res) => {
  try {
    const { type, walletAddress, walletNetwork, stripeAccountId, isDefault } = req.body;
    
    // If setting as default, unset other defaults first
    if (isDefault) {
      await pool.query('UPDATE payment_methods SET is_default = FALSE WHERE user_id = $1', [req.user.userId]);
    }
    
    const result = await pool.query(`
      INSERT INTO payment_methods (user_id, type, wallet_address, wallet_network, stripe_account_id, is_default)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [req.user.userId, type, walletAddress, walletNetwork, stripeAccountId, isDefault || false]);
    
    res.json({
      success: true,
      method: result.rows[0]
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete payment method
app.delete('/api/payments/methods/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM payment_methods WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment history
app.get('/api/payments/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
        payer.name as payer_name, payee.name as payee_name,
        c.name as campaign_name
      FROM payments p
      LEFT JOIN users payer ON p.payer_id = payer.id
      LEFT JOIN users payee ON p.payee_id = payee.id
      LEFT JOIN campaigns c ON p.campaign_id = c.id
      WHERE p.payer_id = $1 OR p.payee_id = $1
      ORDER BY p.created_at DESC
      LIMIT 50
    `, [req.user.userId]);
    
    res.json({
      success: true,
      payments: result.rows
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// RBAC: ROLES & PERMISSIONS API
// ============================================

// Get current user's permissions and roles
app.get('/api/auth/permissions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user roles
    const roles = await getUserRoles(userId);
    
    // Get user permissions
    const permissions = await getUserPermissions(userId);
    
    // Get user's teams
    const teams = await pool.query(`
      SELECT t.*, tm.team_role_id, tr.name as role_name, tr.permissions as role_permissions
      FROM teams t
      JOIN team_members tm ON t.id = tm.team_id
      LEFT JOIN team_roles tr ON tm.team_role_id = tr.id
      WHERE tm.user_id = $1 AND tm.status = 'active'
      UNION
      SELECT t.*, NULL as team_role_id, 'owner' as role_name, '["*"]'::jsonb as role_permissions
      FROM teams t WHERE t.owner_id = $1
    `, [userId]);
    
    // Get subscription info
    const subscription = await pool.query(`
      SELECT st.*, us.status, us.current_period_end
      FROM user_subscriptions us
      JOIN subscription_tiers st ON us.tier_id = st.id
      WHERE us.user_id = $1
    `, [userId]);
    
    // Get enabled feature flags
    const features = await pool.query(`
      SELECT ff.name, ff.display_name,
        CASE 
          WHEN uff.is_enabled IS NOT NULL THEN uff.is_enabled
          ELSE ff.is_enabled
        END as is_enabled
      FROM feature_flags ff
      LEFT JOIN user_feature_flags uff ON ff.id = uff.feature_flag_id AND uff.user_id = $1
      WHERE ff.is_enabled = TRUE OR uff.is_enabled = TRUE
    `, [userId]);
    
    res.json({
      success: true,
      roles: roles.map(r => r.name),
      rolesDetail: roles,
      permissions: permissions.map(p => p.name),
      permissionsDetail: permissions,
      teams: teams.rows,
      subscription: subscription.rows[0] || { tier: 'free' },
      features: features.rows.filter(f => f.is_enabled).map(f => f.name)
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// TEAMS API
// ============================================

// Get user's teams
app.get('/api/teams', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, tm.team_role_id, tr.name as role_name, 
             (SELECT COUNT(*) FROM team_members WHERE team_id = t.id AND status = 'active') as member_count
      FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.user_id = $1
      LEFT JOIN team_roles tr ON tm.team_role_id = tr.id
      WHERE tm.user_id = $1 OR t.owner_id = $1
      ORDER BY t.created_at DESC
    `, [req.user.userId]);
    
    res.json({
      success: true,
      teams: result.rows
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a team
app.post('/api/teams', authenticateToken, async (req, res) => {
  try {
    const { name, description, teamType } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }
    
    // Generate slug
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
    
    const result = await pool.query(`
      INSERT INTO teams (name, slug, description, team_type, owner_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, slug, description, teamType || 'brand', req.user.userId]);
    
    // Create default roles for the team
    await pool.query(`
      INSERT INTO team_roles (team_id, name, display_name, permissions, is_default) VALUES
        ($1, 'admin', 'Administrator', '["*"]'::jsonb, FALSE),
        ($1, 'manager', 'Manager', '["campaigns.manage", "members.view", "analytics.view"]'::jsonb, FALSE),
        ($1, 'member', 'Member', '["campaigns.view", "analytics.view"]'::jsonb, TRUE)
    `, [result.rows[0].id]);
    
    // Log audit event
    await logAuditEvent(pool, 'TEAM_CREATED', req.user.userId, { teamId: result.rows[0].id, name }, req.ip);
    
    res.json({
      success: true,
      team: result.rows[0]
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get team details
app.get('/api/teams/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is member or owner
    const accessCheck = await pool.query(`
      SELECT 1 FROM teams WHERE id = $1 AND owner_id = $2
      UNION
      SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2 AND status = 'active'
    `, [id, req.user.userId]);
    
    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const team = await pool.query('SELECT * FROM teams WHERE id = $1', [id]);
    
    if (team.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    // Get team members
    const members = await pool.query(`
      SELECT tm.*, u.name, u.email, u.avatar_url, tr.name as role_name, tr.display_name as role_display
      FROM team_members tm
      JOIN users u ON tm.user_id = u.id
      LEFT JOIN team_roles tr ON tm.team_role_id = tr.id
      WHERE tm.team_id = $1
      ORDER BY tm.joined_at DESC
    `, [id]);
    
    // Get team roles
    const roles = await pool.query('SELECT * FROM team_roles WHERE team_id = $1', [id]);
    
    res.json({
      success: true,
      team: team.rows[0],
      members: members.rows,
      roles: roles.rows,
      isOwner: team.rows[0].owner_id === req.user.userId
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update team
app.put('/api/teams/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, logoUrl, settings } = req.body;
    
    // Verify ownership
    const team = await pool.query('SELECT owner_id FROM teams WHERE id = $1', [id]);
    if (team.rows.length === 0 || team.rows[0].owner_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const result = await pool.query(`
      UPDATE teams SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        logo_url = COALESCE($3, logo_url),
        settings = COALESCE($4, settings),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [name, description, logoUrl, settings ? JSON.stringify(settings) : null, id]);
    
    res.json({
      success: true,
      team: result.rows[0]
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete team
app.delete('/api/teams/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const team = await pool.query('SELECT owner_id, name FROM teams WHERE id = $1', [id]);
    if (team.rows.length === 0 || team.rows[0].owner_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await pool.query('DELETE FROM teams WHERE id = $1', [id]);
    
    // Log audit event
    await logAuditEvent(pool, 'TEAM_DELETED', req.user.userId, { teamId: id, name: team.rows[0].name }, req.ip);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Invite user to team
app.post('/api/teams/:id/invite', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, roleId } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Verify ownership or admin role
    const accessCheck = await pool.query(`
      SELECT 1 FROM teams WHERE id = $1 AND owner_id = $2
      UNION
      SELECT 1 FROM team_members tm 
      JOIN team_roles tr ON tm.team_role_id = tr.id 
      WHERE tm.team_id = $1 AND tm.user_id = $2 AND tr.name = 'admin'
    `, [id, req.user.userId]);
    
    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Find user by email
    const user = await pool.query('SELECT id, name FROM users WHERE email = $1', [email.toLowerCase()]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found. They must create an account first.' });
    }
    
    const invitedUserId = user.rows[0].id;
    
    // Check if already a member
    const existingMember = await pool.query(
      'SELECT status FROM team_members WHERE team_id = $1 AND user_id = $2',
      [id, invitedUserId]
    );
    
    if (existingMember.rows.length > 0) {
      if (existingMember.rows[0].status === 'active') {
        return res.status(400).json({ error: 'User is already a team member' });
      }
      // Update existing invitation
      await pool.query(`
        UPDATE team_members SET status = 'invited', invited_at = CURRENT_TIMESTAMP, invited_by = $1
        WHERE team_id = $2 AND user_id = $3
      `, [req.user.userId, id, invitedUserId]);
    } else {
      // Get default role if none specified
      let teamRoleId = roleId;
      if (!teamRoleId) {
        const defaultRole = await pool.query(
          'SELECT id FROM team_roles WHERE team_id = $1 AND is_default = TRUE',
          [id]
        );
        teamRoleId = defaultRole.rows[0]?.id;
      }
      
      // Create invitation
      await pool.query(`
        INSERT INTO team_members (team_id, user_id, team_role_id, status, invited_by)
        VALUES ($1, $2, $3, 'invited', $4)
      `, [id, invitedUserId, teamRoleId, req.user.userId]);
    }
    
    // Get team name for notification
    const team = await pool.query('SELECT name FROM teams WHERE id = $1', [id]);
    
    // Create notification
    await pool.query(`
      INSERT INTO notifications (user_id, type, title, content, link)
      VALUES ($1, 'team', 'Team Invitation', $2, '/dashboard/teams')
    `, [invitedUserId, `You've been invited to join "${team.rows[0].name}"`]);
    
    res.json({
      success: true,
      message: `Invitation sent to ${user.rows[0].name}`
    });
  } catch (error) {
    console.error('Team invite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Accept/decline team invitation
app.put('/api/teams/:id/respond', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { accept } = req.body;
    
    const result = await pool.query(`
      UPDATE team_members
      SET status = $1, joined_at = $2
      WHERE team_id = $3 AND user_id = $4 AND status = 'invited'
      RETURNING *
    `, [accept ? 'active' : 'declined', accept ? new Date() : null, id, req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invitation not found' });
    }
    
    res.json({
      success: true,
      member: result.rows[0]
    });
  } catch (error) {
    console.error('Team respond error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove team member
app.delete('/api/teams/:teamId/members/:userId', authenticateToken, async (req, res) => {
  try {
    const { teamId, userId } = req.params;
    
    // Verify ownership or admin
    const team = await pool.query('SELECT owner_id FROM teams WHERE id = $1', [teamId]);
    if (team.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    // Can't remove owner
    if (parseInt(userId) === team.rows[0].owner_id) {
      return res.status(400).json({ error: 'Cannot remove team owner' });
    }
    
    // Check access
    const isOwner = team.rows[0].owner_id === req.user.userId;
    const isSelf = parseInt(userId) === req.user.userId;
    
    if (!isOwner && !isSelf) {
      // Check if admin
      const adminCheck = await pool.query(`
        SELECT 1 FROM team_members tm
        JOIN team_roles tr ON tm.team_role_id = tr.id
        WHERE tm.team_id = $1 AND tm.user_id = $2 AND tr.name = 'admin'
      `, [teamId, req.user.userId]);
      
      if (adminCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    await pool.query('DELETE FROM team_members WHERE team_id = $1 AND user_id = $2', [teamId, userId]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update team member role
app.put('/api/teams/:teamId/members/:userId/role', authenticateToken, async (req, res) => {
  try {
    const { teamId, userId } = req.params;
    const { roleId } = req.body;
    
    // Verify ownership
    const team = await pool.query('SELECT owner_id FROM teams WHERE id = $1', [teamId]);
    if (team.rows.length === 0 || team.rows[0].owner_id !== req.user.userId) {
      return res.status(403).json({ error: 'Only team owner can change roles' });
    }
    
    const result = await pool.query(`
      UPDATE team_members SET team_role_id = $1 WHERE team_id = $2 AND user_id = $3 RETURNING *
    `, [roleId, teamId, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    res.json({
      success: true,
      member: result.rows[0]
    });
  } catch (error) {
    console.error('Update member role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// FEATURE FLAGS API
// ============================================

// Get all feature flags (for current user)
app.get('/api/features', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;
    
    const result = await pool.query(`
      SELECT ff.*,
        CASE 
          WHEN uff.is_enabled IS NOT NULL THEN uff.is_enabled
          ELSE ff.is_enabled
        END as user_enabled
      FROM feature_flags ff
      LEFT JOIN user_feature_flags uff ON ff.id = uff.feature_flag_id AND uff.user_id = $1
      ORDER BY ff.name
    `, [userId]);
    
    // Filter based on user type
    const features = result.rows.map(f => ({
      name: f.name,
      displayName: f.display_name,
      description: f.description,
      isEnabled: f.user_enabled && 
        (f.allowed_user_types.length === 0 || f.allowed_user_types.includes(userType)),
      metadata: f.metadata
    }));
    
    res.json({
      success: true,
      features
    });
  } catch (error) {
    console.error('Get features error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check specific feature flag
app.get('/api/features/:name', authenticateToken, async (req, res) => {
  try {
    const { name } = req.params;
    const isEnabled = await isFeatureEnabled(name, req.user.userId, req.user.userType);
    
    res.json({
      success: true,
      feature: name,
      isEnabled
    });
  } catch (error) {
    console.error('Check feature error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Manage feature flags
app.put('/api/admin/features/:name', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { name } = req.params;
    const { isEnabled, rolloutPercentage, allowedUserTypes, allowedRoles, metadata } = req.body;
    
    const result = await pool.query(`
      UPDATE feature_flags SET
        is_enabled = COALESCE($1, is_enabled),
        rollout_percentage = COALESCE($2, rollout_percentage),
        allowed_user_types = COALESCE($3, allowed_user_types),
        allowed_roles = COALESCE($4, allowed_roles),
        metadata = COALESCE($5, metadata),
        updated_at = CURRENT_TIMESTAMP
      WHERE name = $6
      RETURNING *
    `, [isEnabled, rolloutPercentage, allowedUserTypes, allowedRoles, metadata ? JSON.stringify(metadata) : null, name]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feature flag not found' });
    }
    
    await logAuditEvent(pool, 'FEATURE_FLAG_UPDATED', req.user.userId, { feature: name, isEnabled }, req.ip);
    
    res.json({
      success: true,
      feature: result.rows[0]
    });
  } catch (error) {
    console.error('Update feature error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// SUBSCRIPTION API
// ============================================

// Get subscription tiers
app.get('/api/subscriptions/tiers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM subscription_tiers WHERE is_active = TRUE ORDER BY sort_order
    `);
    
    res.json({
      success: true,
      tiers: result.rows
    });
  } catch (error) {
    console.error('Get tiers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's subscription
app.get('/api/subscriptions/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT us.*, st.name as tier_name, st.display_name as tier_display, st.features, st.limits
      FROM user_subscriptions us
      JOIN subscription_tiers st ON us.tier_id = st.id
      WHERE us.user_id = $1
    `, [req.user.userId]);
    
    if (result.rows.length === 0) {
      // Return free tier
      const freeTier = await pool.query(`
        SELECT * FROM subscription_tiers WHERE name = 'free'
      `);
      
      return res.json({
        success: true,
        subscription: {
          tier: 'free',
          ...freeTier.rows[0]
        }
      });
    }
    
    res.json({
      success: true,
      subscription: result.rows[0]
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check entitlement
app.get('/api/subscriptions/entitlement/:feature', authenticateToken, async (req, res) => {
  try {
    const { feature } = req.params;
    
    // Get user's subscription and entitlement
    const result = await pool.query(`
      SELECT st.name as tier, e.limit_value, e.is_unlimited, st.limits
      FROM user_subscriptions us
      JOIN subscription_tiers st ON us.tier_id = st.id
      LEFT JOIN entitlements e ON st.id = e.tier_id AND e.feature_name = $2
      WHERE us.user_id = $1 AND us.status = 'active'
    `, [req.user.userId, feature]);
    
    if (result.rows.length === 0) {
      // Default to free tier limits
      const freeTier = await pool.query(`
        SELECT st.limits, e.limit_value, e.is_unlimited
        FROM subscription_tiers st
        LEFT JOIN entitlements e ON st.id = e.tier_id AND e.feature_name = $1
        WHERE st.name = 'free'
      `, [feature]);
      
      const limits = freeTier.rows[0]?.limits || {};
      
      return res.json({
        success: true,
        feature,
        tier: 'free',
        limit: freeTier.rows[0]?.limit_value || limits[feature] || 0,
        isUnlimited: freeTier.rows[0]?.is_unlimited || false
      });
    }
    
    const sub = result.rows[0];
    const limits = sub.limits || {};
    
    res.json({
      success: true,
      feature,
      tier: sub.tier,
      limit: sub.limit_value !== null ? sub.limit_value : (limits[feature] || null),
      isUnlimited: sub.is_unlimited || limits[feature] === -1
    });
  } catch (error) {
    console.error('Check entitlement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ADMIN: ROLE MANAGEMENT API
// ============================================

// Get all roles (admin only)
app.get('/api/admin/roles', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const roles = await pool.query(`
      SELECT r.*, 
        (SELECT COUNT(*) FROM user_roles WHERE role_id = r.id) as user_count,
        (SELECT array_agg(p.name) FROM permissions p 
         JOIN role_permissions rp ON p.id = rp.permission_id 
         WHERE rp.role_id = r.id) as permissions
      FROM roles r
      ORDER BY r.name
    `);
    
    res.json({
      success: true,
      roles: roles.rows
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all permissions (admin only)
app.get('/api/admin/permissions', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const permissions = await pool.query(`
      SELECT * FROM permissions ORDER BY category, name
    `);
    
    // Group by category
    const grouped = permissions.rows.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {});
    
    res.json({
      success: true,
      permissions: permissions.rows,
      grouped
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Assign role to user (admin only)
app.post('/api/admin/users/:userId/roles', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleId, roleName } = req.body;
    
    let finalRoleId = roleId;
    if (!roleId && roleName) {
      const role = await pool.query('SELECT id FROM roles WHERE name = $1', [roleName]);
      if (role.rows.length === 0) {
        return res.status(404).json({ error: 'Role not found' });
      }
      finalRoleId = role.rows[0].id;
    }
    
    await pool.query(`
      INSERT INTO user_roles (user_id, role_id, assigned_by)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, role_id) DO NOTHING
    `, [userId, finalRoleId, req.user.userId]);
    
    await logAuditEvent(pool, 'USER_ROLE_ASSIGNED', req.user.userId, { targetUserId: userId, roleId: finalRoleId }, req.ip);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove role from user (admin only)
app.delete('/api/admin/users/:userId/roles/:roleId', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { userId, roleId } = req.params;
    
    await pool.query('DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2', [userId, roleId]);
    
    await logAuditEvent(pool, 'USER_ROLE_REMOVED', req.user.userId, { targetUserId: userId, roleId }, req.ip);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Remove role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's roles (admin only)
app.get('/api/admin/users/:userId/roles', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const roles = await pool.query(`
      SELECT r.*, ur.assigned_at, u.name as assigned_by_name
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      LEFT JOIN users u ON ur.assigned_by = u.id
      WHERE ur.user_id = $1
    `, [userId]);
    
    res.json({
      success: true,
      roles: roles.rows
    });
  } catch (error) {
    console.error('Get user roles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// SHOP / E-COMMERCE API
// ============================================

// Helper: Generate unique slug
function generateSlug(name, existingSlugs = []) {
  let slug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  if (existingSlugs.includes(slug)) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }
  return slug;
}

// Helper: Generate order number
function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Helper: Generate download token
function generateDownloadToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Get shop settings for current user
app.get('/api/shop/settings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM shop_settings WHERE user_id = $1',
      [req.user.userId]
    );
    
    if (result.rows.length === 0) {
      // Return defaults if no settings exist
      return res.json({
        success: true,
        settings: {
          shop_name: null,
          shop_description: null,
          stripe_onboarding_complete: false,
          is_active: false,
          currency: 'USD'
        }
      });
    }
    
    res.json({
      success: true,
      settings: result.rows[0]
    });
  } catch (error) {
    console.error('Get shop settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update shop settings
app.put('/api/shop/settings', authenticateToken, async (req, res) => {
  try {
    const { shopName, shopDescription, shopLogo, shopBanner, currency, theme, socialLinks, isActive } = req.body;
    
    const result = await pool.query(`
      INSERT INTO shop_settings (user_id, shop_name, shop_description, shop_logo, shop_banner, currency, theme, social_links, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id) DO UPDATE SET
        shop_name = COALESCE($2, shop_settings.shop_name),
        shop_description = COALESCE($3, shop_settings.shop_description),
        shop_logo = COALESCE($4, shop_settings.shop_logo),
        shop_banner = COALESCE($5, shop_settings.shop_banner),
        currency = COALESCE($6, shop_settings.currency),
        theme = COALESCE($7, shop_settings.theme),
        social_links = COALESCE($8, shop_settings.social_links),
        is_active = COALESCE($9, shop_settings.is_active),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      req.user.userId, 
      shopName, 
      shopDescription, 
      shopLogo, 
      shopBanner, 
      currency || 'USD',
      theme ? JSON.stringify(theme) : null,
      socialLinks ? JSON.stringify(socialLinks) : null,
      isActive
    ]);
    
    res.json({
      success: true,
      settings: result.rows[0]
    });
  } catch (error) {
    console.error('Update shop settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get creator's products (authenticated - for management)
app.get('/api/shop/products', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM shop_orders WHERE product_id = p.id AND status = 'completed') as total_sales,
        (SELECT SUM(creator_payout) FROM shop_orders WHERE product_id = p.id AND status = 'completed') as total_revenue
      FROM products p
      WHERE p.creator_id = $1
      ORDER BY p.created_at DESC
    `, [req.user.userId]);
    
    res.json({
      success: true,
      products: result.rows
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new product
app.post('/api/shop/products', authenticateToken, async (req, res) => {
  try {
    const { 
      name, description, shortDescription, type, price, compareAtPrice, 
      currency, coverImage, galleryImages, tags, downloadLimit, metadata 
    } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    // Get existing slugs for this creator
    const existingSlugs = await pool.query(
      'SELECT slug FROM products WHERE creator_id = $1',
      [req.user.userId]
    );
    const slugs = existingSlugs.rows.map(r => r.slug);
    const slug = generateSlug(name, slugs);
    
    const result = await pool.query(`
      INSERT INTO products (
        creator_id, name, slug, description, short_description, type, price, 
        compare_at_price, currency, cover_image, gallery_images, tags, download_limit, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      req.user.userId,
      name,
      slug,
      description,
      shortDescription,
      type || 'digital',
      Math.round(price * 100), // Store in cents
      compareAtPrice ? Math.round(compareAtPrice * 100) : null,
      currency || 'USD',
      coverImage,
      galleryImages ? JSON.stringify(galleryImages) : '[]',
      tags || [],
      downloadLimit,
      metadata ? JSON.stringify(metadata) : '{}'
    ]);
    
    res.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product (authenticated - for editing)
app.get('/api/shop/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT p.*, 
        json_agg(pf.*) FILTER (WHERE pf.id IS NOT NULL) as files
      FROM products p
      LEFT JOIN product_files pf ON p.id = pf.product_id
      WHERE p.id = $1 AND p.creator_id = $2
      GROUP BY p.id
    `, [id, req.user.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
app.put('/api/shop/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, description, shortDescription, type, price, compareAtPrice, 
      currency, coverImage, galleryImages, tags, downloadLimit, metadata, isActive, isFeatured 
    } = req.body;
    
    // Verify ownership
    const check = await pool.query('SELECT creator_id FROM products WHERE id = $1', [id]);
    if (check.rows.length === 0 || check.rows[0].creator_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const result = await pool.query(`
      UPDATE products SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        short_description = COALESCE($3, short_description),
        type = COALESCE($4, type),
        price = COALESCE($5, price),
        compare_at_price = $6,
        currency = COALESCE($7, currency),
        cover_image = COALESCE($8, cover_image),
        gallery_images = COALESCE($9, gallery_images),
        tags = COALESCE($10, tags),
        download_limit = $11,
        metadata = COALESCE($12, metadata),
        is_active = COALESCE($13, is_active),
        is_featured = COALESCE($14, is_featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *
    `, [
      name,
      description,
      shortDescription,
      type,
      price ? Math.round(price * 100) : null,
      compareAtPrice ? Math.round(compareAtPrice * 100) : null,
      currency,
      coverImage,
      galleryImages ? JSON.stringify(galleryImages) : null,
      tags,
      downloadLimit,
      metadata ? JSON.stringify(metadata) : null,
      isActive,
      isFeatured,
      id
    ]);
    
    res.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
app.delete('/api/shop/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const check = await pool.query('SELECT creator_id FROM products WHERE id = $1', [id]);
    if (check.rows.length === 0 || check.rows[0].creator_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add file to product
app.post('/api/shop/products/:id/files', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, fileUrl, fileSize, fileType } = req.body;
    
    // Verify ownership
    const check = await pool.query('SELECT creator_id FROM products WHERE id = $1', [id]);
    if (check.rows.length === 0 || check.rows[0].creator_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get next sort order
    const orderResult = await pool.query(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM product_files WHERE product_id = $1',
      [id]
    );
    
    const result = await pool.query(`
      INSERT INTO product_files (product_id, file_name, file_url, file_size, file_type, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [id, fileName, fileUrl, fileSize, fileType, orderResult.rows[0].next_order]);
    
    res.json({
      success: true,
      file: result.rows[0]
    });
  } catch (error) {
    console.error('Add file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete file from product
app.delete('/api/shop/products/:productId/files/:fileId', authenticateToken, async (req, res) => {
  try {
    const { productId, fileId } = req.params;
    
    // Verify ownership
    const check = await pool.query('SELECT creator_id FROM products WHERE id = $1', [productId]);
    if (check.rows.length === 0 || check.rows[0].creator_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await pool.query('DELETE FROM product_files WHERE id = $1 AND product_id = $2', [fileId, productId]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get creator's orders (sales)
app.get('/api/shop/orders', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, p.name as product_name, p.cover_image as product_image
      FROM shop_orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.creator_id = $1
      ORDER BY o.created_at DESC
      LIMIT 100
    `, [req.user.userId]);
    
    res.json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get shop stats
app.get('/api/shop/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM products WHERE creator_id = $1 AND is_active = TRUE) as active_products,
        (SELECT COUNT(*) FROM shop_orders WHERE creator_id = $1 AND status = 'completed') as total_sales,
        (SELECT COALESCE(SUM(creator_payout), 0) FROM shop_orders WHERE creator_id = $1 AND status = 'completed') as total_revenue,
        (SELECT COUNT(*) FROM shop_orders WHERE creator_id = $1 AND status = 'completed' AND created_at > NOW() - INTERVAL '30 days') as monthly_sales,
        (SELECT COALESCE(SUM(creator_payout), 0) FROM shop_orders WHERE creator_id = $1 AND status = 'completed' AND created_at > NOW() - INTERVAL '30 days') as monthly_revenue
    `, [req.user.userId]);
    
    res.json({
      success: true,
      stats: stats.rows[0]
    });
  } catch (error) {
    console.error('Get shop stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// PUBLIC SHOP API (No auth required)
// ============================================

// Get public shop by username
app.get('/api/shop/public/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find user by username or name
    let userResult = await pool.query(`
      SELECT id, name, username, bio, avatar_url, location, website
      FROM users WHERE username = $1
    `, [username]);
    
    if (userResult.rows.length === 0) {
      // Try by name
      userResult = await pool.query(`
        SELECT id, name, username, bio, avatar_url, location, website
        FROM users WHERE LOWER(name) = LOWER($1)
      `, [username]);
    }
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    
    const user = userResult.rows[0];
    
    // Get shop settings
    const settingsResult = await pool.query(
      'SELECT * FROM shop_settings WHERE user_id = $1',
      [user.id]
    );
    
    const settings = settingsResult.rows[0] || {
      shop_name: `${user.name}'s Shop`,
      is_active: true,
      theme: { primary_color: '#14b8a6', style: 'modern' }
    };
    
    // Get active products
    const productsResult = await pool.query(`
      SELECT id, name, slug, short_description, type, price, compare_at_price, 
             currency, cover_image, is_featured, sales_count, created_at
      FROM products
      WHERE creator_id = $1 AND is_active = TRUE
      ORDER BY is_featured DESC, created_at DESC
    `, [user.id]);
    
    res.json({
      success: true,
      shop: {
        creator: {
          name: user.name,
          username: user.username,
          bio: user.bio,
          avatar: user.avatar_url,
          location: user.location,
          website: user.website
        },
        settings: {
          name: settings.shop_name || `${user.name}'s Shop`,
          description: settings.shop_description,
          logo: settings.shop_logo,
          banner: settings.shop_banner,
          theme: settings.theme,
          socialLinks: settings.social_links
        },
        products: productsResult.rows
      }
    });
  } catch (error) {
    console.error('Get public shop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single public product
app.get('/api/shop/public/:username/products/:slug', async (req, res) => {
  try {
    const { username, slug } = req.params;
    
    // Find creator
    let userResult = await pool.query('SELECT id, name FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      userResult = await pool.query('SELECT id, name FROM users WHERE LOWER(name) = LOWER($1)', [username]);
    }
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    
    const creatorId = userResult.rows[0].id;
    
    // Get product
    const result = await pool.query(`
      SELECT p.*, u.name as creator_name, u.avatar_url as creator_avatar
      FROM products p
      JOIN users u ON p.creator_id = u.id
      WHERE p.slug = $1 AND p.creator_id = $2 AND p.is_active = TRUE
    `, [slug, creatorId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Get public product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create checkout session for product purchase
app.post('/api/shop/checkout/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { customerEmail, customerName, successUrl, cancelUrl } = req.body;
    
    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email is required' });
    }
    
    // Get product details
    const productResult = await pool.query(`
      SELECT p.*, u.name as creator_name, ss.stripe_account_id
      FROM products p
      JOIN users u ON p.creator_id = u.id
      LEFT JOIN shop_settings ss ON p.creator_id = ss.user_id
      WHERE p.id = $1 AND p.is_active = TRUE
    `, [productId]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productResult.rows[0];
    
    // Calculate platform fee (8%)
    const platformFee = Math.round(product.price * 0.08);
    const creatorPayout = product.price - platformFee;
    
    // Generate order
    const orderNumber = generateOrderNumber();
    const downloadToken = generateDownloadToken();
    
    // Create pending order
    const orderResult = await pool.query(`
      INSERT INTO shop_orders (
        order_number, product_id, creator_id, customer_email, customer_name,
        amount, currency, platform_fee, creator_payout, status, download_token,
        download_expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10, NOW() + INTERVAL '7 days')
      RETURNING *
    `, [
      orderNumber, productId, product.creator_id, customerEmail.toLowerCase(),
      customerName, product.price, product.currency, platformFee, creatorPayout, downloadToken
    ]);
    
    const order = orderResult.rows[0];
    
    // For now, return a simple payment link (in production, use Stripe Checkout)
    // This is a placeholder - in production you'd create a Stripe Checkout Session
    const baseUrl = process.env.OAUTH_REDIRECT_BASE || `https://${req.get('host')}`;
    
    res.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        amount: product.price,
        currency: product.currency
      },
      // In production, this would be a Stripe Checkout URL
      // For now, simulate with a direct purchase link
      checkoutUrl: `${baseUrl}/shop/complete/${order.order_number}?token=${downloadToken}`,
      message: 'Order created. In production, this would redirect to Stripe Checkout.'
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete order (simulate payment success - in production, use Stripe webhook)
app.post('/api/shop/orders/:orderNumber/complete', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { token } = req.body;
    
    const orderResult = await pool.query(`
      SELECT o.*, p.name as product_name
      FROM shop_orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.order_number = $1
    `, [orderNumber]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    
    // Verify token
    if (order.download_token !== token) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    // Mark order as completed
    await pool.query(`
      UPDATE shop_orders SET status = 'completed', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [order.id]);
    
    // Increment product sales count
    await pool.query(`
      UPDATE products SET sales_count = sales_count + 1 WHERE id = $1
    `, [order.product_id]);
    
    res.json({
      success: true,
      order: {
        ...order,
        status: 'completed'
      },
      downloadUrl: `/api/shop/download/${order.download_token}`
    });
  } catch (error) {
    console.error('Complete order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download purchased files
app.get('/api/shop/download/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find order by download token
    const orderResult = await pool.query(`
      SELECT o.*, p.name as product_name, p.download_limit
      FROM shop_orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.download_token = $1 AND o.status = 'completed'
    `, [token]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Download not found or order not completed' });
    }
    
    const order = orderResult.rows[0];
    
    // Check expiration
    if (order.download_expires_at && new Date(order.download_expires_at) < new Date()) {
      return res.status(403).json({ error: 'Download link has expired' });
    }
    
    // Check download limit
    if (order.download_limit && order.download_count >= order.download_limit) {
      return res.status(403).json({ error: 'Download limit reached' });
    }
    
    // Get product files
    const filesResult = await pool.query(`
      SELECT * FROM product_files WHERE product_id = $1 ORDER BY sort_order
    `, [order.product_id]);
    
    // Increment download count
    await pool.query(`
      UPDATE shop_orders SET download_count = download_count + 1 WHERE id = $1
    `, [order.id]);
    
    res.json({
      success: true,
      productName: order.product_name,
      files: filesResult.rows.map(f => ({
        name: f.file_name,
        url: f.file_url,
        size: f.file_size,
        type: f.file_type
      })),
      downloadsRemaining: order.download_limit ? order.download_limit - order.download_count - 1 : null
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// MOUNTED ROUTE MODULES
// ============================================

// Asset management routes
app.use('/api/assets', assetRoutes);

// Notification and audit routes
app.use('/api/notifications', notificationRoutes);

// ============================================
// CENTRALIZED ERROR HANDLER
// ============================================

// Handle 404 for API routes
app.use('/api/*', (req, res, next) => {
  res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.path}` });
});

// Global error handler - must be last middleware
app.use(errorHandler);

// ============================================
// CATCH-ALL FOR REACT ROUTER (SPA)
// ============================================

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  // Don't catch API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Don't serve old static HTML files - always use React app
  const distPath = path.join(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.html');
  
  // Always try to serve React app first
  if (fs.existsSync(indexPath)) {
    // NUCLEAR OPTION: Read the file, inject a random ID to bust cache, and send
    let html = fs.readFileSync(indexPath, 'utf8');
    const versionBuster = Date.now();
    html = html.replace('</head>', `<meta name="version" content="v2.7-${versionBuster}"></head>`);
    
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(html);
  } else {
    // If React build doesn't exist, return error (don't fall back to old HTML)
    res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
          <h1>Application Not Built</h1>
          <p>Please build the React application first.</p>
          <p>Run: <code>cd client && npm run build</code></p>
        </body>
      </html>
    `);
  }
});

// ============================================
// SERVER STARTUP
// ============================================

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════');
      console.log('🚀 FORMATIVE API SERVER STARTED');
      console.log('═══════════════════════════════════════════════════');
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: Connected`);
      console.log('');
      console.log('🔐 OAuth Status:');
      console.log(`   Twitter:   ${OAUTH_CONFIG.twitter.clientId ? '✅ Configured' : '❌ Not configured'}`);
      console.log(`   Instagram: ${OAUTH_CONFIG.instagram.clientId ? '✅ Configured' : '❌ Not configured'}`);
      console.log(`   TikTok:    ${OAUTH_CONFIG.tiktok.clientId ? '✅ Configured' : '❌ Not configured'}`);
      console.log(`   YouTube:   ${OAUTH_CONFIG.youtube.clientId ? '✅ Configured' : '❌ Not configured'}`);
      console.log(`   Bluesky:   ✅ Always available (no OAuth needed)`);
      console.log('');
      console.log('═══════════════════════════════════════════════════');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
