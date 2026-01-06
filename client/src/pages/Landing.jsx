import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { DemoVideo } from '@/components/DemoVideo'
import { ArrowRight, Play, Sparkles, Users, BarChart3, Zap, Shield, MessageCircle } from 'lucide-react'

export function Landing() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Navigation - Minimal, Apple-style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-base)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
              <div className="w-4 h-4 rounded bg-[var(--bg-base)] rotate-45" />
            </div>
            <span className="font-semibold text-[var(--text-primary)]">Formative</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Features
            </a>
            <a href="#solutions" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Solutions
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Clean, focused, impactful */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-primary-subtle)] border border-[var(--accent-primary)]/20 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="text-sm text-[var(--text-secondary)]">Now in Beta</span>
          </div>

          {/* Headline - Large, bold, clean */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Creator partnerships,{' '}
            <span className="text-[var(--text-tertiary)]">simplified.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            The platform that connects influencers with brands. Manage campaigns,
            track performance, and scale your creative business.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg" className="group">
                Start for free
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowDemo(true)}
            >
              <Play className="w-4 h-4 mr-1.5" />
              Watch demo
            </Button>
          </div>
        </div>

        {/* Product Preview - Clean, visible, professional */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="relative">
            {/* Subtle glow */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[var(--border-default)] to-transparent opacity-50" />

            {/* Main container */}
            <div className="relative rounded-2xl border border-[var(--border-default)] bg-[var(--bg-primary)] overflow-hidden shadow-2xl">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-[var(--bg-elevated)] text-xs text-[var(--text-tertiary)]">
                    formative.co/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6 bg-[var(--bg-primary)]">
                <div className="flex gap-6">
                  {/* Sidebar */}
                  <div className="w-48 flex-shrink-0 space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--accent-primary-muted)]">
                      <div className="w-4 h-4 rounded bg-[var(--accent-primary)]" />
                      <span className="text-sm font-medium text-[var(--accent-primary)]">Dashboard</span>
                    </div>
                    {['Campaigns', 'Messages', 'Analytics', 'Settings'].map((item) => (
                      <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--text-muted)]">
                        <div className="w-4 h-4 rounded bg-[var(--bg-hover)]" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Followers', value: '24.5K', color: 'violet' },
                        { label: 'Engagement', value: '8.2%', color: 'orange' },
                        { label: 'Campaigns', value: '12', color: 'emerald' },
                        { label: 'Revenue', value: '$18.4K', color: 'sky' },
                      ].map((stat) => (
                        <div key={stat.label} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                          <div className={`w-8 h-8 rounded-lg mb-3 ${
                            stat.color === 'violet' ? 'bg-violet-500/20' :
                            stat.color === 'orange' ? 'bg-orange-500/20' :
                            stat.color === 'emerald' ? 'bg-emerald-500/20' :
                            'bg-sky-500/20'
                          }`} />
                          <div className="text-xl font-semibold text-[var(--text-primary)]">{stat.value}</div>
                          <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Content grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        <div className="text-sm font-medium text-[var(--text-primary)] mb-3">Active Campaigns</div>
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-elevated)]">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-purple-500/30" />
                              <div className="flex-1">
                                <div className="h-3 w-24 rounded bg-[var(--bg-hover)] mb-1" />
                                <div className="h-2 w-16 rounded bg-[var(--bg-surface)]" />
                              </div>
                              <div className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400">Active</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        <div className="text-sm font-medium text-[var(--text-primary)] mb-3">Recent Activity</div>
                        <div className="space-y-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[var(--bg-hover)]" />
                              <div className="flex-1 h-2 rounded bg-[var(--bg-hover)]" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Grid layout, clean icons */}
      <section id="features" className="py-24 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
              Powerful tools designed to help you grow and manage partnerships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Users,
                title: 'Creator Discovery',
                description: 'Find creators that match your brand with advanced filters and audience insights.',
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                description: 'Track performance, measure ROI, and make data-driven decisions.',
              },
              {
                icon: MessageCircle,
                title: 'Messaging Hub',
                description: 'Centralize all communication with creators and brands in one place.',
              },
              {
                icon: Zap,
                title: 'Campaign Management',
                description: 'Manage deliverables, approvals, and timelines with ease.',
              },
              {
                icon: Shield,
                title: 'Secure Payments',
                description: 'Built-in escrow, contracts, and invoicing for peace of mind.',
              },
              {
                icon: Sparkles,
                title: 'Media Kit Builder',
                description: 'Create stunning media kits that showcase your brand and attract partnerships.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary-muted)] flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions - Clean cards */}
      <section id="solutions" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Built for everyone
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
              Whether you're a creator, brand, or agency — we've got you covered
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                label: 'For Creators',
                title: 'Grow your brand',
                description: 'Professional tools to manage partnerships and get paid faster.',
                features: ['Professional media kits', 'Campaign tracking', 'Direct payments', 'Analytics'],
              },
              {
                label: 'For Brands',
                title: 'Scale campaigns',
                description: 'Find authentic creators and measure real business impact.',
                features: ['Creator discovery', 'Campaign management', 'Performance analytics', 'Team tools'],
                featured: true,
              },
              {
                label: 'For Agencies',
                title: 'Streamline ops',
                description: 'Manage multiple clients with enterprise-grade features.',
                features: ['Multi-brand support', 'White-label options', 'Advanced reporting', 'API access'],
              },
            ].map((solution, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl border transition-all ${
                  solution.featured
                    ? 'bg-[var(--bg-secondary)] border-[var(--accent-primary)]/30'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                }`}
              >
                <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
                  {solution.label}
                </div>
                <h3 className="text-2xl font-bold mb-2">{solution.title}</h3>
                <p className="text-[var(--text-secondary)] mb-6">{solution.description}</p>
                <ul className="space-y-3 mb-8">
                  {solution.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    variant={solution.featured ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-10">
            Join creators and brands building meaningful partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Create free account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 px-6 border-t border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded bg-[var(--bg-base)] rotate-45" />
              </div>
              <span className="font-semibold text-[var(--text-primary)]">Formative</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              © {new Date().getFullYear()} Formative
            </p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <DemoVideo isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  )
}
