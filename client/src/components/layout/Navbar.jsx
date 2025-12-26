import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Ultra-simple navbar with NO Button component - just plain Links
export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Inline button styles
  const btnBase = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 px-3 py-1.5 text-sm"
  const btnPrimary = `${btnBase} bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-lg`
  const btnGhost = `${btnBase} bg-transparent text-white border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]`

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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <span className="text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Features
            </span>
            <span className="text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
              onClick={() => document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' })}>
              Solution
            </span>
            <span className="text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              How It Works
            </span>
          </div>

          {/* Auth - PLAIN LINKS, no wrapper components */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-[var(--text-secondary)] hidden sm:block">
                  Welcome, {user?.name}!
                </span>
                <button onClick={handleLogout} className={btnGhost}>
                  Sign Out
                </button>
                <Link to="/dashboard" className={btnPrimary}>
                  Dashboard →
                </Link>
              </>
            ) : (
              <>
                {/* PLAIN LINK - no wrapper, just styled Link */}
                <Link to="/login" className={btnGhost}>
                  Sign In
                </Link>
                <Link to="/register" className={btnPrimary}>
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
