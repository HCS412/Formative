import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Card = forwardRef(function Card(
  { children, className, variant = 'default', interactive = false, ...props },
  ref
) {
  const variants = {
    default: 'bg-[var(--bg-secondary)] border-[var(--border-subtle)]',
    elevated: 'bg-[var(--bg-elevated)] border-[var(--border-default)]',
    surface: 'bg-[var(--bg-surface)] border-[var(--border-subtle)]',
    ghost: 'bg-transparent border-transparent',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border',
        'transition-all duration-200',
        variants[variant],
        interactive && [
          'cursor-pointer',
          'hover:border-[var(--border-default)]',
          'hover:bg-[var(--bg-elevated)]',
        ],
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
    <div className="space-y-0.5">
      <h3
        className={cn(
          'text-sm font-semibold text-[var(--text-primary)]',
          className
        )}
        {...props}
      >
        {children}
      </h3>
      {subtitle && (
        <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
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
    positive: 'text-[var(--color-success)]',
    negative: 'text-[var(--color-error)]',
    neutral: 'text-[var(--text-muted)]',
  }

  return (
    <Card className={cn('p-5', className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-semibold text-[var(--text-primary)]">
            {value}
          </p>
          {change && (
            <p className={cn('text-xs font-medium', changeColors[changeType])}>
              {changeType === 'positive' && '+'}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-[var(--accent-primary-muted)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
