import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import ScrambleText from "./ScrambleText";

const HorizontalScrollSection = ({ children }) => {
  const targetRef = useRef(null);
  const scrollRef = useRef(null);
  const scrollRange = useMotionValue(0);
  
  useEffect(() => {
    const updateScrollRange = () => {
      if (scrollRef.current) {
        scrollRange.set(scrollRef.current.scrollWidth - window.innerWidth);
      }
    };
    
    // Check multiple times as fonts and layouts resolve
    updateScrollRange();
    setTimeout(updateScrollRange, 100);
    setTimeout(updateScrollRange, 500);
    setTimeout(updateScrollRange, 1000);
    
    window.addEventListener("resize", updateScrollRange);
    return () => window.removeEventListener("resize", updateScrollRange);
  }, [scrollRange]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate the X transform dynamically based on the current scrollYProgress and the calculated scrollRange
  const x = useTransform(() => scrollYProgress.get() * -scrollRange.get());

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-surface w-screen -mx-6 md:-mx-12 lg:-mx-24 overflow-hidden">
      {/* Sticky container that stays in view while we scroll through the 400vh height */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Background text decoration */}
        <div className="absolute top-10 left-12 md:left-24 opacity-10 pointer-events-none">
          <h2 className="text-[12vw] font-display font-black leading-none whitespace-nowrap">
            EXPLORE THE IMPOSSIBLE
          </h2>
        </div>

        {/* The horizontally moving container */}
        <motion.div ref={scrollRef} style={{ x }} className="flex gap-12 md:gap-24 px-6 md:px-12 lg:px-24 w-max">
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalScrollSection;
