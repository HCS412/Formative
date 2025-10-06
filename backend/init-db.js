// Database initialization script for Formative Platform
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');

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

    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id),
        receiver_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample opportunities
    await pool.query(`
      INSERT INTO opportunities (title, description, type, industry, budget_range, created_by)
      VALUES 
        ('Social Media Campaign for Tech Startup', 'Looking for micro-influencers to promote our new app', 'influencer', 'technology', '$500-$2000', 1),
        ('Lifestyle Photography for Fashion Brand', 'Need professional photos for our new collection', 'freelancer', 'fashion', '$1000-$5000', 1),
        ('Video Editor for YouTube Channel', 'Seeking experienced video editor for gaming content', 'freelancer', 'entertainment', '$2000-$8000', 1),
        ('Brand Partnership for Outdoor Gear', 'Collaboration with outdoor enthusiasts', 'influencer', 'sports', '$1000-$3000', 1)
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Database initialized successfully!');
    console.log('📊 Tables created: users, opportunities, applications, messages');
    console.log('🎯 Sample data inserted');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run initialization
initializeDatabase();
