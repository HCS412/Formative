import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'w-full px-4 py-3 rounded-lg',
          'bg-[var(--bg-secondary)] border border-[var(--border-color)]',
          'text-white placeholder:text-[var(--text-muted)]',
          'focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
          'transition-all duration-200',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export const Textarea = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-3 rounded-lg resize-y min-h-[100px]',
          'bg-[var(--bg-secondary)] border border-[var(--border-color)]',
          'text-white placeholder:text-[var(--text-muted)]',
          'focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
          'transition-all duration-200',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

