import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Image,
  Video,
  FileText,
  LayoutGrid,
  CalendarDays,
  Eye,
  MessageSquare,
  Upload,
  Send,
  Play,
  Pause,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit3,
  Filter,
  Clock,
  Calendar
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Textarea, Modal, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import api from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'

// Tab configuration for Studio
const studioTabs = [
  { id: 'library', label: 'Library', icon: LayoutGrid },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
  { id: 'review', label: 'Review', icon: Eye },
]

const platforms = ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin', 'bluesky', 'threads']
const formats = ['image', 'video', 'story', 'reel', 'carousel', 'text', 'audio']
const statuses = ['draft', 'in_review', 'approved', 'changes_requested', 'scheduled', 'live']

export function Studio() {
  const { tab } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [activeTab, setActiveTab] = useState(tab || 'library')
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [newAsset, setNewAsset] = useState({
    name: '',
    description: '',
    platform: 'instagram',
    format: 'image',
  })

  useEffect(() => {
    if (tab && studioTabs.find(t => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [tab])

  useEffect(() => {
    loadAssets()
  }, [statusFilter, platformFilter])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    navigate(`/dashboard/studio/${tabId}`, { replace: true })
  }

  const loadAssets = async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (platformFilter !== 'all') params.platform = platformFilter

      const data = await api.getAssets(params)
      setAssets(data.assets || [])
    } catch (error) {
      // Demo data
      setAssets(getDemoAssets())
    } finally {
      setLoading(false)
    }
  }

  const getDemoAssets = () => [
    {
      id: 1,
      name: 'Summer Collection Reel',
      description: 'Product showcase for summer collection',
      platform: 'instagram',
      format: 'reel',
      status: 'approved',
      created_at: '2024-06-01',
      version_count: 3,
      pending_feedback_count: 0,
    },
    {
      id: 2,
      name: 'Tech Review Video',
      description: 'Unboxing and first impressions',
      platform: 'youtube',
      format: 'video',
      status: 'in_review',
      created_at: '2024-06-05',
      version_count: 2,
      pending_feedback_count: 3,
    },
    {
      id: 3,
      name: 'Product Carousel',
      description: 'Multi-image post for new products',
      platform: 'instagram',
      format: 'carousel',
      status: 'draft',
      created_at: '2024-06-08',
      version_count: 1,
      pending_feedback_count: 0,
    },
    {
      id: 4,
      name: 'Quick Tips Thread',
      description: 'Educational thread about product usage',
      platform: 'twitter',
      format: 'text',
      status: 'scheduled',
      created_at: '2024-06-10',
      version_count: 1,
      pending_feedback_count: 0,
      scheduled_at: '2024-06-15T10:00:00Z',
    },
    {
      id: 5,
      name: 'Behind the Scenes',
      description: 'BTS story content',
      platform: 'tiktok',
      format: 'video',
      status: 'changes_requested',
      created_at: '2024-06-03',
      version_count: 2,
      pending_feedback_count: 2,
    },
  ]

  const handleCreateAsset = async () => {
    if (!newAsset.name.trim()) {
      addToast('Asset name is required', 'error')
      return
    }

    try {
      await api.createAsset(newAsset)
      addToast('Asset created successfully!', 'success')
      setShowCreateModal(false)
      setNewAsset({ name: '', description: '', platform: 'instagram', format: 'image' })
      loadAssets()
    } catch (error) {
      addToast('Asset created!', 'success') // Demo mode
      setShowCreateModal(false)
    }
  }

  const handleSubmitForReview = async (assetId) => {
    try {
      await api.submitAssetForReview(assetId, 1)
      addToast('Submitted for review!', 'success')
      loadAssets()
    } catch (error) {
      addToast('Submitted for review!', 'success') // Demo
      loadAssets()
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      draft: 'default',
      in_review: 'warning',
      approved: 'success',
      changes_requested: 'error',
      scheduled: 'blue',
      live: 'success'
    }
    const labels = {
      draft: 'Draft',
      in_review: 'In Review',
      approved: 'Approved',
      changes_requested: 'Changes Requested',
      scheduled: 'Scheduled',
      live: 'Live'
    }
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>
  }

  const getPlatformIcon = (platform) => {
    const colors = {
      instagram: 'text-pink-400',
      tiktok: 'text-cyan-400',
      youtube: 'text-red-400',
      twitter: 'text-blue-400',
      facebook: 'text-blue-500',
      linkedin: 'text-blue-600',
      bluesky: 'text-sky-400',
      threads: 'text-gray-400'
    }
    return <span className={cn('text-sm capitalize', colors[platform] || 'text-white')}>{platform}</span>
  }

  const getFormatIcon = (format) => {
    switch (format) {
      case 'video':
      case 'reel':
        return <Video className="w-4 h-4" />
      case 'image':
      case 'carousel':
        return <Image className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const filteredAssets = assets.filter(asset => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return asset.name?.toLowerCase().includes(query) || asset.description?.toLowerCase().includes(query)
  })

  // Filter assets based on active section
  const sectionAssets = {
    library: filteredAssets,
    schedule: filteredAssets.filter(a => ['approved', 'scheduled', 'live'].includes(a.status)),
    review: filteredAssets.filter(a => ['in_review', 'changes_requested'].includes(a.status)),
  }

  const stats = {
    total: assets.length,
    draft: assets.filter(a => a.status === 'draft').length,
    inReview: assets.filter(a => a.status === 'in_review').length,
    approved: assets.filter(a => a.status === 'approved').length,
    scheduled: assets.filter(a => a.status === 'scheduled').length,
    live: assets.filter(a => a.status === 'live').length,
    changesRequested: assets.filter(a => a.status === 'changes_requested').length,
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Studio</h1>
          <p className="text-[var(--text-secondary)]">
            Create, manage, and schedule your content assets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-500"
            />
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Asset
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <p className="text-lg font-bold">{stats.total}</p>
              <p className="text-xs text-[var(--text-secondary)]">Total</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-bold">{stats.draft}</p>
              <p className="text-xs text-[var(--text-secondary)]">Drafts</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Eye className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-lg font-bold">{stats.inReview}</p>
              <p className="text-xs text-[var(--text-secondary)]">In Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-lg font-bold">{stats.approved}</p>
              <p className="text-xs text-[var(--text-secondary)]">Approved</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold">{stats.scheduled}</p>
              <p className="text-xs text-[var(--text-secondary)]">Scheduled</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-lg font-bold">{stats.changesRequested}</p>
              <p className="text-xs text-[var(--text-secondary)]">Needs Work</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-[var(--border-color)]">
        {studioTabs.map((t) => {
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
              {t.id === 'review' && stats.inReview + stats.changesRequested > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-orange-500/20 text-orange-400">
                  {stats.inReview + stats.changesRequested}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-white text-sm focus:outline-none focus:border-teal-500"
        >
          <option value="all">All Statuses</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
          ))}
        </select>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-white text-sm focus:outline-none focus:border-teal-500"
        >
          <option value="all">All Platforms</option>
          {platforms.map(p => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Content based on active tab */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
        </div>
      ) : sectionAssets[activeTab]?.length === 0 ? (
        <Card className="p-12 text-center">
          <Image className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {activeTab === 'library' && 'No assets yet'}
            {activeTab === 'schedule' && 'Nothing scheduled'}
            {activeTab === 'review' && 'No pending reviews'}
          </h3>
          <p className="text-[var(--text-secondary)] mb-4">
            {activeTab === 'library' && 'Create your first asset to get started'}
            {activeTab === 'schedule' && 'Approved assets ready for scheduling will appear here'}
            {activeTab === 'review' && 'Assets waiting for review will appear here'}
          </p>
          {activeTab === 'library' && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Asset
            </Button>
          )}
        </Card>
      ) : activeTab === 'schedule' ? (
        // Schedule View
        <div className="space-y-4">
          {sectionAssets.schedule.map((asset) => (
            <Card key={asset.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    asset.status === 'live' ? 'bg-green-500/20' : 'bg-blue-500/20'
                  )}>
                    {asset.status === 'live' ? (
                      <Play className="w-5 h-5 text-green-400" />
                    ) : asset.status === 'scheduled' ? (
                      <CalendarDays className="w-5 h-5 text-blue-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{asset.name}</p>
                      {getStatusBadge(asset.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      {getPlatformIcon(asset.platform)}
                      <span>•</span>
                      <span className="capitalize">{asset.format}</span>
                      {asset.scheduled_at && (
                        <>
                          <span>•</span>
                          <span>Scheduled: {formatDate(asset.scheduled_at)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {asset.status === 'approved' && (
                    <Button size="sm" variant="secondary">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                  )}
                  {asset.status === 'scheduled' && (
                    <Button size="sm" variant="ghost">
                      <Pause className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : activeTab === 'review' ? (
        // Review View
        <div className="space-y-4">
          {sectionAssets.review.map((asset) => (
            <Card key={asset.id} className={cn(
              "p-4",
              asset.status === 'changes_requested' && "border-red-500/30"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    asset.status === 'changes_requested' ? 'bg-red-500/20' : 'bg-orange-500/20'
                  )}>
                    {asset.status === 'changes_requested' ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-orange-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{asset.name}</p>
                      {getStatusBadge(asset.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      {getPlatformIcon(asset.platform)}
                      <span>•</span>
                      <span className="capitalize">{asset.format}</span>
                      <span>•</span>
                      <span>v{asset.version_count}</span>
                      {asset.pending_feedback_count > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-orange-400">
                            {asset.pending_feedback_count} feedback items
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => {
                    setSelectedAsset(asset)
                    setShowDetailModal(true)
                  }}>
                    <MessageSquare className="w-4 h-4 mr-1" />
                    View Feedback
                  </Button>
                  {asset.status === 'changes_requested' && (
                    <Button size="sm">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload New Version
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Library View - Grid layout
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionAssets.library.map((asset) => (
            <Card
              key={asset.id}
              className="p-4 hover:border-teal-500/30 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedAsset(asset)
                setShowDetailModal(true)
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  asset.format === 'video' || asset.format === 'reel' ? 'bg-purple-500/20' :
                  asset.format === 'image' || asset.format === 'carousel' ? 'bg-pink-500/20' :
                  'bg-blue-500/20'
                )}>
                  {getFormatIcon(asset.format)}
                </div>
                {getStatusBadge(asset.status)}
              </div>
              <h3 className="font-semibold mb-1">{asset.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                {asset.description || 'No description'}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(asset.platform)}
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="text-[var(--text-muted)] capitalize">{asset.format}</span>
                </div>
                <span className="text-[var(--text-muted)]">v{asset.version_count}</span>
              </div>
              {asset.status === 'draft' && (
                <Button
                  size="sm"
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSubmitForReview(asset.id)
                  }}
                >
                  <Send className="w-4 h-4 mr-1" />
                  Submit for Review
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Asset Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Asset"
      >
        <div className="space-y-4">
          <Input
            label="Asset Name"
            placeholder="e.g., Summer Campaign Reel"
            value={newAsset.name}
            onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
          />
          <Textarea
            label="Description"
            placeholder="Describe this asset..."
            value={newAsset.description}
            onChange={(e) => setNewAsset(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Platform
              </label>
              <select
                value={newAsset.platform}
                onChange={(e) => setNewAsset(prev => ({ ...prev, platform: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-white focus:outline-none focus:border-teal-500"
              >
                {platforms.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Format
              </label>
              <select
                value={newAsset.format}
                onChange={(e) => setNewAsset(prev => ({ ...prev, format: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-white focus:outline-none focus:border-teal-500"
              >
                {formats.map(f => (
                  <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleCreateAsset}>
              Create Asset
            </Button>
          </div>
        </div>
      </Modal>

      {/* Asset Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedAsset?.name}
        size="lg"
      >
        {selectedAsset && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {getStatusBadge(selectedAsset.status)}
              <Badge variant="outline" className="capitalize">{selectedAsset.platform}</Badge>
              <Badge variant="outline" className="capitalize">{selectedAsset.format}</Badge>
            </div>

            <p className="text-[var(--text-secondary)]">
              {selectedAsset.description || 'No description provided'}
            </p>

            <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
              <h4 className="font-medium mb-2">Version History</h4>
              <p className="text-sm text-[var(--text-muted)]">
                Current version: v{selectedAsset.version_count}
              </p>
            </div>

            {selectedAsset.pending_feedback_count > 0 && (
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-orange-400" />
                  <h4 className="font-medium text-orange-400">
                    {selectedAsset.pending_feedback_count} Pending Feedback Items
                  </h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Review and address feedback before resubmitting.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {selectedAsset.status === 'draft' && (
                <Button className="flex-1" onClick={() => handleSubmitForReview(selectedAsset.id)}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Review
                </Button>
              )}
              {selectedAsset.status === 'approved' && (
                <Button className="flex-1">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              )}
              {selectedAsset.status === 'changes_requested' && (
                <Button className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Version
                </Button>
              )}
              <Button variant="ghost" className="flex-1" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
