import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

import { AuthProvider, useAuth } from '@/context/AuthContext'
import { PermissionProvider } from '@/context/PermissionContext'
import { ToastProvider } from '@/components/ui/Toast'
import { useActivityTimeout } from '@/hooks/useActivityTimeout'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { SearchModal } from '@/components/SearchModal'
import { Navbar } from '@/components/layout/Navbar'
import { Landing, Login, Register, Onboarding, Dashboard, Messages, Opportunities, Profile, Settings, Campaigns, Notifications, MediaKit, Links, Teams, Shop, PublicShop, TermsOfService, PrivacyPolicy, Workspace, Studio } from '@/pages'
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

// Debug component removed - routing is working!

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
  const isPublicShop = location.pathname.startsWith('/shop/');
  const isAuthPage = ['/login', '/register', '/onboarding'].includes(location.pathname);
  const isLegalPage = ['/terms', '/privacy'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && !isMediaKit && !isPublicShop && !isAuthPage && !isLegalPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/kit/:username" element={<MediaKit />} />
          <Route path="/shop/:username" element={<PublicShop />} />
          <Route path="/shop/:username/:productSlug" element={<PublicShop />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/dashboard/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/dashboard/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
          <Route path="/dashboard/workspace/:tab" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
          <Route path="/dashboard/studio" element={<ProtectedRoute><Studio /></ProtectedRoute>} />
          <Route path="/dashboard/studio/:tab" element={<ProtectedRoute><Studio /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/dashboard/links" element={<ProtectedRoute><Links /></ProtectedRoute>} />
          <Route path="/dashboard/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
          {/* Legacy routes - redirect to workspace */}
          <Route path="/dashboard/campaigns" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
          <Route path="/dashboard/payments" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
          <Route path="/dashboard/teams" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
          
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
          <PermissionProvider>
            <ToastProvider>
              <ActivityMonitor>
                <SearchHandler />
                <AppRoutes />
              </ActivityMonitor>
            </ToastProvider>
          </PermissionProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
