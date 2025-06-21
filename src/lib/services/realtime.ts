// Realtime Service - Mock implementation for MVP
// This provides a simple event system for real-time notifications

export interface RealtimeNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'analysis_complete' | 'analysis_failed' | 'credit_low' | 'subscription_update' | 'system_update'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  actions?: Array<{
    label: string
    action: () => void
  }>
}

export interface RealtimeEvent {
  type: string
  data: any
  timestamp: string
}

export interface AnalysisStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  step: 'encrypting' | 'uploading' | 'analyzing' | 'scoring' | 'complete' | 'error'
  progress: number
  message: string
  timestamp: string
  estimatedTimeRemaining?: number
  error?: string
}

type EventCallback = (event: RealtimeEvent) => void

class RealtimeServiceClass {
  private listeners: Map<string, EventCallback[]> = new Map()
  private notifications: RealtimeNotification[] = []
  private isConnected: boolean = false
  private analysisSubscriptions: Map<string, (status: AnalysisStatus) => void> = new Map()
  private analysisStatuses: Map<string, AnalysisStatus> = new Map()

  // Initialize the realtime service
  initialize(): void {
    this.isConnected = true
    console.log('Realtime service initialized')
    
    // Simulate some initial notifications
    this.addNotification({
      type: 'info',
      title: 'Welcome to StealthScore',
      message: 'Your secure pitch analysis platform is ready to use.',
      priority: 'medium'
    })
  }

  // Add event listener
  on(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    
    const callbacks = this.listeners.get(eventType)!
    callbacks.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Remove event listener
  off(eventType: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(eventType)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Emit event
  emit(eventType: string, data: any): void {
    const event: RealtimeEvent = {
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    }

    const callbacks = this.listeners.get(eventType)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(event)
        } catch (error) {
          console.error('Error in realtime event callback:', error)
        }
      })
    }
  }

  // Add notification
  addNotification(notification: Omit<RealtimeNotification, 'id' | 'timestamp' | 'read'>): string {
    const newNotification: RealtimeNotification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date().toISOString(),
      read: false
    }

    this.notifications.unshift(newNotification)
    
    // Keep only the last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications.splice(50)
    }

    // Emit notification event
    this.emit('notification', newNotification)

    return newNotification.id
  }

  // Get all notifications
  getNotifications(): RealtimeNotification[] {
    return [...this.notifications]
  }

  // Get unread notifications
  getUnreadNotifications(): RealtimeNotification[] {
    return this.notifications.filter(n => !n.read)
  }

  // Mark notification as read
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.emit('notification_read', { id: notificationId })
      return true
    }
    return false
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
    this.emit('all_notifications_read', {})
  }

  // Remove notification
  removeNotification(notificationId: string): boolean {
    const index = this.notifications.findIndex(n => n.id === notificationId)
    if (index > -1) {
      this.notifications.splice(index, 1)
      this.emit('notification_removed', { id: notificationId })
      return true
    }
    return false
  }

  // Clear all notifications
  clearAllNotifications(): void {
    this.notifications = []
    this.emit('notifications_cleared', {})
  }

  // Get connection status
  isRealtimeConnected(): boolean {
    return this.isConnected
  }

  // Simulate analysis progress updates
  simulateAnalysisProgress(analysisId: string): void {
    const steps = [
      { step: 'encrypting', progress: 10, message: 'Encrypting your pitch...' },
      { step: 'uploading', progress: 30, message: 'Securely uploading encrypted data...' },
      { step: 'analyzing', progress: 60, message: 'AI is analyzing your pitch...' },
      { step: 'scoring', progress: 85, message: 'Calculating scores...' },
      { step: 'complete', progress: 100, message: 'Analysis complete!' }
    ]

    steps.forEach((step, index) => {
      setTimeout(() => {
        this.emit('analysis_progress', {
          analysisId,
          ...step
        })
      }, index * 1000)
    })
  }

  // Simulate system status updates
  simulateSystemStatus(): void {
    const statuses = [
      { service: 'encryption', status: 'operational', message: 'Encryption service running normally' },
      { service: 'ai_analysis', status: 'operational', message: 'AI analysis service operational' },
      { service: 'database', status: 'operational', message: 'Database service healthy' }
    ]

    statuses.forEach(status => {
      this.emit('system_status', status)
    })
  }

  // Subscribe to analysis status updates
  subscribe(analysisId: string, callback: (status: AnalysisStatus) => void): () => void {
    this.analysisSubscriptions.set(analysisId, callback)

    // Return unsubscribe function
    return () => {
      this.analysisSubscriptions.delete(analysisId)
    }
  }

  // Start analysis simulation
  startAnalysis(analysisId: string): void {
    const initialStatus: AnalysisStatus = {
      id: analysisId,
      status: 'pending',
      step: 'encrypting',
      progress: 0,
      message: 'Initializing analysis...',
      timestamp: new Date().toISOString()
    }

    this.analysisStatuses.set(analysisId, initialStatus)
    this.notifyAnalysisUpdate(analysisId, initialStatus)

    // Simulate analysis progress
    this.simulateAnalysisProgressNew(analysisId)
  }

  // Notify analysis update
  private notifyAnalysisUpdate(analysisId: string, status: AnalysisStatus): void {
    const callback = this.analysisSubscriptions.get(analysisId)
    if (callback) {
      callback(status)
    }
  }

  // Enhanced analysis progress simulation
  private simulateAnalysisProgressNew(analysisId: string): void {
    const steps = [
      { status: 'processing', step: 'encrypting', progress: 15, message: 'Encrypting your pitch with AES-256...', delay: 1000 },
      { status: 'processing', step: 'uploading', progress: 35, message: 'Securely uploading encrypted data...', delay: 1500 },
      { status: 'processing', step: 'analyzing', progress: 55, message: 'AI is analyzing your pitch structure...', delay: 2000 },
      { status: 'processing', step: 'analyzing', progress: 75, message: 'Evaluating market potential...', delay: 2500 },
      { status: 'processing', step: 'scoring', progress: 90, message: 'Calculating final scores...', delay: 1000 },
      { status: 'completed', step: 'complete', progress: 100, message: 'Analysis complete!', delay: 500 }
    ] as const

    let currentDelay = 0
    steps.forEach((step, index) => {
      currentDelay += step.delay
      setTimeout(() => {
        const status: AnalysisStatus = {
          id: analysisId,
          status: step.status,
          step: step.step,
          progress: step.progress,
          message: step.message,
          timestamp: new Date().toISOString(),
          estimatedTimeRemaining: index < steps.length - 1 ? Math.ceil((steps.length - index - 1) * 1.5) : undefined
        }

        this.analysisStatuses.set(analysisId, status)
        this.notifyAnalysisUpdate(analysisId, status)
      }, currentDelay)
    })
  }

  // Disconnect
  disconnect(): void {
    this.isConnected = false
    this.listeners.clear()
    this.analysisSubscriptions.clear()
    this.analysisStatuses.clear()
    console.log('Realtime service disconnected')
  }
}

