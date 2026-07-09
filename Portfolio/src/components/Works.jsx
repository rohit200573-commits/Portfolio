import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Works() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

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

  // GSAP ScrollTrigger for revealing project cards
  useEffect(() => {
    if (loading || projects.length === 0 || prefersReducedMotion) return;

    const cards = gsap.utils.toArray('.project-card-anim');
    
    cards.forEach((card, i) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [projects, loading, prefersReducedMotion]);

  const categories = ['all', 'web', 'ai'];

  return (
    <section id="works" ref={sectionRef} className="py-24 border-t border-surface-border">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <h2 className="text-h2 font-display font-bold tracking-tighter uppercase leading-none">
          SELECTED<br/>WORKS
        </h2>
        <div className="flex gap-4">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${category === cat ? 'bg-primary text-background' : 'bg-surface text-secondary hover:text-primary'}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {loading && (
          <div className="col-span-full py-24 flex justify-center items-center text-secondary font-bold tracking-widest text-sm animate-pulse">
            LOADING...
          </div>
        )}
        
        {error && !loading && (
          <div className="col-span-full py-24 text-center text-accent font-bold tracking-widest">
            {error}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="col-span-full py-24 text-center text-secondary font-bold tracking-widest uppercase">
            NO WORKS FOUND.
          </div>
        )}

        {!loading && !error && projects.map((proj, idx) => {
          const tagsList = proj.tags ? proj.tags.split(',').map(t => t.trim()) : [];
          
          return (
            <motion.article 
              key={proj.id} 
              className={`project-card-anim group relative overflow-hidden rounded-2xl bg-surface border border-surface-border ${idx % 2 !== 0 ? 'md:mt-24' : ''}`}
              whileHover={prefersReducedMotion ? {} : { y: -10 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <motion.img 
                  src={proj.image_url || '/static/images/project-placeholder.png'} 
                  alt={proj.title} 
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60"></div>
              </div>
              
              <div className="p-8 relative z-10 flex flex-col justify-between min-h-[220px]">
                <div>
                  <h3 className="text-h3 font-display font-bold tracking-tight mb-3">{proj.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs font-bold tracking-widest uppercase text-accent border border-accent/30 px-3 py-1 rounded-full bg-accent/10">{proj.category}</span>
                    {tagsList.map((tag, i) => (
                      <span key={i} className="text-xs font-bold tracking-widest uppercase text-secondary border border-surface-border px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <p className="text-secondary text-body-sm line-clamp-3">{proj.description}</p>
                </div>
                
                <div className="flex gap-6 mt-6">
                  {proj.live_url && (
                    <a href={proj.live_url} target="_blank" rel="noreferrer" className="text-sm font-bold tracking-widest hover:text-accent transition-colors flex items-center gap-2">
                      LIVE <span className="text-lg leading-none">&rarr;</span>
                    </a>
                  )}
                  {proj.github_url && (
                    <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-sm font-bold tracking-widest hover:text-accent transition-colors flex items-center gap-2">
                      CODE <span className="text-lg leading-none">&rarr;</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default Works;
