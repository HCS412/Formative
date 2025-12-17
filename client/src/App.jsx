import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import { useActivityTimeout } from '@/hooks/useActivityTimeout'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { SearchModal } from '@/components/SearchModal'
import { Navbar } from '@/components/layout/Navbar'
import { Landing, Login, Register, Onboarding, Dashboard, Messages, Opportunities, Profile, Settings, Campaigns, Notifications, MediaKit } from '@/pages'
import { PaymentsWrapper } from '@/pages/PaymentsWrapper'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// Loading skeleton component
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 bg-[var(--bg-card)] rounded-lg w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-[var(--bg-card)] rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-[var(--bg-card)] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Debug Info Component
function DebugInfo() {
  const location = useLocation();
  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-teal-400 px-3 py-1 rounded-full text-xs font-mono border border-teal-500/30 pointer-events-none">
      v2.3 | {location.pathname}
    </div>
  );
}

// Activity timeout wrapper - logs out after 15 min inactivity
function ActivityMonitor({ children }) {
  useActivityTimeout()
  useKeyboardShortcuts()
  return children
}

// Search modal handler
function SearchHandler() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true)
    window.addEventListener('openSearch', handleOpenSearch)
    return () => window.removeEventListener('openSearch', handleOpenSearch)
  }, [])

  return <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
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
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isMediaKit = location.pathname.startsWith('/kit/');
  const isAuthPage = ['/login', '/register', '/onboarding'].includes(location.pathname);

  return (
    <>
      {/* Show Navbar on all public pages except Auth/MediaKit */}
      {!isDashboard && !isMediaKit && !isAuthPage && <Navbar />}
      
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
              <PaymentsWrapper />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ActivityMonitor>
              <SearchHandler />
              <AppRoutes />
              <DebugInfo />
            </ActivityMonitor>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