// Export singleton instance
export const RealtimeService = new RealtimeServiceClass()

// React hook for using realtime service
import { useState, useEffect } from 'react'

export function useRealtime() {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize service
    RealtimeService.initialize()
    setIsConnected(RealtimeService.isRealtimeConnected())
    setNotifications(RealtimeService.getNotifications())

    // Listen for new notifications
    const unsubscribeNotification = RealtimeService.on('notification', () => {
      setNotifications(RealtimeService.getNotifications())
    })

    const unsubscribeRead = RealtimeService.on('notification_read', () => {
      setNotifications(RealtimeService.getNotifications())
    })

    const unsubscribeRemoved = RealtimeService.on('notification_removed', () => {
      setNotifications(RealtimeService.getNotifications())
    })

    const unsubscribeCleared = RealtimeService.on('notifications_cleared', () => {
      setNotifications([])
    })

    // Cleanup
    return () => {
      unsubscribeNotification()
      unsubscribeRead()
      unsubscribeRemoved()
      unsubscribeCleared()
    }
  }, [])

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    isConnected,
    markAsRead: RealtimeService.markAsRead.bind(RealtimeService),
    markAllAsRead: RealtimeService.markAllAsRead.bind(RealtimeService),
    removeNotification: RealtimeService.removeNotification.bind(RealtimeService),
    clearAll: RealtimeService.clearAllNotifications.bind(RealtimeService),
    addNotification: RealtimeService.addNotification.bind(RealtimeService)
  }
}