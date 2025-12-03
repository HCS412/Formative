// Database connection test script
const { Pool } = require('pg');

async function testDatabaseConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Testing database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('📊 Database time:', result.rows[0].current_time);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Existing tables:', tablesResult.rows.map(row => row.table_name));
    
    client.release();
    await pool.end();
    
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Make sure DATABASE_URL is set correctly');
    process.exit(1);
  }
}

// Run test if called directly
if (require.main === module) {
  testDatabaseConnection();
}

module.exports = testDatabaseConnection;


