import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const navLinks = [
  { label: 'Opportunities', to: '/properties' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Learn', to: '/learn' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Subtle shadow once the user scrolls, matching the elevated card aesthetic.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) => location.pathname === to;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm border-b transition-shadow ${
        scrolled ? 'border-black/5 shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-[#0F3D2E] rounded-sm" />
          <span
            className="text-xl tracking-tight"
            style={{ fontFamily: "'Crimson Pro', serif", color: '#0F3D2E' }}
          >
            Headway Capital
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm transition-colors ${
                isActive(link.to) ? 'text-[#0F3D2E] font-medium border-b-2 border-[#0F3D2E] pb-1' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => navigate('/contact')}
            className="px-5 py-2.5 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg text-sm hover:bg-[#0F3D2E]/90 transition-all"
          >
            Express Interest
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-[#0F3D2E]"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden bg-[#FAF8F5] border-b border-black/5"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`py-3 text-base border-b border-black/5 ${
                    isActive(link.to) ? 'text-[#0F3D2E]' : 'text-[#4B4B4B]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => navigate('/contact')}
                className="mt-4 w-full px-5 py-3.5 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg text-sm hover:bg-[#0F3D2E]/90 transition-all"
              >
                Express Interest
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
