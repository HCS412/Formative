import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  Briefcase,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Clock,
  ChevronRight,
  DollarSign,
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  Zap,
  Star,
  Bell,
  Link2,
  ArrowUpRight,
  Activity,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Avatar, StatCard, FadeIn, AnimatedCounter, ProgressRing } from '@/components/ui'
import api from '@/lib/api'
import { formatNumber, formatDate, formatRelativeTime, capitalizeFirst, cn } from '@/lib/utils'

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    followers: 0,
    engagement: 0,
    activeCampaigns: 0,
    totalEarnings: 0,
    connectedAccounts: 0,
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
        if (campaign.end_date) {
          deadlines.push({
            id: `campaign-${campaign.id}`,
            title: 'Campaign ends',
            campaign: campaign.title,
            due_date: campaign.end_date,
            type: 'campaign_end',
          })
        }
      })
      setUpcomingDeadlines(deadlines.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).slice(0, 5))

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
        connectedAccounts: accounts.length,
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
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      deliverables: [
        { id: 1, title: 'Instagram Reel', status: 'pending', due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 2, title: 'TikTok Video', status: 'pending', due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
      ],
    },
  ]

  const getDemoDeadlines = () => [
    { id: 1, title: 'Instagram Reel', campaign: 'Summer Fashion Launch', due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'deliverable' },
    { id: 2, title: 'TikTok Video', campaign: 'Tech Product Review', due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'deliverable' },
    { id: 3, title: 'Campaign ends', campaign: 'Summer Fashion Launch', due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), type: 'campaign_end' },
  ]

  const getDemoOpportunities = () => [
    { id: 1, title: 'Summer Fashion Campaign', budget_range: '$2,000 - $5,000', type: 'influencer', industry: 'Fashion', platforms: ['Instagram', 'TikTok'] },
    { id: 2, title: 'Tech Product Review', budget_range: '$1,500 - $3,000', type: 'influencer', industry: 'Technology', platforms: ['YouTube'] },
    { id: 3, title: 'Fitness App Partnership', budget_range: '$3,000 - $8,000', type: 'influencer', industry: 'Health', platforms: ['Instagram', 'TikTok', 'YouTube'] },
  ]

  const getDemoActivity = () => [
    { id: 1, type: 'application', message: 'Application accepted for Summer Fashion Campaign', time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), icon: '🎉' },
    { id: 2, type: 'message', message: 'New message from StyleCo', time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), icon: '💬' },
    { id: 3, type: 'payment', message: 'Payment received: $2,500', time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), icon: '💰' },
    { id: 4, type: 'follower', message: 'TechNova Inc. started following you', time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), icon: '👤' },
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
      {/* Hero Header */}
      <FadeIn className="relative mb-8">
        {/* Ambient glow */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[var(--accent-primary)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none animate-breathe" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--accent-primary)] tracking-wide uppercase">
              Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              {getGreeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-[var(--text-tertiary)] text-lg">
              {isFullyOnboarded
                ? "Here's what's happening with your account today."
                : "Let's get your profile set up to start collaborating."}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/dashboard/opportunities')}>
              <Briefcase className="w-4 h-4" />
              Browse Opportunities
            </Button>
            <Button onClick={() => navigate('/dashboard/profile')}>
              <Sparkles className="w-4 h-4" />
              View Profile
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Onboarding Progress */}
      {!isFullyOnboarded && (
        <FadeIn delay={100}>
        <Card className="mb-8 overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-[var(--accent-primary-muted)] via-transparent to-orange-500/5">
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Finish setting up to get discovered by brands
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-3xl font-bold text-[var(--accent-primary)]">
                    {onboardingPercentage}%
                  </span>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Complete
                  </p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-violet-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${onboardingPercentage}%` }}
              />
            </div>

            <div className="grid md:grid-cols-4 gap-3">
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
                    'group flex items-center gap-3 p-4 rounded-xl transition-all duration-200',
                    onboardingProgress[step.key]
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 hover:bg-[var(--bg-surface)]'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                    onboardingProgress[step.key]
                      ? 'bg-emerald-500/20'
                      : 'bg-[var(--bg-surface)] group-hover:bg-[var(--accent-primary-muted)]'
                  )}>
                    {onboardingProgress[step.key] ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <step.icon className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]" />
                    )}
                  </div>
                  <span className={cn(
                    'text-sm font-medium',
                    onboardingProgress[step.key] ? 'text-emerald-400' : 'text-[var(--text-secondary)]'
                  )}>
                    {step.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Card>
        </FadeIn>
      )}

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Followers',
            value: stats.followers,
            displayValue: loading ? '—' : formatNumber(stats.followers),
            icon: Users,
            color: 'violet',
            href: '/dashboard/profile',
          },
          {
            label: 'Engagement Rate',
            value: parseFloat(stats.engagement) || 0,
            displayValue: loading ? '—' : `${stats.engagement}%`,
            suffix: '%',
            decimals: 1,
            icon: TrendingUp,
            color: 'orange',
            href: '/dashboard/profile',
          },
          {
            label: 'Active Campaigns',
            value: stats.activeCampaigns,
            displayValue: loading ? '—' : stats.activeCampaigns,
            icon: Target,
            color: 'emerald',
            href: '/dashboard/campaigns',
          },
          {
            label: 'Total Earned',
            value: stats.totalEarnings,
            displayValue: loading ? '—' : `$${formatNumber(stats.totalEarnings)}`,
            prefix: '$',
            icon: DollarSign,
            color: 'sky',
            href: '/dashboard/campaigns',
          },
        ].map((stat, i) => {
          const colors = {
            violet: { bg: 'bg-violet-500/10', icon: 'text-violet-400', hover: 'hover:border-violet-500/30' },
            orange: { bg: 'bg-orange-500/10', icon: 'text-orange-400', hover: 'hover:border-orange-500/30' },
            emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', hover: 'hover:border-emerald-500/30' },
            sky: { bg: 'bg-sky-500/10', icon: 'text-sky-400', hover: 'hover:border-sky-500/30' },
          }
          const c = colors[stat.color]

          return (
            <FadeIn key={i} delay={150 + i * 50}>
              <Card
                interactive
                glow
                className={cn('p-5 group', c.hover)}
                onClick={() => navigate(stat.href)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110', c.bg)}>
                    <stat.icon className={cn('w-5 h-5', c.icon)} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-1">
                  {loading ? '—' : (
                    <AnimatedCounter
                      value={stat.value}
                      prefix={stat.prefix || ''}
                      suffix={stat.suffix || ''}
                      decimals={stat.decimals || 0}
                    />
                  )}
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">{stat.label}</p>
              </Card>
            </FadeIn>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Deadlines */}
          <FadeIn delay={350}>
          <Card>
            <CardHeader actions={
              <Link
                to="/dashboard/campaigns"
                className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            }>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-500/10">
                    <Calendar className="w-4 h-4 text-orange-400" />
                  </div>
                  Upcoming Deadlines
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-[var(--text-muted)]" />
                  </div>
                  <p className="text-[var(--text-secondary)] font-medium">No upcoming deadlines</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Apply to campaigns to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline) => {
                    const daysUntil = getDaysUntil(deadline.due_date)
                    const isUrgent = daysUntil === 'Today' || daysUntil === 'Tomorrow' || daysUntil === 'Overdue'

                    return (
                      <div
                        key={deadline.id}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-xl transition-all',
                          isUrgent
                            ? 'bg-orange-500/5 border border-orange-500/20'
                            : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)]'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                          isUrgent ? 'bg-orange-500/10' : 'bg-[var(--bg-elevated)]'
                        )}>
                          {deadline.type === 'deliverable' ? (
                            <Clock className={cn('w-5 h-5', isUrgent ? 'text-orange-400' : 'text-[var(--text-muted)]')} />
                          ) : (
                            <Target className={cn('w-5 h-5', isUrgent ? 'text-orange-400' : 'text-[var(--text-muted)]')} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--text-primary)] truncate">{deadline.title}</p>
                          <p className="text-sm text-[var(--text-muted)] truncate">{deadline.campaign}</p>
                        </div>
                        <Badge variant={isUrgent ? 'warning' : 'default'} size="sm">
                          {daysUntil}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          </FadeIn>

          {/* Recommended Opportunities */}
          <FadeIn delay={450}>
          <Card>
            <CardHeader actions={
              <Link
                to="/dashboard/opportunities"
                className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            }>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  Recommended For You
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendedOpportunities.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6 text-[var(--text-muted)]" />
                  </div>
                  <p className="text-[var(--text-secondary)] font-medium">No opportunities yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendedOpportunities.map((opp) => (
                    <Link
                      key={opp.id}
                      to="/dashboard/opportunities"
                      className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary-muted)] to-violet-500/10 flex items-center justify-center text-xl flex-shrink-0">
                        {opp.industry === 'Fashion' ? '👗' :
                         opp.industry === 'Technology' ? '💻' :
                         opp.industry === 'Health' ? '🏥' : '🏢'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                          {opp.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-emerald-400 font-medium">{opp.budget_range}</span>
                          <span className="text-[var(--text-muted)]">·</span>
                          <span className="text-sm text-[var(--text-muted)]">{opp.industry}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          </FadeIn>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <FadeIn delay={400} direction="right">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-500/10">
                    <Activity className="w-4 h-4 text-sky-400" />
                  </div>
                  Recent Activity
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center text-base flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {activity.message}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {formatRelativeTime(activity.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/dashboard/notifications"
                className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-[var(--border-subtle)] text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors"
              >
                View all activity
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
          </FadeIn>

          {/* Recent Messages */}
          <FadeIn delay={500} direction="right">
          <Card>
            <CardHeader actions={
              <Link
                to="/dashboard/messages"
                className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors"
              >
                View all
              </Link>
            }>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-violet-500/10">
                    <MessageSquare className="w-4 h-4 text-violet-400" />
                  </div>
                  Messages
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentMessages.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="w-5 h-5 text-[var(--text-muted)]" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentMessages.map((msg) => (
                    <Link
                      key={msg.id}
                      to="/dashboard/messages"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <Avatar name={msg.other_user?.name || 'User'} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                          {msg.other_user?.name}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{msg.last_message}</p>
                      </div>
                      {msg.unread_count > 0 && (
                        <span className="w-5 h-5 bg-[var(--accent-primary)] text-[var(--bg-base)] text-xs font-bold rounded-full flex items-center justify-center">
                          {msg.unread_count}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          </FadeIn>

          {/* Quick Actions */}
          <FadeIn delay={600} direction="right">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wide mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
                onClick={() => navigate('/dashboard/settings')}
              >
                <Link2 className="w-4 h-4" />
                Connect Social Account
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
                onClick={() => navigate('/dashboard/profile')}
              >
                <Star className="w-4 h-4" />
                Share Media Kit
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
                onClick={() => navigate('/dashboard/messages')}
              >
                <MessageSquare className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </Card>
          </FadeIn>
        </div>
      </div>
    </DashboardLayout>
  )
}
