# CLAUDE.md - Formative Development Reference

> **Purpose**: This file serves as a living document for AI assistants (Claude) and developers to understand the Formative platform's architecture, recent changes, and development patterns. **Do not rewrite history** - append new entries to maintain a complete record.

---

## Quick Reference

### Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS, TanStack Query
- **Backend**: Node.js, Express.js, PostgreSQL
- **Auth**: JWT, bcrypt, TOTP (2FA)
- **Payments**: Stripe Connect, RainbowKit (crypto wallets)
- **Real-time**: Socket.io WebSockets
- **Hosting**: Railway
- **Storage**: AWS S3

### Key Directories
```
/client/src/
├── components/          # Reusable UI components
│   ├── layout/          # Navbar, DashboardLayout
│   ├── ui/              # Button, Card, Modal, Toast
│   └── studio/          # Studio-specific components
├── context/             # AuthContext, PermissionContext
├── hooks/               # useKeyboardShortcuts, useActivityTimeout, etc.
├── lib/                 # api.js, socket.js, wagmi.js, contracts.js
└── pages/               # All page components

/backend/
├── config/              # database.js, security.js
├── middleware/          # auth.js, errorHandler.js, rateLimiter.js
├── routes/              # Route modules
├── utils/               # Security helpers
└── server.js            # Main Express server
```

### Design System Variables
```css
--bg-primary: #0A0A0B       /* Main background */
--bg-elevated: #141415      /* Cards, modals */
--bg-surface: #1C1C1E       /* Hover states */
--text-primary: #FFFFFF     /* Main text */
--text-secondary: #A1A1A6   /* Muted text */
--border-subtle: #2C2C2E    /* Borders */
--accent-primary: #14B8A6   /* Teal accent */
```

---

## System Architecture

### Frontend Components

#### Core Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `CommandPalette` | `/components/CommandPalette.jsx` | Global search (⌘K), navigation, quick actions |
| `NotificationToastBridge` | `/components/NotificationToastBridge.jsx` | Bridges WebSocket events to toast notifications |
| `Toast` | `/components/ui/Toast.jsx` | Toast notification system with progress bars |
| `DashboardLayout` | `/components/layout/DashboardLayout.jsx` | Authenticated page wrapper with sidebar |
| `AnalyticsDashboard` | `/components/AnalyticsDashboard.jsx` | KPIs, charts, export functionality |
| `ScheduleBoard` | `/components/ScheduleBoard.jsx` | Drag-and-drop task scheduling |

#### Pages
| Page | Route | Description |
|------|-------|-------------|
| `Dashboard` | `/dashboard` | Main dashboard with stats and quick actions |
| `Workspace` | `/dashboard/workspace` | Campaigns, payments, teams tabs |
| `Studio` | `/dashboard/studio` | Tasks, calendar, assets tabs |
| `Messages` | `/dashboard/messages` | Conversation threads |
| `Opportunities` | `/dashboard/opportunities` | Browse/apply to opportunities |
| `Profile` | `/dashboard/profile` | User profile management |
| `Settings` | `/dashboard/settings` | Account settings, 2FA, notifications |
| `Shop` | `/dashboard/shop` | Creator e-commerce management |
| `MediaKit` | `/kit/:username` | Public creator page |
| `PublicShop` | `/shop/:username` | Public storefront |

### Backend API Structure

#### Auth Routes (`/api/auth/*`)
- `POST /register` - User registration with password validation
- `POST /login` - JWT authentication with rate limiting
- `POST /2fa/setup` - Initialize 2FA
- `POST /2fa/verify` - Enable 2FA
- `POST /2fa/login` - 2FA login step
- `POST /2fa/disable` - Disable 2FA

#### User Routes (`/api/user/*`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `GET /username` - Get username
- `PUT /username` - Set username

