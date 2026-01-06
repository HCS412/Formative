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
        setTwoFactorUserId(result.userId)
        setShow2FAModal(true)
        setLoading(false)
        return
      }

      if (result.success) {
        addToast('Welcome back!', 'success')
        navigate('/dashboard')
      } else {
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
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem('authToken', data.token)
        storage.setItem('userData', JSON.stringify(data.user))
        storage.setItem('userType', data.user.user_type)

        addToast('Welcome back!', 'success')
        setShow2FAModal(false)

        setTimeout(() => {
          navigate('/dashboard')
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
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
            <div className="w-4 h-4 rounded bg-[var(--bg-base)] rotate-45" />
          </div>
          <span className="text-xl font-semibold text-[var(--text-primary)]">Formative</span>
        </Link>

        {/* Form */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--border-subtle)]">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-1">Welcome back</h1>
            <p className="text-sm text-[var(--text-secondary)]">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
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
                  className="w-4 h-4 rounded border-[var(--border-default)] bg-[var(--bg-elevated)] accent-[var(--accent-primary)]"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-[var(--text-secondary)]">Remember me</span>
              </label>
              <a href="#" className="text-[var(--accent-primary)] hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[var(--accent-primary)] hover:underline">
                Sign up
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
            <div className="w-14 h-14 rounded-xl bg-[var(--accent-primary-muted)] flex items-center justify-center">
              <Shield className="w-7 h-7 text-[var(--accent-primary)]" />
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
