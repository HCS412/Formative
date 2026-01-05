import { useState, useEffect, useRef } from 'react'
import {
  X,
  Calendar,
  Clock,
  Flag,
  FolderOpen,
  Tag,
  MessageSquare,
  Paperclip,
  Trash2,
  Check,
  ChevronDown,
  Send,
  User,
  History
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import api from '@/lib/api'
import { Button, Avatar } from '@/components/ui'

const statusOptions = [
  { value: 'inbox', label: 'Inbox', color: 'bg-gray-500' },
  { value: 'todo', label: 'To Do', color: 'bg-blue-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-500' },
  { value: 'done', label: 'Done', color: 'bg-green-500' }
]

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'text-blue-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { value: 'high', label: 'High', color: 'text-orange-400' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-400' }
]

export function TaskDetailModal({ taskId, isOpen, onClose, onUpdate, onDelete }) {
  const [task, setTask] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [newComment, setNewComment] = useState('')
  const [sendingComment, setSendingComment] = useState(false)
  const titleRef = useRef(null)

  // Fetch task details
  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails()
      fetchProjects()
    }
  }, [isOpen, taskId])

  const fetchTaskDetails = async () => {
    try {
      setLoading(true)
      const { task } = await api.getTask(taskId)
      setTask(task)
    } catch (error) {
      console.error('Failed to fetch task:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const { projects } = await api.getProjects()
      setProjects(projects || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }

  const handleUpdate = async (field, value) => {
    if (!task) return

    const previousValue = task[field]
    setTask(prev => ({ ...prev, [field]: value }))

    try {
      setSaving(true)
      // Map field names for API
      const apiField = {
        project_id: 'projectId',
        due_date: 'dueDate',
        due_time: 'dueTime',
        scheduled_start: 'scheduledStart',
        scheduled_end: 'scheduledEnd',
        estimated_minutes: 'estimatedMinutes'
      }[field] || field

      await api.updateTask(taskId, { [apiField]: value })
      onUpdate?.()
    } catch (error) {
      console.error('Failed to update task:', error)
      setTask(prev => ({ ...prev, [field]: previousValue }))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await api.deleteTask(taskId)
      onDelete?.(taskId)
      onClose()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      setSendingComment(true)
      const { comment } = await api.addTaskComment(taskId, newComment.trim())
      setTask(prev => ({
        ...prev,
        comments: [...(prev.comments || []), comment]
      }))
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setSendingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await api.deleteTaskComment(taskId, commentId)
      setTask(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId)
      }))
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[var(--bg-secondary)] rounded-xl shadow-xl border border-[var(--border-color)] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--text-secondary)]">Task #{taskId}</span>
            {saving && (
              <span className="text-xs text-teal-400 animate-pulse">Saving...</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
          </div>
        ) : task ? (
          <div className="flex-1 overflow-y-auto">
            {/* Title */}
            <div className="px-6 pt-4">
              <input
                ref={titleRef}
                type="text"
                value={task.title || ''}
                onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
                onBlur={(e) => handleUpdate('title', e.target.value)}
                className="w-full text-xl font-semibold text-white bg-transparent border-none focus:outline-none focus:ring-0"
                placeholder="Task title"
              />
            </div>

            {/* Metadata Grid */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Status</label>
                <select
                  value={task.status || 'inbox'}
                  onChange={(e) => handleUpdate('status', e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Priority</label>
                <select
                  value={task.priority || 'medium'}
                  onChange={(e) => handleUpdate('priority', e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                >
                  {priorityOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Project */}
              <div className="space-y-1">
                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Project</label>
                <select
                  value={task.project_id || ''}
                  onChange={(e) => handleUpdate('project_id', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                >
                  <option value="">No project (Inbox)</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-1">
                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Due Date</label>
                <input
                  type="date"
                  value={task.due_date ? task.due_date.split('T')[0] : ''}
                  onChange={(e) => handleUpdate('due_date', e.target.value || null)}
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>

              {/* Scheduled Start */}
              <div className="space-y-1">
                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Scheduled Start</label>
                <input
                  type="datetime-local"
                  value={task.scheduled_start ? task.scheduled_start.slice(0, 16) : ''}
                  onChange={(e) => handleUpdate('scheduled_start', e.target.value || null)}
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>

              {/* Estimated Time */}
              <div className="space-y-1">
                <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Estimated (min)</label>
                <input
                  type="number"
                  min="0"
                  value={task.estimated_minutes || ''}
                  onChange={(e) => handleUpdate('estimated_minutes', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="e.g. 30"
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-white placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
            </div>

            {/* Description */}
            <div className="px-6 py-4 border-t border-[var(--border-color)]">
              <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wide mb-2 block">Description</label>
              <textarea
                value={task.description || ''}
                onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
                onBlur={(e) => handleUpdate('description', e.target.value)}
                placeholder="Add a description..."
                rows={4}
                className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-white placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
              />
            </div>

            {/* Tabs */}
            <div className="border-t border-[var(--border-color)]">
              <div className="flex px-6 gap-4">
                {[
                  { id: 'comments', label: 'Comments', icon: MessageSquare, count: task.comments?.length },
                  { id: 'activity', label: 'Activity', icon: History, count: task.activity?.length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 py-3 border-b-2 transition-colors',
                      activeTab === tab.id
                        ? 'border-teal-500 text-white'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-white'
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="px-1.5 py-0.5 bg-[var(--bg-card)] rounded text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="px-6 py-4">
                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    {/* Comment Input */}
                    <div className="flex gap-3">
                      <Avatar name="You" size="sm" />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                          placeholder="Add a comment..."
                          className="flex-1 px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-white placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                        />
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || sendingComment}
                          size="sm"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {task.comments?.map(comment => (
                        <div key={comment.id} className="flex gap-3 group">
                          <Avatar name={comment.user_name} src={comment.avatar_url} size="sm" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{comment.user_name}</span>
                              <span className="text-xs text-[var(--text-tertiary)]">
                                {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                              </span>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/10 rounded transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}

                      {(!task.comments || task.comments.length === 0) && (
                        <p className="text-center text-[var(--text-secondary)] py-4">
                          No comments yet
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-3">
                    {task.activity?.map(item => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center">
                          <History className="w-4 h-4 text-[var(--text-secondary)]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">
                            <span className="font-medium">{item.user_name}</span>
                            {' '}
                            <span className="text-[var(--text-secondary)]">{item.action}</span>
                          </p>
                          <p className="text-xs text-[var(--text-tertiary)]">
                            {format(new Date(item.created_at), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}

                    {(!task.activity || task.activity.length === 0) && (
                      <p className="text-center text-[var(--text-secondary)] py-4">
                        No activity yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-12">
            <p className="text-[var(--text-secondary)]">Task not found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDetailModal
