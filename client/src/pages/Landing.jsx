import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { DemoVideo } from '@/components/DemoVideo'
import { ArrowRight, Play } from 'lucide-react'

export function Landing() {
  const [showDemo, setShowDemo] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const heroRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation - Glass effect */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.05]">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-white/80 rotate-45" />
              </div>
              <span className="font-medium text-white/90">Formative</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/50 hover:text-white/90 transition-colors duration-300">
                Features
              </a>
              <a href="#about" className="text-sm text-white/50 hover:text-white/90 transition-colors duration-300">
                About
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-white text-black hover:bg-white/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Subtle gradient orb that follows mouse */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.015] blur-[100px] transition-all duration-[2000ms] ease-out pointer-events-none"
          style={{
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
            <span className="text-xs text-white/40 tracking-wide">Now in Beta</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] mb-6 animate-fade-in animation-delay-100">
            <span className="text-white/90">Creator partnerships</span>
            <br />
            <span className="text-white/30">simplified.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/40 max-w-xl mx-auto mb-12 leading-relaxed animate-fade-in animation-delay-200">
            The platform that connects influencers with brands.
            Manage campaigns, track performance, scale your business.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in animation-delay-300">
            <Link to="/register">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 group px-8">
                Start for free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowDemo(true)}
              className="text-white/50 hover:text-white hover:bg-white/5"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch demo
            </Button>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="relative px-6 pb-32 -mt-20">
        <div className="max-w-5xl mx-auto">
          {/* Glass container */}
          <div className="relative rounded-2xl overflow-hidden animate-fade-in animation-delay-500">
            {/* Subtle glow */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent" />

            {/* Main card */}
            <div className="relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-white/[0.03] text-xs text-white/30">
                    formative.co/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard mockup - Very subtle, almost wireframe-like */}
              <div className="p-6 md:p-8">
                <div className="flex gap-6">
                  {/* Sidebar */}
                  <div className="w-44 flex-shrink-0 space-y-1.5 hidden md:block">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.04]">
                      <div className="w-4 h-4 rounded bg-white/20" />
                      <span className="text-sm text-white/60">Dashboard</span>
                    </div>
                    {['Campaigns', 'Messages', 'Analytics', 'Settings'].map((item) => (
                      <div key={item} className="flex items-center gap-2.5 px-3 py-2 text-white/25">
                        <div className="w-4 h-4 rounded bg-white/[0.06]" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 space-y-5">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: 'Followers', value: '24.5K' },
                        { label: 'Engagement', value: '8.2%' },
                        { label: 'Campaigns', value: '12' },
                        { label: 'Revenue', value: '$18.4K' },
                      ].map((stat) => (
                        <div key={stat.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <div className="text-xl md:text-2xl font-semibold text-white/80 mb-1">{stat.value}</div>
                          <div className="text-xs text-white/30">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Content grid */}
                    <div className="grid md:grid-cols-5 gap-3">
                      {/* Main panel */}
                      <div className="md:col-span-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="text-sm text-white/50 mb-4">Active Campaigns</div>
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                              <div className="w-10 h-10 rounded-lg bg-white/[0.04]" />
                              <div className="flex-1">
                                <div className="h-3 w-28 rounded bg-white/10 mb-1.5" />
                                <div className="h-2 w-20 rounded bg-white/[0.05]" />
                              </div>
                              <div className="px-2 py-1 rounded text-xs bg-white/[0.04] text-white/40">Active</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Side panel */}
                      <div className="md:col-span-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="text-sm text-white/50 mb-4">Activity</div>
                        <div className="space-y-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-white/[0.04]" />
                              <div className="flex-1 h-2 rounded bg-white/[0.04]" />
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

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white/90 mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-white/40 max-w-md mx-auto">
              Powerful tools designed for modern creator partnerships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Discovery', desc: 'Find creators that match your brand with smart filters and audience insights.' },
              { title: 'Analytics', desc: 'Track performance, measure ROI, and make data-driven decisions.' },
              { title: 'Messaging', desc: 'Centralize communication with creators and brands in one place.' },
              { title: 'Campaigns', desc: 'Manage deliverables, approvals, and timelines with ease.' },
              { title: 'Payments', desc: 'Built-in escrow, contracts, and invoicing for peace of mind.' },
              { title: 'Media Kits', desc: 'Create stunning media kits that showcase your brand.' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500"
              >
                <h3 className="text-lg font-medium text-white/80 mb-2 group-hover:text-white/90 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/35 leading-relaxed group-hover:text-white/45 transition-colors">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white/90 mb-6">
            Ready to start?
          </h2>
          <p className="text-lg text-white/40 mb-12">
            Join creators and brands building meaningful partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8">
                Create free account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="lg" className="text-white/50 hover:text-white hover:bg-white/5">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-sm bg-white/60 rotate-45" />
            </div>
            <span className="text-sm text-white/40">Formative</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} Formative
          </p>
        </div>
      </footer>

      {/* Demo Modal */}
      <DemoVideo isOpen={showDemo} onClose={() => setShowDemo(false)} />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  )
}
