import { useState, useEffect } from 'react'
import { 
  Link2, 
  Bell, 
  Shield, 
  User, 
  Key, 
  Trash2, 
  ExternalLink,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  Mail,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Modal, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import api from '@/lib/api'
import { cn, capitalizeFirst, formatNumber } from '@/lib/utils'

// Social platform configurations
const socialPlatforms = [
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: '𝕏',
    color: 'bg-black',
    oauth: true,
    description: 'Connect to display your followers and engagement',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    oauth: true,
    description: 'Showcase your Instagram presence',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: 'bg-gradient-to-br from-cyan-400 via-black to-pink-500',
    oauth: true,
    description: 'Display your TikTok stats',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶️',
    color: 'bg-red-600',
    oauth: true,
    description: 'Show your YouTube channel stats',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-700',
    oauth: true,
    description: 'Connect your professional profile',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👤',
    color: 'bg-blue-600',
    oauth: true,
    description: 'Link your Facebook page',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: '🎮',
    color: 'bg-purple-600',
    oauth: true,
    description: 'Show your streaming stats',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    color: 'bg-red-500',
    oauth: true,
    description: 'Display your Pinterest presence',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: '👻',
    color: 'bg-yellow-400',
    oauth: true,
    description: 'Connect your Snapchat account',
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: '🧵',
    color: 'bg-black',
    oauth: false,
    description: 'Enter your Threads handle',
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    icon: '🦋',
    color: 'bg-blue-500',
    oauth: false,
    description: 'Simple connection - just enter your handle',
  },
]

