from flask import Flask, jsonify, request, send_from_directory, Response
from flask_cors import CORS
from functools import wraps
import sqlite3
import json
import os
import time
import html
from collections import defaultdict

# We point static_folder to '../static' so Flask serves files from the static/ folder
app = Flask(__name__, static_folder='../static')
CORS(app)  # Enable Cross-Origin Resource Sharing

# Admin password for local authorization (demo purposes)
ADMIN_PASSWORD = "admin"

# Simple in-memory rate limiter: 5 requests per minute per IP
MESSAGE_LIMIT = 5
TIME_WINDOW = 60 # seconds
ip_request_history = defaultdict(list)

def is_rate_limited(ip):
    now = time.time()
    ip_request_history[ip] = [t for t in ip_request_history[ip] if now - t < TIME_WINDOW]
    if len(ip_request_history[ip]) >= MESSAGE_LIMIT:
        return True
    ip_request_history[ip].append(now)
    return False

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or auth.username != 'admin' or auth.password != ADMIN_PASSWORD:
            return Response(
                'Could not verify your access level for that URL.\n'
                'You have to login with proper credentials', 401,
                {'WWW-Authenticate': 'Basic realm="Login Required"'}
            )
        return f(*args, **kwargs)
    return decorated

def get_db_connection():
    # portfolio.db is at the root of the project (one level up from api/)
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'portfolio.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def sanitize_input(text):
    if not text:
        return ""
    return html.escape(str(text).strip())

def check_auth():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return False
    token = auth_header.split(' ')[1]
    return token == ADMIN_PASSWORD

@app.after_request
def add_security_headers(response):
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'no-referrer-when-downgrade'
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: https://rohit-portfolio-pi-mocha.vercel.app; "
        "connect-src 'self';"
    )
    return response

# --- Static File Routing ---

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/admin')
@requires_auth
def admin():
    return send_from_directory(app.static_folder, 'admin.html')

@app.route('/robots.txt')
def robots():
    return send_from_directory(app.static_folder, 'robots.txt')

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory(app.static_folder, 'sitemap.xml')

# --- API Endpoints ---

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    password = data.get('password')
    if password == ADMIN_PASSWORD:
        return jsonify({"success": True, "token": ADMIN_PASSWORD})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

# Projects Endpoints
@app.route('/api/projects', methods=['GET'])
def get_projects():
    category = request.args.get('category')
    conn = get_db_connection()
    if category and category != 'all':
        projects = conn.execute(
            'SELECT * FROM projects WHERE category = ? ORDER BY display_order ASC', 
            (category,)
        ).fetchall()
    else:
        projects = conn.execute('SELECT * FROM projects ORDER BY display_order ASC').fetchall()
    conn.close()
    return jsonify([dict(row) for row in projects])

