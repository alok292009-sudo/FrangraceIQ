
import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ResultCard from './ResultCard';

const loadingMessages = [
  "Decoding scent DNA...",
  "Scanning r/DesiFragranceAddicts...",
  "Searching YouTube (Joy Amin & others)...",
  "Checking Instagram reviews...",
  "Scanning Scentedelic & Scentrix inventory...",
  "Calculating similarity scores...",
  "Eliminating synthetic alcohol bombs...",
  "Finding hidden budget gems...",
  "Cross-referencing longevity claims...",
  "Validating market availability..."
];

const LoadingMessage = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return <span>{loadingMessages[index]}</span>;
};

interface ResultsSectionProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: any;
  error: string | null;
  lastQuery: string;
  lastBudget: string;
  search: (val: string, budget?: string) => void;
}

export default function ResultsSection({ status, data, error, lastQuery, lastBudget, search }: ResultsSectionProps) {
  if (status === 'idle') return null;

  return (
    <section className="w-full bg-black py-16 md:py-20 px-4 md:px-16" id="results">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col items-center gap-2 mb-6">
                <motion.p 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                  className="text-white font-heading italic text-lg md:text-xl text-center"
                >
                  <LoadingMessage />
                </motion.p>
                <div className="flex gap-1">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 rounded-full bg-white/40" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 rounded-full bg-white/40" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 rounded-full bg-white/40" />
                </div>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="liquid-glass rounded-2xl p-6 md:p-8 animate-pulse border border-white/5">
                  <div className="bg-white/10 h-8 w-40 md:w-48 rounded-md mb-4" />
                  <div className="bg-white/5 h-4 w-24 md:w-32 rounded-md mb-10" />
                  <div className="flex flex-col gap-4">
                    <div className="bg-white/5 h-4 w-full rounded-md" />
                    <div className="bg-white/5 h-4 w-4/5 rounded-md" />
                    <div className="bg-white/5 h-4 w-3/5 rounded-md" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="liquid-glass rounded-3xl p-8 md:p-12 border-2 border-red-500/20 bg-red-500/5 flex flex-col items-center text-center gap-6 shadow-[0_0_50px_rgba(239,68,68,0.1)] backdrop-blur-2xl"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <AlertCircle size={64} className="text-red-400 md:size-[80px]" />
              </motion.div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl md:text-3xl font-heading italic text-white drop-shadow-md">Something went wrong</h3>
                <p className="text-white font-bold text-sm md:text-base max-w-sm leading-relaxed opacity-90 px-2">
                  {error === 'RATE_LIMIT' 
                    ? "Too many searches. Please wait 60 seconds." 
                    : error === 'PARSE_FAIL' 
                    ? "Couldn't decode that fragrance. Try a different spelling." 
                    : error === 'API_KEY_MISSING'
                    ? "FragranceIQ is not connected. Admin: check API key."
                    : error === 'EMPTY_RESPONSE'
                    ? "The AI didn't return a match. Try a higher budget or more popular fragrance."
                    : error?.startsWith('SEARCH_ERROR')
                    ? error.replace('SEARCH_ERROR: ', '')
                    : "Our AI is thinking too hard. Try again in a moment."}
                </p>
              </div>

              {/* Budget options on retry */}
              <div className="flex flex-col items-center gap-6 mt-6">
                <span className="text-white font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-60">Adjust Budget</span>
                <div className="flex flex-wrap justify-center gap-2 p-1.5 liquid-glass rounded-2xl border border-white/10 shadow-inner">
                  {['₹150', '₹300', '₹500', '₹1000'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => search(lastQuery, opt)}
                      className={`px-5 md:px-6 py-2 md:py-2.5 rounded-xl text-xs transition-all duration-300 font-black ${
                        lastBudget === opt 
                        ? 'bg-white text-black shadow-2xl scale-105' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => search(lastQuery, lastBudget)}
                className="bg-white text-black rounded-xl px-10 md:px-12 py-4 md:py-5 text-sm font-black hover:scale-110 active:scale-95 transition-all shadow-2xl mt-6 border-b-4 border-black/10"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {status === 'success' && data && (
            <motion.div 
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-10 md:gap-14"
            >
              <div className="text-center mb-4">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  className="text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] block mb-3"
                >
                  Results for
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-heading italic text-white leading-tight drop-shadow-2xl"
                >
                  {data.originalPerfume}
                </motion.h2>
                
                {/* Immediate Budget Refinement */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 md:mt-10 flex flex-col items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-px w-6 md:w-8 bg-white/20" />
                    <span className="text-white/40 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Refine Budget Range</span>
                    <div className="h-px w-6 md:w-8 bg-white/20" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 p-2 liquid-glass rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                    {['₹150', '₹300', '₹500', '₹1000', '₹2000'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => search(lastQuery, opt)}
                        className={`px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-[10px] md:text-[11px] transition-all duration-300 font-black tracking-wider ${
                          lastBudget === opt 
                          ? 'bg-white text-black shadow-[0_15px_40px_rgba(255,255,255,0.2)] scale-105' 
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        UNDER {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {data.recommendations.length === 0 && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white font-bold italic mt-12 text-lg"
                  >
                    No budget clones found that meet our quality ceiling.
                  </motion.p>
                )}
              </div>

              <div className="flex flex-col gap-12">
                {data.recommendations.map((perfume: any, idx: number) => (
                  <ResultCard 
                    key={idx}
                    index={idx}
                    perfume={perfume}
                    fragranceFamily={data.fragranceFamily}
                    dominantAccords={data.dominantAccords}
                    openingNotes={data.openingNotes}
                    drydownNotes={data.drydownNotes}
                    keyDrivers={data.keyDrivers}
                    applicationTip={data.applicationTip}
                    layeringTip={data.layeringTip}
                  />
                ))}
              </div>

              {/* Price Range Refinement after Success */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 flex flex-col items-center gap-8 py-16 border-t border-white/10"
              >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-white font-black text-[11px] uppercase tracking-[0.3em] opacity-70">Not what you're looking for?</span>
                    <p className="text-white text-lg text-center max-w-sm font-bold leading-relaxed drop-shadow-sm">
                      Try refining your budget. Higher budgets often unlock long-lasting niche dupe houses with better scent accuracy.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2.5 p-2 liquid-glass rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                    {['₹150', '₹300', '₹500', '₹1000', '₹2000'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => search(lastQuery, opt)}
                        className={`px-7 py-3 rounded-xl text-xs transition-all duration-300 font-black ${
                          lastBudget === opt 
                          ? 'bg-white text-black shadow-[0_20px_50px_rgba(255,255,255,0.3)] scale-105' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-16 p-8 md:p-12 liquid-glass rounded-[2rem] md:rounded-[3rem] border-2 border-white/10 text-center flex flex-col items-center gap-8 shadow-[0_0_100px_rgba(255,255,255,0.05)] backdrop-blur-3xl"
              >
                 <div className="flex items-center gap-6">
                    <div className="h-[1px] w-8 md:w-12 bg-white/30"></div>
                    <h4 className="text-white text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.5em]">REALITY VERDICT</h4>
                    <div className="h-[1px] w-8 md:w-12 bg-white/30"></div>
                 </div>
                 <p className="text-white font-body font-black text-2xl md:text-4xl leading-relaxed italic max-w-3xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] px-2">
                   "{data.realityVerdict}"
                 </p>
                 <div className="h-px w-full max-w-xs md:max-w-md bg-white/30" />
                 <p className="text-white font-black text-base md:text-xl leading-relaxed max-w-2xl drop-shadow-md px-4">
                   {data.budgetAdvice}
                 </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
