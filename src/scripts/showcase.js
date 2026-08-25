(function () {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));
    const project = (window.PORTFOLIO_PROJECTS || []).find((item) => item.id === id && item.category === 'mobile');

    if (!project) {
        location.replace('index.html#works');
        return;
    }

    const SCREEN_KITS = {
        circlo: [
            { label: 'Home', note: 'A quiet landing that puts your closest people first.', src: 'assets/img/circlo.svg' },
            { label: 'Circles', note: 'Private rooms for couples, friends, and family — each one isolated.', layout: 'grid' },
            { label: 'Feed', note: 'A shared stream that stays inside the circle, never the public web.', layout: 'list' },
            { label: 'Chat', note: 'Threads that feel small, warm, and easy to pick back up.', layout: 'chat' },
            { label: 'Calendar', note: 'Dates, plans, and reminders kept in one private timeline.', layout: 'list' },
            { label: 'Memories', note: 'Photos and notes that belong to the relationship, not the algorithm.', layout: 'grid' },
            { label: 'Create', note: 'A short path to start a circle without a long onboarding maze.', layout: 'form' },
            { label: 'Alerts', note: 'Only the pings that matter, with hierarchy instead of noise.', layout: 'list' },
            { label: 'Profile', note: 'A personal space that still respects the circle’s privacy rules.', layout: 'profile' },
            { label: 'Settings', note: 'Isolation, invites, and access — kept clear on purpose.', layout: 'stats' }
        ],
        'quiz-mania': [
            { label: 'Home', note: 'Jump into a round without a cluttered lobby.', src: 'assets/img/quiz-mania.svg' },
            { label: 'Categories', note: 'Topics laid out for thumbs, not a dense table of contents.', layout: 'grid' },
            { label: 'Play', note: 'One question, one beat, no extra chrome in the way.', layout: 'list' },
            { label: 'Timer', note: 'Pressure you can feel without panicking the layout.', layout: 'stats' },
            { label: 'Feedback', note: 'Instant right/wrong states that still look considered.', layout: 'chat' },
            { label: 'Results', note: 'A score screen that reads as a moment, not a spreadsheet.', layout: 'stats' },
            { label: 'Review', note: 'Walk back through answers with a calm, readable rhythm.', layout: 'list' },
            { label: 'Ranks', note: 'A leaderboard that stays playful instead of noisy.', layout: 'list' },
            { label: 'Profile', note: 'Streaks and history without turning into a dashboard dump.', layout: 'profile' },
            { label: 'Settings', note: 'Sound, difficulty, and account — short and obvious.', layout: 'form' }
        ],
        'bidaboss-app': [
            { label: 'Home', note: 'A shoppable first screen that still feels like Bidaboss.', src: 'assets/img/bidaboss_2.png' },
            { label: 'Catalog', note: 'Product browsing sized for a thumb, not a desktop grid.', src: 'assets/img/Bidaboss.png' },
            { label: 'Search', note: 'Find an item fast, then get out of the way.', layout: 'form' },
            { label: 'Product', note: 'Details, price, and action stacked in a clear order.', layout: 'list' },
            { label: 'Cart', note: 'A compact checkout path that doesn’t feel like a form maze.', layout: 'list' },
            { label: 'Orders', note: 'Status you can scan in a second on the go.', layout: 'stats' },
            { label: 'Tracking', note: 'Where the order is, without burying it in account menus.', layout: 'list' },
            { label: 'Saved', note: 'A quieter shelf for later, still on-brand.', layout: 'grid' },
            { label: 'Account', note: 'Profile and preferences with the same visual language as web.', layout: 'profile' },
            { label: 'Support', note: 'A short line back to help when something stalls.', layout: 'chat' }
        ]
    };

    function uiMarkup(screen) {
        if (screen.src) {
            const isVid = /\.(mp4|webm|ogg)$/i.test(screen.src);
            return isVid
                ? `<video src="${screen.src}" muted loop playsinline></video>`
                : `<img src="${screen.src}" alt="${project.title} — ${screen.label}">`;
        }

        const rows = {
            list: `<div class="ui-list"><div class="ui-row"><strong>Today</strong><em>3 updates</em></div><div class="ui-row"><strong>Pinned</strong><em>Keep close</em></div><div class="ui-row"><strong>Later</strong><em>Quiet queue</em></div><div class="ui-row"><strong>Archive</strong><em>Clear history</em></div></div>`,
            grid: `<div class="ui-grid"><div class="ui-cell"></div><div class="ui-cell"></div><div class="ui-cell"></div><div class="ui-cell"></div></div>`,
            chat: `<div class="ui-chat"><div class="ui-bubble them">Are we still on for later?</div><div class="ui-bubble me">Yes — I’ll send the note.</div><div class="ui-bubble them">Perfect. Keeping it small.</div></div>`,
            stats: `<div class="ui-stats"><div class="ui-stat"><strong>128</strong><span>Active</span></div><div class="ui-stat"><strong>04</strong><span>New</span></div><div class="ui-stat"><strong>96%</strong><span>Done</span></div><div class="ui-stat"><strong>12</strong><span>Saved</span></div></div>`,
            form: `<div class="ui-list"><div class="ui-row"><strong>Name</strong><em>Short field</em></div><div class="ui-row"><strong>Invite</strong><em>One link</em></div><div class="ui-row"><strong>Privacy</strong><em>Circle only</em></div></div>`,
            profile: `<div class="ui-list"><div class="ui-row"><strong>${project.title}</strong><em>Signed in</em></div><div class="ui-row"><strong>Preferences</strong><em>Quiet mode</em></div><div class="ui-row"><strong>Security</strong><em>Private by default</em></div></div>`
        };

        return `
            <div class="ui-screen">
                <div class="ui-status"><span>9:41</span><span>LTE</span></div>
                <div class="ui-head"><span>${screen.label}</span><span>···</span></div>
                <div class="ui-chip-row"><span class="ui-pill">Live</span><span class="ui-pill">New</span><span class="ui-pill">Now</span></div>
                ${rows[screen.layout] || rows.list}
                <button class="ui-cta" type="button" tabindex="-1">Continue</button>
            </div>
        `;
    }

    document.title = `${project.title} — Nicia`;
    document.getElementById('showKicker').textContent = project.type;
    document.getElementById('showTitle').textContent = project.title;
    document.getElementById('showLead').textContent = project.description;
    document.getElementById('showTech').innerHTML = project.techStack.map((tech) => `<span>${tech}</span>`).join('');

    const shots = project.screenshots && project.screenshots.length ? project.screenshots : project.gallery;
    const phoneMedia = project.video ? [project.video, ...shots] : shots;
    const phoneMount = document.getElementById('showPhone');
    if (window.PhoneMockup) {
        phoneMount.innerHTML = window.PhoneMockup.markup(phoneMedia, project.title);
        window.PhoneMockup.mount(phoneMount);
        const video = phoneMount.querySelector('video');
        if (video) {
            video.addEventListener('error', () => {
                const fallback = shots[0];
                if (!fallback) return;
                const img = document.createElement('img');
                img.src = fallback;
                img.className = 'is-active';
                video.replaceWith(img);
            });
            video.play().catch(() => {});
        }
    }

    let deck = (SCREEN_KITS[project.slug] || []).slice(0, 10);
    if (!deck.length) {
        const base = shots.length ? shots : [project.image];
        deck = Array.from({ length: 10 }, (_, i) => ({
            label: `Screen ${i + 1}`,
            note: project.description,
            src: base[i % base.length]
        }));
    }
    const track = document.getElementById('shotTrack');
    document.getElementById('shotTotal').textContent = String(deck.length).padStart(2, '0');
    track.innerHTML = deck.map((screen, i) => `
        <figure class="flip-card" data-index="${i}" style="z-index:${20 - i}">
            <div class="flip-inner">
                <div class="flip-face flip-front">
                    <div class="shot-bezel">
                        <span class="shot-notch"></span>
                        <div class="shot-screen">${uiMarkup(screen)}</div>
                    </div>
                </div>
                <div class="flip-face flip-back">
                    <span>${String(i + 1).padStart(2, '0')}</span>
                    <h3>${screen.label}</h3>
                    <p>${screen.note}</p>
                </div>
            </div>
        </figure>
    `).join('');

    const cards = [...track.querySelectorAll('.flip-card')];
    const indexEl = document.getElementById('shotIndex');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setDeck(progress) {
        const p = progress * (cards.length - 1);
        const active = Math.round(p);
        cards.forEach((card, i) => {
            const d = i - p;
            const abs = Math.abs(d);
            const x = d * 168;
            const rotY = Math.max(-68, Math.min(68, d * 42));
            const z = 160 - abs * 120;
            const scale = 1 - Math.min(abs, 2) * 0.1;
            const opacity = 1 - Math.min(abs, 2.2) * 0.22;
            card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${abs * 6}px, ${z}px) rotateY(${rotY}deg) scale(${scale})`;
            card.style.opacity = String(Math.max(0.18, opacity));
            card.style.filter = `blur(${Math.max(0, abs - 0.85) * 3.2}px)`;
            card.style.zIndex = String(100 - Math.round(abs * 12));
            card.classList.toggle('is-focus', i === active);
            if (i !== active) card.classList.remove('is-turned');
        });
        if (indexEl) indexEl.textContent = String(active + 1).padStart(2, '0');
    }

    setDeck(0);

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            cards.forEach((other) => {
                if (other !== card) other.classList.remove('is-turned');
            });
            card.classList.toggle('is-turned');
        });
    });

    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const theme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', theme);
    themeToggle?.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    const header = document.querySelector('.header');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle?.addEventListener('click', () => {
        const open = header.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            header.classList.remove('nav-open');
            navToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    const back = document.getElementById('navBack');
    back?.addEventListener('click', (event) => {
        const fromSite = document.referrer.includes(location.host);
        if (fromSite && history.length > 1) {
            event.preventDefault();
            history.back();
        }
    });

    document.body.classList.add('is-ready', 'showcase-page');

    if (window.gsap && window.ScrollTrigger && !reduce) {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.create({
            trigger: '#showReel',
            start: 'top top',
            end: () => `+=${Math.max(window.innerHeight * 1.2, cards.length * window.innerHeight * 0.62)}`,
            pin: '.showcase-sticky',
            scrub: 0.72,
            anticipatePin: 1,
            onUpdate: (self) => setDeck(self.progress)
        });
    } else {
        track.style.overflowX = 'auto';
        track.style.position = 'relative';
        track.style.display = 'flex';
        track.style.gap = '1rem';
        track.style.padding = '0 8vw';
        cards.forEach((card) => {
            card.style.position = 'relative';
            card.style.top = 'auto';
            card.style.left = 'auto';
            card.style.transform = 'none';
            card.style.filter = 'none';
            card.style.opacity = '1';
        });
    }

    if (window.Lenis) {
        const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        lenis.on('scroll', () => window.ScrollTrigger && ScrollTrigger.update());
    }

    const bar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
    }, { passive: true });
})();
