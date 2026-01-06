import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  User,
  Palette,
  Settings,
  Bell,
  Link,
  ShoppingBag,
  ArrowRight,
  Command,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

// Navigation commands with icons and paths
const NAVIGATION_COMMANDS = [
  { id: 'nav-dashboard', title: 'Dashboard', subtitle: 'Overview & analytics', path: '/dashboard', icon: LayoutDashboard, category: 'Navigate', keywords: ['home', 'overview', 'stats'] },
  { id: 'nav-workspace', title: 'Workspace', subtitle: 'Campaigns & payments', path: '/dashboard/workspace', icon: Briefcase, category: 'Navigate', keywords: ['campaigns', 'payments', 'work'] },
  { id: 'nav-studio', title: 'Studio', subtitle: 'Media kit & links', path: '/dashboard/studio', icon: Palette, category: 'Navigate', keywords: ['media', 'kit', 'links', 'creative'] },
  { id: 'nav-messages', title: 'Messages', subtitle: 'Conversations', path: '/dashboard/messages', icon: MessageSquare, category: 'Navigate', keywords: ['chat', 'inbox', 'dm'] },
  { id: 'nav-opportunities', title: 'Opportunities', subtitle: 'Discover campaigns', path: '/dashboard/opportunities', icon: Sparkles, category: 'Navigate', keywords: ['discover', 'find', 'search'] },
  { id: 'nav-notifications', title: 'Notifications', subtitle: 'Alerts & updates', path: '/dashboard/notifications', icon: Bell, category: 'Navigate', keywords: ['alerts', 'updates'] },
  { id: 'nav-profile', title: 'Profile', subtitle: 'Your public profile', path: '/dashboard/profile', icon: User, category: 'Navigate', keywords: ['account', 'bio'] },
  { id: 'nav-settings', title: 'Settings', subtitle: 'Preferences & security', path: '/dashboard/settings', icon: Settings, category: 'Navigate', keywords: ['preferences', 'account', 'security'] },
  { id: 'nav-links', title: 'Links', subtitle: 'Link in bio', path: '/dashboard/links', icon: Link, category: 'Navigate', keywords: ['bio', 'linktree'] },
  { id: 'nav-shop', title: 'Shop', subtitle: 'Your products', path: '/dashboard/shop', icon: ShoppingBag, category: 'Navigate', keywords: ['products', 'store', 'sell'] },
]

// Quick action commands
const ACTION_COMMANDS = [
  { id: 'action-new-message', title: 'New Message', subtitle: 'Start a conversation', path: '/dashboard/messages?new=true', icon: MessageSquare, category: 'Quick Actions', keywords: ['compose', 'chat', 'dm'] },
  { id: 'action-new-campaign', title: 'Browse Campaigns', subtitle: 'Find opportunities', path: '/dashboard/opportunities', icon: Briefcase, category: 'Quick Actions', keywords: ['create', 'opportunity'] },
]

