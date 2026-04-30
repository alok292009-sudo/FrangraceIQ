
import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <section className="w-full bg-black py-24 md:py-32 px-4" id="results">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16 px-4">
                <div className="flex flex-col gap-5">
                  <div className="h-4 w-32 bg-white/10 rounded-full animate-pulse" />
                  <div className="h-16 md:h-24 w-64 md:w-[500px] bg-white/10 rounded-2xl animate-pulse" />
                </div>
                <div className="flex flex-col items-end gap-3 hidden md:flex">
                  <div className="h-3 w-40 bg-white/5 rounded-full animate-pulse" />
                  <div className="h-10 w-64 bg-white/5 rounded-xl animate-pulse" />
                </div>
              </div>
              {[1, 2, 3].map((i) => (
                <ResultSkeleton key={i} i={i} />
              ))}
            </motion.div>
          )}

          {status === 'error' && (
            <div className="max-w-4xl mx-auto">
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
            </div>
          )}

          {status === 'success' && data && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-16 lg:gap-24"
            >
              {/* Editorial High-End Header */}
              <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-24 mt-16">
                <div className="flex flex-col max-w-4xl w-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: 120 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-1 bg-yellow-400 mb-12 shadow-[0_0_30px_rgba(250,204,21,0.6)]"
                  />
                  <div className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.8em] text-white/30 mb-8 drop-shadow-sm">Scent Intelligence Report v.2.0</div>
                  <h2 className="text-8xl md:text-[10rem] lg:text-[12rem] font-heading italic text-white leading-[0.75] tracking-tighter drop-shadow-2xl">
                    The Matches<span className="text-yellow-400">.</span>
                  </h2>
                  <div className="flex flex-col md:flex-row md:items-center gap-8 mt-16">
                    <p className="text-white/80 font-body text-2xl md:text-3xl font-bold leading-[1.1] max-w-xl">
                      We've decoded <span className="text-white underline underline-offset-[12px] decoration-white/10">{(data.recommendations || []).length} alternatives</span> for <span className="text-yellow-400 font-heading italic">"{lastQuery}"</span>.
                    </p>
                    <div className="hidden md:block h-16 w-[1px] bg-white/10 mx-4" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Protocol Status</span>
                      <span className="text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                        DNA Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end text-right w-full md:w-auto">
                    <div className="liquid-glass rounded-3xl p-8 border-white/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] bg-white/5 border-[1px] min-w-[300px] hover:scale-[1.02] transition-transform duration-500">
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 text-center">Genetic Footprint</div>
                      <div className="text-white font-black text-2xl md:text-3xl uppercase tracking-tighter text-center leading-none mb-2">
                        {data.fragranceFamily}
                      </div>
                      <div className="text-yellow-400/40 text-[10px] font-black uppercase tracking-widest mb-6 text-center italic">Primary Accord Group</div>
                      
                      <div className="flex flex-wrap gap-2 justify-center">
                        {(data.dominantAccords || []).slice(0, 4).map((a: string) => (
                          <span key={a} className="text-[9px] font-black uppercase tracking-widest text-white bg-white/10 px-3 py-1.5 rounded-md border border-white/5 shadow-md">
                            {a}
                          </span>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-col gap-3">
                         <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="w-full py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
                          >
                           Modify Search
                         </button>
                      </div>
                    </div>
                </div>
              </div>

              <div className="flex flex-col gap-24 lg:gap-32">
                {(data.recommendations || []).map((perfume: any, i: number) => (
                  <ResultCard 
                    key={i} 
                    perfume={perfume} 
                    index={i} 
                    fragranceFamily={data.fragranceFamily}
                    dominantAccords={data.dominantAccords}
                    openingNotes={data.openingNotes}
                    drydownNotes={data.drydownNotes}
                    keyDrivers={data.keyDrivers}
                    applicationTip={data.applicationTip}
                    layeringTip={data.layeringTip}
                    originalPerfume={data.originalPerfume}
                  />
                ))}
              </div>

              {/* Reality Verdict Bento Callout */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="mt-16 p-10 md:p-20 liquid-glass rounded-[3rem] md:rounded-[4rem] border border-white/10 text-center flex flex-col items-center gap-10 shadow-2xl relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                 <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                 <div className="flex items-center gap-10 relative z-10">
                    <div className="h-[1px] w-20 bg-white/20" />
                    <h4 className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-[0.6em]">VERDICT</h4>
                    <div className="h-[1px] w-20 bg-white/20" />
                 </div>
                 
                 <p className="text-white font-heading italic text-4xl md:text-6xl lg:text-7xl leading-tight max-w-5xl drop-shadow-2xl relative z-10">
                   "{data.realityVerdict}"
                 </p>
                 
                 <div className="flex flex-col items-center gap-8 relative z-10 mt-6">
                    <p className="text-white/60 font-body text-lg md:text-2xl font-bold leading-relaxed max-w-3xl">
                      {data.budgetAdvice}
                    </p>
                    <a href="#how-it-works" className="text-yellow-400 text-xs font-black uppercase tracking-[0.3em] border-b border-yellow-400 pb-2 hover:opacity-80 transition-opacity">
                      See Our Accuracy Standards
                    </a>
                 </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
