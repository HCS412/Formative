// Backend API server for Formative Platform with OAuth Support
// Updated with complete database schema initialization
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');
const crypto = require('crypto');

// Use node-fetch for Node.js < 18, native fetch for Node.js >= 18
let fetch;
try {
  fetch = globalThis.fetch || require('node-fetch');
} catch (e) {
  fetch = require('node-fetch');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://formativeunites.us', 'https://www.formativeunites.us', 'https://hcs412.github.io', 'https://formative-production.up.railway.app']
    : '*',
  credentials: true
}));
app.use(express.json());

// Serve React app from dist folder (built by Vite)
const distPath = path.join(__dirname, '../dist');
const oldStaticPath = path.join(__dirname, '../');

// Check if React build exists, otherwise fall back to old static files
const fs = require('fs');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  app.use(express.static(oldStaticPath));
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// OAuth Configuration
const OAUTH_CONFIG = {
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    userUrl: 'https://api.twitter.com/2/users/me',
    scopes: ['tweet.read', 'users.read', 'follows.read', 'offline.access'],
    redirectUri: `${process.env.OAUTH_REDIRECT_BASE || 'https://formative-production.up.railway.app'}/api/oauth/twitter/callback`
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    userUrl: 'https://graph.instagram.com/me',
    scopes: ['user_profile', 'user_media'],
    redirectUri: `${process.env.OAUTH_REDIRECT_BASE || 'https://formative-production.up.railway.app'}/api/oauth/instagram/callback`
  },
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_ID,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    userUrl: 'https://open.tiktokapis.com/v2/user/info/',
    scopes: ['user.info.basic', 'user.info.stats', 'video.list'],
    redirectUri: `${process.env.OAUTH_REDIRECT_BASE || 'https://formative-production.up.railway.app'}/api/oauth/tiktok/callback`
  },
  youtube: {
    clientId: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/userinfo.profile'],
    redirectUri: `${process.env.OAUTH_REDIRECT_BASE || 'https://formative-production.up.railway.app'}/api/oauth/youtube/callback`
  }
};

// Frontend URL for OAuth redirects (with safety check for misconfigured env var)
const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://formative-production.up.railway.app').replace(/^FRONTEND_URL=/, '');

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
        password_hash VARCHAR(255) NOT NULL,
        user_type VARCHAR(50) NOT NULL,
        profile_data JSONB DEFAULT '{}',
        email_verified BOOLEAN DEFAULT FALSE,
        avatar_url TEXT,
        location VARCHAR(255),
        bio TEXT,
        website VARCHAR(500),
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
    console.log('📊 Tables: users, social_accounts, opportunities, applications, messages, conversations, notifications, user_settings');
    
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

  jwt.verify(token, JWT_SECRET, (err, user) => {
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

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
    }
    req.user = user;
    next();
  });
};

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

  if (isTokenExpired(account.token_expires_at) && account.refresh_token) {
    console.log(`Token expired for ${platform}, refreshing...`);
    
    const newTokens = await refreshOAuthToken(platform, account.refresh_token);
    const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000);
    
    await pool.query(
      `UPDATE social_accounts 
       SET access_token = $1, refresh_token = $2, token_expires_at = $3, updated_at = NOW()
       WHERE user_id = $4 AND platform = $5`,
      [newTokens.access_token, newTokens.refresh_token, expiresAt, userId, platform]
    );

    return newTokens.access_token;
  }

  return account.access_token;
}

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const dbResult = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      message: 'Formative API is running',
      database: 'connected',
      timestamp: dbResult.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// ============================================
