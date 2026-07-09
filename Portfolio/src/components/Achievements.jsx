import { motion } from 'framer-motion';

const achievements = [
  {
    id: 1,
    title: 'NPTEL Elite Certification',
    subtitle: 'IIT Kanpur | 62% Score | 3 Academic Credits',
    description: 'Awarded Elite Certification for the subject "Enhancing Soft Skills & Personality".',
    image: '/static/images/nptel_certification.webp',
  },
  {
    id: 2,
    title: 'Techno Tarang Hackathon 3.0',
    subtitle: 'Poornima College of Engineering | April 2026',
    description: 'Participated in a 24-hour innovation hackathon under the theme "Where Code Builds the Future of Earth".',
    image: '/static/images/techno_tarang_hackathon.webp',
  }
];

function Achievements() {
  return (
    <section id="achievements" className="py-24 md:py-32 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-display-sm md:text-display-md font-display font-black tracking-tighter uppercase mb-4 mix-blend-difference text-white">
          Achievements <span className="text-accent">&amp;</span> Awards
        </h2>
        <div className="h-1 w-full max-w-md bg-gradient-to-r from-accent to-transparent"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="group relative flex flex-col border border-surface-border bg-surface-dark/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-accent/50 transition-colors duration-500"
          >
            <div className="relative aspect-video overflow-hidden bg-black">
              <img 
                src={achievement.image} 
                alt={achievement.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold mb-2 text-white">{achievement.title}</h3>
              <p className="text-accent font-medium mb-4 text-sm tracking-widest uppercase">{achievement.subtitle}</p>
              <p className="text-secondary leading-relaxed">{achievement.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Achievements;
