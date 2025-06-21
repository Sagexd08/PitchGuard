import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap, cleanupScrollTriggers } from '../utils/gsap-config';
import CountUp from './CountUp';

interface StatItem {
  value: number;
  label: string;
  icon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  color?: string;
  description?: string;
}

interface AnimatedStatsProps {
  stats: StatItem[];
  layout?: 'grid' | 'horizontal' | 'vertical';
  animated?: boolean;
  className?: string;
  cardVariant?: 'glass' | 'solid' | 'minimal';
}

const AnimatedStats: React.FC<AnimatedStatsProps> = ({
  stats,
  layout = 'grid',
  animated = true,
  className = '',
  cardVariant = 'glass'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.stat-card');
    
    // Initial animation
    gsap.fromTo(cards, 
      {
        y: 50,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom-=100px',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Continuous floating animation
    cards.forEach((card, index) => {
      gsap.to(card, {
        y: -10,
        duration: 2 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.3
      });
    });

    return () => {
      cleanupScrollTriggers();
    };
  }, [animated]);

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap justify-center gap-6';
      case 'vertical':
        return 'flex flex-col gap-6';
      case 'grid':
      default:
        return `grid gap-6 ${
          stats.length === 1 ? 'grid-cols-1' :
          stats.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
          stats.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`;
    }
  };

  const getCardClasses = () => {
    const baseClasses = 'stat-card p-6 text-center group cursor-pointer transition-all duration-300';
    
    switch (cardVariant) {
      case 'solid':
        return `${baseClasses} bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700`;
      case 'minimal':
        return `${baseClasses} border-b-2 border-transparent hover:border-blue-400 pb-4`;
      case 'glass':
      default:
        return `${baseClasses} glass-card hover:scale-105`;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`${getLayoutClasses()} ${className}`}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={`${stat.label}-${index}`}
          className={getCardClasses()}
          whileHover={{ 
            scale: cardVariant === 'glass' ? 1.05 : 1.02,
            y: -5 
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Icon */}
          {stat.icon && (
            <motion.div
              className="inline-block mb-4"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                stat.color ? `text-${stat.color}` : 'text-blue-400'
              }`}>
                {stat.icon}
              </div>
            </motion.div>
          )}

          {/* Value */}
          <div className="mb-2">
            <motion.div
              className={`text-3xl md:text-4xl font-bold ${
                stat.color ? `text-${stat.color}` : 'text-white'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: index * 0.1 + 0.5,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
            >
              {stat.prefix && <span className="text-lg">{stat.prefix}</span>}
              <CountUp
                end={stat.value}
                decimals={stat.decimals || 0}
                duration={2}
                delay={index * 0.2}
              />
              {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
            </motion.div>
          </div>

          {/* Label */}
          <motion.h3
            className="text-lg font-semibold text-white mb-2 group-hover:text-gradient transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.7 }}
          >
            {stat.label}
          </motion.h3>

          {/* Description */}
          {stat.description && (
            <motion.p
              className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.9 }}
            >
              {stat.description}
            </motion.p>
          )}

          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {/* Floating particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${
                  stat.color ? `bg-${stat.color}` : 'bg-blue-400'
                } opacity-30`}
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              />
            ))}
          </div>

          {/* Hover glow effect */}
          <motion.div
            className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
              stat.color ? `bg-${stat.color}` : 'bg-blue-400'
            } blur-xl`}
            style={{ zIndex: -1 }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedStats;
