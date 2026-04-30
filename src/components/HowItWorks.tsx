
import HlsVideo from './HlsVideo';
import { Zap, Palette, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Zap,
      title: 'Enter Any Luxury Perfume',
      description: 'Type any designer name. Sauvage, Aventus, Black Opium — we know them all.'
    },
    {
      icon: Palette,
      title: 'AI Decodes Scent DNA',
      description: 'Core accords, key drivers, must-match elements. Real chemistry, not marketing.'
    },
    {
      icon: BarChart3,
      title: 'Get Your ₹300 Match',
      description: 'Real products. Honest similarity scores. No fake 95% clones. Ever.'
    }
  ];

  return (
    <section className="relative w-full min-h-[900px] flex flex-col items-center justify-center py-40" id="how-it-works">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HlsVideo 
          src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center text-center">
        <div className="liquid-glass rounded-full px-5 py-1.5 text-xs font-medium text-white mb-8">
          How It Works
        </div>
        
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9] mb-8">
          You search. We decode.<br />You save.
        </h2>
        
        <p className="text-white/60 font-body font-light text-base md:text-xl max-w-2xl mb-20 leading-relaxed">
          Enter any designer fragrance. AI breaks down its exact scent DNA and finds the closest real Indian market match under ₹300.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="liquid-glass rounded-[2rem] p-10 flex flex-col items-center text-center gap-6 group hover:bg-white/[0.03] transition-all"
            >
              <div className="liquid-glass-strong rounded-full w-14 h-14 flex items-center justify-center text-white shrink-0">
                <step.icon size={24} />
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-2xl font-heading italic text-white leading-tight">{step.title}</h4>
                <p className="text-white/40 font-body font-light text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
