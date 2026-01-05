import { useState, useEffect, useMemo } from 'react'
import {
  Plus,
  Inbox,
  Circle,
  PlayCircle,
  CheckCircle2,
  Filter,
  Search,
  FolderOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import api from '@/lib/api'
import { TaskCard } from './TaskCard'

const columns = [
  { id: 'inbox', title: 'Inbox', icon: Inbox, color: 'text-gray-400' },
  { id: 'todo', title: 'To Do', icon: Circle, color: 'text-blue-400' },
  { id: 'in_progress', title: 'In Progress', icon: PlayCircle, color: 'text-yellow-400' },
  { id: 'done', title: 'Done', icon: CheckCircle2, color: 'text-green-400' }
]

function DroppableColumn({ column, children, count, isOver, onDragOver, onDragLeave, onDrop }) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'flex flex-col min-h-[calc(100vh-280px)] bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]',
        isOver && 'ring-2 ring-teal-500/50 bg-teal-500/5'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <column.icon className={cn('w-5 h-5', column.color)} />
          <h3 className="font-semibold text-white">{column.title}</h3>
          <span className="px-2 py-0.5 bg-[var(--bg-card)] rounded-full text-xs text-[var(--text-secondary)]">
            {count}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export function TaskBoard({ onTaskClick, onRefresh }) {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)
  const [filter, setFilter] = useState({
    projectId: null,
    priority: null,
    search: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [quickAddColumn, setQuickAddColumn] = useState(null)
  const [quickAddTitle, setQuickAddTitle] = useState('')

  // Fetch tasks and projects
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tasksRes, projectsRes] = await Promise.all([
        api.getTasks(),
        api.getProjects()
      ])
      setTasks(tasksRes.tasks || [])
      setProjects(projectsRes.projects || [])
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group tasks by status
  const tasksByColumn = useMemo(() => {
    let filteredTasks = [...tasks]

    // Apply filters
    if (filter.projectId) {
      if (filter.projectId === 'inbox') {
        filteredTasks = filteredTasks.filter(t => !t.project_id)
      } else {
        filteredTasks = filteredTasks.filter(t => t.project_id === parseInt(filter.projectId))
      }
    }

    if (filter.priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === filter.priority)
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      filteredTasks = filteredTasks.filter(t =>
        t.title.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower)
      )
    }

    return columns.reduce((acc, col) => {
      acc[col.id] = filteredTasks
        .filter(t => t.status === col.id)
        .sort((a, b) => a.position - b.position)
      return acc
    }, {})
  }, [tasks, filter])

  // Drag and drop handlers
  const handleDragStart = (task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    setDragOverColumn(null)

    if (!draggedTask) return

    const taskId = draggedTask.id
    const oldStatus = draggedTask.status

    if (newStatus === oldStatus) {
      setDraggedTask(null)
      return
    }

    // Optimistic update
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: newStatus, completed_at: newStatus === 'done' ? new Date().toISOString() : null }
          : t
      )
    )
    setDraggedTask(null)

    try {
      await api.updateTaskStatus(taskId, newStatus)
    } catch (error) {
      console.error('Failed to update task status:', error)
      fetchData() // Rollback
    }
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  // Handle quick add
  const handleQuickAdd = async (columnId) => {
    if (!quickAddTitle.trim()) {
      setQuickAddColumn(null)
      return
    }

    try {
      const { task } = await api.createTask({
        title: quickAddTitle.trim(),
        status: columnId
      })
      setTasks(prev => [...prev, task])
      setQuickAddTitle('')
      setQuickAddColumn(null)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  // Handle complete
  const handleComplete = async (taskId, newStatus) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: newStatus, completed_at: newStatus === 'done' ? new Date().toISOString() : null }
          : t
      )
    )

    try {
      await api.updateTaskStatus(taskId, newStatus)
    } catch (error) {
      console.error('Failed to update task:', error)
      fetchData()
    }
  }

  // Handle delete
  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return

    setTasks(prev => prev.filter(t => t.id !== taskId))

    try {
      await api.deleteTask(taskId)
    } catch (error) {
      console.error('Failed to delete task:', error)
      fetchData()
    }
  }

  const clearFilters = () => {
    setFilter({ projectId: null, priority: null, search: '' })
  }

  const hasActiveFilters = filter.projectId || filter.priority || filter.search

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {columns.map(col => (
          <div key={col.id} className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] h-[400px] animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-white placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
            hasActiveFilters
              ? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
              : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white'
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-teal-400 rounded-full" />
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-[var(--text-secondary)] hover:text-white"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
          {/* Project filter */}
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-[var(--text-secondary)]" />
            <select
              value={filter.projectId || ''}
              onChange={(e) => setFilter(prev => ({ ...prev, projectId: e.target.value || null }))}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">All Projects</option>
              <option value="inbox">Inbox (No project)</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">Priority:</span>
            <select
              value={filter.priority || ''}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value || null }))}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="">All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map(column => (
          <DroppableColumn
            key={column.id}
            column={column}
            count={tasksByColumn[column.id]?.length || 0}
            isOver={dragOverColumn === column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {tasksByColumn[column.id]?.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={onTaskClick}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                isDragging={draggedTask?.id === task.id}
              />
            ))}

            {/* Quick Add */}
            {quickAddColumn === column.id ? (
              <div className="p-2">
                <input
                  type="text"
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuickAdd(column.id)
                    if (e.key === 'Escape') {
                      setQuickAddColumn(null)
                      setQuickAddTitle('')
                    }
                  }}
                  onBlur={() => handleQuickAdd(column.id)}
                  placeholder="Task title..."
                  autoFocus
                  className="w-full px-3 py-2 bg-[var(--bg-card)] border border-teal-500 rounded-lg text-white placeholder:text-[var(--text-secondary)] focus:outline-none"
                />
              </div>
            ) : (
              <button
                onClick={() => setQuickAddColumn(column.id)}
                className="flex items-center gap-2 w-full px-3 py-2 text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add task
              </button>
            )}
          </DroppableColumn>
        ))}
      </div>

      {/* Drag hint */}
      <p className="text-center text-xs text-[var(--text-tertiary)]">
        Drag and drop tasks between columns to change their status.
      </p>
    </div>
  )
}

export default TaskBoard
