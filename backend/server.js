// Backend API server for Formative Platform
// Enhanced with rate limiting, input validation, and proper error handling

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, param, query, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// CONFIGURATION & SECURITY
// ==========================================

// Require JWT_SECRET in production
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('❌ FATAL: JWT_SECRET environment variable is required in production');
  process.exit(1);
}
const jwtSecret = JWT_SECRET || 'dev-secret-change-in-production';

// Database connection with error handling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

// ==========================================
// MIDDLEWARE
// ==========================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development, enable in production
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, '../')));

// ==========================================
// RATE LIMITING
// ==========================================

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: 'Too many login attempts, please try again after 15 minutes.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful logins
});

// Registration rate limiter (more lenient than login)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 registrations per hour per IP
  message: {
    success: false,
    error: 'Too many accounts created from this IP, please try again after an hour.',
    code: 'REGISTER_RATE_LIMIT_EXCEEDED'
  }
});

// Apply general rate limiting to all API routes
app.use('/api/', generalLimiter);

// ==========================================
// ERROR HANDLING UTILITIES
// ==========================================

// Standardized API response format
const ApiResponse = {
  success: (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      ...data,
      timestamp: new Date().toISOString()
    });
  },

  error: (res, message, statusCode = 400, code = 'ERROR', details = null) => {
    const response = {
      success: false,
      error: message,
      code: code,
      timestamp: new Date().toISOString()
    };
    if (details) response.details = details;
    return res.status(statusCode).json(response);
  }
};

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.error(
      res,
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    );
  }
  next();
};

// Async error wrapper to catch unhandled promise rejections
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ==========================================
// INPUT VALIDATION SCHEMAS
// ==========================================

const validators = {
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
      .escape(),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('userType')
      .notEmpty().withMessage('User type is required')
      .isIn(['influencer', 'brand', 'freelancer']).withMessage('Invalid user type')
  ],

  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
  ],

  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
      .escape(),
    body('profileData')
      .optional()
      .isObject().withMessage('Profile data must be an object')
  ],

  createOpportunity: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters')
      .escape(),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
    body('type')
      .notEmpty().withMessage('Type is required')
      .isIn(['influencer', 'brand', 'freelancer', 'campaign', 'collaboration']).withMessage('Invalid opportunity type'),
    body('industry')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Industry cannot exceed 100 characters'),
    body('budgetRange')
      .optional()
      .trim()
  ],

  opportunityId: [
    param('id')
      .isInt({ min: 1 }).withMessage('Invalid opportunity ID')
  ]
};

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return ApiResponse.error(res, 'Access token required', 401, 'AUTH_TOKEN_MISSING');
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return ApiResponse.error(res, 'Token has expired, please login again', 401, 'TOKEN_EXPIRED');
      }
      return ApiResponse.error(res, 'Invalid token', 403, 'INVALID_TOKEN');
    }
    req.user = user;
    next();
  });
};

// ==========================================
// DATABASE INITIALIZATION
// ==========================================

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

    // Create index for email lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    // Don't exit - allow the app to run without DB for demo mode
  }
}

// ==========================================
// API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  ApiResponse.success(res, {
    status: 'OK',
    message: 'Formative API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==========================================
// AUTH ROUTES
// ==========================================

// User Registration
app.post('/api/auth/register',
  registerLimiter,
  validators.register,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { name, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return ApiResponse.error(res, 'An account with this email already exists', 409, 'USER_EXISTS');
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
      jwtSecret,
      { expiresIn: '7d' }
    );

    console.log(`✅ New user registered: ${email} (${userType})`);

    ApiResponse.success(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.user_type,
        createdAt: user.created_at
      },
      token
    }, 201);
  })
);

// User Login
app.post('/api/auth/login',
  authLimiter,
  validators.login,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT id, name, email, password_hash, user_type FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Use generic message to prevent email enumeration
      return ApiResponse.error(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return ApiResponse.error(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: user.user_type },
      jwtSecret,
      { expiresIn: '7d' }
    );

    console.log(`✅ User logged in: ${email}`);

    ApiResponse.success(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.user_type
      },
      token
    });
  })
);

// ==========================================
// USER ROUTES
// ==========================================

// Get user profile
app.get('/api/user/profile',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const result = await pool.query(
      'SELECT id, name, email, user_type, profile_data, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return ApiResponse.error(res, 'User not found', 404, 'USER_NOT_FOUND');
    }

    ApiResponse.success(res, { user: result.rows[0] });
  })
);

// Update user profile
app.put('/api/user/profile',
  authenticateToken,
  validators.updateProfile,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { name, profileData } = req.body;

    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), profile_data = COALESCE($2, profile_data), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, user_type, profile_data',
      [name, profileData ? JSON.stringify(profileData) : null, req.user.userId]
    );

    if (result.rows.length === 0) {
      return ApiResponse.error(res, 'User not found', 404, 'USER_NOT_FOUND');
    }

    ApiResponse.success(res, { user: result.rows[0] });
  })
);

