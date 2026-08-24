// Home section-specific JS hooks
(function () {
    function initHomeReveal() {
        const targets = document.querySelectorAll('#home .section-title, #home .section-intro, #home .home-left, #home .home-right');
        if (!targets.length) return;

        targets.forEach((item, index) => {
            item.classList.add('home-reveal');
            item.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
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
        document.addEventListener('DOMContentLoaded', initHomeReveal);
    } else {
        initHomeReveal();
    }
})();