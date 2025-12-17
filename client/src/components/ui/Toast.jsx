import { useState, useEffect, createContext, useContext } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastContext = createContext(null)

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const styles = {
  success: 'border-l-4 border-l-green-500',
  error: 'border-l-4 border-l-red-500',
  info: 'border-l-4 border-l-blue-500',
}

function Toast({ id, message, type = 'info', onRemove }) {
  const Icon = icons[type]

  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 5000)
    return () => clearTimeout(timer)
  }, [id, onRemove])

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg shadow-lg animate-slide-up',
        'bg-[var(--bg-card)] border border-[var(--border-color)]',
        styles[type]
      )}
    >
      <Icon className={cn(
        'w-5 h-5 flex-shrink-0',
        type === 'success' && 'text-green-500',
        type === 'error' && 'text-red-500',
        type === 'info' && 'text-blue-500',
      )} />
      <p className="flex-1 text-sm text-white">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="p-1 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onRemove={removeToast}
          />
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


