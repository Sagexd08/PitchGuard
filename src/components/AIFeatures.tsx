'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  Zap,
  Shield,
  BarChart3,
  Lightbulb,
  Search,
  Award,
  Rocket,
  Eye,
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import ClickSpark from './ClickSpark'
import Floating3DBackground from './Floating3DBackground'

interface AIFeature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
  stats: string
  capabilities: string[]
  accuracy: number
}

const aiFeatures: AIFeature[] = [
  {
    id: 'sentiment',
    title: 'AI Sentiment Analysis',
    description: 'Advanced natural language processing to analyze emotional tone, confidence levels, and persuasiveness in your pitch',
    icon: <Heart className="w-8 h-8 text-white" />,
    gradient: 'from-pink-500 to-rose-500',
    stats: '97% Accuracy',
    capabilities: ['Emotional tone detection', 'Confidence scoring', 'Persuasiveness metrics', 'Language clarity'],
    accuracy: 97
  },
  {
    id: 'market-fit',
    title: 'Market Fit Scoring',
    description: 'AI-powered analysis of market opportunity, timing, and product-market fit based on industry data and trends',
    icon: <Target className="w-8 h-8 text-white" />,
    gradient: 'from-blue-500 to-cyan-500',
    stats: '94% Precision',
    capabilities: ['Market size analysis', 'Timing assessment', 'Competition mapping', 'Growth potential'],
    accuracy: 94
  },
  {
    id: 'competitive',
    title: 'Competitive Intelligence',
    description: 'Real-time competitive landscape analysis with AI-driven insights on positioning and differentiation',
    icon: <Search className="w-8 h-8 text-white" />,
    gradient: 'from-purple-500 to-indigo-500',
    stats: '92% Coverage',
    capabilities: ['Competitor identification', 'Feature comparison', 'Pricing analysis', 'Market positioning'],
    accuracy: 92
  },
  {
    id: 'investor-match',
    title: 'Investor Matching',
    description: 'AI algorithm matches your pitch with the most suitable investors based on portfolio, stage, and sector preferences',
    icon: <Users className="w-8 h-8 text-white" />,
    gradient: 'from-green-500 to-emerald-500',
    stats: '89% Match Rate',
    capabilities: ['Portfolio analysis', 'Investment stage matching', 'Sector alignment', 'Success prediction'],
    accuracy: 89
  },
  {
    id: 'financial',
    title: 'Financial Projections AI',
    description: 'Intelligent analysis of financial models, revenue projections, and business metrics with industry benchmarking',
    icon: <BarChart3 className="w-8 h-8 text-white" />,
    gradient: 'from-orange-500 to-yellow-500',
    stats: '95% Reliability',
    capabilities: ['Revenue modeling', 'Metric validation', 'Benchmark comparison', 'Risk assessment'],
    accuracy: 95
  },
  {
    id: 'presentation',
    title: 'Presentation Optimizer',
    description: 'AI-powered recommendations for slide structure, content flow, and visual design to maximize impact',
    icon: <Lightbulb className="w-8 h-8 text-white" />,
    gradient: 'from-violet-500 to-purple-500',
    stats: '91% Improvement',
    capabilities: ['Slide optimization', 'Content flow', 'Visual recommendations', 'Timing analysis'],
    accuracy: 91
  }
]

const AIFeatures: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  return (
    <section className="py-32 relative overflow-hidden">
      <Floating3DBackground>
        <div className="opacity-20" />
      </Floating3DBackground>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-blue-900/30 to-purple-900/50" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-Powered Intelligence
            </h2>
          </div>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Harness the power of advanced artificial intelligence to analyze, optimize, and perfect your pitch with unprecedented accuracy and insights
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              onHoverStart={() => setHoveredFeature(feature.id)}
              onHoverEnd={() => setHoveredFeature(null)}
              className="group relative"
            >
              <ClickSpark>
                <div 
                  className="glass-card p-8 h-full cursor-pointer hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25 border border-white/10 hover:border-purple-400/40 relative overflow-hidden"
                  onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
                >
                  <Floating3DBackground>
                    <div className="opacity-15" />
                  </Floating3DBackground>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                        {feature.icon}
                      </div>
                      <div className={`px-4 py-2 bg-gradient-to-r ${feature.gradient} rounded-full text-sm font-bold text-white shadow-lg`}>
                        {feature.stats}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-white/80 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/70 text-sm">Accuracy</span>
                        <span className="text-white font-semibold">{feature.accuracy}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${feature.accuracy}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: index * 0.1 }}
                          className={`h-2 bg-gradient-to-r ${feature.gradient} rounded-full`}
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedFeature === feature.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-white/10 pt-6"
                        >
                          <h4 className="text-lg font-semibold text-white mb-4">Key Capabilities:</h4>
                          <div className="space-y-2">
                            {feature.capabilities.map((capability, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-3"
                              >
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-white/80">{capability}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between mt-6">
                      <button className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(feature.accuracy / 20) ? 'text-yellow-400 fill-current' : 'text-white/20'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </ClickSpark>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <ClickSpark>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl text-white font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Experience AI-Powered Analysis
                <Rocket className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </ClickSpark>
        </motion.div>
      </div>
    </section>
  )
}

export default AIFeatures
