import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Calendar,
  Clock,
  ChevronRight,
  Briefcase,
  MessageSquare,
  ArrowUpRight,
  Activity,
  Zap,
  Link2,
  Star,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Avatar } from '@/components/ui'
import api from '@/lib/api'
import { formatNumber, formatRelativeTime, cn } from '@/lib/utils'

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    followers: 0,
    engagement: 0,
    activeCampaigns: 0,
    totalEarnings: 0,
  })
  const [recentMessages, setRecentMessages] = useState([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])
  const [recommendedOpportunities, setRecommendedOpportunities] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [onboardingProgress, setOnboardingProgress] = useState({
    profileComplete: false,
    socialConnected: false,
    mediaKitCreated: false,
    firstApplication: false,
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const socialData = await api.getSocialAccounts().catch(() => ({ accounts: [] }))
      const accounts = socialData.accounts || []

      let totalFollowers = 0
      let totalEngagement = 0
      let engagementCount = 0

      accounts.forEach(account => {
        if (account.stats?.followers) totalFollowers += account.stats.followers
        if (account.stats?.engagementRate) {
          totalEngagement += parseFloat(account.stats.engagementRate)
          engagementCount++
        }
      })

      const conversationsData = await api.getConversations().catch(() => ({ conversations: [] }))
      setRecentMessages((conversationsData.conversations || []).slice(0, 3))

      const campaignsData = await api.getCampaigns().catch(() => ({ campaigns: [] }))
      const campaigns = campaignsData.campaigns || getDemoCampaigns()

      const activeCampaigns = campaigns.filter(c => c.status === 'active')
      const completedCampaigns = campaigns.filter(c => c.status === 'completed')

      const deadlines = []
      activeCampaigns.forEach(campaign => {
        if (campaign.deliverables) {
          campaign.deliverables
            .filter(d => d.status !== 'completed')
            .forEach(d => {
              if (d.due_date) {
                deadlines.push({
                  id: `${campaign.id}-${d.id}`,
                  title: d.title,
                  campaign: campaign.title,
                  due_date: d.due_date,
                  type: 'deliverable',
                })
              }
            })
        }
      })
      setUpcomingDeadlines(deadlines.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).slice(0, 4))

      const opportunitiesData = await api.getOpportunities().catch(() => ({ opportunities: [] }))
      setRecommendedOpportunities((opportunitiesData.opportunities || getDemoOpportunities()).slice(0, 3))

      const totalEarnings = completedCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0)

      const usernameData = await api.getUsername().catch(() => ({}))

      setOnboardingProgress({
        profileComplete: !!(user?.bio && user?.location),
        socialConnected: accounts.length > 0,
        mediaKitCreated: !!usernameData.username,
        firstApplication: completedCampaigns.length > 0 || activeCampaigns.length > 0,
      })

      setStats({
        followers: totalFollowers,
        engagement: engagementCount > 0 ? (totalEngagement / engagementCount).toFixed(1) : 0,
        activeCampaigns: activeCampaigns.length,
        totalEarnings,
      })

      setRecentActivity(getDemoActivity())
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setUpcomingDeadlines(getDemoDeadlines())
      setRecommendedOpportunities(getDemoOpportunities())
      setRecentActivity(getDemoActivity())
    } finally {
      setLoading(false)
    }
  }

  const getDemoCampaigns = () => [
    {
      id: 1,
      title: 'Summer Fashion Launch',
      status: 'active',
      budget: 5000,
      deliverables: [
        { id: 1, title: 'Instagram Reel', status: 'pending', due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
      ],
    },
  ]

  const getDemoDeadlines = () => [
    { id: 1, title: 'Instagram Reel', campaign: 'Summer Fashion Launch', due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'deliverable' },
    { id: 2, title: 'TikTok Video', campaign: 'Tech Product Review', due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'deliverable' },
  ]

  const getDemoOpportunities = () => [
    { id: 1, title: 'Summer Fashion Campaign', budget_range: '$2,000 - $5,000', industry: 'Fashion' },
    { id: 2, title: 'Tech Product Review', budget_range: '$1,500 - $3,000', industry: 'Technology' },
    { id: 3, title: 'Fitness App Partnership', budget_range: '$3,000 - $8,000', industry: 'Health' },
  ]

  const getDemoActivity = () => [
    { id: 1, message: 'Application accepted for Summer Fashion Campaign', time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), icon: '🎉' },
    { id: 2, message: 'New message from StyleCo', time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), icon: '💬' },
    { id: 3, message: 'Payment received: $2,500', time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), icon: '💰' },
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getDaysUntil = (date) => {
    const diff = new Date(date) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    if (days < 0) return 'Overdue'
    return `${days} days`
  }

  const completedSteps = Object.values(onboardingProgress).filter(Boolean).length
  const totalSteps = Object.keys(onboardingProgress).length
  const onboardingPercentage = Math.round((completedSteps / totalSteps) * 100)
  const isFullyOnboarded = completedSteps === totalSteps

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">
          {getGreeting()}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-zinc-400">
          {isFullyOnboarded
            ? "Here's what's happening with your account."
            : "Complete your profile to start collaborating."}
        </p>
      </div>

      {/* Onboarding Progress */}
      {!isFullyOnboarded && (
        <div className="mb-8 p-6 rounded-xl bg-zinc-900/50 border border-white/[0.06] backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Complete Your Profile</h3>
              <p className="text-xs text-zinc-500">Get discovered by brands</p>
            </div>
            <span className="text-lg font-semibold text-indigo-400">{onboardingPercentage}%</span>
          </div>

          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${onboardingPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { key: 'profileComplete', label: 'Complete Profile', href: '/dashboard/profile', icon: Users },
              { key: 'socialConnected', label: 'Connect Socials', href: '/dashboard/settings', icon: Link2 },
              { key: 'mediaKitCreated', label: 'Create Media Kit', href: '/dashboard/profile', icon: Star },
              { key: 'firstApplication', label: 'Apply to Campaign', href: '/dashboard/opportunities', icon: Target },
            ].map((step) => (
              <Link
                key={step.key}
                to={step.href}
                className={cn(
                  'flex items-center gap-2 p-3 rounded-lg transition-colors',
                  onboardingProgress[step.key]
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-zinc-800/50 hover:bg-zinc-800 border border-transparent'
                )}
              >
                {onboardingProgress[step.key] ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <step.icon className="w-4 h-4 text-zinc-500" />
                )}
                <span className={cn(
                  'text-xs font-medium',
                  onboardingProgress[step.key] ? 'text-emerald-400' : 'text-zinc-400'
                )}>
                  {step.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Followers', value: formatNumber(stats.followers), icon: Users },
          { label: 'Engagement', value: `${stats.engagement}%`, icon: TrendingUp },
          { label: 'Campaigns', value: stats.activeCampaigns, icon: Target },
          { label: 'Earned', value: `$${formatNumber(stats.totalEarnings)}`, icon: DollarSign },
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-xl bg-zinc-900/50 border border-white/[0.06] backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <stat.icon className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-white mb-0.5">
              {loading ? '—' : stat.value}
            </p>
            <p className="text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deadlines */}
          <Card>
            <CardHeader actions={
              <Link to="/dashboard/campaigns" className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            }>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  Upcoming Deadlines
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--text-secondary)]">No upcoming deadlines</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingDeadlines.map((deadline) => {
                    const daysUntil = getDaysUntil(deadline.due_date)
                    const isUrgent = daysUntil === 'Today' || daysUntil === 'Tomorrow'
                    return (
                      <div
                        key={deadline.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg',
                          isUrgent ? 'bg-orange-500/10' : 'bg-[var(--bg-elevated)]'
                        )}
                      >
                        <Clock className={cn('w-4 h-4', isUrgent ? 'text-orange-400' : 'text-[var(--text-muted)]')} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{deadline.title}</p>
                          <p className="text-xs text-[var(--text-muted)] truncate">{deadline.campaign}</p>
                        </div>
                        <Badge variant={isUrgent ? 'warning' : 'default'} size="sm">{daysUntil}</Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card>
            <CardHeader actions={
              <Link to="/dashboard/opportunities" className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            }>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Recommended For You
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendedOpportunities.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--text-secondary)]">No opportunities yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recommendedOpportunities.map((opp) => (
                    <Link
                      key={opp.id}
                      to="/dashboard/opportunities"
                      className="group flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary-muted)] flex items-center justify-center text-lg">
                        {opp.industry === 'Fashion' ? '👗' : opp.industry === 'Technology' ? '💻' : '🏋️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{opp.title}</p>
                        <p className="text-xs text-emerald-400">{opp.budget_range}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  Recent Activity
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center text-sm">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{activity.message}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatRelativeTime(activity.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader actions={
              <Link to="/dashboard/messages" className="text-xs text-[var(--accent-primary)] hover:underline">
                View all
              </Link>
            }>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  Messages
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentMessages.length === 0 ? (
                <div className="text-center py-6">
                  <MessageSquare className="w-6 h-6 text-[var(--text-muted)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--text-secondary)]">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentMessages.map((msg) => (
                    <Link
                      key={msg.id}
                      to="/dashboard/messages"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                      <Avatar name={msg.other_user?.name || 'User'} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--text-primary)] truncate">{msg.other_user?.name}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{msg.last_message}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Quick Actions</h3>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/dashboard/opportunities')}>
                <Briefcase className="w-4 h-4" />
                Browse Opportunities
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/dashboard/settings')}>
                <Link2 className="w-4 h-4" />
                Connect Account
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/dashboard/messages')}>
                <MessageSquare className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
