import { motion } from 'framer-motion';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Found a Sauvage dupe for ₹240. Three people at the party asked what I was wearing.",
      name: "Arjun M.",
      role: "Mumbai"
    },
    {
      quote: "Finally an app that doesn't lie about scores. The 68% was spot on — honest and accurate.",
      name: "Priya K.",
      role: "Bangalore"
    },
    {
      quote: "Ordered the Aventus dupe same day. The dry-down is genuinely close. Incredible for ₹280.",
      name: "Rohan S.",
      role: "Delhi"
    }
  ];

  return (
    <section className="w-full bg-black py-40 px-6 lg:px-16" id="popular-dupes">
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6">
          <div className="liquid-glass rounded-full px-6 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-white border border-white/20 shadow-lg">
            Real Users
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9] drop-shadow-lg">
            Don't take our word for it.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4 md:px-0">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: idx * 0.2, ease: "circOut" }}
              viewport={{ once: true }}
              className="liquid-glass rounded-[4rem] p-12 flex flex-col gap-12 hover:bg-white/5 border border-white/5 shadow-2xl relative overflow-hidden group"
            >
              <div className="text-yellow-400/20 text-8xl font-heading italic absolute top-4 left-4 pointer-events-none font-black leading-none group-hover:text-yellow-400/40 transition-colors">
                “
              </div>
              
              <p className="text-white font-body font-bold text-2xl italic leading-relaxed relative z-10 drop-shadow-2xl">
                {t.quote}
              </p>
              
              <div className="flex flex-col gap-4 mt-auto relative z-10 border-t border-white/5 pt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-xs text-white/50 border border-white/10">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-body font-black text-xl tracking-tighter leading-none">{t.name}</span>
                    <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.5em] mt-1.5">{t.role}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
