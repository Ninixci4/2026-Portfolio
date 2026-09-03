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
        let tapOnPhone = false;

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
            tapOnPhone = Boolean(e.target.closest('.phone, .phone-screen, .phone-slides, .phone-rig'));
            startX = e.clientX;
            startY = e.clientY;
            stage.setPointerCapture?.(e.pointerId);
        });

        stage.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.hypot(dx, dy) > 10) moved = true;
            targetY = Math.max(-55, Math.min(55, -24 + dx * 0.35));
            targetX = Math.max(-16, Math.min(22, 8 - dy * 0.18));
        });

        const endDrag = (e) => {
            if (!dragging) return;
            dragging = false;
            targetX = 8;
            targetY = -24;
            const shouldPreview = !moved && tapOnPhone && e?.type === 'pointerup';
            tapOnPhone = false;
            if (shouldPreview) {
                const media = slides[shot] || stage.querySelector('.phone-slides .is-active') || stage.querySelector('.phone-slides img, .phone-slides video');
                openPreview(media, {
                    items: [...slides].map((node) => ({
                        src: node.currentSrc || node.src,
                        alt: node.alt || 'Screenshot preview',
                        isVideo: node.tagName === 'VIDEO'
                    })),
                    index: shot
                });
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

    const previewState = { items: [], index: 0 };
    const zoomState = { scale: 1, x: 0, y: 0, min: 1, max: 4 };

    function resetPreviewZoom(stage, box) {
        zoomState.scale = 1;
        zoomState.x = 0;
        zoomState.y = 0;
        if (stage) {
            stage.classList.remove('is-zoomed', 'is-panning');
            stage.style.transform = '';
        }
        box?.classList.remove('is-image-zoomed');
    }

    function applyPreviewTransform(stage, box) {
        if (!stage) return;
        stage.style.transform = `translate3d(${zoomState.x}px, ${zoomState.y}px, 0) scale(${zoomState.scale})`;
        stage.classList.toggle('is-zoomed', zoomState.scale > 1);
        box?.classList.toggle('is-image-zoomed', zoomState.scale > 1);
    }

    function setPreviewZoom(stage, box, nextScale) {
        zoomState.scale = Math.min(zoomState.max, Math.max(zoomState.min, nextScale));
        if (zoomState.scale <= 1) {
            zoomState.x = 0;
            zoomState.y = 0;
        }
        applyPreviewTransform(stage, box);
    }

    function bindPreviewZoom(box, stage, mediaEl) {
        if (!stage || !mediaEl || mediaEl.tagName === 'VIDEO') return;
        resetPreviewZoom(stage, box);

        const onWheel = (e) => {
            e.preventDefault();
            setPreviewZoom(stage, box, zoomState.scale + (e.deltaY > 0 ? -0.12 : 0.12));
        };

        mediaEl.addEventListener('wheel', onWheel, { passive: false });

        mediaEl.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (zoomState.scale > 1) resetPreviewZoom(stage, box);
            else setPreviewZoom(stage, box, 2);
        });

        let panning = false;
        let panStartX = 0;
        let panStartY = 0;
        let panOriginX = 0;
        let panOriginY = 0;

        stage.addEventListener('pointerdown', (e) => {
            if (zoomState.scale <= 1 || e.button !== 0) return;
            panning = true;
            panStartX = e.clientX;
            panStartY = e.clientY;
            panOriginX = zoomState.x;
            panOriginY = zoomState.y;
            stage.classList.add('is-panning');
            stage.setPointerCapture?.(e.pointerId);
        });

        stage.addEventListener('pointermove', (e) => {
            if (!panning) return;
            zoomState.x = panOriginX + (e.clientX - panStartX);
            zoomState.y = panOriginY + (e.clientY - panStartY);
            applyPreviewTransform(stage, box);
        });

        const endPan = () => {
            if (!panning) return;
            panning = false;
            stage.classList.remove('is-panning');
        };

        stage.addEventListener('pointerup', endPan);
        stage.addEventListener('pointercancel', endPan);

        let pinchStart = 0;
        let pinchScale = 1;

        stage.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 2) return;
            pinchStart = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            pinchScale = zoomState.scale;
        }, { passive: true });

        stage.addEventListener('touchmove', (e) => {
            if (e.touches.length !== 2 || !pinchStart) return;
            e.preventDefault();
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            setPreviewZoom(stage, box, pinchScale * (distance / pinchStart));
        }, { passive: false });

        stage.addEventListener('touchend', () => {
            pinchStart = 0;
        });
    }

    function mediaFromItem(item) {
        if (typeof item === 'string') {
            return { src: item, alt: 'Screenshot preview', isVideo: isVideo(item) };
        }
        if (item && item.src) return item;
        if (!item) return null;
        return {
            src: item.currentSrc || item.src,
            alt: item.alt || 'Screenshot preview',
            isVideo: item.tagName === 'VIDEO'
        };
    }

    function buildPreviewItems(media, options = {}) {
        if (options.items && options.items.length) {
            return {
                items: options.items.map((item) => mediaFromItem(item)).filter(Boolean),
                index: options.index ?? 0
            };
        }
        const single = mediaFromItem(media);
        if (!single) return { items: [], index: 0 };
        return { items: [single], index: 0 };
    }

    function updatePreviewChrome(box) {
        const hasMany = previewState.items.length > 1;
        box.classList.toggle('has-gallery', hasMany);
        const prev = box.querySelector('.phone-preview-nav.prev');
        const next = box.querySelector('.phone-preview-nav.next');
        const dotsWrap = box.querySelector('.phone-preview-dots');
        if (prev) prev.disabled = !hasMany;
        if (next) next.disabled = !hasMany;
        if (dotsWrap) {
            dotsWrap.innerHTML = hasMany
                ? previewState.items.map((_, i) => `
                    <button type="button" class="phone-preview-dot${i === previewState.index ? ' is-active' : ''}" data-index="${i}" aria-label="Image ${i + 1} of ${previewState.items.length}"></button>
                `).join('')
                : '';
            dotsWrap.querySelectorAll('.phone-preview-dot').forEach((dot) => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showPreviewSlide(Number(dot.dataset.index));
                });
            });
        }
        const counter = box.querySelector('.phone-preview-counter');
        if (counter) {
            counter.textContent = hasMany ? `${previewState.index + 1} / ${previewState.items.length}` : '';
            counter.hidden = !hasMany;
        }
    }

    function renderPreviewSlide() {
        const box = ensurePreview();
        const frame = box.querySelector('.phone-preview-frame');
        const item = previewState.items[previewState.index];
        if (!item) return;
        resetPreviewZoom(null, box);
        frame.replaceChildren();
        if (item.isVideo) {
            box.classList.add('is-video-preview');
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            frame.appendChild(video);
            video.play().catch(() => {});
        } else {
            box.classList.remove('is-video-preview');
            const stage = document.createElement('div');
            stage.className = 'phone-preview-stage';
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt || 'Screenshot preview';
            img.draggable = false;
            stage.appendChild(img);
            frame.appendChild(stage);
            bindPreviewZoom(box, stage, img);
        }
        updatePreviewChrome(box);
    }

    function showPreviewSlide(index) {
        if (!previewState.items.length) return;
        previewState.index = (index + previewState.items.length) % previewState.items.length;
        renderPreviewSlide();
    }

    function ensurePreview() {
        let box = document.querySelector('.phone-preview');
        if (box && box.dataset.previewVersion === '2') return box;
        if (box) box.remove();
        box = document.createElement('div');
        box.className = 'phone-preview';
        box.dataset.previewVersion = '2';
        box.innerHTML = `
            <button type="button" class="phone-preview-close" aria-label="Close preview">
                <i class="fas fa-times"></i>
            </button>
            <button type="button" class="phone-preview-nav prev" aria-label="Previous image">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button type="button" class="phone-preview-nav next" aria-label="Next image">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="phone-preview-frame"></div>
            <div class="phone-preview-zoom-controls" aria-label="Zoom controls">
                <button type="button" class="phone-preview-zoom in" aria-label="Zoom in">
                    <i class="fas fa-search-plus"></i>
                </button>
                <button type="button" class="phone-preview-zoom out" aria-label="Zoom out">
                    <i class="fas fa-search-minus"></i>
                </button>
                <button type="button" class="phone-preview-zoom reset" aria-label="Reset zoom">
                    <i class="fas fa-compress"></i>
                </button>
            </div>
            <p class="phone-preview-counter" hidden aria-live="polite"></p>
            <div class="phone-preview-dots" role="tablist" aria-label="Preview images"></div>
        `;
        document.body.appendChild(box);
        box.querySelector('.phone-preview-close').addEventListener('click', closePreview);
        box.querySelector('.phone-preview-nav.prev')?.addEventListener('click', (e) => {
            e.stopPropagation();
            showPreviewSlide(previewState.index - 1);
        });
        box.querySelector('.phone-preview-nav.next')?.addEventListener('click', (e) => {
            e.stopPropagation();
            showPreviewSlide(previewState.index + 1);
        });
        box.addEventListener('click', (e) => {
            if (e.target === box) closePreview();
        });
        box.querySelector('.phone-preview-zoom.in')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const stage = box.querySelector('.phone-preview-stage');
            if (stage) setPreviewZoom(stage, box, zoomState.scale + 0.25);
        });
        box.querySelector('.phone-preview-zoom.out')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const stage = box.querySelector('.phone-preview-stage');
            if (stage) setPreviewZoom(stage, box, zoomState.scale - 0.25);
        });
        box.querySelector('.phone-preview-zoom.reset')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const stage = box.querySelector('.phone-preview-stage');
            if (stage) resetPreviewZoom(stage, box);
        });
        document.addEventListener('keydown', (e) => {
            if (!box.classList.contains('is-open')) return;
            if (e.key === 'Escape') closePreview();
            if (previewState.items.length < 2) return;
            if (e.key === 'ArrowLeft') showPreviewSlide(previewState.index - 1);
            if (e.key === 'ArrowRight') showPreviewSlide(previewState.index + 1);
        });
        return box;
    }

    function openPreview(media, options = {}) {
        const next = buildPreviewItems(media, options);
        if (!next.items.length) return;
        previewState.items = next.items;
        previewState.index = Math.max(0, Math.min(next.index, next.items.length - 1));
        const box = ensurePreview();
        renderPreviewSlide();
        box.classList.add('is-open');
        document.body.classList.add('preview-open');
    }

    function closePreview() {
        const box = document.querySelector('.phone-preview');
        if (!box) return;
        const video = box.querySelector('video');
        if (video) video.pause();
        box.classList.remove('is-open', 'has-gallery', 'is-video-preview', 'is-image-zoomed');
        document.body.classList.remove('preview-open');
        box.querySelector('.phone-preview-frame')?.replaceChildren();
        box.querySelector('.phone-preview-dots')?.replaceChildren();
        const counter = box.querySelector('.phone-preview-counter');
        if (counter) {
            counter.textContent = '';
            counter.hidden = true;
        }
        previewState.items = [];
        previewState.index = 0;
    }

    window.PhoneMockup = {
        markup: phoneMarkup,
        preview: openPreview,
        closePreview,
        mount(root) {
            (root || document).querySelectorAll('[data-phone]').forEach(bindPhone);
        }
    };
})();
