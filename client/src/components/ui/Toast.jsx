import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastContext = createContext(null)

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-400',
    bar: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-400',
    bar: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: 'text-amber-400',
    bar: 'bg-amber-500',
  },
  info: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    icon: 'text-sky-400',
    bar: 'bg-sky-500',
  },
}

function Toast({ id, message, title, type = 'info', duration = 5000, onRemove }) {
  const Icon = icons[type]
  const style = styles[type]
  const [progress, setProgress] = useState(100)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const startTime = Date.now()
    const remainingTime = (progress / 100) * duration

    const timer = setTimeout(() => onRemove(id), remainingTime)

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.max(0, progress - (elapsed / duration) * 100)
      setProgress(newProgress)
    }, 50)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [id, duration, onRemove, isPaused, progress])

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl overflow-hidden',
        'bg-[var(--bg-elevated)] border border-[var(--border-subtle)]',
        'shadow-[0_8px_30px_rgba(0,0,0,0.3)]',
        'animate-in slide-in-from-right-full duration-300'
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Icon */}
      <div className={cn('flex-shrink-0 mt-0.5', style.icon)}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
            {title}
          </p>
        )}
        <p className="text-sm text-[var(--text-secondary)]">{message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={() => onRemove(id)}
        className={cn(
          'flex-shrink-0 p-1 -m-1 rounded-md',
          'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
          'hover:bg-[var(--bg-surface)]',
          'transition-colors duration-150'
        )}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--border-subtle)]">
        <div
          className={cn('h-full transition-all duration-100 ease-linear', style.bar)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now()
    const { title, duration = 5000 } = options
    setToasts((prev) => [...prev, { id, message, type, title, duration }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Convenience methods
  const toast = {
    success: (message, options) => addToast(message, 'success', options),
    error: (message, options) => addToast(message, 'error', options),
    warning: (message, options) => addToast(message, 'warning', options),
    info: (message, options) => addToast(message, 'info', options),
    custom: addToast,
    dismiss: removeToast,
  }

  return (
    <ToastContext.Provider value={{ addToast, toast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast {...t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
