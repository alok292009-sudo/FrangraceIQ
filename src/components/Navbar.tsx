
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const navLinks = ['Search', 'How It Works', 'Popular Dupes'];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-3"
    >
      {/* Left: Branding */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl md:text-2xl font-heading italic font-bold tracking-tight text-white hover:opacity-80 transition-opacity cursor-default">
          FragranceIQ
        </h1>
      </div>

      {/* Center: Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1 liquid-glass rounded-full px-1.5 py-1">
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(/ /g, '-')}`}
            className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors font-body"
          >
            {link}
          </a>
        ))}
      </div>

      {/* Right: CTA */}
      <div>
        <a href="#search" className="liquid-glass-strong text-white rounded-full px-5 py-2 text-sm font-medium flex items-center gap-1.5 transition-all active:scale-95">
          Find My Dupe
          <ArrowUpRight size={16} />
        </a>
      </div>
    </motion.nav>
  );
}
