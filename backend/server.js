// Backend API server for Formative Platform with OAuth Support
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');
const fetch = require('node-fetch');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
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

// Database initialization
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        user_type VARCHAR(50) NOT NULL,
        profile_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS opportunities (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        industry VARCHAR(100),
        budget_range VARCHAR(50),
        created_by INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        opportunity_id INTEGER REFERENCES opportunities(id),
        status VARCHAR(50) DEFAULT 'pending',
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Auth middleware
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

// ============================================
// OAUTH HELPER FUNCTIONS
// ============================================

// Generate secure random state for OAuth
function generateOAuthState() {
  return crypto.randomBytes(32).toString('hex');
}

// Generate code verifier and challenge for PKCE (Twitter)
function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
  return { verifier, challenge };
}

// Check if token is expired
function isTokenExpired(expiresAt) {
  if (!expiresAt) return true;
  return new Date(expiresAt) <= new Date();
}

// Refresh OAuth token
async function refreshOAuthToken(platform, refreshToken) {
  const config = OAUTH_CONFIG[platform];
  
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: config.clientId
    });

    if (platform === 'twitter') {
      // Twitter uses Basic Auth
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
      // Instagram & TikTok
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

// Get valid access token (refresh if needed)
async function getValidAccessToken(userId, platform) {
  const result = await pool.query(
    'SELECT access_token, refresh_token, token_expires_at FROM social_accounts WHERE user_id = $1 AND platform = $2',
    [userId, platform]
  );

  if (result.rows.length === 0) {
    throw new Error('Account not connected');
  }

  const account = result.rows[0];

  // Check if token is expired
  if (isTokenExpired(account.token_expires_at)) {
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
// OAUTH INITIATION ENDPOINTS
// ============================================

// Twitter OAuth - Initiate
app.get('/api/oauth/twitter/authorize', authenticateToken, (req, res) => {
  const state = generateOAuthState();
  const { verifier, challenge } = generatePKCE();
  
  // Store state and verifier (expires in 10 minutes)
  oauthStates.set(state, {
    userId: req.user.userId,
    verifier,
    platform: 'twitter',
    timestamp: Date.now()
  });

  // Clean up old states
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
app.get('/api/oauth/instagram/authorize', authenticateToken, (req, res) => {
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
app.get('/api/oauth/tiktok/authorize', authenticateToken, (req, res) => {
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

// Twitter OAuth - Callback
app.get('/api/oauth/twitter/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.redirect(`${process.env.FRONTEND_URL || 'https://hcs412.github.io/Formative'}/dashboard.html?error=oauth_denied`);
  }

  const stateData = oauthStates.get(state);
  if (!stateData || stateData.platform !== 'twitter') {
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?error=invalid_state`);
  }

  oauthStates.delete(state);

  try {
    // Exchange code for tokens
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

    // Get user info
    const userResponse = await fetch(`${OAUTH_CONFIG.twitter.userUrl}?user.fields=public_metrics,username`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    const userData = await userResponse.json();
    const username = '@' + userData.data.username;

    // Save to database
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
    
    await pool.query(
      `INSERT INTO social_accounts 
        (user_id, platform, username, access_token, refresh_token, token_expires_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET 
         username = $3,
         access_token = $4,
         refresh_token = $5,
         token_expires_at = $6,
         updated_at = NOW()`,
      [stateData.userId, 'twitter', username, tokens.access_token, tokens.refresh_token, expiresAt]
    );

    console.log(`✅ Twitter connected for user ${stateData.userId}: ${username}`);

    res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?oauth=success&platform=twitter`);
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?error=oauth_failed`);
  }
});

// Instagram OAuth - Callback
app.get('/api/oauth/instagram/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?error=oauth_denied`);
  }

  const stateData = oauthStates.get(state);
  if (!stateData || stateData.platform !== 'instagram') {
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?error=invalid_state`);
  }

  oauthStates.delete(state);

  try {
    // Exchange code for tokens
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

    // Get user info
    const userResponse = await fetch(
      `${OAUTH_CONFIG.instagram.userUrl}?fields=id,username&access_token=${tokens.access_token}`
    );

    const userData = await userResponse.json();
    const username = '@' + userData.username;

    // Instagram short-lived tokens last 1 hour, long-lived last 60 days
    // We'll store as-is and exchange for long-lived token separately if needed
    const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days

    await pool.query(
      `INSERT INTO social_accounts 
        (user_id, platform, username, access_token, token_expires_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET 
         username = $3,
         access_token = $4,
         token_expires_at = $5,
         updated_at = NOW()`,
      [stateData.userId, 'instagram', username, tokens.access_token, expiresAt]
    );

    console.log(`✅ Instagram connected for user ${stateData.userId}: ${username}`);

    res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?oauth=success&platform=instagram`);
  } catch (error) {
    console.error('Instagram OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?error=oauth_failed`);
  }
});

// TikTok OAuth - Callback
app.get('/api/oauth/tiktok/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?error=oauth_denied`);
  }

  const stateData = oauthStates.get(state);
  if (!stateData || stateData.platform !== 'tiktok') {
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?error=invalid_state`);
  }

  oauthStates.delete(state);

  try {
    // Exchange code for tokens
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

    // Get user info
    const userResponse = await fetch(OAUTH_CONFIG.tiktok.userUrl, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    const userData = await userResponse.json();
    const username = '@' + userData.data.user.display_name;

    // TikTok tokens last 90 days
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    await pool.query(
      `INSERT INTO social_accounts 
        (user_id, platform, username, access_token, refresh_token, token_expires_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET 
         username = $3,
         access_token = $4,
         refresh_token = $5,
         token_expires_at = $6,
         updated_at = NOW()`,
      [stateData.userId, 'tiktok', username, tokens.access_token, tokens.refresh_token, expiresAt]
    );

    console.log(`✅ TikTok connected for user ${stateData.userId}: ${username}`);

    res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?oauth=success&platform=tiktok`);
  } catch (error) {
    console.error('TikTok OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard.html?error=oauth_failed`);
  }
});

// ============================================
// STATS ENDPOINTS (OAuth-based)
// ============================================

// Get Twitter stats (OAuth)
app.get('/api/social/twitter/stats', authenticateToken, async (req, res) => {
  try {
    const accessToken = await getValidAccessToken(req.user.userId, 'twitter');

    // Fetch user data
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

    // Calculate engagement rate
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

    // Save stats to database
    await pool.query(
      `UPDATE social_accounts 
       SET stats = $1, last_synced_at = NOW(), updated_at = NOW()
       WHERE user_id = $2 AND platform = 'twitter'`,
      [JSON.stringify(stats), req.user.userId]
    );

    res.json({
      success: true,
      platform: 'twitter',
      username: userData.username,
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

// Get Instagram stats (OAuth)
app.get('/api/social/instagram/stats', authenticateToken, async (req, res) => {
  try {
    const accessToken = await getValidAccessToken(req.user.userId, 'instagram');

    // Fetch user data
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username,media_count,account_type&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }

    const userData = await response.json();

    // Note: Instagram Basic Display doesn't provide follower count
    // Need Instagram Graph API (business accounts) for that
    const stats = {
      username: userData.username,
      mediaCount: userData.media_count,
      accountType: userData.account_type
    };

    // Save to database
    await pool.query(
      `UPDATE social_accounts 
       SET stats = $1, last_synced_at = NOW(), updated_at = NOW()
       WHERE user_id = $2 AND platform = 'instagram'`,
      [JSON.stringify(stats), req.user.userId]
    );

    res.json({
      success: true,
      platform: 'instagram',
      username: userData.username,
      stats,
      fetchedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Instagram stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Instagram stats',
      message: error.message 
    });
  }
});

// Get TikTok stats (OAuth)
app.get('/api/social/tiktok/stats', authenticateToken, async (req, res) => {
  try {
    const accessToken = await getValidAccessToken(req.user.userId, 'tiktok');

    // Fetch user data
    const response = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=display_name,follower_count,following_count,likes_count,video_count',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`TikTok API error: ${response.status}`);
    }

    const data = await response.json();
    const userData = data.data.user;

    const engagementRate = userData.follower_count > 0
      ? ((userData.likes_count / (userData.video_count * userData.follower_count)) * 100).toFixed(2)
      : 0;

    const stats = {
      followers: userData.follower_count,
      following: userData.following_count,
      likes: userData.likes_count,
      videos: userData.video_count,
      engagementRate: parseFloat(engagementRate)
    };

    // Save to database
    await pool.query(
      `UPDATE social_accounts 
       SET stats = $1, last_synced_at = NOW(), updated_at = NOW()
       WHERE user_id = $2 AND platform = 'tiktok'`,
      [JSON.stringify(stats), req.user.userId]
    );

    res.json({
      success: true,
      platform: 'tiktok',
      username: userData.display_name,
      stats,
      fetchedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('TikTok stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch TikTok stats',
      message: error.message 
    });
  }
});

// ============================================
// EXISTING ENDPOINTS (continued...)
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Formative API with OAuth is running' });
});

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

    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.user_type },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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
      'SELECT id, name, email, password_hash, user_type FROM users WHERE email = $1',
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

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.user_type
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, user_type, profile_data, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, profileData } = req.body;
    
    const result = await pool.query(
      'UPDATE users SET name = $1, profile_data = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, user_type, profile_data',
      [name, JSON.stringify(profileData), req.user.userId]
    );

    res.json({ user: result.rows[0] });
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
    const { socialAccounts, ...otherData } = req.body;
    
    await client.query(
      `UPDATE users SET 
        profile_data = $1,
        updated_at = NOW()
      WHERE id = $2`,
      [JSON.stringify(otherData), userId]
    );
    
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
      'SELECT id, name, email, user_type FROM users WHERE id = $1',
      [userId]
    );
    
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

// Get user's connected social accounts
app.get('/api/user/social-accounts', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT platform, username, stats, last_synced_at, created_at 
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

// Get opportunities
app.get('/api/opportunities', async (req, res) => {
  try {
    const { type, industry, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT o.*, u.name as created_by_name FROM opportunities o LEFT JOIN users u ON o.created_by = u.id WHERE o.status = $1';
    const params = ['active'];
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
    res.json({ opportunities: result.rows });
  } catch (error) {
    console.error('Opportunities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create opportunity
app.post('/api/opportunities', authenticateToken, async (req, res) => {
  try {
    const { title, description, type, industry, budgetRange } = req.body;

    const result = await pool.query(
      'INSERT INTO opportunities (title, description, type, industry, budget_range, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, type, industry, budgetRange, req.user.userId]
    );

    res.status(201).json({ opportunity: result.rows[0] });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Apply to opportunity
app.post('/api/opportunities/:id/apply', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const existingApplication = await pool.query(
      'SELECT id FROM applications WHERE user_id = $1 AND opportunity_id = $2',
      [req.user.userId, id]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ error: 'Already applied to this opportunity' });
    }

    const result = await pool.query(
      'INSERT INTO applications (user_id, opportunity_id, message) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, id, message]
    );

    res.status(201).json({ application: result.rows[0] });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Formative API with OAuth running on port ${PORT}`);
      console.log(`📊 Database connected successfully`);
      console.log(`🔐 OAuth enabled for: Twitter, Instagram, TikTok`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
