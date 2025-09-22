// DOM Manipulation for Responsive Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Enhanced Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        setupFormValidation();
    }
    
    // Highlight active page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Enhanced Form Validation
function setupFormValidation() {
    const contactForm = document.getElementById('contactForm');
    const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    
    // Add real-time validation
    formInputs.forEach(input => {
        // Validate on input
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        // Validate on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Remove error on focus
        input.addEventListener('focus', function() {
            clearError(this);
        });
    });
    
    // Custom validation for email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this);
        });
    }
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields before submission
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual AJAX call)
            setTimeout(() => {
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Clear all errors
                clearAllErrors();
            }, 1500);
        } else {
            // Show error message
            showNotification('Please correct the errors in the form before submitting.', 'error');
            
            // Focus on first error field
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
        }
    });
}

// Validate individual field
function validateField(field) {
    let isValid = true;
    const value = field.value.trim();
    
    // Clear previous errors
    clearError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && value === '') {
        showError(field, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value !== '' && !isValidEmail(value)) {
        showError(field, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Minimum length validation
    if (field.dataset.minlength && value.length < field.dataset.minlength) {
        showError(field, `This field must be at least ${field.dataset.minlength} characters long`);
        isValid = false;
    }
    
    // Maximum length validation
    if (field.dataset.maxlength && value.length > field.dataset.maxlength) {
        showError(field, `This field must be less than ${field.dataset.maxlength} characters`);
        isValid = false;
    }
    
    // Add success class if valid and not empty
    if (isValid && value !== '') {
        field.classList.add('success');
    }
    
    return isValid;
}

// Email validation
function validateEmail(field) {
    const value = field.value.trim();
    clearError(field);
    
    if (value !== '' && !isValidEmail(value)) {
        showError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (value !== '') {
        field.classList.add('success');
    }
    
    return true;
}

// Check if email is valid
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(field, message) {
    // Remove any existing error
    clearError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Insert after the field
    field.parentNode.appendChild(errorElement);
    
    // Add aria-invalid attribute for accessibility
    field.setAttribute('aria-invalid', 'true');
}

// Clear error message
function clearError(field) {
    // Remove error class
    field.classList.remove('error');
    field.classList.remove('success');
    
    // Remove error message
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Remove aria-invalid attribute
    field.removeAttribute('aria-invalid');
}

// Clear all errors
function clearAllErrors() {
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    formInputs.forEach(input => {
        clearError(input);
    });
}

// Show notification
function showNotification(message, type) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide after 5 seconds
    const autoHide = setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button event
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoHide);
        hideNotification(notification);
    });
    
    // Click outside to close
    notification.addEventListener('click', (e) => {
        if (e.target === notification) {
            clearTimeout(autoHide);
            hideNotification(notification);
        }
    });
}

// Hide notification
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}