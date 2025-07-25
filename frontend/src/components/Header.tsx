import { Link } from 'react-router-dom';
import { Bitcoin } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

export const Header = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm bg-slate-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bitcoin className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">sBTC</span>
              <span className="text-sm text-orange-400 -mt-1">Pulse</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-slate-300 hover:text-white transition-colors relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/alerts" 
              className="text-slate-300 hover:text-white transition-colors relative group"
            >
              Price Alerts
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
          
          <WalletConnect />
        </div>
      </div>
    </header>
  );
};