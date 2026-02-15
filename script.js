document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Effect
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.animate-reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Horizontal Scroll for Process Section
    const processWrapper = document.querySelector('.process-wrapper');
    const processTrack = document.querySelector('.process-track');

    if (processWrapper && processTrack) {
        window.addEventListener('scroll', () => {
            const wrapperTop = processWrapper.offsetTop;
            const wrapperHeight = processWrapper.offsetHeight;
            const scrollPos = window.pageYOffset;
            const windowHeight = window.innerHeight;

            if (scrollPos >= wrapperTop && scrollPos <= (wrapperTop + wrapperHeight - windowHeight)) {
                const scrollFraction = (scrollPos - wrapperTop) / (wrapperHeight - windowHeight);
                const translateX = scrollFraction * 200;
                processTrack.style.transform = `translateX(-${translateX}vw)`;
            } else if (scrollPos < wrapperTop) {
                processTrack.style.transform = 'translateX(0)';
            } else if (scrollPos > (wrapperTop + wrapperHeight - windowHeight)) {
                processTrack.style.transform = 'translateX(-200vw)';
            }
        });
    }

    // 4. Smooth Scrolling for Nav Links & active state
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Hero Slider Logic
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.scroll-dots .dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let isTransitioning = false;

    function showSlide(index) {
        if (isTransitioning || index === currentSlide) return;
        isTransitioning = true;

        // Reset previous slide
        const prevSlideElem = slides[currentSlide];
        prevSlideElem.classList.remove('active');
        const prevVideo = prevSlideElem.querySelector('video');
        if (prevVideo) prevVideo.pause();

        dots[currentSlide].classList.remove('active');

        // Activate new slide
        currentSlide = index;
        const activeSlide = slides[currentSlide];
        activeSlide.classList.add('active');
        dots[currentSlide].classList.add('active');

        const activeVideo = activeSlide.querySelector('video');
        if (activeVideo) {
            activeVideo.currentTime = 0;
            activeVideo.play();
        }

        setTimeout(() => {
            isTransitioning = false;
        }, 1200); // Match CSS transition time
    }

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        });

        prevBtn.addEventListener('click', () => {
            let prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Auto Advance - every 8 seconds
    let sliderInterval = setInterval(() => {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }, 8000);

    // Pause auto-advance on manual interaction
    const stopAuto = () => clearInterval(sliderInterval);
    if (prevBtn) prevBtn.addEventListener('click', stopAuto);
    if (nextBtn) nextBtn.addEventListener('click', stopAuto);
    dots.forEach(dot => dot.addEventListener('click', stopAuto));
});
