import { useState, useEffect } from 'react'
import { Bell, Check, Filter, Trash2, Settings } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { NotificationItem } from '@/components/NotificationItem'
import { useToast } from '@/components/ui/Toast'
import { Button, Card, Badge } from '@/components/ui'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'message', label: 'Messages' },
  { id: 'opportunity', label: 'Opportunities' },
  { id: 'campaign', label: 'Campaigns' },
  { id: 'payment', label: 'Payments' },
]

export function Notifications() {
  const { addToast } = useToast()
  
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Demo notifications
  const demoNotifications = [
    {
      id: 1,
      type: 'message',
      title: 'New message from StyleCo',
      message: 'Hey! We loved your content and would love to discuss a potential collaboration for our upcoming summer collection launch.',
      sender_name: 'StyleCo Marketing',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      action_url: '/dashboard/messages',
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'New opportunity matches your profile',
      message: 'Summer Fashion Campaign by StyleCo - $5,000 budget. Looking for fashion influencers with 10K+ followers.',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      action_url: '/dashboard/opportunities',
    },
    {
      id: 3,
      type: 'application',
      title: 'Application accepted! 🎉',
      message: 'Congratulations! Your application for "Tech Product Review Campaign" has been accepted. The brand will reach out shortly.',
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      action_url: '/dashboard/campaigns',
    },
    {
      id: 4,
      type: 'campaign',
      title: 'Deliverable due tomorrow',
      message: 'Reminder: Instagram Reel for "Summer Collection Launch" campaign is due tomorrow. Make sure to submit on time!',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      action_url: '/dashboard/campaigns',
    },
    {
      id: 5,
      type: 'payment',
      title: 'Payment received 💰',
      message: 'You received $2,500 for completing the Fitness App Partnership campaign. The payment has been processed.',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: 6,
      type: 'connection',
      title: 'New follower on Formative',
      message: 'TechNova Inc. started following your profile. They may be interested in working with you!',
      sender_name: 'TechNova Inc.',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
      id: 7,
      type: 'review',
      title: 'New review received ⭐',
      message: 'StyleCo left you a 5-star review: "Amazing to work with! Delivered high-quality content on time."',
      sender_name: 'StyleCo',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    },
    {
      id: 8,
      type: 'system',
      title: 'Profile completion reminder',
      message: 'Complete your profile to increase your visibility to brands. Add a bio, connect social accounts, and set your rates.',
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
      action_url: '/dashboard/profile',
    },
  ]

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const data = await api.getNotifications()
      setNotifications(data.notifications || [])
    } catch (error) {
      // Use demo data
      setNotifications(demoNotifications)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id)
    } catch (error) {
      // Optimistic update
    }
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    )
  }

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    addToast('All notifications marked as read', 'success')
  }

  const handleClearAll = () => {
    setNotifications([])
    addToast('Notifications cleared', 'success')
  }

  const handleNotificationClick = (notification) => {
    if (notification.action_url) {
      window.location.href = notification.action_url
    }
  }

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.is_read
    return n.type === filter
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.created_at)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let groupKey
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday'
    } else {
      groupKey = 'Earlier'
    }

    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(notification)
    return groups
  }, {})

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="primary">{unreadCount} new</Badge>
            )}
          </div>
          <p className="text-[var(--text-secondary)]">
            Stay updated on messages, opportunities, and campaigns
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setFilter(option.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              filter === option.id
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-white'
            )}
          >
            {option.label}
            {option.id === 'unread' && unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-teal-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {filter === 'unread' ? 'All caught up!' : 'No notifications'}
          </h3>
          <p className="text-[var(--text-secondary)]">
            {filter === 'unread' 
              ? "You've read all your notifications"
              : 'Notifications will appear here when you receive them'}
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedNotifications).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 px-1">
                {group}
              </h3>
              <div className="space-y-3">
                {items.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationClick}
                    onMarkRead={handleMarkRead}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Link */}
      <Card className="mt-8 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center">
              <Settings className="w-5 h-5 text-[var(--text-secondary)]" />
            </div>
            <div>
              <p className="font-medium">Notification Preferences</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Choose what notifications you receive
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.location.href = '/dashboard/settings'}
          >
            Manage
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  )
}


