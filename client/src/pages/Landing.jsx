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
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Navigation - Glass effect */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08]">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.12] flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-sm bg-white rotate-45" />
              </div>
              <span className="font-semibold text-white">Formative</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                Features
              </a>
              <a href="#about" className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                About
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/[0.08]">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-white text-black font-medium hover:bg-white/90">
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
          className="absolute w-[1000px] h-[1000px] rounded-full opacity-[0.03] blur-[120px] transition-all duration-[2500ms] ease-out pointer-events-none"
          style={{
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            <span className="text-sm text-white/70">Now in Beta</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] mb-8 animate-fade-in animation-delay-100">
            <span className="text-white">Creator partnerships</span>
            <br />
            <span className="text-white/40">simplified.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in animation-delay-200">
            The platform that connects influencers with brands.
            <br className="hidden md:block" />
            Manage campaigns, track performance, scale your business.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-300">
            <Link to="/register">
              <Button size="lg" className="bg-white text-black font-medium hover:bg-white/90 group px-8 h-12">
                Start for free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowDemo(true)}
              className="text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.1] h-12"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch demo
            </Button>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="relative px-6 pb-40 -mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Glass container */}
          <div className="relative rounded-3xl overflow-hidden animate-fade-in animation-delay-500">
            {/* Glow effect */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-white/20 via-white/5 to-transparent" />

            {/* Main card */}
            <div className="relative bg-[#111113] border border-white/[0.08] rounded-3xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/[0.15]" />
                  <div className="w-3 h-3 rounded-full bg-white/[0.15]" />
                  <div className="w-3 h-3 rounded-full bg-white/[0.15]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1.5 rounded-lg bg-white/[0.05] text-sm text-white/40">
                    formative.co/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="p-8">
                <div className="flex gap-8">
                  {/* Sidebar */}
                  <div className="w-52 flex-shrink-0 space-y-2 hidden md:block">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.08]">
                      <div className="w-5 h-5 rounded-md bg-white/30" />
                      <span className="text-sm font-medium text-white/80">Dashboard</span>
                    </div>
                    {['Campaigns', 'Messages', 'Analytics', 'Settings'].map((item) => (
                      <div key={item} className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white/60 transition-colors cursor-pointer">
                        <div className="w-5 h-5 rounded-md bg-white/[0.08]" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 space-y-6">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Followers', value: '24.5K' },
                        { label: 'Engagement', value: '8.2%' },
                        { label: 'Campaigns', value: '12' },
                        { label: 'Revenue', value: '$18.4K' },
                      ].map((stat) => (
                        <div key={stat.label} className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                          <div className="text-2xl md:text-3xl font-semibold text-white mb-1">{stat.value}</div>
                          <div className="text-sm text-white/40">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Content grid */}
                    <div className="grid md:grid-cols-5 gap-4">
                      {/* Main panel */}
                      <div className="md:col-span-3 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                        <div className="text-sm font-medium text-white/60 mb-5">Active Campaigns</div>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04]">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/[0.1] to-white/[0.05]" />
                              <div className="flex-1">
                                <div className="h-4 w-32 rounded-md bg-white/[0.15] mb-2" />
                                <div className="h-3 w-24 rounded-md bg-white/[0.08]" />
                              </div>
                              <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.08] text-white/60">Active</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Side panel */}
                      <div className="md:col-span-2 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                        <div className="text-sm font-medium text-white/60 mb-5">Activity</div>
                        <div className="space-y-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-full bg-white/[0.08]" />
                              <div className="flex-1 h-3 rounded-md bg-white/[0.08]" />
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
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-5">
              Everything you need
            </h2>
            <p className="text-xl text-white/50 max-w-lg mx-auto">
              Powerful tools designed for modern creator partnerships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
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
                className="group p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-white/50 leading-relaxed group-hover:text-white/60 transition-colors">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
            Ready to start?
          </h2>
          <p className="text-xl text-white/50 mb-12">
            Join creators and brands building meaningful partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-black font-medium hover:bg-white/90 px-8 h-12">
                Create free account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="lg" className="text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.1] h-12">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/[0.12] flex items-center justify-center">
              <div className="w-3 h-3 rounded-sm bg-white rotate-45" />
            </div>
            <span className="font-medium text-white/60">Formative</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} Formative
          </p>
        </div>
      </footer>

      {/* Demo Modal */}
      <DemoVideo isOpen={showDemo} onClose={() => setShowDemo(false)} />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
