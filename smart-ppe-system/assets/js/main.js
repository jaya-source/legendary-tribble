// Smart PPE System - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Navigation functionality
    initNavigation();
    
    // Mine gate simulation
    initMineGateSimulation();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Intersection Observer for navbar
    initNavbarScrollEffect();
    
    // PPE scanning animation
    initPPEScanningAnimation();
    
    // Stats counter animation
    initStatsCounter();
});

// Navigation Functions
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Active navigation link highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPos = window.pageYOffset + 100;
        
        if (scrollPos >= sectionTop && scrollPos <= sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Navbar scroll effect
function initNavbarScrollEffect() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mine Gate Simulation
function initMineGateSimulation() {
    const simulation = document.querySelector('.mine-gate-simulation');
    if (!simulation) return;
    
    const statusValue = simulation.querySelector('.status-value');
    const ppeIndicators = simulation.querySelectorAll('.ppe-indicator');
    const verifyItems = simulation.querySelectorAll('.verify-item');
    
    // Simulate scanning process
    function runScanningSimulation() {
        // Reset status
        if (statusValue) {
            statusValue.textContent = 'Scanning...';
            statusValue.className = 'status-value scanning';
        }
        
        // Reset verification items
        verifyItems.forEach(item => {
            const status = item.querySelector('.verify-status');
            if (status) {
                status.textContent = '...';
                status.style.color = '#666';
            }
        });
        
        // Animate PPE indicators
        ppeIndicators.forEach((indicator, index) => {
            setTimeout(() => {
                indicator.style.animation = 'ppePulse 0.5s ease-in-out';
                
                // Update corresponding verify item
                const ppeType = indicator.getAttribute('data-ppe');
                const verifyItem = document.querySelector(`[data-item="${ppeType}"]`);
                if (verifyItem) {
                    const status = verifyItem.querySelector('.verify-status');
                    if (status) {
                        status.textContent = '✓';
                        status.style.color = '#00FF41';
                    }
                }
            }, index * 500);
        });
        
        // Update final status
        setTimeout(() => {
            if (statusValue) {
                statusValue.textContent = 'Access Granted';
                statusValue.className = 'status-value granted';
                statusValue.style.color = '#00FF41';
            }
        }, 2500);
        
        // Reset and restart after delay
        setTimeout(() => {
            runScanningSimulation();
        }, 5000);
    }
    
    // Start simulation when section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runScanningSimulation();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(simulation);
}

// PPE Scanning Animation
function initPPEScanningAnimation() {
    const scanningBeam = document.querySelector('.scanning-beam');
    if (!scanningBeam) return;
    
    // Enhanced scanning animation with sound effect simulation
    function enhanceScanningEffect() {
        const camera = document.querySelector('.camera');
        if (camera) {
            camera.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
            
            setTimeout(() => {
                camera.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
            }, 1000);
        }
    }
    
    // Run enhanced effect periodically
    setInterval(enhanceScanningEffect, 3000);
}

// Stats Counter Animation
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number, .stat-number-large');
    
    function animateCounter(element) {
        const target = parseFloat(element.textContent.replace(/[^\d.]/g, ''));
        const suffix = element.textContent.replace(/[\d.]/g, '');
        let current = 0;
        const increment = target / 100;
        const duration = 2000; // 2 seconds
        const stepTime = duration / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (suffix.includes('%')) {
                element.textContent = Math.floor(current) + '%';
            } else if (suffix.includes('s')) {
                element.textContent = current.toFixed(1) + 's';
            } else if (suffix.includes('M')) {
                element.textContent = '$' + current.toFixed(1) + 'M';
            } else if (suffix.includes('/')) {
                element.textContent = '24/7';
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, stepTime);
    }
    
    // Observe elements and animate when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Interactive Features
function initInteractiveFeatures() {
    // Feature cards hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // Problem items interactive effects
    const problemItems = document.querySelectorAll('.problem-item');
    
    problemItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('expanded');
        });
    });
}

// Parallax Effect for Hero Background
function initParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        heroBackground.style.transform = `translateY(${parallax}px)`;
    });
}

// Loading Animation
function initLoadingAnimation() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-icon">
                <i class="fas fa-hard-hat"></i>
            </div>
            <div class="loading-text">Initializing Smart PPE System...</div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // Simulate loading progress
    const progressBar = loadingOverlay.querySelector('.loading-progress');
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 500);
            }, 800);
        }
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }, 100);
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    
    // Graceful degradation - ensure basic functionality works
    if (e.error.message.includes('AOS')) {
        console.warn('AOS library failed to load. Continuing without animations.');
    }
});

// Performance Optimization
function optimizePerformance() {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = requestAnimationFrame(() => {
            // Scroll-based animations here
        });
    });
}

// Initialize additional features when page is fully loaded
window.addEventListener('load', () => {
    initInteractiveFeatures();
    initParallaxEffect();
    optimizePerformance();
});

// Utility Functions
function throttle(func, wait) {
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

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Dashboard Tabs Functionality
function initDashboardTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const dashboardPanels = document.querySelectorAll('.dashboard-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            dashboardPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding panel
            const targetPanel = document.getElementById(`${targetTab}-panel`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // Trigger animations for the new panel
                setTimeout(() => {
                    initChartAnimations();
                }, 100);
            }
        });
    });
}

