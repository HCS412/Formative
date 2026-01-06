import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/context/AuthContext'
import { onNotification, onMessage } from '@/lib/socket'

/**
 * NotificationToastBridge - Connects WebSocket events to toast notifications
 *
 * This component bridges real-time socket events to the toast notification system,
 * providing immediate user feedback for new messages, opportunities, payments, etc.
 */

// Notification type configurations
const NOTIFICATION_CONFIG = {
  message: {
    type: 'info',
    title: 'New Message',
    getContent: (data) => data.senderName ? `${data.senderName}: ${truncate(data.preview, 50)}` : data.preview || 'You have a new message',
    path: '/dashboard/messages',
    duration: 6000,
  },
  opportunity: {
    type: 'success',
    title: 'New Opportunity',
    getContent: (data) => data.brandName ? `${data.brandName} posted a new opportunity` : 'A new opportunity matches your profile',
    path: '/dashboard/opportunities',
    duration: 8000,
  },
  application: {
    type: 'info',
    title: 'Application Update',
    getContent: (data) => {
      if (data.status === 'accepted') return `Your application to ${data.opportunityTitle || 'the opportunity'} was accepted!`
      if (data.status === 'rejected') return `Your application was not selected for ${data.opportunityTitle || 'this opportunity'}`
      return data.message || 'Your application status has been updated'
    },
    path: '/dashboard/opportunities',
    duration: 8000,
  },
  campaign: {
    type: 'info',
    title: 'Campaign Update',
    getContent: (data) => data.message || 'Your campaign has been updated',
    path: '/dashboard/workspace',
    duration: 6000,
  },
  deliverable: {
    type: 'warning',
    title: 'Deliverable Due',
    getContent: (data) => data.message || 'A deliverable needs your attention',
    path: '/dashboard/workspace',
    duration: 8000,
  },
  payment: {
    type: 'success',
    title: 'Payment Received',
    getContent: (data) => data.amount ? `You received $${data.amount}` : 'You have a new payment',
    path: '/dashboard/workspace',
    duration: 10000,
  },
  review: {
    type: 'info',
    title: 'Review Request',
    getContent: (data) => data.message || 'Content is ready for your review',
    path: '/dashboard/workspace',
    duration: 6000,
  },
  team: {
    type: 'info',
    title: 'Team Update',
    getContent: (data) => data.message || 'You have a team notification',
    path: '/dashboard/workspace',
    duration: 6000,
  },
  system: {
    type: 'info',
    title: 'System Notification',
    getContent: (data) => data.message || 'System notification',
    path: null,
    duration: 5000,
  },
}

// Helper to truncate long messages
function truncate(str, maxLength) {
  if (!str) return ''
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
}

export function NotificationToastBridge() {
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) return

    // Handle general notifications from socket
    const unsubNotification = onNotification((notification) => {
      showNotificationToast(notification)
    })

    // Handle direct messages separately for faster feedback
    const unsubMessage = onMessage((message) => {
      // Only show toast if not already on messages page
      if (!window.location.pathname.includes('/messages')) {
        showNotificationToast({
          type: 'message',
          data: {
            senderName: message.senderName || message.sender?.name,
            preview: message.content,
            conversationId: message.conversationId,
          },
        })
      }
    })

    return () => {
      unsubNotification()
      unsubMessage()
    }
  }, [isAuthenticated])

  const showNotificationToast = (notification) => {
    const config = NOTIFICATION_CONFIG[notification.type] || NOTIFICATION_CONFIG.system
    const content = config.getContent(notification.data || notification)

    // Determine toast type based on notification type and status
    let toastType = config.type
    if (notification.type === 'application') {
      toastType = notification.data?.status === 'accepted' ? 'success' :
                  notification.data?.status === 'rejected' ? 'error' : 'info'
    }

    // Build onClick handler for navigation
    const handleClick = config.path ? () => {
      // Navigate to the relevant page
      navigate(config.path)
    } : undefined

    // Show the toast with click-to-navigate
    toast[toastType](content, {
      title: config.title,
      duration: config.duration,
      category: notification.type,
      onClick: handleClick,
    })

    // Play notification sound if enabled
    playNotificationSound()
  }

  return null // This is a bridge component, no UI
}

// Notification sound (optional, can be disabled in settings)
let audioContext = null

function playNotificationSound() {
  try {
    // Check if user has enabled notification sounds (default: enabled)
    const soundEnabled = localStorage.getItem('formative-notification-sound') !== 'false'
    if (!soundEnabled) return

    // Create a subtle notification sound using Web Audio API
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }

    // Only play if context is running (user has interacted with page)
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Soft, pleasant notification sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.15)
  } catch (e) {
    // Audio not supported or blocked, fail silently
  }
}

export default NotificationToastBridge
