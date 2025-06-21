'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Settings, 
  CreditCard, 
  BarChart3, 
  FileText, 
  Download,
  Trash2,
  Eye,
  Share2,
  Calendar,
  Trophy,
  Zap,
  Crown
} from 'lucide-react'
import { DatabaseService } from '../lib/services/database'
import { useAuth } from '../contexts/AuthContext'
import { AnalyticsService } from '../lib/services/analytics'
import Squares from './Squares'

interface DashboardTab {
  id: string
  label: string
  icon: React.ReactNode
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [analyses, setAnalyses] = useState<any[]>([])
  const [userStats, setUserStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const tabs: DashboardTab[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'analyses', label: 'My Analyses', icon: <FileText className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ]

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [statsData, analysesData] = await Promise.all([
        DatabaseService.getUserStatsForDashboard(user.id),
        DatabaseService.getUserAnalyses(user.id, 20)
      ])

      setUserStats(statsData)
      setAnalyses(analysesData)

      // Track dashboard view
      await AnalyticsService.trackPageView({
        page: '/dashboard',
        title: 'User Dashboard'
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      await AnalyticsService.trackError({
        message: error instanceof Error ? error.message : 'Dashboard load error',
        component: 'UserDashboard',
        action: 'loadDashboardData',
        severity: 'medium'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAnalysis = async (analysisId: string) => {
    try {
      const success = await DatabaseService.deleteAnalysis(analysisId)
      if (success) {
        setAnalyses(prev => prev.filter(a => a.id !== analysisId))
        await AnalyticsService.trackUserAction({
          action: 'analysis_deleted',
          category: 'dashboard',
          properties: { analysis_id: analysisId }
        })
      }
    } catch (error) {
      console.error('Error deleting analysis:', error)
    }
  }

  const handleExportData = async () => {
    try {
      const data = {
        user: user,
        stats: userStats,
        analyses: analyses
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `stealth-score-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      await AnalyticsService.trackUserAction({
        action: 'data_exported',
        category: 'dashboard'
      })
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Total</span>
          </div>
          <h3 className="text-white text-2xl font-bold">{userStats?.total_analyses || 0}</h3>
          <p className="text-white/70 text-sm">Analyses Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Average</span>
          </div>
          <h3 className="text-white text-2xl font-bold">{userStats?.avg_overall_score?.toFixed(1) || 'N/A'}</h3>
          <p className="text-white/70 text-sm">Overall Score</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Remaining</span>
          </div>
          <h3 className="text-white text-2xl font-bold">{100}</h3>
          <p className="text-white/70 text-sm">Credits</p>
        </motion.div>
      </div>

      {/* Recent Analyses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
      >
        <h3 className="text-white text-xl font-bold mb-4">Recent Analyses</h3>
        <div className="space-y-3">
          {analyses.slice(0, 5).map((analysis, index) => (
            <div key={analysis.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div>
                <h4 className="text-white font-medium">{analysis.title || 'Untitled Analysis'}</h4>
                <p className="text-white/60 text-sm">{new Date(analysis.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{analysis.overall_score?.toFixed(1) || 'N/A'}/10</p>
                <p className="text-white/60 text-sm">Score</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  const AnalysesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-xl font-bold">My Analyses</h3>
        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      <div className="grid gap-4">
        {analyses.map((analysis) => (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-white text-lg font-semibold">{analysis.title || 'Untitled Analysis'}</h4>
                <p className="text-white/60 text-sm">{new Date(analysis.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteAnalysis(analysis.id)}
                  className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-blue-400 text-lg font-bold">{analysis.clarity_score?.toFixed(1) || 'N/A'}</p>
                <p className="text-white/60 text-xs">Clarity</p>
              </div>
              <div className="text-center">
                <p className="text-purple-400 text-lg font-bold">{analysis.originality_score?.toFixed(1) || 'N/A'}</p>
                <p className="text-white/60 text-xs">Originality</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 text-lg font-bold">{analysis.team_strength_score?.toFixed(1) || 'N/A'}</p>
                <p className="text-white/60 text-xs">Team</p>
              </div>
              <div className="text-center">
                <p className="text-orange-400 text-lg font-bold">{analysis.market_fit_score?.toFixed(1) || 'N/A'}</p>
                <p className="text-white/60 text-xs">Market</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const ProfileTab = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
      >
        <h3 className="text-white text-xl font-bold mb-6">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm">Full Name</label>
            <p className="text-white text-lg">{'Not provided'}</p>
          </div>
          <div>
            <label className="text-white/70 text-sm">Email</label>
            <p className="text-white text-lg">{user?.email}</p>
          </div>
          <div>
            <label className="text-white/70 text-sm">Subscription Tier</label>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <p className="text-white text-lg capitalize">free</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Elements */}
      <Squares
        direction="diagonal"
        speed={0.1}
        borderColor="rgba(99, 102, 241, 0.08)"
        squareSize={60}
        hoverFillColor="rgba(99, 102, 241, 0.04)"
      />

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-white/70 text-lg">
            Welcome back, {user?.email}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex gap-2 bg-white/10 backdrop-blur-xl rounded-xl p-2 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'analyses' && <AnalysesTab />}
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'subscription' && <div className="text-white">Subscription management coming soon...</div>}
            {activeTab === 'settings' && <div className="text-white">Settings coming soon...</div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default UserDashboard
