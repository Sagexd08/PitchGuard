import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Zap,
  Shield,
  Star,
  Check,
  X,
  Wallet,
  CreditCard,
  Globe,
  Lock,
  Cpu,
  Network,
  Eye,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Github
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useWeb3Wallet } from '../hooks/useWeb3Wallet';
import AdvancedLoader from './AdvancedLoader';
import ClickSpark from './ClickSpark';
import Squares from './Squares';
import PaymentModal from './PaymentModal';

import ParticleBackground from './ParticleBackground';

interface PricingTier {
  id: string;
  name: string;
  price: {
    usd: number;
    eth: string;
    matic: string;
  };
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  popular?: boolean;
  icon: React.ReactNode;
  gradient: string;
  contractAddress?: string;
}

const PricingPage: React.FC = () => {
  const {
    isConnected,
    address,
    balance,
    chainId,
    connectWallet,
    sendTransaction,
    isMetaMaskInstalled
  } = useWeb3Wallet();

  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Free Tier',
      price: { usd: 0, eth: '0', matic: '0' },
      period: 'forever',
      description: 'Perfect for trying out Stealth Score',
      features: [
        '3 pitch analyses per month',
        'Basic AI scoring',
        'Standard encryption',
        'PDF export',
        'Community support'
      ],
      limitations: [
        'No TEE processing',
        'No ZK proofs',
        'Limited analytics',
        'No priority support'
      ],
      icon: <Star className="w-6 h-6" />,
      gradient: 'from-gray-400 to-gray-600'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { usd: 29, eth: '0.015', matic: '45' },
      period: 'month',
      description: 'For serious entrepreneurs',
      features: [
        'Unlimited pitch analyses',
        'Advanced AI with GPT-4',
        'TEE secure processing',
        'Zero-knowledge proofs',
        'Advanced analytics dashboard',
        'Priority support',
        'Custom branding',
        'API access'
      ],
      limitations: [
        'Single user account',
        'Standard federated learning'
      ],
      popular: true,
      icon: <Zap className="w-6 h-6" />,
      gradient: 'from-blue-400 to-purple-500',
      contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { usd: 199, eth: '0.1', matic: '300' },
      period: 'month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Multi-user team accounts',
        'Advanced federated learning',
        'Custom AI model training',
        'White-label solution',
        'Dedicated support',
        'SLA guarantees',
        'On-premise deployment',
        'Custom integrations',
        'Advanced security audits'
      ],
      limitations: [],
      icon: <Crown className="w-6 h-6" />,
      gradient: 'from-yellow-400 to-orange-500',
      contractAddress: '0x8ba1f109551bD432803012645Hac189B'
    }
  ];

  const handlePurchase = async (tier: PricingTier) => {
    if (tier.id === 'free') {
      toast.success('You\'re already on the free tier!');
      return;
    }

    setSelectedTier(tier);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedTier(null);
  };

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 1: return 'Ethereum';
      case 137: return 'Polygon';
      default: return 'Unknown';
    }
  };

  return (
    <ClickSpark sparkColor="#f59e0b" sparkCount={10} sparkRadius={35}>
      <div className="min-h-screen relative overflow-hidden">
        {}
        <div className="fixed inset-0 z-0">
          <Squares
            direction="diagonal"
            speed={0.3}
            borderColor="rgba(245, 158, 11, 0.08)"
            squareSize={50}
            hoverFillColor="rgba(245, 158, 11, 0.04)"
          />
        </div>

        {}
        <ParticleBackground />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative z-10 max-w-7xl mx-auto space-y-8 px-4 py-8"
        >
      {}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-6"
        >
          <Crown className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Choose Your Plan
        </h1>
        
        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
          Unlock the full power of privacy-preserving AI for your fundraising journey
        </p>

        {}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button
            onClick={() => setPaymentMethod('crypto')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              paymentMethod === 'crypto' 
                ? 'bg-blue-400/20 text-blue-400 border border-blue-400/30' 
                : 'bg-white/5 text-white/60 border border-white/10'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Crypto Payment</span>
          </button>
          
          <button
            onClick={() => setPaymentMethod('card')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              paymentMethod === 'card' 
                ? 'bg-green-400/20 text-green-400 border border-green-400/30' 
                : 'bg-white/5 text-white/60 border border-white/10'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Card Payment</span>
          </button>
        </div>

        {}
        {paymentMethod === 'crypto' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 max-w-md mx-auto mb-8"
          >
            {!isMetaMaskInstalled ? (
              <div className="text-center">
                <X className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-white/70 text-sm mb-3">MetaMask not detected</p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  <span>Install MetaMask</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : !isConnected ? (
              <div className="text-center">
                <Wallet className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white/70 text-sm mb-3">Connect your wallet to continue</p>
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-blue-400/20 text-blue-400 rounded-lg hover:bg-blue-400/30 transition-colors text-sm"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white/70 text-sm">
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
                <p className="text-white/50 text-xs">
                  {getNetworkName(chainId)} • Balance: {balance?.slice(0, 6)} ETH
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`relative bg-white/5 backdrop-blur-sm border rounded-xl p-6 hover:bg-white/10 transition-all duration-300 ${
              tier.popular ? 'border-blue-400/50 scale-105' : 'border-white/10'
            }`}
          >
            {}
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
            )}

            {}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${tier.gradient} rounded-lg mb-4`}>
                {tier.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-white/60 text-sm">{tier.description}</p>
            </div>

            {}
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-white mb-1">
                {paymentMethod === 'crypto' ? (
                  <>
                    {chainId === 137 ? tier.price.matic : tier.price.eth}
                    <span className="text-lg text-white/60 ml-1">
                      {chainId === 137 ? 'MATIC' : 'ETH'}
                    </span>
                  </>
                ) : (
                  <>
                    ${tier.price.usd}
                    <span className="text-lg text-white/60 ml-1">USD</span>
                  </>
                )}
              </div>
              <p className="text-white/50 text-sm">per {tier.period}</p>
            </div>

            {}
            <div className="space-y-3 mb-6">
              {tier.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{feature}</span>
                </div>
              ))}
              
              {tier.limitations.map((limitation, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-white/50 text-sm">{limitation}</span>
                </div>
              ))}
            </div>

            {}
            <button
              onClick={() => handlePurchase(tier)}
              disabled={selectedTier?.id === tier.id}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                tier.id === 'free'
                  ? 'bg-white/10 text-white/60 cursor-default'
                  : `bg-gradient-to-r ${tier.gradient} text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`
              }`}
            >
              {selectedTier?.id === tier.id ? (
                <AdvancedLoader message="Opening payment..." type="dots" />
              ) : (
                <>
                  <span>{tier.id === 'free' ? 'Current Plan' : 'Get Started'}</span>
                  {tier.id !== 'free' && <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Why Choose Stealth Score Premium?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Cpu className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">TEE Processing</h4>
            <p className="text-white/60 text-sm">Secure computation in isolated hardware enclaves</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Zero-Knowledge Proofs</h4>
            <p className="text-white/60 text-sm">Verify results without revealing sensitive data</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Network className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Federated Learning</h4>
            <p className="text-white/60 text-sm">Collaborative AI improvement while preserving privacy</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Advanced Analytics</h4>
            <p className="text-white/60 text-sm">Deep insights and performance tracking</p>
          </div>
        </div>
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <p className="text-white/60 mb-4">
          Stealth Score is open source and built with transparency in mind
        </p>
        <button
          onClick={() => window.open('https://github.com/Sagexd08/StealthScore')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-300 hover:scale-105"
        >
          <Github className="w-5 h-5" />
          <span>View Source Code</span>
          <ExternalLink className="w-4 h-4" />
        </button>
        </motion.div>
        </motion.div>
      </div>

      {}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        tier={selectedTier}
      />
    </ClickSpark>
  );
};

export default PricingPage;
