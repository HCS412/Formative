import { useState, useEffect } from 'react'
import { 
  Edit2, 
  MapPin, 
  Globe, 
  Calendar, 
  Link2, 
  Copy, 
  Check, 
  ExternalLink,
  Twitter,
  Instagram,
  Youtube,
  RefreshCw
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Textarea, Modal, Card, CardHeader, CardTitle, CardContent, Avatar, Badge } from '@/components/ui'
import { AvatarUpload } from '@/components/AvatarUpload'
import api from '@/lib/api'
import { formatNumber, formatDate, capitalizeFirst, getInitials } from '@/lib/utils'

const platformIcons = {
  twitter: '𝕏',
  instagram: '📷',
  tiktok: '🎵',
  youtube: '▶️',
  bluesky: '🦋',
  twitch: '🎮',
}

const platformColors = {
  twitter: 'bg-black',
  instagram: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
  tiktok: 'bg-black',
  youtube: 'bg-red-600',
  bluesky: 'bg-blue-500',
  twitch: 'bg-purple-600',
}

export function Profile() {
  const { user, updateUser } = useAuth()
  const { addToast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [socialAccounts, setSocialAccounts] = useState([])
  const [username, setUsername] = useState('')
  const [kitUrl, setKitUrl] = useState('')
  const [copied, setCopied] = useState(false)
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
  })
  const [saving, setSaving] = useState(false)
  
  // Username modal state
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [savingUsername, setSavingUsername] = useState(false)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    setLoading(true)
    try {
      // Load profile
      const profileData = await api.getProfile()
      if (profileData.user) {
        updateUser(profileData.user)
        setEditForm({
          name: profileData.user.name || '',
          bio: profileData.user.bio || '',
          location: profileData.user.location || '',
          website: profileData.user.website || '',
        })
      }

      // Load social accounts
      const socialData = await api.getSocialAccounts()
      setSocialAccounts(socialData.accounts || [])

      // Load username
      const usernameData = await api.getUsername()
      if (usernameData.username) {
        setUsername(usernameData.username)
        setKitUrl(`${window.location.origin}/kit/${usernameData.username}`)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate total stats
  const totalFollowers = socialAccounts.reduce((sum, acc) => {
    return sum + (acc.stats?.followers || 0)
  }, 0)

  const avgEngagement = (() => {
    const engagements = socialAccounts
      .filter(acc => acc.stats?.engagementRate)
      .map(acc => parseFloat(acc.stats.engagementRate))
    if (engagements.length === 0) return 0
    return (engagements.reduce((a, b) => a + b, 0) / engagements.length).toFixed(1)
  })()

  // Handle edit profile
  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await api.updateProfile(editForm)
      updateUser(editForm)
      addToast('Profile updated successfully!', 'success')
      setShowEditModal(false)
    } catch (error) {
      addToast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Check username availability
  const checkUsernameAvailability = async (value) => {
    if (value.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setCheckingUsername(true)
    try {
      const response = await fetch(`/api/user/username/check/${encodeURIComponent(value)}`)
      if (!response.ok) {
        // If server error, assume available (will validate on save)
        setUsernameAvailable(true)
        return
      }
      const data = await response.json()
      // Handle error responses that still return 200
      if (data.error && !data.hasOwnProperty('available')) {
        setUsernameAvailable(true) // Assume available, validate on save
      } else {
        setUsernameAvailable(data.available)
      }
    } catch (error) {
      console.error('Username check error:', error)
      // On network error, assume available and validate on save
      setUsernameAvailable(true)
    } finally {
      setCheckingUsername(false)
    }
  }

  // Save username
  const handleSaveUsername = async () => {
    if (!newUsername || newUsername.length < 3) {
      addToast('Username must be at least 3 characters', 'error')
      return
    }

    setSavingUsername(true)
    try {
      const data = await api.setUsername(newUsername)
      setUsername(data.username)
      setKitUrl(`${window.location.origin}/kit/${data.username}`)
      addToast('Username saved!', 'success')
      setShowUsernameModal(false)
    } catch (error) {
      addToast(error.message || 'Failed to save username', 'error')
    } finally {
      setSavingUsername(false)
    }
  }

  // Copy link
  const handleCopyLink = () => {
    if (kitUrl) {
      navigator.clipboard.writeText(kitUrl)
      setCopied(true)
      addToast('Link copied to clipboard!', 'success')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Profile Header */}
      <Card className="p-6 md:p-8 mb-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-purple-500/10" />
        
        <div className="relative flex flex-col md:flex-row gap-6">
          {/* Avatar with Upload */}
          <div className="flex-shrink-0">
            <AvatarUpload
              name={user?.name}
              currentUrl={user?.avatar_url}
              size="2xl"
              onUpload={(url) => setUser({ ...user, avatar_url: url })}
              onRemove={() => setUser({ ...user, avatar_url: null })}
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{user?.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-[var(--text-secondary)]">
                  <Badge variant="primary">
                    {capitalizeFirst(user?.user_type || 'influencer')}
                  </Badge>
                  {user?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </span>
                  )}
                  {user?.website && (
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-teal-400 hover:text-teal-300"
                    >
                      <Globe className="w-4 h-4" />
                      {user.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>

              <Button onClick={() => setShowEditModal(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {user?.bio && (
              <p className="mt-4 text-[var(--text-secondary)] max-w-2xl">
                {user.bio}
              </p>
            )}

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mt-6">
              <div>
                <p className="text-2xl font-bold text-teal-400">{formatNumber(totalFollowers)}</p>
                <p className="text-sm text-[var(--text-secondary)]">Total Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-400">{avgEngagement}%</p>
                <p className="text-sm text-[var(--text-secondary)]">Avg. Engagement</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">{socialAccounts.length}</p>
                <p className="text-sm text-[var(--text-secondary)]">Connected Platforms</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <Button variant="ghost" size="sm" onClick={loadProfileData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {socialAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🔗</div>
                  <p className="text-[var(--text-secondary)] mb-4">No connected accounts yet</p>
                  <Button variant="secondary" onClick={() => window.location.href = '/dashboard/settings'}>
                    Connect Accounts
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {socialAccounts.map((account) => (
                    <div 
                      key={account.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] transition-colors"
                    >
                      <div className={`w-12 h-12 rounded-xl ${platformColors[account.platform] || 'bg-gray-600'} flex items-center justify-center text-xl`}>
                        {platformIcons[account.platform] || '🔗'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{capitalizeFirst(account.platform)}</span>
                          {account.is_verified && (
                            <Badge variant="success" className="text-xs">Verified</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                          @{account.username || 'connected'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{formatNumber(account.stats?.followers || 0)}</p>
                        <p className="text-xs text-[var(--text-secondary)]">followers</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Share Profile Card */}
          <Card className="p-5 bg-gradient-to-br from-teal-500/10 to-purple-500/10 border-teal-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="font-semibold">Shareable Profile</h3>
                <p className="text-sm text-[var(--text-secondary)]">Share your media kit</p>
              </div>
            </div>

            {username ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--bg-secondary)]">
                  <code className="flex-1 text-sm text-teal-400 truncate">
                    {kitUrl}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopyLink}
                    className="flex-shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(kitUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setNewUsername(username)
                      setShowUsernameModal(true)
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-[var(--text-secondary)]">
                  Create a unique URL to share your profile with brands and collaborators.
                </p>
                <Button className="w-full" onClick={() => setShowUsernameModal(true)}>
                  Create Your Link
                </Button>
              </div>
            )}
          </Card>

          {/* Member Since */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[var(--text-secondary)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Member since</p>
                <p className="font-semibold">
                  {user?.created_at 
                    ? formatDate(user.created_at)
                    : 'Recently joined'}
                </p>
              </div>
            </div>
          </Card>

          {/* Account Type */}
          <Card className="p-5">
            <h3 className="font-semibold mb-3">Account Type</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)]">
              <span className="text-2xl">
                {user?.user_type === 'influencer' ? '👤' : 
                 user?.user_type === 'brand' ? '🏢' : '🎨'}
              </span>
              <div>
                <p className="font-medium">{capitalizeFirst(user?.user_type || 'Influencer')}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {user?.user_type === 'influencer' ? 'Content Creator' :
                   user?.user_type === 'brand' ? 'Business Account' : 'Creative Professional'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        subtitle="Update your profile information"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={editForm.name}
            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your name"
          />
          <Textarea
            label="Bio"
            value={editForm.bio}
            onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself..."
            rows={4}
          />
          <Input
            label="Location"
            value={editForm.location}
            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
            placeholder="City, Country"
          />
          <Input
            label="Website"
            value={editForm.website}
            onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://yourwebsite.com"
          />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSaveProfile} loading={saving}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Username Modal */}
      <Modal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        title={username ? 'Edit Username' : 'Create Your Link'}
        subtitle="Choose a unique username for your shareable profile"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Username
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">formative.app/kit/</span>
              <Input
                value={newUsername}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
                  setNewUsername(value)
                  checkUsernameAvailability(value)
                }}
                placeholder="your-username"
                className="flex-1"
              />
            </div>
            {newUsername.length >= 3 && (
              <p className={`text-sm mt-2 ${
                checkingUsername ? 'text-[var(--text-muted)]' :
                usernameAvailable ? 'text-green-400' : 'text-red-400'
              }`}>
                {checkingUsername ? 'Checking...' :
                 usernameAvailable ? '✓ Available!' : '✗ Already taken'}
              </p>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Your profile will be available at:<br />
            <code className="text-teal-400">
              {`${window.location.origin}/kit/${newUsername || 'username'}`}
            </code>
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowUsernameModal(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleSaveUsername} 
              loading={savingUsername}
              disabled={!usernameAvailable || newUsername.length < 3}
            >
              {username ? 'Update' : 'Create Link'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

