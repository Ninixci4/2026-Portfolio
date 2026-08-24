function onDomReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// ========== Theme Toggle ==========
onDomReady(function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    const header = document.querySelector('.header');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    if (navToggle && header && navLinks) {
        navToggle.addEventListener('click', function() {
            const isOpen = header.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 968) {
                    header.classList.remove('nav-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 968) {
                header.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// ========== Navigation Active State ==========
$(document).ready(function() {
    // Update active nav link on scroll
    $(window).on('scroll', function() {
        const scrollPos = $(window).scrollTop() + 100;
        
        $('.section').each(function() {
            const top = $(this).offset().top;
            const bottom = top + $(this).outerHeight();
            const id = $(this).attr('id');
            
            if (scrollPos >= top && scrollPos <= bottom) {
                $('.nav-link').removeClass('active');
                $('.nav-link[href="#' + id + '"]').addClass('active');
            }
        });
    });

    // Smooth scroll on nav link click
    $('.nav-link').on('click', function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        if (target.startsWith('#')) {
            const targetElement = $(target);
            if (targetElement.length) {
                $('html, body').animate({
                    scrollTop: targetElement.offset().top - 80
                }, 800);
            }
        }
    });

    // Smooth scroll for buttons
    $('.btn[href^="#"]').on('click', function(e) {
        const target = $(this).attr('href');
    if (!target || !target.startsWith('#')) {
        return;
    }
    e.preventDefault();
        const targetElement = $(target);
        if (targetElement.length) {
            $('html, body').animate({
                scrollTop: targetElement.offset().top - 80
            }, 800);
        }
    });
});

// ========== Slideshow Gallery ==========
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Ensure index is within bounds
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Add active class to current slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Previous slide
document.getElementById('prevSlide')?.addEventListener('click', function() {
    showSlide(currentSlide - 1);
});

// Next slide
document.getElementById('nextSlide')?.addEventListener('click', function() {
    showSlide(currentSlide + 1);
});

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
        showSlide(index);
    });
});

// Auto-rotate slideshow
setInterval(function() {
    showSlide(currentSlide + 1);
}, 5000); // Change slide every 5 seconds

// Initialize first slide
if (slides.length > 0) {
    showSlide(0);
}

// ========== Works/Projects Data ==========
const projects = [
    {
        id: 1,
        title: 'BidaBoss Inc.',
        description: 'A complete redesign of the Bidaboss e-commerce platform focused on improving user experience, visual consistency, and overall usability for all stakeholders, featuring a cleaner interface, enhanced navigation, and a more streamlined flow.',
        type: 'Website',
        image: 'assets/img/Bidaboss.png',
        gallery: [
            'assets/img/bidaboss_1.png'
        ],
        techStack: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
        keywords: ['Web', 'E-commerce', 'Responsive'],
        liveSite: 'https://bidaboss.ph                                          '
    },
    {
        id: 2,
        title: 'Kings Skincare Website',
        description: 'A luxurious, premium-style skincare website designed specifically for men, featuring a clean and sophisticated layout that highlights product quality, ingredients, and brand identity while delivering a smooth and refined browsing experience.',
        type: 'One-Page Website',
        image: 'assets/img/kings.png',
        gallery: [
            'assets/img/kings_1.png'
        ],
        techStack: ['HTML', 'CSS', 'JavaScript'],
        keywords: ['Luxurious', 'Premium', 'Gifting'],
        liveSite: 'https://stg-single-page-checkout.netlify.app/kings-skincare/'
    },
    {
        id: 3,
        title: 'iHome Speaker Website',
        description: 'A modern one-page product website showcasing a Bluetooth speaker with a focus on clean design, smooth user experience, and clear product highlights such as wireless connectivity, portability, and high-quality sound.',
        type: 'One-Page Website',
        image: 'assets/img/ihomes.png',
        gallery: [
            'assets/img/ihomes_1.png'
        ],
        techStack: ['HTML', 'CSS', 'JavaScript'],
        keywords: ['Modern', 'Sleek', 'Immersive'],
        liveSite: 'https://stg-single-page-checkout.netlify.app/ihome-speaker/'
    },
    {
        id: 4,
        title: 'Portfolio Website',
        description: 'A modern portfolio website showcasing work, experience, and skills with smooth animations.',
        type: 'web app',
        image: 'https://via.placeholder.com/600x400/794c9e/ffffff?text=Portfolio+Website',
        gallery: [
            'https://via.placeholder.com/600x400/794c9e/ffffff?text=Portfolio+Website'
        ],
        techStack: ['HTML', 'CSS', 'JavaScript', 'jQuery'],
        keywords: ['web', 'portfolio', 'responsive'],
        liveSite: '#'
    },
    {
        id: 5,
        title: 'Task Management Dashboard',
        description: 'A collaborative task management dashboard with real-time updates and team collaboration features.',
        type: 'web app',
        image: 'https://via.placeholder.com/600x400/8f7ab8/ffffff?text=Task+Dashboard',
        gallery: [
            'https://via.placeholder.com/800x600/794c9e/ffffff?text=Dashboard+View'
        ],
        techStack: ['Figma', 'Design System', 'Components'],
        keywords: ['prototype', 'ui/ux', 'design'],
        liveSite: '#'
    },
    {
        id: 6,
        title: 'Restaurant Mobile App',
        description: 'A food ordering mobile app with menu browsing, cart management, and order tracking.',
        type: 'mobile app',
        image: 'https://via.placeholder.com/600x400/b89ac9/ffffff?text=Restaurant+App',
        gallery: [
            'https://via.placeholder.com/600x400/b89ac9/ffffff?text=Restaurant+App'
        ],
        techStack: ['Flutter', 'Firebase', 'Dart'],
        keywords: ['mobile', 'restaurant', 'food'],
        liveSite: '#'
    }
];

