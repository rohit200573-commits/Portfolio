import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Studio from './components/Studio';
import Works from './components/Works';
import Achievements from './components/Achievements';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

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
        setTimeout(() => setLoading(false), 800); // give preloader some breathing room
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

  return (
    <div className="relative min-h-screen bg-background text-primary overflow-hidden">
      <div className="noise-overlay pointer-events-none"></div>
      
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          >
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-massive font-display font-black tracking-tighter"
            >
              R.
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Header />
      
      <main className="px-6 md:px-12 lg:px-24">
        <Hero profile={profile} />
        <div className="relative z-10">
          <Studio />
          <Works />
          <Achievements />
          <Experience />
          <Skills profile={profile} />
          <Contact />
        </div>
      </main>

      <Footer profile={profile} />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-surface border border-surface-border backdrop-blur-md px-6 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-white hover:text-background transition-colors duration-300"
            aria-label="Scroll back to top"
          >
            TOP
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