// Get keyboard shortcut for display
const getShortcut = (path) => {
  const shortcuts = {
    '/dashboard': '⌘1',
    '/dashboard/opportunities': '⌘2',
    '/dashboard/messages': '⌘3',
    '/dashboard/workspace': '⌘4',
    '/dashboard/notifications': '⌘5',
    '/dashboard/profile': '⌘6',
    '/dashboard/settings': '⌘7',
  }
  return shortcuts[path]
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [results, setResults] = useState([])
  const [recentItems, setRecentItems] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Load recent items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('formative-recent-pages')
    if (stored) {
      try {
        setRecentItems(JSON.parse(stored).slice(0, 5))
      } catch (e) {
        setRecentItems([])
      }
    }
  }, [isOpen])

  // Track visited pages
  useEffect(() => {
    if (!location.pathname.startsWith('/dashboard')) return

    const navItem = NAVIGATION_COMMANDS.find(c => c.path === location.pathname)
    if (!navItem) return

    try {
      const stored = localStorage.getItem('formative-recent-pages')
      let recent = stored ? JSON.parse(stored) : []

      // Remove if already exists, add to front
      recent = recent.filter(r => r.id !== navItem.id)
      recent.unshift({ ...navItem, category: 'Recent' })
      recent = recent.slice(0, 5)

      localStorage.setItem('formative-recent-pages', JSON.stringify(recent))
    } catch (e) {
      // Silently fail - recent pages is not critical functionality
    }
  }, [location.pathname])

  // Listen for global open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    const handleClose = () => setIsOpen(false)

    window.addEventListener('openSearch', handleOpen)
    window.addEventListener('closeModals', handleClose)

    return () => {
      window.removeEventListener('openSearch', handleOpen)
      window.removeEventListener('closeModals', handleClose)
    }
  }, [])

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setSearchResults([])
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Build filtered results based on query
  useEffect(() => {
    const q = query.toLowerCase().trim()

    if (!q) {
      // Show recent + navigation + actions when no query
      const allCommands = [
        ...(recentItems.length > 0 ? recentItems : []),
        ...NAVIGATION_COMMANDS,
        ...ACTION_COMMANDS,
      ]
      setResults(allCommands)
      setSelectedIndex(0)
      return
    }

    // Filter commands by query
    const filtered = [...NAVIGATION_COMMANDS, ...ACTION_COMMANDS].filter(cmd => {
      const matchTitle = cmd.title.toLowerCase().includes(q)
      const matchSubtitle = cmd.subtitle?.toLowerCase().includes(q)
      const matchKeywords = cmd.keywords?.some(k => k.includes(q))
      return matchTitle || matchSubtitle || matchKeywords
    })

    // Add search results if any
    const combinedResults = [...filtered, ...searchResults]
    setResults(combinedResults)
    setSelectedIndex(0)
  }, [query, recentItems, searchResults])

  // Search users when query is long enough
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await api.searchUsers(query)
        const users = (response.users || []).slice(0, 5).map(user => ({
          id: `user-${user.id}`,
          title: user.name,
          subtitle: user.email || `@${user.username}`,
          path: `/dashboard/messages?user=${user.id}`,
          icon: User,
          category: 'Users',
          keywords: []
        }))
        setSearchResults(users)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  // Handle selection - defined before handleKeyDown which uses it
  const handleSelect = useCallback((item) => {
    navigate(item.path)
    setIsOpen(false)
  }, [navigate])

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
    }
  }, [isOpen, results, selectedIndex, handleSelect])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  // Group results by category
  const groupedResults = results.reduce((acc, item) => {
    const category = item.category
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})

  // Get flat index for an item
  const getFlatIndex = (category, itemIndex) => {
    let flatIndex = 0
    for (const cat of Object.keys(groupedResults)) {
      if (cat === category) {
        return flatIndex + itemIndex
      }
      flatIndex += groupedResults[cat].length
    }
    return flatIndex
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette */}
      <div
        className={cn(
          'relative w-full max-w-2xl',
          'bg-zinc-900/95 backdrop-blur-xl rounded-2xl',
          'border border-white/10',
          'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]',
          'animate-in fade-in slide-in-from-top-4 duration-200'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative border-b border-white/[0.08]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, pages, users..."
            className={cn(
              'w-full h-14 pl-14 pr-20 bg-transparent',
              'text-white placeholder:text-zinc-500',
              'focus:outline-none text-[15px]'
            )}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {loading && (
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            )}
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800/80 text-zinc-500 text-xs font-medium border border-white/5">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2 scroll-smooth">
          {Object.entries(groupedResults).map(([category, items], catIndex) => (
            <div key={category} className={catIndex > 0 ? 'mt-2' : ''}>
              {/* Category Header */}
              <div className="px-4 py-2 flex items-center gap-2">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  {category}
                </span>
                {category === 'Recent' && (
                  <Clock className="w-3 h-3 text-zinc-600" />
                )}
              </div>

              {/* Items */}
              <div className="px-2">
                {items.map((item, itemIndex) => {
                  const flatIndex = getFlatIndex(category, itemIndex)
                  const isSelected = flatIndex === selectedIndex
                  const Icon = item.icon
                  const shortcut = getShortcut(item.path)

                  return (
                    <button
                      key={item.id}
                      data-index={flatIndex}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(flatIndex)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                        'text-left transition-all duration-100',
                        isSelected
                          ? 'bg-indigo-500/15 border border-indigo-500/30'
                          : 'border border-transparent hover:bg-white/[0.04]'
                      )}
                    >
                      {/* Icon */}
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                        'transition-colors duration-100',
                        isSelected
                          ? 'bg-indigo-500/20'
                          : 'bg-zinc-800/60'
                      )}>
                        <Icon className={cn(
                          'w-5 h-5 transition-colors duration-100',
                          isSelected ? 'text-indigo-400' : 'text-zinc-400'
                        )} />
                      </div>

                      {/* Title & Subtitle */}
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          'font-medium text-sm transition-colors duration-100',
                          isSelected ? 'text-white' : 'text-zinc-300'
                        )}>
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div className="text-xs text-zinc-500 truncate">
                            {item.subtitle}
                          </div>
                        )}
                      </div>

                      {/* Keyboard Shortcut */}
                      {shortcut && (
                        <kbd className={cn(
                          'hidden sm:block px-2 py-1 rounded-md text-[11px] font-medium',
                          'transition-colors duration-100',
                          isSelected
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-zinc-800/50 text-zinc-500 border border-white/5'
                        )}>
                          {shortcut}
                        </kbd>
                      )}

                      {/* Arrow indicator */}
                      {isSelected && (
                        <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {results.length === 0 && query.length >= 2 && !loading && (
            <div className="py-12 text-center">
              <Search className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">No results found for "{query}"</p>
              <p className="text-zinc-600 text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.08] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800/60 border border-white/5 text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800/60 border border-white/5 text-[10px]">⏎</kbd>
              Select
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800/60 border border-white/5 text-[10px]">ESC</kbd>
              Close
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <Command className="w-3 h-3" />
            <span>Formative</span>
          </div>
        </div>
      </div>
    </div>
  )
}
