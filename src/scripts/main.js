(function () {
    const projects = window.PORTFOLIO_PROJECTS || [];
    const _archived = [
        {
            id: 1,
            title: 'BidaBoss Inc.',
            description: 'A complete redesign of the BidaBoss Inc. e-commerce platform focused on improving user experience, visual consistency, and overall usability for all stakeholders, featuring a cleaner interface, enhanced navigation, and a more streamlined flow.',
            type: 'Website',
            category: 'web',
            image: 'assets/img/Bidaboss.png',
            gallery: ['assets/img/bidaboss_1.png', 'assets/img/bidaboss_2.png'],
            techStack: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
            keywords: ['Web', 'E-commerce', 'Responsive'],
            liveSite: 'https://bidaboss.ph'
        },
        {
            id: 2,
            title: 'Kings Skincare Website',
            description: 'A luxurious, premium-style skincare website designed specifically for men, featuring a clean and sophisticated layout that highlights product quality, ingredients, and brand identity while delivering a smooth and refined browsing experience.',
            type: 'One-Page Website',
            category: 'web',
            image: 'assets/img/kings.png',
            gallery: ['assets/img/kings_1.png'],
            techStack: ['HTML', 'CSS', 'JavaScript'],
            keywords: ['Luxurious', 'Premium', 'Gifting'],
            liveSite: 'https://stg-single-page-checkout.netlify.app/kings-skincare/'
        },
        {
            id: 3,
            title: 'iHome Speaker Website',
            description: 'A modern one-page product website showcasing a Bluetooth speaker with a focus on clean design, smooth user experience, and clear product highlights such as wireless connectivity, portability, and high-quality sound.',
            type: 'One-Page Website',
            category: 'web',
            image: 'assets/img/ihomes.png',
            gallery: ['assets/img/ihomes_1.png'],
            techStack: ['HTML', 'CSS', 'JavaScript'],
            keywords: ['Modern', 'Sleek', 'Immersive'],
            liveSite: 'https://stg-single-page-checkout.netlify.app/ihome-speaker/'
        },
        {
            id: 4,
            title: 'Circlo',
            description: 'This project is still in progress. Circlo is a private social app for real relationships — not a public feed. Users create isolated Circles for couples, family, or friends, then share memories, chat, plan events, keep calendars, and work on goals together inside that space only. Each Circle stays fully separate, with its own gallery, notes, tasks, and activities. I built the Flutter app and Laravel API foundation so every relationship can have its own calm, private home.',
            type: 'Mobile App',
            category: 'mobile',
            status: 'In progress',
            image: 'assets/img/circlo_cover.png',
            gallery: ['assets/img/circlo_cover.png', 'assets/img/circlo_1.jpg', 'assets/img/circlo_2.jpg'],
            techStack: ['Flutter', 'Dart', 'Riverpod', 'Laravel', 'MySQL'],
            keywords: ['Mobile', 'Private Circles', 'Relationships'],
            liveSite: 'https://github.com/Ninixci4/Circlo',
            screenshots: ['assets/img/circlo_1.jpg', 'assets/img/circlo_2.jpg']
        },
        {
            id: 5,
            title: 'BidaBoss Supplier Management System',
            description: 'As Lead UI/UX Designer, I redesigned this existing supplier system at BidaBoss Inc. It supports vendor onboarding, product listings, inventory, purchase orders, and status tracking — designed to keep supplier operations clear, consistent, and easier to manage alongside the main platform.',
            type: 'Web App',
            category: 'web',
            image: 'assets/img/Supplier_1.png',
            gallery: ['assets/img/Supplier_1.png', 'assets/img/Supplier_2.png', 'assets/img/Supplier_3.png', 'assets/img/Supplier_4.png', 'assets/img/Supplier_5.png', 'assets/img/Supplier_6.png'],
            techStack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
            keywords: ['Suppliers', 'Operations', 'Dashboard'],
            liveSite: '#'
        },
        {
            id: 6,
            title: 'Warehouse Management System',
            description: 'As Lead UI/UX Designer, I redesigned this existing warehouse system at BidaBoss Inc. It is the core operations platform for catalog, orders, customers, and internal workflows, with a cleaner hierarchy, stronger consistency, and faster day-to-day use for admins and staff.',
            type: 'Web App',
            category: 'web',
            image: 'assets/img/main_1.png',
            gallery: ['assets/img/main_1.png', 'assets/img/main_2.png'],
            techStack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
            keywords: ['Operations', 'E-commerce', 'Admin'],
            liveSite: '#'
        },
        {
            id: 7,
            title: 'Quiz Mania',
            description: 'A project we built as college students to make reviewing easier. Take timed multiple-choice quizzes across a variety of general knowledge categories, or use it as a reviewer for upcoming tests by adding your own flashcards and creating your own question-and-answer sets. It is also a good reviewer partner.',
            type: 'Mobile App',
            category: 'mobile',
            image: 'assets/img/quiz_cover.png',
            gallery: ['assets/img/quiz_cover.png', 'assets/img/quizmania_1.jpg', 'assets/img/quizmania_2.jpg', 'assets/img/quizmania_3.jpg', 'assets/img/quizmania_4.jpg', 'assets/img/quizmania_5.jpg', 'assets/img/quizmania_6.jpg', 'assets/img/quizmania_7.jpg'],
            techStack: ['Flutter', 'Dart', 'Firebase'],
            keywords: ['Mobile', 'Quiz', 'Reviewer'],
            liveSite: '#',
            screenshots: ['assets/img/quizmania_1.jpg', 'assets/img/quizmania_2.jpg', 'assets/img/quizmania_3.jpg', 'assets/img/quizmania_4.jpg', 'assets/img/quizmania_5.jpg', 'assets/img/quizmania_6.jpg', 'assets/img/quizmania_7.jpg']
        },
        {
            id: 8,
            title: 'BidaBoss Inc. Mobile App',
            description: 'I designed this mobile app while I was still an intern at BidaBoss Inc. It lets users browse products, manage orders, and stay connected to the platform on the go. I worked on the UI/UX and front-end so shopping and order tracking feel consistent with the web experience, just sized for the phone. You can download it on the Google Play Store — search “bidaboss.”',
            type: 'Mobile App',
            category: 'mobile',
            image: 'assets/img/bidabossmobile_cover.png',
            gallery: ['assets/img/bidabossmobile_cover.png', 'assets/img/bidaboss_2.png', 'assets/img/Bidaboss.png'],
            techStack: ['Flutter', 'Dart', 'REST API'],
            keywords: ['Mobile', 'E-commerce', 'Orders'],
            liveSite: '#',
            screenshots: ['assets/img/bidaboss_2.png', 'assets/img/Bidaboss.png']
        }
    ];

    const certifications = [
        {
            id: 1,
            category: 'UI/UX',
            title: 'UX+ Conference 2025',
            organization: 'UX+ Team - conference@uxpl.us',
            date: '2025',
            location: 'SMX Convention Center, Pasay',
            icon: 'fas fa-palette',
            certificateImage: 'assets/img/UX_Certificate.png'
        },
        {
            id: 2,
            category: 'Cloud',
            title: 'She++ Masterclass on Alibaba Cloud System',
            organization: 'phildev | Wells Fargo',
            date: '2025',
            location: 'Pamantasan ng Lungsod ng Pasig, Pasig City',
            icon: 'fas fa-cloud',
            certificateImage: 'assets/img/Alibaba_Certificate.png'
        },
        {
            id: 3,
            category: 'Leadership | Mindset',
            title: 'She++ Workshop on Leadership and Technopreneurial Mindset',
            organization: 'phildev | Wells Fargo',
            date: '2025',
            location: 'Pamantasan ng Lungsod ng Pasig, Pasig City',
            icon: 'fas fa-laptop-code',
            certificateImage: 'assets/img/Leadership_Certificate.png'
        },
        {
            id: 4,
            category: 'Design Thinking',
            title: 'She++ Workshop on Design Thinking',
            organization: 'phildev | Wells Fargo',
            date: '2025',
            location: 'Pamantasan ng Lungsod ng Pasig, Pasig City',
            icon: 'fas fa-lightbulb',
            certificateImage: 'assets/img/Design_Certificate.png'
        },
        {
            id: 5,
            category: 'Technopreneurship',
            title: 'She++ Workshop on Strategic Foresight and Intro to Technopreneurship',
            organization: 'phildev | Wells Fargo',
            date: '2025',
            location: 'Pamantasan ng Lungsod ng Pasig, Pasig City',
            icon: 'fas fa-code',
            certificateImage: 'assets/img/Strategic_Certificate.png'
        }
    ];

    function initThemeAndNav() {
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        const header = document.querySelector('.header');
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        const currentTheme = localStorage.getItem('theme') || 'light';

        html.setAttribute('data-theme', currentTheme);

        themeToggle?.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });

        navToggle?.addEventListener('click', () => {
            const open = header.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', String(open));
        });

        navLinks?.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 980) {
                    header.classList.remove('nav-open');
                    navToggle?.setAttribute('aria-expanded', 'false');
                }
            });
        });

        const sections = document.querySelectorAll('.section');
        const onScroll = () => {
            const pos = window.scrollY + 120;
            sections.forEach((section) => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                if (pos >= top && pos < bottom) {
                    document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
                    document.querySelector(`.nav-link[href="#${section.id}"]`)?.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    function renderProjects() {
        const grid = document.getElementById('worksGrid');
        if (!grid) return;
        grid.innerHTML = projects.map((project, i) => `
            <article class="work-card" data-category="${project.category}" style="--i:${i}">
                <span class="work-index">${String(i + 1).padStart(2, '0')}</span>
                <div class="work-media">
                    ${project.category === 'web' ? `<img class="work-media-bg" src="${project.image}" alt="" aria-hidden="true">` : ''}
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="work-meta">
                    <span class="work-type">${[project.kind, project.type, project.status].filter(Boolean).join(' · ')}</span>
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="work-keywords">${project.keywords.map((keyword) => `<span>${keyword}</span>`).join('')}</div>
                </div>
            </article>
        `).join('');

        grid.querySelectorAll('.work-card').forEach((card, i) => {
            card.addEventListener('click', () => {
                const project = projects[i];
                if (project.category === 'mobile') {
                    window.location.href = `showcase.html?id=${project.id}`;
                    return;
                }
                openProjectModal(project.id);
            });
        });
    }

    function bindGalleryCarousel(root) {
        const carousel = root.querySelector('.gallery-carousel');
        if (!carousel) return;
        const images = [...carousel.querySelectorAll('img')];
        const dots = [...carousel.querySelectorAll('.gallery-dot')];
        const show = (index) => {
            const next = (index + images.length) % images.length;
            carousel.dataset.index = String(next);
            images.forEach((img, i) => img.classList.toggle('is-active', i === next));
            dots.forEach((dot, i) => dot.classList.toggle('is-active', i === next));
        };
        carousel.querySelector('.gallery-nav.prev')?.addEventListener('click', (e) => {
            e.stopPropagation();
            show(Number(carousel.dataset.index) - 1);
        });
        carousel.querySelector('.gallery-nav.next')?.addEventListener('click', (e) => {
            e.stopPropagation();
            show(Number(carousel.dataset.index) + 1);
        });
        dots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                show(Number(dot.dataset.index));
            });
        });
        images.forEach((img) => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                window.PhoneMockup?.preview(img);
            });
        });
    }

    function openProjectModal(id) {
        const project = projects.find((p) => p.id === id);
        if (!project) return;
        const modal = document.getElementById('projectModal');
        const kicker = document.getElementById('modalKicker');
        if (kicker) kicker.textContent = project.kind || 'Professional Project';
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalDescription').textContent = project.description;
        document.getElementById('modalTechStack').innerHTML = project.techStack.map((tech) => `<span class="tech-tag">${tech}</span>`).join('');
        const gallery = document.getElementById('modalGallery');
        const isMobile = project.category === 'mobile';
        modal.classList.toggle('is-mobile-view', isMobile);
        if (isMobile && window.PhoneMockup) {
            const shots = project.screenshots && project.screenshots.length ? project.screenshots : project.gallery;
            gallery.innerHTML = window.PhoneMockup.markup(shots, project.title);
        } else {
            modal.classList.remove('is-mobile-view');
            const images = project.gallery && project.gallery.length ? project.gallery : [project.image];
            if (images.length > 1) {
                gallery.innerHTML = `
                    <div class="gallery-carousel" data-index="0">
                        ${images.map((src, i) => `<img src="${src}" alt="${project.title} ${i + 1}" class="${i === 0 ? 'is-active' : ''}">`).join('')}
                        <button type="button" class="gallery-nav prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
                        <button type="button" class="gallery-nav next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
                        <div class="gallery-dots">${images.map((_, i) => `<button type="button" class="gallery-dot${i === 0 ? ' is-active' : ''}" data-index="${i}" aria-label="Image ${i + 1}"></button>`).join('')}</div>
                    </div>
                `;
                bindGalleryCarousel(gallery);
            } else {
                gallery.innerHTML = `<img src="${images[0]}" alt="${project.title}" class="gallery-preview-image">`;
                gallery.querySelector('img')?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.PhoneMockup?.preview(e.currentTarget);
                });
            }
        }
        const live = document.getElementById('viewLiveSite');
        if (isMobile) {
            live.textContent = 'View more';
            live.href = `showcase.html?id=${project.id}`;
            live.target = '_self';
            live.rel = 'noopener';
            live.style.display = '';
        } else if (project.liveSite && project.liveSite !== '#') {
            live.textContent = 'View live site';
            live.href = project.liveSite.trim();
            live.target = '_blank';
            live.rel = 'noopener';
            live.style.display = '';
        } else {
            live.style.display = 'none';
        }
        modal.hidden = false;
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        if (isMobile) window.PhoneMockup?.mount(gallery);
    }

    function closeProjectModal() {
        const modal = document.getElementById('projectModal');
        modal.classList.remove('is-open', 'is-mobile-view');
        modal.hidden = true;
        document.body.style.overflow = '';
        window.PhoneMockup?.closePreview();
    }

    function initProjectModal() {
        document.getElementById('closeModal')?.addEventListener('click', closeProjectModal);
        document.getElementById('closeProject')?.addEventListener('click', closeProjectModal);
        document.getElementById('projectModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'projectModal') closeProjectModal();
        });
        window.openProjectModal = openProjectModal;
    }

    function initFilters() {
        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                chips.forEach((c) => c.classList.remove('is-active'));
                chip.classList.add('is-active');
                const filter = chip.dataset.filter;
                document.querySelectorAll('.work-card').forEach((card) => {
                    const show = filter === 'all' || card.dataset.category === filter;
                    card.classList.toggle('is-hidden', !show);
                });
            });
        });
    }

    function renderCertifications() {
        const grid = document.getElementById('certificationsGrid');
        if (!grid) return;
        grid.innerHTML = certifications.map((cert) => `
            <article class="certification-card" data-tilt>
                <i class="${cert.icon} cert-icon"></i>
                <span class="cert-category">${cert.category}</span>
                <h3 class="cert-title">${cert.title}</h3>
                <p class="cert-organization">${cert.organization}</p>
                <p class="cert-date">${cert.date}</p>
                <p class="cert-location">${cert.location}</p>
            </article>
        `).join('');
        grid.querySelectorAll('.certification-card').forEach((card, i) => {
            card.addEventListener('click', () => openCertificateModal(certifications[i].id));
        });
    }

    function openCertificateModal(id) {
        const cert = certifications.find((c) => c.id === id);
        if (!cert) return;
        const modal = document.getElementById('certificateModal');
        const image = document.getElementById('certificateImage');
        const loader = document.getElementById('certificateLoader');
        if (image) {
            image.style.display = 'none';
            if (loader) {
                loader.hidden = false;
                loader.classList.add('is-visible');
            }
            image.onload = () => {
                image.style.display = '';
                if (loader) {
                    loader.hidden = true;
                    loader.classList.remove('is-visible');
                }
            };
            image.onerror = () => {
                image.style.display = '';
                if (loader) {
                    loader.hidden = true;
                    loader.classList.remove('is-visible');
                }
            };
            image.alt = cert.title;
            image.removeAttribute('src');
            image.src = cert.certificateImage;
            if (image.complete && image.naturalWidth) {
                image.style.display = '';
                if (loader) {
                    loader.hidden = true;
                    loader.classList.remove('is-visible');
                }
            }
        }
        modal.hidden = false;
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeCertificateModal() {
        const modal = document.getElementById('certificateModal');
        modal.classList.remove('is-open');
        modal.hidden = true;
        document.body.style.overflow = '';
    }

    function initCertificateModal() {
        document.getElementById('closeCertificate')?.addEventListener('click', closeCertificateModal);
        document.getElementById('certificateModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'certificateModal') closeCertificateModal();
        });
        window.openCertificateModal = openCertificateModal;
    }

    function validateField(id, errorId, fn, message) {
        const field = document.getElementById(id);
        const error = document.getElementById(errorId);
        if (!field || !error) return false;
        const value = field.value.trim();
        if (!fn(value)) {
            field.classList.add('error');
            error.textContent = message;
            error.classList.add('show');
            return false;
        }
        field.classList.remove('error');
        error.textContent = '';
        error.classList.remove('show');
        return true;
    }

    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        const isName = (v) => v.length >= 2 && /^[a-zA-Z\s]+$/.test(v);
        const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        const isSubject = (v) => v.length === 0 || v.length >= 3;
        const isMessage = (v) => v.length >= 10;

        const confirmation = document.getElementById('confirmationModal');
        const openConfirm = () => {
            confirmation.hidden = false;
            confirmation.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        };
        const closeConfirm = () => {
            confirmation.classList.remove('is-open');
            confirmation.hidden = true;
            document.body.style.overflow = '';
        };
        document.getElementById('closeConfirmation')?.addEventListener('click', closeConfirm);
        confirmation?.addEventListener('click', (e) => {
            if (e.target === confirmation) closeConfirm();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const ok = [
                validateField('fullName', 'fullNameError', isName, 'Enter at least 2 letters.'),
                validateField('email', 'emailError', isEmail, 'Enter a valid email.'),
                validateField('subject', 'subjectError', isSubject, 'Subject must be at least 3 characters if provided.'),
                validateField('message', 'messageError', isMessage, 'Message must be at least 10 characters.')
            ].every(Boolean);
            if (!ok) return;

            const submit = form.querySelector('button[type="submit"]');
            const submitText = submit.querySelector('span');
            const submitIcon = submit.querySelector('i');
            const fullName = document.getElementById('fullName').value.trim();
            const payload = {
                fullName,
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            submitText.textContent = 'Sending...';
            submit.disabled = true;
            submitIcon.className = 'fas fa-spinner fa-spin';

            const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
            const hasWeb3 = /^[0-9a-f-]{36}$/i.test((WEB3FORMS_KEY || '').trim()) && !WEB3FORMS_KEY.startsWith('YOUR_');
            const canFirestore = Boolean(window.InquiryService?.saveContactToFirestore !== false && window.InquiryService?.getDb?.() && window.InquiryService?.saveInquiry);

            if (!hasWeb3 && !canFirestore) {
                console.warn('[Contact form] Not configured.');
                submitText.textContent = 'Send message';
                submitIcon.className = 'fas fa-paper-plane';
                submit.disabled = false;
                return;
            }

            const tasks = [];
            if (canFirestore) tasks.push({ type: 'db', promise: window.InquiryService.saveInquiry(payload) });
            if (hasWeb3) {
                const data = new FormData();
                data.append('access_key', WEB3FORMS_KEY);
                data.append('from_name', fullName);
                data.append('email', payload.email);
                data.append('subject', payload.subject || 'No subject');
                data.append('message', payload.message);
                tasks.push({
                    type: 'email',
                    promise: fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
                        .then((r) => r.json())
                        .then((result) => {
                            if (!result?.success) throw new Error(result?.message || 'Web3Forms failed');
                            return result;
                        })
                });
            }

            Promise.allSettled(tasks.map((t) => t.promise)).then((results) => {
                submitText.textContent = 'Send message';
                submitIcon.className = 'fas fa-paper-plane';
                submit.disabled = false;
                const okCount = results.filter((r) => r.status === 'fulfilled').length;
                if (okCount) {
                    form.reset();
                    openConfirm();
                }
            });
        });
    }

    function init() {
        initThemeAndNav();
        renderProjects();
        initProjectModal();
        initFilters();
        renderCertifications();
        initCertificateModal();
        initContactForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
