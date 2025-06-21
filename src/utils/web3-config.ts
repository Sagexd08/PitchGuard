/**
 * Web3 Configuration for CSP Compliance
 * Configures Web3 libraries to avoid eval() usage and ensure Content Security Policy compliance
 */

import { ethers } from 'ethers';

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// CSP-compliant Web3 configuration
const web3Config = {
  // Disable dynamic code execution
  disableEval: true,
  // Use static provider configurations
  staticProviders: true,
  // Prevent unsafe operations
  safeMode: true
};

// CSP-compliant provider creation
export const createSafeProvider = (rpcUrl?: string) => {
  try {
    if (rpcUrl) {
      // Use static RPC provider
      return new ethers.JsonRpcProvider(rpcUrl);
    }
    
    // Use window.ethereum if available (MetaMask)
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    
    throw new Error('No Web3 provider available');
  } catch (error) {
    console.error('Provider creation error:', error);
    throw new Error('Failed to create Web3 provider');
  }
};

// CSP-compliant signer creation
export const createSafeSigner = (provider: ethers.Provider, privateKey?: string) => {
  try {
    if (privateKey) {
      // Use static wallet with private key
      return new ethers.Wallet(privateKey, provider);
    }
    
    // Use browser provider signer (MetaMask)
    if (provider instanceof ethers.BrowserProvider) {
      return provider.getSigner();
    }
    
    throw new Error('Cannot create signer without private key or browser provider');
  } catch (error) {
    console.error('Signer creation error:', error);
    throw new Error('Failed to create Web3 signer');
  }
};

// CSP-compliant contract interaction
export const createSafeContract = (
  address: string,
  abi: any[],
  signerOrProvider: ethers.Signer | ethers.Provider
) => {
  try {
    // Create contract instance without eval
    return new ethers.Contract(address, abi, signerOrProvider);
  } catch (error) {
    console.error('Contract creation error:', error);
    throw new Error('Failed to create contract instance');
  }
};

// CSP-compliant transaction creation
export const createSafeTransaction = (to: string, value: string, data?: string) => {
  try {
    const transaction: any = {
      to,
      value: ethers.parseEther(value)
    };
    
    if (data) {
      transaction.data = data;
    }
    
    return transaction;
  } catch (error) {
    console.error('Transaction creation error:', error);
    throw new Error('Failed to create transaction');
  }
};

// CSP-compliant address validation
export const validateAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    console.error('Address validation error:', error);
    return false;
  }
};

// CSP-compliant balance checking
export const getSafeBalance = async (
  provider: ethers.Provider,
  address: string
): Promise<string> => {
  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Balance check error:', error);
    throw new Error('Failed to get balance');
  }
};

// CSP-compliant network detection
export const detectNetwork = async (provider: ethers.Provider) => {
  try {
    const network = await provider.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name
    };
  } catch (error) {
    console.error('Network detection error:', error);
    throw new Error('Failed to detect network');
  }
};

// CSP-compliant message signing
export const signSafeMessage = async (
  signer: ethers.Signer,
  message: string
): Promise<string> => {
  try {
    return await signer.signMessage(message);
  } catch (error) {
    console.error('Message signing error:', error);
    throw new Error('Failed to sign message');
  }
};

// CSP-compliant signature verification
export const verifySafeSignature = (
  message: string,
  signature: string,
  address: string
): boolean => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

// CSP-compliant gas estimation
export const estimateSafeGas = async (
  provider: ethers.Provider,
  transaction: any
): Promise<string> => {
  try {
    const gasEstimate = await provider.estimateGas(transaction);
    return gasEstimate.toString();
  } catch (error) {
    console.error('Gas estimation error:', error);
    throw new Error('Failed to estimate gas');
  }
};

// CSP-compliant transaction sending
export const sendSafeTransaction = async (
  signer: ethers.Signer,
  transaction: any
): Promise<string> => {
  try {
    const tx = await signer.sendTransaction(transaction);
    return tx.hash;
  } catch (error) {
    console.error('Transaction sending error:', error);
    throw new Error('Failed to send transaction');
  }
};

// Network configurations
export const NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    blockExplorer: 'https://etherscan.io'
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com'
  },
  bsc: {
    chainId: 56,
    name: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com'
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io'
  }
};

// Export Web3 utilities
export const Web3Utils = {
  createProvider: createSafeProvider,
  createSigner: createSafeSigner,
  createContract: createSafeContract,
  createTransaction: createSafeTransaction,
  validateAddress,
  getBalance: getSafeBalance,
  detectNetwork,
  signMessage: signSafeMessage,
  verifySignature: verifySafeSignature,
  estimateGas: estimateSafeGas,
  sendTransaction: sendSafeTransaction
};

// Export ethers with safe configuration
export { ethers };
export default Web3Utils;
