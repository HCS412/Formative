import { useState, useEffect, useRef } from 'react'
import { Send, Plus, Search, X } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Modal, Avatar, Card } from '@/components/ui'
import api from '@/lib/api'
import { cn, getInitials, formatTime } from '@/lib/utils'

export function Messages() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const messagesEndRef = useRef(null)
  
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  
  // New message modal state
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [initialMessage, setInitialMessage] = useState('')
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      const data = await api.getConversations()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation)
    try {
      const data = await api.getMessages(conversation.id)
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Failed to load messages:', error)
      addToast('Failed to load messages', 'error')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    setSendingMessage(true)
    try {
      await api.sendMessage(selectedConversation.other_user_id, newMessage)
      setNewMessage('')
      // Reload messages
      const data = await api.getMessages(selectedConversation.id)
      setMessages(data.messages || [])
    } catch (error) {
      addToast('Failed to send message', 'error')
    } finally {
      setSendingMessage(false)
    }
  }

  // Search users for new conversation
  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const data = await api.searchUsers(query)
      setSearchResults(data.users || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setSearchResults([])
    setSearchQuery('')
  }

  const handleStartConversation = async () => {
    if (!selectedUser || !initialMessage.trim()) {
      addToast('Please select a user and write a message', 'error')
      return
    }

    try {
      const data = await api.startConversation(selectedUser.id, initialMessage)
      addToast('Message sent!', 'success')
      setShowNewMessageModal(false)
      setSelectedUser(null)
      setInitialMessage('')
      // Reload conversations and select the new one
      await loadConversations()
      if (data.conversationId) {
        const newConv = conversations.find(c => c.id === data.conversationId)
        if (newConv) selectConversation(newConv)
      }
    } catch (error) {
      addToast(error.message || 'Failed to send message', 'error')
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button onClick={() => setShowNewMessageModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid lg:grid-cols-[350px_1fr] gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-[var(--text-secondary)] mb-4">No conversations yet</p>
                <Button size="sm" onClick={() => setShowNewMessageModal(true)}>
                  Start a Conversation
                </Button>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 hover:bg-[var(--bg-secondary)] transition-colors text-left',
                    selectedConversation?.id === conv.id && 'bg-[var(--bg-secondary)] border-l-2 border-l-teal-500'
                  )}
                >
                  <Avatar name={conv.other_user_name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{conv.other_user_name}</span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {conv.updated_at && formatTime(conv.updated_at)}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] truncate">
                      {conv.last_message || 'No messages yet'}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="w-5 h-5 rounded-full bg-teal-500 text-xs flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-[var(--border-color)]">
                <Avatar name={selectedConversation.other_user_name} size="md" />
                <div>
                  <h3 className="font-semibold">{selectedConversation.other_user_name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {selectedConversation.other_user_type || 'User'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex',
                      msg.sender_id === user.id ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[70%] rounded-2xl px-4 py-2',
                        msg.sender_id === user.id
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-br-sm'
                          : 'bg-[var(--bg-secondary)] text-white rounded-bl-sm'
                      )}
                    >
                      <p>{msg.content}</p>
                      <p className={cn(
                        'text-xs mt-1',
                        msg.sender_id === user.id ? 'text-white/70' : 'text-[var(--text-muted)]'
                      )}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border-color)]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-500"
                  />
                  <Button type="submit" disabled={sendingMessage || !newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Select a Conversation</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Choose an existing conversation or start a new one
              </p>
              <Button onClick={() => setShowNewMessageModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* New Message Modal */}
      <Modal
        isOpen={showNewMessageModal}
        onClose={() => {
          setShowNewMessageModal(false)
          setSelectedUser(null)
          setSearchQuery('')
          setSearchResults([])
          setInitialMessage('')
        }}
        title="New Message"
        subtitle="Start a conversation with another user"
      >
        <div className="space-y-4">
          {/* User Search */}
          {!selectedUser ? (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for a user..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="max-h-48 overflow-y-auto">
                {searching ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full" />
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <Avatar name={user.name} size="sm" />
                      <div className="text-left">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {user.user_type}
                        </p>
                      </div>
                    </button>
                  ))
                ) : searchQuery.length >= 2 ? (
                  <p className="text-center text-[var(--text-secondary)] py-4">
                    No users found
                  </p>
                ) : (
                  <p className="text-center text-[var(--text-secondary)] py-4">
                    Type at least 2 characters to search
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Selected User */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedUser.name} size="sm" />
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {selectedUser.user_type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1 hover:bg-[var(--bg-card)] rounded"
                >
                  <X className="w-4 h-4 text-[var(--text-secondary)]" />
                </button>
              </div>

              {/* Message Input */}
              <textarea
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                placeholder="Write your message..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-teal-500 resize-none"
              />

              <Button 
                className="w-full" 
                onClick={handleStartConversation}
                disabled={!initialMessage.trim()}
              >
                Send Message
              </Button>
            </>
          )}
        </div>
      </Modal>
    </DashboardLayout>
  )
}

