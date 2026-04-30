
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
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white/70 text-sm font-body font-medium uppercase tracking-wider">Scent DNA</span>
        <ChevronDown 
          size={18} 
          className={`text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
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
            <div className="p-4 pt-0 border-t border-white/5 bg-white/[0.01]">
              <div className="text-white/40 text-[10px] uppercase tracking-widest mb-3 mt-4">Family</div>
              <div className="text-white/80 font-heading italic text-lg mb-4">{fragranceFamily}</div>

              <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Main Accords</div>
              <div className="flex flex-wrap gap-2 mb-6">
                {dominantAccords.map((accord, idx) => (
                  <span key={idx} className="liquid-glass rounded-md px-3 py-1 text-xs text-white/70">
                    {accord}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Opening</div>
                  <ul className="flex flex-col gap-1">
                    {openingNotes.map((note, idx) => (
                      <li key={idx} className="text-white/70 text-xs font-body">• {note}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Dry-down</div>
                  <ul className="flex flex-col gap-1">
                    {drydownNotes.map((note, idx) => (
                      <li key={idx} className="text-white/70 text-xs font-body">• {note}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                <div className="text-yellow-300/60 text-[10px] uppercase tracking-widest mb-1">Key Driver</div>
                <p className="text-yellow-300 text-xs font-body leading-relaxed">
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
