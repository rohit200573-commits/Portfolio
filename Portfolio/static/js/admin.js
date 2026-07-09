document.addEventListener('DOMContentLoaded', () => {
    let token = localStorage.getItem('admin_token');

    // DOM Elements
    const loginOverlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const dashboardLayout = document.getElementById('dashboardLayout');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Sidebar & Tabs
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const tabPanels = document.querySelectorAll('.dashboard-tab-panel');
    const msgBadge = document.getElementById('msgBadge');
    
    // Forms
    const profileForm = document.getElementById('profileForm');
    const projectForm = document.getElementById('projectForm');
    
    // Table/Lists
    const projectsTableBody = document.getElementById('projectsTableBody');
    const messagesList = document.getElementById('messagesList');
    
    // Modals
    const projectModal = document.getElementById('projectModal');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const modalTitle = document.getElementById('modalTitle');
    const projectIdInput = document.getElementById('projectId');

    // Helper: Headers with Auth Token
    function getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // --- Authentication ---
    
    function initDashboard() {
        if (!token) {
            loginOverlay.classList.remove('hidden');
            dashboardLayout.classList.add('hidden');
            return;
        }
        
        loginOverlay.classList.add('hidden');
        dashboardLayout.classList.remove('hidden');
        
        // Load initial data
        loadProfileData();
        loadProjectsList();
        loadMessagesList();
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            
            const data = await response.json();
            if (response.ok && data.success) {
                token = data.token;
                localStorage.setItem('admin_token', token);
                loginError.classList.add('hidden');
                initDashboard();
                showToast('Logged in successfully!', 'success');
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            loginError.textContent = error.message;
            loginError.classList.remove('hidden');
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('admin_token');
        token = null;
        initDashboard();
        showToast('Logged out successfully.', 'info');
    });

    // --- Tab Switching ---
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const target = link.getAttribute('data-target');
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('id') === target) {
                    panel.classList.add('active');
                }
            });
        });
    });

    // --- Profile Management ---
    
    async function loadProfileData() {
        try {
            const response = await fetch('/api/profile');
            if (!response.ok) throw new Error('Failed to load profile');
            const data = await response.json();
            
            document.getElementById('profName').value = data.name || '';
            document.getElementById('profTitle').value = data.title || '';
            document.getElementById('profBio').value = data.bio || '';
            document.getElementById('profEmail').value = data.email || '';
            document.getElementById('profLinkedin').value = data.linkedin || '';
            document.getElementById('profGithub').value = data.github || '';
            document.getElementById('profTwitter').value = data.twitter || '';
            document.getElementById('profSkills').value = data.skills ? data.skills.join(', ') : '';
        } catch (error) {
            console.error('Error loading profile:', error);
            showToast('Failed to load profile details.', 'error');
        }
    }

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const skillsString = document.getElementById('profSkills').value;
        const skillsArray = skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        const profileData = {
            name: document.getElementById('profName').value,
            title: document.getElementById('profTitle').value,
            bio: document.getElementById('profBio').value,
            email: document.getElementById('profEmail').value,
            linkedin: document.getElementById('profLinkedin').value,
            github: document.getElementById('profGithub').value,
            twitter: document.getElementById('profTwitter').value,
            skills: skillsArray
        };

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(profileData)
            });
            
            if (response.ok) {
                showToast('Profile updated successfully!', 'success');
                loadProfileData();
            } else {
                const err = await response.json();
                throw new Error(err.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast(error.message, 'error');
        }
    });

    // --- Project Management ---

    async function loadProjectsList() {
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) throw new Error('Failed to fetch projects');
            const projects = await response.json();
            
            projectsTableBody.innerHTML = projects.map(proj => `
                <tr>
                    <td class="font-semibold">${escapeHTML(proj.title)}</td>
                    <td><span class="category-badge">${escapeHTML(proj.category.toUpperCase())}</span></td>
                    <td><div class="tags-list">${proj.tags.split(',').map(t => `<span class="tag-sub">${escapeHTML(t.trim())}</span>`).join('')}</div></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-secondary edit-proj-btn" data-id="${proj.id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-proj-btn" data-id="${proj.id}">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');

            // Attach event listeners to newly created buttons
            document.querySelectorAll('.edit-proj-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    openProjectModal('edit', id);
                });
            });

            document.querySelectorAll('.delete-proj-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this project?')) {
                        deleteProject(id);
                    }
                });
            });
        } catch (error) {
            console.error('Error loading projects list:', error);
            showToast('Failed to load projects list.', 'error');
        }
    }

    async function deleteProject(id) {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            
            if (response.ok) {
                showToast('Project deleted successfully!', 'success');
                loadProjectsList();
            } else {
                throw new Error('Failed to delete project');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    // Modal control
    function openProjectModal(mode = 'add', id = null) {
        projectModal.classList.remove('hidden');
        projectForm.reset();
        projectIdInput.value = '';
        
        if (mode === 'add') {
            modalTitle.textContent = 'Add New Project';
        } else {
            modalTitle.textContent = 'Edit Project';
            projectIdInput.value = id;
            loadProjectDetails(id);
        }
    }

    function closeProjectModal() {
        projectModal.classList.add('hidden');
    }

    addProjectBtn.addEventListener('click', () => openProjectModal('add'));
    closeModalBtn.addEventListener('click', closeProjectModal);
    cancelModalBtn.addEventListener('click', closeProjectModal);

    async function loadProjectDetails(id) {
        try {
            // Find project client-side to populate form, or load from DB if needed. 
            // Fetch projects array to search details.
            const response = await fetch('/api/projects');
            const projects = await response.json();
            const proj = projects.find(p => p.id == id);
            
            if (proj) {
                document.getElementById('projTitle').value = proj.title;
                document.getElementById('projDesc').value = proj.description;
                document.getElementById('projCategory').value = proj.category;
                document.getElementById('projTags').value = proj.tags;
                document.getElementById('projImage').value = proj.image_url;
                document.getElementById('projLive').value = proj.live_url;
                document.getElementById('projGithub').value = proj.github_url;
            }
        } catch (error) {
            console.error('Error fetching project details:', error);
            showToast('Failed to load project details.', 'error');
        }
    }

    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = projectIdInput.value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/projects/${id}` : '/api/projects';
        
        const projectData = {
            title: document.getElementById('projTitle').value,
            description: document.getElementById('projDesc').value,
            category: document.getElementById('projCategory').value,
            tags: document.getElementById('projTags').value,
            image_url: document.getElementById('projImage').value,
            live_url: document.getElementById('projLive').value,
            github_url: document.getElementById('projGithub').value
        };

        try {
            const response = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(projectData)
            });
            
            if (response.ok) {
                showToast(id ? 'Project updated successfully!' : 'Project added successfully!', 'success');
                closeProjectModal();
                loadProjectsList();
            } else {
                const err = await response.json();
                throw new Error(err.error || 'Failed to save project');
            }
        } catch (error) {
            console.error('Error saving project:', error);
            showToast(error.message, 'error');
        }
    });

    // --- Message Management ---

    async function loadMessagesList() {
        try {
            const response = await fetch('/api/messages', {
                headers: getHeaders()
            });
            
            if (!response.ok) throw new Error('Failed to fetch messages');
            const messages = await response.json();
            
            // Set message sidebar count
            if (messages.length > 0) {
                msgBadge.textContent = messages.length;
                msgBadge.classList.remove('hidden');
            } else {
                msgBadge.classList.add('hidden');
            }
            
            if (messages.length === 0) {
                messagesList.innerHTML = `
                    <div class="empty-state-card glass">
                        <p>No messages received yet.</p>
                    </div>
                `;
                return;
            }
            
            messagesList.innerHTML = messages.map(msg => {
                const date = new Date(msg.created_at).toLocaleString();
                return `
                    <div class="message-card glass">
                        <div class="message-header flex-between">
                            <div>
                                <h4>${escapeHTML(msg.subject)}</h4>
                                <span class="message-sender">From: <strong>${escapeHTML(msg.name)}</strong> (${escapeHTML(msg.email)})</span>
                            </div>
                            <span class="message-date">${date}</span>
                        </div>
                        <div class="message-body">
                            <p>${escapeHTML(msg.message)}</p>
                        </div>
                        <div class="message-actions text-right">
                            <button class="btn btn-sm btn-danger delete-msg-btn" data-id="${msg.id}">Delete Message</button>
                        </div>
                    </div>
                `;
            }).join('');

            // Attach event listeners to delete buttons
            document.querySelectorAll('.delete-msg-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Delete this message permanently?')) {
                        deleteMessage(id);
                    }
                });
            });
        } catch (error) {
            console.error('Error loading messages list:', error);
            showToast('Failed to load messages.', 'error');
        }
    }

    async function deleteMessage(id) {
        try {
            const response = await fetch(`/api/messages/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            
            if (response.ok) {
                showToast('Message deleted successfully!', 'success');
                loadMessagesList();
            } else {
                throw new Error('Failed to delete message');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    // --- Global Toast Notification ---
    
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast toast-${type}`;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }

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

    // Initialize Dashboard
    initDashboard();
});
