(function () {
    function initHangingId() {
        const card = document.getElementById('idCard');
        const path = document.getElementById('lacePath');
        const stage = document.querySelector('.id-stage');
        if (!card || !path || !stage) return;

        const restY = 18;
        const state = { x: 10, y: restY, rot: -6, vx: 0.35, vy: 0, vr: 0 };
        let dragging = false;
        let grabX = 0;
        let grabY = 0;
        let lastX = 0;
        let lastY = 0;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const coarse = window.matchMedia('(pointer: coarse)').matches;

        function apply() {
            card.style.transform = `translate(calc(-50% + ${state.x}px), ${state.y}px) rotate(${state.rot}deg)`;
            const endX = 160 + state.x * 0.72;
            const endY = 248 + state.y * 0.55;
            const midX = 160 + state.x * 0.38;
            const midY = 108 + Math.max(0, state.y) * 0.28;
            path.setAttribute('d', `M160 8 Q ${midX} ${midY} ${endX} ${endY}`);
        }

        function onPointerDown(e) {
            dragging = true;
            card.classList.add('is-dragging');
            card.setPointerCapture?.(e.pointerId);
            const rect = card.getBoundingClientRect();
            grabX = e.clientX - (rect.left + rect.width / 2);
            grabY = e.clientY - rect.top;
            lastX = e.clientX;
            lastY = e.clientY;
        }

        function onPointerMove(e) {
            if (!dragging) return;
            const stageRect = stage.getBoundingClientRect();
            const originX = stageRect.left + stageRect.width / 2;
            const originY = stageRect.top + 150;
            let dx = e.clientX - originX - grabX;
            let dy = e.clientY - originY - grabY;
            dx = Math.max(-220, Math.min(220, dx));
            dy = Math.max(-24, Math.min(460, dy));
            state.vx = e.clientX - lastX;
            state.vy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            state.x = dx;
            state.y = dy;
            state.rot = Math.max(-32, Math.min(28, dx * 0.16));
            apply();
        }

        function onPointerUp() {
            dragging = false;
            card.classList.remove('is-dragging');
        }

        function tick(now) {
            if (!dragging && !reduce && !coarse) {
                const t = now / 1000;
                const sway = Math.sin(t * 1.35) * 0.22 + Math.sin(t * 0.62) * 0.12;
                const bounce = Math.sin(t * 2.15) * 0.09;
                state.vx += -state.x * 0.018 + sway;
                state.vy += -(state.y - restY) * 0.045 + bounce;
                state.vr += -state.rot * 0.03 + state.x * 0.0014;
                state.vx *= 0.978;
                state.vy *= 0.94;
                state.vr *= 0.96;
                state.x += state.vx;
                state.y += state.vy;
                state.rot += state.vr + state.x * 0.012;
                state.rot = Math.max(-28, Math.min(28, state.rot));
            } else if (!dragging) {
                state.x += (0 - state.x) * 0.12;
                state.y += (restY - state.y) * 0.12;
                state.rot += (0 - state.rot) * 0.12;
            }
            apply();
            requestAnimationFrame(tick);
        }

        card.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        apply();
        requestAnimationFrame(tick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHangingId);
    } else {
        initHangingId();
    }
})();
