// Works section-specific JS hooks
(function () {
    function initWorksReveal() {
        const root = document.getElementById('works');
        if (!root) return;

        const selector = '#works .section-title, #works .section-intro, #works .work-card, #works .project-modal .modal-content';
        const targets = root.querySelectorAll(selector);

        targets.forEach((item, index) => {
            item.classList.add('works-reveal');
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

        // Handle dynamically injected cards after renderProjects()
        const grid = document.getElementById('worksGrid');
        if (grid) {
            const mo = new MutationObserver((mutations) => {
                mutations.forEach((m) => {
                    m.addedNodes.forEach((node) => {
                        if (!(node instanceof HTMLElement)) return;
                        // If a card or contains cards, mark and observe them
                        const newlyAdded = node.matches('.work-card') ? [node] : Array.from(node.querySelectorAll('.work-card'));
                        newlyAdded.forEach((el) => {
                            el.classList.add('works-reveal');
                            el.style.transitionDelay = '0ms';
                            io.observe(el);
                        });
                    });
                });
            });
            mo.observe(grid, { childList: true, subtree: true });
        }
    }

    function scheduleWorksRevealInit() {
        requestAnimationFrame(() => {
            setTimeout(initWorksReveal, 0);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleWorksRevealInit);
    } else {
        scheduleWorksRevealInit();
    }
})();