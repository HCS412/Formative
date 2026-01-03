import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui'

export function Landing() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-orange-500/10" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
                <span>🚀</span>
                <span className="text-teal-400 text-sm font-medium">
                  Launching the Future of Influencer Marketing
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Unite. Create.{' '}
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Grow.
                </span>
                <br />
                The Platform That{' '}
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Transforms
                </span>
                {' '}Collaboration
              </h1>
              
              <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto lg:mx-0">
                Formative brings together influencers, brands, and freelancers in one integrated marketplace. 
                Streamline your workflow, amplify your reach, and unlock unprecedented growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started →
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Watch Demo ▶
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12">
                <div className="flex items-center gap-2">
                  <span className="text-teal-400">✓</span>
                  <span className="text-[var(--text-secondary)]">No Agency Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-400">✓</span>
                  <span className="text-[var(--text-secondary)]">Direct Partnerships</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-400">✓</span>
                  <span className="text-[var(--text-secondary)]">Real-time Analytics</span>
                </div>
              </div>
            </div>
            
            {/* Visual cards */}
            <div className="hidden lg:block relative h-[500px]">
              <div className="absolute top-0 right-0 bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] shadow-xl animate-float">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-[var(--text-secondary)] text-sm">Campaign ROI</div>
                <div className="text-2xl font-bold text-teal-400">+234%</div>
              </div>
              <div className="absolute top-1/3 right-1/4 bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] shadow-xl animate-float" style={{animationDelay: '2s'}}>
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-[var(--text-secondary)] text-sm">Engagement Rate</div>
                <div className="text-2xl font-bold text-orange-400">8.7%</div>
              </div>
              <div className="absolute bottom-0 right-8 bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] shadow-xl animate-float" style={{animationDelay: '4s'}}>
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-[var(--text-secondary)] text-sm">Growth</div>
                <div className="text-2xl font-bold text-green-400">+45K</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
              <span className="text-teal-400 text-sm font-medium">Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              One Platform, Three Powerful Solutions
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Everything you need to succeed in the creator economy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '👤',
                title: 'For Influencers',
                features: [
                  'Streamlined campaign management',
                  'Professional media kit builder',
                  'Real-time analytics dashboard',
                  'Direct brand partnerships',
                  'Secure payment processing',
                ],
              },
              {
                icon: '🏢',
                title: 'For Brands',
                features: [
                  'Access to verified influencers',
                  'Campaign performance tracking',
                  'Automated workflow tools',
                  'ROI measurement & reporting',
                  'Team collaboration features',
                ],
              },
              {
                icon: '🎨',
                title: 'For Freelancers',
                features: [
                  'Global project marketplace',
                  'Portfolio showcase tools',
                  'Integrated billing system',
                  'Skill-based matching',
                  'Project management suite',
                ],
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] hover:border-teal-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
                <ul className="space-y-2">
                  {card.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="text-teal-400">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-teal-500/10 to-orange-500/10 rounded-3xl p-12 border border-[var(--border-color)]">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Join thousands of influencers, brands, and freelancers already growing with Formative
          </p>
          <Link to="/register">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-orange-500 relative">
                <div className="absolute w-5 h-5 rounded-full bg-[var(--bg-primary)] top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2" />
              </div>
              <span className="font-bold">Formative</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors">
                Privacy Policy
              </Link>
              <a href="mailto:support@formative.com" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-[var(--text-secondary)] text-sm">
              © 2025 Formative. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

