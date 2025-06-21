import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useWeb3Wallet } from '../hooks/useWeb3Wallet';

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
  contractAddress?: string;
}

interface CryptoPaymentProps {
  tier: PricingTier;
  onSuccess: () => void;
  onCancel: () => void;
}

const SUPPORTED_NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
    icon: 'ETH'
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    icon: 'MATIC'
  },
  bsc: {
    chainId: 56,
    name: 'BSC',
    currency: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    icon: 'BNB'
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum',
    currency: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    icon: 'ARB'
  }
};

const PAYMENT_ADDRESSES = {
  1: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9', 
  137: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9', 
  56: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9', 
  42161: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9' 
};

const CryptoPayment: React.FC<CryptoPaymentProps> = ({ tier, onSuccess, onCancel }) => {
  const {
    isConnected,
    address,
    chainId,
    connectWallet,
    switchNetwork,
    sendTransaction,
    isMetaMaskInstalled
  } = useWeb3Wallet();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const currentNetwork = chainId ? Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId) : null;
  const paymentAmount = chainId === 137 ? tier.price.matic : tier.price.eth;
  const paymentAddress = chainId ? PAYMENT_ADDRESSES[chainId as keyof typeof PAYMENT_ADDRESSES] : null;

  const isNetworkSupported = chainId && Object.values(SUPPORTED_NETWORKS).some(n => n.chainId === chainId);

  const handlePayment = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!isNetworkSupported) {
      toast.error('Please switch to a supported network');
      return;
    }

    if (!paymentAddress) {
      toast.error('Payment address not configured for this network');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      
      const processingToast = toast.loading('Processing payment...', {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      });

      const txHash = await sendTransaction(paymentAddress, paymentAmount);
      setTransactionHash(txHash);

      toast.dismiss(processingToast);
      toast.success('Payment successful!', {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
        },
      });

      setPaymentSuccess(true);

      const subscriptionData = {
        tier: tier.id,
        expiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
        transactionHash: txHash,
        network: currentNetwork?.name,
        timestamp: Date.now()
      };

      localStorage.setItem('subscriptionData', JSON.stringify(subscriptionData));
      localStorage.setItem('subscriptionTier', tier.id);
      localStorage.setItem('subscriptionExpiry', subscriptionData.expiry.toString());

      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (error: any) {
      const errorMessage = error.message || 'Payment failed';
      setPaymentError(errorMessage);
      toast.error(errorMessage, {
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };



  const openBlockExplorer = () => {
    if (transactionHash && currentNetwork) {
      window.open(`${currentNetwork.blockExplorer}/tx/${transactionHash}`, '_blank');
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="max-w-md mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-400/20 rounded-lg">
            <Wallet className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">MetaMask Required</h3>
            <p className="text-white/70 text-sm">Install MetaMask to use crypto payments</p>
          </div>
        </div>
        
        <div className="bg-orange-400/10 border border-orange-400/30 rounded-lg p-4 mb-6">
          <p className="text-orange-300 text-sm mb-4">
            MetaMask is required for crypto payments. It's a secure wallet that runs in your browser.
          </p>
          <button
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
            className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Install MetaMask</span>
          </button>
        </div>

        <button
          onClick={onCancel}
          className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
        <p className="text-white/70 mb-4">
          Welcome to {tier.name}! Your subscription is now active.
        </p>
        
        {transactionHash && (
          <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4 mb-4">
            <p className="text-green-300 text-sm mb-2">Transaction Hash:</p>
            <div className="flex items-center space-x-2">
              <code className="text-green-200 text-xs bg-green-400/20 px-2 py-1 rounded">
                {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
              </code>
              <button
                onClick={openBlockExplorer}
                className="p-1 hover:bg-green-400/20 rounded transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-green-400" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-400/20 rounded-lg">
          <Wallet className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Crypto Payment</h3>
          <p className="text-white/70 text-sm">Pay with cryptocurrency</p>
        </div>
      </div>

      {}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-semibold text-white">{tier.name}</h4>
            <p className="text-white/70 text-sm">{tier.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {paymentAmount} {currentNetwork?.currency || 'ETH'}
            </div>
            <div className="text-white/60 text-sm">per {tier.period}</div>
          </div>
        </div>
      </div>

      {}
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-700 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl font-montserrat"
        >
          <Wallet className="w-5 h-5" />
          <span>Connect Wallet</span>
        </button>
      ) : (
        <div className="space-y-4">
          {}
          <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-medium">Wallet Connected</span>
            </div>
            <p className="text-green-200/70 text-xs">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            {currentNetwork && (
              <p className="text-green-200/70 text-xs">
                {currentNetwork.icon} {currentNetwork.name}
              </p>
            )}
          </div>

          {}
          {!isNetworkSupported && (
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 text-sm font-medium">Unsupported Network</span>
              </div>
              <p className="text-yellow-200/70 text-xs mb-3">
                Please switch to a supported network to continue.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(SUPPORTED_NETWORKS).map((network) => (
                  <button
                    key={network.chainId}
                    onClick={() => switchNetwork(network.chainId)}
                    className="px-3 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 rounded text-yellow-200 text-xs transition-colors"
                  >
                    {network.icon} {network.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {}
          {isNetworkSupported && (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl font-montserrat"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Pay {paymentAmount} {currentNetwork?.currency}</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {}
      {paymentError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start space-x-3 bg-red-400/10 border border-red-400/30 rounded-lg p-4"
        >
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm font-medium">Payment Error</p>
            <p className="text-red-200/70 text-xs">{paymentError}</p>
          </div>
        </motion.div>
      )}

      {}
      <div className="flex items-start space-x-3 bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
        <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
        <div>
          <p className="text-blue-300 text-sm font-medium">Secure Payment</p>
          <p className="text-blue-200/70 text-xs">
            Your transaction is secured by blockchain technology. No personal information is required.
          </p>
        </div>
      </div>

      {}
      <button
        onClick={onCancel}
        className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
};

export default CryptoPayment;
