import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
}

export function Avatar({ 
  src, 
  name, 
  size = 'md', 
  className,
  ...props 
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        'bg-gradient-to-br from-indigo-500 to-purple-600 text-white',
        sizes[size],
        className
      )}
      {...props}
    >
      {getInitials(name)}
    </div>
  )
}


