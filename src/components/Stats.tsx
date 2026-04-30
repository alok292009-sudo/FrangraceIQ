import HlsVideo from './HlsVideo';
import { motion } from 'framer-motion';

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
          className="liquid-glass rounded-[4rem] p-12 md:p-24 flex flex-col items-center gap-16 border border-white/10 shadow-[0_60px_100px_-30px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          {/* Subtle Scan Line */}
          <motion.div 
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] bg-white/5 z-0 pointer-events-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-10 w-full relative z-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-6 group">
                <div className="flex flex-col">
                  <motion.span 
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: idx * 0.2, duration: 1 }}
                    className="text-6xl md:text-8xl font-heading italic text-white tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:text-yellow-400 transition-colors duration-700"
                  >
                    {stat.value}
                  </motion.span>
                  <div className="h-[2px] w-0 bg-yellow-400/50 mx-auto mt-2 group-hover:w-16 transition-all duration-700" />
                </div>
                <span className="text-white/40 font-black text-[10px] md:text-[12px] tracking-[0.6em] uppercase drop-shadow-sm px-2">
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
