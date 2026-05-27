import sqlite3
import json

def init_db():
    conn = sqlite3.connect('portfolio.db')
    cursor = conn.cursor()

    # Create projects table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            image_url TEXT,
            live_url TEXT,
            github_url TEXT,
            tags TEXT,
            category TEXT,
            display_order INTEGER DEFAULT 0
        )
    ''')

    # Create messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create profile table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            title TEXT NOT NULL,
            bio TEXT NOT NULL,
            email TEXT NOT NULL,
            linkedin TEXT,
            github TEXT,
            twitter TEXT,
            skills TEXT
        )
    ''')

    # Check if profile is already seeded
    cursor.execute('SELECT COUNT(*) FROM profile')
    if cursor.fetchone()[0] == 0:
        skills = ["HTML5", "CSS3", "JavaScript", "Python", "Flask", "SQLite", "Git", "REST APIs", "UI/UX Design"]
        cursor.execute('''
            INSERT INTO profile (name, title, bio, email, linkedin, github, twitter, skills)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            "Rohit Jha",
            "Full Stack Developer & BCA Student",
            "I am a passionate Full Stack Developer and BCA Student specializing in AI & Machine Learning. I help startups and businesses design, develop, and ship highly-performant, scalable products faster by combining clean code with intuitive UI/UX design.",
            "rohit200573@gmail.com",
            "https://www.linkedin.com/feed/",
            "https://github.com/rohit200573-commits",
            " ",
            json.dumps(skills)
        ))

    # Check if projects are seeded
    cursor.execute('SELECT COUNT(*) FROM projects')
    if cursor.fetchone()[0] == 0:
        initial_projects = [
            (
                "Brain Tumor Detection using AI",
                "Engineered an AI-powered diagnostic platform to solve the problem of delayed MRI scan screening. It leverages high-accuracy Convolutional Neural Networks (CNNs) to detect and classify brain tumors, featuring an interactive visualization dashboard. Built with Python, TensorFlow, and Flask, this system achieved a 95%+ classification accuracy, enabling radiologists to accelerate triage and improve patient clinical outcomes.",
                "/static/images/project1.webp",
                "https://brain-tumor-ai.example.com",
                "https://github.com/rohit/brain-tumor-detection",
                "Python, TensorFlow, Flask, Deep Learning, Medical AI",
                "ai",
                1
            ),
            (
                "Resource Allocation & Optimization Engine",
                "Developed a web-based optimization engine to resolve complex resource scheduling and operational bottlenecks in enterprise logistics. Key features include interactive Gantt charts, real-time workload tracking, and automated resource leveling algorithms. Powered by React, Node.js, SQLite, and Chart.js, the outcome was a 30% reduction in scheduling conflicts and optimized resource utilization.",
                "/static/images/project2.webp",
                "https://resource-allocator.example.com",
                "https://github.com/rohit/resource-allocation",
                "React, Node.js, SQLite, Chart.js, Optimization",
                "web",
                2
            ),
            (
                "OmniChat Real-time Chat Application",
                "Created a real-time messaging architecture to address connection dropouts and latency in remote communication. It supports dynamic chat rooms, instant typing indicators, status sync, and offline message caching. Built using Flask, Socket.io, Redis, and JavaScript, the application achieves sub-50ms message delivery latency and reliable message persistence.",
                "/static/images/project3.webp",
                "https://omnichat-demo.example.com",
                "https://github.com/rohit/omnichat-app",
                "Python, Flask, Socket.io, JavaScript, Redis",
                "web",
                3
            ),
            (
                "EcoRoute Transit Navigation Utility",
                "Designed a mobile-first transit routing utility to address the lack of environmental footprint awareness in daily travel. It calculates carbon-efficient transit paths by combining open-source mapping APIs and multi-modal schedules. Developed using HTML5, CSS3, JavaScript, Leaflet.js, and OpenStreetMap, it resulted in a college capstone hackathon win and raised user eco-awareness.",
                "/static/images/project4.webp",
                "https://ecoroute-demo.example.com",
                "https://github.com/rohit/ecoroute-planner",
                "HTML5, CSS3, JavaScript, Leaflet.js, OpenStreetMap",
                "mobile",
                4
            )
        ]
        cursor.executemany('''
            INSERT INTO projects (title, description, image_url, live_url, github_url, tags, category, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', initial_projects)

    conn.commit()
    conn.close()
    print("Database initialized successfully with seeded data!")

if __name__ == '__main__':
    init_db()
