import HlsVideo from './HlsVideo';
import { motion } from 'motion/react';

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
          initial={{ opacity: 0, filter: 'blur(20px)', y: 40 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl lg:text-[7rem] font-heading italic text-white leading-[0.8] mb-12 tracking-tight drop-shadow-2xl"
        >
          Your signature scent.<br />₹300.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-white font-body font-bold text-xl md:text-3xl max-w-2xl leading-relaxed mb-20 drop-shadow-lg"
        >
          Stop overpaying. Find your perfect dupe right now.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center gap-8"
        >
          <a href="#search" className="bg-white text-black rounded-full px-16 py-6 text-black font-black text-xl hover:scale-110 active:scale-95 transition-all shadow-2xl">
            Find My Dupe
          </a>
          <a href="#how-it-works" className="liquid-glass border-2 border-white/20 text-white rounded-full px-16 py-6 font-black text-xl hover:bg-white/10 active:scale-95 transition-all font-body backdrop-blur-xl">
            How It Works
          </a>
        </motion.div>

        {/* Footer Bar */}
        <div className="mt-60 w-full flex flex-col md:flex-row items-center justify-between py-16 border-t-2 border-white/10 gap-8">
          <div className="text-white/50 text-xs font-black tracking-[0.4em] uppercase">
            © 2026 FragranceIQ. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-12">
            {footerLinks.map(link => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`}
                className="text-white/60 text-xs font-black tracking-[0.4em] hover:text-white transition-all hover:scale-110"
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
