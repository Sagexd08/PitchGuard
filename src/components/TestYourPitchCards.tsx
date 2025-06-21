'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, ArrowRight, Zap, Target, Brain, Shield } from 'lucide-react';
import Floating3DBackground from './Floating3DBackground';
import ClickSpark from './ClickSpark';

interface TestYourPitchCardsProps {
  onGetStarted?: () => void;
  className?: string;
}

const TestYourPitchCards: React.FC<TestYourPitchCardsProps> = ({
  onGetStarted,
  className = "",
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const cards = [
    {
      icon: <Play className="w-8 h-8 text-white" />,
      title: "Test Your Pitch",
      description: "Upload your pitch deck and get instant AI-powered analysis with detailed feedback on narrative clarity, market fit, and investor appeal.",
      gradient: "from-green-500 to-emerald-600",
      action: "Start Analysis",
      primary: true,
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      title: "Precision Scoring",
      description: "Get detailed scores across 12 key criteria including market opportunity, competitive advantage, and financial projections.",
      gradient: "from-blue-500 to-cyan-600",
      action: "View Criteria",
      primary: false,
    },
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: "AI Insights",
      description: "Receive actionable recommendations powered by advanced AI analysis to improve your pitch and increase funding success.",
      gradient: "from-purple-500 to-pink-600",
      action: "Learn More",
      primary: false,
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Privacy First",
      description: "Your pitch data is encrypted with AES-256 and never stored. Complete privacy and security guaranteed.",
      gradient: "from-orange-500 to-red-600",
      action: "Security Details",
      primary: false,
    },
  ];

  return (
    <div ref={ref} className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 ${className}`}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 60, scale: 0.8, rotateY: -15 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateY: 0 } : {}}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.15, 
            type: "spring", 
            bounce: 0.3 
          }}
          className="group relative perspective-1000"
        >
          <ClickSpark>
            <motion.div
              className={`
                glass-card p-8 h-full transition-all duration-500 relative overflow-hidden border border-white/10 transform-gpu cursor-pointer
                ${card.primary 
                  ? 'hover:scale-110 hover:shadow-2xl hover:shadow-green-500/40 hover:border-green-400/50' 
                  : 'hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 hover:border-purple-400/40'
                }
              `}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
              onClick={card.primary ? onGetStarted : undefined}
            >
              {/* Floating 3D Background */}
              <Floating3DBackground>
                <div className="opacity-30" />
              </Floating3DBackground>

              {/* Enhanced background for primary card */}
              {card.primary && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}

              {/* Animated corner decoration */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.4, 0.1]
                }}
                transition={{
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                  scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className={`absolute top-4 right-4 w-8 h-8 border rounded-lg backdrop-blur-sm ${
                  card.primary ? 'border-green-400/30' : 'border-purple-400/30'
                }`}
              />

              {/* Icon with gradient background */}
              <motion.div
                className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}
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
                  {card.icon}
                </motion.div>
                
                {/* Icon glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <motion.h3 
                  className={`text-xl font-bold mb-4 transition-colors font-['Montserrat'] ${
                    card.primary 
                      ? 'text-white group-hover:text-green-300' 
                      : 'text-white group-hover:text-purple-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  {card.title}
                </motion.h3>
                
                <motion.p 
                  className="text-white/70 leading-relaxed mb-6 text-sm"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {card.description}
                </motion.p>

                {/* Action button */}
                <motion.div
                  className={`
                    inline-flex items-center px-4 py-2 backdrop-blur-sm rounded-full text-sm font-semibold border transition-all duration-300
                    ${card.primary 
                      ? 'bg-green-500/20 text-green-300 border-green-400/30 hover:bg-green-500/30 hover:border-green-400/50' 
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/15 hover:border-white/30'
                    }
                  `}
                  whileHover={{ 
                    scale: 1.05,
                    x: 5,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {card.action}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.div>
              </div>

              {/* Primary card special effects */}
              {card.primary && (
                <>
                  {/* Pulsing border */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-green-400/30"
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Success indicator */}
                  <motion.div
                    className="absolute top-2 left-2 w-3 h-3 bg-green-400 rounded-full"
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
                </>
              )}
            </motion.div>
          </ClickSpark>
        </motion.div>
      ))}
    </div>
  );
};

export default TestYourPitchCards;