// Render projects
function renderProjects() {
    const worksGrid = document.getElementById('worksGrid');
    if (!worksGrid) return;

    worksGrid.innerHTML = projects.map(project => `
        <div class="work-card" onclick="openProjectModal(${project.id})">
            <div class="work-image-container">
                <img src="${project.image}" alt="${project.title}" class="work-image">
                <span class="work-type-badge">${project.type}</span>
            </div>
            <div class="work-card-content">
                <h3 class="work-title">${project.title}</h3>
                <p class="work-description">${project.description}</p>
                <div class="work-keywords">
                    ${project.keywords.map(keyword => `<span class="work-keyword">${keyword}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Open project modal
function openProjectModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalTechStack = document.getElementById('modalTechStack');
    const modalGallery = document.getElementById('modalGallery');
    const viewLiveSite = document.getElementById('viewLiveSite');

    if (modalTitle) modalTitle.textContent = project.title;
    if (modalDescription) modalDescription.textContent = project.description;
    
    if (modalTechStack) {
        modalTechStack.innerHTML = project.techStack.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
    }

    if (modalGallery) {
        modalGallery.innerHTML = project.gallery.map(img => 
            `<img src="${img}" alt="${project.title}">`
        ).join('');
    }

    if (viewLiveSite) {
        if (project.liveSite && project.liveSite !== '#') {
            viewLiveSite.href = project.liveSite;
            viewLiveSite.style.display = 'inline-block';
        } else {
            viewLiveSite.style.display = 'none';
        }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close project modal
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event listeners for project modal
document.getElementById('closeModal')?.addEventListener('click', closeProjectModal);
document.getElementById('closeProject')?.addEventListener('click', closeProjectModal);

// Close modal on outside click
document.getElementById('projectModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeProjectModal();
    }
});

// Make function available globally
window.openProjectModal = openProjectModal;

// ========== Certifications Data ==========
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
    },
    {
        id: 6,
        category: 'Front-end',
        title: 'React.js Workshop',
        organization: 'Developer Meetup',
        date: '2023',
        location: 'Online',
        icon: 'fas fa-award',
        certificateImage: 'https://via.placeholder.com/1000x700/b89ac9/ffffff?text=React+Workshop+Certificate'
    }
];

// Render certifications
function renderCertifications() {
    const certGrid = document.getElementById('certificationsGrid');
    if (!certGrid) return;

    certGrid.innerHTML = certifications.map(cert => `
        <div class="certification-card" onclick="openCertificateModal(${cert.id})">
            <i class="${cert.icon} cert-icon"></i>
            <span class="cert-category">${cert.category}</span>
            <h3 class="cert-title">${cert.title}</h3>
            <p class="cert-organization">${cert.organization}</p>
            <p class="cert-date">${cert.date}</p>
            <p class="cert-location">${cert.location}</p>
        </div>
    `).join('');
}

