import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { DemoVideo } from '@/components/DemoVideo'

export function Landing() {
  const [showDemo, setShowDemo] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[100px] transition-all duration-[3000ms] ease-out"
          style={{
            background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)',
            left: `${mousePosition.x - 15}%`,
            top: `${mousePosition.y - 15}%`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <div className="w-5 h-5 rounded-md bg-[#09090b] rotate-45" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">Formative</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Features</a>
            <a href="#solutions" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Solutions</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
              </span>
              <span className="text-violet-300 text-sm font-medium">
                Now in Beta
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 animate-fade-in-up animation-delay-100">
              The platform for{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                creator partnerships
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Connect influencers with brands. Manage campaigns with precision.
              Scale your creative business without the overhead.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[180px]">
                  Get started free
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto min-w-[180px]"
                onClick={() => setShowDemo(true)}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch demo
              </Button>
            </div>
          </div>

          {/* Hero visual - Dashboard Preview */}
          <div className="relative mt-20 animate-fade-in-up animation-delay-500">
            {/* Glow behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-pink-500/10 blur-3xl" />

            <div className="relative rounded-2xl shadow-2xl overflow-hidden border-2 border-neutral-700">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-neutral-800 border-b-2 border-neutral-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-neutral-700 text-xs text-neutral-300">
                    app.formative.co/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard mockup with higher contrast */}
              <div className="aspect-[16/9] bg-neutral-900 p-4 md:p-6">
                <div className="grid grid-cols-5 gap-3 md:gap-4 h-full">
                  {/* Sidebar */}
                  <div className="col-span-1 bg-neutral-800 rounded-xl p-3 md:p-4 border-2 border-neutral-600">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 mb-4 shadow-lg shadow-violet-500/50" />
                    <div className="space-y-2">
                      <div className="h-8 rounded-lg bg-violet-600/40 border-2 border-violet-500/60" />
                      <div className="h-8 rounded-lg bg-neutral-700" />
                      <div className="h-8 rounded-lg bg-neutral-700" />
                      <div className="h-8 rounded-lg bg-neutral-700" />
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="col-span-4 space-y-3 md:space-y-4">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <div className="h-6 md:h-8 w-32 md:w-48 rounded-lg bg-neutral-700" />
                      <div className="flex gap-2">
                        <div className="h-6 md:h-8 w-6 md:w-8 rounded-lg bg-neutral-700" />
                        <div className="h-6 md:h-8 w-6 md:w-8 rounded-lg bg-neutral-700" />
                      </div>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-4 gap-2 md:gap-3">
                      {[
                        { iconBg: 'bg-violet-500/50', value: '12.4K', label: 'Followers' },
                        { iconBg: 'bg-orange-500/50', value: '8.2%', label: 'Engagement' },
                        { iconBg: 'bg-emerald-500/50', value: '3', label: 'Campaigns' },
                        { iconBg: 'bg-sky-500/50', value: '$4,250', label: 'Earned' },
                      ].map((stat, i) => (
                        <div key={i} className="rounded-xl bg-neutral-800 border-2 border-neutral-600 p-2 md:p-3">
                          <div className={`w-5 md:w-6 h-5 md:h-6 rounded-md mb-2 ${stat.iconBg}`} />
                          <div className="text-xs md:text-sm font-bold text-white">{stat.value}</div>
                          <div className="text-[10px] md:text-xs text-neutral-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Content area */}
                    <div className="grid grid-cols-3 gap-2 md:gap-3 flex-1">
                      <div className="col-span-2 rounded-xl bg-neutral-800 border-2 border-neutral-600 p-3 md:p-4">
                        <div className="h-3 md:h-4 w-24 md:w-32 rounded bg-neutral-600 mb-3 md:mb-4" />
                        <div className="space-y-2">
                          {[1, 2, 3].map((idx) => (
                            <div key={idx} className="flex items-center gap-2 md:gap-3 p-2 rounded-lg bg-neutral-700">
                              <div className="w-6 md:w-8 h-6 md:h-8 rounded-lg bg-violet-500/40" />
                              <div className="flex-1 space-y-1">
                                <div className="h-2.5 md:h-3 w-16 md:w-24 rounded bg-neutral-500" />
                                <div className="h-2 w-12 md:w-16 rounded bg-neutral-600" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl bg-neutral-800 border-2 border-neutral-600 p-3 md:p-4">
                        <div className="h-3 md:h-4 w-16 md:w-20 rounded bg-neutral-600 mb-3 md:mb-4" />
                        <div className="space-y-2">
                          {[1, 2, 3].map((idx) => (
                            <div key={idx} className="h-6 md:h-8 rounded-lg bg-neutral-700" />
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

      {/* Features Section */}
      <section id="features" className="relative py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
              Everything you need to scale
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              From discovery to payment, we've built tools that eliminate friction at every step
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Creator Discovery',
                description: 'Find the perfect creators with advanced filters for niche, engagement rate, and audience demographics.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                title: 'Campaign Management',
                description: 'Track deliverables, approvals, and timelines in one unified workspace built for collaboration.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Real-time Analytics',
                description: 'Monitor performance metrics, track ROI, and optimize campaigns with data-driven insights.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                title: 'Secure Payments',
                description: 'Process payments, manage contracts, and handle invoicing with built-in escrow protection.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: 'Messaging Hub',
                description: 'Centralize all communication with creators, brands, and team members in one place.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                ),
                title: 'Media Kit Builder',
                description: 'Create stunning media kits that showcase your brand and attract premium partnerships.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-[#111113] rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4 group-hover:bg-violet-500/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="relative py-24 md:py-32 px-6 bg-[#0d0d0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
              Built for every creator
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Whether you're a solo creator or enterprise brand, we scale with you
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                label: 'For Creators',
                title: 'Grow your brand',
                description: 'Manage partnerships, track your growth, and get paid faster with tools designed for modern creators.',
                features: ['Professional media kits', 'Campaign tracking', 'Direct payments', 'Analytics dashboard'],
              },
              {
                label: 'For Brands',
                title: 'Scale campaigns',
                description: 'Find authentic creators, manage campaigns at scale, and measure real business impact.',
                features: ['Creator discovery', 'Campaign management', 'Performance analytics', 'Team collaboration'],
                featured: true,
              },
              {
                label: 'For Agencies',
                title: 'Streamline operations',
                description: 'Manage multiple clients and campaigns with enterprise-grade tools and reporting.',
                features: ['Multi-brand management', 'White-label options', 'Advanced reporting', 'API access'],
              },
            ].map((solution, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-6 md:p-8 border transition-all duration-300 ${
                  solution.featured
                    ? 'bg-gradient-to-b from-violet-500/10 to-transparent border-violet-500/30 lg:scale-105'
                    : 'bg-[#111113] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {solution.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-500 text-xs font-medium text-white">
                    Most Popular
                  </div>
                )}
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium mb-4 bg-zinc-800 text-zinc-300">
                  {solution.label}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">{solution.title}</h3>
                <p className="text-zinc-400 mb-6 text-sm md:text-base">{solution.description}</p>
                <ul className="space-y-3 mb-8">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                      <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="block">
                  <Button variant={solution.featured ? 'primary' : 'secondary'} className="w-full">
                    Get started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500 opacity-[0.03] blur-[120px] rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white">
            Ready to get started?
          </h2>
          <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
            Join creators and brands building meaningful partnerships on Formative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                Create free account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-md bg-[#09090b] rotate-45" />
                </div>
                <span className="text-lg font-semibold text-white">Formative</span>
              </Link>
              <p className="text-sm text-zinc-500 leading-relaxed">
                The modern platform for creator partnerships and influencer marketing.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Security'],
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Contact'],
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms'],
              },
            ].map((column, i) => (
              <div key={i}>
                <h4 className="font-medium mb-4 text-white">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} Formative. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <a key={social} href="#" className="text-zinc-500 hover:text-white transition-colors duration-200">
                  <span className="text-sm">{social}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      <DemoVideo isOpen={showDemo} onClose={() => setShowDemo(false)} />

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  )
}
