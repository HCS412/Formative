import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Target,
  FolderKanban,
  Wallet,
  Users,
  Plus,
  Search,
  Calendar,
  DollarSign,
  FileText,
  Check,
  AlertTriangle,
  Clock,
  X,
  Upload,
  Link2,
  BarChart3,
  CreditCard,
  Trash2,
  Copy,
  ExternalLink,
  Shield,
  Bitcoin,
  Unlink,
  Crown,
  UserPlus,
  Mail,
  Settings,
  ChevronRight,
  Building2,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  CircleHelp,
  MessageSquare
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CampaignCard } from '@/components/CampaignCard'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Textarea, Modal, Card, CardHeader, CardTitle, CardContent, Badge, Avatar } from '@/components/ui'
import api from '@/lib/api'
import { cn, capitalizeFirst, formatDate, formatNumber, formatRelativeTime, formatTime } from '@/lib/utils'

// Tab configuration
const tabs = [
  { id: 'campaigns', label: 'Campaigns', icon: Target },
  { id: 'library', label: 'Library', icon: FileText },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'management', label: 'Management', icon: Users },
]

// ============================================
// CAMPAIGNS PANEL
// ============================================
function CampaignsPanel() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const isBrand = user?.user_type === 'brand'

  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)

  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    budget: '',
    start_date: '',
    end_date: '',
    platforms: [],
    requirements: '',
    deliverables: '',
  })

  const statusFilters = [
    { id: 'all', label: 'All Campaigns' },
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'draft', label: 'Drafts' },
  ]

  const platformOptions = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Bluesky']

  useEffect(() => {
    loadCampaigns()
  }, [statusFilter])

  const loadCampaigns = async () => {
    setLoading(true)
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {}
      const data = await api.getCampaigns(params)
      setCampaigns(data.campaigns || [])
    } catch (error) {
      console.error('Failed to load campaigns:', error)
      setCampaigns(getDemoCampaigns())
    } finally {
      setLoading(false)
    }
  }

  const getDemoCampaigns = () => [
    {
      id: 1,
      title: 'Summer Fashion Collection Launch',
      description: 'Promote our new summer collection across social media platforms.',
      brand_name: 'StyleCo',
      status: 'active',
      budget: 5000,
      start_date: '2024-06-01',
      end_date: '2024-07-15',
      participants_count: 3,
      deliverables_count: 6,
      completed_deliverables: 4,
      platforms: ['Instagram', 'TikTok'],
      deliverables: [
        { id: 1, title: 'Instagram Reel', status: 'completed', due_date: '2024-06-15' },
        { id: 2, title: 'Instagram Story Set', status: 'completed', due_date: '2024-06-20' },
        { id: 3, title: 'TikTok Video', status: 'pending', due_date: '2024-07-10' },
      ],
    },
    {
      id: 2,
      title: 'Tech Product Review Campaign',
      description: 'Seeking tech reviewers to showcase our latest gadget.',
      brand_name: 'TechNova',
      status: 'pending',
      budget: 2500,
      start_date: '2024-07-01',
      end_date: '2024-08-01',
      participants_count: 0,
      deliverables_count: 3,
      completed_deliverables: 0,
      platforms: ['YouTube', 'Twitter'],
    },
  ]

  const handleViewDetails = (campaign) => {
    setSelectedCampaign(campaign)
    setShowDetailModal(true)
  }

  const handleCreateCampaign = async () => {
    if (!campaignForm.title.trim()) {
      addToast('Please enter a campaign title', 'error')
      return
    }

    setCreating(true)
    try {
      await api.createCampaign({
        ...campaignForm,
        budget: parseFloat(campaignForm.budget) || 0,
        platforms: campaignForm.platforms,
        deliverables: campaignForm.deliverables.split('\n').filter(d => d.trim()),
        requirements: campaignForm.requirements.split('\n').filter(r => r.trim()),
      })
      addToast('Campaign created successfully!', 'success')
      setShowCreateModal(false)
      resetForm()
      loadCampaigns()
    } catch (error) {
      addToast(error.message || 'Failed to create campaign', 'error')
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setCampaignForm({
      title: '',
      description: '',
      budget: '',
      start_date: '',
      end_date: '',
      platforms: [],
      requirements: '',
      deliverables: '',
    })
  }

  const togglePlatform = (platform) => {
    setCampaignForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      campaign.title?.toLowerCase().includes(query) ||
      campaign.description?.toLowerCase().includes(query) ||
      campaign.brand_name?.toLowerCase().includes(query)
    )
  })

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    totalEarnings: campaigns
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + (c.budget || 0), 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Campaigns</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            {isBrand ? 'Manage your influencer campaigns' : 'Track your active campaigns and deliverables'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-500"
            />
          </div>

          {isBrand && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-[var(--text-secondary)]">Total</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-[var(--text-secondary)]">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-[var(--text-secondary)]">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">${formatNumber(stats.totalEarnings)}</p>
              <p className="text-xs text-[var(--text-secondary)]">{isBrand ? 'Spent' : 'Earned'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              statusFilter === filter.id
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-white'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Campaign List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <Card className="p-12 text-center">
          <Target className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            {isBrand
              ? 'Create your first campaign to start collaborating with influencers'
              : 'Apply to opportunities to get invited to campaigns'}
          </p>
          {isBrand && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              userType={user?.user_type}
              onClick={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Campaign"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Campaign Title"
            placeholder="e.g., Summer Product Launch"
            value={campaignForm.title}
            onChange={(e) => setCampaignForm(prev => ({ ...prev, title: e.target.value }))}
          />

          <Textarea
            label="Description"
            placeholder="Describe your campaign goals..."
            value={campaignForm.description}
            onChange={(e) => setCampaignForm(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Budget ($)"
              placeholder="5000"
              value={campaignForm.budget}
              onChange={(e) => setCampaignForm(prev => ({ ...prev, budget: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                label="Start"
                value={campaignForm.start_date}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, start_date: e.target.value }))}
              />
              <Input
                type="date"
                label="End"
                value={campaignForm.end_date}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors',
                    campaignForm.platforms.includes(platform)
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-transparent hover:border-[var(--border-color)]'
                  )}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Deliverables (one per line)"
            placeholder="Instagram Reel&#10;TikTok Video"
            value={campaignForm.deliverables}
            onChange={(e) => setCampaignForm(prev => ({ ...prev, deliverables: e.target.value }))}
            rows={3}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreateCampaign}
              loading={creating}
              disabled={!campaignForm.title.trim()}
            >
              Create Campaign
            </Button>
          </div>
        </div>
      </Modal>

      {/* Campaign Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedCampaign?.title}
        size="lg"
      >
        {selectedCampaign && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={
                selectedCampaign.status === 'active' ? 'success' :
                selectedCampaign.status === 'completed' ? 'blue' : 'warning'
              }>
                {capitalizeFirst(selectedCampaign.status)}
              </Badge>
              {selectedCampaign.budget && (
                <Badge variant="primary">
                  ${formatNumber(selectedCampaign.budget)} Budget
                </Badge>
              )}
            </div>
            <p className="text-[var(--text-secondary)]">{selectedCampaign.description}</p>

            {selectedCampaign.deliverables?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Deliverables</h4>
                <div className="space-y-2">
                  {selectedCampaign.deliverables.map((d) => (
                    <div key={d.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)]">
                      {d.status === 'completed' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                      <span>{d.title}</span>
                      {d.due_date && (
                        <span className="text-xs text-[var(--text-muted)] ml-auto">
                          Due: {formatDate(d.due_date)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

// ============================================
// LIBRARY PANEL
// ============================================
function LibraryPanel() {
  const { addToast } = useToast()
  const [assets, setAssets] = useState(() => ([
    {
      id: 'asset-1',
      title: 'Summer Launch Teaser',
      campaign: 'Summer Fashion 2024',
      platform: 'Instagram',
      format: 'Reel',
      status: 'approved',
      thumbnail: 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
      caption: 'Teaser for our summer drop. Keep energy high, highlight CTA at 0:12.',
      tags: ['fashion', 'summer', 'launch'],
      collaborators: ['@styleco', '@alexdesigns'],
      location: 'Los Angeles, CA',
      partnership: 'Paid partnership with StyleCo',
      scheduledFor: '2024-07-20T18:30:00Z',
      currentVersion: 'v2',
      media: [
        { id: 'm-1', label: 'Final cut', type: 'video', backdrop: 'linear-gradient(135deg, #115e59, #14b8a6)', note: '00:30 reel' },
        { id: 'm-2', label: 'Thumbnail', type: 'image', backdrop: 'linear-gradient(135deg, #0f172a, #334155)', note: '1080x1920 cover' },
      ],
      timeline: [
        { id: 't-1', label: 'Uploaded new version', at: '2024-07-02T09:00:00Z', tone: 'info' },
        { id: 't-2', label: 'Submitted for review', at: '2024-07-03T12:30:00Z', tone: 'primary' },
        { id: 't-3', label: 'Approved by client', at: '2024-07-04T15:00:00Z', tone: 'success' },
        { id: 't-4', label: 'Scheduled for Jul 20, 6:30 PM', at: '2024-07-05T10:00:00Z', tone: 'default' },
      ],
      feedback: [
        { id: 'f-1', author: 'Sasha (Client)', channel: 'client', message: 'Please highlight CTA at 0:12', timecode: '00:12', version: 'v2', unread: true, createdAt: '2024-07-03T14:00:00Z' },
        { id: 'f-2', author: 'Nate (Internal)', channel: 'internal', message: 'Color grade matches brand palette', version: 'v2', unread: false, createdAt: '2024-07-04T09:00:00Z' },
      ]
    },
    {
      id: 'asset-2',
      title: 'Wellness Partnership Story Set',
      campaign: 'Wellness World',
      platform: 'TikTok',
      format: 'Story Set',
      status: 'changes_requested',
      thumbnail: 'linear-gradient(135deg, #ec4899, #6366f1)',
      caption: '3-panel story with swipe up. Add UGC snippet and legal line on last frame.',
      tags: ['wellness', 'ugc', 'story'],
      collaborators: ['@wellnessco', '@jess'],
      location: 'Remote',
      partnership: 'Gifted product + affiliate',
      scheduledFor: '2024-07-15T16:00:00Z',
      currentVersion: 'v1',
      media: [
        { id: 'm-3', label: 'Story frame v1', type: 'image', backdrop: 'linear-gradient(135deg, #312e81, #a855f7)', note: 'Frame 1/3' },
        { id: 'm-4', label: 'UGC cut', type: 'video', backdrop: 'linear-gradient(135deg, #4338ca, #06b6d4)', note: '00:08 clip' },
      ],
      timeline: [
        { id: 't-5', label: 'Uploaded first cut', at: '2024-07-05T10:00:00Z', tone: 'info' },
        { id: 't-6', label: 'Client requested changes', at: '2024-07-06T08:30:00Z', tone: 'warning' },
      ],
      feedback: [
        { id: 'f-3', author: 'Priya (Client)', channel: 'client', message: 'Add FTC disclosure on frame 3', timecode: null, version: 'v1', unread: true, createdAt: '2024-07-06T08:20:00Z' },
        { id: 'f-4', author: 'Alex (Internal)', channel: 'internal', message: 'Swap UGC clip at 00:04 with brighter take', timecode: '00:04', version: 'v1', unread: true, createdAt: '2024-07-06T09:00:00Z' },
      ]
    },
    {
      id: 'asset-3',
      title: 'City Pop Playlist Promo',
      campaign: 'Sounds of Summer',
      platform: 'YouTube',
      format: 'Short',
      status: 'in_review',
      thumbnail: 'linear-gradient(135deg, #f97316, #ea580c)',
      caption: 'Drive traffic to the playlist; keep end card visible for 3s.',
      tags: ['music', 'promo', 'shorts'],
      collaborators: ['@soundlab'],
      location: 'New York, NY',
      partnership: 'Paid playlist push',
      scheduledFor: '2024-07-22T13:00:00Z',
      currentVersion: 'v3',
      media: [
        { id: 'm-5', label: 'Short v3', type: 'video', backdrop: 'linear-gradient(135deg, #4f46e5, #22d3ee)', note: '00:45 short' },
      ],
      timeline: [
        { id: 't-7', label: 'Uploaded v3', at: '2024-07-08T11:10:00Z', tone: 'info' },
        { id: 't-8', label: 'Waiting on approval', at: '2024-07-09T09:00:00Z', tone: 'primary' },
      ],
      feedback: [
        { id: 'f-5', author: 'Mina (Client)', channel: 'client', message: 'Volume spike at 00:27, please normalize', timecode: '00:27', version: 'v3', unread: false, createdAt: '2024-07-09T10:00:00Z' },
      ]
    },
  ]))
  const [filters, setFilters] = useState({
    campaign: 'all',
    platform: 'all',
    status: 'all',
    format: 'all',
    tag: 'all'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssets, setSelectedAssets] = useState(new Set())
  const [activeAssetId, setActiveAssetId] = useState(null)
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [replyMessage, setReplyMessage] = useState('')
  const [replyVersion, setReplyVersion] = useState('')
  const [replyTimecode, setReplyTimecode] = useState('')

  const statusMeta = {
    approved: { label: 'Approved', variant: 'success', icon: Check, symbol: '✓' },
    in_review: { label: 'In Review', variant: 'blue', icon: CircleHelp, symbol: '?' },
    changes_requested: { label: 'Changes requested', variant: 'warning', icon: AlertTriangle, symbol: '⚠️' },
    rejected: { label: 'Rejected', variant: 'danger', icon: X, symbol: '✖️' },
    scheduled: { label: 'Scheduled', variant: 'primary', icon: Calendar, symbol: '✓' },
    draft: { label: 'Draft', variant: 'default', icon: FileText, symbol: '?' },
  }

  const FilterSelect = ({ label, value, options, onChange }) => (
    <div className="space-y-1">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-white focus:outline-none focus:border-teal-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )

  useEffect(() => {
    if (activeAssetId) {
      const current = assets.find((asset) => asset.id === activeAssetId)
      setActiveMediaIndex(0)
      setReplyVersion(current?.currentVersion || '')
      setReplyTimecode('')
    }
  }, [activeAssetId, assets])

  const updateAsset = (assetId, updater) => {
    setAssets((prev) => prev.map((asset) => asset.id === assetId ? updater(asset) : asset))
  }

  const toggleSelect = (assetId) => {
    setSelectedAssets((prev) => {
      const next = new Set(prev)
      if (next.has(assetId)) {
        next.delete(assetId)
      } else {
        next.add(assetId)
      }
      return next
    })
  }

  const filteredAssetIds = new Set(assets
    .filter((asset) => {
      const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCampaign = filters.campaign === 'all' || asset.campaign === filters.campaign
      const matchesPlatform = filters.platform === 'all' || asset.platform === filters.platform
      const matchesStatus = filters.status === 'all' || asset.status === filters.status
      const matchesFormat = filters.format === 'all' || asset.format === filters.format
      const matchesTag = filters.tag === 'all' || asset.tags.includes(filters.tag)
      return matchesSearch && matchesCampaign && matchesPlatform && matchesStatus && matchesFormat && matchesTag
    })
    .map((a) => a.id))

  const allFilteredSelected = filteredAssetIds.size > 0 && [...filteredAssetIds].every((id) => selectedAssets.has(id))

  const filteredAssets = assets.filter((asset) => filteredAssetIds.has(asset.id))

  const toggleSelectAll = () => {
    setSelectedAssets((prev) => {
      if (allFilteredSelected) {
        const next = new Set(prev)
        filteredAssetIds.forEach((id) => next.delete(id))
        return next
      }
      const next = new Set(prev)
      filteredAssetIds.forEach((id) => next.add(id))
      return next
    })
  }

  const campaigns = ['all', ...new Set(assets.map((asset) => asset.campaign))]
  const platforms = ['all', ...new Set(assets.map((asset) => asset.platform))]
  const statuses = ['all', ...new Set(assets.map((asset) => asset.status))]
  const formats = ['all', ...new Set(assets.map((asset) => asset.format))]
  const tags = ['all', ...new Set(assets.flatMap((asset) => asset.tags))]

  const activeAsset = assets.find((asset) => asset.id === activeAssetId)

  const handleSubmitForReview = (assetIds) => {
    setAssets((prev) => prev.map((asset) => {
      if (!assetIds.includes(asset.id)) return asset
      return {
        ...asset,
        status: 'in_review',
        timeline: [
          ...asset.timeline,
          { id: `t-${asset.timeline.length + 1}`, label: 'Submitted for review', at: new Date().toISOString(), tone: 'primary' }
        ]
      }
    }))
    addToast('Submitted for review', 'success')
  }

  const handleDuplicate = (asset) => {
    const newAsset = {
      ...asset,
      id: `${asset.id}-copy-${Date.now()}`,
      title: `${asset.title} (copy)`,
      status: 'draft',
      timeline: [
        ...asset.timeline,
        { id: `t-${asset.timeline.length + 1}`, label: 'Duplicated for edits', at: new Date().toISOString(), tone: 'info' }
      ],
      feedback: []
    }
    setAssets((prev) => [newAsset, ...prev])
    addToast('Asset duplicated', 'success')
  }

  const handleStatusChange = (assetId, status) => {
    updateAsset(assetId, (asset) => ({
      ...asset,
      status,
      timeline: [
        ...asset.timeline,
        { id: `t-${asset.timeline.length + 1}`, label: capitalizeFirst(status.replace('_', ' ')), at: new Date().toISOString(), tone: status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : status === 'scheduled' ? 'primary' : 'warning' }
      ]
    }))
    addToast(`Status updated to ${capitalizeFirst(status.replace('_', ' '))}`, 'success')
  }

  const handleMarkFeedback = (assetId, feedbackId, unread) => {
    updateAsset(assetId, (asset) => ({
      ...asset,
      feedback: asset.feedback.map((item) => item.id === feedbackId ? { ...item, unread } : item)
    }))
  }

  const handleAddFeedback = () => {
    if (!activeAsset || !replyMessage.trim()) return
    const newFeedback = {
      id: `f-${activeAsset.feedback.length + 1}-${Date.now()}`,
      author: 'You',
      channel: 'internal',
      message: replyMessage,
      timecode: replyTimecode || null,
      version: replyVersion || activeAsset.currentVersion,
      unread: false,
      createdAt: new Date().toISOString()
    }
    updateAsset(activeAsset.id, (asset) => ({
      ...asset,
      feedback: [newFeedback, ...asset.feedback]
    }))
    setReplyMessage('')
    setReplyTimecode('')
    addToast('Reply added to feedback thread', 'success')
  }

  const renderStatusBadge = (status) => {
    const meta = statusMeta[status] || statusMeta.draft
    const Icon = meta.icon
    return (
      <Badge variant={meta.variant}>
        <Icon className="w-3 h-3 mr-1" />
        {meta.symbol}
        <span className="ml-1">{meta.label}</span>
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Asset Library</h2>
          <p className="text-sm text-[var(--text-secondary)]">Search, filter, and review creative assets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedAssets(new Set())}>
            <Trash2 className="w-4 h-4" />
            Clear selections
          </Button>
          <Button size="sm" onClick={() => handleSubmitForReview(Array.from(selectedAssets))} disabled={selectedAssets.size === 0}>
            <Upload className="w-4 h-4" />
            Submit selected for review
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, campaign, or tags"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
        <FilterSelect
          label="Campaign"
          value={filters.campaign}
          onChange={(value) => setFilters((prev) => ({ ...prev, campaign: value }))}
          options={campaigns.map((c) => ({ value: c, label: c === 'all' ? 'All campaigns' : c }))}
        />
        <FilterSelect
          label="Platform"
          value={filters.platform}
          onChange={(value) => setFilters((prev) => ({ ...prev, platform: value }))}
          options={platforms.map((c) => ({ value: c, label: c === 'all' ? 'All platforms' : c }))}
        />
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
          options={statuses.map((c) => ({ value: c, label: c === 'all' ? 'All status' : capitalizeFirst(c.replace('_', ' ')) }))}
        />
        <FilterSelect
          label="Format"
          value={filters.format}
          onChange={(value) => setFilters((prev) => ({ ...prev, format: value }))}
          options={formats.map((c) => ({ value: c, label: c === 'all' ? 'All formats' : c }))}
        />
        <FilterSelect
          label="Tag"
          value={filters.tag}
          onChange={(value) => setFilters((prev) => ({ ...prev, tag: value }))}
          options={tags.map((c) => ({ value: c, label: c === 'all' ? 'All tags' : `#${c}` }))}
        />
      </div>

      <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={allFilteredSelected}
            onChange={toggleSelectAll}
            className="w-5 h-5 rounded border-[var(--border-color)] bg-[var(--bg-card)] text-teal-500 focus:ring-teal-500"
          />
          <div>
            <p className="text-sm font-semibold">{selectedAssets.size} selected</p>
            <p className="text-xs text-[var(--text-muted)]">Bulk-select assets for actions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary">{filteredAssets.length} results</Badge>
          <Badge variant="purple">{tags.length - 1} tags</Badge>
        </div>
      </div>

      {filteredAssets.length === 0 ? (
        <Card className="p-10 text-center">
          <FolderKanban className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
          <h3 className="text-lg font-semibold">No assets match these filters</h3>
          <p className="text-[var(--text-secondary)]">Adjust filters to see more results.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <div className="relative">
                <div
                  className="h-44 bg-gradient-to-br rounded-t-xl"
                  style={{ backgroundImage: asset.thumbnail }}
                />
                <div className="absolute top-3 left-3">
                  <input
                    type="checkbox"
                    checked={selectedAssets.has(asset.id)}
                    onChange={() => toggleSelect(asset.id)}
                    className="w-5 h-5 rounded border-[var(--border-color)] bg-[var(--bg-card)] text-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="absolute top-3 right-3">
                  {renderStatusBadge(asset.status)}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{asset.title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{asset.campaign}</p>
                  </div>
                  <Badge variant="default">{asset.currentVersion}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">{asset.platform}</Badge>
                  <Badge variant="blue">{asset.format}</Badge>
                  {asset.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="default">#{tag}</Badge>
                  ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{asset.caption}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[var(--text-muted)]">
                    Scheduled: {formatDate(asset.scheduledFor)} at {formatTime(asset.scheduledFor)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setActiveAssetId(asset.id)}>
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDuplicate(asset)}>
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </Button>
                    <Button size="sm" onClick={() => handleSubmitForReview([asset.id])}>
                      <Upload className="w-4 h-4" />
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!activeAsset}
        onClose={() => setActiveAssetId(null)}
        title={activeAsset?.title}
        subtitle={activeAsset ? `${activeAsset.platform} • ${activeAsset.format}` : ''}
        size="full"
        className="lg:max-w-5xl"
      >
        {activeAsset && (
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)]">
                <div
                  className="aspect-video flex items-center justify-center text-center text-sm text-[var(--text-secondary)]"
                  style={{ backgroundImage: activeAsset.media[activeMediaIndex]?.backdrop }}
                >
                  <div className="p-6">
                    <p className="text-lg font-semibold mb-2">{activeAsset.media[activeMediaIndex]?.label}</p>
                    <p className="text-sm text-[var(--text-muted)]">{activeAsset.media[activeMediaIndex]?.note}</p>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex justify-between p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveMediaIndex((prev) => (prev === 0 ? activeAsset.media.length - 1 : prev - 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveMediaIndex((prev) => (prev === activeAsset.media.length - 1 ? 0 : prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {activeAsset.media.map((media, index) => (
                  <button
                    key={media.id}
                    onClick={() => setActiveMediaIndex(index)}
                    className={cn(
                      'min-w-[120px] p-3 rounded-lg border text-left',
                      activeMediaIndex === index
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
                    )}
                  >
                    <p className="text-sm font-semibold">{media.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">{media.note}</p>
                  </button>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-teal-400" />
                    Asset metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-[var(--text-secondary)]">{activeAsset.caption}</p>
                  <div className="flex flex-wrap gap-2">
                    {activeAsset.tags.map((tag) => (
                      <Badge key={tag} variant="default">#{tag}</Badge>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm text-[var(--text-secondary)]">
                    <div>
                      <p className="text-[var(--text-muted)]">Collaborators</p>
                      <p>{activeAsset.collaborators.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">Location</p>
                      <p>{activeAsset.location}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">Partnership</p>
                      <p>{activeAsset.partnership}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)]">Scheduled</p>
                      <p>{formatDate(activeAsset.scheduledFor)} at {formatTime(activeAsset.scheduledFor)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {renderStatusBadge(activeAsset.status)}
                    <span>Review actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleStatusChange(activeAsset.id, 'approved')}>
                      <Check className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleStatusChange(activeAsset.id, 'changes_requested')}>
                      <AlertTriangle className="w-4 h-4" />
                      Changes requested
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleStatusChange(activeAsset.id, 'rejected')}>
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => handleStatusChange(activeAsset.id, 'scheduled')}>
                      <Calendar className="w-4 h-4" />
                      Submit for scheduling
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeAsset.timeline.map((item) => {
                    const tone = item.tone
                    const toneClasses = tone === 'success'
                      ? 'bg-green-500/15 text-green-300 border-green-500/30'
                      : tone === 'warning'
                        ? 'bg-orange-500/15 text-orange-300 border-orange-500/30'
                        : tone === 'danger'
                          ? 'bg-red-500/15 text-red-300 border-red-500/30'
                          : tone === 'primary'
                            ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]'
                    const Icon = tone === 'success' ? Check : tone === 'warning' ? AlertTriangle : tone === 'danger' ? X : Clock
                    return (
                      <div key={item.id} className="flex gap-3 items-start">
                        <div className={cn('p-2 rounded-lg border', toneClasses)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-[var(--text-muted)]">{formatRelativeTime(item.at)}</p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feedback thread</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {activeAsset.feedback.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          'p-3 rounded-lg border',
                          item.unread
                            ? 'border-teal-500/40 bg-teal-500/10'
                            : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={item.channel === 'client' ? 'purple' : 'blue'}>
                                {item.channel === 'client' ? 'Client' : 'Internal'}
                              </Badge>
                              {item.unread && <Badge variant="primary">Unread</Badge>}
                            </div>
                            <p className="text-sm font-semibold">{item.author}</p>
                            <p className="text-sm text-white">{item.message}</p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {item.version && `Version ${item.version}`} {item.timecode && `• @ ${item.timecode}`} • {formatRelativeTime(item.createdAt)}
                            </p>
                          </div>
                          <button
                            className="text-xs text-teal-300 hover:text-teal-200"
                            onClick={() => handleMarkFeedback(activeAsset.id, item.id, !item.unread)}
                          >
                            Mark as {item.unread ? 'read' : 'unread'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Reply with notes or tag a timecode..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Version (e.g., v2)"
                        value={replyVersion}
                        onChange={(e) => setReplyVersion(e.target.value)}
                      />
                      <Input
                        placeholder="Timecode (00:12)"
                        value={replyTimecode}
                        onChange={(e) => setReplyTimecode(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm" onClick={handleAddFeedback}>
                        <Upload className="w-4 h-4" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ============================================
// PROJECTS PANEL (Deliverables Tracker)
// ============================================
function ProjectsPanel() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [deliverables, setDeliverables] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedDeliverable, setSelectedDeliverable] = useState(null)
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadDeliverables()
  }, [])

  const loadDeliverables = async () => {
    setLoading(true)
    try {
      const data = await api.getCampaigns({})
      // Extract all deliverables from all campaigns
      const allDeliverables = []
      ;(data.campaigns || []).forEach(campaign => {
        if (campaign.deliverables) {
          campaign.deliverables.forEach(d => {
            allDeliverables.push({
              ...d,
              campaign_id: campaign.id,
              campaign_title: campaign.title,
              campaign_brand: campaign.brand_name
            })
          })
        }
      })
      // Sort by due date
      allDeliverables.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      setDeliverables(allDeliverables)
    } catch (error) {
      // Demo data
      setDeliverables([
        { id: 1, title: 'Instagram Reel', status: 'pending', due_date: '2024-07-10', campaign_title: 'Summer Fashion', campaign_brand: 'StyleCo' },
        { id: 2, title: 'TikTok Video', status: 'pending', due_date: '2024-07-12', campaign_title: 'Summer Fashion', campaign_brand: 'StyleCo' },
        { id: 3, title: 'YouTube Review', status: 'submitted', due_date: '2024-07-08', campaign_title: 'Tech Review', campaign_brand: 'TechNova' },
        { id: 4, title: 'Twitter Thread', status: 'approved', due_date: '2024-07-05', campaign_title: 'Tech Review', campaign_brand: 'TechNova' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!submissionUrl.trim()) {
      addToast('Please enter a URL', 'error')
      return
    }
    setSubmitting(true)
    try {
      await api.submitDeliverable(selectedDeliverable.campaign_id, selectedDeliverable.id, submissionUrl)
      addToast('Deliverable submitted!', 'success')
      setShowSubmitModal(false)
      setSubmissionUrl('')
      loadDeliverables()
    } catch (error) {
      addToast('Submitted successfully!', 'success') // Demo mode
      setShowSubmitModal(false)
      setSubmissionUrl('')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': case 'completed': return 'text-green-400 bg-green-500/20'
      case 'submitted': return 'text-blue-400 bg-blue-500/20'
      case 'pending': return 'text-orange-400 bg-orange-500/20'
      case 'overdue': return 'text-red-400 bg-red-500/20'
      default: return 'text-[var(--text-muted)] bg-[var(--bg-card)]'
    }
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  const filteredDeliverables = deliverables.filter(d => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'overdue') return isOverdue(d.due_date) && d.status === 'pending'
    return d.status === statusFilter
  })

  const stats = {
    total: deliverables.length,
    pending: deliverables.filter(d => d.status === 'pending').length,
    submitted: deliverables.filter(d => d.status === 'submitted').length,
    approved: deliverables.filter(d => d.status === 'approved' || d.status === 'completed').length,
    overdue: deliverables.filter(d => isOverdue(d.due_date) && d.status === 'pending').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Projects</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Track all your deliverables across campaigns
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-[var(--text-secondary)]">Total</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-[var(--text-secondary)]">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.submitted}</p>
              <p className="text-xs text-[var(--text-secondary)]">Submitted</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-xs text-[var(--text-secondary)]">Approved</p>
            </div>
          </div>
        </Card>
        {stats.overdue > 0 && (
          <Card className="p-4 border-red-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
                <p className="text-xs text-red-400">Overdue</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'pending', label: 'Pending' },
          { id: 'submitted', label: 'Submitted' },
          { id: 'approved', label: 'Approved' },
          { id: 'overdue', label: 'Overdue' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              statusFilter === filter.id
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-white'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Deliverables List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
        </div>
      ) : filteredDeliverables.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderKanban className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No deliverables found</h3>
          <p className="text-[var(--text-secondary)]">
            Your campaign deliverables will appear here
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDeliverables.map((deliverable) => {
            const overdue = isOverdue(deliverable.due_date) && deliverable.status === 'pending'
            return (
              <Card
                key={deliverable.id}
                className={cn(
                  "p-4",
                  overdue && "border-red-500/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      getStatusColor(overdue ? 'overdue' : deliverable.status)
                    )}>
                      {deliverable.status === 'approved' || deliverable.status === 'completed' ? (
                        <Check className="w-5 h-5" />
                      ) : deliverable.status === 'submitted' ? (
                        <Upload className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{deliverable.title}</p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {deliverable.campaign_title} • {deliverable.campaign_brand}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={cn(
                        "text-sm",
                        overdue ? "text-red-400" : "text-[var(--text-secondary)]"
                      )}>
                        {overdue ? 'Overdue' : 'Due'}: {formatDate(deliverable.due_date)}
                      </p>
                      <Badge variant={
                        deliverable.status === 'approved' ? 'success' :
                        deliverable.status === 'submitted' ? 'blue' :
                        overdue ? 'error' : 'warning'
                      }>
                        {overdue ? 'Overdue' : capitalizeFirst(deliverable.status)}
                      </Badge>
                    </div>
                    {deliverable.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedDeliverable(deliverable)
                          setShowSubmitModal(true)
                        }}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Submit
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Deliverable"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
            <p className="text-sm text-[var(--text-secondary)] mb-1">Deliverable</p>
            <p className="font-medium">{selectedDeliverable?.title}</p>
            <p className="text-sm text-[var(--text-muted)]">{selectedDeliverable?.campaign_title}</p>
          </div>

          <Input
            label="Content URL"
            placeholder="https://instagram.com/p/..."
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
            icon={<Link2 className="w-4 h-4" />}
          />

          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              loading={submitting}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ============================================
// PAYMENTS PANEL
// ============================================
function PaymentsPanel() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stripeConnected, setStripeConnected] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState([])

  useEffect(() => {
    loadPaymentSettings()
  }, [])

  const loadPaymentSettings = async () => {
    setLoading(true)
    try {
      const stripeStatus = localStorage.getItem('stripeConnected')
      setStripeConnected(stripeStatus === 'true')

      setPaymentHistory([
        { id: 1, type: 'received', amount: 2500, currency: 'USD', method: 'stripe', campaign: 'Summer Fashion', date: '2024-01-15', status: 'completed' },
        { id: 2, type: 'received', amount: 1200, currency: 'USD', method: 'stripe', campaign: 'Tech Review', date: '2024-01-10', status: 'completed' },
        { id: 3, type: 'pending', amount: 5000, currency: 'USD', method: 'stripe', campaign: 'Fitness Partnership', date: '2024-01-20', status: 'pending' },
      ])
    } catch (error) {
      console.error('Failed to load payment settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectStripe = () => {
    addToast('Stripe Connect integration coming soon!', 'info')
  }

  const totalEarned = paymentHistory
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingAmount = paymentHistory
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Payments</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Manage your payment methods and view transaction history
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Earned</p>
              <p className="text-3xl font-bold text-green-400">${formatNumber(totalEarned)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Pending</p>
              <p className="text-3xl font-bold text-orange-400">${formatNumber(pendingAmount)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">This Month</p>
              <p className="text-3xl font-bold">${formatNumber(totalEarned)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-400">S</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Stripe Connect</p>
                      <Badge variant={stripeConnected ? 'success' : 'default'}>
                        {stripeConnected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Receive payments to your bank account
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={handleConnectStripe}>
                  {stripeConnected ? 'Manage' : 'Connect'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <p className="text-center text-[var(--text-secondary)] py-8">
                  No transactions yet
                </p>
              ) : (
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center',
                          payment.status === 'completed' ? 'bg-green-500/20' : 'bg-orange-500/20'
                        )}>
                          <DollarSign className={cn(
                            'w-5 h-5',
                            payment.status === 'completed' ? 'text-green-400' : 'text-orange-400'
                          )} />
                        </div>
                        <div>
                          <p className="font-medium">{payment.campaign}</p>
                          <p className="text-sm text-[var(--text-muted)]">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          'font-semibold',
                          payment.status === 'completed' ? 'text-green-400' : 'text-orange-400'
                        )}>
                          +${formatNumber(payment.amount)}
                        </p>
                        <Badge variant={payment.status === 'completed' ? 'success' : 'warning'}>
                          {capitalizeFirst(payment.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5 bg-gradient-to-br from-teal-500/10 to-purple-500/10 border-teal-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="font-semibold">Platform Fee</h3>
                <p className="text-2xl font-bold text-teal-400">8%</p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              A small fee is deducted from each payment to support the platform.
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Secure Payments</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  All transactions are processed securely through Stripe.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MANAGEMENT PANEL (Teams + Analytics)
// ============================================
function ManagementPanel() {
  const { token, user } = useAuth()
  const { addToast } = useToast()
  const [activeSection, setActiveSection] = useState('teams') // 'teams' or 'analytics'
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [newTeam, setNewTeam] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTeams(data.teams || [])
      }
    } catch (error) {
      // Demo data
      setTeams([
        { id: 1, name: 'Marketing Team', member_count: 5, role: 'owner' },
        { id: 2, name: 'Content Creators', member_count: 12, role: 'member' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) {
      addToast('Team name is required', 'error')
      return
    }
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTeam)
      })
      if (response.ok) {
        addToast('Team created successfully!', 'success')
        setShowCreateModal(false)
        setNewTeam({ name: '', description: '' })
        fetchTeams()
      }
    } catch (error) {
      addToast('Team created!', 'success') // Demo mode
      setShowCreateModal(false)
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      addToast('Email is required', 'error')
      return
    }
    addToast(`Invitation sent to ${inviteEmail}!`, 'success')
    setShowInviteModal(false)
    setInviteEmail('')
  }

  // Analytics data
  const analyticsData = {
    monthlyEarnings: [
      { month: 'Jan', amount: 2500 },
      { month: 'Feb', amount: 3200 },
      { month: 'Mar', amount: 2800 },
      { month: 'Apr', amount: 4100 },
      { month: 'May', amount: 3800 },
      { month: 'Jun', amount: 5200 },
    ],
    campaignCompletion: 85,
    platformBreakdown: [
      { platform: 'Instagram', percentage: 45 },
      { platform: 'TikTok', percentage: 30 },
      { platform: 'YouTube', percentage: 15 },
      { platform: 'Twitter', percentage: 10 },
    ]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Management</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage your team and view analytics
          </p>
        </div>

        {/* Section Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('teams')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeSection === 'teams'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-white'
            )}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Teams
          </button>
          <button
            onClick={() => setActiveSection('analytics')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeSection === 'analytics'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-white'
            )}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Analytics
          </button>
        </div>
      </div>

      {activeSection === 'teams' ? (
        // Teams Section
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
            </div>
          ) : teams.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Create a team to collaborate with others
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {teams.map((team) => (
                <Card key={team.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{team.name}</p>
                          {team.role === 'owner' && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {team.member_count} members
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedTeam(team)
                          setShowInviteModal(true)
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Invite
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Analytics Section
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[var(--text-secondary)]">Total Earnings</p>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  12%
                </div>
              </div>
              <p className="text-3xl font-bold">$21,600</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Last 6 months</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[var(--text-secondary)]">Campaign Completion</p>
                <Badge variant="success">85%</Badge>
              </div>
              <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                  style={{ width: '85%' }}
                />
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2">17 of 20 campaigns</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[var(--text-secondary)]">Avg. per Campaign</p>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  8%
                </div>
              </div>
              <p className="text-3xl font-bold">$1,270</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Based on 17 campaigns</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Earnings Chart */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Monthly Earnings</h3>
              <div className="h-48 flex items-end gap-2">
                {analyticsData.monthlyEarnings.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-teal-500 to-cyan-500 rounded-t-lg"
                      style={{ height: `${(data.amount / 5200) * 100}%` }}
                    />
                    <span className="text-xs text-[var(--text-muted)]">{data.month}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Platform Breakdown */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Platform Breakdown</h3>
              <div className="space-y-4">
                {analyticsData.platformBreakdown.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.platform}</span>
                      <span className="text-sm text-[var(--text-muted)]">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          i === 0 ? "bg-pink-500" :
                          i === 1 ? "bg-cyan-500" :
                          i === 2 ? "bg-red-500" : "bg-blue-500"
                        )}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Team"
      >
        <div className="space-y-4">
          <Input
            label="Team Name"
            placeholder="e.g., Marketing Team"
            value={newTeam.name}
            onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
          />
          <Textarea
            label="Description (optional)"
            placeholder="What is this team for?"
            value={newTeam.description}
            onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleCreateTeam}>
              Create Team
            </Button>
          </div>
        </div>
      </Modal>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title={`Invite to ${selectedTeam?.name}`}
      >
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleInvite}>
              <Mail className="w-4 h-4 mr-2" />
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ============================================
// MAIN WORKSPACE COMPONENT
// ============================================
export function Workspace() {
  const { tab } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(tab || 'campaigns')

  useEffect(() => {
    if (tab && tabs.find(t => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [tab])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    navigate(`/dashboard/workspace/${tabId}`, { replace: true })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'campaigns':
        return <CampaignsPanel />
      case 'library':
        return <LibraryPanel />
      case 'projects':
        return <ProjectsPanel />
      case 'payments':
        return <PaymentsPanel />
      case 'management':
        return <ManagementPanel />
      default:
        return <CampaignsPanel />
    }
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Workspace</h1>
        <p className="text-[var(--text-secondary)]">
          Manage your campaigns, projects, payments, and team
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-[var(--border-color)]">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-[2px]',
                activeTab === t.id
                  ? 'text-teal-400 border-teal-400'
                  : 'text-[var(--text-secondary)] border-transparent hover:text-white hover:border-[var(--border-color)]'
              )}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </DashboardLayout>
  )
}
