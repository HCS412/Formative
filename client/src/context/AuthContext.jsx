import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { connectSocket, disconnectSocket, onNotification, onConnectionChange } from '@/lib/socket'

const AuthContext = createContext(null)

// Storage helper to use sessionStorage by default, localStorage for "Remember Me"
const storage = {
  get: (key) => {
    // Check sessionStorage first, then localStorage (for "Remember Me")
    return sessionStorage.getItem(key) || localStorage.getItem(key)
  },
  set: (key, value, remember = false) => {
    if (remember) {
      localStorage.setItem(key, value)
      sessionStorage.removeItem(key) // Clean up session if switching to persistent
    } else {
      sessionStorage.setItem(key, value)
      localStorage.removeItem(key) // Clean up persistent if switching to session
    }
  },
  remove: (key) => {
    sessionStorage.removeItem(key)
    localStorage.removeItem(key)
  },
  isRemembered: () => {
    return !!localStorage.getItem('authToken')
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    checkAuth()
  }, [])

  // Connect WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const token = storage.get('authToken')
      if (token) {
        connectSocket(token)

        // Listen for connection changes
        const unsubConnection = onConnectionChange(({ connected }) => {
          setSocketConnected(connected)
        })

        // Listen for new notifications
        const unsubNotification = onNotification((notification) => {
          setUnreadNotifications(prev => prev + 1)
          // Could also show toast here
        })

        return () => {
          unsubConnection()
          unsubNotification()
        }
      }
    } else {
      disconnectSocket()
      setSocketConnected(false)
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    const token = storage.get('authToken')
    const userData = storage.get('userData')
    const remembered = storage.isRemembered()
    setRememberMe(remembered)

    if (token && userData) {
      try {
        // Update API client with token
        api.setToken(token, remembered)
        
        // Verify token is still valid
        const response = await api.getProfile()
        setUser(response.user)
        setIsAuthenticated(true)
      } catch (error) {
        // Token invalid, clear storage
        clearAuth()
      }
    }
    setLoading(false)
  }

  const clearAuth = useCallback(() => {
    storage.remove('authToken')
    storage.remove('userData')
    storage.remove('userType')
    setUser(null)
    setIsAuthenticated(false)
    setRememberMe(false)
  }, [])

  const login = async (email, password, remember = false) => {
    const response = await api.login(email, password, remember)
    if (response.success) {
      setUser(response.user)
      setIsAuthenticated(true)
      setRememberMe(remember)
    }
    return response
  }

  const register = async (userData, remember = false) => {
    const response = await api.register(userData, remember)
    if (response.success) {
      setUser(response.user)
      setIsAuthenticated(true)
      setRememberMe(remember)
    }
    return response
  }

  const logout = useCallback(() => {
    disconnectSocket()
    api.logout()
    clearAuth()
  }, [clearAuth])

  const clearUnreadNotifications = useCallback(() => {
    setUnreadNotifications(0)
  }, [])

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    storage.set('userData', JSON.stringify(updatedUser), rememberMe)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        rememberMe,
        socketConnected,
        unreadNotifications,
        login,
        register,
        logout,
        updateUser,
        checkAuth,
        clearUnreadNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
