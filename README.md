# Formative

A modern influencer marketing platform connecting brands, influencers, and freelancers for authentic collaborations. Built with React and Node.js, featuring crypto payment integration, smart contract escrow, creator e-commerce shops, enterprise-grade security, and role-based access control.

**Live URL**: [chic-patience-production.up.railway.app](https://chic-patience-production.up.railway.app)

---

## Table of Contents

- [Features](#features)
- [Security](#security)
- [Authorization and Access Control](#authorization-and-access-control)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Development Status](#development-status)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Authentication and Security
- User registration with role selection (Influencer, Brand, Freelancer)
- JWT-based authentication with secure token management
- Two-Factor Authentication (2FA) with TOTP and QR code setup
- Auto-logout after 15 minutes of inactivity
- Session management with "Remember Me" option
- Password hashing with bcrypt
- Account lockout after 5 failed login attempts
- Strong password requirements enforcement

### User Onboarding
- Multi-step onboarding flow tailored by user type
- Profile customization (bio, location, website, avatar)
- Social platform selection and connection
- Niche and industry selection
- Goal setting for personalized experience

### Dashboard
- Role-based dashboard views
- Real-time statistics and metrics
- Quick actions and navigation
- Global keyboard shortcuts (Cmd+K for search, Cmd+1-8 for navigation)
- Responsive design for all device sizes

### Teams and Collaboration
- Create and manage teams (Brand, Agency, Creator Collective)
- Invite team members by email
- Role-based team permissions (Admin, Manager, Member)
- Accept/decline team invitations
- Team analytics and performance tracking

### Opportunities Marketplace
- Browse and filter opportunities by type, industry, and platform
- Detailed opportunity views with requirements and budgets
- Application submission with portfolio links
- Application tracking and status updates

### Campaign Management
- Create and manage marketing campaigns
- Milestone-based deliverables
- Smart contract escrow integration (optional)
- Campaign performance tracking

### Creator Tools
- UTM Link Builder for tracking marketing links
- Quick presets for major platforms (Instagram, Twitter, TikTok, YouTube)
- Link click analytics
- Calendly booking integration for scheduling

### Public Creator Page (Media Kit)
- Shareable public profile pages at `/kit/:username`
- Beautiful gradient design with social proof
- Showcase social stats across all platforms
- Display connected social accounts with follower counts
- Call-to-action for brand collaboration
- One-click copy and share functionality

### Creator Shop (E-Commerce)
- **Shop Management Dashboard**: Create and manage digital products
- **Product Types**: Digital files, courses, templates
- **Product Features**:
  - Name, descriptions (short + full)
  - Pricing with compare-at prices for sales
  - Cover images and gallery
  - Tags for categorization
  - Download limits per purchase
- **Public Shop Pages**: Beautiful storefronts at `/shop/:username`
- **Product Detail Pages**: Full product views with checkout
- **Sales Analytics**: Revenue tracking, sales counts, monthly metrics
- **Order Management**: View all sales and customer orders
- **Download System**: Secure token-based file delivery
- **Platform Fees**: Automatic 8% fee calculation
- **Shareable Shop Links**: One-click copy and share

### Payments
- Stripe Connect integration for fiat payments (USD, EUR, card payments)
- Crypto wallet connection via RainbowKit
- Support for MetaMask, Coinbase Wallet, Rainbow, and WalletConnect
- Multi-chain support: Ethereum, Polygon, Optimism, Arbitrum, Base
- Platform fee calculator (8% fee structure)
- Payment history and transaction tracking

### Messaging
- Conversation threads between users
- Auto-created conversations on application acceptance
- Unread message indicators
- Message history

### Notifications
- In-app notification center
- Application status updates
- Collaboration alerts
- Team invitations
- Mark as read functionality

### Social Media Integration
- OAuth connections: Twitter/X, Instagram, TikTok, YouTube
- Real-time follower statistics
- Verified account badges
- Automatic stats refresh

### Smart Contracts
- Solidity-based Campaign Escrow contract
- Milestone-based payment releases
- Built-in dispute resolution mechanism
- Target deployment: Base (Ethereum L2)

---

## Security

Formative implements enterprise-grade security measures designed for SOC 2 compliance readiness.

### Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication endpoints: 10 attempts per 15 minutes
- Password reset: 3 attempts per hour

### Account Protection
- **Account Lockout**: Accounts are locked for 15 minutes after 5 failed login attempts
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (!@#$%^&*)
- Real-time password strength indicator during registration

### Security Headers
Implemented via Helmet middleware:
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- X-XSS-Protection
- Referrer-Policy

### Token Security
- JWT tokens with configurable expiration (7 days default, 30 days with "Remember Me")
- Server fails to start in production if JWT_SECRET is not configured
- No hardcoded fallback secrets in production mode

### OAuth Token Encryption
- OAuth access and refresh tokens encrypted at rest using AES-256-GCM
- Encryption key configured via ENCRYPTION_KEY environment variable
- Graceful handling of legacy unencrypted tokens during migration
- Authenticated encryption prevents tampering

### Smart Contract Security
- ReentrancyGuard protection on all payment functions
- Checks-Effects-Interactions pattern for state changes
- Event logging for all fund movements
- Platform fee update events for transparency

### Audit Logging
Comprehensive logging of security-sensitive actions:
- User registration
- Login attempts (success/failure)
- 2FA setup, verification, and disabling
- Password resets
- Role changes

Each audit log captures:
- Event type
- User ID
- IP address
- User agent
- Timestamp
- Event details (JSON)

### Input Sanitization
- Request body size limited to 10KB
- Input trimming and escaping via express-validator
- SQL injection protection via parameterized queries

---

## Authorization and Access Control

Formative includes a comprehensive Role-Based Access Control (RBAC) system.

### System Roles

| Role | Description |
|------|-------------|
| Admin | Full system access to all features and settings |
| Creator | Content creator/influencer with standard access |
| Brand | Business account with campaign and team management |
| Agency | Multi-client management with extended permissions |
| Moderator | Content and community moderation capabilities |

### Permission Categories

**Users**: view, edit, delete, manage_roles  
**Campaigns**: view, create, edit, delete, manage_participants  
**Opportunities**: view, create, edit, delete  
**Teams**: view, create, edit, delete, manage_members  
**Payments**: view, create, manage  
**Analytics**: view, export  
**Admin**: dashboard, settings, feature_flags, audit_logs

### Teams

Users can create and manage teams with:
- Three team types: Brand, Agency, Creator Collective
- Built-in roles: Admin (full access), Manager (campaigns + analytics), Member (view only)
- Email-based invitations
- Pending invitation management

### Feature Flags

Control feature rollout with:
- Global enable/disable
- Percentage-based rollout
- User type restrictions
- Per-user overrides

Pre-configured flags:
- `smart_contracts` - Blockchain escrow
- `ai_matching` - AI creator-brand matching
- `advanced_analytics` - Detailed performance analytics
- `team_collaboration` - Multi-user team features
- `api_access` - External API access
- `white_label` - Custom branding options
- `bulk_messaging` - Mass outreach
- `calendar_integration` - Calendar sync

### Subscription Tiers

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0/mo | 5 applications/month, 1 campaign, 100MB storage |
| Starter | $19/mo | Unlimited applications, 5 campaigns, 1GB storage |
| Pro | $49/mo | Everything + team collaboration, API access, 10GB |
| Enterprise | Custom | Unlimited everything, custom integrations, SLA |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router v6, TailwindCSS |
| State Management | TanStack Query, React Context |
| Web3 | RainbowKit, wagmi, viem |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | JWT, bcrypt, TOTP (2FA) |
| Security | Helmet, express-rate-limit, express-validator |
| OAuth | Twitter API v2, Instagram, TikTok, YouTube |
| Payments | Stripe Connect, WalletConnect |
| Smart Contracts | Solidity |
| Build Tool | Vite |
| Hosting | Railway |

---

## Project Structure

```
Formative/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Layout components (Navbar, DashboardLayout)
│   │   │   └── ui/             # Base UI components (Button, Card, Modal)
│   │   ├── context/            # React context providers
│   │   │   ├── AuthContext.jsx       # Authentication state
│   │   │   └── PermissionContext.jsx # RBAC permissions
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useActivityTimeout.js
│   │   │   ├── useKeyboardShortcuts.js
│   │   │   └── useCampaignEscrow.js
│   │   ├── lib/                # Utilities and configurations
│   │   │   ├── api.js          # API client
│   │   │   ├── wagmi.js        # Web3 config
│   │   │   └── contracts.js    # Smart contract ABIs
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Teams.jsx
│   │   │   ├── Links.jsx       # UTM Link Builder
│   │   │   ├── MediaKit.jsx    # Public Creator Page
│   │   │   ├── Shop.jsx        # Creator Shop management
│   │   │   ├── PublicShop.jsx  # Public storefront
│   │   │   └── ...
│   │   ├── App.jsx             # Main app component with routing
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── config/                 # Configuration modules
│   │   ├── database.js         # PostgreSQL pool configuration
│   │   └── security.js         # JWT and encryption configuration
│   ├── middleware/             # Express middleware
│   │   ├── auth.js             # Authentication and RBAC middleware
│   │   ├── errorHandler.js     # Centralized error handling
│   │   └── rateLimiter.js      # Rate limiting configuration
│   ├── routes/                 # Route modules (for future migration)
│   │   └── auth.js             # Authentication routes
│   ├── utils/                  # Utility functions
│   │   └── security.js         # Security helpers (sanitization, audit)
│   ├── server.js               # Main Express API server
│   └── init-db.js              # Database initialization
├── contracts/
│   ├── CampaignEscrow.sol      # Smart contract with ReentrancyGuard
│   └── README.md               # Contract deployment guide
├── package.json                # Root package.json
├── railway.json                # Railway deployment config
├── nixpacks.toml               # Build configuration
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v20 or higher
- PostgreSQL database
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/HCS412/Formative.git
cd Formative

# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Set environment variables
# Create a .env file with required variables (see Environment Variables section)

# Start the backend server
npm start

# In a separate terminal, start the frontend dev server
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

### Production Build

```bash
# Build the frontend
cd client
npm run build

# The built files will be in client/dist/
# The backend serves these files in production
```

---

## Environment Variables

### Required

```env
DATABASE_URL=postgresql://user:pass@host:5432/formative
JWT_SECRET=your-secure-random-string
NODE_ENV=production
```

### Payments

```env
VITE_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
VITE_STRIPE_CLIENT_ID=your-stripe-connect-client-id
```

### OAuth (Social Connections)

```env
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
TWITTER_BEARER_TOKEN=

INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=

TIKTOK_CLIENT_ID=
TIKTOK_CLIENT_SECRET=

YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
```

### Production

```env
OAUTH_REDIRECT_BASE=https://chic-patience-production.up.railway.app
FRONTEND_URL=https://chic-patience-production.up.railway.app
```

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account (password strength enforced) |
| POST | `/api/auth/login` | Login and receive JWT (rate limited) |
| POST | `/api/auth/2fa/setup` | Initialize 2FA setup |
| POST | `/api/auth/2fa/verify` | Verify and enable 2FA |
| POST | `/api/auth/2fa/login` | Login with 2FA code |
| POST | `/api/auth/2fa/disable` | Disable 2FA |
| GET | `/api/auth/permissions` | Get current user's permissions and roles |

### User and Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get current user profile |
| PUT | `/api/user/profile` | Update profile |
| GET | `/api/user/social-accounts` | List connected social accounts |

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | List user's teams |
| POST | `/api/teams` | Create new team |
| GET | `/api/teams/:id` | Get team details with members |
| PUT | `/api/teams/:id` | Update team settings |
| DELETE | `/api/teams/:id` | Delete team |
| POST | `/api/teams/:id/invite` | Invite member by email |
| PUT | `/api/teams/:id/respond` | Accept/decline invitation |
| DELETE | `/api/teams/:teamId/members/:userId` | Remove team member |
| PUT | `/api/teams/:teamId/members/:userId/role` | Change member role |

### Feature Flags

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/features` | Get enabled features for user |
| GET | `/api/features/:name` | Check specific feature status |
| PUT | `/api/admin/features/:name` | Update feature flag (admin) |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscriptions/tiers` | Get all subscription plans |
| GET | `/api/subscriptions/me` | Get user's current subscription |
| GET | `/api/subscriptions/entitlement/:feature` | Check feature entitlement |

### Admin (requires admin role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/roles` | List all system roles |
| GET | `/api/admin/permissions` | List all permissions |
| POST | `/api/admin/users/:userId/roles` | Assign role to user |
| DELETE | `/api/admin/users/:userId/roles/:roleId` | Remove role from user |
| GET | `/api/admin/users/:userId/roles` | Get user's assigned roles |

### OAuth

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/oauth/:platform/authorize` | Start OAuth flow |
| GET | `/api/oauth/:platform/callback` | OAuth callback handler |
| DELETE | `/api/social/disconnect/:platform` | Disconnect social account |
| GET | `/api/social/:platform/stats` | Fetch platform statistics |

### Opportunities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/opportunities` | List all opportunities |
| GET | `/api/opportunities/:id` | Get single opportunity |
| POST | `/api/opportunities` | Create opportunity |
| POST | `/api/opportunities/:id/apply` | Apply to opportunity |

### Campaigns

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List user's campaigns |
| POST | `/api/campaigns` | Create new campaign |
| PUT | `/api/campaigns/:id` | Update campaign |
| DELETE | `/api/campaigns/:id` | Delete campaign |

### Messaging

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/conversations` | List conversations |
| GET | `/api/messages/conversation/:id` | Get conversation messages |
| POST | `/api/messages` | Send message |
| GET | `/api/messages/unread-count` | Get unread message count |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments/history` | Get payment history |
| POST | `/api/payments/stripe/connect` | Connect Stripe account |

### Shop / E-Commerce

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shop/settings` | Get shop settings |
| PUT | `/api/shop/settings` | Update shop settings |
| GET | `/api/shop/products` | List creator's products |
| POST | `/api/shop/products` | Create new product |
| GET | `/api/shop/products/:id` | Get single product (for editing) |
| PUT | `/api/shop/products/:id` | Update product |
| DELETE | `/api/shop/products/:id` | Delete product |
| POST | `/api/shop/products/:id/files` | Add file to product |
| DELETE | `/api/shop/products/:productId/files/:fileId` | Remove file from product |
| GET | `/api/shop/orders` | Get creator's sales/orders |
| GET | `/api/shop/stats` | Get shop statistics (sales, revenue) |
| GET | `/api/shop/public/:username` | Get public shop data |
| GET | `/api/shop/public/:username/products/:slug` | Get public product details |
| POST | `/api/shop/checkout/:productId` | Create checkout session |
| POST | `/api/shop/orders/:orderNumber/complete` | Complete order (payment success) |
| GET | `/api/shop/download/:token` | Download purchased files |

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kit/:username` | Get public creator page data |

---

## Database Schema

### Core Tables

```
users
├── id (SERIAL, primary key)
├── email (unique)
├── username (unique)
├── password_hash
├── name
├── user_type (influencer | brand | freelancer)
├── avatar_url
├── bio
├── location
├── website
├── two_factor_enabled
├── two_factor_secret
├── failed_login_attempts
├── locked_until
├── is_public
├── onboarding_completed
├── created_at
└── updated_at
```

### RBAC Tables

```
roles
├── id
├── name (unique)
├── display_name
├── description
├── is_system_role
└── created_at

permissions
├── id
├── name (unique)
├── display_name
├── description
├── category
└── created_at

role_permissions
├── id
├── role_id (foreign key)
└── permission_id (foreign key)

user_roles
├── id
├── user_id (foreign key)
├── role_id (foreign key)
├── assigned_by (foreign key)
└── assigned_at
```

### Teams Tables

```
teams
├── id
├── name
├── slug (unique)
├── description
├── logo_url
├── owner_id (foreign key)
├── team_type (brand | agency | creator)
├── settings (JSONB)
├── is_active
├── created_at
└── updated_at

team_roles
├── id
├── team_id (foreign key)
├── name
├── display_name
├── permissions (JSONB)
├── is_default
└── created_at

team_members
├── id
├── team_id (foreign key)
├── user_id (foreign key)
├── team_role_id (foreign key)
├── status (invited | active | declined)
├── invited_by (foreign key)
├── invited_at
└── joined_at
```

### Feature Flags Tables

```
feature_flags
├── id
├── name (unique)
├── display_name
├── description
├── is_enabled
├── rollout_percentage
├── allowed_user_types (ARRAY)
├── allowed_roles (ARRAY)
├── metadata (JSONB)
├── created_at
└── updated_at

user_feature_flags
├── id
├── user_id (foreign key)
├── feature_flag_id (foreign key)
├── is_enabled
└── created_at
```

### Subscription Tables

```
subscription_tiers
├── id
├── name (unique)
├── display_name
├── description
├── price_monthly
├── price_yearly
├── features (JSONB)
├── limits (JSONB)
├── is_active
├── sort_order
└── created_at

user_subscriptions
├── id
├── user_id (unique, foreign key)
├── tier_id (foreign key)
├── status
├── billing_cycle
├── current_period_start
├── current_period_end
├── stripe_subscription_id
├── created_at
└── updated_at

entitlements
├── id
├── tier_id (foreign key)
├── feature_name
├── limit_value
├── is_unlimited
└── metadata (JSONB)
```

### Security Tables

```
audit_logs
├── id
├── event_type
├── user_id (foreign key)
├── details (JSONB)
├── ip_address
├── user_agent
└── created_at
```

### Other Tables

```
social_accounts
├── id
├── user_id (foreign key)
├── platform
├── username
├── platform_user_id
├── is_verified
├── stats (JSONB)
├── access_token
├── refresh_token
├── last_synced_at
└── created_at

opportunities
├── id
├── title
├── description
├── type
├── industry
├── budget_min
├── budget_max
├── requirements (JSONB)
├── platforms (JSONB)
├── status
├── deadline
├── created_by (foreign key)
├── views_count
└── applications_count

campaigns
├── id
├── brand_id (foreign key)
├── name
├── description
├── budget
├── status
├── start_date
├── end_date
├── escrow_enabled
├── escrow_contract_address
├── influencer_wallet
└── created_at

applications
├── id
├── user_id (foreign key)
├── opportunity_id (foreign key)
├── status (pending | accepted | rejected)
├── message
├── proposed_rate
├── portfolio_links (JSONB)
├── response_message
└── responded_at

conversations, messages, notifications, payment_methods, payments
(see previous schema)

products
├── id
├── creator_id (foreign key)
├── name
├── slug (unique per creator)
├── description
├── short_description
├── type (digital | course | template)
├── price (in cents)
├── compare_at_price (in cents)
├── currency
├── cover_image
├── gallery_images (JSONB)
├── is_active
├── is_featured
├── download_limit
├── metadata (JSONB)
├── tags (ARRAY)
├── sales_count
├── created_at
└── updated_at

product_files
├── id
├── product_id (foreign key)
├── file_name
├── file_url
├── file_size
├── file_type
└── sort_order

shop_settings
├── id
├── user_id (unique, foreign key)
├── shop_name
├── shop_description
├── shop_logo
├── shop_banner
├── stripe_account_id
├── stripe_onboarding_complete
├── currency
├── theme (JSONB)
├── social_links (JSONB)
├── is_active
├── created_at
└── updated_at

shop_orders
├── id
├── order_number (unique)
├── product_id (foreign key)
├── creator_id (foreign key)
├── customer_email
├── customer_name
├── amount (in cents)
├── currency
├── platform_fee (in cents)
├── creator_payout (in cents)
├── status (pending | completed | refunded)
├── stripe_payment_intent_id
├── stripe_checkout_session_id
├── download_count
├── download_token (unique)
├── download_expires_at
├── metadata (JSONB)
├── created_at
└── updated_at
```

---

## Development Status

### Completed

- [x] React frontend with modern UI
- [x] User authentication (register, login, logout)
- [x] Two-Factor Authentication (2FA)
- [x] Auto-logout on inactivity
- [x] Session management with Remember Me
- [x] Multi-step user onboarding
- [x] Role-based dashboards
- [x] **RBAC system (roles, permissions)**
- [x] **Teams management**
- [x] **Feature flags system**
- [x] **Subscription tiers and entitlements**
- [x] **Account lockout after failed logins**
- [x] **Password strength requirements**
- [x] **Security headers (Helmet)**
- [x] **Rate limiting**
- [x] **Audit logging**
- [x] **Input sanitization**
- [x] Opportunities marketplace
- [x] Campaign management
- [x] Messaging system
- [x] Notification system
- [x] Payments page with Stripe and crypto wallet UI
- [x] RainbowKit wallet integration
- [x] **Enhanced public creator pages (Media Kit)**
- [x] **UTM Link Builder**
- [x] **Calendly booking integration**
- [x] **Creator Shop system (e-commerce)**
- [x] **Product management and public shop pages**
- [x] Keyboard shortcuts
- [x] Global search
- [x] Twitter OAuth integration
- [x] Smart contract (Solidity) written

### In Progress

- [ ] Stripe Connect configuration
- [ ] Instagram OAuth integration
- [ ] TikTok OAuth integration
- [ ] YouTube OAuth integration
- [ ] Email notification system
- [ ] File upload system
- [ ] Real-time messaging (WebSocket)
- [ ] Smart contract deployment to Base
- [ ] Analytics and monitoring
- [ ] Terms of Service page
- [ ] Privacy Policy page

---

## Roadmap

### Phase 1: Core Platform (Completed)
- User authentication and profiles
- Opportunities marketplace
- Basic messaging and notifications
- Payment infrastructure UI

### Phase 2: Security and Access Control (Completed)
- Rate limiting and account lockout
- Password strength enforcement
- Security headers
- Audit logging
- RBAC system with roles and permissions
- Teams and collaboration
- Feature flags
- Subscription tiers

### Phase 3: Creator Tools (Completed)
- UTM Link Builder
- Enhanced Creator Page (Media Kit)
- Calendly booking integration
- Creator Shop system for selling digital products

### Phase 4: Integrations (In Progress)
- Complete OAuth social connections
- Email notifications
- File uploads for profiles and campaigns
- Stripe Connect payments

### Phase 5: Advanced Features (Planned)
- Smart contract deployment and integration
- Real-time messaging with WebSocket
- Analytics dashboard
- Content calendar
- Campaign performance tracking

### Phase 6: Scale (Future)
- Mobile application
- AI-powered matching
- Advanced analytics
- Multi-language support

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Author

Built by [@HCS412](https://github.com/HCS412)

---

For questions or support, please open an issue on GitHub.
