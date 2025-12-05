import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  Users,
  FileText,
  Check,
  Clock,
  X,
  Upload,
  Link2,
  Target,
  BarChart3
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CampaignCard } from '@/components/CampaignCard'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Textarea, Modal, Card, CardHeader, CardTitle, CardContent, Badge, Avatar } from '@/components/ui'
import { Shield, Zap } from 'lucide-react'
import api from '@/lib/api'
import { cn, capitalizeFirst, formatDate, formatNumber } from '@/lib/utils'

const statusFilters = [
  { id: 'all', label: 'All Campaigns' },
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'draft', label: 'Drafts' },
]

const platformOptions = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Bluesky']

export function Campaigns() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const isBrand = user?.user_type === 'brand'

  // State
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Detail modal
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // Create/Edit modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [useEscrow, setUseEscrow] = useState(false)
  const [influencerAddress, setInfluencerAddress] = useState('')
  const [escrowHook, setEscrowHook] = useState(null)
  const [ConnectButtonComponent, setConnectButtonComponent] = useState(null)
  
  // Lazy load escrow hook only when escrow is enabled
  useEffect(() => {
    if (useEscrow && !escrowHook) {
      import('@/hooks/useCampaignEscrow').then(module => {
        setEscrowHook(() => module.useCampaignEscrow)
      })
      import('@rainbow-me/rainbowkit').then(module => {
        setConnectButtonComponent(() => module.ConnectButton)
      })
    }
  }, [useEscrow, escrowHook])
  
  const escrow = escrowHook ? escrowHook() : { isConnected: false, isPending: false, createEscrowCampaign: () => Promise.reject('Wallet not configured'), approveAndRelease: () => Promise.reject('Wallet not configured') }
  
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

  // Deliverable submission modal
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedDeliverable, setSelectedDeliverable] = useState(null)
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
      // Load demo data for testing
      setCampaigns(getDemoCampaigns())
    } finally {
      setLoading(false)
    }
  }

  // Demo data for testing
  const getDemoCampaigns = () => [
    {
      id: 1,
      title: 'Summer Fashion Collection Launch',
      description: 'Promote our new summer collection across social media platforms. Looking for fashion-forward influencers to create authentic content.',
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
        { id: 3, title: 'TikTok Video', status: 'completed', due_date: '2024-06-25' },
        { id: 4, title: 'Instagram Post', status: 'completed', due_date: '2024-07-01' },
        { id: 5, title: 'TikTok Follow-up', status: 'pending', due_date: '2024-07-10' },
        { id: 6, title: 'Final Instagram Reel', status: 'pending', due_date: '2024-07-15' },
      ],
    },
    {
      id: 2,
      title: 'Tech Product Review Campaign',
      description: 'Seeking tech reviewers to showcase our latest gadget. Honest reviews encouraged.',
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
    {
      id: 3,
      title: 'Fitness App Partnership',
      description: 'Long-term partnership for fitness content creators. Create workout content featuring our app.',
      brand_name: 'FitLife',
      status: 'completed',
      budget: 8000,
      start_date: '2024-01-01',
      end_date: '2024-05-31',
      participants_count: 5,
      deliverables_count: 20,
      completed_deliverables: 20,
      platforms: ['Instagram', 'TikTok', 'YouTube'],
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

    if (useEscrow && !escrow.isConnected) {
      addToast('Please connect your wallet to use escrow', 'error')
      return
    }

    if (useEscrow && !influencerAddress.trim()) {
      addToast('Please enter influencer wallet address for escrow', 'error')
      return
    }

    setCreating(true)
    try {
      // Create campaign in database
      const campaign = await api.createCampaign({
        ...campaignForm,
        budget: parseFloat(campaignForm.budget) || 0,
        platforms: campaignForm.platforms,
        deliverables: campaignForm.deliverables.split('\n').filter(d => d.trim()),
        requirements: campaignForm.requirements.split('\n').filter(r => r.trim()),
      })

      // If using escrow, create smart contract escrow
      if (useEscrow && escrow.isConnected) {
        const deadline = campaignForm.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        const amountEth = parseFloat(campaignForm.budget) || 0
        
        addToast('Creating escrow on blockchain...', 'info')
        
        await escrow.createEscrowCampaign(
          influencerAddress,
          deadline,
          campaign.campaign?.id?.toString() || '0',
          amountEth
        )
        
        addToast('Escrow created! Payment locked until deliverables approved.', 'success')
      } else {
        addToast('Campaign created successfully!', 'success')
      }
      
      setShowCreateModal(false)
      resetForm()
      setUseEscrow(false)
      setInfluencerAddress('')
      loadCampaigns()
    } catch (error) {
      console.error('Create campaign error:', error)
      addToast(error.message || 'Failed to create campaign', 'error')
    } finally {
      setCreating(false)
    }
  }

  const handleApproveAndRelease = async (campaignId) => {
    if (!escrow.isConnected) {
      addToast('Please connect your wallet', 'error')
      return
    }

    try {
      addToast('Approving and releasing payment...', 'info')
      await escrow.approveAndRelease(campaignId)
      addToast('Payment released to influencer!', 'success')
      loadCampaigns()
    } catch (error) {
      addToast(error.message || 'Failed to release payment', 'error')
    }
  }

  const handleSubmitDeliverable = async () => {
    if (!submissionUrl.trim()) {
      addToast('Please enter a submission URL', 'error')
      return
    }

    setSubmitting(true)
    try {
      await api.submitDeliverable(selectedCampaign.id, selectedDeliverable.id, submissionUrl)
      addToast('Deliverable submitted!', 'success')
      setShowSubmitModal(false)
      setSubmissionUrl('')
      loadCampaigns()
    } catch (error) {
      addToast('Failed to submit deliverable', 'error')
    } finally {
      setSubmitting(false)
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

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      campaign.title?.toLowerCase().includes(query) ||
      campaign.description?.toLowerCase().includes(query) ||
      campaign.brand_name?.toLowerCase().includes(query)
    )
  })

  // Stats
  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    totalEarnings: campaigns
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + (c.budget || 0), 0),
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-[var(--text-secondary)]">
            {isBrand ? 'Manage your influencer campaigns' : 'Track your active campaigns and deliverables'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search */}
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-[var(--text-secondary)]">Total Campaigns</p>
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
              <p className="text-xs text-[var(--text-secondary)]">{isBrand ? 'Total Spent' : 'Total Earned'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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

      {/* Campaign Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedCampaign?.title}
        size="lg"
      >
        {selectedCampaign && (
          <div className="space-y-6">
            {/* Status & Budget */}
            <div className="flex flex-wrap gap-3">
              <Badge variant={
                selectedCampaign.status === 'active' ? 'success' :
                selectedCampaign.status === 'completed' ? 'blue' :
                selectedCampaign.status === 'pending' ? 'warning' : 'default'
              }>
                {capitalizeFirst(selectedCampaign.status)}
              </Badge>
              {selectedCampaign.budget && (
                <Badge variant="primary">
                  ${formatNumber(selectedCampaign.budget)} Budget
                </Badge>
              )}
            </div>

            {/* Brand Info */}
            {selectedCampaign.brand_name && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-secondary)]">
                <Avatar name={selectedCampaign.brand_name} size="md" />
                <div>
                  <p className="font-medium">{selectedCampaign.brand_name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">Campaign Owner</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-[var(--text-secondary)]">
                {selectedCampaign.description}
              </p>
            </div>

            {/* Timeline */}
            {(selectedCampaign.start_date || selectedCampaign.end_date) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Start Date</p>
                  <p className="font-semibold">
                    {selectedCampaign.start_date ? formatDate(selectedCampaign.start_date) : 'TBD'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">End Date</p>
                  <p className="font-semibold">
                    {selectedCampaign.end_date ? formatDate(selectedCampaign.end_date) : 'TBD'}
                  </p>
                </div>
              </div>
            )}

            {/* Platforms */}
            {selectedCampaign.platforms?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Platforms</h4>
                <div className="flex flex-wrap gap-2">
                  {(typeof selectedCampaign.platforms === 'string' 
                    ? JSON.parse(selectedCampaign.platforms) 
                    : selectedCampaign.platforms
                  ).map((platform, i) => (
                    <Badge key={i}>{platform}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables */}
            {selectedCampaign.deliverables?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Deliverables</h4>
                <div className="space-y-2">
                  {selectedCampaign.deliverables.map((deliverable) => (
                    <div 
                      key={deliverable.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg',
                        deliverable.status === 'completed' 
                          ? 'bg-green-500/10 border border-green-500/20' 
                          : 'bg-[var(--bg-secondary)]'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center',
                          deliverable.status === 'completed' 
                            ? 'bg-green-500/20' 
                            : 'bg-[var(--bg-card)]'
                        )}>
                          {deliverable.status === 'completed' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{deliverable.title}</p>
                          {deliverable.due_date && (
                            <p className="text-xs text-[var(--text-secondary)]">
                              Due: {formatDate(deliverable.due_date)}
                            </p>
                          )}
                        </div>
                      </div>
                      {!isBrand && deliverable.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="secondary"
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
                  ))}
                </div>
              </div>
            )}

            {/* Progress */}
            {selectedCampaign.status === 'active' && selectedCampaign.deliverables_count > 0 && (
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Campaign Progress</span>
                  <span className="font-semibold text-teal-400">
                    {Math.round((selectedCampaign.completed_deliverables / selectedCampaign.deliverables_count) * 100)}%
                  </span>
                </div>
                <div className="h-3 bg-[var(--bg-card)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                    style={{ 
                      width: `${(selectedCampaign.completed_deliverables / selectedCampaign.deliverables_count) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}

            {/* Smart Contract Actions (if escrow used) */}
            {isBrand && selectedCampaign.escrow_campaign_id && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-teal-400" />
                  <h4 className="font-semibold">Smart Contract Escrow</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Payment is locked in smart contract. Approve deliverables to release payment.
                </p>
                {ConnectButtonComponent ? (
                  escrow.isConnected ? (
                    <Button
                      onClick={() => handleApproveAndRelease(selectedCampaign.escrow_campaign_id)}
                      loading={escrow.isPending}
                      className="w-full"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Approve & Release Payment
                    </Button>
                  ) : (
                    <ConnectButtonComponent />
                  )
                ) : (
                  <div className="text-sm text-[var(--text-secondary)]">
                    Wallet integration not available. Please configure WalletConnect Project ID.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Campaign Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Campaign"
        subtitle="Set up a new influencer campaign"
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
            placeholder="Describe your campaign goals, brand voice, and what you're looking for..."
            value={campaignForm.description}
            onChange={(e) => setCampaignForm(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
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
                label="Start Date"
                value={campaignForm.start_date}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, start_date: e.target.value }))}
              />
              <Input
                type="date"
                label="End Date"
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
            placeholder="Instagram Reel&#10;Instagram Story Set&#10;TikTok Video"
            value={campaignForm.deliverables}
            onChange={(e) => setCampaignForm(prev => ({ ...prev, deliverables: e.target.value }))}
            rows={3}
          />

          <Textarea
            label="Requirements (one per line)"
            placeholder="Must have 10k+ followers&#10;Fashion/lifestyle niche&#10;High engagement rate"
            value={campaignForm.requirements}
            onChange={(e) => setCampaignForm(prev => ({ ...prev, requirements: e.target.value }))}
            rows={3}
          />

          {/* Smart Contract Escrow Option */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-400" />
                <label className="font-medium">Use Smart Contract Escrow</label>
              </div>
              <button
                type="button"
                onClick={() => setUseEscrow(!useEscrow)}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors",
                  useEscrow ? "bg-teal-500" : "bg-[var(--bg-card)]"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                  useEscrow && "translate-x-6"
                )} />
              </button>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Lock payment in smart contract. Funds released automatically when deliverables are approved.
            </p>
            
            {useEscrow && (
              <div className="space-y-3 mt-3 pt-3 border-t border-[var(--border-color)]">
                {!ConnectButtonComponent ? (
                  <div className="text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    Wallet integration requires WalletConnect Project ID. Escrow features disabled.
                  </div>
                ) : !escrow.isConnected ? (
                  <div className="flex items-center gap-3">
                    <ConnectButtonComponent />
                    <span className="text-sm text-[var(--text-secondary)]">
                      Connect wallet to use escrow
                    </span>
                  </div>
                ) : (
                  <>
                    <Input
                      label="Influencer Wallet Address"
                      placeholder="0x..."
                      value={influencerAddress}
                      onChange={(e) => setInfluencerAddress(e.target.value)}
                    />
                    <div className="flex items-center gap-2 text-xs text-teal-400">
                      <Zap className="w-4 h-4" />
                      <span>Payment will be locked until you approve deliverables</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

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

      {/* Submit Deliverable Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Deliverable"
        subtitle={selectedDeliverable?.title}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
            <p className="text-sm text-[var(--text-secondary)] mb-1">Deliverable</p>
            <p className="font-medium">{selectedDeliverable?.title}</p>
            {selectedDeliverable?.due_date && (
              <p className="text-sm text-orange-400 mt-1">
                Due: {formatDate(selectedDeliverable.due_date)}
              </p>
            )}
          </div>

          <Input
            label="Content URL"
            placeholder="https://instagram.com/p/..."
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
            icon={<Link2 className="w-4 h-4" />}
          />

          <p className="text-sm text-[var(--text-secondary)]">
            Submit the URL to your published content. Make sure the post is live and accessible.
          </p>

          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleSubmitDeliverable}
              loading={submitting}
              disabled={!submissionUrl.trim()}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

