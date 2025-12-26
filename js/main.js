// Formative Platform - Main JavaScript

// Global state management
const AppState = {
    currentUser: null,
    currentPage: 'dashboard',
    notifications: [],
    isAuthenticated: false
};

// Utility functions
const Utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Format numbers with commas
    formatNumber: (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    },

    // Generate random ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    // Show notification
    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    // Local storage helpers
    setStorage: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },

    getStorage: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    }
};

// Navigation management
const Navigation = {
    // Show specific page
    showPage: (pageId) => {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Add active class to clicked tab
        const clickedTab = event?.target;
        if (clickedTab && clickedTab.classList && clickedTab.classList.contains('nav-tab')) {
            clickedTab.classList.add('active');
        }

        // Update logo text based on page
        const logoText = document.getElementById('logo-text');
        if (logoText) {
            const pageNames = {
                'dashboard': 'Influencer HQ',
                'profile': 'Media Kit',
                'opportunities': 'Opportunities',
                'analytics': 'Analytics'
            };
            logoText.textContent = pageNames[pageId] || 'Formative';
        }

        // Update app state
        AppState.currentPage = pageId;
        
        // Trigger page-specific initialization
        Navigation.initializePage(pageId);
    },

    // Initialize page-specific functionality
    initializePage: (pageId) => {
        switch (pageId) {
            case 'dashboard':
                Dashboard.init();
                break;
            case 'profile':
                Profile.init();
                break;
            case 'opportunities':
                Opportunities.init();
                break;
            case 'analytics':
                Analytics.init();
                break;
        }
    }
};

// Dashboard functionality
const Dashboard = {
    init: () => {
        Dashboard.animateKPIs();
        Dashboard.setupTaskInteractions();
        Dashboard.setupMessageNotifications();
    },

    animateKPIs: () => {
        const kpiCharts = document.querySelectorAll('.kpi-chart');
        kpiCharts.forEach((chart, index) => {
            setTimeout(() => {
                chart.style.animation = 'rotate 1s ease-in-out';
            }, index * 200);
        });
    },

    setupTaskInteractions: () => {
        document.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('click', () => {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            });
        });
    },

    setupMessageNotifications: () => {
        setInterval(() => {
            const bell = document.querySelector('.icon-btn span');
            if (bell && bell.textContent === '🔔') {
                bell.style.transform = 'rotate(15deg)';
                setTimeout(() => {
                    bell.style.transform = 'rotate(-15deg)';
                }, 200);
                setTimeout(() => {
                    bell.style.transform = 'rotate(0)';
                }, 400);
            }
        }, 10000);
    }
};

// Profile functionality
const Profile = {
    init: () => {
        Profile.animateDemoBars();
        Profile.setupSocialStats();
    },

    animateDemoBars: () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fills = entry.target.querySelectorAll('.demo-fill');
                    fills.forEach(fill => {
                        const width = fill.style.width;
                        fill.style.width = '0';
                        setTimeout(() => {
                            fill.style.width = width;
                        }, 100);
                    });
                }
            });
        });

        const demoSection = document.querySelector('.demographics-grid');
        if (demoSection) {
            observer.observe(demoSection);
        }
    },

    setupSocialStats: () => {
        // Add hover effects to social stats
        document.querySelectorAll('.social-stat').forEach(stat => {
            stat.addEventListener('mouseenter', () => {
                stat.style.transform = 'translateY(-5px)';
                stat.style.borderColor = 'var(--accent-teal)';
            });
            
            stat.addEventListener('mouseleave', () => {
                stat.style.transform = '';
                stat.style.borderColor = '';
            });
        });
    }
};

// Opportunities functionality
const Opportunities = {
    init: () => {
        Opportunities.setupFilters();
        Opportunities.setupSearch();
        Opportunities.setupCardInteractions();
    },

    setupFilters: () => {
        document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                Opportunities.filterResults();
            });
        });
    },

    setupSearch: () => {
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                Opportunities.searchResults(e.target.value);
            }, 300));
        }
    },

    setupCardInteractions: () => {
        document.querySelectorAll('.opportunity-card').forEach(card => {
            card.addEventListener('click', () => {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            });
        });
    },

    filterResults: () => {
        // Implement filtering logic
        console.log('Filtering opportunities...');
    },

    searchResults: (query) => {
        // Implement search logic
        console.log('Searching for:', query);
    }
};

// Analytics functionality
const Analytics = {
    init: () => {
        Analytics.setupCharts();
    },

    setupCharts: () => {
        // Initialize analytics charts
        console.log('Initializing analytics...');
    }
};

// Modal management
const Modal = {
    open: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    close: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    },

    switch: (fromModal, toModal) => {
        Modal.close(fromModal);
        setTimeout(() => Modal.open(toModal), 300);
    }
};

// Form handling
const Forms = {
    handleSignup: (event) => {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            userType: document.querySelector('.user-type-card.selected')?.textContent.toLowerCase()
        };
        
        if (!userData.userType) {
            Utils.showNotification('Please select your account type', 'error');
            return;
        }
        
        // Store user data
        Utils.setStorage('userData', userData);
        Utils.setStorage('userType', userData.userType);
        
        // Redirect to onboarding
        window.location.href = 'onboarding.html';
    },

    handleLogin: (event) => {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        // Simulate login
        Utils.showNotification('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the dashboard page (has dashboard element)
    // Don't run dashboard-specific code on landing page
    const dashboardElement = document.getElementById('dashboard');
    
    if (dashboardElement) {
        // Initialize navigation only on dashboard pages
        Navigation.showPage('dashboard');
        
        // Setup global event listeners
        setupGlobalEventListeners();
        
        // Initialize user data
        initializeUserData();
    }
});

function setupGlobalEventListeners() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                const modalId = modal.id.replace('Modal', '');
                Modal.close(modalId);
            }
        });
    });
}

function initializeUserData() {
    const userData = Utils.getStorage('userData');
    if (userData) {
        AppState.currentUser = userData;
        AppState.isAuthenticated = true;
        
        // Update UI with user data
        const greeting = document.querySelector('.greeting');
        if (greeting) {
            greeting.textContent = `Good morning, ${userData.name}`;
        }
    }
}

// Global functions for HTML onclick handlers
window.showPage = Navigation.showPage;
window.openModal = Modal.open;
window.closeModal = Modal.close;
window.switchModal = Modal.switch;
window.handleSignup = Forms.handleSignup;
window.handleLogin = Forms.handleLogin;


