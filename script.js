document.addEventListener('DOMContentLoaded', () => {

    // --- AUTO YEAR ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- SCROLL ANIMATION ---
    const scrollElements = document.querySelectorAll('.scroll-animate');
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
    };
    const displayScrollElement = (element) => element.classList.add('visible');
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) displayScrollElement(el);
        })
    }
    handleScrollAnimation();
    window.addEventListener('scroll', handleScrollAnimation);

    // --- DARK MODE + EASTER EGG ---
    const copyrightTrigger = document.getElementById('copyright-trigger');
    const body = document.body;

    const toggleTheme = () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    };

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
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
                if (body.classList.contains('dark-mode')) {
                    alert('Mode Gelap diaktifkan! 🌚 Klik 3x untuk kejutan lain.');
                } else {
                    alert('Mode Terang kembali! 🌝');
                }
            } else if (clickCount === 3) {
                clickCount = 0;
                clearTimeout(clickTimer);
                window.location.href = 'secret.html';
            }
        });
    }

    // --- MUSIC TOGGLE ---
    const logoTombol = document.querySelector('.logo');
    const musik = document.getElementById('background-music');

    if (musik) musik.volume = 0.5;

    if (logoTombol && musik) {
        logoTombol.addEventListener('click', function(event) {
            event.preventDefault(); 
            if (musik.paused) {
                musik.play();
                logoTombol.classList.add('playing');
            } else {
                musik.pause();
                logoTombol.classList.remove('playing');
            }
        });
    }
});
