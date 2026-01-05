import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Card = forwardRef(function Card(
  { children, className, variant = 'default', interactive = false, glow = false, lift = false, ...props },
  ref
) {
  const variants = {
    default: 'bg-[var(--bg-elevated)] border-[var(--border-subtle)]',
    surface: 'bg-[var(--bg-surface)] border-[var(--border-default)]',
    glass: 'bg-[var(--glass-bg)] backdrop-blur-xl border-[var(--glass-border)]',
    ghost: 'bg-transparent border-transparent',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border',
        'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
        variants[variant],
        interactive && [
          'cursor-pointer',
          'hover:bg-[var(--bg-surface)] hover:border-[var(--border-default)]',
          'hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]',
          'hover:-translate-y-1',
          'active:translate-y-0 active:scale-[0.99]',
        ],
        lift && [
          'hover:-translate-y-1',
          'hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]',
        ],
        glow && 'hover:shadow-[0_0_30px_rgba(167,139,250,0.15),0_8px_30px_rgba(0,0,0,0.2)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

export function CardHeader({ children, className, actions, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-5 border-b border-[var(--border-subtle)]',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {actions && <div className="flex items-center gap-2 ml-4">{actions}</div>}
    </div>
  )
}

export function CardTitle({ children, className, subtitle, ...props }) {
  return (
    <div className="space-y-1">
      <h3
        className={cn(
          'text-base font-semibold text-[var(--text-primary)] tracking-tight',
          className
        )}
        {...props}
      >
        {children}
      </h3>
      {subtitle && (
        <p className="text-sm text-[var(--text-tertiary)]">{subtitle}</p>
      )}
    </div>
  )
}

export function CardContent({ children, className, noPadding = false, ...props }) {
  return (
    <div
      className={cn(!noPadding && 'p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 px-5 py-4 border-t border-[var(--border-subtle)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Stat card variant for dashboards
export function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  className,
  ...props
}) {
  const changeColors = {
    positive: 'text-[var(--status-success)]',
    negative: 'text-[var(--status-error)]',
    neutral: 'text-[var(--text-tertiary)]',
  }

  return (
    <Card className={cn('p-5', className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {value}
          </p>
          {change && (
            <p className={cn('text-sm font-medium', changeColors[changeType])}>
              {changeType === 'positive' && '+'}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-[var(--accent-primary-muted)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
