
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScentDNAAccordionProps {
  fragranceFamily: string;
  dominantAccords: string[];
  openingNotes: string[];
  drydownNotes: string[];
  keyDrivers: string;
}

export default function ScentDNAAccordion({
  fragranceFamily,
  dominantAccords,
  openingNotes,
  drydownNotes,
  keyDrivers,
}: ScentDNAAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6 liquid-glass rounded-2xl overflow-hidden border border-white/10 group">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-all duration-500 bg-white/5"
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-yellow-400 text-black rotate-0' : 'bg-white/10 text-white/40 rotate-45 group-hover:rotate-0'}`}>
            <span className="text-[10px] font-black uppercase">DNA</span>
          </div>
          <span className="text-white text-[11px] font-black uppercase tracking-[0.3em]">Scent Matrix Decoded</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest hidden md:block">
            {isOpen ? 'Close Report' : 'View Detailed Breakdown'}
          </span>
          <ChevronDown 
            size={18} 
            className={`text-white transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="p-8 pt-4 bg-white/[0.02] border-t border-white/5 backdrop-blur-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Core Identity</div>
                  <div className="text-white font-heading italic text-4xl md:text-5xl mb-8 drop-shadow-2xl leading-none">
                    {fragranceFamily}
                  </div>

                  <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Main Accords</div>
                  <div className="flex flex-wrap gap-2.5">
                    {(dominantAccords || []).map((accord, idx) => (
                      <span key={idx} className="liquid-glass rounded-xl px-5 py-3 text-[10px] md:text-xs text-white font-black bg-white/5 border border-white/10 shadow-xl hover:bg-white/10 hover:border-yellow-400/30 transition-all cursor-default">
                        {accord}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Evolution: Opening</div>
                    <ul className="flex flex-col gap-4">
                      {(openingNotes || []).map((note, idx) => (
                        <li key={idx} className="text-white/90 text-sm md:text-base font-bold leading-relaxed flex items-center gap-4 group/note">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/note:bg-yellow-400 transition-colors shadow-[0_0_8px_rgba(255,255,255,0.1)] shrink-0 group-hover/note:shadow-yellow-400/50" />
                          <span className="group-hover/note:translate-x-1 transition-transform">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Evolution: Dry-down</div>
                    <ul className="flex flex-col gap-4">
                      {(drydownNotes || []).map((note, idx) => (
                        <li key={idx} className="text-white/90 text-sm md:text-base font-bold leading-relaxed flex items-center gap-4 group/note">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/note:bg-yellow-400 transition-colors shadow-[0_0_8px_rgba(255,255,255,0.1)] shrink-0 group-hover/note:shadow-yellow-400/50" />
                          <span className="group-hover/note:translate-x-1 transition-transform">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 p-8 rounded-[2rem] bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 shadow-2xl backdrop-blur-3xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.5em] mb-5 drop-shadow-xl flex items-center gap-3">
                  <div className="h-0.5 w-8 bg-yellow-400" />
                  Primary Driver
                </div>
                <p className="text-white font-heading italic text-2xl md:text-4xl leading-[1.1] drop-shadow-lg max-w-4xl">
                  {keyDrivers}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
