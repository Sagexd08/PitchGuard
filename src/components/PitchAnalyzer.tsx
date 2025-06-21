'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PitchInput from './PitchInput'
import ScoreDisplay from './ScoreDisplay'
import AdvancedLoader from './AdvancedLoader'
import Squares from './Squares'
import { usePitchAnalysis } from '../hooks/usePitchAnalysis'

interface PitchAnalyzerProps {
  onAnalysisComplete?: (data: { scores: any; receipt: string }) => void
}

const PitchAnalyzer: React.FC<PitchAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [currentStep, setCurrentStep] = useState<'input' | 'analyzing' | 'results'>('input')
  const { analyzePitch, isLoading, scores, receipt, error } = usePitchAnalysis()

  const handlePitchSubmit = async (pitchText: string) => {
    setCurrentStep('analyzing')

    try {
      await analyzePitch(pitchText)
      setCurrentStep('results')

      if (onAnalysisComplete && scores && receipt) {
        onAnalysisComplete({ scores, receipt })
      }
    } catch (err) {
      setCurrentStep('input')
    }
  }

  const handleReset = () => {
    setCurrentStep('input')
  }

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Background squares */}
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(99, 102, 241, 0.08)"
          squareSize={50}
          hoverFillColor="rgba(99, 102, 241, 0.04)"
        />
      </div>

      {/* Dynamic background gradient */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: currentStep === 'input'
            ? 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
            : currentStep === 'analyzing'
            ? 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)'
            : 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)'
        }}
        transition={{ duration: 1 }}
      />

      <AnimatePresence mode="wait">
        {currentStep === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: -50,
              scale: 0.95,
              rotateX: -10
            }}
            transition={{
              duration: 0.7,
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
          >
            <PitchInput onSubmit={handlePitchSubmit} isLoading={isLoading} error={error} />
          </motion.div>
        )}

        {currentStep === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{
              opacity: 0,
              scale: 0.8,
              rotateY: -15,
              z: -100
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateY: 0,
              z: 0
            }}
            exit={{
              opacity: 0,
              scale: 1.1,
              rotateY: 15,
              z: 100
            }}
            transition={{
              duration: 0.9,
              type: "spring",
              stiffness: 80,
              damping: 15
            }}
            style={{ perspective: 1000 }}
          >
            <AdvancedLoader />
          </motion.div>
        )}

        {currentStep === 'results' && scores && (
          <motion.div
            key="results"
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.9,
              rotateX: 10
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0
            }}
            exit={{
              opacity: 0,
              y: -50,
              scale: 0.9,
              rotateX: -10
            }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 90,
              damping: 18,
              delay: 0.1
            }}
          >
            <ScoreDisplay
              scores={[
                {
                  category: 'Clarity',
                  score: Math.round(scores.clarity),
                  maxScore: 10,
                  feedback: `Your pitch clarity score is ${scores.clarity.toFixed(1)}/10. ${scores.clarity >= 8 ? 'Excellent clarity!' : scores.clarity >= 6 ? 'Good clarity with room for improvement.' : 'Consider making your pitch more clear and concise.'}`,
                  suggestions: scores.clarity < 8 ? ['Use simpler language', 'Structure your pitch with clear sections', 'Practice your delivery'] : ['Maintain this excellent clarity']
                },
                {
                  category: 'Originality',
                  score: Math.round(scores.originality),
                  maxScore: 10,
                  feedback: `Your originality score is ${scores.originality.toFixed(1)}/10. ${scores.originality >= 8 ? 'Highly original concept!' : scores.originality >= 6 ? 'Good originality with some unique aspects.' : 'Consider highlighting what makes your solution unique.'}`,
                  suggestions: scores.originality < 8 ? ['Emphasize unique value proposition', 'Highlight competitive advantages', 'Show innovation clearly'] : ['Continue to emphasize your unique approach']
                },
                {
                  category: 'Team Strength',
                  score: Math.round(scores.team_strength),
                  maxScore: 10,
                  feedback: `Your team strength score is ${scores.team_strength.toFixed(1)}/10. ${scores.team_strength >= 8 ? 'Strong team presentation!' : scores.team_strength >= 6 ? 'Good team with some strengths shown.' : 'Consider highlighting team expertise and experience more.'}`,
                  suggestions: scores.team_strength < 8 ? ['Highlight relevant experience', 'Show complementary skills', 'Demonstrate past successes'] : ['Your team presentation is excellent']
                },
                {
                  category: 'Market Fit',
                  score: Math.round(scores.market_fit),
                  maxScore: 10,
                  feedback: `Your market fit score is ${scores.market_fit.toFixed(1)}/10. ${scores.market_fit >= 8 ? 'Excellent market understanding!' : scores.market_fit >= 6 ? 'Good market analysis with room for improvement.' : 'Consider providing more market research and validation.'}`,
                  suggestions: scores.market_fit < 8 ? ['Include market size data', 'Show customer validation', 'Demonstrate market need'] : ['Excellent market analysis']
                }
              ]}
              receipt={receipt ? {
                id: receipt,
                timestamp: new Date().toLocaleString(),
                hash: `sha256-${receipt.slice(-16)}`,
                verified: true
              } : undefined}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
          {['input', 'analyzing', 'results'].map((step, index) => {
            const isActive = currentStep === step
            const isCompleted = index < ['input', 'analyzing', 'results'].indexOf(currentStep)

            return (
              <motion.div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  isActive
                    ? 'bg-blue-400'
                    : isCompleted
                    ? 'bg-green-400'
                    : 'bg-white/30'
                }`}
                animate={isActive ? {
                  scale: [1, 1.3, 1]
                } : {
                  scale: 1
                }}
                transition={isActive ? {
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                } : {
                  duration: 0.3,
                  ease: "easeOut"
                }}
              />
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

export default PitchAnalyzer