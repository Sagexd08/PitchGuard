'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TrueFocusProps {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence,
  manualMode = false,
  blurAmount = 4,
  borderColor = '#6366f1',
  animationDuration = 4,
  pauseBetweenAnimations = 8,
  className = '',
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const words = sentence.split(' ');

  useEffect(() => {
    if (!manualMode) {
      startAnimation();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [manualMode, animationDuration, pauseBetweenAnimations]);

  const startAnimation = () => {
    setIsAnimating(true);
    let currentIndex = 0;

    const animateNext = () => {
      setFocusedIndex(currentIndex);
      
      timeoutRef.current = setTimeout(() => {
        currentIndex++;
        if (currentIndex < words.length) {
          animateNext();
        } else {
          setFocusedIndex(-1);
          setIsAnimating(false);
          
          timeoutRef.current = setTimeout(() => {
            if (!manualMode) {
              startAnimation();
            }
          }, pauseBetweenAnimations * 1000);
        }
      }, animationDuration * 1000);
    };

    animateNext();
  };

  const handleWordClick = (index: number) => {
    if (manualMode) {
      setFocusedIndex(index === focusedIndex ? -1 : index);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-tight tracking-tight font-['Montserrat']">
          {words.map((word, index) => (
            <motion.span
              key={index}
              className={`inline-block mx-2 cursor-pointer transition-all duration-${Math.floor(animationDuration * 1000)} ease-out relative`}
              onClick={() => handleWordClick(index)}
              style={{
                filter: focusedIndex === -1 || focusedIndex === index 
                  ? 'blur(0px)' 
                  : `blur(${blurAmount}px)`,
                opacity: focusedIndex === -1 || focusedIndex === index ? 1 : 0.3,
                transform: focusedIndex === index ? 'scale(1.05)' : 'scale(1)',
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              {focusedIndex === index && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    border: `2px solid ${borderColor}`,
                    boxShadow: `0 0 20px ${borderColor}40`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              <motion.span
                className="relative z-10 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: focusedIndex === index ? ['0%', '100%'] : '0%',
                }}
                transition={{
                  duration: 2,
                  repeat: focusedIndex === index ? Infinity : 0,
                  repeatType: 'reverse',
                }}
              >
                {word}
              </motion.span>
              
              {focusedIndex === index && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-lg backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.span>
          ))}
        </h1>
        
        <motion.div
          className="mt-8 text-white/60 text-lg font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {manualMode ? 'Click on words to focus' : 'AI-Powered Privacy-First Pitch Analysis'}
        </motion.div>
      </motion.div>
      
      {isAnimating && (
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-16"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-indigo-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrueFocus;
