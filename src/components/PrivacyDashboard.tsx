import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Server } from 'lucide-react';

const PrivacyDashboard: React.FC = () => {
  const privacyFeatures = [
    {
      icon: Shield,
      title: 'Zero-Knowledge Architecture',
      status: 'Active',
      description: 'Your data never leaves your device in plain text',
      color: 'neon-green',
    },
    {
      icon: Lock,
      title: 'AES-256-GCM Encryption',
      status: 'Encrypted',
      description: 'Military-grade encryption before transmission',
      color: 'neon-blue',
    },
    {
      icon: Eye,
      title: 'No Data Retention',
      status: 'Verified',
      description: 'All analysis data is immediately purged',
      color: 'neon-purple',
    },
    {
      icon: Server,
      title: 'Trusted Execution',
      status: 'Secure',
      description: 'Processing in isolated secure environment',
      color: 'neon-green',
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Privacy-First by Design
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your startup ideas are protected by military-grade security and zero-knowledge architecture.
            We never see your data, and neither does anyone else.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {privacyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 bg-${feature.color}/20 rounded-lg`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${feature.color}/20 text-${feature.color}`}>
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Details */}
        <motion.div
          className="mt-12 p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl border border-slate-600/50 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-neon-blue mb-2">Client-Side Encryption</h4>
              <p className="text-sm text-gray-400">
                All data is encrypted using AES-256-GCM in your browser before any network transmission.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-neon-purple mb-2">SHA-256 Integrity</h4>
              <p className="text-sm text-gray-400">
                Cryptographic hashes ensure your analysis results haven't been tampered with.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-neon-green mb-2">Zero Retention</h4>
              <p className="text-sm text-gray-400">
                Processing is stateless with immediate data purging after analysis completion.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivacyDashboard;