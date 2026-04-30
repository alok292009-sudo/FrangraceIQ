import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  direction?: 'top' | 'bottom';
}

export default function BlurText({
  text,
  delay = 0,
  className = '',
  direction = 'bottom',
}: BlurTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay / 1000,
      },
    },
  };

  const childVariants = {
    hidden: {
      filter: 'blur(10px)',
      opacity: 0,
      y: direction === 'bottom' ? 50 : -50,
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.h1
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.2em] last:mr-0">
          <motion.span variants={childVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}
