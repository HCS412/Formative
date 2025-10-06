// Authentication system for Formative Platform

const AuthSystem = {
    currentUser: null,
    isAuthenticated: false,
    
    init: () => {
        AuthSystem.checkAuthStatus();
        AuthSystem.setupAuthListeners();
    },
    
    checkAuthStatus: () => {
        const userData = Utils.getStorage('userData');
        const authToken = Utils.getStorage('authToken');
        
        if (userData && authToken) {
            AuthSystem.currentUser = userData;
            AuthSystem.isAuthenticated = true;
            AuthSystem.updateUI();
        }
    },
    
    login: async (email, password) => {
        try {
            // Simulate API call
            const response = await AuthSystem.simulateLogin(email, password);
            
            if (response.success) {
                AuthSystem.currentUser = response.user;
                AuthSystem.isAuthenticated = true;
                
                // Store auth data
                Utils.setStorage('userData', response.user);
                Utils.setStorage('authToken', response.token);
                
                // Update UI
                AuthSystem.updateUI();
                
                // Show success notification
                NotificationSystem.show('Login successful!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
                return { success: true };
            } else {
                NotificationSystem.show(response.message, 'error');
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            NotificationSystem.show('Login failed. Please try again.', 'error');
            return { success: false, message: 'Login failed' };
        }
    },
    
    register: async (userData) => {
        try {
            // Simulate API call
            const response = await AuthSystem.simulateRegister(userData);
            
            if (response.success) {
                AuthSystem.currentUser = response.user;
                AuthSystem.isAuthenticated = true;
                
                // Store auth data
                Utils.setStorage('userData', response.user);
                Utils.setStorage('authToken', response.token);
                
                // Update UI
                AuthSystem.updateUI();
                
                // Show success notification
                NotificationSystem.show('Registration successful!', 'success');
                
                // Redirect to onboarding
                setTimeout(() => {
                    window.location.href = 'onboarding.html';
                }, 1000);
                
                return { success: true };
            } else {
                NotificationSystem.show(response.message, 'error');
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            NotificationSystem.show('Registration failed. Please try again.', 'error');
            return { success: false, message: 'Registration failed' };
        }
    },
    
    logout: () => {
        AuthSystem.currentUser = null;
        AuthSystem.isAuthenticated = false;
        
        // Clear stored data
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        
        // Update UI
        AuthSystem.updateUI();
        
        // Show logout notification
        NotificationSystem.show('Logged out successfully', 'info');
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    },
    
    updateUI: () => {
        // Update greeting
        const greeting = document.querySelector('.greeting');
        if (greeting && AuthSystem.currentUser) {
            greeting.textContent = `Good morning, ${AuthSystem.currentUser.name}`;
        }
        
        // Update avatar
        const avatar = document.querySelector('.avatar');
        if (avatar && AuthSystem.currentUser) {
            const initials = AuthSystem.currentUser.name
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase();
            avatar.textContent = initials;
        }
        
        // Show/hide auth buttons
        const authButtons = document.querySelectorAll('.auth-button');
        authButtons.forEach(button => {
            if (AuthSystem.isAuthenticated) {
                button.style.display = 'none';
            } else {
                button.style.display = 'inline-flex';
            }
        });
        
        // Show/hide user menu
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.style.display = AuthSystem.isAuthenticated ? 'block' : 'none';
        }
    },
    
    setupAuthListeners: () => {
        // Login form handler
        const loginForm = document.querySelector('form[onsubmit="handleLogin(event)"]');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const email = formData.get('email');
                const password = formData.get('password');
                
                await AuthSystem.login(email, password);
            });
        }
        
        // Register form handler
        const registerForm = document.querySelector('form[onsubmit="handleSignup(event)"]');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const userData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    userType: document.querySelector('.user-type-card.selected')?.textContent.toLowerCase()
                };
                
                await AuthSystem.register(userData);
            });
        }
        
        // Logout button handler
        const logoutButton = document.querySelector('.logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                AuthSystem.logout();
            });
        }
    },
    
    // Simulate API calls (replace with real API calls)
    simulateLogin: async (email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock validation
                if (email === 'demo@formative.com' && password === 'demo123') {
                    resolve({
                        success: true,
                        user: {
                            id: 1,
                            name: 'Jordan Lee',
                            email: email,
                            userType: 'influencer',
                            avatar: null
                        },
                        token: 'mock-jwt-token-' + Date.now()
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid email or password'
                    });
                }
            }, 1000);
        });
    },
    
    simulateRegister: async (userData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock validation
                if (userData.email && userData.password && userData.name) {
                    resolve({
                        success: true,
                        user: {
                            id: Date.now(),
                            name: userData.name,
                            email: userData.email,
                            userType: userData.userType || 'influencer',
                            avatar: null
                        },
                        token: 'mock-jwt-token-' + Date.now()
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Please fill in all required fields'
                    });
                }
            }, 1000);
        });
    },
    
    // Password validation
    validatePassword: (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const errors = [];
        if (password.length < minLength) errors.push(`At least ${minLength} characters`);
        if (!hasUpperCase) errors.push('One uppercase letter');
        if (!hasLowerCase) errors.push('One lowercase letter');
        if (!hasNumbers) errors.push('One number');
        if (!hasSpecialChar) errors.push('One special character');
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    
    // Email validation
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Check if user is authenticated
    requireAuth: () => {
        if (!AuthSystem.isAuthenticated) {
            NotificationSystem.show('Please log in to access this page', 'warning');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return false;
        }
        return true;
    }
};

// Initialize authentication system
document.addEventListener('DOMContentLoaded', () => {
    AuthSystem.init();
});

// Export for global access
window.AuthSystem = AuthSystem;
