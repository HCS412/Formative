import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { DemoVideo } from '@/components/DemoVideo'
import { ArrowRight, Play, Sparkles, Zap, Shield, BarChart3, MessageCircle, Users, Check, Star, Globe, Heart, TrendingUp } from 'lucide-react'

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

  const scrollToSection = (e, sectionId) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6 rounded-2xl bg-[#09090b]/80 backdrop-blur-2xl border border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Formative</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-sm text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-sm text-zinc-400 hover:text-white transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold bg-white text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-[1200px] h-[1200px] rounded-full blur-[150px] transition-all duration-[3000ms] ease-out"
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 30%, transparent 70%)',
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-sm font-medium text-indigo-300">Now in Beta</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 animate-fade-in animation-delay-100">
            <span className="text-white">Creator partnerships</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              simplified.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in animation-delay-200">
            The platform that connects influencers with brands.
            <span className="hidden sm:inline"><br /></span>
            <span className="sm:hidden"> </span>
            Manage campaigns, track performance, scale your business.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-300">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold bg-white text-zinc-900 rounded-xl hover:bg-zinc-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
            >
              Start for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => setShowDemo(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl border border-white/20 hover:bg-white/5 transition-all hover:border-white/30"
            >
              <Play className="w-5 h-5" />
              Watch demo
            </button>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="relative px-6 pb-32 -mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden animate-fade-in animation-delay-500">
            {/* Glow border */}
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-white/25 via-white/10 to-transparent" />

            {/* Card */}
            <div className="relative bg-[#0f0f11] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              {/* Browser Chrome */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1.5 rounded-lg bg-white/5 text-sm text-zinc-500 font-mono">
                    formative.co/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8">
                <div className="flex gap-8">
                  {/* Sidebar */}
                  <div className="w-56 flex-shrink-0 space-y-2 hidden lg:block">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <div className="w-5 h-5 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                        <BarChart3 className="w-3 h-3 text-indigo-400" />
                      </div>
                      <span className="text-sm font-medium text-white">Dashboard</span>
                    </div>
                    {[
                      { icon: Zap, name: 'Campaigns' },
                      { icon: MessageCircle, name: 'Messages' },
                      { icon: Users, name: 'Creators' },
                      { icon: Shield, name: 'Settings' },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'Followers', value: '24.5K', change: '+12%', positive: true },
                        { label: 'Engagement', value: '8.2%', change: '+3%', positive: true },
                        { label: 'Campaigns', value: '12', change: '3 active', positive: true },
                        { label: 'Revenue', value: '$18.4K', change: '+24%', positive: true },
                      ].map((stat) => (
                        <div key={stat.label} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                          <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-500">{stat.label}</span>
                            <span className="text-xs font-medium text-emerald-400">{stat.change}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Charts placeholder */}
                    <div className="grid lg:grid-cols-5 gap-4">
                      <div className="lg:col-span-3 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-sm font-medium text-zinc-300">Active Campaigns</span>
                          <span className="text-xs text-zinc-500">View all</span>
                        </div>
                        <div className="space-y-3">
                          {[
                            { name: 'Summer Collection', brand: 'StyleCo', status: 'Active' },
                            { name: 'Tech Review Series', brand: 'GadgetPro', status: 'Active' },
                            { name: 'Fitness Challenge', brand: 'FitLife', status: 'Pending' },
                          ].map((campaign, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">{campaign.name}</div>
                                <div className="text-xs text-zinc-500">{campaign.brand}</div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                campaign.status === 'Active'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {campaign.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                        <div className="text-sm font-medium text-zinc-300 mb-6">Recent Activity</div>
                        <div className="space-y-4">
                          {[
                            { text: 'New brand inquiry from Nike', time: '2m ago' },
                            { text: 'Campaign milestone reached', time: '1h ago' },
                            { text: 'Payment received: $2,500', time: '3h ago' },
                            { text: 'Content approved by StyleCo', time: '5h ago' },
                          ].map((activity, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-zinc-300 truncate">{activity.text}</div>
                                <div className="text-xs text-zinc-600">{activity.time}</div>
                              </div>
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

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything you need
            </h2>
            <p className="text-xl text-zinc-400 max-w-xl mx-auto">
              Powerful tools designed for modern creator partnerships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Creator Discovery', desc: 'Find creators that match your brand with smart filters and real-time audience insights.' },
              { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track performance, measure ROI, and make data-driven decisions with detailed reports.' },
              { icon: MessageCircle, title: 'Messaging Hub', desc: 'Centralize all communication with creators and brands in one unified inbox.' },
              { icon: Zap, title: 'Campaign Management', desc: 'Manage deliverables, approvals, and timelines with automated workflows.' },
              { icon: Shield, title: 'Secure Payments', desc: 'Built-in escrow, contracts, and invoicing for complete peace of mind.' },
              { icon: Sparkles, title: 'Media Kit Builder', desc: 'Create stunning media kits that showcase your brand and attract partnerships.' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 relative">
        {/* Background accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/5 blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Star className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Simple pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose your plan
            </h2>
            <p className="text-xl text-zinc-400 max-w-xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Free Plan */}
            <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Starter</h3>
                <p className="text-sm text-zinc-500">Perfect for getting started</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Up to 3 active campaigns', 'Basic analytics', 'Email support', 'Media kit builder', 'Community access'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="block w-full py-3 text-center text-sm font-semibold text-white rounded-xl border border-white/20 hover:bg-white/5 transition-all"
              >
                Get started free
              </Link>
            </div>

            {/* Pro Plan - Featured */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/30 hover:border-indigo-500/50 transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1.5 rounded-full bg-indigo-500 text-white text-xs font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Pro</h3>
                <p className="text-sm text-zinc-500">For serious creators</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited campaigns', 'Advanced analytics & ROI tracking', 'Priority support', 'Custom media kit domains', 'Contract templates', 'Brand collaboration tools'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="block w-full py-3 text-center text-sm font-semibold bg-white text-zinc-900 rounded-xl hover:bg-zinc-100 transition-all"
              >
                Start free trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Enterprise</h3>
                <p className="text-sm text-zinc-500">For teams and agencies</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'SLA & security compliance', 'Team collaboration', 'White-label options'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-5 h-5 text-violet-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="block w-full py-3 text-center text-sm font-semibold text-white rounded-xl border border-white/20 hover:bg-white/5 transition-all"
              >
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <Heart className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-medium text-violet-300">Our mission</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Empowering creators to build sustainable businesses
              </h2>
              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                We believe every creator deserves the tools to turn their passion into a thriving career. Formative bridges the gap between talented creators and brands looking for authentic partnerships.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '10K+', label: 'Active creators' },
                  { value: '500+', label: 'Brand partners' },
                  { value: '$2M+', label: 'Paid to creators' },
                  { value: '98%', label: 'Satisfaction rate' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-zinc-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-transparent rounded-3xl blur-2xl" />
              <div className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/10">
                <div className="space-y-6">
                  {[
                    { icon: Globe, title: 'Global Reach', desc: 'Connect with brands and creators worldwide' },
                    { icon: TrendingUp, title: 'Data-Driven', desc: 'Make informed decisions with real-time analytics' },
                    { icon: Shield, title: 'Secure & Trusted', desc: 'Protected payments and verified partnerships' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-zinc-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-transparent" />
            <div className="absolute inset-0 bg-[#0f0f11]/80" />

            <div className="relative p-12 md:p-20 text-center border border-white/10 rounded-3xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to get started?
              </h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-lg mx-auto">
                Join thousands of creators and brands building meaningful partnerships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold bg-white text-zinc-900 rounded-xl hover:bg-zinc-100 transition-all hover:scale-[1.02]"
                >
                  Create free account
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white rounded-xl border border-white/20 hover:bg-white/5 transition-all"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Formative</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-zinc-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:hello@formative.co" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm text-zinc-600">© {new Date().getFullYear()} Formative</p>
        </div>
      </footer>

      {/* Demo Modal */}
      <DemoVideo isOpen={showDemo} onClose={() => setShowDemo(false)} />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animation-delay-100 { animation-delay: 0.15s; }
        .animation-delay-200 { animation-delay: 0.3s; }
        .animation-delay-300 { animation-delay: 0.45s; }
        .animation-delay-500 { animation-delay: 0.6s; }
      `}</style>
    </div>
  )
}
