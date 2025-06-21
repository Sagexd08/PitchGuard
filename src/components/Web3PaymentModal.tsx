import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Check, AlertCircle } from 'lucide-react';
import { connectWallet, makePayment } from '../utils/web3';

interface Web3PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  priceEth: string;
  onSuccess?: () => void;
}

const Web3PaymentModal: React.FC<Web3PaymentModalProps> = ({
  isOpen,
  onClose,
  feature,
  priceEth,
  onSuccess,
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handlePayment = async () => {
    if (!account) return;

    setIsPaymentProcessing(true);
    setPaymentStatus('processing');
    setError(null);

    try {
      const result = await makePayment(priceEth);
      setPaymentStatus('success');
      setTimeout(() => {
        onSuccess?.();
        onClose();
        resetModal();
      }, 2000);
    } catch (error: any) {
      setPaymentStatus('error');
      setError(error.message || 'Payment failed');
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const resetModal = () => {
    setPaymentStatus('idle');
    setError(null);
    setIsPaymentProcessing(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-600/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-neon-purple/20 rounded-lg">
                  <Wallet className="w-6 h-6 text-neon-purple" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Premium Feature</h2>
                  <p className="text-sm text-gray-400">Web3 Payment Required</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Feature Info */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-white">{feature}</h3>
                <div className="text-2xl font-bold text-neon-blue">{priceEth} ETH</div>
                <p className="text-sm text-gray-400">
                  Unlock advanced AI analysis with detailed recommendations
                </p>
              </div>

              {/* Payment Status */}
              {paymentStatus !== 'idle' && (
                <motion.div
                  className={`p-4 rounded-lg border ${
                    paymentStatus === 'success'
                      ? 'bg-neon-green/20 border-neon-green/50'
                      : paymentStatus === 'error'
                      ? 'bg-red-500/20 border-red-500/50'
                      : 'bg-neon-blue/20 border-neon-blue/50'
                  }`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center space-x-3">
                    {paymentStatus === 'processing' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Wallet className="w-5 h-5 text-neon-blue" />
                      </motion.div>
                    )}
                    {paymentStatus === 'success' && (
                      <Check className="w-5 h-5 text-neon-green" />
                    )}
                    {paymentStatus === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <div className="font-medium text-white">
                        {paymentStatus === 'processing' && 'Processing Payment...'}
                        {paymentStatus === 'success' && 'Payment Successful!'}
                        {paymentStatus === 'error' && 'Payment Failed'}
                      </div>
                      {paymentStatus === 'processing' && (
                        <div className="text-sm text-gray-400">
                          Please confirm the transaction in your wallet
                        </div>
                      )}
                      {paymentStatus === 'success' && (
                        <div className="text-sm text-gray-400">
                          Premium features unlocked
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400">{error}</span>
                  </div>
                </motion.div>
              )}

              {/* Wallet Connection */}
              {!account ? (
                <motion.button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isConnecting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Wallet className="w-5 h-5" />
                      </motion.div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Wallet className="w-5 h-5" />
                      <span>Connect Metamask</span>
                    </div>
                  )}
                </motion.button>
              ) : (
                <div className="space-y-4">
                  {/* Connected Account */}
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Connected Account</div>
                        <div className="font-mono text-white">{formatAddress(account)}</div>
                      </div>
                      <div className="w-3 h-3 bg-neon-green rounded-full"></div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <motion.button
                    onClick={handlePayment}
                    disabled={isPaymentProcessing || paymentStatus === 'success'}
                    className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isPaymentProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Wallet className="w-5 h-5" />
                        </motion.div>
                        <span>Processing...</span>
                      </div>
                    ) : paymentStatus === 'success' ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Check className="w-5 h-5" />
                        <span>Payment Complete</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Wallet className="w-5 h-5" />
                        <span>Pay {priceEth} ETH</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              )}

              {/* Security Notice */}
              <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-neon-green mt-0.5" />
                  <div className="text-xs text-gray-400">
                    <div className="font-medium text-white mb-1">Secure Payment</div>
                    <div>
                      Your payment is processed directly through the Ethereum network.
                      We never store your wallet information or private keys.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Web3PaymentModal;