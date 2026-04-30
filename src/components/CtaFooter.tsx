import HlsVideo from './HlsVideo';
import { motion } from 'framer-motion';

export default function CtaFooter() {
  const footerLinks = ['Privacy', 'Terms', 'Contact'];

  return (
    <section className="relative w-full min-h-[900px] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HlsVideo 
          src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center pt-20">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          viewport={{ once: true }}
          className="text-7xl md:text-[10rem] lg:text-[13rem] font-heading italic text-white leading-[0.75] mb-16 tracking-tighter drop-shadow-[0_20px_100px_rgba(255,255,255,0.1)] shrink-0"
        >
          Signature Scent.<br />Accessible.<br />Finally.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-white/60 font-body font-bold text-xl md:text-3xl max-w-2xl leading-relaxed mb-20 drop-shadow-lg"
        >
          Stop overpaying for marketing. Find the core scent DNA for under ₹300.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <a href="#search" className="bg-white text-black rounded-full px-16 py-6 text-black font-black text-xs md:text-sm uppercase tracking-widest hover:scale-110 hover:bg-yellow-400 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]">
            Explore Collection
          </a>
          <a href="#how-it-works" className="liquid-glass border border-white/20 text-white rounded-full px-16 py-6 font-black text-xs md:text-sm uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all backdrop-blur-xl">
            Our Analysis Method
          </a>
        </motion.div>

        {/* Footer Bar */}
        <div className="mt-80 w-full flex flex-col md:flex-row items-center justify-between py-12 border-t border-white/10 gap-8 relative z-10">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-white font-heading italic text-2xl">FragranceIQ</div>
            <div className="text-white/20 text-[9px] font-black tracking-[0.6em] uppercase">
              © 2026 Fragrance Intelligence System.
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            {footerLinks.map(link => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`}
                className="text-white/30 text-[10px] font-black tracking-[0.4em] hover:text-white transition-all underline underline-offset-8 decoration-white/0 hover:decoration-white/10"
              >
                {link.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
