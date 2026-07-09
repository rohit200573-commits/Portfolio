import { Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

const HeroScene = lazy(() => import('./3d/HeroScene'));

function Hero({ profile }) {
  const firstName = profile?.name ? profile.name.split(' ')[0].toUpperCase() : 'ROHIT';
  const bio = profile?.bio || 'Creative developer & AI specialist';
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-between py-24 z-10">
      
      {/* 3D Background Element - Only render if motion is allowed */}
      {!prefersReducedMotion && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60vh] max-w-lg opacity-40 md:opacity-60 pointer-events-none -z-10">
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: false, powerPreference: "high-performance" }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <HeroScene />
              <Environment preset="city" />
            </Canvas>
          </Suspense>
        </div>
      )}

      {/* Static Fallback for reduced motion */}
      {prefersReducedMotion && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-accent to-indigo-light opacity-20 blur-3xl pointer-events-none -z-10"></div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-between items-start"
      >
        <motion.div variants={itemVariants} className="text-body-sm md:text-body-md font-medium text-secondary uppercase tracking-widest max-w-xs">
          <p>NOT A STYLE, A PERSPECTIVE.</p>
          <p>BECAUSE CODE IS EVERYTHIN'.</p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <a href="#contact" className="inline-block px-6 py-3 rounded-full border border-surface-border hover:bg-white hover:text-background transition-colors duration-300 text-sm font-bold tracking-widest">
            BOOK A CALL &rarr;
          </a>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="flex justify-center items-center my-12 relative"
      >
        <h1 className="text-massive font-display font-black tracking-tighter leading-none text-center premium-gradient-text mix-blend-screen">
          {firstName}
        </h1>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row justify-between items-end gap-8"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center md:items-start gap-4 max-w-md">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-surface-border shrink-0">
            <img src="/static/images/avatar.webp" alt="Rohit Jha" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
          <p className="text-body-lg text-secondary">
            {bio}<br />
            <span className="text-primary font-medium mt-2 block">Based in Jaipur, India</span>
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-4 items-center">
          <span className="text-sm font-bold tracking-widest text-secondary uppercase mr-4 animate-bounce">
            &darr; SCROLL
          </span>
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-sm font-bold tracking-widest hover:text-accent transition-colors">GITHUB</a>
          )}
          {profile?.linkedin && (
            <>
              <span className="text-secondary">/</span>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-sm font-bold tracking-widest hover:text-accent transition-colors">LINKEDIN</a>
            </>
          )}
          {profile?.twitter && (
            <>
              <span className="text-secondary">/</span>
              <a href={profile.twitter} target="_blank" rel="noreferrer" className="text-sm font-bold tracking-widest hover:text-accent transition-colors">TWITTER</a>
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
