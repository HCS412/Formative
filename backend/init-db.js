// Database initialization script for Formative Platform
// Updated with complete schema including social_accounts table
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Initializing database...');
    
    await client.query('BEGIN');

    // ==========================================
    // 1. USERS TABLE
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('influencer', 'brand', 'freelancer')),
        profile_data JSONB DEFAULT '{}',
        email_verified BOOLEAN DEFAULT FALSE,
        avatar_url TEXT,
        location VARCHAR(255),
        bio TEXT,
        website VARCHAR(500),
        username VARCHAR(50) UNIQUE,
        is_public BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // ==========================================
    // 2. SOCIAL ACCOUNTS TABLE (NEW!)
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS social_accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL CHECK (platform IN ('twitter', 'instagram', 'tiktok', 'youtube', 'bluesky', 'twitch', 'linkedin', 'pinterest', 'reddit', 'discord')),
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
    console.log('✅ Social accounts table created/verified');

    // Create index for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform)
    `);

    // ==========================================
    // 3. OPPORTUNITIES TABLE
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS opportunities (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL CHECK (type IN ('influencer', 'freelancer', 'brand')),
        industry VARCHAR(100),
        budget_min INTEGER,
        budget_max INTEGER,
        budget_range VARCHAR(50),
        requirements JSONB DEFAULT '[]',
        platforms JSONB DEFAULT '[]',
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'closed', 'completed')),
        deadline TIMESTAMP,
        location VARCHAR(255),
        is_remote BOOLEAN DEFAULT TRUE,
        views_count INTEGER DEFAULT 0,
        applications_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Opportunities table created/verified');

    // Create indexes for opportunities
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_opportunities_created_by ON opportunities(created_by)
    `);

    // ==========================================
    // 4. APPLICATIONS TABLE
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        opportunity_id INTEGER NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected', 'withdrawn')),
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
    console.log('✅ Applications table created/verified');

    // ==========================================
    // 5. MESSAGES TABLE
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id UUID DEFAULT gen_random_uuid(),
        sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'system')),
        attachment_url TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Messages table created/verified');

    // Create indexes for messages
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)
    `);

    // ==========================================
    // 6. CONVERSATIONS TABLE (NEW!)
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        conversation_id UUID UNIQUE DEFAULT gen_random_uuid(),
        participant_1 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        participant_2 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_message_preview TEXT,
        opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(participant_1, participant_2)
      )
    `);
    console.log('✅ Conversations table created/verified');

    // ==========================================
    // 7. CAMPAIGNS TABLE (NEW!)
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        brand_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
        budget INTEGER,
        start_date DATE,
        end_date DATE,
        goals JSONB DEFAULT '{}',
        metrics JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Campaigns table created/verified');

    // ==========================================
    // 8. CAMPAIGN PARTICIPANTS TABLE (NEW!)
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaign_participants (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'influencer' CHECK (role IN ('influencer', 'freelancer', 'manager')),
        status VARCHAR(50) DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'completed', 'removed')),
        payment_amount INTEGER,
        payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed')),
        deliverables JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(campaign_id, user_id)
      )
    `);
    console.log('✅ Campaign participants table created/verified');

    // ==========================================
    // 9. REVIEWS TABLE (NEW!)
    // ==========================================
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
    console.log('✅ Reviews table created/verified');

    // ==========================================
    // 10. NOTIFICATIONS TABLE (NEW!)
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('message', 'application', 'opportunity', 'campaign', 'review', 'system', 'payment')),
        title VARCHAR(255) NOT NULL,
        content TEXT,
        link VARCHAR(500),
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Notifications table created/verified');

    // Create index for notifications
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE
    `);

    // ==========================================
    // 11. USER SETTINGS TABLE
    // ==========================================
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
    console.log('✅ User settings table created/verified');

    // ==========================================
    // 12. DELIVERABLES TABLE (NEW!)
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS deliverables (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
        participant_id INTEGER NOT NULL REFERENCES campaign_participants(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL CHECK (type IN ('post', 'story', 'reel', 'video', 'blog', 'review', 'photo', 'other')),
        platform VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'revision_requested', 'approved', 'rejected')),
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
    console.log('✅ Deliverables table created/verified');

    // Create indexes for deliverables
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_deliverables_campaign ON deliverables(campaign_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_deliverables_participant ON deliverables(participant_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_deliverables_status ON deliverables(status)
    `);

    // ==========================================
    // 13. PAYMENT METHODS TABLE (NEW!)
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL CHECK (type IN ('stripe', 'paypal', 'bank', 'crypto_eth', 'crypto_btc', 'crypto_usdc', 'crypto_sol')),
        is_default BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        
        -- Stripe fields
        stripe_account_id VARCHAR(255),
        stripe_account_status VARCHAR(50),
        
        -- Crypto fields
        wallet_address VARCHAR(255),
        wallet_network VARCHAR(50),
        
        -- Bank fields (for reference only, actual details in Stripe)
        bank_last_four VARCHAR(4),
        bank_name VARCHAR(255),
        
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Payment methods table created/verified');

    // Create index for payment methods
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id)
    `);

    // ==========================================
    // 14. PAYMENTS TABLE (NEW!)
    // ==========================================
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
        
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'disputed')),
        
        -- External references
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
    console.log('✅ Payments table created/verified');

    // Create indexes for payments
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_campaign ON payments(campaign_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_payer ON payments(payer_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_payee ON payments(payee_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)
    `);

    // ==========================================
    // 15. ANALYTICS EVENTS TABLE (NEW!)
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        event_type VARCHAR(100) NOT NULL,
        event_category VARCHAR(50) NOT NULL CHECK (event_category IN ('page_view', 'user_action', 'campaign', 'engagement', 'conversion', 'error')),
        
        -- Context
        page VARCHAR(255),
        referrer VARCHAR(500),
        
        -- Target (what was interacted with)
        target_type VARCHAR(50),
        target_id INTEGER,
        
        -- Additional data
        properties JSONB DEFAULT '{}',
        
        -- Session tracking
        session_id VARCHAR(255),
        device_type VARCHAR(50),
        browser VARCHAR(100),
        ip_address INET,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Analytics events table created/verified');

    // Create indexes for analytics (time-series optimized)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_target ON analytics_events(target_type, target_id)
    `);

    // ==========================================
    // 16. SAVED/BOOKMARKS TABLE (NEW!)
    // ==========================================
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('opportunity', 'user', 'campaign')),
        item_id INTEGER NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, item_type, item_id)
      )
    `);
    console.log('✅ Saved items table created/verified');

    // ==========================================
    // ADD 2FA COLUMNS TO USERS IF MISSING
    // ==========================================
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret TEXT
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE
    `);
    console.log('✅ 2FA columns verified on users table');

    // ==========================================
    // INSERT SAMPLE DATA
    // ==========================================
    
    // Check if sample data already exists
    const existingOpportunities = await client.query('SELECT COUNT(*) FROM opportunities');
    
    if (parseInt(existingOpportunities.rows[0].count) === 0) {
      // Insert sample opportunities
      await client.query(`
        INSERT INTO opportunities (title, description, type, industry, budget_range, budget_min, budget_max, status, platforms, requirements)
        VALUES 
          (
            'Social Media Campaign for Tech Startup',
            'Looking for micro-influencers to promote our new productivity app. We need authentic content creators who can showcase how our app improves daily workflows.',
            'influencer',
            'technology',
            '$500-$2000',
            500,
            2000,
            'active',
            '["instagram", "tiktok", "twitter"]',
            '["10K+ followers", "Tech/productivity niche", "High engagement rate"]'
          ),
          (
            'Lifestyle Photography for Fashion Brand',
            'Need professional photographers for our new sustainable fashion collection. Looking for creative individuals who can capture the essence of eco-friendly fashion.',
            'freelancer',
            'fashion',
            '$1000-$5000',
            1000,
            5000,
            'active',
            '["instagram", "pinterest"]',
            '["Portfolio required", "Fashion photography experience", "Own equipment"]'
          ),
          (
            'Video Editor for YouTube Channel',
            'Seeking experienced video editor for gaming content. Must be proficient in Adobe Premiere or Final Cut Pro. Long-term collaboration opportunity.',
            'freelancer',
            'entertainment',
            '$2000-$8000',
            2000,
            8000,
            'active',
            '["youtube", "twitch"]',
            '["Gaming content experience", "Fast turnaround", "Motion graphics a plus"]'
          ),
          (
            'Brand Partnership for Outdoor Gear',
            'Adventure and outdoor enthusiasts wanted for ongoing brand partnership. Create authentic content featuring our hiking and camping gear.',
            'influencer',
            'sports',
            '$1000-$3000',
            1000,
            3000,
            'active',
            '["instagram", "youtube", "tiktok"]',
            '["Outdoor/adventure niche", "Authentic content style", "Active lifestyle"]'
          ),
          (
            'UGC Creator for Beauty Brand',
            'Looking for diverse UGC creators to produce authentic content for our skincare line. No follower minimum - we care about content quality!',
            'influencer',
            'beauty',
            '$200-$800',
            200,
            800,
            'active',
            '["tiktok", "instagram"]',
            '["High-quality video content", "Natural lighting setup", "Skincare interest"]'
          ),
          (
            'Podcast Editor Needed',
            'Weekly podcast needs a dedicated audio editor. Episodes are typically 60-90 minutes. Looking for someone detail-oriented with quick turnaround.',
            'freelancer',
            'entertainment',
            '$150-$300 per episode',
            150,
            300,
            'active',
            '[]',
            '["Audio editing experience", "Podcast format knowledge", "Weekly availability"]'
          )
        ON CONFLICT DO NOTHING
      `);
      console.log('🎯 Sample opportunities inserted');
      
      // Insert sample campaigns (requires a brand user)
      // First check if we have any brand users
      const brandUsers = await client.query(`SELECT id FROM users WHERE user_type = 'brand' LIMIT 1`);
      
      if (brandUsers.rows.length > 0) {
        const brandId = brandUsers.rows[0].id;
        
        await client.query(`
          INSERT INTO campaigns (name, description, brand_id, status, budget, start_date, end_date, goals, metrics)
          VALUES 
            (
              'Summer Collection Launch',
              'Promote our new summer fashion collection across social media platforms',
              $1,
              'active',
              5000,
              CURRENT_DATE,
              CURRENT_DATE + INTERVAL '30 days',
              '{"awareness": true, "sales": true, "ugc": true}',
              '{"target_reach": 100000, "target_engagement": 5000}'
            ),
            (
              'Product Review Campaign',
              'Get authentic reviews from micro-influencers for our new tech gadget',
              $1,
              'active',
              3000,
              CURRENT_DATE - INTERVAL '7 days',
              CURRENT_DATE + INTERVAL '14 days',
              '{"reviews": true, "awareness": true}',
              '{"target_reviews": 10, "target_reach": 50000}'
            ),
            (
              'Holiday Giveaway',
              'Run a collaborative giveaway campaign with multiple influencers',
              $1,
              'draft',
              8000,
              CURRENT_DATE + INTERVAL '30 days',
              CURRENT_DATE + INTERVAL '45 days',
              '{"engagement": true, "followers": true}',
              '{"target_entries": 5000, "target_new_followers": 2000}'
            )
          ON CONFLICT DO NOTHING
        `, [brandId]);
        console.log('🎯 Sample campaigns inserted');
      }
    } else {
      console.log('📊 Sample data already exists, skipping...');
    }

    await client.query('COMMIT');
    
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ DATABASE INITIALIZATION COMPLETE');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('📊 Tables created/verified:');
    console.log('   • users (with 2FA columns)');
    console.log('   • social_accounts');
    console.log('   • opportunities');
    console.log('   • applications');
    console.log('   • messages');
    console.log('   • conversations');
    console.log('   • campaigns');
    console.log('   • campaign_participants');
    console.log('   • deliverables');
    console.log('   • reviews');
    console.log('   • notifications');
    console.log('   • user_settings');
    console.log('   • payment_methods');
    console.log('   • payments');
    console.log('   • analytics_events');
    console.log('   • saved_items');
    console.log('');
    console.log('🔗 Indexes created for optimal performance');
    console.log('🎯 Sample data ready');
    console.log('');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('');
    console.error('═══════════════════════════════════════════════════');
    console.error('❌ DATABASE INITIALIZATION FAILED');
    console.error('═══════════════════════════════════════════════════');
    console.error('Error:', error.message);
    console.error('');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run initialization if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase, pool };
