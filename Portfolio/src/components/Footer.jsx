function Footer({ profile }) {
  const email = profile?.email || 'rohit200573@gmail.com';

  return (
    <footer className="py-12 border-t border-surface-border px-6 md:px-12 lg:px-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-secondary text-sm font-bold tracking-widest uppercase">
          &copy; 2026 Rohit Jha.
        </p>
        
        <div className="flex gap-8">
          <a href={`mailto:${email}`} className="text-secondary hover:text-primary text-sm font-bold tracking-widest uppercase transition-colors">
            {email}
          </a>
          <a href="/static/resume.pdf" target="_blank" rel="noreferrer" className="text-secondary hover:text-primary text-sm font-bold tracking-widest uppercase transition-colors">
            RESUME (PDF)
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
