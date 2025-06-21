'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, BarChart3, TrendingUp, Sparkles } from 'lucide-react'
import AIAnalyticsDashboard from '../../components/AIAnalyticsDashboard'
import Squares from '../../components/Squares'
import ParticleBackground from '../../components/ParticleBackground'
import ClickSpark from '../../components/ClickSpark'
import Floating3DBackground from '../../components/Floating3DBackground'

export default function AnalyticsPage() {
  return (
    <ClickSpark>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden font-montserrat">
        <ParticleBackground />
        
        <Squares
          direction="diagonal"
          speed={0.1}
          borderColor="rgba(99, 102, 241, 0.1)"
          squareSize={60}
          hoverFillColor="rgba(99, 102, 241, 0.05)"
        />

        <Floating3DBackground>
          <div className="opacity-20" />
        </Floating3DBackground>

        <div className="relative z-10">
          <header className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    AI Analytics Dashboard
                  </h1>
                </div>
                <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                  Comprehensive AI-powered insights and real-time analytics for your pitch performance
                </p>
              </motion.div>
            </div>
          </header>

          <main className="py-8 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <AIAnalyticsDashboard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-16 text-center"
              >
                <div className="glass-card p-12 max-w-4xl mx-auto">
                  <Floating3DBackground>
                    <div className="opacity-15" />
                  </Floating3DBackground>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <Sparkles className="w-8 h-8 text-purple-400" />
                      <h2 className="text-3xl font-bold text-white">AI-Powered Insights</h2>
                    </div>
                    
                    <p className="text-xl text-white/80 mb-8 leading-relaxed">
                      Our advanced AI algorithms analyze over 50+ data points to provide you with 
                      actionable insights that can improve your pitch performance by up to 40%.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">97% Accuracy</h3>
                        <p className="text-white/70">Industry-leading AI precision</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Real-time Analysis</h3>
                        <p className="text-white/70">Instant feedback and insights</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Smart Recommendations</h3>
                        <p className="text-white/70">Personalized improvement tips</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </ClickSpark>
  )
}
