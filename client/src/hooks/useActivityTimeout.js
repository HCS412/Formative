import { useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'

const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes
const WARNING_BEFORE_LOGOUT = 60 * 1000 // 1 minute warning

export function useActivityTimeout() {
  const { isAuthenticated, logout } = useAuth()
  const { addToast } = useToast()
  const timeoutRef = useRef(null)
  const warningRef = useRef(null)
  const warningShownRef = useRef(false)

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    warningShownRef.current = false

    if (!isAuthenticated) return

    // Set warning timer (fires 1 minute before logout)
    warningRef.current = setTimeout(() => {
      if (!warningShownRef.current) {
        warningShownRef.current = true
        addToast('You will be logged out in 1 minute due to inactivity', 'warning')
      }
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT)

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      addToast('You have been logged out due to inactivity', 'info')
      logout()
    }, INACTIVITY_TIMEOUT)
  }, [isAuthenticated, logout, addToast])

  useEffect(() => {
    if (!isAuthenticated) return

    // Events that indicate user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ]

    // Throttle to avoid excessive resets
    let lastActivity = Date.now()
    const throttledReset = () => {
      const now = Date.now()
      if (now - lastActivity > 1000) { // Only reset if last activity was >1s ago
        lastActivity = now
        resetTimer()
      }
    }

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, throttledReset, { passive: true })
    })

    // Initial timer
    resetTimer()

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, throttledReset)
      })
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
    }
  }, [isAuthenticated, resetTimer])

  return { resetTimer }
}

