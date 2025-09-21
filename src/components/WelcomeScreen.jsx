import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TrendingUp, Shield, Bell, DollarSign, Zap, BarChart3 } from 'lucide-react';

const WelcomeScreen = () => {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
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

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Maximize Your Stablecoin Yields
            </h2>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Track deposits, optimize yields, and monitor protocol health across Aave, Compound, and Maker in one unified dashboard.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={BarChart3}
              title="Unified Dashboard"
              description="All your stablecoin deposits and earnings in one place"
            />
            <FeatureCard
              icon={Zap}
              title="Yield Optimization"
              description="Real-time alerts when better yields become available"
            />
            <FeatureCard
              icon={Shield}
              title="Protocol Health"
              description="Risk scores and health metrics for informed decisions"
            />
          </div>

          <div className="bg-surface/50 border border-surface rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-text-primary mb-4">
              Get Started Today
            </h3>
            <p className="text-text-secondary mb-6">
              Connect your wallet to access your personalized stablecoin dashboard
            </p>
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-surface/30 border border-surface rounded-xl p-6">
      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
};

export default WelcomeScreen;