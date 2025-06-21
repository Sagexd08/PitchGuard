'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap,
  Brain,
  Target,
  TrendingUp
} from 'lucide-react'
import { RealtimeService, AnalysisStatus } from '../lib/services/realtime'

interface LiveAnalysisStatusProps {
  analysisId: string
  onComplete?: (result: any) => void
  onError?: (error: string) => void
}

const LiveAnalysisStatus: React.FC<LiveAnalysisStatusProps> = ({
  analysisId,
  onComplete,
  onError
}) => {
  const [status, setStatus] = useState<AnalysisStatus>({
    id: analysisId,
    status: 'pending',
    step: 'encrypting',
    progress: 0,
    message: 'Initializing analysis...',
    timestamp: new Date().toISOString()
  })
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    // Subscribe to analysis status updates
    const unsubscribe = RealtimeService.subscribe(analysisId, (newStatus) => {
      setStatus(newStatus)
      
      if (newStatus.status === 'completed' && onComplete) {
        onComplete(newStatus)
      } else if (newStatus.status === 'failed' && onError) {
        onError(newStatus.message || 'Analysis failed')
      }
    })

    // Start the analysis simulation
    RealtimeService.startAnalysis(analysisId)

    // Update elapsed time
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime)
    }, 1000)

    return () => {
      clearInterval(timer)
      unsubscribe()
    }
  }, [analysisId])

  
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${remainingSeconds}s`
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-400" />
      case 'processing':
        return <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-400" />
      default:
        return <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'pending': return 'border-yellow-400/50 bg-yellow-500/10'
      case 'processing': return 'border-blue-400/50 bg-blue-500/10'
      case 'completed': return 'border-green-400/50 bg-green-500/10'
      case 'failed': return 'border-red-400/50 bg-red-500/10'
      default: return 'border-blue-400/50 bg-blue-500/10'
    }
  }

  const getProgressBarColor = () => {
    switch (status.status) {
      case 'completed': return 'from-green-500 to-green-400'
      case 'failed': return 'from-red-500 to-red-400'
      default: return 'from-blue-500 to-purple-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border rounded-2xl p-6 ${getStatusColor()}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-white text-lg font-bold">
              {status.status === 'completed' ? 'Analysis Complete!' : 
               status.status === 'failed' ? 'Analysis Failed' : 
               'Analyzing Your Pitch'}
            </h3>
            <p className="text-white/70 text-sm">
              {status.status === 'completed' ? 'Your results are ready' :
               status.status === 'failed' ? 'Something went wrong' :
               'AI is working on your pitch'}
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="text-right">
          <p className="text-white/60 text-xs">Elapsed Time</p>
          <p className="text-white font-mono text-lg">{formatTime(elapsedTime)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm font-medium">{status.message}</span>
          <span className="text-white text-sm font-bold">{Math.round(status.progress)}%</span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${status.progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getProgressBarColor()} rounded-full relative`}
          >
            {/* Animated shine effect */}
            {status.status === 'processing' && (
              <motion.div
                animate={{ x: [-100, 300] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 skew-x-12"
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Analysis Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: <Brain className="w-4 h-4" />, label: 'AI Processing', active: status.progress >= 25 },
          { icon: <Target className="w-4 h-4" />, label: 'Clarity Check', active: status.progress >= 45 },
          { icon: <TrendingUp className="w-4 h-4" />, label: 'Market Analysis', active: status.progress >= 75 },
          { icon: <Zap className="w-4 h-4" />, label: 'Final Score', active: status.progress >= 100 }
        ].map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: step.active ? 1 : 0.3,
              scale: step.active ? 1.05 : 1
            }}
            className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${
              step.active 
                ? 'border-blue-400/50 bg-blue-500/20 text-blue-400' 
                : 'border-white/10 bg-white/5 text-white/50'
            }`}
          >
            {step.icon}
            <span className="text-xs font-medium mt-1">{step.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {status.status === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 text-blue-400 text-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4" />
              </motion.div>
              <span>Our AI is analyzing your pitch with advanced algorithms</span>
            </div>
            {status.estimatedTimeRemaining && (
              <p className="text-white/60 text-xs mt-2">
                Estimated time remaining: {status.estimatedTimeRemaining}s
              </p>
            )}
          </motion.div>
        )}

        {status.status === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 text-green-400 text-sm mb-2">
              <CheckCircle className="w-4 h-4" />
              <span>Analysis completed successfully!</span>
            </div>
            <p className="text-white/70 text-xs">
              Your pitch has been analyzed and scored. Check your results below.
            </p>
          </motion.div>
        )}

        {status.status === 'failed' && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 text-red-400 text-sm mb-2">
              <XCircle className="w-4 h-4" />
              <span>Analysis failed</span>
            </div>
            <p className="text-white/70 text-xs">
              {status.message || 'An unexpected error occurred. Please try again.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse Animation for Active Status */}
      {status.status === 'processing' && (
        <motion.div
          animate={{ scale: [1, 1.02, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-blue-400/10 rounded-2xl pointer-events-none"
        />
      )}
    </motion.div>
  )
}

export default LiveAnalysisStatus
