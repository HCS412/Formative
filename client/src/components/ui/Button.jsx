import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  primary: [
    'bg-[var(--accent-primary)] text-[var(--bg-base)]',
    'hover:bg-[var(--accent-primary-hover)]',
    'shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(167,139,250,0.1)]',
    'hover:shadow-[0_4px_16px_rgba(167,139,250,0.25),0_0_0_1px_rgba(167,139,250,0.2)]',
    'active:scale-[0.98]',
  ].join(' '),
  secondary: [
    'bg-[var(--bg-elevated)] text-[var(--text-primary)]',
    'border border-[var(--border-subtle)]',
    'hover:bg-[var(--bg-surface)] hover:border-[var(--border-default)]',
    'shadow-[0_1px_2px_rgba(0,0,0,0.2)]',
    'active:scale-[0.98]',
  ].join(' '),
  ghost: [
    'bg-transparent text-[var(--text-secondary)]',
    'hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
    'active:scale-[0.98]',
  ].join(' '),
  outline: [
    'bg-transparent text-[var(--accent-primary)]',
    'border border-[var(--accent-primary)]',
    'hover:bg-[var(--accent-primary-muted)]',
    'active:scale-[0.98]',
  ].join(' '),
  danger: [
    'bg-[var(--status-error)] text-white',
    'hover:bg-[#f87171]',
    'shadow-[0_1px_2px_rgba(0,0,0,0.3)]',
    'active:scale-[0.98]',
  ].join(' '),
  success: [
    'bg-[var(--status-success)] text-white',
    'hover:bg-[#4ade80]',
    'shadow-[0_1px_2px_rgba(0,0,0,0.3)]',
    'active:scale-[0.98]',
  ].join(' '),
  glow: [
    'bg-[var(--accent-primary)] text-[var(--bg-base)]',
    'shadow-[0_0_20px_rgba(167,139,250,0.4),0_0_40px_rgba(167,139,250,0.2)]',
    'hover:shadow-[0_0_30px_rgba(167,139,250,0.5),0_0_60px_rgba(167,139,250,0.3)]',
    'active:scale-[0.98]',
  ].join(' '),
}

const sizes = {
  xs: 'h-7 px-2.5 text-xs gap-1',
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-base gap-2',
  xl: 'h-12 px-6 text-base gap-2.5',
}

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    loading,
    icon,
    iconRight,
    as: Component = 'button',
    ...props
  },
  ref
) {
  return (
    <Component
      ref={ref}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'font-medium rounded-lg',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]',
        'select-none whitespace-nowrap',
        // Variant styles
        variants[variant],
        // Size styles
        sizes[size],
        // States
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="flex-shrink-0">{iconRight}</span>
      )}
    </Component>
  )
})

// Icon-only button variant
export function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}) {
  const iconSizes = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  }

  return (
    <Button
      variant={variant}
      className={cn(
        iconSizes[size],
        'p-0 flex items-center justify-center',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
