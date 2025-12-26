# Formative

A modern influencer marketing platform connecting brands, influencers, and freelancers for authentic collaborations. Built with React and Node.js, featuring crypto payment integration and smart contract escrow.

**Live URL**: [chic-patience-production.up.railway.app](https://chic-patience-production.up.railway.app)

---

## Table of Contents

- [Features](#features)
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
- Mark as read functionality

### Social Media Integration
- OAuth connections: Twitter/X, Instagram, TikTok, YouTube
- Real-time follower statistics
- Verified account badges
- Automatic stats refresh

### Public Media Kit
- Shareable public profile pages at `/kit/:username`
- Showcase social stats, portfolio, and collaboration history
- Professional presentation for brand outreach

### Smart Contracts
- Solidity-based Campaign Escrow contract
- Milestone-based payment releases
- Built-in dispute resolution mechanism
- Target deployment: Base (Ethereum L2)

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
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities and configurations
│   │   ├── pages/              # Page components
│   │   ├── App.jsx             # Main app component with routing
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── server.js               # Express API server
│   └── init-db.js              # Database initialization
├── contracts/
│   ├── CampaignEscrow.sol      # Smart contract source
│   └── README.md               # Contract documentation
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
OAUTH_REDIRECT_BASE=https://your-production-domain.com
```

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/2fa/setup` | Initialize 2FA setup |
| POST | `/api/auth/2fa/verify` | Verify and enable 2FA |
| POST | `/api/auth/2fa/login` | Login with 2FA code |
| POST | `/api/auth/2fa/disable` | Disable 2FA |

### User and Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get current user profile |
| PUT | `/api/user/profile` | Update profile |
| GET | `/api/user/social-accounts` | List connected social accounts |

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

---

## Database Schema

### Core Tables

```
users
├── id (UUID, primary key)
├── email (unique)
├── password_hash
├── name
├── user_type (influencer | brand | freelancer)
├── avatar_url
├── bio
├── location
├── website
├── two_factor_enabled
├── two_factor_secret
├── onboarding_completed
├── created_at
└── updated_at

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
├── user_id (foreign key)
├── title
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

conversations
├── id
├── user1_id (foreign key)
├── user2_id (foreign key)
├── created_at
└── updated_at

messages
├── id
├── conversation_id (foreign key)
├── sender_id (foreign key)
├── content
├── is_read
├── read_at
└── created_at

notifications
├── id
├── user_id (foreign key)
├── type
├── title
├── message
├── related_id
├── related_type
├── is_read
└── created_at

payment_methods
├── id
├── user_id (foreign key)
├── type (stripe | crypto)
├── details (JSONB)
├── is_primary
└── created_at

payments
├── id
├── user_id (foreign key)
├── campaign_id (foreign key)
├── amount
├── currency
├── method
├── status
├── transaction_id
└── created_at
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
- [x] Opportunities marketplace
- [x] Campaign management
- [x] Messaging system
- [x] Notification system
- [x] Payments page with Stripe and crypto wallet UI
- [x] RainbowKit wallet integration
- [x] Public media kit pages
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

### Phase 2: Integrations (In Progress)
- Complete OAuth social connections
- Email notifications
- File uploads for profiles and campaigns
- Stripe Connect payments

### Phase 3: Advanced Features (Planned)
- Smart contract deployment and integration
- Real-time messaging with WebSocket
- Analytics dashboard
- Content calendar
- Campaign performance tracking

### Phase 4: Scale (Future)
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
