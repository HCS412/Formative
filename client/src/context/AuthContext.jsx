import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')

    if (token && userData) {
      try {
        // Verify token is still valid
        const response = await api.getProfile()
        setUser(response.user)
        setIsAuthenticated(true)
      } catch (error) {
        // Token invalid, clear storage
        api.clearToken()
        setUser(null)
        setIsAuthenticated(false)
      }
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    const response = await api.login(email, password)
    if (response.success) {
      setUser(response.user)
      setIsAuthenticated(true)
    }
    return response
  }

  const register = async (userData) => {
    const response = await api.register(userData)
    if (response.success) {
      setUser(response.user)
      setIsAuthenticated(true)
    }
    return response
  }

  const logout = () => {
    api.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
    localStorage.setItem('userData', JSON.stringify({ ...user, ...updates }))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        checkAuth,
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

