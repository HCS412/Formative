import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui'

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-[rgba(15,20,25,0.98)] backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-orange-500 relative">
              <div className="absolute w-6 h-6 rounded-full bg-[var(--bg-primary)] top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2" />
            </div>
            <span className="text-xl font-bold text-white">Formative</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[var(--text-secondary)] hover:text-white transition-colors">
              Features
            </a>
            <a href="#solution" className="text-[var(--text-secondary)] hover:text-white transition-colors">
              Solution
            </a>
            <a href="#how-it-works" className="text-[var(--text-secondary)] hover:text-white transition-colors">
              How It Works
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-[var(--text-secondary)] hidden sm:block">
                  Welcome, {user?.name}!
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
                <Link to="/dashboard">
                  <Button size="sm">Dashboard →</Button>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 px-3 py-1.5 text-sm bg-transparent text-white border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] hover:border-teal-500"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 px-3 py-1.5 text-sm bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
