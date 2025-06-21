import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

console.log('Supabase configuration loaded:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length
})

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'stealth-score-web'
    }
  }
})

export type User = SupabaseUser

export interface AuthResponse {
  data: any
  error: any
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: 'free' | 'premium' | 'enterprise'
  credits_remaining: number
  total_analyses: number
  created_at: string
  updated_at: string
  preferences: Record<string, any>
}

export const auth = {
  signUp: async (email: string, password: string, options?: {
    data?: Record<string, any>
  }): Promise<AuthResponse> => {
    try {
      console.log('Attempting to sign up user:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: options?.data?.full_name || '',
            ...options?.data
          }
        }
      })

      if (error) {
        console.error('Sign up error:', error)
        return { data: null, error }
      }

      console.log('Sign up successful:', data)
      return { data, error: null }
    } catch (err) {
      console.error('Sign up exception:', err)
      return { data: null, error: err }
    }
  },

  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Attempting to sign in user:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        return { data: null, error }
      }

      console.log('Sign in successful:', data)
      return { data, error: null }
    } catch (err) {
      console.error('Sign in exception:', err)
      return { data: null, error: err }
    }
  },

  signInWithOAuth: async (provider: 'google' | 'github' | 'discord') => {
    try {
      console.log('Attempting OAuth sign in with:', provider)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('OAuth sign in error:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      console.error('OAuth sign in exception:', err)
      return { data: null, error: err }
    }
  },

  signOut: async (): Promise<{ error: any }> => {
    try {
      console.log('Attempting to sign out user')
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Sign out error:', error)
        return { error }
      }

      console.log('Sign out successful')
      return { error: null }
    } catch (err) {
      console.error('Sign out exception:', err)
      return { error: err }
    }
  },

  getUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        console.error('Get user error:', error)
        return { user: null, error }
      }

      return { user, error: null }
    } catch (err) {
      console.error('Get user exception:', err)
      return { user: null, error: err }
    }
  },

  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Get session error:', error)
        return { session: null, error }
      }

      return { session, error: null }
    } catch (err) {
      console.error('Get session exception:', err)
      return { session: null, error: err }
    }
  },

  resetPassword: async (email: string) => {
    try {
      console.log('Attempting password reset for:', email)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        console.error('Password reset error:', error)
        return { data: null, error }
      }

      console.log('Password reset email sent')
      return { data, error: null }
    } catch (err) {
      console.error('Password reset exception:', err)
      return { data: null, error: err }
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      console.log('Attempting to update password')
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        console.error('Update password error:', error)
        return { data: null, error }
      }

      console.log('Password updated successfully')
      return { data, error: null }
    } catch (err) {
      console.error('Update password exception:', err)
      return { data: null, error: err }
    }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      callback(event, session)
    })
  }
}

export const database = {
  getUserProfile: async (userId: string): Promise<{ data: UserProfile | null, error: any }> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Get user profile error:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      console.error('Get user profile exception:', err)
      return { data: null, error: err }
    }
  },

  createUserProfile: async (user: SupabaseUser): Promise<{ data: UserProfile | null, error: any }> => {
    try {
      const profile: Partial<UserProfile> = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        subscription_tier: 'free',
        credits_remaining: 10,
        total_analyses: 0,
        preferences: {}
      }

      const { data, error } = await supabase
        .from('users')
        .insert([profile])
        .select()
        .single()

      if (error) {
        console.error('Create user profile error:', error)
        return { data: null, error }
      }

      console.log('User profile created:', data)
      return { data, error: null }
    } catch (err) {
      console.error('Create user profile exception:', err)
      return { data: null, error: err }
    }
  },

  updateUserProfile: async (userId: string, updates: Partial<UserProfile>): Promise<{ data: UserProfile | null, error: any }> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Update user profile error:', error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      console.error('Update user profile exception:', err)
      return { data: null, error: err }
    }
  }
}

export default supabase