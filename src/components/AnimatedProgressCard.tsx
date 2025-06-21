'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  width: string;
  color: string;
  delay?: number;
}

interface AnimatedProgressCardProps {
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ width, color, delay = 0 }) => {
  const [animatedWidth, setAnimatedWidth] = useState('0%');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(width);
    }, delay);
    return () => clearTimeout(timer);
  }, [width, delay]);

  return (
    <motion.div
      className="h-4 rounded-full overflow-hidden"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ 
          background: color,
          width: animatedWidth
        }}
        initial={{ width: '0%' }}
        animate={{ width: animatedWidth }}
        transition={{ 
          duration: 1.5, 
          ease: "easeOut",
          delay: delay / 1000
        }}
      />
    </motion.div>
  );
};

const AnimatedProgressCard: React.FC<AnimatedProgressCardProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`relative max-w-2xl mx-auto ${className}`}
    >
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-purple-800/40 rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-2xl" />
          <div className="absolute bottom-4 right-4 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <ProgressBar 
              width="85%" 
              color="linear-gradient(90deg, #3B82F6, #6366F1)" 
              delay={200}
            />
            <ProgressBar 
              width="70%" 
              color="linear-gradient(90deg, #8B5CF6, #EC4899)" 
              delay={400}
            />
            <ProgressBar 
              width="92%" 
              color="linear-gradient(90deg, #06B6D4, #3B82F6)" 
              delay={600}
            />
          </div>

          <div className="space-y-4">
            <ProgressBar 
              width="75%" 
              color="rgba(255, 255, 255, 0.3)" 
              delay={800}
            />
            <ProgressBar 
              width="100%" 
              color="rgba(255, 255, 255, 0.25)" 
              delay={1000}
            />
            <ProgressBar 
              width="60%" 
              color="rgba(255, 255, 255, 0.2)" 
              delay={1200}
            />
            <ProgressBar 
              width="88%" 
              color="rgba(255, 255, 255, 0.15)" 
              delay={1400}
            />
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          style={{
            transform: 'skewX(-20deg)',
          }}
        />
      </div>
    </motion.div>
  );
};

export default AnimatedProgressCard;
