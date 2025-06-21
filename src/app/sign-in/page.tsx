'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import ParticleBackground from '../../components/ParticleBackground'
import Squares from '../../components/Squares'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      toast.success('Signed in successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

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
      
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white text-center mb-8 font-montserrat">
            Sign In
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/90 font-medium mb-2 font-montserrat">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-blue-400/50 focus:ring-blue-400/25 backdrop-blur-sm font-montserrat rounded-xl px-4 py-3"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/90 font-medium mb-2 font-montserrat">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-blue-400/50 focus:ring-blue-400/25 backdrop-blur-sm font-montserrat rounded-xl px-4 py-3"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-montserrat rounded-xl py-4 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <p className="text-center text-white/70 mt-6 font-montserrat">
            Don't have an account?{' '}
            <a href="/sign-up" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
