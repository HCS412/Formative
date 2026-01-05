import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, IconButton } from './Button'

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-4xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  footer,
}) {
  // Close on escape key
  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape' && closeOnEscape) onClose()
    },
    [onClose, closeOnEscape]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className={cn(
          'absolute inset-0 bg-black/60 backdrop-blur-sm',
          'animate-in fade-in duration-200'
        )}
        onClick={() => closeOnBackdrop && onClose()}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full',
          'bg-[var(--bg-elevated)] rounded-2xl',
          'border border-[var(--border-subtle)]',
          'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]',
          'animate-in fade-in zoom-in-95 duration-200',
          sizes[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-5 border-b border-[var(--border-subtle)]">
            <div className="space-y-1">
              {title && (
                <h2 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-[var(--text-tertiary)]">{subtitle}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'p-2 -m-2 rounded-lg',
                  'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                  'hover:bg-[var(--bg-surface)]',
                  'transition-colors duration-150'
                )}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5 max-h-[calc(100vh-200px)] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-[var(--border-subtle)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// Confirmation dialog variant
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-[var(--text-secondary)]">{message}</p>
    </Modal>
  )
}

// Alert dialog variant
export function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <Button onClick={onClose}>{buttonText}</Button>
      }
    >
      <p className="text-[var(--text-secondary)]">{message}</p>
    </Modal>
  )
}
