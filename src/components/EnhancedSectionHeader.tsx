'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import SplitText from './SplitText';

interface EnhancedSectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  titleSize?: 'sm' | 'md' | 'lg' | 'xl';
  alignment?: 'left' | 'center' | 'right';
  gradient?: boolean;
  animated?: boolean;
}

const EnhancedSectionHeader: React.FC<EnhancedSectionHeaderProps> = ({
  title,
  subtitle,
  description,
  className = "",
  titleSize = 'lg',
  alignment = 'center',
  gradient = true,
  animated = true,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const getSizeClasses = () => {
    switch (titleSize) {
      case 'sm':
        return 'text-3xl md:text-4xl';
      case 'md':
        return 'text-4xl md:text-5xl';
      case 'lg':
        return 'text-5xl md:text-6xl lg:text-7xl';
      case 'xl':
        return 'text-6xl md:text-7xl lg:text-8xl';
      default:
        return 'text-5xl md:text-6xl lg:text-7xl';
    }
  };

  const getAlignmentClasses = () => {
    switch (alignment) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      case 'center':
      default:
        return 'text-center';
    }
  };

  const titleClasses = `
    ${getSizeClasses()}
    ${getAlignmentClasses()}
    font-bold mb-6 leading-tight tracking-tight font-['Montserrat']
    ${gradient 
      ? 'bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent' 
      : 'text-white'
    }
  `;

  return (
    <motion.div
      ref={ref}
      initial={animated ? { opacity: 0, y: 50 } : {}}
      animate={animated && isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`${getAlignmentClasses()} ${className}`}
    >
      {/* Subtitle */}
      {subtitle && (
        <motion.div
          initial={animated ? { opacity: 0, y: 30 } : {}}
          animate={animated && isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-full text-sm font-semibold text-indigo-300 border border-indigo-400/30">
            <motion.div
              className="w-2 h-2 bg-indigo-400 rounded-full mr-2"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {subtitle}
          </span>
        </motion.div>
      )}

      {/* Main Title */}
      {animated ? (
        <SplitText
          text={title}
          className={titleClasses}
          delay={300}
          duration={0.8}
          splitType="words"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          stagger={0.08}
        />
      ) : (
        <h2 className={titleClasses}>
          {title}
        </h2>
      )}

      {/* Description */}
      {description && (
        <motion.div
          initial={animated ? { opacity: 0, y: 30 } : {}}
          animate={animated && isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={`text-white/70 text-lg md:text-xl leading-relaxed max-w-4xl ${
            alignment === 'center' ? 'mx-auto' : ''
          }`}
        >
          {description}
        </motion.div>
      )}

      {/* Decorative elements */}
      {animated && (
        <motion.div
          className={`mt-8 flex ${
            alignment === 'center' ? 'justify-center' : 
            alignment === 'right' ? 'justify-end' : 'justify-start'
          }`}
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnhancedSectionHeader;
