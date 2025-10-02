// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login functionality
    initLoginForm();
    initPasswordToggle();
    initDemoUsers();
    initSocialLogin();
});

// Login Form Functionality
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!loginForm) return;
    
    // Form submission handler
    loginForm.addEventListener('submit', handleLogin);
    
    // Real-time validation
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Auto-fill from localStorage if "Remember Me" was checked
    loadRememberedCredentials();
}

// Handle login submission
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    // Clear previous messages
    hideLoginMessage();
    
    // Validate form
    const isValid = validateLoginForm(form);
    if (!isValid) {
        showLoginMessage('Please correct the errors and try again.', 'error');
        return;
    }
    
    // Show loading state
    setLoginButtonLoading(true);
    
    try {
        // Simulate login process
        const loginResult = await performLogin(email, password);
        
        if (loginResult.success) {
            // Handle remember me
            if (rememberMe) {
                saveCredentials(email);
            } else {
                clearSavedCredentials();
            }
            
            showLoginMessage('Login successful! Redirecting to dashboard...', 'success');
            
            // Store user session
            storeUserSession(loginResult.user);
            
            // Redirect to dashboard after delay
            setTimeout(() => {
                redirectToDashboard(loginResult.user.role);
            }, 2000);
            
        } else {
            throw new Error(loginResult.message || 'Invalid credentials');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showLoginMessage(error.message || 'Login failed. Please check your credentials and try again.', 'error');
        
        // Add shake animation to form
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 600);
        
    } finally {
        setLoginButtonLoading(false);
    }
}

// Simulate login API call (replace with actual authentication)
async function performLogin(email, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo credentials for different user roles
    const demoUsers = {
        'admin@smartppe.com': {
            password: 'admin123',
            user: {
                id: 'admin001',
                email: 'admin@smartppe.com',
                name: 'System Administrator',
                role: 'admin',
                permissions: ['full_access', 'user_management', 'system_config'],
                company: 'SmartPPE Systems',
                avatar: null
            }
        },
        'safety@miningcorp.com': {
            password: 'safety123',
            user: {
                id: 'safety001',
                email: 'safety@miningcorp.com',
                name: 'Sarah Johnson',
                role: 'safety_manager',
                permissions: ['safety_oversight', 'reports', 'alerts'],
                company: 'Mountain Mining Corp',
                avatar: null
            }
        },
        'supervisor@coalmine.com': {
            password: 'super123',
            user: {
                id: 'super001',
                email: 'supervisor@coalmine.com',
                name: 'Mike Rodriguez',
                role: 'supervisor',
                permissions: ['team_monitoring', 'basic_reports'],
                company: 'Coal Valley Mine',
                avatar: null
            }
        }
    };
    
    const userAccount = demoUsers[email.toLowerCase()];
    
    if (userAccount && userAccount.password === password) {
        return {
            success: true,
            user: userAccount.user,
            token: generateMockToken(),
            expiresIn: 3600 // 1 hour
        };
    } else {
        return {
            success: false,
            message: 'Invalid email or password. Please check your credentials.'
        };
    }
}

// Generate mock JWT token for demo
function generateMockToken() {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
        sub: 'user123', 
        iat: Date.now() / 1000, 
        exp: (Date.now() / 1000) + 3600 
    }));
    const signature = btoa('mock_signature');
    return `${header}.${payload}.${signature}`;
}

// Form validation
function validateLoginForm(form) {
    let isValid = true;
    
    const email = form.querySelector('#email');
    const password = form.querySelector('#password');
    
    // Validate email
    if (!validateField({ target: email })) {
        isValid = false;
    }
    
    // Validate password
    if (!validateField({ target: password })) {
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldType = field.type;
    
    // Clear previous error
    clearFieldError({ target: field });
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field check
    if (!value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    // Email validation
    else if (fieldType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    // Password validation
    else if (fieldType === 'password') {
        if (value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters long.';
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
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Password toggle functionality
function initPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    
    if (!passwordInput || !passwordToggle) return;
    
    passwordToggle.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        
        passwordInput.type = isPassword ? 'text' : 'password';
        passwordToggle.innerHTML = isPassword ? 
            '<i class="fas fa-eye-slash"></i>' : 
            '<i class="fas fa-eye"></i>';
    });
}

// Demo users functionality
function initDemoUsers() {
    const demoUsers = document.querySelectorAll('.demo-user');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    demoUsers.forEach(user => {
        user.addEventListener('click', () => {
            const email = user.getAttribute('data-email');
            const password = user.getAttribute('data-password');
            
            if (emailInput && passwordInput) {
                emailInput.value = email;
                passwordInput.value = password;
                
                // Clear any existing errors
                clearFieldError({ target: emailInput });
                clearFieldError({ target: passwordInput });
                
                // Add visual feedback
                user.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    user.style.transform = '';
                }, 150);
            }
        });
    });
}

// Social login functionality
function initSocialLogin() {
    const socialBtns = document.querySelectorAll('.social-btn');
    
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.classList.contains('google-btn') ? 'Google' : 'Microsoft';
            
            showLoginMessage(`${provider} authentication coming soon...`, 'error');
            
            // In a real implementation, this would redirect to OAuth provider
            console.log(`${provider} login clicked`);
        });
    });
}

