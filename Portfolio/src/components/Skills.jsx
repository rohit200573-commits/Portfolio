function Skills({ profile }) {
  const bio = profile?.bio ? profile.bio : 'Full Stack Developer specializing in AI & Machine Learning.';
  const skills = profile?.skills || [];

  return (
    <section id="skills" className="skills-section reveal-on-scroll">
      <div className="skills-header">
        <h2>THE METHOD</h2>
        <p>THE STEP ASIDE</p>
        <p className="skills-bio">{bio}</p>
      </div>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div key={index} className="skill-badge">
            <span className="skill-name">{skill}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
