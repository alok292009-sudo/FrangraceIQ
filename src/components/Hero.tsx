import { ArrowUpRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BlurText from './BlurText';
import React, { useState, useEffect } from 'react';

interface HeroProps {
  search: (val: string, budget: string) => void;
  status: string;
}

export default function Hero({ search, status }: HeroProps) {
  const [inputValue, setInputValue] = useState('');
  const [budget, setBudget] = useState('₹300');
  const [history, setHistory] = useState<string[]>([]);
  const staticSuggestions = ['Dior Sauvage', 'Creed Aventus', 'YSL Black Opium'];

  const budgetOptions = ['₹150', '₹300', '₹500', '₹1000', '₹2000'];

  useEffect(() => {
    const savedHistory = localStorage.getItem('fragrance_search_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse search history', e);
      }
    }
  }, []);

  const addToHistory = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const newHistory = [trimmedName, ...history.filter(h => h.toLowerCase() !== trimmedName.toLowerCase())].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('fragrance_search_history', JSON.stringify(newHistory));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      search(inputValue, budget);
      addToHistory(inputValue);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setInputValue(name);
    search(name, budget);
    addToHistory(name);
  };

  const displaySuggestions = history.length > 0 ? history : staticSuggestions;

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center pt-20" id="search">
      {/* Background Video with enhanced overlays */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
            type="video/mp4"
          />
        </video>
        {/* Depth Layers */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="liquid-glass border border-white/20 rounded-full px-8 py-3 mb-10 flex items-center justify-center backdrop-blur-3xl shadow-[0_10px_40px_rgba(255,255,255,0.05)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="text-white font-black text-[9px] md:text-[11px] uppercase tracking-[0.6em] relative z-10">
            SCENT DNA DECODED. LUXURY REDEFINED.
          </span>
        </motion.div>

        <div className="relative mb-8">
          <BlurText
            text="Find Your Perfect Dupe."
            className="text-6xl md:text-8xl lg:text-[7rem] font-heading italic text-white leading-[0.85] tracking-tight md:tracking-[-4px] drop-shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            delay={100}
          />
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute -right-8 -top-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter rotate-12 shadow-xl hidden md:block"
          >
            Matches for India
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "circOut" }}
          className="text-white/90 font-body font-bold text-lg md:text-2xl max-w-2xl leading-relaxed mb-12 drop-shadow-xl px-4"
        >
          Decode high-end scent DNA. We find the most accurate Indian clones, attars, and local alternatives—all within your budget.
        </motion.p>

        {/* Search Bar & Budget Area */}
        <div className="w-full max-w-3xl flex flex-col gap-8 px-4">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease: "circOut" }}
            className="liquid-glass-strong rounded-[2rem] md:rounded-full p-2.5 flex flex-col md:flex-row items-center gap-2 w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-white/20"
          >
            <div className="flex-1 flex items-center w-full px-6 py-1">
              <span className="text-white/30 mr-3 hidden md:block">
                <Play size={18} fill="currentColor" />
              </span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search perfume: 'Dior Sauvage', 'Baccarat Rouge'..."
                className="flex-1 bg-transparent text-white placeholder-white/50 text-base md:text-lg font-bold outline-none py-3 w-full"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-white text-black rounded-xl md:rounded-full w-full md:w-auto px-10 py-5 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-yellow-400 active:scale-95 disabled:opacity-50 relative overflow-hidden group shadow-2xl"
            >
              <span className="relative z-10">{status === 'loading' ? 'Analyzing DNA...' : 'Find Matches'}</span>
              <ArrowUpRight size={18} strokeWidth={3} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.form>

          {/* Budget Quick Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: "circOut" }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">SET YOUR PRICE CEILING</span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 p-2 liquid-glass rounded-3xl border border-white/10 shadow-2xl bg-white/5 backdrop-blur-3xl">
               {budgetOptions.map((opt) => (
                 <button
                   key={opt}
                   type="button"
                   onClick={() => setBudget(opt)}
                   className={`px-7 py-3.5 rounded-2xl text-[9px] md:text-[11px] transition-all duration-700 font-black uppercase tracking-[0.2em] relative overflow-hidden group ${
                     budget === opt 
                     ? 'bg-white text-black shadow-2xl scale-105 border-white' 
                     : 'text-white/30 hover:text-white hover:bg-white/5 border-transparent'
                   }`}
                 >
                   <span className="relative z-10">{opt}</span>
                   {budget === opt && (
                     <motion.div 
                       layoutId="budget-active"
                       className="absolute inset-0 bg-white"
                       transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                     />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                 </button>
               ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Suggestions */}
        <AnimatePresence>
          {inputValue === '' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="flex flex-wrap justify-center gap-3 mt-12 max-w-2xl"
            >
              {displaySuggestions.map((name, i) => (
                <motion.button
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + (i * 0.1) }}
                  onClick={() => handleSuggestionClick(name)}
                  className="liquid-glass rounded-xl px-5 py-2.5 text-[10px] md:text-xs text-white/70 hover:text-black hover:bg-white transition-all font-black uppercase tracking-widest border border-white/5 shadow-xl hover:scale-110 active:scale-95"
                >
                  {name}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
