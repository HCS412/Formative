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
  Image,
  Video,
  Eye,
  MessageSquare,
  CalendarDays,
  LayoutGrid,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit3
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CampaignCard } from '@/components/CampaignCard'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Textarea, Modal, Card, CardHeader, CardTitle, CardContent, Badge, Avatar } from '@/components/ui'
import api from '@/lib/api'
import { cn, capitalizeFirst, formatDate, formatNumber } from '@/lib/utils'

// Tab configuration
const tabs = [
  { id: 'campaigns', label: 'Campaigns', icon: Target },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'assets', label: 'Assets', icon: Image },
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
// ASSETS PANEL (Library, Schedule, Review)
// ============================================
function AssetsPanel() {
  const { token } = useAuth()
  const { addToast } = useToast()
  const [activeSection, setActiveSection] = useState('library') // 'library', 'schedule', 'review'
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

  const assetSubTabs = [
    { id: 'library', label: 'Library', icon: LayoutGrid },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'review', label: 'Review', icon: Eye },
  ]

  const platforms = ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin', 'bluesky', 'threads']
  const formats = ['image', 'video', 'story', 'reel', 'carousel', 'text', 'audio']
  const statuses = ['draft', 'in_review', 'approved', 'changes_requested', 'scheduled', 'live']

  useEffect(() => {
    loadAssets()
  }, [statusFilter, platformFilter])

  const loadAssets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (platformFilter !== 'all') params.append('platform', platformFilter)

      const response = await fetch(`/api/assets?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setAssets(data.assets || [])
      } else {
        setAssets(getDemoAssets())
      }
    } catch (error) {
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
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAsset)
      })

      if (response.ok) {
        addToast('Asset created successfully!', 'success')
        setShowCreateModal(false)
        setNewAsset({ name: '', description: '', platform: 'instagram', format: 'image' })
        loadAssets()
      }
    } catch (error) {
      addToast('Asset created!', 'success') // Demo mode
      setShowCreateModal(false)
    }
  }

  const handleSubmitForReview = async (assetId) => {
    try {
      const response = await fetch(`/api/assets/${assetId}/versions/1/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        addToast('Submitted for review!', 'success')
        loadAssets()
      }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Assets</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage your content assets, schedule posts, and track reviews
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
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

      {/* Sub-tabs */}
      <div className="flex gap-2">
        {assetSubTabs.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setActiveSection(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeSection === t.id
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-white'
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
      <div className="flex flex-wrap gap-2">
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

      {/* Content based on active section */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
        </div>
      ) : sectionAssets[activeSection].length === 0 ? (
        <Card className="p-12 text-center">
          <Image className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {activeSection === 'library' && 'No assets yet'}
            {activeSection === 'schedule' && 'Nothing scheduled'}
            {activeSection === 'review' && 'No pending reviews'}
          </h3>
          <p className="text-[var(--text-secondary)] mb-4">
            {activeSection === 'library' && 'Create your first asset to get started'}
            {activeSection === 'schedule' && 'Approved assets ready for scheduling will appear here'}
            {activeSection === 'review' && 'Assets waiting for review will appear here'}
          </p>
          {activeSection === 'library' && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Asset
            </Button>
          )}
        </Card>
      ) : activeSection === 'schedule' ? (
        // Schedule View - Calendar-like layout
        <div className="space-y-4">
          <div className="grid gap-3">
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
        </div>
      ) : activeSection === 'review' ? (
        // Review View - Focus on pending feedback
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
      case 'projects':
        return <ProjectsPanel />
      case 'assets':
        return <AssetsPanel />
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
          Manage your campaigns, projects, assets, payments, and team
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
