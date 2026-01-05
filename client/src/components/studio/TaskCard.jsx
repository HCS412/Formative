import { useState } from 'react'
import {
  Calendar,
  Clock,
  MessageSquare,
  Paperclip,
  Check,
  MoreHorizontal,
  Trash2,
  Edit,
  GripVertical,
  Flag
} from 'lucide-react'
import { format, isPast, isToday, isTomorrow } from 'date-fns'
import { cn } from '@/lib/utils'

const priorityConfig = {
  urgent: { color: 'bg-red-500', textColor: 'text-red-400', label: 'Urgent' },
  high: { color: 'bg-orange-500', textColor: 'text-orange-400', label: 'High' },
  medium: { color: 'bg-yellow-500', textColor: 'text-yellow-400', label: 'Medium' },
  low: { color: 'bg-blue-500', textColor: 'text-blue-400', label: 'Low' }
}

export function TaskCard({
  task,
  onClick,
  onComplete,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging = false,
  showProject = true
}) {
  const [showMenu, setShowMenu] = useState(false)

  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && task.status !== 'done'
  const isCompleted = task.status === 'done'
  const priority = priorityConfig[task.priority] || priorityConfig.medium

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return format(date, 'MMM d')
    return format(date, 'MMM d')
  }

  const handleComplete = (e) => {
    e.stopPropagation()
    onComplete?.(task.id, task.status === 'done' ? 'todo' : 'done')
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    setShowMenu(false)
    onDelete?.(task.id)
  }

  const handleMenuClick = (e) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleDragStartInternal = (e) => {
    e.dataTransfer.setData('taskId', task.id.toString())
    e.dataTransfer.setData('taskStatus', task.status)
    e.dataTransfer.effectAllowed = 'move'
    onDragStart?.(task)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStartInternal}
      onDragEnd={onDragEnd}
      className={cn(
        'group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-3 cursor-pointer',
        'hover:border-[var(--border-color-hover)] transition-all duration-150',
        isDragging ? 'opacity-50 shadow-lg ring-2 ring-teal-500/50' : '',
        isCompleted && 'opacity-60'
      )}
      onClick={() => onClick?.(task)}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-0.5 -ml-1 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Checkbox */}
        <button
          onClick={handleComplete}
          className={cn(
            'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5',
            isCompleted
              ? 'bg-teal-500 border-teal-500'
              : 'border-[var(--text-tertiary)] hover:border-teal-500'
          )}
        >
          {isCompleted && <Check className="w-3 h-3 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4
            className={cn(
              'text-sm font-medium text-white truncate',
              isCompleted && 'line-through text-[var(--text-secondary)]'
            )}
          >
            {task.title}
          </h4>

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {/* Project badge */}
            {showProject && task.project_name && (
              <span
                className="inline-flex items-center px-1.5 py-0.5 text-xs rounded"
                style={{ backgroundColor: `${task.project_color}20`, color: task.project_color }}
              >
                {task.project_name}
              </span>
            )}

            {/* Priority */}
            {task.priority !== 'medium' && (
              <span className={cn('inline-flex items-center gap-0.5 text-xs', priority.textColor)}>
                <Flag className="w-3 h-3" />
                {priority.label}
              </span>
            )}

            {/* Due date */}
            {task.due_date && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs',
                  isOverdue ? 'text-red-400' : 'text-[var(--text-secondary)]'
                )}
              >
                <Calendar className="w-3 h-3" />
                {formatDueDate(task.due_date)}
              </span>
            )}

            {/* Scheduled time */}
            {task.scheduled_start && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <Clock className="w-3 h-3" />
                {format(new Date(task.scheduled_start), 'h:mm a')}
              </span>
            )}

            {/* Comment count */}
            {task.comment_count > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <MessageSquare className="w-3 h-3" />
                {task.comment_count}
              </span>
            )}

            {/* Attachment count */}
            {task.attachment_count > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <Paperclip className="w-3 h-3" />
                {task.attachment_count}
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={handleMenuClick}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white transition-all"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                }}
              />
              <div className="absolute right-0 top-full mt-1 w-36 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-lg z-20 py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    onClick?.(task)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-secondary)]"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Compact version for calendar
export function TaskCardCompact({ task, onClick, color }) {
  return (
    <div
      className={cn(
        'px-2 py-1 rounded text-xs truncate cursor-pointer',
        'hover:brightness-110 transition-all'
      )}
      style={{
        backgroundColor: color || task.project_color || '#6366f1',
        color: 'white'
      }}
      onClick={() => onClick?.(task)}
    >
      {task.title}
    </div>
  )
}

export default TaskCard
