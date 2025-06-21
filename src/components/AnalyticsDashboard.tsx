'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Clock, 
  Target,
  Zap,
  Award,
  Eye,
  MessageSquare
} from 'lucide-react'
import { DatabaseService } from '../lib/services/database'
import { useAuth } from '../contexts/AuthContext'
import Squares from './Squares'

interface AnalyticsData {
  totalAnalyses: number
  avgScores: {
    clarity: number
    originality: number
    teamStrength: number
    marketFit: number
    overall: number
  }
  recentAnalyses: any[]
  performanceMetrics: {
    avgAnalysisTime: number
    successRate: number
    userSatisfaction: number
  }
  userStats: {
    creditsRemaining: number
    subscriptionTier: string
    joinDate: string
    lastActivity: string
  }
}

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    if (user) {
      loadAnalyticsData()
    }
  }, [user, timeRange])

  const loadAnalyticsData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [userStats, recentAnalyses] = await Promise.all([
        DatabaseService.getUserStats(),
        DatabaseService.getPitchAnalyses()
      ])

      const avgScores = {
        clarity: userStats?.averageScores?.clarity || 0,
        originality: userStats?.averageScores?.originality || 0,
        teamStrength: userStats?.averageScores?.team_strength || 0,
        marketFit: userStats?.averageScores?.market_fit || 0,
        overall: ((userStats?.averageScores?.clarity || 0) + 
                 (userStats?.averageScores?.originality || 0) + 
                 (userStats?.averageScores?.team_strength || 0) + 
                 (userStats?.averageScores?.market_fit || 0)) / 4
      }

      setAnalyticsData({
        totalAnalyses: userStats?.totalAnalyses || 0,
        avgScores,
        recentAnalyses: recentAnalyses.slice(0, 10),
        performanceMetrics: {
          avgAnalysisTime: 4.2, // Mock data
          successRate: 98.5,
          userSatisfaction: 4.8
        },
        userStats: {
          creditsRemaining: 100, // Mock data - would come from user metadata
          subscriptionTier: 'free', // Mock data - would come from user metadata
          joinDate: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No Analytics Data</h2>
          <p className="text-white/70">Start analyzing pitches to see your analytics!</p>
        </div>
      </div>
    )
  }

  const StatCard: React.FC<{
    icon: React.ReactNode
    title: string
    value: string | number
    change?: string
    color: string
  }> = ({ icon, title, value, change, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-${color}-400/50 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}-500/20 rounded-xl`}>
          {icon}
        </div>
        {change && (
          <span className={`text-${color}-400 text-sm font-medium`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-white/70 text-sm font-medium mb-1">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </motion.div>
  )

  const ScoreBar: React.FC<{ label: string; score: number; color: string }> = ({ label, score, color }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/80 text-sm font-medium">{label}</span>
        <span className="text-white text-sm font-bold">{score.toFixed(1)}/10</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(score / 10) * 100}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-2 bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-full`}
        />
      </div>
    </div>
  )

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
            Analytics Dashboard
          </h1>
          <p className="text-white/70 text-lg">
            Track your pitch analysis performance and insights
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex gap-2 bg-white/10 backdrop-blur-xl rounded-xl p-2 w-fit">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {range === 'all' ? 'All Time' : range.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
            title="Total Analyses"
            value={analyticsData.totalAnalyses}
            change="+12%"
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-green-400" />}
            title="Average Score"
            value={analyticsData.avgScores.overall.toFixed(1)}
            change="+0.3"
            color="green"
          />
          <StatCard
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Credits Remaining"
            value={analyticsData.userStats.creditsRemaining}
            color="yellow"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-purple-400" />}
            title="Success Rate"
            value={`${analyticsData.performanceMetrics.successRate}%`}
            change="+2.1%"
            color="purple"
          />
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Average Scores
            </h3>
            <ScoreBar label="Clarity" score={analyticsData.avgScores.clarity} color="blue" />
            <ScoreBar label="Originality" score={analyticsData.avgScores.originality} color="purple" />
            <ScoreBar label="Team Strength" score={analyticsData.avgScores.teamStrength} color="green" />
            <ScoreBar label="Market Fit" score={analyticsData.avgScores.marketFit} color="orange" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Avg Analysis Time</span>
                <span className="text-white font-bold">{analyticsData.performanceMetrics.avgAnalysisTime}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Success Rate</span>
                <span className="text-green-400 font-bold">{analyticsData.performanceMetrics.successRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">User Satisfaction</span>
                <span className="text-yellow-400 font-bold">{analyticsData.performanceMetrics.userSatisfaction}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Subscription Tier</span>
                <span className="text-purple-400 font-bold capitalize">{analyticsData.userStats.subscriptionTier}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Recent Analyses
          </h3>
          <div className="space-y-4">
            {analyticsData.recentAnalyses.length > 0 ? (
              analyticsData.recentAnalyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div>
                    <h4 className="text-white font-medium">{analysis.title || 'Untitled Analysis'}</h4>
                    <p className="text-white/60 text-sm">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {((analysis.scores.clarity + analysis.scores.originality + analysis.scores.team_strength + analysis.scores.market_fit) / 4).toFixed(1)}/10
                      </p>
                      <p className="text-white/60 text-sm">Overall Score</p>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">1</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No analyses yet. Start analyzing your pitches!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
