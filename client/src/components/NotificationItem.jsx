import { 
  MessageSquare, 
  Briefcase, 
  Target, 
  DollarSign, 
  UserPlus, 
  Check,
  Star,
  Bell
} from 'lucide-react'
import { Avatar } from '@/components/ui'
import { cn, formatRelativeTime } from '@/lib/utils'

const notificationIcons = {
  message: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  opportunity: { icon: Briefcase, color: 'text-teal-400', bg: 'bg-teal-500/20' },
  campaign: { icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  payment: { icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/20' },
  connection: { icon: UserPlus, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  application: { icon: Check, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  review: { icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  system: { icon: Bell, color: 'text-gray-400', bg: 'bg-gray-500/20' },
}

export function NotificationItem({ 
  notification, 
  onClick, 
  onMarkRead,
  compact = false 
}) {
  const {
    id,
    type,
    title,
    message,
    sender_name,
    sender_avatar,
    is_read,
    created_at,
    action_url,
  } = notification

  const iconConfig = notificationIcons[type] || notificationIcons.system
  const Icon = iconConfig.icon

  const handleClick = () => {
    if (!is_read && onMarkRead) {
      onMarkRead(id)
    }
    if (onClick) {
      onClick(notification)
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-start gap-3 p-3 text-left transition-colors rounded-lg',
          is_read 
            ? 'bg-transparent hover:bg-[var(--bg-secondary)]' 
            : 'bg-teal-500/5 hover:bg-teal-500/10'
        )}
      >
        {/* Icon or Avatar */}
        {sender_avatar ? (
          <Avatar name={sender_name} src={sender_avatar} size="sm" />
        ) : (
          <div className={cn('w-9 h-9 rounded-full flex items-center justify-center', iconConfig.bg)}>
            <Icon className={cn('w-4 h-4', iconConfig.color)} />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm line-clamp-2',
            !is_read && 'font-medium'
          )}>
            {title}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {formatRelativeTime(created_at)}
          </p>
        </div>

        {/* Unread indicator */}
        {!is_read && (
          <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-2" />
        )}
      </button>
    )
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all',
        is_read 
          ? 'bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)]' 
          : 'bg-teal-500/5 border border-teal-500/20 hover:bg-teal-500/10'
      )}
    >
      {/* Icon or Avatar */}
      {sender_avatar ? (
        <Avatar name={sender_name} src={sender_avatar} size="md" />
      ) : (
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconConfig.bg)}>
          <Icon className={cn('w-5 h-5', iconConfig.color)} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn(
            'text-sm',
            !is_read ? 'font-semibold' : 'font-medium'
          )}>
            {title}
          </h4>
          <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
            {formatRelativeTime(created_at)}
          </span>
        </div>
        {message && (
          <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
            {message}
          </p>
        )}
        {sender_name && (
          <p className="text-xs text-[var(--text-muted)] mt-2">
            From: {sender_name}
          </p>
        )}
      </div>

      {/* Unread indicator */}
      {!is_read && (
        <div className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0" />
      )}
    </div>
  )
}

