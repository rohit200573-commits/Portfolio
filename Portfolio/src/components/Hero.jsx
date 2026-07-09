function Hero({ profile }) {
  const firstName = profile?.name ? profile.name.split(' ')[0].toUpperCase() : 'ROHIT';
  const bio = profile?.bio ? profile.bio : 'Creative developer & AI specialist';

  return (
    <section id="home" className="hero reveal-on-scroll">
      <div className="hero-top">
        <div className="hero-tagline">
          <p>NOT A STYLE, A PERSPECTIVE.</p>
          <p>BECAUSE CODE IS EVERYTHIN'.</p>
        </div>
        <div className="hero-cta">
          <a href="#contact" className="btn-pill">BOOK A CALL &rarr;</a>
        </div>
      </div>

      <div className="hero-center">
        <h1 className="massive-name">{profile?.name || 'ROHIT'}</h1>
        <div className="hero-avatar-container">
          <img src="/static/images/avatar.webp" alt="Rohit Avatar" className="hero-avatar" />
        </div>
      </div>

      <div className="hero-bottom">
        <p className="hero-bio-text">
          {bio}<br />Based in Jaipur, India
        </p>
        
        <div className="scroll-indicator">
          <a href="#studio" aria-label="Scroll down" style={{ textDecoration: 'none', color: 'var(--text-dark)' }}>
             &darr; SCROLL
          </a>
        </div>

        <div className="social-links">
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub Profile">GITHUB</a>
          )}
          {profile?.linkedin && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn Profile">LINKEDIN</a>
            </>
          )}
          {profile?.twitter && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <a href={profile.twitter} target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter Profile">TWITTER</a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
