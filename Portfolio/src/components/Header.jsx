import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className={`mx-auto px-6 md:px-12 lg:px-24 flex justify-between items-center`}>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="logo"
          >
            <a href="#home" className="text-2xl font-display font-black tracking-tighter text-primary">N'</a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <button 
              className="text-sm font-bold tracking-widest text-primary hover:text-accent transition-colors uppercase z-[60] relative mix-blend-difference"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation Menu" 
              aria-expanded={menuOpen} 
              aria-controls="navbar"
            >
              {menuOpen ? 'CLOSE ::' : 'MENU ::'}
            </button>
          </motion.div>

        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav 
            id="navbar"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-8"
          >
            {['HOME', 'WORKS', 'STUDIO', 'CONTACT'].map((item, i) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                className="text-h1 font-display font-black tracking-tighter hover:text-accent text-stroke-hover transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
