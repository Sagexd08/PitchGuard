'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Database, 
  Clock, 
  TrendingUp, 
  Activity, 
  BarChart3,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { usePerformanceMetrics } from '../lib/performance/monitor'
import { useCacheMetrics } from '../lib/performance/cache'

const PerformanceDashboard: React.FC = () => {
  const { metrics, isLoading } = usePerformanceMetrics()
  const cacheMetrics = useCacheMetrics()
  const [selectedTab, setSelectedTab] = useState<'overview' | 'vitals' | 'cache' | 'network'>('overview')

  // Calculate performance score from metrics
  const score = metrics ? Math.min(100, Math.max(0, 
    100 - (metrics.loadTime / 100) - (metrics.memoryUsage / 10) + (metrics.fps / 2)
  )) : 0

  const MetricCard: React.FC<{
    title: string
    value: string | number
    unit?: string
    icon: React.ReactNode
    color: string
    status?: 'good' | 'warning' | 'poor'
    target?: number
  }> = ({ title, value, unit, icon, color, status, target }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'good': return 'border-green-400/50 bg-green-500/10'
        case 'warning': return 'border-yellow-400/50 bg-yellow-500/10'
        case 'poor': return 'border-red-400/50 bg-red-500/10'
        default: return `border-${color}-400/50 bg-${color}-500/10`
      }
    }

    const getStatusIcon = () => {
      switch (status) {
        case 'good': return <CheckCircle className="w-4 h-4 text-green-400" />
        case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />
        case 'poor': return <AlertTriangle className="w-4 h-4 text-red-400" />
        default: return null
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border rounded-2xl p-6 ${getStatusColor()}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-${color}-500/20 rounded-xl`}>
            {icon}
          </div>
          {getStatusIcon()}
        </div>
        
        <h3 className="text-white/70 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-1">
          <p className="text-white text-2xl font-bold">{value}</p>
          {unit && <span className="text-white/60 text-sm">{unit}</span>}
        </div>
        
        {target && typeof value === 'number' && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Target: {target}{unit}</span>
              <span>{value <= target ? 'Met' : 'Exceeded'}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${value <= target ? 'bg-green-400' : 'bg-red-400'}`}
                style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  const ScoreCircle: React.FC<{ score: number; size?: number }> = ({ score, size = 120 }) => {
    const radius = (size - 20) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (score / 100) * circumference

    const getScoreColor = () => {
      if (score >= 90) return '#10B981' // green
      if (score >= 75) return '#F59E0B' // yellow
      return '#EF4444' // red
    }

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getScoreColor()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-2xl font-bold">{Math.round(score)}</div>
            <div className="text-white/60 text-xs">Score</div>
          </div>
        </div>
      </div>
    )
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Performance Score */}
      <div className="flex items-center justify-center mb-8">
        <ScoreCircle score={score} size={150} />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Page Load Time"
          value={metrics.loadTime ? Math.round(metrics.loadTime) : 'N/A'}
          unit="ms"
          icon={<Clock className="w-6 h-6 text-blue-400" />}
          color="blue"
          status={metrics.loadTime ? (metrics.loadTime <= 3000 ? 'good' : metrics.loadTime <= 5000 ? 'warning' : 'poor') : undefined}
          target={3000}
        />

        <MetricCard
          title="API Response"
          value={metrics.networkLatency ? Math.round(metrics.networkLatency) : 'N/A'}
          unit="ms"
          icon={<Wifi className="w-6 h-6 text-green-400" />}
          color="green"
          status={metrics.networkLatency ? (metrics.networkLatency <= 1000 ? 'good' : metrics.networkLatency <= 2000 ? 'warning' : 'poor') : undefined}
          target={1000}
        />

        <MetricCard
          title="Memory Usage"
          value={metrics.memoryUsage ? Math.round(metrics.memoryUsage / 1024 / 1024) : 'N/A'}
          unit="MB"
          icon={<HardDrive className="w-6 h-6 text-purple-400" />}
          color="purple"
        />

        <MetricCard
          title="Cache Hit Rate"
          value={cacheMetrics.metrics.hitRate ? Math.round(cacheMetrics.metrics.hitRate) : 'N/A'}
          unit="%"
          icon={<Database className="w-6 h-6 text-orange-400" />}
          color="orange"
          status={cacheMetrics.metrics.hitRate ? (cacheMetrics.metrics.hitRate >= 80 ? 'good' : cacheMetrics.metrics.hitRate >= 60 ? 'warning' : 'poor') : undefined}
        />
      </div>
    </div>
  )

  const VitalsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Load Time"
        value={metrics?.loadTime ? Math.round(metrics.loadTime) : 'N/A'}
        unit="ms"
        icon={<Eye className="w-6 h-6 text-blue-400" />}
        color="blue"
        status={metrics?.loadTime ? (metrics.loadTime <= 1800 ? 'good' : metrics.loadTime <= 3000 ? 'warning' : 'poor') : undefined}
        target={1800}
      />

      <MetricCard
        title="Render Time"
        value={metrics?.renderTime ? Math.round(metrics.renderTime) : 'N/A'}
        unit="ms"
        icon={<Activity className="w-6 h-6 text-green-400" />}
        color="green"
        status={metrics?.renderTime ? (metrics.renderTime <= 2500 ? 'good' : metrics.renderTime <= 4000 ? 'warning' : 'poor') : undefined}
        target={2500}
      />

      <MetricCard
        title="Network Latency"
        value={metrics?.networkLatency ? Math.round(metrics.networkLatency) : 'N/A'}
        unit="ms"
        icon={<Zap className="w-6 h-6 text-yellow-400" />}
        color="yellow"
        status={metrics?.networkLatency ? (metrics.networkLatency <= 100 ? 'good' : metrics.networkLatency <= 300 ? 'warning' : 'poor') : undefined}
        target={100}
      />

      <MetricCard
        title="FPS"
        value={metrics?.fps ? Math.round(metrics.fps) : 'N/A'}
        icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
        color="purple"
        status={metrics?.fps ? (metrics.fps >= 55 ? 'good' : metrics.fps >= 30 ? 'warning' : 'poor') : undefined}
        target={60}
      />

      <MetricCard
        title="Bundle Size"
        value={metrics?.bundleSize ? Math.round(metrics.bundleSize / 1024) : 'N/A'}
        unit="KB"
        icon={<Cpu className="w-6 h-6 text-red-400" />}
        color="red"
        status={metrics?.bundleSize ? (metrics.bundleSize <= 500000 ? 'good' : metrics.bundleSize <= 1000000 ? 'warning' : 'poor') : undefined}
        target={500}
      />

      <MetricCard
        title="Error Rate"
        value={metrics?.errorRate ? (metrics.errorRate * 100).toFixed(2) : 'N/A'}
        unit="%"
        icon={<AlertTriangle className="w-6 h-6 text-orange-400" />}
        color="orange"
        status={metrics?.errorRate ? (metrics.errorRate <= 0.01 ? 'good' : metrics.errorRate <= 0.05 ? 'warning' : 'poor') : undefined}
        target={1}
      />
    </div>
  )

  const CacheTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Cache Hit Rate"
          value={`${Math.round(cacheMetrics.metrics.hitRate)}%`}
          icon={<Database className="w-6 h-6 text-blue-400" />}
          color="blue"
        />

        <MetricCard
          title="Cache Miss Rate"
          value={`${Math.round(cacheMetrics.metrics.missRate)}%`}
          icon={<Wifi className="w-6 h-6 text-green-400" />}
          color="green"
        />

        <MetricCard
          title="Cache Size"
          value={cacheMetrics.metrics.cacheSize}
          icon={<Activity className="w-6 h-6 text-purple-400" />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-white text-lg font-bold mb-4">Cache Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Total Requests</span>
              <span className="text-white">{cacheMetrics.metrics.totalRequests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Cache Evictions</span>
              <span className="text-white">{cacheMetrics.metrics.evictions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Avg Response Time</span>
              <span className="text-white">{Math.round(cacheMetrics.metrics.averageResponseTime * 100) / 100}ms</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-white text-lg font-bold mb-4">Performance Impact</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Cache Hits</span>
              <span className="text-green-400">+{Math.round(cacheMetrics.metrics.hitRate)}% faster</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Most Accessed</span>
              <span className="text-blue-400">{cacheMetrics.mostAccessed.length} entries</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">LRU Entries</span>
              <span className="text-purple-400">{cacheMetrics.leastRecentlyUsed.length} entries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
            Performance Dashboard
          </h1>
          <p className="text-white/70 text-lg">
            Monitor and optimize your application's performance
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex gap-2 bg-white/10 backdrop-blur-xl rounded-xl p-2 w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'vitals', label: 'Core Web Vitals', icon: <Activity className="w-4 h-4" /> },
              { id: 'cache', label: 'Cache Performance', icon: <Database className="w-4 h-4" /> },
              { id: 'network', label: 'Network', icon: <Wifi className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'overview' && <OverviewTab />}
          {selectedTab === 'vitals' && <VitalsTab />}
          {selectedTab === 'cache' && <CacheTab />}
          {selectedTab === 'network' && <div className="text-white">Network monitoring coming soon...</div>}
        </motion.div>
      </div>
    </div>
  )
}

export default PerformanceDashboard
