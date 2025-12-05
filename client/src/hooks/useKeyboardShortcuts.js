import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/Toast'

const SHORTCUTS = {
  // Navigation
  'meta+k': { action: 'search', label: 'Search' },
  'meta+1': { action: 'navigate', path: '/dashboard', label: 'Dashboard' },
  'meta+2': { action: 'navigate', path: '/dashboard/opportunities', label: 'Opportunities' },
  'meta+3': { action: 'navigate', path: '/dashboard/messages', label: 'Messages' },
  'meta+4': { action: 'navigate', path: '/dashboard/campaigns', label: 'Campaigns' },
  'meta+5': { action: 'navigate', path: '/dashboard/notifications', label: 'Notifications' },
  'meta+6': { action: 'navigate', path: '/dashboard/profile', label: 'Profile' },
  'meta+7': { action: 'navigate', path: '/dashboard/settings', label: 'Settings' },
  'meta+8': { action: 'navigate', path: '/dashboard/payments', label: 'Payments' },
  
  // Quick actions
  'meta+n': { action: 'new', label: 'New (context-aware)' },
  'meta+/': { action: 'help', label: 'Show shortcuts' },
  'escape': { action: 'close', label: 'Close modals' },
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const { addToast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in input/textarea
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        // Allow Cmd+K for search even in inputs
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          handleShortcut('meta+k')
        }
        return
      }

      // Build shortcut key
      const parts = []
      if (e.metaKey || e.ctrlKey) parts.push('meta')
      if (e.altKey) parts.push('alt')
      if (e.shiftKey) parts.push('shift')
      parts.push(e.key.toLowerCase())
      
      const shortcut = parts.join('+')
      
      if (SHORTCUTS[shortcut]) {
        e.preventDefault()
        handleShortcut(shortcut)
      }
    }

    const handleShortcut = (shortcut) => {
      const config = SHORTCUTS[shortcut]
      
      switch (config.action) {
        case 'search':
          // Trigger search modal (we'll create this)
          window.dispatchEvent(new CustomEvent('openSearch'))
          break
          
        case 'navigate':
          navigate(config.path)
          addToast(`Navigated to ${config.label}`, 'info')
          break
          
        case 'new':
          // Context-aware: new message, new campaign, etc.
          const path = window.location.pathname
          if (path.includes('/messages')) {
            window.dispatchEvent(new CustomEvent('newMessage'))
          } else if (path.includes('/campaigns')) {
            window.dispatchEvent(new CustomEvent('newCampaign'))
          } else if (path.includes('/opportunities')) {
            navigate('/dashboard/opportunities?new=true')
          } else {
            addToast('Press Cmd+N on Messages, Campaigns, or Opportunities pages', 'info')
          }
          break
          
        case 'help':
          showShortcutsHelp()
          break
          
        case 'close':
          // Close any open modals
          window.dispatchEvent(new CustomEvent('closeModals'))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, addToast])
}

function showShortcutsHelp() {
  const shortcuts = Object.entries(SHORTCUTS)
    .map(([key, config]) => {
      const displayKey = key
        .replace('meta', '⌘')
        .replace('ctrl', 'Ctrl')
        .replace('alt', '⌥')
        .replace('shift', '⇧')
        .replace('+', ' + ')
        .toUpperCase()
      return `${displayKey.padEnd(20)} ${config.label}`
    })
    .join('\n')

  alert(`Keyboard Shortcuts:\n\n${shortcuts}\n\n(Mac: ⌘, Windows/Linux: Ctrl)`)
}