#### WebSocket Events
| Event | Direction | Purpose |
|-------|-----------|---------|
| `notification` | Server → Client | Real-time notifications |
| `message` | Server → Client | New message received |
| `typing` | Bidirectional | Typing indicators |
| `presence` | Server → Client | Online/offline status |

---

## Recent Features

### Command Palette (⌘K)
**Added**: 2025-01-06
**Files**: `CommandPalette.jsx`, `useKeyboardShortcuts.js`

Features:
- Fuzzy search with relevance scoring
- Navigate to any page via keyboard
- Search campaigns, conversations, users via API
- Quick actions (new message, logout, etc.)
- Recent pages tracking (persisted to localStorage)
- Tab key for category cycling, Arrow keys for selection

Keyboard shortcuts:
- `⌘K` - Open command palette
- `⌘1-8` - Direct navigation to pages
- `⌘N` - Context-aware "new" action
- `⌘/` - Show shortcuts help
- `Escape` - Close modals

### Notification Toast Bridge
**Added**: 2025-01-06
**Files**: `NotificationToastBridge.jsx`, `Toast.jsx`

Features:
- Bridges WebSocket notifications to toast system
- Click-to-navigate: clicking toast navigates to relevant page
- Category-specific icons (message, opportunity, payment, team)
- Notification sounds via Web Audio API (can disable in localStorage)
- Smart filtering (no toasts when already on messages page)
- Action buttons support for interactive notifications

Toast options:
```javascript
toast.success(message, {
  title: 'Title',
  duration: 5000,
  category: 'message',  // Shows category-specific icon
  onClick: () => navigate('/path'),
  action: { label: 'View', onClick: fn }
})
```

### Landing Page Redesign
**Added**: 2025-01-05/06
**Files**: `Landing.jsx`

- Linear/Mercury-inspired minimal design
- Pricing section with three tiers
- About section with team/mission
- Interactive demo video component
- Gradient effects and premium aesthetics

### Studio (Tasks + Calendar + Assets)
**Added**: 2025-01-05
**Files**: `Studio.jsx`, `/components/studio/*`

- Motion-like task management
- Calendar view for scheduling
- Asset library with versioning
- Review workflow for content approval

### Workspace Consolidation
**Added**: 2025-01-05
**Files**: `Workspace.jsx`

Consolidated tabs:
- Campaigns
- Payments
- Teams

---

## Database Schema Additions

### Recent Tables

```sql
-- Tasks (Motion-like scheduling)
tasks (
  id, user_id, project_id, title, description,
  status, priority, due_date,
  scheduled_start, scheduled_end,
  estimated_duration, actual_duration,
  position, tags[], metadata,
  created_at, updated_at
)

-- Projects
projects (
  id, user_id, name, description, color,
  status, deadline, is_archived,
  created_at, updated_at
)

-- Assets
assets (
  id, user_id, campaign_id, name, type,
  status, scheduled_date, platforms[],
  metadata, created_at, updated_at
)

-- Asset Versions
asset_versions (
  id, asset_id, version_number, status,
  files[], notes, created_by,
  created_at
)
```

---

## Development Patterns

### API Client Usage
```javascript
import api from '@/lib/api'

// GET request
const data = await api.getProfile()

// POST request
const result = await api.createTask(taskData)

// With error handling
try {
  const data = await api.request('/api/endpoint', {
    method: 'POST',
    body: { key: 'value' }
  })
} catch (error) {
  toast.error(error.message)
}
```

### WebSocket Usage
```javascript
import { onNotification, onMessage } from '@/lib/socket'

useEffect(() => {
  const unsubscribe = onNotification((notification) => {
    // Handle notification
  })
  return () => unsubscribe()
}, [])
```

### Toast Usage
```javascript
import { useToast } from '@/components/ui/Toast'

const { toast } = useToast()
toast.success('Operation completed')
toast.error('Something went wrong')
toast.info('FYI message')
toast.warning('Be careful')
```

