import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input, Modal } from '@/components/ui'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // 2FA state
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [twoFactorUserId, setTwoFactorUserId] = useState(null)
  const [verifying2FA, setVerifying2FA] = useState(false)
  
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(email, password, rememberMe)
      
      if (result.requires2FA) {
        // User has 2FA enabled, show code input
        setTwoFactorUserId(result.userId)
        setShow2FAModal(true)
        setLoading(false)
        return
      }
      
      if (result.success) {
        addToast('Welcome back!', 'success')
        navigate('/dashboard')
      } else {
        // Handle account lockout
        if (result.lockedFor) {
          addToast(`Account locked. Try again in ${result.lockedFor} minutes.`, 'error')
        } else if (result.attemptsRemaining !== undefined) {
          addToast(`${result.error}. ${result.attemptsRemaining} attempts remaining.`, 'error')
        } else {
          addToast(result.error || 'Login failed', 'error')
        }
      }
    } catch (error) {
      addToast(error.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      addToast('Please enter a valid 6-digit code', 'error')
      return
    }

    setVerifying2FA(true)
    try {
      const response = await fetch('/api/auth/2fa/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: twoFactorUserId, 
          code: twoFactorCode,
          rememberMe 
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store token and user data
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem('authToken', data.token)
        storage.setItem('userData', JSON.stringify(data.user))
        storage.setItem('userType', data.user.user_type)
        
        addToast('Welcome back!', 'success')
        setShow2FAModal(false)
        
        // Use React Router navigation
        setTimeout(() => {
          navigate('/dashboard')
          // Force re-check auth state
          window.location.reload()
        }, 500)
      } else {
        addToast(data.error || 'Invalid code', 'error')
      }
    } catch (error) {
      addToast('Verification failed', 'error')
    } finally {
      setVerifying2FA(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-orange-500/10" />
      
      <div className="w-full max-w-md relative">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-orange-500 relative">
            <div className="absolute w-8 h-8 rounded-full bg-[var(--bg-primary)] top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2" />
          </div>
          <span className="text-2xl font-bold">Formative</span>
        </Link>

        {/* Form Card */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-8 border border-[var(--border-color)]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-[var(--text-secondary)]">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email"
              placeholder="jordan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded accent-teal-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-[var(--text-secondary)]">Remember me</span>
              </label>
              <a href="#" className="text-teal-400 hover:text-teal-300">
                Forgot password?
              </a>
            </div>

            {/* Security Notice */}
            {!rememberMe && (
              <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] p-3 rounded-lg">
                🔒 For security, you'll be logged out when you close the browser. 
                Check "Remember me" to stay signed in.
              </p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--text-secondary)]">
              Don't have an account?{' '}
              <Link to="/register" className="text-teal-400 hover:text-teal-300">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* 2FA Modal */}
      <Modal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        title="Two-Factor Authentication"
        subtitle="Enter the code from your authenticator app"
      >
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-teal-400" />
            </div>
          </div>
          
          <Input
            type="text"
            label="Verification Code"
            placeholder="000000"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />
          
          <p className="text-sm text-[var(--text-secondary)] text-center">
            Open your authenticator app and enter the 6-digit code
          </p>
          
          <Button 
            className="w-full" 
            onClick={handleVerify2FA}
            loading={verifying2FA}
            disabled={twoFactorCode.length !== 6}
          >
            Verify
          </Button>
        </div>
      </Modal>
    </div>
  )
}
