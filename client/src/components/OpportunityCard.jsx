import { MapPin, Calendar, DollarSign, Users, Eye } from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { formatDate, capitalizeFirst } from '@/lib/utils'

const typeColors = {
  influencer: 'primary',
  freelancer: 'purple',
  brand: 'blue',
}

const industryIcons = {
  technology: '💻',
  fashion: '👗',
  beauty: '💄',
  sports: '⚽',
  entertainment: '🎬',
  food: '🍕',
  travel: '✈️',
  health: '🏥',
  finance: '💰',
  education: '📚',
  default: '🏢',
}

export function OpportunityCard({ opportunity, onViewDetails, onApply }) {
  const {
    id,
    title,
    description,
    type,
    industry,
    budget_range,
    budget_min,
    budget_max,
    requirements,
    platforms,
    location,
    is_remote,
    deadline,
    status,
    views_count,
    applications_count,
    created_at,
  } = opportunity

  const budgetDisplay = budget_range || 
    (budget_min && budget_max ? `$${budget_min.toLocaleString()} - $${budget_max.toLocaleString()}` : 'Negotiable')

  const industryIcon = industryIcons[industry?.toLowerCase()] || industryIcons.default

  return (
    <Card className="p-5 hover:border-teal-500/30 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-2xl">
            {industryIcon}
          </div>
          <div>
            <h3 className="font-semibold text-lg group-hover:text-teal-400 transition-colors line-clamp-1">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={typeColors[type] || 'default'}>
                {capitalizeFirst(type)}
              </Badge>
              {industry && (
                <span className="text-sm text-[var(--text-secondary)]">
                  {capitalizeFirst(industry)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {status === 'active' && (
          <Badge variant="success">Active</Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
        {description}
      </p>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span>{budgetDisplay}</span>
        </div>
        
        {(location || is_remote) && (
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>{is_remote ? 'Remote' : location}</span>
          </div>
        )}
        
        {deadline && (
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>Due {formatDate(deadline)}</span>
          </div>
        )}
      </div>

      {/* Platforms */}
      {platforms && platforms.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {(typeof platforms === 'string' ? JSON.parse(platforms) : platforms).map((platform, i) => (
            <span 
              key={i}
              className="px-2 py-1 rounded-md bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)]"
            >
              {platform}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {views_count || 0} views
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {applications_count || 0} applications
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onViewDetails?.(opportunity)}
          >
            Details
          </Button>
          <Button 
            size="sm"
            onClick={() => onApply?.(opportunity)}
          >
            Apply
          </Button>
        </div>
      </div>
    </Card>
  )
}


