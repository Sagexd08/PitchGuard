import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

let web3: Web3 | null = null;

// Initialize Web3 connection
export const initWeb3 = (): Web3 | null => {
  if (typeof window !== 'undefined' && window.ethereum) {
    web3 = new Web3(window.ethereum);
    return web3;
  }
  return null;
};

// Connect to Metamask wallet
export const connectWallet = async (): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('Metamask not detected. Please install Metamask to continue.');
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (!web3) {
      web3 = initWeb3();
    }

    if (!web3) {
      throw new Error('Failed to initialize Web3');
    }

    const accounts = await web3.eth.getAccounts();
    
    if (accounts.length === 0) {
      throw new Error('No accounts found. Please connect your Metamask wallet.');
    }

    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Please connect your Metamask wallet to continue.');
    }
    throw new Error(error.message || 'Failed to connect wallet');
  }
};

// Get current account
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!web3) {
    web3 = initWeb3();
  }

  if (!web3) return null;

  try {
    const accounts = await web3.eth.getAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

// Make payment transaction
export const makePayment = async (amountInEth: string): Promise<string> => {
  if (!web3) {
    throw new Error('Web3 not initialized');
  }

  const accounts = await web3.eth.getAccounts();
  if (accounts.length === 0) {
    throw new Error('No connected accounts');
  }

  try {
    // Convert ETH to Wei
    const amountInWei = web3.utils.toWei(amountInEth, 'ether');
    
    // Simulate contract address (replace with actual contract)
    const contractAddress = '0x742d35Cc6544C0532a7ecbE0D4f5dF5e9dE1a30b';

    const transaction = await web3.eth.sendTransaction({
      from: accounts[0],
      to: contractAddress,
      value: amountInWei,
      gas: '21000', // Standard gas limit for ETH transfer
    });

    return transaction.transactionHash;
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Transaction cancelled by user');
    }
    throw new Error(error.message || 'Payment failed');
  }
};

// Get account balance
export const getBalance = async (address: string): Promise<string> => {
  if (!web3) {
    throw new Error('Web3 not initialized');
  }

  try {
    const balanceWei = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balanceWei, 'ether');
  } catch (error) {
    throw new Error('Failed to get balance');
  }
};

// Listen for account changes
export const onAccountsChanged = (callback: (accounts: string[]) => void) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback);
  }
};

// Listen for network changes
export const onChainChanged = (callback: (chainId: string) => void) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback);
  }
};

// Check if Metamask is installed
export const isMetamaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!window.ethereum;
};