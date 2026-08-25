(function () {
    function initCertHover() {
        document.querySelectorAll('#certifications .certification-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
                card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCertHover);
    } else {
        initCertHover();
    }
})();
