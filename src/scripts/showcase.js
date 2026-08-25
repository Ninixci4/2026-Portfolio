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
            { label: 'Home', note: 'Your people. Your circle — a private home for every relationship.', src: 'assets/img/circlo_1.jpg' },
            { label: 'Circles', note: 'Separate spaces for couples, family, or friends. Nothing leaks between them.', src: 'assets/img/circlo_2.jpg' },
            { label: 'Feed', note: 'A private timeline of photos, notes, and moments — members only.', layout: 'list' },
            { label: 'Chat', note: 'Built-in messaging with images, voice notes, and files inside the Circle.', layout: 'chat' },
            { label: 'Calendar', note: 'Shared dates, hangouts, and reminders for the people in that Circle.', layout: 'list' },
            { label: 'Memories', note: 'A shared gallery and journal so the story of the relationship stays together.', layout: 'grid' },
            { label: 'Tasks', note: 'Lists, chores, and plans you actually finish together.', layout: 'form' },
            { label: 'Events', note: 'Plan trips, dinners, and milestones without another group chat.', layout: 'list' },
            { label: 'Profile', note: 'Switch Circles anytime. Each one keeps its own memories and members.', layout: 'profile' },
            { label: 'Settings', note: 'Invite, leave, archive, and keep the space private by default.', layout: 'stats' }
        ],
        'quiz-mania': [
            { label: 'Home', note: 'Play, flashcards, and leaderboards — a simple start for reviewing.', src: 'assets/img/quizmania_1.jpg' },
            { label: 'Play', note: 'Pick a category and jump into a timed multiple-choice round.', src: 'assets/img/quizmania_2.jpg' },
            { label: 'Question', note: 'One question at a time, with clear choices and a timer.', src: 'assets/img/quizmania_3.jpg' },
            { label: 'Categories', note: 'General knowledge topics laid out so you can review what you need.', src: 'assets/img/quizmania_4.jpg' },
            { label: 'Flashcards', note: 'Add your own cards and build a set for an upcoming test.', src: 'assets/img/quizmania_5.jpg' },
            { label: 'Create set', note: 'Write your own questions and answers for a reviewer partner session.', src: 'assets/img/quizmania_6.jpg' },
            { label: 'Answer', note: 'Flip the card, check the answer, then move to the next one.', src: 'assets/img/quizmania_7.jpg' }
        ],
        'bidaboss-app': [
            { label: 'Splash', note: 'The BidaBoss Inc. welcome screen I designed during my internship.', src: 'assets/img/bidaapp_1.jpg' },
            { label: 'Home', note: 'A shoppable first screen that still feels like BidaBoss Inc.', src: 'assets/img/bidaapp_2.jpg' },
            { label: 'Catalog', note: 'Product browsing sized for a thumb, not a desktop grid.', src: 'assets/img/bidaapp_3.jpg' },
            { label: 'Search', note: 'Find an item fast, then get out of the way.', src: 'assets/img/bidaapp_4.jpg' },
            { label: 'Product', note: 'Details, price, and action stacked in a clear order.', src: 'assets/img/bidaapp_5.jpg' },
            { label: 'Cart', note: 'A compact checkout path that doesn’t feel like a form maze.', src: 'assets/img/bidaapp_6.jpg' },
            { label: 'Orders', note: 'Status you can scan in a second on the go.', src: 'assets/img/bidaapp_7.jpg' },
            { label: 'Pickup', note: 'Order states like for approval, pickup, and delivery.', src: 'assets/img/bidaapp_8.jpg' },
            { label: 'Tracking', note: 'Where the order is, without burying it in account menus.', src: 'assets/img/bidaapp_9.jpg' },
            { label: 'Account', note: 'Profile and preferences with the same visual language as web.', src: 'assets/img/bidaapp_10.jpg' },
            { label: 'Empty state', note: 'Clear empty screens so the flow still feels designed.', src: 'assets/img/bidaapp_11.jpg' }
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
    document.getElementById('showKicker').textContent = [project.kind, project.type, project.status]
        .filter(Boolean)
        .join(' · ');
    document.getElementById('showTitle').textContent = project.title;
    document.getElementById('showLead').textContent = project.description;
    document.getElementById('showTech').innerHTML = project.techStack.map((tech) => `<span>${tech}</span>`).join('');

    const shots = project.screenshots && project.screenshots.length ? project.screenshots : project.gallery;
    const phoneMedia = shots.length ? shots : (project.video ? [project.video] : [project.image]);
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
    const theme = localStorage.getItem('theme') || 'dark';
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
