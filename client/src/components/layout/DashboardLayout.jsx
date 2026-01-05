import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Settings,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  Palette,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Avatar, Button } from '@/components/ui'
import { NotificationDropdown } from '@/components/NotificationDropdown'
import { cn } from '@/lib/utils'
import api from '@/lib/api'

// Simplified 4-item navigation
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
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)]',
        'transform transition-transform duration-200 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border-color)]">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-orange-500 relative">
              <div className="absolute w-5 h-5 rounded-full bg-[var(--bg-secondary)] top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2" />
            </div>
            <span className="font-bold text-white">Formative</span>
          </Link>
          <button
            className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = item.matchPrefix
              ? location.pathname.startsWith(item.href)
              : location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/30'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)]'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} src={user?.avatar_url} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[var(--bg-primary)]/80 backdrop-blur-lg border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between h-full px-4">
            <button
              className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              {/* Messages Icon */}
              <Link
                to="/dashboard/messages"
                className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <NotificationDropdown />

              {/* Avatar with dropdown */}
              <div className="relative" ref={avatarMenuRef}>
                <button
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
                >
                  <Avatar name={user?.name} src={user?.avatar_url} size="sm" />
                  <ChevronDown className={cn(
                    "w-4 h-4 text-[var(--text-secondary)] transition-transform",
                    avatarMenuOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown menu */}
                {avatarMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-[var(--border-color)]">
                      <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setAvatarMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        onClick={() => setAvatarMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-[var(--border-color)] py-1">
                      <button
                        onClick={() => {
                          setAvatarMenuOpen(false)
                          handleLogout()
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
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
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
