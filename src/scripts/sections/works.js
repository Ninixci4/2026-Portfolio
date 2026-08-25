(function () {
    function initWorksFilters() {
        const chips = document.querySelectorAll('#works .filter-chip');
        if (!chips.length) return;
        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                chips.forEach((c) => c.classList.remove('is-active'));
                chip.classList.add('is-active');
                const filter = chip.dataset.filter;
                document.querySelectorAll('#works .work-card').forEach((card) => {
                    card.classList.toggle('is-hidden', !(filter === 'all' || card.dataset.category === filter));
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWorksFilters);
    } else {
        initWorksFilters();
    }
})();
