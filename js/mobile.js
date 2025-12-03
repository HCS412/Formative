// Mobile-specific JavaScript functionality

// Mobile menu functionality
const MobileMenu = {
    init: () => {
        MobileMenu.createMobileMenu();
        MobileMenu.setupEventListeners();
    },

    createMobileMenu: () => {
        // Create mobile menu toggle button
        const navSection = document.querySelector('.nav-section');
        if (navSection && window.innerWidth <= 768) {
            const mobileToggle = document.createElement('button');
            mobileToggle.className = 'mobile-menu-toggle';
            mobileToggle.innerHTML = '☰';
            mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
            
            navSection.appendChild(mobileToggle);
        }
    },

    setupEventListeners: () => {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', MobileMenu.toggleMenu);
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const mobileMenu = document.querySelector('.mobile-menu');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            
            if (mobileMenu && mobileToggle && 
                !mobileMenu.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                MobileMenu.closeMenu();
            }
        });
    },

    toggleMenu: () => {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('active');
        }
    },

    closeMenu: () => {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    }
};

// Touch interactions for mobile
const TouchInteractions = {
    init: () => {
        TouchInteractions.setupSwipeGestures();
        TouchInteractions.setupTouchFeedback();
    },

    setupSwipeGestures: () => {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left
                    TouchInteractions.handleSwipeLeft();
                } else {
                    // Swipe right
                    TouchInteractions.handleSwipeRight();
                }
            }
        });
    },

    handleSwipeLeft: () => {
        // Handle swipe left gesture
        console.log('Swipe left detected');
    },

    handleSwipeRight: () => {
        // Handle swipe right gesture
        console.log('Swipe right detected');
    },

    setupTouchFeedback: () => {
        // Add touch feedback to interactive elements
        const touchElements = document.querySelectorAll('.btn, .card, .opportunity-card, .task-card');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
                element.style.transition = 'transform 0.1s ease';
            });
            
            element.addEventListener('touchend', () => {
                element.style.transform = '';
            });
        });
    }
};

// Mobile-specific optimizations
const MobileOptimizations = {
    init: () => {
        MobileOptimizations.detectMobile();
        MobileOptimizations.optimizeImages();
        MobileOptimizations.setupViewport();
    },

    detectMobile: () => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            document.body.classList.add('mobile-device');
        }
    },

    optimizeImages: () => {
        // Lazy load images on mobile
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
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    setupViewport: () => {
        // Prevent zoom on input focus (iOS)
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            });
        });
    }
};

// Mobile form enhancements
const MobileForms = {
    init: () => {
        MobileForms.setupFormValidation();
        MobileForms.setupAutoComplete();
    },

    setupFormValidation: () => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    MobileForms.showValidationErrors(form);
                }
            });
        });
    },

    showValidationErrors: (form) => {
        const invalidFields = form.querySelectorAll(':invalid');
        invalidFields.forEach(field => {
            field.style.borderColor = 'var(--accent-red)';
            field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        });
    },

    setupAutoComplete: () => {
        // Enhance autocomplete for mobile
        const inputs = document.querySelectorAll('input[type="email"], input[type="tel"]');
        inputs.forEach(input => {
            input.setAttribute('autocomplete', 'on');
            input.setAttribute('autocapitalize', 'off');
            input.setAttribute('autocorrect', 'off');
            input.setAttribute('spellcheck', 'false');
        });
    }
};

// Initialize mobile functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        MobileMenu.init();
        TouchInteractions.init();
        MobileOptimizations.init();
        MobileForms.init();
    }
});

// Re-initialize on resize
window.addEventListener('resize', Utils.debounce(() => {
    if (window.innerWidth <= 768) {
        MobileMenu.init();
        TouchInteractions.init();
        MobileOptimizations.init();
        MobileForms.init();
    }
}, 250));


