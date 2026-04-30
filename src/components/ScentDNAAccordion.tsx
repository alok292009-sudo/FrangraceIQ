
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
            <div className="p-5 pt-0 bg-white/5">
              <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-3 mt-4">Family</div>
              <div className="text-white font-heading italic text-2xl mb-4">{fragranceFamily}</div>

              <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Main Accords</div>
              <div className="flex flex-wrap gap-2 mb-6">
                {dominantAccords.map((accord, idx) => (
                  <span key={idx} className="liquid-glass rounded-md px-4 py-1.5 text-xs text-white font-bold bg-white/10 border border-white/10">
                    {accord}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Opening</div>
                  <ul className="flex flex-col gap-2">
                    {openingNotes.map((note, idx) => (
                      <li key={idx} className="text-white text-xs font-bold leading-relaxed flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0"></span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Dry-down</div>
                  <ul className="flex flex-col gap-2">
                    {drydownNotes.map((note, idx) => (
                      <li key={idx} className="text-white text-xs font-bold leading-relaxed flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0"></span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-yellow-400/10 border border-yellow-400/30 shadow-inner">
                <div className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-2">Key Driver</div>
                <p className="text-yellow-100 text-xs font-bold leading-relaxed">
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
