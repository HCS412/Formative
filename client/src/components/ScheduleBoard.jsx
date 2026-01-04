import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CalendarDays,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  Flame,
  LayoutGrid,
  ListFilter,
  MapPin,
  Music,
  PlaySquare,
  Sparkles,
  Timer,
  Twitter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

const DEFAULT_BEST_PRACTICES = {
  Instagram: { startHour: 9, endHour: 12, label: 'Morning engagement is strongest.' },
  TikTok: { startHour: 14, endHour: 18, label: 'Afternoons trend better for velocity.' },
  YouTube: { startHour: 11, endHour: 14, label: 'Lunch hours capture highest watch time.' },
  Twitter: { startHour: 10, endHour: 12, label: 'Threads land best mid-morning.' },
  Bluesky: { startHour: 9, endHour: 11, label: 'Early slots work best for discovery.' },
  default: { startHour: 9, endHour: 17, label: 'Standard business hours keep approvals fast.' }
}

const statusColors = {
  scheduled: 'text-teal-400 bg-teal-500/15 border border-teal-500/30',
  draft: 'text-orange-300 bg-orange-500/15 border border-orange-500/30',
  ready: 'text-blue-300 bg-blue-500/15 border border-blue-500/30',
  needs_review: 'text-yellow-300 bg-yellow-500/15 border border-yellow-500/30',
  blocked: 'text-red-300 bg-red-500/15 border border-red-500/30',
}

const platformIcons = {
  Instagram: Camera,
  TikTok: Music,
  YouTube: PlaySquare,
  Twitter,
  Bluesky: Cloud,
  default: Sparkles,
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7) // 7am - 7pm
const SLOT_HEIGHT = 72

const startOfWeek = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - (day === 0 ? 6 : day - 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const getWeekDays = (weekStart) => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })
}

const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const formatDayLabel = (date) => {
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

const buildDemoSchedule = (weekStart) => {
  const base = startOfWeek(weekStart)
  const day = (offset, hours, minutes = 0) => {
    const d = new Date(base)
    d.setDate(base.getDate() + offset)
    d.setHours(hours, minutes, 0, 0)
    return d.toISOString()
  }
  return [
    {
      id: 'sched-1',
      asset_title: 'Spring Lookbook',
      asset_version: 'v2',
      campaign: 'Spring Refresh',
      status: 'scheduled',
      duration_minutes: 60,
      best_time_tip: 'Instagram performs best before lunch.',
      platformSlots: [
        { id: 'sched-1-ig', platform: 'Instagram', start: day(1, 10), status: 'ready', offset_minutes: 0 },
        { id: 'sched-1-tt', platform: 'TikTok', start: day(1, 12, 30), status: 'draft', offset_minutes: 150 },
      ],
    },
    {
      id: 'sched-2',
      asset_title: 'Product Teaser Clips',
      asset_version: 'v1',
      campaign: 'Creator Lab',
      status: 'needs_review',
      duration_minutes: 45,
      best_time_tip: 'Short-form reacts fast to late afternoon drops.',
      platformSlots: [
        { id: 'sched-2-tt', platform: 'TikTok', start: day(2, 16), status: 'needs_review', offset_minutes: 0 },
        { id: 'sched-2-bsky', platform: 'Bluesky', start: day(2, 15), status: 'draft', offset_minutes: -60 },
      ],
    },
    {
      id: 'sched-3',
      asset_title: 'Long-form Review',
      asset_version: 'rc1',
      campaign: 'Gadget Launch',
      status: 'draft',
      duration_minutes: 90,
      best_time_tip: 'Midday premieres keep completion high.',
      platformSlots: [
        { id: 'sched-3-yt', platform: 'YouTube', start: day(4, 11, 30), status: 'scheduled', offset_minutes: 0 },
        { id: 'sched-3-twitter', platform: 'Twitter', start: day(4, 13), status: 'ready', offset_minutes: 90 },
      ],
    },
    {
      id: 'sched-4',
      asset_title: 'Creator Collab Thread',
      asset_version: 'v3',
      campaign: 'Collab Week',
      status: 'scheduled',
      duration_minutes: 30,
      best_time_tip: 'Align multi-platform drops within 90 minutes.',
      platformSlots: [
        { id: 'sched-4-twitter', platform: 'Twitter', start: day(0, 9), status: 'ready', offset_minutes: 0 },
        { id: 'sched-4-instagram', platform: 'Instagram', start: day(0, 8), status: 'ready', offset_minutes: -60 },
      ],
    },
  ]
}

const getPlatformWindow = (platform, bestPractices) => {
  return bestPractices[platform] || bestPractices.default || DEFAULT_BEST_PRACTICES.default
}

const isOutsideBest = (date, platform, bestPractices) => {
  const window = getPlatformWindow(platform, bestPractices)
  const hour = date.getHours() + date.getMinutes() / 60
  return hour < window.startHour || hour > window.endHour
}

const decorateSchedule = (items, bestPractices) => {
  const conflicts = {}
  const slots = []

  items.forEach((item) => {
    const duration = item.duration_minutes || 60
    ;(item.platformSlots || []).forEach((slot) => {
      const start = new Date(slot.start || item.start_time)
      const end = new Date(start.getTime() + duration * 60000)
      slots.push({ itemId: item.id, platform: slot.platform, start, end, asset_title: item.asset_title })
      if (isOutsideBest(start, slot.platform, bestPractices)) {
        const msg = `${slot.platform} slot is outside best time (${getPlatformWindow(slot.platform, bestPractices).startHour}:00-${getPlatformWindow(slot.platform, bestPractices).endHour}:00)`
        conflicts[item.id] = [...(conflicts[item.id] || []), msg]
      }
    })
  })

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i]
      const b = slots[j]
      if (a.platform !== b.platform) continue
      if (!sameDay(a.start, b.start)) continue
      if (a.start < b.end && b.start < a.end) {
        const msgA = `Overlaps ${b.asset_title} (${b.platform})`
        const msgB = `Overlaps ${a.asset_title} (${a.platform})`
        conflicts[a.itemId] = [...(conflicts[a.itemId] || []), msgA]
        conflicts[b.itemId] = [...(conflicts[b.itemId] || []), msgB]
      }
    }
  }

  return items.map((item) => ({
    ...item,
    warnings: conflicts[item.id] ? Array.from(new Set(conflicts[item.id])) : [],
  }))
}

