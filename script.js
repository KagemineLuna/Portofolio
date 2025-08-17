document.addEventListener('DOMContentLoaded', function() {
    // --- LOADING OVERLAY ---
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Show loading overlay initially
    loadingOverlay.classList.add('active');
    
    // Hide loading overlay when everything is loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            loadingOverlay.classList.remove('active');
        }, 500);
    });
    
    // --- AUTO YEAR IN FOOTER ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    
    mobileNavToggle.addEventListener('click', function() {
        const isVisible = primaryNav.getAttribute('data-visible') === 'true';
        primaryNav.setAttribute('data-visible', !isVisible);
        mobileNavToggle.setAttribute('aria-expanded', !isVisible);
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('#primary-navigation a').forEach(link => {
        link.addEventListener('click', function() {
            primaryNav.setAttribute('data-visible', 'false');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // --- SCROLL ANIMATIONS ---
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Initialize and add scroll event listener
    handleScrollAnimation();
    window.addEventListener('scroll', throttle(handleScrollAnimation, 100));
    
    // Throttle function for scroll events
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
    
    // --- DARK MODE TOGGLE ---
    const themeToggle = document.getElementById('copyright-trigger');
    const body = document.body;
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light
