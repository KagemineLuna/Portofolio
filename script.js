// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- MENGISI TAHUN OTOMATIS (Masih sama) ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- ANIMASI SCROLL (Masih sama) ---
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

    // =======================================================
    // --- FITUR BARU: EASTER EGG DI FOOTER ---
    // =======================================================

    const copyrightTrigger = document.getElementById('copyright-trigger');
    const body = document.body;

    // --- 1. Logika Ganti Tema (Dark/Light Mode) ---
    const toggleTheme = () => {
        body.classList.toggle('dark-mode'); // Tambah/hapus class 'dark-mode'

        // Simpan pilihan tema user di browser
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    };

    // Cek saat halaman dimuat, apakah user sebelumnya pakai dark mode?
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    // --- 2. Logika Klik, Klik-Klik, dan Klik-Klik-Klik ---
    if (copyrightTrigger) {
        let clickCount = 0;
        let clickTimer = null;

        copyrightTrigger.addEventListener('click', () => {
            clickCount++;

            // Ini semacam stopwatch. Kalau 600 milidetik gak ada klik lagi, hitungan reset.
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 600);

            // Jika ini adalah klik PERTAMA (dalam rentang waktu 600ms)
            if (clickCount === 1) {
                // Jalankan fungsi ganti tema
                toggleTheme();
                
                // Beri pesan sesuai tema saat ini
                if (body.classList.contains('dark-mode')) {
                    alert('Mode Gelap diaktifkan! 🌚 Klik 3x untuk kejutan lain.');
                } else {
                    alert('Mode Terang kembali! 🌝');
                }

            // Jika ini adalah klik KETIGA (dalam rentang waktu 600ms)
            } else if (clickCount === 3) {
                // Reset hitungan biar gak aneh
                clickCount = 0;
                clearTimeout(clickTimer);

                // Pindahkan user ke halaman rahasia!
                // GANTI 'secret.html' dengan nama file HTML barumu.
                window.location.href = 'secret.html'; 
            }
        });
    }
});
                                                     
