import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Bell, Shield, LineChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStacksWallet } from '../hooks/useStacksWallet';

export const Home = () => {
  const { isConnected } = useStacksWallet();
  const [currentPrice, setCurrentPrice] = useState(95420);
  const [priceChange, setPriceChange] = useState(2.5);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 1000;
      setCurrentPrice(prev => Math.max(90000, prev + change));
      setPriceChange((Math.random() - 0.5) * 10);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-400 text-sm font-medium">Live on Stacks Testnet</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">sBTC</span>
            <span className="text-white"> Pulse</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Track Bitcoin prices on the Stacks blockchain and monitor price movements with 
            <span className="text-orange-400 font-semibold"> smart contract-powered data</span>
          </p>

          {/* Current Price Display */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-12 max-w-md mx-auto">
            <div className="text-sm text-slate-400 mb-2">Current sBTC Price</div>
            <div className="text-3xl font-bold text-white mb-2">
              ${currentPrice.toLocaleString()}
            </div>
            <div className={`flex items-center justify-center space-x-1 text-sm ${
              priceChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {priceChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{Math.abs(priceChange).toFixed(2)}%</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <Link
                to="/alerts"
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-lg"
              >
                <LineChart className="w-5 h-5" />
                <span>View Dashboard</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-2 px-8 py-4 bg-slate-600 text-slate-300 font-semibold rounded-lg text-lg cursor-not-allowed">
                <LineChart className="w-5 h-5" />
                <span>Connect Wallet to Continue</span>
              </div>
            )}
            <a
              href="https://docs.stacks.co/stacks-101/bitcoin-connection"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-8 py-4 border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-200 font-semibold rounded-lg text-lg"
            >
              <Shield className="w-5 h-5" />
              <span>Learn About sBTC</span>
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-orange-500/50 p-8 rounded-2xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Real-time Tracking</h3>
            <p className="text-slate-400 leading-relaxed">
              Monitor Bitcoin prices with data stored and verified on the Stacks blockchain for transparency and immutability.
            </p>
          </div>

          <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-orange-500/50 p-8 rounded-2xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Smart Monitoring</h3>
            <p className="text-slate-400 leading-relaxed">
              Set up intelligent price monitoring that leverages smart contracts for automated tracking and notifications.
            </p>
          </div>

          <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-orange-500/50 p-8 rounded-2xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Decentralized</h3>
            <p className="text-slate-400 leading-relaxed">
              Built on Stacks with Bitcoin's security, ensuring no central authority or single point of failure.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Get started with sBTC Pulse in just a few simple steps
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Connect Wallet', desc: 'Connect your Stacks wallet to get started', color: 'from-purple-500 to-purple-600' },
              { step: '2', title: 'View Prices', desc: 'Access real-time sBTC price data', color: 'from-orange-500 to-orange-600' },
              { step: '3', title: 'Monitor Trends', desc: 'Track price movements and history', color: 'from-green-500 to-green-600' },
              { step: '4', title: 'Stay Informed', desc: 'Make informed decisions with data', color: 'from-blue-500 to-blue-600' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl group-hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};