// Performance optimization utilities for Formative Platform

// Lazy loading for images and content
const LazyLoader = {
    init: () => {
        LazyLoader.setupImageLazyLoading();
        LazyLoader.setupContentLazyLoading();
    },
    
    setupImageLazyLoading: () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },
    
    setupContentLazyLoading: () => {
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    // Trigger animations for visible content
                    PerformanceOptimizer.animateOnScroll(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });
        
        document.querySelectorAll('.card, .feature-card, .opportunity-card').forEach(element => {
            contentObserver.observe(element);
        });
    }
};

// Performance monitoring
const PerformanceMonitor = {
    init: () => {
        PerformanceMonitor.trackPageLoad();
        PerformanceMonitor.trackUserInteractions();
        PerformanceMonitor.setupPerformanceObserver();
    },
    
    trackPageLoad: () => {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Track Core Web Vitals
            PerformanceMonitor.trackCoreWebVitals();
        });
    },
    
    trackCoreWebVitals: () => {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    },
    
    trackUserInteractions: () => {
        let interactionCount = 0;
        const trackInteraction = () => {
            interactionCount++;
            if (interactionCount > 10) {
                // User is actively engaged
                PerformanceOptimizer.enableAdvancedFeatures();
            }
        };
        
        ['click', 'scroll', 'keydown', 'touchstart'].forEach(event => {
            document.addEventListener(event, trackInteraction, { once: false });
        });
    },
    
    setupPerformanceObserver: () => {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.duration > 100) {
                        console.warn('Slow operation detected:', entry.name, entry.duration + 'ms');
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure', 'navigation'] });
        }
    }
};

// Performance optimizations
const PerformanceOptimizer = {
    init: () => {
        PerformanceOptimizer.optimizeImages();
        PerformanceOptimizer.optimizeCSS();
        PerformanceOptimizer.optimizeJavaScript();
        PerformanceOptimizer.setupPreloading();
    },
    
    optimizeImages: () => {
        // Convert images to WebP if supported
        const supportsWebP = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        };
        
        if (supportsWebP()) {
            document.querySelectorAll('img[data-webp]').forEach(img => {
                img.src = img.dataset.webp;
            });
        }
    },
    
    optimizeCSS: () => {
        // Critical CSS inlining
        const criticalCSS = `
            .hero, .navbar, .card { opacity: 0; }
            .loaded { opacity: 1; transition: opacity 0.3s ease; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.appendChild(style);
        
        // Load non-critical CSS asynchronously
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        nonCriticalCSS.forEach(link => {
            link.media = 'print';
            link.onload = () => {
                link.media = 'all';
            };
        });
    },
    
    optimizeJavaScript: () => {
        // Defer non-critical JavaScript
        const scripts = document.querySelectorAll('script[data-defer]');
        scripts.forEach(script => {
            script.defer = true;
        });
        
        // Use requestIdleCallback for non-critical tasks
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                PerformanceOptimizer.loadNonCriticalFeatures();
            });
        } else {
            setTimeout(() => {
                PerformanceOptimizer.loadNonCriticalFeatures();
            }, 2000);
        }
    },
    
    loadNonCriticalFeatures: () => {
        // Load analytics, tracking, and other non-critical features
        console.log('Loading non-critical features...');
    },
    
    setupPreloading: () => {
        // Preload critical resources
        const preloadLinks = [
            { href: 'css/main.css', as: 'style' },
            { href: 'js/main.js', as: 'script' }
        ];
        
        preloadLinks.forEach(link => {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.href = link.href;
            preloadLink.as = link.as;
            document.head.appendChild(preloadLink);
        });
    },
    
    animateOnScroll: (element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    },
    
    enableAdvancedFeatures: () => {
        // Enable advanced features for engaged users
        document.body.classList.add('advanced-features');
    }
};

// Memory management
const MemoryManager = {
    init: () => {
        MemoryManager.setupCleanup();
        MemoryManager.monitorMemoryUsage();
    },
    
    setupCleanup: () => {
        // Clean up event listeners and observers
        window.addEventListener('beforeunload', () => {
            MemoryManager.cleanup();
        });
    },
    
    cleanup: () => {
        // Remove event listeners
        document.removeEventListener('scroll', PerformanceOptimizer.animateOnScroll);
        
        // Clear intervals and timeouts
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }
    },
    
    monitorMemoryUsage: () => {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const used = memory.usedJSHeapSize / 1024 / 1024;
                const total = memory.totalJSHeapSize / 1024 / 1024;
                
                if (used > 50) { // More than 50MB
                    console.warn('High memory usage detected:', used.toFixed(2) + 'MB');
                    MemoryManager.triggerGarbageCollection();
                }
            }, 30000); // Check every 30 seconds
        }
    },
    
    triggerGarbageCollection: () => {
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }
};

// Resource optimization
const ResourceOptimizer = {
    init: () => {
        ResourceOptimizer.optimizeFonts();
        ResourceOptimizer.optimizeAnimations();
        ResourceOptimizer.setupServiceWorker();
    },
    
    optimizeFonts: () => {
        // Preload critical fonts
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        fontPreload.as = 'style';
        document.head.appendChild(fontPreload);
    },
    
    optimizeAnimations: () => {
        // Reduce animations for users who prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--animation-iteration-count', '1');
        }
    },
    
    setupServiceWorker: () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // Service worker not available
            });
        }
    }
};

// Initialize all performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    LazyLoader.init();
    PerformanceMonitor.init();
    PerformanceOptimizer.init();
    MemoryManager.init();
    ResourceOptimizer.init();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LazyLoader,
        PerformanceMonitor,
        PerformanceOptimizer,
        MemoryManager,
        ResourceOptimizer
    };
}
