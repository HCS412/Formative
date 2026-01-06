# CLAUDE.md - Formative Development Reference

> **Purpose**: Living document for AI assistants and developers. **Do not rewrite history** - append new entries to changelog.

---

## Project Overview

**Formative** is an influencer marketing platform connecting brands, creators, and freelancers.

**Live**: [chic-patience-production.up.railway.app](https://chic-patience-production.up.railway.app)

### Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TailwindCSS, TanStack Query |
| Backend | Node.js, Express.js, PostgreSQL |
| Auth | JWT, bcrypt, TOTP (2FA) |
| Payments | Stripe Connect, RainbowKit (crypto) |
| Real-time | Socket.io |
| Storage | AWS S3 |
| Hosting | Railway |

### Key Files
| File | Purpose |
|------|---------|
| [`README.md`](README.md) | Full feature list, API reference, database schema |
| [`backend/server.js`](backend/server.js) | Main Express server with all routes |
| [`client/src/App.jsx`](client/src/App.jsx) | React app entry, routing |
| [`client/src/lib/api.js`](client/src/lib/api.js) | API client methods |
| [`client/src/lib/socket.js`](client/src/lib/socket.js) | WebSocket client |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │ Pages   │  │Components│  │ Hooks   │  │ Context         │ │
│  │         │  │         │  │         │  │ (Auth, Perms)   │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ │
│       └────────────┴────────────┴────────────────┘          │
│                            │                                 │
│              ┌─────────────┴─────────────┐                  │
│              │     api.js  │  socket.js  │                  │
│              └─────────────┬─────────────┘                  │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP/WS
┌────────────────────────────┼────────────────────────────────┐
│                        Backend (Express)                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │ Routes  │  │Middleware│  │ Socket  │  │ Config          │ │
│  │ /api/*  │  │auth,rate │  │ Events  │  │ db, security    │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ │
│       └────────────┴────────────┴────────────────┘          │
│                            │                                 │
│              ┌─────────────┴─────────────┐                  │
│              │       PostgreSQL          │                  │
│              └───────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure
```
/client/src/
├── components/         # UI components (see ui/, layout/, studio/)
├── context/            # AuthContext, PermissionContext
├── hooks/              # Custom hooks
├── lib/                # api.js, socket.js, wagmi.js
└── pages/              # Page components

/backend/
├── config/             # database.js, security.js
├── middleware/         # auth.js, rateLimiter.js
├── routes/             # Route modules (being migrated)
├── utils/              # Helpers
└── server.js           # Main server (monolith)
```

---

## Design Style Guide

### Color System
```css
/* Backgrounds */
--bg-primary: #0A0A0B      /* Main background - near black */
--bg-elevated: #141415     /* Cards, modals */
--bg-surface: #1C1C1E      /* Hover states */
--bg-hover: #242426        /* Active states */

/* Text */
--text-primary: #FFFFFF    /* Headings, important text */
--text-secondary: #A1A1A6  /* Body text, descriptions */
--text-muted: #6B6B70      /* Placeholders, hints */

/* Borders & Accents */
--border-subtle: #2C2C2E   /* Dividers, card borders */
--accent-primary: #14B8A6  /* Teal - buttons, links, highlights */
--accent-hover: #0D9488    /* Teal hover state */
```

### UX Guidelines
1. **Minimalism first** - Linear/Mercury-inspired aesthetic. Less is more.
2. **Dark theme only** - No light mode. Consistent dark backgrounds.
3. **Teal accents** - Primary actions, links, and highlights use teal.
4. **Subtle animations** - Use `animate-in`, `transition-colors`. No jarring effects.
5. **Keyboard-first** - Support ⌘K navigation, shortcuts for power users.
6. **Toast feedback** - All actions should have toast confirmation.
7. **Loading states** - Always show spinners/skeletons during async operations.

### Component Patterns
```jsx
// Standard card pattern
<div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-6">

// Primary button
<button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg">

// Secondary/ghost button
<button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]">

// Input field
<input className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)]">
```

---

## Constraints & Policies

### Security Requirements
- **Rate limiting**: Auth endpoints 10/15min, general API 100/15min
- **Password rules**: 8+ chars, upper, lower, number, special char
- **Account lockout**: 5 failed attempts = 15min lock
- **JWT expiry**: 7 days default, 30 days with "Remember Me"
- **OAuth tokens**: Encrypted at rest (AES-256-GCM)

### Code Policies
- **No hardcoded secrets** - All secrets via environment variables
- **No console.log in production** - Use proper logging
- **No inline styles** - Use Tailwind classes or CSS variables
- **No any types** - TypeScript strict (when applicable)
- **Always handle errors** - Try/catch with user-friendly messages

### What NOT to Do
- Don't add light mode or theme switching
- Don't use emojis in code/UI unless user requests
- Don't create new .md files unless explicitly asked
- Don't refactor working code without being asked
- Don't add features beyond what's requested

---

## Repo Etiquette

### Branch Strategy
- `main` - Production, auto-deploys to Railway
- Feature branches for major work (optional)

### Commit Messages
```
<type>: <short description>

