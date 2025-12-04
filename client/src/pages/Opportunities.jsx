import { useState, useEffect } from 'react'
import { Search, Filter, Briefcase, X, Check } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { OpportunityCard } from '@/components/OpportunityCard'
import { useToast } from '@/components/ui/Toast'
import { Button, Modal, Card, Badge, Textarea } from '@/components/ui'
import api from '@/lib/api'
import { cn, capitalizeFirst, formatDate } from '@/lib/utils'

const opportunityTypes = [
  { id: 'all', label: 'All Types', icon: '📋' },
  { id: 'influencer', label: 'Influencer', icon: '👤' },
  { id: 'freelancer', label: 'Freelancer', icon: '🎨' },
  { id: 'brand', label: 'Brand', icon: '🏢' },
]

const industries = [
  'All Industries',
  'Technology',
  'Fashion',
  'Beauty',
  'Sports',
  'Entertainment',
  'Food',
  'Travel',
  'Health',
  'Finance',
  'Education',
]

export function Opportunities() {
  const { addToast } = useToast()
  
  // State
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries')
  const [showFilters, setShowFilters] = useState(false)
  
  // Modal state
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    loadOpportunities()
  }, [selectedType, selectedIndustry])

  const loadOpportunities = async () => {
    setLoading(true)
    try {
      const filters = {}
      if (selectedType !== 'all') filters.type = selectedType
      if (selectedIndustry !== 'All Industries') filters.industry = selectedIndustry.toLowerCase()
      
      const data = await api.getOpportunities(filters)
      setOpportunities(data.opportunities || [])
    } catch (error) {
      console.error('Failed to load opportunities:', error)
      addToast('Failed to load opportunities', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (opportunity) => {
    setSelectedOpportunity(opportunity)
    setShowDetailModal(true)
  }

  const handleApplyClick = (opportunity) => {
    setSelectedOpportunity(opportunity)
    setApplicationMessage('')
    setShowApplyModal(true)
  }

  const handleApply = async () => {
    if (!selectedOpportunity || !applicationMessage.trim()) {
      addToast('Please write a message for your application', 'error')
      return
    }

    setApplying(true)
    try {
      await api.applyToOpportunity(selectedOpportunity.id, applicationMessage)
      addToast('Application submitted successfully!', 'success')
      setShowApplyModal(false)
      setApplicationMessage('')
      // Reload to update application counts
      loadOpportunities()
    } catch (error) {
      addToast(error.message || 'Failed to submit application', 'error')
    } finally {
      setApplying(false)
    }
  }

  // Filter opportunities by search query
  const filteredOpportunities = opportunities.filter(opp => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      opp.title?.toLowerCase().includes(query) ||
      opp.description?.toLowerCase().includes(query) ||
      opp.industry?.toLowerCase().includes(query)
    )
  })

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Opportunities</h1>
          <p className="text-[var(--text-secondary)]">
            Find your next collaboration or project
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
              placeholder="Search opportunities..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-500"
            />
          </div>
          
          {/* Filter toggle (mobile) */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Filters Sidebar */}
        <aside className={cn(
          'space-y-6',
          showFilters ? 'block' : 'hidden md:block'
        )}>
          {/* Type Filter */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Opportunity Type</h3>
            <div className="space-y-1">
              {opportunityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left',
                    selectedType === type.id
                      ? 'bg-teal-500/20 text-teal-400'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  )}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Industry Filter */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Industry</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg transition-colors text-left text-sm',
                    selectedIndustry === industry
                      ? 'bg-teal-500/20 text-teal-400'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  )}
                >
                  {industry}
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Quick Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Total Active</span>
                <span className="font-medium">{opportunities.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Influencer</span>
                <span className="font-medium">
                  {opportunities.filter(o => o.type === 'influencer').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Freelancer</span>
                <span className="font-medium">
                  {opportunities.filter(o => o.type === 'freelancer').length}
                </span>
              </div>
            </div>
          </Card>
        </aside>

        {/* Opportunities Grid */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
              <p className="text-[var(--text-secondary)]">
                {searchQuery 
                  ? 'Try adjusting your search or filters'
                  : 'Check back later for new opportunities'}
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onViewDetails={handleViewDetails}
                  onApply={handleApplyClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedOpportunity?.title}
        size="lg"
      >
        {selectedOpportunity && (
          <div className="space-y-6">
            {/* Type & Industry */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">
                {capitalizeFirst(selectedOpportunity.type)}
              </Badge>
              {selectedOpportunity.industry && (
                <Badge>
                  {capitalizeFirst(selectedOpportunity.industry)}
                </Badge>
              )}
              {selectedOpportunity.is_remote && (
                <Badge variant="success">Remote</Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-[var(--text-secondary)] whitespace-pre-wrap">
                {selectedOpportunity.description}
              </p>
            </div>

            {/* Budget */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                <p className="text-sm text-[var(--text-secondary)] mb-1">Budget</p>
                <p className="text-lg font-semibold text-green-400">
                  {selectedOpportunity.budget_range || 
                   (selectedOpportunity.budget_min && selectedOpportunity.budget_max 
                     ? `$${selectedOpportunity.budget_min.toLocaleString()} - $${selectedOpportunity.budget_max.toLocaleString()}`
                     : 'Negotiable')}
                </p>
              </div>
              {selectedOpportunity.deadline && (
                <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Deadline</p>
                  <p className="text-lg font-semibold">
                    {formatDate(selectedOpportunity.deadline)}
                  </p>
                </div>
              )}
            </div>

            {/* Requirements */}
            {selectedOpportunity.requirements && (
              <div>
                <h4 className="font-semibold mb-2">Requirements</h4>
                <ul className="space-y-2">
                  {(typeof selectedOpportunity.requirements === 'string' 
                    ? JSON.parse(selectedOpportunity.requirements) 
                    : selectedOpportunity.requirements
                  ).map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                      <Check className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Platforms */}
            {selectedOpportunity.platforms && selectedOpportunity.platforms.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Platforms</h4>
                <div className="flex flex-wrap gap-2">
                  {(typeof selectedOpportunity.platforms === 'string' 
                    ? JSON.parse(selectedOpportunity.platforms) 
                    : selectedOpportunity.platforms
                  ).map((platform, i) => (
                    <Badge key={i} variant="blue">{platform}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button */}
            <Button 
              className="w-full" 
              onClick={() => {
                setShowDetailModal(false)
                handleApplyClick(selectedOpportunity)
              }}
            >
              Apply Now
            </Button>
          </div>
        )}
      </Modal>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply to Opportunity"
        subtitle={selectedOpportunity?.title}
      >
        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">
                {capitalizeFirst(selectedOpportunity?.type || '')}
              </Badge>
              <span className="text-sm text-[var(--text-secondary)]">
                {capitalizeFirst(selectedOpportunity?.industry || '')}
              </span>
            </div>
            <p className="text-sm text-green-400">
              Budget: {selectedOpportunity?.budget_range || 'Negotiable'}
            </p>
          </div>

          <Textarea
            label="Your Application Message"
            placeholder="Introduce yourself and explain why you're a great fit for this opportunity..."
            value={applicationMessage}
            onChange={(e) => setApplicationMessage(e.target.value)}
            rows={6}
          />

          <p className="text-xs text-[var(--text-muted)]">
            Your profile information will be shared with the opportunity creator.
          </p>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowApplyModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleApply}
              loading={applying}
              disabled={!applicationMessage.trim()}
            >
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

