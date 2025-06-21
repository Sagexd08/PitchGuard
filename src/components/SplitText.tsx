'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitType?: 'words' | 'chars' | 'lines';
  from?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
  };
  to?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotate?: number;
  };
  stagger?: number;
  once?: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  splitType = 'words',
  from = { opacity: 0, y: 50 },
  to = { opacity: 1, y: 0 },
  stagger = 0.05,
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  const splitText = () => {
    switch (splitType) {
      case 'chars':
        return text.split('').map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={from}
            animate={isInView ? to : from}
            transition={{
              duration: duration * 0.6,
              delay: delay / 1000 + index * stagger,
              ease: "easeOut"
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ));
      
      case 'lines':
        return text.split('\n').map((line, index) => (
          <motion.div
            key={index}
            className="block"
            initial={from}
            animate={isInView ? to : from}
            transition={{
              duration: duration,
              delay: delay / 1000 + index * stagger * 10,
              ease: "easeOut"
            }}
          >
            {line}
          </motion.div>
        ));
      
      case 'words':
      default:
        return text.split(' ').map((word, index) => (
          <motion.span
            key={index}
            className="inline-block mr-2"
            initial={from}
            animate={isInView ? to : from}
            transition={{
              duration: duration,
              delay: delay / 1000 + index * stagger,
              ease: "easeOut"
            }}
          >
            {word}
          </motion.span>
        ));
    }
  };

  return (
    <div ref={ref} className={className}>
      {splitText()}
    </div>
  );
};

export default SplitText;
