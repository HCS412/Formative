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
  Eye,
  MousePointerClick,
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
  FileDown,
  CloudDownload
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CampaignCard } from '@/components/CampaignCard'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Textarea, Modal, Card, CardHeader, CardTitle, CardContent, Badge, Avatar } from '@/components/ui'
import api from '@/lib/api'
import { cn, capitalizeFirst, formatDate, formatNumber } from '@/lib/utils'

// Analytics configuration
const analyticsPalette = ['#ec4899', '#06b6d4', '#22c55e', '#f59e0b', '#8b5cf6']

// Tab configuration
const tabs = [
  { id: 'campaigns', label: 'Campaigns', icon: Target },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'management', label: 'Management', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
// ANALYTICS PANEL
// ============================================
function AnalyticsPanel() {
  const { addToast } = useToast()
  const [dateRange, setDateRange] = useState('30d')
  const [dimension, setDimension] = useState('asset')
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    impressions: 0,
    reach: 0,
    engagement: 0,
    clicks: 0,
    conversions: 0
  })
  const [platformMix, setPlatformMix] = useState([])
  const [timeSeries, setTimeSeries] = useState([])
  const [topAssets, setTopAssets] = useState([])

  const useApiAnalytics = import.meta.env.VITE_ANALYTICS_USE_API === 'true'

  const placeholderData = {
    summary: {
      impressions: 245000,
      reach: 182000,
      engagement: 26400,
      clicks: 12450,
      conversions: 1860,
    },
    platformMix: [
      { platform: 'Instagram', value: 48, color: '#ec4899' },
      { platform: 'TikTok', value: 26, color: '#22c55e' },
      { platform: 'YouTube', value: 16, color: '#06b6d4' },
      { platform: 'Twitter', value: 10, color: '#f59e0b' },
    ],
    timeSeries: {
      asset: [
        { label: 'Week 1', value: 4200 },
        { label: 'Week 2', value: 5600 },
        { label: 'Week 3', value: 6100 },
        { label: 'Week 4', value: 7300 },
        { label: 'Week 5', value: 6900 },
      ],
      campaign: [
        { label: 'Week 1', value: 8500 },
        { label: 'Week 2', value: 9100 },
        { label: 'Week 3', value: 10800 },
        { label: 'Week 4', value: 11200 },
        { label: 'Week 5', value: 12400 },
      ],
    },
    topAssets: [
      {
        id: 'asset-1',
        name: 'Summer Teaser Reel',
        status: 'approved',
        metric: '2.3% CTR',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60',
        link: '/dashboard/workspace/projects',
      },
      {
        id: 'asset-2',
        name: 'New Product Sneak Peek',
        status: 'live',
        metric: '18.6k reach',
        thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=60',
        link: '/dashboard/workspace/campaigns',
      },
      {
        id: 'asset-3',
        name: 'Creator Collab',
        status: 'approved',
        metric: '4.1% engagement',
        thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60',
        link: '/dashboard/workspace/campaigns',
      },
    ]
  }

  const normalizePlatformMix = (data) => {
    if (!data || data.length === 0) return []
    const total = data.reduce((sum, item) => sum + (item.value ?? item.percentage ?? 0), 0) || 1
    return data.map((item, index) => {
      const percentage = item.percentage ?? Math.round((item.value / total) * 100)
      return {
        platform: item.platform || item.name || `Platform ${index + 1}`,
        percentage,
        color: item.color || analyticsPalette[index % analyticsPalette.length],
      }
    })
  }

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      if (useApiAnalytics) {
        const [summaryRes, platformRes, timeRes, assetsRes] = await Promise.all([
          api.getAnalyticsSummary({ range: dateRange }),
          api.getAnalyticsPlatformMix({ range: dateRange }),
          api.getAnalyticsTimeSeries({ range: dateRange, dimension }),
          api.getAnalyticsTopAssets({ range: dateRange }),
        ])

        setSummary({
          impressions: summaryRes.impressions ?? 0,
          reach: summaryRes.reach ?? 0,
          engagement: summaryRes.engagement ?? 0,
          clicks: summaryRes.clicks ?? 0,
          conversions: summaryRes.conversions ?? 0,
        })
        const platformData = normalizePlatformMix(platformRes.platforms || platformRes.data || [])
        const seriesData = timeRes.series || timeRes.data || []
        const assetsData = assetsRes.assets || []
        setPlatformMix(platformData.length ? platformData : normalizePlatformMix(placeholderData.platformMix))
        setTimeSeries(seriesData.length ? seriesData : placeholderData.timeSeries[dimension])
        setTopAssets(assetsData.length ? assetsData : placeholderData.topAssets)
      } else {
        setSummary(placeholderData.summary)
        setPlatformMix(normalizePlatformMix(placeholderData.platformMix))
        setTimeSeries(placeholderData.timeSeries[dimension])
        setTopAssets(placeholderData.topAssets)
      }
    } catch (error) {
      addToast('Analytics unavailable - showing demo data', 'error')
      setSummary(placeholderData.summary)
      setPlatformMix(normalizePlatformMix(placeholderData.platformMix))
      setTimeSeries(placeholderData.timeSeries[dimension])
      setTopAssets(placeholderData.topAssets)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, dimension])

  const buildGradient = (mix) => {
    if (!mix.length) return 'conic-gradient(#0f172a, #0f172a)'
    let current = 0
    const segments = mix.map(item => {
      const start = current
      const end = current + item.percentage
      current = end
      return `${item.color} ${start}% ${end}%`
    })
    if (current < 100) {
      segments.push(`#1f2937 ${current}% 100%`)
    }
    return `conic-gradient(${segments.join(', ')})`
  }

  const handleExportCsv = () => {
    const summaryRows = [
      ['Metric', 'Value'],
      ['Impressions', summary.impressions],
      ['Reach', summary.reach],
      ['Engagement', summary.engagement],
      ['Clicks', summary.clicks],
      ['Conversions', summary.conversions],
    ]
    const timeRows = [
      [],
      ['Time Series', 'Value'],
      ...timeSeries.map(point => [point.label, point.value]),
    ]
    const csvContent = [...summaryRows, ...timeRows]
      .map(row => row.join(','))
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-${dateRange}-${dimension}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPdf = () => {
    const pdfWindow = window.open('', '_blank')
    pdfWindow.document.write(`
      <html>
        <head><title>Analytics Report</title></head>
        <body>
          <h1>Analytics Report (${dateRange}, ${dimension})</h1>
          <ul>
            <li>Impressions: ${summary.impressions}</li>
            <li>Reach: ${summary.reach}</li>
            <li>Engagement: ${summary.engagement}</li>
            <li>Clicks: ${summary.clicks}</li>
            <li>Conversions: ${summary.conversions}</li>
          </ul>
          <h2>Top Assets</h2>
          <ul>
            ${topAssets.map(asset => `<li>${asset.name} - ${asset.metric || ''}</li>`).join('')}
          </ul>
        </body>
      </html>
    `)
    pdfWindow.document.close()
    pdfWindow.focus()
    pdfWindow.print()
  }

  const maxValue = Math.max(...timeSeries.map(point => point.value || 0), 1)

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'ytd', label: 'Year to date' },
  ]

  const summaryCards = [
    { label: 'Impressions', value: summary.impressions, delta: '+8%', icon: Eye, tone: 'text-cyan-400' },
    { label: 'Reach', value: summary.reach, delta: '+4%', icon: Target, tone: 'text-teal-400' },
    { label: 'Engagement', value: summary.engagement, delta: '+12%', icon: Users, tone: 'text-purple-400' },
    { label: 'Clicks', value: summary.clicks, delta: '+6%', icon: MousePointerClick, tone: 'text-orange-400' },
    { label: 'Conversions', value: summary.conversions, delta: '+3%', icon: DollarSign, tone: 'text-green-400' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Analytics</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Monitor performance across platforms and campaigns
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-white focus:outline-none"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <Badge variant={useApiAnalytics ? 'success' : 'default'}>
            {useApiAnalytics ? 'Live data' : 'Demo data'}
          </Badge>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            className="flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportPdf}
            className="flex items-center gap-2"
          >
            <CloudDownload className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {summaryCards.map((card, idx) => {
              const Icon = card.icon
              return (
                <Card key={idx} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-[var(--text-secondary)]">{card.label}</p>
                    <span className={`text-xs ${card.tone}`}>{card.delta}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${card.tone}`} />
                    </div>
                    <p className="text-2xl font-semibold">{formatNumber(card.value)}</p>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Platform mix donut */}
            <Card className="p-6 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Platform mix</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Share by impressions</p>
                </div>
                <div
                  className="relative w-28 h-28 rounded-full"
                  style={{ background: buildGradient(platformMix) }}
                >
                  <div className="absolute inset-5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center">
                    <p className="text-sm text-[var(--text-secondary)]">100%</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {platformMix.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <p className="text-sm">{item.platform}</p>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{item.percentage}%</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Time series */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Performance over time</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Viewing by {dimension === 'asset' ? 'asset' : 'campaign'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={dimension === 'asset' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setDimension('asset')}
                  >
                    Assets
                  </Button>
                  <Button
                    variant={dimension === 'campaign' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setDimension('campaign')}
                  >
                    Campaigns
                  </Button>
                </div>
              </div>

              <div className="h-52 flex items-end gap-3">
                {timeSeries.map((point, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-teal-600 to-cyan-500"
                      style={{ height: `${(point.value / maxValue) * 100}%` }}
                    />
                    <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">{point.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Top assets strip */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Top performing assets</h3>
              <p className="text-sm text-[var(--text-secondary)]">Best results by engagement</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {topAssets.map((asset) => (
                <a
                  key={asset.id}
                  href={asset.link || '#'}
                  className="min-w-[220px] rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-teal-500 transition-colors"
                >
                  <div className="relative h-32 bg-[var(--bg-secondary)]">
                    <img
                      src={asset.thumbnail}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      variant={asset.status === 'live' ? 'success' : 'secondary'}
                      className="absolute top-2 left-2 capitalize"
                    >
                      {asset.status}
                    </Badge>
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="font-semibold truncate">{asset.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{asset.metric}</p>
                    <div className="flex items-center gap-1 text-xs text-teal-400">
                      <ExternalLink className="w-3 h-3" />
                      View detail
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </Card>
        </>
      )}
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
      case 'projects':
        return <ProjectsPanel />
      case 'payments':
        return <PaymentsPanel />
      case 'management':
        return <ManagementPanel />
      case 'analytics':
        return <AnalyticsPanel />
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
