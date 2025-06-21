'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import Floating3DBackground from './Floating3DBackground';
import ClickSpark from './ClickSpark';

interface EnhancedFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient?: string;
  stats?: string;
  delay?: number;
  className?: string;
}

const EnhancedFeatureCard: React.FC<EnhancedFeatureCardProps> = ({
  icon,
  title,
  description,
  gradient = "from-indigo-500 to-purple-600",
  stats,
  delay = 0,
  className = "",
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateY: -20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.9, 
        delay: delay * 0.12, 
        type: "spring", 
        bounce: 0.3 
      }}
      className={`group relative cursor-pointer perspective-1000 ${className}`}
    >
      <ClickSpark>
        <div className="glass-card p-10 h-full hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 relative overflow-hidden border border-white/10 hover:border-purple-400/40 transform-gpu">
          {/* Floating 3D Background */}
          <Floating3DBackground>
            <div className="opacity-25" />
          </Floating3DBackground>

          {/* Additional floating background layer */}
          <div className="absolute inset-0 opacity-20">
            <Floating3DBackground>
              <div className="opacity-50" />
            </Floating3DBackground>
          </div>

          {/* Animated corner decoration */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-3 right-3 w-12 h-12 border border-purple-400/30 rounded-2xl backdrop-blur-sm"
          />

          {/* Icon with gradient background */}
          <motion.div
            className={`w-20 h-20 bg-gradient-to-r ${gradient} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 relative z-10`}
            whileHover={{ 
              scale: 1.15,
              rotate: 5,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {icon}
            </motion.div>
            
            {/* Icon glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
          </motion.div>

          {/* Content */}
          <div className="relative z-10">
            <motion.h3 
              className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors font-['Montserrat']"
              whileHover={{ scale: 1.02 }}
            >
              {title}
            </motion.h3>
            
            <motion.p 
              className="text-white/70 leading-relaxed mb-6"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {description}
            </motion.p>

            {/* Stats badge */}
            {stats && (
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-white border border-white/20"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.15)"
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full mr-2"
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
                {stats}
              </motion.div>
            )}
          </div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            initial={false}
          />

          {/* Border glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </ClickSpark>
    </motion.div>
  );
};

export default EnhancedFeatureCard;
