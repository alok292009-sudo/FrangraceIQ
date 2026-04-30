import { ArrowUpRight, Play } from 'lucide-react';
import { motion } from 'motion/react';
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

  const budgetOptions = ['₹150', '₹300', '₹500', '₹1000'];

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
    <section className="relative overflow-visible h-[1000px] flex flex-col items-center" id="search">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute left-0 w-full h-[80%] object-cover z-0 top-[10%]"
        poster="/images/hero_bg.jpeg"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/10 z-0" />
      <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center pt-[180px] px-6 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="liquid-glass rounded-full px-1 py-1 flex items-center gap-3 mb-10"
        >
          <span className="bg-white text-black rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
            AI POWERED
          </span>
          <span className="text-white/90 text-xs md:text-sm font-body px-2">
            Powered by Gemini AI Intelligence.
          </span>
        </motion.div>

        <BlurText
          text="Find Your Perfect Dupe."
          className="text-6xl md:text-7xl lg:text-[5.8rem] font-heading italic text-white leading-[0.85] tracking-[-3px] mb-8"
          delay={100}
        />

        <motion.p
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/80 font-body font-light text-base md:text-lg max-w-xl leading-relaxed mb-8"
        >
          Enter any luxury perfume. AI decodes its scent DNA and finds the closest Indian market matches within your budget.
        </motion.p>

        {/* Search Bar & Budget */}
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass-strong rounded-full p-2 flex items-center gap-2 w-full"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Try 'Dior Sauvage' or 'Creed Aventus'..."
              className="flex-1 bg-transparent text-white placeholder-white/40 text-sm md:text-base font-body outline-none px-6"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-white text-black rounded-full px-6 py-3 text-sm font-medium flex items-center gap-1.5 transition-all hover:bg-white/90 active:scale-95 disabled:opacity-50"
            >
              {status === 'loading' ? 'Searching...' : 'Find Dupe'}
              <ArrowUpRight size={16} />
            </button>
          </motion.form>

          {/* Budget Selector */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-white/30 text-[10px] uppercase tracking-[0.2em]">Select Your Budget</span>
            <div className="flex gap-2 p-1.5 liquid-glass rounded-full">
              {budgetOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setBudget(opt)}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all duration-300 ${
                    budget === opt 
                    ? 'bg-white text-black font-medium' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Suggestions */}
        {inputValue === '' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-3 mt-8 max-w-xl"
          >
            <div className="w-full text-white/30 text-[10px] uppercase tracking-[0.2em] mb-1">
              {history.length > 0 ? 'Recent Searches' : 'Popular Suggestions'}
            </div>
            {displaySuggestions.map((name) => (
              <button
                key={name}
                onClick={() => handleSuggestionClick(name)}
                className="liquid-glass rounded-full px-4 py-1.5 text-xs text-white/50 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                {name}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Decorative Blur Bottom */}
      <div className="mt-auto h-[200px]" />
    </section>
  );
}
