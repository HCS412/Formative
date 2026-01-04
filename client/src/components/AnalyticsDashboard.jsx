import { useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  FileDown
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui'
import { cn, formatNumber } from '@/lib/utils'

// KPI Card Component
function KPICard({ title, value, change, changeLabel, icon: Icon, trend, color = 'teal' }) {
  const isPositive = trend === 'up'
  const colorClasses = {
    teal: 'bg-teal-500/20 text-teal-400',
    green: 'bg-green-500/20 text-green-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/20 text-orange-400',
    pink: 'bg-pink-500/20 text-pink-400'
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-sm',
            isPositive ? 'text-green-400' : 'text-red-400'
          )}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-[var(--text-secondary)]">{title}</p>
        {changeLabel && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{changeLabel}</p>
        )}
      </div>
    </Card>
  )
}

// Simple Bar Chart Component
function SimpleBarChart({ data, height = 200 }) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full bg-gradient-to-t from-teal-500 to-cyan-500 rounded-t-lg transition-all duration-300 hover:from-teal-400 hover:to-cyan-400"
            style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: 4 }}
          />
          <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

// Donut Chart Component
function DonutChart({ data, size = 150 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  let currentAngle = 0

  const colors = ['#14b8a6', '#f472b6', '#f97316', '#3b82f6', '#8b5cf6', '#ef4444']

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        {data.map((item, i) => {
          const percentage = (item.value / total) * 100
          const angle = (percentage / 100) * 360
          const startAngle = currentAngle
          currentAngle += angle

          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
          const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180)
          const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180)
          const largeArc = angle > 180 ? 1 : 0

          return (
            <path
              key={i}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={colors[i % colors.length]}
              className="transition-opacity hover:opacity-80"
            />
          )
        })}
        <circle cx="50" cy="50" r="25" fill="var(--bg-card)" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold">{total.toLocaleString()}</p>
          <p className="text-xs text-[var(--text-muted)]">Total</p>
        </div>
      </div>
    </div>
  )
}

