(function (window) {
    const ns = 'http://www.w3.org/2000/svg';

    function write(root, options = {}) {
        const name = typeof root === 'string' ? document.getElementById(root) : root;
        if (!name) return { play() {}, destroy() {} };

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const strokes = [...name.querySelectorAll('.home-name-write')].filter((node) => node.closest('mask'));
        const inks = [...name.querySelectorAll('.home-name-ink')];
        const pen = name.querySelector('.home-name-pen');
        const sparkles = name.querySelector('.home-name-sparkles');
        const sparkleHref = options.sparkleHref || '#niciaSparkle';
        const dots = new Set(options.dots || [2, 5]);
        const restPoints = options.restPoints || [
            [64, 34], [108, 42], [154, 50], [202, 82], [244, 50], [292, 86], [338, 128]
        ];
        const sparkTweens = [];
        const fillMasks = [...name.querySelectorAll('.home-name-fill')].map((fill) => ({
            fill,
            mask: fill.getAttribute('mask')
        }));
        let timeline;
        let startTimer;
        let fallbackTimer;
        let completed = false;
        let restoredLag = false;

        function setRealtime(on) {
            if (!window.gsap || options.realtime !== true) return;
            if (on) {
                window.gsap.ticker.lagSmoothing(0);
                restoredLag = false;
                return;
            }
            if (restoredLag) return;
            restoredLag = true;
            window.gsap.ticker.lagSmoothing(500, 33);
        }

        function hideStrokes() {
            strokes.forEach((stroke) => {
                stroke.setAttribute('stroke-dasharray', '1');
                stroke.setAttribute('stroke-dashoffset', '1');
                stroke.style.strokeDasharray = '1';
                stroke.style.strokeDashoffset = '1';
            });
            inks.forEach((ink) => {
                ink.setAttribute('stroke-dasharray', '1');
                ink.setAttribute('stroke-dashoffset', '1');
                ink.style.strokeDasharray = '1';
                ink.style.strokeDashoffset = '1';
            });
        }

        function showFill() {
            fillMasks.forEach(({ fill }) => {
                fill.removeAttribute('opacity');
                fill.style.opacity = '';
            });
        }

        function concealFill() {
            fillMasks.forEach(({ fill }) => {
                fill.setAttribute('opacity', '0');
            });
        }

        function revealFill() {
            fillMasks.forEach(({ fill }) => fill.removeAttribute('mask'));
            inks.forEach((ink) => {
                if (window.gsap) window.gsap.to(ink, { opacity: 0, duration: 0.4, ease: 'power2.out' });
                else ink.style.opacity = '0';
            });
        }

        function restoreFillMask() {
            fillMasks.forEach(({ fill, mask }) => {
                if (mask) fill.setAttribute('mask', mask);
            });
        }

        function done() {
            if (completed) return;
            completed = true;
            if (options.unmaskOnComplete !== false) revealFill();
            if (typeof options.onComplete === 'function') options.onComplete();
        }

        function placePen(stroke, progress, length) {
            if (!pen || !stroke) return null;
            const len = length || Math.max(stroke.getTotalLength(), 1);
            const point = stroke.getPointAtLength(Math.max(0, Math.min(1, progress)) * len);
            pen.setAttribute('transform', `translate(${point.x} ${point.y})`);
            return point;
        }

        function clearSparkles() {
            sparkTweens.splice(0).forEach((tween) => tween.kill());
            if (sparkles) sparkles.replaceChildren();
        }

        function emitSparkle(x, y, burst) {
            if (!sparkles || !window.gsap) return;
            const kinds = ['', 'is-pink', 'is-lilac'];
            const size = burst ? 16 + Math.random() * 10 : 11 + Math.random() * 8;
            const wrap = document.createElementNS(ns, 'g');
            wrap.setAttribute('class', `home-name-sparkle ${kinds[Math.floor(Math.random() * kinds.length)]}`.trim());
            const spark = document.createElementNS(ns, 'use');
            spark.setAttribute('href', sparkleHref);
            spark.setAttribute('fill', 'currentColor');
            spark.setAttribute('width', String(size));
            spark.setAttribute('height', String(size));
            spark.setAttribute('x', String(-size / 2));
            spark.setAttribute('y', String(-size / 2));
            wrap.appendChild(spark);
            sparkles.appendChild(wrap);

            const startX = x + (Math.random() - 0.5) * (burst ? 10 : 6);
            const startY = y + (Math.random() - 0.5) * (burst ? 10 : 6);
            window.gsap.set(wrap, { x: startX, y: startY, transformOrigin: '0px 0px' });

            const tween = window.gsap.fromTo(wrap, {
                opacity: 0,
                scale: 0.12,
                rotation: Math.random() * 40 - 20
            }, {
                opacity: 1,
                scale: 1,
                rotation: `+=${Math.random() * 50 - 25}`,
                x: startX + (Math.random() - 0.5) * (burst ? 12 : 7),
                y: startY + (Math.random() - 0.7) * (burst ? 14 : 8),
                duration: burst ? 0.28 : 0.22,
                ease: 'power2.out',
                onComplete() {
                    window.gsap.to(wrap, {
                        opacity: 0,
                        scale: 0.2,
                        duration: burst ? 0.45 : 0.38,
                        ease: 'power1.in',
                        onComplete() { wrap.remove(); }
                    });
                }
            });
            sparkTweens.push(tween);
        }

        function twinkleRest() {
            if (!sparkles || !window.gsap) return;
            restPoints.forEach((point, index) => {
                const size = 9 + (index % 3) * 1.6;
                const wrap = document.createElementNS(ns, 'g');
                wrap.setAttribute('class', `home-name-sparkle ${index % 2 ? 'is-pink' : ''}`.trim());
                const spark = document.createElementNS(ns, 'use');
                spark.setAttribute('href', sparkleHref);
                spark.setAttribute('fill', 'currentColor');
                spark.setAttribute('width', String(size));
                spark.setAttribute('height', String(size));
                spark.setAttribute('x', String(-size / 2));
                spark.setAttribute('y', String(-size / 2));
                wrap.appendChild(spark);
                sparkles.appendChild(wrap);
                window.gsap.set(wrap, { x: point[0], y: point[1], transformOrigin: '0px 0px' });

                sparkTweens.push(window.gsap.fromTo(wrap, {
                    opacity: 0.12,
                    scale: 0.4,
                    rotation: -12
                }, {
                    opacity: 0.95,
                    scale: 1.18,
                    rotation: 12,
                    duration: 0.95 + index * 0.08,
                    delay: index * 0.12,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1
                }));
            });
        }

        function play() {
            if (timeline) timeline.kill();
            window.clearTimeout(fallbackTimer);
            clearSparkles();
            completed = false;
            restoreFillMask();
            concealFill();
            hideStrokes();
            name.classList.remove('is-written', 'is-js');
            void name.offsetWidth;

            if (reduce || !window.gsap || !strokes.length) {
                showFill();
                name.classList.add('is-written');
                if (pen) pen.setAttribute('opacity', '0');
                fallbackTimer = window.setTimeout(done, reduce ? 0 : 2800);
                return;
            }

            hideStrokes();
            inks.forEach((ink) => {
                ink.style.opacity = '1';
            });
            if (pen) pen.setAttribute('opacity', '0');
            showFill();
            name.classList.add('is-written', 'is-js');
            setRealtime(true);

            const ease = options.ease || 'none';
            const pace = options.pace || 360;
            const travelDur = Number(options.travel) || 0;
            const overlapOpt = Number(options.overlap);
            const strokeOverlap = Number.isFinite(overlapOpt) ? overlapOpt : 0.08;
            const sparkleGap = Number(options.sparkleGap) || 28;
            const quietSparkles = options.quietSparkles === true;
            const lengths = strokes.map((stroke) => Math.max(stroke.getTotalLength(), 1));
            const starts = strokes.map((stroke) => stroke.getPointAtLength(0));
            const ends = strokes.map((stroke, i) => stroke.getPointAtLength(lengths[i]));

            timeline = window.gsap.timeline({
                defaults: { ease },
                onComplete() {
                    setRealtime(false);
                    if (pen) window.gsap.to(pen, { attr: { opacity: 0 }, duration: 0.28, ease: 'power2.out' });
                    twinkleRest();
                    window.setTimeout(done, 280);
                }
            });

            strokes.forEach((stroke, index) => {
                const length = lengths[index];
                const duration = Math.max(dots.has(index) ? 0.1 : 0.28, length / pace);
                const state = { p: 0 };
                let lastEmit = 0;
                const position = index === 0
                    ? 0
                    : (dots.has(index) ? '>' : (travelDur ? '>' : `>-${strokeOverlap}`));

                if (travelDur && index > 0 && !dots.has(index) && pen) {
                    const from = ends[index - 1];
                    const to = starts[index];
                    const midX = (from.x + to.x) / 2;
                    const midY = Math.min(from.y, to.y) - 16;
                    const hop = { t: 0 };
                    timeline.to(hop, {
                        t: 1,
                        duration: travelDur,
                        ease: 'sine.inOut',
                        onStart() { pen.setAttribute('opacity', '0.35'); },
                        onUpdate() {
                            const t = hop.t;
                            const x = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * midX + t * t * to.x;
                            const y = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * midY + t * t * to.y;
                            window.gsap.set(pen, { attr: { transform: `translate(${x} ${y})` } });
                        }
                    }, `>-${Math.min(travelDur, 0.05)}`);
                } else if (dots.has(index) && pen) {
                    timeline.to(pen, { attr: { opacity: 0 }, duration: 0.05 }, '>-0.04');
                }

                timeline.to(state, {
                    p: 1,
                    duration,
                    ease,
                    onStart() {
                        state.p = 0;
                        lastEmit = 0;
                        stroke.style.strokeDashoffset = '1';
                        stroke.setAttribute('stroke-dashoffset', '1');
                        if (inks[index]) inks[index].style.strokeDashoffset = '1';
                        const start = placePen(stroke, 0, length);
                        if (pen) pen.setAttribute('opacity', '1');
                        if (start && !quietSparkles) emitSparkle(start.x, start.y, true);
                    },
                    onUpdate() {
                        const p = state.p;
                        const offset = String(1 - p);
                        stroke.style.strokeDashoffset = offset;
                        stroke.setAttribute('stroke-dashoffset', offset);
                        if (inks[index]) inks[index].style.strokeDashoffset = offset;
                        const point = placePen(stroke, p, length);
                        if (!point || quietSparkles) return;
                        const dist = p * length;
                        const gap = dots.has(index) ? 10 : sparkleGap;
                        if (dist - lastEmit >= gap) {
                            lastEmit = dist;
                            emitSparkle(point.x, point.y, dots.has(index));
                        }
                    },
                    onComplete() {
                        stroke.style.strokeDashoffset = '0';
                        stroke.setAttribute('stroke-dashoffset', '0');
                        if (inks[index]) inks[index].style.strokeDashoffset = '0';
                        const end = placePen(stroke, 1, length);
                        if (end && !quietSparkles) emitSparkle(end.x, end.y, true);
                    }
                }, position);
            });
        }

        function start() {
            if (reduce) {
                showFill();
                name.classList.add('is-written');
                done();
                return;
            }
            startTimer = window.setTimeout(play, options.delay ?? 280);
        }

        function destroy() {
            window.clearTimeout(startTimer);
            window.clearTimeout(fallbackTimer);
            if (timeline) timeline.kill();
            setRealtime(false);
            clearSparkles();
        }

        hideStrokes();
        if (!reduce) concealFill();

        if (options.startWhenReady === false) {
            start();
        } else if (document.body.classList.contains('is-ready')) {
            start();
        } else {
            const obs = new MutationObserver(() => {
                if (!document.body.classList.contains('is-ready')) return;
                obs.disconnect();
                start();
            });
            obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            window.setTimeout(() => {
                if (!name.classList.contains('is-written') && !document.getElementById('preloader')) start();
            }, 2800);
        }

        if (options.replayOnHomeClick) {
            document.querySelectorAll('a[href="#home"]').forEach((link) => {
                link.addEventListener('click', () => {
                    if (!reduce) play();
                });
            });
        }

        return { play, destroy };
    }

    window.NiciaName = { write };
})(window);
