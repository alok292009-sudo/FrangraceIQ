import { motion } from 'motion/react';

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="liquid-glass rounded-[2.5rem] p-12 flex flex-col gap-10 hover:bg-white/10 transition-all border-2 border-white/10 shadow-2xl"
            >
              <p className="text-white font-body font-bold text-xl italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex flex-col gap-2 mt-auto">
                <span className="text-white font-body font-black text-lg">— {t.name}</span>
                <span className="text-white font-body font-black text-[10px] uppercase tracking-[0.3em] opacity-60 bg-white/10 w-fit px-3 py-1 rounded-full">{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
