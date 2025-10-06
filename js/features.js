// Enhanced features and interactivity for Formative Platform

// Notification system
const NotificationSystem = {
    container: null,
    
    init: () => {
        NotificationSystem.createContainer();
    },
    
    createContainer: () => {
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
            NotificationSystem.container = container;
        }
    },
    
    show: (message, type = 'info', duration = 5000) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            padding: 1rem;
            margin-bottom: 0.5rem;
            box-shadow: var(--shadow-lg);
            animation: slideInRight 0.3s ease;
            position: relative;
            ${type === 'success' ? 'border-left: 4px solid var(--accent-green);' : ''}
            ${type === 'error' ? 'border-left: 4px solid var(--accent-red);' : ''}
            ${type === 'warning' ? 'border-left: 4px solid var(--accent-yellow);' : ''}
            ${type === 'info' ? 'border-left: 4px solid var(--accent-teal);' : ''}
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="notification-icon" style="font-size: 1.2rem;">
                    ${type === 'success' ? '✅' : ''}
                    ${type === 'error' ? '❌' : ''}
                    ${type === 'warning' ? '⚠️' : ''}
                    ${type === 'info' ? 'ℹ️' : ''}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 500; margin-bottom: 0.25rem;">${message}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 1.2rem;">
                    ×
                </button>
            </div>
        `;
        
        NotificationSystem.container.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
};

// Search functionality
const SearchSystem = {
    init: () => {
        SearchSystem.setupSearchInputs();
        SearchSystem.setupFilters();
    },
    
    setupSearchInputs: () => {
        const searchInputs = document.querySelectorAll('.search-bar input, input[type="search"]');
        searchInputs.forEach(input => {
            input.addEventListener('input', Utils.debounce((e) => {
                SearchSystem.performSearch(e.target.value);
            }, 300));
        });
    },
    
    setupFilters: () => {
        const filterInputs = document.querySelectorAll('.filter-option input[type="checkbox"]');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                SearchSystem.applyFilters();
            });
        });
    },
    
    performSearch: (query) => {
        const searchableElements = document.querySelectorAll('.opportunity-card, .task-card, .message-item');
        const queryLower = query.toLowerCase();
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            const isMatch = text.includes(queryLower);
            
            element.style.display = isMatch ? 'block' : 'none';
            element.style.opacity = isMatch ? '1' : '0.5';
        });
    },
    
    applyFilters: () => {
        const checkedFilters = Array.from(document.querySelectorAll('.filter-option input:checked'))
            .map(input => input.value || input.nextSibling.textContent.trim());
        
        const filterableElements = document.querySelectorAll('.opportunity-card');
        
        filterableElements.forEach(element => {
            const elementText = element.textContent.toLowerCase();
            const matchesFilter = checkedFilters.length === 0 || 
                checkedFilters.some(filter => elementText.includes(filter.toLowerCase()));
            
            element.style.display = matchesFilter ? 'block' : 'none';
        });
    }
};

// Data visualization helpers
const DataVisualization = {
    init: () => {
        DataVisualization.animateCounters();
        DataVisualization.animateProgressBars();
    },
    
    animateCounters: () => {
        const counters = document.querySelectorAll('.stat-value, .social-count, .kpi-value');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            if (target) {
                DataVisualization.animateCounter(counter, 0, target, 2000);
            }
        });
    },
    
    animateCounter: (element, start, end, duration) => {
        const startTime = performance.now();
        const originalText = element.textContent;
        const isPercentage = originalText.includes('%');
        const isCurrency = originalText.includes('$');
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            
            let displayValue = current;
            if (isPercentage) displayValue += '%';
            if (isCurrency) displayValue = '$' + current.toLocaleString();
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    animateProgressBars: () => {
        const progressBars = document.querySelectorAll('.demo-fill, .progress-bar-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width || bar.dataset.width;
                    if (width) {
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    }
                }
            });
        });
        
        progressBars.forEach(bar => observer.observe(bar));
    }
};

// Interactive elements
const InteractiveElements = {
    init: () => {
        InteractiveElements.setupHoverEffects();
        InteractiveElements.setupClickEffects();
        InteractiveElements.setupDragAndDrop();
    },
    
    setupHoverEffects: () => {
        const hoverElements = document.querySelectorAll('.card, .opportunity-card, .task-card');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px)';
                element.style.boxShadow = 'var(--shadow-lg)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
                element.style.boxShadow = '';
            });
        });
    },
    
    setupClickEffects: () => {
        const clickElements = document.querySelectorAll('.btn, .card, .opportunity-card');
        clickElements.forEach(element => {
            element.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                element.style.position = 'relative';
                element.style.overflow = 'hidden';
                element.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    },
    
    setupDragAndDrop: () => {
        const draggableElements = document.querySelectorAll('.task-card, .deal-step');
        draggableElements.forEach(element => {
            element.draggable = true;
            
            element.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', element.id);
                element.style.opacity = '0.5';
            });
            
            element.addEventListener('dragend', () => {
                element.style.opacity = '';
            });
        });
    }
};

// Form enhancements
const FormEnhancements = {
    init: () => {
        FormEnhancements.setupValidation();
        FormEnhancements.setupAutoSave();
        FormEnhancements.setupFileUpload();
    },
    
    setupValidation: () => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    FormEnhancements.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        FormEnhancements.validateField(input);
                    }
                });
            });
        });
    },
    
    validateField: (field) => {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        let isValid = true;
        let message = '';
        
        if (required && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        } else if (type === 'tel' && value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\D/g, ''))) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }
        
        FormEnhancements.showFieldValidation(field, isValid, message);
        return isValid;
    },
    
    showFieldValidation: (field, isValid, message) => {
        const errorElement = field.parentElement.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        if (!isValid) {
            field.classList.add('error');
            field.style.borderColor = 'var(--accent-red)';
            
            const error = document.createElement('div');
            error.className = 'field-error';
            error.style.cssText = `
                color: var(--accent-red);
                font-size: 0.85rem;
                margin-top: 0.25rem;
            `;
            error.textContent = message;
            field.parentElement.appendChild(error);
        } else {
            field.classList.remove('error');
            field.style.borderColor = '';
        }
    },
    
    setupAutoSave: () => {
        const autoSaveForms = document.querySelectorAll('form[data-autosave]');
        autoSaveForms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('input', Utils.debounce(() => {
                    FormEnhancements.saveFormData(form);
                }, 1000));
            });
        });
    },
    
    saveFormData: (form) => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        Utils.setStorage(`form_${form.id || 'default'}`, data);
        NotificationSystem.show('Form auto-saved', 'info', 2000);
    },
    
    setupFileUpload: () => {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    FormEnhancements.previewFile(file, input);
                }
            });
        });
    },
    
    previewFile: (file, input) => {
        const preview = input.parentElement.querySelector('.file-preview');
        if (preview) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100px; max-height: 100px; border-radius: 0.5rem;">`;
                };
                reader.readAsDataURL(file);
            } else {
                preview.innerHTML = `<div style="padding: 1rem; background: var(--bg-card); border-radius: 0.5rem; text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📄</div>
                    <div style="font-size: 0.85rem;">${file.name}</div>
                </div>`;
            }
        }
    }
};

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    NotificationSystem.init();
    SearchSystem.init();
    DataVisualization.init();
    InteractiveElements.init();
    FormEnhancements.init();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .field-error {
        animation: fadeIn 0.3s ease;
    }
    
    .error {
        border-color: var(--accent-red) !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
`;
document.head.appendChild(style);