// Progress Bar Component
function ProgressBar({ label, value, max, color = 'teal' }) {
  const percentage = Math.min((value / max) * 100, 100)
  const colorClasses = {
    teal: 'bg-teal-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500'
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-[var(--text-muted)]">{formatNumber(value)}</span>
      </div>
      <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function AnalyticsDashboard({ onExport }) {
  const [dateRange, setDateRange] = useState('30d')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Demo analytics data
  const kpis = {
    totalEarnings: { value: '$24,850', change: 12.5, trend: 'up' },
    totalReach: { value: '1.2M', change: 8.3, trend: 'up' },
    engagementRate: { value: '4.8%', change: -2.1, trend: 'down' },
    completedCampaigns: { value: '18', change: 15, trend: 'up' },
    avgCampaignValue: { value: '$1,380', change: 5.2, trend: 'up' },
    conversionRate: { value: '3.2%', change: 0.8, trend: 'up' }
  }

  const monthlyEarnings = [
    { label: 'Jul', value: 2500 },
    { label: 'Aug', value: 3200 },
    { label: 'Sep', value: 2800 },
    { label: 'Oct', value: 4100 },
    { label: 'Nov', value: 3800 },
    { label: 'Dec', value: 5200 },
  ]

  const platformBreakdown = [
    { label: 'Instagram', value: 45, color: 'pink' },
    { label: 'TikTok', value: 30, color: 'teal' },
    { label: 'YouTube', value: 15, color: 'orange' },
    { label: 'Twitter', value: 10, color: 'blue' },
  ]

  const contentPerformance = [
    { label: 'Reels', value: 125000, max: 150000, color: 'pink' },
    { label: 'Videos', value: 98000, max: 150000, color: 'teal' },
    { label: 'Carousels', value: 76000, max: 150000, color: 'blue' },
    { label: 'Stories', value: 54000, max: 150000, color: 'purple' },
    { label: 'Posts', value: 42000, max: 150000, color: 'orange' },
  ]

  const engagementMetrics = [
    { label: 'Impressions', value: 1250000, icon: Eye },
    { label: 'Likes', value: 48500, icon: Heart },
    { label: 'Comments', value: 12300, icon: MessageCircle },
    { label: 'Shares', value: 8900, icon: Share2 },
  ]

  const dateRanges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' },
  ]

  const handleRefresh = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const handleExport = async (format) => {
    setExporting(true)
    try {
      if (onExport) {
        await onExport(format, dateRange)
      } else {
        // Demo export
        await new Promise(resolve => setTimeout(resolve, 1500))
        const data = {
          dateRange,
          exportedAt: new Date().toISOString(),
          kpis,
          monthlyEarnings,
          platformBreakdown,
          contentPerformance,
          engagementMetrics
        }

        if (format === 'json') {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `analytics-${dateRange}-${Date.now()}.json`
          a.click()
          URL.revokeObjectURL(url)
        } else if (format === 'csv') {
          const csv = [
            'Metric,Value,Change',
            `Total Earnings,${kpis.totalEarnings.value},${kpis.totalEarnings.change}%`,
            `Total Reach,${kpis.totalReach.value},${kpis.totalReach.change}%`,
            `Engagement Rate,${kpis.engagementRate.value},${kpis.engagementRate.change}%`,
            `Completed Campaigns,${kpis.completedCampaigns.value},${kpis.completedCampaigns.change}%`,
          ].join('\n')

          const blob = new Blob([csv], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `analytics-${dateRange}-${Date.now()}.csv`
          a.click()
          URL.revokeObjectURL(url)
        }
      }
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Analytics</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Track your performance and campaign metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range */}
          <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg-secondary)]">
            {dateRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setDateRange(range.id)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  dateRange === range.id
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'text-[var(--text-secondary)] hover:text-white'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>

          <div className="relative group">
            <Button size="sm" variant="secondary" disabled={exporting}>
              <FileDown className="w-4 h-4 mr-1" />
              Export
            </Button>
            <div className="absolute right-0 top-full mt-1 w-32 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--bg-secondary)]"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--bg-secondary)]"
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="Total Earnings"
          value={kpis.totalEarnings.value}
          change={kpis.totalEarnings.change}
          trend={kpis.totalEarnings.trend}
          icon={DollarSign}
          color="green"
          changeLabel="vs last period"
        />
        <KPICard
          title="Total Reach"
          value={kpis.totalReach.value}
          change={kpis.totalReach.change}
          trend={kpis.totalReach.trend}
          icon={Eye}
          color="blue"
          changeLabel="vs last period"
        />
        <KPICard
          title="Engagement Rate"
          value={kpis.engagementRate.value}
          change={kpis.engagementRate.change}
          trend={kpis.engagementRate.trend}
          icon={Heart}
          color="pink"
          changeLabel="vs last period"
        />
        <KPICard
          title="Campaigns"
          value={kpis.completedCampaigns.value}
          change={kpis.completedCampaigns.change}
          trend={kpis.completedCampaigns.trend}
          icon={Target}
          color="teal"
          changeLabel="completed"
        />
        <KPICard
          title="Avg. Value"
          value={kpis.avgCampaignValue.value}
          change={kpis.avgCampaignValue.change}
          trend={kpis.avgCampaignValue.trend}
          icon={Zap}
          color="orange"
          changeLabel="per campaign"
        />
        <KPICard
          title="Conversion"
          value={kpis.conversionRate.value}
          change={kpis.conversionRate.change}
          trend={kpis.conversionRate.trend}
          icon={TrendingUp}
          color="purple"
          changeLabel="click to action"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-400" />
              Monthly Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={monthlyEarnings} height={180} />
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-pink-400" />
              Platform Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-around">
              <DonutChart
                data={platformBreakdown.map(p => ({ value: p.value }))}
                size={140}
              />
              <div className="space-y-2">
                {platformBreakdown.map((platform, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={cn(
                      'w-3 h-3 rounded-full',
                      platform.color === 'pink' ? 'bg-pink-500' :
                      platform.color === 'teal' ? 'bg-teal-500' :
                      platform.color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'
                    )} />
                    <span className="text-sm">{platform.label}</span>
                    <span className="text-sm text-[var(--text-muted)]">{platform.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Content Performance by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {contentPerformance.map((item, i) => (
              <ProgressBar
                key={i}
                label={item.label}
                value={item.value}
                max={item.max}
                color={item.color}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {engagementMetrics.map((metric, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center">
                <metric.icon className="w-5 h-5 text-[var(--text-secondary)]" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatNumber(metric.value)}</p>
                <p className="text-sm text-[var(--text-muted)]">{metric.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Export Info */}
      <Card className="p-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-teal-500/20">
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 text-teal-400" />
          <div>
            <h4 className="font-medium">Export Your Data</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Download your analytics in CSV or JSON format for further analysis or reporting.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AnalyticsDashboard
