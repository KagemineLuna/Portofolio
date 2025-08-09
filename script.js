// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Mengisi Tahun di Footer Secara Otomatis ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Animasi Elegan Saat Scroll ---
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

    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    }

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } 
            // Opsional: uncomment baris di bawah jika ingin animasinya hilang saat scroll ke atas lagi
            // else {
            //     hideScrollElement(el);
            // }
        })
    }

    // Jalankan sekali saat load dan setiap kali scroll
    handleScrollAnimation();
    window.addEventListener('scroll', handleScrollAnimation);

});
            
