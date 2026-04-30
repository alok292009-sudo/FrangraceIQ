import { Zap, Palette, BarChart3, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturesGrid() {
  const features = [
    {
      icon: Zap,
      title: 'Days, Not Months',
      description: 'Concept to launch at a pace that redefines fast. Because waiting isn\'t a strategy.'
    },
    {
      icon: Palette,
      title: 'Obsessively Crafted',
      description: 'Every detail considered. Every element refined. Design so precise, it feels inevitable.'
    },
    {
      icon: BarChart3,
      title: 'Built to Convert',
      description: 'Layouts informed by data. Decisions backed by performance. Results you can measure.'
    },
    {
      icon: Shield,
      title: 'Secure by Default',
      description: 'Enterprise-grade protection comes standard. SSL, DDoS mitigation, compliance. All included.'
    }
  ];

  return (
    <section className="w-full bg-black py-32 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6">
          <div className="liquid-glass rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-widest text-white border border-white/20 shadow-lg">
            Why Us
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading italic text-white tracking-tight lead-[0.9] drop-shadow-lg">
            The difference is everything.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="liquid-glass rounded-[2rem] p-10 flex flex-col items-start gap-8 group hover:bg-white/10 transition-all border border-white/5 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
            >
              <div className="bg-white text-black rounded-full w-14 h-14 flex items-center justify-center shrink-0 shadow-lg">
                <feature.icon size={24} />
              </div>
              <div className="flex flex-col gap-5">
                <h4 className="text-2xl font-heading italic text-white drop-shadow-sm">{feature.title}</h4>
                <p className="text-white font-body font-bold text-sm leading-relaxed opacity-90">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
