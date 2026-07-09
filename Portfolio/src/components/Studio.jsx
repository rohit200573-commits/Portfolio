import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';

function Studio() {
  const marqueeRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !marqueeRef.current) return;

    // Create seamless marquee using GSAP
    const marquee = marqueeRef.current;
    
    // Duplicate content for seamless loop is already in JSX
    const tween = gsap.to(marquee, {
      xPercent: -33.33333, // Since there are 3 identical spans, move by 1/3
      ease: "none",
      duration: 15,
      repeat: -1
    });

    return () => tween.kill();
  }, [prefersReducedMotion]);

  return (
    <section className="py-24 overflow-hidden border-t border-surface-border bg-accent/5 relative" id="studio">
      <div className="flex whitespace-nowrap opacity-20 pointer-events-none" ref={marqueeRef}>
        <div className="flex gap-8 px-4 text-massive font-display font-black tracking-tighter">
          <span className="text-stroke">MOST DEVELOPERS PRODUCE CODE. <strong className="text-primary" style={{ WebkitTextStroke: '0' }}>WE PREFER IDEAS.</strong> &nbsp;&mdash;&nbsp;</span>
          <span className="text-stroke">MOST DEVELOPERS PRODUCE CODE. <strong className="text-primary" style={{ WebkitTextStroke: '0' }}>WE PREFER IDEAS.</strong> &nbsp;&mdash;&nbsp;</span>
          <span className="text-stroke">MOST DEVELOPERS PRODUCE CODE. <strong className="text-primary" style={{ WebkitTextStroke: '0' }}>WE PREFER IDEAS.</strong> &nbsp;&mdash;&nbsp;</span>
        </div>
      </div>
    </section>
  );
}

export default Studio;
