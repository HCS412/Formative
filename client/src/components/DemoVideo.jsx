import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

// Scene data - the story we're telling
const scenes = [
  {
    id: 'intro',
    headline: 'This is',
    emphasis: 'Formative',
    subtext: 'The platform that transforms how creators and brands collaborate.',
    visual: 'logo',
    duration: 5000,
  },
  {
    id: 'connect',
    headline: 'Connect',
    emphasis: 'directly with brands',
    subtext: 'No middlemen. No agencies. Just authentic partnerships that make sense for your audience.',
    visual: 'opportunities',
    duration: 5000,
  },
  {
    id: 'create',
    headline: 'Create',
    emphasis: 'stunning content',
    subtext: 'Manage campaigns, track deliverables, and collaborate seamlessly—all in one place.',
    visual: 'studio',
    duration: 5000,
  },
  {
    id: 'grow',
    headline: 'Track',
    emphasis: 'your growth',
    subtext: 'Real-time analytics that show exactly how your influence is expanding.',
    visual: 'analytics',
    duration: 5000,
  },
  {
    id: 'paid',
    headline: 'Get paid',
    emphasis: 'seamlessly',
    subtext: 'Secure escrow payments. Milestone tracking. Never chase an invoice again.',
    visual: 'payments',
    duration: 5000,
  },
  {
    id: 'cta',
    headline: 'Your creative journey',
    emphasis: 'starts here',
    subtext: null,
    visual: 'cta',
    duration: 6000,
  },
]