export function Settings() {
  const { user, logout } = useAuth()
  const { addToast } = useToast()

  // State
  const [activeTab, setActiveTab] = useState('accounts')
  const [socialAccounts, setSocialAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Bluesky connect state
  const [showBlueskyModal, setShowBlueskyModal] = useState(false)
  const [blueskyHandle, setBlueskyHandle] = useState('')
  const [connectingBluesky, setConnectingBluesky] = useState(false)

  // Threads connect state
  const [showThreadsModal, setShowThreadsModal] = useState(false)
  const [threadsHandle, setThreadsHandle] = useState('')
  const [connectingThreads, setConnectingThreads] = useState(false)

  // Disconnect state
  const [disconnecting, setDisconnecting] = useState(null)
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    opportunities: true,
    messages: true,
    applications: true,
    marketing: false,
  })
  
  // Privacy settings
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showEmail: false,
    showStats: true,
  })
  
  // Booking/Calendly settings
  const [calendlyUrl, setCalendlyUrl] = useState('')
  const [savingCalendly, setSavingCalendly] = useState(false)
  
  // Password change
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [showPasswords, setShowPasswords] = useState(false)
  
  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [setting2FA, setSetting2FA] = useState(false)
  const [show2FASetupModal, setShow2FASetupModal] = useState(false)
  const [twoFactorSecret, setTwoFactorSecret] = useState('')
  const [twoFactorQR, setTwoFactorQR] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verifying2FA, setVerifying2FA] = useState(false)
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false)
  const [disableCode, setDisableCode] = useState('')
  const [disabling2FA, setDisabling2FA] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const data = await api.getSocialAccounts()
      setSocialAccounts(data.accounts || [])
      
      // Load saved notification/privacy settings from localStorage
      const savedNotifications = localStorage.getItem('notificationSettings')
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications))
      
      const savedPrivacy = localStorage.getItem('privacySettings')
      if (savedPrivacy) setPrivacy(JSON.parse(savedPrivacy))
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshStats = async () => {
    setRefreshing(true)
    try {
      // Trigger stats refresh for each platform
      for (const account of socialAccounts) {
        try {
          await fetch(`/api/social/${account.platform}/stats`, {
            headers: { 'Authorization': `Bearer ${api.getToken()}` }
          })
        } catch (e) {
          // Continue with other platforms
        }
      }
      await loadSettings()
      addToast('Stats refreshed!', 'success')
    } catch (error) {
      addToast('Failed to refresh stats', 'error')
    } finally {
      setRefreshing(false)
    }
  }

  // OAuth connection
  const initiateOAuth = (platform) => {
    const token = api.getToken()
    if (!token) {
      addToast('Please log in first', 'error')
      return
    }

    // Redirect to OAuth endpoint
    window.location.href = `/api/oauth/${platform}/authorize?token=${encodeURIComponent(token)}`
  }

  // Bluesky connection
  const connectBluesky = async () => {
    if (!blueskyHandle.trim()) {
      addToast('Please enter your Bluesky handle', 'error')
      return
    }

    setConnectingBluesky(true)
    try {
      const response = await fetch('/api/social/bluesky/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${api.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handle: blueskyHandle.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        addToast('Bluesky connected successfully!', 'success')
        setShowBlueskyModal(false)
        setBlueskyHandle('')
        loadSettings()
      } else {
        addToast(data.error || 'Failed to connect', 'error')
      }
    } catch (error) {
      addToast('Failed to connect Bluesky', 'error')
    } finally {
      setConnectingBluesky(false)
    }
  }

  // Threads connection
  const connectThreads = async () => {
    if (!threadsHandle.trim()) {
      addToast('Please enter your Threads handle', 'error')
      return
    }

    setConnectingThreads(true)
    try {
      const response = await fetch('/api/social/threads/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${api.getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handle: threadsHandle.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        addToast('Threads connected successfully!', 'success')
        setShowThreadsModal(false)
        setThreadsHandle('')
        loadSettings()
      } else {
        addToast(data.error || 'Failed to connect', 'error')
      }
    } catch (error) {
      addToast('Failed to connect Threads', 'error')
    } finally {
      setConnectingThreads(false)
    }
  }

  // Disconnect platform
  const disconnectPlatform = async (platform) => {
    setDisconnecting(platform)
    try {
      const response = await fetch(`/api/social/disconnect/${platform}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${api.getToken()}` },
      })

      if (response.ok) {
        addToast(`${capitalizeFirst(platform)} disconnected`, 'success')
        loadSettings()
      } else {
        addToast('Failed to disconnect', 'error')
      }
    } catch (error) {
      addToast('Failed to disconnect', 'error')
    } finally {
      setDisconnecting(null)
    }
  }

  // Save notification settings
  const saveNotifications = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notifications))
    addToast('Notification preferences saved!', 'success')
  }

  // Save privacy settings
  const savePrivacy = () => {
    localStorage.setItem('privacySettings', JSON.stringify(privacy))
    addToast('Privacy settings saved!', 'success')
  }

  // 2FA setup
  const handleSetup2FA = async () => {
    setSetting2FA(true)
    try {
      const response = await api.setup2FA()
      if (response.secret && response.qrCode) {
        setTwoFactorSecret(response.secret)
        setTwoFactorQR(response.qrCode)
        setShow2FASetupModal(true)
      }
    } catch (error) {
      addToast('Failed to setup 2FA', 'error')
    } finally {
      setSetting2FA(false)
    }
  }

  // Verify and enable 2FA
  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      addToast('Please enter a valid 6-digit code', 'error')
      return
    }

    setVerifying2FA(true)
    try {
      const response = await api.verify2FA(verificationCode)
      if (response.success) {
        setTwoFactorEnabled(true)
        setShow2FASetupModal(false)
        setVerificationCode('')
        addToast('Two-factor authentication enabled!', 'success')
      }
    } catch (error) {
      addToast(error.message || 'Invalid code', 'error')
    } finally {
      setVerifying2FA(false)
    }
  }

  // Disable 2FA
  const handleDisable2FA = async () => {
    if (!disableCode || disableCode.length !== 6) {
      addToast('Please enter a valid 6-digit code', 'error')
      return
    }

    setDisabling2FA(true)
    try {
      const response = await api.disable2FA(disableCode)
      if (response.success) {
        setTwoFactorEnabled(false)
        setShowDisable2FAModal(false)
        setDisableCode('')
        addToast('Two-factor authentication disabled', 'success')
      }
    } catch (error) {
      addToast(error.message || 'Invalid code', 'error')
    } finally {
      setDisabling2FA(false)
    }
  }

  // Check if platform is connected
  const isConnected = (platformId) => {
    return socialAccounts.some(acc => acc.platform === platformId)
  }

  // Get connected account details
  const getConnectedAccount = (platformId) => {
    return socialAccounts.find(acc => acc.platform === platformId)
  }

  const tabs = [
    { id: 'accounts', label: 'Social Accounts', icon: Link2 },
    { id: 'booking', label: 'Booking', icon: ExternalLink },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: User },
  ]
  
  // Save Calendly URL
  const handleSaveCalendly = async () => {
    setSavingCalendly(true)
    try {
      // Save to localStorage for now (would be API in production)
      localStorage.setItem('formative_calendly_url', calendlyUrl)
      addToast('Booking link saved!', 'success')
    } catch (error) {
      addToast('Failed to save booking link', 'error')
    } finally {
      setSavingCalendly(false)
    }
  }
  
  // Load Calendly URL on mount
  useEffect(() => {
    const saved = localStorage.getItem('formative_calendly_url')
    if (saved) setCalendlyUrl(saved)
  }, [])

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--text-secondary)]">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar Tabs */}
        <Card className="h-fit p-2">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                  activeTab === tab.id
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-white'
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {/* Social Accounts Tab */}
          {activeTab === 'accounts' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={refreshStats}
                    loading={refreshing}
                  >
                    <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
                    Refresh Stats
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {socialPlatforms.map((platform) => {
                        const connected = isConnected(platform.id)
                        const account = getConnectedAccount(platform.id)
                        
                        return (
                          <div
                            key={platform.id}
                            className={cn(
                              'flex items-center gap-4 p-4 rounded-xl border transition-all',
                              connected 
                                ? 'bg-[var(--bg-secondary)] border-green-500/30' 
                                : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--text-muted)]'
                            )}
                          >
                            {/* Platform Icon */}
                            <div className={cn(
                              'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
                              platform.color
                            )}>
                              {platform.icon}
                            </div>

                            {/* Platform Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{platform.name}</span>
                                {connected && (
                                  <Badge variant="success" className="text-xs">Connected</Badge>
                                )}
                              </div>
                              {connected ? (
                                <div className="flex items-center gap-4 mt-1 text-sm">
                                  <span className="text-[var(--text-secondary)]">
                                    @{account?.username || 'connected'}
                                  </span>
                                  <span className="text-teal-400 font-medium">
                                    {formatNumber(account?.stats?.followers || 0)} followers
                                  </span>
                                </div>
                              ) : (
                                <p className="text-sm text-[var(--text-secondary)] mt-1">
                                  {platform.description}
                                </p>
                              )}
                            </div>

                            {/* Action Button */}
                            {connected ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={() => disconnectPlatform(platform.id)}
                                loading={disconnecting === platform.id}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Disconnect
                              </Button>
                            ) : platform.oauth ? (
                              <Button
                                size="sm"
                                onClick={() => initiateOAuth(platform.id)}
                              >
                                Connect
                              </Button>
                            ) : platform.id === 'threads' ? (
                              <Button
                                size="sm"
                                onClick={() => setShowThreadsModal(true)}
                              >
                                Connect
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => setShowBlueskyModal(true)}
                              >
                                Connect
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="p-5 bg-blue-500/10 border-blue-500/30">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Why connect your accounts?</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Connected accounts display your real follower counts and engagement rates on your profile 
                      and media kit. This helps brands see your authentic reach and makes you more attractive 
                      for collaborations.
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Booking Tab */}
          {activeTab === 'booking' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-teal-400" />
                  Booking & Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-[var(--text-secondary)]">
                  Add your booking link to let brands schedule calls with you directly from your creator page.
                </p>

                {/* Calendly Integration */}
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-xl">📅</span>
                    </div>
                    <div>
                      <p className="font-semibold">Calendly</p>
                      <p className="text-sm text-[var(--text-secondary)]">Add your Calendly scheduling link</p>
                    </div>
                  </div>
                  
                  <Input
                    placeholder="https://calendly.com/your-username"
                    value={calendlyUrl}
                    onChange={(e) => setCalendlyUrl(e.target.value)}
                    className="mb-3"
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveCalendly} 
                      loading={savingCalendly}
                      disabled={!calendlyUrl.trim()}
                    >
                      Save Link
                    </Button>
                    {calendlyUrl && (
                      <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Test Link
                        </Button>
                      </a>
                    )}
                  </div>
                </div>

                {/* How it works */}
                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                  <h4 className="font-medium text-teal-400 mb-2">How it works</h4>
                  <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400 mt-0.5">1.</span>
                      <span>Create a free account at <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">calendly.com</a></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400 mt-0.5">2.</span>
                      <span>Set up your availability and meeting types</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400 mt-0.5">3.</span>
                      <span>Paste your Calendly link here</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400 mt-0.5">4.</span>
                      <span>Brands can book calls directly from your creator page!</span>
                    </li>
                  </ul>
                </div>

                {/* Other booking services */}
                <div>
                  <p className="text-sm text-[var(--text-muted)] mb-3">
                    Don't use Calendly? You can also paste links from:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Cal.com', 'Acuity', 'HubSpot', 'TidyCal', 'SavvyCal'].map(service => (
                      <span key={service} className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)]">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-[var(--text-secondary)]">
                  Choose what notifications you'd like to receive.
                </p>

                <div className="space-y-4">
                  {[
                    { key: 'opportunities', label: 'New Opportunities', desc: 'Get notified about opportunities that match your profile' },
                    { key: 'messages', label: 'Messages', desc: 'Receive notifications for new messages' },
                    { key: 'applications', label: 'Application Updates', desc: 'Updates on your submitted applications' },
                    { key: 'marketing', label: 'Marketing & Tips', desc: 'Platform updates, tips, and promotional content' },
                  ].map((item) => (
                    <label 
                      key={item.key}
                      className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] cursor-pointer hover:bg-[var(--bg-card)] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={notifications[item.key]}
                        onChange={(e) => setNotifications(prev => ({ 
                          ...prev, 
                          [item.key]: e.target.checked 
                        }))}
                        className="mt-1 w-5 h-5 rounded accent-teal-500"
                      />
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <Button onClick={saveNotifications}>Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-[var(--text-secondary)]">
                  Control who can see your profile and information.
                </p>

                <div className="space-y-4">
                  {[
                    { key: 'publicProfile', label: 'Public Profile', desc: 'Allow others to view your profile and media kit', icon: Globe },
                    { key: 'showEmail', label: 'Show Email', desc: 'Display your email address on your public profile', icon: Mail },
                    { key: 'showStats', label: 'Show Statistics', desc: 'Display follower counts and engagement on public profile', icon: Eye },
                  ].map((item) => (
                    <label 
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] cursor-pointer hover:bg-[var(--bg-card)] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-[var(--text-secondary)]" />
                        </div>
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={privacy[item.key]}
                          onChange={(e) => setPrivacy(prev => ({ 
                            ...prev, 
                            [item.key]: e.target.checked 
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[var(--border-color)] peer-checked:bg-teal-500 rounded-full transition-colors" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                      </div>
                    </label>
                  ))}
                </div>

                <Button onClick={savePrivacy}>Save Settings</Button>
              </CardContent>
            </Card>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <>
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
                      <p className="text-sm text-[var(--text-secondary)] mb-1">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
                      <p className="text-sm text-[var(--text-secondary)] mb-1">Account Type</p>
                      <p className="font-medium">{capitalizeFirst(user?.user_type || 'Influencer')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">Two-Factor Authentication</p>
                          {twoFactorEnabled ? (
                            <Badge variant="success">Enabled</Badge>
                          ) : (
                            <Badge>Disabled</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {twoFactorEnabled 
                            ? 'Your account is protected with 2FA' 
                            : 'Add an extra layer of security'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={twoFactorEnabled ? "ghost" : "secondary"} 
                      size="sm" 
                      onClick={() => twoFactorEnabled ? setShowDisable2FAModal(true) : handleSetup2FA()}
                      loading={setting2FA}
                    >
                      {twoFactorEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>

                  {/* Password */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center">
                        <Key className="w-5 h-5 text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-[var(--text-secondary)]">Last changed: Never</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setShowPasswordModal(true)}>
                      Change Password
                    </Button>
                  </div>

                  {/* Session Info */}
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Session Security</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      You will be automatically logged out after 15 minutes of inactivity. 
                      Sessions expire when you close the browser unless "Remember me" was checked.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium text-red-400">Delete Account</p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          Permanently delete your account and all data
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Bluesky Connect Modal */}
      <Modal
        isOpen={showBlueskyModal}
        onClose={() => setShowBlueskyModal(false)}
        title="Connect Bluesky"
        subtitle="Enter your Bluesky handle to connect"
      >
        <div className="space-y-4">
          <Input
            label="Bluesky Handle"
            placeholder="@username.bsky.social"
            value={blueskyHandle}
            onChange={(e) => setBlueskyHandle(e.target.value)}
          />
          <p className="text-sm text-[var(--text-secondary)]">
            Your Bluesky profile will be verified and your follower count will be displayed.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowBlueskyModal(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={connectBluesky}
              loading={connectingBluesky}
              disabled={!blueskyHandle.trim()}
            >
              Connect
            </Button>
          </div>
        </div>
      </Modal>

      {/* Threads Connect Modal */}
      <Modal
        isOpen={showThreadsModal}
        onClose={() => setShowThreadsModal(false)}
        title="Connect Threads"
        subtitle="Enter your Threads handle to connect"
      >
        <div className="space-y-4">
          <Input
            label="Threads Handle"
            placeholder="@username"
            value={threadsHandle}
            onChange={(e) => setThreadsHandle(e.target.value)}
          />
          <p className="text-sm text-[var(--text-secondary)]">
            Your Threads profile will be linked. For full verification, also connect your Instagram account.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowThreadsModal(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={connectThreads}
              loading={connectingThreads}
              disabled={!threadsHandle.trim()}
            >
              Connect
            </Button>
          </div>
        </div>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        subtitle="Enter your current and new password"
      >
        <div className="space-y-4">
          <div className="relative">
            <Input
              type={showPasswords ? 'text' : 'password'}
              label="Current Password"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
            />
          </div>
          <Input
            type={showPasswords ? 'text' : 'password'}
            label="New Password"
            value={passwordForm.new}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
          />
          <Input
            type={showPasswords ? 'text' : 'password'}
            label="Confirm New Password"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              className="rounded"
            />
            Show passwords
          </label>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1"
              disabled={!passwordForm.current || !passwordForm.new || passwordForm.new !== passwordForm.confirm}
              onClick={() => {
                addToast('Password change feature coming soon!', 'info')
                setShowPasswordModal(false)
              }}
            >
              Update Password
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        subtitle="This action cannot be undone"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-red-400">Warning</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Deleting your account will permanently remove all your data, including your profile, 
              connected accounts, messages, and applications. This action cannot be undone.
            </p>
          </div>
          
          <Input
            label={`Type "DELETE" to confirm`}
            placeholder="DELETE"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
          
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger"
              className="flex-1"
              disabled={deleteConfirmation !== 'DELETE'}
              onClick={() => {
                addToast('Account deletion feature coming soon!', 'info')
                setShowDeleteModal(false)
              }}
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal
        isOpen={show2FASetupModal}
        onClose={() => setShow2FASetupModal(false)}
        title="Set Up Two-Factor Authentication"
        subtitle="Scan the QR code with your authenticator app"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-teal-400" />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)] text-center">
              Scan this QR code with an authenticator app like Google Authenticator, 
              Authy, or 1Password.
            </p>

            {/* QR Code */}
            {twoFactorQR && (
              <div className="flex justify-center p-4 bg-white rounded-xl">
                <img src={twoFactorQR} alt="2FA QR Code" className="w-48 h-48" />
              </div>
            )}

            {/* Manual entry */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
              <p className="text-xs text-[var(--text-muted)] mb-2">
                Can't scan? Enter this code manually:
              </p>
              <code className="text-sm text-teal-400 break-all font-mono">
                {twoFactorSecret}
              </code>
            </div>

            {/* Verification */}
            <Input
              type="text"
              label="Enter verification code"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-xl tracking-widest"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShow2FASetupModal(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleVerify2FA}
              loading={verifying2FA}
              disabled={verificationCode.length !== 6}
            >
              Verify & Enable
            </Button>
          </div>
        </div>
      </Modal>

      {/* Disable 2FA Modal */}
      <Modal
        isOpen={showDisable2FAModal}
        onClose={() => setShowDisable2FAModal(false)}
        title="Disable Two-Factor Authentication"
        subtitle="Enter your 2FA code to confirm"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <span className="font-semibold text-orange-400">Warning</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Disabling 2FA will make your account less secure. You can always re-enable it later.
            </p>
          </div>

          <Input
            type="text"
            label="Enter your 2FA code"
            placeholder="000000"
            value={disableCode}
            onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="text-center text-xl tracking-widest"
          />

          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowDisable2FAModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger"
              className="flex-1" 
              onClick={handleDisable2FA}
              loading={disabling2FA}
              disabled={disableCode.length !== 6}
            >
              Disable 2FA
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

