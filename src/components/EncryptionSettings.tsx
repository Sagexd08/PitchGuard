'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Key, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';

interface EncryptionSettingsProps {
  className?: string;
}

const EncryptionSettings: React.FC<EncryptionSettingsProps> = ({ className = '' }) => {
  const [encryptionLevel, setEncryptionLevel] = useState<'standard' | 'enhanced' | 'military'>('enhanced');
  const [autoEncrypt, setAutoEncrypt] = useState(true);
  const [keyRotation, setKeyRotation] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const encryptionLevels = {
    standard: {
      name: 'Standard AES-256',
      description: 'Industry standard encryption with AES-256-GCM',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-blue-400',
    },
    enhanced: {
      name: 'Enhanced Security',
      description: 'AES-256 with additional key derivation and salt',
      icon: <Lock className="w-5 h-5" />,
      color: 'text-green-400',
    },
    military: {
      name: 'Military Grade',
      description: 'Multi-layer encryption with quantum-resistant algorithms',
      icon: <Key className="w-5 h-5" />,
      color: 'text-purple-400',
    },
  };

  return (
    <motion.div
      className={`bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Shield className="w-6 h-6 text-blue-400" />
          <span>Encryption Settings</span>
        </h3>
        <div className="flex items-center space-x-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Active</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Encryption Level */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">
            Encryption Level
          </label>
          <div className="space-y-3">
            {Object.entries(encryptionLevels).map(([key, level]) => (
              <motion.div
                key={key}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  encryptionLevel === key
                    ? 'border-blue-400/50 bg-blue-400/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => setEncryptionLevel(key as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={level.color}>
                      {level.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium">{level.name}</div>
                      <div className="text-white/60 text-sm">{level.description}</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    encryptionLevel === key
                      ? 'border-blue-400 bg-blue-400'
                      : 'border-white/30'
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Auto-Encrypt Data</div>
              <div className="text-white/60 text-sm">Automatically encrypt all sensitive data</div>
            </div>
            <motion.button
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                autoEncrypt ? 'bg-blue-500' : 'bg-white/20'
              }`}
              onClick={() => setAutoEncrypt(!autoEncrypt)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full"
                animate={{ x: autoEncrypt ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Key Rotation</div>
              <div className="text-white/60 text-sm">Automatically rotate encryption keys</div>
            </div>
            <motion.button
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                keyRotation ? 'bg-blue-500' : 'bg-white/20'
              }`}
              onClick={() => setKeyRotation(!keyRotation)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full"
                animate={{ x: keyRotation ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>

        {/* Advanced Settings */}
        <div>
          <motion.button
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            onClick={() => setShowAdvanced(!showAdvanced)}
            whileHover={{ scale: 1.05 }}
          >
            {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>Advanced Settings</span>
          </motion.button>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Key Size:</span>
                  <span className="text-white">256-bit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Algorithm:</span>
                  <span className="text-white">AES-256-GCM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Key Derivation:</span>
                  <span className="text-white">PBKDF2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Salt Length:</span>
                  <span className="text-white">32 bytes</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>All data is encrypted and secure</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EncryptionSettings;