<optional body>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

Types: `Add`, `Fix`, `Update`, `Remove`, `Refactor`, `Docs`

### Before Committing
1. Run `npm run build` in `/client` - must pass
2. Test the feature manually
3. Update CLAUDE.md changelog if significant change

### PR Guidelines
- Link to relevant issue if exists
- Include test plan in description
- Screenshots for UI changes

---

## Frequently Used Commands

### Development
```bash
# Start backend (from root)
npm start

# Start frontend dev server
cd client && npm run dev

# Build frontend for production
cd client && npm run build
```

### Database
```bash
# Connect to Railway Postgres
railway connect postgres

# Run init script (creates tables)
node backend/init-db.js
```

### Git
```bash
# Push to deploy
git push origin main

# Check deploy status
railway logs
```

### Debugging
```bash
# Check Railway deployment
railway status

# View live logs
railway logs --follow

# Check environment variables
railway variables
```

---

## Testing Infrastructure

### Current State
- **No automated test suite yet** - Manual testing only
- **Build validation** - `npm run build` catches compile errors

### Manual Test Checklist
```
[ ] Auth: Register, login, logout, 2FA setup
[ ] Navigation: All sidebar links work
[ ] Keyboard: ⌘K opens palette, ⌘1-8 navigate
[ ] Toasts: Success/error feedback appears
[ ] Mobile: Responsive on phone/tablet
[ ] WebSocket: Real-time updates work
[ ] Protected routes: Redirect to login when logged out
```

### Future Testing (TODO)
- [ ] Vitest for unit tests
- [ ] Playwright for E2E tests
- [ ] API integration tests

---

## Quick Code Patterns

### API Calls
```javascript
import api from '@/lib/api'
const data = await api.getProfile()
const result = await api.createTask({ title: 'New task' })
```

### Toast Notifications
```javascript
import { useToast } from '@/components/ui/Toast'
const { toast } = useToast()
toast.success('Saved!')
toast.error('Failed to save')
```

### WebSocket Events
```javascript
import { onNotification } from '@/lib/socket'
useEffect(() => {
  const unsub = onNotification((n) => console.log(n))
  return () => unsub()
}, [])
```

### Permission Checks
```javascript
import { usePermissions } from '@/context/PermissionContext'
const { hasPermission } = usePermissions()
if (hasPermission('campaigns.create')) { /* show button */ }
```

---

## Changelog

> Append new entries at the top. Include date, description, files, commit hash.

### 2025-01-06

**Added: CLAUDE.md**
- Created development reference with architecture, guidelines, changelog
- Commit: `e51c95a`

**Added: Real-Time Notification Toast Bridge**
- `NotificationToastBridge.jsx` - connects WebSocket to toasts
- Enhanced `Toast.jsx` with click handlers, category icons
- Commit: `9e2d7bf`

**Fixed: Command Palette Crash**
- Fixed empty array `Math.max()` bug
- Fixed icon serialization to localStorage
- Commit: `72c8c06`

**Enhanced: Command Palette**
- API search for campaigns, conversations, users
- Fuzzy matching, category icons, Tab cycling
- Commit: `cfeebc9`

**Added: Command Palette (⌘K)**
- Global search and navigation
- Keyboard shortcuts ⌘1-8
- Commit: `722e835`

### 2025-01-05

**Redesigned: Landing Page**
- Linear/Mercury-inspired minimalism
- Pricing and About sections
- Commits: `214e56f`, `b3ae807`, `4189a6a`

**Added: Studio Page**
- Motion-like task management
- Calendar, asset library
- Commit: `0674b11`

**Restructured: Navigation**
- 4-item sidebar + header icons
- Commit: `e4adfa9`

### 2025-01-04

**Added: Analytics Dashboard** - `9cc20db`
**Added: Schedule Board** - `2077097`

### 2025-01-03

**Added: Asset Management** - `d75580b`
**Added: AWS S3 Integration** - `4127ceb`

---

## Known Issues

1. **Bundle size** - Some chunks >500KB, needs code splitting
2. **WebSocket reconnect** - May disconnect without retry
3. **Audio context** - Notification sounds need user interaction first

---

## Environment Variables

See [`railway-env.md`](railway-env.md) for full list.

**Required:**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=<secure-random>
NODE_ENV=production
```

**AWS S3:**
```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=formative-uploads
```

---

*Last updated: 2025-01-06*
