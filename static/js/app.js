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
            if(data.name) heroName.textContent = data.name.split(' ')[0].toUpperCase();
            if(data.bio && heroBio) heroBio.innerHTML = data.bio + "<br>Based in Jaipur, India";
            if(aboutFullBio) aboutFullBio.textContent = data.bio;
            
            // Obfuscate email
            if (data.email && contactEmail) {
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
            if (data.skills && Array.isArray(data.skills) && skillsGrid) {
                skillsGrid.innerHTML = data.skills.map(skill => `
                    <div class="skill-badge">
                        <span class="skill-name">${escapeHTML(skill)}</span>
                    </div>
                `).join('');
            }

            // Render social links
            let socials = '';
            if (data.github) {
                socials += `<a href="${data.github}" target="_blank" class="social-icon">GITHUB</a>`;
            }
            if (data.linkedin) {
                socials += `<span style="color:var(--text-muted)">/</span> <a href="${data.linkedin}" target="_blank" class="social-icon">LINKEDIN</a>`;
            }
            if (data.twitter) {
                socials += `<span style="color:var(--text-muted)">/</span> <a href="${data.twitter}" target="_blank" class="social-icon">TWITTER</a>`;
            }
            if(socialLinksContainer) socialLinksContainer.innerHTML = socials;

        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    // 2. Fetch and Render Projects
    async function loadProjects(category = 'all') {
        if(!projectsGrid) return;
        projectsGrid.innerHTML = `
            <div class="loading-state">
                <div class="loader"></div>
                <p>LOADING...</p>
            </div>
        `;
        try {
            const url = category === 'all' ? '/api/projects' : `/api/projects?category=${category}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch projects');
            const projects = await response.json();

            if (projects.length === 0) {
                projectsGrid.innerHTML = `
                    <div class="empty-state">
                        <p>NO WORKS FOUND.</p>
                    </div>
                `;
                return;
            }

            projectsGrid.innerHTML = projects.map(proj => {
                const tagsList = proj.tags ? proj.tags.split(',').map(t => t.trim()) : [];
                return `
                    <article class="project-card">
                        <div class="project-image-container">
                            <img src="${escapeHTML(proj.image_url || '/static/images/project-placeholder.png')}" alt="${escapeHTML(proj.title)}" class="project-image" loading="lazy">
                        </div>
                        <div class="project-info">
                            <div>
                                <h3 class="project-title">${escapeHTML(proj.title)}</h3>
                                <div class="project-tags">
                                    <span class="project-tag">${escapeHTML(proj.category)}</span>
                                    ${tagsList.map(tag => `<span class="project-tag">${escapeHTML(tag)}</span>`).join('')}
                                </div>
                                <p class="project-description">${escapeHTML(proj.description)}</p>
                            </div>
                            <div class="project-links">
                                ${proj.live_url ? `<a href="${escapeHTML(proj.live_url)}" target="_blank" class="project-link-btn">LIVE &rarr;</a>` : ''}
                                ${proj.github_url ? `<a href="${escapeHTML(proj.github_url)}" target="_blank" class="project-link-btn">CODE &rarr;</a>` : ''}
                            </div>
                        </div>
                    </article>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = `
                <div class="error-state">
                    <p>FAILED TO LOAD WORKS.</p>
                </div>
            `;
        }
    }

    // 4. Contact Form Handling
    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const honeypot = document.getElementById('website').value;
            if (honeypot) return;

            const botcheck = document.getElementById('botcheck');
            if (botcheck && botcheck.checked) return;

            submitBtn.disabled = true;
            spinner.classList.remove('hidden');
            submitBtn.querySelector('span').textContent = 'SENDING...';

            const name    = document.getElementById('name').value.trim();
            const email   = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject_msg').value.trim();
            const rawMsg  = document.getElementById('message').value.trim();

            try {
                const web3Data = new FormData(contactForm);
                web3Data.set('subject', `[Portfolio] ${subject} — from ${name}`);
                web3Data.set('message', rawMsg);

                const w3Res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: web3Data
                });
                const w3Json = await w3Res.json();

                if (!w3Json.success) {
                    throw new Error(w3Json.message || 'Submission failed.');
                }

                fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message: rawMsg, website: '' })
                }).catch(() => {});

                showToast('MESSAGE SENT.', 'success');
                contactForm.reset();
                submitBtn.querySelector('span').textContent = 'SENT ✓';
                setTimeout(() => {
                    submitBtn.querySelector('span').textContent = 'SEND MESSAGE &rarr;';
                }, 3000);

            } catch (error) {
                console.error('Contact error:', error);
                showToast(error.message || 'ERROR. EMAIL DIRECTLY.', 'error');
            } finally {
                submitBtn.disabled = false;
                spinner.classList.add('hidden');
            }
        });
    }

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if(!toast) return;
        toast.textContent = message;
        toast.className = `toast toast-${type}`;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }

    // 7. Filter Buttons
    if(filterButtons) {
        filterButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                activeCategory = e.target.getAttribute('data-category');
                loadProjects(activeCategory);
            }
        });
    }

    // 8. Mobile Navigation Toggle
    if(mobileNavToggle) {
        mobileNavToggle.addEventListener('click', (e) => {
            e.preventDefault();
            navbar.classList.toggle('hidden');
            navbar.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.add('hidden');
                navbar.classList.remove('open');
            });
        });
    }

    // Scroll To Top
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if(scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

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
