import { motion } from 'motion/react';

export default function FeaturesChess() {
  const rows = [
    {
      badge: 'Capabilities',
      title: 'Designed to convert. Built to perform.',
      body: 'Every pixel is intentional. Our AI studies what works across thousands of top sites — then builds yours to outperform them all.',
      cta: 'Learn more',
      gif: 'https://motionsites.ai/assets/hero-finlytic-preview-CV9g0FHP.gif',
      reverse: false
    },
    {
      title: 'It gets smarter. Automatically.',
      body: 'Your site evolves on its own. AI monitors every click, scroll, and conversion — then optimizes in real time. No manual updates. Ever.',
      cta: 'See how it works',
      gif: 'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
      reverse: true
    }
  ];

  return (
    <section className="w-full bg-black py-32 px-6 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-40">
        
        {/* Header (optional if not in request strictly, but prompt says "Capabilities" badge + heading) */}
        <div className="flex flex-col items-center text-center gap-6 mb-12">
          <div className="liquid-glass rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-widest text-white border border-white/20 shadow-lg">
            Capabilities
          </div>
          <h2 className="text-5xl md:text-6xl font-heading italic text-white drop-shadow-lg">
            Pro data. Zero complexity.
          </h2>
        </div>

        {rows.map((row, idx) => (
          <div 
            key={idx}
            className={`flex flex-col ${row.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-32`}
          >
            {/* Content Box */}
            <div className="flex-1 flex flex-col items-start gap-8 max-w-xl">
              <h3 className="text-4xl md:text-6xl font-heading italic text-white leading-tight drop-shadow-md">
                {row.title}
              </h3>
              <p className="text-white font-body font-bold text-lg md:text-xl leading-relaxed opacity-90 drop-shadow-sm">
                {row.body}
              </p>
              <button className="bg-white text-black rounded-full px-10 py-4 text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-xl">
                {row.cta}
              </button>
            </div>

            {/* Visual Box */}
            <div className="flex-1 w-full lg:w-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: '-10%' }}
                className="liquid-glass rounded-[2rem] overflow-hidden p-1.5"
              >
                <div className="rounded-[1.8rem] overflow-hidden bg-white/5 aspect-video flex items-center justify-center">
                   <img 
                    src={row.gif} 
                    alt={row.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                   />
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
