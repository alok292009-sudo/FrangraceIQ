
import HlsVideo from './HlsVideo';
import { Zap, Palette, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Zap,
      title: 'Enter Any Luxury Perfume',
      description: 'Type any designer name like Sauvage or Aventus. We know the scent DNA of 5,000+ fragrances.'
    },
    {
      icon: Palette,
      title: 'AI Decodes Scent DNA',
      description: 'We break down core accords and key drivers using real fragrance chemistry, not marketing.'
    },
    {
      icon: BarChart3,
      title: 'Get Your ₹300 Match',
      description: 'Find real products with honest similarity scores. No fake claims, just facts.'
    }
  ];

  return (
    <section className="relative w-full min-h-[900px] flex flex-col items-center justify-center py-40" id="how-it-works">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HlsVideo 
          src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center text-center">
        <div className="liquid-glass rounded-full px-6 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-white mb-10 border border-white/20 shadow-2xl">
          How It Works
        </div>
        
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9] mb-10 drop-shadow-2xl">
          You search. We decode.<br />You save.
        </h2>
        
        <p className="text-white font-body font-bold text-lg md:text-2xl max-w-3xl mb-24 leading-relaxed drop-shadow-md">
          Enter any designer fragrance. AI breaks down its exact scent DNA and finds the closest real Indian market match under ₹300.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="liquid-glass rounded-[2.5rem] p-12 flex flex-col items-center text-center gap-8 group hover:bg-white/10 transition-all border-2 border-white/10 shadow-2xl backdrop-blur-xl"
            >
              <div className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                <step.icon size={28} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-5">
                <h4 className="text-3xl font-heading italic text-white leading-tight drop-shadow-sm">{step.title}</h4>
                <p className="text-white font-body font-bold text-sm leading-relaxed opacity-90">
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