// Save onboarding data
app.post('/api/user/onboarding',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const onboardingData = req.body;

    const result = await pool.query(
      `UPDATE users SET 
        profile_data = $1,
        updated_at = NOW()
      WHERE id = $2 
      RETURNING id, name, email, user_type`,
      [JSON.stringify(onboardingData), userId]
    );

    if (result.rows.length === 0) {
      return ApiResponse.error(res, 'User not found', 404, 'USER_NOT_FOUND');
    }

    ApiResponse.success(res, {
      message: 'Onboarding data saved successfully',
      user: result.rows[0]
    });
  })
);

// Get user stats (for dashboard)
app.get('/api/user/stats',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userType = req.user.userType;

    // Return stats based on user type
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

    ApiResponse.success(res, { stats });
  })
);

// ==========================================
// OPPORTUNITIES ROUTES
// ==========================================

// Get opportunities
app.get('/api/opportunities',
  asyncHandler(async (req, res) => {
    const { type, industry, limit = 20, offset = 0 } = req.query;

    // Validate and sanitize query params
    const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const safeOffset = Math.max(parseInt(offset) || 0, 0);

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
    params.push(safeLimit, safeOffset);

    const result = await pool.query(query, params);
    
    ApiResponse.success(res, {
      opportunities: result.rows,
      pagination: {
        limit: safeLimit,
        offset: safeOffset,
        count: result.rows.length
      }
    });
  })
);

// Get single opportunity
app.get('/api/opportunities/:id',
  validators.opportunityId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT o.*, u.name as created_by_name FROM opportunities o LEFT JOIN users u ON o.created_by = u.id WHERE o.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return ApiResponse.error(res, 'Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
    }

    ApiResponse.success(res, { opportunity: result.rows[0] });
  })
);

// Create opportunity
app.post('/api/opportunities',
  authenticateToken,
  validators.createOpportunity,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { title, description, type, industry, budgetRange } = req.body;

    const result = await pool.query(
      'INSERT INTO opportunities (title, description, type, industry, budget_range, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, type, industry, budgetRange, req.user.userId]
    );

    console.log(`✅ New opportunity created: "${title}" by user ${req.user.userId}`);

    ApiResponse.success(res, { opportunity: result.rows[0] }, 201);
  })
);

// Apply to opportunity
app.post('/api/opportunities/:id/apply',
  authenticateToken,
  validators.opportunityId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    // Check if opportunity exists
    const opportunityCheck = await pool.query(
      'SELECT id, status FROM opportunities WHERE id = $1',
      [id]
    );

    if (opportunityCheck.rows.length === 0) {
      return ApiResponse.error(res, 'Opportunity not found', 404, 'OPPORTUNITY_NOT_FOUND');
    }

    if (opportunityCheck.rows[0].status !== 'active') {
      return ApiResponse.error(res, 'This opportunity is no longer accepting applications', 400, 'OPPORTUNITY_CLOSED');
    }

    // Check if already applied
    const existingApplication = await pool.query(
      'SELECT id FROM applications WHERE user_id = $1 AND opportunity_id = $2',
      [req.user.userId, id]
    );

    if (existingApplication.rows.length > 0) {
      return ApiResponse.error(res, 'You have already applied to this opportunity', 409, 'ALREADY_APPLIED');
    }

    const result = await pool.query(
      'INSERT INTO applications (user_id, opportunity_id, message) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, id, message]
    );

    console.log(`✅ Application submitted: User ${req.user.userId} -> Opportunity ${id}`);

    ApiResponse.success(res, { application: result.rows[0] }, 201);
  })
);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  ApiResponse.error(res, 'Endpoint not found', 404, 'ENDPOINT_NOT_FOUND');
});

// Serve static files (fallback for frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);

  // Don't expose internal error details in production
  const isDev = process.env.NODE_ENV !== 'production';

  ApiResponse.error(
    res,
    isDev ? err.message : 'An unexpected error occurred',
    err.status || 500,
    err.code || 'INTERNAL_ERROR',
    isDev ? { stack: err.stack } : null
  );
});

// ==========================================
// SERVER STARTUP
// ==========================================

async function startServer() {
  try {
    // Initialize database
    if (process.env.DATABASE_URL) {
      await initializeDatabase();
    } else {
      console.log('⚠️  No DATABASE_URL set - running in demo mode');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🚀 ====================================');
      console.log(`🚀 Formative API Server v1.0.0`);
      console.log(`🚀 Port: ${PORT}`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Demo Mode'}`);
      console.log('🚀 ====================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

startServer();
