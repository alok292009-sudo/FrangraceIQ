import HlsVideo from './HlsVideo';
import { motion } from 'motion/react';

export default function Stats() {
  const stats = [
    { value: '5,000+', label: 'Perfumes analyzed' },
    { value: '₹250', label: 'Average dupe price' },
    { value: '73%', label: 'Average similarity' },
    { value: 'Daily', label: 'New dupes added' }
  ];

  return (
    <section className="relative w-full min-h-[700px] flex items-center justify-center py-32 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HlsVideo 
          src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          style={{ filter: 'saturate(0)' }}
        />
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="liquid-glass rounded-[3rem] p-12 md:p-16 flex flex-col items-center gap-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20 w-full">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-4">
                <span className="text-4xl md:text-5xl font-heading italic text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-white/60 font-body font-light text-sm tracking-widest uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
