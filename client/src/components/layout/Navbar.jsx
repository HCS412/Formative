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

  // Force navigation with page reload to ensure React Router state syncs
  const handleNavigation = (path) => {
    window.location.href = `${window.location.origin}${window.location.pathname}#${path}`
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

          {/* Navigation Links - Desktop (use JavaScript scroll instead of hash links) */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[var(--text-secondary)] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[var(--text-secondary)] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            >
              Solution
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[var(--text-secondary)] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            >
              How It Works
            </button>
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
                <Button size="sm" onClick={() => handleNavigation('/dashboard')}>
                  Dashboard →
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="no-underline">
                  <Button variant="ghost" size="sm" as="span">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="no-underline">
                  <Button size="sm" as="span">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
