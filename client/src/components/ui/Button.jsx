import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  primary: [
    'bg-white text-zinc-900',
    'hover:bg-zinc-100',
    'active:scale-[0.98]',
  ].join(' '),
  secondary: [
    'bg-zinc-800/50 text-white',
    'border border-white/10',
    'hover:bg-zinc-800 hover:border-white/20',
    'active:scale-[0.98]',
  ].join(' '),
  ghost: [
    'bg-transparent text-zinc-400',
    'hover:bg-white/[0.04] hover:text-white',
    'active:scale-[0.98]',
  ].join(' '),
  outline: [
    'bg-transparent text-indigo-400',
    'border border-indigo-500/50',
    'hover:bg-indigo-500/10 hover:border-indigo-500',
    'active:scale-[0.98]',
  ].join(' '),
  danger: [
    'bg-red-500 text-white',
    'hover:bg-red-600',
    'active:scale-[0.98]',
  ].join(' '),
  success: [
    'bg-emerald-500 text-white',
    'hover:bg-emerald-600',
    'active:scale-[0.98]',
  ].join(' '),
}

const sizes = {
  xs: 'h-7 px-2.5 text-xs gap-1',
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-sm gap-2',
  xl: 'h-11 px-6 text-base gap-2',
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
        'transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]',
        'select-none whitespace-nowrap',
        // Variant styles
        variants[variant],
        // Size styles
        sizes[size],
        // States
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
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
    xl: 'w-11 h-11',
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
