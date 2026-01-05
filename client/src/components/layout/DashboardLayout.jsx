import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Palette,
  ChevronDown,
  Search,
  Command,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Avatar, Button } from '@/components/ui'
import { NotificationDropdown } from '@/components/NotificationDropdown'
import { cn } from '@/lib/utils'
import api from '@/lib/api'

// Navigation items with refined icons
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Workspace', href: '/dashboard/workspace', icon: Briefcase, matchPrefix: true },
  { name: 'Studio', href: '/dashboard/studio', icon: Palette, matchPrefix: true },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const avatarMenuRef = useRef(null)

  // Close avatar menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
        setAvatarMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await api.getUnreadCount()
        setUnreadMessages(data.count || 0)
      } catch (error) {
        // Silently fail
      }
    }
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full',
          'bg-[var(--bg-primary)] border-r border-[var(--border-subtle)]',
          'transform transition-all duration-300 ease-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {/* Logo section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border-subtle)]">
          <Link to="/dashboard" className="flex items-center gap-3">
            {/* Refined logo with violet accent */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(167,139,250,0.3)]">
              <div className="w-5 h-5 rounded-md bg-[var(--bg-primary)] rotate-45" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-semibold text-[var(--text-primary)] tracking-tight">
                Formative
              </span>
            )}
          </Link>
          <button
            className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = item.matchPrefix
              ? location.pathname.startsWith(item.href)
              : location.pathname === item.href

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg',
                  'transition-all duration-200',
                  isActive
                    ? [
                        'bg-[var(--accent-primary-muted)]',
                        'text-[var(--accent-primary)]',
                        'shadow-[inset_0_0_0_1px_rgba(167,139,250,0.2)]',
                      ]
                    : [
                        'text-[var(--text-secondary)]',
                        'hover:text-[var(--text-primary)]',
                        'hover:bg-[var(--bg-elevated)]',
                      ]
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    isActive
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                  )}
                />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[var(--border-subtle)]">
          {/* User info */}
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg',
              'hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer'
            )}
            onClick={() => navigate('/dashboard/profile')}
          >
            <Avatar name={user?.name} src={user?.avatar_url} size="sm" status="online" />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={cn(
          'transition-all duration-300 ease-out',
          sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        {/* Top header */}
        <header
          className={cn(
            'sticky top-0 z-30 h-16',
            'bg-[var(--bg-base)]/80 backdrop-blur-xl',
            'border-b border-[var(--border-subtle)]'
          )}
        >
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            {/* Left: Mobile menu + Search */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search bar - hidden on mobile */}
              <div className="hidden md:flex items-center">
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg',
                    'bg-[var(--bg-secondary)] border border-[var(--border-subtle)]',
                    'text-[var(--text-muted)]',
                    'hover:border-[var(--border-default)] transition-colors',
                    'cursor-pointer w-64'
                  )}
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Search...</span>
                  <div className="ml-auto flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[10px] font-medium">
                      <Command className="w-2.5 h-2.5 inline" />
                    </kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] text-[10px] font-medium">
                      K
                    </kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              {/* Messages */}
              <Link
                to="/dashboard/messages"
                className={cn(
                  'relative p-2.5 rounded-lg',
                  'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                  'hover:bg-[var(--bg-elevated)] transition-colors'
                )}
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span
                    className={cn(
                      'absolute top-1 right-1',
                      'w-4 h-4 rounded-full',
                      'bg-[var(--status-error)] text-white',
                      'text-[10px] font-bold',
                      'flex items-center justify-center',
                      'ring-2 ring-[var(--bg-base)]'
                    )}
                  >
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <NotificationDropdown />

              {/* Divider */}
              <div className="w-px h-6 bg-[var(--border-subtle)] mx-2" />

              {/* User avatar dropdown */}
              <div className="relative" ref={avatarMenuRef}>
                <button
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className={cn(
                    'flex items-center gap-2 p-1.5 rounded-lg',
                    'hover:bg-[var(--bg-elevated)] transition-colors',
                    avatarMenuOpen && 'bg-[var(--bg-elevated)]'
                  )}
                >
                  <Avatar name={user?.name} src={user?.avatar_url} size="sm" />
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-[var(--text-muted)] transition-transform duration-200',
                      avatarMenuOpen && 'rotate-180'
                    )}
                  />
                </button>

                {/* Dropdown */}
                {avatarMenuOpen && (
                  <div
                    className={cn(
                      'absolute right-0 mt-2 w-56',
                      'bg-[var(--bg-elevated)] border border-[var(--border-subtle)]',
                      'rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]',
                      'overflow-hidden',
                      'animate-in fade-in slide-in-from-top-2 duration-200'
                    )}
                  >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setAvatarMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5',
                          'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                          'hover:bg-[var(--bg-surface)] transition-colors'
                        )}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        onClick={() => setAvatarMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5',
                          'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                          'hover:bg-[var(--bg-surface)] transition-colors'
                        )}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-[var(--border-subtle)] py-1">
                      <button
                        onClick={() => {
                          setAvatarMenuOpen(false)
                          handleLogout()
                        }}
                        className={cn(
                          'flex items-center gap-3 w-full px-4 py-2.5',
                          'text-[var(--status-error)] hover:bg-red-500/10 transition-colors'
                        )}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