// Initialize chart animations
function initChartAnimations() {
    // Animate progress circles
    const progressCircles = document.querySelectorAll('.progress-circle');
    progressCircles.forEach(circle => {
        const percentage = 90; // This could be dynamic
        const circumference = 2 * Math.PI * 40; // radius = 40
        const offset = circumference - (percentage / 100) * circumference;
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = offset;
    });
    
    // Animate violation bars
    const barFills = document.querySelectorAll('.bar-fill');
    barFills.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
    
    // Animate hourly pattern bars
    const hourBars = document.querySelectorAll('.hour-bar');
    hourBars.forEach((bar, index) => {
        const compliantBar = bar.querySelector('.compliant-bar');
        const violationsBar = bar.querySelector('.violations-bar');
        
        if (compliantBar && violationsBar) {
            const compliantHeight = bar.style.getPropertyValue('--compliant');
            const violationsHeight = bar.style.getPropertyValue('--violations');
            
            compliantBar.style.height = '0%';
            violationsBar.style.height = '0%';
            
            setTimeout(() => {
                compliantBar.style.height = compliantHeight;
                violationsBar.style.height = violationsHeight;
            }, 200 + index * 100);
        }
    });
}

// Enhanced loading animation with PPE icons
function initEnhancedLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="ppe-loading-animation">
                <div class="ppe-icon helmet">
                    <i class="fas fa-hard-hat"></i>
                </div>
                <div class="ppe-icon vest">
                    <i class="fas fa-vest"></i>
                </div>
                <div class="ppe-icon boots">
                    <i class="fas fa-hiking"></i>
                </div>
                <div class="ppe-icon detector">
                    <i class="fas fa-satellite-dish"></i>
                </div>
            </div>
            <div class="loading-text">Initializing SmartPPE System...</div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
            <div class="loading-percentage">0%</div>
        </div>
    `;
    
    // Add loading styles
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, var(--dark-bg), var(--dark-surface));
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .loading-content {
            text-align: center;
            max-width: 400px;
        }
        
        .ppe-loading-animation {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .ppe-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: var(--dark-bg);
            animation: ppeFloat 2s ease-in-out infinite;
        }
        
        .ppe-icon.helmet { animation-delay: 0s; }
        .ppe-icon.vest { animation-delay: 0.3s; }
        .ppe-icon.boots { animation-delay: 0.6s; }
        .ppe-icon.detector { animation-delay: 0.9s; }
        
        @keyframes ppeFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.1); }
        }
        
        .loading-text {
            color: var(--text-primary);
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 2rem;
            font-family: var(--font-display);
        }
        
        .loading-bar {
            width: 300px;
            height: 6px;
            background: var(--dark-surface-2);
            border-radius: 3px;
            overflow: hidden;
            margin: 0 auto 1rem;
        }
        
        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            width: 0%;
            transition: width 0.3s ease;
        }
        
        .loading-percentage {
            color: var(--primary-color);
            font-size: 1.1rem;
            font-weight: 700;
        }
    `;
    
    document.head.appendChild(loadingStyles);
    document.body.appendChild(loadingOverlay);
    
    // Simulate loading progress
    const progressBar = loadingOverlay.querySelector('.loading-progress');
    const percentageEl = loadingOverlay.querySelector('.loading-percentage');
    const loadingText = loadingOverlay.querySelector('.loading-text');
    
    let progress = 0;
    const loadingSteps = [
        'Initializing AI systems...',
        'Loading computer vision models...',
        'Connecting to safety database...',
        'Calibrating PPE detection...',
        'System ready!'
    ];
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            loadingText.textContent = loadingSteps[4];
            
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.remove();
                    loadingStyles.remove();
                }, 500);
            }, 800);
        } else {
            const stepIndex = Math.min(Math.floor(progress / 20), loadingSteps.length - 2);
            loadingText.textContent = loadingSteps[stepIndex];
        }
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (percentageEl) {
            percentageEl.textContent = Math.floor(progress) + '%';
        }
    }, 150);
}

// Advanced scroll effects
function initAdvancedScrollEffects() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Trigger specific animations based on section
                const sectionId = entry.target.id;
                switch(sectionId) {
                    case 'analytics':
                        initChartAnimations();
                        break;
                    case 'features':
                        animateFeatureCards();
                        break;
                    case 'process':
                        animateProcessSteps();
                        break;
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Animate feature cards
function animateFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, index * 100);
    });
}

// Animate process steps
function animateProcessSteps() {
    const processSteps = document.querySelectorAll('.process-step');
    
    processSteps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('animate');
        }, index * 200);
    });
}

// Interactive tooltips for technical terms
function initTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        let tooltip;
        
        trigger.addEventListener('mouseenter', (e) => {
            const tooltipText = trigger.getAttribute('data-tooltip');
            
            tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            // Position tooltip
            const rect = trigger.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            setTimeout(() => tooltip.classList.add('show'), 10);
        });
        
        trigger.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.classList.remove('show');
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 300);
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functionality
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    initNavigation();
    initMineGateSimulation();
    initSmoothScrolling();
    initNavbarScrollEffect();
    initPPEScanningAnimation();
    initStatsCounter();
    
    // Initialize new functionality
    initDashboardTabs();
    initAdvancedScrollEffects();
    initTooltips();
    
    // Show enhanced loading animation
    initEnhancedLoading();
});

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initMineGateSimulation,
        initSmoothScrolling,
        initDashboardTabs,
        initChartAnimations,
        throttle,
        debounce
    };
}