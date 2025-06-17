/**
 * Nyumbani Haven - Professional Healthcare Website JavaScript
 * Author: Healthcare Web Solutions
 * Description: Interactive functionality for the professional home care website
 */

// ================================
// Global Variables & Configuration
// ================================

const CONFIG = {
    // Contact Information
    phone: '+254722912811',
    email: 'ngugiliyah@gmail.com',
    whatsappMessage: 'Hello Nyumbani Haven. I would like to schedule a professional consultation for home-based healthcare services.',
    
    // Animation Settings
    fadeInDelay: 0.2,
    counterSpeed: 30,
    scrollOffset: 100,
    
    // Form Settings
    formSubmissionDelay: 2000,
    notificationDuration: 5000
};

// ================================
// Utility Functions
// ================================

/**
 * Debounce function to limit the rate of function execution
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function execution frequency
 */
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// ================================
// DOM Ready Functions
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeCounters();
    initializeFormHandling();
    initializeContactInteractions();
    initializeServiceCards();
    initializeAccessibility();
    
    console.log('✅ Nyumbani Haven website initialized successfully');
});

// ================================
// Navigation Functions
// ================================

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Header scroll effect
    const handleScroll = throttle(() => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
    
    // Initial active link setup
    updateActiveNavLink();
}

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const toggle = document.querySelector('.mobile-toggle i');
    
    navLinks.classList.toggle('active');
    
    // Update hamburger icon
    if (navLinks.classList.contains('active')) {
        toggle.classList.remove('fa-bars');
        toggle.classList.add('fa-times');
    } else {
        toggle.classList.remove('fa-times');
        toggle.classList.add('fa-bars');
    }
}

/**
 * Handle smooth scrolling for anchor links
 */
function handleSmoothScroll(e) {
    e.preventDefault();
    
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = target.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Close mobile menu if open
    closeMobileMenu();
}

/**
 * Close mobile navigation menu
 */
function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const toggle = document.querySelector('.mobile-toggle i');
    
    navLinks.classList.remove('active');
    toggle.classList.remove('fa-times');
    toggle.classList.add('fa-bars');
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - CONFIG.scrollOffset;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && 
            window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ================================
// Scroll Effects & Animations
// ================================

/**
 * Initialize scroll-based effects
 */
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe elements for fade-in animation
    document.querySelectorAll('.service-card, .team-card, .about-stat').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Handle intersection observer callbacks
 */
function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add random delay for staggered animation
            entry.target.style.animationDelay = Math.random() * CONFIG.fadeInDelay + 's';
            entry.target.classList.add('fade-in');
        }
    });
}

/**
 * Initialize general animations
 */
function initializeAnimations() {
    // Add entrance animations to hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        element.style.animationDelay = (index * 0.2) + 's';
        element.classList.add('fade-in');
    });
}

// ================================
// Counter Animations
// ================================

/**
 * Initialize counter animations for statistics
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        statsObserver.observe(counter);
    });
}

/**
 * Animate individual counter
 */
function animateCounter(element) {
    const text = element.textContent;
    const targetNumber = parseInt(text);
    
    if (!targetNumber || targetNumber <= 1) return;
    
    let current = 0;
    const increment = targetNumber / CONFIG.counterSpeed;
    
    const updateCounter = () => {
        if (current < targetNumber) {
            current += increment;
            const suffix = getSuffix(text, targetNumber);
            element.textContent = Math.ceil(current) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetNumber + getSuffix(text, targetNumber);
        }
    };
    
    updateCounter();
}

/**
 * Get appropriate suffix for counter
 */
function getSuffix(originalText, targetNumber) {
    if (originalText.includes('%')) return '%';
    if (originalText.includes('/')) return '/7';
    if (targetNumber >= 50) return '+';
    return '';
}

// ================================
// Form Handling
// ================================

/**
 * Initialize form handling functionality
 */
function initializeFormHandling() {
    const form = document.getElementById('consultationForm');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmission);
    
    // Add real-time validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
}

/**
 * Handle form submission
 */
function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const requiredFields = ['fullName', 'phoneNumber', 'emailAddress', 'serviceType'];
    
    // Validate required fields
    let isValid = true;
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const value = formData.get(fieldName);
        
        if (!value || value.trim() === '') {
            markFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    const emailField = document.getElementById('emailAddress');
    const email = formData.get('emailAddress');
    if (email && !isValidEmail(email)) {
        markFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    const phoneField = document.getElementById('phoneNumber');
    const phone = formData.get('phoneNumber');
    if (phone && !isValidPhone(phone)) {
        markFieldError(phoneField, 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Please correct the errors below and try again.', 'error');
        return;
    }
    
    // Submit form
    submitForm(form, formData);
}

/**
 * Submit form with loading state
 */
function submitForm(form, formData) {
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    
    // Set loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Request...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification(
            'Thank you for your consultation request. Our clinical team will contact you within 24 hours to schedule your assessment.',
            'success'
        );
        
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Track form submission
        trackEvent('form_submission', {
            service_type: formData.get('serviceType'),
            urgency: formData.get('urgency')
        });
        
    }, CONFIG.formSubmissionDelay);
}

/**
 * Validate individual field
 */
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        markFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        markFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        markFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

/**
 * Mark field with error state
 */