// Floating UI mockup components for each scene
function LogoVisual({ isActive }) {
  return (
    <div className={cn(
      "relative flex items-center justify-center transition-all duration-1000",
      isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
    )}>
      {/* Ambient glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-teal-500/20 via-cyan-500/10 to-orange-500/20 blur-[100px] animate-pulse" />

      {/* Logo */}
      <div className={cn(
        "relative w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-orange-500 transition-all duration-1000 delay-500",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-50"
      )}>
        <div className="absolute w-20 h-20 rounded-full bg-[#0a0a0f] top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2" />

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-teal-400/60"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 60}deg) translateX(80px)`,
              animation: `orbit 8s linear infinite`,
              animationDelay: `${i * -1.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function OpportunitiesVisual({ isActive }) {
  const cards = [
    { brand: 'StyleCo', type: 'Fashion', budget: '$5,000', delay: 0 },
    { brand: 'TechNova', type: 'Technology', budget: '$8,000', delay: 200 },
    { brand: 'FitLife', type: 'Fitness', budget: '$3,500', delay: 400 },
  ]

  return (
    <div className="relative w-full max-w-lg perspective-1000">
      {cards.map((card, i) => (
        <div
          key={card.brand}
          className={cn(
            "absolute w-full transition-all duration-700 ease-out",
            isActive ? "opacity-100" : "opacity-0 translate-y-10"
          )}
          style={{
            transitionDelay: isActive ? `${card.delay + 300}ms` : '0ms',
            transform: isActive
              ? `translateY(${i * 90}px) translateX(${i * 20}px) rotateX(-5deg) rotateY(5deg)`
              : `translateY(${i * 40}px) translateX(0) rotateX(0) rotateY(0)`,
            zIndex: 3 - i,
          }}
        >
          <div className="bg-[#12161f]/90 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/30 to-cyan-500/30 flex items-center justify-center text-lg">
                  {card.type === 'Fashion' ? '👗' : card.type === 'Technology' ? '💻' : '💪'}
                </div>
                <div>
                  <p className="font-semibold text-white">{card.brand}</p>
                  <p className="text-xs text-white/50">{card.type}</p>
                </div>
              </div>
              <span className="text-teal-400 font-bold">{card.budget}</span>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs">Instagram</span>
              <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs">TikTok</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function StudioVisual({ isActive }) {
  const columns = [
    { title: 'To Do', count: 3, color: 'bg-gray-500' },
    { title: 'In Progress', count: 2, color: 'bg-orange-500' },
    { title: 'Done', count: 4, color: 'bg-teal-500' },
  ]

  return (
    <div className={cn(
      "relative transition-all duration-1000",
      isActive ? "opacity-100" : "opacity-0"
    )}>
      {/* Kanban board mockup */}
      <div className="bg-[#0d1117]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-white/40 text-sm font-medium">Studio — Task Board</span>
        </div>

        <div className="flex gap-4">
          {columns.map((col, colIndex) => (
            <div
              key={col.title}
              className={cn(
                "flex-1 transition-all duration-500",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: isActive ? `${colIndex * 150 + 400}ms` : '0ms' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-2 h-2 rounded-full", col.color)} />
                <span className="text-white/70 text-sm font-medium">{col.title}</span>
                <span className="text-white/30 text-xs">{col.count}</span>
              </div>
              <div className="space-y-2">
                {[...Array(col.count)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-16 rounded-lg bg-white/5 border border-white/10 transition-all duration-300",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                      transitionDelay: isActive ? `${colIndex * 150 + i * 100 + 600}ms` : '0ms',
                      background: i === 0 && colIndex === 1
                        ? 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(6,182,212,0.05))'
                        : undefined
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnalyticsVisual({ isActive }) {
  const stats = [
    { label: 'Followers', value: '125K', change: '+12%', color: 'teal' },
    { label: 'Engagement', value: '8.4%', change: '+2.1%', color: 'orange' },
    { label: 'Revenue', value: '$24K', change: '+34%', color: 'green' },
  ]

  return (
    <div className={cn(
      "relative transition-all duration-1000",
      isActive ? "opacity-100" : "opacity-0"
    )}>
      <div className="flex gap-4 mb-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              "bg-[#12161f]/90 backdrop-blur-xl rounded-xl p-4 border border-white/10 flex-1 transition-all duration-500",
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: isActive ? `${i * 150 + 300}ms` : '0ms' }}
          >
            <p className="text-white/50 text-xs mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className={cn(
              "text-sm font-medium",
              stat.color === 'teal' ? 'text-teal-400' :
              stat.color === 'orange' ? 'text-orange-400' : 'text-green-400'
            )}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Chart mockup */}
      <div
        className={cn(
          "bg-[#0d1117]/80 backdrop-blur-xl rounded-xl p-6 border border-white/10 transition-all duration-700",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: isActive ? '600ms' : '0ms' }}
      >
        <div className="flex items-end gap-2 h-32">
          {[40, 55, 45, 70, 65, 85, 75, 90, 80, 95, 88, 100].map((h, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-t transition-all duration-500 ease-out",
                i >= 10 ? 'bg-gradient-to-t from-teal-500 to-cyan-400' : 'bg-white/10'
              )}
              style={{
                height: isActive ? `${h}%` : '10%',
                transitionDelay: isActive ? `${i * 50 + 800}ms` : '0ms',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PaymentsVisual({ isActive }) {
  const milestones = [
    { name: 'Brief Approved', amount: '$1,000', status: 'completed' },
    { name: 'Content Delivered', amount: '$2,500', status: 'completed' },
    { name: 'Final Payment', amount: '$1,500', status: 'pending' },
  ]

  return (
    <div className={cn(
      "relative transition-all duration-1000 w-full max-w-md",
      isActive ? "opacity-100" : "opacity-0"
    )}>
      <div className="bg-[#12161f]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/50 text-sm">Campaign Payment</p>
            <p className="text-3xl font-bold text-white">$5,000</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/30 to-teal-500/30 flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>

        <div className="space-y-3">
          {milestones.map((m, i) => (
            <div
              key={m.name}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-500",
                m.status === 'completed' ? 'bg-green-500/10' : 'bg-white/5',
                isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              )}
              style={{ transitionDelay: isActive ? `${i * 200 + 400}ms` : '0ms' }}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-sm",
                m.status === 'completed' ? 'bg-green-500 text-white' : 'bg-white/20 text-white/50'
              )}>
                {m.status === 'completed' ? '✓' : i + 1}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{m.name}</p>
              </div>
              <p className={cn(
                "font-semibold",
                m.status === 'completed' ? 'text-green-400' : 'text-white/50'
              )}>{m.amount}</p>
            </div>
          ))}
        </div>

        {/* Secure badge */}
        <div
          className={cn(
            "mt-4 flex items-center justify-center gap-2 text-white/40 text-xs transition-all duration-500",
            isActive ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDelay: isActive ? '1000ms' : '0ms' }}
        >
          <span>🔒</span>
          <span>Secured by Escrow Protection</span>
        </div>
      </div>
    </div>
  )
}

function CTAVisual({ isActive, onGetStarted }) {
  return (
    <div className={cn(
      "relative flex flex-col items-center transition-all duration-1000",
      isActive ? "opacity-100" : "opacity-0"
    )}>
      {/* Glowing background */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-teal-500/10 via-cyan-500/5 to-orange-500/10 blur-[120px]" />

      <button
        onClick={onGetStarted}
        className={cn(
          "relative group px-10 py-5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/30 hover:scale-105",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: isActive ? '500ms' : '0ms' }}
      >
        <span className="relative z-10">Get Started Free →</span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      <p
        className={cn(
          "mt-6 text-white/40 text-sm transition-all duration-500",
          isActive ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: isActive ? '700ms' : '0ms' }}
      >
        No credit card required
      </p>
    </div>
  )
}

// Scene renderer
function SceneVisual({ scene, isActive, onGetStarted }) {
  switch (scene.visual) {
    case 'logo':
      return <LogoVisual isActive={isActive} />
    case 'opportunities':
      return <OpportunitiesVisual isActive={isActive} />
    case 'studio':
      return <StudioVisual isActive={isActive} />
    case 'analytics':
      return <AnalyticsVisual isActive={isActive} />
    case 'payments':
      return <PaymentsVisual isActive={isActive} />
    case 'cta':
      return <CTAVisual isActive={isActive} onGetStarted={onGetStarted} />
    default:
      return null
  }
}

export function DemoVideo({ isOpen, onClose }) {
  const [currentScene, setCurrentScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const progressRef = useRef(null)

  const scene = scenes[currentScene]

  // Handle scene progression
  useEffect(() => {
    if (!isOpen) {
      setCurrentScene(0)
      setProgress(0)
      setIsPlaying(true)
      return
    }

    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
      return
    }

    // Progress animation
    const startTime = Date.now()
    const duration = scene.duration

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const sceneProgress = Math.min(elapsed / duration, 1)
      setProgress((currentScene + sceneProgress) / scenes.length * 100)
    }, 16)

    // Auto-advance to next scene
    timerRef.current = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(prev => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }, duration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [isOpen, isPlaying, currentScene, scene.duration])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentScene])

  const goToNext = useCallback(() => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1)
      setIsPlaying(true)
    }
  }, [currentScene])

  const goToPrev = useCallback(() => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1)
      setIsPlaying(true)
    }
  }, [currentScene])

  const goToScene = (index) => {
    setCurrentScene(index)
    setIsPlaying(true)
  }

  const handleGetStarted = () => {
    onClose()
    window.location.href = '/register'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#050508] animate-fade-in"
        onClick={onClose}
      />

      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-teal-500/5 blur-[200px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[200px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative w-full h-full flex flex-col">
        {/* Header controls */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-orange-500 relative">
                <div className="absolute w-4 h-4 rounded-full bg-[#050508] top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2" />
              </div>
              <span className="text-white/60 font-medium text-sm tracking-wide">FORMATIVE</span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
          >
            <X className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Main scene content */}
        <div className="flex-1 flex items-center justify-center px-8 md:px-16">
          <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12 md:gap-20">
            {/* Text content */}
            <div className="flex-1 text-center md:text-left">
              <h2
                key={`headline-${currentScene}`}
                className="demo-headline text-4xl md:text-6xl lg:text-7xl font-bold text-white/90 leading-[1.1] tracking-tight"
              >
                <span className="block opacity-60 animate-slide-up">{scene.headline}</span>
                <span
                  className="block bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-slide-up"
                  style={{ animationDelay: '150ms' }}
                >
                  {scene.emphasis}
                </span>
              </h2>

              {scene.subtext && (
                <p
                  key={`subtext-${currentScene}`}
                  className="mt-6 md:mt-8 text-lg md:text-xl text-white/40 max-w-lg leading-relaxed animate-slide-up"
                  style={{ animationDelay: '300ms' }}
                >
                  {scene.subtext}
                </p>
              )}
            </div>

            {/* Visual content */}
            <div className="flex-1 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
              <SceneVisual
                scene={scene}
                isActive={true}
                onGetStarted={handleGetStarted}
              />
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
          {/* Scene indicators */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {scenes.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToScene(i)}
                className={cn(
                  "group relative h-1 rounded-full transition-all duration-300",
                  i === currentScene ? "w-8 bg-white" : "w-4 bg-white/20 hover:bg-white/40"
                )}
              >
                <span className="sr-only">Go to scene {i + 1}</span>
              </button>
            ))}
          </div>

          {/* Navigation row */}
          <div className="flex items-center justify-between max-w-sm mx-auto">
            <button
              onClick={goToPrev}
              disabled={currentScene === 0}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                currentScene === 0
                  ? "text-white/20 cursor-not-allowed"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </button>

            <button
              onClick={goToNext}
              disabled={currentScene === scenes.length - 1}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                currentScene === scenes.length - 1
                  ? "text-white/20 cursor-not-allowed"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-0.5 bg-white/10 rounded-full overflow-hidden max-w-md mx-auto">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Keyboard hints */}
          <div className="mt-4 flex items-center justify-center gap-4 text-white/20 text-xs">
            <span>← → Navigate</span>
            <span>Space Play/Pause</span>
            <span>Esc Close</span>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .demo-headline {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
          font-feature-settings: 'ss01' on, 'ss02' on;
        }
      `}</style>
    </div>
  )
}
