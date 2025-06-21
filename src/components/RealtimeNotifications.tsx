'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle,
  Zap,
  Crown,
  Settings
} from 'lucide-react'
import { useRealtime, RealtimeNotification } from '../lib/services/realtime'
import { useAuth } from '../contexts/AuthContext'

const RealtimeNotifications: React.FC = () => {
  const { user } = useAuth()
  const { notifications, unreadCount, markAsRead } = useRealtime()
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case 'analysis_complete':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'analysis_failed':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'credit_low':
        return <Zap className="w-5 h-5 text-yellow-400" />
      case 'subscription_update':
        return <Crown className="w-5 h-5 text-purple-400" />
      case 'system_update':
        return <Settings className="w-5 h-5 text-blue-400" />
      default:
        return priority === 'urgent' ? 
          <AlertCircle className="w-5 h-5 text-red-400" /> :
          <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-400/50 bg-red-500/10'
      case 'high': return 'border-orange-400/50 bg-orange-500/10'
      case 'medium': return 'border-blue-400/50 bg-blue-500/10'
      case 'low': return 'border-gray-400/50 bg-gray-500/10'
      default: return 'border-blue-400/50 bg-blue-500/10'
    }
  }

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.read
  )

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read)
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id)
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200"
      >
        <Bell className="w-5 h-5 text-white" />
        
        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Animation for New Notifications */}
        {unreadCount > 0 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-red-400/30 rounded-xl"
          />
        )}
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="absolute right-0 top-full mt-2 w-96 max-h-96 bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white text-lg font-bold">Notifications</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === 'unread'
                        ? 'bg-blue-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                {/* Mark All as Read */}
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  <div className="p-2 space-y-2">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-xl border transition-all duration-200 hover:bg-white/5 ${
                          notification.read 
                            ? 'border-white/10 bg-white/5' 
                            : getPriorityColor(notification.priority)
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type, notification.priority)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm font-medium ${
                                notification.read ? 'text-white/70' : 'text-white'
                              }`}>
                                {notification.title}
                              </h4>
                              
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="flex-shrink-0 p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            <p className={`text-xs mt-1 ${
                              notification.read ? 'text-white/50' : 'text-white/70'
                            }`}>
                              {notification.message}
                            </p>

                            <p className="text-xs text-white/40 mt-2">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RealtimeNotifications
