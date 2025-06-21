import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, FileText, Zap, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface PitchInputProps {
  onSubmit: (pitchText: string) => void
  isLoading: boolean
  error: string | null
}

const PitchInput: React.FC<PitchInputProps> = ({ onSubmit, isLoading, error }) => {
  const [pitchText, setPitchText] = useState('')
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setPitchText(text)
    setCharCount(text.length)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (pitchText.trim().length < 50) {
      toast.error('Please provide a more detailed pitch (minimum 50 characters)')
      return
    }

    onSubmit(pitchText.trim())
  }

  const fillSamplePitch = () => {
    const samplePitch = `EcoTrack: Revolutionizing Carbon Footprint Management

Problem: 
Small and medium businesses struggle to accurately track and reduce their carbon footprint due to complex calculations and expensive consulting services.

Solution:
EcoTrack is an AI-powered SaaS platform that automatically calculates carbon emissions from business operations, provides actionable reduction strategies, and generates compliance reports.

Market Opportunity:
The carbon management software market is projected to reach $15.6B by 2027, with 40% of SMBs planning to invest in sustainability tools within the next 2 years.

Business Model:
Subscription-based pricing starting at $99/month for small businesses, with enterprise plans up to $999/month. Revenue projections show $2M ARR by year 2.

Team:
- Sarah Chen (CEO): Former sustainability consultant at McKinsey, 8 years experience
- Mike Rodriguez (CTO): Ex-Google engineer, built 3 successful B2B SaaS products
- Dr. Lisa Park (Chief Scientist): PhD in Environmental Science, published researcher

Traction:
- 50 pilot customers with 85% retention rate
- $150K in pre-orders
- Partnership with 3 major accounting firms
- Featured in TechCrunch and Forbes

Funding:
Seeking $1.5M Series A to scale sales team and expand product features.`
    
    setPitchText(samplePitch)
    setCharCount(samplePitch.length)
    toast.success('Sample pitch loaded!')
  }

  const getCharCountColor = () => {
    if (charCount < 50) return 'text-red-400'
    if (charCount < 100) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="glass-card p-6 md:p-8 max-w-4xl mx-auto relative overflow-hidden"
    >
      {}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px), radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }}
      />

      {}
      <div className="relative z-10">
      {}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <FileText className="w-8 h-8 text-blue-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">Submit Your Pitch</h2>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </div>
        <p className="text-white/70">
          Enter your startup pitch below for AI-powered analysis and scoring
        </p>
      </motion.div>

      {}
      <form onSubmit={handleSubmit} className="space-y-6">
        {}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          <motion.textarea
            ref={textareaRef}
            value={pitchText}
            onChange={handleTextChange}
            placeholder="Enter your startup pitch here... Include your problem statement, solution, market opportunity, business model, and team background."
            rows={16}
            className="w-full p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
            whileFocus={{ scale: 1.02 }}
            disabled={isLoading}
          />
          
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-4 right-4 flex items-center gap-2"
          >
            <span className={`text-sm font-mono ${getCharCountColor()}`}>
              {charCount}
            </span>
            <span className="text-white/50 text-sm">characters</span>
          </motion.div>
        </motion.div>

        {}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-4 border border-red-400/30 bg-red-500/10"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          {}
          <motion.button
            type="button"
            onClick={fillSamplePitch}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-button px-6 py-3 text-white/80 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 min-h-[56px] w-full lg:w-auto lg:min-w-[200px] button-enhanced"
            disabled={isLoading}
          >
            <Sparkles className="w-4 h-4" />
            Fill Sample Pitch
          </motion.button>

          {}
          <motion.button
            type="submit"
            whileHover={{ scale: isLoading || pitchText.trim().length < 50 ? 1 : 1.02 }}
            whileTap={{ scale: isLoading || pitchText.trim().length < 50 ? 1 : 0.98 }}
            disabled={isLoading || pitchText.trim().length < 50}
            className="flex-1 lg:flex-[2] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 neon-glow disabled:shadow-none min-h-[56px] relative overflow-hidden button-enhanced"
          >
            {}
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )}

            {}
            <div className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span className="font-medium">Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Analyze Pitch</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </div>
          </motion.button>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-white/60 text-sm"
        >
          <p>💡 Tip: Include problem, solution, market size, business model, team, and traction for best results</p>
        </motion.div>
      </form>
      </div>
    </motion.div>
  )
}

export default PitchInput
