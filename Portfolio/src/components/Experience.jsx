import { motion } from 'framer-motion';
import HorizontalScrollSection from './HorizontalScrollSection';
import ScrambleText from './ScrambleText';

const experiences = [
  {
    id: 1,
    period: '2026 – Present',
    role: 'Full Stack & AI Integration',
    description: 'Developing responsive web apps and RESTful APIs using React, Flask, and SQLite. Focused on seamlessly integrating deep learning models into production-ready web environments.',
  },
  {
    id: 2,
    period: '2025 – 2026',
    role: 'Deep Learning & Computer Vision',
    description: 'Built Convolutional Neural Networks (CNNs) for medical image classification using Python and TensorFlow, achieving 95%+ triage accuracy. Implemented robust data preprocessing and model optimization.',
  }
];

function Experience() {
  return (
    <HorizontalScrollSection>
      <div className="w-[90vw] md:w-[60vw] h-full flex flex-col justify-center px-6">
        <h2 className="text-massive font-display font-black tracking-tighter uppercase mb-4 text-white leading-none">
          <ScrambleText text="EXPERIENCE" delay={200} duration={1500} />
          <br /><span className="text-accent">&amp; JOURNEY</span>
        </h2>
        <p className="font-mono text-secondary max-w-md">
          Continuous evolution through code. Pushing boundaries in full-stack development and AI integration.
        </p>
      </div>

      {experiences.map((exp, index) => (
        <div 
          key={exp.id}
          className="w-[85vw] md:w-[50vw] h-full flex flex-col justify-center shrink-0 group"
        >
          <div className="p-8 md:p-12 h-[60vh] max-h-[600px] rounded-3xl border border-surface-border bg-surface-dark/50 backdrop-blur-md group-hover:border-accent/50 transition-colors duration-500 flex flex-col justify-between">
            <div>
              <span className="font-mono text-accent text-lg tracking-widest mb-4 block"><ScrambleText text={exp.period} delay={500} /></span>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase tracking-tight">{exp.role}</h3>
              <p className="text-secondary text-lg md:text-xl leading-relaxed">{exp.description}</p>
            </div>
            
            <div className="flex justify-end">
              <div className="w-16 h-16 rounded-full border border-surface-border flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-colors duration-300">
                &rarr;
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="w-[80vw] md:w-[40vw] h-full flex flex-col justify-center shrink-0">
        <div className="px-12 py-16 rounded-3xl border border-surface-border bg-surface-dark/80 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center h-[60vh] max-h-[600px]">
          <h3 className="text-massive font-display font-black text-accent mb-4">500+</h3>
          <p className="text-white font-mono text-xl text-center uppercase tracking-widest">
            GitHub commits &<br />open-source contributions
          </p>
        </div>
      </div>
    </HorizontalScrollSection>
  );
}

export default Experience;
