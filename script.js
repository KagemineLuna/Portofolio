document.addEventListener('DOMContentLoaded', () => {

    // --- AUTO YEAR ---
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
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const applyTheme = (theme) => {
    body.dataset.theme = theme;
    localStorage.setItem('theme', theme);

    // Get the icon element
    const icon = themeToggle.querySelector('i');
    
    // Check the theme and change the icon
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
};

// Apply the saved theme from localStorage on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    // Default to light theme if no preference is found
    applyTheme('light');
}

// Add the click listener
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}

if (copyrightTrigger) {
    let clickCount = 0;
    let clickTimer = null;

    copyrightTrigger.addEventListener('click', () => {
        clickCount++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => clickCount = 0, 600);

        if (clickCount === 1) {
            toggleTheme();
            // Your alert logic can now check the dataset attribute
            if (body.dataset.theme === 'dark') {
                alert('Mode Gelap diaktifkan!');
            } else {
                alert('Mode Terang kembali!');
            }
        } else if (clickCount === 3) {
            clickCount = 0;
            clearTimeout(clickTimer);
            window.location.href = 'secret.html';
        }
    });
}

// --- MUSIC TOGGLE ---
const musicToggle = document.getElementById('music-toggle'); // This is the button
const musik = document.getElementById('background-music');

if (musik) musik.volume = 1;

if (musicToggle && musik) { // Change this line to use musicToggle
    musicToggle.addEventListener('click', function(event) {
        event.preventDefault(); 
        if (musik.paused) {
            musik.play();
            musicToggle.classList.add('playing');
        } else {
            musik.pause();
            musicToggle.classList.remove('playing');
        }
    });
  }
});