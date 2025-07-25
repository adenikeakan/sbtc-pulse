import { useState } from 'react';
import { request } from '@stacks/connect';
import { User } from '../types';

export const useStacksWallet = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const response = await request('getAddresses');

      if (response && 'addresses' in response && response.addresses.length > 0) {
        // Find the Stacks address (starts with SP or ST)
        const stacksAddress = response.addresses.find(addr => 
          addr.address.startsWith('SP') || addr.address.startsWith('ST')
        );
        
        if (stacksAddress) {
          setUser({
            stxAddress: stacksAddress.address,
            btcAddress: stacksAddress.address, // Simplified for this demo
          });
        }
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setUser(null);
  };

  return {
    user,
    isLoading,
    connectWallet,
    disconnectWallet,
    isConnected: !!user,
  };
};