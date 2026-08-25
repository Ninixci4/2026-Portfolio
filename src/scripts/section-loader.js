(function () {
    const sectionNames = ['home', 'about', 'works', 'experience', 'certifications', 'contact'];

    async function loadSections() {
        await Promise.all(sectionNames.map(async (name) => {
            const slot = document.querySelector(`[data-section="${name}"]`)
                || document.querySelector(`[data-section="${name}"]`);
            if (!slot) return;
            const res = await fetch(`src/components/${name}.html`);
            if (!res.ok) {
                slot.innerHTML = `<section class="section"><div class="container"><p>Failed to load ${name} section.</p></div></section>`;
                return;
            }
            slot.innerHTML = await res.text();
        }));
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    async function bootstrap() {
        await loadSections();

        for (const name of sectionNames) {
            await loadScript(`src/scripts/sections/${name}.js`);
        }

        await loadScript('src/scripts/projects.js');
        await loadScript('src/scripts/phone-mockup.js');
        await loadScript('src/scripts/main.js');
        await loadScript('src/scripts/interactions.js');
        document.dispatchEvent(new Event('portfolio:ready'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();
