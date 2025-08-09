// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Mengisi Tahun di Footer Secara Otomatis ---
    // Biar gak usah ganti tahun manual setiap Januari, males kan?
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Notifikasi Palsu untuk Form Kontak ---
    // Ini cuma tampilan depan. Untuk beneran berfungsi, butuh backend.
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Mencegah form mengirim data ke mana-mana
            
            // Anggap saja pesannya terkirim
            alert("Pesanmu (pura-puranya) sudah terkirim! Terima kasih sudah menghubungi.");

            // Membersihkan form setelah 'dikirim'
            contactForm.reset();
        });
    }

    // --- Animasi Elegan Saat Scroll ---
    // Biar elemen muncul dengan gaya, bukan tiba-tiba nongol.
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
  
