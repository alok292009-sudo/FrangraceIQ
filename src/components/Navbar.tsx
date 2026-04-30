import React, { useState, useEffect } from 'react';
import { ArrowUpRight, User as UserIcon, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db, signInWithGoogle, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface NavbarProps {
  onOpenProfile: () => void;
}

export default function Navbar({ onOpenProfile }: NavbarProps) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const navLinks = ['Search', 'How It Works', 'Popular Dupes'];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setIsSigningIn(false);
        fetchCustomAvatar(u.uid);
      } else {
        setCustomAvatar(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchCustomAvatar = async (uid: string) => {
    const path = `users/${uid}`;
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setCustomAvatar(userDoc.data().customAvatar);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

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
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 md:px-12 flex items-center justify-between ${
        scrolled ? 'py-4 bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'py-8 bg-transparent'
      }`}
    >
      {/* Left: Branding */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-[0_10px_40px_rgba(255,255,255,0.3)]">
          <span className="text-black font-heading italic text-2xl font-bold leading-none">f</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-heading italic font-bold tracking-tight text-white leading-none">
            FragranceIQ
          </h1>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 hidden md:block">Scent Intelligence</span>
        </div>
      </div>

      {/* Center: Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-1.5 liquid-glass rounded-full px-2 py-1.5 border border-white/10 shadow-2xl bg-white/5 backdrop-blur-3xl">
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(/ /g, '-')}`}
            className="px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all duration-500 relative group overflow-hidden"
          >
            <span className="relative z-10">{link}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
          className={`hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full text-white transition-all duration-500 relative group overflow-hidden ${
            isSigningIn ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
          } ${
            user ? 'bg-white/5 border border-white/20' : 'bg-white text-black'
          }`}
        >
          {isSigningIn ? (
            <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
          ) : user ? (
            user.photoURL ? (
              <div className="relative">
                <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full border border-white/20 group-hover:border-white/50 transition-colors" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-black rounded-full" />
              </div>
            ) : customAvatar ? (
              <div className="relative">
                <div 
                  className="w-6 h-6 rounded-full border border-yellow-400/30 bg-black overflow-hidden flex items-center justify-center p-0.5"
                  dangerouslySetInnerHTML={{ __html: customAvatar }}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-yellow-400 border border-black rounded-full shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
              </div>
            ) : (
              <div className="relative">
                <UserIcon size={16} />
                <Sparkles size={8} className="absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
              </div>
            )
          ) : (
            <LogIn size={16} />
          )}
          <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${user ? 'text-white' : 'text-black'}`}>
            {isSigningIn ? 'Syncing' : user ? (user.displayName?.split(' ')[0] || 'Profile') : 'Access'}
          </span>
          {!user && !isSigningIn && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          )}
        </button>
        <a href="#search" className="bg-white text-black rounded-full px-6 py-2.5 text-sm font-black flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-xl">
          Find My Dupe
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </a>
      </div>
    </motion.nav>
  );
}
