import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Zap, Wallet, Home, Archive, User, Settings, Crown } from 'lucide-react';
import TrueFocus from './components/TrueFocus';
import Dock from './components/Dock';
import PitchModal from './components/PitchModal';
import Web3PaymentModal from './components/Web3PaymentModal';
import PrivacyDashboard from './components/PrivacyDashboard';

function App() {
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState('');

  const dockItems = [
    { icon: <Home size={20} />, label: 'Home', onClick: () => scrollToSection('hero') },
    { icon: <Brain size={20} />, label: 'Analyze', onClick: () => setIsPitchModalOpen(true) },
    { icon: <Shield size={20} />, label: 'Privacy', onClick: () => scrollToSection('privacy') },
    { icon: <Crown size={20} />, label: 'Premium', onClick: () => handlePremiumClick('Enhanced AI Analysis') },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePremiumClick = (feature: string) => {
    setPremiumFeature(feature);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-slate-800 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5"></div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Heading with TrueFocus */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <TrueFocus
                sentence="StealthCode — Secure Your Pitch. Perfect Your Future."
                manualMode={false}
                blurAmount={5}
                borderColor="neon-blue"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The world's first privacy-first AI pitch evaluator. Zero-knowledge architecture meets 
              military-grade encryption for founders who value both feedback and confidentiality.
            </motion.p>

            {/* Feature Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-neon-blue/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-neon-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Zero-Knowledge Security</h3>
                <p className="text-gray-400 text-sm">Your pitch never leaves your device in plain text. AES-256-GCM encryption ensures complete privacy.</p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-neon-purple/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-neon-purple" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-400 text-sm">Advanced AI evaluation across 8 comprehensive criteria with deterministic scoring for consistent results.</p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                <div className="w-12 h-12 bg-neon-green/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-400 text-sm">Complete analysis in under 30 seconds with real-time feedback and actionable recommendations.</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                onClick={() => setIsPitchModalOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-5 h-5" />
                <span>Analyze Your Pitch</span>
              </motion.button>

              <motion.button
                onClick={() => handlePremiumClick('Premium Features')}
                className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wallet className="w-5 h-5" />
                <span>Unlock Premium</span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Privacy Dashboard Section */}
        <section id="privacy">
          <PrivacyDashboard />
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Trusted by Forward-Thinking Founders
              </h2>
              <p className="text-gray-400 text-lg">
                Join the revolution of privacy-first pitch evaluation
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { value: '10,000+', label: 'Pitches Analyzed' },
                { value: '99.9%', label: 'Privacy Guaranteed' },
                { value: '<30s', label: 'Analysis Time' },
                { value: '24/7', label: 'Availability' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-neon-blue mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-slate-700/50">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">StealthCode</h3>
              <p className="text-gray-400">Privacy-first AI pitch evaluation platform</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-400">
              <span>© 2025 StealthCode. All rights reserved.</span>
              <span>•</span>
              <span>Zero data retention • Military-grade encryption</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Dock Navigation */}
      <Dock
        items={dockItems}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />

      {/* Modals */}
      <PitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
      />

      <Web3PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        feature={premiumFeature}
        priceEth="0.01"
        onSuccess={() => {
          console.log('Premium feature unlocked!');
        }}
      />
    </div>
  );
}

export default App;