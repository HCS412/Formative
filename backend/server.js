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
    ? ['https://hcs412.github.io', 'https://formative-production.up.railway.app']
    : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

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
  }
};

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

    // 3. OPPORTUNITIES TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS opportunities (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        industry VARCHAR(100),
        budget_min INTEGER,
        budget_max INTEGER,
        budget_range VARCHAR(50),
        requirements JSONB DEFAULT '[]',
        platforms JSONB DEFAULT '[]',
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'active',
        deadline TIMESTAMP,
        location VARCHAR(255),
        is_remote BOOLEAN DEFAULT TRUE,
        views_count INTEGER DEFAULT 0,
        applications_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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
        conversation_id UUID,
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
        conversation_id UUID UNIQUE,
        participant_1 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        participant_2 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_message_preview TEXT,
        opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(participant_1, participant_2)
      )
    `);

    // 7. NOTIFICATIONS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        link VARCHAR(500),
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
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

    const result = await pool.query(
      'SELECT id, name, email, password_hash, user_type, profile_data FROM users WHERE email = $1',
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
// USER PROFILE ENDPOINTS
// ============================================

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
    return res.redirect(`${process.env.FRONTEND_URL || 'https://hcs412.github.io/Formative'}/dashboard.html?error=oauth_not_configured&platform=twitter`);
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
    return res.redirect(`${process.env.FRONTEND_URL || 'https://hcs412.github.io/Formative'}/dashboard.html?error=oauth_not_configured&platform=instagram`);
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
    return res.redirect(`${process.env.FRONTEND_URL || 'https://hcs412.github.io/Formative'}/dashboard.html?error=oauth_not_configured&platform=tiktok`);
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

// ============================================
// OAUTH CALLBACK ENDPOINTS
// ============================================

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://hcs412.github.io/Formative';

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

    const userResponse = await fetch(`${OAUTH_CONFIG.twitter.userUrl}?user.fields=public_metrics,username`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    const userData = await userResponse.json();
    const username = '@' + userData.data.username;
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
    
    await pool.query(
      `INSERT INTO social_accounts 
        (user_id, platform, username, platform_user_id, access_token, refresh_token, token_expires_at, is_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, NOW(), NOW())
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET 
         username = $3,
         platform_user_id = $4,
         access_token = $5,
         refresh_token = $6,
         token_expires_at = $7,
         is_verified = TRUE,
         updated_at = NOW()`,
      [stateData.userId, 'twitter', username, userData.data.id, tokens.access_token, tokens.refresh_token, expiresAt]
    );

    console.log(`✅ Twitter connected for user ${stateData.userId}: ${username}`);

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
// STATIC FILE SERVING
// ============================================

// Serve static files (for Railway deployment)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
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
