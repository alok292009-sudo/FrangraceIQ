
import React from 'react';
import { AlertCircle } from 'lucide-react';
import ResultCard from './ResultCard';

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
    <section className="w-full bg-black py-20 px-6 lg:px-16" id="results">
      <div className="max-w-4xl mx-auto">
        {status === 'loading' && (
          <div className="flex flex-col gap-8">
            <p className="text-white/40 font-body italic text-sm text-center mb-6 animate-pulse">
              Decoding scent DNA...
            </p>
            {[1, 2, 3].map((i) => (
              <div key={i} className="liquid-glass rounded-2xl p-8 animate-pulse">
                <div className="bg-white/10 h-8 w-48 rounded-md mb-4" />
                <div className="bg-white/5 h-4 w-32 rounded-md mb-10" />
                <div className="flex flex-col gap-4">
                  <div className="bg-white/5 h-4 w-full rounded-md" />
                  <div className="bg-white/5 h-4 w-4/5 rounded-md" />
                  <div className="bg-white/5 h-4 w-3/5 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="liquid-glass rounded-2xl p-12 border border-red-500/30 bg-red-500/10 flex flex-col items-center text-center gap-6 shadow-2xl">
            <AlertCircle size={64} className="text-red-400" />
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-heading italic text-white drop-shadow-md">Something went wrong</h3>
              <p className="text-white font-medium text-sm max-w-xs leading-relaxed">
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
            <div className="flex flex-col items-center gap-4 mt-4">
              <span className="text-white/60 text-[11px] font-black uppercase tracking-widest">Adjust Budget</span>
              <div className="flex gap-2.5 p-2 liquid-glass rounded-xl border border-white/10">
                {['₹150', '₹300', '₹500', '₹1000'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => search(lastQuery, opt)}
                    className={`px-5 py-2 rounded-lg text-xs transition-all duration-300 font-bold ${
                      lastBudget === opt 
                      ? 'bg-white text-black shadow-lg' 
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
              className="bg-white text-black rounded-xl px-10 py-4 text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-xl mt-4"
            >
              Try Again
            </button>
          </div>
        )}

        {status === 'success' && data && (
          <div className="flex flex-col gap-14">
            <div className="text-center mb-10">
              <span className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] block mb-3">Results for</span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white leading-tight drop-shadow-lg">
                {data.originalPerfume}
              </h2>
              {data.recommendations.length === 0 && (
                <p className="text-white/80 font-bold italic mt-8 text-lg">
                  No budget clones found that meet our quality ceiling.
                </p>
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
            <div className="mt-12 flex flex-col items-center gap-8 py-16 border-t border-white/10">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-white/70 text-[11px] font-black uppercase tracking-[0.2em]">Not what you're looking for?</span>
                  <p className="text-white text-sm text-center max-w-sm font-medium leading-relaxed">
                    Try refining your budget. Higher budgets often unlock long-lasting niche dupe houses with better scent accuracy.
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2.5 p-2 liquid-glass rounded-2xl border border-white/10">
                  {['₹150', '₹300', '₹500', '₹1000', '₹2000'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => search(lastQuery, opt)}
                      className={`px-7 py-2.5 rounded-xl text-xs transition-all duration-300 font-bold ${
                        lastBudget === opt 
                        ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.2)]' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
            </div>

            <div className="mt-16 p-10 liquid-glass rounded-3xl border border-white/10 text-center flex flex-col items-center gap-6 shadow-2xl">
               <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-white/20"></div>
                  <h4 className="text-white text-xs font-black uppercase tracking-[0.3em]">REALITY VERDICT</h4>
                  <div className="h-[1px] w-8 bg-white/20"></div>
               </div>
               <p className="text-white font-body font-bold text-lg md:text-xl leading-relaxed italic max-w-2xl">
                 "{data.realityVerdict}"
               </p>
               <div className="h-px w-full max-w-xs bg-white/10" />
               <p className="text-white/80 text-sm font-medium leading-relaxed max-w-xl">
                 {data.budgetAdvice}
               </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