// AUTH ENDPOINTS
// ============================================

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password || !userType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, user_type) VALUES ($1, $2, $3, $4) RETURNING id, name, email, user_type, created_at',
      [name, email, passwordHash, userType]
    );

    const user = result.rows[0];

    // Create default user settings
    await pool.query(
      'INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT DO NOTHING',
      [user.id]
    );

    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.user_type },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Ensure 2FA columns exist
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255)`);
      await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE`);
    } catch (e) {
      // Columns may already exist
    }

    const result = await pool.query(
      'SELECT id, name, email, password_hash, user_type, profile_data, two_factor_enabled FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if 2FA is enabled
    if (user.two_factor_enabled) {
      // Return that 2FA is required
      return res.json({
        requires2FA: true,
        userId: user.id
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.user_type },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// TWO-FACTOR AUTHENTICATION ENDPOINTS
// ============================================

// Generate a base32 secret for 2FA (simple implementation without external lib)
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
  const crypto = require('crypto');
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
  const previous = generateTOTP(secret, 30); // Allow for slight clock drift
  return code === current || code === previous;
}

// Setup 2FA
app.post('/api/auth/2fa/setup', authenticateToken, async (req, res) => {
  try {
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
    
    // Generate QR code URL (using Google Charts API for simplicity)
    const issuer = 'Formative';
    const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;
    
    res.json({
      success: true,
      secret,
      qrCode
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
});

// Verify and enable 2FA
app.post('/api/auth/2fa/verify', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { code } = req.body;
    
    // Get secret
    const result = await pool.query(
      'SELECT two_factor_secret FROM users WHERE id = $1',
      [userId]
    );
    
    if (!result.rows[0]?.two_factor_secret) {
      return res.status(400).json({ error: 'Please setup 2FA first' });
    }
    
    const secret = result.rows[0].two_factor_secret;
    
    // Verify code
    if (!verifyTOTP(secret, code)) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    // Enable 2FA
    await pool.query(
      'UPDATE users SET two_factor_enabled = true WHERE id = $1',
      [userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('2FA verify error:', error);
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

// Disable 2FA
app.post('/api/auth/2fa/disable', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { code } = req.body;
    
    // Get secret
    const result = await pool.query(
      'SELECT two_factor_secret FROM users WHERE id = $1',
      [userId]
    );
    
    if (!result.rows[0]?.two_factor_secret) {
      return res.status(400).json({ error: '2FA is not enabled' });
    }
    
    // Verify code
    if (!verifyTOTP(result.rows[0].two_factor_secret, code)) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    // Disable 2FA
    await pool.query(
      'UPDATE users SET two_factor_enabled = false, two_factor_secret = NULL WHERE id = $1',
      [userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

// 2FA Login verification
app.post('/api/auth/2fa/login', async (req, res) => {
  try {
    const { userId, code, rememberMe } = req.body;
    
    // Get user and secret
    const result = await pool.query(
      'SELECT id, name, email, user_type, two_factor_secret, profile_data FROM users WHERE id = $1 AND two_factor_enabled = true',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    
    const user = result.rows[0];
    
    // Verify code
    if (!verifyTOTP(user.two_factor_secret, code)) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.user_type },
      JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '1d' }
    );
    
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
  } catch (error) {
    console.error('2FA login error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// ============================================
// USER PROFILE ENDPOINTS
// ============================================

// Search users (for messaging)
app.get('/api/users/search', authenticateToken, async (req, res) => {
  try {
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
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, user_type, profile_data, avatar_url, location, bio, website, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save onboarding data
app.post('/api/user/onboarding', authenticateToken, async (req, res) => {
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
    
    console.log(`✅ Onboarding completed for user ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'Onboarding data saved successfully',
      user: result.rows[0]
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Onboarding save error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

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
      [stateData.userId, 'twitter', username, userData.data.id, tokens.access_token, tokens.refresh_token, expiresAt, JSON.stringify(stats)]
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
      [stateData.userId, 'instagram', username, userData.id, tokens.access_token, expiresAt]
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
      [stateData.userId, 'tiktok', username, tokens.access_token, tokens.refresh_token, expiresAt]
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
      [stateData.userId, 'youtube', username, channelId, tokens.access_token, tokens.refresh_token, expiresAt, JSON.stringify(stats)]
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
app.get('/api/messages/conversations', authenticateToken, async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get messages for a specific conversation
app.get('/api/messages/conversation/:conversationId', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;
    
    // Verify user is part of this conversation
    const convCheck = await pool.query(
      'SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)',
      [conversationId, userId]
    );
    
    if (convCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to this conversation' });
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
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send a message
app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { receiverId, content, conversationId } = req.body;
    const senderId = req.user.userId;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Message content is required' });
    }
    
    if (!receiverId && !conversationId) {
      return res.status(400).json({ error: 'Receiver ID or conversation ID is required' });
    }
    
    let finalConversationId = conversationId;
    let finalReceiverId = receiverId;
    
    // If conversationId provided, get receiver from conversation
    if (conversationId && !receiverId) {
      const convResult = await pool.query(
        'SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)',
        [conversationId, senderId]
      );
      
      if (convResult.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied to this conversation' });
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
    `, [finalReceiverId, `You have a new message`, result.rows[0].id]);
    
    res.json({ 
      success: true, 
      message: result.rows[0],
      conversationId: finalConversationId
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start a new conversation (or get existing one)
app.post('/api/messages/start-conversation', authenticateToken, async (req, res) => {
  try {
    const { userId: otherUserId, initialMessage } = req.body;
    const currentUserId = req.user.userId;
    
    if (!otherUserId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (otherUserId === currentUserId) {
      return res.status(400).json({ error: 'Cannot start conversation with yourself' });
    }
    
    // Check if user exists
    const userCheck = await pool.query('SELECT id, name FROM users WHERE id = $1', [otherUserId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
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
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread message count
app.get('/api/messages/unread-count', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) FROM messages WHERE receiver_id = $1 AND is_read = FALSE',
      [req.user.userId]
    );
    
    res.json({ 
      success: true, 
      unreadCount: parseInt(result.rows[0].count)
    });
  } catch (error) {
    console.error('Unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark conversation messages as read
app.put('/api/messages/conversation/:conversationId/read', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;
    
    await pool.query(`
      UPDATE messages 
      SET is_read = TRUE, read_at = NOW() 
      WHERE conversation_id = $1 AND receiver_id = $2 AND is_read = FALSE
    `, [conversationId, userId]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
app.get('/api/kit/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Get user profile
    const userResult = await pool.query(`
      SELECT 
        id, name, username, user_type, bio, location, website, avatar_url, 
        is_public, created_at
      FROM users 
      WHERE LOWER(username) = LOWER($1)
    `, [username]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Media kit not found' });
    }
    
    const user = userResult.rows[0];
    
    // Check if profile is public
    if (user.is_public === false) {
      return res.status(403).json({ error: 'This media kit is private' });
    }
    
    // Get connected social accounts with stats
    const socialResult = await pool.query(`
      SELECT 
        platform, username, stats, is_verified, last_synced_at
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
// CATCH-ALL FOR REACT ROUTER (SPA)
// ============================================

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  // Don't catch API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  const distPath = path.join(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.html');
  
  // Check if React build exists
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fall back to old index.html
    res.sendFile(path.join(__dirname, '../index.html'));
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
