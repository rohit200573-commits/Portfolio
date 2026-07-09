/**
 * =====================================================
 *   AI RESUME ASSISTANT — Rohit Jha Portfolio
 *   Rule-based NLP chatbot with intent matching
 * =====================================================
 */
(function () {
    'use strict';

    // ─── Knowledge Base ──────────────────────────────────────────────────────
    const KB = {
        name: 'Rohit Jha',
        title: 'Full Stack Developer & AI/ML Specialist',
        location: 'Jaipur, India',
        email: 'rohit200573@gmail.com',
        github: 'github.com/rohit200573-commits',
        linkedin: 'linkedin.com/in/rohit-jha',
        education: 'Bachelor of Computer Applications (BCA) — AI & ML Specialization, 2025–2028, Jaipur',
        certifications: 'NPTEL Elite Certification (IIT Kanpur, 62% score, 3 academic credits) · Techno Tarang Hackathon 3.0 (Poornima College, April 2026)',
        skills: 'HTML5 · CSS3 · JavaScript (ES6+) · Python · Flask · React · Node.js · MongoDB · SQLite · TensorFlow · REST APIs · Git · UI/UX Design',
        ai: 'Built CNNs for medical image classification (95%+ accuracy), integrated deep learning models into production web apps, experienced in Python + TensorFlow, data preprocessing, and model optimization',
        projects: '4 production-grade projects: This Portfolio (Flask + Python + SQLite + Vanilla JS), Medical Image Classifier (TensorFlow CNN — 95%+ MRI triage accuracy), Full-Stack Web Apps (React + Node.js + MongoDB)',
        experience: '2+ years hands-on in full-stack web development and AI/ML integration, 500+ GitHub commits & pull requests',
        openTo: 'Internships · Freelance projects · Open-source collaboration',
        availability: 'Available for remote work globally and local opportunities in Jaipur/Rajasthan. Time zone: IST (UTC+5:30)',
    };

    // ─── Intent → Response Map ───────────────────────────────────────────────
    const INTENTS = [
        {
            id: 'greeting',
            patterns: ['hello', 'hi', 'hey', 'howdy', 'sup', "what's up", 'yo', 'hola'],
            response: () =>
                `Hey there! 👋 I'm <strong>Rohit's AI Resume Assistant</strong>.<br><br>I can answer questions about:<br>🛠️ Skills & Tech Stack<br>💼 Projects & Experience<br>🎓 Education & Certifications<br>📬 How to hire or contact Rohit<br><br>What would you like to know?`,
            chips: ['Skills', 'Projects', 'AI/ML Experience', 'Contact Rohit'],
        },
        {
            id: 'about',
            patterns: ['who are you', 'tell me about rohit', 'introduce yourself', 'who is rohit', 'about rohit', 'overview', 'summary'],
            response: () =>
                `I'm an AI assistant built to represent <strong>Rohit Jha</strong> 🚀<br><br>Rohit is a <strong>${KB.title}</strong> based in <strong>${KB.location}</strong>. He's pursuing a BCA with an AI & ML specialization (2025–2028) while simultaneously building production web applications and training deep learning models.<br><br>He's passionate about writing clean, scalable code and designing intuitive UX — and he's open to exciting opportunities!`,
            chips: ['Skills', 'Projects', 'Contact Rohit'],
        },
        {
            id: 'skills',
            patterns: ['skill', 'tech stack', 'technology', 'what can he', 'expertise', 'proficient', 'know how', 'languages', 'tools', 'stack'],
            response: () =>
                `Rohit's core tech stack:<br><br>🌐 <strong>Frontend:</strong> HTML5, CSS3, JavaScript, React<br>⚙️ <strong>Backend:</strong> Python, Flask, Node.js, REST APIs<br>🗄️ <strong>Database:</strong> SQLite, MongoDB<br>🤖 <strong>AI/ML:</strong> TensorFlow, CNNs, Deep Learning<br>🛠️ <strong>Tools:</strong> Git, UI/UX Design<br><br>He's especially strong in <strong>full-stack architecture</strong> and <strong>AI integrations</strong>!`,
            chips: ['AI/ML Experience', 'Projects', 'Contact Rohit'],
        },
        {
            id: 'projects',
            patterns: ['project', 'built', 'portfolio', 'what have you', 'show me work', 'work samples', 'demo', 'app'],
            response: () =>
                `Rohit has built <strong>4 production-grade projects</strong>:<br><br>🏗️ <strong>Portfolio Website</strong> — Flask + Python + SQLite + Vanilla JS (you're on it!)<br>🧠 <strong>Medical Image Classifier</strong> — TensorFlow CNNs with 95%+ MRI triage accuracy<br>🌐 <strong>Full-Stack Web Apps</strong> — React + Node.js + MongoDB architectures<br><br>👆 Scroll up to the <strong>Projects section</strong> to explore them all with live demos & GitHub links!`,
            chips: ['AI/ML Experience', 'Contact Rohit'],
        },
        {
            id: 'ai',
            patterns: ['ai', 'machine learning', 'deep learning', 'tensorflow', 'neural network', 'ml', 'artificial intelligence', 'cnn', 'model'],
            response: () =>
                `🤖 <strong>AI/ML Focus:</strong><br><br>Rohit has hands-on experience in:<br>• Building <strong>CNNs</strong> for medical image classification (95%+ accuracy)<br>• Integrating deep learning models into production web apps<br>• <strong>Python + TensorFlow</strong> — model training, evaluation & optimization<br>• Data preprocessing, feature engineering, and model deployment<br><br>His BCA specialization is specifically in <strong>AI & Machine Learning</strong> — this is his core passion! The very chatbot you're talking to is part of that portfolio ✨`,
            chips: ['Projects', 'Skills', 'Contact Rohit'],
        },
        {
            id: 'education',
            patterns: ['education', 'study', 'degree', 'bca', 'college', 'university', 'qualification', 'academic', 'school'],
            response: () =>
                `📚 <strong>Education:</strong><br><br><strong>Bachelor of Computer Applications (BCA)</strong><br>Specialization: AI & Machine Learning<br>Duration: 2025–2028 | Jaipur, India<br><br>🏅 <strong>NPTEL Elite Certification</strong><br>Issued by IIT Kanpur | Score: 62% (Elite Award)<br>Subject: Enhancing Soft Skills & Personality<br>Credits: 3 Academic Credits`,
            chips: ['Achievements', 'Skills', 'Contact Rohit'],
        },
        {
            id: 'certifications',
            patterns: ['certif', 'nptel', 'hackathon', 'achievement', 'award', 'iit', 'accomplishment', 'poornima'],
            response: () =>
                `🏆 <strong>Achievements & Certifications:</strong><br><br>🎓 <strong>NPTEL Elite Certification</strong><br>IIT Kanpur | 62% score (Elite Award) | 3 Academic Credits<br>Subject: Enhancing Soft Skills & Personality<br><br>💻 <strong>Techno Tarang Hackathon 3.0</strong><br>Poornima College of Engineering | April 2026<br>24-hour innovation hackathon — "Where Code Builds the Future of Earth"`,
            chips: ['Education', 'Projects', 'Contact Rohit'],
        },
        {
            id: 'contact',
            patterns: ['contact', 'email', 'reach out', 'hire', 'available', 'work with', 'collaborate', 'freelance', 'internship', 'opportunity', 'job', 'open to'],
            response: () =>
                `📬 <strong>Let's Connect!</strong><br><br>📧 <strong>Email:</strong> ${KB.email}<br>🐙 <strong>GitHub:</strong> ${KB.github}<br>💼 <strong>LinkedIn:</strong> ${KB.linkedin}<br>📍 <strong>Location:</strong> ${KB.location}<br><br>Rohit is open to <strong>internships, freelance projects, and open-source collaboration</strong>.<br><br>👇 Use the <strong>Contact form</strong> at the bottom of this page — he replies within 24 hours!`,
            chips: ['Skills', 'Projects'],
        },
        {
            id: 'experience',
            patterns: ['experience', 'worked', 'professional', 'career', 'background', 'history', 'past', 'previous'],
            response: () =>
                `💼 <strong>Experience:</strong><br><br>Rohit has <strong>2+ years of hands-on development</strong> experience:<br><br>🔹 <strong>2026 – Present:</strong> Full Stack & AI Integration — responsive web apps, RESTful API design, deep learning model integration (React, Flask, SQLite)<br><br>🔹 <strong>2025 – 2026:</strong> Deep Learning & Computer Vision — CNNs for medical image classification using Python + TensorFlow (95%+ triage accuracy)<br><br>🐙 <strong>500+ GitHub commits</strong> & consistent open-source contributions`,
            chips: ['Projects', 'Skills', 'Contact Rohit'],
        },
        {
            id: 'github',
            patterns: ['github', 'repository', 'repo', 'open source', 'contribution', 'code', 'commit'],
            response: () =>
                `🐙 <strong>GitHub:</strong> <a href="https://github.com/rohit200573-commits" target="_blank" rel="noopener" style="color:var(--accent-indigo)">github.com/rohit200573-commits</a><br><br>Rohit has <strong>500+ commits & pull requests</strong> with consistent codebase check-ins, testing workflows, and deployment integrations. Active open-source profile!`,
            chips: ['Projects', 'Contact Rohit'],
        },
        {
            id: 'location',
            patterns: ['location', 'where', 'jaipur', 'india', 'based', 'remote', 'timezone'],
            response: () =>
                `📍 Rohit is based in <strong>Jaipur, India</strong> (the "Pink City"!)<br><br>✅ Available for <strong>remote work globally</strong><br>✅ Local opportunities in Jaipur/Rajasthan<br>🕰️ Time zone: <strong>IST (UTC+5:30)</strong>`,
            chips: ['Contact Rohit', 'About Rohit'],
        },
        {
            id: 'thanks',
            patterns: ['thank', 'thanks', 'great', 'awesome', 'nice', 'cool', 'good', 'perfect', 'helpful', 'appreciate'],
            response: () =>
                `You're welcome! 😊 Happy to help!<br><br>If you'd like to work with Rohit or have more questions, don't hesitate to ask — or head to the <strong>Contact section</strong> below!`,
            chips: ['Contact Rohit', 'Projects'],
        },
        {
            id: 'bye',
            patterns: ['bye', 'goodbye', 'see you', 'ciao', 'later', 'farewell', 'take care'],
            response: () =>
                `Goodbye! 👋 Great talking to you!<br><br>Don't forget to check out the <strong>Contact section</strong> if you'd like to collaborate with Rohit. Have a fantastic day! 🚀`,
            chips: [],
        },
    ];

    const FALLBACK_RESPONSES = [
        `I'm not sure about that one! Try asking about Rohit's <strong>skills</strong>, <strong>projects</strong>, <strong>education</strong>, or <strong>how to hire him</strong> 🤔`,
        `Hmm, that's outside my knowledge base! I can tell you about Rohit's <strong>tech stack</strong>, <strong>AI/ML experience</strong>, or <strong>contact details</strong>.`,
        `Great question! I don't have that info yet — but you can <strong>email Rohit directly</strong> at rohit200573@gmail.com for anything specific 📧`,
    ];

    let fallbackIndex = 0;

    // ─── Intent Matching ─────────────────────────────────────────────────────
    function getResponse(userInput) {
        const input = userInput.toLowerCase().trim();
        for (const intent of INTENTS) {
            if (intent.patterns.some(p => input.includes(p))) {
                return intent;
            }
        }
        return null;
    }

    // ─── DOM Builder ─────────────────────────────────────────────────────────
    function createChatWidget() {
        const wrapper = document.createElement('div');
        wrapper.id = 'ai-chat-widget';
        wrapper.innerHTML = `
            <!-- Toggle Button -->
            <button id="chatToggleBtn" class="chat-toggle-btn" aria-label="Open AI Resume Assistant" title="Ask AI about Rohit">
                <span class="chat-toggle-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </span>
                <span class="chat-toggle-label">Ask AI</span>
                <span class="chat-toggle-pulse"></span>
            </button>

            <!-- Chat Panel -->
            <div id="chatPanel" class="chat-panel glass" role="dialog" aria-label="AI Resume Assistant" aria-hidden="true">
                <!-- Header -->
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"></path></svg>
                        </div>
                        <div>
                            <span class="chat-name">Rohit's AI Assistant</span>
                            <span class="chat-status"><span class="status-dot"></span>Online · Answers instantly</span>
                        </div>
                    </div>
                    <button id="chatCloseBtn" class="chat-close-btn" aria-label="Close chat">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <!-- Messages -->
                <div class="chat-messages" id="chatMessages" role="log" aria-live="polite"></div>

                <!-- Chips -->
                <div class="chat-chips" id="chatChips"></div>

                <!-- Input -->
                <div class="chat-input-row">
                    <input type="text" id="chatInput" class="chat-input" placeholder="Ask about skills, projects, AI/ML…" autocomplete="off" maxlength="200" aria-label="Ask a question">
                    <button id="chatSendBtn" class="chat-send-btn" aria-label="Send message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(wrapper);
    }

    // ─── Message Rendering ───────────────────────────────────────────────────
    function addMessage(html, role = 'bot') {
        const messages = document.getElementById('chatMessages');
        const msgEl = document.createElement('div');
        msgEl.className = `chat-message chat-message--${role}`;
        if (role === 'bot') {
            msgEl.innerHTML = `
                <div class="bot-avatar-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"></path></svg>
                </div>
                <div class="chat-bubble">${html}</div>`;
        } else {
            msgEl.innerHTML = `<div class="chat-bubble">${escapeHTML(html)}</div>`;
        }
        messages.appendChild(msgEl);
        messages.scrollTop = messages.scrollHeight;
        return msgEl;
    }

    function showTyping() {
        const messages = document.getElementById('chatMessages');
        const el = document.createElement('div');
        el.className = 'chat-message chat-message--bot chat-typing-indicator';
        el.innerHTML = `
            <div class="bot-avatar-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"></path></svg>
            </div>
            <div class="chat-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
        messages.appendChild(el);
        messages.scrollTop = messages.scrollHeight;
        return el;
    }

    function renderChips(chips = []) {
        const container = document.getElementById('chatChips');
        container.innerHTML = '';
        if (!chips.length) return;
        chips.forEach(label => {
            const btn = document.createElement('button');
            btn.className = 'chat-chip';
            btn.textContent = label;
            btn.addEventListener('click', () => handleUserInput(label));
            container.appendChild(btn);
        });
    }

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ─── Core Logic ──────────────────────────────────────────────────────────
    function handleUserInput(text) {
        if (!text.trim()) return;
        const input = document.getElementById('chatInput');
        input.value = '';
        renderChips([]); // clear chips while processing

        addMessage(text, 'user');
        const typingEl = showTyping();

        setTimeout(() => {
            typingEl.remove();
            const intent = getResponse(text);
            if (intent) {
                addMessage(intent.response(), 'bot');
                renderChips(intent.chips || []);
            } else {
                addMessage(FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length], 'bot');
                fallbackIndex++;
                renderChips(['Skills', 'Projects', 'Contact Rohit', 'AI/ML Experience']);
            }
        }, 800 + Math.random() * 400);
    }

    // ─── Panel Toggle ────────────────────────────────────────────────────────
    function openChat() {
        const panel = document.getElementById('chatPanel');
        const btn = document.getElementById('chatToggleBtn');
        panel.classList.add('chat-panel--open');
        panel.setAttribute('aria-hidden', 'false');
        btn.setAttribute('aria-label', 'Close AI Resume Assistant');
        btn.classList.add('chat-toggle-btn--active');
        document.getElementById('chatInput').focus();
    }

    function closeChat() {
        const panel = document.getElementById('chatPanel');
        const btn = document.getElementById('chatToggleBtn');
        panel.classList.remove('chat-panel--open');
        panel.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-label', 'Open AI Resume Assistant');
        btn.classList.remove('chat-toggle-btn--active');
    }

    // ─── Initialise ──────────────────────────────────────────────────────────
    function init() {
        createChatWidget();

        // Events
        document.getElementById('chatToggleBtn').addEventListener('click', () => {
            const panel = document.getElementById('chatPanel');
            panel.classList.contains('chat-panel--open') ? closeChat() : openChat();
        });

        document.getElementById('chatCloseBtn').addEventListener('click', closeChat);

        document.getElementById('chatSendBtn').addEventListener('click', () => {
            handleUserInput(document.getElementById('chatInput').value.trim());
        });

        document.getElementById('chatInput').addEventListener('keydown', e => {
            if (e.key === 'Enter') handleUserInput(e.target.value.trim());
        });

        // Welcome message with small delay
        setTimeout(() => {
            const greeting = INTENTS.find(i => i.id === 'greeting');
            addMessage(greeting.response(), 'bot');
            renderChips(greeting.chips);
        }, 600);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
