import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Zap, Brain } from 'lucide-react';
import { usePitchAnalysis } from '../hooks/usePitchAnalysis';

interface PitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PitchModal: React.FC<PitchModalProps> = ({ isOpen, onClose }) => {
  const [pitch, setPitch] = useState('');
  const { analyzePitch, isLoading, scores, receipt, error, reset } = usePitchAnalysis();
  const [encryptionStatus, setEncryptionStatus] = useState('idle');

  const handleSubmit = async () => {
    if (!pitch.trim()) return;

    setEncryptionStatus('encrypting');

    try {
      await analyzePitch(pitch, `Pitch Analysis ${new Date().toLocaleDateString()}`);
      setEncryptionStatus('complete');
    } catch (error) {
      console.error('Analysis failed:', error);
      setEncryptionStatus('error');
    }
  };

  const resetModal = () => {
    setPitch('');
    reset();
    setEncryptionStatus('idle');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModal}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-600/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-neon-blue/20 rounded-lg">
                  <Brain className="w-6 h-6 text-neon-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Pitch Analysis</h2>
                  <p className="text-sm text-gray-400">Secure • Private • Instant</p>
                </div>
              </div>
              <button
                onClick={resetModal}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Encryption Status */}
              <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                <Shield className={`w-5 h-5 ${encryptionStatus === 'complete' ? 'text-neon-green' : error ? 'text-red-400' : 'text-neon-blue'}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {encryptionStatus === 'idle' && 'Ready for secure analysis'}
                    {encryptionStatus === 'encrypting' && 'Encrypting with AES-256-GCM...'}
                    {isLoading && 'Encrypted • Processing with AI...'}
                    {encryptionStatus === 'complete' && scores && 'Analysis complete • Data purged'}
                    {encryptionStatus === 'error' && 'Error occurred • Data secure'}
                    {error && `Error: ${error}`}
                  </div>
                  <div className="text-xs text-gray-400">
                    Zero-knowledge architecture • No data retention
                  </div>
                </div>
                {(encryptionStatus === 'encrypting' || isLoading) && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Zap className="w-4 h-4 text-neon-blue" />
                  </motion.div>
                )}
              </div>

              {!scores ? (
                <>
                  {/* Pitch Input */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-white">
                      Your Startup Pitch
                    </label>
                    <textarea
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                      placeholder="Describe your startup idea, business model, target market, and unique value proposition..."
                      className="w-full h-48 p-4 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue/50 transition-all"
                      disabled={isLoading}
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{pitch.length} characters</span>
                      <span>Encrypted locally before transmission</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!pitch.trim() || isLoading}
                    className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Zap className="w-5 h-5" />
                        </motion.div>
                        <span>Analyzing Securely...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Brain className="w-5 h-5" />
                        <span>Analyze Pitch</span>
                      </div>
                    )}
                  </motion.button>
                </>
              ) : (
                /* Results */
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Analysis Complete</h3>
                    <p className="text-gray-400">Your pitch has been evaluated across 4 key criteria</p>
                  </div>

                  {/* Score Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(scores).map(([key, value], index) => {
                      const categoryNames: Record<string, string> = {
                        clarity: 'Clarity',
                        originality: 'Originality',
                        team_strength: 'Team Strength',
                        market_fit: 'Market Fit'
                      };
                      
                      return (
                        <motion.div
                          key={key}
                          className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">{categoryNames[key]}</span>
                            <span className="text-lg font-bold text-neon-blue">{value}/10</span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-neon-blue to-neon-green h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${value * 10}%` }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Overall Score */}
                  <div className="text-center p-6 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-lg border border-neon-blue/30">
                    <div className="text-3xl font-bold text-white mb-2">
                      {Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length) * 10) / 10}/10
                    </div>
                    <div className="text-neon-blue font-medium">Overall Score</div>
                  </div>

                  {/* Receipt */}
                  {receipt && (
                    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <div className="text-xs text-gray-400 mb-1">Verification Receipt</div>
                      <div className="text-xs font-mono text-gray-300 break-all">{receipt}</div>
                    </div>
                  )}

                  {/* New Analysis Button */}
                  <button
                    onClick={() => {
                      setPitch('');
                      reset();
                      setEncryptionStatus('idle');
                    }}
                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Analyze Another Pitch
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PitchModal;