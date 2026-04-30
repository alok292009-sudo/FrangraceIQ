
import React from 'react';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import ScentDNAAccordion from './ScentDNAAccordion';
import { motion } from 'motion/react';

interface Recommendation {
  name: string;
  brand: string;
  type: string;
  price: string;
  volume: string;
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
      className="liquid-glass rounded-2xl p-5 md:p-8 flex flex-col w-full"
    >
      {/* Top Row */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex flex-col">
          <h3 className="font-heading italic text-3xl md:text-5xl text-white leading-tight drop-shadow-md">
            {perfume.name}
          </h3>
          <span className="text-white text-base md:text-lg font-body font-black mt-1 drop-shadow-sm">by {perfume.brand}</span>
          <div className="inline-block mt-4">
            <span className="liquid-glass rounded-lg px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-white bg-white/30 border-2 border-white/40 shadow-lg">
              {perfume.type}
            </span>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center gap-4 self-center md:self-auto">
          <div className={`w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full border-4 flex flex-col items-center justify-center shadow-2xl bg-black/40 ${scoreColor}`}>
            <span className="font-heading italic text-3xl md:text-4xl leading-none font-bold text-white">{perfume.similarityScore}%</span>
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-tight text-white drop-shadow-sm">match</span>
          </div>
        </div>
      </div>

      {/* Price & Volume */}
      <div className="mt-8 flex items-baseline gap-3">
        <span className="text-yellow-400 font-heading italic text-3xl md:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] filter brightness-125">{perfume.price}</span>
        <span className="text-white/70 font-black uppercase text-sm md:text-base tracking-widest drop-shadow-sm">{perfume.volume}</span>
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
          <h4 className="text-white text-[12px] font-black uppercase tracking-[0.3em] mb-4 opacity-100 flex items-center gap-2 drop-shadow-sm">
            <span className="h-[2px] w-6 bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
            WHAT MATCHES
          </h4>
          <ul className="flex flex-col gap-3">
            {perfume.whatMatches.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
                <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5 filter drop-shadow-[0_0_5px_rgba(74,222,128,0.3)]" />
                <span className="text-white text-sm md:text-base font-body font-black leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white text-[12px] font-black uppercase tracking-[0.3em] mb-4 opacity-100 flex items-center gap-2 drop-shadow-sm">
            <span className="h-[2px] w-6 bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span>
            WHAT DOESN'T
          </h4>
          <ul className="flex flex-col gap-3">
            {perfume.whatDoesNot.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
                <XCircle size={18} className="text-red-400 shrink-0 mt-0.5 filter drop-shadow-[0_0_5px_rgba(248,113,113,0.3)]" />
                <span className="text-white text-sm md:text-base font-body font-black leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Performance Badges */}
      <div className="mt-10 flex flex-wrap gap-3">
        {[
          { label: 'Longevity', value: perfume.longevity, icon: '⏱' },
          { label: 'Projection', value: perfume.projection, icon: '📡' },
          { label: 'Best For', value: perfume.bestFor, icon: '✦' },
          { label: 'Season', value: perfume.season, icon: '🌤' }
        ].map((badge, idx) => (
          <div key={idx} className="liquid-glass rounded-xl px-5 py-3 text-[12px] md:text-sm text-white font-black bg-white/20 border-2 border-white/10 shadow-xl backdrop-blur-xl hover:scale-105 transition-transform duration-300">
             <span className="mr-2 text-base">{badge.icon}</span>
             <span className="tracking-tight">{badge.value}</span>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="mt-8 p-8 rounded-2xl bg-white/20 border-2 border-white/20 shadow-2xl backdrop-blur-2xl">
        <p className="text-white text-base md:text-lg font-body font-black italic leading-relaxed text-center drop-shadow-md">
          "{perfume.verdict}"
        </p>
      </div>

      {/* Buy Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
        {/* Priority Direct Link */}
        {perfume.productUrl && perfume.productUrl.startsWith('http') && (
          <a 
            href={perfume.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-6 md:px-8 py-3.5 md:py-4 text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer z-20 relative shadow-2xl border-2 bg-yellow-400 text-black border-yellow-500/50 shadow-yellow-400/20 hover:scale-105 active:scale-95 w-full sm:w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-black uppercase tracking-tight">Direct Purchase</span>
            <ExternalLink size={14} strokeWidth={3} />
          </a>
        )}

        {/* Platform Buttons */}
        {perfume.availableOn.filter(p => p.trim() !== "").map((platform) => {
          const cleanPlatform = platform.trim();
          const lowerPlatform = cleanPlatform.toLowerCase();
          
          if (lowerPlatform.includes('website') && perfume.productUrl) return null;

          const baseSearch = `${perfume.brand} ${perfume.name}`;
          const marketplaceSearch = encodeURIComponent(`${baseSearch} ${perfume.volume || ''} perfume`);
          const googleSearch = encodeURIComponent(`${baseSearch} perfume buy online India original`);

          let url = `https://www.google.com/search?q=${googleSearch}`;
          
          if (lowerPlatform.includes('amazon')) {
            url = `https://www.amazon.in/s?k=${marketplaceSearch}`;
          } else if (lowerPlatform.includes('flipkart')) {
            url = `https://www.flipkart.com/search?q=${marketplaceSearch}`;
          } else if (lowerPlatform.includes('meesho')) {
            url = `https://www.meesho.com/search?q=${marketplaceSearch}`;
          }

          return (
            <a 
              key={platform} 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-6 md:px-8 py-3.5 md:py-4 text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer z-20 relative shadow-2xl border-2 bg-white text-black border-white/30 hover:scale-105 active:scale-95 w-full sm:w-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-black uppercase tracking-tight">
                {`Search on ${cleanPlatform}`}
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
      <div className="mt-10 pt-8 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-white text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] block mb-3 px-1 opacity-90">Apply here</span>
          <div className="bg-white/20 rounded-xl p-5 border-2 border-white/20 shadow-xl backdrop-blur-xl">
            <span className="text-white text-[12px] md:text-sm font-bold leading-relaxed drop-shadow-sm">{applicationTip}</span>
          </div>
        </div>
        {layeringTip && (
          <div>
            <span className="text-white text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] block mb-3 px-1 opacity-90">Layer with</span>
            <div className="bg-white/20 rounded-xl p-5 border-2 border-white/20 shadow-xl backdrop-blur-xl">
              <span className="text-white text-[12px] md:text-sm font-bold leading-relaxed drop-shadow-sm">{layeringTip}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultCard;