// Open certificate modal
function openCertificateModal(certId) {
    const cert = certifications.find(c => c.id === certId);
    if (!cert) return;

    const modal = document.getElementById('certificateModal');
    const certImage = document.getElementById('certificateImage');

    if (certImage) {
        certImage.src = cert.certificateImage;
        certImage.alt = cert.title;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close certificate modal
function closeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event listeners for certificate modal
document.getElementById('closeCertificate')?.addEventListener('click', closeCertificateModal);

// Close modal on outside click
document.getElementById('certificateModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeCertificateModal();
    }
});

// Make function available globally
window.openCertificateModal = openCertificateModal;

// ========== Form Validation ==========
function validateField(fieldId, errorId, validationFn, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(errorId);
    const value = field.value.trim();

    if (!validationFn(value)) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
        return false;
    } else {
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        return true;
    }
}

function validateFullName(value) {
    return value.length >= 2 && /^[a-zA-Z\s]+$/.test(value);
}

function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateSubject(value) {
    return value.length === 0 || value.length >= 3;
}

function validateMessage(value) {
    return value.length >= 10;
}

function shouldValidateOnBlur(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return false;
    const hasValue = field.value.trim().length > 0;
    const hasInteracted = field.dataset.interacted === 'true';
    return hasValue || hasInteracted;
}

// Real-time validation
document.getElementById('fullName')?.addEventListener('blur', function() {
    if (shouldValidateOnBlur('fullName')) {
        validateField('fullName', 'fullNameError', validateFullName, 'Full name must be at least 2 characters and contain only letters');
    }
});

document.getElementById('email')?.addEventListener('blur', function() {
    if (shouldValidateOnBlur('email')) {
        validateField('email', 'emailError', validateEmail, 'Please enter a valid email address');
    }
});

document.getElementById('subject')?.addEventListener('blur', function() {
    if (shouldValidateOnBlur('subject')) {
        validateField('subject', 'subjectError', validateSubject, 'Subject must be at least 3 characters if provided');
    }
});

document.getElementById('message')?.addEventListener('blur', function() {
    if (shouldValidateOnBlur('message')) {
        validateField('message', 'messageError', validateMessage, 'Message must be at least 10 characters');
    }
});

// Remove error on input
document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
    field.addEventListener('input', function() {
        this.dataset.interacted = 'true';
        if (this.classList.contains('error')) {
            this.classList.remove('error');
            const errorId = this.id + 'Error';
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        }
    });
});

// ========== Contact Form (Web3Forms + Firestore) ==========

// Confirmation Modal
function showConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('closeConfirmation')?.addEventListener('click', closeConfirmationModal);
document.getElementById('confirmationModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeConfirmationModal();
    }
});

function getContactFailureUserMessage(results, tasks) {
    const parts = [];
    results.forEach((r, i) => {
        if (r.status !== 'rejected') return;
        const type = tasks[i]?.type;
        const err = r.reason;
        const code = err && typeof err === 'object' ? err.code : '';
        const msg = err && typeof err === 'object' && err.message ? String(err.message) : String(err || '');
        if (type === 'db') {
            if (code === 'permission-denied' || /permission|insufficient permissions/i.test(msg)) {
                parts.push('Saving failed: Firestore denied this write. Deploy firestore.rules (see repo root) or in Firebase Console → Firestore → Rules, allow create on contactMessages for visitors.');
            } else if (code === 'unavailable' || /network|offline|fetch/i.test(msg)) {
                parts.push('Could not reach Firebase. Check your connection and try again.');
            } else {
                parts.push('Could not save your message: ' + (msg || 'database error'));
            }
        } else if (type === 'email') {
            parts.push('Email notification failed: ' + (msg || 'check your Web3Forms access key in main.js'));
        } else {
            parts.push(msg || String(err || 'Unknown error'));
        }
    });
    return parts.length ? parts.join(' ') : 'Sorry, submission failed. Please verify your Web3Forms/Firebase keys and service permissions.';
}

