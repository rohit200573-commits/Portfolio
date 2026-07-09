import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Studio from './components/Studio';
import Works from './components/Works';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Scroll to Top Logic
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Custom Cursor Logic
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    const moveCursor = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .filter-btn, input, textarea')) {
        cursor.classList.add('hover');
      } else {
        cursor.classList.remove('hover');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Scroll Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [loading, profile]); // Re-run when DOM might have finished updating

  return (
    <div className="nothin-theme">
      <div id="custom-cursor" className="custom-cursor"></div>
      <div className="noise-overlay"></div>
      
      {loading && (
        <div id="preloader" className="preloader">
          <div className="preloader-text">ROHIT JHA</div>
        </div>
      )}
      
      <Header />
      
      <main>
        <Hero profile={profile} />
        <Studio />
        <Works />
        <Skills profile={profile} />
        <Contact />
      </main>

      <Footer profile={profile} />

      <button 
        id="scrollToTopBtn" 
        className={showScrollTop ? 'visible' : 'hidden'} 
        aria-label="Scroll back to top"
        onClick={scrollToTop}
      >
        TOP
      </button>
    </div>
  );
}

export default App;
