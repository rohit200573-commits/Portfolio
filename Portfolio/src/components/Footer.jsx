function Footer({ profile }) {
  const email = profile?.email ? profile.email : 'rohit200573@gmail.com';

  return (
    <footer className="footer">
      <p>&copy; 2026 Rohit Jha.</p>
      <div className="footer-links">
        <a href={`mailto:${email}`}>{email}</a>
        <a href="/static/resume.pdf">RESUME (PDF)</a>
      </div>
    </footer>
  );
}

export default Footer;
