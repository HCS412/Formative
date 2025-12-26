// Database configuration and connection pool
const { Pool } = require('pg');

// SSL configuration for Railway's PostgreSQL
const sslConfig = (() => {
  if (process.env.NODE_ENV !== 'production') {
    return false; // No SSL in development
  }
  
  // Railway internal PostgreSQL requires SSL but self-signed certs
  // Use rejectUnauthorized: false for Railway's internal network
  // This is acceptable because Railway's internal network is isolated
  // For external databases, set DATABASE_SSL_REJECT_UNAUTHORIZED=true
  const rejectUnauthorized = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true';
  
  return { rejectUnauthorized };
})();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  // Connection pool settings for production stability
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Log pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
});

module.exports = pool;
