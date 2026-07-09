import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

function Skills({ profile }) {
  const bio = profile?.bio || 'Full Stack Developer specializing in AI & Machine Learning.';
  const skills = profile?.skills || [];
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const badges = gsap.utils.toArray('.skill-badge-anim');
    gsap.fromTo(badges,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [skills, prefersReducedMotion]);

  return (
    <section id="skills" ref={sectionRef} className="py-32 border-t border-surface-border">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">THE METHOD</h2>
          <h3 className="text-h2 font-display font-bold tracking-tighter leading-none mb-8">
            THE STEP<br/>ASIDE
          </h3>
          <p className="text-body-lg text-secondary max-w-md leading-relaxed">
            {bio}
          </p>
        </div>

        <div className="lg:col-span-7 flex flex-wrap content-center gap-3 md:gap-4">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className="skill-badge-anim border border-surface-border bg-surface px-5 py-3 rounded-full hover:bg-primary hover:text-background transition-colors duration-300 cursor-default"
            >
              <span className="text-sm font-bold tracking-widest uppercase">{skill}</span>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

export default Skills;
