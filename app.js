document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INITIALIZE GSAP & SCROLL TRIGGER ---
    gsap.registerPlugin(ScrollTrigger);

    // --- 2. SWIPER INITIALIZATIONS ---

    // Hero Carousel
    const heroSwiper = new Swiper('.hero-swiper', {
        effect: 'fade',
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.hero-pagination',
            clickable: true,
        },
    });

    // Highlights Carousel
    const highlightsSwiper = new Swiper('.highlights-swiper', {
        slidesPerView: 1.2,
        spaceBetween: 20,
        centeredSlides: true,
        breakpoints: {
            768: { slidesPerView: 2.5, spaceBetween: 40 }
        }
    });

    // Room 01 Thumbs
    const room1Thumbs = new Swiper('.room1-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
    });

    // Room 01 Main
    const room1Swiper = new Swiper('.room1-swiper', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: room1Thumbs,
        },
        pagination: {
            el: '.room1-swiper .swiper-pagination',
            clickable: true,
        },
    });

    // Room 02 Thumbs
    const room2Thumbs = new Swiper('.room2-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
    });

    // Room 02 Main
    const room2Swiper = new Swiper('.room2-swiper', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: room2Thumbs,
        },
    });

    // --- 3. TAB SWITCHING LOGIC ---
    const headerNavItems = document.querySelectorAll('.nav-links .nav-item');
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    const indicator = document.querySelector('.tab-indicator');

    function switchTab(target) {
        // Update Tab Buttons (the ones in the section)
        tabs.forEach(btn => btn.classList.remove('active'));
        const activeTabBtn = document.querySelector(`.tab-btn[data-tab="${target}"]`);
        activeTabBtn.classList.add('active');
        updateTabIndicator(activeTabBtn);

        // Update Header Links
        headerNavItems.forEach(item => item.classList.remove('active'));
        const activeHeaderLink = document.querySelector(`.nav-links .nav-item[data-tab="${target}"]`);
        if (activeHeaderLink) activeHeaderLink.classList.add('active');

        // Transition Content
        gsap.to('.tab-content.active', {
            opacity: 0,
            y: 20,
            duration: 0.3,
            onComplete: () => {
                contents.forEach(c => c.classList.remove('active'));
                const newActive = document.getElementById(`tab-${target}`);
                newActive.classList.add('active');

                gsap.fromTo(newActive,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
                );

                // Scroll to exhibition explorer if it's not in view
                const explorerSection = document.querySelector('.exhibition-explorer');
                explorerSection.scrollIntoView({ behavior: 'smooth' });

                // Refresh Swiper instances when tab opens
                window.dispatchEvent(new Event('resize'));
            }
        });
    }

    function updateTabIndicator(activeBtn) {
        indicator.style.width = `${activeBtn.offsetWidth}px`;
        indicator.style.left = `${activeBtn.offsetLeft}px`;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.getAttribute('data-tab')));
    });

    headerNavItems.forEach(item => {
        item.addEventListener('click', () => switchTab(item.getAttribute('data-tab')));
    });

    // Initialize first tab indicator
    updateTabIndicator(tabs[0]);

    // --- 4. INTERACTIVE CANVAS STUDIO ---
    const canvas = document.getElementById('studio-canvas');
    const ctx = canvas.getContext('2d');
    let currentMotif = 'paisley';
    let currentInk = '#BC0202';

    // Resize Canvas
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        // Draw background texture
        ctx.fillStyle = '#DDDDDD';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Motif Selection
    document.querySelectorAll('.motif-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.motif-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMotif = btn.getAttribute('data-motif');
        });
    });

    // Color Selection
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentInk = btn.getAttribute('data-color');
        });
    });

    // Stamping Logic
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        drawStamp(x, y);
    });

    function drawStamp(x, y) {
        ctx.save();
        ctx.translate(x, y);
        // Add organic rotation
        ctx.rotate((Math.random() - 0.5) * 0.2);
        ctx.fillStyle = currentInk;
        ctx.globalAlpha = 0.85 + Math.random() * 0.15; // Realistic ink pressure

        const size = 60;

        ctx.beginPath();
        if (currentMotif === 'paisley') {
            ctx.moveTo(0, -size/2);
            ctx.bezierCurveTo(size/2, -size/2, size, size/2, 0, size/2);
            ctx.bezierCurveTo(-size/2, size/2, -size/4, -size/2, 0, -size/2);
        } else if (currentMotif === 'lotus') {
            for(let i=0; i<8; i++) {
                ctx.rotate(Math.PI/4);
                ctx.ellipse(0, 15, 10, 20, 0, 0, Math.PI*2);
            }
        } else if (currentMotif === 'jaali') {
            ctx.rect(-size/2, -size/2, size, size);
            ctx.rect(-size/4, -size/4, size/2, size/2);
        } else if (currentMotif === 'madder') {
            for(let i=0; i<5; i++) {
                ctx.rotate((Math.PI*2)/5);
                ctx.moveTo(0,0);
                ctx.lineTo(20, -30);
                ctx.lineTo(40, 0);
            }
        } else { // compass
            ctx.rect(-2, -size, 4, size*2);
            ctx.rect(-size, -2, size*2, 4);
        }
        ctx.fill();
        ctx.restore();
    }

    // Clear and Download
    document.getElementById('clear-canvas').addEventListener('click', resizeCanvas);
    document.getElementById('download-canvas').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'threads-of-exchange-stamp.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // --- 5. LIGHTBOX SYSTEM ---
    // ... Existing Lightbox code ...
    document.querySelector('.lightbox-close').addEventListener('click', () => {
        gsap.to(lightbox, {opacity: 0, duration: 0.3, onComplete: () => {
            lightbox.style.display = 'none';
        }});
    });

    // --- NEW: MOBILE NAVIGATION ---
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    mobileNavToggle.addEventListener('click', () => {
        const isOpen = mobileNavMenu.style.display === 'block';
        if (isOpen) {
            gsap.to(mobileNavMenu, {opacity: 0, duration: 0.3, onComplete: () => { mobileNavMenu.style.display = 'none'; }});
        } else {
            mobileNavMenu.style.display = 'block';
            gsap.fromTo(mobileNavMenu, {opacity: 0}, {opacity: 1, duration: 0.3});
        }
    });

    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            switchTab(item.getAttribute('data-tab'));
            mobileNavToggle.click(); // Close menu
        });
    });

    // --- 6. SCROLL REVEALS ---
    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.from(text, {
            scrollTrigger: {
                trigger: text,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray('.fade-up').forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

});
