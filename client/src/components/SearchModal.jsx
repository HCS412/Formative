import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, User, Briefcase, MessageSquare, DollarSign } from 'lucide-react'
import { Modal } from '@/components/ui'
import { Input } from '@/components/ui'
import api from '@/lib/api'

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
      return
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        // Navigate results with arrow keys
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault()
        handleSelectResult(results[0])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results])

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        // Search users
        const users = await api.searchUsers(query)
        
        const searchResults = [
          ...(users.users || []).map(user => ({
            type: 'user',
            id: user.id,
            title: user.name,
            subtitle: user.email,
            icon: User,
            path: `/dashboard/messages?user=${user.id}`
          })),
          // Add quick actions
          {
            type: 'action',
            id: 'new-message',
            title: 'New Message',
            subtitle: 'Start a conversation',
            icon: MessageSquare,
            action: () => navigate('/dashboard/messages?new=true')
          },
          {
            type: 'action',
            id: 'new-campaign',
            title: 'New Campaign',
            subtitle: 'Create a campaign',
            icon: Briefcase,
            action: () => navigate('/dashboard/campaigns?new=true')
          },
          {
            type: 'action',
            id: 'payments',
            title: 'Payments',
            subtitle: 'View payment history',
            icon: DollarSign,
            action: () => navigate('/dashboard/payments')
          }
        ]

        setResults(searchResults.slice(0, 8))
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const timeout = setTimeout(search, 300)
    return () => clearTimeout(timeout)
  }, [query, navigate])

  const handleSelectResult = (result) => {
    if (result.action) {
      result.action()
    } else {
      navigate(result.path)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, messages, campaigns..."
            className="pl-10 pr-10"
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            Searching...
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {results.map((result) => {
              const Icon = result.icon
              return (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-card)] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-card)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-[var(--text-secondary)]">{result.subtitle}</div>
                  </div>
                  {result.type === 'action' && (
                    <div className="text-xs text-[var(--text-secondary)]">⌘N</div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            No results found
          </div>
        )}

        {query.length < 2 && (
          <div className="text-center py-8 text-[var(--text-secondary)] text-sm">
            Type to search users, messages, and campaigns
          </div>
        )}
      </div>
    </Modal>
  )
}

