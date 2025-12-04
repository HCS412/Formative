import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPin, 
  Globe, 
  Users, 
  ExternalLink, 
  Copy, 
  Check,
  ArrowLeft,
  Share2
} from 'lucide-react'
import { Avatar, Badge, Button, Card } from '@/components/ui'
import { formatNumber, capitalizeFirst } from '@/lib/utils'

const platformStyles = {
  twitter: { icon: '𝕏', color: 'bg-black', name: 'Twitter / X' },
  instagram: { icon: '📷', color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400', name: 'Instagram' },
  tiktok: { icon: '🎵', color: 'bg-black', name: 'TikTok' },
  youtube: { icon: '▶️', color: 'bg-red-600', name: 'YouTube' },
  bluesky: { icon: '🦋', color: 'bg-blue-500', name: 'Bluesky' },
  twitch: { icon: '🎮', color: 'bg-purple-600', name: 'Twitch' },
}

export function MediaKit() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/kit/${username}`)
      const data = await response.json()
      
      if (!response.ok || data.error) {
        setError(data.error || 'Profile not found')
      } else {
        setProfile(data)
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.user?.name}'s Media Kit`,
          text: `Check out ${profile?.user?.name}'s media kit on Formative`,
          url: window.location.href,
        })
      } catch (err) {
        handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }

  // Calculate total stats
  const totalFollowers = profile?.accounts?.reduce((sum, acc) => sum + (acc.stats?.followers || 0), 0) || 0
  const avgEngagement = (() => {
    const accounts = profile?.accounts || []
    const engagements = accounts
      .filter(acc => acc.stats?.engagementRate)
      .map(acc => parseFloat(acc.stats.engagementRate))
    if (engagements.length === 0) return 0
    return (engagements.reduce((a, b) => a + b, 0) / engagements.length).toFixed(1)
  })()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f14] via-[#0f1419] to-[#0a0f14] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f14] via-[#0f1419] to-[#0a0f14] flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-3xl">😕</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-[var(--text-secondary)] mb-6">
            {error === 'User not found' 
              ? "This profile doesn't exist or hasn't been set up yet."
              : error}
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Formative
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const { user, accounts } = profile

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f14] via-[#0f1419] to-[#0a0f14]">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-teal-400 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-orange-500 relative">
              <div className="absolute w-5 h-5 rounded-full bg-[#0f1419] top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2" />
            </div>
            <span className="font-bold">Formative</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopyLink}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="ml-2 hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
            </Button>
            <Button size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <Card className="p-6 md:p-8 mb-6 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)] border-white/10">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar */}
            <Avatar 
              name={user.name} 
              src={user.avatar_url}
              size="2xl" 
              className="ring-4 ring-teal-500/30"
            />

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.name}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <Badge variant="primary">
                  {capitalizeFirst(user.user_type || 'Creator')}
                </Badge>
                {user.location && (
                  <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a 
                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-teal-400 hover:text-teal-300"
                  >
                    <Globe className="w-4 h-4" />
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>

              {user.bio && (
                <p className="text-[var(--text-secondary)] max-w-xl">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-5 text-center bg-gradient-to-br from-teal-500/10 to-transparent border-teal-500/20">
            <p className="text-3xl font-bold text-teal-400">{formatNumber(totalFollowers)}</p>
            <p className="text-sm text-[var(--text-secondary)]">Total Followers</p>
          </Card>
          <Card className="p-5 text-center bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
            <p className="text-3xl font-bold text-orange-400">{avgEngagement}%</p>
            <p className="text-sm text-[var(--text-secondary)]">Avg. Engagement</p>
          </Card>
          <Card className="p-5 text-center bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 col-span-2 md:col-span-1">
            <p className="text-3xl font-bold text-purple-400">{accounts?.length || 0}</p>
            <p className="text-sm text-[var(--text-secondary)]">Platforms</p>
          </Card>
        </div>

        {/* Connected Platforms */}
        {accounts && accounts.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Connected Platforms</h2>
            <div className="grid gap-3">
              {accounts.map((account) => {
                const platform = platformStyles[account.platform] || { icon: '🔗', color: 'bg-gray-600', name: account.platform }
                
                return (
                  <div 
                    key={account.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-xl`}>
                      {platform.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{platform.name}</p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        @{account.username || 'connected'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatNumber(account.stats?.followers || 0)}</p>
                      <p className="text-xs text-[var(--text-secondary)]">followers</p>
                    </div>
                    {account.profile_url && (
                      <a 
                        href={account.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-[var(--text-secondary)]" />
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-[var(--text-secondary)] mb-4">
            Want to collaborate with {user.name?.split(' ')[0]}?
          </p>
          <Link to="/register">
            <Button size="lg">
              Join Formative
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Powered by <Link to="/" className="text-teal-400 hover:text-teal-300">Formative</Link> — 
            The platform for influencer marketing
          </p>
        </div>
      </footer>
    </div>
  )
}

