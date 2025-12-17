import { Calendar, DollarSign, Users, Clock, ChevronRight } from 'lucide-react'
import { Card, Badge, Avatar } from '@/components/ui'
import { formatDate, formatNumber, capitalizeFirst } from '@/lib/utils'

const statusColors = {
  draft: 'default',
  pending: 'warning',
  active: 'success',
  completed: 'blue',
  cancelled: 'danger',
}

const statusLabels = {
  draft: 'Draft',
  pending: 'Pending Approval',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function CampaignCard({ campaign, onClick, userType = 'influencer' }) {
  const {
    id,
    title,
    description,
    brand_name,
    brand_logo,
    status,
    budget,
    start_date,
    end_date,
    participants_count,
    deliverables_count,
    completed_deliverables,
    platforms,
  } = campaign

  const progress = deliverables_count > 0 
    ? Math.round((completed_deliverables / deliverables_count) * 100) 
    : 0

  return (
    <Card 
      className="p-5 hover:border-teal-500/30 transition-all duration-300 cursor-pointer group"
      onClick={() => onClick?.(campaign)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {userType === 'influencer' && brand_logo ? (
            <Avatar name={brand_name} src={brand_logo} size="md" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center text-xl">
              📢
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg group-hover:text-teal-400 transition-colors line-clamp-1">
              {title}
            </h3>
            {userType === 'influencer' && brand_name && (
              <p className="text-sm text-[var(--text-secondary)]">by {brand_name}</p>
            )}
          </div>
        </div>
        
        <Badge variant={statusColors[status] || 'default'}>
          {statusLabels[status] || capitalizeFirst(status)}
        </Badge>
      </div>

      {/* Description */}
      {description && (
        <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
          {description}
        </p>
      )}

      {/* Progress Bar (for active campaigns) */}
      {status === 'active' && deliverables_count > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-[var(--text-secondary)]">Progress</span>
            <span className="font-medium text-teal-400">{progress}%</span>
          </div>
          <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {completed_deliverables || 0} of {deliverables_count} deliverables completed
          </p>
        </div>
      )}

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

      {/* Meta Info */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--border-color)]">
        {budget && (
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span>${formatNumber(budget)}</span>
          </div>
        )}
        
        {(start_date || end_date) && (
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>
              {start_date && formatDate(start_date)}
              {start_date && end_date && ' - '}
              {end_date && formatDate(end_date)}
            </span>
          </div>
        )}
        
        {participants_count > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
            <Users className="w-4 h-4 text-purple-400" />
            <span>{participants_count} participant{participants_count !== 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="ml-auto flex items-center text-teal-400 text-sm group-hover:translate-x-1 transition-transform">
          View Details <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Card>
  )
}