const MiniCalendar = ({ activeDate, onSelect }) => {
  const [monthAnchor, setMonthAnchor] = useState(startOfWeek(activeDate))
  useEffect(() => {
    setMonthAnchor(startOfWeek(activeDate))
  }, [activeDate])

  const firstOfMonth = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), 1)
  const startDay = firstOfMonth.getDay() || 7
  const daysInMonth = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 0).getDate()

  const days = []
  for (let i = 1; i < startDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), d))
  }

  const weekOf = (day) => startOfWeek(day)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-teal-400" />
            Jump to week
          </CardTitle>
          <div className="flex items-center gap-2">
            <button
              className="p-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
              onClick={() => setMonthAnchor(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
              onClick={() => setMonthAnchor(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">{monthAnchor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-7 text-[10px] text-[var(--text-muted)] mb-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="text-center py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            if (!d) return <div key={`empty-${i}`} />
            const isCurrentWeek = sameDay(weekOf(d), weekOf(activeDate))
            const isToday = sameDay(d, new Date())
            return (
              <button
                key={d.toISOString()}
                onClick={() => onSelect(weekOf(d))}
                className={cn(
                  'h-9 rounded-lg text-sm border transition-colors',
                  isCurrentWeek ? 'border-teal-500/50 bg-teal-500/10 text-teal-100' : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-teal-500/50',
                  isToday && 'ring-1 ring-teal-500/40'
                )}
              >
                {d.getDate()}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function ScheduleBoard() {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()))
  const [view, setView] = useState('week')
  const [focusedDay, setFocusedDay] = useState(startOfWeek(new Date()))
  const [schedule, setSchedule] = useState([])
  const [bestPractices, setBestPractices] = useState(DEFAULT_BEST_PRACTICES)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ campaign: 'all', platform: 'all', status: 'all' })
  const { addToast } = useToast()

  useEffect(() => {
    loadSchedule()
  }, [weekStart])

  const loadSchedule = async () => {
    setLoading(true)
    try {
      const data = await api.getSchedule({ weekStart: weekStart.toISOString() })
      setSchedule(data.items || [])
      setBestPractices(data.bestPractices || DEFAULT_BEST_PRACTICES)
    } catch (error) {
      console.error('Schedule load failed, falling back to demo data:', error.message)
      setSchedule(buildDemoSchedule(weekStart))
      setBestPractices(DEFAULT_BEST_PRACTICES)
    } finally {
      setLoading(false)
    }
  }

  const decoratedSchedule = useMemo(
    () => decorateSchedule(schedule, bestPractices),
    [schedule, bestPractices]
  )

  const filteredItems = useMemo(() => {
    return decoratedSchedule.filter((item) => {
      const campaignMatch = filters.campaign === 'all' || item.campaign === filters.campaign
      const statusMatch = filters.status === 'all' || item.status === filters.status
      const platformMatch =
        filters.platform === 'all' ||
        (item.platformSlots || []).some((slot) => slot.platform === filters.platform)
      return campaignMatch && statusMatch && platformMatch
    })
  }, [decoratedSchedule, filters])

  const campaigns = Array.from(new Set(schedule.map((i) => i.campaign))).filter(Boolean)
  const platforms = Array.from(new Set(schedule.flatMap((i) => i.platformSlots?.map((p) => p.platform) || [])))
  const statuses = Array.from(new Set(schedule.map((i) => i.status)))

  const days = view === 'week' ? getWeekDays(weekStart) : [focusedDay]

  const handleDrop = async (itemId, day, hour) => {
    const baseDate = new Date(day)
    baseDate.setHours(hour, 0, 0, 0)
    const snapshot = JSON.parse(JSON.stringify(schedule))
    const updated = schedule.map((item) => {
      if (item.id !== itemId) return item
      const updatedSlots = (item.platformSlots || []).map((slot) => {
        const shifted = new Date(baseDate)
        const offset = slot.offset_minutes || 0
        shifted.setMinutes(shifted.getMinutes() + offset)
        return { ...slot, start: shifted.toISOString() }
      })
      return { ...item, start_time: baseDate.toISOString(), platformSlots: updatedSlots }
    })
    setSchedule(updated)
    try {
      await api.updateScheduleItem(itemId, { start_time: baseDate.toISOString() })
      addToast('Schedule updated', 'success')
    } catch (error) {
      console.error('Reschedule failed:', error.message)
      setSchedule(snapshot)
      addToast('Could not update schedule. Showing demo data instead.', 'error')
    }
  }

  const renderCard = (item, dayDate) => {
    const duration = item.duration_minutes || 60
    const slotsForDay = (item.platformSlots || []).filter((slot) => sameDay(new Date(slot.start || item.start_time), dayDate))
    if (slotsForDay.length === 0) return null
    const earliest = slotsForDay.reduce((earliestSlot, slot) => {
      const date = new Date(slot.start || item.start_time)
      if (!earliestSlot) return date
      return date < earliestSlot ? date : earliestSlot
    }, null)
    const top = ((earliest.getHours() + earliest.getMinutes() / 60) - 7) * SLOT_HEIGHT
    const height = Math.max((duration / 60) * SLOT_HEIGHT, SLOT_HEIGHT / 2)
    const hasWarnings = (item.warnings || []).length > 0

    return (
      <div
        key={`${item.id}-${dayDate.toISOString()}`}
        draggable
        onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
        className={cn(
          'absolute left-2 right-2 p-3 rounded-xl shadow-lg bg-[var(--bg-card)] border backdrop-blur',
          hasWarnings ? 'border-red-500/50 shadow-red-500/20' : 'border-[var(--border-color)]'
        )}
        style={{ top, height }}
      >
        {hasWarnings && (
          <div className="absolute inset-0 rounded-xl bg-red-500/10 pointer-events-none" />
        )}
        <div className="relative space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold leading-tight">{item.asset_title}</p>
              <p className="text-xs text-[var(--text-secondary)]">Asset {item.asset_version} • {item.campaign}</p>
            </div>
            <Badge className={cn('text-[10px] flex items-center gap-1', statusColors[item.status] || statusColors.draft)}>
              <span className="w-2 h-2 rounded-full bg-current" />
              {item.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {slotsForDay.map((slot) => {
              const Icon = platformIcons[slot.platform] || platformIcons.default
              const slotDate = new Date(slot.start || item.start_time)
              const outsideBest = isOutsideBest(slotDate, slot.platform, bestPractices)
              return (
                <div
                  key={slot.id}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1 rounded-lg text-xs border',
                    outsideBest ? 'border-amber-500/60 bg-amber-500/10 text-amber-100' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{slot.platform}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{slotDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
            <Clock className="w-3 h-3" />
            <span>{duration} min block</span>
            <MapPin className="w-3 h-3" />
            <span>Week {weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
          {item.best_time_tip && (
            <div className="flex items-start gap-2 text-xs text-teal-100 bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded-lg">
              <Flame className="w-3.5 h-3.5 mt-0.5" />
              <span>{item.best_time_tip}</span>
            </div>
          )}
          {hasWarnings && (
            <div className="flex items-start gap-2 text-xs text-red-200 bg-red-500/10 border border-red-500/40 px-2 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5" />
              <div className="space-y-1">
                {item.warnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderDayColumn = (day) => (
    <div key={day.toISOString()} className="border-l border-[var(--border-color)] relative">
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)] px-3 py-3 border-b border-[var(--border-color)]">
        <p className="text-sm font-semibold">{formatDayLabel(day)}</p>
        <p className="text-xs text-[var(--text-muted)]">Tap a slot to drop cards</p>
      </div>
      <div className="relative" style={{ height: SLOT_HEIGHT * HOURS.length }}>
        {HOURS.map((hour) => (
          <div
            key={hour}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const itemId = e.dataTransfer.getData('text/plain')
              if (!itemId) return
              handleDrop(itemId, day, hour)
            }}
            className="absolute inset-x-0 border-b border-[var(--border-color)] group"
            style={{ top: (hour - 7) * SLOT_HEIGHT, height: SLOT_HEIGHT }}
          >
            <div className="absolute left-2 top-2 text-[11px] text-[var(--text-muted)]">
              {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-teal-500/5 border border-dashed border-teal-500/40" />
          </div>
        ))}
        {filteredItems.map((item) => renderCard(item, day))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Content Schedule</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Drag deliverables into time slots, track conflicts, and follow platform best practices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'week' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('week')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Week
          </Button>
          <Button
            variant={view === 'day' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setView('day')}
          >
            <Timer className="w-4 h-4 mr-2" />
            Day
          </Button>
          <div className="flex items-center gap-2 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const prev = new Date(weekStart)
                prev.setDate(prev.getDate() - 7)
                setWeekStart(prev)
                setFocusedDay(prev)
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const next = new Date(weekStart)
                next.setDate(next.getDate() + 7)
                setWeekStart(next)
                setFocusedDay(next)
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-teal-400" />
                Filters
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <select
                  value={filters.campaign}
                  onChange={(e) => setFilters((prev) => ({ ...prev, campaign: e.target.value }))}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All campaigns</option>
                  {campaigns.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={filters.platform}
                  onChange={(e) => setFilters((prev) => ({ ...prev, platform: e.target.value }))}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All platforms</option>
                  {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All statuses</option>
                  {statuses.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid" style={{ gridTemplateColumns: `120px repeat(${days.length}, minmax(0, 1fr))` }}>
              <div className="border-r border-[var(--border-color)] bg-[var(--bg-secondary)]">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-[72px] flex items-start justify-end pr-3 text-[11px] text-[var(--text-muted)] pt-2">
                    {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  </div>
                ))}
              </div>
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-20">
                  <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
                </div>
              ) : (
                days.map(renderDayColumn)
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <MiniCalendar activeDate={weekStart} onSelect={(d) => { setWeekStart(d); setFocusedDay(d) }} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                Best time tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(bestPractices).filter(([key]) => key !== 'default').map(([platform, window]) => {
                const Icon = platformIcons[platform] || platformIcons.default
                return (
                  <div key={platform} className="p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Icon className="w-4 h-4" />
                        <span>{platform}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {window.startHour}:00 - {window.endHour}:00
                      </Badge>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">{window.label}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
