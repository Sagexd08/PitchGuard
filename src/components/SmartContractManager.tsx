import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import {
  Code,
  Rocket,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Zap,
  Shield,
  Network
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useWeb3Wallet } from '../hooks/useWeb3Wallet';

const PITCHGUARD_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "_subscriptionPrice", "type": "uint256"},
      {"internalType": "uint256", "name": "_subscriptionDuration", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_tier", "type": "uint256"}],
    "name": "subscribe",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getSubscription",
    "outputs": [
      {"internalType": "uint256", "name": "tier", "type": "uint256"},
      {"internalType": "uint256", "name": "expiryTime", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "isSubscriptionActive",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const PITCHGUARD_BYTECODE = "0x608060405234801561001057600080fd5b50604051610a38380380610a388339818101604052810190610032919061007a565b81600081905550806001819055505050610094565b600080fd5b6000819050919050565b61005f8161004c565b811461006a57600080fd5b50565b60008151905061007c81610056565b92915050565b600080604083850312156100995761009861004757565b5b60006100a78582860161006d565b92505060206100b88582860161006d565b9150509250929050565b610995806100d16000396000f3fe...";

interface SmartContractManagerProps {
  onContractDeployed?: (address: string) => void;
}

const SmartContractManager: React.FC<SmartContractManagerProps> = ({ onContractDeployed }) => {
  const { isConnected, provider, signer, address, chainId } = useWeb3Wallet();
  const [contractAddress, setContractAddress] = useState<string>('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedContracts, setDeployedContracts] = useState<string[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    tier: number;
    expiryTime: number;
    isActive: boolean;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('deployedContracts');
    if (saved) {
      setDeployedContracts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (contractAddress && address && provider) {
      checkSubscriptionStatus();
    }
  }, [contractAddress, address, provider]);

  const deployContract = async () => {
    if (!signer) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsDeploying(true);
    try {
      
      const subscriptionPrice = ethers.parseEther("0.01"); 
      const subscriptionDuration = 30 * 24 * 60 * 60; 

      const contractFactory = new ethers.ContractFactory(
        PITCHGUARD_ABI,
        PITCHGUARD_BYTECODE,
        signer
      );

      const contract = await contractFactory.deploy(subscriptionPrice, subscriptionDuration);
      await contract.waitForDeployment();

      const deployedAddress = await contract.getAddress();
      setContractAddress(deployedAddress);

      const updated = [...deployedContracts, deployedAddress];
      setDeployedContracts(updated);
      localStorage.setItem('deployedContracts', JSON.stringify(updated));

      toast.success(`Contract deployed at: ${deployedAddress}`);
      
      if (onContractDeployed) {
        onContractDeployed(deployedAddress);
      }

    } catch (error: any) {
      console.error('Deployment failed:', error);
      toast.error('Contract deployment failed');
    } finally {
      setIsDeploying(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!contractAddress || !address || !provider) return;

    try {
      const contract = new ethers.Contract(contractAddress, PITCHGUARD_ABI, provider);
      const [tier, expiryTime, isActive] = await contract.getSubscription(address);
      
      setSubscriptionStatus({
        tier: Number(tier),
        expiryTime: Number(expiryTime),
        isActive
      });
    } catch (error) {
      console.error('Failed to check subscription:', error);
    }
  };

  const subscribe = async (tier: number, price: string) => {
    if (!contractAddress || !signer) {
      toast.error('Contract not available or wallet not connected');
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, PITCHGUARD_ABI, signer);
      const tx = await contract.subscribe(tier, {
        value: ethers.parseEther(price)
      });

      toast.loading('Transaction pending...');
      await tx.wait();
      
      toast.success('Subscription activated!');
      await checkSubscriptionStatus();

    } catch (error: any) {
      console.error('Subscription failed:', error);
      toast.error('Subscription failed');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getNetworkName = () => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 11155111: return 'Sepolia Testnet';
      case 137: return 'Polygon Mainnet';
      case 80001: return 'Polygon Mumbai';
      default: return 'Unknown Network';
    }
  };

  const getExplorerUrl = (address: string) => {
    switch (chainId) {
      case 1: return `https://etherscan.io/address/${address}`;
      case 11155111: return `https://sepolia.etherscan.io/address/${address}`;
      case 137: return `https://polygonscan.com/address/${address}`;
      case 80001: return `https://mumbai.polygonscan.com/address/${address}`;
      default: return '#';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6"
    >
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-400/20 rounded-lg">
            <Code className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Smart Contract Manager</h3>
            <p className="text-white/70 text-sm">Deploy and manage premium subscription contracts</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-white/60 text-sm">Network</p>
          <p className="text-white text-sm font-medium">{getNetworkName()}</p>
        </div>
      </div>

      {}
      {!isConnected ? (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-white/70">Connect your wallet to manage smart contracts</p>
        </div>
      ) : (
        <div className="space-y-6">
          {}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Rocket className="w-4 h-4 mr-2 text-blue-400" />
              Deploy New Contract
            </h4>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-white/70">Pro Tier Price:</span>
                  <p className="text-white">0.01 ETH</p>
                </div>
                <div>
                  <span className="text-white/70">Duration:</span>
                  <p className="text-white">30 days</p>
                </div>
              </div>
              
              <button
                onClick={deployContract}
                disabled={isDeploying}
                className="w-full px-4 py-2 bg-blue-400/20 text-blue-400 rounded-lg hover:bg-blue-400/30 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isDeploying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <span>Deploying...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Deploy Contract</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {}
          {deployedContracts.length > 0 && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Deployed Contracts
              </h4>
              
              <div className="space-y-2">
                {deployedContracts.map((addr, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-white font-mono text-sm">
                        {addr.slice(0, 10)}...{addr.slice(-8)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(addr)}
                        className="p-1 text-white/60 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      <a
                        href={getExplorerUrl(addr)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-white/60 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      
                      <button
                        onClick={() => setContractAddress(addr)}
                        className="px-2 py-1 bg-purple-400/20 text-purple-400 rounded text-xs hover:bg-purple-400/30 transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          {contractAddress && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Network className="w-4 h-4 mr-2 text-purple-400" />
                Active Contract
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Contract Address:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono text-sm">
                      {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(contractAddress)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {subscriptionStatus && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Subscription Tier:</span>
                      <span className="text-white text-sm">
                        {subscriptionStatus.tier === 0 ? 'Free' : subscriptionStatus.tier === 1 ? 'Pro' : 'Enterprise'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Status:</span>
                      <div className="flex items-center space-x-2">
                        {subscriptionStatus.isActive ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm">Active</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm">Inactive</span>
                          </>
                        )}
                      </div>
                    </div>

                    {subscriptionStatus.expiryTime > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">Expires:</span>
                        <span className="text-white text-sm">
                          {new Date(subscriptionStatus.expiryTime * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => subscribe(1, "0.01")}
                    className="px-3 py-2 bg-blue-400/20 text-blue-400 rounded-lg hover:bg-blue-400/30 transition-colors text-sm flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Pro (0.01 ETH)</span>
                  </button>
                  
                  <button
                    onClick={() => subscribe(2, "0.05")}
                    className="px-3 py-2 bg-yellow-400/20 text-yellow-400 rounded-lg hover:bg-yellow-400/30 transition-colors text-sm flex items-center justify-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Enterprise (0.05 ETH)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SmartContractManager;
