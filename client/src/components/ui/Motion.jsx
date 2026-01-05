import { forwardRef, useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * FadeIn - Fades and optionally slides in content
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 300,
  direction = 'up',
  distance = 16,
  once = true,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [once])

  const directions = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
    none: 'none',
  }

  return (
    <div
      ref={ref}
      className={cn('transition-all', className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : directions[direction],
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Stagger - Staggers animation of children
 */
export function Stagger({
  children,
  className,
  staggerDelay = 50,
  initialDelay = 0,
  ...props
}) {
  return (
    <div className={className} {...props}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <FadeIn key={i} delay={initialDelay + i * staggerDelay}>
              {child}
            </FadeIn>
          ))
        : children}
    </div>
  )
}

/**
 * ScaleIn - Scales in content with optional bounce
 */
export function ScaleIn({
  children,
  className,
  delay = 0,
  duration = 200,
  spring = false,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('transition-all', className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: spring
          ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * AnimatedCounter - Animates number counting up
 */
export function AnimatedCounter({
  value,
  duration = 1000,
  className,
  prefix = '',
  suffix = '',
  decimals = 0,
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = Date.now()
          const startValue = 0
          const endValue = typeof value === 'number' ? value : parseFloat(value) || 0

          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = startValue + (endValue - startValue) * eased

            setDisplayValue(current)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/**
 * Pulse - Creates a pulsing effect (for status indicators)
 */
export function Pulse({ className, color = 'var(--accent-primary)', size = 8 }) {
  return (
    <span className={cn('relative inline-flex', className)}>
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ backgroundColor: color, width: size, height: size }}
      />
    </span>
  )
}

/**
 * Shimmer - Loading shimmer effect
 */
export function Shimmer({ className, width, height }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-[var(--bg-surface)]',
        className
      )}
      style={{ width, height }}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
    </div>
  )
}

/**
 * ProgressRing - Animated circular progress indicator
 */
export function ProgressRing({
  progress = 0,
  size = 40,
  strokeWidth = 3,
  className,
  color = 'var(--accent-primary)',
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className={cn('transform -rotate-90', className)}>
      <circle
        className="text-[var(--bg-surface)]"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="transition-all duration-500 ease-out"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke={color}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  )
}

/**
 * Reveal - Clip-path text reveal animation
 */
export function Reveal({ children, className, delay = 0, duration = 600 }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden', className)}
      style={{
        clipPath: isVisible ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
        transition: `clip-path ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/**
 * FloatingElement - Creates subtle floating animation
 */
export const FloatingElement = forwardRef(function FloatingElement(
  { children, className, amplitude = 8, duration = 4000, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('animate-float', className)}
      style={{
        '--float-amplitude': `${amplitude}px`,
        animationDuration: `${duration}ms`,
      }}
      {...props}
    >
      {children}
    </div>
  )
})

/**
 * GlowingBorder - Card with animated glowing border
 */
export function GlowingBorder({ children, className, ...props }) {
  return (
    <div className={cn('relative group', className)} {...props}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      <div className="relative bg-[var(--bg-elevated)] rounded-xl">{children}</div>
    </div>
  )
}

/**
 * LoadingDots - Three bouncing dots
 */
export function LoadingDots({ className, color = 'var(--accent-primary)' }) {
  return (
    <div className={cn('loading-dots flex items-center gap-1', className)}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </div>
  )
}
