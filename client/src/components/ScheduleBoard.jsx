import { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Image,
  Video,
  FileText,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  GripVertical,
  MoreVertical,
  Trash2,
  Edit3
} from 'lucide-react'
import { Card, Badge, Button, Modal, Input } from '@/components/ui'
import { cn, formatDate } from '@/lib/utils'

// Generate days for a month view
const generateMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []

  // Add empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1)
    days.push({
      date: prevMonthDay,
      isCurrentMonth: false,
      dayNumber: prevMonthDay.getDate()
    })
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
      dayNumber: i
    })
  }

  // Add empty cells to complete the grid (always 6 rows)
  const remainingCells = 42 - days.length
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      dayNumber: i
    })
  }

  return days
}

// Generate week days for week view
const generateWeekDays = (startDate) => {
  const days = []
  const start = new Date(startDate)
  start.setDate(start.getDate() - start.getDay()) // Start from Sunday

  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push({
      date,
      isCurrentMonth: true,
      dayNumber: date.getDate()
    })
  }

  return days
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function ScheduleBoard({ scheduledAssets = [], onScheduleAsset, onCancelSlot, onEditSlot }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month') // 'month' or 'week'
  const [selectedDate, setSelectedDate] = useState(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [draggedAsset, setDraggedAsset] = useState(null)
  const [hoveredDate, setHoveredDate] = useState(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const days = viewMode === 'month'
    ? generateMonthDays(year, month)
    : generateWeekDays(currentDate)

  const goToPrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1))
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() - 7)
      setCurrentDate(newDate)
    }
  }

  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1))
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + 7)
      setCurrentDate(newDate)
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const getAssetsForDate = (date) => {
    return scheduledAssets.filter(asset => {
      if (!asset.scheduled_at) return false
      const assetDate = new Date(asset.scheduled_at)
      return assetDate.getDate() === date.getDate() &&
             assetDate.getMonth() === date.getMonth() &&
             assetDate.getFullYear() === date.getFullYear()
    })
  }

  const getFormatIcon = (format) => {
    switch (format) {
      case 'video':
      case 'reel':
        return <Video className="w-3 h-3" />
      case 'image':
      case 'carousel':
        return <Image className="w-3 h-3" />
      default:
        return <FileText className="w-3 h-3" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-500'
      case 'scheduled': return 'bg-blue-500'
      case 'approved': return 'bg-teal-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: 'border-l-pink-500',
      tiktok: 'border-l-cyan-500',
      youtube: 'border-l-red-500',
      twitter: 'border-l-blue-500',
      facebook: 'border-l-blue-600',
      linkedin: 'border-l-blue-700',
      bluesky: 'border-l-sky-500',
      threads: 'border-l-gray-500'
    }
    return colors[platform] || 'border-l-gray-500'
  }

  // Drag and drop handlers
  const handleDragStart = (e, asset) => {
    setDraggedAsset(asset)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', asset.id)
  }

  const handleDragOver = (e, date) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setHoveredDate(date)
  }

  const handleDragLeave = () => {
    setHoveredDate(null)
  }

  const handleDrop = (e, date) => {
    e.preventDefault()
    setHoveredDate(null)

    if (draggedAsset && onEditSlot) {
      const newScheduledAt = new Date(date)
      // Keep the same time if it exists
      if (draggedAsset.scheduled_at) {
        const oldDate = new Date(draggedAsset.scheduled_at)
        newScheduledAt.setHours(oldDate.getHours(), oldDate.getMinutes())
      } else {
        // Default to 10:00 AM
        newScheduledAt.setHours(10, 0, 0, 0)
      }

      onEditSlot(draggedAsset.schedule_slot_id || draggedAsset.id, {
        scheduledAt: newScheduledAt.toISOString()
      })
    }

    setDraggedAsset(null)
  }

  const handleDragEnd = () => {
    setDraggedAsset(null)
    setHoveredDate(null)
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setShowScheduleModal(true)
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            {viewMode === 'month'
              ? `${MONTHS[month]} ${year}`
              : `Week of ${formatDate(days[0].date)}`
            }
          </h3>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={goToPrevious}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={goToToday}>
              Today
            </Button>
            <Button size="sm" variant="ghost" onClick={goToNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('week')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              viewMode === 'week'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-white'
            )}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              viewMode === 'month'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-white'
            )}
          >
            Month
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-4 overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-[var(--text-muted)] py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day Cells */}
        <div className={cn(
          "grid grid-cols-7 gap-1",
          viewMode === 'week' ? "grid-rows-1" : "grid-rows-6"
        )}>
          {days.map((day, idx) => {
            const assetsForDay = getAssetsForDate(day.date)
            const isDropTarget = hoveredDate &&
              hoveredDate.getTime() === day.date.getTime()

            return (
              <div
                key={idx}
                onClick={() => handleDateClick(day.date)}
                onDragOver={(e) => handleDragOver(e, day.date)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day.date)}
                className={cn(
                  "min-h-[100px] p-1 rounded-lg border transition-all cursor-pointer",
                  day.isCurrentMonth
                    ? "bg-[var(--bg-secondary)] border-[var(--border-color)]"
                    : "bg-[var(--bg-primary)] border-transparent opacity-50",
                  isToday(day.date) && "ring-2 ring-teal-500 ring-offset-1 ring-offset-[var(--bg-card)]",
                  isDropTarget && "bg-teal-500/20 border-teal-500",
                  "hover:border-[var(--border-hover)]"
                )}
              >
                {/* Day Number */}
                <div className={cn(
                  "text-sm mb-1 flex items-center justify-between",
                  isToday(day.date) ? "text-teal-400 font-bold" : "text-[var(--text-secondary)]"
                )}>
                  <span>{day.dayNumber}</span>
                  {assetsForDay.length > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400">
                      {assetsForDay.length}
                    </span>
                  )}
                </div>

                {/* Assets for this day */}
                <div className="space-y-1 max-h-[80px] overflow-y-auto">
                  {assetsForDay.slice(0, viewMode === 'week' ? 5 : 3).map((asset) => (
                    <div
                      key={asset.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, asset)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "group flex items-center gap-1 p-1 rounded text-xs",
                        "bg-[var(--bg-card)] border-l-2 cursor-grab active:cursor-grabbing",
                        "hover:bg-[var(--bg-hover)] transition-colors",
                        getPlatformColor(asset.platform)
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GripVertical className="w-3 h-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 flex-shrink-0" />
                      <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", getStatusColor(asset.status))} />
                      {getFormatIcon(asset.format)}
                      <span className="truncate flex-1">{asset.name}</span>
                      {asset.scheduled_at && (
                        <span className="text-[var(--text-muted)] flex-shrink-0">
                          {new Date(asset.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  ))}
                  {assetsForDay.length > (viewMode === 'week' ? 5 : 3) && (
                    <div className="text-xs text-[var(--text-muted)] text-center py-1">
                      +{assetsForDay.length - (viewMode === 'week' ? 5 : 3)} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
        <span className="font-medium">Status:</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Live</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span>Approved</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Failed</span>
        </div>
      </div>

      {/* Drag hint */}
      <p className="text-xs text-[var(--text-muted)]">
        Drag and drop scheduled items to reschedule them.
      </p>
    </div>
  )
}

export default ScheduleBoard
