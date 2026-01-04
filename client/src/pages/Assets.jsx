import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { 
  BarChart3, 
  CalendarClock, 
  CheckCircle2,
  Clock,
  FileText,
  Image as ImageIcon,
  Activity,
  Play,
  Upload
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Avatar, Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { usePermissions } from '@/context/PermissionContext'
import { cn, formatDate } from '@/lib/utils'

const tabs = [
  { id: 'library', label: 'Library', description: 'Organize and share approved assets.', icon: ImageIcon },
  { id: 'scheduler', label: 'Scheduler', description: 'Plan drops and keep collaborators in sync.', icon: CalendarClock },
  { id: 'analytics', label: 'Analytics', description: 'Track usage, reach, and engagement.', icon: BarChart3 },
]

const demoLibrary = [
  {
    id: 1,
    title: 'Spring Lookbook',
    type: 'Video',
    size: '240 MB',
    updated_at: '2024-04-02',
    owner: 'Sasha Nguyen',
    status: 'ready',
    tags: ['Campaign', 'Approved'],
  },
  {
    id: 2,
    title: 'Product Stills v3',
    type: 'Image Set',
    size: '86 MB',
    updated_at: '2024-03-28',
    owner: 'Jordan Park',
    status: 'processing',
    tags: ['Drop', 'Edited'],
  },
  {
    id: 3,
    title: 'UGC Snippets',
    type: 'Clips',
    size: '45 MB',
    updated_at: '2024-03-20',
    owner: 'Taylor Smith',
    status: 'ready',
    tags: ['Social', 'Organic'],
  },
]

const demoSchedule = [
  {
    id: 1,
    title: 'Summer Drop Teaser',
    channel: 'Instagram Reels',
    dueDate: '2024-04-10T15:00:00Z',
    owner: 'Taylor Smith',
    status: 'scheduled',
  },
  {
    id: 2,
    title: 'Creator Toolkit Email',
    channel: 'Email',
    dueDate: '2024-04-12T17:00:00Z',
    owner: 'Jordan Park',
    status: 'draft',
  },
  {
    id: 3,
    title: 'Paid Media Cutdown',
    channel: 'TikTok Spark',
    dueDate: '2024-04-15T18:30:00Z',
    owner: 'Sasha Nguyen',
    status: 'in-review',
  },
]

const demoAnalytics = {
  usage: [
    { label: 'Downloads', value: 482, change: '+18%' },
    { label: 'Shares', value: 126, change: '+6%' },
    { label: 'Placements', value: 34, change: '+9%' },
  ],
  topAssets: [
    { title: 'Spring Lookbook', impressions: '128k', ctr: '3.4%', lift: '+14%' },
    { title: 'UGC Snippets', impressions: '92k', ctr: '2.1%', lift: '+7%' },
  ],
}

export function Assets() {
  const { tab } = useParams()
  const navigate = useNavigate()
  const { isFeatureEnabled, hasAnyPermission, hasTier, loading } = usePermissions()

  const hasAssetsAccess = useMemo(() => (
    isFeatureEnabled('assets') ||
    hasAnyPermission('assets:access', 'library:view') ||
    hasTier('pro')
  ), [hasAnyPermission, hasTier, isFeatureEnabled])

  const defaultTab = tabs[0].id
  const [activeTab, setActiveTab] = useState(
    tab && tabs.find((t) => t.id === tab) ? tab : defaultTab
  )

  useEffect(() => {
    if (!tab) {
      navigate(`/dashboard/assets/${defaultTab}`, { replace: true })
      return
    }

    if (tabs.find((t) => t.id === tab)) {
      setActiveTab(tab)
    } else {
      navigate(`/dashboard/assets/${defaultTab}`, { replace: true })
    }
  }, [defaultTab, navigate, tab])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    navigate(`/dashboard/assets/${tabId}`, { replace: true })
  }

  if (!loading && !hasAssetsAccess) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">Creative control center</p>
          <h1 className="text-2xl font-bold text-white">Assets</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex">
            <FileText className="w-4 h-4 mr-2" />
            Guidelines
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {tabs.map((tabConfig) => (
          <button
            key={tabConfig.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border transition-colors text-left',
              activeTab === tabConfig.id
                ? 'border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 text-white'
                : 'border-[var(--border-color)] bg-[var(--bg-secondary)]/60 text-[var(--text-secondary)] hover:text-white hover:border-teal-500/30'
            )}
            onClick={() => handleTabChange(tabConfig.id)}
          >
            <tabConfig.icon className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-semibold">{tabConfig.label}</p>
              <p className="text-sm mt-1">{tabConfig.description}</p>
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <p className="text-[var(--text-secondary)]">Checking access…</p>
          </CardContent>
        </Card>
      )}

      {!loading && (
        <div className="space-y-6">
          {activeTab === 'library' && <LibraryTab />}
          {activeTab === 'scheduler' && <SchedulerTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      )}
    </DashboardLayout>
  )
}

function LibraryTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {demoLibrary.map((asset) => (
        <Card key={asset.id} className="bg-[var(--bg-secondary)]/80 border-[var(--border-color)]">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-white">{asset.title}</CardTitle>
              <p className="text-sm text-[var(--text-secondary)]">{asset.type} · {asset.size}</p>
            </div>
            <Badge variant={asset.status === 'ready' ? 'success' : 'secondary'}>
              {asset.status === 'ready' ? 'Ready' : 'Processing'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center">
                  {asset.type === 'Video' ? <Play className="w-5 h-5 text-teal-400" /> : <ImageIcon className="w-5 h-5 text-teal-400" />}
                </div>
                <div>
                  <p className="text-sm text-white">Updated {formatDate(asset.updated_at)}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Owner: {asset.owner}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {asset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> Brand safe</span>
              <Button variant="outline" size="sm">Open</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SchedulerTab() {
  return (
    <Card className="bg-[var(--bg-secondary)]/80 border-[var(--border-color)]">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-white">Upcoming placements</CardTitle>
          <p className="text-sm text-[var(--text-secondary)]">Coordinate publishes with creators and partners.</p>
        </div>
        <Button variant="outline">
          <CalendarClock className="w-4 h-4 mr-2" />
          Add slot
        </Button>
      </CardHeader>
      <CardContent className="divide-y divide-[var(--border-color)]">
        {demoSchedule.map((item) => (
          <div key={item.id} className="py-4 flex flex-wrap md:flex-nowrap md:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold">{item.title}</p>
              <p className="text-sm text-[var(--text-secondary)]">{item.channel}</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <Badge variant="secondary" className="capitalize">{item.status.replace('-', ' ')}</Badge>
              <span>Due {formatDate(item.dueDate)}</span>
              <div className="flex items-center gap-2">
                <Avatar name={item.owner} size="xs" />
                <span>{item.owner}</span>
              </div>
              <Button size="sm" variant="ghost">View brief</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function AnalyticsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card className="bg-[var(--bg-secondary)]/80 border-[var(--border-color)]">
          <CardHeader>
            <CardTitle className="text-white">Usage</CardTitle>
            <p className="text-sm text-[var(--text-secondary)]">Asset momentum in the last 30 days.</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {demoAnalytics.usage.map((metric) => (
              <div key={metric.label} className="p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]">
                <p className="text-sm text-[var(--text-secondary)]">{metric.label}</p>
                <p className="text-xl font-bold text-white">{metric.value}</p>
                <p className="text-xs text-teal-400">{metric.change} vs last period</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[var(--bg-secondary)]/80 border-[var(--border-color)]">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-white">Top assets</CardTitle>
              <p className="text-sm text-[var(--text-secondary)]">Most reused by teams and partners.</p>
            </div>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAnalytics.topAssets.map((asset) => (
              <div key={asset.title} className="p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold">{asset.title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{asset.impressions} impressions</p>
                  </div>
                  <Badge variant="secondary">{asset.lift} lift</Badge>
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1"><Play className="w-4 h-4" /> CTR {asset.ctr}</span>
                  <span className="flex items-center gap-1"><BarChart3 className="w-4 h-4" /> Reach {asset.impressions}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card className="h-full bg-[var(--bg-secondary)]/80 border-[var(--border-color)]">
          <CardHeader>
            <CardTitle className="text-white">Engagement trend</CardTitle>
            <p className="text-sm text-[var(--text-secondary)]">Week-over-week lift across placements.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-teal-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">Week {index + 1}</span>
                    <span className="text-teal-400">+{(index + 2) * 5}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500" style={{ width: `${55 + index * 10}%` }} />
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Keep momentum</p>
                <p className="text-sm text-[var(--text-secondary)]">Schedule your next drop to keep the lift trending.</p>
              </div>
              <Button>
                <Clock className="w-4 h-4 mr-2" />
                Plan slot
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
