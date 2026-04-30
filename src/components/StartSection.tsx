import HlsVideo from './HlsVideo';
import { motion } from 'motion/react';

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
        <div className="liquid-glass rounded-full px-5 py-1.5 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-white">
          How It Works
        </div>
        
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9]">
          You dream it.<br />We ship it.
        </h2>
        
        <p className="text-white/60 font-body font-light text-base md:text-lg leading-relaxed max-w-xl">
          Share your vision. Our AI handles the rest — wireframes, design, code, launch. 
          All in days, not quarters.
        </p>

        <button className="liquid-glass-strong rounded-full px-10 py-4 text-white font-medium hover:scale-105 transition-transform active:scale-95">
          Get Started
        </button>
      </div>
    </section>
  );
}
