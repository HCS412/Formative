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
  Calendar,
  CheckSquare,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Textarea, Modal, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import api from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'
import { TaskBoard } from '@/components/studio/TaskBoard'
import { TaskDetailModal } from '@/components/studio/TaskDetailModal'
import { UnifiedCalendar } from '@/components/studio/UnifiedCalendar'
import { CreateAssetModal } from '@/components/studio/CreateAssetModal'
import { AssetDetailModal } from '@/components/studio/AssetDetailModal'

const studioTabs = [
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'library', label: 'Library', icon: LayoutGrid },
  { id: 'schedule', label: 'Asset Schedule', icon: CalendarDays },
  { id: 'review', label: 'Review', icon: Eye },
]

const platforms = ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin', 'bluesky', 'threads']
const formats = ['image', 'video', 'story', 'reel', 'carousel', 'text', 'audio']
const statuses = ['draft', 'in_review', 'approved', 'changes_requested', 'scheduled', 'live']

export function Studio() {
  const { tab } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [activeTab, setActiveTab] = useState(tab || 'tasks')
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)

  useEffect(() => {
    if (tab && studioTabs.find(t => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [tab])

  useEffect(() => {
    if (['library', 'schedule', 'review'].includes(activeTab)) {
      loadAssets()
    }
  }, [statusFilter, platformFilter, activeTab])

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
      setAssets(getDemoAssets())
    } finally {
      setLoading(false)
    }
  }

  const getDemoAssets = () => [
    { id: 1, name: 'Summer Collection Reel', description: 'Product showcase for summer collection', platform: 'instagram', format: 'reel', status: 'approved', created_at: '2024-06-01', version_count: 3, pending_feedback_count: 0 },
    { id: 2, name: 'Tech Review Video', description: 'Unboxing and first impressions', platform: 'youtube', format: 'video', status: 'in_review', created_at: '2024-06-05', version_count: 2, pending_feedback_count: 3 },
    { id: 3, name: 'Product Carousel', description: 'Multi-image post for new products', platform: 'instagram', format: 'carousel', status: 'draft', created_at: '2024-06-08', version_count: 1, pending_feedback_count: 0 },
    { id: 4, name: 'Quick Tips Thread', description: 'Educational thread about product usage', platform: 'twitter', format: 'text', status: 'scheduled', created_at: '2024-06-10', version_count: 1, pending_feedback_count: 0, scheduled_at: '2024-06-15T10:00:00Z' },
    { id: 5, name: 'Behind the Scenes', description: 'BTS story content', platform: 'tiktok', format: 'video', status: 'changes_requested', created_at: '2024-06-03', version_count: 2, pending_feedback_count: 2 },
  ]

  const handleSubmitForReview = async (assetId) => {
    try {
      await api.submitAssetForReview(assetId, 1)
      addToast('Submitted for review!', 'success')
      loadAssets()
    } catch (error) {
      addToast('Submitted for review!', 'success')
      loadAssets()
    }
  }

  const getStatusBadge = (status) => {
    const config = {
      draft: { variant: 'default', label: 'Draft' },
      in_review: { variant: 'warning', label: 'In Review' },
      approved: { variant: 'success', label: 'Approved' },
      changes_requested: { variant: 'danger', label: 'Changes Requested' },
      scheduled: { variant: 'info', label: 'Scheduled' },
      live: { variant: 'success', label: 'Live' },
    }
    const c = config[status] || config.draft
    return <Badge variant={c.variant}>{c.label}</Badge>
  }

  const getPlatformIcon = (platform) => {
    const colors = {
      instagram: 'text-pink-400',
      tiktok: 'text-cyan-400',
      youtube: 'text-red-400',
      twitter: 'text-sky-400',
      facebook: 'text-blue-500',
      linkedin: 'text-blue-600',
      bluesky: 'text-sky-400',
      threads: 'text-gray-400',
    }
    return <span className={cn('text-sm capitalize font-medium', colors[platform])}>{platform}</span>
  }

  const getFormatIcon = (format) => {
    const icons = {
      video: Video,
      reel: Video,
      image: Image,
      carousel: Image,
    }
    const Icon = icons[format] || FileText
    return <Icon className="w-4 h-4" />
  }

  const filteredAssets = assets.filter(asset => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return asset.name?.toLowerCase().includes(query) || asset.description?.toLowerCase().includes(query)
  })

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
      <div className="relative mb-8">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[var(--accent-primary)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--accent-primary)] tracking-wide uppercase">
              Studio
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Content Studio
            </h1>
            <p className="text-[var(--text-tertiary)] text-lg">
              Create, manage, and schedule your content assets
            </p>
          </div>

          {['library', 'schedule', 'review'].includes(activeTab) && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assets..."
                  className={cn(
                    'w-64 pl-10 pr-4 h-10 rounded-lg',
                    'bg-[var(--bg-secondary)] border border-[var(--border-subtle)]',
                    'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
                    'focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-muted)]',
                    'transition-all duration-200'
                  )}
                />
              </div>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                New Asset
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {['library', 'schedule', 'review'].includes(activeTab) && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: LayoutGrid, color: 'violet' },
            { label: 'Drafts', value: stats.draft, icon: Edit3, color: 'gray' },
            { label: 'In Review', value: stats.inReview, icon: Eye, color: 'orange' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'emerald' },
            { label: 'Scheduled', value: stats.scheduled, icon: CalendarDays, color: 'sky' },
            { label: 'Needs Work', value: stats.changesRequested, icon: AlertCircle, color: 'red' },
          ].map((stat, i) => {
            const colors = {
              violet: 'bg-violet-500/10 text-violet-400',
              gray: 'bg-gray-500/10 text-gray-400',
              orange: 'bg-orange-500/10 text-orange-400',
              emerald: 'bg-emerald-500/10 text-emerald-400',
              sky: 'bg-sky-500/10 text-sky-400',
              red: 'bg-red-500/10 text-red-400',
            }
            return (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors[stat.color].split(' ')[0])}>
                    <stat.icon className={cn('w-5 h-5', colors[stat.color].split(' ')[1])} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                    <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 p-1 bg-[var(--bg-secondary)] rounded-xl w-fit">
        {studioTabs.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              {t.id === 'review' && stats.inReview + stats.changesRequested > 0 && (
                <span className={cn(
                  'ml-1 px-1.5 py-0.5 text-xs rounded-full',
                  isActive ? 'bg-orange-500/20 text-orange-400' : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
                )}>
                  {stats.inReview + stats.changesRequested}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Filters */}
      {['library', 'schedule', 'review'].includes(activeTab) && (
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(
              'h-10 px-3 rounded-lg appearance-none cursor-pointer',
              'bg-[var(--bg-secondary)] border border-[var(--border-subtle)]',
              'text-[var(--text-primary)] text-sm',
              'focus:outline-none focus:border-[var(--accent-primary)]',
              'pr-8 bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat'
            )}
          >
            <option value="all">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className={cn(
              'h-10 px-3 rounded-lg appearance-none cursor-pointer',
              'bg-[var(--bg-secondary)] border border-[var(--border-subtle)]',
              'text-[var(--text-primary)] text-sm',
              'focus:outline-none focus:border-[var(--accent-primary)]',
              'pr-8 bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat'
            )}
          >
            <option value="all">All Platforms</option>
            {platforms.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      {activeTab === 'tasks' ? (
        <TaskBoard
          onTaskClick={(task) => {
            setSelectedTaskId(task.id)
            setShowTaskModal(true)
          }}
        />
      ) : activeTab === 'calendar' ? (
        <UnifiedCalendar
          onTaskClick={(task) => {
            setSelectedTaskId(task.id)
            setShowTaskModal(true)
          }}
          onAssetClick={(asset) => {
            setSelectedAsset(asset)
            setShowDetailModal(true)
          }}
          onCreateTask={() => {
            addToast('Create a task from the Tasks tab', 'info')
          }}
        />
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sectionAssets[activeTab]?.length === 0 ? (
        <Card className="p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {activeTab === 'library' && 'No assets yet'}
            {activeTab === 'schedule' && 'Nothing scheduled'}
            {activeTab === 'review' && 'No pending reviews'}
          </h3>
          <p className="text-[var(--text-tertiary)] mb-6 max-w-sm mx-auto">
            {activeTab === 'library' && 'Create your first asset to get started with your content studio'}
            {activeTab === 'schedule' && 'Approved assets ready for scheduling will appear here'}
            {activeTab === 'review' && 'Assets waiting for review will appear here'}
          </p>
          {activeTab === 'library' && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              Create Asset
            </Button>
          )}
        </Card>
      ) : activeTab === 'schedule' ? (
        <div className="space-y-3">
          {sectionAssets.schedule.map((asset) => (
            <Card key={asset.id} className="p-5 hover:border-[var(--border-default)] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    asset.status === 'live' ? 'bg-emerald-500/10' : 'bg-sky-500/10'
                  )}>
                    {asset.status === 'live' ? (
                      <Play className="w-5 h-5 text-emerald-400" />
                    ) : asset.status === 'scheduled' ? (
                      <CalendarDays className="w-5 h-5 text-sky-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-[var(--text-primary)]">{asset.name}</p>
                      {getStatusBadge(asset.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {getPlatformIcon(asset.platform)}
                      <span className="text-[var(--text-muted)]">·</span>
                      <span className="capitalize text-[var(--text-muted)]">{asset.format}</span>
                      {asset.scheduled_at && (
                        <>
                          <span className="text-[var(--text-muted)]">·</span>
                          <span className="text-[var(--text-tertiary)]">Scheduled: {formatDate(asset.scheduled_at)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {asset.status === 'approved' && (
                    <Button size="sm" variant="secondary">
                      <CalendarDays className="w-4 h-4" />
                      Schedule
                    </Button>
                  )}
                  {asset.status === 'scheduled' && (
                    <Button size="sm" variant="ghost">
                      <Pause className="w-4 h-4" />
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
        <div className="space-y-3">
          {sectionAssets.review.map((asset) => (
            <Card
              key={asset.id}
              className={cn(
                'p-5 transition-colors',
                asset.status === 'changes_requested' ? 'border-red-500/30 hover:border-red-500/50' : 'hover:border-[var(--border-default)]'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    asset.status === 'changes_requested' ? 'bg-red-500/10' : 'bg-orange-500/10'
                  )}>
                    {asset.status === 'changes_requested' ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-orange-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-[var(--text-primary)]">{asset.name}</p>
                      {getStatusBadge(asset.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {getPlatformIcon(asset.platform)}
                      <span className="text-[var(--text-muted)]">·</span>
                      <span className="capitalize text-[var(--text-muted)]">{asset.format}</span>
                      <span className="text-[var(--text-muted)]">·</span>
                      <span className="text-[var(--text-muted)]">v{asset.version_count}</span>
                      {asset.pending_feedback_count > 0 && (
                        <>
                          <span className="text-[var(--text-muted)]">·</span>
                          <span className="text-orange-400 font-medium">{asset.pending_feedback_count} feedback items</span>
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
                    <MessageSquare className="w-4 h-4" />
                    View Feedback
                  </Button>
                  {asset.status === 'changes_requested' && (
                    <Button size="sm">
                      <Upload className="w-4 h-4" />
                      Upload New Version
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionAssets.library.map((asset) => (
            <Card
              key={asset.id}
              interactive
              glow
              className="p-5"
              onClick={() => {
                setSelectedAsset(asset)
                setShowDetailModal(true)
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center',
                  asset.format === 'video' || asset.format === 'reel' ? 'bg-violet-500/10' :
                  asset.format === 'image' || asset.format === 'carousel' ? 'bg-pink-500/10' :
                  'bg-sky-500/10'
                )}>
                  {getFormatIcon(asset.format)}
                </div>
                {getStatusBadge(asset.status)}
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">{asset.name}</h3>
              <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4">
                {asset.description || 'No description'}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(asset.platform)}
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="text-[var(--text-muted)] capitalize">{asset.format}</span>
                </div>
                <span className="text-[var(--text-muted)]">v{asset.version_count}</span>
              </div>
              {asset.status === 'draft' && (
                <Button
                  size="sm"
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSubmitForReview(asset.id)
                  }}
                >
                  <Send className="w-4 h-4" />
                  Submit for Review
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      <CreateAssetModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(asset) => {
          addToast('Asset created successfully!', 'success')
          loadAssets()
        }}
      />

      <AssetDetailModal
        assetId={selectedAsset?.id}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedAsset(null)
        }}
        onUpdate={() => loadAssets()}
        onDelete={() => {
          setShowDetailModal(false)
          setSelectedAsset(null)
          loadAssets()
          addToast('Asset deleted', 'success')
        }}
      />

      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false)
          setSelectedTaskId(null)
        }}
        onUpdate={() => {}}
        onDelete={() => {
          setShowTaskModal(false)
          setSelectedTaskId(null)
        }}
      />
    </DashboardLayout>
  )
}
