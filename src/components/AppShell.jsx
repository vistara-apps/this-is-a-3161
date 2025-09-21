import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TrendingUp, Shield, Bell, DollarSign } from 'lucide-react';

const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-surface/50 bg-surface/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">StableYield Hub</h1>
                <p className="text-sm text-text-secondary">Your All-in-One Stablecoin Savings Dashboard</p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-surface/50 bg-surface/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-8 py-3">
            <NavItem icon={DollarSign} label="Dashboard" active />
            <NavItem icon={TrendingUp} label="Yield Alerts" />
            <NavItem icon={Shield} label="Protocol Health" />
            <NavItem icon={Bell} label="Notifications" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false }) => {
  return (
    <button className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active 
        ? 'bg-accent/20 text-accent border border-accent/30' 
        : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
    }`}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

export default AppShell;