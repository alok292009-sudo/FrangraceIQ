
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
              <div className="text-white text-[12px] md:text-[14px] font-black uppercase tracking-[0.3em] mb-3 mt-6 drop-shadow-sm">Family</div>
              <div className="text-white font-heading italic text-3xl md:text-4xl mb-4 drop-shadow-xl">{fragranceFamily}</div>

              <div className="text-white text-[12px] md:text-[14px] font-black uppercase tracking-[0.3em] mb-4 drop-shadow-sm">Main Accords</div>
              <div className="flex flex-wrap gap-2.5 mb-8">
                {dominantAccords.map((accord, idx) => (
                  <span key={idx} className="liquid-glass rounded-xl px-5 py-2.5 text-xs md:text-sm text-white font-black bg-white/20 border-2 border-white/30 shadow-xl backdrop-blur-md">
                    {accord}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-white text-[12px] md:text-[14px] font-black uppercase tracking-[0.3em] mb-4 drop-shadow-sm">Opening</div>
                  <ul className="flex flex-col gap-3">
                    {openingNotes.map((note, idx) => (
                      <li key={idx} className="text-white text-sm md:text-base font-black leading-relaxed flex items-center gap-3 drop-shadow-md">
                        <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] shrink-0"></span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-white text-[12px] md:text-[14px] font-black uppercase tracking-[0.3em] mb-4 drop-shadow-sm">Dry-down</div>
                  <ul className="flex flex-col gap-3">
                    {drydownNotes.map((note, idx) => (
                      <li key={idx} className="text-white text-sm md:text-base font-black leading-relaxed flex items-center gap-3 drop-shadow-md">
                        <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] shrink-0"></span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 md:p-8 rounded-2xl bg-yellow-400/20 border-2 border-yellow-400/50 shadow-[0_0_40px_rgba(250,204,21,0.1)] backdrop-blur-3xl">
                <div className="text-yellow-400 text-[12px] md:text-[14px] font-black uppercase tracking-[0.3em] mb-4 drop-shadow-xl">Key Note Driver</div>
                <p className="text-yellow-50 font-black text-base md:text-xl leading-relaxed drop-shadow-lg">
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
