import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faTwitter, faGithub, faUpwork } from "@fortawesome/free-brands-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import "../styles/header.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo/Brand */}
        <Link to="/" className="header-logo" onClick={closeMobileMenu}>
          <div className="logo-icon">
            <FontAwesomeIcon icon={faHome} />
          </div>
          <div>
            <p className="logo-subtitle">Designer</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link" activeClassName="active">
                Portfolio
              </Link>
            </li>
            <li>
              <Link to="/infographic" className="nav-link" activeClassName="active">
                Infographics
              </Link>
            </li>
            <li>
              <Link to="/linkedin" className="nav-link" activeClassName="active">
                LinkedIn Posts
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link" activeClassName="active">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="nav-link" activeClassName="active">
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="nav-link" activeClassName="active">
                Contact
              </Link>
            </li>
          </ul>

          {/* Navigation Social Links */}
          <div className="header-nav-social">
            <a 
              href="https://www.upwork.com/freelancers/~0179dc344f6192cef1" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-social-link"
              title="Upwork Profile"
            >
              <FontAwesomeIcon icon={faUpwork} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-social-link"
              title="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-social-link"
              title="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>

          {/* CTA Button */}
          <Link to="/contact" className="header-cta">
            Get In Touch
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="mobile-nav-links">
            <li>
              <Link to="/" className="mobile-nav-link" activeClassName="active" onClick={closeMobileMenu}>
                Portfolio
              </Link>
            </li>
            <li>
              <Link to="/infographic" className="mobile-nav-link" activeClassName="active" onClick={closeMobileMenu}>
                Infographics
              </Link>
            </li>
            <li>
              <Link to="/linkedin" className="mobile-nav-link" activeClassName="active" onClick={closeMobileMenu}>
                LinkedIn Posts
              </Link>
            </li>
            <li>
              <Link to="/about" className="mobile-nav-link" activeClassName="active" onClick={closeMobileMenu}>
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="mobile-nav-link" activeClassName="active" onClick={closeMobileMenu}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="mobile-nav-link" activeClassName="active" onClick={closeMobileMenu}>
                Contact
              </Link>
            </li>
          </ul>
          
          {/* Mobile Navigation Social Links */}
          <div className="mobile-nav-social">
            <a 
              href="https://www.upwork.com/freelancers/~0179dc344f6192cef1" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mobile-nav-social-link"
              title="Upwork Profile"
            >
              <FontAwesomeIcon icon={faUpwork} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mobile-nav-social-link"
              title="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mobile-nav-social-link"
              title="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
          
          <div className="mobile-cta">
            <Link to="/contact" className="header-cta" onClick={closeMobileMenu}>
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
