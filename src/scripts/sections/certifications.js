(function () {
    function initProductShowcase() {
        const root = document.getElementById('productShowcase');
        if (!root) return;

        const viewport = root.querySelector('.product-showcase__viewport');
        const track = root.querySelector('.product-showcase__track');
        const info = root.querySelector('.product-showcase__info');
        const dotsWrap = root.querySelector('.product-showcase__dots');
        const prevBtn = root.querySelector('.product-showcase__nav--prev');
        const nextBtn = root.querySelector('.product-showcase__nav--next');
        const cta = root.querySelector('.product-showcase__cta');
        const categoryEl = root.querySelector('.product-showcase__category');
        const nameEl = root.querySelector('.product-showcase__name');
        const descEl = root.querySelector('.product-showcase__desc');

        let items = [...root.querySelectorAll('.product-showcase__item')];
        const total = items.length;
        if (!total || !viewport || !track) return;

        if (root._showcaseBound) return;
        root._showcaseBound = true;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let active = 0;
        let wheelLock = false;
        let pointerDown = false;
        let dragging = false;
        let startX = 0;
        let startY = 0;
        let dragX = 0;
        let ignoreClick = false;

        const slideWidth = () => viewport.clientWidth || 1;

        const translateFor = (index, extra = 0) => {
            return `translate3d(${(-index * slideWidth()) + extra}px, 0, 0)`;
        };

        const layout = (extra = 0, instant = false) => {
            items = [...root.querySelectorAll('.product-showcase__item')];
            if (instant || reduce) track.style.transition = 'none';
            track.style.transform = translateFor(active, extra);
            if (instant || reduce) {
                void track.offsetWidth;
                track.style.transition = '';
            }

            items.forEach((item, i) => {
                const isActive = i === active;
                item.classList.toggle('is-center', isActive);
                item.setAttribute('aria-current', isActive ? 'true' : 'false');
                item.tabIndex = isActive ? 0 : -1;
            });
        };

        const setInfo = (index) => {
            const item = items[index];
            if (!item || !info) return;

            const apply = () => {
                if (categoryEl) categoryEl.textContent = item.dataset.category || '';
                if (nameEl) nameEl.textContent = item.dataset.name || '';
                if (descEl) descEl.textContent = item.dataset.desc || '';
                if (cta) cta.dataset.id = item.dataset.id || '';
                info.classList.remove('is-switching');
            };

            if (reduce) {
                apply();
                return;
            }

            info.classList.add('is-switching');
            window.setTimeout(apply, 180);
        };

        const updateDots = () => {
            dotsWrap?.querySelectorAll('.product-showcase__dot').forEach((dot, i) => {
                const isActive = i === active;
                dot.classList.toggle('is-active', isActive);
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
                dot.tabIndex = isActive ? 0 : -1;
            });
        };

        const syncNav = () => {
            if (prevBtn) prevBtn.disabled = active === 0;
            if (nextBtn) nextBtn.disabled = active === total - 1;
        };

        const goTo = (index) => {
            active = Math.max(0, Math.min(total - 1, index));
            layout();
            setInfo(active);
            updateDots();
            syncNav();
        };

        const openActiveCertificate = () => {
            const item = items[active];
            const id = Number(item?.dataset.id);
            if (id && window.openCertificateModal) window.openCertificateModal(id);
        };

        if (dotsWrap) {
            dotsWrap.innerHTML = '';
            items.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = `product-showcase__dot${i === active ? ' is-active' : ''}`;
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', `Certificate ${i + 1}`);
                dot.setAttribute('aria-selected', i === active ? 'true' : 'false');
                dot.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(dot);
            });
        }

        items.forEach((item, i) => {
            item.classList.add('certification-card');
            item.dataset.cursor = 'view';

            item.addEventListener('click', () => {
                if (ignoreClick) return;
                if (i === active) openActiveCertificate();
                else goTo(i);
            });

            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (i === active) openActiveCertificate();
                    else goTo(i);
                }
            });
        });

        prevBtn?.addEventListener('click', () => goTo(active - 1));
        nextBtn?.addEventListener('click', () => goTo(active + 1));
        cta?.addEventListener('click', openActiveCertificate);

        root.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goTo(active - 1);
            if (e.key === 'ArrowRight') goTo(active + 1);
        });

        viewport.addEventListener('pointerdown', (e) => {
            if (e.button && e.button !== 0) return;
            pointerDown = true;
            dragging = false;
            startX = e.clientX;
            startY = e.clientY;
            dragX = 0;
            viewport.classList.add('is-dragging');
            viewport.setPointerCapture?.(e.pointerId);
        });

        viewport.addEventListener('pointermove', (e) => {
            if (!pointerDown) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (!dragging && Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
            if (Math.abs(dx) < Math.abs(dy)) return;
            dragging = true;
            dragX = dx;
            layout(dx, true);
        });

        const endDrag = () => {
            if (!pointerDown) return;
            pointerDown = false;
            viewport.classList.remove('is-dragging');
            if (dragging && Math.abs(dragX) > 40) {
                ignoreClick = true;
                goTo(dragX < 0 ? active + 1 : active - 1);
                window.setTimeout(() => {
                    ignoreClick = false;
                }, 80);
            } else {
                layout();
            }
            dragging = false;
            dragX = 0;
        };

        viewport.addEventListener('pointerup', endDrag);
        viewport.addEventListener('pointercancel', endDrag);
        viewport.addEventListener('pointerleave', () => {
            if (pointerDown) endDrag();
        });

        viewport.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
            e.preventDefault();
            if (wheelLock) return;
            wheelLock = true;
            goTo(e.deltaX > 0 ? active + 1 : active - 1);
            window.setTimeout(() => {
                wheelLock = false;
            }, 420);
        }, { passive: false });

        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(() => layout(0, true)).observe(viewport);
        } else {
            window.addEventListener('resize', () => layout(0, true));
        }

        root.classList.add('is-ready');
        layout(0, true);
        setInfo(active);
        updateDots();
        syncNav();
    }

    window.initProductShowcase = initProductShowcase;
})();
