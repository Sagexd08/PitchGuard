'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Zap, Lock, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'End-to-End Encryption',
      description: 'Your pitch is encrypted on your device using AES-256-GCM before transmission'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced LLM models evaluate clarity, originality, team strength, and market fit'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Results',
      description: 'Get detailed scores and actionable feedback in seconds'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Zero Data Retention',
      description: 'Your pitch content is never stored - processed in memory and immediately deleted'
    }
  ];

  const benefits = [
    'Military-grade encryption using Web Crypto API',
    'No pitch data stored on servers',
    'Cryptographic receipt for verification',
    'Deterministic AI scoring with temperature 0.0',
    'In-memory processing only'
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Stealth Code
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Privacy-first AI pitch analysis with end-to-end encryption. 
          Get professional feedback without compromising your confidential ideas.
        </motion.p>

        <motion.button
          onClick={onGetStarted}
          className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Analyze Your Pitch
          <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="text-blue-400 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
            <p className="text-white/70 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Security Benefits */}
      <motion.div
        className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-16"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Built for Privacy & Security
          </h2>
          <p className="text-white/70 text-lg">
            Your intellectual property is protected with enterprise-grade security
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              Security Features
            </h3>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-start text-white/80"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="bg-black/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              How It Works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Client-Side Encryption</p>
                  <p className="text-white/60 text-sm">Your pitch is encrypted in your browser using AES-256-GCM</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">Secure Transmission</p>
                  <p className="text-white/60 text-sm">Encrypted data is sent to our secure analysis servers</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">AI Analysis</p>
                  <p className="text-white/60 text-sm">Decrypted in memory, analyzed by AI, then immediately deleted</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  4
                </div>
                <div>
                  <p className="text-white font-medium">Verified Results</p>
                  <p className="text-white/60 text-sm">Receive scores with cryptographic receipt for verification</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Get Professional Feedback?
        </h2>
        <p className="text-white/70 text-lg mb-8">
          Join thousands of entrepreneurs who trust Stealth Code for confidential pitch analysis
        </p>
        <motion.button
          onClick={onGetStarted}
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Your Analysis Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;