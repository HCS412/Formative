import { forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Input = forwardRef(function Input(
  {
    className,
    type = 'text',
    label,
    error,
    hint,
    icon,
    iconRight,
    success,
    disabled,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          ref={ref}
          disabled={disabled}
          className={cn(
            // Base styles
            'w-full h-10 px-3.5 rounded-lg',
            'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
            'border border-[var(--border-subtle)]',
            'placeholder:text-[var(--text-muted)]',
            'transition-all duration-200',
            // Focus styles
            'focus:outline-none focus:border-[var(--accent-primary)]',
            'focus:ring-2 focus:ring-[var(--accent-primary-muted)]',
            // Hover
            'hover:border-[var(--border-default)]',
            // Icon padding
            icon && 'pl-10',
            (iconRight || isPassword) && 'pr-10',
            // States
            error && 'border-[var(--status-error)] focus:border-[var(--status-error)] focus:ring-red-500/20',
            success && 'border-[var(--status-success)] focus:border-[var(--status-success)] focus:ring-green-500/20',
            disabled && 'opacity-50 cursor-not-allowed bg-[var(--bg-elevated)]',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
        {iconRight && !isPassword && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {iconRight}
          </div>
        )}
        {error && !iconRight && !isPassword && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--status-error)]">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
        {success && !iconRight && !isPassword && !error && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--status-success)]">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-[var(--status-error)] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-sm text-[var(--text-muted)]">{hint}</p>
      )}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea(
  { className, label, error, hint, disabled, rows = 4, ...props },
  ref
) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={cn(
          // Base styles
          'w-full px-3.5 py-3 rounded-lg resize-y',
          'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
          'border border-[var(--border-subtle)]',
          'placeholder:text-[var(--text-muted)]',
          'transition-all duration-200',
          // Focus styles
          'focus:outline-none focus:border-[var(--accent-primary)]',
          'focus:ring-2 focus:ring-[var(--accent-primary-muted)]',
          // Hover
          'hover:border-[var(--border-default)]',
          // States
          error && 'border-[var(--status-error)] focus:border-[var(--status-error)] focus:ring-red-500/20',
          disabled && 'opacity-50 cursor-not-allowed bg-[var(--bg-elevated)]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-[var(--status-error)] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-sm text-[var(--text-muted)]">{hint}</p>
      )}
    </div>
  )
})

// Select component
export const Select = forwardRef(function Select(
  { className, label, error, hint, options = [], placeholder, disabled, ...props },
  ref
) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          'w-full h-10 px-3.5 rounded-lg appearance-none',
          'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
          'border border-[var(--border-subtle)]',
          'transition-all duration-200',
          'cursor-pointer',
          // Focus styles
          'focus:outline-none focus:border-[var(--accent-primary)]',
          'focus:ring-2 focus:ring-[var(--accent-primary-muted)]',
          // Hover
          'hover:border-[var(--border-default)]',
          // Arrow
          'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat',
          'pr-10',
          // States
          error && 'border-[var(--status-error)] focus:border-[var(--status-error)] focus:ring-red-500/20',
          disabled && 'opacity-50 cursor-not-allowed bg-[var(--bg-elevated)]',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-[var(--status-error)] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-sm text-[var(--text-muted)]">{hint}</p>
      )}
    </div>
  )
})
