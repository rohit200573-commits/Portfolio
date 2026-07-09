import { useState } from 'react';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <a href="#home">N'</a>
        </div>
        <div className="header-right">
          <button 
            className="menu-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation Menu" 
            aria-expanded={menuOpen} 
            aria-controls="navbar"
          >
            MENU ::
          </button>
        </div>
      </div>
      <nav id="navbar" className={`navbar ${menuOpen ? 'open' : 'hidden'}`}>
        <a href="#home" className="nav-link" onClick={() => setMenuOpen(false)}>HOME</a>
        <a href="#works" className="nav-link" onClick={() => setMenuOpen(false)}>WORKS</a>
        <a href="#skills" className="nav-link" onClick={() => setMenuOpen(false)}>STUDIO</a>
        <a href="#contact" className="nav-link" onClick={() => setMenuOpen(false)}>CONTACT</a>
      </nav>
    </header>
  );
}

export default Header;
