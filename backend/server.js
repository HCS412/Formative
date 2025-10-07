// Backend API server for Formative Platform
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');

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

// Save onboarding data
app.post('/api/user/onboarding', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const onboardingData = req.body;
    
    // Update user with onboarding data
    const result = await pool.query(
      `UPDATE users SET 
        profile_data = $1,
        updated_at = NOW()
      WHERE id = $2 
      RETURNING id, name, email, user_type`,
      [
        JSON.stringify(onboardingData),
        userId
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Onboarding data saved successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Onboarding save error:', error);
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
