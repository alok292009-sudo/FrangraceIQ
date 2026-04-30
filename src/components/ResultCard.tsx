
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
          <h3 className="font-heading italic text-5xl text-white leading-tight drop-shadow-md">
            {perfume.name}
          </h3>
          <span className="text-white text-base font-body font-bold mt-1">by {perfume.brand}</span>
          <div className="inline-block mt-4">
            <span className="liquid-glass rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest text-white bg-white/20 border-2 border-white/20 shadow-lg">
              {perfume.type}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className={`w-[90px] h-[90px] rounded-full border-4 flex flex-col items-center justify-center shadow-2xl bg-black/20 ${scoreColor}`}>
            <span className="font-heading italic text-3xl leading-none font-bold text-white">{perfume.similarityScore}%</span>
            <span className="text-[11px] font-black uppercase tracking-tight text-white/90">match</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mt-8">
        <span className="text-yellow-400 font-heading italic text-4xl drop-shadow-lg filter brightness-110">{perfume.priceRange}</span>
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
          <h4 className="text-white text-[11px] font-black uppercase tracking-[0.25em] mb-4 opacity-100 flex items-center gap-2">
            <span className="h-[1px] w-4 bg-green-400"></span>
            WHAT MATCHES
          </h4>
          <ul className="flex flex-col gap-4">
            {perfume.whatMatches.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
                <span className="text-white text-sm font-body font-bold leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white text-[11px] font-black uppercase tracking-[0.25em] mb-4 opacity-100 flex items-center gap-2">
            <span className="h-[1px] w-4 bg-red-400"></span>
            WHAT DOESN'T
          </h4>
          <ul className="flex flex-col gap-4">
            {perfume.whatDoesNot.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <span className="text-white/90 text-sm font-body font-bold leading-relaxed">{item}</span>
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
          <div key={idx} className="liquid-glass rounded-lg px-4 py-2.5 text-[11px] text-white font-bold bg-white/10 border border-white/5">
             <span className="mr-1.5 opacity-70">{badge.icon}</span>
             {badge.value}
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="mt-8 p-6 rounded-2xl bg-white/10 border-2 border-white/10 shadow-2xl">
        <p className="text-white text-sm font-body font-bold italic leading-relaxed text-center">
          "{perfume.verdict}"
        </p>
      </div>

      {/* Buy Buttons */}
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        {perfume.availableOn.map((platform) => {
          const cleanPlatform = platform.trim();
          const lowerPlatform = cleanPlatform.toLowerCase();
          
          // Enhanced search terms to ensure better results
          const baseSearch = `${perfume.brand} ${perfume.name}`;
          const marketplaceSearch = encodeURIComponent(`${baseSearch} perfume`);
          const googleSearch = encodeURIComponent(`${baseSearch} perfume buy online India original`);

          // Prioritize the direct product URL if provided by AI
          let url = (perfume.productUrl && perfume.productUrl.startsWith('http')) 
            ? perfume.productUrl 
            : `https://www.google.com/search?q=${googleSearch}`;
          
          if (!perfume.productUrl || !perfume.productUrl.startsWith('http')) {
            if (lowerPlatform.includes('amazon')) {
              url = `https://www.amazon.in/s?k=${marketplaceSearch}`;
            } else if (lowerPlatform.includes('flipkart')) {
              url = `https://www.flipkart.com/search?q=${marketplaceSearch}`;
            } else if (lowerPlatform.includes('meesho')) {
              url = `https://www.meesho.com/search?q=${marketplaceSearch}`;
            }
          }

          return (
            <a 
              key={platform} 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-lg px-8 py-4 text-sm font-black transition-all flex items-center gap-2 cursor-pointer z-20 relative shadow-2xl border-2 hover:scale-105 active:scale-95 ${
                lowerPlatform.includes('website') || lowerPlatform.includes('official')
                  ? 'bg-yellow-400 text-black border-yellow-500/50 shadow-yellow-400/20'
                  : 'bg-white text-black border-white/30'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-black uppercase tracking-tight">
                {lowerPlatform.includes('website') ? 'Visit Official Store' : `Buy on ${cleanPlatform}`}
              </span>
              <ExternalLink size={14} strokeWidth={3} />
            </a>
          );
        })}
      </div>

      {/* Review Links */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <a 
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${perfume.name} ${perfume.brand} perfume review India`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white font-black hover:text-white/80 transition-colors flex items-center gap-2 bg-red-600/20 px-3 py-1.5 rounded-full border border-red-500/20"
        >
          <span>Watch Reviews on YouTube</span>
          <ExternalLink size={12} />
        </a>
        <a 
          href={`https://www.google.com/search?q=${encodeURIComponent(`site:reddit.com ${perfume.name} ${perfume.brand} perfume review`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white font-black hover:text-white/80 transition-colors flex items-center gap-2 bg-orange-600/20 px-3 py-1.5 rounded-full border border-orange-500/20"
        >
          <span>Reddit Discussions</span>
          <ExternalLink size={12} />
        </a>
        <a 
          href={`https://www.instagram.com/explore/tags/${perfume.name.replace(/\s+/g, '').toLowerCase()}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white font-black hover:text-white/80 transition-colors flex items-center gap-2 bg-pink-600/20 px-3 py-1.5 rounded-full border border-pink-500/20"
        >
          <span>Instagram Feed</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Tips */}
      <div className="mt-10 pt-8 border-t border-white/20 grid grid-cols-2 gap-6">
        <div>
          <span className="text-white text-[12px] font-black uppercase tracking-[0.2em] block mb-3 px-1">Apply here</span>
          <div className="bg-white/10 rounded-xl p-4 border-2 border-white/10 shadow-lg">
            <span className="text-white text-xs font-bold leading-relaxed">{applicationTip}</span>
          </div>
        </div>
        {layeringTip && (
          <div>
            <span className="text-white text-[12px] font-black uppercase tracking-[0.2em] block mb-3 px-1">Layer with</span>
            <div className="bg-white/10 rounded-xl p-4 border-2 border-white/10 shadow-lg">
              <span className="text-white text-xs font-bold leading-relaxed">{layeringTip}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultCard;
