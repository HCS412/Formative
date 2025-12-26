import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

function DebugInfo() {
  const location = useLocation();
  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-none animate-bounce">
      v3.0 (LINK FIX) | {location.pathname}
    </div>
  );
}

function ActivityMonitor({ children }) {
  useActivityTimeout()
  useKeyboardShortcuts()
  return children
}

function SearchHandler() {
  const [searchOpen, setSearchOpen] = useState(false)
  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true)
    window.addEventListener('openSearch', handleOpenSearch)
    return () => window.removeEventListener('openSearch', handleOpenSearch)
  }, [])
  return <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" /></div>
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isMediaKit = location.pathname.startsWith('/kit/');
  const isAuthPage = ['/login', '/register', '/onboarding'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && !isMediaKit && !isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/kit/:username" element={<MediaKit />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/dashboard/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/dashboard/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/dashboard/payments" element={<ProtectedRoute><PaymentsWrapper /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <ActivityMonitor>
              <SearchHandler />
              <AppRoutes />
              <DebugInfo />
            </ActivityMonitor>
          </ToastProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
