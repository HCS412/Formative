import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Briefcase, TrendingUp, Users } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui'
import api from '@/lib/api'
import { formatNumber } from '@/lib/utils'

export function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    followers: 0,
    engagement: 0,
    messages: 0,
    opportunities: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load social accounts for stats
      const socialData = await api.getSocialAccounts()
      const accounts = socialData.accounts || []
      
      let totalFollowers = 0
      let totalEngagement = 0
      let engagementCount = 0
      
      accounts.forEach(account => {
        if (account.stats?.followers) {
          totalFollowers += account.stats.followers
        }
        if (account.stats?.engagementRate) {
          totalEngagement += parseFloat(account.stats.engagementRate)
          engagementCount++
        }
      })

      // Load unread messages
      const messagesData = await api.getUnreadCount().catch(() => ({ count: 0 }))

      setStats({
        followers: totalFollowers,
        engagement: engagementCount > 0 ? (totalEngagement / engagementCount).toFixed(1) : 0,
        messages: messagesData.count || 0,
        opportunities: 6, // Demo value
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-[var(--text-secondary)]">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 hover:border-teal-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <Users className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? '...' : formatNumber(stats.followers)}</p>
              <p className="text-sm text-[var(--text-secondary)]">Total Followers</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:border-orange-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? '...' : `${stats.engagement}%`}</p>
              <p className="text-sm text-[var(--text-secondary)]">Engagement</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:border-blue-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? '...' : stats.messages}</p>
              <p className="text-sm text-[var(--text-secondary)]">Unread Messages</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:border-purple-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Briefcase className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? '...' : stats.opportunities}</p>
              <p className="text-sm text-[var(--text-secondary)]">Opportunities</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/dashboard/messages">
              <Button variant="secondary" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send a Message
              </Button>
            </Link>
            <Link to="/dashboard/opportunities">
              <Button variant="secondary" className="w-full justify-start">
                <Briefcase className="w-4 h-4 mr-2" />
                Browse Opportunities
              </Button>
            </Link>
            <Link to="/dashboard/profile">
              <Button variant="secondary" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                  ✓
                </div>
                <span className="text-[var(--text-secondary)]">Create your account</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
                  2
                </div>
                <span className="text-[var(--text-secondary)]">Connect your social accounts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
                  3
                </div>
                <span className="text-[var(--text-secondary)]">Set up your media kit</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
                  4
                </div>
                <span className="text-[var(--text-secondary)]">Start collaborating!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

