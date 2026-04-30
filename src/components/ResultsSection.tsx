
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

const ResultSkeleton: React.FC<{ i: number }> = ({ i }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: i * 0.2 }}
    className="liquid-glass rounded-2xl p-5 md:p-8 flex flex-col w-full relative overflow-hidden animate-pulse border border-white/5"
  >
    {/* Top Row */}
    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
      <div className="flex flex-col gap-3">
        <div className="bg-white/10 h-10 md:h-14 w-48 md:w-64 rounded-xl" />
        <div className="bg-white/5 h-4 w-32 md:w-40 rounded-lg" />
        <div className="bg-white/10 h-8 w-24 rounded-lg mt-2" />
      </div>

      <div className="flex flex-row md:flex-col items-center gap-4 self-center md:self-auto">
        <div className="w-[44px] h-[44px] rounded-full bg-white/5" />
        <div className="w-[90px] h-[90px] md:w-[110px] md:h-[110px] rounded-full border-2 border-white/10 bg-white/5 flex flex-col items-center justify-center">
          <div className="bg-white/10 h-6 w-12 rounded" />
          <div className="bg-white/5 h-2 w-8 rounded mt-2" />
        </div>
      </div>
    </div>

    {/* Price & Volume */}
    <div className="mt-8 flex items-baseline gap-3">
      <div className="bg-white/10 h-10 md:h-14 w-32 rounded-xl" />
      <div className="bg-white/5 h-4 w-16 rounded shadow-sm" />
    </div>

    {/* Scent DNA Area */}
    <div className="mt-8 bg-white/5 h-16 rounded-xl border border-white/5" />

    {/* Match Breakdown */}
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
      {[1, 2].map((i) => (
        <div key={i}>
          <div className="bg-white/10 h-3 w-32 rounded-full mb-4" />
          <div className="flex flex-col gap-3">
            {[1, 2].map((j) => (
              <div key={j} className="h-14 bg-white/5 rounded-xl border border-white/5" />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Performance Badges */}
    <div className="mt-10 flex flex-wrap gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-10 w-28 bg-white/10 rounded-xl" />
      ))}
    </div>

    {/* Verdict */}
    <div className="mt-8 h-20 bg-white/10 rounded-2xl border border-white/20" />

    {/* Buy Buttons */}
    <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
      <div className="h-14 w-full sm:w-48 bg-white/20 rounded-xl" />
      <div className="h-14 w-full sm:w-48 bg-white/10 rounded-xl" />
    </div>
  </motion.div>
);

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
                <ResultSkeleton key={i} i={i} />
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
                    : error?.startsWith('API_KEY_MISSING')
                    ? error.replace('API_KEY_MISSING: ', '')
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
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] block mb-3 drop-shadow-md"
                >
                  Results for
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-7xl lg:text-9xl font-heading italic text-white leading-[0.9] drop-shadow-[0_15px_60px_rgba(0,0,0,0.9)] mb-6"
                >
                  {data.originalPerfume}
                </motion.h2>
                
                {/* Immediate Budget Refinement */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-12 md:mt-16 flex flex-col items-center gap-8 mb-20"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-[2px] w-12 md:w-20 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                    <span className="text-white text-[12px] md:text-[14px] font-black uppercase tracking-[0.5em] drop-shadow-lg">FILTER BY MAXIMUM PRICE</span>
                    <div className="h-[2px] w-12 md:w-20 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 p-3 liquid-glass rounded-2xl border-2 border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
                    {['₹150', '₹300', '₹500', '₹1000', '₹2000'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => search(lastQuery, opt)}
                        className={`px-8 md:px-10 py-4 md:py-5 rounded-xl text-sm md:text-base transition-all duration-300 font-black tracking-widest border-2 ${
                          lastBudget === opt 
                          ? 'bg-white text-black border-white shadow-[0_20px_50px_rgba(255,255,255,0.4)] scale-115 z-10' 
                          : 'text-white border-transparent hover:border-white/40 hover:bg-white/10'
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
                    originalPerfume={data.originalPerfume}
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
