document.addEventListener('DOMContentLoaded', () => {

    // --- AUTO YEAR ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    
    if (mobileNavToggle && primaryNav) {
        mobileNavToggle.addEventListener('click', function() {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            primaryNav.setAttribute('data-visible', !isVisible);
            mobileNavToggle.setAttribute('aria-expanded', !isVisible);
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('#primary-navigation a').forEach(link => {
        link.addEventListener('click', function() {
            if (primaryNav) {
                primaryNav.setAttribute('data-visible', 'false');
            }
            if (mobileNavToggle) {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
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

    // Initialize and add scroll event listener
    handleScrollAnimation();
    window.addEventListener('scroll', throttle(handleScrollAnimation, 100));
    
    // --- DARK MODE TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const copyrightTrigger = document.getElementById('copyright-trigger'); // <-- FIX #1: Define the variable

    const applyTheme = (theme) => {
        body.dataset.theme = theme;
        localStorage.setItem('theme', theme);

        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    };
    
    // Helper function to toggle theme
    const toggleTheme = () => { // <-- FIX #2: Define the missing function
        const currentTheme = body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    };

    // Apply the saved theme from localStorage on page load
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme || 'light'); // Default to light if nothing is saved

    // Add the click listener for the main theme button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Add the click listener for the secret copyright trigger
    if (copyrightTrigger) {
        let clickCount = 0;
        let clickTimer = null;

        copyrightTrigger.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => clickCount = 0, 600);

            if (clickCount === 1) {
                toggleTheme(); // Now this function exists!
                if (body.dataset.theme === 'dark') {
                    alert('Mode Gelap diaktifkan!');
                } else {
                    alert('Mode Terang kembali!');
                }
            } else if (clickCount === 3) {
                clickCount = 0;
                clearTimeout(clickTimer);
                window.location.href = 'secret.html'; // This better be good
            }
        });
    }

    // --- MUSIC TOGGLE ---
    const musicToggle = document.getElementById('music-toggle');
    const musik = document.getElementById('background-music');

    if (musik) {
        musik.volume = 0.7; // You might want to lower this for sanity's sake, e.g., 0.2
    }

    if (musicToggle && musik) {
        musicToggle.addEventListener('click', () => {
            if (musik.paused) {
                musik.play().catch(error => console.error("Audio play failed:", error));
                musicToggle.classList.add('playing');
            } else {
                musik.pause();
                musicToggle.classList.remove('playing');
            }
        });
    }
});
