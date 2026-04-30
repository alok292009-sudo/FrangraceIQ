
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
          <div className="liquid-glass rounded-2xl p-12 border border-red-500/20 bg-red-500/5 flex flex-col items-center text-center gap-6">
            <AlertCircle size={48} className="text-red-400" />
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-heading italic text-white">Something went wrong</h3>
              <p className="text-white/50 text-sm max-w-xs">
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
            <div className="flex flex-col items-center gap-3 mt-2">
              <span className="text-white/30 text-[10px] uppercase tracking-widest">Adjust Budget</span>
              <div className="flex gap-2 p-1 liquid-glass rounded-lg">
                {['₹150', '₹300', '₹500', '₹1000'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => search(lastQuery, opt)}
                    className={`px-4 py-1.5 rounded-md text-[10px] transition-all duration-300 ${
                      lastBudget === opt 
                      ? 'bg-white text-black font-medium' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => search(lastQuery, lastBudget)}
              className="liquid-glass-strong rounded-lg px-8 py-3 text-sm font-medium text-white hover:scale-105 transition-transform"
            >
              Try Again
            </button>
          </div>
        )}

        {status === 'success' && data && (
          <div className="flex flex-col gap-12">
            <div className="text-center mb-8">
              <span className="text-white/30 text-[10px] uppercase tracking-widest block mb-2">Results for</span>
              <h2 className="text-4xl md:text-5xl font-heading italic text-white leading-tight">
                {data.originalPerfume}
              </h2>
              {data.recommendations.length === 0 && (
                <p className="text-white/50 italic mt-6">
                  No budget clones found that meet our quality ceiling.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-10">
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
            <div className="mt-8 flex flex-col items-center gap-6 py-12 border-t border-white/5">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-white/30 text-[10px] uppercase tracking-widest">Not what you're looking for?</span>
                  <p className="text-white/50 text-xs text-center max-w-xs">
                    Try refining your budget. Higher budgets often unlock long-lasting niche dupe houses.
                  </p>
                </div>
                
                <div className="flex gap-2 p-1.5 liquid-glass rounded-xl">
                  {['₹150', '₹300', '₹500', '₹1000', '₹2000'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => search(lastQuery, opt)}
                      className={`px-6 py-2 rounded-lg text-xs transition-all duration-300 font-body ${
                        lastBudget === opt 
                        ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                        : 'text-white/40 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
            </div>

            <div className="mt-16 p-8 liquid-glass rounded-2xl border border-white/5 text-center flex flex-col items-center gap-4">
               <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest">REALITY VERDICT</h4>
               <p className="text-white/80 font-body font-light text-base leading-relaxed italic">
                 "{data.realityVerdict}"
               </p>
               <div className="h-px w-20 bg-white/10 mt-2" />
               <p className="text-white/40 text-xs mt-2">
                 {data.budgetAdvice}
               </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
