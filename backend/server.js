// Backend API server for Formative Platform
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');
const fetch = require('node-fetch');

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

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Database initialization
async function initializeDatabase() {
  try {
    // Create users table
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

    // Create opportunities table
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

    // Create applications table
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

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Formative API is running' });
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Validate input
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, user_type) VALUES ($1, $2, $3, $4) RETURNING id, name, email, user_type, created_at',
      [name, email, passwordHash, userType]
    );

    const user = result.rows[0];

    // Generate JWT token
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

    // Find user
    const result = await pool.query(
      'SELECT id, name, email, password_hash, user_type FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
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

// Save onboarding data (UPDATED to save social accounts to database)
app.post('/api/user/onboarding', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.userId;
    const { socialAccounts, ...otherData } = req.body;
    
    // Save profile data (excluding social accounts)
    await client.query(
      `UPDATE users SET 
        profile_data = $1,
        updated_at = NOW()
      WHERE id = $2`,
      [JSON.stringify(otherData), userId]
    );
    
    // Save social accounts to dedicated table
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
          
          console.log(`✅ Saved ${platform} account: ${username} for user ${userId}`);
        }
      }
    }
    
    await client.query('COMMIT');
    
    // Get updated user data
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

// Get user's connected social accounts (NEW)
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

// Connect or update a social media account (NEW)
app.post('/api/social/connect/:platform', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.params;
    const { username, accessToken, refreshToken, tokenExpiresAt } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    const result = await pool.query(
      `INSERT INTO social_accounts 
        (user_id, platform, username, access_token, refresh_token, token_expires_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET 
         username = $3,
         access_token = $4,
         refresh_token = $5,
         token_expires_at = $6,
         updated_at = NOW()
       RETURNING platform, username, created_at, updated_at`,
      [
        req.user.userId, 
        platform.toLowerCase(), 
        username, 
        accessToken || null, 
        refreshToken || null,
        tokenExpiresAt || null
      ]
    );
    
    console.log(`✅ Connected ${platform} account for user ${req.user.userId}`);
    
    res.json({ 
      success: true,
      message: `${platform} account connected successfully`,
      account: result.rows[0]
    });
    
  } catch (error) {
    console.error('Social account connect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Disconnect a social media account (NEW)
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

// Get user stats (for dashboard)
app.get('/api/user/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;
    
    // Return demo stats based on user type
    let stats = {};
    
    if (userType === 'influencer') {
      stats = {
        totalFollowers: '12.5K',
        engagementRate: 8.7,
        activeCampaigns: 3,
        monthlyEarnings: 2500
      };
    } else if (userType === 'brand') {
      stats = {
        campaignsLaunched: 5,
        influencersConnected: 12,
        averageROI: 234
      };
    } else if (userType === 'freelancer') {
      stats = {
        projectsCompleted: 8,
        averageRating: 4.9,
        monthlyEarnings: 3200
      };
    }
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Twitter stats for a user (UPDATED to save stats to database)
app.get('/api/social/twitter/stats', authenticateToken, async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ 
        error: 'Username required',
        message: 'Please provide a Twitter username as a query parameter'
      });
    }
    
    // Remove @ symbol if present
    const cleanUsername = username.replace('@', '');
    
    // Check if Bearer Token is configured
    if (!process.env.TWITTER_BEARER_TOKEN) {
      return res.status(500).json({ 
        error: 'Twitter API not configured',
        message: 'TWITTER_BEARER_TOKEN environment variable is missing'
      });
    }
    
    console.log(`Fetching Twitter stats for: ${cleanUsername}`);
    
    // Call Twitter API v2
    const twitterResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${cleanUsername}?user.fields=public_metrics,created_at,description,profile_image_url`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          'User-Agent': 'Formative-Dashboard/1.0'
        }
      }
    );
    
    const twitterData = await twitterResponse.json();
    
    // Handle Twitter API errors
    if (!twitterResponse.ok) {
      console.error('Twitter API error:', twitterData);
      return res.status(twitterResponse.status).json({ 
        error: 'Twitter API error',
        message: twitterData.detail || twitterData.title || 'Failed to fetch Twitter data',
        twitterError: twitterData
      });
    }
    
    // Check if user was found
    if (!twitterData.data) {
      return res.status(404).json({ 
        error: 'User not found',
        message: `Twitter user @${cleanUsername} not found`
      });
    }
    
    const userData = twitterData.data;
    const metrics = userData.public_metrics;
    
    // Calculate engagement rate (simplified - tweets per follower ratio as percentage)
    const engagementRate = metrics.followers_count > 0 
      ? ((metrics.tweet_count / metrics.followers_count) * 10).toFixed(2)
      : 0;
    
    // Save stats to database
    const statsData = {
      followers: metrics.followers_count,
      following: metrics.following_count,
      tweets: metrics.tweet_count,
      listed: metrics.listed_count,
      engagementRate: parseFloat(engagementRate),
      displayName: userData.name,
      profileImage: userData.profile_image_url,
      bio: userData.description,
      accountCreated: userData.created_at
    };
    
    await pool.query(
      `UPDATE social_accounts 
       SET stats = $1, last_synced_at = NOW(), updated_at = NOW()
       WHERE user_id = $2 AND platform = 'twitter' AND username = $3`,
      [JSON.stringify(statsData), req.user.userId, `@${cleanUsername}`]
    );
    
    // Format the response
    const formattedStats = {
      success: true,
      platform: 'twitter',
      username: userData.username,
      displayName: userData.name,
      profileImage: userData.profile_image_url,
      bio: userData.description,
      accountCreated: userData.created_at,
      stats: {
        followers: metrics.followers_count,
        following: metrics.following_count,
        tweets: metrics.tweet_count,
        listed: metrics.listed_count,
        engagementRate: parseFloat(engagementRate)
      },
      fetchedAt: new Date().toISOString()
    };
    
    console.log(`✅ Successfully fetched and saved stats for @${cleanUsername}`);
    
    res.json(formattedStats);
    
  } catch (error) {
    console.error('Twitter stats fetch error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
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

    // Check if already applied
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

// Serve static files (fallback for frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Formative API server running on port ${PORT}`);
      console.log(`📊 Database connected successfully`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
