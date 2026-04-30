
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <div className="mt-5 liquid-glass rounded-lg overflow-hidden">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors bg-white/5 border-b border-white/5"
      >
        <span className="text-white text-sm font-bold uppercase tracking-widest">Scent DNA</span>
        <ChevronDown 
          size={18} 
          className={`text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="p-6 pt-0 bg-white/5">
              <div className="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-3 mt-6 opacity-80">Family</div>
              <div className="text-white font-heading italic text-3xl mb-4 drop-shadow-md">{fragranceFamily}</div>

              <div className="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-3 opacity-80">Main Accords</div>
              <div className="flex flex-wrap gap-2.5 mb-8">
                {dominantAccords.map((accord, idx) => (
                  <span key={idx} className="liquid-glass rounded-lg px-4 py-2 text-xs text-white font-black bg-white/20 border border-white/20 shadow-md">
                    {accord}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-3 opacity-80">Opening</div>
                  <ul className="flex flex-col gap-2.5">
                    {openingNotes.map((note, idx) => (
                      <li key={idx} className="text-white text-sm font-bold leading-relaxed flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-white/50 shrink-0"></span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-3 opacity-80">Dry-down</div>
                  <ul className="flex flex-col gap-2.5">
                    {drydownNotes.map((note, idx) => (
                      <li key={idx} className="text-white text-sm font-bold leading-relaxed flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-white/50 shrink-0"></span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-yellow-400/20 border-2 border-yellow-400/40 shadow-2xl backdrop-blur-md">
                <div className="text-yellow-400 text-[11px] font-black uppercase tracking-[0.2em] mb-3 drop-shadow-sm">Key Note Driver</div>
                <p className="text-yellow-50 font-black text-sm leading-relaxed drop-shadow-sm">
                  {keyDrivers}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
