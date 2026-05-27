document.addEventListener('DOMContentLoaded', () => {
    // State management
    let activeCategory = 'all';

    // DOM Elements
    const heroName = document.getElementById('heroName');
    const heroTitle = document.getElementById('heroTitle');
    const heroBio = document.getElementById('heroBio');
    const aboutFullBio = document.getElementById('aboutFullBio');
    const contactEmail = document.getElementById('contactEmail');
    const socialLinksContainer = document.getElementById('socialLinks');
    const skillsGrid = document.getElementById('skillsGrid');
    const projectsGrid = document.getElementById('projectsGrid');
    const filterButtons = document.getElementById('filterButtons');
    const contactForm = document.getElementById('contactForm');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = submitBtn.querySelector('.btn-spinner');

    // 1. Fetch Profile Data
    async function loadProfile() {
        try {
            const response = await fetch('/api/profile');
            if (!response.ok) throw new Error('Failed to load profile');
            const data = await response.json();
            
            // Render text fields
            heroName.textContent = `${data.name} — ${data.title}`;
            heroBio.textContent = data.bio;
            
            // Obfuscate email from scrapers
            if (data.email) {
                const parts = data.email.split('@');
                if (parts.length === 2) {
                    const u = parts[0];
                    const d = parts[1];
                    contactEmail.textContent = `${u}@${d}`;
                    contactEmail.href = '#';
                    contactEmail.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = `mailto:${u}@${d}`;
                    });
                }
            }

            // Render skills
            if (data.skills && Array.isArray(data.skills)) {
                skillsGrid.innerHTML = data.skills.map(skill => `
                    <div class="skill-badge glass">
                        <span class="skill-dot"></span>
                        <span class="skill-name">${escapeHTML(skill)}</span>
                    </div>
                `).join('');
            }

            // Render social links
            let socials = '';
            if (data.github) {
                socials += `
                    <a href="${data.github}" target="_blank" aria-label="GitHub" class="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>`;
            }
            if (data.linkedin) {
                socials += `
                    <a href="${data.linkedin}" target="_blank" aria-label="LinkedIn" class="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>`;
            }
            if (data.twitter) {
                socials += `
                    <a href="${data.twitter}" target="_blank" aria-label="Twitter" class="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                    </a>`;
            }
            socialLinksContainer.innerHTML = socials;

            // Trigger typing effect with title loaded from database
            initTypingEffect(data.title || "Full Stack Developer");
        } catch (error) {
            console.error('Error loading profile:', error);
            initTypingEffect("Full Stack Developer");
        }
    }

    // 2. Fetch and Render Projects
    async function loadProjects(category = 'all') {
        projectsGrid.innerHTML = `
            <div class="loading-state">
                <div class="loader"></div>
                <p>Loading projects...</p>
            </div>
        `;
        try {
            const url = category === 'all' ? '/api/projects' : `/api/projects?category=${category}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch projects');
            const projects = await response.json();

            if (projects.length === 0) {
                projectsGrid.innerHTML = `
                    <div class="empty-state glass">
                        <p>No projects found in this category.</p>
                    </div>
                `;
                return;
            }

            projectsGrid.innerHTML = projects.map(proj => {
                const tagsList = proj.tags ? proj.tags.split(',').map(t => t.trim()) : [];
                return `
                    <article class="project-card glass">
                        <div class="project-image-container">
                            <img src="${escapeHTML(proj.image_url || '/static/images/project-placeholder.png')}" alt="${escapeHTML(proj.title)}" class="project-image" loading="lazy" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'250\' viewBox=\'0 0 400 250\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%2312131a\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%234f46e5\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'18\'%3E${encodeURIComponent(proj.title)}%3C/text%3E%3C/svg%3E'">
                            <div class="project-overlay">
                                <div class="project-links">
                                    ${proj.live_url ? `<a href="${escapeHTML(proj.live_url)}" target="_blank" class="project-link-btn" title="Live Demo" aria-label="View Live Demo of ${escapeHTML(proj.title)}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </a>` : ''}
                                    ${proj.github_url ? `<a href="${escapeHTML(proj.github_url)}" target="_blank" class="project-link-btn" title="View Source" aria-label="View GitHub Repository of ${escapeHTML(proj.title)}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                    </a>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="project-info">
                            <span class="project-category">${escapeHTML(proj.category.toUpperCase())}</span>
                            <h4 class="project-title">${escapeHTML(proj.title)}</h4>
                            <p class="project-description">${escapeHTML(proj.description)}</p>
                            <div class="project-tags">
                                ${tagsList.map(tag => `<span class="project-tag">${escapeHTML(tag)}</span>`).join('')}
                            </div>
                        </div>
                    </article>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = `
                <div class="error-state glass">
                    <p>Failed to load projects. Please refresh the page.</p>
                </div>
            `;
        }
    }

    // 3. Typing Animation
    function initTypingEffect(text) {
        let index = 0;
        let isDeleting = false;
        const speed = 100;
        const pause = 2000;
        const words = [text, "UI/UX Designer", "Problem Solver"];
        let wordIndex = 0;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                heroTitle.textContent = currentWord.substring(0, index - 1);
                index--;
            } else {
                heroTitle.textContent = currentWord.substring(0, index + 1);
                index++;
            }

            let typeSpeed = speed;
            if (isDeleting) {
                typeSpeed /= 2;
            }

            if (!isDeleting && index === currentWord.length) {
                typeSpeed = pause;
                isDeleting = true;
            } else if (isDeleting && index === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // 4. Contact Form Handling
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // UI Feedback
        submitBtn.disabled = true;
        spinner.classList.remove('hidden');
        submitBtn.querySelector('span').textContent = 'Sending...';

        const phone = document.getElementById('phone').value;
        const rawMessage = document.getElementById('message').value;
        const honeypot = document.getElementById('website').value;
        const fullMessage = phone ? `[Phone: ${phone}]\n\n${rawMessage}` : rawMessage;

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: fullMessage,
            website: honeypot
        };

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (response.ok) {
                showToast('Message sent successfully!', 'success');
                contactForm.reset();
                submitBtn.querySelector('span').textContent = "Message sent! I'll reply within 24 hours ✓";
                submitBtn.classList.add('btn-success-state');
                setTimeout(() => {
                    submitBtn.querySelector('span').textContent = 'Send Message';
                    submitBtn.classList.remove('btn-success-state');
                }, 5000);
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showToast(error.message || 'An error occurred. Please try again later.', 'error');
        } finally {
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
            submitBtn.querySelector('span').textContent = 'Send Message';
        }
    });

    // 5. Toast Notifications
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast toast-${type}`;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }

    // 6. Navigation Link Highlighting on Scroll using IntersectionObserver
    const sections = document.querySelectorAll('section');
    const navLinksMap = {};
    navLinks.forEach(link => {
        const id = link.getAttribute('href');
        if (id && id.startsWith('#')) {
            navLinksMap[id.substring(1)] = link;
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLinksMap[id]) {
                    navLinksMap[id].classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // 9. Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.remove('hidden');
        } else {
            scrollToTopBtn.classList.add('hidden');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 7. Filter Buttons Event Listeners
    filterButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            activeCategory = e.target.getAttribute('data-category');
            loadProjects(activeCategory);
        }
    });

    // 8. Mobile Navigation Toggle
    mobileNavToggle.addEventListener('click', () => {
        navbar.classList.toggle('open');
        const iconMenu = mobileNavToggle.querySelector('.icon-menu');
        const iconClose = mobileNavToggle.querySelector('.icon-close');
        
        iconMenu.classList.toggle('hidden');
        iconClose.classList.toggle('hidden');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open');
            mobileNavToggle.querySelector('.icon-menu').classList.remove('hidden');
            mobileNavToggle.querySelector('.icon-close').classList.add('hidden');
        });
    });

    // Helper: Escaping HTML input
    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Startup Initializations
    async function init() {
        try {
            await Promise.all([loadProfile(), loadProjects('all')]);
        } catch (error) {
            console.error('Initialization error:', error);
        } finally {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('fade-out');
            }
        }
    }
    init();
});
