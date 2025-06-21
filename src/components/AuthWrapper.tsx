import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Sparkles } from 'lucide-react' // Removed unused Chrome import
// @ts-ignore
import ParticleBackground from './ParticleBackground' // Add @ts-ignore for missing type declaration
import Squares from './Squares'
import ClickSpark from './ClickSpark'
import { useAuth } from '../contexts/AuthContext'
import { AnalyticsService } from '../lib/services/analytics'

interface AuthWrapperProps {
  children: React.ReactNode
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, isLoading } = useAuth()

  // Initialize analytics session
  useEffect(() => {
    // Track page view
    AnalyticsService.trackPageView(window.location.pathname)
  }, [])

  // Track authentication state changes
  useEffect(() => {
    if (user) {
      AnalyticsService.trackUserAction({
        action: 'auth_state_changed',
        category: 'auth',
        properties: {
          provider: 'local',
          user_id: user.id
        }
      })
    }
  }, [user])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <AuthenticationScreen />
  }

  return <>{children}</>
}

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      <Squares
        direction="diagonal"
        speed={0.3}
        borderColor="rgba(99, 102, 241, 0.08)"
        squareSize={60}
        hoverFillColor="rgba(99, 102, 241, 0.03)"
      />
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
          className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto"
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <h3 className="text-white font-semibold text-lg mb-2">Loading Stealth Score</h3>
          <p className="text-white/70">Initializing secure environment...</p>
        </motion.div>
      </div>
    </div>
  )
}

const AuthenticationScreen: React.FC = () => {
  return (
    <ClickSpark>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden z-10 p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 font-montserrat">
        {/* Background Elements */}
        <ParticleBackground />

        {/* Animated Square Background */}
        <Squares
          direction="diagonal"
          speed={0.1}
          borderColor="rgba(99, 102, 241, 0.1)"
          squareSize={60}
          hoverFillColor="rgba(99, 102, 241, 0.05)"
        />

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-purple-900/60 backdrop-blur-sm" />

        {/* Floating Orbs */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/30 rounded-full blur-2xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
          className="relative z-20 w-full max-w-md mx-auto"
        >
          {/* Enhanced Glassmorphism Container */}
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.4 }}
                  className="relative group"
                >
                  {/* Animated Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full blur-xl opacity-60 animate-pulse group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-4 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  {/* Floating Sparkles */}
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </div>
                </motion.div>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3"
              >
                Welcome to Stealth Score
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-white/80 text-lg mb-2"
              >
                Secure authentication required
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex items-center justify-center gap-2 text-white/60 text-sm"
              >
                <Shield className="w-4 h-4" />
                <span>Enterprise-grade security</span>
              </motion.div>
            </motion.div>

            {/* Main Authentication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="w-full text-center"
            >
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-6 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", bounce: 0.5 }}
                >
                  <Lock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                </motion.div>
                <h3 className="text-blue-300 font-semibold mb-2">Authentication Required</h3>
                <p className="text-blue-200/80 text-sm mb-4">
                  Please sign in to access your secure pitch analysis dashboard.
                </p>
                <motion.a
                  href="/sign-in"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign In to Continue
                </motion.a>
              </div>
            </motion.div>

            {/* Enhanced Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="mt-6 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-xs text-white/50">
                <Shield className="w-3 h-3" />
                <span>Powered by Supabase • SOC 2 Compliant</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </ClickSpark>
  )
}

export default AuthWrapper
