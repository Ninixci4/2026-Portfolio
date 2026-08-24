// About section-specific JS hooks
(function () {
    function initAboutReveal() {
        const aboutSection = document.getElementById('about');
        if (!aboutSection) return;

        const revealItems = aboutSection.querySelectorAll('.about-reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    } else {
                        entry.target.classList.remove('is-visible');
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );

        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
            observer.observe(item);
        });
    }

    function initAboutTilt() {
        const tiltCard = document.querySelector('#about .about-tilt');
        if (!tiltCard) return;

        const onMove = (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateY = (x - 0.5) * 8;
            const rotateX = (0.5 - y) * 8;
            tiltCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            tiltCard.classList.add('is-hovering');
        };

        const reset = () => {
            tiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
            tiltCard.classList.remove('is-hovering');
        };

        tiltCard.addEventListener('mousemove', onMove);
        tiltCard.addEventListener('mouseleave', reset);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initAboutReveal();
            initAboutTilt();
        });
    } else {
        initAboutReveal();
        initAboutTilt();
    }
})();
