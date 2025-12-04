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
  Link2
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Avatar } from '@/components/ui'
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
      // Load social accounts
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

      // Load messages
      const conversationsData = await api.getConversations().catch(() => ({ conversations: [] }))
      setRecentMessages((conversationsData.conversations || []).slice(0, 3))

      // Load campaigns for stats and deadlines
      const campaignsData = await api.getCampaigns().catch(() => ({ campaigns: [] }))
      const campaigns = campaignsData.campaigns || getDemoCampaigns()
      
      const activeCampaigns = campaigns.filter(c => c.status === 'active')
      const completedCampaigns = campaigns.filter(c => c.status === 'completed')
      
      // Calculate upcoming deadlines
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

      // Load opportunities
      const opportunitiesData = await api.getOpportunities().catch(() => ({ opportunities: [] }))
      setRecommendedOpportunities((opportunitiesData.opportunities || getDemoOpportunities()).slice(0, 3))

      // Calculate earnings
      const totalEarnings = completedCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0)

      // Load username for media kit
      const usernameData = await api.getUsername().catch(() => ({}))

      // Check onboarding progress
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

      // Demo activity feed
      setRecentActivity(getDemoActivity())

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      // Set demo data
      setUpcomingDeadlines(getDemoDeadlines())
      setRecommendedOpportunities(getDemoOpportunities())
      setRecentActivity(getDemoActivity())
    } finally {
      setLoading(false)
    }
  }

  // Demo data functions
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
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-[var(--text-secondary)]">
            {isFullyOnboarded 
              ? "Here's what's happening with your account today."
              : "Let's get your profile set up to start collaborating."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/dashboard/opportunities')}>
            <Briefcase className="w-4 h-4 mr-2" />
            Browse Opportunities
          </Button>
          <Button onClick={() => navigate('/dashboard/profile')}>
            <Sparkles className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </div>
      </div>

      {/* Onboarding Progress (if not complete) */}
      {!isFullyOnboarded && (
        <Card className="mb-6 p-5 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-purple-500/10 border-teal-500/20">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Complete Your Profile</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Finish setting up to get discovered by brands
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-bold text-teal-400">{onboardingPercentage}%</span>
                <p className="text-xs text-[var(--text-secondary)]">Complete</p>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
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
                  'flex items-center gap-3 p-3 rounded-lg transition-all',
                  onboardingProgress[step.key]
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] border border-transparent'
                )}
              >
                {onboardingProgress[step.key] ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
                )}
                <span className={cn(
                  'text-sm',
                  onboardingProgress[step.key] ? 'text-green-400' : 'text-[var(--text-secondary)]'
                )}>
                  {step.label}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 hover:border-teal-500/30 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? '...' : formatNumber(stats.followers)}</p>
              <p className="text-sm text-[var(--text-secondary)]">Total Followers</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:border-orange-500/30 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? '...' : `${stats.engagement}%`}</p>
              <p className="text-sm text-[var(--text-secondary)]">Engagement Rate</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:border-purple-500/30 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/campaigns')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? '...' : stats.activeCampaigns}</p>
              <p className="text-sm text-[var(--text-secondary)]">Active Campaigns</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:border-green-500/30 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/campaigns')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{loading ? '...' : `$${formatNumber(stats.totalEarnings)}`}</p>
              <p className="text-sm text-[var(--text-secondary)]">Total Earned</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-400" />
                Upcoming Deadlines
              </CardTitle>
              <Link to="/dashboard/campaigns" className="text-sm text-teal-400 hover:text-teal-300">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2" />
                  <p className="text-[var(--text-secondary)]">No upcoming deadlines</p>
                  <p className="text-sm text-[var(--text-muted)]">Apply to campaigns to get started</p>
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
                          'flex items-center gap-4 p-3 rounded-lg',
                          isUrgent ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-[var(--bg-secondary)]'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          isUrgent ? 'bg-orange-500/20' : 'bg-[var(--bg-card)]'
                        )}>
                          {deadline.type === 'deliverable' ? (
                            <Clock className={cn('w-5 h-5', isUrgent ? 'text-orange-400' : 'text-[var(--text-secondary)]')} />
                          ) : (
                            <Target className={cn('w-5 h-5', isUrgent ? 'text-orange-400' : 'text-[var(--text-secondary)]')} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{deadline.title}</p>
                          <p className="text-sm text-[var(--text-secondary)] truncate">{deadline.campaign}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={isUrgent ? 'warning' : 'default'}>
                            {daysUntil}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Recommended For You
              </CardTitle>
              <Link to="/dashboard/opportunities" className="text-sm text-teal-400 hover:text-teal-300">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {recommendedOpportunities.length === 0 ? (
                <div className="text-center py-6">
                  <Briefcase className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2" />
                  <p className="text-[var(--text-secondary)]">No opportunities yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendedOpportunities.map((opp) => (
                    <Link 
                      key={opp.id}
                      to="/dashboard/opportunities"
                      className="flex items-center gap-4 p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center text-xl">
                        {opp.industry === 'Fashion' ? '👗' : 
                         opp.industry === 'Technology' ? '💻' : 
                         opp.industry === 'Health' ? '🏥' : '🏢'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate group-hover:text-teal-400 transition-colors">
                          {opp.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-green-400">{opp.budget_range}</span>
                          <span className="text-xs text-[var(--text-muted)]">•</span>
                          <span className="text-xs text-[var(--text-secondary)]">{opp.industry}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-base flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-secondary)] leading-tight">
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
                className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-[var(--border-color)] text-sm text-teal-400 hover:text-teal-300"
              >
                View all activity
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                Messages
              </CardTitle>
              <Link to="/dashboard/messages" className="text-sm text-teal-400 hover:text-teal-300">
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {recentMessages.length === 0 ? (
                <div className="text-center py-4">
                  <MessageSquare className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--text-secondary)]">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMessages.map((msg) => (
                    <Link 
                      key={msg.id}
                      to="/dashboard/messages"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <Avatar name={msg.other_user?.name || 'User'} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{msg.other_user?.name}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{msg.last_message}</p>
                      </div>
                      {msg.unread_count > 0 && (
                        <span className="w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                          {msg.unread_count}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="secondary" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => navigate('/dashboard/settings')}
              >
                <Link2 className="w-4 h-4 mr-2" />
                Connect Social Account
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => navigate('/dashboard/profile')}
              >
                <Star className="w-4 h-4 mr-2" />
                Share Media Kit
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => navigate('/dashboard/messages')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
