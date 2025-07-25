import { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Activity, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  Play, 
  Pause, 
  Trash2,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useStacksWallet } from '../hooks/useStacksWallet';

interface PriceEntry {
  id: number;
  price: number;
  timestamp: number;
}

interface PriceAlert {
  id: string;
  userId: string;
  targetPrice: number;
  isActive: boolean;
  createdAt: number;
}


export const PriceAlerts = () => {
  const { user, isConnected } = useStacksWallet();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlertPrice, setNewAlertPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState(95420);
  const [priceHistory, setPriceHistory] = useState<PriceEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

  useEffect(() => {
    if (isConnected && user) {
      setAlerts([
        {
          id: '1',
          userId: user.stxAddress,
          targetPrice: 100000,
          isActive: true,
          createdAt: Date.now() - 86400000,
        },
        {
          id: '2',
          userId: user.stxAddress,
          targetPrice: 90000,
          isActive: true,
          createdAt: Date.now() - 172800000,
        },
      ]);

      setPriceHistory([
        { id: 1, price: 94200, timestamp: Date.now() - 3600000 },
        { id: 2, price: 95100, timestamp: Date.now() - 7200000 },
        { id: 3, price: 95420, timestamp: Date.now() - 1800000 },
      ]);
    }
  }, [isConnected, user]);

  const fetchCurrentPrice = async () => {
    setIsLoadingPrice(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPrice = 95420 + (Math.random() - 0.5) * 2000;
      setCurrentPrice(Math.round(mockPrice));
    } catch (error) {
      console.error('Failed to fetch price:', error);
    } finally {
      setIsLoadingPrice(false);
    }
  };

  const createAlert = async () => {
    if (!newAlertPrice || !user) return;
    
    setIsCreating(true);
    try {
      const newAlert: PriceAlert = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.stxAddress,
        targetPrice: parseFloat(newAlertPrice),
        isActive: true,
        createdAt: Date.now(),
      };
      
      setAlerts(prev => [...prev, newAlert]);
      setNewAlertPrice('');
    } catch (error) {
      console.error('Failed to create alert:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, isActive: !alert.isActive }
          : alert
      )
    );
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen relative z-10 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Please connect your Stacks wallet to access the price monitoring dashboard and manage your alerts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Price Dashboard</h1>
          <p className="text-slate-400">Monitor sBTC prices and manage your alerts</p>
        </div>

        {/* Current Price Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Current sBTC Price</h3>
                <p className="text-slate-400">Live from contract data</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">
                ${currentPrice.toLocaleString()}
              </div>
              <div className="flex items-center justify-end space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">+2.4% (24h)</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
            <button
              onClick={fetchCurrentPrice}
              disabled={isLoadingPrice}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
            >
              <Activity className={`w-4 h-4 ${isLoadingPrice ? 'animate-spin' : ''}`} />
              <span>{isLoadingPrice ? 'Updating...' : 'Refresh Price'}</span>
            </button>
            <div className="text-sm text-slate-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Create Alert Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Create New Alert</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Price (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={newAlertPrice}
                    onChange={(e) => setNewAlertPrice(e.target.value)}
                    placeholder="100000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Current price: ${currentPrice.toLocaleString()}
                </p>
              </div>
              
              <button
                onClick={createAlert}
                disabled={!newAlertPrice || isCreating}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
              >
                {isCreating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Creating Alert...</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Create Alert</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Price History Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Recent Price Updates</h3>
            </div>
            
            <div className="space-y-3">
              {priceHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">${entry.price.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">
                    Entry #{entry.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Your Alerts ({alerts.length})</h3>
            </div>
          </div>
          
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">No price alerts set up yet</p>
              <p className="text-sm text-slate-500">Create your first alert to get started with monitoring</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        alert.isActive ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
                      }`}></div>
                      <div>
                        <div className="text-white font-semibold text-lg">
                          ${alert.targetPrice.toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>Created {new Date(alert.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className={
                            alert.targetPrice > currentPrice ? 'text-blue-400' : 'text-yellow-400'
                          }>
                            {alert.targetPrice > currentPrice ? 'Target above' : 'Target below'} current price
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          alert.isActive 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                        }`}
                      >
                        {alert.isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{alert.isActive ? 'Active' : 'Paused'}</span>
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5">
              <AlertCircle className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-blue-300 font-semibold mb-2">How sBTC Pulse Works</h4>
              <ul className="text-blue-200 text-sm space-y-1 leading-relaxed">
                <li>• Price data is stored on-chain via Stacks smart contracts for transparency</li>
                <li>• Alerts monitor contract state changes to detect price movements</li>
                <li>• All operations are decentralized and verifiable on the blockchain</li>
                <li>• Contract functions ensure data integrity and immutable price history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};