@app.route('/api/projects', methods=['POST'])
def add_project():
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json() or {}
    title = data.get('title')
    description = data.get('description')
    image_url = data.get('image_url', '/static/images/project-placeholder.png')
    live_url = data.get('live_url', '')
    github_url = data.get('github_url', '')
    tags = data.get('tags', '')
    category = data.get('category', 'web')
    
    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    # Find next display order
    order_row = conn.execute('SELECT MAX(display_order) FROM projects').fetchone()
    next_order = (order_row[0] or 0) + 1
    
    cursor.execute('''
        INSERT INTO projects (title, description, image_url, live_url, github_url, tags, category, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (title, description, image_url, live_url, github_url, tags, category, next_order))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Project added successfully!"})

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401
        
    data = request.get_json() or {}
    title = data.get('title')
    description = data.get('description')
    image_url = data.get('image_url')
    live_url = data.get('live_url')
    github_url = data.get('github_url')
    tags = data.get('tags')
    category = data.get('category')
    
    conn = get_db_connection()
    project = conn.execute('SELECT * FROM projects WHERE id = ?', (project_id,)).fetchone()
    if not project:
        conn.close()
        return jsonify({"error": "Project not found"}), 404
        
    conn.execute('''
        UPDATE projects
        SET title = COALESCE(?, title),
            description = COALESCE(?, description),
            image_url = COALESCE(?, image_url),
            live_url = COALESCE(?, live_url),
            github_url = COALESCE(?, github_url),
            tags = COALESCE(?, tags),
            category = COALESCE(?, category)
        WHERE id = ?
    ''', (title, description, image_url, live_url, github_url, tags, category, project_id))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Project updated successfully!"})

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401
        
    conn = get_db_connection()
    project = conn.execute('SELECT * FROM projects WHERE id = ?', (project_id,)).fetchone()
    if not project:
        conn.close()
        return jsonify({"error": "Project not found"}), 404
        
    conn.execute('DELETE FROM projects WHERE id = ?', (project_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Project deleted successfully!"})

# Contact Messages Endpoints
@app.route('/api/messages', methods=['GET'])
def get_messages():
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401
        
    conn = get_db_connection()
    messages = conn.execute('SELECT * FROM messages ORDER BY created_at DESC').fetchall()
    conn.close()
    return jsonify([dict(row) for row in messages])

@app.route('/api/messages/<int:msg_id>', methods=['DELETE'])
def delete_message(msg_id):
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401
        
    conn = get_db_connection()
    conn.execute('DELETE FROM messages WHERE id = ?', (msg_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Message deleted successfully!"})

@app.route('/api/messages', methods=['POST'])
def send_message():
    ip = request.remote_addr
    if is_rate_limited(ip):
        return jsonify({"error": "Too many requests. Please try again after a minute."}), 429

    data = request.get_json() or {}
    
    # Honeypot Check
    website = data.get('website')
    if website:
        return jsonify({"success": True, "message": "Message sent successfully!"})

    name = sanitize_input(data.get('name'))
    email = sanitize_input(data.get('email'))
    subject = sanitize_input(data.get('subject', 'No Subject'))
    message = sanitize_input(data.get('message'))
    
    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required"}), 400
        
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO messages (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    ''', (name, email, subject, message))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Message sent successfully!"})

# Profile Info Endpoints
@app.route('/api/profile', methods=['GET'])
def get_profile():
    conn = get_db_connection()
    profile = conn.execute('SELECT * FROM profile ORDER BY id DESC LIMIT 1').fetchone()
    conn.close()
    if profile:
        profile_dict = dict(profile)
        try:
            profile_dict['skills'] = json.loads(profile_dict['skills'])
        except Exception:
            pass
        return jsonify(profile_dict)
    return jsonify({"error": "Profile not found"}), 404

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401
        
    data = request.get_json() or {}
    name = data.get('name')
    title = data.get('title')
    bio = data.get('bio')
    email = data.get('email')
    linkedin = data.get('linkedin')
    github = data.get('github')
    twitter = data.get('twitter')
    skills = data.get('skills')  # Expect list of strings
    
    conn = get_db_connection()
    profile = conn.execute('SELECT id FROM profile ORDER BY id DESC LIMIT 1').fetchone()
    
    if skills is not None and isinstance(skills, list):
        skills_str = json.dumps(skills)
    else:
        skills_str = None
        
    if profile:
        profile_id = profile['id']
        conn.execute('''
            UPDATE profile
            SET name = COALESCE(?, name),
                title = COALESCE(?, title),
                bio = COALESCE(?, bio),
                email = COALESCE(?, email),
                linkedin = COALESCE(?, linkedin),
                github = COALESCE(?, github),
                twitter = COALESCE(?, twitter),
                skills = COALESCE(?, skills)
            WHERE id = ?
        ''', (name, title, bio, email, linkedin, github, twitter, skills_str, profile_id))
    else:
        conn.execute('''
            INSERT INTO profile (name, title, bio, email, linkedin, github, twitter, skills)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, title, bio, email, linkedin, github, twitter, skills_str))
        
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Profile updated successfully!"})
