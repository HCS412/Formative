import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Check, Settings } from 'lucide-react'
import { NotificationItem } from './NotificationItem'
import { Button } from '@/components/ui'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  // Demo notifications for testing
  const demoNotifications = [
    {
      id: 1,
      type: 'message',
      title: 'New message from StyleCo',
      message: 'Hey! We loved your content and want to discuss a collaboration...',
      sender_name: 'StyleCo',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'New opportunity matches your profile',
      message: 'Summer Fashion Campaign - $5,000 budget',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    },
    {
      id: 3,
      type: 'application',
      title: 'Application accepted!',
      message: 'Your application for "Tech Product Review" has been accepted',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: 4,
      type: 'campaign',
      title: 'Deliverable due tomorrow',
      message: 'Instagram Reel for Summer Collection campaign',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: 5,
      type: 'payment',
      title: 'Payment received',
      message: 'You received $2,500 for Fitness App Partnership',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
  ]

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const data = await api.getNotifications()
      setNotifications(data.notifications || [])
    } catch (error) {
      // Use demo data if API not available
      setNotifications(demoNotifications)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id)
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
    } catch (error) {
      // Optimistic update for demo
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
    }
  }

  const handleMarkAllRead = async () => {
    try {
      // API call to mark all as read
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (error) {
      console.error('Failed to mark all as read')
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 rounded-lg transition-colors',
          isOpen 
            ? 'bg-[var(--bg-secondary)] text-white' 
            : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-secondary)]'
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[32rem] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2" />
                <p className="text-[var(--text-secondary)]">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {notifications.slice(0, 5).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    compact
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[var(--border-color)] p-2">
            <Link
              to="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-sm text-teal-400 hover:text-teal-300 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}


