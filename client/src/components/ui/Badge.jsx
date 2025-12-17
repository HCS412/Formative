import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]',
  primary: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  warning: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
}

export function Badge({ children, variant = 'default', className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}


