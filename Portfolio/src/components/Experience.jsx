import { motion } from 'framer-motion';

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
    <section id="experience" className="py-24 md:py-32 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-display-sm md:text-display-md font-display font-black tracking-tighter uppercase mb-4 mix-blend-difference text-white">
          Experience <span className="text-accent">&amp;</span> Journey
        </h2>
        <div className="h-1 w-full max-w-md bg-gradient-to-r from-accent to-transparent"></div>
      </motion.div>

      <div className="flex flex-col gap-8 md:gap-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-border before:to-transparent">
        
        {experiences.map((exp, index) => (
          <motion.div 
            key={exp.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: [0.76, 0, 0.24, 1] }}
            className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
          >
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-accent absolute left-0 md:left-1/2 -translate-x-1/2 z-10 group-hover:scale-125 transition-transform duration-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"></div>
            
            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 md:p-8 rounded-2xl border border-surface-border bg-surface-dark/50 backdrop-blur-md group-hover:border-accent/50 transition-colors duration-500 ml-auto md:ml-0">
              <span className="font-mono text-accent text-sm tracking-widest mb-2 block">{exp.period}</span>
              <h3 className="text-2xl font-bold text-white mb-4">{exp.role}</h3>
              <p className="text-secondary leading-relaxed">{exp.description}</p>
            </div>
          </motion.div>
        ))}

        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative flex items-center justify-center mt-8"
        >
          <div className="px-8 py-4 rounded-full border border-surface-border bg-surface-dark/80 backdrop-blur-md text-center shadow-2xl">
            <p className="text-white font-medium">
              🐙 <span className="text-accent font-bold">500+</span> GitHub commits & open-source contributions
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default Experience;
