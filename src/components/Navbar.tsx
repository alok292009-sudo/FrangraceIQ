import React, { useState, useEffect } from 'react';
import { ArrowUpRight, User as UserIcon, LogIn, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, signInWithGoogle } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface NavbarProps {
  onOpenProfile: () => void;
}

export default function Navbar({ onOpenProfile }: NavbarProps) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navLinks = ['Search', 'How It Works', 'Popular Dupes'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setIsSigningIn(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthAction = async () => {
    if (user) {
      onOpenProfile();
    } else {
      setIsSigningIn(true);
      try {
        const u = await signInWithGoogle();
        if (!u) {
          setIsSigningIn(false);
          // Show toast if returned null (cancellation)
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } catch (error) {
        console.error("Login failed", error);
        setIsSigningIn(false);
      }
    }
  };

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
      <div className="hidden md:flex items-center gap-1 liquid-glass rounded-full px-2 py-1.5 border border-white/10 shadow-lg">
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(/ /g, '-')}`}
            className="px-5 py-2 text-sm font-bold text-white hover:bg-white/10 rounded-full transition-all font-body"
          >
            {link}
          </a>
        ))}
      </div>

      {/* Right: CTA & User Profile */}
      <div className="flex items-center gap-4">
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 font-black uppercase tracking-tighter text-xs"
            >
              <AlertCircle size={18} />
              Login was cancelled
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={handleAuthAction}
          disabled={isSigningIn}
          className={`hidden sm:flex items-center gap-2 liquid-glass border border-white/20 px-4 py-2 rounded-full text-white transition-all ${isSigningIn ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
        >
          {isSigningIn ? (
            <div className="w-4 h-4 border border-white/20 border-t-white rounded-full animate-spin" />
          ) : user ? (
            user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full border border-white/20" />
            ) : (
              <UserIcon size={16} />
            )
          ) : (
            <LogIn size={16} />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isSigningIn ? 'Syncing...' : user ? 'Profile' : 'Login'}
          </span>
        </button>
        <a href="#search" className="bg-white text-black rounded-full px-6 py-2.5 text-sm font-black flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-xl">
          Find My Dupe
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </a>
      </div>
    </motion.nav>
  );
}
