(function () {
    function initInstax() {
        const stage = document.getElementById('instaxStage');
        const rig = document.getElementById('instaxRig');
        const camera = document.getElementById('instaxCamera');
        const polaroid = document.getElementById('polaroid');
        const dragEl = document.getElementById('polaroidDrag');
        const hint = document.getElementById('instaxHint');
        if (!stage || !rig || !camera || !polaroid || !dragEl) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const coarse = window.matchMedia('(pointer: coarse)').matches;
        let busy = false;
        let printed = false;
        let dragging = false;
        let tiltX = 0;
        let tiltY = 0;
        let startX = 0;
        let startY = 0;
        let dragX = 0;
        let dragY = 0;

        function flash() {
            camera.classList.add('is-firing');
            window.setTimeout(() => camera.classList.remove('is-firing'), 140);
        }

        function setDrag(x, y, rot) {
            if (window.gsap) {
                window.gsap.set(dragEl, { x, y, rotation: rot });
                return;
            }
            dragEl.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        }

        function restPolaroid() {
            printed = false;
            polaroid.classList.remove('is-out', 'is-developed', 'is-shining', 'is-lifted', 'is-dragging');
            dragEl.style.transition = 'none';
            setDrag(0, 0, 0);
            polaroid.setAttribute('aria-hidden', 'true');
        }

        function print() {
            if (busy || dragging) return;
            busy = true;
            polaroid.setAttribute('aria-hidden', 'false');

            const run = () => {
                if (reduce) {
                    polaroid.classList.add('is-out', 'is-developed', 'is-shining');
                    printed = true;
                    busy = false;
                    if (hint) hint.textContent = 'Drag the photo';
                    return;
                }

                flash();
                window.setTimeout(() => {
                    polaroid.classList.add('is-out');
                    window.setTimeout(() => polaroid.classList.add('is-developed'), 420);
                    window.setTimeout(() => polaroid.classList.add('is-shining'), 980);
                    window.setTimeout(() => {
                        printed = true;
                        busy = false;
                        if (hint) hint.textContent = 'Drag the photo';
                    }, 1450);
                }, 90);
            };

            if (printed) {
                restPolaroid();
                void polaroid.offsetWidth;
                window.setTimeout(run, 280);
                return;
            }

            run();
        }

        function onPointerDown(e) {
            if (!printed || busy) return;
            e.preventDefault();
            dragging = true;
            startX = e.clientX - dragX;
            startY = e.clientY - dragY;
            polaroid.classList.add('is-dragging', 'is-lifted');
            dragEl.style.transition = 'none';
            if (window.gsap) window.gsap.killTweensOf(dragEl);
            dragEl.setPointerCapture?.(e.pointerId);
        }

        function onPointerMove(e) {
            if (!dragging) return;
            dragX = e.clientX - startX;
            dragY = e.clientY - startY;
            setDrag(dragX, dragY, dragX * 0.04);
        }

        function onPointerUp() {
            if (!dragging) return;
            dragging = false;
            polaroid.classList.remove('is-dragging');
            if (hint) hint.textContent = 'Drag the photo';

            const finish = () => {
                dragX = 0;
                dragY = 0;
                polaroid.classList.remove('is-lifted');
            };

            if (reduce) {
                setDrag(0, 0, 0);
                finish();
                return;
            }

            if (window.gsap) {
                window.gsap.to(dragEl, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    duration: 0.85,
                    ease: 'power3.out',
                    onComplete: finish
                });
                return;
            }

            dragEl.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
            setDrag(0, 0, 0);
            window.setTimeout(finish, 860);
        }

        camera.addEventListener('click', print);
        polaroid.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);

        if (!coarse && !reduce) {
            stage.addEventListener('pointermove', (e) => {
                if (dragging) return;
                const rect = stage.getBoundingClientRect();
                const nx = (e.clientX - rect.left) / rect.width - 0.5;
                const ny = (e.clientY - rect.top) / rect.height - 0.5;
                tiltX = ny * -6;
                tiltY = nx * 8;
            });
            stage.addEventListener('pointerleave', () => {
                if (dragging) return;
                tiltX = 0;
                tiltY = 0;
            });
        }

        function tick(now) {
            const floatY = reduce || coarse || dragging ? 0 : Math.sin(now / 900) * 6;
            rig.style.setProperty('--tilt-x', `${tiltX}deg`);
            rig.style.setProperty('--tilt-y', dragging ? '0deg' : `${tiltY}deg`);
            rig.style.setProperty('--float-y', `${floatY}px`);
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function initMarquee() {
        const track = document.querySelector('.home-marquee .marquee-track');
        if (!track) return;
        const groups = [...track.querySelectorAll('.marquee-group')];
        if (groups.length < 2) return;
        const seed = groups[0].innerHTML;

        function fill() {
            const minWidth = Math.max(document.documentElement.clientWidth, 768);
            groups.forEach((group) => {
                group.innerHTML = seed;
                const base = [...group.children];
                let guard = 0;
                while (group.scrollWidth < minWidth && guard < 10) {
                    base.forEach((node) => group.appendChild(node.cloneNode(true)));
                    guard += 1;
                }
            });
        }

        fill();
        window.addEventListener('resize', fill);
    }

    function bootHome() {
        initInstax();
        initMarquee();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootHome);
    } else {
        bootHome();
    }
})();