function markFieldError(field, message) {
    field.style.borderColor = 'var(--error)';
    field.setAttribute('aria-invalid', 'true');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
        color: var(--error);
        font-size: 0.75rem;
        margin-top: 0.25rem;
    `;
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

/**
 * Clear field error state
 */
function clearFieldError(field) {
    field.style.borderColor = 'var(--neutral-300)';
    field.removeAttribute('aria-invalid');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone format (Kenya format)
 */
function isValidPhone(phone) {
    const phoneRegex = /^(\+254|0)[1-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// ================================
// Contact Interactions
// ================================

/**
 * Initialize contact item interactions
 */
function initializeContactInteractions() {
    const contactItems = document.querySelectorAll('.contact-item[data-action]');
    
    contactItems.forEach(item => {
        const action = item.dataset.action;
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', () => {
            handleContactAction(action);
        });
        
        // Add hover effect
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(4px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });
}

/**
 * Handle contact action clicks
 */
function handleContactAction(action) {
    switch (action) {
        case 'phone':
            window.location.href = `tel:${CONFIG.phone}`;
            trackEvent('contact_click', { method: 'phone' });
            break;
            
        case 'email':
            window.location.href = `mailto:${CONFIG.email}?subject=Nyumbani Haven Professional Consultation Request`;
            trackEvent('contact_click', { method: 'email' });
            break;
            
        case 'whatsapp':
            const whatsappUrl = `https://wa.me/${CONFIG.phone.replace('+', '')}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            trackEvent('contact_click', { method: 'whatsapp' });
            break;
    }
}

// ================================
// Service Card Interactions
// ================================

/**
 * Initialize service card functionality
 */
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card[data-service]');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const service = card.dataset.service;
            handleServiceCardClick(service);
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', enhanceCardHover);
        card.addEventListener('mouseleave', resetCardHover);
    });
}

/**
 * Handle service card click
 */
function handleServiceCardClick(service) {
    const contactSection = document.querySelector('#contact');
    const serviceSelect = document.querySelector('#serviceType');
    
    if (!contactSection || !serviceSelect) return;
    
    // Scroll to contact form
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = contactSection.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Pre-select the service after scroll
    setTimeout(() => {
        serviceSelect.value = service;
        serviceSelect.style.borderColor = 'var(--primary-blue)';
        serviceSelect.focus();
        
        // Reset border color after highlight
        setTimeout(() => {
            serviceSelect.style.borderColor = 'var(--neutral-300)';
        }, 2000);
        
        trackEvent('service_card_click', { service_type: service });
    }, 1000);
}

/**
 * Enhance card hover effect
 */
function enhanceCardHover(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateY(-8px) scale(1.02)';
    card.style.boxShadow = 'var(--shadow-xl)';
}

/**
 * Reset card hover effect
 */
function resetCardHover(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = 'var(--shadow-sm)';
}

// ================================
// Notification System
// ================================

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <i class="fas ${getNotificationIcon(type)}" style="margin-top: 0.125rem;"></i>
            <div>${message}</div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide
    setTimeout(() => {
        hideNotification(notification);
    }, CONFIG.notificationDuration);
    
    // Add click to dismiss
    notification.addEventListener('click', () => {
        hideNotification(notification);
    });
}

/**
 * Hide notification
 */
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Get appropriate icon for notification type
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ================================
// Accessibility Features
// ================================

/**
 * Initialize accessibility enhancements
 */
function initializeAccessibility() {
    // Keyboard navigation detection
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Escape key handlers
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
            hideAllNotifications();
        }
    });
    
    // Skip to main content link
    addSkipLink();
}

/**
 * Add skip to main content link for screen readers
 */
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10001;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Hide all notifications
 */
function hideAllNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(hideNotification);
}

// ================================
// Analytics & Tracking
// ================================

/**
 * Track events for analytics
 */
function trackEvent(eventName, parameters = {}) {
    // Add timestamp
    parameters.timestamp = new Date().toISOString();
    parameters.page = window.location.pathname;
    
    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('📊 Event tracked:', eventName, parameters);
    }
    
    // Add your analytics service integration here
    // Example: Google Analytics, Mixpanel, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

// ================================
// Performance Optimization
// ================================

/**
 * Lazy load images when they come into view
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ================================
// Error Handling
// ================================

/**
 * Global error handler
 */
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    
    // Show user-friendly error message for critical errors
    if (e.error && e.error.message) {
        showNotification('Something went wrong. Please refresh the page and try again.', 'error');
    }
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
});

// ================================
// Page Visibility API
// ================================

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden
        console.log('🔄 Page hidden');
    } else {
        // Page is visible
        console.log('👁️ Page visible');
        trackEvent('page_focus');
    }
});

// ================================
// Initialize on Load
// ================================

/**
 * Run additional initialization after page load
 */
window.addEventListener('load', () => {
    initializeLazyLoading();
    trackEvent('page_loaded', {
        load_time: performance.now(),
        user_agent: navigator.userAgent
    });
    
    console.log('🎉 Nyumbani Haven website fully loaded and ready!');
});

// ================================
// Export functions for testing
// ================================

// Make functions available for testing in development
if (typeof window !== 'undefined') {
    window.NyumbaniHaven = {
        toggleMobileMenu,
        showNotification,
        trackEvent,
        CONFIG
    };
}