### Permission Checks
```javascript
import { usePermissions } from '@/context/PermissionContext'

const { hasPermission, hasRole } = usePermissions()

if (hasPermission('campaigns.create')) {
  // Show create button
}

if (hasRole('admin')) {
  // Show admin panel
}
```

---

## Changelog

### 2025-01-06

**Added: Real-Time Notification Toast Bridge**
- Created `NotificationToastBridge.jsx` to connect WebSocket events to toast system
- Enhanced `Toast.jsx` with click handlers, category icons, and action buttons
- Integrated into `App.jsx` for global availability
- Commit: `9e2d7bf`

**Fixed: Command Palette Crash**
- Fixed `Math.max(...[])` returning `-Infinity` for empty keywords arrays
- Fixed React components (icons) being lost during JSON serialization to localStorage
- Now restores icon references from original commands when loading recent items
- Commit: `72c8c06`

**Enhanced: Command Palette**
- Added API search for campaigns, conversations, users
- Added fuzzy matching with relevance scoring
- Added utility commands (Copy Profile Link, Keyboard Shortcuts, Help)
- Added category icons and result counts
- Added Tab key for category cycling
- Commit: `cfeebc9`

**Added: Command Palette (⌘K)**
- New `CommandPalette.jsx` component with keyboard navigation
- Integrated `useKeyboardShortcuts.js` hook
- Global keyboard shortcuts (⌘1-8 for navigation)
- Commit: `722e835`

### 2025-01-05

**Added: Landing Page Sections**
- Pricing section with Free/Pro/Enterprise tiers
- About section with team and mission info
- Commit: `214e56f`

**Redesigned: Frontend**
- Applied consistent design pattern across entire frontend
- Linear/Mercury-inspired minimalism
- Dark theme with teal accents
- Commits: `b3ae807`, `4189a6a`, `c9c7d88`, `039bf6b`, `e9ef362`

**Added: Studio Page**
- Motion-like task management
- Calendar view integration
- Asset library with versioning
- Commit: `0674b11`

**Restructured: Navigation**
- 4-item sidebar (Dashboard, Opportunities, Messages, Workspace)
- Header icons (Notifications, Profile, Settings)
- Commit: `e4adfa9`

### 2025-01-04

**Added: Analytics Dashboard**
- KPIs and metrics visualization
- Export functionality
- Commit: `9cc20db`

**Added: Schedule Board**
- Drag-and-drop task scheduling component
- Commit: `2077097`

### 2025-01-03

**Added: Asset Management System**
- Comprehensive upload and management
- Version control for assets
- Review workflow
- Commit: `d75580b`

**Added: AWS S3 Integration**
- Profile picture uploads
- Asset file storage
- Commit: `4127ceb`

---

## Known Issues / Technical Debt

1. **Large bundle size** - Some chunks exceed 500KB, consider code splitting
2. **WebSocket reconnection** - May need more robust reconnection logic
3. **Notification sounds** - AudioContext requires user interaction first
4. **Legacy route redirects** - `/dashboard/campaigns`, `/dashboard/payments`, `/dashboard/teams` redirect to Workspace

---

## Environment Variables

### Required
```env
DATABASE_URL=postgresql://...
JWT_SECRET=secure-random-string
NODE_ENV=production
```

### AWS S3
```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=formative-uploads
```

### OAuth
```env
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
```

### Payments
```env
VITE_WALLETCONNECT_PROJECT_ID=
VITE_STRIPE_CLIENT_ID=
STRIPE_SECRET_KEY=
```

---

## Testing Checklist

### Before Deploying
- [ ] Run `npm run build` in `/client` - check for errors
- [ ] Test authentication flow (login, register, 2FA)
- [ ] Test keyboard shortcuts (⌘K, ⌘1-8)
- [ ] Test toast notifications
- [ ] Check mobile responsiveness
- [ ] Verify WebSocket connection
- [ ] Test protected routes redirect properly

---

*Last updated: 2025-01-06*
