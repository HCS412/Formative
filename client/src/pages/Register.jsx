import { useState } from 'react'
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

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.userType) {
      addToast('Please select your account type', 'error')
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
        addToast(result.error || 'Registration failed', 'error')
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
            <h1 className="text-2xl font-bold mb-2">Create Your Account (v2.1)</h1>
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

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />

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

