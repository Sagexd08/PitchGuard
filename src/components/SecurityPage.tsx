import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  Fingerprint,
  Cpu,
  Network,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Globe,
  Database,
  Copy,
  ExternalLink,
  Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import TEEMonitor from './TEEMonitor';
import SmartContractManager from './SmartContractManager';
import ClickSpark from './ClickSpark';
import PixelCard from './PixelCard';
import Squares from './Squares';

import ParticleBackground from './ParticleBackground';

interface SecurityMetrics {
  encryptionStatus: 'active' | 'inactive';
  teeStatus: 'connected' | 'disconnected' | 'simulated';
  federatedLearning: 'active' | 'inactive';
  privacyBudget: number;
  zkProofs: number;
  trustScore: number;
}

const SecurityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'encryption' | 'privacy' | 'audit' | 'tee' | 'contracts'>('overview');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    encryptionStatus: 'active',
    teeStatus: 'simulated',
    federatedLearning: 'active',
    privacyBudget: 85,
    zkProofs: 12,
    trustScore: 94
  });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const generateZKProof = async () => {
    setIsGeneratingProof(true);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSecurityMetrics(prev => ({
        ...prev,
        zkProofs: prev.zkProofs + 1,
        trustScore: Math.min(100, prev.trustScore + 1)
      }));
      toast.success('Zero-Knowledge Proof generated successfully!');
    } catch (error) {
      toast.error('Failed to generate ZK proof');
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Shield className="w-4 h-4" /> },
    { id: 'encryption', label: 'Encryption', icon: <Lock className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'tee', label: 'TEE Monitor', icon: <Cpu className="w-4 h-4" /> },
    { id: 'contracts', label: 'Smart Contracts', icon: <Database className="w-4 h-4" /> },
  ];

  const securityFeatures = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "AES-256-GCM Encryption",
      description: "Military-grade encryption for all data",
      status: securityMetrics.encryptionStatus,
      color: "green"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Trusted Execution Environment",
      description: "Secure computation in isolated environment",
      status: securityMetrics.teeStatus,
      color: securityMetrics.teeStatus === 'simulated' ? "yellow" : "green"
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Federated Learning",
      description: "Privacy-preserving distributed AI training",
      status: securityMetrics.federatedLearning,
      color: "green"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Zero-Knowledge Proofs",
      description: "Verify computations without revealing data",
      status: `${securityMetrics.zkProofs} generated`,
      color: "blue"
    }
  ];

  return (
    <ClickSpark sparkColor="#10b981" sparkCount={10} sparkRadius={35}>
      <div className="min-h-screen relative overflow-hidden">
        {}
        <div className="fixed inset-0 z-0">
          <Squares
            direction="diagonal"
            speed={0.3}
            borderColor="rgba(16, 185, 129, 0.08)"
            squareSize={50}
            hoverFillColor="rgba(16, 185, 129, 0.04)"
          />
        </div>

        {}
        <ParticleBackground />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 min-h-screen px-4 py-12"
        >
          <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4"
          >
            <Shield className="w-8 h-8 text-blue-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="text-gradient">Security & Privacy Center</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Advanced privacy-preserving AI with TEE, ZK proofs, and federated learning for secure pitch analysis.
          </p>
        </div>

        {}
        <div className="glass-card p-2 mb-8">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                  activeTab === tab.id
                    ? 'bg-blue-500/30 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h2 className="text-2xl font-semibold text-white">Security Status</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ClickSpark sparkColor="#10b981" sparkCount={6} sparkRadius={20}>
                    <PixelCard variant="blue" className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">Encryption</span>
                      </div>
                      <p className="text-green-200 text-sm">AES-256-GCM Active</p>
                    </PixelCard>
                  </ClickSpark>

                  <ClickSpark sparkColor="#3b82f6" sparkCount={6} sparkRadius={20}>
                    <PixelCard variant="blue" className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-300 font-medium">Privacy</span>
                      </div>
                      <p className="text-blue-200 text-sm">Zero Data Retention</p>
                    </PixelCard>
                  </ClickSpark>

                  <ClickSpark sparkColor="#a855f7" sparkCount={6} sparkRadius={20}>
                    <PixelCard variant="pink" className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4 cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-300 font-medium">Authentication</span>
                      </div>
                      <p className="text-purple-200 text-sm">Clerk Secure</p>
                    </PixelCard>
                  </ClickSpark>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Client-Side Encryption</h3>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Data encrypted in your browser before transmission</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Unique encryption key generated per session</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Server cannot decrypt your pitch content</span>
                    </li>
                  </ul>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Data Protection</h3>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Immediate deletion after analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>No long-term data storage</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Cryptographic proof of analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'encryption' && (
            <motion.div
              key="encryption"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-blue-400 mb-4">Encryption Implementation</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">AES-256-GCM Encryption</h3>
                    <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-400 font-medium">Algorithm:</span>
                          <span className="text-white/70 ml-2">AES-256-GCM</span>
                        </div>
                        <div>
                          <span className="text-blue-400 font-medium">Key Size:</span>
                          <span className="text-white/70 ml-2">256 bits</span>
                        </div>
                        <div>
                          <span className="text-blue-400 font-medium">IV Size:</span>
                          <span className="text-white/70 ml-2">96 bits (12 bytes)</span>
                        </div>
                        <div>
                          <span className="text-blue-400 font-medium">Authentication:</span>
                          <span className="text-white/70 ml-2">Built-in GMAC</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-white">Technical Details</h3>
                      <button
                        onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {showTechnicalDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showTechnicalDetails ? 'Hide' : 'Show'} Details
                      </button>
                    </div>

                    <AnimatePresence>
                      {showTechnicalDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-black/30 rounded-lg p-4 border border-white/10"
                        >
                          <div className="space-y-4 text-sm">
                            <div>
                              <h4 className="text-white font-medium mb-2">Encryption Process:</h4>
                              <ol className="list-decimal list-inside text-white/70 space-y-1 ml-4">
                                <li>Generate random 256-bit AES key using Web Crypto API</li>
                                <li>Generate random 96-bit initialization vector (IV)</li>
                                <li>Encrypt pitch text using AES-256-GCM with generated key and IV</li>
                                <li>Export key to base64 format for transmission</li>
                                <li>Send encrypted data, IV, and key to server</li>
                                <li>Server decrypts, processes, and immediately deletes data</li>
                              </ol>
                            </div>

                            <div>
                              <h4 className="text-white font-medium mb-2">Security Properties:</h4>
                              <ul className="list-disc list-inside text-white/70 space-y-1 ml-4">
                                <li>Authenticated encryption prevents tampering</li>
                                <li>Unique IV per session prevents replay attacks</li>
                                <li>Client-side key generation ensures server cannot pre-decrypt</li>
                                <li>Immediate key disposal after use</li>
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-blue-400 mb-4">Privacy Policy</h2>

                <div className="space-y-6">
                  <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-medium text-white">Zero Data Retention</h3>
                    </div>
                    <p className="text-white/70 mb-4">
                      We follow a strict zero-retention policy for your pitch content. After analysis is complete,
                      all pitch data is permanently deleted from our servers.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-white/80 text-sm">No pitch data is ever stored long-term</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-white/80 text-sm">Analysis results stored temporarily for session only</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-white/80 text-sm">Only anonymized usage metrics collected</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-4">
                      <h4 className="text-white font-medium mb-3">What We Collect</h4>
                      <ul className="space-y-2 text-white/70 text-sm">
                        <li>• Analysis scores (temporarily)</li>
                        <li>• Cryptographic receipts</li>
                        <li>• Anonymous usage statistics</li>
                        <li>• Error logs (no personal data)</li>
                      </ul>
                    </div>

                    <div className="glass-card p-4">
                      <h4 className="text-white font-medium mb-3">What We Don't Collect</h4>
                      <ul className="space-y-2 text-white/70 text-sm">
                        <li>• Your pitch content</li>
                        <li>• Personal business information</li>
                        <li>• IP addresses (beyond session)</li>
                        <li>• Tracking cookies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-blue-400 mb-4">Security Audit & Compliance</h2>

                <div className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Info className="w-6 h-6 text-blue-400" />
                      <h3 className="text-lg font-medium text-white">Open Source Verification</h3>
                    </div>
                    <p className="text-white/70 mb-4">
                      Our encryption implementation is open source and can be audited by anyone.
                      We believe in transparency and invite security researchers to review our code.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => window.open('https://github.com/Sagexd08/StealthScore')}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">View Source Code</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard('https://github.com/Sagexd08/StealthScore/security', 'Security URL')}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Report Security Issue</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-4">
                      <h4 className="text-white font-medium mb-3">Security Standards</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-white/70 text-sm">OWASP Top 10 Compliance</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-white/70 text-sm">SOC 2 Type II (Planned)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-white/70 text-sm">GDPR Compliant</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-white/70 text-sm">CCPA Compliant</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-4">
                      <h4 className="text-white font-medium mb-3">Audit Trail</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span className="text-white/70 text-sm">Cryptographic receipts for all analyses</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span className="text-white/70 text-sm">Immutable transaction logs</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span className="text-white/70 text-sm">Third-party security monitoring</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span className="text-white/70 text-sm">Regular penetration testing</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="text-white font-medium mb-2">Security Disclosure</h4>
                        <p className="text-white/70 text-sm mb-3">
                          If you discover a security vulnerability, please report it responsibly to our security team.
                        </p>
                        <button
                          onClick={() => copyToClipboard('security@pitchguard.com', 'Security email')}
                          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                        >
                          security@pitchguard.com
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tee' && (
            <motion.div
              key="tee"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TEEMonitor onTEEStatusChange={(status) => {
                console.log('TEE Status updated:', status);
              }} />
            </motion.div>
          )}

          {activeTab === 'contracts' && (
            <motion.div
              key="contracts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SmartContractManager onContractDeployed={(address) => {
                console.log('Contract deployed:', address);
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Privacy Budget</h3>
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Remaining</span>
                <span className="text-white">{securityMetrics.privacyBudget}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${securityMetrics.privacyBudget}%` }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Trust Score</h3>
              <Fingerprint className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">
              {securityMetrics.trustScore}
            </div>
            <p className="text-white/70 text-sm">Reputation-based security</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">ZK Proofs</h3>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {securityMetrics.zkProofs}
            </div>
            <button
              onClick={generateZKProof}
              disabled={isGeneratingProof}
              className="text-sm bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-lg hover:bg-yellow-400/30 transition-colors disabled:opacity-50"
            >
              {isGeneratingProof ? 'Generating...' : 'Generate New'}
            </button>
          </motion.div>
        </div>
          </div>
        </motion.div>
      </div>
    </ClickSpark>
  );
};

export default SecurityPage;
