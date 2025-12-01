# Formative

A modern influencer marketing platform connecting brands, influencers, and freelancers for authentic collaborations.

**Live Demo**: [formative-production.up.railway.app](https://formative-production.up.railway.app)

## ✨ Features

### Authentication & Profiles
- User registration with role selection (Influencer, Brand, Freelancer)
- JWT-based authentication
- Editable user profiles with bio, location, and website
- Avatar support

### Social Media Integration
- **OAuth Connections**: Twitter/X, Instagram, TikTok
- **Simple Connect**: Bluesky (no OAuth required)
- Real-time follower stats pulled from connected accounts
- Verified account badges
- Auto-refresh for stale statistics

### Opportunities Marketplace
- Browse and filter opportunities by type and industry
- Detailed opportunity views with requirements
- Budget ranges and deadlines
- Application tracking

### Brand Dashboard
- Create and manage opportunities
- Review incoming applications with applicant profiles
- Accept/reject workflow with automatic notifications
- Collaboration tracking (accepted → in progress → completed)
- Dashboard stats: active opportunities, pending reviews, collaborations

### Influencer Dashboard  
- View real follower counts across platforms
- Track submitted applications and their status
- Manage active collaborations
- Earnings overview

### Messaging
- Real-time conversation threads
- Auto-created conversations when applications are accepted
- Unread message indicators
- Message history

### Notifications
- In-app notification center
- Application status updates
- Collaboration alerts
- Mark as read functionality

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT, bcrypt |
| OAuth | Twitter API v2, Instagram Basic Display, TikTok API |
| Hosting | Railway (backend), GitHub Pages (frontend) |

## 📁 Project Structure

```
Formative/
├── index.html                 # Landing page
├── dashboard.html             # Main dashboard (role-based views)
├── profile.html               # User profile/settings
├── onboarding.html            # New user setup
├── css/
│   ├── main.css              # Core styles
│   └── mobile.css            # Responsive styles
├── js/
│   ├── main.js               # Core functionality
│   └── mobile.js             # Mobile interactions
├── backend/
│   └── server.js             # Express API server (44 endpoints)
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database
- OAuth credentials (optional, for social connections)

### Local Development

```bash
# Clone the repository
git clone https://github.com/HCS412/Formative.git
cd Formative

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your database URL and OAuth credentials

# Start the server
npm start
```

### Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:pass@host:5432/formative
JWT_SECRET=your-secret-key

# Optional - OAuth (features work without these)
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
TIKTOK_CLIENT_ID=
TIKTOK_CLIENT_SECRET=

# Production
NODE_ENV=production
OAUTH_REDIRECT_BASE=https://your-domain.com
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login and get JWT |

### User & Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get current user profile |
| PUT | `/api/user/profile` | Update profile |
| GET | `/api/user/social-accounts` | List connected accounts |

### Social OAuth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/oauth/:platform/authorize` | Start OAuth flow |
| GET | `/api/oauth/:platform/callback` | OAuth callback |
| POST | `/api/social/bluesky/connect` | Connect Bluesky |
| GET | `/api/social/:platform/stats` | Fetch platform stats |
| DELETE | `/api/social/disconnect/:platform` | Disconnect account |

### Opportunities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/opportunities` | List all opportunities |
| GET | `/api/opportunities/:id` | Get single opportunity |
| POST | `/api/opportunities` | Create opportunity |
| POST | `/api/opportunities/:id/apply` | Apply to opportunity |

### Brand Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/brand/stats` | Dashboard statistics |
| GET | `/api/brand/opportunities` | Brand's opportunities |
| PUT | `/api/brand/opportunities/:id` | Update opportunity |
| DELETE | `/api/brand/opportunities/:id` | Delete opportunity |
| GET | `/api/brand/applications` | View all applications |
| GET | `/api/brand/applications/:id` | Application details |
| POST | `/api/brand/applications/:id/accept` | Accept application |
| POST | `/api/brand/applications/:id/reject` | Reject application |
| GET | `/api/brand/collaborations` | Active collaborations |
| PUT | `/api/brand/collaborations/:id` | Update collaboration |

### Influencer
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/influencer/applications` | My applications |
| GET | `/api/influencer/collaborations` | My collaborations |

### Messaging
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/conversations` | List conversations |
| GET | `/api/messages/conversation/:id` | Get messages |
| POST | `/api/messages` | Send message |
| POST | `/api/messages/start-conversation` | New conversation |
| GET | `/api/messages/unread-count` | Unread count |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all read |

## 🗄️ Database Schema

```
users
├── id, email, password_hash, name
├── user_type (influencer|brand|freelancer)
├── avatar_url, bio, location, website
└── created_at, updated_at

social_accounts
├── id, user_id, platform, username
├── platform_user_id, is_verified
├── stats (JSON), access_token, refresh_token
└── last_synced_at, created_at

opportunities
├── id, title, description, type, industry
├── budget_range, budget_min, budget_max
├── requirements (JSON), platforms (JSON)
├── status, deadline, created_by
└── views_count, applications_count

applications
├── id, user_id, opportunity_id
├── status (pending|accepted|rejected)
├── message, proposed_rate, portfolio_links
└── response_message, responded_at

collaborations
├── id, opportunity_id, brand_id, influencer_id
├── application_id, status, agreed_rate
├── notes, started_at, completed_at
└── created_at, updated_at

conversations
├── id, user1_id, user2_id
└── created_at, updated_at

messages
├── id, conversation_id, sender_id, receiver_id
├── content, message_type, attachment_url
├── is_read, read_at, created_at

notifications
├── id, user_id, type, title, message
├── related_id, related_type
├── is_read, read_at, created_at
```

## 🚧 Roadmap

### Completed ✅
- [x] User authentication (register/login)
- [x] Role-based dashboards
- [x] OAuth social connections (Twitter, Instagram, TikTok)
- [x] Real follower stats integration
- [x] Opportunities marketplace
- [x] Application system
- [x] Brand application review workflow
- [x] Accept/reject with auto-notifications
- [x] Collaborations tracking
- [x] Real-time messaging
- [x] Notification system
- [x] Profile management

### Next Up 🎯
- [ ] Influencer dashboard enhancements (application tracking UI)
- [ ] Brand search/discovery for influencers
- [ ] Public shareable media kit profiles
- [ ] Email notifications
- [ ] Payment integration (Stripe Connect)

### Future 🔮
- [ ] Analytics dashboard with charts
- [ ] Content calendar
- [ ] Campaign performance tracking
- [ ] Mobile app (React Native)
- [ ] AI-powered matching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

Built by [@HCS412](https://github.com/HCS412)

---

**Questions?** Open an issue or reach out on the platform!
