(function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        document.body.classList.add('is-ready');
        if (!preloader) return;
        preloader.classList.add('is-done');
        setTimeout(() => preloader.remove(), 700);
    }

    function initCursor() {
        if (!finePointer || reduce) return;
        const cursor = document.getElementById('cursor');
        if (!cursor) return;
        const dot = cursor.querySelector('.cursor-dot');
        const ring = cursor.querySelector('.cursor-ring');
        const label = cursor.querySelector('.cursor-label');
        let x = 0;
        let y = 0;
        let rx = 0;
        let ry = 0;

        window.addEventListener('mousemove', (e) => {
            x = e.clientX;
            y = e.clientY;
            dot.style.transform = `translate(${x}px, ${y}px)`;
        });

        function loop() {
            rx += (x - rx) * 0.18;
            ry += (y - ry) * 0.18;
            ring.style.transform = `translate(${rx}px, ${ry}px)`;
            label.style.transform = `translate(${rx}px, ${ry}px)`;
            requestAnimationFrame(loop);
        }
        loop();

        document.querySelectorAll('a, button, .work-card, .certification-card, .magnetic').forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('is-hover');
                if (el.dataset.cursor) label.textContent = el.dataset.cursor;
            });
            el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
        });
    }

    function initSpotlight() {
        const spot = document.getElementById('spotlight');
        if (!spot || !finePointer) return;
        window.addEventListener('mousemove', (e) => {
            spot.style.left = `${e.clientX}px`;
            spot.style.top = `${e.clientY}px`;
        });
    }

    function initProgress() {
        const bar = document.getElementById('scrollProgress');
        if (!bar) return;
        window.addEventListener('scroll', () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
        }, { passive: true });
    }

    function initReveal() {
        const items = document.querySelectorAll('[data-reveal], [data-reveal]');
        if (!items.length) return;
        if (reduce) {
            items.forEach((el) => el.classList.add('is-in'));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('is-in', entry.isIntersecting);
            });
        }, { threshold: 0.16, rootMargin: '0px 0px -80px 0px' });
        items.forEach((el, i) => {
            el.style.transitionDelay = `${Math.min(i % 6, 4) * 70}ms`;
            io.observe(el);
        });
    }

    function initCounters() {
        const counters = document.querySelectorAll('[data-count], [data-count]');
        if (!counters.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.target.dataset.done) return;
                entry.target.dataset.done = '1';
                const end = Number(entry.target.dataset.count);
                const start = performance.now();
                const tick = (now) => {
                    const p = Math.min((now - start) / 900, 1);
                    entry.target.textContent = Math.round(end * p);
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            });
        }, { threshold: 0.5 });
        counters.forEach((el) => io.observe(el));
    }

    function initLenisAndGsap() {
        if (reduce || !window.gsap || !window.ScrollTrigger) return;
        gsap.registerPlugin(ScrollTrigger);

        if (window.Lenis) {
            const lenis = new Lenis({ lerp: 0.08 });
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            lenis.on('scroll', ScrollTrigger.update);
        }

        document.querySelectorAll('.work-card').forEach((card) => {
            gsap.fromTo(card, { scale: 1 }, {
                scale: 0.92,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 110px',
                    end: 'bottom 110px',
                    scrub: true
                }
            });
        });

        document.querySelectorAll('.timeline-item').forEach((item) => {
            gsap.to(item, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                scrollTrigger: { trigger: item, start: 'top 82%' }
            });
        });
    }

    function initRipple() {
        document.querySelectorAll('.work-card, .certification-card, .btn, .filter-chip, .experience-tab').forEach((el) => {
            el.style.position = el.style.position || 'relative';
            el.addEventListener('click', (e) => {
                const rect = el.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = `${e.clientX - rect.left}px`;
                ripple.style.top = `${e.clientY - rect.top}px`;
                el.appendChild(ripple);
                setTimeout(() => ripple.remove(), 700);
            });
        });
    }

    function boot() {
        hidePreloader();
        initCursor();
        initSpotlight();
        initProgress();
        initReveal();
        initCounters();
        initLenisAndGsap();
        initRipple();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
    }

    document.addEventListener('portfolio:ready', boot);
    window.addEventListener('load', () => setTimeout(hidePreloader, 700));
})();
