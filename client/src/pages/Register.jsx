import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'

const userTypes = [
  { id: 'influencer', icon: '👤', label: 'Influencer' },
  { id: 'brand', icon: '🏢', label: 'Brand' },
  { id: 'freelancer', icon: '🎨', label: 'Freelancer' },
]

// Password requirements
const passwordRequirements = [
  { id: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'One number', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPasswordHints, setShowPasswordHints] = useState(false)
  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  // Check password strength in real-time
  const passwordStrength = useMemo(() => {
    const passed = passwordRequirements.filter(req => req.test(formData.password))
    return {
      passed,
      total: passwordRequirements.length,
      isValid: passed.length === passwordRequirements.length,
      percentage: (passed.length / passwordRequirements.length) * 100
    }
  }, [formData.password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.userType) {
      addToast('Please select your account type', 'error')
      return
    }

    // Client-side password validation
    if (!passwordStrength.isValid) {
      addToast('Please meet all password requirements', 'error')
      setShowPasswordHints(true)
      return
    }

    setLoading(true)

    try {
      const result = await register(formData)
      if (result.success) {
        // Store user type for onboarding
        localStorage.setItem('userType', formData.userType)
        sessionStorage.setItem('userType', formData.userType)
        addToast('Account created! Let\'s set up your profile.', 'success')
        navigate('/onboarding')
      } else {
        // Handle password requirement errors from server
        if (result.requirements) {
          addToast(result.error, 'error')
          setShowPasswordHints(true)
        } else {
          addToast(result.error || 'Registration failed', 'error')
        }
      }
    } catch (error) {
      addToast(error.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
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
            <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
            <p className="text-[var(--text-secondary)]">Join the future of influencer marketing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-3">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: type.id }))}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200',
                      formData.userType === type.id
                        ? 'bg-teal-500/20 border-teal-500 text-teal-400'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-teal-500/50'
                    )}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Input
              type="text"
              label="Full Name"
              placeholder="Jordan Lee"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="jordan@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />

            <div>
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                onFocus={() => setShowPasswordHints(true)}
                required
              />
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-300",
                        passwordStrength.percentage < 40 ? "bg-red-500" :
                        passwordStrength.percentage < 80 ? "bg-yellow-500" : "bg-green-500"
                      )}
                      style={{ width: `${passwordStrength.percentage}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Password Requirements */}
              {showPasswordHints && (
                <div className="mt-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <p className="text-xs text-[var(--text-muted)] mb-2">Password must contain:</p>
                  <ul className="space-y-1">
                    {passwordRequirements.map((req) => (
                      <li 
                        key={req.id}
                        className={cn(
                          "text-xs flex items-center gap-2",
                          req.test(formData.password) ? "text-green-400" : "text-[var(--text-muted)]"
                        )}
                      >
                        {req.test(formData.password) ? "✓" : "○"} {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--text-secondary)]">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-400 hover:text-teal-300">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

