import HlsVideo from './HlsVideo';
import { motion } from 'framer-motion';

export default function StartSection() {
  return (
    <section className="relative w-full min-h-[800px] flex flex-col items-center justify-center py-32 mt-[-100px]">
      {/* HLS Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HlsVideo 
          src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        {/* Gradient Fades */}
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-10 text-center flex flex-col items-center gap-8">
        <div className="liquid-glass rounded-full px-6 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-white border border-white/20 shadow-xl">
          The Process
        </div>
        
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9] drop-shadow-2xl">
          You search.<br />We decode.
        </h2>
        
        <p className="text-white font-body font-bold text-lg md:text-xl leading-relaxed max-w-xl drop-shadow-md">
          Enter any designer fragrance. AI breaks down its exact scent DNA and finds the closest real Indian market match under ₹300.
        </p>

        <a href="#search" className="bg-white text-black rounded-full px-12 py-5 text-sm font-black hover:scale-110 active:scale-95 transition-all shadow-2xl">
          Start Your Search
        </a>
      </div>
    </section>
  );
}
