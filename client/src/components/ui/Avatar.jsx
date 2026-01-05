import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
}

// Gradient combinations for fallback avatars
const gradients = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-blue-600',
]

// Generate consistent gradient based on name
function getGradient(name) {
  if (!name) return gradients[0]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

export function Avatar({
  src,
  name,
  size = 'md',
  status,
  ring = false,
  className,
  ...props
}) {
  const statusColors = {
    online: 'bg-emerald-400',
    offline: 'bg-[var(--text-muted)]',
    busy: 'bg-red-400',
    away: 'bg-amber-400',
  }

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  }

  return (
    <div className="relative inline-flex">
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={cn(
            'rounded-full object-cover',
            'bg-[var(--bg-surface)]',
            sizes[size],
            ring && 'ring-2 ring-[var(--accent-primary)] ring-offset-2 ring-offset-[var(--bg-base)]',
            className
          )}
          {...props}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold',
            'bg-gradient-to-br text-white',
            getGradient(name),
            sizes[size],
            ring && 'ring-2 ring-[var(--accent-primary)] ring-offset-2 ring-offset-[var(--bg-base)]',
            className
          )}
          {...props}
        >
          {getInitials(name)}
        </div>
      )}

      {/* Status indicator */}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full',
            'ring-2 ring-[var(--bg-base)]',
            statusColors[status] || statusColors.offline,
            statusSizes[size]
          )}
        />
      )}
    </div>
  )
}

// Avatar group for showing multiple avatars
export function AvatarGroup({
  avatars = [],
  max = 4,
  size = 'md',
  className,
}) {
  const visible = avatars.slice(0, max)
  const remaining = avatars.length - max

  const overlapSizes = {
    xs: '-ml-1.5',
    sm: '-ml-2',
    md: '-ml-2.5',
    lg: '-ml-3',
    xl: '-ml-4',
    '2xl': '-ml-6',
  }

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((avatar, index) => (
        <div
          key={avatar.id || index}
          className={cn(index > 0 && overlapSizes[size])}
          style={{ zIndex: visible.length - index }}
        >
          <Avatar
            src={avatar.src}
            name={avatar.name}
            size={size}
            className="ring-2 ring-[var(--bg-base)]"
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full flex items-center justify-center',
            'bg-[var(--bg-surface)] text-[var(--text-secondary)]',
            'ring-2 ring-[var(--bg-base)]',
            'font-medium',
            sizes[size],
            overlapSizes[size]
          )}
          style={{ zIndex: 0 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
