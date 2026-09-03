(function () {
    function initProductShowcase() {
        const root = document.getElementById('productShowcase');
        if (!root) return;

        const viewport = root.querySelector('.product-showcase__viewport');
        const stage = root.querySelector('.product-showcase__stage');
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
        if (!total || !viewport || !stage) return;

        if (root._showcaseBound) return;
        root._showcaseBound = true;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let active = 0;
        let prevOffsets = items.map((_, i) => i);
        let wheelLock = false;
        let pointerDown = false;
        let startX = 0;

        const wrapOffset = (index, activeIndex = active) => {
            let offset = index - activeIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            return offset;
        };

        const layout = () => {
            items = [...root.querySelectorAll('.product-showcase__item')];
            const width = viewport.clientWidth || window.innerWidth;
            const isMobile = width <= 640;
            const visibleAbs = isMobile ? 2 : 3;
            const cardW = Math.round(Math.min(isMobile ? width * 0.78 : width * 0.36, isMobile ? 300 : 460));
            const cardH = Math.round(cardW * 0.64);
            const centerScale = isMobile ? 1.14 : 1.24;
            const tilt = reduce ? 0 : (isMobile ? 12 : 18);
            const step = Math.round(cardW * (isMobile ? 0.46 : 0.5));
            const stageH = Math.round(cardH * centerScale + (isMobile ? 100 : 130));

            root.style.setProperty('--ps-card-w', `${cardW}px`);
            root.style.setProperty('--ps-card-h', `${cardH}px`);
            root.style.setProperty('--ps-scale-active', String(centerScale));
            root.style.setProperty('--ps-stage-h', `${stageH}px`);
            stage.style.height = `${stageH}px`;

            const nextOffsets = items.map((_, i) => wrapOffset(i));

            items.forEach((item, i) => {
                const offset = nextOffsets[i];
                const abs = Math.abs(offset);
                const visible = abs <= visibleAbs;
                const wrapped = Math.abs(offset - prevOffsets[i]) > total / 2;
                const card = item.querySelector('.product-showcase__card');

                if (wrapped) {
                    item.style.transition = 'none';
                    if (card) card.style.transition = 'none';
                    item.style.opacity = '0';
                }

                const scale = offset === 0
                    ? centerScale
                    : Math.max(0.64, 0.86 - abs * 0.09);
                const z = offset === 0 ? 0 : -abs * 45;
                const x = offset * step;
                const brightness = offset === 0 ? 1 : Math.max(0.65, 1 - abs * 0.15);

                item.style.transform =
                    `translate3d(calc(-50% + ${x}px), -50%, ${z}px) scale(${scale})`;
                item.style.setProperty('--ry', `${-offset * tilt}deg`);

                item.style.opacity = String(!visible ? 0 : offset === 0 ? 1 : Math.max(0.4, 1 - abs * 0.2));
                item.style.filter = offset === 0 ? 'none' : `brightness(${brightness})`;
                item.style.zIndex = String(100 - abs);
                item.style.pointerEvents = visible ? 'auto' : 'none';
                item.classList.toggle('is-center', offset === 0);
                item.setAttribute('aria-current', offset === 0 ? 'true' : 'false');
                item.tabIndex = offset === 0 ? 0 : -1;

                if (wrapped) {
                    void item.offsetWidth;
                    item.style.transition = '';
                    if (card) card.style.transition = '';
                }
            });

            prevOffsets = nextOffsets;
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

        const goTo = (index) => {
            active = ((index % total) + total) % total;
            layout();
            setInfo(active);
            updateDots();
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
            startX = e.clientX;
            viewport.classList.add('is-dragging');
        });

        viewport.addEventListener('pointerup', (e) => {
            if (!pointerDown) return;
            pointerDown = false;
            viewport.classList.remove('is-dragging');
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 40) goTo(dx < 0 ? active + 1 : active - 1);
        });

        viewport.addEventListener('pointercancel', () => {
            pointerDown = false;
            viewport.classList.remove('is-dragging');
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
            new ResizeObserver(layout).observe(viewport);
        } else {
            window.addEventListener('resize', layout);
        }

        root.classList.add('is-ready');
        layout();
        setInfo(active);
        updateDots();
    }

    window.initProductShowcase = initProductShowcase;
})();
