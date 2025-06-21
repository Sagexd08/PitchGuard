'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AdvancedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave';
  color?: string;
  className?: string;
  message?: string;
  type?: 'spinner' | 'dots' | 'pulse' | 'wave';
}

const AdvancedLoader: React.FC<AdvancedLoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = '#6366f1',
  className = '',
  message,
  type,
}) => {
  // Use type prop as fallback for variant
  const loaderVariant = type || variant;
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const SpinnerLoader = () => (
    <motion.div
      className={`border-2 border-gray-300 border-t-current rounded-full ${sizeClasses[size]} ${className}`}
      style={{ borderTopColor: color }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );

  const DotsLoader = () => (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`rounded-full ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'}`}
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );

  const PulseLoader = () => (
    <motion.div
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
      }}
    />
  );

  const WaveLoader = () => (
    <div className={`flex items-end space-x-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`${size === 'sm' ? 'w-1' : size === 'md' ? 'w-2' : 'w-3'} rounded-sm`}
          style={{ 
            backgroundColor: color,
            height: size === 'sm' ? '16px' : size === 'md' ? '24px' : '32px'
          }}
          animate={{
            scaleY: [1, 2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (loaderVariant) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'wave':
        return <WaveLoader />;
      case 'spinner':
      default:
        return <SpinnerLoader />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoader()}
      {message && (
        <p className="text-sm text-white/70 animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default AdvancedLoader;