document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all fields
    const isFullNameValid = validateField('fullName', 'fullNameError', validateFullName, 'Full name must be at least 2 characters and contain only letters');
    const isEmailValid = validateField('email', 'emailError', validateEmail, 'Please enter a valid email address');
    const isSubjectValid = validateField('subject', 'subjectError', validateSubject, 'Subject must be at least 3 characters if provided');
    const isMessageValid = validateField('message', 'messageError', validateMessage, 'Message must be at least 10 characters');

    if (!isFullNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        // Scroll to first error
        const firstError = document.querySelector('.form-group input.error, .form-group textarea.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }

    const formMessage = document.getElementById('formMessage');
    const submitButton = this.querySelector('button[type="submit"]');
    const submitText = submitButton.querySelector('span');
    const submitIcon = submitButton.querySelector('i');

    if (formMessage) {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const formData = {
        fullName: fullName,
        name: fullName,
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // Show loading state
    submitText.textContent = 'Sending...';
    submitButton.disabled = true;
    submitIcon.className = 'fas fa-spinner fa-spin';

    // Paste your access key from https://web3forms.com (Settings → Access Key). Do not commit real keys to public repos.
    const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
    const hasWeb3FormsConfig = (function () {
        const key = (WEB3FORMS_ACCESS_KEY || '').trim();
        if (!key || key.startsWith('YOUR_')) return false;
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key);
    })();
    const saveContactToFirestore = window.InquiryService?.saveContactToFirestore !== false;
    const hasInquiryServiceConfig = Boolean(
        saveContactToFirestore &&
        window.InquiryService?.getDb &&
        window.InquiryService.getDb() &&
        window.InquiryService?.saveInquiry
    );

    if (!hasWeb3FormsConfig && !hasInquiryServiceConfig) {
        console.warn('[Contact form] Not configured: set Web3Forms key in main.js and/or Firebase in inquiry-service.js.');
        submitText.textContent = 'Send Message';
        submitIcon.className = 'fas fa-paper-plane';
        submitButton.disabled = false;
        return;
    }

    const tasks = [];
    if (hasInquiryServiceConfig && window.InquiryService?.saveInquiry) {
        tasks.push({
            type: 'db',
            promise: window.InquiryService.saveInquiry(formData)
        });
    }
    if (hasWeb3FormsConfig) {
        const web3FormData = new FormData();
        web3FormData.append('access_key', WEB3FORMS_ACCESS_KEY);
        web3FormData.append('from_name', fullName);
        web3FormData.append('email', formData.email);
        web3FormData.append('replyto', formData.email);
        web3FormData.append('subject', formData.subject || 'No subject');
        web3FormData.append('message', formData.message);

        tasks.push({
            type: 'email',
            promise: fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: web3FormData
            })
                .then((response) => response.json())
                .then((result) => {
                    if (!result || result.success !== true) {
                        throw new Error(result?.message || 'Web3Forms submission failed.');
                    }
                    return result;
                })
        });
    }

    Promise.allSettled(tasks.map((task) => task.promise))
    .then(function(results) {
        const dbIndex = tasks.findIndex((task) => task.type === 'db');
        const emailIndex = tasks.findIndex((task) => task.type === 'email');
        const dbAttempted = dbIndex !== -1;
        const emailAttempted = emailIndex !== -1;
        const dbSaved = dbAttempted ? results[dbIndex]?.status === 'fulfilled' : false;
        const emailSent = emailAttempted ? results[emailIndex]?.status === 'fulfilled' : false;
        const successCount = (dbSaved ? 1 : 0) + (emailSent ? 1 : 0);

        // Reset button state in every outcome.
        submitText.textContent = 'Send Message';
        submitIcon.className = 'fas fa-paper-plane';
        submitButton.disabled = false;

        if (successCount > 0) {
            document.getElementById('contactForm').reset();
            showConfirmationModal();
            if (dbAttempted && emailAttempted && (!dbSaved || !emailSent)) {
                console.warn('[Contact form]', !dbSaved ? 'Email sent; Firestore save failed.' : 'Saved to Firestore; email failed.');
            }
            return;
        }

        results.forEach((r, i) => {
            if (r.status === 'rejected') {
                console.error('[Contact form]', tasks[i]?.type || 'task', r.reason);
            }
        });
        console.error('[Contact form]', getContactFailureUserMessage(results, tasks));
    });
});

// ========== Initialize on DOM Load ==========
onDomReady(function() {
    renderProjects();
    renderCertifications();
});
