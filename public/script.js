document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Effect
    const nav = document.getElementById('main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // 2. Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.animate-reveal');
    if (revealElements.length > 0) {
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

        revealElements.forEach(el => revealObserver.observe(el));
    }

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


    // 5. Hero Slider Logic
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.scroll-dots .dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let isTransitioning = false;

    if (slides.length > 0) {
        function showSlide(index) {
            if (isTransitioning || index === currentSlide || !slides[index]) return;
            isTransitioning = true;

            // Reset previous slide
            const prevSlideElem = slides[currentSlide];
            if (prevSlideElem) {
                prevSlideElem.classList.remove('active');
                const prevVideo = prevSlideElem.querySelector('video');
                if (prevVideo) prevVideo.pause();
            }

            if (dots[currentSlide]) {
                dots[currentSlide].classList.remove('active');
            }

            // Activate new slide
            currentSlide = index;
            const activeSlide = slides[currentSlide];
            if (activeSlide) {
                activeSlide.classList.add('active');
                if (dots[currentSlide]) dots[currentSlide].classList.add('active');

                const activeVideo = activeSlide.querySelector('video');
                if (activeVideo) {
                    activeVideo.currentTime = 0;
                    activeVideo.play();
                }
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
    }

    // 6. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuToggle?.querySelector('.material-symbols-outlined');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');

            // Toggle icon between menu and close
            if (menuIcon) {
                if (mobileMenu.classList.contains('active')) {
                    menuIcon.textContent = 'close';
                } else {
                    menuIcon.textContent = 'menu';
                }
            }
        });

        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                if (menuIcon) menuIcon.textContent = 'menu';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && e.target !== menuToggle) {
                mobileMenu.classList.remove('active');
                if (menuIcon) menuIcon.textContent = 'menu';
            }
        });
    }
});
