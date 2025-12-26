import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPin, 
  Globe, 
  Mail,
  Calendar,
  ExternalLink, 
  Copy, 
  Check,
  Star,
  Users,
  TrendingUp,
  Briefcase,
  Share2,
  Download,
  MessageCircle
} from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'

// Platform configurations with brand colors
const platformConfig = {
  twitter: { 
    icon: '𝕏', 
    bg: 'bg-black', 
    name: 'Twitter / X',
    urlPrefix: 'https://twitter.com/'
  },
  instagram: { 
    icon: '📸', 
    bg: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400', 
    name: 'Instagram',
    urlPrefix: 'https://instagram.com/'
  },
  tiktok: { 
    icon: '🎵', 
    bg: 'bg-black', 
    name: 'TikTok',
    urlPrefix: 'https://tiktok.com/@'
  },
  youtube: { 
    icon: '▶️', 
    bg: 'bg-red-600', 
    name: 'YouTube',
    urlPrefix: 'https://youtube.com/@'
  },
  bluesky: { 
    icon: '🦋', 
    bg: 'bg-sky-500', 
    name: 'Bluesky',
    urlPrefix: 'https://bsky.app/profile/'
  },
  twitch: { 
    icon: '🎮', 
    bg: 'bg-purple-600', 
    name: 'Twitch',
    urlPrefix: 'https://twitch.tv/'
  },
  linkedin: { 
    icon: '💼', 
    bg: 'bg-blue-700', 
    name: 'LinkedIn',
    urlPrefix: 'https://linkedin.com/in/'
  },
}

export function MediaKit() {
  const { username } = useParams()
  const [kit, setKit] = useState(null)
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
      } else if (data.success && data.kit) {
        setKit(data.kit)
      } else if (data.user) {
        // Handle old format
        setKit({
          name: data.user.name,
          username: data.user.username,
          userType: data.user.user_type,
          bio: data.user.bio,
          location: data.user.location,
          website: data.user.website,
          avatarUrl: data.user.avatar_url,
          memberSince: data.user.created_at,
          stats: {
            totalFollowers: data.accounts?.reduce((sum, a) => sum + (a.stats?.followers || 0), 0) || 0,
            platformCount: data.accounts?.length || 0
          },
          platforms: data.accounts?.map(a => ({
            platform: a.platform,
            username: a.username,
            followers: a.stats?.followers || 0,
            engagementRate: a.stats?.engagementRate
          })) || []
        })
      } else {
        setError('Invalid response format')
      }
    } catch (err) {
      console.error('Load profile error:', err)
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
          title: `${kit?.name}'s Creator Page`,
          text: `Check out ${kit?.name}'s creator page on Formative`,
          url: window.location.href,
        })
      } catch (err) {
        handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin" />
          <p className="text-white/60">Loading creator page...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
            <span className="text-5xl">🔍</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Creator Not Found</h1>
          <p className="text-white/60 mb-8">
            {error === 'User not found' 
              ? "This creator page doesn't exist or hasn't been set up yet."
              : error}
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all"
          >
            Explore Formative
          </Link>
        </div>
      </div>
    )
  }

  const { name, userType, bio, location, website, avatarUrl, memberSince, stats, platforms } = kit

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[200px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-orange-500 relative group-hover:scale-105 transition-transform">
              <div className="absolute w-6 h-6 rounded-full bg-[#0a0a0f] top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2" />
            </div>
            <span className="font-bold text-lg">Formative</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg hover:shadow-teal-500/25 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          {/* Avatar */}
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden ring-4 ring-white/10 shadow-2xl">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-5xl font-bold">
                  {name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            {/* Verified badge placeholder */}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Name & Type */}
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            {name}
          </h1>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 text-teal-400 text-sm font-medium capitalize">
              {userType || 'Creator'}
            </span>
            {location && (
              <span className="flex items-center gap-1.5 text-white/60 text-sm">
                <MapPin className="w-4 h-4" />
                {location}
              </span>
            )}
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
              {bio}
            </p>
          )}

          {/* Quick Links */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {website && (
              <a 
                href={website.startsWith('http') ? website : `https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
              >
                <Globe className="w-4 h-4 text-teal-400" />
                <span className="text-sm">{website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
            <Link 
              to="/register"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg hover:shadow-teal-500/25 transition-all font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Get in Touch</span>
            </Link>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/20 text-center group hover:scale-105 transition-transform">
            <Users className="w-6 h-6 text-teal-400 mx-auto mb-3" />
            <p className="text-3xl md:text-4xl font-bold text-white mb-1">
              {formatNumber(stats?.totalFollowers || 0)}
            </p>
            <p className="text-sm text-white/50">Total Followers</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 text-center group hover:scale-105 transition-transform">
            <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-3" />
            <p className="text-3xl md:text-4xl font-bold text-white mb-1">
              {stats?.avgEngagement ? `${stats.avgEngagement}%` : 'N/A'}
            </p>
            <p className="text-sm text-white/50">Avg. Engagement</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 text-center group hover:scale-105 transition-transform">
            <Briefcase className="w-6 h-6 text-orange-400 mx-auto mb-3" />
            <p className="text-3xl md:text-4xl font-bold text-white mb-1">
              {stats?.collaborationsCompleted || 0}
            </p>
            <p className="text-sm text-white/50">Collaborations</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 text-center group hover:scale-105 transition-transform">
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-3" />
            <p className="text-3xl md:text-4xl font-bold text-white mb-1">
              {stats?.averageRating ? `${stats.averageRating}` : 'New'}
            </p>
            <p className="text-sm text-white/50">Rating</p>
          </div>
        </section>

        {/* Platforms Section */}
        {platforms && platforms.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                📱
              </span>
              Connected Platforms
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {platforms.map((platform, index) => {
                const config = platformConfig[platform.platform] || { 
                  icon: '🔗', 
                  bg: 'bg-gray-600', 
                  name: platform.platform,
                  urlPrefix: '#'
                }
                const profileUrl = platform.username ? `${config.urlPrefix}${platform.username}` : null
                
                return (
                  <a
                    key={index}
                    href={profileUrl || '#'}
                    target={profileUrl ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10",
                      "hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all group",
                      !profileUrl && "pointer-events-none"
                    )}
                  >
                    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg", config.bg)}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{config.name}</p>
                      <p className="text-sm text-white/50 truncate">
                        @{platform.username || 'connected'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {formatNumber(platform.followers || 0)}
                      </p>
                      <p className="text-xs text-white/40">followers</p>
                    </div>
                    {profileUrl && (
                      <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                    )}
                  </a>
                )
              })}
            </div>
          </section>
        )}

        {/* Member Since */}
        {memberSince && (
          <section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm">
              <Calendar className="w-4 h-4" />
              Member since {new Date(memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500/20 via-cyan-500/10 to-purple-500/20 border border-white/10 p-8 md:p-12 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Want to collaborate with {name?.split(' ')[0]}?
            </h3>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Join Formative to connect with creators, brands, and freelancers for authentic collaborations.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link 
                to="/register"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105 transition-all"
              >
                Join Formative
              </Link>
              <Link 
                to="/login"
                className="px-8 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-orange-500 relative">
              <div className="absolute w-5 h-5 rounded-full bg-[#0a0a0f] top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2" />
            </div>
            <span className="font-semibold">Formative</span>
          </div>
          <p className="text-sm text-white/40">
            The platform for influencer marketing
          </p>
          <a 
            href="/"
            className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            Create your own page →
          </a>
        </div>
      </footer>
    </div>
  )
}
