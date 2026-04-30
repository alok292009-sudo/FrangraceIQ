
import React from 'react';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import ScentDNAAccordion from './ScentDNAAccordion';
import { motion } from 'motion/react';

interface Recommendation {
  name: string;
  brand: string;
  type: string;
  priceRange: string;
  availableOn: string[];
  productUrl?: string | null;
  similarityScore: number;
  whatMatches: string[];
  whatDoesNot: string[];
  longevity: string;
  projection: string;
  bestFor: string;
  season: string;
  verdict: string;
}

interface ResultCardProps {
  perfume: Recommendation;
  index: number;
  fragranceFamily: string;
  dominantAccords: string[];
  openingNotes: string[];
  drydownNotes: string[];
  keyDrivers: string;
  applicationTip: string;
  layeringTip: string | null;
}

const ResultCard: React.FC<ResultCardProps> = ({
  perfume,
  index,
  fragranceFamily,
  dominantAccords,
  openingNotes,
  drydownNotes,
  keyDrivers,
  applicationTip,
  layeringTip,
}) => {
  const scoreColor = perfume.similarityScore >= 75 
    ? 'border-green-400/40 bg-green-400/10 text-green-400' 
    : perfume.similarityScore >= 55 
    ? 'border-yellow-400/40 bg-yellow-400/10 text-yellow-400' 
    : 'border-red-400/40 bg-red-400/10 text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="liquid-glass rounded-2xl p-8 flex flex-col w-full"
    >
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className="font-heading italic text-3xl text-white leading-tight">
            {perfume.name}
          </h3>
          <span className="text-white/50 text-sm font-body mt-1">by {perfume.brand}</span>
          <div className="inline-block mt-3">
            <span className="liquid-glass rounded-lg px-3 py-1 text-[10px] uppercase tracking-widest text-white/60 bg-white/[0.03]">
              {perfume.type}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-[70px] h-[70px] rounded-full border-2 flex flex-col items-center justify-center ${scoreColor}`}>
            <span className="font-heading italic text-2xl leading-none">{perfume.similarityScore}%</span>
            <span className="text-[10px] font-body opacity-60">match</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mt-6">
        <span className="text-yellow-300 font-heading italic text-2xl">{perfume.priceRange}</span>
      </div>

      {/* Scent DNA Accordion */}
      <ScentDNAAccordion 
        fragranceFamily={fragranceFamily}
        dominantAccords={dominantAccords}
        openingNotes={openingNotes}
        drydownNotes={drydownNotes}
        keyDrivers={keyDrivers}
      />

      {/* Match Breakdown */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h4 className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-4">WHAT MATCHES</h4>
          <ul className="flex flex-col gap-3">
            {perfume.whatMatches.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle size={14} className="text-green-400 shrink-0 mt-0.5" />
                <span className="text-white/70 text-xs font-body leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-4">WHAT DOESN'T</h4>
          <ul className="flex flex-col gap-3">
            {perfume.whatDoesNot.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                <span className="text-white/50 text-xs font-body leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Performance Badges */}
      <div className="mt-8 flex flex-wrap gap-2">
        {[
          { label: 'Longevity', value: perfume.longevity, icon: '⏱' },
          { label: 'Projection', value: perfume.projection, icon: '📡' },
          { label: 'Best For', value: perfume.bestFor, icon: '✦' },
          { label: 'Season', value: perfume.season, icon: '🌤' }
        ].map((badge, idx) => (
          <div key={idx} className="liquid-glass rounded-lg px-4 py-2 text-[10px] text-white/60 bg-white/[0.02]">
             <span className="mr-1.5">{badge.icon}</span>
             {badge.value}
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <p className="text-white/60 text-xs font-body italic leading-relaxed">
          "{perfume.verdict}"
        </p>
      </div>

      {/* Buy Buttons */}
      <div className="mt-8 flex flex-wrap gap-3">
        {perfume.availableOn.map((platform) => {
          const cleanPlatform = platform.trim();
          const searchTerm = encodeURIComponent(`${perfume.name} ${perfume.brand} perfume India`);
          
          // Enhanced deep linking logic: Use productUrl if available for ANY platform, 
          // otherwise fallback to specific search URLs
          let url = perfume.productUrl || `https://www.google.com/search?q=${searchTerm}`;
          
          if (!perfume.productUrl) {
            if (cleanPlatform.toLowerCase().includes('amazon')) {
              url = `https://www.amazon.in/s?k=${searchTerm}`;
            } else if (cleanPlatform.toLowerCase().includes('flipkart')) {
              url = `https://www.flipkart.com/search?q=${searchTerm}`;
            } else if (cleanPlatform.toLowerCase().includes('meesho')) {
              url = `https://www.meesho.com/search?q=${searchTerm}`;
            }
          }

          return (
            <a 
              key={platform} 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-strong rounded-lg px-5 py-2.5 text-xs text-white hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer z-20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-medium">{cleanPlatform}</span>
              <ExternalLink size={12} className="opacity-60" />
            </a>
          );
        })}
      </div>

      {/* Review Links */}
      <div className="mt-4 flex flex-wrap gap-3">
        <a 
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${perfume.name} ${perfume.brand} perfume review India`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5"
        >
          <span>Watch Reviews on YouTube</span>
          <ExternalLink size={10} />
        </a>
        <a 
          href={`https://www.google.com/search?q=${encodeURIComponent(`site:reddit.com ${perfume.name} ${perfume.brand} perfume review`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-white/40 hover:text-white/80 transition-colors flex items-center gap-1.5"
        >
          <span>Check Reddit Discussions</span>
          <ExternalLink size={10} />
        </a>
      </div>

      {/* Tips */}
      <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
        <div>
          <span className="text-white/30 text-[10px] uppercase tracking-widest block mb-1">Apply here</span>
          <span className="text-white/60 text-xs">{applicationTip}</span>
        </div>
        {layeringTip && (
          <div>
            <span className="text-white/30 text-[10px] uppercase tracking-widest block mb-1">Layer with</span>
            <span className="text-white/60 text-xs">{layeringTip}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultCard;
