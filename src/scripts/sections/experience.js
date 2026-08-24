// Experience section-specific JS hooks
(function () {
    function initExperienceTimeline() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        // Generic reveal for headline, sub info, and key containers
        const revealIO = new IntersectionObserver((entries) => {
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

        const headlineAndSub = document.querySelectorAll('#experience .section-title, #experience .section-intro');
        headlineAndSub.forEach((el, idx) => {
            el.classList.add('experience-reveal');
            el.style.transitionDelay = `${Math.min(idx * 70, 350)}ms`;
            revealIO.observe(el);
        });

        // First timeline content container (description box)
        const firstTimelineContent = document.querySelector('#experience .timeline .timeline-item .timeline-content');
        if (firstTimelineContent) {
            firstTimelineContent.classList.add('experience-reveal');
            firstTimelineContent.style.transitionDelay = '120ms';
            revealIO.observe(firstTimelineContent);
        }

        const tabButtons = document.querySelectorAll('#experience .experience-tab');
        const tabPanels = document.querySelectorAll('#experience .timeline-tab-panel');
        const timelineItems = document.querySelectorAll('#experience .timeline-item');
        const floatTriggers = document.querySelectorAll('#experience .timeline-float-trigger');
        const floatPanels = document.querySelectorAll('#experience .timeline-float-panel');
        const floatCloseButtons = document.querySelectorAll('#experience .timeline-float-close');
        if (!timelineItems.length) return;

        timelineItems.forEach((item) => observer.observe(item));

        if (!tabButtons.length || !tabPanels.length) return;

        function closeAllFloatPanels() {
            floatTriggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
            floatPanels.forEach((panel) => {
                panel.classList.remove('open');
                panel.hidden = true;
            });
            timelineItems.forEach((item) => item.classList.remove('float-open'));
        }

        floatTriggers.forEach((trigger) => {
            trigger.addEventListener('click', (event) => {
                event.stopPropagation();
                const targetPanelId = trigger.getAttribute('aria-controls');
                if (!targetPanelId) return;
                const targetPanel = document.getElementById(targetPanelId);
                if (!targetPanel) return;

                const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
                closeAllFloatPanels();
                if (willOpen) {
                    const item = trigger.closest('.timeline-item');
                    if (item) item.classList.add('float-open');
                    trigger.setAttribute('aria-expanded', 'true');
                    targetPanel.hidden = false;
                    requestAnimationFrame(() => targetPanel.classList.add('open'));
                }
            });
        });

        // Close buttons inside the float sheet (for mobile & tablet UX, also works on desktop)
        floatCloseButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                closeAllFloatPanels();
            });
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('#experience .timeline-float')) {
                closeAllFloatPanels();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeAllFloatPanels();
            }
        });

        function activateTab(targetPanelId) {
            closeAllFloatPanels();
            tabButtons.forEach((button) => {
                const isActive = button.getAttribute('aria-controls') === targetPanelId;
                button.classList.toggle('active', isActive);
                button.setAttribute('aria-selected', String(isActive));
            });

            tabPanels.forEach((panel) => {
                const isActive = panel.id === targetPanelId;
                panel.classList.toggle('active', isActive);
                panel.hidden = !isActive;
            });
        }

        tabButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const targetPanelId = button.getAttribute('aria-controls');
                if (!targetPanelId) return;
                activateTab(targetPanelId);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initExperienceTimeline);
    } else {
        initExperienceTimeline();
    }
})();