// Login message functions
function showLoginMessage(message, type) {
    const messageElement = document.getElementById('loginMessage');
    if (!messageElement) return;
    
    messageElement.textContent = message;
    messageElement.className = `login-message ${type} show`;
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            hideLoginMessage();
        }, 5000);
    }
}

function hideLoginMessage() {
    const messageElement = document.getElementById('loginMessage');
    if (messageElement) {
        messageElement.classList.remove('show');
    }
}

// Loading state management
function setLoginButtonLoading(loading) {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;
    
    if (loading) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
    } else {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
}

// Remember me functionality
function saveCredentials(email) {
    try {
        localStorage.setItem('smartppe_remembered_email', email);
        localStorage.setItem('smartppe_remember_me', 'true');
    } catch (e) {
        console.warn('Could not save credentials to localStorage');
    }
}

function clearSavedCredentials() {
    try {
        localStorage.removeItem('smartppe_remembered_email');
        localStorage.removeItem('smartppe_remember_me');
    } catch (e) {
        console.warn('Could not clear saved credentials');
    }
}

function loadRememberedCredentials() {
    try {
        const rememberMe = localStorage.getItem('smartppe_remember_me');
        const savedEmail = localStorage.getItem('smartppe_remembered_email');
        
        if (rememberMe === 'true' && savedEmail) {
            const emailInput = document.getElementById('email');
            const rememberCheckbox = document.getElementById('rememberMe');
            
            if (emailInput) {
                emailInput.value = savedEmail;
            }
            
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    } catch (e) {
        console.warn('Could not load remembered credentials');
    }
}

// Session management
function storeUserSession(user) {
    try {
        const sessionData = {
            user: user,
            loginTime: Date.now(),
            expiresAt: Date.now() + (3600 * 1000) // 1 hour
        };
        
        sessionStorage.setItem('smartppe_session', JSON.stringify(sessionData));
        localStorage.setItem('smartppe_user', JSON.stringify(user));
    } catch (e) {
        console.warn('Could not store user session');
    }
}

function redirectToDashboard(userRole) {
    // In a real application, you might have different dashboard URLs based on user role
    const dashboardUrls = {
        'admin': 'dashboard-admin.html',
        'safety_manager': 'dashboard-safety.html',
        'supervisor': 'dashboard-supervisor.html',
        'default': 'dashboard.html'
    };
    
    const targetUrl = dashboardUrls[userRole] || dashboardUrls.default;
    
    // For demo purposes, we'll redirect to the main page with a success parameter
    window.location.href = `index.html?login=success&role=${userRole}`;
}

// Check for existing session on page load
function checkExistingSession() {
    try {
        const sessionData = sessionStorage.getItem('smartppe_session');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            
            // Check if session is still valid
            if (Date.now() < session.expiresAt) {
                showLoginMessage('You are already logged in. Redirecting...', 'success');
                setTimeout(() => {
                    redirectToDashboard(session.user.role);
                }, 2000);
                return true;
            } else {
                // Session expired, clear it
                sessionStorage.removeItem('smartppe_session');
            }
        }
    } catch (e) {
        console.warn('Could not check existing session');
    }
    return false;
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Enter key submits form when focused on inputs
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.tagName === 'INPUT') {
                const form = activeElement.closest('form');
                if (form) {
                    e.preventDefault();
                    form.dispatchEvent(new Event('submit'));
                }
            }
        }
        
        // Escape key clears error messages
        if (e.key === 'Escape') {
            hideLoginMessage();
        }
    });
}

// Enhanced form interactions
function enhanceFormExperience() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', () => {
            input.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.parentNode.classList.remove('focused');
            }
        });
        
        // Check if input has value on page load
        if (input.value.trim()) {
            input.parentNode.classList.add('focused');
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing session first
    if (checkExistingSession()) {
        return; // Skip initialization if redirecting
    }
    
    // Initialize all functionality
    initLoginForm();
    initPasswordToggle();
    initDemoUsers();
    initSocialLogin();
    initKeyboardShortcuts();
    enhanceFormExperience();
});

// Add shake animation CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    .shake {
        animation: shake 0.6s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        showLoginMessage,
        hideLoginMessage,
        performLogin,
        storeUserSession
    };
}