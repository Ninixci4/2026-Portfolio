// Certifications section-specific JS hooks
(function () {
    function initCertificationsReveal() {
        const root = document.getElementById('certifications');
        if (!root) return;

        const selector = '#certifications .section-title, #certifications .section-intro, #certifications .certification-card';
        const targets = root.querySelectorAll(selector);

        targets.forEach((item, index) => {
            item.classList.add('certifications-reveal');
            item.style.transitionDelay = `${Math.min((index % 8) * 70, 420)}ms`;
        });

        const io = new IntersectionObserver((entries) => {
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

        targets.forEach((item) => io.observe(item));

        // Handle dynamically injected certification cards
        const grid = document.getElementById('certificationsGrid');
        if (grid) {
            const mo = new MutationObserver((mutations) => {
                mutations.forEach((m) => {
                    m.addedNodes.forEach((node) => {
                        if (!(node instanceof HTMLElement)) return;
                        const newlyAdded = node.matches('.certification-card') ? [node] : Array.from(node.querySelectorAll('.certification-card'));
                        newlyAdded.forEach((el) => {
                            el.classList.add('certifications-reveal');
                            el.style.transitionDelay = '0ms';
                            io.observe(el);
                        });
                    });
                });
            });
            mo.observe(grid, { childList: true, subtree: true });
        }
    }

    function scheduleCertificationsRevealInit() {
        requestAnimationFrame(() => {
            setTimeout(initCertificationsReveal, 0);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleCertificationsRevealInit);
    } else {
        scheduleCertificationsRevealInit();
    }
})();