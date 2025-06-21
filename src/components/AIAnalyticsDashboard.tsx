'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Brain,
  Target,
  Zap,
  Eye,
  Heart,
  Users,
  Award,
  ArrowUp,
  ArrowDown,
  Activity,
  Gauge,
  Sparkles
} from 'lucide-react'
import ClickSpark from './ClickSpark'
import Floating3DBackground from './Floating3DBackground'

interface AnalyticsMetric {
  id: string
  title: string
  value: number
  change: number
  icon: React.ReactNode
  color: string
  description: string
  trend: 'up' | 'down' | 'stable'
}

interface AIInsight {
  id: string
  type: 'strength' | 'weakness' | 'opportunity' | 'threat'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
}

const AIAnalyticsDashboard: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})

  const metrics: AnalyticsMetric[] = [
    {
      id: 'overall-score',
      title: 'Overall Pitch Score',
      value: 87,
      change: 12,
      icon: <Award className="w-6 h-6" />,
      color: 'from-yellow-400 to-orange-500',
      description: 'Comprehensive AI analysis of your pitch effectiveness',
      trend: 'up'
    },
    {
      id: 'sentiment',
      title: 'Sentiment Score',
      value: 92,
      change: 8,
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-400 to-rose-500',
      description: 'Emotional resonance and persuasiveness analysis',
      trend: 'up'
    },
    {
      id: 'clarity',
      title: 'Message Clarity',
      value: 85,
      change: -3,
      icon: <Eye className="w-6 h-6" />,
      color: 'from-blue-400 to-cyan-500',
      description: 'How clearly your message is communicated',
      trend: 'down'
    },
    {
      id: 'market-fit',
      title: 'Market Fit',
      value: 78,
      change: 15,
      icon: <Target className="w-6 h-6" />,
      color: 'from-green-400 to-emerald-500',
      description: 'Product-market fit assessment based on industry data',
      trend: 'up'
    },
    {
      id: 'investor-appeal',
      title: 'Investor Appeal',
      value: 81,
      change: 6,
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-400 to-indigo-500',
      description: 'Likelihood to attract investor interest',
      trend: 'up'
    },
    {
      id: 'competitive-edge',
      title: 'Competitive Edge',
      value: 74,
      change: 9,
      icon: <Zap className="w-6 h-6" />,
      color: 'from-violet-400 to-purple-500',
      description: 'Differentiation and competitive advantage strength',
      trend: 'up'
    }
  ]

  const insights: AIInsight[] = [
    {
      id: '1',
      type: 'strength',
      title: 'Strong Value Proposition',
      description: 'Your value proposition clearly articulates the problem and solution with compelling benefits.',
      confidence: 94,
      impact: 'high'
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Market Timing Advantage',
      description: 'Current market conditions are highly favorable for your solution with growing demand.',
      confidence: 87,
      impact: 'high'
    },
    {
      id: '3',
      type: 'weakness',
      title: 'Financial Projections',
      description: 'Revenue projections may be overly optimistic compared to industry benchmarks.',
      confidence: 82,
      impact: 'medium'
    },
    {
      id: '4',
      type: 'threat',
      title: 'Competitive Landscape',
      description: 'Several well-funded competitors are addressing similar market segments.',
      confidence: 78,
      impact: 'medium'
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      const newValues: Record<string, number> = {}
      metrics.forEach(metric => {
        newValues[metric.id] = metric.value
      })
      setAnimatedValues(newValues)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength': return 'from-green-500 to-emerald-500'
      case 'opportunity': return 'from-blue-500 to-cyan-500'
      case 'weakness': return 'from-yellow-500 to-orange-500'
      case 'threat': return 'from-red-500 to-pink-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      <Floating3DBackground>
        <div className="opacity-10" />
      </Floating3DBackground>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Analytics Dashboard
          </h2>
        </div>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Real-time AI insights and performance metrics for your pitch analysis
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative"
          >
            <ClickSpark>
              <div 
                className="glass-card p-6 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 border border-white/10 hover:border-purple-400/30"
                onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {metric.icon}
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-green-400" />
                    ) : metric.trend === 'down' ? (
                      <ArrowDown className="w-4 h-4 text-red-400" />
                    ) : (
                      <Activity className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className={`text-sm font-semibold ${
                      metric.trend === 'up' ? 'text-green-400' : 
                      metric.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {metric.title}
                </h3>

                <div className="mb-4">
                  <div className="flex items-end gap-2 mb-2">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="text-3xl font-bold text-white"
                    >
                      {animatedValues[metric.id] || 0}
                    </motion.span>
                    <span className="text-white/60 text-lg mb-1">/ 100</span>
                  </div>
                  
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${animatedValues[metric.id] || 0}%` }}
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                      className={`h-2 bg-gradient-to-r ${metric.color} rounded-full`}
                    />
                  </div>
                </div>

                <p className="text-white/70 text-sm">
                  {metric.description}
                </p>

                <AnimatePresence>
                  {selectedMetric === metric.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10 pt-4 mt-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/70">Industry Average:</span>
                          <span className="text-white">72</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Your Percentile:</span>
                          <span className="text-green-400">Top 15%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Confidence:</span>
                          <span className="text-blue-400">94%</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ClickSpark>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">AI-Generated Insights</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 bg-gradient-to-r ${getInsightColor(insight.type)} rounded-full text-xs font-semibold text-white capitalize`}>
                  {insight.type}
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/60">{insight.confidence}%</span>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-white mb-2">
                {insight.title}
              </h4>

              <p className="text-white/80 text-sm mb-4">
                {insight.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs">Impact Level:</span>
                <span className={`text-xs font-semibold capitalize ${getImpactColor(insight.impact)}`}>
                  {insight.impact}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default AIAnalyticsDashboard
