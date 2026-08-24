// Contact section-specific JS hooks
(function () {
    function initContactReveal() {
        const targets = document.querySelectorAll('#contact .section-title, #contact .section-intro, #contact .contact-info-card, #contact .social-icons, #contact .contact-form');
        if (!targets.length) return;

        targets.forEach((item, index) => {
            item.classList.add('contact-reveal');
            item.style.transitionDelay = `${Math.min(index * 80, 400)}ms`;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, {
            threshold: 0.16,
            rootMargin: '0px 0px -80px 0px'
        });

        targets.forEach((item) => observer.observe(item));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactReveal);
    } else {
        initContactReveal();
    }
})();