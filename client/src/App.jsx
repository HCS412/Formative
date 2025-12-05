import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import { useActivityTimeout } from '@/hooks/useActivityTimeout'
import { config } from '@/lib/wagmi'
import { Landing, Login, Register, Onboarding, Dashboard, Messages, Opportunities, Profile, Settings, Campaigns, Notifications, MediaKit, Payments } from '@/pages'

const queryClient = new QueryClient()

// Activity timeout wrapper - logs out after 15 min inactivity
function ActivityMonitor({ children }) {
  useActivityTimeout()
  return children
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public Route wrapper (redirect to dashboard if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/kit/:username" element={<MediaKit />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/messages" 
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/opportunities" 
        element={
          <ProtectedRoute>
            <Opportunities />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/campaigns" 
        element={
          <ProtectedRoute>
            <Campaigns />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/notifications" 
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/payments" 
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } 
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#14b8a6',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
        >
          <BrowserRouter>
            <AuthProvider>
              <ToastProvider>
                <ActivityMonitor>
                  <AppRoutes />
                </ActivityMonitor>
              </ToastProvider>
            </AuthProvider>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
