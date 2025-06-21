'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Floating3DBackgroundProps {
  children?: React.ReactNode;
  particleCount?: number;
  animationSpeed?: number;
  particleSize?: number;
  colors?: string[];
  className?: string;
}

const Floating3DBackground: React.FC<Floating3DBackgroundProps> = ({
  children,
  particleCount = 15,
  animationSpeed = 1,
  particleSize = 4,
  colors = [
    'rgba(99, 102, 241, 0.3)',
    'rgba(139, 92, 246, 0.3)',
    'rgba(236, 72, 153, 0.3)',
    'rgba(59, 130, 246, 0.3)',
    'rgba(16, 185, 129, 0.3)',
  ],
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const generateParticles = () => {
    return Array.from({ length: particleCount }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
      size: particleSize + Math.random() * particleSize,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
  };

  const particles = generateParticles();

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full backdrop-blur-sm"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -40, 30, -20, 0],
            z: [0, 30, -20, 40, 0],
            scale: [1, 1.2, 0.8, 1.1, 1],
            opacity: [0.3, 0.8, 0.4, 0.9, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration / animationSpeed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
      
      {/* Floating geometric shapes */}
      {Array.from({ length: 8 }, (_, index) => (
        <motion.div
          key={`shape-${index}`}
          className="absolute border border-white/10 backdrop-blur-sm"
          style={{
            width: 20 + Math.random() * 40,
            height: 20 + Math.random() * 40,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            borderRadius: Math.random() > 0.5 ? '50%' : '8px',
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            rotate: [0, 360],
            scale: [1, 1.3, 0.7, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 3,
          }}
        />
      ))}
      
      {/* Gradient orbs */}
      {Array.from({ length: 5 }, (_, index) => (
        <motion.div
          key={`orb-${index}`}
          className="absolute rounded-full"
          style={{
            width: 60 + Math.random() * 80,
            height: 60 + Math.random() * 80,
            background: `radial-gradient(circle, ${colors[index % colors.length]} 0%, transparent 70%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(20px)',
          }}
          animate={{
            x: [0, 200, -100, 0],
            y: [0, -150, 100, 0],
            scale: [1, 1.5, 0.8, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 25 + Math.random() * 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
      
      {children}
    </div>
  );
};

export default Floating3DBackground;
