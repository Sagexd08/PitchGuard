import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CreditCard,
  Wallet,
  Shield,
  Zap,
  CheckCircle,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import StripePayment from './StripePayment';
import { useWeb3Wallet } from '../hooks/useWeb3Wallet';
import { toast } from 'react-hot-toast';

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
  popular?: boolean;
  gradient: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: PricingTier | null;
}

type PaymentStep = 'method' | 'card' | 'crypto' | 'processing' | 'success';

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, tier }) => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'crypto' | null>(null);
  
  const {
    isConnected,
    address,
    balance,
    chainId,
    connectWallet,
    sendTransaction,
    isMetaMaskInstalled
  } = useWeb3Wallet();

  if (!tier) return null;

  const handleMethodSelect = (method: 'card' | 'crypto') => {
    setSelectedMethod(method);
    if (method === 'card') {
      setCurrentStep('card');
    } else {
      if (!isMetaMaskInstalled) {
        toast.error('Please install MetaMask to use crypto payments');
        return;
      }
      if (!isConnected) {
        connectWallet();
        return;
      }
      setCurrentStep('crypto');
    }
  };

  const handleCryptoPayment = async () => {
    if (!isConnected || !tier) {
      toast.error('Wallet not connected');
      return;
    }

    setCurrentStep('processing');

    try {
      
      const contractAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      const amount = chainId === 137 ? tier.price.matic : tier.price.eth;
      
      const txHash = await sendTransaction(contractAddress, amount);

      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success(`Payment successful! Transaction: ${txHash.slice(0, 10)}...`);

      localStorage.setItem('subscriptionTier', tier.id);
      localStorage.setItem('subscriptionExpiry', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
      
      setCurrentStep('success');
      
    } catch (error: any) {
      console.error('Crypto payment failed:', error);
      toast.error(error.message || 'Payment failed');
      setCurrentStep('crypto');
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('success');
  };

  const handleClose = () => {
    setCurrentStep('method');
    setSelectedMethod(null);
    onClose();
  };

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 1: return 'Ethereum';
      case 137: return 'Polygon';
      default: return 'Unknown';
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Choose Payment Method</h3>
        <p className="text-white/70">Select how you'd like to pay for {tier.name}</p>
      </div>

      {}
      <div className={`bg-gradient-to-r ${tier.gradient} p-0.5 rounded-xl`}>
        <div className="bg-slate-900 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xl font-bold text-white">{tier.name}</h4>
              <p className="text-white/70">{tier.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">${tier.price.usd}</div>
              <div className="text-white/60">per {tier.period}</div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {}
        <motion.button
          onClick={() => handleMethodSelect('card')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-blue-400/20 rounded-full group-hover:bg-blue-400/30 transition-colors">
              <CreditCard className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white">Card Payment</h4>
              <p className="text-white/60 text-sm">Pay with credit or debit card</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-xs">Secured by Stripe</span>
              </div>
            </div>
          </div>
        </motion.button>

        {}
        <motion.button
          onClick={() => handleMethodSelect('crypto')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-purple-400/20 rounded-full group-hover:bg-purple-400/30 transition-colors">
              <Wallet className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white">Crypto Payment</h4>
              <p className="text-white/60 text-sm">Pay with ETH or MATIC</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 text-xs">
                  {tier.price.eth} ETH / {tier.price.matic} MATIC
                </span>
              </div>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );

  const renderCryptoPayment = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setCurrentStep('method')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-white">Crypto Payment</h3>
          <p className="text-white/70 text-sm">Pay with your connected wallet</p>
        </div>
      </div>

      {}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-white font-medium">Wallet Connected</p>
              <p className="text-white/60 text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-sm">Network</p>
            <p className="text-white font-medium">{getNetworkName(chainId)}</p>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Balance:</span>
            <span className="text-white font-medium">{balance?.slice(0, 8)} ETH</span>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Payment Details</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-white/70">Plan:</span>
            <span className="text-white">{tier.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Amount:</span>
            <span className="text-white">
              {chainId === 137 ? tier.price.matic + ' MATIC' : tier.price.eth + ' ETH'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">USD Value:</span>
            <span className="text-white">${tier.price.usd}</span>
          </div>
        </div>
      </div>

      {}
      <button
        onClick={handleCryptoPayment}
        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
      >
        <Wallet className="w-5 h-5" />
        <span>Pay with Crypto</span>
      </button>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h3 className="text-xl font-bold text-white mb-2">Processing Payment</h3>
      <p className="text-white/70">Please wait while we confirm your transaction...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-12">
      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
      <p className="text-white/70 mb-6">
        Welcome to {tier.name}! Your subscription is now active.
      </p>
      <button
        onClick={handleClose}
        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
      >
        Get Started
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-400/20 rounded-lg">
                  <Shield className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Secure Payment</h2>
                  <p className="text-white/60 text-sm">Upgrade to {tier.name}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {}
            <AnimatePresence mode="wait">
              {currentStep === 'method' && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {renderMethodSelection()}
                </motion.div>
              )}

              {currentStep === 'card' && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <button
                      onClick={() => setCurrentStep('method')}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div>
                      <h3 className="text-xl font-bold text-white">Card Payment</h3>
                      <p className="text-white/70 text-sm">Secure payment with Stripe</p>
                    </div>
                  </div>
                  <StripePayment
                    tier={tier}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setCurrentStep('method')}
                  />
                </motion.div>
              )}

              {currentStep === 'crypto' && (
                <motion.div
                  key="crypto"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {renderCryptoPayment()}
                </motion.div>
              )}

              {currentStep === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {renderProcessing()}
                </motion.div>
              )}

              {currentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {renderSuccess()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
