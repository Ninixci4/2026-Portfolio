(function () {
    function isVideo(src) {
        return /\.(mp4|webm|ogg)$/i.test(src);
    }

    function phoneMarkup(shots, title) {
        const slides = shots.map((src, i) => {
            const active = i === 0 ? 'is-active' : '';
            if (isVideo(src)) {
                return `<video src="${src}" class="${active}" muted loop playsinline preload="metadata" disablepictureinpicture></video>`;
            }
            return `<img src="${src}" alt="${title} screenshot ${i + 1}" class="${active}" draggable="false">`;
        }).join('');
        const dots = shots.length > 1
            ? `<div class="phone-dots">${shots.map((_, i) => `<button type="button" class="phone-dot${i === 0 ? ' is-active' : ''}" data-shot="${i}" aria-label="Screenshot ${i + 1}"></button>`).join('')}</div>`
            : '';
        return `
            <div class="phone-stage" data-phone>
                <div class="phone-rig">
                    <div class="phone">
                        <div class="phone-shell"></div>
                        <span class="phone-edge"></span>
                        <span class="phone-btn silent"></span>
                        <span class="phone-btn vol-up"></span>
                        <span class="phone-btn vol-down"></span>
                        <span class="phone-btn power"></span>
                        <div class="phone-screen">
                            <div class="phone-slides">${slides}</div>
                            <span class="phone-gloss"></span>
                        </div>
                        <div class="phone-notch"></div>
                    </div>
                </div>
            </div>
            <p class="phone-hint">Drag to rotate · tap screen to preview</p>
            ${dots}
        `;
    }

    function bindPhone(stage) {
        const rig = stage.querySelector('.phone-rig');
        if (!rig) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let rotX = 8;
        let rotY = -24;
        let targetX = 8;
        let targetY = -24;
        let dragging = false;
        let startX = 0;
        let startY = 0;
        let moved = false;
        let idle = 0;

        function render() {
            rotX += (targetX - rotX) * 0.16;
            rotY += (targetY - rotY) * 0.16;
            if (!dragging && !reduce) {
                idle += 0.018;
                rotY += Math.sin(idle) * 0.08;
            }
            rig.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            requestAnimationFrame(render);
        }

        stage.addEventListener('pointerdown', (e) => {
            if (e.button && e.button !== 0) return;
            e.preventDefault();
            dragging = true;
            moved = false;
            startX = e.clientX;
            startY = e.clientY;
            stage.setPointerCapture?.(e.pointerId);
        });

        stage.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.hypot(dx, dy) > 4) moved = true;
            targetY = Math.max(-55, Math.min(55, -24 + dx * 0.35));
            targetX = Math.max(-16, Math.min(22, 8 - dy * 0.18));
        });

        const endDrag = (e) => {
            if (!dragging) return;
            dragging = false;
            targetX = 8;
            targetY = -24;
            if (!moved && e?.type === 'pointerup' && e.target.closest('.phone-screen, .phone-slides, .phone')) {
                openPreview(slides[shot]);
            }
        };

        stage.addEventListener('pointerup', endDrag);
        stage.addEventListener('pointercancel', endDrag);
        stage.addEventListener('dragstart', (e) => e.preventDefault());

        const wrap = stage.parentElement;
        const slides = stage.querySelectorAll('.phone-slides img, .phone-slides video');
        const dots = wrap?.querySelectorAll('.phone-dot') || [];
        let shot = 0;
        function showShot(index) {
            shot = (index + slides.length) % slides.length;
            slides.forEach((media, i) => {
                media.classList.toggle('is-active', i === shot);
                if (media.tagName === 'VIDEO') {
                    if (i === shot) media.play().catch(() => {});
                    else media.pause();
                }
            });
            dots.forEach((dot, i) => dot.classList.toggle('is-active', i === shot));
        }
        dots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showShot(Number(dot.dataset.shot));
            });
        });
        if (slides[0] && slides[0].tagName === 'VIDEO') {
            slides[0].play().catch(() => {});
        }
        if (slides.length > 1 && !reduce) {
            setInterval(() => {
                if (!dragging && !document.querySelector('.phone-preview.is-open')) showShot(shot + 1);
            }, 3400);
        }

        render();
    }

    function ensurePreview() {
        let box = document.querySelector('.phone-preview');
        if (box) return box;
        box = document.createElement('div');
        box.className = 'phone-preview';
        box.innerHTML = `
            <button type="button" class="phone-preview-close" aria-label="Close preview">
                <i class="fas fa-times"></i>
            </button>
            <div class="phone-preview-frame"></div>
        `;
        document.body.appendChild(box);
        box.querySelector('.phone-preview-close').addEventListener('click', closePreview);
        box.addEventListener('click', (e) => {
            if (e.target === box) closePreview();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && box.classList.contains('is-open')) closePreview();
        });
        return box;
    }

    function openPreview(media) {
        if (!media) return;
        const box = ensurePreview();
        const frame = box.querySelector('.phone-preview-frame');
        frame.replaceChildren();
        if (media.tagName === 'VIDEO') {
            const video = document.createElement('video');
            video.src = media.currentSrc || media.src;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            frame.appendChild(video);
            video.play().catch(() => {});
        } else {
            const img = document.createElement('img');
            img.src = media.currentSrc || media.src;
            img.alt = media.alt || 'Screenshot preview';
            frame.appendChild(img);
        }
        box.classList.add('is-open');
        document.body.classList.add('preview-open');
    }

    function closePreview() {
        const box = document.querySelector('.phone-preview');
        if (!box) return;
        const video = box.querySelector('video');
        if (video) video.pause();
        box.classList.remove('is-open');
        document.body.classList.remove('preview-open');
        box.querySelector('.phone-preview-frame')?.replaceChildren();
    }

    window.PhoneMockup = {
        markup: phoneMarkup,
        mount(root) {
            (root || document).querySelectorAll('[data-phone]').forEach(bindPhone);
        }
    };
})();
