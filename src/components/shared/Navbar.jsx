import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      try {
        await signInWithGoogle();
        navigate('/dashboard');
      } catch (err) {
        console.error('Sign in failed:', err);
      }
    }
  };

  const navLinks = [
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Formats', href: '#formats' },
    { label: 'Stats', href: '#stats' },
  ];

  const scrollTo = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Gradient accent line */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500" />

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]">
              <rect width="32" height="32" rx="8" fill="#818CF8"/>
              <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M16 8V24" stroke="white" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="2" fill="white"/>
            </svg>
            <span className="font-heading font-bold text-lg tracking-tight text-white">
              LATTICE
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {/* Nav links — hidden on mobile */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm">
                  Dashboard
                </button>
              ) : (
                <>
                  <button onClick={signInWithGoogle} className="btn-ghost text-sm">
                    Sign In
                  </button>
                  <button onClick={handleGetStarted} className="btn-primary text-sm">
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
