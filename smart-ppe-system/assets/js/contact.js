// Contact Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact page functionality
    initContactForm();
    initFAQ();
});

// Contact Form Functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    if (!form) return;
    
    // Form submission handler
    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const formData = new FormData(form);
    
    // Clear previous messages
    hideFormMessage();
    
    // Validate all fields
    const isValid = validateForm(form);
    
    if (!isValid) {
        showFormMessage('Please correct the errors above and try again.', 'error');
        return;
    }
    
    // Show loading state
    setSubmitButtonLoading(submitBtn, true);
    
    try {
        // Simulate API call (replace with actual endpoint)
        const response = await submitFormData(formData);
        
        if (response.success) {
            showFormMessage(
                'Thank you! Your demo request has been submitted successfully. We\'ll contact you within 24 hours to schedule your personalized demonstration.',
                'success'
            );
            form.reset();
            
            // Track conversion (you can add analytics here)
            trackFormSubmission('demo_request');
            
        } else {
            throw new Error(response.message || 'Submission failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage(
            'Sorry, there was an error submitting your request. Please try again or contact us directly at demo@smartppe.com',
            'error'
        );
    } finally {
        setSubmitButtonLoading(submitBtn, false);
    }
}

// Simulate form submission (replace with actual API call)
async function submitFormData(formData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Convert FormData to object for logging
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    console.log('Form submission data:', data);
    
    // Simulate success (in real implementation, this would be an API call)
    return {
        success: true,
        message: 'Form submitted successfully'
    };
}

// Form validation
function validateForm(form) {
    let isValid = true;
    
    // Required field validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous error
    clearFieldError({ target: field });
    
    // Skip validation if field is not required and empty
    if (!field.required && !value) {
        return true;
    }
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field check
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    else if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation (if provided)
    else if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)\.]/g, '');
        if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // Name validation
    else if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long.';
        }
    }
    
    // Company name validation
    else if (fieldName === 'company' && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Company name must be at least 2 characters long.';
        }
    }
    
    // Privacy policy checkbox
    else if (fieldName === 'privacy' && field.type === 'checkbox') {
        if (!field.checked) {
            isValid = false;
            errorMessage = 'You must agree to the Privacy Policy and Terms of Service.';
        }
    }
    
    // Show error if validation failed
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Format phone number
function formatPhoneNumber(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '($1) $2');
    }
    
    input.value = value;
}

// Show form message
function showFormMessage(message, type) {
    let messageElement = document.querySelector('.form-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'form-message';
        const form = document.getElementById('contactForm');
        form.insertBefore(messageElement, form.firstChild);
    }
    
    messageElement.textContent = message;
    messageElement.className = `form-message ${type} show`;
    
    // Auto-hide success messages after 8 seconds
    if (type === 'success') {
        setTimeout(() => {
            hideFormMessage();
        }, 8000);
    }
    
    // Scroll to message
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Hide form message
function hideFormMessage() {
    const messageElement = document.querySelector('.form-message');
    if (messageElement) {
        messageElement.classList.remove('show');
    }
}

// Set submit button loading state
function setSubmitButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// FAQ Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Analytics tracking (replace with your analytics implementation)
function trackFormSubmission(eventName) {
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'Form',
            event_label: 'Demo Request'
        });
    }
    
    // Example: Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
    
    // Example: LinkedIn Insight Tag
    if (typeof lintrk !== 'undefined') {
        lintrk('track', { conversion_id: 'demo_request' });
    }
    
    console.log('Form submission tracked:', eventName);
}

// Auto-fill form based on URL parameters (for campaign tracking)
function autoFillFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Example: auto-fill company name from URL parameter
    const company = urlParams.get('company');
    if (company) {
        const companyField = document.getElementById('company');
        if (companyField) {
            companyField.value = decodeURIComponent(company);
        }
    }
    
    // Example: auto-fill industry from URL parameter
    const industry = urlParams.get('industry');
    if (industry) {
        const industryField = document.getElementById('industry');
        if (industryField) {
            industryField.value = industry;
        }
    }
    
    // Track campaign source
    const source = urlParams.get('utm_source');
    if (source) {
        console.log('Traffic source:', source);
        // You can track this in your analytics
    }
}

// Initialize URL auto-fill when page loads
document.addEventListener('DOMContentLoaded', autoFillFromURL);

// Form field enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add floating label effect
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (input && label && input.type !== 'checkbox') {
            input.addEventListener('focus', () => {
                group.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    group.classList.remove('focused');
                }
            });
            
            // Check if field has value on load
            if (input.value) {
                group.classList.add('focused');
            }
        }
    });
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        formatPhoneNumber,
        showFormMessage,
        hideFormMessage
    };
}