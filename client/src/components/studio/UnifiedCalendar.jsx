import { useState, useEffect, useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  setHours,
  setMinutes,
  getHours,
  getMinutes
} from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  CheckSquare,
  Image,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import api from '@/lib/api'
import { TaskCardCompact } from './TaskCard'

const VIEW_MODES = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day'
}

// Platform colors (same as ScheduleBoard)
const platformColors = {
  instagram: '#E4405F',
  tiktok: '#000000',
  youtube: '#FF0000',
  twitter: '#1DA1F2',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  pinterest: '#BD081C',
  snapchat: '#FFFC00'
}

// Task priority colors
const taskColors = {
  urgent: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6'
}

export function UnifiedCalendar({ onTaskClick, onAssetClick, onCreateTask }) {
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [assetSchedules, setAssetSchedules] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState({
    showTasks: true,
    showAssets: true,
    projectId: null
  })

  // Calculate date range based on view
  const dateRange = useMemo(() => {
    if (viewMode === VIEW_MODES.MONTH) {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 })
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 })
      return { start, end }
    } else if (viewMode === VIEW_MODES.WEEK) {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 })
      const end = endOfWeek(currentDate, { weekStartsOn: 0 })
      return { start, end }
    } else {
      return { start: currentDate, end: currentDate }
    }
  }, [currentDate, viewMode])

  // Fetch data
  useEffect(() => {
    fetchData()
  }, [dateRange])

  const fetchData = async () => {
    try {
      setLoading(true)
      const startDate = format(dateRange.start, 'yyyy-MM-dd')
      const endDate = format(dateRange.end, 'yyyy-MM-dd')

      const [tasksRes, assetsRes, projectsRes] = await Promise.all([
        api.getTasksForCalendar(startDate, endDate, true),
        api.getAllScheduledAssets({ startDate, endDate }),
        api.getProjects()
      ])

      setTasks(tasksRes.tasks || [])
      setAssetSchedules(assetsRes.scheduleSlots || [])
      setProjects(projectsRes.projects || [])
    } catch (error) {
      console.error('Failed to fetch calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Navigate
  const navigate = (direction) => {
    if (viewMode === VIEW_MODES.MONTH) {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
    } else if (viewMode === VIEW_MODES.WEEK) {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1))
    } else {
      setCurrentDate(direction === 'prev' ? addDays(currentDate, -1) : addDays(currentDate, 1))
    }
  }

  const goToToday = () => setCurrentDate(new Date())

  // Get items for a specific day
  const getItemsForDay = (day) => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const items = []

    if (filters.showTasks) {
      const dayTasks = tasks.filter(t => {
        if (t.scheduled_start) {
          return format(parseISO(t.scheduled_start), 'yyyy-MM-dd') === dayStr
        }
        if (t.due_date) {
          return t.due_date.split('T')[0] === dayStr
        }
        return false
      })

      if (filters.projectId) {
        items.push(...dayTasks.filter(t =>
          filters.projectId === 'inbox' ? !t.project_id : t.project_id === parseInt(filters.projectId)
        ).map(t => ({ type: 'task', data: t })))
      } else {
        items.push(...dayTasks.map(t => ({ type: 'task', data: t })))
      }
    }

    if (filters.showAssets) {
      const dayAssets = assetSchedules.filter(a => {
        const scheduled = format(parseISO(a.scheduled_at), 'yyyy-MM-dd')
        return scheduled === dayStr
      })
      items.push(...dayAssets.map(a => ({ type: 'asset', data: a })))
    }

    // Sort by time
    items.sort((a, b) => {
      const aTime = a.type === 'task' ? (a.data.scheduled_start || a.data.due_date) : a.data.scheduled_at
      const bTime = b.type === 'task' ? (b.data.scheduled_start || b.data.due_date) : b.data.scheduled_at
      return new Date(aTime) - new Date(bTime)
    })

    return items
  }

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = []
    let day = dateRange.start

    while (day <= dateRange.end) {
      days.push(day)
      day = addDays(day, 1)
    }

    return days
  }, [dateRange])

  // Week days header
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Hours for day view
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('prev')}
              className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('next')}
              className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Current Date */}
          <h2 className="text-xl font-semibold text-white">
            {viewMode === VIEW_MODES.DAY
              ? format(currentDate, 'EEEE, MMMM d, yyyy')
              : format(currentDate, 'MMMM yyyy')}
          </h2>

          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:text-white hover:border-teal-500/50 transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-1">
            {Object.entries(VIEW_MODES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setViewMode(value)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-md transition-colors',
                  viewMode === value
                    ? 'bg-teal-500 text-white'
                    : 'text-[var(--text-secondary)] hover:text-white'
                )}
              >
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Create Task */}
          <button
            onClick={() => onCreateTask?.()}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 py-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showTasks}
              onChange={(e) => setFilters(prev => ({ ...prev, showTasks: e.target.checked }))}
              className="w-4 h-4 rounded border-[var(--border-color)] text-teal-500 focus:ring-teal-500"
            />
            <CheckSquare className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-[var(--text-secondary)]">Tasks</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showAssets}
              onChange={(e) => setFilters(prev => ({ ...prev, showAssets: e.target.checked }))}
              className="w-4 h-4 rounded border-[var(--border-color)] text-teal-500 focus:ring-teal-500"
            />
            <Image className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-[var(--text-secondary)]">Assets</span>
          </label>
        </div>

        {filters.showTasks && (
          <select
            value={filters.projectId || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, projectId: e.target.value || null }))}
            className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            <option value="">All Projects</option>
            <option value="inbox">Inbox</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
        </div>
      ) : viewMode === VIEW_MODES.MONTH ? (
        <div className="flex-1 mt-4">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-px mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-[var(--text-secondary)] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-[var(--border-color)] rounded-lg overflow-hidden">
            {calendarDays.map((day, idx) => {
              const items = getItemsForDay(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isSelected = isToday(day)

              return (
                <div
                  key={idx}
                  className={cn(
                    'min-h-[100px] bg-[var(--bg-secondary)] p-1',
                    !isCurrentMonth && 'bg-[var(--bg-primary)] opacity-50'
                  )}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        'w-7 h-7 flex items-center justify-center rounded-full text-sm',
                        isSelected
                          ? 'bg-teal-500 text-white'
                          : 'text-[var(--text-secondary)]'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-1">
                    {items.slice(0, 3).map((item, i) => (
                      <div key={i}>
                        {item.type === 'task' ? (
                          <TaskCardCompact
                            task={item.data}
                            onClick={() => onTaskClick?.(item.data)}
                            color={item.data.project_color || taskColors[item.data.priority]}
                          />
                        ) : (
                          <div
                            className="px-2 py-1 rounded text-xs truncate cursor-pointer hover:brightness-110 transition-all text-white"
                            style={{ backgroundColor: platformColors[item.data.platform] || '#6366f1' }}
                            onClick={() => onAssetClick?.(item.data)}
                          >
                            {item.data.asset_name || 'Asset'}
                          </div>
                        )}
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="text-xs text-[var(--text-secondary)] text-center">
                        +{items.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : viewMode === VIEW_MODES.WEEK ? (
        <div className="flex-1 mt-4 overflow-x-auto">
          {/* Week View */}
          <div className="min-w-[800px]">
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-px mb-2">
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'text-center py-2',
                    isToday(day) && 'bg-teal-500/10 rounded-t-lg'
                  )}
                >
                  <div className="text-xs text-[var(--text-secondary)]">
                    {format(day, 'EEE')}
                  </div>
                  <div
                    className={cn(
                      'text-lg font-semibold',
                      isToday(day) ? 'text-teal-400' : 'text-white'
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-7 gap-px bg-[var(--border-color)] rounded-lg overflow-hidden min-h-[400px]">
              {calendarDays.map((day, idx) => {
                const items = getItemsForDay(day)

                return (
                  <div
                    key={idx}
                    className={cn(
                      'bg-[var(--bg-secondary)] p-2',
                      isToday(day) && 'bg-teal-500/5'
                    )}
                  >
                    <div className="space-y-2">
                      {items.map((item, i) => (
                        <div key={i}>
                          {item.type === 'task' ? (
                            <div
                              className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] cursor-pointer hover:border-teal-500/50 transition-colors"
                              onClick={() => onTaskClick?.(item.data)}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {item.data.scheduled_start && (
                                  <span className="text-xs text-[var(--text-secondary)]">
                                    {format(parseISO(item.data.scheduled_start), 'h:mm a')}
                                  </span>
                                )}
                                {item.data.project_color && (
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: item.data.project_color }}
                                  />
                                )}
                              </div>
                              <p className="text-sm text-white truncate">{item.data.title}</p>
                            </div>
                          ) : (
                            <div
                              className="p-2 rounded-lg cursor-pointer hover:brightness-110 transition-all"
                              style={{ backgroundColor: platformColors[item.data.platform] || '#6366f1' }}
                              onClick={() => onAssetClick?.(item.data)}
                            >
                              <div className="text-xs text-white/80 mb-1">
                                {format(parseISO(item.data.scheduled_at), 'h:mm a')}
                              </div>
                              <p className="text-sm text-white truncate">
                                {item.data.asset_name || 'Asset'}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Day View */
        <div className="flex-1 mt-4 overflow-y-auto">
          <div className="relative">
            {hours.map(hour => {
              const dayItems = getItemsForDay(currentDate).filter(item => {
                const time = item.type === 'task'
                  ? (item.data.scheduled_start || item.data.due_date)
                  : item.data.scheduled_at
                if (!time) return hour === 9 // Default to 9 AM
                return getHours(parseISO(time)) === hour
              })

              return (
                <div
                  key={hour}
                  className="flex border-b border-[var(--border-color)] min-h-[60px]"
                >
                  {/* Time Label */}
                  <div className="w-20 flex-shrink-0 pr-3 py-2 text-right">
                    <span className="text-xs text-[var(--text-secondary)]">
                      {format(setHours(new Date(), hour), 'h a')}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="flex-1 py-1 space-y-1">
                    {dayItems.map((item, i) => (
                      <div key={i}>
                        {item.type === 'task' ? (
                          <div
                            className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] cursor-pointer hover:border-teal-500/50 transition-colors"
                            onClick={() => onTaskClick?.(item.data)}
                          >
                            <div className="flex items-center gap-2">
                              {item.data.project_color && (
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: item.data.project_color }}
                                />
                              )}
                              <p className="text-sm text-white">{item.data.title}</p>
                              {item.data.estimated_minutes && (
                                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.data.estimated_minutes}m
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            className="p-2 rounded-lg cursor-pointer hover:brightness-110 transition-all"
                            style={{ backgroundColor: platformColors[item.data.platform] || '#6366f1' }}
                            onClick={() => onAssetClick?.(item.data)}
                          >
                            <p className="text-sm text-white">
                              {item.data.asset_name || 'Asset'} - {item.data.platform}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-6 pt-4 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-teal-400" />
          <span className="text-xs text-[var(--text-secondary)]">Tasks</span>
        </div>
        <div className="flex items-center gap-4">
          {Object.entries(platformColors).slice(0, 5).map(([platform, color]) => (
            <div key={platform} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
              <span className="text-xs text-[var(--text-secondary)] capitalize">{platform}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UnifiedCalendar
