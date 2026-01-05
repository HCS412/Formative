import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)]',
  primary: 'bg-[var(--accent-primary-muted)] text-[var(--accent-primary)] border-[var(--accent-primary)]/20',
  secondary: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  purple: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  // Solid variants
  'solid-primary': 'bg-[var(--accent-primary)] text-[var(--bg-base)] border-transparent',
  'solid-success': 'bg-emerald-500 text-white border-transparent',
  'solid-warning': 'bg-amber-500 text-black border-transparent',
  'solid-danger': 'bg-red-500 text-white border-transparent',
}

const sizes = {
  sm: 'h-5 px-1.5 text-[10px]',
  md: 'h-6 px-2 text-xs',
  lg: 'h-7 px-2.5 text-sm',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  removable = false,
  onRemove,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium border',
        'transition-colors duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-emerald-400',
            variant === 'warning' && 'bg-amber-400',
            variant === 'danger' && 'bg-red-400',
            variant === 'error' && 'bg-red-400',
            variant === 'info' && 'bg-sky-400',
            variant === 'primary' && 'bg-[var(--accent-primary)]',
            variant === 'default' && 'bg-[var(--text-muted)]',
            !['success', 'warning', 'danger', 'error', 'info', 'primary', 'default'].includes(variant) &&
              'bg-current'
          )}
        />
      )}
      {icon && <span className="flex-shrink-0 -ml-0.5">{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 -mr-0.5 ml-0.5 p-0.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  )
}

// Status badge with animated dot
export function StatusBadge({ status, label, className }) {
  const statusConfig = {
    online: { variant: 'success', label: label || 'Online', animate: true },
    offline: { variant: 'default', label: label || 'Offline', animate: false },
    busy: { variant: 'danger', label: label || 'Busy', animate: true },
    away: { variant: 'warning', label: label || 'Away', animate: false },
    pending: { variant: 'warning', label: label || 'Pending', animate: true },
    active: { variant: 'success', label: label || 'Active', animate: true },
    inactive: { variant: 'default', label: label || 'Inactive', animate: false },
    error: { variant: 'danger', label: label || 'Error', animate: true },
  }

  const config = statusConfig[status] || statusConfig.offline

  return (
    <Badge
      variant={config.variant}
      className={cn('gap-1.5', className)}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          config.variant === 'success' && 'bg-emerald-400',
          config.variant === 'warning' && 'bg-amber-400',
          config.variant === 'danger' && 'bg-red-400',
          config.variant === 'default' && 'bg-[var(--text-muted)]',
          config.animate && 'animate-pulse'
        )}
      />
      {config.label}
    </Badge>
  )
}
