import { useState, useEffect } from 'react';

function Works() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        const url = category === 'all' ? '/api/projects' : `/api/projects?category=${category}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError(`FAILED TO LOAD WORKS. Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [category]);

  return (
    <section id="works" className="works reveal-on-scroll">
      <div className="works-header">
        <h2>SELECTED WORKS</h2>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${category === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
          >
            ALL
          </button>
          <button 
            className={`filter-btn ${category === 'web' ? 'active' : ''}`}
            onClick={() => setCategory('web')}
          >
            WEB
          </button>
          <button 
            className={`filter-btn ${category === 'ai' ? 'active' : ''}`}
            onClick={() => setCategory('ai')}
          >
            AI
          </button>
        </div>
      </div>
      <div className="works-list">
        {loading && (
          <div className="loading-state">
            <div className="loader"></div>
            <p>LOADING...</p>
          </div>
        )}
        
        {error && !loading && (
          <div className="error-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="empty-state">
            <p>NO WORKS FOUND.</p>
          </div>
        )}

        {!loading && !error && projects.map(proj => {
          const tagsList = proj.tags ? proj.tags.split(',').map(t => t.trim()) : [];
          
          const handleMouseMove = (e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
          };

          const handleMouseLeave = (e) => {
            const card = e.currentTarget;
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
          };

          return (
            <article 
              key={proj.id} 
              className="project-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transition: 'transform 0.1s ease-out', transformStyle: 'preserve-3d' }}
            >
              <div className="project-image-container" style={{ transform: 'translateZ(30px)' }}>
                <img 
                  src={proj.image_url || '/static/images/project-placeholder.png'} 
                  alt={proj.title} 
                  className="project-image" 
                  loading="lazy" 
                />
              </div>
              <div className="project-info" style={{ transform: 'translateZ(40px)' }}>
                <div>
                  <h3 className="project-title">{proj.title}</h3>
                  <div className="project-tags">
                    <span className="project-tag">{proj.category}</span>
                    {tagsList.map((tag, i) => (
                      <span key={i} className="project-tag">{tag}</span>
                    ))}
                  </div>
                  <p className="project-description">{proj.description}</p>
                </div>
                <div className="project-links">
                  {proj.live_url && (
                    <a href={proj.live_url} target="_blank" rel="noreferrer" className="project-link">
                      LIVE &rArr;
                    </a>
                  )}
                  {proj.github_url && (
                    <a href={proj.github_url} target="_blank" rel="noreferrer" className="project-link">
                      CODE &rArr;
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Works;
