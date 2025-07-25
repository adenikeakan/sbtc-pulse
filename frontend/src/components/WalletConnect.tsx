import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useStacksWallet } from '../hooks/useStacksWallet';

export const WalletConnect = () => {
  const { user, isLoading, connectWallet, disconnectWallet, isConnected } = useStacksWallet();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
        <span className="text-sm text-slate-300">Connecting...</span>
      </div>
    );
  }

  if (isConnected && user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-3 bg-slate-800 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-sm">
            <div className="font-medium text-white">Connected</div>
            <div className="text-slate-400 text-xs font-mono">
              {user.stxAddress.slice(0, 6)}...{user.stxAddress.slice(-4)}
            </div>
          </div>
        </div>
        <button
          onClick={disconnectWallet}
          className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
    >
      <Wallet className="w-4 h-4" />
      <span>Connect Wallet</span>
    </button>
  );
};